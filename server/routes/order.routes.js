const express = require('express');
const {
  getOrders,
  getOrder,
  createOrder,
  updateOrderStatus,
  updateOrderLocation,
  uploadPrescription,
  verifyPrescription,
  updatePaymentStatus
} = require('../controllers/order.controller');

const router = express.Router();

const { protect, authorize } = require('../middleware/auth');

// Protect all routes
router.use(protect);

router
  .route('/')
  .get(getOrders)
  .post(createOrder);

router
  .route('/:id')
  .get(getOrder);

router
  .route('/:id/status')
  .put(authorize('admin'), updateOrderStatus);

router
  .route('/:id/location')
  .put(authorize('retailer', 'admin'), updateOrderLocation);

router
  .route('/:id/prescription')
  .put(authorize('consumer'), uploadPrescription);

router
  .route('/:id/verify-prescription')
  .put(authorize('retailer', 'admin'), verifyPrescription);

router
  .route('/:id/payment')
  .put(updatePaymentStatus);

module.exports = router; 