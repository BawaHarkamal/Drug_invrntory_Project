const MedicineRequest = require('../models/MedicineRequest');
const Medicine = require('../models/Medicine');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');

// @desc    Get all medicine requests
// @route   GET /api/inventory/medicine-requests
// @access  Private
exports.getMedicineRequests = asyncHandler(async (req, res, next) => {
  let query;

  // Find medicine requests based on role
  if (req.user.role === 'admin') {
    query = MedicineRequest.find();
  } else if (req.user.role === 'retailer') {
    query = MedicineRequest.find({ retailer: req.user.id });
  } else if (req.user.role === 'manufacturer') {
    query = MedicineRequest.find({ manufacturer: req.user.id });
  } else {
    return next(
      new ErrorResponse(
        `User role ${req.user.role} is not authorized to view medicine requests`,
        403
      )
    );
  }

  // Execute query with pagination
  query = query.populate({
    path: 'retailer',
    select: 'name email phone'
  }).populate({
    path: 'manufacturer',
    select: 'name email phone'
  }).populate({
    path: 'medicine',
    select: 'name price stockQuantity'
  });

  const medicineRequests = await query;

  res.status(200).json({
    success: true,
    count: medicineRequests.length,
    data: medicineRequests
  });
});

// @desc    Get single medicine request
// @route   GET /api/inventory/medicine-requests/:id
// @access  Private
exports.getMedicineRequest = asyncHandler(async (req, res, next) => {
  const medicineRequest = await MedicineRequest.findById(req.params.id)
    .populate({
      path: 'retailer',
      select: 'name email phone'
    })
    .populate({
      path: 'manufacturer',
      select: 'name email phone'
    })
    .populate({
      path: 'medicine',
      select: 'name price stockQuantity'
    });

  if (!medicineRequest) {
    return next(
      new ErrorResponse(`Medicine request not found with id of ${req.params.id}`, 404)
    );
  }

  // Make sure user has access to the medicine request
  if (
    medicineRequest.retailer._id.toString() !== req.user.id &&
    medicineRequest.manufacturer._id.toString() !== req.user.id &&
    req.user.role !== 'admin'
  ) {
    return next(
      new ErrorResponse(
        `User ${req.user.id} is not authorized to view this medicine request`,
        401
      )
    );
  }

  res.status(200).json({
    success: true,
    data: medicineRequest
  });
});

// @desc    Create new medicine request
// @route   POST /api/inventory/medicine-requests
// @access  Private (Retailer)
exports.createMedicineRequest = asyncHandler(async (req, res, next) => {
  // Add retailer from JWT
  req.body.retailer = req.user.id;

  // Check if medicine exists
  const medicine = await Medicine.findById(req.body.medicine);

  if (!medicine) {
    return next(
      new ErrorResponse(`Medicine not found with id of ${req.body.medicine}`, 404)
    );
  }

  // Set manufacturer from medicine
  req.body.manufacturer = medicine.manufacturer;

  // Create medicine request
  const medicineRequest = await MedicineRequest.create(req.body);

  res.status(201).json({
    success: true,
    data: medicineRequest
  });
});

