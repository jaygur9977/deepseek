// require('dotenv').config();
// const express = require('express');
// const mongoose = require('mongoose');
// const cors = require('cors');
// const app = express();

// // Middleware
// app.use(cors());
// app.use(express.json());
// app.use(express.static('public'));
// app.use(express.urlencoded({ extended: true }));

// // MongoDB Connection
// mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017earn', {
//     useNewUrlParser: true,
//     useUnifiedTopology: true
// })
// .then(() => console.log('Connected to MongoDB'))
// .catch(err => console.error('MongoDB connection error:', err));

// // User Schema
// const userSchema = new mongoose.Schema({
//     username: { type: String, required: true, unique: true },
//     password: { type: String, required: true },
//     balance: { type: Number, default: 0 },
//     adsWatched: { type: Number, default: 0 },
//     lastAdWatched: { type: Date }
// });

// const User = mongoose.model('User', userSchema);

// // Routes
// app.get('/', (req, res) => {
//     res.sendFile(__dirname + '/views/index.html');
// });

// app.get('/dashboard', (req, res) => {
//     res.sendFile(__dirname + '/views/dashboard.html');
// });

// app.get('/watch-ad', (req, res) => {
//     res.sendFile(__dirname + '/views/watch-ad.html');
// });

// // API Routes
// app.post('/api/register', async (req, res) => {
//     try {
//         const { username, password } = req.body;
//         const user = new User({ username, password });
//         await user.save();
//         res.json({ success: true, userId: user._id });
//     } catch (error) {
//         res.status(400).json({ success: false, error: error.message });
//     }
// });

// app.post('/api/login', async (req, res) => {
//     try {
//         const { username, password } = req.body;
//         const user = await User.findOne({ username, password });
//         if (!user) throw new Error('Invalid credentials');
//         res.json({ success: true, userId: user._id });
//     } catch (error) {
//         res.status(400).json({ success: false, error: error.message });
//     }
// });

// app.get('/api/user/:id', async (req, res) => {
//     try {
//         const user = await User.findById(req.params.id);
//         if (!user) throw new Error('User not found');
//         res.json({ 
//             success: true, 
//             balance: user.balance, 
//             adsWatched: user.adsWatched 
//         });
//     } catch (error) {
//         res.status(404).json({ success: false, error: error.message });
//     }
// });

// app.post('/api/watch-ad/:userId', async (req, res) => {
//     try {
//         const user = await User.findById(req.params.userId);
//         if (!user) throw new Error('User not found');
        
//         // Add random earnings between 0.10 and 1.00
//         const earnings = (Math.random() * 0.9 + 0.1).toFixed(2);
//         user.balance += parseFloat(earnings);
//         user.adsWatched += 1;
//         user.lastAdWatched = new Date();
        
//         await user.save();
        
//         res.json({ 
//             success: true, 
//             earnings: parseFloat(earnings),
//             newBalance: user.balance
//         });
//     } catch (error) {
//         res.status(400).json({ success: false, error: error.message });
//     }
// });

// // Start server
// const PORT = process.env.PORT || 1211;
// app.listen(PORT, () => {
//     console.log(`Server running on port ${PORT}`);
// });




// require('dotenv').config();
// const express = require('express');
// const mongoose = require('mongoose');
// const cors = require('cors');
// const fs = require('fs');
// const path = require('path');
// const bcrypt = require('bcryptjs');
// const jwt = require('jsonwebtoken');

// const app = express();

// // Middleware
// app.use(cors());
// app.use(express.json());
// app.use(express.static('public'));
// app.use(express.urlencoded({ extended: true }));

// // MongoDB Connection - Fixed connection string (added missing /)
// mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/earn', {
//     useNewUrlParser: true,
//     useUnifiedTopology: true
// })
// .then(() => console.log('Connected to MongoDB'))
// .catch(err => console.error('MongoDB connection error:', err));

// // User Schema with improved security
// const userSchema = new mongoose.Schema({
//     username: { type: String, required: true, unique: true },
//     password: { type: String, required: true },
//     balance: { type: Number, default: 0 },
//     adsWatched: { type: Number, default: 0 },
//     lastAdWatched: { type: Date }
// });

