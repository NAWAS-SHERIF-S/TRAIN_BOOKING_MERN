import dotenv from 'dotenv';
import connectDB from '../config/db.js';
import User from '../models/User.js';
import Train from '../models/Train.js';
import LiveStatus from '../models/LiveStatus.js';
import Booking from '../models/Booking.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const STATION_FILE = path.join(__dirname, 'stations.json');

// Haversine formula to calculate distance between two coordinates
function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
    var R = 6371; // Radius of the earth in km
    var dLat = deg2rad(lat2 - lat1);  // deg2rad below
    var dLon = deg2rad(lon2 - lon1);
    var a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2)
        ;
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var d = R * c; // Distance in km
    return d;
}

function deg2rad(deg) {
    return deg * (Math.PI / 180)
}

const generateRandomTime = (startHour = 0, endHour = 23) => {
    const hour = Math.floor(Math.random() * (endHour - startHour + 1)) + startHour;
    const minute = Math.floor(Math.random() * 60);
    return `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
};

const addMinutes = (time, minutes) => {
    const [h, m] = time.split(':').map(Number);
    const date = new Date(2024, 0, 1, h, m);
    date.setMinutes(date.getMinutes() + minutes);
    return `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
}


const seedLargeData = async () => {
    try {
        await connectDB();
        console.log('Connected to DB');

        // Load Stations
        console.log('Loading station data...');
        const stationsRaw = fs.readFileSync(STATION_FILE, 'utf8');
        const stationsData = JSON.parse(stationsRaw);

        // Filter valid stations (must have features)
        const allStations = stationsData.features
            .filter(f => f.geometry && f.geometry.coordinates && f.properties && f.properties.name && f.properties.code)
            .map(f => ({
                name: f.properties.name,
                code: f.properties.code,
                lat: f.geometry.coordinates[1],
                lon: f.geometry.coordinates[0],
                state: f.properties.state
            }));

        console.log(`Loaded ${allStations.length} valid stations.`);

        // Clear existing data
        console.log('Clearing old data...');
        await User.deleteMany();
        await Train.deleteMany();
        await LiveStatus.deleteMany();
        await Booking.deleteMany();

        // Create Users
        const users = [
            { name: 'Admin User', email: 'admin@trainbooking.com', password: 'admin123', role: 'admin' },
            { name: 'John Doe', email: 'john@example.com', password: 'password123', role: 'user' },
        ];
        await User.insertMany(users);
        console.log('Users created.');

        const TRAIN_COUNT = 10000;
        const BATCH_SIZE = 500;
        const trainTypes = ['Express', 'Superfast', 'Rajdhani', 'Shatabdi', 'Duronto', 'Passenger'];
        const classes = ['1A', '2A', '3A', 'SL', 'CC', '2S'];

        let trainBuffer = [];
        let liveStatusBuffer = [];

        console.log(`Generating ${TRAIN_COUNT} trains...`);

        for (let i = 0; i < TRAIN_COUNT; i++) {
            // Pick two random stations
            const startIdx = Math.floor(Math.random() * allStations.length);
            let endIdx = Math.floor(Math.random() * allStations.length);
            while (startIdx === endIdx) {
                endIdx = Math.floor(Math.random() * allStations.length);
            }

            const startStation = allStations[startIdx];
            const endStation = allStations[endIdx];

            // Pick 3-10 intermediate stations
            const numIntermediates = Math.floor(Math.random() * 8) + 3;
            let intermediateStations = [];
            for (let j = 0; j < numIntermediates; j++) {
                intermediateStations.push(allStations[Math.floor(Math.random() * allStations.length)]);
            }

            // Combine and sort by distance from startStation
            let routeStations = [startStation, ...intermediateStations, endStation];

            // Remove duplicates based on code
            routeStations = [...new Map(routeStations.map(item => [item.code, item])).values()];

            // Sort by distance from start
            routeStations.forEach(s => {
                s.distanceFromStart = getDistanceFromLatLonInKm(startStation.lat, startStation.lon, s.lat, s.lon);
            });
            routeStations.sort((a, b) => a.distanceFromStart - b.distanceFromStart);

            // Generate schedule
            const formattedStations = [];
            let currentDistance = 0;
            let currentTime = generateRandomTime(4, 10); // Start between 4am and 10am

            for (let k = 0; k < routeStations.length; k++) {
                const s = routeStations[k];
                const distDiff = s.distanceFromStart - currentDistance;
                const timeTaken = Math.max(10, Math.floor((distDiff / 60) * 60)); // 60km/h avg speed, min 10 mins

                let arrivalTime = '--';
                let departureTime = '--';

                if (k === 0) {
                    departureTime = currentTime;
                } else {
                    const arrival = addMinutes(currentTime, timeTaken);
                    arrivalTime = arrival;
                    if (k === routeStations.length - 1) {
                        // Last station
                        departureTime = '--';
                    } else {
                        // Intermediate: stop for 5-10 mins
                        const stopTime = Math.floor(Math.random() * 6) + 5;
                        departureTime = addMinutes(arrival, stopTime);
                        currentTime = departureTime; // Update current buffer time
                        currentDistance = s.distanceFromStart;
                    }
                }

                // For simplified logic in loop, just update 'currentTime' for next iteration base
                if (k > 0 && k < routeStations.length - 1) {
                    // already updated above
                } else if (k === 0) {
                    // departure is set
                }

                formattedStations.push({
                    name: s.name,
                    stationCode: s.code,
                    arrivalTime,
                    departureTime,
                    platform: Math.floor(Math.random() * 10) + 1,
                    distance: Math.floor(s.distanceFromStart)
                });
            }

            const trainNumber = (10000 + i).toString();
            const trainName = `${startStation.name} - ${endStation.name} Express`;
            const trainType = trainTypes[Math.floor(Math.random() * trainTypes.length)];

            const train = {
                trainNumber,
                trainName,
                trainType,
                classes,
                runningDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                stations: formattedStations
            };

            trainBuffer.push(train);

            // Live Status (Simplified: just referencing the bulk insert structure later is tricky because we need IDs)
            // Strategy: Insert trains first, then get IDs, then insert LiveStatus.
            // But for 10k, that's heavy. Mongoose insertMany returns docs with IDs.

            if (trainBuffer.length >= BATCH_SIZE || i === TRAIN_COUNT - 1) {
                const createdTrains = await Train.insertMany(trainBuffer);
                // console.log(`Inserted batch of ${createdTrains.length} trains`);

                const liveStatusBatch = createdTrains.map(t => {
                    const currentStIdx = Math.floor(Math.random() * (t.stations.length - 1));
                    const curr = t.stations[currentStIdx];
                    const next = t.stations[currentStIdx + 1];

                    const delay = Math.random() > 0.7 ? Math.floor(Math.random() * 60) : 0;

                    return {
                        train: t._id,
                        trainNumber: t.trainNumber,
                        currentStation: curr.name,
                        currentStationCode: curr.stationCode,
                        delayMinutes: delay,
                        status: delay > 0 ? 'Delayed' : 'On Time',
                        nextStation: next ? next.name : 'N/A',
                        nextStationETA: next ? next.arrivalTime : 'N/A',
                        currentSpeed: Math.floor(Math.random() * 60) + 40,
                        lastUpdated: new Date()
                    };
                });

                await LiveStatus.insertMany(liveStatusBatch);
                trainBuffer = [];
                // console.log(`Inserted batch of LiveStatus`);
                process.stdout.write('.'); // Progress indicator
            }
        }

        console.log('\n\n✅ Successfully seeded 10,000 trains with live status.');
        process.exit(0);

    } catch (error) {
        console.error('Seeding failed:', error);
        process.exit(1);
    }
};

seedLargeData();
