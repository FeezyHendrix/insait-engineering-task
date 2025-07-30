import express from 'express';
import {
  getSessionAnalyticsData,
  getStepAnalyticsData,
  getMessageAnalyticsData,
  getTimeBasedAnalyticsData,
  getAllAnalytics,
} from '../controllers/supersetAnalyticsController';

const router = express.Router();

// Individual analytics endpoints
router.get('/sessions', getSessionAnalyticsData);
router.get('/steps', getStepAnalyticsData);
router.get('/messages', getMessageAnalyticsData);
router.get('/time-based', getTimeBasedAnalyticsData);

// Combined analytics endpoint
router.get('/all', getAllAnalytics);

export default router;