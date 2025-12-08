<script setup lang="ts">
import { onMounted, computed, watch } from "vue";
import { useNoteStore } from "@/stores/note";
import { useFolderStore } from "@/stores/folder";
import { useTagStore } from "@/stores/tag";
import NoteCard from "./NoteCard.vue";

const noteStore = useNoteStore();
const folderStore = useFolderStore();
const tagStore = useTagStore();

// 初始化加载笔记
onMounted(() => {
  noteStore.fetchNotes();
});

// 监听文件夹变化
watch(
  () => folderStore.currentFolderId,
  (folderId) => {
    if (folderId) {
      noteStore.fetchNotes({ folderId });
    } else if (!tagStore.currentTagId) {
      noteStore.fetchNotes();
    }
  }
);

// 监听标签变化
watch(
  () => tagStore.currentTagId,
  (tagId) => {
    if (tagId) {
      noteStore.fetchNotes({ tagId });
    } else if (!folderStore.currentFolderId) {
      noteStore.fetchNotes();
    }
  }
);

// 当前筛选条件标题
const filterTitle = computed(() => {
  if (tagStore.currentTagId && tagStore.currentTag) {
    return `# ${tagStore.currentTag.name}`;
  }
  if (folderStore.currentFolderId && folderStore.currentFolder) {
    return folderStore.currentFolder.name;
  }
  return "全部笔记";
});

// 清除筛选
const clearFilter = () => {
  folderStore.selectFolder(null);
  tagStore.selectTag(null);
  noteStore.fetchNotes();
};

// 是否有筛选条件
const hasFilter = computed(() => {
  return !!folderStore.currentFolderId || !!tagStore.currentTagId;
});

// 创建新笔记
const handleCreateNote = async () => {
  const note = await noteStore.createNote({
    title: "无标题",
    content: "",
    folderId: folderStore.currentFolderId || undefined,
    tagIds: tagStore.currentTagId ? [tagStore.currentTagId] : undefined,
  });
  if (note) {
    noteStore.selectNote(note.id);
  }
};
</script>

<template>
  <div class="note-list">
    <!-- 标题栏 -->
    <div class="list-header">
      <div class="header-left">
        <h2 class="list-title">{{ filterTitle }}</h2>
        <span class="list-count">{{ noteStore.notes.length }} 篇笔记</span>
        <el-button v-if="hasFilter" text size="small" @click="clearFilter">
          <el-icon><Close /></el-icon>
          清除筛选
        </el-button>
      </div>
      <el-button type="primary" size="small" @click="handleCreateNote">
        <el-icon><Plus /></el-icon>
        新建
      </el-button>
    </div>

    <!-- 加载状态 -->
    <div v-if="noteStore.loading" class="loading-state">
      <el-icon class="is-loading"><Loading /></el-icon>
      <span>加载中...</span>
    </div>

    <!-- 笔记列表 -->
    <div class="notes" v-else-if="noteStore.notes.length > 0">
      <NoteCard v-for="note in noteStore.notes" :key="note.id" :note="note" />
    </div>

    <!-- 空状态 -->
    <div v-else class="empty-state">
      <el-icon class="empty-icon"><Document /></el-icon>
      <h3>暂无笔记</h3>
      <p>点击右上角按钮创建第一篇笔记</p>
      <el-button type="primary" @click="handleCreateNote">
        <el-icon><Plus /></el-icon>
        新建笔记
      </el-button>
    </div>
  </div>
</template>

<style scoped>
.note-list {
  height: 100%;
  display: flex;
  flex-direction: column;
  padding: 24px;
  overflow: hidden;
}

.list-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 24px;
}

.header-left {
  display: flex;
  align-items: baseline;
  gap: 12px;
}

.list-title {
  font-size: 24px;
  font-weight: 600;
  color: var(--text-color);
  margin: 0;
}

.list-count {
  font-size: 14px;
  color: var(--text-secondary);
}

.loading-state {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  color: var(--text-secondary);
}

.notes {
  flex: 1;
  overflow-y: auto;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 16px;
  align-content: start;
}

.empty-state {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: var(--text-secondary);
}

.empty-icon {
  font-size: 64px;
  margin-bottom: 16px;
  opacity: 0.5;
}

.empty-state h3 {
  margin: 0 0 8px;
  color: var(--text-color);
}

.empty-state p {
  margin: 0 0 24px;
}
</style>
