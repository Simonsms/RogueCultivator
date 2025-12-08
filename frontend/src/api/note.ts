import request from '@/utils/request'

export interface Note {
  id: string
  title: string
  content: string
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
  isFavorite: boolean
  createdAt: string
  updatedAt: string
}

export interface CreateNoteDto {
  title: string
  content?: string
  folderId?: string
  tagIds?: string[]
}

export interface UpdateNoteDto {
  title?: string
  content?: string
  folderId?: string | null
  tagIds?: string[]
  isFavorite?: boolean
}

export interface NoteQueryParams {
  folderId?: string
  tagId?: string
  search?: string
  page?: number
  limit?: number
}

export const noteApi = {
  // 获取笔记列表
  getNotes: (params?: NoteQueryParams): Promise<Note[]> => {
    return request.get('/notes', { params })
  },

  // 获取单个笔记
  getNote: (id: string): Promise<Note> => {
    return request.get(`/notes/${id}`)
  },

  // 创建笔记
  createNote: (data: CreateNoteDto): Promise<Note> => {
    return request.post('/notes', data)
  },

  // 更新笔记
  updateNote: (id: string, data: UpdateNoteDto): Promise<Note> => {
    return request.put(`/notes/${id}`, data)
  },

  // 删除笔记
  deleteNote: (id: string): Promise<void> => {
    return request.delete(`/notes/${id}`)
  }
}
