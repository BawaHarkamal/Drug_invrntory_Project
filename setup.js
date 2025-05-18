const { spawn } = require('child_process');
const { MongoMemoryServer } = require('mongodb-memory-server');
const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');

// Check if running on Windows
const isWindows = process.platform === 'win32';

async function startMongoDB() {
  try {
    console.log('\x1b[36m%s\x1b[0m', '🚀 Starting MongoDB Memory Server...');
    
    // Create an in-memory MongoDB instance
    const mongod = await MongoMemoryServer.create();
    const uri = mongod.getUri();
    
    console.log('\x1b[32m%s\x1b[0m', `✅ MongoDB Memory Server running at: ${uri}`);
    
    // Update .env file with the new URI
    const envPath = path.join(__dirname, 'server', '.env');
    
    let envContent;
    try {
      envContent = fs.readFileSync(envPath, 'utf8');
    } catch (error) {
      console.log('\x1b[33m%s\x1b[0m', 'Creating new .env file in server directory');
      envContent = 'PORT=5001\nJWT_SECRET=your_jwt_secret_key_here\nJWT_EXPIRE=30d\nFILE_UPLOAD_PATH=./uploads\nMAX_FILE_UPLOAD=1000000\nNODE_ENV=development';
    }
    
    envContent = envContent.replace(/MONGO_URI=.*/g, `MONGO_URI=${uri}`);
    fs.writeFileSync(envPath, envContent);
    
    console.log('\x1b[32m%s\x1b[0m', '✅ Updated .env file with new MongoDB URI');
    
    return uri;
  } catch (error) {
    console.error('\x1b[31m%s\x1b[0m', '❌ Error setting up MongoDB Memory Server:', error);
    process.exit(1);
  }
}

