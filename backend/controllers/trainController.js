import Train from '../models/Train.js';
import LiveStatus from '../models/LiveStatus.js';
import ApiError from '../utils/ApiError.js';

export const getAllTrains = async (req, res, next) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const trains = await Train.find({ isActive: true })
            .skip(skip)
            .limit(limit)
            .sort({ trainNumber: 1 });

        const total = await Train.countDocuments({ isActive: true });

        res.json({
            success: true,
            data: trains,
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

export const getTrainById = async (req, res, next) => {
    try {
        const train = await Train.findById(req.params.id);

        if (!train) {
            return next(new ApiError(404, 'Train not found'));
        }

        const liveStatus = await LiveStatus.findOne({ train: train._id });

        res.json({
            success: true,
            data: {
                ...train.toObject(),
                liveStatus,
            },
        });
    } catch (error) {
        next(error);
    }
};

export const getTrainByNumber = async (req, res, next) => {
    try {
        const train = await Train.findOne({ trainNumber: req.params.trainNumber });

        if (!train) {
            return next(new ApiError(404, 'Train not found'));
        }

        const liveStatus = await LiveStatus.findOne({ train: train._id });

        res.json({
            success: true,
            data: {
                ...train.toObject(),
                liveStatus,
            },
        });
    } catch (error) {
        next(error);
    }
};

export const searchTrains = async (req, res, next) => {
    try {
        const { from, to } = req.query;

        console.log('Search request - from:', from, 'to:', to);

        if (!from || !to) {
            return next(new ApiError(400, 'Please provide from and to stations'));
        }

        const extractStation = (input) => {
            const match = input.match(/\(([^)]+)\)$/);
            return match ? match[1].trim() : input.trim();
        };

        const fromCode = extractStation(from);
        const toCode = extractStation(to);

        console.log('Extracted codes - from:', fromCode, 'to:', toCode);

        const trains = await Train.find({
            isActive: true,
            'stations.stationCode': { $all: [fromCode, toCode] }
        }).lean();

        console.log('Found trains:', trains.length);

        const validTrains = [];
        for (const train of trains) {
            const fromIndex = train.stations.findIndex(s => s.stationCode === fromCode);
            const toIndex = train.stations.findIndex(s => s.stationCode === toCode);

            console.log(`Train ${train.trainNumber}: fromIndex=${fromIndex}, toIndex=${toIndex}`);

            if (fromIndex !== -1 && toIndex !== -1 && fromIndex < toIndex) {
                const liveStatus = await LiveStatus.findOne({ train: train._id });
                validTrains.push({ ...train, liveStatus });
            }
        }

        console.log('Valid trains:', validTrains.length);

        res.json({
            success: true,
            data: validTrains,
            count: validTrains.length,
        });
    } catch (error) {
        next(error);
    }
};

export const createTrain = async (req, res, next) => {
    try {
        const train = await Train.create(req.body);

        await LiveStatus.create({
            train: train._id,
            trainNumber: train.trainNumber,
            currentStation: train.stations[0].name,
            currentStationCode: train.stations[0].stationCode,
            status: 'On Time',
            nextStation: train.stations.length > 1 ? train.stations[1].name : '',
            nextStationETA: train.stations.length > 1 ? train.stations[1].arrivalTime : '',
        });

        res.status(201).json({
            success: true,
            data: train,
        });
    } catch (error) {
        next(error);
    }
};

export const updateTrain = async (req, res, next) => {
    try {
        let train = await Train.findById(req.params.id);

        if (!train) {
            return next(new ApiError(404, 'Train not found'));
        }

        train = await Train.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        });

        res.json({
            success: true,
            data: train,
        });
    } catch (error) {
        next(error);
    }
};

export const deleteTrain = async (req, res, next) => {
    try {
        const train = await Train.findById(req.params.id);

        if (!train) {
            return next(new ApiError(404, 'Train not found'));
        }

        await train.deleteOne();
        await LiveStatus.deleteOne({ train: train._id });

        res.json({
            success: true,
            data: {},
        });
    } catch (error) {
        next(error);
    }
};
