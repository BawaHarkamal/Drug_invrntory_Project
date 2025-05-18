const path = require('path');
const Medicine = require('../models/Medicine');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');

// @desc    Get all medicines
// @route   GET /api/medicines
// @access  Public
exports.getMedicines = asyncHandler(async (req, res, next) => {
  const medicines = await Medicine.find()
    .populate('manufacturer', 'name email')
    .populate('retailer', 'name email');
    
  res.status(200).json({
    success: true,
    count: medicines.length,
    data: medicines
  });
});

// @desc    Get single medicine
// @route   GET /api/medicines/:id
// @access  Public
exports.getMedicine = asyncHandler(async (req, res, next) => {
  const medicine = await Medicine.findById(req.params.id)
    .populate('manufacturer', 'name email')
    .populate('retailer', 'name email');

  if (!medicine) {
    return next(
      new ErrorResponse(`Medicine not found with id of ${req.params.id}`, 404)
    );
  }

  res.status(200).json({
    success: true,
    data: medicine
  });
});

// @desc    Create new medicine
// @route   POST /api/medicines
// @access  Private (Manufacturer)
exports.createMedicine = asyncHandler(async (req, res, next) => {
  // Add manufacturer from JWT
  req.body.manufacturer = req.user.id;
  
  // Create medicine
  const medicine = await Medicine.create(req.body);

  res.status(201).json({
    success: true,
    data: medicine
  });
});

// @desc    Update medicine
// @route   PUT /api/medicines/:id
// @access  Private (Manufacturer, Retailer)
exports.updateMedicine = asyncHandler(async (req, res, next) => {
  let medicine = await Medicine.findById(req.params.id);

  if (!medicine) {
    return next(
      new ErrorResponse(`Medicine not found with id of ${req.params.id}`, 404)
    );
  }

  // Make sure user is medicine manufacturer or retailer
  if (
    medicine.manufacturer.toString() !== req.user.id && 
    medicine.retailer.toString() !== req.user.id &&
    req.user.role !== 'admin'
  ) {
    return next(
      new ErrorResponse(
        `User ${req.user.id} is not authorized to update this medicine`,
        401
      )
    );
  }

  medicine = await Medicine.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  res.status(200).json({
    success: true,
    data: medicine
  });
});

// @desc    Delete medicine
// @route   DELETE /api/medicines/:id
// @access  Private (Manufacturer)
exports.deleteMedicine = asyncHandler(async (req, res, next) => {
  const medicine = await Medicine.findById(req.params.id);

  if (!medicine) {
    return next(
      new ErrorResponse(`Medicine not found with id of ${req.params.id}`, 404)
    );
  }

  // Make sure user is medicine manufacturer
  if (
    medicine.manufacturer.toString() !== req.user.id && 
    req.user.role !== 'admin'
  ) {
    return next(
      new ErrorResponse(
        `User ${req.user.id} is not authorized to delete this medicine`,
        401
      )
    );
  }

  await medicine.remove();

  res.status(200).json({
    success: true,
    data: {}
  });
});

// @desc    Upload medicine image
// @route   PUT /api/medicines/:id/photo
// @access  Private (Manufacturer, Retailer)
exports.medicinePhotoUpload = asyncHandler(async (req, res, next) => {
  const medicine = await Medicine.findById(req.params.id);

  if (!medicine) {
    return next(
      new ErrorResponse(`Medicine not found with id of ${req.params.id}`, 404)
    );
  }

  // Make sure user is medicine manufacturer or retailer
  if (
    medicine.manufacturer.toString() !== req.user.id && 
    medicine.retailer.toString() !== req.user.id &&
    req.user.role !== 'admin'
  ) {
    return next(
      new ErrorResponse(
        `User ${req.user.id} is not authorized to update this medicine`,
        401
      )
    );
  }

  if (!req.files) {
    return next(new ErrorResponse(`Please upload a file`, 400));
  }

  const file = req.files.file;

  // Make sure the image is a photo
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
  file.name = `medicine_${medicine._id}${path.parse(file.name).ext}`;

  file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`, async err => {
    if (err) {
      console.error(err);
      return next(new ErrorResponse(`Problem with file upload`, 500));
    }

    await Medicine.findByIdAndUpdate(req.params.id, { image: file.name });

    res.status(200).json({
      success: true,
      data: file.name
    });
  });
});

// @desc    Search medicines
// @route   GET /api/medicines/search
// @access  Public
exports.searchMedicines = asyncHandler(async (req, res, next) => {
  const { query } = req.query;
  
  if (!query) {
    return next(new ErrorResponse('Please provide a search query', 400));
  }

  const medicines = await Medicine.find(
    { $text: { $search: query } },
    { score: { $meta: "textScore" } }
  )
    .sort({ score: { $meta: "textScore" } })
    .populate('manufacturer', 'name email')
    .populate('retailer', 'name email');

  res.status(200).json({
    success: true,
    count: medicines.length,
    data: medicines
  });
}); 