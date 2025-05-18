const mongoose = require('mongoose');

const MedicineRequestSchema = new mongoose.Schema({
  retailer: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  manufacturer: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  medicine: {
    type: mongoose.Schema.ObjectId,
    ref: 'Medicine',
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    min: 1
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected', 'shipped', 'delivered', 'cancelled'],
    default: 'pending'
  },
  urgency: {
    type: String,
    enum: ['low', 'medium', 'high', 'critical'],
    default: 'medium'
  },
  remarks: {
    type: String
  },
  requiredBy: {
    type: Date
  },
  approvedAt: {
    type: Date
  },
  shippedAt: {
    type: Date
  },
  deliveredAt: {
    type: Date
  },
  trackingDetails: {
    trackingId: String,
    currentLocation: {
      latitude: Number,
      longitude: Number,
      updatedAt: Date
    },
    estimatedDeliveryDate: Date
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('MedicineRequest', MedicineRequestSchema); 