const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config({ path: './.env' }); // Adjust path if running from root

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log(`MongoDB Connected: ${conn.connection.host}`);
        
        // Drop the index
        try {
            await mongoose.connection.collection('employees').dropIndex('email_1');
            console.log('Index "email_1" dropped successfully.');
        } catch (err) {
            console.log('Index drop failed (maybe it does not exist):', err.message);
        }

        process.exit();
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

connectDB();
