const mongoose = require('mongoose');

const MedicineSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add medicine name'],
    trim: true,
    unique: true
  },
  description: {
    type: String,
    required: [true, 'Please add a description']
  },
  category: {
    type: String,
    required: [true, 'Please specify category'],
    enum: ['Antibiotics', 'Analgesics', 'Antidiabetic', 'Cardiovascular', 'Respiratory', 'Gastrointestinal', 'Other']
  },
  price: {
    type: Number,
    required: [true, 'Please add price']
  },
  stockQuantity: {
    type: Number,
    required: [true, 'Please add stock quantity'],
    default: 0
  },
  expiryDate: {
    type: Date,
    required: [true, 'Please add expiry date']
  },
  image: {
    type: String,
    default: 'no-image.jpg'
  },
  prescription: {
    type: Boolean,
    default: false
  },
  manufacturer: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  retailer: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  composition: [{
    salt: {
      type: String,
      required: true
    },
    quantity: {
      type: String,
      required: true
    }
  }],
  lowStockThreshold: {
    type: Number,
    default: 10
  },
  batchNumber: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Create index for faster search
MedicineSchema.index({ name: 'text', category: 'text', description: 'text' });

module.exports = mongoose.model('Medicine', MedicineSchema); 