<script setup lang="ts">
import { computed } from 'vue'
import { useNoteStore } from '@/stores/note'
import type { Note } from '@/api/note'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import 'dayjs/locale/zh-cn'

dayjs.extend(relativeTime)
dayjs.locale('zh-cn')

const props = defineProps<{
  note: Note
}>()

const noteStore = useNoteStore()

// 格式化时间
const formattedTime = computed(() => {
  return dayjs(props.note.updatedAt).fromNow()
})

// 内容摘要
const summary = computed(() => {
  const content = props.note.content || ''
  // 移除 Markdown 标记，取前 100 字符
  const plainText = content
    .replace(/#{1,6}\s/g, '')
    .replace(/\*\*/g, '')
    .replace(/\*/g, '')
    .replace(/`/g, '')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .trim()
  return plainText.length > 100 ? plainText.slice(0, 100) + '...' : plainText
})

// 打开笔记
const handleOpen = () => {
  noteStore.selectNote(props.note.id)
}

// 收藏/取消收藏
const handleToggleFavorite = (e: Event) => {
  e.stopPropagation()
  noteStore.toggleFavorite(props.note.id)
}
</script>

<template>
  <div class="note-card" @click="handleOpen">
    <!-- 标题 -->
    <h3 class="note-title">{{ note.title || '无标题' }}</h3>
    
    <!-- 摘要 -->
    <p class="note-summary" v-if="summary">{{ summary }}</p>
    
    <!-- 标签 -->
    <div class="note-tags" v-if="note.tags.length > 0">
      <span 
        v-for="tag in note.tags.slice(0, 3)" 
        :key="tag.id"
        class="tag"
        :style="{ backgroundColor: tag.color || '#909399' }"
      >
        {{ tag.name }}
      </span>
      <span v-if="note.tags.length > 3" class="tag-more">
        +{{ note.tags.length - 3 }}
      </span>
    </div>
    
    <!-- 底部信息 -->
    <div class="note-footer">
      <span class="note-time">{{ formattedTime }}</span>
      <el-button 
        text 
        size="small"
        :class="{ 'is-favorite': note.isFavorite }"
        @click="handleToggleFavorite"
      >
        <el-icon>
          <StarFilled v-if="note.isFavorite" />
          <Star v-else />
        </el-icon>
      </el-button>
    </div>
  </div>
</template>

<style scoped>
.note-card {
  padding: 16px;
  background-color: var(--card-bg);
  border: 1px solid var(--border-color);
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
}

.note-card:hover {
  border-color: var(--primary-color);
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

.note-title {
  font-size: 16px;
  font-weight: 600;
  color: var(--text-color);
  margin: 0 0 8px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.note-summary {
  font-size: 14px;
  color: var(--text-secondary);
  margin: 0 0 12px;
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.note-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-bottom: 12px;
}

.tag {
  padding: 2px 8px;
  font-size: 12px;
  color: #fff;
  border-radius: 4px;
}

.tag-more {
  padding: 2px 8px;
  font-size: 12px;
  color: var(--text-secondary);
  background-color: var(--border-color);
  border-radius: 4px;
}

.note-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.note-time {
  font-size: 12px;
  color: var(--text-secondary);
}

.is-favorite {
  color: #f59e0b;
}
</style>
