import { Router } from 'express'
import * as linkController from '../controllers/link.controller'

const router = Router()

// GET /api/links - 获取链接列表
router.get('/', linkController.getLinks)

// GET /api/links/:id - 获取单个链接
router.get('/:id', linkController.getLink)

// POST /api/links - 创建链接
router.post('/', linkController.createLink)

// PUT /api/links/:id - 更新链接
router.put('/:id', linkController.updateLink)

// DELETE /api/links/:id - 删除链接
router.delete('/:id', linkController.deleteLink)

// POST /api/links/fetch-meta - 抓取链接元信息
router.post('/fetch-meta', linkController.fetchMeta)

export default router
