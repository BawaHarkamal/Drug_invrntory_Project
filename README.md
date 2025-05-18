# Drug Inventory and Supply Chain Tracking System

A comprehensive MERN stack application for managing drug inventory and supply chain tracking with ML integration for predictive analytics.

## Features

- **Role-based user authentication** - Consumers, Retailers, Manufacturers, and Suppliers
- **Consumer Features**
  - Browse medicines
  - Place orders with prescription uploads
  - Track order status and location in real-time
  - View order history
- **Retailer Features**
  - Manage medicine inventory
  - Process orders and update status
  - Request medicines from manufacturers
  - Access annual reports and analytics
- **Manufacturer Features**
  - Manage medicine production
  - Request salts from suppliers
  - Process requests from retailers
  - Access annual reports and analytics
- **Supplier Features**
  - Process salt requests from manufacturers
  - View analytics reports
- **ML Integration**
  - Annual sales analysis
  - Demand prediction
  - Inventory optimization recommendations
  - Seasonal trend analysis

## Tech Stack

- **Frontend**: React, Redux, Material-UI
- **Backend**: Node.js, Express
- **Database**: MongoDB
- **Authentication**: JWT
- **ML Integration**: Custom integration for predictive analytics

## Setup and Installation

### Prerequisites

- Node.js (v14+ recommended)
- MongoDB (local or Atlas)
- npm or yarn

### Installation Steps

1. Clone the repository
   ```
   git clone <repository-url>
   cd drug-inventory
   ```

2. Install backend dependencies
   ```
   npm install
   ```

3. Install frontend dependencies
   ```
   npm run install-client
   ```

4. Configure environment variables
   - Create a `.env` file in the root directory with the following:
   ```
   PORT=5000
   MONGO_URI=<your-mongodb-uri>
   JWT_SECRET=<your-secret-key>
   JWT_EXPIRE=30d
   NODE_ENV=development
   FILE_UPLOAD_PATH=./server/uploads
   MAX_FILE_UPLOAD=1000000
   ```

5. Run the development server
   ```
   npm run dev
   ```

6. Seed the database with sample data
   ```
   # First create at least one manufacturer and retailer user, then:
   npm run seed-medicines
   ```

## Medicine Data

The application includes a seed script to populate the database with sample medicine data. To seed the database:

1. First ensure you have at least one user with role 'manufacturer' and one with role 'retailer' in your database
2. Run the seed script: `npm run seed-medicines`

This will add 8 sample medicines to your database including:
- Paracetamol 500mg (Analgesics)
- Amoxicillin 250mg (Antibiotics) 
- Metformin 500mg (Antidiabetic)
- Lisinopril 10mg (Cardiovascular)
- Salbutamol Inhaler (Respiratory)
- Omeprazole 20mg (Gastrointestinal)
- Ibuprofen 400mg (Analgesics)
- Atorvastatin 10mg (Cardiovascular)

Each medicine includes details like price, stock quantity, expiry date, prescription requirement, and composition.

## API Documentation

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login a user
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/updatedetails` - Update user details
- `PUT /api/auth/updatepassword` - Update password

### Medicines
- `GET /api/medicines` - Get all medicines
- `POST /api/medicines` - Create a medicine
- `GET /api/medicines/:id` - Get a single medicine
- `PUT /api/medicines/:id` - Update a medicine
- `DELETE /api/medicines/:id` - Delete a medicine
- `PUT /api/medicines/:id/photo` - Upload medicine image
- `GET /api/medicines/search` - Search medicines

### Orders
- `GET /api/orders` - Get all orders (role-based)
- `POST /api/orders` - Create a new order
- `GET /api/orders/:id` - Get a single order
- `PUT /api/orders/:id/status` - Update order status
- `PUT /api/orders/:id/location` - Update order location
- `PUT /api/orders/:id/prescription` - Upload prescription
- `PUT /api/orders/:id/verify-prescription` - Verify prescription

### Inventory
- `GET /api/inventory/medicine-requests` - Get medicine requests
- `POST /api/inventory/medicine-requests` - Create medicine request
- `GET /api/inventory/salt-requests` - Get salt requests
- `POST /api/inventory/salt-requests` - Create salt request

### ML Analytics
- `POST /api/ml/analyze/:year` - Generate annual report
- `GET /api/ml/reports` - Get all reports
- `GET /api/ml/reports/:id` - Get a single report

## Deployment

The application is ready for deployment on platforms like Heroku:

```
heroku create
git push heroku main
```

## License

ISC 