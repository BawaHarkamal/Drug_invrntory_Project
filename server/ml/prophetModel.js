const math = require('mathjs');

class ProphetModel {
    constructor() {
        this.model = null;
        this.trained = false;
    }

    train(data) {
        try {
            // Simple moving average forecasting
            const dates = data.map(item => new Date(item.date).getTime());
            const values = data.map(item => item.quantity);
            
            this.model = {
                dates,
                values,
                mean: math.mean(values),
                std: math.std(values)
            };
            
            this.trained = true;
            return true;
        } catch (error) {
            console.error('Error training model:', error);
            return false;
        }
    }

    predict(days = 7) {
        if (!this.trained) {
            throw new Error('Model not trained');
        }

        try {
            const predictions = [];
            const lastDate = new Date(this.model.dates[this.model.dates.length - 1]);
            const lastValue = this.model.values[this.model.values.length - 1];
            
            // Simple forecasting using moving average
            for (let i = 1; i <= days; i++) {
                const nextDate = new Date(lastDate);
                nextDate.setDate(lastDate.getDate() + i);
                
                // Add some random variation based on historical standard deviation
                const variation = math.random(-this.model.std, this.model.std);
                const predictedValue = lastValue + variation;
                
                predictions.push({
                    date: nextDate.toISOString(),
                    predictedQuantity: Math.max(0, predictedValue) // Ensure non-negative predictions
                });
            }
            
            return predictions;
        } catch (error) {
            console.error('Error making predictions:', error);
            throw error;
        }
    }

    update(newData) {
        try {
            if (!this.trained) {
                return this.train(newData);
            }

            // Update model with new data
            const newDates = newData.map(item => new Date(item.date).getTime());
            const newValues = newData.map(item => item.quantity);
            
            this.model.dates = [...this.model.dates, ...newDates];
            this.model.values = [...this.model.values, ...newValues];
            this.model.mean = math.mean(this.model.values);
            this.model.std = math.std(this.model.values);
            
            return true;
        } catch (error) {
            console.error('Error updating model:', error);
            return false;
        }
    }
}

module.exports = ProphetModel; 