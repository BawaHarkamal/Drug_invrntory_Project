const Order = require('../models/Order');
const Medicine = require('../models/Medicine');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const path = require('path');

// @desc    Get all orders
// @route   GET /api/orders
// @access  Private
exports.getOrders = asyncHandler(async (req, res, next) => {
  let query;

  // Find all orders for admins
  if (req.user.role === 'admin') {
    query = Order.find()
      .populate({
        path: 'consumer',
        select: 'name email phone'
      })
      .populate({
        path: 'retailer',
        select: 'name email phone'
      })
      .populate({
        path: 'items.medicine',
        select: 'name price image'
      });
  } 
  // Find orders by role
  else {
    if (req.user.role === 'consumer') {
      query = Order.find({ consumer: req.user.id })
        .populate({
          path: 'retailer',
          select: 'name email phone'
        })
        .populate({
          path: 'items.medicine',
          select: 'name price image'
        });
    } else if (req.user.role === 'retailer') {
      query = Order.find({ retailer: req.user.id })
        .populate({
          path: 'consumer',
          select: 'name email phone'
        })
        .populate({
          path: 'items.medicine',
          select: 'name price image'
        });
    }
  }

  const orders = await query;

  res.status(200).json({
    success: true,
    count: orders.length,
    data: orders
  });
});

// @desc    Get single order
// @route   GET /api/orders/:id
// @access  Private
exports.getOrder = asyncHandler(async (req, res, next) => {
  const order = await Order.findById(req.params.id)
    .populate({
      path: 'consumer',
      select: 'name email phone'
    })
    .populate({
      path: 'retailer',
      select: 'name email phone'
    })
    .populate({
      path: 'items.medicine',
      select: 'name price image'
    });

  if (!order) {
    return next(
      new ErrorResponse(`Order not found with id of ${req.params.id}`, 404)
    );
  }

  // Make sure the user is related to the order
  if (
    order.consumer._id.toString() !== req.user.id &&
    order.retailer._id.toString() !== req.user.id &&
    req.user.role !== 'admin'
  ) {
    return next(
      new ErrorResponse(
        `User ${req.user.id} is not authorized to view this order`,
        401
      )
    );
  }

  res.status(200).json({
    success: true,
    data: order
  });
});

// @desc    Create new order
// @route   POST /api/orders
// @access  Private (Consumer)
exports.createOrder = asyncHandler(async (req, res, next) => {
  req.body.consumer = req.user.id;

  // Check if order items exist and have valid quantities
  if (!req.body.items || req.body.items.length === 0) {
    return next(new ErrorResponse('Please add at least one item to order', 400));
  }

  let totalAmount = 0;
  for (const item of req.body.items) {
    const medicine = await Medicine.findById(item.medicine);

    if (!medicine) {
      return next(
        new ErrorResponse(`Medicine not found with id of ${item.medicine}`, 404)
      );
    }

    // Check if enough stock is available
    if (medicine.stockQuantity < item.quantity) {
      return next(
        new ErrorResponse(
          `Insufficient stock for ${medicine.name}, only ${medicine.stockQuantity} available`,
          400
        )
      );
    }

    // Set retailer from medicine
    req.body.retailer = medicine.retailer;

    // Calculate price for this item
    item.price = medicine.price;
    
    // Add to total amount
    totalAmount += item.price * item.quantity;

    // Update stock quantity
    await Medicine.findByIdAndUpdate(item.medicine, {
      $inc: { stockQuantity: -item.quantity }
    });
  }

  // Set total amount
  req.body.totalAmount = totalAmount;

  // Generate tracking ID
  req.body.trackingId = 'TRK' + Date.now().toString().slice(-8);

  // Create order
  const order = await Order.create(req.body);

  res.status(201).json({
    success: true,
    data: order
  });
});

