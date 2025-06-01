import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

// Layout Components
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import Alert from './components/layout/Alert';

// Auth Components
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import PrivateRoute from './components/routing/PrivateRoute';

// Pages
import Home from './components/pages/Home';
import Dashboard from './components/dashboard/Dashboard';
import NotFound from './components/pages/NotFound';
import AnalyticsDashboard from './components/dashboard/AnalyticsDashboard';
import DrugTrends from './components/dashboard/DrugTrends';

// Order Components
import OrderForm from './components/orders/OrderForm';
import OrderDetails from './components/orders/OrderDetails';
import OrderList from './components/orders/OrderList';

// ML Components
import MLDashboard from './components/ml/MLDashboard';

// Redux Store
import store from './store';
import { loadUser } from './actions/auth';
import setAuthToken from './utils/setAuthToken';

// Check for token
if (localStorage.token) {
  setAuthToken(localStorage.token);
}

// Theme Configuration
const theme = createTheme({
  palette: {
    primary: {
      main: '#2e7d32', // Green for medical theme
    },
    secondary: {
      main: '#1565c0', // Blue
    },
    background: {
      default: '#f5f5f5',
    },
  },
  typography: {
    fontFamily: [
      'Roboto',
      'Arial',
      'sans-serif',
    ].join(','),
  },
});

const App = () => {
  useEffect(() => {
    store.dispatch(loadUser());
  }, []);

  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Router>
          <Navbar />
          <Alert />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route
              path="/dashboard/*"
              element={
                <PrivateRoute>
                  <Dashboard />
                </PrivateRoute>
              }
            />
            <Route path="/dashboard/analytics" element={
              <PrivateRoute roles={['admin', 'manager']}>
                <AnalyticsDashboard />
              </PrivateRoute>
            } />
            <Route path="/dashboard/drug/:drugId/trends" element={
              <PrivateRoute roles={['admin', 'manager', 'pharmacist']}>
                <DrugTrends />
              </PrivateRoute>
            } />
            <Route path="/orders" element={
              <PrivateRoute>
                <OrderList />
              </PrivateRoute>
            } />
            <Route path="/orders/new" element={
              <PrivateRoute>
                <OrderForm />
              </PrivateRoute>
            } />
            <Route path="/orders/:id" element={
              <PrivateRoute>
                <OrderDetails />
              </PrivateRoute>
            } />
            <Route path="/ml-dashboard" element={
              <PrivateRoute roles={['admin', 'retailer', 'manufacturer', 'supplier']}>
                <MLDashboard />
              </PrivateRoute>
            } />
            <Route path="*" element={<NotFound />} />
          </Routes>
          <Footer />
        </Router>
      </ThemeProvider>
    </Provider>
  );
};

export default App; 