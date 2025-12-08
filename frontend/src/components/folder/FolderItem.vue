<script setup lang="ts">
import { ref, computed, nextTick } from "vue";
import { useFolderStore } from "@/stores/folder";
import { useNoteStore } from "@/stores/note";
import type { Folder } from "@/api/folder";
import { ElMessage, ElMessageBox } from "element-plus";

const props = defineProps<{
  folder: Folder;
  depth: number;
}>();

const folderStore = useFolderStore();
const noteStore = useNoteStore();

const hasChildren = computed(
  () => props.folder.children && props.folder.children.length > 0
);
const isExpanded = computed(() => folderStore.isExpanded(props.folder.id));
const isActive = computed(
  () => folderStore.currentFolderId === props.folder.id
);

// 编辑状态
const isEditing = ref(false);
const editName = ref("");
const inputRef = ref<HTMLInputElement | null>(null);

// 拖拽状态
const isDragging = ref(false);
const isDragOver = ref(false);

// 右键菜单
const contextMenuVisible = ref(false);
const contextMenuStyle = ref({ left: "0px", top: "0px" });

// 切换展开
const handleToggle = (e: Event) => {
  e.stopPropagation();
  folderStore.toggleExpand(props.folder.id);
};

// 选择文件夹
const handleSelect = () => {
  if (isEditing.value) return;
  folderStore.selectFolder(props.folder.id);
  noteStore.fetchNotes({ folderId: props.folder.id });
};

// 开始重命名
const startRename = () => {
  isEditing.value = true;
  editName.value = props.folder.name;
  contextMenuVisible.value = false;
  nextTick(() => {
    inputRef.value?.focus();
    inputRef.value?.select();
  });
};

// 确认重命名
const confirmRename = async () => {
  if (!editName.value.trim()) {
    ElMessage.warning("文件夹名称不能为空");
    editName.value = props.folder.name;
    isEditing.value = false;
    return;
  }

  if (editName.value !== props.folder.name) {
    const result = await folderStore.updateFolder(props.folder.id, {
      name: editName.value,
    });
    if (result) {
      ElMessage.success("重命名成功");
    }
  }
  isEditing.value = false;
};

// 取消重命名
const cancelRename = () => {
  isEditing.value = false;
  editName.value = props.folder.name;
};

// 删除文件夹
const deleteFolder = async () => {
  contextMenuVisible.value = false;
  try {
    await ElMessageBox.confirm(
      `确定要删除文件夹「${props.folder.name}」吗？其中的笔记将移动到根目录。`,
      "删除确认",
      {
        confirmButtonText: "删除",
        cancelButtonText: "取消",
        type: "warning",
      }
    );
    const result = await folderStore.deleteFolder(props.folder.id);
    if (result) {
      ElMessage.success("删除成功");
    }
  } catch {
    // 用户取消
  }
};

// 创建子文件夹
const createSubFolder = async () => {
  contextMenuVisible.value = false;
  try {
    const { value } = await ElMessageBox.prompt(
      "请输入文件夹名称",
      "新建子文件夹",
      {
        confirmButtonText: "创建",
        cancelButtonText: "取消",
        inputPattern: /^.{1,50}$/,
        inputErrorMessage: "名称长度应在1-50个字符之间",
      }
    );

    if (value) {
      const result = await folderStore.createFolder({
        name: value,
        parentId: props.folder.id,
      });
      if (result) {
        folderStore.expandedIds.add(props.folder.id);
        ElMessage.success("创建成功");
      }
    }
  } catch {
    // 用户取消
  }
};

// 右键菜单
const handleContextMenu = (e: MouseEvent) => {
  e.preventDefault();
  e.stopPropagation();
  contextMenuStyle.value = {
    left: `${e.clientX}px`,
    top: `${e.clientY}px`,
  };
  contextMenuVisible.value = true;

  // 点击其他地方关闭菜单
  const closeMenu = () => {
    contextMenuVisible.value = false;
    document.removeEventListener("click", closeMenu);
  };
  setTimeout(() => {
    document.addEventListener("click", closeMenu);
  }, 0);
};

// 拖拽开始
const handleDragStart = (e: DragEvent) => {
  isDragging.value = true;
  e.dataTransfer?.setData("folderId", props.folder.id);
  e.dataTransfer?.setData("folderName", props.folder.name);
};

// 拖拽结束
const handleDragEnd = () => {
  isDragging.value = false;
};

// 拖拽经过
const handleDragOver = (e: DragEvent) => {
  e.preventDefault();
  const folderId = e.dataTransfer?.getData("folderId");
  // 不能拖到自己或子文件夹里
  if (folderId !== props.folder.id) {
    isDragOver.value = true;
  }
};