// @desc    Update order status
// @route   PUT /api/orders/:id/status
// @access  Private (Retailer, Admin)
exports.updateOrderStatus = asyncHandler(async (req, res, next) => {
  const { status } = req.body;

  if (!status) {
    return next(new ErrorResponse('Please provide a status', 400));
  }

  let order = await Order.findById(req.params.id);

  if (!order) {
    return next(
      new ErrorResponse(`Order not found with id of ${req.params.id}`, 404)
    );
  }

  // Make sure user is order retailer or admin
  if (
    order.retailer.toString() !== req.user.id &&
    req.user.role !== 'admin'
  ) {
    return next(
      new ErrorResponse(
        `User ${req.user.id} is not authorized to update this order`,
        401
      )
    );
  }

  order = await Order.findByIdAndUpdate(
    req.params.id,
    { status },
    {
      new: true,
      runValidators: true
    }
  );

  res.status(200).json({
    success: true,
    data: order
  });
});

// @desc    Update order location
// @route   PUT /api/orders/:id/location
// @access  Private (Retailer, Admin)
exports.updateOrderLocation = asyncHandler(async (req, res, next) => {
  const { latitude, longitude } = req.body;

  if (!latitude || !longitude) {
    return next(
      new ErrorResponse('Please provide latitude and longitude', 400)
    );
  }

  let order = await Order.findById(req.params.id);

  if (!order) {
    return next(
      new ErrorResponse(`Order not found with id of ${req.params.id}`, 404)
    );
  }

  // Make sure user is order retailer or admin
  if (
    order.retailer.toString() !== req.user.id &&
    req.user.role !== 'admin'
  ) {
    return next(
      new ErrorResponse(
        `User ${req.user.id} is not authorized to update this order location`,
        401
      )
    );
  }

  order = await Order.findByIdAndUpdate(
    req.params.id,
    { 
      currentLocation: {
        latitude,
        longitude,
        updatedAt: Date.now()
      }
    },
    {
      new: true,
      runValidators: true
    }
  );

  res.status(200).json({
    success: true,
    data: order
  });
});

// @desc    Upload prescription
// @route   PUT /api/orders/:id/prescription
// @access  Private (Consumer)
exports.uploadPrescription = asyncHandler(async (req, res, next) => {
  let order = await Order.findById(req.params.id);

  if (!order) {
    return next(
      new ErrorResponse(`Order not found with id of ${req.params.id}`, 404)
    );
  }

  // Make sure user is order consumer
  if (order.consumer.toString() !== req.user.id) {
    return next(
      new ErrorResponse(
        `User ${req.user.id} is not authorized to upload prescription for this order`,
        401
      )
    );
  }

  if (!req.files) {
    return next(new ErrorResponse(`Please upload a file`, 400));
  }

  const file = req.files.file;

  // Make sure the file is an image
  if (!file.mimetype.startsWith('image')) {
    return next(new ErrorResponse(`Please upload an image file`, 400));
  }

  // Check filesize
  if (file.size > process.env.MAX_FILE_UPLOAD) {
    return next(
      new ErrorResponse(
        `Please upload an image less than ${process.env.MAX_FILE_UPLOAD}`,
        400
      )
    );
  }

  // Create custom filename
  file.name = `prescription_${order._id}${path.parse(file.name).ext}`;

  file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`, async err => {
    if (err) {
      console.error(err);
      return next(new ErrorResponse(`Problem with file upload`, 500));
    }

    order = await Order.findByIdAndUpdate(
      req.params.id,
      { prescriptionImage: file.name },
      { new: true }
    );

    res.status(200).json({
      success: true,
      data: order
    });
  });
});

// @desc    Verify prescription
// @route   PUT /api/orders/:id/verify-prescription
// @access  Private (Retailer, Admin)
exports.verifyPrescription = asyncHandler(async (req, res, next) => {
  let order = await Order.findById(req.params.id);

  if (!order) {
    return next(
      new ErrorResponse(`Order not found with id of ${req.params.id}`, 404)
    );
  }

  // Make sure user is order retailer or admin
  if (
    order.retailer.toString() !== req.user.id &&
    req.user.role !== 'admin'
  ) {
    return next(
      new ErrorResponse(
        `User ${req.user.id} is not authorized to verify prescription for this order`,
        401
      )
    );
  }

  // Check if prescription image exists
  if (!order.prescriptionImage) {
    return next(
      new ErrorResponse('No prescription has been uploaded for this order', 400)
    );
  }

  order = await Order.findByIdAndUpdate(
    req.params.id,
    { prescriptionVerified: true },
    { new: true }
  );

  res.status(200).json({
    success: true,
    data: order
  });
}); 