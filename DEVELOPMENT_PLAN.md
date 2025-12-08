# 个人博客 & 知识收集平台 - 开发计划

> 🚀 一个现代化的个人博客与知识管理平台

---

## 📋 项目概览

| 项目         | 说明                           |
| ------------ | ------------------------------ |
| **项目名称** | Knowledge Blog（暂定）         |
| **项目类型** | 全栈 Web 应用                  |
| **目标**     | 个人博客 + 知识收集 + 文章管理 |
| **开发周期** | 预计 4-6 周                    |

---

## 🛠️ 技术栈

### 前端技术

| 技术           | 版本  | 用途            |
| -------------- | ----- | --------------- |
| Vue 3          | ^3.4  | 核心框架        |
| TypeScript     | ^5.0  | 类型安全        |
| Vite           | ^5.0  | 构建工具        |
| Naive UI       | ^2.38 | UI 组件库       |
| UnoCSS         | ^0.58 | 原子化 CSS      |
| Pinia          | ^2.1  | 状态管理        |
| Vue Router     | ^4.3  | 路由管理        |
| @vueuse/core   | ^10.9 | 组合式工具库    |
| @vueuse/motion | ^2.1  | 动画库          |
| Iconify        | ^3.1  | 图标库          |
| Milkdown       | ^7.3  | Markdown 编辑器 |
| Axios          | ^1.6  | HTTP 请求       |
| dayjs          | ^1.11 | 日期处理        |

### 后端技术

| 技术       | 版本         | 用途              |
| ---------- | ------------ | ----------------- |
| Node.js    | ^20.x        | 运行环境          |
| Express.js | ^4.18        | Web 框架          |
| TypeScript | ^5.0         | 类型安全          |
| Prisma     | ^5.10        | ORM               |
| SQLite     | -            | 开发 & 生产数据库 |
| JWT        | jsonwebtoken | 身份认证          |
| bcryptjs   | ^2.4         | 密码加密          |
| multer     | ^1.4         | 文件上传          |
| cors       | ^2.8         | 跨域处理          |
| helmet     | ^7.1         | 安全中间件        |
| zod        | ^3.22        | 数据校验          |

---

## 📁 项目结构

```
rogueCultivator/
├── frontend/                    # 前端项目
│   ├── src/
│   │   ├── api/                # API 请求
│   │   ├── assets/             # 静态资源
│   │   ├── components/         # 通用组件
│   │   │   ├── common/         # 公共组件
│   │   │   ├── layout/         # 布局组件
│   │   │   └── business/       # 业务组件
│   │   ├── composables/        # 组合式函数
│   │   ├── layouts/            # 页面布局
│   │   ├── pages/              # 页面视图
│   │   │   ├── home/           # 首页
│   │   │   ├── blog/           # 博客
│   │   │   ├── knowledge/      # 知识库
│   │   │   ├── archive/        # 归档
│   │   │   ├── about/          # 关于
│   │   │   └── admin/          # 后台管理
│   │   ├── router/             # 路由配置
│   │   ├── stores/             # Pinia 状态
│   │   ├── styles/             # 全局样式
│   │   ├── types/              # 类型定义
│   │   ├── utils/              # 工具函数
│   │   ├── App.vue             # 根组件
│   │   └── main.ts             # 入口文件
│   ├── public/                 # 公共资源
│   ├── index.html
│   ├── vite.config.ts
│   ├── tsconfig.json
│   ├── uno.config.ts
│   └── package.json
│
├── backend/                     # 后端项目
│   ├── src/
│   │   ├── controllers/        # 控制器
│   │   ├── middlewares/        # 中间件
│   │   ├── routes/             # 路由
│   │   ├── services/           # 业务逻辑
│   │   ├── utils/              # 工具函数
│   │   ├── types/              # 类型定义
│   │   ├── validators/         # 数据校验
│   │   ├── config/             # 配置文件
│   │   ├── app.ts              # Express 应用
│   │   └── server.ts           # 服务入口
│   ├── prisma/
│   │   ├── schema.prisma       # 数据库模型
│   │   └── seed.ts             # 种子数据
│   ├── uploads/                # 上传文件目录
│   ├── tsconfig.json
│   └── package.json
│
├── docs/                        # 项目文档
├── .gitignore
├── README.md
└── DEVELOPMENT_PLAN.md          # 本文件
```

---

## 🗃️ 数据库设计

### 数据模型

