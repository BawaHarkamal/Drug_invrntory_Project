const mongoose = require('mongoose');

const AnalyticsSchema = new mongoose.Schema({
  year: {
    type: Number,
    required: true
  },
  month: {
    type: Number,
    min: 1,
    max: 12
  },
  reportType: {
    type: String,
    enum: ['sales', 'inventory', 'demand', 'supply_chain', 'trend'],
    required: true
  },
  data: {
    type: mongoose.Schema.Types.Mixed,
    required: true
  },
  predictions: {
    type: mongoose.Schema.Types.Mixed
  },
  recommendations: [{
    title: String,
    description: String,
    priority: {
      type: String,
      enum: ['low', 'medium', 'high'],
      default: 'medium'
    }
  }],
  relatedEntities: {
    medicines: [{
      type: mongoose.Schema.ObjectId,
      ref: 'Medicine'
    }],
    retailers: [{
      type: mongoose.Schema.ObjectId,
      ref: 'User'
    }],
    manufacturers: [{
      type: mongoose.Schema.ObjectId,
      ref: 'User'
    }],
    suppliers: [{
      type: mongoose.Schema.ObjectId,
      ref: 'User'
    }]
  },
  modelVersion: {
    type: String
  },
  lastUpdated: {
    type: Date,
    default: Date.now
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Create compound index for unique reports by year, month and type
AnalyticsSchema.index({ year: 1, month: 1, reportType: 1 }, { unique: true });

module.exports = mongoose.model('Analytics', AnalyticsSchema); 