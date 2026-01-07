const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

dotenv.config();

const app = express();

// Middleware
app.use(cors({
    origin: process.env.CORS_ORIGIN || '*',
    credentials: true
}));
app.use(express.json());

// Connect Database
connectDB();

// Routes
app.get('/', (req, res) => {
    res.send('MaddyTiff API is running');
});

// Define Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/tiffins', require('./routes/tiffinRoutes'));
app.use('/api/locations', require('./routes/locationRoutes'));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
