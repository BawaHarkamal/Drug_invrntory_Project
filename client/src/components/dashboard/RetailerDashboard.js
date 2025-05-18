import React, { useEffect, useState } from 'react';
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
  Chip,
  TextField,
  InputAdornment
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import InventoryIcon from '@mui/icons-material/Inventory';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import ReceiptIcon from '@mui/icons-material/Receipt';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import AssessmentIcon from '@mui/icons-material/Assessment';
import NotificationsIcon from '@mui/icons-material/Notifications';

const RetailerDashboard = ({ 
  auth: { user },
  inventory: { inventory, loading: inventoryLoading },
  order: { orders, loading: orderLoading }
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  
  // Placeholder for actions that would fetch data from the API
  useEffect(() => {
    // In a complete implementation, you would dispatch actions to load data
    // For example: 
    // dispatch(getInventory());
    // dispatch(getOrders());
  }, []);

  // Filter inventory items based on search term
  const filteredInventory = inventory && inventory.length > 0
    ? inventory.filter(item => 
        item.medicineName && item.medicineName.toLowerCase().includes(searchTerm.toLowerCase()))
    : [];

  // Get low stock items (less than 10 units)
  const lowStockItems = inventory && inventory.length > 0
    ? inventory.filter(item => item.quantity < 10)
    : [];

  // Get incoming orders (status: processing or shipped)
  const incomingOrders = orders && orders.length > 0
    ? orders.filter(order => ['processing', 'shipped'].includes(order.status))
    : [];

  // Get recent transactions (last 5)
  const recentTransactions = orders && orders.length > 0
    ? orders.sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 5)
    : [];

  if (inventoryLoading || orderLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Retailer Dashboard
      </Typography>
      <Typography variant="subtitle1" color="textSecondary" paragraph>
        Manage your inventory, orders, and transactions
      </Typography>

      {/* Statistics Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ height: '100%', bgcolor: 'primary.light' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Inventory Items
              </Typography>
              <Typography variant="h3">
                {inventory ? inventory.length : 0}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ height: '100%', bgcolor: 'warning.light' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Low Stock Items
              </Typography>
              <Typography variant="h3">
                {lowStockItems.length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ height: '100%', bgcolor: 'success.light' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Active Orders
              </Typography>
              <Typography variant="h3">
                {incomingOrders.length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ height: '100%', bgcolor: 'info.light' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Total Sales
              </Typography>
              <Typography variant="h3">
                ${orders ? orders.reduce((total, order) => total + (order.total || 0), 0).toLocaleString() : 0}
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
                <InventoryIcon color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6">Inventory Management</Typography>
              </Box>
              <Typography variant="body2">Manage your medicine stock and inventory</Typography>
            </CardContent>
            <CardActions>
              <Button size="small" component={Link} to="/inventory">
                Manage Inventory
              </Button>
            </CardActions>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <ShoppingCartIcon color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6">Place New Order</Typography>
              </Box>
              <Typography variant="body2">Order medicines from manufacturers</Typography>
            </CardContent>
            <CardActions>
              <Button size="small" component={Link} to="/orders/new">
                New Order
              </Button>
            </CardActions>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <ReceiptIcon color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6">Sales & Transactions</Typography>
              </Box>
              <Typography variant="body2">Manage customer sales and transactions</Typography>
            </CardContent>
            <CardActions>
              <Button size="small" component={Link} to="/sales">
                View Sales
              </Button>
            </CardActions>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <LocalShippingIcon color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6">Track Orders</Typography>
              </Box>
              <Typography variant="body2">Track status of your pending orders</Typography>
            </CardContent>
            <CardActions>
              <Button size="small" component={Link} to="/orders/tracking">
                Track Orders
              </Button>
            </CardActions>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <AssessmentIcon color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6">Sales Reports</Typography>
              </Box>
              <Typography variant="body2">Generate sales and inventory reports</Typography>
            </CardContent>
            <CardActions>
              <Button size="small" component={Link} to="/reports">
                View Reports
              </Button>
            </CardActions>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <NotificationsIcon color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6">Notifications</Typography>
              </Box>
              <Typography variant="body2">View alerts, messages, and notifications</Typography>
            </CardContent>
            <CardActions>
              <Button size="small" component={Link} to="/notifications">
                View Notifications
              </Button>
            </CardActions>
          </Card>
        </Grid>
      </Grid>

      {/* Low Stock Items Section */}
      <Typography variant="h5" gutterBottom>
        Low Stock Items
      </Typography>
      <Paper sx={{ p: 2, mb: 4 }}>
        {lowStockItems.length > 0 ? (
          <List>
            {lowStockItems.slice(0, 5).map((item, index) => (
              <React.Fragment key={item._id || index}>
                <ListItem 
                  secondaryAction={
                    <Button 
                      variant="contained" 
                      size="small"
                      component={Link}
                      to={`/orders/new?medicine=${item._id || '123'}`}
                    >
                      Order Now
                    </Button>
                  }
                >
                  <ListItemText
                    primary={
                      <Typography variant="body1">
                        {item.medicineName || 'Paracetamol'} - {item.manufacturer || 'PharmaCorp'}
                      </Typography>
                    }
                    secondary={
                      <Box>
                        <Typography variant="body2" color="error">
                          Only {item.quantity || 5} units left in stock
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Batch: {item.batchNumber || 'B12345'} | Expiry: {new Date(item.expiryDate || Date.now()).toLocaleDateString()}
                        </Typography>
                      </Box>
                    }
                  />
                </ListItem>
                {index < lowStockItems.slice(0, 5).length - 1 && (
                  <Divider component="li" />
                )}
              </React.Fragment>
            ))}
          </List>
        ) : (
          <Typography variant="body1" align="center" sx={{ py: 3 }}>
            No low stock items at the moment. Your inventory is well-stocked.
          </Typography>
        )}
      </Paper>

      {/* Inventory Search */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h5">
          Inventory Search
        </Typography>
        <Button variant="contained" component={Link} to="/inventory">
          View All Inventory
        </Button>
      </Box>
      <Paper sx={{ p: 2, mb: 4 }}>
        <TextField
          fullWidth
          placeholder="Search medicines in inventory..."
          variant="outlined"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{ mb: 2 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
        {filteredInventory.length > 0 ? (
          <List>
            {filteredInventory.slice(0, 5).map((item, index) => (
              <React.Fragment key={item._id || index}>
                <ListItem 
                  secondaryAction={
                    <Box>
                      <Chip 
                        label={`${item.quantity || 20} units`} 
                        color={item.quantity < 10 ? 'error' : 'success'} 
                        sx={{ mr: 1 }} 
                      />
                      <Button 
                        variant="outlined" 
                        size="small"
                        component={Link}
                        to={`/inventory/${item._id || '123'}`}
                      >
                        Details
                      </Button>
                    </Box>
                  }
                >
                  <ListItemText
                    primary={
                      <Typography variant="body1">
                        {item.medicineName || 'Amoxicillin'} ({item.dosage || '500mg'})
                      </Typography>
                    }
                    secondary={
                      <Typography variant="body2" color="text.secondary">
                        Manufacturer: {item.manufacturer || 'MediCorp'} | Price: ${item.price || 12.99}
                      </Typography>
                    }
                  />
                </ListItem>
                {index < filteredInventory.slice(0, 5).length - 1 && (
                  <Divider component="li" />
                )}
              </React.Fragment>
            ))}
          </List>
        ) : (
          <Typography variant="body1" align="center" sx={{ py: 3 }}>
            {searchTerm ? 'No medicines found matching your search.' : 'Search for medicines in your inventory.'}
          </Typography>
        )}
      </Paper>

      {/* Recent Transactions */}
      <Typography variant="h5" gutterBottom>
        Recent Transactions
      </Typography>
      <Paper sx={{ p: 2 }}>
        {recentTransactions.length > 0 ? (
          <List>
            {recentTransactions.map((transaction, index) => (
              <React.Fragment key={transaction._id || index}>
                <ListItem 
                  secondaryAction={
                    <Button 
                      variant="outlined" 
                      size="small"
                      component={Link}
                      to={`/sales/${transaction._id || '123'}`}
                    >
                      View Details
                    </Button>
                  }
                >
                  <ListItemText
                    primary={
                      <Typography variant="body1">
                        Order #{transaction.orderNumber || '10045'} - ${transaction.total || 129.99}
                      </Typography>
                    }
                    secondary={
                      <Typography variant="body2" color="text.secondary">
                        Date: {new Date(transaction.date || Date.now()).toLocaleDateString()} | 
                        Items: {transaction.items?.length || 5} | 
                        Customer: {transaction.customer || 'Walk-in Customer'}
                        <Chip 
                          size="small" 
                          label={transaction.status || 'Completed'} 
                          color={transaction.status === 'completed' ? 'success' : 'primary'} 
                          sx={{ ml: 1 }} 
                        />
                      </Typography>
                    }
                  />
                </ListItem>
                {index < recentTransactions.length - 1 && (
                  <Divider component="li" />
                )}
              </React.Fragment>
            ))}
          </List>
        ) : (
          <Typography variant="body1" align="center" sx={{ py: 3 }}>
            No recent transactions found.
          </Typography>
        )}
      </Paper>
    </Box>
  );
};

RetailerDashboard.propTypes = {
  auth: PropTypes.object.isRequired,
  inventory: PropTypes.object.isRequired,
  order: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth,
  inventory: state.inventory,
  order: state.order
});

export default connect(mapStateToProps)(RetailerDashboard); 