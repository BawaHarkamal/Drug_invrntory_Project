const Analytics = require('../models/Analytics');
const Medicine = require('../models/Medicine');
const Order = require('../models/Order');
const User = require('../models/User');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const mongoose = require('mongoose');

// @desc    Generate annual analysis report
// @route   POST /api/ml/analyze/:year
// @access  Private (Admin, Retailer, Manufacturer, Supplier)
exports.generateAnnualReport = asyncHandler(async (req, res, next) => {
  const year = parseInt(req.params.year);
  
  if (!year || isNaN(year)) {
    return next(new ErrorResponse('Please provide a valid year', 400));
  }

  // Get medicines data
  const medicines = await Medicine.find();
  
  // Get orders data for the year
  const startDate = new Date(`${year}-01-01T00:00:00.000Z`);
  const endDate = new Date(`${year+1}-01-01T00:00:00.000Z`);
  
  const orders = await Order.find({
    orderDate: {
      $gte: startDate,
      $lt: endDate
    }
  }).populate('items.medicine consumer retailer');

  // Extract data for analysis
  const ordersByMonth = Array(12).fill(0);
  const salesByMonth = Array(12).fill(0);
  const medicinesSold = {};
  const customersByRegion = {};
  const lowStockMedicines = [];

  // Process orders
  orders.forEach(order => {
    const month = new Date(order.orderDate).getMonth();
    
    // Count orders by month
    ordersByMonth[month]++;
    
    // Sum sales by month
    salesByMonth[month] += order.totalAmount;
    
    // Count medicines sold
    order.items.forEach(item => {
      if (item.medicine) {
        const medicineId = item.medicine._id.toString();
        medicinesSold[medicineId] = (medicinesSold[medicineId] || 0) + item.quantity;
      }
    });
    
    // Group customers by region
    if (order.consumer && order.consumer.address) {
      const region = order.consumer.address.state || 'Unknown';
      customersByRegion[region] = (customersByRegion[region] || 0) + 1;
    }
  });

  // Check for low stock medicines
  medicines.forEach(medicine => {
    if (medicine.stockQuantity <= medicine.lowStockThreshold) {
      lowStockMedicines.push({
        id: medicine._id,
        name: medicine.name,
        currentStock: medicine.stockQuantity,
        threshold: medicine.lowStockThreshold
      });
    }
  });

  // Generate top selling medicines
  const topSellingMedicines = Object.entries(medicinesSold)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(async ([medicineId, quantity]) => {
      const medicine = await Medicine.findById(medicineId);
      return {
        id: medicineId,
        name: medicine ? medicine.name : 'Unknown',
        quantity,
        revenue: medicine ? medicine.price * quantity : 0
      };
    });

  // Resolve the promises
  const resolvedTopSelling = await Promise.all(topSellingMedicines);

  // Simulate ML predictions
  const seasonalTrends = [
    { season: 'Winter', topCategories: ['Respiratory', 'Antibiotics'] },
    { season: 'Spring', topCategories: ['Respiratory', 'Analgesics'] },
    { season: 'Summer', topCategories: ['Gastrointestinal', 'Analgesics'] },
    { season: 'Fall', topCategories: ['Respiratory', 'Antibiotics'] }
  ];

  const nextYearSalesPrediction = salesByMonth.map(
    amount => amount * (1 + (Math.random() * 0.3 + 0.05))
  );

  const averageMonthlySales = salesByMonth.reduce((sum, val) => sum + val, 0) / 12;

  // Create analytics report
  const analyticsData = {
    year,
    reportType: 'sales',
    data: {
      totalOrders: orders.length,
      totalSales: salesByMonth.reduce((sum, val) => sum + val, 0),
      averageMonthlySales,
      ordersByMonth,
      salesByMonth,
      topSellingMedicines: resolvedTopSelling,
      customersByRegion,
      lowStockMedicines
    },
    predictions: {
      nextYearSalesPrediction,
      seasonalTrends,
      growthRate: ((nextYearSalesPrediction.reduce((sum, val) => sum + val, 0) / 
                   salesByMonth.reduce((sum, val) => sum + val, 1)) - 1) * 100
    },
    recommendations: [
      {
        title: 'Inventory Optimization',
        description: `Restock ${lowStockMedicines.length} medicines that are below threshold levels.`,
        priority: lowStockMedicines.length > 5 ? 'high' : 'medium'
      },
      {
        title: 'Seasonal Preparation',
        description: 'Increase inventory for Respiratory medicines before Winter season.',
        priority: 'medium'
      }
    ],
    relatedEntities: {
      medicines: medicines.map(m => m._id),
      retailers: [...new Set(orders.map(o => o.retailer._id))]
    },
    modelVersion: '1.0',
    lastUpdated: Date.now()
  };

  // Create or update analytics
  const analytics = await Analytics.findOneAndUpdate(
    { year, reportType: 'sales' },
    analyticsData,
    {
      new: true,
      upsert: true,
      runValidators: true
    }
  );

  res.status(200).json({
    success: true,
    data: analytics
  });
});

// @desc    Get analytics reports
// @route   GET /api/ml/reports
// @access  Private (Admin, Retailer, Manufacturer, Supplier)
exports.getReports = asyncHandler(async (req, res, next) => {
  const { year, type } = req.query;
  let query = {};
  
  if (year) {
    query.year = parseInt(year);
  }
  
  if (type) {
    query.reportType = type;
  }
  
  // Handle user role-based access
  if (req.user.role === 'retailer') {
    const retailerId = req.user.id;
    query['relatedEntities.retailers'] = mongoose.Types.ObjectId(retailerId);
  } else if (req.user.role === 'manufacturer') {
    const manufacturerId = req.user.id;
    query['relatedEntities.manufacturers'] = mongoose.Types.ObjectId(manufacturerId);
  } else if (req.user.role === 'supplier') {
    const supplierId = req.user.id;
    query['relatedEntities.suppliers'] = mongoose.Types.ObjectId(supplierId);
  }
  
  const reports = await Analytics.find(query).sort('-year');
  
  res.status(200).json({
    success: true,
    count: reports.length,
    data: reports
  });
});

// @desc    Get a single report
// @route   GET /api/ml/reports/:id
// @access  Private (Admin, Retailer, Manufacturer, Supplier)
exports.getReport = asyncHandler(async (req, res, next) => {
  const report = await Analytics.findById(req.params.id);
  
  if (!report) {
    return next(
      new ErrorResponse(`Report not found with id of ${req.params.id}`, 404)
    );
  }
  
  // Check if user has access to this report
  if (req.user.role !== 'admin') {
    let hasAccess = false;
    
    if (req.user.role === 'retailer' && report.relatedEntities.retailers) {
      hasAccess = report.relatedEntities.retailers.some(
        id => id.toString() === req.user.id
      );
    } else if (req.user.role === 'manufacturer' && report.relatedEntities.manufacturers) {
      hasAccess = report.relatedEntities.manufacturers.some(
        id => id.toString() === req.user.id
      );
    } else if (req.user.role === 'supplier' && report.relatedEntities.suppliers) {
      hasAccess = report.relatedEntities.suppliers.some(
        id => id.toString() === req.user.id
      );
    }
    
    if (!hasAccess) {
      return next(
        new ErrorResponse(
          `User ${req.user.id} is not authorized to access this report`,
          401
        )
      );
    }
  }
  
  res.status(200).json({
    success: true,
    data: report
  });
}); 