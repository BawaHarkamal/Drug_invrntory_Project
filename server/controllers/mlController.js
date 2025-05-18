const ProphetModel = require('../ml/prophetModel');
const Drug = require('../models/Drug');

class MLController {
    constructor() {
        this.prophetModel = new ProphetModel();
    }

    async trainModel(req, res) {
        try {
            // Get historical drug data
            const drugs = await Drug.find({}, 'name quantity date');
            
            if (!drugs || drugs.length === 0) {
                return res.status(400).json({ 
                    success: false, 
                    message: 'No historical data available for training' 
                });
            }

            // Format data for training
            const trainingData = drugs.map(drug => ({
                date: drug.date,
                quantity: drug.quantity
            }));

            // Train the model
            const success = this.prophetModel.train(trainingData);
            
            if (!success) {
                return res.status(500).json({ 
                    success: false, 
                    message: 'Failed to train the model' 
                });
            }

            res.status(200).json({ 
                success: true, 
                message: 'Model trained successfully' 
            });
        } catch (error) {
            console.error('Error in trainModel:', error);
            res.status(500).json({ 
                success: false, 
                message: 'Error training model', 
                error: error.message 
            });
        }
    }

    async getPredictions(req, res) {
        try {
            const days = parseInt(req.query.days) || 7;
            
            const predictions = this.prophetModel.predict(days);
            
            res.status(200).json({ 
                success: true, 
                predictions 
            });
        } catch (error) {
            console.error('Error in getPredictions:', error);
            res.status(500).json({ 
                success: false, 
                message: 'Error getting predictions', 
                error: error.message 
            });
        }
    }

    async updateModel(req, res) {
        try {
            const { data } = req.body;
            
            if (!data || !Array.isArray(data)) {
                return res.status(400).json({ 
                    success: false, 
                    message: 'Invalid data format' 
                });
            }

            const success = this.prophetModel.update(data);
            
            if (!success) {
                return res.status(500).json({ 
                    success: false, 
                    message: 'Failed to update the model' 
                });
            }

            res.status(200).json({ 
                success: true, 
                message: 'Model updated successfully' 
            });
        } catch (error) {
            console.error('Error in updateModel:', error);
            res.status(500).json({ 
                success: false, 
                message: 'Error updating model', 
                error: error.message 
            });
        }
    }
}

module.exports = new MLController(); 