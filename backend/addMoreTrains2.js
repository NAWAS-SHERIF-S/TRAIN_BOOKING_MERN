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

const additionalTrains = [
    {
        trainNumber: '12301',
        trainName: 'Howrah Rajdhani Express',
        trainType: 'Rajdhani',
        runningDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        classes: ['1A', '2A', '3A'],
        pricing: { '1A': 2650, '2A': 1550, '3A': 1050 },
        stations: [
            { name: 'New Delhi', stationCode: 'NDLS', arrivalTime: '--', departureTime: '17:00', platform: '2', distance: 0 },
            { name: 'Kanpur Central', stationCode: 'CNB', arrivalTime: '21:35', departureTime: '21:45', platform: '1', distance: 441 },
            { name: 'Allahabad Junction', stationCode: 'PRYJ', arrivalTime: '23:28', departureTime: '23:33', platform: '6', distance: 634 },
            { name: 'Varanasi Junction', stationCode: 'BSB', arrivalTime: '01:15', departureTime: '01:25', platform: '9', distance: 797 },
            { name: 'Patna Junction', stationCode: 'PNBE', arrivalTime: '05:00', departureTime: '05:10', platform: '10', distance: 995 },
            { name: 'Howrah Junction', stationCode: 'HWH', arrivalTime: '09:55', departureTime: '--', platform: '23', distance: 1441 }
        ]
    },
    {
        trainNumber: '12423',
        trainName: 'Dibrugarh Rajdhani Express',
        trainType: 'Rajdhani',
        runningDays: ['Tue', 'Thu', 'Sun'],
        classes: ['1A', '2A', '3A'],
        pricing: { '1A': 3850, '2A': 2250, '3A': 1550 },
        stations: [
            { name: 'New Delhi', stationCode: 'NDLS', arrivalTime: '--', departureTime: '12:55', platform: '16', distance: 0 },
            { name: 'Lucknow', stationCode: 'LKO', arrivalTime: '18:30', departureTime: '18:40', platform: '1', distance: 523 },
            { name: 'Varanasi Junction', stationCode: 'BSB', arrivalTime: '21:45', departureTime: '21:55', platform: '9', distance: 797 },
            { name: 'Patna Junction', stationCode: 'PNBE', arrivalTime: '01:30', departureTime: '01:40', platform: '10', distance: 995 },
            { name: 'Malda Town', stationCode: 'MLDT', arrivalTime: '07:15', departureTime: '07:25', platform: '1', distance: 1356 },
            { name: 'New Jalpaiguri', stationCode: 'NJP', arrivalTime: '10:30', departureTime: '10:40', platform: '2', distance: 1505 },
            { name: 'Guwahati', stationCode: 'GHY', arrivalTime: '16:45', departureTime: '17:00', platform: '1', distance: 1967 },
            { name: 'Dibrugarh Town', stationCode: 'DBRG', arrivalTime: '05:30', departureTime: '--', platform: '1', distance: 2434 }
        ]
    },
    {
        trainNumber: '12009',
        trainName: 'Shatabdi Express',
        trainType: 'Shatabdi',
        runningDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
        classes: ['CC', '2S'],
        pricing: { CC: 750, '2S': 250 },
        stations: [
            { name: 'Mumbai Central', stationCode: 'MMCT', arrivalTime: '--', departureTime: '06:25', platform: '9', distance: 0 },
            { name: 'Vadodara Junction', stationCode: 'BRC', arrivalTime: '09:18', departureTime: '09:28', platform: '4', distance: 392 },
            { name: 'Ratlam Junction', stationCode: 'RTM', arrivalTime: '11:35', departureTime: '11:40', platform: '2', distance: 589 },
            { name: 'Ujjain Junction', stationCode: 'UJN', arrivalTime: '12:28', departureTime: '12:30', platform: '1', distance: 645 },
            { name: 'Bhopal Junction', stationCode: 'BPL', arrivalTime: '14:15', departureTime: '--', platform: '3', distance: 785 }
        ]
    },
    {
        trainNumber: '12217',
        trainName: 'Sampark Kranti Express',
        trainType: 'Express',
        runningDays: ['Mon', 'Wed', 'Fri', 'Sun'],
        classes: ['SL', '3A', '2A'],
        pricing: { SL: 275, '3A': 875, '2A': 1375 },
        stations: [
            { name: 'Chandigarh', stationCode: 'CDG', arrivalTime: '--', departureTime: '15:40', platform: '2', distance: 0 },
            { name: 'Ambala Cantt', stationCode: 'UMB', arrivalTime: '16:25', departureTime: '16:30', platform: '4', distance: 45 },
            { name: 'Kurukshetra Junction', stationCode: 'KUR', arrivalTime: '17:03', departureTime: '17:05', platform: '2', distance: 85 },
            { name: 'New Delhi', stationCode: 'NDLS', arrivalTime: '19:15', departureTime: '19:30', platform: '14', distance: 248 },
            { name: 'Mathura Junction', stationCode: 'MTJ', arrivalTime: '21:08', departureTime: '21:10', platform: '6', distance: 393 },
            { name: 'Agra Cantt', stationCode: 'AGC', arrivalTime: '22:00', departureTime: '22:05', platform: '1', distance: 449 },
            { name: 'Jhansi Junction', stationCode: 'JHS', arrivalTime: '00:25', departureTime: '00:35', platform: '3', distance: 663 },
            { name: 'Bhopal Junction', stationCode: 'BPL', arrivalTime: '04:45', departureTime: '--', platform: '2', distance: 955 }
        ]
    },
    {
        trainNumber: '12615',
        trainName: 'Grand Trunk Express',
        trainType: 'Express',
        runningDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        classes: ['SL', '3A', '2A', '1A'],
        pricing: { SL: 325, '3A': 995, '2A': 1495, '1A': 2395 },
        stations: [
            { name: 'New Delhi', stationCode: 'NDLS', arrivalTime: '--', departureTime: '19:30', platform: '16', distance: 0 },
            { name: 'Aligarh Junction', stationCode: 'ALJN', arrivalTime: '21:23', departureTime: '21:25', platform: '1', distance: 130 },
            { name: 'Kanpur Central', stationCode: 'CNB', arrivalTime: '00:05', departureTime: '00:15', platform: '3', distance: 441 },
            { name: 'Allahabad Junction', stationCode: 'PRYJ', arrivalTime: '02:28', departureTime: '02:33', platform: '6', distance: 634 },
            { name: 'Varanasi Junction', stationCode: 'BSB', arrivalTime: '05:15', departureTime: '05:25', platform: '9', distance: 797 },
            { name: 'Gaya Junction', stationCode: 'GAYA', arrivalTime: '08:30', departureTime: '08:35', platform: '2', distance: 1056 },
            { name: 'Dhanbad Junction', stationCode: 'DHN', arrivalTime: '11:15', departureTime: '11:25', platform: '4', distance: 1289 },
            { name: 'Asansol Junction', stationCode: 'ASN', arrivalTime: '12:45', departureTime: '12:50', platform: '1', distance: 1378 },
            { name: 'Howrah Junction', stationCode: 'HWH', arrivalTime: '15:20', departureTime: '--', platform: '23', distance: 1541 }
        ]
    },
    {
        trainNumber: '12925',
        trainName: 'Paschim Express',
        trainType: 'Express',
        runningDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        classes: ['SL', '3A', '2A'],
        pricing: { SL: 295, '3A': 895, '2A': 1395 },
        stations: [
            { name: 'Amritsar Junction', stationCode: 'ASR', arrivalTime: '--', departureTime: '14:25', platform: '1', distance: 0 },
            { name: 'Jalandhar City', stationCode: 'JUC', arrivalTime: '15:23', departureTime: '15:25', platform: '2', distance: 78 },
            { name: 'Ludhiana Junction', stationCode: 'LDH', arrivalTime: '16:15', departureTime: '16:20', platform: '4', distance: 145 },
            { name: 'Ambala Cantt', stationCode: 'UMB', arrivalTime: '18:05', departureTime: '18:10', platform: '3', distance: 289 },
            { name: 'New Delhi', stationCode: 'NDLS', arrivalTime: '21:15', departureTime: '21:30', platform: '14', distance: 453 },
            { name: 'Mathura Junction', stationCode: 'MTJ', arrivalTime: '23:08', departureTime: '23:10', platform: '6', distance: 598 },
            { name: 'Agra Cantt', stationCode: 'AGC', arrivalTime: '00:00', departureTime: '00:05', platform: '1', distance: 654 },
            { name: 'Jhansi Junction', stationCode: 'JHS', arrivalTime: '02:25', departureTime: '02:35', platform: '3', distance: 868 },
            { name: 'Bhopal Junction', stationCode: 'BPL', arrivalTime: '06:45', departureTime: '06:55', platform: '2', distance: 1160 },
            { name: 'Mumbai Central', stationCode: 'MMCT', arrivalTime: '19:35', departureTime: '--', platform: '9', distance: 1928 }
        ]
    }
];

const addAdditionalTrains = async () => {
    try {
        await connectDB();
        
        console.log('Adding additional trains...');
        
        for (const trainData of additionalTrains) {
            const existingTrain = await Train.findOne({ trainNumber: trainData.trainNumber });
            if (existingTrain) {
                console.log(`Train ${trainData.trainNumber} already exists, skipping...`);
                continue;
            }
            
            const train = await Train.create(trainData);
            console.log(`Created train: ${train.trainNumber} - ${train.trainName}`);
            
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
        
        console.log('Successfully added additional trains!');
        process.exit(0);
    } catch (error) {
        console.error('Error adding trains:', error);
        process.exit(1);
    }
};

addAdditionalTrains();