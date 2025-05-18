const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
  consumer: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  retailer: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  items: [
    {
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
      price: {
        type: Number,
        required: true
      }
    }
  ],
  totalAmount: {
    type: Number,
    required: true
  },
  shippingAddress: {
    street: {
      type: String,
      required: true
    },
    city: {
      type: String,
      required: true
    },
    state: {
      type: String,
      required: true
    },
    zipCode: {
      type: String,
      required: true
    },
    country: {
      type: String,
      required: true
    }
  },
  status: {
    type: String,
    enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'],
    default: 'pending'
  },
  paymentMethod: {
    type: String,
    enum: ['credit_card', 'debit_card', 'paypal', 'cash_on_delivery'],
    default: 'cash_on_delivery'
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'completed', 'failed', 'refunded'],
    default: 'pending'
  },
  prescriptionImage: {
    type: String
  },
  prescriptionVerified: {
    type: Boolean,
    default: false
  },
  currentLocation: {
    latitude: {
      type: Number
    },
    longitude: {
      type: Number
    },
    updatedAt: {
      type: Date,
      default: Date.now
    }
  },
  estimatedDeliveryDate: {
    type: Date
  },
  trackingId: {
    type: String
  },
  orderDate: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Order', OrderSchema); 