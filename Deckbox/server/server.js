import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import cardStorageRoutes from './middleware/routes/cardStorageRoutes.js';
import authRoutes from './middleware/routes/authRoutes.js';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';


dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/deckbox';

const JWT_SECRET = process.env.JWT_SECRET || 'change-this-secret';

jwt.sign({}, JWT_SECRET); // To avoid unused variable warning

// Middleware
const allowedOrigins = [
    'http://localhost:3000',
    'http://localhost:5173',
    'https://deckbox-r8ok-jz75ibn0e-tevvels-projects.vercel.app',
];
//looks beeter right??
//this is to prevent CORS errors when making requests from the frontend to the backend.

app.use(cors({
    origin: function (origin, callback) {
        if(!origin) return callback(null, true); // Allow non-browser requests like Postman
        if (allowedOrigins.indexOf(origin) === -1) {
            const msg = `The CORS policy for this site does not allow access from the specified Origin.`;
            return callback(new Error(msg), false);
        }
                return callback(null, true);
        
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,

}));
app.use(express.json());

// Routes

app.use('/api/auth', authRoutes);
app.use('/api/cardStorage', cardStorageRoutes);

app.get('/', (req, res) => {
    res.send('Welcome to Deckbox API');
}); 
// Connect to MongoDB and start server
mongoose.connect(MONGO_URI, {
    useNewUrlParser: true, 
    useUnifiedTopology: true
}).then(() => {
    console.log('Connected to MongoDB'); 
    app.listen(PORT, () => {
        console.log(`Server running on http://localhost:${PORT}`);
    });
}).catch(err => {
    console.error('MongoDB connection error:', err);
}); 
// Basic route
// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
}); 
export default app;

