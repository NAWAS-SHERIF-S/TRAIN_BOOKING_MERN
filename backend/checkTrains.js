import dotenv from 'dotenv';
import mongoose from 'mongoose';
import Train from './models/Train.js';

dotenv.config();

const checkTrains = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Connected to MongoDB\n');

        const trains = await Train.find({});
        console.log(`Total trains in database: ${trains.length}\n`);

        trains.forEach(train => {
            console.log(`\n${train.trainNumber} - ${train.trainName}`);
            console.log('Stations:');
            train.stations.forEach(station => {
                console.log(`  ${station.stationCode} - ${station.name}`);
            });
        });

        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error.message);
        process.exit(1);
    }
};

checkTrains();
