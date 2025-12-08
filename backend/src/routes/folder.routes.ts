import { Router } from 'express'
import * as folderController from '../controllers/folder.controller'

const router = Router()

// GET /api/folders - 获取文件夹列表
router.get('/', folderController.getFolders)

// POST /api/folders - 创建文件夹
router.post('/', folderController.createFolder)

// PUT /api/folders/:id - 更新文件夹
router.put('/:id', folderController.updateFolder)

// DELETE /api/folders/:id - 删除文件夹
router.delete('/:id', folderController.deleteFolder)

// PUT /api/folders/:id/move - 移动文件夹
router.put('/:id/move', folderController.moveFolder)

export default router
