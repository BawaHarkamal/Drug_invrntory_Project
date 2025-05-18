const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');

// Import controllers
const {
  createMedicineRequest,
  getMedicineRequests,
  getMedicineRequest,
  updateMedicineRequestStatus,
  deleteMedicineRequest
} = require('../controllers/medicineRequest.controller');

const {
  createSaltRequest,
  getSaltRequests,
  getSaltRequest,
  updateSaltRequestStatus,
  deleteSaltRequest
} = require('../controllers/saltRequest.controller');

// Protect all routes
router.use(protect);

// Medicine Request Routes
router
  .route('/medicine-requests')
  .get(getMedicineRequests)
  .post(authorize('retailer'), createMedicineRequest);

router
  .route('/medicine-requests/:id')
  .get(getMedicineRequest)
  .put(updateMedicineRequestStatus)
  .delete(authorize('retailer'), deleteMedicineRequest);

// Salt Request Routes
router
  .route('/salt-requests')
  .get(getSaltRequests)
  .post(authorize('manufacturer'), createSaltRequest);

router
  .route('/salt-requests/:id')
  .get(getSaltRequest)
  .put(updateSaltRequestStatus)
  .delete(authorize('manufacturer'), deleteSaltRequest);

module.exports = router; 