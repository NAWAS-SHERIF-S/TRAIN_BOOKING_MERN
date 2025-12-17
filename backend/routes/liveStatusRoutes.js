import express from 'express';
import { 
    getLiveStatus, 
    updateLiveStatus, 
    refreshAllTrainStatuses,
    getPNRStatus 
} from '../controllers/liveStatusController.js';
import { protect } from '../middleware/auth.js';
import { admin } from '../middleware/admin.js';

const router = express.Router();

// Get live status for specific train
router.get('/:trainNumber', getLiveStatus);

// Update live status (admin only)
router.put('/:trainNumber', protect, admin, updateLiveStatus);

// Refresh all train statuses from external API (admin only)
router.post('/refresh-all', protect, admin, refreshAllTrainStatuses);

// Get PNR status from external API
router.get('/pnr/:pnrNumber', getPNRStatus);

export default router;
