const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Medicine = require('../models/Medicine');
const Order = require('../models/Order');
const User = require('../models/User');

// Load environment variables
dotenv.config();

// Function to generate random date within a range
const randomDate = (start, end) => {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
};

// Function to generate random number within a range
const randomNumber = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1) + min);
};

const generateDummyOrders = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/drug_inventory', {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });

    console.log('Connected to MongoDB');

    // Get all medicines and users
    const medicines = await Medicine.find();
    const users = await User.find({ role: 'consumer' });

    if (medicines.length === 0) {
      console.log('No medicines found. Please run the medicine seeder first.');
      process.exit(1);
    }

    if (users.length === 0) {
      console.log('No users found. Creating a dummy consumer...');
      const dummyUser = await User.create({
        name: 'John Doe',
        email: 'john@example.com',
        password: '123456',
        role: 'consumer',
        address: {
          street: '123 Main St',
          city: 'Sample City',
          state: 'Sample State',
          zipCode: '12345'
        }
      });
      users.push(dummyUser);
    }

    // Clear existing orders
    await Order.deleteMany({});
    console.log('Cleared existing orders');

    // Generate orders for the last 12 months
    const endDate = new Date();
    const startDate = new Date(endDate.getFullYear() - 1, endDate.getMonth(), 1);
    
    const orders = [];
    const numberOfOrders = 500; // Adjust this number for more or fewer orders

    for (let i = 0; i < numberOfOrders; i++) {
      const orderDate = randomDate(startDate, endDate);
      const user = users[Math.floor(Math.random() * users.length)];
      
      // Generate 1-5 items per order
      const items = [];
      const numberOfItems = randomNumber(1, 5);
      
      for (let j = 0; j < numberOfItems; j++) {
        const medicine = medicines[Math.floor(Math.random() * medicines.length)];
        const quantity = randomNumber(1, 10);
        
        items.push({
          medicine: medicine._id,
          quantity: quantity,
          price: medicine.price
        });
      }

      const totalAmount = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      
      const order = {
        user: user._id,
        items: items,
        totalAmount: totalAmount,
        shippingAddress: {
          street: user.address?.street || '123 Main St',
          city: user.address?.city || 'Sample City',
          state: user.address?.state || 'Sample State',
          zipCode: user.address?.zipCode || '12345'
        },
        paymentStatus: ['pending', 'completed', 'failed'][randomNumber(0, 2)],
        paymentMethod: ['credit_card', 'debit_card', 'cash_on_delivery'][randomNumber(0, 2)],
        orderStatus: ['processing', 'confirmed', 'shipped', 'delivered', 'cancelled'][randomNumber(0, 4)],
        createdAt: orderDate
      };

      orders.push(order);
    }

    // Insert orders in batches
    await Order.insertMany(orders);
    
    console.log(`Created ${orders.length} dummy orders`);
    console.log('Sample order:', orders[0]);

    console.log('Dummy data generation completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error generating dummy data:', error);
    process.exit(1);
  }
};

generateDummyOrders(); 