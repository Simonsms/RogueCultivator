"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchMeta = exports.deleteLink = exports.updateLink = exports.createLink = exports.getLink = exports.getLinks = void 0;
const client_1 = require("@prisma/client");
const axios_1 = __importDefault(require("axios"));
const cheerio = __importStar(require("cheerio"));
const prisma = new client_1.PrismaClient();
// 获取链接列表
const getLinks = async (req, res, next) => {
    try {
        const { folderId, tagId } = req.query;
        const where = {};
        if (folderId) {
            where.folderId = folderId;
        }
        if (tagId) {
            where.tags = {
                some: { id: tagId },
            };
        }
        const links = await prisma.link.findMany({
            where,
            include: {
                folder: {
                    select: { id: true, name: true },
                },
                tags: {
                    select: { id: true, name: true, color: true },
                },
            },
            orderBy: { createdAt: "desc" },
        });
        res.json(links);
    }
    catch (error) {
        next(error);
    }
};
exports.getLinks = getLinks;
// 获取单个链接
const getLink = async (req, res, next) => {
    try {
        const { id } = req.params;
        const link = await prisma.link.findUnique({
            where: { id },
            include: {
                folder: {
                    select: { id: true, name: true },
                },
                tags: {
                    select: { id: true, name: true, color: true },
                },
            },
        });
        if (!link) {
            return res.status(404).json({ message: "链接不存在" });
        }
        res.json(link);
    }
    catch (error) {
        next(error);
    }
};
exports.getLink = getLink;
// 创建链接
const createLink = async (req, res, next) => {
    try {
        const { url, title, summary, folderId, tagIds } = req.body;
        if (!url) {
            return res.status(400).json({ message: "URL 不能为空" });
        }
        const link = await prisma.link.create({
            data: {
                url,
                title: title || null,
                summary: summary || null,
                folderId: folderId || null,
                tags: tagIds
                    ? {
                        connect: tagIds.map((id) => ({ id })),
                    }
                    : undefined,
            },
            include: {
                folder: {
                    select: { id: true, name: true },
                },
                tags: {
                    select: { id: true, name: true, color: true },
                },
            },
        });
        res.status(201).json(link);
    }
    catch (error) {
        next(error);
    }
};
exports.createLink = createLink;
// 更新链接
const updateLink = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { url, title, summary, folderId, tagIds, isRead } = req.body;
        // 检查链接是否存在
        const existing = await prisma.link.findUnique({ where: { id } });
        if (!existing) {
            return res.status(404).json({ message: "链接不存在" });
        }
        const updateData = {};
        if (url !== undefined)
            updateData.url = url;
        if (title !== undefined)
            updateData.title = title;
        if (summary !== undefined)
            updateData.summary = summary;
        if (folderId !== undefined)
            updateData.folderId = folderId;
        if (isRead !== undefined)
            updateData.isRead = isRead;
        // 更新标签关联
        if (tagIds !== undefined) {
            updateData.tags = {
                set: tagIds.map((tagId) => ({ id: tagId })),
            };
        }
        const link = await prisma.link.update({
            where: { id },
            data: updateData,
            include: {
                folder: {
                    select: { id: true, name: true },
                },
                tags: {
                    select: { id: true, name: true, color: true },
                },
            },
        });
        res.json(link);
    }
    catch (error) {
        next(error);
    }
};
exports.updateLink = updateLink;
// 删除链接
const deleteLink = async (req, res, next) => {
    try {
        const { id } = req.params;
        // 检查链接是否存在
        const existing = await prisma.link.findUnique({ where: { id } });
        if (!existing) {
            return res.status(404).json({ message: "链接不存在" });
        }
        await prisma.link.delete({ where: { id } });
        res.status(204).send();
    }
    catch (error) {
        next(error);
    }
};
exports.deleteLink = deleteLink;
// 抓取链接元信息
const fetchMeta = async (req, res, _next) => {
    try {
        const { url } = req.body;
        if (!url) {
            return res.status(400).json({ message: "URL 不能为空" });
        }
        // 使用 axios 抓取网页内容
        const response = await axios_1.default.get(url, {
            timeout: 10000,
            headers: {
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
            },
        });
        const $ = cheerio.load(response.data);
        // 获取标题
        let title = $('meta[property="og:title"]').attr("content") ||
            $('meta[name="twitter:title"]').attr("content") ||
            $("title").text() ||
            "";
        title = title.trim();
        // 获取描述
        let summary = $('meta[property="og:description"]').attr("content") ||
            $('meta[name="twitter:description"]').attr("content") ||
            $('meta[name="description"]').attr("content") ||
            "";
        summary = summary.trim();
        // 获取 favicon
        let favicon = $('link[rel="icon"]').attr("href") ||
            $('link[rel="shortcut icon"]').attr("href") ||
            $('link[rel="apple-touch-icon"]').attr("href") ||
            "";
        // 处理相对路径
        if (favicon && !favicon.startsWith("http")) {
            const urlObj = new URL(url);
            favicon = favicon.startsWith("/")
                ? `${urlObj.protocol}//${urlObj.host}${favicon}`
                : `${urlObj.protocol}//${urlObj.host}/${favicon}`;
        }
        // 如果没有获取到 favicon，使用 Google 的 favicon 服务
        if (!favicon) {
            const urlObj = new URL(url);
            favicon = `https://www.google.com/s2/favicons?domain=${urlObj.hostname}&sz=64`;
        }
        res.json({
            title: title || "无标题",
            summary: summary || "",
            favicon,
        });
    }
    catch (error) {
        // 如果抓取失败，返回空数据而不是错误
        console.error("抓取链接元信息失败:", error.message);
        res.json({
            title: "",
            summary: "",
            favicon: "",
        });
    }
};
exports.fetchMeta = fetchMeta;
//# sourceMappingURL=link.controller.js.map