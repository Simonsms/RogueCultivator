@echo off
chcp 65001 >nul
echo.
echo ================================================
echo 🔧 创建测试用户
echo ================================================
echo.

cd backend

echo 检查服务器是否运行...
curl -s http://localhost:5000/api/health >nul 2>&1
if errorlevel 1 (
    echo ❌ 后端服务器未运行！
    echo.
    echo 请先启动服务器：
    echo    cd backend
    echo    npm run dev
    echo.
    pause
    exit /b 1
)

echo ✅ 服务器正在运行
echo.

node create-test-user.js

echo.
pause
