import mongoose from 'mongoose';
import Train from './models/Train.js';
import dotenv from 'dotenv';

dotenv.config();

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('MongoDB Connected');
    } catch (error) {
        console.error('Error:', error.message);
        process.exit(1);
    }
};

const updateTrainPricing = async () => {
    try {
        await connectDB();
        
        console.log('Updating train pricing...');
        
        const trains = await Train.find({});
        
        for (const train of trains) {
            if (!train.pricing) {
                train.pricing = {
                    SL: 195,
                    '3A': 695,
                    '2A': 1075,
                    '1A': 1675,
                    CC: 695,
                    '2S': 195,
                };
                await train.save();
                console.log(`Updated pricing for train: ${train.trainNumber} - ${train.trainName}`);
            } else {
                console.log(`Train ${train.trainNumber} already has pricing`);
            }
        }
        
        console.log('Successfully updated train pricing!');
        process.exit(0);
    } catch (error) {
        console.error('Error updating trains:', error);
        process.exit(1);
    }
};

updateTrainPricing();