import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db.js';
import errorHandler from './middleware/errorHandler.js';
import trainStatusScheduler from './utils/scheduler.js';

import authRoutes from './routes/authRoutes.js';
import trainRoutes from './routes/trainRoutes.js';
import liveStatusRoutes from './routes/liveStatusRoutes.js';
import bookingRoutes from './routes/bookingRoutes.js';
import externalDataRoutes from './routes/externalDataRoutes.js';
import realTimeRoutes from './routes/realTimeRoutes.js';

import stationRoutes from './routes/stationRoutes.js';

dotenv.config();

connectDB();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.json({
        message: 'Train Booking API',
        version: '1.0.0',
        endpoints: {
            auth: '/api/auth',
            trains: '/api/trains',
            liveStatus: '/api/status',
            bookings: '/api/bookings',
        },
    });
});

app.use('/api/auth', authRoutes);
app.use('/api/trains', trainRoutes);
app.use('/api/status', liveStatusRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/external', externalDataRoutes);
app.use('/api/realtime', realTimeRoutes);
app.use('/api/stations', stationRoutes);

app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);

    // Start the train status scheduler
    trainStatusScheduler.start();
});
