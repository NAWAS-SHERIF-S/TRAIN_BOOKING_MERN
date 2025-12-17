import dotenv from 'dotenv';
import mongoose from 'mongoose';
import Train from './models/Train.js';

dotenv.config();

const testSearch = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Connected to MongoDB');
        
        // Check all trains
        const allTrains = await Train.find({});
        console.log(`\n📊 Total trains in database: ${allTrains.length}`);
        
        allTrains.forEach(train => {
            console.log(`- ${train.trainName} (${train.trainNumber})`);
            console.log(`  Stations: ${train.stations.map(s => s.name).join(' → ')}`);
        });
        
        // Test search
        console.log('\n🔍 Testing search: New Delhi → Howrah Junction');
        const searchResult = allTrains.filter((train) => {
            const fromIndex = train.stations.findIndex((s) =>
                s.name.toLowerCase().includes('new delhi')
            );
            const toIndex = train.stations.findIndex((s) =>
                s.name.toLowerCase().includes('howrah')
            );
            return fromIndex !== -1 && toIndex !== -1 && fromIndex < toIndex;
        });
        
        console.log(`Found ${searchResult.length} trains:`);
        searchResult.forEach(train => {
            console.log(`- ${train.trainName} (${train.trainNumber})`);
        });
        
        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error.message);
        process.exit(1);
    }
};

testSearch();