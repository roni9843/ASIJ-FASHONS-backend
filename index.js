const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');



dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// CORS - Allow specific origins
const allowedOrigins = [
    'http://localhost:5173',
    'http://localhost:3000',
    'https://asij-fashons-client-hnqjd36f6-roni9843s-projects.vercel.app',
    'https://asij-fashons-client.vercel.app', // Production Vercel URL
];






app.use(cors({
    origin: function(origin, callback) {
        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin) return callback(null, true);
        
        if (allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            callback(null, true); // Allow all for now, change to false to restrict
        }
    },
    credentials: true, // Can use credentials with specific origins
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    preflightContinue: false,
    optionsSuccessStatus: 204
}));

// Other Middleware
app.use(express.json());
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
app.use('/api/settings', require('./routes/settingsRoutes'));
app.use('/api/external-profiles', require('./routes/externalProfileRoutes'));
app.use('/api/tasks', require('./routes/taskRoutes'));

app.get('/', (req, res) => {
    res.send('Garments Management API is running');
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
