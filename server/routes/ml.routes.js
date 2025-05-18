const express = require('express');
const {
  generateAnnualReport,
  getReports,
  getReport
} = require('../controllers/ml.controller');

const router = express.Router();

const { protect, authorize } = require('../middleware/auth');

// Protect all routes
router.use(protect);

// Only allow certain roles
router.use(authorize('admin', 'retailer', 'manufacturer', 'supplier'));

router.post('/analyze/:year', generateAnnualReport);
router.get('/reports', getReports);
router.get('/reports/:id', getReport);

module.exports = router; 