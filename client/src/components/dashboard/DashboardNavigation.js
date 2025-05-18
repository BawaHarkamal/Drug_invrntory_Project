import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  AppBar,
  Toolbar,
  Typography,
  Box,
  IconButton
} from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PersonIcon from '@mui/icons-material/Person';
import MedicationIcon from '@mui/icons-material/Medication';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import InventoryIcon from '@mui/icons-material/Inventory';
import BarChartIcon from '@mui/icons-material/BarChart';
import MenuIcon from '@mui/icons-material/Menu';

const drawerWidth = 240;

const DashboardNavigation = ({ auth: { user } }) => {
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const location = useLocation();

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  // Navigation items based on user role
  const getNavigationItems = () => {
    const baseNavItems = [
      {
        text: 'Dashboard',
        icon: <DashboardIcon />,
        path: '/dashboard'
      },
      {
        text: 'Profile',
        icon: <PersonIcon />,
        path: '/dashboard/profile'
      },
      {
        text: 'Medicines',
        icon: <MedicationIcon />,
        path: '/dashboard/medicines'
      },
      {
        text: 'Test Medicines API',
        icon: <MedicationIcon />,
        path: '/dashboard/test-medicines'
      }
    ];

    // Add role-specific navigation items
    if (user) {
      if (user.role === 'admin') {
        baseNavItems.push(
          {
            text: 'Manage Users',
            icon: <PersonIcon />,
            path: '/dashboard/users'
          },
          {
            text: 'Manage Medicines',
            icon: <MedicationIcon />,
            path: '/dashboard/medicines'
          },
          {
            text: 'Analytics',
            icon: <BarChartIcon />,
            path: '/dashboard/analytics'
          }
        );
      } else if (user.role === 'retailer') {
        baseNavItems.push(
          {
            text: 'Inventory',
            icon: <InventoryIcon />,
            path: '/dashboard/inventory'
          },
          {
            text: 'Orders',
            icon: <ShoppingCartIcon />,
            path: '/dashboard/orders'
          },
          {
            text: 'Medicine Requests',
            icon: <MedicationIcon />,
            path: '/dashboard/medicine-requests'
          },
          {
            text: 'Analytics',
            icon: <BarChartIcon />,
            path: '/dashboard/analytics'
          }
        );
      } else if (user.role === 'manufacturer') {
        baseNavItems.push(
          {
            text: 'Medicines',
            icon: <MedicationIcon />,
            path: '/dashboard/medicines'
          },
          {
            text: 'Orders',
            icon: <ShoppingCartIcon />,
            path: '/dashboard/orders'
          },
          {
            text: 'Production',
            icon: <InventoryIcon />,
            path: '/dashboard/production'
          },
          {
            text: 'Analytics',
            icon: <BarChartIcon />,
            path: '/dashboard/analytics'
          }
        );
      } else if (user.role === 'consumer') {
        baseNavItems.push(
          {
            text: 'Medicines',
            icon: <MedicationIcon />,
            path: '/dashboard/medicines'
          },
          {
            text: 'My Orders',
            icon: <ShoppingCartIcon />,
            path: '/dashboard/orders'
          }
        );
      }
    }

    return baseNavItems;
  };

  const drawer = (
    <div>
      <Toolbar>
        <Typography variant="h6" noWrap>
          {user && user.name}
        </Typography>
      </Toolbar>
      <Divider />
      <List>
        {getNavigationItems().map((item) => (
          <ListItem 
            button 
            key={item.text} 
            component={Link} 
            to={item.path}
            selected={location.pathname === item.path}
          >
            <ListItemIcon>{item.icon}</ListItemIcon>
            <ListItemText primary={item.text} />
          </ListItem>
        ))}
      </List>
    </div>
  );

  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div">
            {user && user.role.charAt(0).toUpperCase() + user.role.slice(1)} Dashboard
          </Typography>
        </Toolbar>
      </AppBar>
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>
    </Box>
  );
};

DashboardNavigation.propTypes = {
  auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth
});

export default connect(mapStateToProps)(DashboardNavigation); 