import { Request, Response, NextFunction } from "express";
import { PrismaClient } from "@prisma/client";
import axios from "axios";
import * as cheerio from "cheerio";

const prisma = new PrismaClient();

// 获取链接列表
export const getLinks = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { folderId, tagId } = req.query;

    const where: any = {};

    if (folderId) {
      where.folderId = folderId as string;
    }

    if (tagId) {
      where.tags = {
        some: { id: tagId as string },
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
  } catch (error) {
    next(error);
  }
};

// 获取单个链接
export const getLink = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
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
  } catch (error) {
    next(error);
  }
};

// 创建链接
export const createLink = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
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
              connect: tagIds.map((id: string) => ({ id })),
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
  } catch (error) {
    next(error);
  }
};

// 更新链接
export const updateLink = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const { url, title, summary, folderId, tagIds, isRead } = req.body;

    // 检查链接是否存在
    const existing = await prisma.link.findUnique({ where: { id } });
    if (!existing) {
      return res.status(404).json({ message: "链接不存在" });
    }

    const updateData: any = {};
    if (url !== undefined) updateData.url = url;
    if (title !== undefined) updateData.title = title;
    if (summary !== undefined) updateData.summary = summary;
    if (folderId !== undefined) updateData.folderId = folderId;
    if (isRead !== undefined) updateData.isRead = isRead;

    // 更新标签关联
    if (tagIds !== undefined) {
      updateData.tags = {
        set: tagIds.map((tagId: string) => ({ id: tagId })),
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
  } catch (error) {
    next(error);
  }
};

// 删除链接
export const deleteLink = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;

    // 检查链接是否存在
    const existing = await prisma.link.findUnique({ where: { id } });
    if (!existing) {
      return res.status(404).json({ message: "链接不存在" });
    }

    await prisma.link.delete({ where: { id } });

    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

// 抓取链接元信息
export const fetchMeta = async (
  req: Request,
  res: Response,
  _next: NextFunction
) => {
  try {
    const { url } = req.body;

    if (!url) {
      return res.status(400).json({ message: "URL 不能为空" });
    }

    // 使用 axios 抓取网页内容
    const response = await axios.get(url, {
      timeout: 10000,
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      },
    });

    const $ = cheerio.load(response.data);

    // 获取标题
    let title =
      $('meta[property="og:title"]').attr("content") ||
      $('meta[name="twitter:title"]').attr("content") ||
      $("title").text() ||
      "";
    title = title.trim();

    // 获取描述
    let summary =
      $('meta[property="og:description"]').attr("content") ||
      $('meta[name="twitter:description"]').attr("content") ||
      $('meta[name="description"]').attr("content") ||
      "";
    summary = summary.trim();

    // 获取 favicon
    let favicon =
      $('link[rel="icon"]').attr("href") ||
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
  } catch (error: any) {
    // 如果抓取失败，返回空数据而不是错误
    console.error("抓取链接元信息失败:", error.message);
    res.json({
      title: "",
      summary: "",
      favicon: "",
    });
  }
};
