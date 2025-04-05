require('dotenv').config();
const express = require('express');
const cors = require('cors'); // Add CORS
const connectDB = require('./config/db.js');
const authRoutes = require('./routes/authRoutes.js');

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors()); // Enable CORS for all routes
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));