const ProphetModel = require('../ml/prophetModel');
const Medicine = require('../models/Medicine');
const User = require('../models/User');

const prophetModel = new ProphetModel();

async function getAnalyticsReport(req, res) {
    try {
        const { startDate, endDate } = req.query;
        const userId = req.user.id;

        // Get user role
        const user = await User.findById(userId);
        if (!user || !['admin', 'manager'].includes(user.role)) {
            return res.status(403).json({
                success: false,
                message: 'Unauthorized access to analytics'
            });
        }

        // Get historical data
        const historicalData = await Medicine.find({
            date: {
                $gte: new Date(startDate),
                $lte: new Date(endDate)
            }
        }).sort({ date: 1 });

        // Train the model with historical data
        await prophetModel.train(historicalData);

        // Get predictions for next 30 days
        const predictions = await prophetModel.predict(30);

        // Calculate key metrics
        const totalDrugs = historicalData.length;
        const averageDemand = historicalData.reduce((acc, curr) => acc + curr.quantity, 0) / totalDrugs;
        const peakDemand = Math.max(...historicalData.map(d => d.quantity));
        const lowDemand = Math.min(...historicalData.map(d => d.quantity));

        // Generate report
        const report = {
            period: {
                start: startDate,
                end: endDate
            },
            summary: {
                totalDrugs,
                averageDemand,
                peakDemand,
                lowDemand
            },
            predictions: predictions,
            historicalData: historicalData
        };

        res.status(200).json({
            success: true,
            report
        });
    } catch (error) {
        console.error('Error generating analytics report:', error);
        res.status(500).json({
            success: false,
            message: 'Error generating analytics report',
            error: error.message
        });
    }
}

async function getDrugDemandTrends(req, res) {
    try {
        const { drugId } = req.params;
        const userId = req.user.id;

        // Get user role
        const user = await User.findById(userId);
        if (!user || !['admin', 'manager', 'pharmacist'].includes(user.role)) {
            return res.status(403).json({
                success: false,
                message: 'Unauthorized access to drug trends'
            });
        }

        // Get drug-specific historical data
        const historicalData = await Medicine.find({ drugId })
            .sort({ date: 1 })
            .limit(100); // Limit to last 100 records

        // Train the model with historical data
        await prophetModel.train(historicalData);

        // Get predictions for this specific drug
        const predictions = await prophetModel.predict(30);

        res.status(200).json({
            success: true,
            data: {
                historical: historicalData,
                predictions: predictions
            }
        });
    } catch (error) {
        console.error('Error getting drug demand trends:', error);
        res.status(500).json({
            success: false,
            message: 'Error getting drug demand trends',
            error: error.message
        });
    }
}

module.exports = {
    getAnalyticsReport,
    getDrugDemandTrends
}; 