```prisma
// 用户表
model User {
  id        String   @id @default(uuid())
  username  String   @unique
  email     String   @unique
  password  String
  nickname  String?
  avatar    String?
  bio       String?
  role      Role     @default(USER)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  posts     Post[]
  categories Category[]
  tags      Tag[]
}

// 文章表
model Post {
  id          String    @id @default(uuid())
  title       String
  slug        String    @unique
  content     String
  summary     String?
  coverImage  String?
  viewCount   Int       @default(0)
  likeCount   Int       @default(0)
  isPublished Boolean   @default(false)
  isTop       Boolean   @default(false)
  publishedAt DateTime?
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt

  author      User      @relation(fields: [authorId], references: [id])
  authorId    String
  category    Category? @relation(fields: [categoryId], references: [id])
  categoryId  String?
  tags        Tag[]
}

// 分类表
model Category {
  id          String   @id @default(uuid())
  name        String
  slug        String   @unique
  description String?
  icon        String?
  sortOrder   Int      @default(0)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  user        User     @relation(fields: [userId], references: [id])
  userId      String
  posts       Post[]
}

// 标签表
model Tag {
  id        String   @id @default(uuid())
  name      String
  slug      String   @unique
  color     String?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  user      User     @relation(fields: [userId], references: [id])
  userId    String
  posts     Post[]
}

// 知识收集表
model Knowledge {
  id          String   @id @default(uuid())
  title       String
  url         String?
  content     String?
  summary     String?
  source      String?
  isRead      Boolean  @default(false)
  isFavorite  Boolean  @default(false)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  folderId    String?
  folder      Folder?  @relation(fields: [folderId], references: [id])
}

// 知识文件夹
model Folder {
  id          String      @id @default(uuid())
  name        String
  icon        String?
  parentId    String?
  parent      Folder?     @relation("FolderTree", fields: [parentId], references: [id])
  children    Folder[]    @relation("FolderTree")
  knowledges  Knowledge[]
  createdAt   DateTime    @default(now())
  updatedAt   DateTime    @updatedAt
}

// 角色枚举
enum Role {
  ADMIN
  USER
}
```

---

## 🎨 功能模块

### 前台功能

| 模块         | 功能点                                        |
| ------------ | --------------------------------------------- |
| **首页**     | 精选文章、最新动态、标签云、搜索入口          |
| **博客列表** | 文章列表、分类筛选、标签筛选、分页            |
| **文章详情** | Markdown 渲染、目录导航、代码高亮、评论(可选) |
| **知识库**   | 文件夹管理、收藏列表、快速搜索                |
| **归档**     | 时间线归档、统计数据                          |
| **关于**     | 个人介绍、技能展示、联系方式                  |
| **搜索**     | 全局搜索（Cmd+K）、实时搜索                   |

### 后台管理

| 模块         | 功能点                           |
| ------------ | -------------------------------- |
| **仪表盘**   | 数据统计、快捷操作、最近文章     |
| **文章管理** | CRUD、Markdown 编辑器、发布/草稿 |
| **分类管理** | CRUD、排序、图标设置             |
| **标签管理** | CRUD、颜色设置                   |
| **知识管理** | 文件夹 CRUD、知识条目 CRUD       |
| **媒体管理** | 图片上传、文件管理               |
| **个人设置** | 资料修改、密码修改               |

---

## 📅 开发计划

### 第一阶段：项目初始化（第 1 周）

- [ ] **Day 1-2：前端项目搭建**

  - [ ] 初始化 Vite + Vue 3 + TypeScript
  - [ ] 配置 UnoCSS
  - [ ] 配置 Naive UI
  - [ ] 配置 Vue Router
  - [ ] 配置 Pinia
  - [ ] 配置基础布局组件
  - [ ] 配置暗色/亮色主题切换

- [ ] **Day 3-4：后端项目搭建**

  - [ ] 初始化 Express + TypeScript
  - [ ] 配置 Prisma + SQLite
  - [ ] 设计并创建数据库模型
  - [ ] 配置基础中间件（cors, helmet, 错误处理）
  - [ ] 实现用户认证（注册/登录/JWT）

- [ ] **Day 5-7：前后端联调**
  - [ ] 实现登录/注册页面
  - [ ] 配置 Axios 拦截器
  - [ ] 实现 Token 管理
  - [ ] 测试前后端通信

### 第二阶段：核心功能（第 2-3 周）

