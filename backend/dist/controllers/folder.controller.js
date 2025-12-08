"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.moveFolder = exports.deleteFolder = exports.updateFolder = exports.createFolder = exports.getFolders = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
// 获取文件夹列表
const getFolders = async (_req, res, next) => {
    try {
        const folders = await prisma.folder.findMany({
            orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
        });
        res.json(folders);
    }
    catch (error) {
        next(error);
    }
};
exports.getFolders = getFolders;
// 创建文件夹
const createFolder = async (req, res, next) => {
    try {
        const { name, icon, parentId } = req.body;
        if (!name) {
            return res.status(400).json({ message: "文件夹名称不能为空" });
        }
        const folder = await prisma.folder.create({
            data: {
                name,
                icon: icon || null,
                parentId: parentId || null,
            },
        });
        res.status(201).json(folder);
    }
    catch (error) {
        next(error);
    }
};
exports.createFolder = createFolder;
// 更新文件夹
const updateFolder = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { name, icon, sortOrder } = req.body;
        // 检查文件夹是否存在
        const existing = await prisma.folder.findUnique({ where: { id } });
        if (!existing) {
            return res.status(404).json({ message: "文件夹不存在" });
        }
        const updateData = {};
        if (name !== undefined)
            updateData.name = name;
        if (icon !== undefined)
            updateData.icon = icon;
        if (sortOrder !== undefined)
            updateData.sortOrder = sortOrder;
        const folder = await prisma.folder.update({
            where: { id },
            data: updateData,
        });
        res.json(folder);
    }
    catch (error) {
        next(error);
    }
};
exports.updateFolder = updateFolder;
// 删除文件夹
const deleteFolder = async (req, res, next) => {
    try {
        const { id } = req.params;
        // 检查文件夹是否存在
        const existing = await prisma.folder.findUnique({ where: { id } });
        if (!existing) {
            return res.status(404).json({ message: "文件夹不存在" });
        }
        // 删除文件夹（子文件夹会级联删除，笔记会设为 null）
        await prisma.folder.delete({ where: { id } });
        res.status(204).send();
    }
    catch (error) {
        next(error);
    }
};
exports.deleteFolder = deleteFolder;
// 移动文件夹
const moveFolder = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { parentId } = req.body;
        // 检查文件夹是否存在
        const existing = await prisma.folder.findUnique({ where: { id } });
        if (!existing) {
            return res.status(404).json({ message: "文件夹不存在" });
        }
        // 不能把文件夹移动到自己下面
        if (parentId === id) {
            return res.status(400).json({ message: "不能将文件夹移动到自身" });
        }
        const folder = await prisma.folder.update({
            where: { id },
            data: { parentId: parentId || null },
        });
        res.json(folder);
    }
    catch (error) {
        next(error);
    }
};
exports.moveFolder = moveFolder;
//# sourceMappingURL=folder.controller.js.map