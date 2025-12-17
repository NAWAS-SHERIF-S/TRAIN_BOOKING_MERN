import dotenv from 'dotenv';
import mongoose from 'mongoose';

dotenv.config();

const testConnection = async () => {
    try {
        console.log('Attempting to connect to MongoDB...');
        const conn = await mongoose.connect(process.env.MONGODB_URI, {
            serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
        });
        
        console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
        
        // Test if we can query users
        const User = mongoose.model('User', new mongoose.Schema({
            name: String,
            email: String,
            password: String,
            role: String
        }));
        
        const userCount = await User.countDocuments();
        console.log(`📊 Users in database: ${userCount}`);
        
        // Check if admin user exists
        const adminUser = await User.findOne({ email: 'admin@trainbooking.com' });
        console.log(`👤 Admin user exists: ${adminUser ? 'Yes' : 'No'}`);
        
        if (adminUser) {
            console.log(`👤 Admin user details: ${adminUser.name} (${adminUser.email}) - Role: ${adminUser.role}`);
        }
        
        process.exit(0);
    } catch (error) {
        console.error('❌ Connection failed:', error.message);
        process.exit(1);
    }
};

testConnection();