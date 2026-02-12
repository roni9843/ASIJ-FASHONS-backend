const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());

// CORS - Accept all domains
app.use(cors({
    origin: '*', // Allow all origins
    credentials: false, // Set to false when using wildcard origin
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(cookieParser());

// Database Connection
const connectDB = require('./config/db');
connectDB();

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/inventory', require('./routes/inventoryRoutes'));
app.use('/api/orders', require('./routes/orderRoutes'));
app.use('/api/production', require('./routes/productionRoutes'));
app.use('/api/hr', require('./routes/employeeRoutes'));
app.use('/api/expenses', require('./routes/expenseRoutes'));
app.use('/api/buyers', require('./routes/buyerRoutes'));
app.use('/api/purchases', require('./routes/purchaseRoutes'));
app.use('/api/shipments', require('./routes/shipmentRoutes'));

app.get('/', (req, res) => {
    res.send('Garments Management API is running');
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
