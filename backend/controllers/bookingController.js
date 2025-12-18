import Booking from '../models/Booking.js';
import Train from '../models/Train.js';
import ApiError from '../utils/ApiError.js';

const generatePNR = () => {
    return Math.floor(1000000000 + Math.random() * 9000000000).toString();
};

const calculateFare = (distance, trainClass, passengerCount, train) => {
    const basePrice = train.pricing?.[trainClass] || 500;
    const distanceMultiplier = Math.max(1, distance / 500);
    const totalFare = Math.round(basePrice * distanceMultiplier * passengerCount);

    return totalFare;
};

export const createBooking = async (req, res, next) => {
    try {
        const { trainId, from, to, journeyDate, class: travelClass, passengers, fare: providedFare } = req.body;

        if (!trainId || !from || !to || !journeyDate || !travelClass || !passengers || passengers.length === 0) {
            return next(new ApiError(400, 'Please provide all required fields'));
        }

        const train = await Train.findById(trainId);

        if (!train) {
            return next(new ApiError(404, 'Train not found'));
        }

        // Use provided fare from frontend, or calculate as fallback
        let fare = providedFare;
        if (!fare) {
            // Extract station names and codes
            const fromStationName = from.split('(')[0].trim();
            const toStationName = to.split('(')[0].trim();
            
            // Find stations with flexible matching
            const fromStation = train.stations.find((s) =>
                s.name.toLowerCase().includes(fromStationName.toLowerCase()) ||
                fromStationName.toLowerCase().includes(s.name.toLowerCase())
            ) || train.stations[0];
            
            const toStation = train.stations.find((s) =>
                s.name.toLowerCase().includes(toStationName.toLowerCase()) ||
                toStationName.toLowerCase().includes(s.name.toLowerCase())
            ) || train.stations[train.stations.length - 1];

            const distance = Math.abs(toStation.distance - fromStation.distance);
            fare = calculateFare(distance, travelClass, passengers.length, train);
        }

        const pnr = generatePNR();

        const seatNumbers = passengers.map((_, index) => {
            const seatNum = Math.floor(Math.random() * 72) + 1;
            return `${seatNum}`;
        });

        const booking = await Booking.create({
            user: req.user._id,
            train: train._id,
            trainNumber: train.trainNumber,
            trainName: train.trainName,
            pnr,
            from,
            to,
            journeyDate,
            class: travelClass,
            passengers,
            seatDetails: {
                coach: `${travelClass}${Math.floor(Math.random() * 10) + 1}`,
                seats: seatNumbers,
            },
            fare,
            paymentStatus: 'Completed',
            bookingStatus: 'Confirmed',
        });

        res.status(201).json({
            success: true,
            data: booking,
        });
    } catch (error) {
        next(error);
    }
};

export const getUserBookings = async (req, res, next) => {
    try {
        const bookings = await Booking.find({ user: req.user._id })
            .populate('train', 'trainNumber trainName')
            .sort({ createdAt: -1 });

        res.json({
            success: true,
            data: bookings,
            count: bookings.length,
        });
    } catch (error) {
        next(error);
    }
};

export const getAllBookings = async (req, res, next) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;
        const skip = (page - 1) * limit;

        const bookings = await Booking.find()
            .populate('user', 'name email')
            .populate('train', 'trainNumber trainName')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        const total = await Booking.countDocuments();

        res.json({
            success: true,
            data: bookings,
            pagination: {
                page,
                limit,
                total,
                pages: Math.ceil(total / limit),
            },
        });
    } catch (error) {
        next(error);
    }
};

export const getBookingByPNR = async (req, res, next) => {
    try {
        const { pnr } = req.params;

        const booking = await Booking.findOne({ pnr })
            .populate('train', 'trainNumber trainName');

        if (!booking) {
            return next(new ApiError(404, 'PNR not found'));
        }

        res.json({
            success: true,
            data: booking,
        });
    } catch (error) {
        next(error);
    }
};

export const cancelBooking = async (req, res, next) => {
    try {
        const booking = await Booking.findById(req.params.id);

        if (!booking) {
            return next(new ApiError(404, 'Booking not found'));
        }

        if (booking.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            return next(new ApiError(403, 'Not authorized to cancel this booking'));
        }

        if (booking.bookingStatus === 'Cancelled') {
            return next(new ApiError(400, 'Booking already cancelled'));
        }

        booking.bookingStatus = 'Cancelled';
        booking.paymentStatus = 'Refunded';
        await booking.save();

        res.json({
            success: true,
            data: booking,
        });
    } catch (error) {
        next(error);
    }
};
