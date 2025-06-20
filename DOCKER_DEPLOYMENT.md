# 🐳 Docker Deployment Guide

## 🚀 Quick Start

### 1. **Local Development**
```bash
# Start development environment
./deploy.sh dev

# Or manually:
docker-compose up -d
```

### 2. **Production Deployment**
```bash
# Deploy to production
./deploy.sh prod

# Or manually:
docker-compose -f docker-compose.prod.yml up -d
```

## 📋 Prerequisites

- **Docker** installed and running
- **Docker Compose** installed
- **Git** for version control

## 🔧 Configuration

### Environment Variables (.env file)
```env
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
```

## 🌐 Access Points

### Development Environment
- **App:** http://localhost:3000
- **Database Admin:** http://localhost:8081 (admin/password123)
- **MongoDB:** localhost:27017

### Production Environment
- **App:** https://localhost (with Nginx)
- **Health Check:** https://localhost/health
- **MongoDB:** Internal only (not exposed)

## 🐳 Docker Commands

### Basic Commands
```bash
# Build image
docker build -t stylo-landing-page .

# Run container
docker run -p 3000:3000 --env-file .env stylo-landing-page

# View logs
docker-compose logs -f

# Stop services
docker-compose down

# Restart services
docker-compose restart
```

### Development Commands
```bash
# Start development environment
docker-compose up -d

# Rebuild and start
docker-compose up -d --build

# View specific service logs
docker-compose logs -f app
docker-compose logs -f mongodb

# Access container shell
docker-compose exec app sh
docker-compose exec mongodb mongosh
```

### Production Commands
```bash
# Deploy to production
docker-compose -f docker-compose.prod.yml up -d

# Scale application
docker-compose -f docker-compose.prod.yml up -d --scale app=3

# Update production
docker-compose -f docker-compose.prod.yml pull
docker-compose -f docker-compose.prod.yml up -d
```

## 🚀 Cloud Deployment Options

### 1. **DigitalOcean App Platform**
```bash
# Create app.yaml
cat > app.yaml << EOF
services:
- name: stylo-app
  source_dir: /
  dockerfile_path: Dockerfile
  environment_slug: node-js
  instance_count: 1
  instance_size_slug: basic-xxs
EOF

# Deploy
doctl apps create --spec app.yaml
```

### 2. **Google Cloud Run**
```bash
# Build and push to Google Container Registry
docker build -t gcr.io/PROJECT_ID/stylo-landing-page .
docker push gcr.io/PROJECT_ID/stylo-landing-page

# Deploy to Cloud Run
gcloud run deploy stylo-landing-page \
  --image gcr.io/PROJECT_ID/stylo-landing-page \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated
```

### 3. **AWS ECS**
```bash
# Create ECS cluster
aws ecs create-cluster --cluster-name stylo-cluster

# Create task definition
aws ecs register-task-definition --cli-input-json file://task-definition.json

# Create service
aws ecs create-service \
  --cluster stylo-cluster \
  --service-name stylo-service \
  --task-definition stylo-task-definition \
  --desired-count 2
```

### 4. **Azure Container Instances**
```bash
# Deploy to Azure
az container create \
  --resource-group myResourceGroup \
  --name stylo-container \
  --image stylo-landing-page:latest \
  --dns-name-label stylo-app \
  --ports 3000
```

## 🔒 Security Best Practices

### 1. **Environment Variables**
- Never commit `.env` files to Git
- Use secrets management in production
- Rotate secrets regularly

### 2. **Network Security**
- Don't expose MongoDB port in production
- Use internal Docker networks
- Implement rate limiting with Nginx

### 3. **Container Security**
- Run containers as non-root user
- Use minimal base images (Alpine)
- Keep images updated

### 4. **SSL/TLS**
- Use Let's Encrypt for free SSL certificates
- Configure Nginx with proper SSL settings
- Enable HTTP/2 for better performance

## 📊 Monitoring & Logging

### Health Checks
```bash
# Check application health
curl http://localhost:3000/api/products

# Check Docker health
docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"
```

### Logs
```bash
# View all logs
docker-compose logs

# Follow logs in real-time
docker-compose logs -f

# View logs for specific service
docker-compose logs app
```

### Metrics
```bash
# Container resource usage
docker stats

# Disk usage
docker system df
```

## 🔧 Troubleshooting

### Common Issues

1. **Port already in use**
   ```bash
   # Find process using port
   lsof -i :3000
   
   # Kill process
   kill -9 PID
   ```

2. **MongoDB connection issues**
   ```bash
   # Check MongoDB logs
   docker-compose logs mongodb
   
   # Test connection
   docker-compose exec mongodb mongosh
   ```

3. **Build failures**
   ```bash
   # Clean build cache
   docker builder prune
   
   # Rebuild without cache
   docker-compose build --no-cache
   ```

4. **Permission issues**
   ```bash
   # Fix file permissions
   sudo chown -R $USER:$USER .
   
   # Make deploy script executable
   chmod +x deploy.sh
   ```

## 📈 Scaling

### Horizontal Scaling
```bash
# Scale application instances
docker-compose -f docker-compose.prod.yml up -d --scale app=3

# Load balancer configuration
# Add to nginx.conf:
upstream app {
    server app:3000;
    server app:3001;
    server app:3002;
}
```

### Vertical Scaling
```bash
# Update docker-compose.prod.yml
services:
  app:
    deploy:
      resources:
        limits:
          memory: 1G
          cpus: '0.5'
        reservations:
          memory: 512M
          cpus: '0.25'
```

## 🎉 Success!

Your Dockerized MERN landing page is now ready for deployment anywhere!

### Next Steps:
1. **Test locally** with `./deploy.sh dev`
2. **Configure production** environment variables
3. **Deploy to cloud** platform of your choice
4. **Set up monitoring** and logging
5. **Configure SSL** certificates
6. **Set up CI/CD** pipeline

## 📞 Support

- **Docker Documentation:** https://docs.docker.com/
- **Docker Compose:** https://docs.docker.com/compose/
- **Nginx Documentation:** https://nginx.org/en/docs/ 