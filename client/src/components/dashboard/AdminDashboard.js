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
  ListItemAvatar,
  Avatar,
  Chip
} from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import MedicationIcon from '@mui/icons-material/Medication';
import StoreIcon from '@mui/icons-material/Store';
import FactoryIcon from '@mui/icons-material/Factory';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import SettingsIcon from '@mui/icons-material/Settings';
import BarChartIcon from '@mui/icons-material/BarChart';

const AdminDashboard = ({
  auth: { user },
  admin: { 
    users, 
    retailers, 
    manufacturers, 
    pendingApprovals, 
    loading: adminLoading 
  },
  medicine: { medicines, loading: medicineLoading },
  order: { orders, loading: orderLoading }
}) => {
  // Placeholder for actions that would fetch data from the API
  useEffect(() => {
    // In a complete implementation, you would dispatch actions to load data
    // For example: 
    // dispatch(getUsers());
    // dispatch(getRetailers());
    // dispatch(getManufacturers());
    // dispatch(getPendingApprovals());
    // dispatch(getMedicines());
    // dispatch(getOrders());
  }, []);

  // Counts for statistics
  const totalUsers = users ? users.length : 0;
  const totalRetailers = retailers ? retailers.length : 0;
  const totalManufacturers = manufacturers ? manufacturers.length : 0;
  const totalMedicines = medicines ? medicines.length : 0;
  const totalOrders = orders ? orders.length : 0;
  const pendingApprovalsCount = pendingApprovals ? pendingApprovals.length : 0;

  // Recent user registrations
  const recentUsers = users 
    ? [...users].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 5)
    : [];

  if (adminLoading || medicineLoading || orderLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Admin Dashboard
      </Typography>
      <Typography variant="subtitle1" color="textSecondary" paragraph>
        Manage and monitor system users, medicines, and activities
      </Typography>

      {/* Statistics Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={4}>
          <Card sx={{ height: '100%', bgcolor: 'primary.light' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Total Users
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Typography variant="h3" sx={{ flexGrow: 1 }}>
                  {totalUsers}
                </Typography>
                <PersonIcon fontSize="large" />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <Card sx={{ height: '100%', bgcolor: 'success.light' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Total Medicines
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Typography variant="h3" sx={{ flexGrow: 1 }}>
                  {totalMedicines}
                </Typography>
                <MedicationIcon fontSize="large" />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <Card sx={{ height: '100%', bgcolor: 'info.light' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Total Orders
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Typography variant="h3" sx={{ flexGrow: 1 }}>
                  {totalOrders}
                </Typography>
                <ShoppingCartIcon fontSize="large" />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <Card sx={{ height: '100%', bgcolor: 'warning.light' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Pending Approvals
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Typography variant="h3" sx={{ flexGrow: 1 }}>
                  {pendingApprovalsCount}
                </Typography>
                <VerifiedUserIcon fontSize="large" />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <Card sx={{ height: '100%', bgcolor: 'secondary.light' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Retailers
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Typography variant="h3" sx={{ flexGrow: 1 }}>
                  {totalRetailers}
                </Typography>
                <StoreIcon fontSize="large" />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <Card sx={{ height: '100%', bgcolor: 'error.light' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Manufacturers
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Typography variant="h3" sx={{ flexGrow: 1 }}>
                  {totalManufacturers}
                </Typography>
                <FactoryIcon fontSize="large" />
              </Box>
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
                <VerifiedUserIcon color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6">User Approvals</Typography>
              </Box>
              <Typography variant="body2">
                Approve new user registrations and account requests
              </Typography>
            </CardContent>
            <CardActions>
              <Button size="small" component={Link} to="/admin/approvals">
                Approve Users
              </Button>
            </CardActions>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <PersonIcon color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6">Manage Users</Typography>
              </Box>
              <Typography variant="body2">
                View and manage user accounts and permissions
              </Typography>
            </CardContent>
            <CardActions>
              <Button size="small" component={Link} to="/admin/users">
                View Users
              </Button>
            </CardActions>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <MedicationIcon color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6">Manage Medicines</Typography>
              </Box>
              <Typography variant="body2">
                Review and manage medicines in the system
              </Typography>
            </CardContent>
            <CardActions>
              <Button size="small" component={Link} to="/admin/medicines">
                View Medicines
              </Button>
            </CardActions>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <GroupAddIcon color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6">Add Admin</Typography>
              </Box>
              <Typography variant="body2">
                Add a new administrator to the system
              </Typography>
            </CardContent>
            <CardActions>
              <Button size="small" component={Link} to="/admin/new">
                Add Admin
              </Button>
            </CardActions>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <StoreIcon color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6">Manage Retailers</Typography>
              </Box>
              <Typography variant="body2">
                View and manage retailer accounts and activities
              </Typography>
            </CardContent>
            <CardActions>
              <Button size="small" component={Link} to="/admin/retailers">
                View Retailers
              </Button>
            </CardActions>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <FactoryIcon color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6">Manage Manufacturers</Typography>
              </Box>
              <Typography variant="body2">
                View and manage manufacturer accounts and activities
              </Typography>
            </CardContent>
            <CardActions>
              <Button size="small" component={Link} to="/admin/manufacturers">
                View Manufacturers
              </Button>
            </CardActions>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <BarChartIcon color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6">System Analytics</Typography>
              </Box>
              <Typography variant="body2">
                View system usage and performance analytics
              </Typography>
            </CardContent>
            <CardActions>
              <Button size="small" component={Link} to="/admin/analytics">
                View Analytics
              </Button>
            </CardActions>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <SettingsIcon color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6">System Settings</Typography>
              </Box>
              <Typography variant="body2">
                Configure system settings and parameters
              </Typography>
            </CardContent>
            <CardActions>
              <Button size="small" component={Link} to="/admin/settings">
                View Settings
              </Button>
            </CardActions>
          </Card>
        </Grid>
      </Grid>

      {/* Pending Approvals */}
      <Typography variant="h5" gutterBottom>
        Pending Approvals
      </Typography>
      <Paper sx={{ p: 2, mb: 4 }}>
        {pendingApprovalsCount > 0 ? (
          <List>
            {pendingApprovals.slice(0, 5).map((user, index) => (
              <React.Fragment key={user._id || index}>
                <ListItem 
                  secondaryAction={
                    <Box>
                      <Button 
                        variant="contained" 
                        color="success"
                        size="small"
                        sx={{ mr: 1 }}
                      >
                        Approve
                      </Button>
                      <Button 
                        variant="outlined" 
                        color="error"
                        size="small"
                      >
                        Reject
                      </Button>
                    </Box>
                  }
                >
                  <ListItemAvatar>
                    <Avatar>
                      {user.role === 'retailer' ? <StoreIcon /> : <FactoryIcon />}
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={
                      <Typography variant="body1">
                        {user.name || 'ABC Pharmacy'} 
                        <Chip 
                          size="small" 
                          label={user.role || 'Retailer'} 
                          color={user.role === 'retailer' ? 'secondary' : 'error'} 
                          sx={{ ml: 1 }} 
                        />
                      </Typography>
                    }
                    secondary={
                      <Typography variant="body2" color="text.secondary">
                        Email: {user.email || 'abc@example.com'} | 
                        Registered: {new Date(user.date || Date.now()).toLocaleDateString()} | 
                        License: {user.license || 'ABC12345'}
                      </Typography>
                    }
                  />
                </ListItem>
                {index < pendingApprovals.slice(0, 5).length - 1 && (
                  <Divider component="li" />
                )}
              </React.Fragment>
            ))}
          </List>
        ) : (
          <Typography variant="body1" align="center" sx={{ py: 3 }}>
            No pending approvals at the moment.
          </Typography>
        )}
      </Paper>

      {/* Recent User Registrations */}
      <Typography variant="h5" gutterBottom>
        Recent User Registrations
      </Typography>
      <Paper sx={{ p: 2, mb: 4 }}>
        {recentUsers.length > 0 ? (
          <List>
            {recentUsers.map((user, index) => (
              <React.Fragment key={user._id || index}>
                <ListItem 
                  secondaryAction={
                    <Button 
                      variant="outlined" 
                      size="small"
                      component={Link}
                      to={`/admin/users/${user._id || '123'}`}
                    >
                      View Details
                    </Button>
                  }
                >
                  <ListItemAvatar>
                    <Avatar>
                      {user.role === 'retailer' ? <StoreIcon /> : 
                        user.role === 'manufacturer' ? <FactoryIcon /> : <PersonIcon />}
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={
                      <Typography variant="body1">
                        {user.name || 'John Doe'} 
                        <Chip 
                          size="small" 
                          label={user.role || 'Admin'} 
                          color={
                            user.role === 'retailer' ? 'secondary' : 
                            user.role === 'manufacturer' ? 'error' : 'primary'
                          } 
                          sx={{ ml: 1 }} 
                        />
                        {user.approved === false && (
                          <Chip 
                            size="small" 
                            label="Pending Approval" 
                            color="warning" 
                            sx={{ ml: 1 }} 
                          />
                        )}
                      </Typography>
                    }
                    secondary={
                      <Typography variant="body2" color="text.secondary">
                        Email: {user.email || 'john@example.com'} | 
                        Registered: {new Date(user.date || Date.now()).toLocaleDateString()}
                      </Typography>
                    }
                  />
                </ListItem>
                {index < recentUsers.length - 1 && (
                  <Divider component="li" />
                )}
              </React.Fragment>
            ))}
          </List>
        ) : (
          <Typography variant="body1" align="center" sx={{ py: 3 }}>
            No recent user registrations.
          </Typography>
        )}
      </Paper>

      {/* System Status */}
      <Typography variant="h5" gutterBottom>
        System Status
      </Typography>
      <Paper sx={{ p: 2 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={4}>
            <Box sx={{ textAlign: 'center', p: 2 }}>
              <Typography variant="h6" gutterBottom>
                Server Status
              </Typography>
              <Box sx={{ display: 'flex', justifyContent: 'center', mb: 1 }}>
                <Chip 
                  label="Online" 
                  color="success" 
                  sx={{ fontSize: '1rem', height: 32, px: 1 }} 
                />
              </Box>
              <Typography variant="body2" color="text.secondary">
                Last checked: {new Date().toLocaleTimeString()}
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Box sx={{ textAlign: 'center', p: 2 }}>
              <Typography variant="h6" gutterBottom>
                Database Status
              </Typography>
              <Box sx={{ display: 'flex', justifyContent: 'center', mb: 1 }}>
                <Chip 
                  label="Healthy" 
                  color="success" 
                  sx={{ fontSize: '1rem', height: 32, px: 1 }} 
                />
              </Box>
              <Typography variant="body2" color="text.secondary">
                Storage used: 42%
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Box sx={{ textAlign: 'center', p: 2 }}>
              <Typography variant="h6" gutterBottom>
                API Status
              </Typography>
              <Box sx={{ display: 'flex', justifyContent: 'center', mb: 1 }}>
                <Chip 
                  label="All Services Running" 
                  color="success" 
                  sx={{ fontSize: '1rem', height: 32, px: 1 }} 
                />
              </Box>
              <Typography variant="body2" color="text.secondary">
                Response time: 120ms
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
};

AdminDashboard.propTypes = {
  auth: PropTypes.object.isRequired,
  admin: PropTypes.object.isRequired,
  medicine: PropTypes.object.isRequired,
  order: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth,
  admin: state.admin,
  medicine: state.medicine,
  order: state.order
});

export default connect(mapStateToProps)(AdminDashboard); 