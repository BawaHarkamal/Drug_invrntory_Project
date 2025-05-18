const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Medicine = require('../models/Medicine');
const User = require('../models/User');
const medicines = require('../data/medicines');

// Load env vars
dotenv.config();

// Connect to DB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log('MongoDB Connected for seeding...'))
  .catch(err => console.error('Error connecting to MongoDB:', err));

// Function to seed medicines
const seedMedicines = async () => {
  try {
    // First, clear existing medicines
    await Medicine.deleteMany();
    console.log('Existing medicines cleared');

    // Find a manufacturer and retailer
    const manufacturer = await User.findOne({ role: 'manufacturer' });
    const retailer = await User.findOne({ role: 'retailer' });

    if (!manufacturer || !retailer) {
      console.error('Cannot seed medicines: No manufacturer or retailer found in the database');
      process.exit(1);
    }

    // Prepare seed data with real user IDs
    const preparedMedicines = medicines.map(medicine => ({
      ...medicine,
      manufacturer: manufacturer._id,
      retailer: retailer._id,
      expiryDate: new Date(medicine.expiryDate)
    }));

    // Insert the medicines
    await Medicine.insertMany(preparedMedicines);
    
    console.log(`${preparedMedicines.length} medicines added to the database!`);
    process.exit(0);
  } catch (error) {
    console.error('Error seeding medicines:', error);
    process.exit(1);
  }
};

// Run the seeding function
seedMedicines(); 