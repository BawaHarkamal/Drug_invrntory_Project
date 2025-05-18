const SaltRequest = require('../models/SaltRequest');
const User = require('../models/User');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');

// @desc    Get all salt requests
// @route   GET /api/inventory/salt-requests
// @access  Private
exports.getSaltRequests = asyncHandler(async (req, res, next) => {
  let query;

  // Find salt requests based on role
  if (req.user.role === 'admin') {
    query = SaltRequest.find();
  } else if (req.user.role === 'manufacturer') {
    query = SaltRequest.find({ manufacturer: req.user.id });
  } else if (req.user.role === 'supplier') {
    query = SaltRequest.find({ supplier: req.user.id });
  } else {
    return next(
      new ErrorResponse(
        `User role ${req.user.role} is not authorized to view salt requests`,
        403
      )
    );
  }

  // Execute query with pagination
  query = query.populate({
    path: 'manufacturer',
    select: 'name email phone'
  }).populate({
    path: 'supplier',
    select: 'name email phone'
  });

  const saltRequests = await query;

  res.status(200).json({
    success: true,
    count: saltRequests.length,
    data: saltRequests
  });
});

// @desc    Get single salt request
// @route   GET /api/inventory/salt-requests/:id
// @access  Private
exports.getSaltRequest = asyncHandler(async (req, res, next) => {
  const saltRequest = await SaltRequest.findById(req.params.id)
    .populate({
      path: 'manufacturer',
      select: 'name email phone'
    })
    .populate({
      path: 'supplier',
      select: 'name email phone'
    });

  if (!saltRequest) {
    return next(
      new ErrorResponse(`Salt request not found with id of ${req.params.id}`, 404)
    );
  }

  // Make sure user has access to the salt request
  if (
    saltRequest.manufacturer._id.toString() !== req.user.id &&
    saltRequest.supplier._id.toString() !== req.user.id &&
    req.user.role !== 'admin'
  ) {
    return next(
      new ErrorResponse(
        `User ${req.user.id} is not authorized to view this salt request`,
        401
      )
    );
  }

  res.status(200).json({
    success: true,
    data: saltRequest
  });
});

// @desc    Create new salt request
// @route   POST /api/inventory/salt-requests
// @access  Private (Manufacturer)
exports.createSaltRequest = asyncHandler(async (req, res, next) => {
  // Add manufacturer from JWT
  req.body.manufacturer = req.user.id;

  // Check if supplier exists
  const supplier = await User.findById(req.body.supplier);

  if (!supplier) {
    return next(
      new ErrorResponse(`Supplier not found with id of ${req.body.supplier}`, 404)
    );
  }

  // Check if supplier has the correct role
  if (supplier.role !== 'supplier') {
    return next(
      new ErrorResponse(`User with id ${req.body.supplier} is not a supplier`, 400)
    );
  }

  // Create salt request
  const saltRequest = await SaltRequest.create(req.body);

  res.status(201).json({
    success: true,
    data: saltRequest
  });
});

// @desc    Update salt request status
// @route   PUT /api/inventory/salt-requests/:id
// @access  Private (Manufacturer, Supplier)
exports.updateSaltRequestStatus = asyncHandler(async (req, res, next) => {
  let saltRequest = await SaltRequest.findById(req.params.id);

  if (!saltRequest) {
    return next(
      new ErrorResponse(`Salt request not found with id of ${req.params.id}`, 404)
    );
  }

  // Make sure user is the manufacturer or supplier related to this request
  if (
    saltRequest.manufacturer.toString() !== req.user.id &&
    saltRequest.supplier.toString() !== req.user.id &&
    req.user.role !== 'admin'
  ) {
    return next(
      new ErrorResponse(
        `User ${req.user.id} is not authorized to update this salt request`,
        401
      )
    );
  }

  // Different actions based on role and status change
  const newStatus = req.body.status;
  const oldStatus = saltRequest.status;
  
  // Make sure suppliers can only approve/reject/deliver
  if (req.user.role === 'supplier') {
    if (
      !['approved', 'rejected', 'delivered'].includes(newStatus) ||
      (oldStatus !== 'pending' && newStatus === 'approved') ||
      (oldStatus !== 'approved' && newStatus === 'delivered')
    ) {
      return next(
        new ErrorResponse(
          `Invalid status transition from ${oldStatus} to ${newStatus} for supplier`,
          400
        )
      );
    }
    
    // Add approved date
    if (newStatus === 'approved') {
      req.body.approvedAt = Date.now();
    }
    
    // Add delivered date
    if (newStatus === 'delivered') {
      req.body.deliveredAt = Date.now();
    }
  }
  
  // Manufacturers can only cancel pending requests
  if (req.user.role === 'manufacturer') {
    if (
      newStatus !== 'cancelled' ||
      oldStatus !== 'pending'
    ) {
      return next(
        new ErrorResponse(
          `Manufacturers can only cancel pending requests`,
          400
        )
      );
    }
  }

  saltRequest = await SaltRequest.findByIdAndUpdate(
    req.params.id,
    req.body,
    {
      new: true,
      runValidators: true
    }
  );

  res.status(200).json({
    success: true,
    data: saltRequest
  });
});

// @desc    Delete salt request
// @route   DELETE /api/inventory/salt-requests/:id
// @access  Private (Manufacturer who created the request)
exports.deleteSaltRequest = asyncHandler(async (req, res, next) => {
  const saltRequest = await SaltRequest.findById(req.params.id);

  if (!saltRequest) {
    return next(
      new ErrorResponse(`Salt request not found with id of ${req.params.id}`, 404)
    );
  }

  // Make sure user is the manufacturer who created the request
  if (
    saltRequest.manufacturer.toString() !== req.user.id &&
    req.user.role !== 'admin'
  ) {
    return next(
      new ErrorResponse(
        `User ${req.user.id} is not authorized to delete this salt request`,
        401
      )
    );
  }

  // Check if the request is in pending status
  if (saltRequest.status !== 'pending') {
    return next(
      new ErrorResponse(
        `Cannot delete a salt request that is not in pending status`,
        400
      )
    );
  }

  await saltRequest.remove();

  res.status(200).json({
    success: true,
    data: {}
  });
}); 