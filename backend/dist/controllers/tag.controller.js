"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteTag = exports.createTag = exports.getTags = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
// 获取标签列表
const getTags = async (_req, res, next) => {
    try {
        const tags = await prisma.tag.findMany({
            include: {
                _count: {
                    select: {
                        notes: true,
                        links: true,
                    },
                },
            },
            orderBy: { createdAt: "desc" },
        });
        res.json(tags);
    }
    catch (error) {
        next(error);
    }
};
exports.getTags = getTags;
// 创建标签
const createTag = async (req, res, next) => {
    try {
        const { name, color } = req.body;
        if (!name) {
            return res.status(400).json({ message: "标签名称不能为空" });
        }
        // 检查标签是否已存在
        const existing = await prisma.tag.findUnique({ where: { name } });
        if (existing) {
            return res.status(400).json({ message: "标签已存在" });
        }
        const tag = await prisma.tag.create({
            data: {
                name,
                color: color || null,
            },
        });
        res.status(201).json(tag);
    }
    catch (error) {
        next(error);
    }
};
exports.createTag = createTag;
// 删除标签
const deleteTag = async (req, res, next) => {
    try {
        const { id } = req.params;
        // 检查标签是否存在
        const existing = await prisma.tag.findUnique({ where: { id } });
        if (!existing) {
            return res.status(404).json({ message: "标签不存在" });
        }
        await prisma.tag.delete({ where: { id } });
        res.status(204).send();
    }
    catch (error) {
        next(error);
    }
};
exports.deleteTag = deleteTag;
//# sourceMappingURL=tag.controller.js.map