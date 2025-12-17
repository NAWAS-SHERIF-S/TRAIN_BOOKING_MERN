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
