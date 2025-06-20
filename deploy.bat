@echo off
REM Stylo Landing Page - Docker Deployment Script for Windows
REM Usage: deploy.bat [dev|prod]

setlocal enabledelayedexpansion

set ENVIRONMENT=%1
if "%ENVIRONMENT%"=="" set ENVIRONMENT=dev

set COMPOSE_FILE=docker-compose.yml
if "%ENVIRONMENT%"=="prod" (
    set COMPOSE_FILE=docker-compose.prod.yml
    echo 🚀 Deploying to PRODUCTION environment...
) else (
    echo 🔧 Deploying to DEVELOPMENT environment...
)

REM Check if Docker is running
docker info >nul 2>&1
if errorlevel 1 (
    echo ❌ Docker is not running. Please start Docker Desktop first.
    pause
    exit /b 1
)

REM Check if .env file exists
if not exist .env (
    echo ⚠️  .env file not found. Creating from template...
    (
        echo # MongoDB Configuration
        echo MONGO_ROOT_USERNAME=admin
        echo MONGO_ROOT_PASSWORD=dev1729
        echo.
        echo # MongoDB Atlas Connection String (for traditional npm start)
        echo MONGODB_URI=mongodb+srv://ggd87087:dev1729@stylo.cef2n6d.mongodb.net/?retryWrites=true&w=majority&appName=stylo
        echo.
        echo # JWT Configuration
        echo JWT_SECRET=8f4a7b2d9e1c6a0f3b5c8d7e9f0a2b4c6d8e1f3a7b9c0d2e5f1a3b6c8d0e2f4a
        echo SESSION_SECRET=fsfhbbjhffsesrtghgd5r6tughvds56ghgh
        echo.
        echo # Auth0 Configuration ^(Optional^)
        echo AUTH0_DOMAIN=dev-1729-letssee.us.auth0.com
        echo AUTH0_CLIENT_ID=LGkQWjt2SkK3mdL6UvkWmXGax8Y4R9k7
        echo AUTH0_CLIENT_SECRET=CoDzcN1NV6h83aG88griy64p2SWFrYd_Unlz4XOXRH3XSJiwGNc1FCS3zkU5fC2_
        echo.
        echo # Application Configuration
        echo NODE_ENV=development
        echo PORT=3000
    ) > .env
    echo ✅ .env file created. Please update with your actual values.
)

REM Stop existing containers
echo 🛑 Stopping existing containers...
docker-compose -f %COMPOSE_FILE% down

REM Remove old images (optional for production)
if "%ENVIRONMENT%"=="prod" (
    echo 🧹 Cleaning up old images...
    docker system prune -f
)

REM Build and start containers
echo 🔨 Building and starting containers...
docker-compose -f %COMPOSE_FILE% up -d --build

REM Wait for services to be ready
echo ⏳ Waiting for services to be ready...
timeout /t 10 /nobreak >nul

REM Check if services are running
echo 🔍 Checking service status...
docker-compose -f %COMPOSE_FILE% ps

REM Show logs
echo 📋 Recent logs:
docker-compose -f %COMPOSE_FILE% logs --tail=20

echo.
echo 🎉 Deployment completed!
echo.
if "%ENVIRONMENT%"=="prod" (
    echo 🌐 Production URLs:
    echo    - App: https://localhost
    echo    - Health: https://localhost/health
) else (
    echo 🌐 Development URLs:
    echo    - App: http://localhost:3000
    echo    - Database Admin: http://localhost:8081 ^(admin/password123^)
)
echo.
echo 📊 Useful commands:
echo    - View logs: docker-compose -f %COMPOSE_FILE% logs -f
echo    - Stop services: docker-compose -f %COMPOSE_FILE% down
echo    - Restart: docker-compose -f %COMPOSE_FILE% restart
echo.
pause 