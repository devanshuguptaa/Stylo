#!/bin/bash

# Stylo Landing Page - Docker Deployment Script
# Usage: ./deploy.sh [dev|prod]

set -e

ENVIRONMENT=${1:-dev}
COMPOSE_FILE="docker-compose.yml"

if [ "$ENVIRONMENT" = "prod" ]; then
    COMPOSE_FILE="docker-compose.prod.yml"
    echo "🚀 Deploying to PRODUCTION environment..."
else
    echo "🔧 Deploying to DEVELOPMENT environment..."
fi

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker first."
    exit 1
fi

# Check if .env file exists
if [ ! -f .env ]; then
    echo "⚠️  .env file not found. Creating from template..."
    cat > .env << EOF
# MongoDB Configuration
MONGO_ROOT_USERNAME=admin
MONGO_ROOT_PASSWORD=your_secure_password_here

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_here
SESSION_SECRET=your_super_secret_session_key_here

# Auth0 Configuration (Optional)
AUTH0_DOMAIN=your-domain.auth0.com
AUTH0_CLIENT_ID=your-client-id
AUTH0_CLIENT_SECRET=your-client-secret

# Application Configuration
NODE_ENV=development
PORT=3000
EOF
    echo "✅ .env file created. Please update with your actual values."
fi

# Stop existing containers
echo "🛑 Stopping existing containers..."
docker-compose -f $COMPOSE_FILE down

# Remove old images (optional)
if [ "$ENVIRONMENT" = "prod" ]; then
    echo "🧹 Cleaning up old images..."
    docker system prune -f
fi

# Build and start containers
echo "🔨 Building and starting containers..."
docker-compose -f $COMPOSE_FILE up -d --build

# Wait for services to be ready
echo "⏳ Waiting for services to be ready..."
sleep 10

# Check if services are running
echo "🔍 Checking service status..."
docker-compose -f $COMPOSE_FILE ps

# Show logs
echo "📋 Recent logs:"
docker-compose -f $COMPOSE_FILE logs --tail=20

echo ""
echo "🎉 Deployment completed!"
echo ""
if [ "$ENVIRONMENT" = "prod" ]; then
    echo "🌐 Production URLs:"
    echo "   - App: https://localhost"
    echo "   - Health: https://localhost/health"
else
    echo "🌐 Development URLs:"
    echo "   - App: http://localhost:3000"
    echo "   - Database Admin: http://localhost:8081 (admin/password123)"
fi
echo ""
echo "📊 Useful commands:"
echo "   - View logs: docker-compose -f $COMPOSE_FILE logs -f"
echo "   - Stop services: docker-compose -f $COMPOSE_FILE down"
echo "   - Restart: docker-compose -f $COMPOSE_FILE restart"
echo "" 