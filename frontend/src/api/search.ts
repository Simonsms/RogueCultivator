import request from '@/utils/request'
import type { Note } from './note'
import type { Link } from './link'

export interface SearchResult {
  notes: Note[]
  links: Link[]
  total: number
}

export interface SearchParams {
  q: string
  type?: 'all' | 'notes' | 'links'
  limit?: number
}

export const searchApi = {
  // 全文搜索
  search: (params: SearchParams): Promise<SearchResult> => {
    return request.get('/search', { params })
  }
}
