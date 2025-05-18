const express = require('express');
const router = express.Router();
const { getAnalyticsReport, getDrugDemandTrends } = require('../controllers/analyticsController');
console.log('getAnalyticsReport:', getAnalyticsReport);
console.log('getDrugDemandTrends:', getDrugDemandTrends);
const { protect } = require('../middleware/auth');
console.log('protect:', protect);

// Get comprehensive analytics report (admin and manager only)
router.get('/report', protect, getAnalyticsReport);

// Get drug-specific demand trends (admin, manager, and pharmacist)
router.get('/drug/:drugId/trends', protect, getDrugDemandTrends);

module.exports = router; 