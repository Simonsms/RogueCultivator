import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { tagApi, type Tag, type CreateTagDto } from '@/api/tag'

export const useTagStore = defineStore('tag', () => {
  // 状态
  const tags = ref<Tag[]>([])
  const currentTagId = ref<string | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  // 计算属性
  const currentTag = computed(() => {
    if (!currentTagId.value) return null
    return tags.value.find(t => t.id === currentTagId.value) || null
  })

  const tagCount = computed(() => tags.value.length)

  // 获取标签列表
  async function fetchTags() {
    loading.value = true
    error.value = null
    try {
      const data = await tagApi.getTags()
      tags.value = data
    } catch (e: any) {
      error.value = e.message || '获取标签失败'
      console.error('获取标签失败:', e)
    } finally {
      loading.value = false
    }
  }

  // 创建标签
  async function createTag(dto: CreateTagDto) {
    loading.value = true
    error.value = null
    try {
      const tag = await tagApi.createTag(dto)
      tags.value.push(tag)
      return tag
    } catch (e: any) {
      error.value = e.message || '创建标签失败'
      console.error('创建标签失败:', e)
      return null
    } finally {
      loading.value = false
    }
  }

  // 删除标签
  async function deleteTag(id: string) {
    error.value = null
    try {
      await tagApi.deleteTag(id)
      tags.value = tags.value.filter(t => t.id !== id)
      if (currentTagId.value === id) {
        currentTagId.value = null
      }
      return true
    } catch (e: any) {
      error.value = e.message || '删除标签失败'
      console.error('删除标签失败:', e)
      return false
    }
  }

  // 选择标签
  function selectTag(id: string | null) {
    currentTagId.value = id
  }

  // 根据名称查找标签
  function findTagByName(name: string) {
    return tags.value.find(t => t.name === name)
  }

  return {
    // 状态
    tags,
    currentTagId,
    loading,
    error,
    // 计算属性
    currentTag,
    tagCount,
    // 方法
    fetchTags,
    createTag,
    deleteTag,
    selectTag,
    findTagByName
  }
})