// 拖拽离开
const handleDragLeave = () => {
  isDragOver.value = false;
};

// 放置
const handleDrop = async (e: DragEvent) => {
  e.preventDefault();
  isDragOver.value = false;

  const folderId = e.dataTransfer?.getData("folderId");
  if (folderId && folderId !== props.folder.id) {
    // 移动文件夹
    const result = await folderStore.updateFolder(folderId, {
      parentId: props.folder.id,
    });
    if (result) {
      folderStore.expandedIds.add(props.folder.id);
      ElMessage.success("移动成功");
      folderStore.fetchFolders();
    }
  }
};
</script>

<template>
  <div class="folder-item-wrapper">
    <div
      class="folder-item"
      :class="{
        active: isActive,
        dragging: isDragging,
        'drag-over': isDragOver,
      }"
      :style="{ paddingLeft: `${12 + depth * 16}px` }"
      draggable="true"
      @click="handleSelect"
      @dblclick="startRename"
      @contextmenu="handleContextMenu"
      @dragstart="handleDragStart"
      @dragend="handleDragEnd"
      @dragover="handleDragOver"
      @dragleave="handleDragLeave"
      @drop="handleDrop"
    >
      <!-- 展开/折叠图标 -->
      <span
        class="toggle-icon"
        :class="{ invisible: !hasChildren }"
        @click="handleToggle"
      >
        <el-icon>
          <ArrowRight v-if="!isExpanded" />
          <ArrowDown v-else />
        </el-icon>
      </span>

      <!-- 文件夹图标 -->
      <el-icon class="folder-icon">
        <FolderOpened v-if="isExpanded" />
        <Folder v-else />
      </el-icon>

      <!-- 文件夹名称 / 编辑输入框 -->
      <input
        v-if="isEditing"
        ref="inputRef"
        v-model="editName"
        class="folder-name-input"
        @blur="confirmRename"
        @keyup.enter="confirmRename"
        @keyup.escape="cancelRename"
        @click.stop
      />
      <span v-else class="folder-name">{{ folder.name }}</span>
    </div>

    <!-- 右键菜单 -->
    <Teleport to="body">
      <div
        v-if="contextMenuVisible"
        class="context-menu"
        :style="contextMenuStyle"
      >
        <div class="context-menu-item" @click="startRename">
          <el-icon><Edit /></el-icon>
          重命名
        </div>
        <div class="context-menu-item" @click="createSubFolder">
          <el-icon><FolderAdd /></el-icon>
          新建子文件夹
        </div>
        <div class="context-menu-divider"></div>
        <div class="context-menu-item danger" @click="deleteFolder">
          <el-icon><Delete /></el-icon>
          删除
        </div>
      </div>
    </Teleport>

    <!-- 子文件夹 -->
    <template v-if="hasChildren && isExpanded">
      <FolderItem
        v-for="child in folder.children"
        :key="child.id"
        :folder="child"
        :depth="depth + 1"
      />
    </template>
  </div>
</template>

<style scoped>
.folder-item {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 6px 12px;
  cursor: pointer;
  border-radius: 6px;
  color: var(--text-color);
  transition: all 0.2s;
}

.folder-item:hover {
  background-color: var(--hover-bg);
}

.folder-item.active {
  background-color: var(--active-bg);
  color: var(--primary-color);
}

.folder-item.dragging {
  opacity: 0.5;
}

.folder-item.drag-over {
  background-color: var(--primary-color);
  color: white;
}

.toggle-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 16px;
  height: 16px;
  font-size: 12px;
  color: var(--text-secondary);
}

.toggle-icon.invisible {
  visibility: hidden;
}

.folder-icon {
  font-size: 16px;
}

.folder-name {
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: 14px;
}

.folder-name-input {
  flex: 1;
  padding: 2px 4px;
  font-size: 14px;
  border: 1px solid var(--primary-color);
  border-radius: 4px;
  outline: none;
  background: var(--input-bg);
  color: var(--text-color);
}
</style>

<!-- 右键菜单全局样式 -->
<style>
.context-menu {
  position: fixed;
  z-index: 9999;
  min-width: 160px;
  padding: 4px 0;
  background: var(--card-bg, #fff);
  border: 1px solid var(--border-color);
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.context-menu-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  font-size: 14px;
  color: var(--text-color);
  cursor: pointer;
  transition: all 0.2s;
}

.context-menu-item:hover {
  background-color: var(--hover-bg);
}

.context-menu-item.danger {
  color: var(--danger-color, #f56c6c);
}

.context-menu-item.danger:hover {
  background-color: rgba(245, 108, 108, 0.1);
}

.context-menu-divider {
  height: 1px;
  margin: 4px 0;
  background-color: var(--border-color);
}
</style>
