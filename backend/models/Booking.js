import mongoose from 'mongoose';

const passengerSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    age: {
        type: Number,
        required: true,
        min: 1,
        max: 120,
    },
    gender: {
        type: String,
        enum: ['Male', 'Female', 'Other'],
        required: true,
    },
    berthPreference: {
        type: String,
        enum: ['Lower', 'Middle', 'Upper', 'Side Lower', 'Side Upper', 'No Preference'],
        default: 'No Preference',
    },
});

const bookingSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        train: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Train',
            required: true,
        },
        trainNumber: {
            type: String,
            required: true,
        },
        trainName: {
            type: String,
            required: true,
        },
        pnr: {
            type: String,
            required: true,
            unique: true,
        },
        from: {
            type: String,
            required: true,
        },
        to: {
            type: String,
            required: true,
        },
        journeyDate: {
            type: Date,
            required: true,
        },
        class: {
            type: String,
            enum: ['SL', '3A', '2A', '1A', 'CC', '2S'],
            required: true,
        },
        passengers: [passengerSchema],
        seatDetails: {
            coach: {
                type: String,
                default: 'TBA',
            },
            seats: [String],
        },
        fare: {
            type: Number,
            required: true,
            min: 0,
        },
        paymentStatus: {
            type: String,
            enum: ['Pending', 'Completed', 'Failed', 'Refunded'],
            default: 'Completed',
        },
        bookingStatus: {
            type: String,
            enum: ['Confirmed', 'Waitlisted', 'Cancelled', 'RAC'],
            default: 'Confirmed',
        },
    },
    {
        timestamps: true,
    }
);

bookingSchema.index({ user: 1 });
bookingSchema.index({ train: 1 });
bookingSchema.index({ pnr: 1 });
bookingSchema.index({ journeyDate: 1 });

const Booking = mongoose.model('Booking', bookingSchema);

export default Booking;
