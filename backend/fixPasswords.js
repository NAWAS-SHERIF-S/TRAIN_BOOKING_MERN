import dotenv from 'dotenv';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import User from './models/User.js';

dotenv.config();

const fixPasswords = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Connected to MongoDB');
        
        // Hash admin password
        const adminSalt = await bcrypt.genSalt(10);
        const adminHashedPassword = await bcrypt.hash('admin123', adminSalt);
        
        await User.updateOne(
            { email: 'admin@trainbooking.com' },
            { password: adminHashedPassword }
        );
        
        // Hash user password
        const userSalt = await bcrypt.genSalt(10);
        const userHashedPassword = await bcrypt.hash('password123', userSalt);
        
        await User.updateOne(
            { email: 'john@example.com' },
            { password: userHashedPassword }
        );
        
        console.log('✅ Passwords updated successfully');
        
        // Test the passwords
        const adminUser = await User.findOne({ email: 'admin@trainbooking.com' }).select('+password');
        const adminMatch = await bcrypt.compare('admin123', adminUser.password);
        console.log(`🔐 Admin password 'admin123' matches: ${adminMatch}`);
        
        const regularUser = await User.findOne({ email: 'john@example.com' }).select('+password');
        const userMatch = await bcrypt.compare('password123', regularUser.password);
        console.log(`🔐 User password 'password123' matches: ${userMatch}`);
        
        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error.message);
        process.exit(1);
    }
};

fixPasswords();