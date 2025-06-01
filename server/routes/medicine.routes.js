const express = require('express');
const {
  getMedicines,
  getMedicine,
  createMedicine,
  updateMedicine,
  deleteMedicine,
  searchMedicines
} = require('../controllers/medicineController');

const router = express.Router();

const { protect, authorize } = require('../middleware/auth');

// Search route
router.route('/search').get(searchMedicines);

// Main routes
router
  .route('/')
  .get(getMedicines)
  .post(protect, authorize('manufacturer', 'admin'), createMedicine);

router
  .route('/:id')
  .get(getMedicine)
  .put(protect, authorize('manufacturer', 'retailer', 'admin'), updateMedicine)
  .delete(protect, authorize('manufacturer', 'admin'), deleteMedicine);

module.exports = router; 