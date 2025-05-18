const express = require('express');
const {
  getMedicines,
  getMedicine,
  createMedicine,
  updateMedicine,
  deleteMedicine,
  medicinePhotoUpload,
  searchMedicines
} = require('../controllers/medicine.controller');

const router = express.Router();

const { protect, authorize } = require('../middleware/auth');

router.route('/search').get(searchMedicines);

router
  .route('/')
  .get(getMedicines)
  .post(protect, authorize('manufacturer', 'admin'), createMedicine);

router
  .route('/:id')
  .get(getMedicine)
  .put(protect, authorize('manufacturer', 'retailer', 'admin'), updateMedicine)
  .delete(protect, authorize('manufacturer', 'admin'), deleteMedicine);

router
  .route('/:id/photo')
  .put(
    protect,
    authorize('manufacturer', 'retailer', 'admin'),
    medicinePhotoUpload
  );

module.exports = router; 