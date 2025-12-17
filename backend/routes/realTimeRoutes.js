import express from 'express';
import { 
    fetchRealTimeTrains, 
    getPopularRoutes,
    bulkImportTrains 
} from '../controllers/realTimeTrainController.js';
import { protect } from '../middleware/auth.js';
import { admin } from '../middleware/admin.js';

const router = express.Router();

// Fetch real-time trains between stations
router.get('/search', fetchRealTimeTrains);

// Get popular routes with real-time data
router.get('/popular-routes', getPopularRoutes);

// Bulk import trains with real-time data (admin only)
router.post('/bulk-import', protect, admin, bulkImportTrains);

export default router;