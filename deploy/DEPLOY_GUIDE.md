# 🚀 部署指南 - 肉鸽修仙游戏

## 服务器要求

- Node.js 18+
- Nginx
- PM2 (`npm install -g pm2`)

## 部署步骤

### 1. 上传文件到服务器

将以下文件/文件夹上传到服务器 `/var/www/rogueCultivator/`:

```
rogueCultivator/
├── frontend/dist/       # 前端打包文件
├── backend/
│   ├── dist/           # 后端打包文件
│   ├── prisma/         # Prisma schema
│   ├── package.json
│   └── package-lock.json
└── deploy/             # 部署配置
```

**推荐上传方式：**
```bash
# 本地执行 - 使用 scp 或 rsync
scp -r frontend/dist user@server:/var/www/rogueCultivator/frontend/
scp -r backend/dist backend/prisma backend/package*.json user@server:/var/www/rogueCultivator/backend/
scp deploy/* user@server:/var/www/rogueCultivator/deploy/
```

### 2. 服务器上安装依赖

```bash
cd /var/www/rogueCultivator/backend
npm install --production
```

### 3. 配置环境变量

```bash
# 复制并编辑生产环境配置
cp /var/www/rogueCultivator/deploy/.env.production /var/www/rogueCultivator/backend/.env

# 编辑配置文件，修改以下内容：
# - JWT_SECRET: 改为安全的随机字符串
# - CORS_ORIGIN: 改为你的域名
nano /var/www/rogueCultivator/backend/.env
```

**生成安全的 JWT_SECRET：**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### 4. 初始化数据库

```bash
cd /var/www/rogueCultivator/backend

# 创建数据目录
mkdir -p data

# 生成 Prisma Client
npx prisma generate

# 推送数据库结构
npx prisma db push
```

### 5. 配置 Nginx

```bash
# 复制 Nginx 配置
sudo cp /var/www/rogueCultivator/deploy/nginx.conf /etc/nginx/sites-available/rogue-cultivator

# 编辑配置，修改 server_name 为你的域名
sudo nano /etc/nginx/sites-available/rogue-cultivator

# 创建软链接启用站点
sudo ln -s /etc/nginx/sites-available/rogue-cultivator /etc/nginx/sites-enabled/

# 测试配置
sudo nginx -t

# 重载 Nginx
sudo systemctl reload nginx
```

### 6. 使用 PM2 启动后端

```bash
cd /var/www/rogueCultivator

# 创建日志目录
sudo mkdir -p /var/log/pm2
sudo chown $USER:$USER /var/log/pm2

# 启动应用
pm2 start deploy/ecosystem.config.js

# 设置开机自启
pm2 save
pm2 startup
```

### 7. 验证部署

```bash
# 检查后端状态
pm2 status

# 检查日志
pm2 logs rogue-cultivator-backend

# 测试 API
curl http://localhost:5000/api/health

# 测试前端
curl http://your-domain.com
```

---

## 常用命令

```bash
# PM2 管理
pm2 status                    # 查看状态
pm2 logs                      # 查看日志
pm2 restart all               # 重启
pm2 stop all                  # 停止
pm2 reload ecosystem.config.js # 热重载

# Nginx 管理
sudo systemctl status nginx   # 状态
sudo systemctl reload nginx   # 重载配置
sudo nginx -t                 # 测试配置

# 查看日志
tail -f /var/log/pm2/rogue-cultivator-out.log
tail -f /var/log/nginx/access.log
```

## 更新部署

```bash
# 1. 上传新的打包文件
# 2. 重启后端
pm2 restart rogue-cultivator-backend

# 前端只需替换 dist 文件夹，无需重启
```

## 故障排查

1. **502 Bad Gateway** - 检查后端是否运行: `pm2 status`
2. **404 Not Found** - 检查 Nginx 配置中的路径
3. **CORS 错误** - 检查 `.env` 中的 `CORS_ORIGIN`
4. **数据库错误** - 检查 `DATABASE_URL` 路径和权限
