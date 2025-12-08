<script setup lang="ts">
import { ref, watch, onMounted, computed, nextTick } from "vue";
import { useNoteStore } from "@/stores/note";
import { useUIStore } from "@/stores/ui";
import { useTagStore } from "@/stores/tag";
import { useFolderStore } from "@/stores/folder";
import type { Note } from "@/api/note";
import { useDebounceFn, useThrottleFn } from "@vueuse/core";
import MilkdownEditor from "@/components/editor/MilkdownEditor.vue";
import MarkdownPreview from "@/components/editor/MarkdownPreview.vue";
import { ElMessage, ElMessageBox } from "element-plus";

const props = defineProps<{
  note: Note;
}>();

const noteStore = useNoteStore();
const uiStore = useUIStore();
const tagStore = useTagStore();
const folderStore = useFolderStore();

// 本地编辑状态
const title = ref(props.note.title);
const content = ref(props.note.content);
const isSaving = ref(false);
const showTagSelect = ref(false);
const showFolderSelect = ref(false);
const selectedTagIds = ref<string[]>(props.note.tags?.map((t) => t.id) || []);
const selectedFolderId = ref<string | null>(props.note.folderId);

// 同步滚动相关
const editorRef = ref<InstanceType<typeof MilkdownEditor> | null>(null);
const previewRef = ref<InstanceType<typeof MarkdownPreview> | null>(null);
const isSyncingScroll = ref(false); // 防止循环触发

// 同步滚动处理（使用节流避免性能问题）
const handleEditorScroll = useThrottleFn((scrollRatio: number) => {
  if (isSyncingScroll.value || uiStore.editorMode !== "split") return;
  isSyncingScroll.value = true;
  previewRef.value?.scrollTo(scrollRatio);
  nextTick(() => {
    isSyncingScroll.value = false;
  });
}, 16);

const handlePreviewScroll = useThrottleFn((scrollRatio: number) => {
  if (isSyncingScroll.value || uiStore.editorMode !== "split") return;
  isSyncingScroll.value = true;
  editorRef.value?.scrollTo(scrollRatio);
  nextTick(() => {
    isSyncingScroll.value = false;
  });
}, 16);

// 上次保存的内容快照，用于判断是否需要保存
const lastSavedTitle = ref(props.note.title);
const lastSavedContent = ref(props.note.content);

// 监听笔记变化
watch(
  () => props.note,
  (newNote) => {
    title.value = newNote.title;
    content.value = newNote.content;
    selectedTagIds.value = newNote.tags?.map((t) => t.id) || [];
    selectedFolderId.value = newNote.folderId;
    // 切换笔记时更新快照
    lastSavedTitle.value = newNote.title;
    lastSavedContent.value = newNote.content;
  },
  { immediate: true }
);

// 执行实际保存
const doSave = async (showMessage = false) => {
  // 如果内容没有变化，跳过保存
  if (
    title.value === lastSavedTitle.value &&
    content.value === lastSavedContent.value
  ) {
    if (showMessage) ElMessage.success("已保存");
    return;
  }

  isSaving.value = true;
  await noteStore.updateNote(props.note.id, {
    title: title.value,
    content: content.value,
  });
  // 更新快照
  lastSavedTitle.value = title.value;
  lastSavedContent.value = content.value;
  isSaving.value = false;
  if (showMessage) ElMessage.success("已保存");
};

// 防抖自动保存
const debouncedSave = useDebounceFn(() => doSave(false), 1000);

// 监听标题变化
watch(title, () => {
  debouncedSave();
});

// 内容变化处理
const handleContentChange = (newContent: string) => {
  content.value = newContent;
  debouncedSave();
};

// 手动保存 - 立即执行，防抖函数会因为快照已更新而跳过
const handleSave = async () => {
  await doSave(true);
};

onMounted(() => {
  // 确保标签列表已加载
  if (tagStore.tags.length === 0) {
    tagStore.fetchTags();
  }
});

// 返回列表
const handleBack = () => {
  noteStore.selectNote(null);
};

// 删除笔记
const handleDelete = async () => {
  try {
    await ElMessageBox.confirm("确定要删除这篇笔记吗？", "删除确认", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning",
    });
    await noteStore.deleteNote(props.note.id);
    ElMessage.success("笔记已删除");
  } catch {
    // 用户取消
  }
};

// 更新标签
const handleTagChange = async () => {
  await noteStore.updateNote(props.note.id, {
    tagIds: selectedTagIds.value,
  });
  showTagSelect.value = false;
  ElMessage.success("标签已更新");
};

// 移动到文件夹
const handleFolderChange = async () => {
  await noteStore.updateNote(props.note.id, {
    folderId: selectedFolderId.value,
  });
  showFolderSelect.value = false;
  ElMessage.success("已移动到新文件夹");
};

// 计算属性：当前笔记的标签
const currentTags = computed(() => {
  return props.note.tags || [];
});

// 计算属性：当前笔记所在文件夹
const currentFolder = computed(() => {
  return props.note.folder;
});
</script>

