import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  TextField,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  CircularProgress
} from '@mui/material';
import axios from 'axios';

const OrderForm = () => {
  const navigate = useNavigate();
  const [medicines, setMedicines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [formData, setFormData] = useState({
    items: [],
    shippingAddress: {
      street: '',
      city: '',
      state: '',
      zipCode: ''
    },
    paymentMethod: 'credit_card'
  });

  useEffect(() => {
    fetchMedicines();
  }, []);

  const fetchMedicines = async () => {
    try {
      const token = localStorage.getItem('token');
      
      const response = await axios.get('/api/medicines', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.data.success) {
        const medicineData = response.data.data;
        setMedicines(medicineData);
        setFormData(prev => ({
          ...prev,
          items: medicineData.map(med => ({ 
            medicine: med._id, 
            quantity: 1, 
            name: med.name, 
            price: med.price 
          }))
        }));
      } else {
        setError('Failed to fetch medicines data');
      }
    } catch (err) {
      console.error('Error fetching medicines:', err);
      setError(err.response?.data?.error || 'Failed to fetch medicines. Please ensure you are logged in.');
    }
    setLoading(false);
  };

  const handleQuantityChange = (index, value) => {
    const newItems = [...formData.items];
    newItems[index].quantity = parseInt(value) || 0;
    setFormData({ ...formData, items: newItems });
  };

  const handleAddressChange = (field, value) => {
    setFormData({
      ...formData,
      shippingAddress: {
        ...formData.shippingAddress,
        [field]: value
      }
    });
  };

  const handlePaymentMethodChange = (event) => {
    setFormData({
      ...formData,
      paymentMethod: event.target.value
    });
  };

  const calculateTotal = () => {
    return formData.items.reduce((total, item) => {
      return total + (item.price * item.quantity);
    }, 0);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Filter out items with quantity 0
      const orderItems = formData.items.filter(item => item.quantity > 0);
      
      if (orderItems.length === 0) {
        setError('Please add at least one item to your order');
        setLoading(false);
        return;
      }

      const response = await axios.post('/api/orders', {
        items: orderItems.map(item => ({
          medicine: item.medicine,
          quantity: item.quantity
        })),
        shippingAddress: formData.shippingAddress,
        paymentMethod: formData.paymentMethod
      });

      if (response.data.success) {
        navigate(`/orders/${response.data.data._id}`);
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Something went wrong');
    }
    setLoading(false);
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3, px: 3 }}>
      <Typography variant="h4" gutterBottom>
        Place New Order
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Typography variant="h6" gutterBottom>
            Order Items
          </Typography>
          {formData.items.map((item, index) => (
            <Card key={item.medicine} sx={{ mb: 2 }}>
              <CardContent>
                <Grid container spacing={2} alignItems="center">
                  <Grid item xs={6}>
                    <Typography>{item.name}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      Price: ${item.price}
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      label="Quantity"
                      type="number"
                      value={item.quantity}
                      onChange={(e) => handleQuantityChange(index, e.target.value)}
                      InputProps={{ inputProps: { min: 0 } }}
                      fullWidth
                    />
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          ))}
        </Grid>

        <Grid item xs={12}>
          <Typography variant="h6" gutterBottom>
            Shipping Address
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                required
                label="Street Address"
                fullWidth
                value={formData.shippingAddress.street}
                onChange={(e) => handleAddressChange('street', e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                label="City"
                fullWidth
                value={formData.shippingAddress.city}
                onChange={(e) => handleAddressChange('city', e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                label="State"
                fullWidth
                value={formData.shippingAddress.state}
                onChange={(e) => handleAddressChange('state', e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                label="ZIP Code"
                fullWidth
                value={formData.shippingAddress.zipCode}
                onChange={(e) => handleAddressChange('zipCode', e.target.value)}
              />
            </Grid>
          </Grid>
        </Grid>

        <Grid item xs={12}>
          <Typography variant="h6" gutterBottom>
            Payment Method
          </Typography>
          <FormControl fullWidth>
            <InputLabel>Payment Method</InputLabel>
            <Select
              value={formData.paymentMethod}
              onChange={handlePaymentMethodChange}
              label="Payment Method"
            >
              <MenuItem value="credit_card">Credit Card</MenuItem>
              <MenuItem value="debit_card">Debit Card</MenuItem>
              <MenuItem value="cash_on_delivery">Cash on Delivery</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12}>
          <Typography variant="h6" gutterBottom>
            Order Summary
          </Typography>
          <Typography variant="body1">
            Total Amount: ${calculateTotal().toFixed(2)}
          </Typography>
        </Grid>

        <Grid item xs={12}>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            disabled={loading}
          >
            {loading ? 'Processing...' : 'Place Order'}
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
};

export default OrderForm; 