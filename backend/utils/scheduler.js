import cron from 'node-cron';
import Train from '../models/Train.js';
import LiveStatus from '../models/LiveStatus.js';
import trainApiService from '../services/trainApiService.js';

class TrainStatusScheduler {
    constructor() {
        this.isRunning = false;
    }

    // Start the scheduler to update train statuses every 5 minutes
    start() {
        if (this.isRunning) {
            console.log('Scheduler is already running');
            return;
        }

        console.log('🚂 Starting train status scheduler...');
        
        // Update every 5 minutes
        cron.schedule('*/5 * * * *', async () => {
            await this.updateAllTrainStatuses();
        });

        // Update every hour for less frequent trains
        cron.schedule('0 * * * *', async () => {
            await this.updateLessFrequentTrains();
        });

        this.isRunning = true;
        console.log('✅ Train status scheduler started');
    }

    // Update all active train statuses
    async updateAllTrainStatuses() {
        try {
            console.log('🔄 Updating train statuses...');
            
            const trains = await Train.find({}, 'trainNumber trainName');
            const trainNumbers = trains.map(train => train.trainNumber);
            
            // Process in batches to avoid overwhelming the API
            const batchSize = 5;
            for (let i = 0; i < trainNumbers.length; i += batchSize) {
                const batch = trainNumbers.slice(i, i + batchSize);
                await this.processBatch(batch);
                
                // Wait 2 seconds between batches to respect API limits
                await this.delay(2000);
            }
            
            console.log(`✅ Updated ${trainNumbers.length} train statuses`);
        } catch (error) {
            console.error('❌ Error updating train statuses:', error.message);
        }
    }

    // Process a batch of trains
    async processBatch(trainNumbers) {
        const promises = trainNumbers.map(async (trainNumber) => {
            try {
                const realTimeData = await trainApiService.getLiveTrainStatus(trainNumber);
                const train = await Train.findOne({ trainNumber });
                
                if (train && realTimeData) {
                    await LiveStatus.findOneAndUpdate(
                        { train: train._id },
                        {
                            trainNumber: realTimeData.trainNumber,
                            currentStation: realTimeData.currentStation,
                            currentStationCode: realTimeData.currentStationCode,
                            delayMinutes: realTimeData.delayMinutes,
                            status: realTimeData.status,
                            nextStation: realTimeData.nextStation,
                            nextStationETA: realTimeData.nextStationETA,
                            currentSpeed: realTimeData.currentSpeed,
                            lastUpdated: realTimeData.lastUpdated
                        },
                        { upsert: true }
                    );
                }
            } catch (error) {
                console.error(`Error updating train ${trainNumber}:`, error.message);
            }
        });

        await Promise.allSettled(promises);
    }

    // Update less frequent trains (like weekly trains)
    async updateLessFrequentTrains() {
        try {
            console.log('🔄 Updating less frequent trains...');
            
            // Get trains that haven't been updated in the last hour
            const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
            const staleStatuses = await LiveStatus.find({
                lastUpdated: { $lt: oneHourAgo }
            }).populate('train', 'trainNumber');

            for (const status of staleStatuses) {
                try {
                    const realTimeData = await trainApiService.getLiveTrainStatus(status.trainNumber);
                    if (realTimeData) {
                        Object.assign(status, {
                            currentStation: realTimeData.currentStation,
                            currentStationCode: realTimeData.currentStationCode,
                            delayMinutes: realTimeData.delayMinutes,
                            status: realTimeData.status,
                            nextStation: realTimeData.nextStation,
                            nextStationETA: realTimeData.nextStationETA,
                            currentSpeed: realTimeData.currentSpeed,
                            lastUpdated: realTimeData.lastUpdated
                        });
                        await status.save();
                    }
                } catch (error) {
                    console.error(`Error updating stale train ${status.trainNumber}:`, error.message);
                }
                
                // Small delay between updates
                await this.delay(1000);
            }
            
            console.log(`✅ Updated ${staleStatuses.length} stale train statuses`);
        } catch (error) {
            console.error('❌ Error updating stale train statuses:', error.message);
        }
    }

    // Stop the scheduler
    stop() {
        this.isRunning = false;
        console.log('🛑 Train status scheduler stopped');
    }

    // Utility function to add delay
    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    // Manual trigger for immediate update
    async triggerManualUpdate() {
        console.log('🔄 Manual update triggered...');
        await this.updateAllTrainStatuses();
    }
}

export default new TrainStatusScheduler();