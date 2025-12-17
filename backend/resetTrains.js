import dotenv from 'dotenv';
import mongoose from 'mongoose';
import Train from './models/Train.js';
import LiveStatus from './models/LiveStatus.js';

dotenv.config();

const syntheticTrains = [
    {
        trainNumber: '12635',
        trainName: 'Vaigai Express',
        trainType: 'Express',
        classes: ['SL', '3A', '2A', 'CC'],
        runningDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        stations: [
            { name: 'Chennai Central', stationCode: 'MAS', arrivalTime: '--', departureTime: '13:40', platform: '7', distance: 0 },
            { name: 'Chengalpattu', stationCode: 'CGL', arrivalTime: '14:30', departureTime: '14:32', platform: '2', distance: 58 },
            { name: 'Villupuram Junction', stationCode: 'VM', arrivalTime: '15:45', departureTime: '15:50', platform: '3', distance: 158 },
            { name: 'Trichy Junction', stationCode: 'TPJ', arrivalTime: '18:15', departureTime: '18:20', platform: '4', distance: 322 },
            { name: 'Dindigul Junction', stationCode: 'DG', arrivalTime: '19:30', departureTime: '19:32', platform: '2', distance: 397 },
            { name: 'Madurai Junction', stationCode: 'MDU', arrivalTime: '20:45', departureTime: '--', platform: '1', distance: 497 }
        ]
    },
    {
        trainNumber: '12676',
        trainName: 'Kovai Express',
        trainType: 'Express',
        classes: ['SL', '3A', '2A', '1A'],
        runningDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        stations: [
            { name: 'Chennai Central', stationCode: 'MAS', arrivalTime: '--', departureTime: '06:00', platform: '9', distance: 0 },
            { name: 'Katpadi Junction', stationCode: 'KPD', arrivalTime: '08:15', departureTime: '08:20', platform: '4', distance: 132 },
            { name: 'Salem Junction', stationCode: 'SA', arrivalTime: '10:30', departureTime: '10:35', platform: '3', distance: 278 },
            { name: 'Erode Junction', stationCode: 'ED', arrivalTime: '11:45', departureTime: '11:50', platform: '5', distance: 360 },
            { name: 'Tirupur', stationCode: 'TUP', arrivalTime: '12:25', departureTime: '12:27', platform: '2', distance: 407 },
            { name: 'Coimbatore Junction', stationCode: 'CBE', arrivalTime: '13:15', departureTime: '--', platform: '1', distance: 496 }
        ]
    },
    {
        trainNumber: '12639',
        trainName: 'Brindavan Express',
        trainType: 'Express',
        classes: ['CC', '2S'],
        runningDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        stations: [
            { name: 'Chennai Central', stationCode: 'MAS', arrivalTime: '--', departureTime: '07:00', platform: '10', distance: 0 },
            { name: 'Katpadi Junction', stationCode: 'KPD', arrivalTime: '09:00', departureTime: '09:05', platform: '3', distance: 132 },
            { name: 'Jolarpettai Junction', stationCode: 'JTJ', arrivalTime: '10:30', departureTime: '10:35', platform: '2', distance: 220 },
            { name: 'Bangarapet Junction', stationCode: 'BWT', arrivalTime: '11:45', departureTime: '11:47', platform: '4', distance: 290 },
            { name: 'Bangalore City', stationCode: 'SBC', arrivalTime: '13:30', departureTime: '--', platform: '8', distance: 362 }
        ]
    },
    {
        trainNumber: '12296',
        trainName: 'Sanghamitra Express',
        trainType: 'Superfast',
        classes: ['SL', '3A', '2A', '1A'],
        runningDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        stations: [
            { name: 'Bangalore City', stationCode: 'SBC', arrivalTime: '--', departureTime: '19:30', platform: '6', distance: 0 },
            { name: 'Jolarpettai Junction', stationCode: 'JTJ', arrivalTime: '22:15', departureTime: '22:20', platform: '3', distance: 142 },
            { name: 'Katpadi Junction', stationCode: 'KPD', arrivalTime: '23:45', departureTime: '23:50', platform: '2', distance: 230 },
            { name: 'Chennai Central', stationCode: 'MAS', arrivalTime: '02:00', departureTime: '02:15', platform: '7', distance: 362 },
            { name: 'Vijayawada Junction', stationCode: 'BZA', arrivalTime: '08:30', departureTime: '08:40', platform: '4', distance: 792 },
            { name: 'Visakhapatnam', stationCode: 'VSKP', arrivalTime: '14:45', departureTime: '--', platform: '1', distance: 1142 }
        ]
    },
    {
        trainNumber: '12621',
        trainName: 'Tamil Nadu Express',
        trainType: 'Superfast',
        classes: ['SL', '3A', '2A', '1A'],
        runningDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        stations: [
            { name: 'New Delhi', stationCode: 'NDLS', arrivalTime: '--', departureTime: '22:30', platform: '16', distance: 0 },
            { name: 'Agra Cantt', stationCode: 'AGC', arrivalTime: '02:00', departureTime: '02:05', platform: '3', distance: 195 },
            { name: 'Jhansi Junction', stationCode: 'JHS', arrivalTime: '05:30', departureTime: '05:40', platform: '4', distance: 415 },
            { name: 'Bhopal Junction', stationCode: 'BPL', arrivalTime: '10:15', departureTime: '10:25', platform: '5', distance: 707 },
            { name: 'Nagpur', stationCode: 'NGP', arrivalTime: '17:30', departureTime: '17:40', platform: '2', distance: 1127 },
            { name: 'Vijayawada Junction', stationCode: 'BZA', arrivalTime: '04:15', departureTime: '04:25', platform: '3', distance: 1737 },
            { name: 'Chennai Central', stationCode: 'MAS', arrivalTime: '11:15', departureTime: '--', platform: '9', distance: 2194 }
        ]
    },
    {
        trainNumber: '12680',
        trainName: 'Coimbatore Intercity',
        trainType: 'Express',
        classes: ['CC', '2S'],
        runningDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        stations: [
            { name: 'Coimbatore Junction', stationCode: 'CBE', arrivalTime: '--', departureTime: '05:50', platform: '4', distance: 0 },
            { name: 'Tirupur', stationCode: 'TUP', arrivalTime: '06:35', departureTime: '06:37', platform: '1', distance: 47 },
            { name: 'Erode Junction', stationCode: 'ED', arrivalTime: '07:20', departureTime: '07:25', platform: '4', distance: 94 },
            { name: 'Salem Junction', stationCode: 'SA', arrivalTime: '08:45', departureTime: '08:50', platform: '2', distance: 176 },
            { name: 'Jolarpettai Junction', stationCode: 'JTJ', arrivalTime: '10:30', departureTime: '10:35', platform: '3', distance: 264 },
            { name: 'Katpadi Junction', stationCode: 'KPD', arrivalTime: '11:45', departureTime: '11:50', platform: '5', distance: 352 },
            { name: 'Chennai Central', stationCode: 'MAS', arrivalTime: '14:00', departureTime: '--', platform: '12', distance: 496 }
        ]
    }
];

const resetTrains = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Connected to MongoDB\n');

        await Train.deleteMany({});
        await LiveStatus.deleteMany({});
        console.log('✓ Deleted all existing trains\n');

        for (const trainData of syntheticTrains) {
            const train = await Train.create(trainData);
            console.log(`✓ Created: ${train.trainName} (${train.trainNumber})`);

            await LiveStatus.create({
                train: train._id,
                trainNumber: train.trainNumber,
                currentStation: train.stations[0].name,
                currentStationCode: train.stations[0].stationCode,
                status: 'On Time',
                delayMinutes: 0,
                nextStation: train.stations.length > 1 ? train.stations[1].name : '',
                nextStationETA: train.stations.length > 1 ? train.stations[1].arrivalTime : '',
                currentSpeed: Math.floor(Math.random() * 40) + 60,
                lastUpdated: new Date()
            });
        }

        console.log('\n✅ Train database reset complete!');
        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error.message);
        process.exit(1);
    }
};

resetTrains();
