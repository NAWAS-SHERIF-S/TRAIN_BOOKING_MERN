import dotenv from 'dotenv';
import mongoose from 'mongoose';
import User from './models/User.js';

dotenv.config();

const checkUsers = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Connected to MongoDB');
        
        const users = await User.find({}).select('+password');
        console.log('\n📋 All users in database:');
        
        users.forEach((user, index) => {
            console.log(`${index + 1}. Email: ${user.email}`);
            console.log(`   Name: ${user.name}`);
            console.log(`   Role: ${user.role}`);
            console.log(`   Password Hash: ${user.password.substring(0, 20)}...`);
            console.log('');
        });
        
        // Test password verification
        const adminUser = await User.findOne({ email: 'admin@trainbooking.com' }).select('+password');
        if (adminUser) {
            const isMatch = await adminUser.matchPassword('admin123');
            console.log(`🔐 Admin password 'admin123' matches: ${isMatch}`);
        }
        
        const regularUser = await User.findOne({ email: 'john@example.com' }).select('+password');
        if (regularUser) {
            const isMatch = await regularUser.matchPassword('password123');
            console.log(`🔐 User password 'password123' matches: ${isMatch}`);
        }
        
        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error.message);
        process.exit(1);
    }
};

checkUsers();