<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useTagStore } from "@/stores/tag";
import { useNoteStore } from "@/stores/note";
import { ElMessage, ElMessageBox, ElColorPicker } from "element-plus";

const tagStore = useTagStore();
const noteStore = useNoteStore();

// 创建标签弹窗
const showCreateDialog = ref(false);
const newTagName = ref("");
const newTagColor = ref("#409eff");

// 预设颜色
const presetColors = [
  "#409eff", // 蓝色
  "#67c23a", // 绿色
  "#e6a23c", // 橙色
  "#f56c6c", // 红色
  "#909399", // 灰色
  "#9c27b0", // 紫色
  "#00bcd4", // 青色
  "#795548", // 棕色
];

onMounted(() => {
  tagStore.fetchTags();
});

// 选择标签
const handleSelectTag = (tagId: string) => {
  if (tagStore.currentTagId === tagId) {
    // 再次点击取消选择
    tagStore.selectTag(null);
    noteStore.fetchNotes();
  } else {
    tagStore.selectTag(tagId);
    noteStore.fetchNotes({ tagId });
  }
};

// 打开创建标签弹窗
const openCreateDialog = () => {
  newTagName.value = "";
  newTagColor.value = "#409eff";
  showCreateDialog.value = true;
};

// 创建新标签
const handleCreateTag = async () => {
  if (!newTagName.value.trim()) {
    ElMessage.warning("请输入标签名称");
    return;
  }

  const result = await tagStore.createTag({
    name: newTagName.value.trim(),
    color: newTagColor.value,
  });

  if (result) {
    ElMessage.success("标签创建成功");
    showCreateDialog.value = false;
  }
};

// 删除标签
const handleDeleteTag = async (tagId: string, tagName: string, e: Event) => {
  e.stopPropagation();

  try {
    await ElMessageBox.confirm(
      `确定要删除标签「${tagName}」吗？相关笔记的标签关联将被移除。`,
      "删除确认",
      {
        confirmButtonText: "删除",
        cancelButtonText: "取消",
        type: "warning",
      }
    );

    const result = await tagStore.deleteTag(tagId);
    if (result) {
      ElMessage.success("标签已删除");
    }
  } catch {
    // 用户取消
  }
};

// 获取标签颜色
const getTagColor = (color: string | null) => {
  return color || "#909399";
};
</script>

<template>
  <div class="tag-list">
    <!-- 标签列表 -->
    <div class="tags">
      <div
        v-for="tag in tagStore.tags"
        :key="tag.id"
        class="tag-item"
        :class="{ active: tagStore.currentTagId === tag.id }"
        @click="handleSelectTag(tag.id)"
      >
        <span
          class="tag-color"
          :style="{ backgroundColor: getTagColor(tag.color) }"
        ></span>
        <span class="tag-name"># {{ tag.name }}</span>
        <span class="tag-count" v-if="tag._count">
          {{ (tag._count.notes || 0) + (tag._count.links || 0) }}
        </span>
        <el-button
          class="delete-btn"
          link
          size="small"
          @click="handleDeleteTag(tag.id, tag.name, $event)"
        >
          <el-icon><Close /></el-icon>
        </el-button>
      </div>
    </div>

    <!-- 空状态 -->
    <div v-if="tagStore.tags.length === 0" class="empty-state">
      <el-icon><PriceTag /></el-icon>
      <p>暂无标签</p>
    </div>

    <!-- 新建标签按钮 -->
    <div class="add-tag" @click="openCreateDialog">
      <el-icon><Plus /></el-icon>
      <span>新建标签</span>
    </div>

    <!-- 创建标签弹窗 -->
    <el-dialog v-model="showCreateDialog" title="新建标签" width="360px">
      <el-form @submit.prevent="handleCreateTag">
        <el-form-item label="标签名称">
          <el-input
            v-model="newTagName"
            placeholder="请输入标签名称"
            maxlength="20"
            show-word-limit
          />
        </el-form-item>
        <el-form-item label="标签颜色">
          <div class="color-picker-wrapper">
            <div class="preset-colors">
              <span
                v-for="color in presetColors"
                :key="color"
                class="preset-color"
                :style="{ backgroundColor: color }"
                :class="{ selected: newTagColor === color }"
                @click="newTagColor = color"
              ></span>
            </div>
            <el-color-picker v-model="newTagColor" size="small" />
          </div>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="showCreateDialog = false">取消</el-button>
        <el-button type="primary" @click="handleCreateTag">创建</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<style scoped>
.tag-list {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.tags {
  flex: 1;
  overflow-y: auto;
}

.tag-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  cursor: pointer;
  border-radius: 6px;
  color: var(--text-color);
  transition: all 0.2s;
}

.tag-item:hover {
  background-color: var(--hover-bg);
}

.tag-item:hover .delete-btn {
  opacity: 1;
}

.tag-item.active {
  background-color: var(--active-bg);
  color: var(--primary-color);
}

.tag-color {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  flex-shrink: 0;
}

.tag-name {
  flex: 1;
  font-size: 14px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.tag-count {
  font-size: 12px;
  color: var(--text-secondary);
}

.delete-btn {
  opacity: 0;
  transition: opacity 0.2s;
  color: var(--text-secondary);
}

.delete-btn:hover {
  color: var(--danger-color, #f56c6c);
}

.empty-state {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: var(--text-secondary);
}

.empty-state .el-icon {
  font-size: 32px;
  margin-bottom: 8px;
}

.add-tag {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  margin-top: 8px;
  cursor: pointer;
  border-radius: 6px;
  color: var(--text-secondary);
  transition: all 0.2s;
}

.add-tag:hover {
  background-color: var(--hover-bg);
  color: var(--text-color);
}

/* 颜色选择器 */
.color-picker-wrapper {
  display: flex;
  align-items: center;
  gap: 12px;
}

.preset-colors {
  display: flex;
  gap: 8px;
}

.preset-color {
  width: 24px;
  height: 24px;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s;
  border: 2px solid transparent;
}

.preset-color:hover {
  transform: scale(1.1);
}

.preset-color.selected {
  border-color: var(--primary-color);
  box-shadow: 0 0 0 2px var(--primary-color-light, rgba(64, 158, 255, 0.2));
}
</style>
