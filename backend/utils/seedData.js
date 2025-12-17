import dotenv from 'dotenv';
import connectDB from '../config/db.js';
import User from '../models/User.js';
import Train from '../models/Train.js';
import LiveStatus from '../models/LiveStatus.js';
import Booking from '../models/Booking.js';

dotenv.config();

connectDB();

const users = [
    {
        name: 'Admin User',
        email: 'admin@trainbooking.com',
        password: 'admin123',
        role: 'admin',
    },
    {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password123',
        role: 'user',
    },
];

const trains = [
    {
        trainNumber: '12301',
        trainName: 'Rajdhani Express',
        trainType: 'Rajdhani',
        classes: ['1A', '2A', '3A'],
        runningDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        stations: [
            { name: 'New Delhi', stationCode: 'NDLS', arrivalTime: '--', departureTime: '16:55', platform: '16', distance: 0 },
            { name: 'Kanpur Central', stationCode: 'CNB', arrivalTime: '22:10', departureTime: '22:15', platform: '6', distance: 441 },
            { name: 'Prayagraj Junction', stationCode: 'PRYJ', arrivalTime: '00:15', departureTime: '00:20', platform: '5', distance: 634 },
            { name: 'Mughal Sarai', stationCode: 'MGS', arrivalTime: '02:30', departureTime: '02:40', platform: '4', distance: 764 },
            { name: 'Patna Junction', stationCode: 'PNBE', arrivalTime: '05:55', departureTime: '06:05', platform: '10', distance: 995 },
            { name: 'Howrah Junction', stationCode: 'HWH', arrivalTime: '14:05', departureTime: '--', platform: '9', distance: 1441 },
        ],
    },
    {
        trainNumber: '12951',
        trainName: 'Mumbai Rajdhani',
        trainType: 'Rajdhani',
        classes: ['1A', '2A', '3A'],
        runningDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        stations: [
            { name: 'Mumbai Central', stationCode: 'MMCT', arrivalTime: '--', departureTime: '17:05', platform: '7', distance: 0 },
            { name: 'Vadodara Junction', stationCode: 'BRC', arrivalTime: '21:28', departureTime: '21:33', platform: '5', distance: 392 },
            { name: 'Ratlam Junction', stationCode: 'RTM', arrivalTime: '00:50', departureTime: '00:55', platform: '3', distance: 593 },
            { name: 'Kota Junction', stationCode: 'KOTA', arrivalTime: '04:00', departureTime: '04:05', platform: '4', distance: 825 },
            { name: 'Mathura Junction', stationCode: 'MTJ', arrivalTime: '08:03', departureTime: '08:05', platform: '6', distance: 1157 },
            { name: 'New Delhi', stationCode: 'NDLS', arrivalTime: '09:55', departureTime: '--', platform: '16', distance: 1384 },
        ],
    },
    {
        trainNumber: '12002',
        trainName: 'Bhopal Shatabdi',
        trainType: 'Shatabdi',
        classes: ['CC', '2S'],
        runningDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        stations: [
            { name: 'New Delhi', stationCode: 'NDLS', arrivalTime: '--', departureTime: '06:00', platform: '12', distance: 0 },
            { name: 'Agra Cantt', stationCode: 'AGC', arrivalTime: '08:25', departureTime: '08:30', platform: '1', distance: 199 },
            { name: 'Gwalior Junction', stationCode: 'GWL', arrivalTime: '09:43', departureTime: '09:45', platform: '3', distance: 319 },
            { name: 'Jhansi Junction', stationCode: 'JHS', arrivalTime: '11:05', departureTime: '11:10', platform: '5', distance: 415 },
            { name: 'Bhopal Junction', stationCode: 'BPL', arrivalTime: '14:15', departureTime: '--', platform: '6', distance: 707 },
        ],
    },
    {
        trainNumber: '12430',
        trainName: 'Lucknow AC SF',
        trainType: 'Superfast',
        classes: ['1A', '2A', '3A'],
        runningDays: ['Mon', 'Wed', 'Fri', 'Sat'],
        stations: [
            { name: 'New Delhi', stationCode: 'NDLS', arrivalTime: '--', departureTime: '22:20', platform: '14', distance: 0 },
            { name: 'Ghaziabad', stationCode: 'GZB', arrivalTime: '22:58', departureTime: '23:00', platform: '5', distance: 24 },
            { name: 'Moradabad', stationCode: 'MB', arrivalTime: '01:10', departureTime: '01:15', platform: '4', distance: 164 },
            { name: 'Bareilly', stationCode: 'BE', arrivalTime: '02:43', departureTime: '02:45', platform: '3', distance: 252 },
            { name: 'Lucknow', stationCode: 'LKO', arrivalTime: '06:10', departureTime: '--', platform: '6', distance: 495 },
        ],
    },
    {
        trainNumber: '12626',
        trainName: 'Kerala Express',
        trainType: 'Express',
        classes: ['SL', '3A', '2A'],
        runningDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        stations: [
            { name: 'New Delhi', stationCode: 'NDLS', arrivalTime: '--', departureTime: '11:00', platform: '10', distance: 0 },
            { name: 'Vadodara Junction', stationCode: 'BRC', arrivalTime: '01:35', departureTime: '01:40', platform: '4', distance: 935 },
            { name: 'Surat', stationCode: 'ST', arrivalTime: '03:20', departureTime: '03:25', platform: '2', distance: 1037 },
            { name: 'Mumbai Central', stationCode: 'MMCT', arrivalTime: '07:15', departureTime: '07:45', platform: '8', distance: 1384 },
            { name: 'Pune Junction', stationCode: 'PUNE', arrivalTime: '11:25', departureTime: '11:30', platform: '3', distance: 1528 },
            { name: 'Bangalore City', stationCode: 'SBC', arrivalTime: '06:00', departureTime: '06:15', platform: '9', distance: 2364 },
            { name: 'Ernakulam Junction', stationCode: 'ERS', arrivalTime: '17:30', departureTime: '17:35', platform: '4', distance: 2889 },
            { name: 'Trivandrum Central', stationCode: 'TVC', arrivalTime: '21:15', departureTime: '--', platform: '5', distance: 3149 },
        ],
    },
    {
        trainNumber: '12860',
        trainName: 'Gitanjali Express',
        trainType: 'Superfast',
        classes: ['SL', '3A', '2A', '1A'],
        runningDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        stations: [
            { name: 'Mumbai CST', stationCode: 'CSTM', arrivalTime: '--', departureTime: '06:30', platform: '18', distance: 0 },
            { name: 'Kalyan Junction', stationCode: 'KYN', arrivalTime: '07:18', departureTime: '07:20', platform: '7', distance: 54 },
            { name: 'Nashik Road', stationCode: 'NK', arrivalTime: '10:03', departureTime: '10:05', platform: '2', distance: 185 },
            { name: 'Bhusaval Junction', stationCode: 'BSL', arrivalTime: '13:40', departureTime: '13:50', platform: '5', distance: 424 },
            { name: 'Nagpur', stationCode: 'NGP', arrivalTime: '20:15', departureTime: '20:25', platform: '4', distance: 839 },
            { name: 'Raipur Junction', stationCode: 'R', arrivalTime: '01:15', departureTime: '01:25', platform: '3', distance: 1130 },
            { name: 'Howrah Junction', stationCode: 'HWH', arrivalTime: '14:50', departureTime: '--', platform: '23', distance: 2120 },
        ],
    },
    {
        trainNumber: '12434',
        trainName: 'Chennai Rajdhani',
        trainType: 'Rajdhani',
        classes: ['1A', '2A', '3A'],
        runningDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        stations: [
            { name: 'New Delhi', stationCode: 'NDLS', arrivalTime: '--', departureTime: '15:55', platform: '11', distance: 0 },
            { name: 'Agra Cantt', stationCode: 'AGC', arrivalTime: '18:33', departureTime: '18:35', platform: '2', distance: 199 },
            { name: 'Jhansi Junction', stationCode: 'JHS', arrivalTime: '21:03', departureTime: '21:05', platform: '4', distance: 415 },
            { name: 'Bhopal Junction', stationCode: 'BPL', arrivalTime: '00:45', departureTime: '00:50', platform: '5', distance: 707 },
            { name: 'Nagpur', stationCode: 'NGP', arrivalTime: '07:15', departureTime: '07:25', platform: '6', distance: 1125 },
            { name: 'Vijayawada Junction', stationCode: 'BZA', arrivalTime: '16:50', departureTime: '16:55', platform: '4', distance: 1821 },
            { name: 'Chennai Central', stationCode: 'MAS', arrivalTime: '22:05', departureTime: '--', platform: '9', distance: 2194 },
        ],
    },
    {
        trainNumber: '12423',
        trainName: 'Dibrugarh Rajdhani',
        trainType: 'Rajdhani',
        classes: ['1A', '2A', '3A'],
        runningDays: ['Tue', 'Thu', 'Sun'],
        stations: [
            { name: 'New Delhi', stationCode: 'NDLS', arrivalTime: '--', departureTime: '11:00', platform: '13', distance: 0 },
            { name: 'Ghaziabad', stationCode: 'GZB', arrivalTime: '11:38', departureTime: '11:40', platform: '4', distance: 24 },
            { name: 'Lucknow', stationCode: 'LKO', arrivalTime: '17:25', departureTime: '17:35', platform: '5', distance: 495 },
            { name: 'Varanasi Junction', stationCode: 'BSB', arrivalTime: '21:50', departureTime: '22:00', platform: '9', distance: 764 },
            { name: 'Patna Junction', stationCode: 'PNBE', arrivalTime: '02:05', departureTime: '02:15', platform: '8', distance: 995 },
            { name: 'Malda Town', stationCode: 'MLDT', arrivalTime: '08:40', departureTime: '08:45', platform: '2', distance: 1445 },
            { name: 'New Jalpaiguri', stationCode: 'NJP', arrivalTime: '12:55', departureTime: '13:10', platform: '4', distance: 1809 },
            { name: 'Guwahati', stationCode: 'GHY', arrivalTime: '20:35', departureTime: '20:50', platform: '1', distance: 2515 },
            { name: 'Dibrugarh', stationCode: 'DBRG', arrivalTime: '06:05', departureTime: '--', platform: '1', distance: 3016 },
        ],
    },
];

