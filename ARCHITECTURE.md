# 🏗️ RogueCultivator - 新架构设计

> 个人知识管理系统 - 类 Obsidian 设计

---

## 📋 设计原则

| 原则 | 说明 |
|------|------|
| **简单优先** | 个人工具，不需要企业级复杂度 |
| **所见即所得** | 没有前后台之分，直接编辑 |
| **快速记录** | 最少点击，最快记录 |
| **本地优先** | 数据存储在本地，隐私安全 |

---

## 🎯 核心功能模块

### 1. 📝 笔记系统（核心）

```
┌─────────────────────────────────────────────────────┐
│                    主界面布局                        │
├──────────────┬──────────────────────────────────────┤
│              │                                      │
│   侧边栏      │          编辑/预览区                 │
│   ├─ 📁 文件夹│                                      │
│   │   ├─ 笔记1│     ┌─────────────────────────┐     │
│   │   └─ 笔记2│     │  # 标题                  │     │
│   ├─ 🏷️ 标签 │     │                          │     │
│   │   ├─ Vue │     │  正文内容...             │     │
│   │   └─ React│     │  [[双链引用]]            │     │
│   └─ 🔍 搜索 │     │                          │     │
│              │     └─────────────────────────┘     │
│              │                                      │
│  ┌─────────┐ │     [编辑] [预览] [分屏]            │
│  │ + 新建   │ │                                      │
│  └─────────┘ │                                      │
└──────────────┴──────────────────────────────────────┘
```

**功能点：**
- ✅ Markdown 实时编辑/预览
- ✅ 文件夹树形结构
- ✅ 标签分类
- ✅ 全文搜索 (Ctrl+K)
- ✅ 双链笔记 `[[笔记名]]`
- ✅ 快速新建 (Ctrl+N)

---

### 2. 🔗 链接收藏

```
┌─────────────────────────────────────────────────────┐
│  + 收藏链接                                         │
├─────────────────────────────────────────────────────┤
│  🔗 https://example.com/article                     │
│  ──────────────────────────────────────────────     │
│  📄 文章标题（自动抓取）                            │
│  📝 摘要内容（自动抓取）                            │
│  🏷️ 标签: [Vue] [教程]                             │
│  📁 分类: 前端开发                                  │
└─────────────────────────────────────────────────────┘
```

**功能点：**
- ✅ 粘贴链接自动抓取标题/摘要
- ✅ 手动添加标签和备注
- ✅ 链接分类管理
- ✅ 收藏列表展示

---

### 3. 🔍 全局搜索

```
┌─────────────────────────────────────────────────────┐
│  🔍 搜索笔记、链接、标签...              [Ctrl+K]  │
├─────────────────────────────────────────────────────┤
│  最近访问                                           │
│  ├─ 📝 Vue 3 学习笔记              2小时前         │
│  ├─ 🔗 React Hooks 详解            昨天            │
│  └─ 📝 TypeScript 泛型             3天前           │
│  ──────────────────────────────────────────────     │
│  搜索结果                                           │
│  ├─ 📝 [匹配内容高亮显示]                          │
│  └─ 🔗 [匹配内容高亮显示]                          │
└─────────────────────────────────────────────────────┘
```

---

## 🗃️ 数据模型（简化版）