// @desc    Update medicine request status
// @route   PUT /api/inventory/medicine-requests/:id
// @access  Private (Manufacturer, Retailer)
exports.updateMedicineRequestStatus = asyncHandler(async (req, res, next) => {
  let medicineRequest = await MedicineRequest.findById(req.params.id);

  if (!medicineRequest) {
    return next(
      new ErrorResponse(`Medicine request not found with id of ${req.params.id}`, 404)
    );
  }

  // Make sure user is the manufacturer or retailer related to this request
  if (
    medicineRequest.manufacturer.toString() !== req.user.id &&
    medicineRequest.retailer.toString() !== req.user.id &&
    req.user.role !== 'admin'
  ) {
    return next(
      new ErrorResponse(
        `User ${req.user.id} is not authorized to update this medicine request`,
        401
      )
    );
  }

  // Different actions based on role and status change
  const newStatus = req.body.status;
  const oldStatus = medicineRequest.status;
  
  // Make sure manufacturers can only approve/reject/ship
  if (req.user.role === 'manufacturer') {
    if (
      !['approved', 'rejected', 'shipped'].includes(newStatus) ||
      (oldStatus !== 'pending' && newStatus === 'approved') ||
      (oldStatus !== 'approved' && newStatus === 'shipped')
    ) {
      return next(
        new ErrorResponse(
          `Invalid status transition from ${oldStatus} to ${newStatus} for manufacturer`,
          400
        )
      );
    }
    
    // Handle inventory update when shipping
    if (newStatus === 'shipped') {
      const medicine = await Medicine.findById(medicineRequest.medicine);
      
      if (medicine.stockQuantity < medicineRequest.quantity) {
        return next(
          new ErrorResponse(
            `Not enough stock available. Current stock: ${medicine.stockQuantity}, Requested: ${medicineRequest.quantity}`,
            400
          )
        );
      }
      
      // Update stock
      await Medicine.findByIdAndUpdate(medicineRequest.medicine, {
        $inc: { stockQuantity: -medicineRequest.quantity }
      });
      
      // Add shipped date
      req.body.shippedAt = Date.now();
    }
    
    // Add approved date
    if (newStatus === 'approved') {
      req.body.approvedAt = Date.now();
    }
  }
  
  // Retailers can only cancel pending requests or confirm delivery
  if (req.user.role === 'retailer') {
    if (
      !['cancelled', 'delivered'].includes(newStatus) ||
      (oldStatus !== 'pending' && newStatus === 'cancelled') ||
      (oldStatus !== 'shipped' && newStatus === 'delivered')
    ) {
      return next(
        new ErrorResponse(
          `Invalid status transition from ${oldStatus} to ${newStatus} for retailer`,
          400
        )
      );
    }
    
    // Add delivered date
    if (newStatus === 'delivered') {
      req.body.deliveredAt = Date.now();
      
      // Update retailer's inventory
      const medicine = await Medicine.findOne({
        manufacturer: medicineRequest.manufacturer,
        _id: medicineRequest.medicine,
        retailer: req.user.id
      });
      
      if (medicine) {
        await Medicine.findByIdAndUpdate(medicine._id, {
          $inc: { stockQuantity: medicineRequest.quantity }
        });
      } else {
        // Create new medicine entry for this retailer if it doesn't exist
        const originalMedicine = await Medicine.findById(medicineRequest.medicine);
        
        if (originalMedicine) {
          const newMedicine = {
            ...originalMedicine.toObject(),
            _id: undefined,
            retailer: req.user.id,
            stockQuantity: medicineRequest.quantity
          };
          
          await Medicine.create(newMedicine);
        }
      }
    }
  }

  medicineRequest = await MedicineRequest.findByIdAndUpdate(
    req.params.id,
    req.body,
    {
      new: true,
      runValidators: true
    }
  );

  res.status(200).json({
    success: true,
    data: medicineRequest
  });
});

// @desc    Delete medicine request
// @route   DELETE /api/inventory/medicine-requests/:id
// @access  Private (Retailer who created the request)
exports.deleteMedicineRequest = asyncHandler(async (req, res, next) => {
  const medicineRequest = await MedicineRequest.findById(req.params.id);

  if (!medicineRequest) {
    return next(
      new ErrorResponse(`Medicine request not found with id of ${req.params.id}`, 404)
    );
  }

  // Make sure user is the retailer who created the request
  if (
    medicineRequest.retailer.toString() !== req.user.id &&
    req.user.role !== 'admin'
  ) {
    return next(
      new ErrorResponse(
        `User ${req.user.id} is not authorized to delete this medicine request`,
        401
      )
    );
  }

  // Check if the request is in pending status
  if (medicineRequest.status !== 'pending') {
    return next(
      new ErrorResponse(
        `Cannot delete a medicine request that is not in pending status`,
        400
      )
    );
  }

  await medicineRequest.remove();

  res.status(200).json({
    success: true,
    data: {}
  });
}); 