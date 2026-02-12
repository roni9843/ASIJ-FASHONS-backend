const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const connectDB = require('./config/db');

dotenv.config();

connectDB();

const importData = async () => {
    try {
        await User.deleteMany(); // CAUTION: Clears existing users
        
        const adminUser = {
            name: 'Admin User',
            email: 'admin@gmail.com',
            password: '12345678', // Will be hashed by pre-save hook
            role: 'admin',
        };

        await User.create(adminUser);

        console.log('Data Imported!');
        process.exit();
    } catch (error) {
        console.error(`${error}`);
        process.exit(1);
    }
};

importData();
