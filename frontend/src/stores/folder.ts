import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { folderApi, type Folder, type CreateFolderDto, type UpdateFolderDto } from '@/api/folder'

export const useFolderStore = defineStore('folder', () => {
  // 状态
  const folders = ref<Folder[]>([])
  const currentFolderId = ref<string | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)
  const expandedIds = ref<Set<string>>(new Set())

  // 计算属性 - 构建树形结构
  const folderTree = computed(() => {
    const buildTree = (parentId: string | null): Folder[] => {
      return folders.value
        .filter(f => f.parentId === parentId)
        .sort((a, b) => a.sortOrder - b.sortOrder)
        .map(folder => ({
          ...folder,
          children: buildTree(folder.id)
        }))
    }
    return buildTree(null)
  })

  const currentFolder = computed(() => {
    if (!currentFolderId.value) return null
    return folders.value.find(f => f.id === currentFolderId.value) || null
  })

  // 获取文件夹列表
  async function fetchFolders() {
    loading.value = true
    error.value = null
    try {
      const data = await folderApi.getFolders()
      folders.value = data
    } catch (e: any) {
      error.value = e.message || '获取文件夹失败'
      console.error('获取文件夹失败:', e)
    } finally {
      loading.value = false
    }
  }

  // 创建文件夹
  async function createFolder(dto: CreateFolderDto) {
    loading.value = true
    error.value = null
    try {
      const folder = await folderApi.createFolder(dto)
      folders.value.push(folder)
      return folder
    } catch (e: any) {
      error.value = e.message || '创建文件夹失败'
      console.error('创建文件夹失败:', e)
      return null
    } finally {
      loading.value = false
    }
  }

  // 更新文件夹
  async function updateFolder(id: string, dto: UpdateFolderDto) {
    error.value = null
    try {
      const folder = await folderApi.updateFolder(id, dto)
      const index = folders.value.findIndex(f => f.id === id)
      if (index >= 0) {
        folders.value[index] = folder
      }
      return folder
    } catch (e: any) {
      error.value = e.message || '更新文件夹失败'
      console.error('更新文件夹失败:', e)
      return null
    }
  }

  // 删除文件夹
  async function deleteFolder(id: string) {
    error.value = null
    try {
      await folderApi.deleteFolder(id)
      folders.value = folders.value.filter(f => f.id !== id && f.parentId !== id)
      if (currentFolderId.value === id) {
        currentFolderId.value = null
      }
      return true
    } catch (e: any) {
      error.value = e.message || '删除文件夹失败'
      console.error('删除文件夹失败:', e)
      return false
    }
  }

  // 选择文件夹
  function selectFolder(id: string | null) {
    currentFolderId.value = id
  }

  // 切换展开/折叠
  function toggleExpand(id: string) {
    if (expandedIds.value.has(id)) {
      expandedIds.value.delete(id)
    } else {
      expandedIds.value.add(id)
    }
  }

  // 检查是否展开
  function isExpanded(id: string) {
    return expandedIds.value.has(id)
  }

  return {
    // 状态
    folders,
    currentFolderId,
    loading,
    error,
    expandedIds,
    // 计算属性
    folderTree,
    currentFolder,
    // 方法
    fetchFolders,
    createFolder,
    updateFolder,
    deleteFolder,
    selectFolder,
    toggleExpand,
    isExpanded
  }
})
