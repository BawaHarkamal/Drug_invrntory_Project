const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const fileupload = require('express-fileupload');
const errorHandler = require('./middleware/error');
const fs = require('fs');

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

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

// MongoDB connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected successfully'))
  .catch(err => console.error('MongoDB connection error:', err));

// Serve static assets in production
if (process.env.NODE_ENV === 'production') {
  // Set static folder
  app.use(express.static('client/build'));

  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../client', 'build', 'index.html'));
  });
}

// Define PORT
const PORT = process.env.PORT || 5001;

// Start server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`)); 