const importData = async () => {
    try {
        await User.deleteMany();
        await Train.deleteMany();
        await LiveStatus.deleteMany();
        await Booking.deleteMany();

        const createdUsers = await User.insertMany(users);
        console.log('✓ Users imported');

        const createdTrains = await Train.insertMany(trains);
        console.log('✓ Trains imported');

        for (const train of createdTrains) {
            const randomStationIndex = Math.floor(Math.random() * (train.stations.length - 1));
            const currentStation = train.stations[randomStationIndex];
            const nextStation = train.stations[randomStationIndex + 1];

            const delays = [0, 0, 0, 5, 10, 15, 30];
            const statuses = ['On Time', 'On Time', 'On Time', 'Delayed'];

            const delayMinutes = delays[Math.floor(Math.random() * delays.length)];
            const status = delayMinutes > 0 ? 'Delayed' : 'On Time';

            await LiveStatus.create({
                train: train._id,
                trainNumber: train.trainNumber,
                currentStation: currentStation.name,
                currentStationCode: currentStation.stationCode,
                delayMinutes,
                status,
                nextStation: nextStation ? nextStation.name : '',
                nextStationETA: nextStation ? nextStation.arrivalTime : '',
                currentSpeed: Math.floor(Math.random() * 80) + 40,
                lastUpdated: new Date(),
            });
        }
        console.log('✓ Live status data imported');

        const sampleBookings = [
            {
                user: createdUsers[1]._id,
                train: createdTrains[0]._id,
                trainNumber: createdTrains[0].trainNumber,
                trainName: createdTrains[0].trainName,
                pnr: '2345678901',
                from: 'New Delhi',
                to: 'Howrah Junction',
                journeyDate: new Date('2024-12-25'),
                class: '3A',
                passengers: [
                    { name: 'John Doe', age: 30, gender: 'Male', berthPreference: 'Lower' },
                    { name: 'Jane Doe', age: 28, gender: 'Female', berthPreference: 'Lower' },
                ],
                seatDetails: {
                    coach: 'A1',
                    seats: ['23', '24'],
                },
                fare: 2850,
                paymentStatus: 'Completed',
                bookingStatus: 'Confirmed',
            },
        ];

        await Booking.insertMany(sampleBookings);
        console.log('✓ Sample bookings imported');

        console.log('\n✅ Data import successful!');
        console.log('\nAdmin credentials:');
        console.log('Email: admin@trainbooking.com');
        console.log('Password: admin123');
        console.log('\nUser credentials:');
        console.log('Email: john@example.com');
        console.log('Password: password123');

        process.exit();
    } catch (error) {
        console.error('Error importing data:', error);
        process.exit(1);
    }
};

importData();
