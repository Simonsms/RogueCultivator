import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { noteApi, type Note, type CreateNoteDto, type UpdateNoteDto } from '@/api/note'

export const useNoteStore = defineStore('note', () => {
  // 状态
  const notes = ref<Note[]>([])
  const currentNoteId = ref<string | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  // 计算属性
  const currentNote = computed(() => {
    if (!currentNoteId.value) return null
    return notes.value.find(n => n.id === currentNoteId.value) || null
  })

  const noteCount = computed(() => notes.value.length)

  const recentNotes = computed(() => {
    return [...notes.value]
      .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
      .slice(0, 10)
  })

  // 获取笔记列表
  async function fetchNotes(params?: { folderId?: string; tagId?: string; search?: string }) {
    loading.value = true
    error.value = null
    try {
      const data = await noteApi.getNotes(params)
      notes.value = data
    } catch (e: any) {
      error.value = e.message || '获取笔记失败'
      console.error('获取笔记失败:', e)
    } finally {
      loading.value = false
    }
  }

  // 获取单个笔记
  async function fetchNote(id: string) {
    loading.value = true
    error.value = null
    try {
      const note = await noteApi.getNote(id)
      const index = notes.value.findIndex(n => n.id === id)
      if (index >= 0) {
        notes.value[index] = note
      } else {
        notes.value.push(note)
      }
      currentNoteId.value = id
      return note
    } catch (e: any) {
      error.value = e.message || '获取笔记失败'
      console.error('获取笔记失败:', e)
      return null
    } finally {
      loading.value = false
    }
  }

  // 创建笔记
  async function createNote(dto?: CreateNoteDto) {
    loading.value = true
    error.value = null
    try {
      const note = await noteApi.createNote(dto || {
        title: '无标题',
        content: ''
      })
      notes.value.unshift(note)
      currentNoteId.value = note.id
      return note
    } catch (e: any) {
      error.value = e.message || '创建笔记失败'
      console.error('创建笔记失败:', e)
      return null
    } finally {
      loading.value = false
    }
  }

  // 更新笔记
  async function updateNote(id: string, dto: UpdateNoteDto) {
    error.value = null
    try {
      const note = await noteApi.updateNote(id, dto)
      const index = notes.value.findIndex(n => n.id === id)
      if (index >= 0) {
        notes.value[index] = note
      }
      return note
    } catch (e: any) {
      error.value = e.message || '更新笔记失败'
      console.error('更新笔记失败:', e)
      return null
    }
  }

  // 删除笔记
  async function deleteNote(id: string) {
    error.value = null
    try {
      await noteApi.deleteNote(id)
      notes.value = notes.value.filter(n => n.id !== id)
      if (currentNoteId.value === id) {
        currentNoteId.value = null
      }
      return true
    } catch (e: any) {
      error.value = e.message || '删除笔记失败'
      console.error('删除笔记失败:', e)
      return false
    }
  }

  // 选择笔记
  function selectNote(id: string | null) {
    currentNoteId.value = id
  }

  // 收藏/取消收藏
  async function toggleFavorite(id: string) {
    const note = notes.value.find(n => n.id === id)
    if (note) {
      await updateNote(id, { isFavorite: !note.isFavorite })
    }
  }

  return {
    // 状态
    notes,
    currentNoteId,
    loading,
    error,
    // 计算属性
    currentNote,
    noteCount,
    recentNotes,
    // 方法
    fetchNotes,
    fetchNote,
    createNote,
    updateNote,
    deleteNote,
    selectNote,
    toggleFavorite
  }
})
