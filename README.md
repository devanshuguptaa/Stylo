# Stylo - Luxury Fashion Landing Page

A modern, responsive landing page for a luxury fashion brand built with MERN stack.

## 🚀 Free Deployment Options

### Option 1: Render (Recommended)

1. **Sign up** at [render.com](https://render.com) (free tier available)
2. **Connect your GitHub** repository
3. **Create a new Web Service**
4. **Configure settings:**
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
   - **Environment:** Node

5. **Add Environment Variables:**
   ```
   NODE_ENV=production
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   SESSION_SECRET=your_session_secret
   AUTH0_DOMAIN=your_auth0_domain
   AUTH0_CLIENT_ID=your_auth0_client_id
   AUTH0_CLIENT_SECRET=your_auth0_client_secret
   ```

6. **Deploy!** Your app will be available at `https://your-app-name.onrender.com`

### Option 2: Railway

1. **Sign up** at [railway.app](https://railway.app) (free tier available)
2. **Connect your GitHub** repository
3. **Deploy automatically** - Railway detects Node.js apps
4. **Add environment variables** in the dashboard
5. **Get your live URL** instantly

### Option 3: Cyclic

1. **Sign up** at [cyclic.sh](https://cyclic.sh) (free tier available)
2. **Connect your GitHub** repository
3. **Deploy with one click**
4. **Add environment variables** in the dashboard

### Option 4: Vercel

1. **Sign up** at [vercel.com](https://vercel.com) (free tier available)
2. **Import your GitHub** repository
3. **Configure as Node.js** project
4. **Add environment variables**
5. **Deploy automatically**

## 🗄️ Database Setup

### MongoDB Atlas (Free)

1. **Sign up** at [mongodb.com/atlas](https://mongodb.com/atlas)
2. **Create a free cluster**
3. **Get your connection string**
4. **Add to environment variables** as `MONGODB_URI`

## 🔐 Authentication Setup

### Auth0 (Free Tier)

1. **Sign up** at [auth0.com](https://auth0.com)
2. **Create a new application**
3. **Configure Google OAuth**
4. **Get your credentials** and add to environment variables

## 📁 Project Structure

```
landing-page/
├── server.js          # Main server file
├── package.json       # Dependencies
├── .env              # Environment variables (not in git)
├── .gitignore        # Git ignore file
├── render.yaml       # Render deployment config
├── index.html        # Home page
├── signin.html       # Sign in page
├── signup.html       # Sign up page
├── contact.html      # Contact page
├── category.html     # Category page
├── logout.html       # Logout page
├── style.css         # Main stylesheet
├── script.js         # Main JavaScript
├── signin.js         # Sign in functionality
├── signup.js         # Sign up functionality
├── contact.js        # Contact form
├── category.js       # Category page
├── logout.js         # Logout functionality
├── models/           # Database models
│   ├── User.js
│   └── Contact.js
└── routes/           # API routes
    └── auth.js
```

## 🛠️ Local Development

1. **Clone the repository**
2. **Install dependencies:** `npm install`
3. **Create `.env` file** with your environment variables
4. **Start the server:** `npm start`
5. **Visit:** `http://localhost:3000`

## 🌟 Features

- ✅ Responsive design
- ✅ User authentication (email/password + Google OAuth)
- ✅ Product catalog with categories
- ✅ Contact form with MongoDB storage
- ✅ Modern UI/UX design
- ✅ Mobile-friendly navigation
- ✅ Professional styling

## 📱 Technologies Used

- **Frontend:** HTML5, CSS3, JavaScript (ES6+)
- **Backend:** Node.js, Express.js
- **Database:** MongoDB with Mongoose
- **Authentication:** JWT + Auth0
- **Styling:** Custom CSS with CSS Variables
- **Deployment:** Render/Railway/Cyclic/Vercel

## 🔧 Environment Variables

Create a `.env` file in the root directory:

```env
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
SESSION_SECRET=your_session_secret
AUTH0_DOMAIN=your_auth0_domain
AUTH0_CLIENT_ID=your_auth0_client_id
AUTH0_CLIENT_SECRET=your_auth0_client_secret
NODE_ENV=development
```

## 📄 License

This project is open source and available under the [MIT License](LICENSE). 