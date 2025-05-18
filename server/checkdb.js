const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Test MongoDB connection
async function checkConnection() {
  try {
    console.log('Attempting to connect to MongoDB...');
    console.log('MongoDB URI:', process.env.MONGO_URI);
    
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/drug_inventory');
    console.log('✅ MongoDB connected successfully');
    
    // Check for medicines collection
    const Medicine = require('./models/Medicine');
    const medicineCount = await Medicine.countDocuments();
    console.log(`Found ${medicineCount} medicines in database`);
    
    if (medicineCount > 0) {
      const medicines = await Medicine.find().limit(3);
      console.log('Sample medicines:', medicines.map(m => ({ 
        id: m._id, 
        name: m.name,
        category: m.category
      })));
    }
    
    mongoose.connection.close();
    console.log('MongoDB connection closed');
  } catch (err) {
    console.error('❌ MongoDB connection error:', err);
  }
}

checkConnection(); 