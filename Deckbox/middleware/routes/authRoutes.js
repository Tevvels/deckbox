import express from 'express';
import bcrypt from 'bcryptjs';
import User from '../../models/User.js';
import jwt from 'jsonwebtoken';
import { config } from 'dotenv';
config();

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || `'change-this-secret'`;    
// Login route
router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) return res.status(400).json({ message: 'username and password required' });
    try {
        const user = await User.findOne({ username });
        if (!user) return res.status(401).json({ message: 'Invalid credentials' });
        const ok = await bcrypt.compare(password, user.password);
        if (!ok) return res.status(401).json({ message: 'Invalid credentials' });
        const token = jwt.sign({ id: user._id, username: user.username }, JWT_SECRET, { expiresIn: '7d' });
        return res.json({ token });
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
});

// Registration route
router.post('/register', async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) return res.status(400).json({ message: 'username and password required' });
    try {
        const existing = await User.findOne({
            username
        });
        if (existing) return res.status(409).json({ message: 'User already exists' });
        const hashed = await bcrypt.hash(password, 10);
        const user = new User({ username, password: hashed });
        await user.save();
        return res.status(201).json({ id: user._id, username: user.username });
    }   catch (err) {
        return res.status(500).json({ error: err.message });
    }
});


export default router;
