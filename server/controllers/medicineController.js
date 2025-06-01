const User = require('../models/User');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const { readMedicinesData, writeMedicinesData } = require('../utils/localStorageUtil');

// @desc    Get all medicines
// @route   GET /api/medicines
// @access  Public
exports.getMedicines = asyncHandler(async (req, res, next) => {
  const data = await readMedicinesData();
  res.status(200).json({
    success: true,
    count: data.medicines.length,
    data: data.medicines
  });
});

// @desc    Get single medicine
// @route   GET /api/medicines/:id
// @access  Public
exports.getMedicine = asyncHandler(async (req, res, next) => {
  const data = await readMedicinesData();
  const medicine = data.medicines.find(m => m.id === req.params.id);

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
  // Verify user exists in MongoDB
  const user = await User.findById(req.user.id);
  if (!user) {
    return next(new ErrorResponse('User not found', 404));
  }

  const data = await readMedicinesData();
  const newId = `MED-${Date.now()}`;
  
  const newMedicine = {
    id: newId,
    ...req.body,
    manufacturer: {
      id: user._id,
      name: user.name,
      email: user.email
    },
    batchNumber: req.body.batchNumber || newId,
    createdAt: new Date().toISOString()
  };

  data.medicines.push(newMedicine);
  await writeMedicinesData(data);

  res.status(201).json({
    success: true,
    data: newMedicine
  });
});

// @desc    Update medicine
// @route   PUT /api/medicines/:id
// @access  Private (Manufacturer, Retailer)
exports.updateMedicine = asyncHandler(async (req, res, next) => {
  // Verify user exists in MongoDB
  const user = await User.findById(req.user.id);
  if (!user) {
    return next(new ErrorResponse('User not found', 404));
  }

  const data = await readMedicinesData();
  const index = data.medicines.findIndex(m => m.id === req.params.id);

  if (index === -1) {
    return next(
      new ErrorResponse(`Medicine not found with id of ${req.params.id}`, 404)
    );
  }

  // Check authorization
  const medicine = data.medicines[index];
  if (
    medicine.manufacturer.id !== req.user.id &&
    req.user.role !== 'admin'
  ) {
    return next(
      new ErrorResponse('Not authorized to update this medicine', 401)
    );
  }

  data.medicines[index] = {
    ...medicine,
    ...req.body,
    updatedAt: new Date().toISOString()
  };

  await writeMedicinesData(data);

  res.status(200).json({
    success: true,
    data: data.medicines[index]
  });
});

// @desc    Delete medicine
// @route   DELETE /api/medicines/:id
// @access  Private (Manufacturer)
exports.deleteMedicine = asyncHandler(async (req, res, next) => {
  // Verify user exists in MongoDB
  const user = await User.findById(req.user.id);
  if (!user) {
    return next(new ErrorResponse('User not found', 404));
  }

  const data = await readMedicinesData();
  const index = data.medicines.findIndex(m => m.id === req.params.id);

  if (index === -1) {
    return next(
      new ErrorResponse(`Medicine not found with id of ${req.params.id}`, 404)
    );
  }

  // Check authorization
  const medicine = data.medicines[index];
  if (
    medicine.manufacturer.id !== req.user.id &&
    req.user.role !== 'admin'
  ) {
    return next(
      new ErrorResponse('Not authorized to delete this medicine', 401)
    );
  }

  data.medicines.splice(index, 1);
  await writeMedicinesData(data);

  res.status(200).json({
    success: true,
    data: {}
  });
});

// @desc    Search medicines
// @route   GET /api/medicines/search
// @access  Public
exports.searchMedicines = asyncHandler(async (req, res, next) => {
  const { query } = req.query;
  const data = await readMedicinesData();
  
  if (!query) {
    return res.status(200).json({
      success: true,
      count: data.medicines.length,
      data: data.medicines
    });
  }

  const searchResults = data.medicines.filter(medicine => 
    medicine.name.toLowerCase().includes(query.toLowerCase()) ||
    medicine.description.toLowerCase().includes(query.toLowerCase()) ||
    medicine.category.toLowerCase().includes(query.toLowerCase())
  );

  res.status(200).json({
    success: true,
    count: searchResults.length,
    data: searchResults
  });
}); 