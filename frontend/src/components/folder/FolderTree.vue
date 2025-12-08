<script setup lang="ts">
import { onMounted } from 'vue'
import { useFolderStore } from '@/stores/folder'
import { useNoteStore } from '@/stores/note'
import FolderItem from './FolderItem.vue'

const folderStore = useFolderStore()
const noteStore = useNoteStore()

onMounted(() => {
  folderStore.fetchFolders()
})

// 创建新文件夹
const handleCreateFolder = async () => {
  const name = prompt('请输入文件夹名称')
  if (name) {
    await folderStore.createFolder({ name })
  }
}

// 选择所有笔记
const handleSelectAll = () => {
  folderStore.selectFolder(null)
  noteStore.fetchNotes()
}
</script>

<template>
  <div class="folder-tree">
    <!-- 全部笔记 -->
    <div 
      class="folder-item all-notes"
      :class="{ active: !folderStore.currentFolderId }"
      @click="handleSelectAll"
    >
      <el-icon><Document /></el-icon>
      <span>全部笔记</span>
      <span class="count">{{ noteStore.noteCount }}</span>
    </div>

    <!-- 文件夹列表 -->
    <div class="folder-list">
      <FolderItem 
        v-for="folder in folderStore.folderTree" 
        :key="folder.id"
        :folder="folder"
        :depth="0"
      />
    </div>

    <!-- 新建文件夹按钮 -->
    <div class="add-folder" @click="handleCreateFolder">
      <el-icon><FolderAdd /></el-icon>
      <span>新建文件夹</span>
    </div>
  </div>
</template>

<style scoped>
.folder-tree {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.folder-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
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

.folder-item .count {
  margin-left: auto;
  font-size: 12px;
  color: var(--text-secondary);
}

.folder-list {
  flex: 1;
  overflow-y: auto;
  margin-top: 8px;
}

.add-folder {
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

.add-folder:hover {
  background-color: var(--hover-bg);
  color: var(--text-color);
}
</style>
