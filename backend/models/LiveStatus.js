import mongoose from 'mongoose';

const liveStatusSchema = new mongoose.Schema(
    {
        train: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Train',
            required: true,
            unique: true,
        },
        trainNumber: {
            type: String,
            required: true,
        },
        currentStation: {
            type: String,
            required: true,
        },
        currentStationCode: {
            type: String,
            required: true,
        },
        delayMinutes: {
            type: Number,
            default: 0,
        },
        status: {
            type: String,
            enum: ['On Time', 'Delayed', 'Cancelled', 'Diverted', 'Running Late'],
            default: 'On Time',
        },
        lastUpdated: {
            type: Date,
            default: Date.now,
        },
        nextStation: {
            type: String,
            default: '',
        },
        nextStationETA: {
            type: String,
            default: '',
        },
        currentSpeed: {
            type: Number,
            default: 0,
        },
    },
    {
        timestamps: true,
    }
);

liveStatusSchema.index({ train: 1 });
liveStatusSchema.index({ trainNumber: 1 });

const LiveStatus = mongoose.model('LiveStatus', liveStatusSchema);

export default LiveStatus;
