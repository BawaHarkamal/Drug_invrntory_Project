const express = require('express');
const router = express.Router();
const mlController = require('../controllers/mlController');
const { authenticateToken } = require('../middleware/auth');

// Train the model with historical data
router.post('/train', authenticateToken, mlController.trainModel);

// Get predictions for future demand
router.get('/predictions', authenticateToken, mlController.getPredictions);

// Update the model with new data
router.post('/update', authenticateToken, mlController.updateModel);

module.exports = router; 