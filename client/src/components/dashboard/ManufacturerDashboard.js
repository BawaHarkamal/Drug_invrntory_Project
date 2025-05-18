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
  CircularProgress,
  List,
  ListItem,
  ListItemText,
  Chip
} from '@mui/material';
import ProductionQuantityLimitsIcon from '@mui/icons-material/ProductionQuantityLimits';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import AutorenewIcon from '@mui/icons-material/Autorenew';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import AssessmentIcon from '@mui/icons-material/Assessment';

const ManufacturerDashboard = ({
  auth: { user },
  medicine: { medicines, loading: medicineLoading },
  order: { orders, loading: orderLoading },
  manufacturer: { productionBatches, loading: productionLoading } 
}) => {
  // Placeholder for actions that would fetch data from the API
  useEffect(() => {
    // In a complete implementation, you would dispatch actions to load data
    // For example: 
    // dispatch(getMedicines());
    // dispatch(getOrders());
    // dispatch(getProductionBatches());
  }, []);

  // Filter orders for this manufacturer
  const manufacturerOrders = orders && orders.length > 0 && user
    ? orders.filter(order => order.manufacturer === user._id)
    : [];

  // Get new orders (status: pending)
  const newOrders = manufacturerOrders
    ? manufacturerOrders.filter(order => order.status === 'pending')
    : [];

  // Get processing orders (status: processing)
  const processingOrders = manufacturerOrders
    ? manufacturerOrders.filter(order => order.status === 'processing')
    : [];

  // Get production batches in process
  const activeBatches = productionBatches && productionBatches.length > 0
    ? productionBatches.filter(batch => batch.status === 'in-progress')
    : [];

  // Get total revenue
  const totalRevenue = manufacturerOrders
    ? manufacturerOrders.reduce((total, order) => 
        order.status === 'delivered' ? total + (order.total || 0) : total, 0)
    : 0;

  if (medicineLoading || orderLoading || productionLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Manufacturer Dashboard
      </Typography>
      <Typography variant="subtitle1" color="textSecondary" paragraph>
        Manage your medicines, production, and orders
      </Typography>

      {/* Statistics Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ height: '100%', bgcolor: 'primary.light' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Medicines Produced
              </Typography>
              <Typography variant="h3">
                {medicines ? medicines.filter(m => m.manufacturer === user?._id).length : 0}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ height: '100%', bgcolor: 'warning.light' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                New Orders
              </Typography>
              <Typography variant="h3">
                {newOrders.length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ height: '100%', bgcolor: 'info.light' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Active Production
              </Typography>
              <Typography variant="h3">
                {activeBatches.length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ height: '100%', bgcolor: 'success.light' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Total Revenue
              </Typography>
              <Typography variant="h3">
                ${totalRevenue.toLocaleString()}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Quick Actions */}
      <Typography variant="h5" gutterBottom>
        Quick Actions
      </Typography>
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={4}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <ProductionQuantityLimitsIcon color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6">Manage Medicines</Typography>
              </Box>
              <Typography variant="body2">Manage your medicine catalog and specifications</Typography>
            </CardContent>
            <CardActions>
              <Button size="small" component={Link} to="/medicines">
                View Medicines
              </Button>
            </CardActions>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <ShoppingCartIcon color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6">Manage Orders</Typography>
              </Box>
              <Typography variant="body2">Process and fulfill retailer orders</Typography>
            </CardContent>
            <CardActions>
              <Button size="small" component={Link} to="/orders">
                View Orders
              </Button>
            </CardActions>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <AutorenewIcon color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6">Production Batches</Typography>
              </Box>
              <Typography variant="body2">Manage medicine production batches</Typography>
            </CardContent>
            <CardActions>
              <Button size="small" component={Link} to="/production">
                View Production
              </Button>
            </CardActions>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <LocalShippingIcon color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6">Shipments</Typography>
              </Box>
              <Typography variant="body2">Track and manage order shipments</Typography>
            </CardContent>
            <CardActions>
              <Button size="small" component={Link} to="/shipments">
                View Shipments
              </Button>
            </CardActions>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <AddCircleOutlineIcon color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6">Add New Medicine</Typography>
              </Box>
              <Typography variant="body2">Register a new medicine in the system</Typography>
            </CardContent>
            <CardActions>
              <Button size="small" component={Link} to="/medicines/new">
                Add Medicine
              </Button>
            </CardActions>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <AssessmentIcon color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6">Analytics</Typography>
              </Box>
              <Typography variant="body2">View production and sales analytics</Typography>
            </CardContent>
            <CardActions>
              <Button size="small" component={Link} to="/analytics">
                View Analytics
              </Button>
            </CardActions>
          </Card>
        </Grid>
      </Grid>

      {/* New Orders */}
      <Typography variant="h5" gutterBottom>
        New Orders
      </Typography>
      <Paper sx={{ p: 2, mb: 4 }}>
        {newOrders.length > 0 ? (
          <List>
            {newOrders.slice(0, 5).map((order, index) => (
              <React.Fragment key={order._id || index}>
                <ListItem 
                  secondaryAction={
                    <Box>
                      <Button 
                        variant="contained" 
                        size="small"
                        component={Link}
                        to={`/orders/${order._id || '123'}`}
                        sx={{ mr: 1 }}
                      >
                        Process
                      </Button>
                      <Button 
                        variant="outlined" 
                        size="small"
                        component={Link}
                        to={`/orders/${order._id || '123'}`}
                      >
                        Details
                      </Button>
                    </Box>
                  }
                >
                  <ListItemText
                    primary={
                      <Typography variant="body1">
                        Order #{order.orderNumber || '10045'} from {order.retailer?.name || 'ABC Pharmacy'}
                      </Typography>
                    }
                    secondary={
                      <Typography variant="body2" color="text.secondary">
                        Date: {new Date(order.orderDate || Date.now()).toLocaleDateString()} | 
                        Items: {order.items?.length || 5} | 
                        Total: ${order.total || 1250}
                        <Chip 
                          size="small" 
                          label="New Order" 
                          color="warning" 
                          sx={{ ml: 1 }} 
                        />
                      </Typography>
                    }
                  />
                </ListItem>
                {index < newOrders.slice(0, 5).length - 1 && (
                  <Divider component="li" />
                )}
              </React.Fragment>
            ))}
          </List>
        ) : (
          <Typography variant="body1" align="center" sx={{ py: 3 }}>
            No new orders at the moment.
          </Typography>
        )}
      </Paper>

      {/* In Progress Production */}
      <Typography variant="h5" gutterBottom>
        Production in Progress
      </Typography>
      <Paper sx={{ p: 2, mb: 4 }}>
        {activeBatches.length > 0 ? (
          <List>
            {activeBatches.slice(0, 5).map((batch, index) => (
              <React.Fragment key={batch._id || index}>
                <ListItem 
                  secondaryAction={
                    <Button 
                      variant="contained" 
                      color="success"
                      size="small"
                      component={Link}
                      to={`/production/${batch._id || '123'}`}
                    >
                      Complete Batch
                    </Button>
                  }
                >
                  <ListItemText
                    primary={
                      <Typography variant="body1">
                        Batch #{batch.batchNumber || 'BT12345'} - {batch.medicine?.name || 'Amoxicillin 500mg'}
                      </Typography>
                    }
                    secondary={
                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          Started: {new Date(batch.startDate || Date.now()).toLocaleDateString()} | 
                          Quantity: {batch.quantity || 5000} units | 
                          Progress: {batch.progressPercentage || 65}%
                        </Typography>
                        <Box sx={{ width: '100%', mt: 1, bgcolor: 'background.paper', borderRadius: 1 }}>
                          <Box 
                            sx={{ 
                              height: 8, 
                              width: `${batch.progressPercentage || 65}%`, 
                              bgcolor: 'primary.main',
                              borderRadius: 1
                            }} 
                          />
                        </Box>
                      </Box>
                    }
                  />
                </ListItem>
                {index < activeBatches.slice(0, 5).length - 1 && (
                  <Divider component="li" />
                )}
              </React.Fragment>
            ))}
          </List>
        ) : (
          <Typography variant="body1" align="center" sx={{ py: 3 }}>
            No active production batches at the moment.
          </Typography>
        )}
      </Paper>

      {/* Orders in Processing */}
      <Typography variant="h5" gutterBottom>
        Orders in Processing
      </Typography>
      <Paper sx={{ p: 2 }}>
        {processingOrders.length > 0 ? (
          <List>
            {processingOrders.slice(0, 5).map((order, index) => (
              <React.Fragment key={order._id || index}>
                <ListItem 
                  secondaryAction={
                    <Button 
                      variant="contained" 
                      color="success"
                      size="small"
                      component={Link}
                      to={`/shipments/new?order=${order._id || '123'}`}
                    >
                      Ship Order
                    </Button>
                  }
                >
                  <ListItemText
                    primary={
                      <Typography variant="body1">
                        Order #{order.orderNumber || 'OR78945'} for {order.retailer?.name || 'MedPlus Pharmacy'}
                      </Typography>
                    }
                    secondary={
                      <Typography variant="body2" color="text.secondary">
                        Processing since: {new Date(order.processingDate || Date.now()).toLocaleDateString()} | 
                        Items: {order.items?.length || 3} | 
                        Total: ${order.total || 876.50}
                        <Chip 
                          size="small" 
                          label="Processing" 
                          color="info" 
                          sx={{ ml: 1 }} 
                        />
                      </Typography>
                    }
                  />
                </ListItem>
                {index < processingOrders.slice(0, 5).length - 1 && (
                  <Divider component="li" />
                )}
              </React.Fragment>
            ))}
          </List>
        ) : (
          <Typography variant="body1" align="center" sx={{ py: 3 }}>
            No orders in processing at the moment.
          </Typography>
        )}
      </Paper>
    </Box>
  );
};

ManufacturerDashboard.propTypes = {
  auth: PropTypes.object.isRequired,
  medicine: PropTypes.object.isRequired,
  order: PropTypes.object.isRequired,
  manufacturer: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth,
  medicine: state.medicine,
  order: state.order,
  manufacturer: state.manufacturer
});

export default connect(mapStateToProps)(ManufacturerDashboard); 