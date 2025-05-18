import React from 'react';
import { Box, Container, Typography, Link as MuiLink } from '@mui/material';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        py: 3,
        px: 2,
        mt: 'auto',
        backgroundColor: theme => theme.palette.grey[200]
      }}
    >
      <Container maxWidth="lg">
        <Typography variant="body1" align="center">
          &copy; {new Date().getFullYear()} MedSupply Chain - Drug Inventory & Supply Chain Tracking System
        </Typography>
        <Typography variant="body2" color="textSecondary" align="center">
          <MuiLink component={Link} to="/" color="inherit">
            Home
          </MuiLink>{' | '}
          <MuiLink component={Link} to="/about" color="inherit">
            About
          </MuiLink>{' | '}
          <MuiLink component={Link} to="/contact" color="inherit">
            Contact
          </MuiLink>
        </Typography>
      </Container>
    </Box>
  );
};

export default Footer; 