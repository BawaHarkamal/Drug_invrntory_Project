import React, { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Container, Box, CircularProgress } from '@mui/material';

// Role-specific dashboards
import ConsumerDashboard from './ConsumerDashboard';
import RetailerDashboard from './RetailerDashboard';
import ManufacturerDashboard from './ManufacturerDashboard';
import SupplierDashboard from './SupplierDashboard';
import AdminDashboard from './AdminDashboard';

// Dashboard components
import DashboardNavigation from './DashboardNavigation';
import Profile from './Profile';
import Medicines from '../medicines/Medicines';
import MedicineDetail from '../medicines/MedicineDetail';
import TestMedicines from '../medicines/TestMedicines';
import Orders from '../orders/Orders';
import OrderDetail from '../orders/OrderDetail';
import MedicineRequests from '../inventory/MedicineRequests';
import SaltRequests from '../inventory/SaltRequests';
import Analytics from '../analytics/Analytics';

const Dashboard = ({ auth: { user, loading } }) => {
  if (loading || !user) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex' }}>
      <DashboardNavigation />
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Container maxWidth="lg" sx={{ mt: 8 }}>
          <Routes>
            <Route path="/" element={getRoleSpecificDashboard(user.role)} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/medicines" element={<Medicines />} />
            <Route path="/medicines/:id" element={<MedicineDetail />} />
            <Route path="/test-medicines" element={<TestMedicines />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/orders/:id" element={<OrderDetail />} />
            
            {/* Role-specific routes */}
            {(user.role === 'retailer' || user.role === 'manufacturer') && (
              <Route path="/medicine-requests" element={<MedicineRequests />} />
            )}
            
            {(user.role === 'manufacturer' || user.role === 'supplier') && (
              <Route path="/salt-requests" element={<SaltRequests />} />
            )}
            
            {user.role !== 'consumer' && (
              <Route path="/analytics" element={<Analytics />} />
            )}
          </Routes>
        </Container>
      </Box>
    </Box>
  );
};

// Helper function to return the appropriate dashboard based on user role
const getRoleSpecificDashboard = (role) => {
  switch (role) {
    case 'admin':
      return <AdminDashboard />;
    case 'consumer':
      return <ConsumerDashboard />;
    case 'retailer':
      return <RetailerDashboard />;
    case 'manufacturer':
      return <ManufacturerDashboard />;
    case 'supplier':
      return <SupplierDashboard />;
    default:
      return <ConsumerDashboard />;
  }
};

Dashboard.propTypes = {
  auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth
});

export default connect(mapStateToProps)(Dashboard); 