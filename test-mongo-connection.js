const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config({ path: './server/.env' });

console.log('Attempting to connect to MongoDB...');
console.log('Connection string:', process.env.MONGO_URI);

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => {
  console.log('Successfully connected to MongoDB!');
  process.exit(0);
})
.catch(err => {
  console.error('MongoDB connection error details:');
  console.error('Error name:', err.name);
  console.error('Error message:', err.message);
  console.error('Error code:', err.code);
  if (err.codeName) console.error('Error codeName:', err.codeName);
  process.exit(1);
}); 