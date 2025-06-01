const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const fileupload = require('express-fileupload');
const errorHandler = require('./middleware/error');
const fs = require('fs');

// Load environment variables from server/.env
dotenv.config({ path: path.join(__dirname, '.env') });

// Initialize Express app
const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configure CORS
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));

// File uploading
app.use(fileupload({
  createParentPath: true
}));

// Set static folder for uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Set static folder for medicinesImages
app.use('/medicinesImages', express.static(path.join(__dirname, '..', 'medicinesImages')));

// Set static folder for client public images
app.use('/images/medicines', express.static(path.join(__dirname, '..', 'client', 'public', 'images', 'medicines')));

// Additional path for medicine images - serve from all possible locations
app.get('/medicine-image/:filename', (req, res) => {
  const filename = req.params.filename;
  console.log(`Looking for medicine image: ${filename}`);
  
  // Define possible locations in order of preference
  const possiblePaths = [
    path.join(__dirname, '..', 'medicinesImages', filename),
    path.join(__dirname, '..', 'client', 'public', 'images', 'medicines', filename),
    path.join(__dirname, 'uploads', filename)
  ];
  
  // Try to find the image in any of the locations
  for (const imagePath of possiblePaths) {
    if (fs.existsSync(imagePath)) {
      console.log(`Found at: ${imagePath}`);
      return res.sendFile(imagePath);
    }
  }
  
  // If not found anywhere, send the no-image.jpg
  console.log(`Image not found: ${filename}, serving no-image.jpg`);
  const noImagePath = path.join(__dirname, '..', 'client', 'public', 'images', 'medicines', 'no-image.jpg');
  return res.sendFile(noImagePath);
});

// Import routes
const authRoutes = require('./routes/auth.routes');
const userRoutes = require('./routes/user.routes');
const medicineRoutes = require('./routes/medicine.routes');
const orderRoutes = require('./routes/order.routes');
const inventoryRoutes = require('./routes/inventory.routes');
const mlRoutes = require('./routes/ml.routes');
const analyticsRoutes = require('./routes/analyticsRoutes');

// Use routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/medicines', medicineRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/inventory', inventoryRoutes);
app.use('/api/ml', mlRoutes);
app.use('/api/analytics', analyticsRoutes);

// Error handling middleware
app.use(errorHandler);

// MongoDB connectioN
mongoose.set('strictQuery', false);
console.log('Attempting to connect to MongoDB...');
console.log('MongoDB URI:', process.env.MONGO_URI);

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => {
  console.log('✅ MongoDB connected successfully');
  console.log('Connected to database:', mongoose.connection.db.databaseName);
  // List all collections
  mongoose.connection.db.listCollections().toArray((err, collections) => {
    if (err) {
      console.error('Error listing collections:', err);
    } else {
      console.log('Available collections:', collections.map(c => c.name));
    }
  });
})
.catch(err => {
  console.error('❌ MongoDB connection error:', err);
  console.error('Error details:', {
    name: err.name,
    message: err.message,
    code: err.code,
    codeName: err.codeName
  });
});

// Serve static assets in production
if (process.env.NODE_ENV === 'production') {
  // Set static folder
  app.use(express.static('client/build'));

  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../client', 'build', 'index.html'));
  });
}

// Define PORT
const PORT = process.env.PORT || 5002;

// Start server with error handling
const startServer = () => {
  const server = app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Environment: ${process.env.NODE_ENV}`);
  }).on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      console.log(`Port ${PORT} is busy, trying ${PORT + 1}...`);
      startServer(PORT + 1);
    } else {
      console.error('Server error:', err);
    }
  });
};

startServer(); 