```prisma
// 笔记表 - 核心
model Note {
  id         String    @id @default(uuid())
  title      String
  content    String    // Markdown 内容
  folderId   String?
  folder     Folder?   @relation(fields: [folderId], references: [id])
  tags       Tag[]
  isFavorite Boolean   @default(false)
  createdAt  DateTime  @default(now())
  updatedAt  DateTime  @updatedAt
}

// 文件夹
model Folder {
  id        String   @id @default(uuid())
  name      String
  icon      String?
  parentId  String?
  parent    Folder?  @relation("FolderTree", fields: [parentId], references: [id])
  children  Folder[] @relation("FolderTree")
  notes     Note[]
  links     Link[]
  sortOrder Int      @default(0)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

// 标签
model Tag {
  id        String   @id @default(uuid())
  name      String   @unique
  color     String?
  notes     Note[]
  links     Link[]
  createdAt DateTime @default(now())
}

// 链接收藏
model Link {
  id        String   @id @default(uuid())
  url       String
  title     String?
  summary   String?
  favicon   String?
  folderId  String?
  folder    Folder?  @relation(fields: [folderId], references: [id])
  tags      Tag[]
  isRead    Boolean  @default(false)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

---

## 📡 API 设计（RESTful）

### 笔记 API
```
GET    /api/notes              # 获取笔记列表（支持搜索、筛选）
GET    /api/notes/:id          # 获取单个笔记
POST   /api/notes              # 创建笔记
PUT    /api/notes/:id          # 更新笔记
DELETE /api/notes/:id          # 删除笔记
```

### 文件夹 API
```
GET    /api/folders            # 获取文件夹树
POST   /api/folders            # 创建文件夹
PUT    /api/folders/:id        # 更新文件夹
DELETE /api/folders/:id        # 删除文件夹（含子内容）
PUT    /api/folders/:id/move   # 移动文件夹
```

### 标签 API
```
GET    /api/tags               # 获取所有标签
POST   /api/tags               # 创建标签
DELETE /api/tags/:id           # 删除标签
```

### 链接 API
```
GET    /api/links              # 获取链接列表
POST   /api/links              # 创建链接（自动抓取元信息）
PUT    /api/links/:id          # 更新链接
DELETE /api/links/:id          # 删除链接
```

### 搜索 API
```
GET    /api/search?q=keyword   # 全文搜索（笔记+链接）
```

---

## 🖥️ 前端页面结构

```
src/
├── pages/
│   └── index.vue              # 唯一主页面（所见即所得）
├── components/
│   ├── layout/
│   │   ├── Sidebar.vue        # 侧边栏（文件夹树+标签）
│   │   └── MainContent.vue    # 主内容区
│   ├── editor/
│   │   ├── MarkdownEditor.vue # Markdown 编辑器
│   │   └── EditorToolbar.vue  # 编辑器工具栏
│   ├── note/
│   │   ├── NoteList.vue       # 笔记列表
│   │   └── NoteCard.vue       # 笔记卡片
│   ├── folder/
│   │   ├── FolderTree.vue     # 文件夹树
│   │   └── FolderItem.vue     # 文件夹项
│   ├── link/
│   │   ├── LinkList.vue       # 链接列表
│   │   ├── LinkCard.vue       # 链接卡片
│   │   └── LinkCollector.vue  # 链接收藏弹窗
│   ├── search/
│   │   └── GlobalSearch.vue   # 全局搜索 (Ctrl+K)
│   └── common/
│       ├── TagSelect.vue      # 标签选择器
│       └── ContextMenu.vue    # 右键菜单
├── stores/
│   ├── note.ts                # 笔记状态
│   ├── folder.ts              # 文件夹状态
│   ├── tag.ts                 # 标签状态
│   └── ui.ts                  # UI 状态（侧边栏、搜索等）
└── api/
    ├── note.ts
    ├── folder.ts
    ├── tag.ts
    ├── link.ts
    └── search.ts
```

---

## ⌨️ 快捷键设计

| 快捷键 | 功能 |
|--------|------|
| `Ctrl + K` | 打开全局搜索 |
| `Ctrl + N` | 新建笔记 |
| `Ctrl + S` | 保存当前笔记 |
| `Ctrl + B` | 切换侧边栏 |
| `Ctrl + E` | 切换编辑/预览模式 |
| `Ctrl + L` | 收藏链接 |

---

## 🎨 UI/UX 设计要点

### 1. 暗色主题优先
- 默认深色主题，护眼
- 支持切换到浅色主题

### 2. 极简界面
- 无多余装饰
- 专注内容本身
- 类似 Obsidian/Typora 风格

### 3. 响应式
- 侧边栏可折叠
- 移动端适配

---

## 🚀 技术选型

| 类别 | 技术 | 说明 |
|------|------|------|
| **Markdown 编辑器** | `@milkdown/core` | 所见即所得 Markdown |
| **代码高亮** | `shiki` | 语法高亮 |
| **搜索** | SQLite FTS5 | 全文搜索 |
| **链接预览** | `cheerio` + `axios` | 抓取网页元信息 |
| **快捷键** | `@vueuse/core` | useMagicKeys |
| **图标** | `@iconify/vue` | 统一图标库 |

---

## 📅 开发阶段规划

### Phase 1: 基础框架（3天）
- [ ] 清理旧代码（登录、博客页面）
- [ ] 重构数据库模型
- [ ] 创建新的页面结构
- [ ] 实现侧边栏布局

### Phase 2: 笔记功能（5天）
- [ ] 集成 Milkdown 编辑器
- [ ] 实现笔记 CRUD
- [ ] 文件夹树形结构
- [ ] 标签系统

### Phase 3: 搜索与链接（3天）
- [ ] 全局搜索 (Ctrl+K)
- [ ] 链接收藏功能
- [ ] 链接元信息抓取

### Phase 4: 体验优化（2天）
- [ ] 快捷键系统
- [ ] 响应式适配
- [ ] 性能优化

---

## 🔄 与旧系统的对比

| 特性 | 旧系统（博客） | 新系统（知识库） |
|------|----------------|------------------|
| 界面 | 前后台分离 | 单一界面 |
| 认证 | 登录系统 | 无需登录 |
| 内容 | 博客文章 | 笔记+链接 |
| 编辑 | 后台编辑 | 即时编辑 |
| 分类 | 分类+标签 | 文件夹+标签 |
| 搜索 | 简单搜索 | 全文搜索 |
| 目标 | 公开展示 | 个人使用 |

---

> **下一步**: 确认此架构设计后，开始 Phase 1 的开发工作。
