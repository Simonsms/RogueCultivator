import { Router } from 'express'
import * as tagController from '../controllers/tag.controller'

const router = Router()

// GET /api/tags - 获取标签列表
router.get('/', tagController.getTags)

// POST /api/tags - 创建标签
router.post('/', tagController.createTag)

// DELETE /api/tags/:id - 删除标签
router.delete('/:id', tagController.deleteTag)

export default router
