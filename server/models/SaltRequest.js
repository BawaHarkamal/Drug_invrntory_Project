const mongoose = require('mongoose');

const SaltRequestSchema = new mongoose.Schema({
  manufacturer: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  supplier: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  salt: {
    name: {
      type: String,
      required: true
    },
    description: {
      type: String
    },
    quantity: {
      type: Number,
      required: true
    },
    unit: {
      type: String,
      required: true,
      enum: ['mg', 'g', 'kg', 'ml', 'l']
    }
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected', 'delivered', 'cancelled'],
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
  deliveredAt: {
    type: Date
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('SaltRequest', SaltRequestSchema); 