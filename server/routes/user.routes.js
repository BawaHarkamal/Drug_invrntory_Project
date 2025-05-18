const express = require('express');
const {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
  getUsersByRole
} = require('../controllers/user.controller');

const router = express.Router();

const { protect, authorize } = require('../middleware/auth');

// Protect all routes
router.use(protect);

// Admin only routes
router
  .route('/')
  .get(authorize('admin'), getUsers)
  .post(authorize('admin'), createUser);

router
  .route('/:id')
  .get(authorize('admin'), getUser)
  .put(authorize('admin'), updateUser)
  .delete(authorize('admin'), deleteUser);

// Role-specific access
router.get('/role/:role', getUsersByRole);

module.exports = router; 