- [ ] **博客模块**

  - [ ] 文章列表页（分页、筛选）
  - [ ] 文章详情页（Markdown 渲染）
  - [ ] 文章 CRUD API
  - [ ] 分类管理
  - [ ] 标签管理

- [ ] **后台管理**
  - [ ] 管理后台布局
  - [ ] 仪表盘页面
  - [ ] 文章编辑器（Milkdown）
  - [ ] 分类/标签管理页面

### 第三阶段：知识库功能（第 4 周）

- [ ] **知识库模块**
  - [ ] 文件夹树形结构
  - [ ] 知识条目 CRUD
  - [ ] 收藏功能
  - [ ] 快速搜索

### 第四阶段：优化完善（第 5-6 周）

- [ ] **体验优化**

  - [ ] 全局搜索（Cmd+K）
  - [ ] 页面过渡动画
  - [ ] 骨架屏加载
  - [ ] 响应式适配
  - [ ] SEO 优化

- [ ] **部署上线**
  - [ ] 前端部署（Vercel/Netlify）
  - [ ] 后端部署（Railway/Render）
  - [ ] SQLite 数据库备份策略
  - [ ] 域名配置
  - [ ] HTTPS 配置

---

## 🔌 API 设计

### 认证相关

```
POST   /api/auth/register     # 注册
POST   /api/auth/login        # 登录
POST   /api/auth/logout       # 登出
GET    /api/auth/me           # 获取当前用户
POST   /api/auth/refresh      # 刷新 Token
```

### 文章相关

```
GET    /api/posts             # 文章列表（支持分页、筛选）
GET    /api/posts/:slug       # 文章详情
POST   /api/posts             # 创建文章
PUT    /api/posts/:id         # 更新文章
DELETE /api/posts/:id         # 删除文章
POST   /api/posts/:id/publish # 发布文章
POST   /api/posts/:id/like    # 点赞文章
```

### 分类相关

```
GET    /api/categories        # 分类列表
GET    /api/categories/:slug  # 分类详情（含文章）
POST   /api/categories        # 创建分类
PUT    /api/categories/:id    # 更新分类
DELETE /api/categories/:id    # 删除分类
```

### 标签相关

```
GET    /api/tags              # 标签列表
GET    /api/tags/:slug        # 标签详情（含文章）
POST   /api/tags              # 创建标签
PUT    /api/tags/:id          # 更新标签
DELETE /api/tags/:id          # 删除标签
```

### 知识库相关

```
GET    /api/folders           # 文件夹列表（树形）
POST   /api/folders           # 创建文件夹
PUT    /api/folders/:id       # 更新文件夹
DELETE /api/folders/:id       # 删除文件夹

GET    /api/knowledges        # 知识列表
GET    /api/knowledges/:id    # 知识详情
POST   /api/knowledges        # 创建知识
PUT    /api/knowledges/:id    # 更新知识
DELETE /api/knowledges/:id    # 删除知识
```

### 文件上传

```
POST   /api/upload/image      # 上传图片
DELETE /api/upload/:filename  # 删除文件
```

### 搜索

```
GET    /api/search            # 全局搜索
```

---

## 🎯 开发规范

### 代码规范

- 使用 ESLint + Prettier 统一代码风格
- 组件命名采用 PascalCase
- 文件命名采用 kebab-case
- 接口类型以 `I` 前缀命名
- 响应类型以 `Response` 后缀命名

### Git 规范

```
feat:     新功能
fix:      修复 Bug
docs:     文档更新
style:    代码格式（不影响功能）
refactor: 重构
perf:     性能优化
test:     测试
chore:    构建/工具变动
```

### 目录规范

- 每个页面组件放在独立文件夹
- 组件内部样式使用 `<style scoped>`
- 公共类型放在 `types/` 目录
- API 请求按模块划分文件

---

## 🚀 启动命令

### 前端

```bash
cd frontend
npm install
npm run dev       # 开发模式
npm run build     # 构建生产版本
npm run preview   # 预览生产版本
```

### 后端

```bash
cd backend
npm install
npx prisma generate   # 生成 Prisma Client
npx prisma db push    # 同步数据库
npm run dev           # 开发模式
npm run build         # 构建
npm run start         # 生产模式
```

---

## 📝 备注

1. 开发过程中优先保证核心功能可用
2. 样式可以先简单实现，后续迭代优化
3. 数据库设计可根据需求调整
4. 部署方案可根据实际情况选择

---

**Let's Build Something Amazing! 🎉**
