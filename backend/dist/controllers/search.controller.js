"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.search = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
// 全文搜索
const search = async (req, res, next) => {
    try {
        const { q, type = 'all', limit = 20 } = req.query;
        if (!q) {
            return res.json({
                notes: [],
                links: [],
                total: 0
            });
        }
        const searchTerm = q;
        const searchLimit = Math.min(Number(limit), 50);
        let notes = [];
        let links = [];
        // 搜索笔记
        if (type === 'all' || type === 'notes') {
            notes = await prisma.note.findMany({
                where: {
                    OR: [
                        { title: { contains: searchTerm } },
                        { content: { contains: searchTerm } }
                    ]
                },
                include: {
                    folder: {
                        select: { id: true, name: true }
                    },
                    tags: {
                        select: { id: true, name: true, color: true }
                    }
                },
                take: searchLimit,
                orderBy: { updatedAt: 'desc' }
            });
        }
        // 搜索链接
        if (type === 'all' || type === 'links') {
            links = await prisma.link.findMany({
                where: {
                    OR: [
                        { title: { contains: searchTerm } },
                        { url: { contains: searchTerm } },
                        { summary: { contains: searchTerm } }
                    ]
                },
                include: {
                    folder: {
                        select: { id: true, name: true }
                    },
                    tags: {
                        select: { id: true, name: true, color: true }
                    }
                },
                take: searchLimit,
                orderBy: { updatedAt: 'desc' }
            });
        }
        res.json({
            notes,
            links,
            total: notes.length + links.length
        });
    }
    catch (error) {
        next(error);
    }
};
exports.search = search;
//# sourceMappingURL=search.controller.js.map