import mongoose from 'mongoose';
import Train from './models/Train.js';
import LiveStatus from './models/LiveStatus.js';
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

const moreTrains = [
    {
        trainNumber: '12002',
        trainName: 'New Delhi Shatabdi Express',
        trainType: 'Shatabdi',
        runningDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
        classes: ['CC', '2S'],
        pricing: { CC: 850, '2S': 295 },
        stations: [
            { name: 'New Delhi', stationCode: 'NDLS', arrivalTime: '--', departureTime: '06:00', platform: '16', distance: 0 },
            { name: 'Ghaziabad', stationCode: 'GZB', arrivalTime: '06:35', departureTime: '06:37', platform: '4', distance: 25 },
            { name: 'Aligarh Junction', stationCode: 'ALJN', arrivalTime: '07:28', departureTime: '07:30', platform: '1', distance: 130 },
            { name: 'Kanpur Central', stationCode: 'CNB', arrivalTime: '09:15', departureTime: '09:20', platform: '3', distance: 441 },
            { name: 'Lucknow', stationCode: 'LKO', arrivalTime: '10:30', departureTime: '10:35', platform: '1', distance: 523 },
            { name: 'Varanasi Junction', stationCode: 'BSB', arrivalTime: '13:45', departureTime: '--', platform: '9', distance: 797 }
        ]
    },
    {
        trainNumber: '12951',
        trainName: 'Mumbai Rajdhani Express',
        trainType: 'Rajdhani',
        runningDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        classes: ['1A', '2A', '3A'],
        pricing: { '1A': 2850, '2A': 1650, '3A': 1150 },
        stations: [
            { name: 'New Delhi', stationCode: 'NDLS', arrivalTime: '--', departureTime: '16:55', platform: '2', distance: 0 },
            { name: 'Mathura Junction', stationCode: 'MTJ', arrivalTime: '18:33', departureTime: '18:35', platform: '6', distance: 145 },
            { name: 'Jhansi Junction', stationCode: 'JHS', arrivalTime: '21:25', departureTime: '21:35', platform: '1', distance: 415 },
            { name: 'Bhopal Junction', stationCode: 'BPL', arrivalTime: '00:45', departureTime: '00:55', platform: '3', distance: 707 },
            { name: 'Vadodara Junction', stationCode: 'BRC', arrivalTime: '05:18', departureTime: '05:28', platform: '4', distance: 1174 },
            { name: 'Mumbai Central', stationCode: 'MMCT', arrivalTime: '08:35', departureTime: '--', platform: '9', distance: 1384 }
        ]
    },
    {
        trainNumber: '22691',
        trainName: 'Bangalore Rajdhani Express',
        trainType: 'Rajdhani',
        runningDays: ['Tue', 'Wed', 'Fri', 'Sun'],
        classes: ['1A', '2A', '3A'],
        pricing: { '1A': 3250, '2A': 1950, '3A': 1350 },
        stations: [
            { name: 'New Delhi', stationCode: 'NDLS', arrivalTime: '--', departureTime: '20:05', platform: '16', distance: 0 },
            { name: 'Gwalior Junction', stationCode: 'GWL', arrivalTime: '23:28', departureTime: '23:33', platform: '1', distance: 319 },
            { name: 'Bhopal Junction', stationCode: 'BPL', arrivalTime: '02:00', departureTime: '02:10', platform: '6', distance: 707 },
            { name: 'Nagpur', stationCode: 'NGP', arrivalTime: '07:15', departureTime: '07:25', platform: '2', distance: 1081 },
            { name: 'Secunderabad Junction', stationCode: 'SC', arrivalTime: '14:40', departureTime: '14:50', platform: '9', distance: 1563 },
            { name: 'Bangalore City', stationCode: 'SBC', arrivalTime: '22:00', departureTime: '--', platform: '1', distance: 2444 }
        ]
    },
    {
        trainNumber: '12626',
        trainName: 'Kerala Express',
        trainType: 'Express',
        runningDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        classes: ['SL', '3A', '2A', '1A'],
        pricing: { SL: 285, '3A': 895, '2A': 1395, '1A': 2195 },
        stations: [
            { name: 'New Delhi', stationCode: 'NDLS', arrivalTime: '--', departureTime: '11:55', platform: '16', distance: 0 },
            { name: 'Mathura Junction', stationCode: 'MTJ', arrivalTime: '13:33', departureTime: '13:35', platform: '4', distance: 145 },
            { name: 'Gwalior Junction', stationCode: 'GWL', arrivalTime: '15:43', departureTime: '15:48', platform: '3', distance: 319 },
            { name: 'Bhopal Junction', stationCode: 'BPL', arrivalTime: '19:15', departureTime: '19:25', platform: '1', distance: 707 },
            { name: 'Itarsi Junction', stationCode: 'ET', arrivalTime: '20:25', departureTime: '20:35', platform: '2', distance: 774 },
            { name: 'Nagpur', stationCode: 'NGP', arrivalTime: '01:15', departureTime: '01:25', platform: '4', distance: 1081 },
            { name: 'Secunderabad Junction', stationCode: 'SC', arrivalTime: '08:40', departureTime: '08:50', platform: '10', distance: 1563 },
            { name: 'Bangalore City', stationCode: 'SBC', arrivalTime: '16:00', departureTime: '16:10', platform: '8', distance: 2444 },
            { name: 'Ernakulam Junction', stationCode: 'ERS', arrivalTime: '04:30', departureTime: '--', platform: '4', distance: 2889 }
        ]
    },
    {
        trainNumber: '12840',
        trainName: 'Howrah Mail',
        trainType: 'Express',
        runningDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        classes: ['SL', '3A', '2A'],
        pricing: { SL: 245, '3A': 795, '2A': 1195 },
        stations: [
            { name: 'Chennai Central', stationCode: 'MAS', arrivalTime: '--', departureTime: '23:45', platform: '9', distance: 0 },
            { name: 'Vijayawada Junction', stationCode: 'BZA', arrivalTime: '05:00', departureTime: '05:05', platform: '1', distance: 429 },
            { name: 'Secunderabad Junction', stationCode: 'SC', arrivalTime: '09:40', departureTime: '09:50', platform: '2', distance: 594 },
            { name: 'Nagpur', stationCode: 'NGP', arrivalTime: '17:15', departureTime: '17:25', platform: '3', distance: 1076 },
            { name: 'Bilaspur Junction', stationCode: 'BSP', arrivalTime: '22:10', departureTime: '22:20', platform: '1', distance: 1394 },
            { name: 'Raipur Junction', stationCode: 'R', arrivalTime: '23:35', departureTime: '23:45', platform: '4', distance: 1510 },
            { name: 'Howrah Junction', stationCode: 'HWH', arrivalTime: '11:05', departureTime: '--', platform: '23', distance: 1662 }
        ]
    },
    {
        trainNumber: '12650',
        trainName: 'Karnataka Sampark Kranti Express',
        trainType: 'Express',
        runningDays: ['Mon', 'Wed', 'Fri'],
        classes: ['SL', '3A', '2A'],
        pricing: { SL: 295, '3A': 925, '2A': 1425 },
        stations: [
            { name: 'New Delhi', stationCode: 'NDLS', arrivalTime: '--', departureTime: '15:50', platform: '14', distance: 0 },
            { name: 'Mathura Junction', stationCode: 'MTJ', arrivalTime: '17:28', departureTime: '17:30', platform: '2', distance: 145 },
            { name: 'Gwalior Junction', stationCode: 'GWL', arrivalTime: '19:38', departureTime: '19:43', platform: '5', distance: 319 },
            { name: 'Jhansi Junction', stationCode: 'JHS', arrivalTime: '21:25', departureTime: '21:35', platform: '3', distance: 415 },
            { name: 'Bhopal Junction', stationCode: 'BPL', arrivalTime: '00:45', departureTime: '00:55', platform: '2', distance: 707 },
            { name: 'Hubli Junction', stationCode: 'UBL', arrivalTime: '14:30', departureTime: '14:40', platform: '1', distance: 1456 },
            { name: 'Bangalore City', stationCode: 'SBC', arrivalTime: '21:15', departureTime: '--', platform: '6', distance: 1888 }
        ]
    }
];

const addMoreTrains = async () => {
    try {
        await connectDB();
        
        console.log('Adding more trains...');
        
        for (const trainData of moreTrains) {
            // Check if train already exists
            const existingTrain = await Train.findOne({ trainNumber: trainData.trainNumber });
            if (existingTrain) {
                console.log(`Train ${trainData.trainNumber} already exists, skipping...`);
                continue;
            }
            
            // Create train
            const train = await Train.create(trainData);
            console.log(`Created train: ${train.trainNumber} - ${train.trainName}`);
            
            // Create live status
            await LiveStatus.create({
                train: train._id,
                trainNumber: train.trainNumber,
                currentStation: train.stations[0].name,
                currentStationCode: train.stations[0].stationCode,
                status: 'On Time',
                nextStation: train.stations.length > 1 ? train.stations[1].name : '',
                nextStationETA: train.stations.length > 1 ? train.stations[1].arrivalTime : '',
                delay: 0,
                speed: 0,
                lastUpdated: new Date()
            });
        }
        
        console.log('Successfully added more trains!');
        process.exit(0);
    } catch (error) {
        console.error('Error adding trains:', error);
        process.exit(1);
    }
};

addMoreTrains();