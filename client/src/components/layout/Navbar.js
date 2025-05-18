import React, { Fragment } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { logout } from '../../actions/auth';
import { AppBar, Toolbar, Typography, Button, Box, Container } from '@mui/material';
import LocalPharmacyIcon from '@mui/icons-material/LocalPharmacy';

const Navbar = ({ auth: { isAuthenticated, loading, user }, logout }) => {
  const authLinks = (
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      {user && (
        <Typography variant="body2" sx={{ mr: 2 }}>
          Welcome, {user.name} ({user.role})
        </Typography>
      )}
      <Button 
        component={Link} 
        to="/dashboard" 
        color="inherit" 
        sx={{ mr: 1 }}
      >
        Dashboard
      </Button>
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
        component={Link} 
        to="/register" 
        color="inherit" 
        sx={{ mr: 1 }}
      >
        Register
      </Button>
      <Button 
        component={Link} 
        to="/login" 
        color="inherit"
      >
        Login
      </Button>
    </Box>
  );

  return (
    <AppBar position="static">
      <Container>
        <Toolbar disableGutters>
          <LocalPharmacyIcon sx={{ mr: 1 }} />
          <Typography
            variant="h6"
            component={Link}
            to="/"
            sx={{
              mr: 2,
              flexGrow: 1,
              fontWeight: 700,
              color: 'inherit',
              textDecoration: 'none',
            }}
          >
            MedSupply Chain
          </Typography>
          {!loading && (
            <Fragment>{isAuthenticated ? authLinks : guestLinks}</Fragment>
          )}
        </Toolbar>
      </Container>
    </AppBar>
  );
};

Navbar.propTypes = {
  logout: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth
});

export default connect(mapStateToProps, { logout })(Navbar); 