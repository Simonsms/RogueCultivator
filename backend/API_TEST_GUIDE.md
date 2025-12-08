# 🧪 后端 API 测试指南

## 📋 测试清单

### ✅ 测试方法

我们提供 **3 种测试方式**：

1. **使用 curl 命令**（推荐，快速验证）
2. **使用 Postman/Apifox**（可视化，适合详细测试）
3. **使用测试脚本**（自动化测试）

---

## 🚀 方法 1：使用 curl 命令

### 1. 启动后端服务器

```bash
cd backend
npm run dev
```

**预期输出：**
```
✅ Database connected
🚀 Server running on http://localhost:5000
📝 Environment: development
🔐 CORS Origin: http://localhost:3000
```

### 2. 测试健康检查

```bash
curl http://localhost:5000/api/health
```

**预期响应：**
```json
{
  "success": true,
  "message": "Server is running",
  "timestamp": "2024-12-08T..."
}
```

### 3. 测试用户注册

```bash
curl -X POST http://localhost:5000/api/auth/register ^
  -H "Content-Type: application/json" ^
  -d "{\"username\":\"testuser\",\"email\":\"test@example.com\",\"password\":\"password123\",\"nickname\":\"Test User\"}"
```

**预期响应：**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "...",
      "username": "testuser",
      "email": "test@example.com",
      "nickname": "Test User",
      "role": "USER",
      "createdAt": "..."
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  },
  "message": "User registered successfully"
}
```

### 4. 测试用户登录

```bash
curl -X POST http://localhost:5000/api/auth/login ^
  -H "Content-Type: application/json" ^
  -d "{\"email\":\"test@example.com\",\"password\":\"password123\"}"
```

**预期响应：**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "...",
      "username": "testuser",
      "email": "test@example.com",
      "nickname": "Test User",
      "avatar": null,
      "bio": null,
      "role": "USER",
      "createdAt": "..."
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  },
  "message": "Logged in successfully"
}
```

### 5. 测试获取用户信息（需要 Token）

**注意：** 将下面的 `YOUR_TOKEN` 替换为上面登录返回的 token

```bash
curl http://localhost:5000/api/auth/me ^
  -H "Authorization: Bearer YOUR_TOKEN"
```

**预期响应：**
```json
{
  "success": true,
  "data": {
    "id": "...",
    "username": "testuser",
    "email": "test@example.com",
    "nickname": "Test User",
    "avatar": null,
    "bio": null,
    "role": "USER",
    "createdAt": "..."
  }
}
```

### 6. 测试无效 Token

```bash
curl http://localhost:5000/api/auth/me ^
  -H "Authorization: Bearer invalid_token"
```

**预期响应：**
```json
{
  "success": false,
  "message": "Invalid token"
}
```

### 7. 测试不存在的路由

```bash
curl http://localhost:5000/api/notfound
```

**预期响应：**
```json
{
  "success": false,
  "message": "Route /api/notfound not found"
}
```

---

## 🎨 方法 2：使用 Postman/Apifox

### 1. 导入 API 集合

创建以下请求：

#### Request 1: Health Check
- **方法：** GET
- **URL：** `http://localhost:5000/api/health`
- **Headers：** 无

#### Request 2: Register
- **方法：** POST
- **URL：** `http://localhost:5000/api/auth/register`
- **Headers：** `Content-Type: application/json`
- **Body (JSON):**
```json
{
  "username": "testuser",
  "email": "test@example.com",
  "password": "password123",
  "nickname": "Test User"
}
```

#### Request 3: Login
- **方法：** POST
- **URL：** `http://localhost:5000/api/auth/login`
- **Headers：** `Content-Type: application/json`
- **Body (JSON):**
```json
{
  "email": "test@example.com",
  "password": "password123"
}
```

#### Request 4: Get Current User
- **方法：** GET
- **URL：** `http://localhost:5000/api/auth/me`
- **Headers：** `Authorization: Bearer <your_token_here>`

---

## 🤖 方法 3：使用自动化测试脚本

创建测试脚本文件。

---

## 📊 验证数据库

### 1. 使用 Prisma Studio

```bash
cd backend
npm run prisma:studio
```

**会打开浏览器：** `http://localhost:5555`

