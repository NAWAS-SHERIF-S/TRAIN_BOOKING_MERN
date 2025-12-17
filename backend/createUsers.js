import dotenv from 'dotenv';
import mongoose from 'mongoose';
import User from './models/User.js';

dotenv.config();

const createUsers = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Connected to MongoDB\n');

        // Delete existing users
        await User.deleteMany({});
        console.log('✓ Deleted existing users\n');

        // Create admin user
        const admin = await User.create({
            name: 'Admin User',
            email: 'admin@trainbooking.com',
            password: 'admin123',
            role: 'admin'
        });
        console.log('✓ Created admin:', admin.email);

        // Create regular user
        const user = await User.create({
            name: 'John Doe',
            email: 'john@example.com',
            password: 'password123',
            role: 'user'
        });
        console.log('✓ Created user:', user.email);

        console.log('\n✅ Users created successfully!');
        console.log('\nLogin Credentials:');
        console.log('Admin: admin@trainbooking.com / admin123');
        console.log('User: john@example.com / password123');
        
        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error.message);
        process.exit(1);
    }
};

createUsers();
