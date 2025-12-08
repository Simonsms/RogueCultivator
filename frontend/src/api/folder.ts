import request from '@/utils/request'

export interface Folder {
  id: string
  name: string
  icon: string | null
  parentId: string | null
  sortOrder: number
  children?: Folder[]
  createdAt: string
  updatedAt: string
}

export interface CreateFolderDto {
  name: string
  icon?: string
  parentId?: string
}

export interface UpdateFolderDto {
  name?: string
  icon?: string
  parentId?: string | null
  sortOrder?: number
}

export const folderApi = {
  // 获取文件夹列表（树形结构）
  getFolders: (): Promise<Folder[]> => {
    return request.get('/folders')
  },

  // 创建文件夹
  createFolder: (data: CreateFolderDto): Promise<Folder> => {
    return request.post('/folders', data)
  },

  // 更新文件夹
  updateFolder: (id: string, data: UpdateFolderDto): Promise<Folder> => {
    return request.put(`/folders/${id}`, data)
  },

  // 删除文件夹
  deleteFolder: (id: string): Promise<void> => {
    return request.delete(`/folders/${id}`)
  },

  // 移动文件夹
  moveFolder: (id: string, parentId: string | null): Promise<Folder> => {
    return request.put(`/folders/${id}/move`, { parentId })
  }
}
