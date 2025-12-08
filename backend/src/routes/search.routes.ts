import { Router } from 'express'
import * as searchController from '../controllers/search.controller'

const router = Router()

// GET /api/search - 全文搜索
router.get('/', searchController.search)

export default router
