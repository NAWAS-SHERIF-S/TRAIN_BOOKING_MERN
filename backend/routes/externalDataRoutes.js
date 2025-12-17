import express from 'express';
import { 
    syncTrainData, 
    searchExternalTrains, 
    getExternalPNRStatus,
    bulkSyncTrains 
} from '../controllers/externalDataController.js';
import { protect } from '../middleware/auth.js';
import { admin } from '../middleware/admin.js';

const router = express.Router();

// Sync single train data from external APIs
router.post('/sync/:trainNumber', protect, admin, syncTrainData);

// Search trains from external APIs
router.get('/search', searchExternalTrains);

// Get PNR status from external APIs
router.get('/pnr/:pnrNumber', getExternalPNRStatus);

// Bulk sync multiple trains (admin only)
router.post('/bulk-sync', protect, admin, bulkSyncTrains);

export default router;