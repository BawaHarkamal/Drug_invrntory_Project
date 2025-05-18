import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Container, 
  Box, 
  Typography, 
  Button, 
  Grid, 
  Card, 
  CardContent, 
  CardMedia 
} from '@mui/material';
import LocalPharmacyIcon from '@mui/icons-material/LocalPharmacy';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import FactoryIcon from '@mui/icons-material/Factory';
import PersonIcon from '@mui/icons-material/Person';

const Home = () => {
  return (
    <Box>
      {/* Hero Section */}
      <Box
        sx={{
          bgcolor: 'primary.main',
          color: 'white',
          pt: 8,
          pb: 6
        }}
      >
        <Container maxWidth="lg">
          <Typography
            component="h1"
            variant="h2"
            align="center"
            gutterBottom
          >
            MedSupply Chain
          </Typography>
          <Typography variant="h5" align="center" paragraph>
            A comprehensive drug inventory and supply chain tracking system
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
            <Button
              component={Link}
              to="/register"
              variant="contained"
              color="secondary"
              size="large"
              sx={{ mx: 1 }}
            >
              Get Started
            </Button>
            <Button
              component={Link}
              to="/login"
              variant="outlined"
              color="inherit"
              size="large"
              sx={{ mx: 1 }}
            >
              Login
            </Button>
          </Box>
        </Container>
      </Box>

      {/* Features Section */}
      <Container sx={{ py: 8 }} maxWidth="lg">
        <Typography variant="h4" align="center" gutterBottom>
          Key Features
        </Typography>
        <Typography variant="body1" align="center" paragraph sx={{ mb: 6 }}>
          Our platform connects all stakeholders in the pharmaceutical supply chain
        </Typography>

        <Grid container spacing={4}>
          {/* Consumer Feature */}
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <Box sx={{ bgcolor: 'secondary.light', p: 2, display: 'flex', justifyContent: 'center' }}>
                <PersonIcon fontSize="large" />
              </Box>
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography gutterBottom variant="h5" component="h2">
                  Consumers
                </Typography>
                <Typography>
                  Browse medicines, upload prescriptions, and track your orders in real-time.
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          {/* Retailer Feature */}
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <Box sx={{ bgcolor: 'secondary.light', p: 2, display: 'flex', justifyContent: 'center' }}>
                <LocalPharmacyIcon fontSize="large" />
              </Box>
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography gutterBottom variant="h5" component="h2">
                  Retailers
                </Typography>
                <Typography>
                  Manage inventory, process orders, and request medicines from manufacturers.
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          {/* Manufacturer Feature */}
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <Box sx={{ bgcolor: 'secondary.light', p: 2, display: 'flex', justifyContent: 'center' }}>
                <FactoryIcon fontSize="large" />
              </Box>
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography gutterBottom variant="h5" component="h2">
                  Manufacturers
                </Typography>
                <Typography>
                  Manage production, fulfill retailer requests, and order raw materials.
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          {/* Supplier Feature */}
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <Box sx={{ bgcolor: 'secondary.light', p: 2, display: 'flex', justifyContent: 'center' }}>
                <LocalShippingIcon fontSize="large" />
              </Box>
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography gutterBottom variant="h5" component="h2">
                  Suppliers
                </Typography>
                <Typography>
                  Supply raw materials to manufacturers and track delivery status.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>

      {/* ML Integration Section */}
      <Box sx={{ bgcolor: 'grey.100', py: 8 }}>
        <Container maxWidth="lg">
          <Typography variant="h4" align="center" gutterBottom>
            ML Integration
          </Typography>
          <Typography variant="body1" align="center" paragraph>
            Our platform leverages machine learning to provide valuable insights and predictions
          </Typography>
          <Grid container spacing={4} sx={{ mt: 2 }}>
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h5" gutterBottom>
                    Predictive Analytics
                  </Typography>
                  <Typography variant="body1" paragraph>
                    Annual sales forecasting, demand prediction, and inventory optimization recommendations.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h5" gutterBottom>
                    Supply Chain Optimization
                  </Typography>
                  <Typography variant="body1" paragraph>
                    Seasonal trend analysis, supply-demand matching, and efficient resource allocation.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </Box>
  );
};

export default Home; 