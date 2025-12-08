import { Router } from 'express'
import * as noteController from '../controllers/note.controller'

const router = Router()

// GET /api/notes - 获取笔记列表
router.get('/', noteController.getNotes)

// GET /api/notes/:id - 获取单个笔记
router.get('/:id', noteController.getNote)

// POST /api/notes - 创建笔记
router.post('/', noteController.createNote)

// PUT /api/notes/:id - 更新笔记
router.put('/:id', noteController.updateNote)

// DELETE /api/notes/:id - 删除笔记
router.delete('/:id', noteController.deleteNote)

export default router