// const User = mongoose.model('User', userSchema);

// // Serve static files from views directory
// app.use(express.static(path.join(__dirname, 'views')));

// // Routes
// app.get('/', (req, res) => {
//     res.sendFile(path.join(__dirname, 'views', 'index.html'));
// });

// app.get('/dashboard', (req, res) => {
//     res.sendFile(path.join(__dirname, 'views', 'dashboard.html'));
// });

// app.get('/watch-ad', (req, res) => {
//     res.sendFile(path.join(__dirname, 'views', 'watch-ad.html'));
// });

// // AdSense ads.txt route
// app.get('/ads.txt', (req, res) => {
//     const filePath = path.join(__dirname, 'ads.txt');

// });

// // API Routes with improved security
// app.post('/api/register', async (req, res) => {
//     try {
//         const { username, password } = req.body;
        
//         // Hash password before saving
//         const hashedPassword = await bcrypt.hash(password, 10);
//         const user = new User({ 
//             username, 
//             password: hashedPassword 
//         });
        
//         await user.save();
        
//         // Create JWT token
//         const token = jwt.sign(
//             { userId: user._id },
//             process.env.JWT_SECRET || 'your-secret-key',
//             { expiresIn: '24h' }
//         );
        
//         res.json({ 
//             success: true, 
//             userId: user._id,
//             token 
//         });
//     } catch (error) {
//         res.status(400).json({ success: false, error: error.message });
//     }
// });

// app.post('/api/login', async (req, res) => {
//     try {
//         const { username, password } = req.body;
//         const user = await User.findOne({ username });
        
//         if (!user) throw new Error('Invalid credentials');
        
//         // Compare hashed password
//         const isMatch = await bcrypt.compare(password, user.password);
//         if (!isMatch) throw new Error('Invalid credentials');
        
//         // Create JWT token
//         const token = jwt.sign(
//             { userId: user._id },
//             process.env.JWT_SECRET || 'your-secret-key',
//             { expiresIn: '24h' }
//         );
        
//         res.json({ 
//             success: true, 
//             userId: user._id,
//             token 
//         });
//     } catch (error) {
//         res.status(400).json({ success: false, error: error.message });
//     }
// });

// // Protected routes middleware
// const authenticate = async (req, res, next) => {
//     try {
//         const token = req.header('Authorization')?.replace('Bearer ', '');
//         if (!token) throw new Error('Authentication required');
        
//         const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
//         const user = await User.findById(decoded.userId);
        
//         if (!user) throw new Error('User not found');
        
//         req.user = user;
//         next();
//     } catch (error) {
//         res.status(401).json({ success: false, error: 'Please authenticate' });
//     }
// };

// app.get('/api/user/:id', authenticate, async (req, res) => {
//     try {
//         const user = await User.findById(req.params.id);
//         if (!user) throw new Error('User not found');
        
//         res.json({ 
//             success: true, 
//             balance: user.balance, 
//             adsWatched: user.adsWatched 
//         });
//     } catch (error) {
//         res.status(404).json({ success: false, error: error.message });
//     }
// });

// app.post('/api/watch-ad/:userId', authenticate, async (req, res) => {
//     try {
//         if (req.user._id.toString() !== req.params.userId) {
//             throw new Error('Unauthorized action');
//         }
        
//         const user = await User.findById(req.params.userId);
//         if (!user) throw new Error('User not found');
        
//         // Add random earnings between 0.10 and 1.00
//         const earnings = (Math.random() * 0.9 + 0.1).toFixed(2);
//         user.balance += parseFloat(earnings);
//         user.adsWatched += 1;
//         user.lastAdWatched = new Date();
        
//         await user.save();
        
//         res.json({ 
//             success: true, 
//             earnings: parseFloat(earnings),
//             newBalance: user.balance
//         });
//     } catch (error) {
//         res.status(400).json({ success: false, error: error.message });
//     }
// });

// // Start server
// const PORT = process.env.PORT || 1211;
// app.listen(PORT, () => {
//     console.log(`Server running on port ${PORT}`);
//     console.log(`AdSense ads.txt available at: http://localhost:${PORT}/ads.txt`);
// });




