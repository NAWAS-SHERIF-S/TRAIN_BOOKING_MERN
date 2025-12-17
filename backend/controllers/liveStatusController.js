import LiveStatus from '../models/LiveStatus.js';
import Train from '../models/Train.js';
import ApiError from '../utils/ApiError.js';
import trainApiService from '../services/trainApiService.js';

export const getLiveStatus = async (req, res, next) => {
    try {
        const { trainNumber } = req.params;

        const train = await Train.findOne({ trainNumber });

        if (!train) {
            return next(new ApiError(404, 'Train not found'));
        }

        // Fetch real-time data from external API
        const realTimeData = await trainApiService.getLiveTrainStatus(trainNumber);
        
        // Update or create live status in database
        let liveStatus = await LiveStatus.findOne({ train: train._id });
        
        if (!liveStatus) {
            liveStatus = await LiveStatus.create({
                train: train._id,
                trainNumber: realTimeData.trainNumber,
                currentStation: realTimeData.currentStation,
                currentStationCode: realTimeData.currentStationCode,
                delayMinutes: realTimeData.delayMinutes,
                status: realTimeData.status,
                nextStation: realTimeData.nextStation,
                nextStationETA: realTimeData.nextStationETA,
                currentSpeed: realTimeData.currentSpeed,
                lastUpdated: realTimeData.lastUpdated
            });
        } else {
            // Update existing record with fresh data
            Object.assign(liveStatus, {
                currentStation: realTimeData.currentStation,
                currentStationCode: realTimeData.currentStationCode,
                delayMinutes: realTimeData.delayMinutes,
                status: realTimeData.status,
                nextStation: realTimeData.nextStation,
                nextStationETA: realTimeData.nextStationETA,
                currentSpeed: realTimeData.currentSpeed,
                lastUpdated: realTimeData.lastUpdated
            });
            await liveStatus.save();
        }

        // Populate train details
        await liveStatus.populate('train', 'trainNumber trainName stations');
        
        // Add source information
        const responseData = {
            ...liveStatus.toObject(),
            source: realTimeData.source,
            fetchedAt: new Date()
        };

        res.json({
            success: true,
            data: responseData,
        });
    } catch (error) {
        next(error);
    }
};

// Get PNR status from external API
export const getPNRStatus = async (req, res, next) => {
    try {
        const { pnrNumber } = req.params;
        
        const pnrData = await trainApiService.getPNRStatus(pnrNumber);
        
        if (!pnrData) {
            return next(new ApiError(404, 'PNR not found or invalid'));
        }
        
        res.json({
            success: true,
            data: pnrData
        });
    } catch (error) {
        next(error);
    }
};

export const updateLiveStatus = async (req, res, next) => {
    try {
        const { trainNumber } = req.params;
        const {
            currentStation,
            currentStationCode,
            delayMinutes,
            status,
            nextStation,
            nextStationETA,
            currentSpeed,
        } = req.body;

        const train = await Train.findOne({ trainNumber });

        if (!train) {
            return next(new ApiError(404, 'Train not found'));
        }

        let liveStatus = await LiveStatus.findOne({ train: train._id });

        if (!liveStatus) {
            liveStatus = await LiveStatus.create({
                train: train._id,
                trainNumber,
                currentStation,
                currentStationCode,
                delayMinutes: delayMinutes || 0,
                status: status || 'On Time',
                nextStation: nextStation || '',
                nextStationETA: nextStationETA || '',
                currentSpeed: currentSpeed || 0,
                lastUpdated: Date.now(),
            });
        } else {
            liveStatus.currentStation = currentStation || liveStatus.currentStation;
            liveStatus.currentStationCode = currentStationCode || liveStatus.currentStationCode;
            liveStatus.delayMinutes = delayMinutes !== undefined ? delayMinutes : liveStatus.delayMinutes;
            liveStatus.status = status || liveStatus.status;
            liveStatus.nextStation = nextStation !== undefined ? nextStation : liveStatus.nextStation;
            liveStatus.nextStationETA = nextStationETA !== undefined ? nextStationETA : liveStatus.nextStationETA;
            liveStatus.currentSpeed = currentSpeed !== undefined ? currentSpeed : liveStatus.currentSpeed;
            liveStatus.lastUpdated = Date.now();

            await liveStatus.save();
        }

        res.json({
            success: true,
            data: liveStatus,
        });
    } catch (error) {
        next(error);
    }
};

// New endpoint to refresh all train statuses
export const refreshAllTrainStatuses = async (req, res, next) => {
    try {
        const trains = await Train.find({}, 'trainNumber');
        const trainNumbers = trains.map(train => train.trainNumber);
        
        const results = await trainApiService.batchUpdateTrains(trainNumbers);
        
        // Update database with fresh data
        for (const result of results) {
            if (result.success) {
                const train = await Train.findOne({ trainNumber: result.trainNumber });
                if (train) {
                    await LiveStatus.findOneAndUpdate(
                        { train: train._id },
                        {
                            trainNumber: result.data.trainNumber,
                            currentStation: result.data.currentStation,
                            currentStationCode: result.data.currentStationCode,
                            delayMinutes: result.data.delayMinutes,
                            status: result.data.status,
                            nextStation: result.data.nextStation,
                            nextStationETA: result.data.nextStationETA,
                            currentSpeed: result.data.currentSpeed,
                            lastUpdated: result.data.lastUpdated
                        },
                        { upsert: true }
                    );
                }
            }
        }
        
        res.json({
            success: true,
            message: 'All train statuses refreshed',
            data: {
                totalTrains: trainNumbers.length,
                successfulUpdates: results.filter(r => r.success).length,
                failedUpdates: results.filter(r => !r.success).length,
                results
            }
        });
    } catch (error) {
        next(error);
    }
};
