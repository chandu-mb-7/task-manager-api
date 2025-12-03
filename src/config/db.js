const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log('MongoDB connected');
    } catch (err) {
        console.error('Database connection failed:', err.message);
        throw err;  // Throw error to be caught by the main handler in server.js
    }
};

module.exports = connectDB;
