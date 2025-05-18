import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import {
  Grid,
  Typography,
  Card,
  CardContent,
  CardActions,
  Button,
  Box,
  Paper,
  Divider,
  CircularProgress
} from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import MedicationIcon from '@mui/icons-material/Medication';
import HistoryIcon from '@mui/icons-material/History';

const ConsumerDashboard = ({ auth: { user }, order: { orders, loading } }) => {
  // Placeholder for actions that would fetch data from the API
  useEffect(() => {
    // In a complete implementation, you would dispatch actions to load data
    // For example: dispatch(getOrders());
  }, []);

  const recentOrders = orders && orders.length > 0 
    ? orders.slice(0, 3) 
    : [];

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Welcome, {user.name}
      </Typography>
      <Typography variant="subtitle1" color="textSecondary" paragraph>
        Manage your medicine orders and tracking from one place
      </Typography>

      {/* Quick Actions */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <ShoppingCartIcon color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6">New Order</Typography>
              </Box>
              <Typography variant="body2">Purchase medicines with prescription uploads</Typography>
            </CardContent>
            <CardActions>
              <Button size="small" component={Link} to="/dashboard/medicines">
                Browse Medicines
              </Button>
            </CardActions>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <LocalShippingIcon color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6">Track Orders</Typography>
              </Box>
              <Typography variant="body2">Real-time location tracking of your orders</Typography>
            </CardContent>
            <CardActions>
              <Button size="small" component={Link} to="/dashboard/orders">
                View Orders
              </Button>
            </CardActions>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <MedicationIcon color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6">Medicine Info</Typography>
              </Box>
              <Typography variant="body2">Browse medicine catalog and details</Typography>
            </CardContent>
            <CardActions>
              <Button size="small" component={Link} to="/dashboard/medicines">
                View Medicines
              </Button>
            </CardActions>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <HistoryIcon color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6">Order History</Typography>
              </Box>
              <Typography variant="body2">View your previous orders and status</Typography>
            </CardContent>
            <CardActions>
              <Button size="small" component={Link} to="/dashboard/orders">
                View History
              </Button>
            </CardActions>
          </Card>
        </Grid>
      </Grid>

      {/* Recent Orders */}
      <Typography variant="h5" gutterBottom>
        Recent Orders
      </Typography>
      <Paper sx={{ p: 2, mb: 4 }}>
        {recentOrders.length > 0 ? (
          <Box>
            {recentOrders.map((order, index) => (
              <Box key={order._id || index}>
                <Grid container spacing={2} alignItems="center">
                  <Grid item xs={2}>
                    <Typography variant="body2" color="textSecondary">
                      Order ID
                    </Typography>
                    <Typography variant="body1">
                      #{order.trackingId || '12345678'}
                    </Typography>
                  </Grid>
                  <Grid item xs={3}>
                    <Typography variant="body2" color="textSecondary">
                      Date
                    </Typography>
                    <Typography variant="body1">
                      {new Date(order.orderDate || Date.now()).toLocaleDateString()}
                    </Typography>
                  </Grid>
                  <Grid item xs={3}>
                    <Typography variant="body2" color="textSecondary">
                      Status
                    </Typography>
                    <Typography 
                      variant="body1"
                      sx={{
                        color: 
                          order.status === 'delivered' 
                            ? 'success.main' 
                            : order.status === 'cancelled' 
                              ? 'error.main' 
                              : 'warning.main'
                      }}
                    >
                      {order.status || 'Processing'}
                    </Typography>
                  </Grid>
                  <Grid item xs={2}>
                    <Typography variant="body2" color="textSecondary">
                      Total
                    </Typography>
                    <Typography variant="body1">
                      ${order.totalAmount || '99.99'}
                    </Typography>
                  </Grid>
                  <Grid item xs={2}>
                    <Button 
                      size="small" 
                      variant="outlined"
                      component={Link}
                      to={`/dashboard/orders/${order._id || '123'}`}
                    >
                      View
                    </Button>
                  </Grid>
                </Grid>
                {index < recentOrders.length - 1 && (
                  <Divider sx={{ my: 2 }} />
                )}
              </Box>
            ))}
          </Box>
        ) : (
          <Typography variant="body1" align="center" sx={{ py: 3 }}>
            You have no recent orders. 
            <Button component={Link} to="/dashboard/medicines" sx={{ ml: 1 }}>
              Browse Medicines
            </Button>
          </Typography>
        )}
      </Paper>
    </Box>
  );
};

ConsumerDashboard.propTypes = {
  auth: PropTypes.object.isRequired,
  order: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth,
  order: state.order
});

export default connect(mapStateToProps)(ConsumerDashboard); 