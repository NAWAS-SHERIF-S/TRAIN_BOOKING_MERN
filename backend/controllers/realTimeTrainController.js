import enhancedTrainApiService from '../services/enhancedTrainApiService.js';
import Train from '../models/Train.js';
import LiveStatus from '../models/LiveStatus.js';
import ApiError from '../utils/ApiError.js';

// Fetch and sync real-time trains between stations
export const fetchRealTimeTrains = async (req, res, next) => {
    try {
        const { from, to, date } = req.query;
        
        if (!from || !to) {
            return next(new ApiError(400, 'From and To stations are required'));
        }

        // Fetch from external APIs
        const externalTrains = await enhancedTrainApiService.searchTrains(from, to, date);
        
        // Sync with database
        const syncedTrains = [];
        
        for (const externalTrain of externalTrains) {
            try {
                let train = await Train.findOne({ trainNumber: externalTrain.trainNumber });
                
                if (!train) {
                    // Create new train from external data
                    train = await Train.create({
                        trainNumber: externalTrain.trainNumber,
                        trainName: externalTrain.trainName,
                        trainType: externalTrain.trainType || 'Express',
                        classes: externalTrain.classes || ['SL', '3A', '2A'],
                        runningDays: externalTrain.runningDays || ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                        stations: [
                            {
                                name: externalTrain.from,
                                stationCode: 'SRC',
                                arrivalTime: '--',
                                departureTime: externalTrain.departureTime || '08:00',
                                platform: 'TBD',
                                distance: 0
                            },
                            {
                                name: externalTrain.to,
                                stationCode: 'DEST',
                                arrivalTime: externalTrain.arrivalTime || '20:00',
                                departureTime: '--',
                                platform: 'TBD',
                                distance: 500
                            }
                        ]
                    });
                }
                
                // Get live status
                const liveStatus = await enhancedTrainApiService.getLiveTrainStatus(externalTrain.trainNumber);
                
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
                }
                
                syncedTrains.push({
                    ...train.toObject(),
                    liveStatus,
                    externalData: externalTrain
                });
                
            } catch (error) {
                console.error(`Error syncing train ${externalTrain.trainNumber}:`, error.message);
            }
        }
        
        res.json({
            success: true,
            data: syncedTrains,
            count: syncedTrains.length,
            source: 'Real-time APIs'
        });
        
    } catch (error) {
        next(error);
    }
};

// Get popular routes with real-time data
export const getPopularRoutes = async (req, res, next) => {
    try {
        const popularRoutes = [
            { from: 'New Delhi', to: 'Mumbai Central', code: 'NDLS-MMCT' },
            { from: 'Chennai Central', to: 'Bangalore City', code: 'MAS-SBC' },
            { from: 'Howrah Junction', to: 'New Delhi', code: 'HWH-NDLS' },
            { from: 'Mumbai Central', to: 'Ahmedabad Junction', code: 'MMCT-ADI' },
            { from: 'Coimbatore Junction', to: 'Chennai Central', code: 'CBE-MAS' }
        ];
        
        const routeData = [];
        
        for (const route of popularRoutes) {
            try {
                const trains = await enhancedTrainApiService.searchTrains(route.from, route.to);
                routeData.push({
                    ...route,
                    trainCount: trains.length,
                    trains: trains.slice(0, 3) // Top 3 trains
                });
            } catch (error) {
                routeData.push({
                    ...route,
                    trainCount: 0,
                    trains: []
                });
            }
        }
        
        res.json({
            success: true,
            data: routeData
        });
        
    } catch (error) {
        next(error);
    }
};

// Bulk import real-time trains
export const bulkImportTrains = async (req, res, next) => {
    try {
        const realTimeTrains = [
            { trainNumber: '12301', trainName: 'Rajdhani Express', from: 'New Delhi', to: 'Howrah Junction' },
            { trainNumber: '12951', trainName: 'Mumbai Rajdhani', from: 'Mumbai Central', to: 'New Delhi' },
            { trainNumber: '12002', trainName: 'Bhopal Shatabdi', from: 'New Delhi', to: 'Bhopal Junction' },
            { trainNumber: '12626', trainName: 'Kerala Express', from: 'New Delhi', to: 'Trivandrum Central' },
            { trainNumber: '12860', trainName: 'Gitanjali Express', from: 'Mumbai CST', to: 'Howrah Junction' },
            { trainNumber: '12434', trainName: 'Chennai Rajdhani', from: 'New Delhi', to: 'Chennai Central' },
            { trainNumber: '12423', trainName: 'Dibrugarh Rajdhani', from: 'New Delhi', to: 'Dibrugarh' },
            { trainNumber: '12430', trainName: 'Lucknow AC SF', from: 'New Delhi', to: 'Lucknow' },
            { trainNumber: '22691', trainName: 'Bangalore Rajdhani', from: 'New Delhi', to: 'Bangalore City' },
            { trainNumber: '12009', trainName: 'Shatabdi Express', from: 'New Delhi', to: 'Kalka' }
        ];
        
        const results = [];
        
        for (const trainData of realTimeTrains) {
            try {
                // Get comprehensive data from external APIs
                const externalData = await enhancedTrainApiService.getTrainData(trainData.trainNumber);
                
                let train = await Train.findOne({ trainNumber: trainData.trainNumber });
                
                if (!train) {
                    train = await Train.create({
                        trainNumber: trainData.trainNumber,
                        trainName: trainData.trainName,
                        trainType: 'Express',
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
                                name: trainData.to,
                                stationCode: 'DEST',
                                arrivalTime: '20:00',
                                departureTime: '--',
                                platform: '2',
                                distance: 1000
                            }
                        ]
                    });
                }
                
                // Update live status
                if (externalData.liveStatus) {
                    await LiveStatus.findOneAndUpdate(
                        { train: train._id },
                        {
                            trainNumber: externalData.liveStatus.trainNumber,
                            currentStation: externalData.liveStatus.currentStation,
                            currentStationCode: externalData.liveStatus.currentStationCode,
                            delayMinutes: externalData.liveStatus.delayMinutes,
                            status: externalData.liveStatus.status,
                            nextStation: externalData.liveStatus.nextStation,
                            nextStationETA: externalData.liveStatus.nextStationETA,
                            currentSpeed: externalData.liveStatus.currentSpeed,
                            lastUpdated: externalData.liveStatus.lastUpdated
                        },
                        { upsert: true }
                    );
                }
                
                results.push({
                    trainNumber: trainData.trainNumber,
                    success: true,
                    hasLiveStatus: !!externalData.liveStatus
                });
                
            } catch (error) {
                results.push({
                    trainNumber: trainData.trainNumber,
                    success: false,
                    error: error.message
                });
            }
        }
        
        res.json({
            success: true,
            message: 'Bulk import completed',
            data: {
                total: realTimeTrains.length,
                successful: results.filter(r => r.success).length,
                failed: results.filter(r => !r.success).length,
                results
            }
        });
        
    } catch (error) {
        next(error);
    }
};