require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/earn', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('MongoDB connection error:', err));

// User Schema with ad cooldown tracking
const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    balance: { type: Number, default: 0 },
    adsWatched: { type: Number, default: 0 },
    lastAdWatched: { type: Date },
    adCooldown: { type: Date } // Track when user can watch next ad
});

const User = mongoose.model('User', userSchema);

// Serve static files from views directory
app.use(express.static(path.join(__dirname, 'views')));

// Routes
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

app.get('/dashboard', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'dashboard.html'));
});

app.get('/watch-ad', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'watch-ad.html'));
});

app.get('/test', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'test.html'));
});

// AdSense ads.txt route
app.get('/ads.txt', (req, res) => {
    const filePath = path.join(__dirname, 'ads.txt');
    res.sendFile(filePath);
});

// API Routes with improved security
app.post('/api/register', async (req, res) => {
    try {
        const { username, password } = req.body;
        
        // Hash password before saving
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({ 
            username, 
            password: hashedPassword 
        });
        
        await user.save();
        
        // Create JWT token
        const token = jwt.sign(
            { userId: user._id },
            process.env.JWT_SECRET || 'your-secret-key',
            { expiresIn: '24h' }
        );
        
        res.json({ 
            success: true, 
            userId: user._id,
            token 
        });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
});

app.post('/api/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ username });
        
        if (!user) throw new Error('Invalid credentials');
        
        // Compare hashed password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) throw new Error('Invalid credentials');
        
        // Create JWT token
        const token = jwt.sign(
            { userId: user._id },
            process.env.JWT_SECRET || 'your-secret-key',
            { expiresIn: '24h' }
        );
        
        res.json({ 
            success: true, 
            userId: user._id,
            token 
        });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
});

// Protected routes middleware
const authenticate = async (req, res, next) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');
        if (!token) throw new Error('Authentication required');
        
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
        const user = await User.findById(decoded.userId);
        
        if (!user) throw new Error('User not found');
        
        req.user = user;
        next();
    } catch (error) {
        res.status(401).json({ success: false, error: 'Please authenticate' });
    }
};

app.get('/api/user/:id', authenticate, async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) throw new Error('User not found');
        
        res.json({ 
            success: true, 
            balance: user.balance, 
            adsWatched: user.adsWatched,
            canWatchAd: canWatchAd(user)
        });
    } catch (error) {
        res.status(404).json({ success: false, error: error.message });
    }
});

// Helper function to check if user can watch ad
function canWatchAd(user) {
    if (!user.lastAdWatched) return true;
    const now = new Date();
    const lastAdTime = new Date(user.lastAdWatched);
    const cooldownMs = 60 * 1000; // 1 minute cooldown
    return (now - lastAdTime) >= cooldownMs;
}

app.post('/api/watch-ad/:userId', authenticate, async (req, res) => {
    try {
        if (req.user._id.toString() !== req.params.userId) {
            throw new Error('Unauthorized action');
        }
        
        const user = await User.findById(req.params.userId);
        if (!user) throw new Error('User not found');
        
        // Check if user is on cooldown
        if (!canWatchAd(user)) {
            const now = new Date();
            const lastAdTime = new Date(user.lastAdWatched);
            const cooldownMs = 60 * 1000; // 1 minute cooldown
            const remainingMs = cooldownMs - (now - lastAdTime);
            const remainingSec = Math.ceil(remainingMs / 1000);
            
            throw new Error(`Please wait ${remainingSec} seconds before watching another ad`);
        }
        
        // Add random earnings between 0.10 and 1.00
        const earnings = (Math.random() * 0.9 + 0.1).toFixed(2);
        user.balance += parseFloat(earnings);
        user.adsWatched += 1;
        user.lastAdWatched = new Date();
        
        await user.save();
        
        res.json({ 
            success: true, 
            earnings: parseFloat(earnings),
            newBalance: user.balance
        });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
});

// Start server
const PORT = process.env.PORT || 1211;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`AdSense ads.txt available at: http://localhost:${PORT}/ads.txt`);
});