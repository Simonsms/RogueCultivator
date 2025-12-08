import { Request, Response, NextFunction } from 'express'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// 获取笔记列表
export const getNotes = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { folderId, tagId, search } = req.query

    const where: any = {}

    if (folderId) {
      where.folderId = folderId as string
    }

    if (tagId) {
      where.tags = {
        some: { id: tagId as string }
      }
    }

    if (search) {
      where.OR = [
        { title: { contains: search as string } },
        { content: { contains: search as string } }
      ]
    }

    const notes = await prisma.note.findMany({
      where,
      include: {
        folder: {
          select: { id: true, name: true }
        },
        tags: {
          select: { id: true, name: true, color: true }
        }
      },
      orderBy: { updatedAt: 'desc' }
    })

    res.json(notes)
  } catch (error) {
    next(error)
  }
}

// 获取单个笔记
export const getNote = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params

    const note = await prisma.note.findUnique({
      where: { id },
      include: {
        folder: {
          select: { id: true, name: true }
        },
        tags: {
          select: { id: true, name: true, color: true }
        }
      }
    })

    if (!note) {
      return res.status(404).json({ message: '笔记不存在' })
    }

    res.json(note)
  } catch (error) {
    next(error)
  }
}

// 创建笔记
export const createNote = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { title, content, folderId, tagIds } = req.body

    const note = await prisma.note.create({
      data: {
        title: title || '无标题',
        content: content || '',
        folderId: folderId || null,
        tags: tagIds ? {
          connect: tagIds.map((id: string) => ({ id }))
        } : undefined
      },
      include: {
        folder: {
          select: { id: true, name: true }
        },
        tags: {
          select: { id: true, name: true, color: true }
        }
      }
    })

    res.status(201).json(note)
  } catch (error) {
    next(error)
  }
}

// 更新笔记
export const updateNote = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params
    const { title, content, folderId, tagIds, isFavorite } = req.body

    // 检查笔记是否存在
    const existing = await prisma.note.findUnique({ where: { id } })
    if (!existing) {
      return res.status(404).json({ message: '笔记不存在' })
    }

    const updateData: any = {}
    if (title !== undefined) updateData.title = title
    if (content !== undefined) updateData.content = content
    if (folderId !== undefined) updateData.folderId = folderId
    if (isFavorite !== undefined) updateData.isFavorite = isFavorite

    // 更新标签关联
    if (tagIds !== undefined) {
      updateData.tags = {
        set: tagIds.map((tagId: string) => ({ id: tagId }))
      }
    }

    const note = await prisma.note.update({
      where: { id },
      data: updateData,
      include: {
        folder: {
          select: { id: true, name: true }
        },
        tags: {
          select: { id: true, name: true, color: true }
        }
      }
    })

    res.json(note)
  } catch (error) {
    next(error)
  }
}

// 删除笔记
export const deleteNote = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params

    // 检查笔记是否存在
    const existing = await prisma.note.findUnique({ where: { id } })
    if (!existing) {
      return res.status(404).json({ message: '笔记不存在' })
    }

    await prisma.note.delete({ where: { id } })

    res.status(204).send()
  } catch (error) {
    next(error)
  }
}
