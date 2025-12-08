"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteNote = exports.updateNote = exports.createNote = exports.getNote = exports.getNotes = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
// 获取笔记列表
const getNotes = async (req, res, next) => {
    try {
        const { folderId, tagId, search } = req.query;
        const where = {};
        if (folderId) {
            where.folderId = folderId;
        }
        if (tagId) {
            where.tags = {
                some: { id: tagId }
            };
        }
        if (search) {
            where.OR = [
                { title: { contains: search } },
                { content: { contains: search } }
            ];
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
        });
        res.json(notes);
    }
    catch (error) {
        next(error);
    }
};
exports.getNotes = getNotes;
// 获取单个笔记
const getNote = async (req, res, next) => {
    try {
        const { id } = req.params;
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
        });
        if (!note) {
            return res.status(404).json({ message: '笔记不存在' });
        }
        res.json(note);
    }
    catch (error) {
        next(error);
    }
};
exports.getNote = getNote;
// 创建笔记
const createNote = async (req, res, next) => {
    try {
        const { title, content, folderId, tagIds } = req.body;
        const note = await prisma.note.create({
            data: {
                title: title || '无标题',
                content: content || '',
                folderId: folderId || null,
                tags: tagIds ? {
                    connect: tagIds.map((id) => ({ id }))
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
        });
        res.status(201).json(note);
    }
    catch (error) {
        next(error);
    }
};
exports.createNote = createNote;
// 更新笔记
const updateNote = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { title, content, folderId, tagIds, isFavorite } = req.body;
        // 检查笔记是否存在
        const existing = await prisma.note.findUnique({ where: { id } });
        if (!existing) {
            return res.status(404).json({ message: '笔记不存在' });
        }
        const updateData = {};
        if (title !== undefined)
            updateData.title = title;
        if (content !== undefined)
            updateData.content = content;
        if (folderId !== undefined)
            updateData.folderId = folderId;
        if (isFavorite !== undefined)
            updateData.isFavorite = isFavorite;
        // 更新标签关联
        if (tagIds !== undefined) {
            updateData.tags = {
                set: tagIds.map((tagId) => ({ id: tagId }))
            };
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
        });
        res.json(note);
    }
    catch (error) {
        next(error);
    }
};
exports.updateNote = updateNote;
// 删除笔记
const deleteNote = async (req, res, next) => {
    try {
        const { id } = req.params;
        // 检查笔记是否存在
        const existing = await prisma.note.findUnique({ where: { id } });
        if (!existing) {
            return res.status(404).json({ message: '笔记不存在' });
        }
        await prisma.note.delete({ where: { id } });
        res.status(204).send();
    }
    catch (error) {
        next(error);
    }
};
exports.deleteNote = deleteNote;
//# sourceMappingURL=note.controller.js.map