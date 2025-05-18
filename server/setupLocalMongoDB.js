const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => {
    console.error('Could not connect to MongoDB', err);
    process.exit(1);
  });

// Import models
const User = require('./models/User');
const Medicine = require('./models/Medicine');

// Seed function
const seedDatabase = async () => {
  try {
    // Clear existing data
    console.log('Clearing existing data...');
    await Medicine.deleteMany({});
    console.log('Medicines collection cleared');

    // Create test users if they don't exist
    console.log('Checking for existing users...');
    let adminUser = await User.findOne({ email: 'admin@example.com' });
    let manufacturerUser = await User.findOne({ email: 'manufacturer@example.com' });
    let retailerUser = await User.findOne({ email: 'retailer@example.com' });

    if (!adminUser) {
      console.log('Creating admin user...');
      adminUser = await User.create({
        name: 'Admin User',
        email: 'admin@example.com',
        password: 'password123',
        role: 'admin',
        phone: '1234567890'
      });
    }

    if (!manufacturerUser) {
      console.log('Creating manufacturer user...');
      manufacturerUser = await User.create({
        name: 'Manufacturer User',
        email: 'manufacturer@example.com',
        password: 'password123',
        role: 'manufacturer',
        phone: '2345678901'
      });
    }

    if (!retailerUser) {
      console.log('Creating retailer user...');
      retailerUser = await User.create({
        name: 'Retailer User',
        email: 'retailer@example.com',
        password: 'password123',
        role: 'retailer',
        phone: '3456789012'
      });
    }

    // Create medicines
    console.log('Creating medicine test data...');
    const medicines = [
      {
        name: 'Paracetamol',
        description: 'Pain relief medication for headaches, muscle aches, and fever reduction. Commonly used for minor pain and discomfort.',
        category: 'Analgesics',
        price: 5.99,
        stockQuantity: 100,
        expiryDate: new Date('2024-12-31'),
        prescription: false,
        manufacturer: manufacturerUser._id,
        retailer: retailerUser._id,
        composition: [{ salt: 'Acetaminophen', quantity: '500mg' }],
        batchNumber: 'PCM-001'
      },
      {
        name: 'Amoxicillin',
        description: 'Broad-spectrum antibiotic used to treat bacterial infections. Effective against respiratory, urinary tract, and skin infections.',
        category: 'Antibiotics',
        price: 12.99,
        stockQuantity: 50,
        expiryDate: new Date('2024-10-15'),
        prescription: true,
        manufacturer: manufacturerUser._id,
        retailer: retailerUser._id,
        composition: [{ salt: 'Amoxicillin Trihydrate', quantity: '250mg' }],
        batchNumber: 'AMX-002'
      },
      {
        name: 'Metformin',
        description: 'Oral medication used to treat type 2 diabetes. Helps control blood sugar levels and improve insulin sensitivity.',
        category: 'Antidiabetic',
        price: 8.49,
        stockQuantity: 75,
        expiryDate: new Date('2025-03-20'),
        prescription: true,
        manufacturer: manufacturerUser._id,
        retailer: retailerUser._id,
        composition: [{ salt: 'Metformin Hydrochloride', quantity: '500mg' }],
        batchNumber: 'MET-003'
      },
      {
        name: 'Atorvastatin',
        description: 'Statin medication used to lower cholesterol and reduce the risk of heart disease. Works by blocking an enzyme needed to make cholesterol.',
        category: 'Cardiovascular',
        price: 15.99,
        stockQuantity: 60,
        expiryDate: new Date('2025-06-15'),
        prescription: true,
        manufacturer: manufacturerUser._id,
        retailer: retailerUser._id,
        composition: [{ salt: 'Atorvastatin Calcium', quantity: '10mg' }],
        batchNumber: 'ATV-004'
      }
    ];

    await Medicine.insertMany(medicines);
    console.log(`Added ${medicines.length} medicines successfully`);

    // Log created medicines
    const createdMedicines = await Medicine.find();
    console.log('Created medicines:');
    createdMedicines.forEach(med => {
      console.log(`- ${med.name} (${med.category}) - $${med.price}`);
    });

    console.log('Database seeded successfully!');
    console.log('You can now run the server with: npm run dev');

    // Close connection
    mongoose.connection.close();
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

// Run the seed function
seedDatabase(); 