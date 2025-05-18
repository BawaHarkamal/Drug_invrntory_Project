const { MongoMemoryServer } = require('mongodb-memory-server');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');

// Load environment variables
dotenv.config();

async function startMongoDB() {
  try {
    console.log('Starting MongoDB Memory Server...');
    
    // Create an in-memory MongoDB instance
    const mongod = await MongoMemoryServer.create();
    const uri = mongod.getUri();
    
    console.log(`MongoDB Memory Server running at: ${uri}`);
    
    // Update .env file with the new URI
    const envPath = path.join(__dirname, '.env');
    let envContent = fs.readFileSync(envPath, 'utf8');
    envContent = envContent.replace(/MONGO_URI=.*/g, `MONGO_URI=${uri}`);
    fs.writeFileSync(envPath, envContent);
    
    console.log('Updated .env file with new MongoDB URI');
    
    // Connect to MongoDB
    await mongoose.connect(uri);
    console.log('✅ Connected to MongoDB Memory Server');
    
    // Seed with sample data
    const Medicine = require('./models/Medicine');
    const User = require('./models/User');
    
    // Create sample user
    const adminUser = await User.create({
      name: 'Admin User',
      email: 'admin@example.com',
      password: 'password123',
      role: 'admin'
    });
    
    const manufacturerUser = await User.create({
      name: 'Manufacturer User',
      email: 'manufacturer@example.com',
      password: 'password123',
      role: 'manufacturer'
    });
    
    const retailerUser = await User.create({
      name: 'Retailer User',
      email: 'retailer@example.com',
      password: 'password123',
      role: 'retailer'
    });
    
    console.log('Created sample users');
    
    // Create sample medicines
    const medicines = [
      {
        name: 'Paracetamol',
        description: 'Pain relief medication',
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
        description: 'Antibiotic medication',
        category: 'Antibiotics',
        price: 12.99,
        stockQuantity: 50,
        expiryDate: new Date('2024-10-15'),
        prescription: true,
        manufacturer: manufacturerUser._id,
        retailer: retailerUser._id,
        composition: [{ salt: 'Amoxicillin Trihydrate', quantity: '250mg' }],
        batchNumber: 'AMX-002'
      }
    ];
    
    await Medicine.insertMany(medicines);
    console.log(`Added ${medicines.length} sample medicines`);
    
    // Print medicine collection
    const allMedicines = await Medicine.find();
    console.log('Medicines in database:', allMedicines.map(m => ({
      id: m._id,
      name: m.name,
      manufacturer: m.manufacturer,
      retailer: m.retailer
    })));
    
    console.log('\nMongoDB Memory Server is ready for use');
    console.log('You can now start your application server with: npm run dev');
    
    // Keep the connection open
    console.log('\nPress Ctrl+C to stop the MongoDB Memory Server');
  } catch (err) {
    console.error('Error setting up MongoDB Memory Server:', err);
  }
}

startMongoDB(); 