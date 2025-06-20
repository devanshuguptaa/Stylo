# 🚀 Quick Deployment Guide

## Step 1: Prepare Your Code

1. **Initialize Git** (if not already done):
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   ```

2. **Push to GitHub**:
   ```bash
   git remote add origin https://github.com/yourusername/your-repo-name.git
   git push -u origin main
   ```

## Step 2: Choose Your Platform

### 🎯 **Render (Easiest & Most Reliable)**

1. Go to [render.com](https://render.com) and sign up
2. Click "New +" → "Web Service"
3. Connect your GitHub repository
4. Configure:
   - **Name:** `stylo-landing-page`
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
   - **Environment:** Node
5. Click "Create Web Service"

### 🚂 **Railway (Fastest)**

1. Go to [railway.app](https://railway.app) and sign up
2. Click "New Project" → "Deploy from GitHub repo"
3. Select your repository
4. Railway auto-detects Node.js - just click "Deploy Now"

### 🔄 **Cyclic (Simplest)**

1. Go to [cyclic.sh](https://cyclic.sh) and sign up
2. Click "Link Your Own" → "GitHub"
3. Select your repository
4. Click "Deploy"

## Step 3: Set Up Database

### MongoDB Atlas (Free)

1. Go to [mongodb.com/atlas](https://mongodb.com/atlas)
2. Create free account
3. Create new cluster (free tier)
4. Click "Connect" → "Connect your application"
5. Copy the connection string
6. Replace `<password>` with your database password

## Step 4: Configure Environment Variables

In your deployment platform dashboard, add these variables:

```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/stylo?retryWrites=true&w=majority
JWT_SECRET=your-super-secret-jwt-key-here
SESSION_SECRET=your-super-secret-session-key-here
NODE_ENV=production
```

**For Auth0 (Optional):**
```env
AUTH0_DOMAIN=your-domain.auth0.com
AUTH0_CLIENT_ID=your-client-id
AUTH0_CLIENT_SECRET=your-client-secret
```

## Step 5: Deploy!

1. **Render:** Click "Deploy" button
2. **Railway:** Automatic deployment
3. **Cyclic:** Automatic deployment

## Step 6: Test Your Live Site

Your app will be available at:
- **Render:** `https://your-app-name.onrender.com`
- **Railway:** `https://your-app-name.railway.app`
- **Cyclic:** `https://your-app-name.cyclic.app`

## 🎉 You're Live!

Your luxury fashion landing page is now deployed and accessible worldwide!

## 🔧 Troubleshooting

### Common Issues:

1. **Build fails:** Check that all dependencies are in `package.json`
2. **Environment variables:** Make sure all required variables are set
3. **Database connection:** Verify MongoDB URI is correct
4. **Port issues:** Server already uses `process.env.PORT` for deployment

### Need Help?

- Check the deployment platform logs
- Verify all environment variables are set
- Ensure MongoDB Atlas IP whitelist includes `0.0.0.0/0` (all IPs) 