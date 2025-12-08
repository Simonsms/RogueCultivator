import request from '@/utils/request'

export interface Link {
  id: string
  url: string
  title: string | null
  summary: string | null
  favicon: string | null
  folderId: string | null
  folder?: {
    id: string
    name: string
  }
  tags: {
    id: string
    name: string
    color: string | null
  }[]
  isRead: boolean
  createdAt: string
  updatedAt: string
}

export interface CreateLinkDto {
  url: string
  title?: string
  summary?: string
  folderId?: string
  tagIds?: string[]
}

export interface UpdateLinkDto {
  url?: string
  title?: string
  summary?: string
  folderId?: string | null
  tagIds?: string[]
  isRead?: boolean
}

export const linkApi = {
  // 获取链接列表
  getLinks: (params?: { folderId?: string; tagId?: string }): Promise<Link[]> => {
    return request.get('/links', { params })
  },

  // 获取单个链接
  getLink: (id: string): Promise<Link> => {
    return request.get(`/links/${id}`)
  },

  // 创建链接（自动抓取元信息）
  createLink: (data: CreateLinkDto): Promise<Link> => {
    return request.post('/links', data)
  },

  // 更新链接
  updateLink: (id: string, data: UpdateLinkDto): Promise<Link> => {
    return request.put(`/links/${id}`, data)
  },

  // 删除链接
  deleteLink: (id: string): Promise<void> => {
    return request.delete(`/links/${id}`)
  },

  // 抓取链接元信息
  fetchMeta: (url: string): Promise<{ title: string; summary: string; favicon: string }> => {
    return request.post('/links/fetch-meta', { url })
  }
}
