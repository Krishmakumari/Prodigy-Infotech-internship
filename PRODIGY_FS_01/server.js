const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const path = require('path');

// Connect to MongoDB
mongoose.connect('mongodb://localhost/auth-system');

// Define a User schema
const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true }
});

const User = mongoose.model('User', userSchema);

const app = express();
const PORT = 3005;
const SECRET_KEY = 'your_secret_key';

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public'))); // Serve static files from 'public'

// Root Route
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

// Registration Endpoint
app.post('/register', async (req, res) => {
    try {
        const { username, password } = req.body;
        const hashedPassword = bcrypt.hashSync(password, 8);
        const user = new User({ username, password: hashedPassword });
        await user.save();
        res.json({ message: 'User registered successfully!' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Login Endpoint
app.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ username });
        if (user && bcrypt.compareSync(password, user.password)) {
            const token = jwt.sign({ username }, SECRET_KEY, { expiresIn: '1h' });
            res.json({ success: true, token });
        } else {
            res.json({ success: false });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Protected Route Example
app.get('/protected', (req, res) => {
    const token = req.headers['authorization'];
    if (!token) return res.status(401).json({ message: 'No token provided' });

    jwt.verify(token, SECRET_KEY, (err, decoded) => {
        if (err) return res.status(500).json({ message: 'Failed to authenticate token' });
        res.json({ message: 'Welcome to the protected route!' });
    });
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);

});
