require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const path = require('path');
const bodyParser = require('body-parser');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const passport = require('passport');
const Auth0Strategy = require('passport-auth0');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('./models/User');
const Contact = require('./models/Contact');
const authRoutes = require('./routes/auth');
const MongoStore = require('connect-mongo');

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(session({
    secret: process.env.SESSION_SECRET || 'a_very_secret_key',
    resave: false,
    saveUninitialized: false, // Don't create session until something stored
    store: MongoStore.create({
        mongoUrl: process.env.MONGODB_URI,
        collectionName: 'sessions', // You can name your session collection
        ttl: 14 * 24 * 60 * 60 // = 14 days. Default is 14 days.
    }),
    cookie: {
        secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
        httpOnly: true, // Prevent client-side access
        maxAge: 1000 * 60 * 60 * 24 // 1 day
    }
}));

// Serve static files
app.use(express.static(__dirname));

app.use(passport.initialize());
app.use(passport.session());

// Database Connection
// Handle both Docker and traditional MongoDB connections
const mongoUri = process.env.MONGODB_URI || process.env.MONGO_URI;

if (!mongoUri) {
    console.error('❌ MongoDB URI not found in environment variables!');
    console.error('Please set either MONGODB_URI or MONGO_URI in your .env file');
    process.exit(1);
}

mongoose.connect(mongoUri)
.then(() => console.log('✅ MongoDB Connected'))
.catch(err => console.error('❌ MongoDB connection error:', err));

// Auth0 Strategy Configuration
const strategy = new Auth0Strategy(
  {
    domain: process.env.AUTH0_DOMAIN,
    clientID: process.env.AUTH0_CLIENT_ID,
    clientSecret: process.env.AUTH0_CLIENT_SECRET,
    callbackURL: process.env.AUTH0_CALLBACK_URL || 'http://localhost:3000/callback'
  },
  async (accessToken, refreshToken, extraParams, profile, done) => {
    try {
        let user = await User.findOne({ email: profile.emails[0].value });
        if (user) {
            return done(null, user);
        } else {
            user = await User.create({
                name: profile.displayName,
                email: profile.emails[0].value,
                password: 'oauth-user-' + Math.random().toString(36).substr(2, 9), // Random password for OAuth users
                googleId: profile.id
            });
            return done(null, user);
        }
    } catch (err) {
        return done(err, null);
    }
  }
);

passport.use(strategy);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id);
        done(null, user);
    } catch (err) {
        done(err, null);
    }
});

