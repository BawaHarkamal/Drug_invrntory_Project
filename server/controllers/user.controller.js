const User = require('../models/User');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');

// @desc    Get all users
// @route   GET /api/users
// @access  Private (Admin)
exports.getUsers = asyncHandler(async (req, res, next) => {
  const users = await User.find();

  res.status(200).json({
    success: true,
    count: users.length,
    data: users
  });
});

// @desc    Get user by ID
// @route   GET /api/users/:id
// @access  Private (Admin)
exports.getUser = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return next(
      new ErrorResponse(`User not found with id of ${req.params.id}`, 404)
    );
  }

  res.status(200).json({
    success: true,
    data: user
  });
});

// @desc    Create user
// @route   POST /api/users
// @access  Private (Admin)
exports.createUser = asyncHandler(async (req, res, next) => {
  const user = await User.create(req.body);

  res.status(201).json({
    success: true,
    data: user
  });
});

// @desc    Update user
// @route   PUT /api/users/:id
// @access  Private (Admin)
exports.updateUser = asyncHandler(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  if (!user) {
    return next(
      new ErrorResponse(`User not found with id of ${req.params.id}`, 404)
    );
  }

  res.status(200).json({
    success: true,
    data: user
  });
});

// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Private (Admin)
exports.deleteUser = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return next(
      new ErrorResponse(`User not found with id of ${req.params.id}`, 404)
    );
  }

  await user.remove();

  res.status(200).json({
    success: true,
    data: {}
  });
});

// @desc    Get users by role
// @route   GET /api/users/role/:role
// @access  Private
exports.getUsersByRole = asyncHandler(async (req, res, next) => {
  const { role } = req.params;
  
  // Validate role
  const validRoles = ['consumer', 'retailer', 'manufacturer', 'supplier'];
  
  if (!validRoles.includes(role)) {
    return next(
      new ErrorResponse(`Invalid role: ${role}`, 400)
    );
  }
  
  // Restrict access based on role
  if (req.user.role !== 'admin') {
    // Manufacturers can only view retailers and suppliers
    if (req.user.role === 'manufacturer' && !['retailer', 'supplier'].includes(role)) {
      return next(
        new ErrorResponse(
          `User role ${req.user.role} is not authorized to view users with role ${role}`,
          403
        )
      );
    }
    
    // Retailers can only view manufacturers
    if (req.user.role === 'retailer' && role !== 'manufacturer') {
      return next(
        new ErrorResponse(
          `User role ${req.user.role} is not authorized to view users with role ${role}`,
          403
        )
      );
    }
    
    // Suppliers can only view manufacturers
    if (req.user.role === 'supplier' && role !== 'manufacturer') {
      return next(
        new ErrorResponse(
          `User role ${req.user.role} is not authorized to view users with role ${role}`,
          403
        )
      );
    }
    
    // Consumers cannot view any user lists
    if (req.user.role === 'consumer') {
      return next(
        new ErrorResponse(
          `User role consumer is not authorized to view user lists`,
          403
        )
      );
    }
  }
  
  const users = await User.find({ role }).select('name email phone address');

  res.status(200).json({
    success: true,
    count: users.length,
    data: users
  });
}); 