import express from 'express';
import {
    getAllTrains,
    getTrainById,
    getTrainByNumber,
    searchTrains,
    createTrain,
    updateTrain,
    deleteTrain,
    getAllStations,
} from '../controllers/trainController.js';
import { protect } from '../middleware/auth.js';
import { admin } from '../middleware/admin.js';

const router = express.Router();

router.get('/', getAllTrains);
router.get('/stations', getAllStations);
router.get('/search', searchTrains);
router.get('/number/:trainNumber', getTrainByNumber);
router.get('/:id', getTrainById);

router.post('/', protect, admin, createTrain);
router.put('/:id', protect, admin, updateTrain);
router.delete('/:id', protect, admin, deleteTrain);

export default router;