在这里你可以：
- ✅ 查看所有表
- ✅ 查看用户数据
- ✅ 编辑数据
- ✅ 删除数据

### 2. 查看 SQLite 数据库

数据库文件位置：`backend/dev.db`

**使用 VS Code 插件：** SQLite Viewer

---

## ✅ 验证检查清单

### 服务器启动检查
- [ ] ✅ 服务器成功启动在 `http://localhost:5000`
- [ ] ✅ 显示 "Database connected"
- [ ] ✅ 无报错信息

### API 端点检查
- [ ] ✅ `GET /api/health` 返回成功
- [ ] ✅ `POST /api/auth/register` 可以注册新用户
- [ ] ✅ `POST /api/auth/login` 可以登录
- [ ] ✅ `GET /api/auth/me` 需要 Token 才能访问
- [ ] ✅ 无效 Token 返回 401 错误

### 数据库检查
- [ ] ✅ 用户数据保存到数据库
- [ ] ✅ 密码已加密（不是明文）
- [ ] ✅ 自动生成 UUID
- [ ] ✅ createdAt 和 updatedAt 自动填充

### 安全性检查
- [ ] ✅ 密码未在响应中返回
- [ ] ✅ Token 正确生成
- [ ] ✅ CORS 配置正确
- [ ] ✅ 错误信息不泄露敏感数据

---

## 🔍 常见问题排查

### 问题 1: 服务器启动失败

**错误：** `Error: Cannot find module`

**解决：**
```bash
cd backend
npm install
```

### 问题 2: 数据库连接失败

**错误：** `PrismaClientInitializationError`

**解决：**
```bash
cd backend
npm run prisma:generate
npm run prisma:push
```

### 问题 3: 端口被占用

**错误：** `EADDRINUSE: address already in use :::5000`

**解决：**
1. 杀死占用 5000 端口的进程
2. 或修改 `.env` 中的 `PORT=5001`

### 问题 4: CORS 错误

**错误：** 前端请求被 CORS 阻止

**解决：**
检查 `.env` 中的 `CORS_ORIGIN` 是否与前端地址匹配

---

## 🎯 快速验证命令（全部测试）

### Windows (CMD)

```batch
@echo off
echo ===================================
echo 测试 1: 健康检查
curl http://localhost:5000/api/health
echo.
echo.

echo ===================================
echo 测试 2: 用户注册
curl -X POST http://localhost:5000/api/auth/register -H "Content-Type: application/json" -d "{\"username\":\"testuser2\",\"email\":\"test2@example.com\",\"password\":\"password123\"}"
echo.
echo.

echo ===================================
echo 测试 3: 用户登录
curl -X POST http://localhost:5000/api/auth/login -H "Content-Type: application/json" -d "{\"email\":\"test2@example.com\",\"password\":\"password123\"}"
echo.
echo.

echo ===================================
echo 所有测试完成！
pause
```

**保存为：** `backend/test-api.bat`

**运行：**
```bash
cd backend
test-api.bat
```

---

## 📈 性能测试（可选）

### 测试并发请求

```bash
# 安装测试工具
npm install -g autocannon

# 测试健康检查端点
autocannon -c 100 -d 10 http://localhost:5000/api/health
```

---

## 🎉 验证成功标准

如果你看到以下结果，说明后端完全正常：

✅ **1. 服务器启动**
```
✅ Database connected
🚀 Server running on http://localhost:5000
```

✅ **2. 健康检查成功**
```json
{ "success": true, "message": "Server is running" }
```

✅ **3. 注册成功**
- 返回用户信息
- 返回 JWT Token
- 密码已加密存储

✅ **4. 登录成功**
- 可以用邮箱和密码登录
- 返回 Token

✅ **5. 认证成功**
- 带 Token 可以访问受保护路由
- 无 Token 返回 401

✅ **6. 数据库正常**
- Prisma Studio 可以打开
- 可以看到用户数据

---

## 💡 下一步

验证通过后，你可以：

1. ✅ 继续开发其他 API（文章、分类、标签）
2. ✅ 开始前后端联调
3. ✅ 编写单元测试
4. ✅ 添加 API 文档（Swagger）

---

**🎊 后端验证完成！可以开始前后端联调了！** 🚀
