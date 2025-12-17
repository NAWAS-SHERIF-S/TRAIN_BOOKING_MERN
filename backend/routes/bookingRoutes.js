import express from 'express';
import {
    createBooking,
    getUserBookings,
    getAllBookings,
    getBookingByPNR,
    cancelBooking,
} from '../controllers/bookingController.js';
import { protect } from '../middleware/auth.js';
import { admin } from '../middleware/admin.js';

const router = express.Router();

router.post('/', protect, createBooking);
router.get('/user', protect, getUserBookings);
router.get('/all', protect, admin, getAllBookings);
router.get('/pnr/:pnr', getBookingByPNR);
router.put('/:id/cancel', protect, cancelBooking);

export default router;