// API routes
const products = [
    // --- Womenswear ---
    {
        id: 1,
        name: 'Silk Blend Blouse',
        price: '$129.99',
        imageUrl: 'https://img.freepik.com/free-photo/elegant-woman-blouse-posing_1303-10853.jpg?w=826&t=st=1716325943~exp=1716326543~hmac=e2c131a349c2a38b688d05a41c191a6208a56f6c6d32ab19559c3f41fc53a812',
        category: 'Womenswear',
        description: 'An effortlessly elegant blouse crafted from a luxurious silk blend. Features a relaxed fit and concealed buttons for a clean, minimalist look.'
    },
    {
        id: 4,
        name: 'Tailored Wide-Leg Trousers',
        price: '$149.99',
        imageUrl: 'https://img.freepik.com/free-photo/fashion-woman-with-brown-suit-hat_1303-16279.jpg?w=826&t=st=1716326002~exp=1716326602~hmac=da22a76f62b72448a47466249219602fe2862d22a5a5877c445653b6f9e2b467',
        category: 'Womenswear',
        description: 'Expertly tailored from a fine wool blend, these trousers offer a sophisticated wide-leg silhouette. Perfect for creating a polished look.'
    },
    {
        id: 7,
        name: 'Cashmere Crewneck',
        price: '$249.99',
        imageUrl: 'https://img.freepik.com/free-photo/young-woman-knitted-sweater-isolated_1303-20700.jpg?w=826&t=st=1716326057~exp=1716326657~hmac=4b898956277085734c3a51f505307a0e363b15d6e27a69b09a4d87178c1c4b7b',
        category: 'Womenswear',
        description: 'Indulge in the unparalleled softness of pure cashmere. This timeless crewneck sweater is a wardrobe investment for seasons to come.'
    },
    {
        id: 8,
        name: 'Structured-Shoulder Blazer',
        price: '$299.99',
        imageUrl: 'https://img.freepik.com/free-photo/fashionable-woman-wearing-a-black-suit_1303-16322.jpg?w=826&t=st=1716326102~exp=1716326702~hmac=62174c3d25b525d886566d252f4c4a7c800b63901b87a8f89e1b2131972b9044',
        category: 'Womenswear',
        description: 'A statement of power and style. Our blazer features sharp tailoring and structured shoulders for a commanding presence.'
    },

    // --- Menswear ---
    {
        id: 2,
        name: 'Fine-Knit Polo Shirt',
        price: '$119.99',
        imageUrl: 'https://img.freepik.com/free-photo/man-wearing-a-black-mockup-polo-shirt_53876-98782.jpg?w=826&t=st=1716326154~exp=1716326754~hmac=f02272e298e6c46a67f70621370b1357b98d36376d29c349d5d88f6c3214b60e',
        category: 'Menswear',
        description: 'A modern classic, our polo is crafted from 100% extra-fine merino wool for a soft, breathable, and comfortable fit. Perfect for any season.'
    },
    {
        id: 3,
        name: 'Leather Bomber Jacket',
        price: '$499.99',
        imageUrl: 'https://img.freepik.com/free-photo/handsome-man-posing_144627-9381.jpg?w=826&t=st=1716326194~exp=1716326794~hmac=a45053e1ad9655e81d89b3ca7e7a3f5f8d68d1b1f09403d6f1c422c544838612',
        category: 'Menswear',
        description: 'Elevate your outerwear with this luxurious lambskin leather bomber jacket. Featuring a clean, minimalist design and premium hardware for a refined finish.'
    },
    {
        id: 9,
        name: 'Pleated Tapered Trousers',
        price: '$189.99',
        imageUrl: 'https://img.freepik.com/free-photo/full-shot-man-posing-with-hand-his-pocket_23-2148815121.jpg?w=826&t=st=1716326233~exp=1716326833~hmac=fde420e6f65809859f7df8b1f4c7d03bb6381665e77114ee2858b4b216ce5805',
        category: 'Menswear',
        description: 'Engineered for the modern man. These trousers feature sharp pleats and a tapered leg for a clean, contemporary silhouette.'
    },
    {
        id: 10,
        name: 'Classic Trench Coat',
        price: '$599.99',
        imageUrl: 'https://img.freepik.com/free-photo/stylish-man-trench-coat-city_1303-30514.jpg?w=826&t=st=1716326270~exp=1716326870~hmac=62174c10609d936168e3d23199c080004f1416e9034f18d783d7395011707525',
        category: 'Menswear',
        description: 'A timeless icon of style. Our trench coat is crafted from durable, water-resistant cotton gabardine and features a classic, structured silhouette.'
    },

    // --- Footwear ---
    {
        id: 5,
        name: 'Derby Shoes',
        price: '$229.99',
        imageUrl: 'https://img.freepik.com/free-photo/brown-leather-shoes_1203-8025.jpg?w=1480&t=st=1716326322~exp=1716326922~hmac=3ab6f24e9306b6b69f6e6aa4f8c9d090c0b8755b394b281f62d142142e0540e1',
        category: 'Footwear',
        description: 'Handcrafted from full-grain calfskin leather, these Derby shoes offer timeless style and exceptional comfort. A versatile choice for any occasion.'
    },
    {
        id: 11,
        name: 'Premium Leather Sneakers',
        price: '$199.99',
        imageUrl: 'https://img.freepik.com/free-photo/pair-white-sneakers_1203-7529.jpg?w=1480&t=st=1716326363~exp=1716326963~hmac=130c5e7b3997d264f3d2f264875a6c02a7e2894b1509a25b2a0c7c10b7194f1c',
        category: 'Footwear',
        description: 'Clean, versatile, and luxurious. These minimalist sneakers are handcrafted from supple Italian leather for a premium look and feel.'
    },
    {
        id: 12,
        name: 'Jodhpur Boots',
        price: '$279.99',
        imageUrl: 'https://img.freepik.com/free-photo/brown-suede-chelsea-boots-men-s-fashion-shoot_53876-116524.jpg?w=826&t=st=1716326399~exp=1716326999~hmac=132c1c3f3f2d01e459a98c8c73b06cf72a5a546059635dd3d720700c25a77477',
        category: 'Footwear',
        description: 'A modern staple, our Jodhpur boots are made from rich, polished leather and feature a durable sole for all-day comfort.'
    },

    // --- Accessories ---
    {
        id: 6,
        name: 'Full-Grain Leather Belt',
        price: '$79.99',
        imageUrl: 'https://img.freepik.com/free-psd/classic-leather-belt-isolated-transparent-background_191095-23588.jpg?w=1380&t=st=1716326442~exp=1716327042~hmac=9485141019f2fb10d486927cb704a43477e3c88019e09d11a91e3e78f9f7d08b',
        category: 'Accessories',
        description: 'The perfect finishing touch. This belt is crafted from premium full-grain leather and features a polished silver-tone buckle.'
    },
    {
        id: 13,
        name: 'Leather Portfolio',
        price: '$349.99',
        imageUrl: 'https://img.freepik.com/free-photo/still-life-business-objects_23-2147659178.jpg?w=826&t=st=1716326477~exp=1716327077~hmac=735a11c19550085a67c51950d24e1d6d895b66d4c1b994807a51804f37803734',
        category: 'Accessories',
        description: 'A sophisticated companion for the modern professional. This portfolio is crafted from smooth calfskin leather and has space for a laptop and documents.'
    },
    {
        id: 14,
        name: 'Swiss Movement Watch',
        price: '$799.99',
        imageUrl: 'https://img.freepik.com/free-photo/close-up-watch_23-2148924080.jpg?w=826&t=st=1716326522~exp=1716327122~hmac=ac31a7b409dd43e498c360098a5871f33a9ce4257121287c2b740ca048866170',
        category: 'Accessories',
        description: 'A masterpiece of horology. This automatic watch features a sapphire crystal, a Swiss movement, and a stainless steel case for enduring style.'
    }
];

