<script setup lang="ts">
import { ref, watch, onMounted, onUnmounted } from 'vue'
import { useUIStore } from '@/stores/ui'
import { useNoteStore } from '@/stores/note'
import { searchApi, type SearchResult } from '@/api/search'
import { useDebounceFn } from '@vueuse/core'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import 'dayjs/locale/zh-cn'

dayjs.extend(relativeTime)
dayjs.locale('zh-cn')

const uiStore = useUIStore()
const noteStore = useNoteStore()

const searchQuery = ref('')
const searchResults = ref<SearchResult | null>(null)
const loading = ref(false)
const inputRef = ref<HTMLInputElement | null>(null)

// 防抖搜索
const debouncedSearch = useDebounceFn(async (query: string) => {
  if (!query.trim()) {
    searchResults.value = null
    return
  }
  
  loading.value = true
  try {
    searchResults.value = await searchApi.search({ q: query })
  } catch (e) {
    console.error('搜索失败:', e)
  } finally {
    loading.value = false
  }
}, 300)

// 监听搜索词变化
watch(searchQuery, (newQuery) => {
  debouncedSearch(newQuery)
})

// 监听弹窗状态，自动聚焦
watch(() => uiStore.searchVisible, (visible) => {
  if (visible) {
    setTimeout(() => {
      inputRef.value?.focus()
    }, 100)
  } else {
    searchQuery.value = ''
    searchResults.value = null
  }
})

// 全局快捷键
const handleGlobalKeydown = (e: KeyboardEvent) => {
  if (e.ctrlKey && e.key === 'k') {
    e.preventDefault()
    uiStore.toggleSearch()
  }
  if (e.key === 'Escape' && uiStore.searchVisible) {
    uiStore.closeSearch()
  }
}

onMounted(() => {
  window.addEventListener('keydown', handleGlobalKeydown)
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleGlobalKeydown)
})

// 选择笔记
const handleSelectNote = (noteId: string) => {
  noteStore.selectNote(noteId)
  uiStore.closeSearch()
}

// 格式化时间
const formatTime = (time: string) => {
  return dayjs(time).fromNow()
}
</script>

<template>
  <el-dialog
    v-model="uiStore.searchVisible"
    :show-close="false"
    width="600px"
    class="search-dialog"
    :modal-class="'search-modal'"
  >
    <!-- 搜索输入框 -->
    <div class="search-input-wrapper">
      <el-icon class="search-icon"><Search /></el-icon>
      <input
        ref="inputRef"
        v-model="searchQuery"
        class="search-input"
        placeholder="搜索笔记、链接..."
        @keydown.esc="uiStore.closeSearch"
      />
      <kbd class="search-kbd">ESC</kbd>
    </div>

    <!-- 搜索结果 -->
    <div class="search-results">
      <!-- 加载中 -->
      <div v-if="loading" class="search-loading">
        <el-icon class="is-loading"><Loading /></el-icon>
        搜索中...
      </div>

      <!-- 无搜索词时显示最近笔记 -->
      <template v-else-if="!searchQuery.trim()">
        <div class="result-section">
          <div class="section-title">最近访问</div>
          <div 
            v-for="note in noteStore.recentNotes" 
            :key="note.id"
            class="result-item"
            @click="handleSelectNote(note.id)"
          >
            <el-icon><Document /></el-icon>
            <span class="item-title">{{ note.title || '无标题' }}</span>
            <span class="item-time">{{ formatTime(note.updatedAt) }}</span>
          </div>
          <div v-if="noteStore.recentNotes.length === 0" class="empty-hint">
            暂无最近访问的笔记
          </div>
        </div>
      </template>

      <!-- 搜索结果 -->
      <template v-else-if="searchResults">
        <!-- 笔记结果 -->
        <div v-if="searchResults.notes.length > 0" class="result-section">
          <div class="section-title">笔记 ({{ searchResults.notes.length }})</div>
          <div 
            v-for="note in searchResults.notes" 
            :key="note.id"
            class="result-item"
            @click="handleSelectNote(note.id)"
          >
            <el-icon><Document /></el-icon>
            <span class="item-title">{{ note.title || '无标题' }}</span>
            <span class="item-time">{{ formatTime(note.updatedAt) }}</span>
          </div>
        </div>

        <!-- 链接结果 -->
        <div v-if="searchResults.links.length > 0" class="result-section">
          <div class="section-title">链接 ({{ searchResults.links.length }})</div>
          <div 
            v-for="link in searchResults.links" 
            :key="link.id"
            class="result-item"
          >
            <el-icon><Link /></el-icon>
            <span class="item-title">{{ link.title || link.url }}</span>
            <span class="item-time">{{ formatTime(link.updatedAt) }}</span>
          </div>
        </div>

        <!-- 无结果 -->
        <div 
          v-if="searchResults.notes.length === 0 && searchResults.links.length === 0" 
          class="empty-hint"
        >
          未找到相关内容
        </div>
      </template>
    </div>
  </el-dialog>
</template>

<style scoped>
.search-input-wrapper {
  display: flex;
  align-items: center;
  padding: 12px 16px;
  border-bottom: 1px solid var(--border-color);
}

.search-icon {
  font-size: 18px;
  color: var(--text-secondary);
  margin-right: 12px;
}

.search-input {
  flex: 1;
  border: none;
  outline: none;
  background: transparent;
  font-size: 16px;
  color: var(--text-color);
}

.search-input::placeholder {
  color: var(--text-secondary);
}

.search-kbd {
  padding: 2px 6px;
  background-color: var(--border-color);
  border-radius: 4px;
  font-size: 12px;
  color: var(--text-secondary);
}

.search-results {
  max-height: 400px;
  overflow-y: auto;
}

.search-loading {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 24px;
  color: var(--text-secondary);
}

.result-section {
  padding: 8px;
}

.section-title {
  padding: 8px 12px;
  font-size: 12px;
  font-weight: 600;
  color: var(--text-secondary);
  text-transform: uppercase;
}

.result-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 12px;
  cursor: pointer;
  border-radius: 6px;
  transition: all 0.2s;
}

.result-item:hover {
  background-color: var(--hover-bg);
}

.result-item .el-icon {
  color: var(--text-secondary);
}

.item-title {
  flex: 1;
  color: var(--text-color);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.item-time {
  font-size: 12px;
  color: var(--text-secondary);
}

.empty-hint {
  padding: 24px;
  text-align: center;
  color: var(--text-secondary);
}
</style>

<style>
/* 全局样式覆盖 */
.search-dialog .el-dialog__header {
  display: none;
}

.search-dialog .el-dialog__body {
  padding: 0;
}

.search-modal {
  background-color: rgba(0, 0, 0, 0.5);
}
</style>
