const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
dotenv.config({ path: path.join(__dirname, 'server', '.env') });

async function checkDatabase() {
  try {
    console.log('Connecting to MongoDB...');
    const uri = process.env.MONGO_URI;
    if (!uri) {
      throw new Error('MONGO_URI not found in environment variables');
    }
    console.log('Using connection string:', uri);
    
    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('Connected to MongoDB successfully');
    
    // Get database name
    const dbName = mongoose.connection.db.databaseName;
    console.log('Connected to database:', dbName);
    
    // Get the users collection
    const users = mongoose.connection.collection('users');
    
    // Count documents
    const count = await users.countDocuments();
    console.log(`\nTotal users in database: ${count}`);
    
    // Find all users
    const allUsers = await users.find({}).toArray();
    console.log('\nAll users in database:');
    allUsers.forEach(user => {
      console.log('\nUser Details:');
      console.log('ID:', user._id.toString());
      console.log('Name:', user.name);
      console.log('Email:', user.email);
      console.log('Role:', user.role);
      console.log('Created:', user.createdAt);
      console.log('------------------------');
    });
    
    // List all collections
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log('\nAvailable collections:', collections.map(c => c.name));
    
    await mongoose.connection.close();
    console.log('\nDatabase connection closed');
  } catch (error) {
    console.error('\nError occurred:');
    console.error('Name:', error.name);
    console.error('Message:', error.message);
    console.error('Stack:', error.stack);
    
    if (mongoose.connection) {
      await mongoose.connection.close();
    }
    process.exit(1);
  }
}

checkDatabase(); 