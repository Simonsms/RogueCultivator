import request from '@/utils/request'

export interface Tag {
  id: string
  name: string
  color: string | null
  _count?: {
    notes: number
    links: number
  }
  createdAt: string
}

export interface CreateTagDto {
  name: string
  color?: string
}

export const tagApi = {
  // 获取标签列表
  getTags: (): Promise<Tag[]> => {
    return request.get('/tags')
  },

  // 创建标签
  createTag: (data: CreateTagDto): Promise<Tag> => {
    return request.post('/tags', data)
  },

  // 删除标签
  deleteTag: (id: string): Promise<void> => {
    return request.delete(`/tags/${id}`)
  }
}
