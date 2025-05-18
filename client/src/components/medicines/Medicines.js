import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { 
  Box, 
  Typography, 
  CircularProgress, 
  Grid, 
  Card, 
  CardContent, 
  CardMedia, 
  CardActions,
  Button,
  Chip,
  TextField,
  InputAdornment,
  Container,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  Paper
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import MedicationIcon from '@mui/icons-material/Medication';
import LocalPharmacyIcon from '@mui/icons-material/LocalPharmacy';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import { getMedicines } from '../../actions/medicine';
import { getMedicineImage } from '../../utils/medicineImageMap';

const Medicines = ({ getMedicines, medicine: { medicines, loading, error } }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState('');
  const [filteredMedicines, setFilteredMedicines] = useState([]);
  const [debugMode, setDebugMode] = useState(false);

  useEffect(() => {
    console.log('Medicines component mounted, calling getMedicines()');
    getMedicines();
  }, [getMedicines]);

  useEffect(() => {
    console.log('Medicines data changed:', { medicines, loading, error });
    if (medicines) {
      console.log('Filtering medicines, count:', medicines.length);
      setFilteredMedicines(
        medicines.filter(medicine => 
          medicine.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
          (category === '' || medicine.category === category)
        )
      );
    }
  }, [medicines, searchTerm, category, error]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleCategoryChange = (e) => {
    setCategory(e.target.value);
  };

  const toggleDebugMode = () => {
    setDebugMode(!debugMode);
  };

  const categories = [
    'Antibiotics',
    'Analgesics',
    'Antidiabetic',
    'Cardiovascular',
    'Respiratory',
    'Gastrointestinal',
    'Other'
  ];

  // Show error message if there's an error
  if (error) {
    console.error('Error loading medicines (component):', error);
    return (
      <Box sx={{ mt: 4, p: 2 }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          Error loading medicines: {error.msg || 'Unknown error'}
        </Alert>
        
        <Paper sx={{ p: 3, mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            Troubleshooting Steps
          </Typography>
          <Typography variant="body1" paragraph>
            It seems there was an issue connecting to the medicine database. Here are some steps to resolve it:
          </Typography>
          <ol>
            <li>Make sure the server is running. Try starting it with <code>npm run server</code> in the root directory.</li>
            <li>Check if MongoDB is running and accessible.</li>
            <li>Try the "Test Medicines API" page from the navigation menu to directly test API connectivity.</li>
            <li>Run the seeding script to populate the database: <code>npm run setup-db</code>.</li>
          </ol>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
            If the problem persists, check the browser console (F12) for more details on the error.
          </Typography>
          
          <Button 
            variant="outlined" 
            sx={{ mt: 2 }}
            onClick={toggleDebugMode}
          >
            {debugMode ? 'Hide Debug Info' : 'Show Debug Info'}
          </Button>
          
          {debugMode && (
            <Box sx={{ mt: 2, p: 2, bgcolor: '#f5f5f5', borderRadius: 1 }}>
              <Typography variant="subtitle2">Error Details:</Typography>
              <pre style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
                {JSON.stringify(error, null, 2)}
              </pre>
              
              <Typography variant="subtitle2" sx={{ mt: 2 }}>Debug Information:</Typography>
              <Typography variant="body2">API URL: {process.env.REACT_APP_API_URL || 'Using proxy configuration'}</Typography>
              <Typography variant="body2">Client Port: {window.location.port}</Typography>
              <Typography variant="body2">Server URL: {window.location.protocol}//{window.location.hostname}:5001</Typography>
              
              <Button 
                variant="contained" 
                color="primary" 
                sx={{ mt: 2 }}
                onClick={() => window.open('http://localhost:5001/api/medicines', '_blank')}
              >
                Test API Directly
              </Button>
            </Box>
          )}
        </Paper>
        
        <Button 
          variant="contained" 
          color="primary" 
          onClick={() => getMedicines()}
          sx={{ mt: 2 }}
        >
          Retry Loading Medicines
        </Button>
      </Box>
    );
  }

  if (loading) {
    console.log('Medicines are loading...');
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  // Add a check for empty medicines array
  if (!medicines || medicines.length === 0) {
    console.log('No medicines found in the data');
    return (
      <Container maxWidth="lg">
        <Box sx={{ mt: 4, mb: 4 }}>
          <Typography variant="h4" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
            <MedicationIcon sx={{ mr: 1 }} /> Medicines Catalog
          </Typography>
          <Alert severity="info" sx={{ mb: 3 }}>
            No medicines found in the database. Please run the seed script to add sample medicines.
          </Alert>
          
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Getting Started with Medicines
            </Typography>
            <Typography variant="body1" paragraph>
              To add sample medicines to the database, you can run the seeding script:
            </Typography>
            <Box sx={{ bgcolor: '#f5f5f5', p: 2, borderRadius: 1, mb: 2 }}>
              <code>npm run seed-medicines</code>
            </Box>
            <Typography variant="body1">
              This will populate your database with sample medicines for testing.
            </Typography>
            
            <Button 
              variant="contained" 
              color="primary" 
              onClick={() => getMedicines()}
              sx={{ mt: 2 }}
            >
              Refresh Medicines
            </Button>
          </Paper>
        </Box>
      </Container>
    );
  }

  console.log('Rendering medicines list, count:', filteredMedicines.length);
  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
          <MedicationIcon sx={{ mr: 1 }} /> Medicines Catalog
        </Typography>
        
        {/* Search and Filter */}
        <Box sx={{ display: 'flex', mb: 3, gap: 2, flexWrap: 'wrap' }}>
          <TextField
            label="Search Medicines"
            variant="outlined"
            value={searchTerm}
            onChange={handleSearchChange}
            sx={{ flexGrow: 1, minWidth: '200px' }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
          
          <FormControl sx={{ minWidth: '200px' }}>
            <InputLabel id="category-label">Category</InputLabel>
            <Select
              labelId="category-label"
              value={category}
              label="Category"
              onChange={handleCategoryChange}
            >
              <MenuItem value="">All Categories</MenuItem>
              {categories.map(cat => (
                <MenuItem key={cat} value={cat}>{cat}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
        
        {filteredMedicines.length === 0 ? (
          <Alert severity="info">No medicines found matching your search criteria.</Alert>
        ) : (
          <Grid container spacing={3}>
            {filteredMedicines.map(medicine => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={medicine._id}>
                <Card sx={{ 
                  height: '100%', 
                  display: 'flex', 
                  flexDirection: 'column',
                  transition: 'transform 0.2s',
                  '&:hover': {
                    transform: 'scale(1.02)',
                    boxShadow: 3
                  }
                }}>
                  <CardMedia
                    component="img"
                    height="140"
                    image={`/medicine-image/${getMedicineImage(medicine.name)}`}
                    alt={medicine.name}
                    onError={(e) => {
                      console.error(`Image failed to load: ${e.target.src}`);
                      e.target.onerror = null; // Prevent infinite loop
                      e.target.src = '/medicine-image/no-image.jpg';
                    }}
                    sx={{ 
                      objectFit: 'contain', 
                      p: 1,
                      bgcolor: '#f5f5f5',
                      minHeight: '140px'
                    }}
                  />
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                      <Typography variant="h6" component="div" sx={{ mb: 0.5 }}>
                        {medicine.name}
                      </Typography>
                      <Chip 
                        label={`$${medicine.price.toFixed(2)}`} 
                        color="primary" 
                        size="small" 
                      />
                    </Box>
                    
                    <Chip 
                      label={medicine.category} 
                      size="small" 
                      sx={{ mb: 1.5 }} 
                    />
                    
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1, 
                      display: '-webkit-box',
                      WebkitLineClamp: 3,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis'
                    }}>
                      {medicine.description}
                    </Typography>
                    
                    <Box sx={{ 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      alignItems: 'center',
                      mt: 1
                    }}>
                      <Chip 
                        icon={<LocalPharmacyIcon />} 
                        label={medicine.prescription ? 'Prescription' : 'OTC'} 
                        size="small" 
                        color={medicine.prescription ? "secondary" : "success"} 
                      />
                      <Typography variant="body2">
                        Stock: {medicine.stockQuantity}
                      </Typography>
                    </Box>
                  </CardContent>
                  <CardActions>
                    <Button 
                      size="small" 
                      component={Link} 
                      to={`/dashboard/medicines/${medicine._id}`}
                    >
                      View Details
                    </Button>
                    <Button 
                      size="small" 
                      startIcon={<AddShoppingCartIcon />}
                      color="primary"
                      sx={{ ml: 'auto' }}
                    >
                      Add to Cart
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Box>
    </Container>
  );
};

Medicines.propTypes = {
  getMedicines: PropTypes.func.isRequired,
  medicine: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  medicine: state.medicine
});

export default connect(mapStateToProps, { getMedicines })(Medicines); 