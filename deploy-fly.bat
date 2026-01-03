@echo off
REM Fly.io Deployment Script for Strapi CMS (Windows)
REM Cost-optimized deployment with always-available architecture
REM embracingearth.space - Enterprise-grade deployment automation

echo 🚀 Starting Fly.io deployment for Strapi CMS...

REM Check if fly CLI is installed
where fly >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Fly CLI not found. Please install it first:
    echo    iwr https://fly.io/install.ps1 -useb ^| iex
    exit /b 1
)

REM Check if logged in
fly auth whoami >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo ⚠️  Not logged in to Fly.io. Logging in...
    fly auth login
)

REM Check if app exists
fly status >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo 📦 Initializing Fly.io app...
    fly launch --no-deploy --copy-config
    echo ✅ App initialized. Please configure secrets before deploying.
    echo.
    echo Next steps:
    echo 1. Create PostgreSQL database: fly postgres create --name ai2fin-strapi-db --region iad --vm-size shared-cpu-1x --volume-size 3
    echo 2. Attach database: fly postgres attach ai2fin-strapi-db
    echo 3. Set secrets (see FLY_DEPLOYMENT.md)
    echo 4. Run this script again to deploy
    exit /b 0
)

echo 🔍 Checking app status...
fly status

echo.
echo 📤 Deploying to Fly.io...
fly deploy

echo.
echo ✅ Deployment complete!
echo.
echo 🔗 Your app is available at:
fly status | findstr "Hostname" || fly open --show

echo.
echo 📊 View logs: fly logs
echo 🔍 Check status: fly status

pause
