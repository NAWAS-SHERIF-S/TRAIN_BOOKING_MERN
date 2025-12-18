import mongoose from 'mongoose';

const stationSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    arrivalTime: {
        type: String,
        required: true,
    },
    departureTime: {
        type: String,
        required: true,
    },
    platform: {
        type: String,
        default: 'TBA',
    },
    distance: {
        type: Number,
        default: 0,
    },
    stationCode: {
        type: String,
        required: true,
        uppercase: true,
    },
});

const trainSchema = new mongoose.Schema(
    {
        trainNumber: {
            type: String,
            required: [true, 'Please provide train number'],
            unique: true,
            trim: true,
        },
        trainName: {
            type: String,
            required: [true, 'Please provide train name'],
            trim: true,
        },
        stations: [stationSchema],
        runningDays: {
            type: [String],
            enum: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
            required: true,
        },
        trainType: {
            type: String,
            enum: ['Express', 'Superfast', 'Passenger', 'Duronto', 'Rajdhani', 'Shatabdi'],
            default: 'Express',
        },
        classes: {
            type: [String],
            enum: ['SL', '3A', '2A', '1A', 'CC', '2S'],
            default: ['SL', '3A'],
        },
        pricing: {
            SL: { type: Number, default: 195 },
            '3A': { type: Number, default: 695 },
            '2A': { type: Number, default: 1075 },
            '1A': { type: Number, default: 1675 },
            CC: { type: Number, default: 695 },
            '2S': { type: Number, default: 195 },
        },
        isActive: {
            type: Boolean,
            default: true,
        },
    },
    {
        timestamps: true,
    }
);

trainSchema.index({ trainNumber: 1 });
trainSchema.index({ 'stations.name': 1 });
trainSchema.index({ trainName: 'text' });

const Train = mongoose.model('Train', trainSchema);

export default Train;