const categories = [
    {
        name: 'Womenswear',
        imageUrl: 'https://img.freepik.com/free-photo/gorgeous-woman-posing-against-wall_1303-10870.jpg?w=826&t=st=1716326639~exp=1716327239~hmac=32470726194a8227b689a742878c772e27db59868e83344d5c9f52f4165d3ce9'
    },
    {
        name: 'Menswear',
        imageUrl: 'https://img.freepik.com/free-photo/handsome-confident-stylish-hipster-lambersexual-model_158538-13426.jpg?w=826&t=st=1716326694~exp=1716327294~hmac=553530e38a2e153b320d57a3e8c18d7455856c9e99a89fd5986561219b670305'
    },
    {
        name: 'Footwear',
        imageUrl: 'https://img.freepik.com/free-photo/men-s-shoes_1203-8675.jpg?w=1480&t=st=1716326727~exp=1716327327~hmac=2e04e26217c062c3e108873428d00922485303c09e394f479e0a0d9b4c063f2b'
    },
    {
        name: 'Accessories',
        imageUrl: 'https://img.freepik.com/free-photo/flat-lay-watch-glasses-with-copy-space_23-2148352614.jpg?w=1480&t=st=1716326764~exp=1716327364~hmac=5be13d6a2f4c40751a44e760c675342a78d067c29e46a7ce74a4a19904d058ab'
    }
];

app.get('/api/products', (req, res) => {
    const { category } = req.query;
    if (category) {
        const filteredProducts = products.filter(p => p.category === category);
        res.json(filteredProducts);
    } else {
        res.json(products);
    }
});

app.get('/api/categories', (req, res) => {
    res.json(categories);
});

// Contact form endpoint
app.post('/api/contact', async (req, res) => {
    try {
        const { name, email, message } = req.body;

        // Validation is now handled by Mongoose schema, but this is a good first check
        if (!name || !email || !message) {
            return res.status(400).json({ msg: 'Please enter all fields' });
        }
        
        const newContact = new Contact({
            name,
            email,
            message
        });

        await newContact.save();

        res.status(201).json({ msg: 'Message received and stored successfully!' });

    } catch (error) {
        console.error('Contact form submission error:', error.message);
        res.status(500).json({ msg: 'Server error. Could not store message.' });
    }
});

// Auth routes
app.use('/api/auth', require('./routes/auth'));

// Route to check auth status
app.get('/api/auth/status', (req, res) => {
    // Check for JWT token first (traditional auth)
    const token = req.headers.authorization?.split(' ')[1] || req.cookies?.token;
    
    if (token) {
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            return res.json({ loggedIn: true, user: { name: decoded.name, email: decoded.email } });
        } catch (error) {
            // Token invalid, continue to check session
        }
    }
    
    // Check for session-based auth (Auth0)
    if (req.isAuthenticated()) {
        return res.json({ loggedIn: true, user: { name: req.user.name, email: req.user.email } });
    }
    
    res.json({ loggedIn: false });
});

