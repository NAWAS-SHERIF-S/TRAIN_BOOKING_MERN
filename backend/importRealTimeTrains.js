import dotenv from 'dotenv';
import mongoose from 'mongoose';
import Train from './models/Train.js';
import LiveStatus from './models/LiveStatus.js';
import enhancedTrainApiService from './services/enhancedTrainApiService.js';

dotenv.config();

const realTimeTrains = [
    { trainNumber: '12301', trainName: 'Rajdhani Express', from: 'New Delhi', to: 'Howrah Junction', trainType: 'Rajdhani' },
    { trainNumber: '12951', trainName: 'Mumbai Rajdhani', from: 'Mumbai Central', to: 'New Delhi', trainType: 'Rajdhani' },
    { trainNumber: '12002', trainName: 'Bhopal Shatabdi', from: 'New Delhi', to: 'Bhopal Junction', trainType: 'Shatabdi' },
    { trainNumber: '12626', trainName: 'Kerala Express', from: 'New Delhi', to: 'Trivandrum Central', trainType: 'Express' },
    { trainNumber: '12860', trainName: 'Gitanjali Express', from: 'Mumbai CST', to: 'Howrah Junction', trainType: 'Superfast' },
    { trainNumber: '12434', trainName: 'Chennai Rajdhani', from: 'New Delhi', to: 'Chennai Central', trainType: 'Rajdhani' },
    { trainNumber: '12423', trainName: 'Dibrugarh Rajdhani', from: 'New Delhi', to: 'Dibrugarh', trainType: 'Rajdhani' },
    { trainNumber: '12430', trainName: 'Lucknow AC SF', from: 'New Delhi', to: 'Lucknow', trainType: 'Superfast' },
    { trainNumber: '22691', trainName: 'Bangalore Rajdhani', from: 'New Delhi', to: 'Bangalore City', trainType: 'Rajdhani' },
    { trainNumber: '12009', trainName: 'Shatabdi Express', from: 'New Delhi', to: 'Kalka', trainType: 'Shatabdi' },
    { trainNumber: '12345', trainName: 'Coimbatore Express', from: 'Chennai Central', to: 'Coimbatore Junction', trainType: 'Express' },
    { trainNumber: '12679', trainName: 'Intercity Express', from: 'Coimbatore Junction', to: 'Chennai Central', trainType: 'Express' },
    { trainNumber: '16525', trainName: 'Bangalore Express', from: 'Bangalore City', to: 'Coimbatore Junction', trainType: 'Express' },
    { trainNumber: '12648', trainName: 'Kongu SF Express', from: 'Coimbatore Junction', to: 'Bangalore City', trainType: 'Superfast' },
    { trainNumber: '12675', trainName: 'Kovai Express', from: 'Chennai Central', to: 'Coimbatore Junction', trainType: 'Express' }
];

const importRealTimeTrains = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Connected to MongoDB');
        
        const results = [];
        
        for (const trainData of realTimeTrains) {
            try {
                console.log(`Processing ${trainData.trainName} (${trainData.trainNumber})...`);
                
                // Check if train already exists
                let train = await Train.findOne({ trainNumber: trainData.trainNumber });
                
                if (!train) {
                    // Create new train
                    train = await Train.create({
                        trainNumber: trainData.trainNumber,
                        trainName: trainData.trainName,
                        trainType: trainData.trainType,
                        classes: ['SL', '3A', '2A', '1A'],
                        runningDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                        stations: [
                            {
                                name: trainData.from,
                                stationCode: 'SRC',
                                arrivalTime: '--',
                                departureTime: '08:00',
                                platform: '1',
                                distance: 0
                            },
                            {
                                name: 'Junction Station',
                                stationCode: 'JCT',
                                arrivalTime: '14:00',
                                departureTime: '14:05',
                                platform: '2',
                                distance: 500
                            },
                            {
                                name: trainData.to,
                                stationCode: 'DEST',
                                arrivalTime: '20:00',
                                departureTime: '--',
                                platform: '3',
                                distance: 1000
                            }
                        ]
                    });
                    console.log(`  ✓ Created train: ${train.trainName}`);
                } else {
                    console.log(`  ⚠ Train already exists: ${train.trainName}`);
                }
                
                // Get live status from external API
                const liveStatus = await enhancedTrainApiService.getLiveTrainStatus(trainData.trainNumber);
                
                if (liveStatus) {
                    await LiveStatus.findOneAndUpdate(
                        { train: train._id },
                        {
                            trainNumber: liveStatus.trainNumber,
                            currentStation: liveStatus.currentStation,
                            currentStationCode: liveStatus.currentStationCode,
                            delayMinutes: liveStatus.delayMinutes,
                            status: liveStatus.status,
                            nextStation: liveStatus.nextStation,
                            nextStationETA: liveStatus.nextStationETA,
                            currentSpeed: liveStatus.currentSpeed,
                            lastUpdated: liveStatus.lastUpdated
                        },
                        { upsert: true }
                    );
                    console.log(`  ✓ Updated live status: ${liveStatus.status}`);
                }
                
                results.push({
                    trainNumber: trainData.trainNumber,
                    success: true,
                    hasLiveStatus: !!liveStatus
                });
                
            } catch (error) {
                console.error(`  ❌ Error processing ${trainData.trainNumber}:`, error.message);
                results.push({
                    trainNumber: trainData.trainNumber,
                    success: false,
                    error: error.message
                });
            }
        }
        
        console.log('\n📊 Import Summary:');
        console.log(`Total trains: ${realTimeTrains.length}`);
        console.log(`Successful: ${results.filter(r => r.success).length}`);
        console.log(`Failed: ${results.filter(r => !r.success).length}`);
        console.log(`With live status: ${results.filter(r => r.hasLiveStatus).length}`);
        
        console.log('\n✅ Real-time train import completed!');
        process.exit(0);
        
    } catch (error) {
        console.error('❌ Import failed:', error.message);
        process.exit(1);
    }
};

importRealTimeTrains();