import enhancedTrainApiService from '../services/enhancedTrainApiService.js';
import Train from '../models/Train.js';
import LiveStatus from '../models/LiveStatus.js';
import ApiError from '../utils/ApiError.js';

// Sync train data from external APIs
export const syncTrainData = async (req, res, next) => {
    try {
        const { trainNumber } = req.params;
        
        // Fetch comprehensive data from external APIs
        const externalData = await enhancedTrainApiService.getTrainData(trainNumber);
        
        if (!externalData.schedule && !externalData.liveStatus) {
            return next(new ApiError(404, 'No data found for this train'));
        }

        let train = await Train.findOne({ trainNumber });
        
        // Update or create train with external schedule data
        if (externalData.schedule) {
            const scheduleData = {
                trainNumber: externalData.schedule.trainNumber,
                trainName: externalData.schedule.trainName,
                trainType: externalData.schedule.trainType,
                classes: externalData.schedule.classes,
                runningDays: externalData.schedule.runningDays,
                stations: externalData.schedule.stations
            };

            if (train) {
                Object.assign(train, scheduleData);
                await train.save();
            } else {
                train = await Train.create(scheduleData);
            }
        }

        // Update live status with external data
        if (externalData.liveStatus && train) {
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

        res.json({
            success: true,
            message: 'Train data synced successfully',
            data: {
                train: train,
                liveStatus: externalData.liveStatus,
                source: externalData.schedule?.source || externalData.liveStatus?.source
            }
        });
    } catch (error) {
        next(error);
    }
};

// Search trains from external APIs
export const searchExternalTrains = async (req, res, next) => {
    try {
        const { from, to, date } = req.query;
        
        if (!from || !to) {
            return next(new ApiError(400, 'From and To stations are required'));
        }

        const trains = await enhancedTrainApiService.searchTrains(from, to, date);
        
        res.json({
            success: true,
            data: trains,
            count: trains.length
        });
    } catch (error) {
        next(error);
    }
};

// Get external PNR status
export const getExternalPNRStatus = async (req, res, next) => {
    try {
        const { pnrNumber } = req.params;
        
        const pnrData = await enhancedTrainApiService.getPNRStatus(pnrNumber);
        
        if (!pnrData) {
            return next(new ApiError(404, 'PNR not found'));
        }
        
        res.json({
            success: true,
            data: pnrData
        });
    } catch (error) {
        next(error);
    }
};

// Bulk sync multiple trains
export const bulkSyncTrains = async (req, res, next) => {
    try {
        const { trainNumbers } = req.body;
        
        if (!trainNumbers || !Array.isArray(trainNumbers)) {
            return next(new ApiError(400, 'Train numbers array is required'));
        }

        const results = [];
        
        for (const trainNumber of trainNumbers) {
            try {
                const externalData = await enhancedTrainApiService.getTrainData(trainNumber);
                
                if (externalData.schedule || externalData.liveStatus) {
                    let train = await Train.findOne({ trainNumber });
                    
                    if (externalData.schedule) {
                        const scheduleData = {
                            trainNumber: externalData.schedule.trainNumber,
                            trainName: externalData.schedule.trainName,
                            trainType: externalData.schedule.trainType,
                            classes: externalData.schedule.classes,
                            runningDays: externalData.schedule.runningDays,
                            stations: externalData.schedule.stations
                        };

                        if (train) {
                            Object.assign(train, scheduleData);
                            await train.save();
                        } else {
                            train = await Train.create(scheduleData);
                        }
                    }

                    if (externalData.liveStatus && train) {
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
                        trainNumber,
                        success: true,
                        source: externalData.schedule?.source || externalData.liveStatus?.source
                    });
                } else {
                    results.push({
                        trainNumber,
                        success: false,
                        error: 'No data found'
                    });
                }
            } catch (error) {
                results.push({
                    trainNumber,
                    success: false,
                    error: error.message
                });
            }
        }

        res.json({
            success: true,
            message: 'Bulk sync completed',
            data: {
                total: trainNumbers.length,
                successful: results.filter(r => r.success).length,
                failed: results.filter(r => !r.success).length,
                results
            }
        });
    } catch (error) {
        next(error);
    }
};