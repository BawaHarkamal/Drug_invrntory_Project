const Order = require('../models/Order');
const Medicine = require('../models/Medicine');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const path = require('path');

// @desc    Get all orders
// @route   GET /api/orders
// @access  Private
exports.getOrders = asyncHandler(async (req, res, next) => {
  const orders = await Order.find({ user: req.user.id })
    .populate('items.medicine', 'name price image')
    .sort('-createdAt');

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
    .populate('items.medicine', 'name price image');

  if (!order) {
    return next(new ErrorResponse(`Order not found with id ${req.params.id}`, 404));
  }

  // Make sure user owns order
  if (order.user.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(new ErrorResponse('Not authorized to access this order', 401));
  }

  res.status(200).json({
    success: true,
    data: order
  });
});

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
exports.createOrder = asyncHandler(async (req, res, next) => {
  const { items, shippingAddress, paymentMethod } = req.body;

  // Calculate total amount and validate stock
  let totalAmount = 0;
  for (const item of items) {
    const medicine = await Medicine.findById(item.medicine);
    if (!medicine) {
      return next(new ErrorResponse(`Medicine not found with id ${item.medicine}`, 404));
    }
    
    // Check stock availability
    if (medicine.stockQuantity < item.quantity) {
      return next(new ErrorResponse(`Insufficient stock for ${medicine.name}`, 400));
    }

    // Calculate item price
    item.price = medicine.price * item.quantity;
    totalAmount += item.price;

    // Update stock quantity
    await Medicine.findByIdAndUpdate(item.medicine, {
      $inc: { stockQuantity: -item.quantity }
    });
  }

  // Create order
  const order = await Order.create({
    user: req.user.id,
    items,
    totalAmount,
    shippingAddress,
    paymentMethod
  });

  // Populate medicine details
  await order.populate('items.medicine', 'name price');

  res.status(201).json({
    success: true,
    data: order
  });
});

// @desc    Update order status
// @route   PUT /api/orders/:id/status
// @access  Private (Admin)
exports.updateOrderStatus = asyncHandler(async (req, res, next) => {
  const { orderStatus } = req.body;

  const order = await Order.findById(req.params.id);

  if (!order) {
    return next(new ErrorResponse(`Order not found with id ${req.params.id}`, 404));
  }

  // Only admin can update order status
  if (req.user.role !== 'admin') {
    return next(new ErrorResponse('Not authorized to update order status', 401));
  }

  order.orderStatus = orderStatus;
  await order.save();

  res.status(200).json({
    success: true,
    data: order
  });
});

// @desc    Update payment status
// @route   PUT /api/orders/:id/payment
// @access  Private
exports.updatePaymentStatus = asyncHandler(async (req, res, next) => {
  const { paymentStatus } = req.body;

  const order = await Order.findById(req.params.id);

  if (!order) {
    return next(new ErrorResponse(`Order not found with id ${req.params.id}`, 404));
  }

  // Make sure user owns order
  if (order.user.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(new ErrorResponse('Not authorized to update this order', 401));
  }

  // Update payment status
  order.paymentStatus = paymentStatus;
  if (paymentStatus === 'completed') {
    order.orderStatus = 'confirmed';
  }

  await order.save();

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