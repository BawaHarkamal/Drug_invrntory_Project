import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { logout } from '../../actions/auth';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Container,
  Box
} from '@mui/material';
import LocalPharmacyIcon from '@mui/icons-material/LocalPharmacy';

const Navbar = ({ auth: { isAuthenticated, loading, user }, logout }) => {
  const authLinks = (
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      <Button
        component={RouterLink}
        to="/dashboard"
        color="inherit"
        sx={{ mr: 2 }}
      >
        Dashboard
      </Button>
      <Button
        component={RouterLink}
        to="/orders"
        color="inherit"
        sx={{ mr: 2 }}
      >
        Orders
      </Button>
      <Button
        component={RouterLink}
        to="/orders/new"
        color="inherit"
        sx={{ mr: 2 }}
      >
        New Order
      </Button>
      {['admin', 'retailer', 'manufacturer', 'supplier'].includes(user?.role) && (
        <Button
          component={RouterLink}
          to="/ml-dashboard"
          color="inherit"
          sx={{ mr: 2 }}
        >
          ML Analytics
        </Button>
      )}
      <Button 
        onClick={logout} 
        color="inherit"
      >
        Logout
      </Button>
    </Box>
  );

  const guestLinks = (
    <Box>
      <Button
        component={RouterLink}
        to="/register"
        color="inherit"
        sx={{ mr: 2 }}
      >
        Register
      </Button>
      <Button
        component={RouterLink}
        to="/login"
        color="inherit"
      >
        Login
      </Button>
    </Box>
  );

  return (
    <AppBar position="static">
      <Container maxWidth="lg">
        <Toolbar>
          <LocalPharmacyIcon sx={{ mr: 2 }} />
          <Typography
            variant="h6"
            component={RouterLink}
            to="/"
            sx={{
              flexGrow: 1,
              textDecoration: 'none',
              color: 'inherit',
            }}
          >
            Drug Inventory
          </Typography>
          {!loading && (isAuthenticated ? authLinks : guestLinks)}
        </Toolbar>
      </Container>
    </AppBar>
  );
};

Navbar.propTypes = {
  logout: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired
};

const mapStateToProps = (state) => ({
  auth: state.auth
});

export default connect(mapStateToProps, { logout })(Navbar); 