@echo off
chcp 65001 >nul
echo.
echo ================================================
echo 🚀 后端 API 快速测试
echo ================================================
echo.

REM 检查服务器是否运行
curl -s http://localhost:5000/api/health >nul 2>&1
if errorlevel 1 (
    echo ❌ 服务器未运行！
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

REM 生成唯一的时间戳
for /f "tokens=2 delims==" %%I in ('wmic os get localdatetime /value') do set datetime=%%I
set timestamp=%datetime:~0,14%

echo ================================================
echo 测试 1: 健康检查
echo ================================================
curl -s http://localhost:5000/api/health
echo.
echo.

echo ================================================
echo 测试 2: 用户注册
echo ================================================
curl -s -X POST http://localhost:5000/api/auth/register ^
  -H "Content-Type: application/json" ^
  -d "{\"username\":\"test_%timestamp%\",\"email\":\"test_%timestamp%@example.com\",\"password\":\"password123\",\"nickname\":\"Test User\"}"
echo.
echo.

echo ================================================
echo 测试 3: 用户登录
echo ================================================
curl -s -X POST http://localhost:5000/api/auth/login ^
  -H "Content-Type: application/json" ^
  -d "{\"email\":\"test_%timestamp%@example.com\",\"password\":\"password123\"}"
echo.
echo.

echo ================================================
echo 测试 4: 404 错误
echo ================================================
curl -s http://localhost:5000/api/notfound
echo.
echo.

echo ================================================
echo 📊 测试完成！
echo ================================================
echo.
echo 如果看到 JSON 响应，说明 API 工作正常！
echo.
echo 更详细的测试请运行：
echo    node test-api.js
echo.
pause