// Auth0 routes
app.get('/auth/google', passport.authenticate('auth0', {
    scope: 'openid email profile'
}), (req, res) => {
    res.redirect('/');
});

app.get('/callback', (req, res, next) => {
    passport.authenticate('auth0', (err, user, info) => {
        if (err) { return next(err); }
        if (!user) { return res.redirect('/index.html'); }
        req.logIn(user, (err) => {
            if (err) { return next(err); }
            res.redirect('/index.html');
        });
    })(req, res, next);
});

app.get('/logout', (req, res) => {
    // Clear JWT token first
    res.clearCookie('token');
    
    // Check if user is authenticated via Auth0 session
    if (req.isAuthenticated()) {
        // Check if Auth0 is properly configured
        if (!process.env.AUTH0_DOMAIN || !process.env.AUTH0_CLIENT_ID) {
            console.warn('Auth0 not properly configured, using simple logout');
            req.logout((err) => {
                if (err) {
                    console.error("Logout error:", err);
                }
                res.redirect('/logout.html');
            });
            return;
        }
        
        // User is logged in via Auth0, redirect to Auth0 logout
        try {
            const logoutURL = new URL(`https://${process.env.AUTH0_DOMAIN}/v2/logout`);
            let returnTo = req.protocol + '://' + req.hostname;
            const port = req.connection.localPort;
            if (port !== undefined && port !== 80 && port !== 443) {
                returnTo += ':' + port;
            }
            logoutURL.search = `client_id=${process.env.AUTH0_CLIENT_ID}&returnTo=${returnTo}`;
            
            req.logout((err) => {
                if (err) {
                    console.error("Logout error:", err);
                }
                res.redirect(logoutURL.toString());
            });
        } catch (error) {
            console.error('Auth0 logout URL creation error:', error);
            // Fallback to simple logout
            req.logout((err) => {
                if (err) {
                    console.error("Logout error:", err);
                }
                res.redirect('/logout.html');
            });
        }
    } else {
        // User was logged in via JWT, redirect to logout page
        res.redirect('/logout.html');
    }
});

// Route to serve logout page
app.get('/logout.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'logout.html'));
});

// Route to serve signin page
app.get('/signin.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'signin.html'));
});

app.get('/signup.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'signup.html'));
});

// Route to serve other HTML pages
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/index.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/contact.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'contact.html'));
});

app.get('/category.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'category.html'));
});

// Route to serve CSS file
app.get('/style.css', (req, res) => {
    res.sendFile(path.join(__dirname, 'style.css'));
});

// Route to serve JavaScript files
app.get('/signin.js', (req, res) => {
    res.sendFile(path.join(__dirname, 'signin.js'));
});

app.get('/signup.js', (req, res) => {
    res.sendFile(path.join(__dirname, 'signup.js'));
});

app.get('/script.js', (req, res) => {
    res.sendFile(path.join(__dirname, 'script.js'));
});

app.get('/contact.js', (req, res) => {
    res.sendFile(path.join(__dirname, 'contact.js'));
});

app.get('/category.js', (req, res) => {
    res.sendFile(path.join(__dirname, 'category.js'));
});

app.get('/logout.js', (req, res) => {
    res.sendFile(path.join(__dirname, 'logout.js'));
});

// Traditional authentication routes
app.post('/api/auth/signup', async (req, res) => {
    try {
        const { name, email, password } = req.body;
        
        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ msg: 'User already exists' });
        }
        
        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        
        // Create new user
        const user = new User({
            name,
            email,
            password: hashedPassword
        });
        
        await user.save();
        
        res.status(201).json({ msg: 'User created successfully' });
    } catch (error) {
        console.error('Signup error:', error);
        res.status(500).json({ msg: 'Server error' });
    }
});

app.post('/api/auth/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        
        // Check if user exists
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ msg: 'Invalid credentials' });
        }
        
        // Check password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ msg: 'Invalid credentials' });
        }
        
        // Create JWT token
        const token = jwt.sign(
            { userId: user._id, name: user.name, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );
        
        // Set token in cookie
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 24 * 60 * 60 * 1000 // 24 hours
        });
        
        res.json({ msg: 'Login successful', token });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ msg: 'Server error' });
    }
});

// Final catch-all for single-page app experience
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
}); 