import jwt from 'jsonwebtoken';
import { config } from 'dotenv';
import User from '../models/User.js';
config();

const JWT_SECRET = process.env.JWT_SECRET || 'change-this-secret';
export const authMiddleware = async (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'Missing token' });
    try {
        const payload = jwt.verify(token, JWT_SECRET);
        const user =
            await User.findById(payload.id).select('-password -resetToken -resetTokenExpiry');
        if (!user) return res.status(404).json({ message: 'User not found' });
        req.user = user;
        next();
    } catch (err) {
        return res.status(403).json({ message: 'Invalid token' });
    }
};
export default authMiddleware;