async function seedDatabase(uri) {
  try {
    console.log('\x1b[36m%s\x1b[0m', '🌱 Seeding database with test data...');
    
    // Connect to MongoDB
    await mongoose.connect(uri);
    console.log('\x1b[32m%s\x1b[0m', '✅ Connected to MongoDB Memory Server');
    
    // Import models
    const User = require('./server/models/User');
    const Medicine = require('./server/models/Medicine');
    
    // Clear existing data
    await Medicine.deleteMany({});
    console.log('\x1b[32m%s\x1b[0m', '✅ Medicines collection cleared');
    
    // Create test users if they don't exist
    console.log('\x1b[36m%s\x1b[0m', '👤 Creating test users...');
    
    let adminUser = await User.findOne({ email: 'admin@example.com' });
    let manufacturerUser = await User.findOne({ email: 'manufacturer@example.com' });
    let retailerUser = await User.findOne({ email: 'retailer@example.com' });
    
    if (!adminUser) {
      adminUser = await User.create({
        name: 'Admin User',
        email: 'admin@example.com',
        password: 'password123',
        role: 'admin',
        phone: '1234567890'
      });
    }
    
    if (!manufacturerUser) {
      manufacturerUser = await User.create({
        name: 'Manufacturer User',
        email: 'manufacturer@example.com',
        password: 'password123',
        role: 'manufacturer',
        phone: '2345678901'
      });
    }
    
    if (!retailerUser) {
      retailerUser = await User.create({
        name: 'Retailer User',
        email: 'retailer@example.com',
        password: 'password123',
        role: 'retailer', 
        phone: '3456789012'
      });
    }
    
    // Create medicines
    console.log('\x1b[36m%s\x1b[0m', '💊 Creating test medicines...');
    
    const medicines = [
      {
        name: 'Paracetamol',
        description: 'Pain relief medication for headaches, muscle aches, and fever reduction.',
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
        description: 'Antibiotic used to treat bacterial infections.',
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
        description: 'Oral medication used to treat type 2 diabetes.',
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
        description: 'Cholesterol-lowering medication.',
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
    console.log('\x1b[32m%s\x1b[0m', `✅ Added ${medicines.length} medicines successfully`);
    
    await mongoose.connection.close();
    console.log('\x1b[32m%s\x1b[0m', '✅ Database connection closed');
    
    return true;
  } catch (error) {
    console.error('\x1b[31m%s\x1b[0m', '❌ Error seeding database:', error);
    process.exit(1);
  }
}

async function startServer() {
  console.log('\x1b[36m%s\x1b[0m', '🚀 Starting server...');
  
  // Use different spawn commands based on platform
  const command = isWindows ? 'node.exe' : 'node';
  const args = ['server/server.js'];
  
  const server = spawn(command, args, { 
    stdio: 'inherit',
    shell: isWindows, // Use shell on Windows
    detached: !isWindows // Detached on non-Windows
  });
  
  server.on('error', (error) => {
    console.error('\x1b[31m%s\x1b[0m', '❌ Failed to start server:', error);
    process.exit(1);
  });
  
  console.log('\x1b[32m%s\x1b[0m', '✅ Server started on port 5001');
  
  return server;
}

async function startClient() {
  console.log('\x1b[36m%s\x1b[0m', '🚀 Starting client...');
  
  // Start the client in a platform-appropriate way
  let client;
  
  if (isWindows) {
    // On Windows, we need to use shell: true and cmd commands
    client = spawn('cd client && npm start', [], { 
      stdio: 'inherit',
      shell: true
    });
  } else {
    // On Unix systems, we can use the original approach
    client = spawn('npm', ['start', '--prefix', 'client'], { 
      stdio: 'inherit',
      detached: true
    });
  }
  
  client.on('error', (error) => {
    console.error('\x1b[31m%s\x1b[0m', '❌ Failed to start client:', error);
    process.exit(1);
  });
  
  console.log('\x1b[32m%s\x1b[0m', '✅ Client starting on port 3001');
  
  return client;
}

async function main() {
  console.log('\x1b[36m%s\x1b[0m', '🚀 Starting the application...');
  
  try {
    // Start MongoDB
    const uri = await startMongoDB();
    
    // Seed the database with test data
    await seedDatabase(uri);
    
    // Start the server
    const server = await startServer();
    
    // Delay to allow server to start
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Start the client
    const client = await startClient();
    
    console.log('\n\x1b[32m%s\x1b[0m', '✅ Application is now running');
    console.log('\x1b[36m%s\x1b[0m', '📊 Server: http://localhost:5001');
    console.log('\x1b[36m%s\x1b[0m', '🌐 Client: http://localhost:3001');
    console.log('\x1b[33m%s\x1b[0m', '⚠️ Press Ctrl+C to stop all processes');
    
    // Keep the script running
    process.stdin.resume();
    
    // Handle exit
    const cleanup = () => {
      console.log('\n\x1b[36m%s\x1b[0m', '🛑 Shutting down...');
      
      if (server) {
        if (isWindows) {
          try {
            // On Windows, taskkill is more reliable for killing processes
            spawn('taskkill', ['/pid', server.pid, '/f', '/t'], {
              shell: true,
              stdio: 'ignore'
            });
          } catch (err) {
            console.error('Failed to kill server:', err);
          }
        } else {
          process.kill(-server.pid);
        }
      }
      
      if (client) {
        if (isWindows) {
          try {
            // Kill Node.js processes on Windows
            spawn('taskkill', ['/f', '/im', 'node.exe'], {
              shell: true,
              stdio: 'ignore'
            });
          } catch (err) {
            console.error('Failed to kill client:', err);
          }
        } else {
          process.kill(-client.pid);
        }
      }
      
      process.exit(0);
    };
    
    process.on('SIGINT', cleanup);
    process.on('SIGTERM', cleanup);
    
  } catch (error) {
    console.error('\x1b[31m%s\x1b[0m', '❌ Failed to start application:', error);
    process.exit(1);
  }
}

main(); 