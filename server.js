require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017earn', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('MongoDB connection error:', err));

// User Schema
const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    balance: { type: Number, default: 0 },
    adsWatched: { type: Number, default: 0 },
    lastAdWatched: { type: Date }
});

const User = mongoose.model('User', userSchema);

// Routes
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/views/index.html');
});

app.get('/dashboard', (req, res) => {
    res.sendFile(__dirname + '/views/dashboard.html');
});

app.get('/watch-ad', (req, res) => {
    res.sendFile(__dirname + '/views/watch-ad.html');
});

// API Routes
app.post('/api/register', async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = new User({ username, password });
        await user.save();
        res.json({ success: true, userId: user._id });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
});

app.post('/api/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ username, password });
        if (!user) throw new Error('Invalid credentials');
        res.json({ success: true, userId: user._id });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
});

app.get('/api/user/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) throw new Error('User not found');
        res.json({ 
            success: true, 
            balance: user.balance, 
            adsWatched: user.adsWatched 
        });
    } catch (error) {
        res.status(404).json({ success: false, error: error.message });
    }
});

app.post('/api/watch-ad/:userId', async (req, res) => {
    try {
        const user = await User.findById(req.params.userId);
        if (!user) throw new Error('User not found');
        
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
});