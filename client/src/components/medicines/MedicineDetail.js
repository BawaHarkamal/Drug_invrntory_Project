import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { 
  Box, 
  Typography, 
  CircularProgress, 
  Grid, 
  Card, 
  CardContent, 
  Chip,
  Divider, 
  Button,
  Container,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow
} from '@mui/material';
import VerifiedIcon from '@mui/icons-material/Verified';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import LockIcon from '@mui/icons-material/Lock';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { getMedicine } from '../../actions/medicine';
import { getMedicineImage } from '../../utils/medicineImageMap';

const MedicineDetail = ({ getMedicine, medicine: { medicine, loading } }) => {
  const { id } = useParams();
  
  useEffect(() => {
    getMedicine(id);
  }, [getMedicine, id]);

  if (loading || !medicine) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }
  
  // Format expiry date
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  
  // Calculate months left until expiry
  const calculateMonthsUntilExpiry = (expiryDate) => {
    const today = new Date();
    const expiry = new Date(expiryDate);
    const monthsDiff = (expiry.getFullYear() - today.getFullYear()) * 12 + 
                       (expiry.getMonth() - today.getMonth());
    return monthsDiff;
  };
  
  const monthsUntilExpiry = calculateMonthsUntilExpiry(medicine.expiryDate);
  const stockStatus = medicine.stockQuantity > medicine.lowStockThreshold ? 'In Stock' : 'Low Stock';
  const stockColor = medicine.stockQuantity > medicine.lowStockThreshold ? 'success' : 'warning';

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Button 
          component={Link} 
          to="/dashboard/medicines" 
          startIcon={<ArrowBackIcon />}
          sx={{ mb: 2 }}
        >
          Back to Medicines
        </Button>
        
        <Grid container spacing={4}>
          {/* Left Column - Medicine Image */}
          <Grid item xs={12} md={5}>
            <Card elevation={3}>
              <Box sx={{ p: 2, height: '100%', display: 'flex', flexDirection: 'column' }}>
                <Box 
                  component="img" 
                  src={`/medicine-image/${getMedicineImage(medicine.name)}`}
                  alt={medicine.name}
                  onError={(e) => {
                    console.error(`Image failed to load: ${e.target.src}`);
                    e.target.onerror = null; // Prevent infinite loop
                    e.target.src = '/medicine-image/no-image.jpg';
                  }}
                  sx={{ 
                    maxWidth: '100%', 
                    height: 'auto',
                    objectFit: 'contain',
                    mb: 2,
                    borderRadius: 1
                  }}
                />
                <Box sx={{ mt: 'auto', display: 'flex', justifyContent: 'center', gap: 2 }}>
                  <Button 
                    variant="contained" 
                    color="primary" 
                    fullWidth
                    startIcon={<ShoppingCartIcon />}
                    disabled={medicine.prescription}
                  >
                    Add to Cart
                  </Button>
                  {medicine.prescription && (
                    <Button 
                      variant="outlined" 
                      color="secondary"
                      startIcon={<LockIcon />}
                      fullWidth
                    >
                      Requires Prescription
                    </Button>
                  )}
                </Box>
              </Box>
            </Card>
          </Grid>
          
          {/* Right Column - Medicine Details */}
          <Grid item xs={12} md={7}>
            <Card elevation={3}>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                  <Typography variant="h4" component="h1">
                    {medicine.name}
                  </Typography>
                  <Chip 
                    label={`$${medicine.price.toFixed(2)}`} 
                    color="primary" 
                    size="large" 
                  />
                </Box>
                
                <Box sx={{ display: 'flex', mb: 2, gap: 1, flexWrap: 'wrap' }}>
                  <Chip 
                    label={medicine.category} 
                    color="default" 
                  />
                  <Chip 
                    label={stockStatus} 
                    color={stockColor} 
                  />
                  <Chip 
                    icon={medicine.prescription ? <LockIcon /> : <VerifiedIcon />}
                    label={medicine.prescription ? 'Prescription Required' : 'Over-the-Counter'} 
                    color={medicine.prescription ? "secondary" : "success"} 
                  />
                </Box>
                
                <Typography variant="body1" paragraph>
                  {medicine.description}
                </Typography>
                
                <Divider sx={{ my: 2 }} />
                
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle1" fontWeight="bold">
                      Batch Number
                    </Typography>
                    <Typography variant="body1" sx={{ mb: 1.5 }}>
                      {medicine.batchNumber}
                    </Typography>
                    
                    <Typography variant="subtitle1" fontWeight="bold">
                      Expiry Date
                    </Typography>
                    <Typography variant="body1" sx={{ mb: 1.5 }}>
                      {formatDate(medicine.expiryDate)} 
                      ({monthsUntilExpiry > 0 
                        ? `${monthsUntilExpiry} months remaining` 
                        : 'Expired'})
                    </Typography>
                  </Grid>
                  
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle1" fontWeight="bold">
                      Stock Quantity
                    </Typography>
                    <Typography variant="body1" sx={{ mb: 1.5 }}>
                      {medicine.stockQuantity} units
                    </Typography>
                    
                    <Typography variant="subtitle1" fontWeight="bold">
                      Manufacturer
                    </Typography>
                    <Typography variant="body1" sx={{ mb: 1.5 }}>
                      {medicine.manufacturer ? medicine.manufacturer.name : 'Unknown'}
                    </Typography>
                  </Grid>
                </Grid>
                
                <Divider sx={{ my: 2 }} />
                
                <Typography variant="h6" gutterBottom>
                  Composition
                </Typography>
                <TableContainer component={Paper} elevation={0} sx={{ mb: 2 }}>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>Salt</TableCell>
                        <TableCell>Quantity</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {medicine.composition.map((item, index) => (
                        <TableRow key={index}>
                          <TableCell>{item.salt}</TableCell>
                          <TableCell>{item.quantity}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

MedicineDetail.propTypes = {
  getMedicine: PropTypes.func.isRequired,
  medicine: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  medicine: state.medicine
});

export default connect(mapStateToProps, { getMedicine })(MedicineDetail); 