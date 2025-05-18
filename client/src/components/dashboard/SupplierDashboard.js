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
import InventoryIcon from '@mui/icons-material/Inventory';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import AssessmentIcon from '@mui/icons-material/Assessment';
import ScienceIcon from '@mui/icons-material/Science';
import StoreIcon from '@mui/icons-material/Store';

const SupplierDashboard = ({
  auth: { user },
  order: { orders, loading: orderLoading }
}) => {
  // Placeholder for actions that would fetch data from the API
  useEffect(() => {
    // In a complete implementation, you would dispatch actions to load data
    // For example: 
    // dispatch(getOrders());
    // dispatch(getSaltRequests());
  }, []);

  // Sample data for saltRequests
  const saltRequests = [
    {
      _id: '1',
      manufacturer: { name: 'PharmaCorp' },
      salt: { name: 'Paracetamol', quantity: 500, unit: 'kg' },
      status: 'pending',
      urgency: 'high',
      requiredBy: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    },
    {
      _id: '2',
      manufacturer: { name: 'MediPharma' },
      salt: { name: 'Amoxicillin', quantity: 200, unit: 'kg' },
      status: 'pending',
      urgency: 'medium',
      requiredBy: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000)
    }
  ];

  // Sample data for deliveries
  const deliveries = [
    {
      _id: '1',
      trackingId: 'DEL123456',
      manufacturer: { name: 'PharmaCorp' },
      salt: { name: 'Ibuprofen', quantity: 300, unit: 'kg' },
      status: 'in-transit',
      estimatedDelivery: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000)
    },
    {
      _id: '2',
      trackingId: 'DEL789012',
      manufacturer: { name: 'MediPharma' },
      salt: { name: 'Aspirin', quantity: 450, unit: 'kg' },
      status: 'delivered',
      deliveredAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000)
    }
  ];

  if (orderLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Supplier Dashboard
      </Typography>
      <Typography variant="subtitle1" color="textSecondary" paragraph>
        Manage your salt supplies and deliveries
      </Typography>

      {/* Statistics Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ height: '100%', bgcolor: 'primary.light' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Raw Materials
              </Typography>
              <Typography variant="h3">
                14
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ height: '100%', bgcolor: 'warning.light' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Pending Requests
              </Typography>
              <Typography variant="h3">
                {saltRequests.length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ height: '100%', bgcolor: 'info.light' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Active Deliveries
              </Typography>
              <Typography variant="h3">
                {deliveries.filter(d => d.status === 'in-transit').length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ height: '100%', bgcolor: 'success.light' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Partners
              </Typography>
              <Typography variant="h3">
                8
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
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <ScienceIcon color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6">Manage Salts</Typography>
              </Box>
              <Typography variant="body2">View and manage your salt inventory</Typography>
            </CardContent>
            <CardActions>
              <Button size="small" component={Link} to="/dashboard/inventory">
                View Inventory
              </Button>
            </CardActions>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <InventoryIcon color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6">Salt Requests</Typography>
              </Box>
              <Typography variant="body2">Manage and process manufacturer requests</Typography>
            </CardContent>
            <CardActions>
              <Button size="small" component={Link} to="/dashboard/salt-requests">
                View Requests
              </Button>
            </CardActions>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <LocalShippingIcon color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6">Deliveries</Typography>
              </Box>
              <Typography variant="body2">Track and manage your shipments</Typography>
            </CardContent>
            <CardActions>
              <Button size="small" component={Link} to="/dashboard/deliveries">
                View Deliveries
              </Button>
            </CardActions>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <AssessmentIcon color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6">Reports</Typography>
              </Box>
              <Typography variant="body2">View sales and supply reports</Typography>
            </CardContent>
            <CardActions>
              <Button size="small" component={Link} to="/dashboard/analytics">
                View Reports
              </Button>
            </CardActions>
          </Card>
        </Grid>
      </Grid>

      {/* Salt Requests */}
      <Typography variant="h5" gutterBottom>
        Salt Requests
      </Typography>
      <Paper sx={{ p: 2, mb: 4 }}>
        {saltRequests.length > 0 ? (
          <List>
            {saltRequests.map((request, index) => (
              <React.Fragment key={request._id}>
                <ListItem 
                  secondaryAction={
                    <Box>
                      <Button 
                        variant="contained" 
                        color="primary"
                        size="small"
                        sx={{ mr: 1 }}
                      >
                        Approve
                      </Button>
                      <Button 
                        variant="outlined" 
                        color="primary"
                        size="small"
                      >
                        Details
                      </Button>
                    </Box>
                  }
                >
                  <ListItemText
                    primary={
                      <Typography variant="body1">
                        {request.salt.name} - {request.salt.quantity} {request.salt.unit} 
                        <Chip 
                          size="small" 
                          label={request.urgency.toUpperCase()} 
                          color={request.urgency === 'high' ? 'error' : request.urgency === 'medium' ? 'warning' : 'info'} 
                          sx={{ ml: 1 }} 
                        />
                      </Typography>
                    }
                    secondary={
                      <Typography variant="body2" color="text.secondary">
                        Requested by: {request.manufacturer.name} | 
                        Required by: {new Date(request.requiredBy).toLocaleDateString()} | 
                        Status: {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                      </Typography>
                    }
                  />
                </ListItem>
                {index < saltRequests.length - 1 && (
                  <Divider component="li" />
                )}
              </React.Fragment>
            ))}
          </List>
        ) : (
          <Typography variant="body1" align="center" sx={{ py: 3 }}>
            No salt requests at the moment.
          </Typography>
        )}
      </Paper>

      {/* Active Deliveries */}
      <Typography variant="h5" gutterBottom>
        Active Deliveries
      </Typography>
      <Paper sx={{ p: 2 }}>
        {deliveries.filter(d => d.status === 'in-transit').length > 0 ? (
          <List>
            {deliveries.filter(d => d.status === 'in-transit').map((delivery, index) => (
              <React.Fragment key={delivery._id}>
                <ListItem 
                  secondaryAction={
                    <Button 
                      variant="outlined" 
                      color="primary"
                      size="small"
                      component={Link}
                      to={`/dashboard/deliveries/${delivery._id}`}
                    >
                      Track
                    </Button>
                  }
                >
                  <ListItemText
                    primary={
                      <Typography variant="body1">
                        Tracking ID: {delivery.trackingId} - {delivery.salt.name}
                      </Typography>
                    }
                    secondary={
                      <Typography variant="body2" color="text.secondary">
                        Manufacturer: {delivery.manufacturer.name} | 
                        Quantity: {delivery.salt.quantity} {delivery.salt.unit} | 
                        ETA: {new Date(delivery.estimatedDelivery).toLocaleDateString()}
                        <Chip 
                          size="small" 
                          label="In Transit" 
                          color="info" 
                          sx={{ ml: 1 }} 
                        />
                      </Typography>
                    }
                  />
                </ListItem>
                {index < deliveries.filter(d => d.status === 'in-transit').length - 1 && (
                  <Divider component="li" />
                )}
              </React.Fragment>
            ))}
          </List>
        ) : (
          <Typography variant="body1" align="center" sx={{ py: 3 }}>
            No active deliveries at the moment.
          </Typography>
        )}
      </Paper>
    </Box>
  );
};

SupplierDashboard.propTypes = {
  auth: PropTypes.object.isRequired,
  order: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth,
  order: state.order
});

export default connect(mapStateToProps)(SupplierDashboard); 