<template>
  <div class="note-editor">
    <!-- 编辑器头部 -->
    <div class="editor-header">
      <el-button text @click="handleBack">
        <el-icon><ArrowLeft /></el-icon>
        返回
      </el-button>

      <div class="header-right">
        <!-- 标签显示 -->
        <div class="note-tags" v-if="currentTags.length > 0">
          <el-tag
            v-for="tag in currentTags"
            :key="tag.id"
            size="small"
            :color="tag.color || undefined"
            effect="plain"
          >
            {{ tag.name }}
          </el-tag>
        </div>

        <span v-if="isSaving" class="saving-status">
          <el-icon class="is-loading"><Loading /></el-icon>
          保存中...
        </span>
        <span v-else class="saved-status">
          <el-icon><Check /></el-icon>
          已保存
        </span>

        <el-dropdown trigger="click">
          <el-button text>
            <el-icon><MoreFilled /></el-icon>
          </el-button>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item @click="showTagSelect = true">
                <el-icon><PriceTag /></el-icon>
                管理标签
              </el-dropdown-item>
              <el-dropdown-item @click="showFolderSelect = true">
                <el-icon><FolderOpened /></el-icon>
                移动到文件夹
              </el-dropdown-item>
              <el-dropdown-item @click="noteStore.toggleFavorite(note.id)">
                <el-icon><Star /></el-icon>
                {{ note.isFavorite ? "取消收藏" : "添加收藏" }}
              </el-dropdown-item>
              <el-dropdown-item divided @click="handleDelete">
                <el-icon><Delete /></el-icon>
                删除笔记
              </el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
    </div>

    <!-- 标题输入 -->
    <input v-model="title" class="title-input" placeholder="无标题" />

    <!-- 编辑/预览区域 -->
    <div class="editor-content" :class="`mode-${uiStore.editorMode}`">
      <!-- Milkdown 编辑器 -->
      <!-- 使用 note.id 作为 key，确保切换笔记时编辑器完全重新挂载 -->
      <div class="editor-pane">
        <MilkdownEditor
          ref="editorRef"
          :key="`editor-${note.id}`"
          :model-value="content"
          placeholder="开始写作..."
          @update:model-value="handleContentChange"
          @save="handleSave"
          @scroll="handleEditorScroll"
        />
      </div>

      <!-- 预览区 (渲染后的 Markdown) -->
      <div v-if="uiStore.editorMode === 'split'" class="preview-pane">
        <MarkdownPreview
          ref="previewRef"
          :content="content"
          @scroll="handlePreviewScroll"
        />
      </div>
    </div>

    <!-- 标签选择弹窗 -->
    <el-dialog
      v-model="showTagSelect"
      title="管理标签"
      width="400px"
      append-to-body
    >
      <el-select
        v-model="selectedTagIds"
        multiple
        filterable
        allow-create
        placeholder="选择或创建标签"
        style="width: 100%"
      >
        <el-option
          v-for="tag in tagStore.tags"
          :key="tag.id"
          :label="tag.name"
          :value="tag.id"
        >
          <span class="tag-option">
            <span
              class="tag-color"
              :style="{ backgroundColor: tag.color || '#909399' }"
            ></span>
            {{ tag.name }}
          </span>
        </el-option>
      </el-select>
      <template #footer>
        <el-button @click="showTagSelect = false">取消</el-button>
        <el-button type="primary" @click="handleTagChange">确定</el-button>
      </template>
    </el-dialog>

    <!-- 文件夹选择弹窗 -->
    <el-dialog
      v-model="showFolderSelect"
      title="移动到文件夹"
      width="400px"
      append-to-body
    >
      <div class="folder-select-info" v-if="currentFolder">
        当前位置：<el-tag size="small">{{ currentFolder.name }}</el-tag>
      </div>
      <div class="folder-select-info" v-else>
        当前位置：<el-tag size="small" type="info">未分类</el-tag>
      </div>
      <el-select
        v-model="selectedFolderId"
        clearable
        placeholder="选择目标文件夹（留空为未分类）"
        style="width: 100%; margin-top: 12px"
      >
        <el-option
          v-for="folder in folderStore.folders"
          :key="folder.id"
          :label="folder.name"
          :value="folder.id"
        >
          <span class="folder-option">
            <el-icon><Folder /></el-icon>
            {{ folder.name }}
          </span>
        </el-option>
      </el-select>
      <template #footer>
        <el-button @click="showFolderSelect = false">取消</el-button>
        <el-button type="primary" @click="handleFolderChange">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<style scoped>
.note-editor {
  height: 100%;
  display: flex;
  flex-direction: column;
  padding: 16px 24px;
}

.editor-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 12px;
}

.note-tags {
  display: flex;
  gap: 4px;
}

.saving-status,
.saved-status {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  color: var(--text-secondary);
}

.saved-status {
  color: var(--success-color, #67c23a);
}

.title-input {
  width: 100%;
  padding: 0;
  margin-bottom: 24px;
  border: none;
  outline: none;
  background: transparent;
  font-size: 32px;
  font-weight: 700;
  color: var(--text-color);
}

.title-input::placeholder {
  color: var(--text-secondary);
}

.editor-content {
  flex: 1;
  display: flex;
  gap: 16px;
  overflow: hidden;
}

.editor-content.mode-edit .editor-pane {
  flex: 1;
}

.editor-content.mode-split .editor-pane,
.editor-content.mode-split .preview-pane {
  flex: 1;
}

.editor-pane,
.preview-pane {
  height: 100%;
  overflow: hidden;
  border: 1px solid var(--border-color);
  border-radius: 8px;
  background-color: var(--card-bg);
}

.preview-pane {
  overflow-y: auto;
}

/* 标签选择器样式 */
.tag-option {
  display: flex;
  align-items: center;
  gap: 8px;
}

.tag-color {
  width: 12px;
  height: 12px;
  border-radius: 50%;
}

/* 文件夹选择器样式 */
.folder-select-info {
  color: var(--text-secondary);
  font-size: 14px;
}

.folder-option {
  display: flex;
  align-items: center;
  gap: 8px;
}
</style>
