# 📚 Knowledge Blog

> 一个现代化的个人博客与知识管理平台

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Node](https://img.shields.io/badge/node-%3E%3D20.0.0-brightgreen.svg)](https://nodejs.org/)
[![Vue](https://img.shields.io/badge/vue-3.5+-42b883.svg)](https://vuejs.org/)

---

## ✨ 特性

- 🎨 **现代化 UI**：基于 Naive UI 的精美界面
- 🌓 **暗色模式**：支持亮色/暗色主题切换
- 📝 **Markdown 编辑**：强大的 Markdown 编辑器
- 🔐 **用户认证**：完整的注册/登录/权限管理
- 📱 **响应式设计**：完美适配移动端
- ⚡ **极速体验**：基于 Vite 的快速开发体验

---

## 🛠️ 技术栈

### 前端

- **框架**：Vue 3.5 + TypeScript 5.9
- **构建工具**：Vite 7.0
- **UI 组件库**：Naive UI 2.43
- **CSS 框架**：UnoCSS 66.5
- **状态管理**：Pinia 3.0
- **路由管理**：Vue Router 4.6
- **HTTP 请求**：Axios 1.13
- **工具库**：@vueuse/core 14.1

### 后端

- **运行环境**：Node.js 20.x
- **Web 框架**：Express 5.0
- **ORM**：Prisma 5.22
- **数据库**：SQLite
- **身份认证**：JWT + bcryptjs
- **安全中间件**：helmet + cors

---

## 📦 项目结构

```
rogueCultivator/
├── frontend/                # 前端项目
│   ├── src/
│   │   ├── api/            # API 请求
│   │   ├── assets/         # 静态资源
│   │   ├── components/     # 组件
│   │   ├── layouts/        # 布局
│   │   ├── pages/          # 页面
│   │   ├── router/         # 路由
│   │   ├── stores/         # 状态管理
│   │   ├── utils/          # 工具函数
│   │   └── main.ts         # 入口文件
│   └── package.json
│
├── backend/                 # 后端项目
│   ├── src/
│   │   ├── controllers/    # 控制器
│   │   ├── middlewares/    # 中间件
│   │   ├── routes/         # 路由
│   │   ├── services/       # 业务逻辑
│   │   ├── utils/          # 工具函数
│   │   └── server.ts       # 入口文件
│   ├── prisma/
│   │   └── schema.prisma   # 数据库模型
│   └── package.json
│
├── docs/                    # 文档
├── start-dev.bat           # 开发环境启动脚本
├── DEVELOPMENT_PLAN.md     # 开发计划
├── PROJECT_PROGRESS.md     # 项目进度
└── TESTING.md              # 测试指南
```

---

## 🚀 快速开始

### 环境要求

- Node.js >= 20.0.0
- npm >= 10.0.0

### 安装依赖

```bash
# 安装前端依赖
cd frontend
npm install

# 安装后端依赖
cd ../backend
npm install
```

### 数据库设置

```bash
# 进入后端目录
cd backend

# 生成 Prisma Client
npx prisma generate

# 同步数据库
npx prisma db push
```

### 启动项目

**方式一：使用启动脚本（推荐）**

```bash
# Windows
start-dev.bat
```

**方式二：手动启动**

```bash
# 启动后端（终端 1）
cd backend
npm run dev

# 启动前端（终端 2）
cd frontend
npm run dev
```

### 访问项目

- 前端：http://localhost:3000
- 后端 API：http://localhost:5000

---

## 📖 功能说明

### ✅ 已完成功能

#### 第一阶段：项目初始化 & 前后端联调

- [x] 前端项目搭建
  - [x] Vue 3 + TypeScript + Vite
  - [x] UnoCSS + Naive UI
  - [x] 路由和状态管理
  - [x] 主题切换系统

- [x] 后端项目搭建
  - [x] Express + TypeScript
  - [x] Prisma + SQLite
  - [x] 数据库模型设计
  - [x] 用户认证系统

- [x] 前后端联调
  - [x] Axios 请求拦截器
  - [x] Token 管理机制
  - [x] 登录/注册页面
  - [x] 路由守卫
  - [x] 用户菜单

### 🚧 开发中

#### 第二阶段：核心功能

- [ ] 博客模块
  - [ ] 文章列表（分页、筛选）
  - [ ] 文章详情（Markdown 渲染）
  - [ ] 文章 CRUD API

- [ ] 后台管理
  - [ ] 仪表盘
  - [ ] Markdown 编辑器
  - [ ] 分类/标签管理

### 📋 待开发

- [ ] 知识库功能
- [ ] 全局搜索（Cmd+K）
- [ ] 页面动画
- [ ] SEO 优化
- [ ] 部署上线

---

## 🧪 测试

详细测试说明请查看 [TESTING.md](./TESTING.md)

**快速测试：**

1. 启动项目
2. 访问 `http://localhost:3000/register`
3. 注册一个测试账号
4. 体验登录/登出功能
5. 访问后台管理页面

---

## 📚 API 文档

### 认证接口

| 接口            | 方法 | 说明         |
| --------------- | ---- | ------------ |
| /api/auth/register | POST | 用户注册     |
| /api/auth/login    | POST | 用户登录     |
| /api/auth/me       | GET  | 获取用户信息 |
| /api/auth/logout   | POST | 用户登出     |

更多 API 文档请查看后端代码或使用 Postman 测试。

---

## 🗂️ 数据库模型

- **User**：用户表
- **Post**：文章表
- **Category**：分类表
- **Tag**：标签表
- **Knowledge**：知识表
- **Folder**：文件夹表

详细模型设计请查看 `backend/prisma/schema.prisma`

---

## 📈 项目进度

详细进度请查看 [PROJECT_PROGRESS.md](./PROJECT_PROGRESS.md)

**当前进度：** 40% (Day 1-7 完成)

```
第一阶段：项目初始化      ████████████████████ 100%
第二阶段：后端搭建        ░░░░░░░░░░░░░░░░░░░░   0%
第三阶段：前后端联调      ░░░░░░░░░░░░░░░░░░░░   0%
第四阶段：核心功能-博客   ░░░░░░░░░░░░░░░░░░░░   0%
第五阶段：核心功能-后台   ░░░░░░░░░░░░░░░░░░░░   0%
第六阶段：知识库功能      ░░░░░░░░░░░░░░░░░░░░   0%
第七阶段：体验优化        ░░░░░░░░░░░░░░░░░░░░   0%
第八阶段：部署上线        ░░░░░░░░░░░░░░░░░░░░   0%
```

---

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

---

## 📄 许可证

MIT License

---

## 👨‍💻 作者

**Snow AI CLI**

- 开发时间：2024-12-08
- 最后更新：2024-12-08

---

## 🎉 致谢

感谢以下开源项目：

- [Vue.js](https://vuejs.org/)
- [Naive UI](https://www.naiveui.com/)
- [Vite](https://vitejs.dev/)
- [Prisma](https://www.prisma.io/)
- [Express](https://expressjs.com/)

---

**Happy Coding! 🚀**
