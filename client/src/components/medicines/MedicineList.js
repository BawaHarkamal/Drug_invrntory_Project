import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Container,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Alert
} from '@mui/material';
import { getMedicines } from '../../actions/medicine';
import { createOrder } from '../../actions/order';

const MedicineList = () => {
  const dispatch = useDispatch();
  const { medicines, loading } = useSelector(state => state.medicine);
  const [selectedMedicine, setSelectedMedicine] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [openDialog, setOpenDialog] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('');
  const [error, setError] = useState(null);

  useEffect(() => {
    dispatch(getMedicines());
  }, [dispatch]);

  const handleOrder = (medicine) => {
    setSelectedMedicine(medicine);
    setOpenDialog(true);
  };

  const handleQuantityChange = (e) => {
    const value = parseInt(e.target.value);
    if (value > 0 && value <= selectedMedicine.stockQuantity) {
      setQuantity(value);
    }
  };

  const handlePaymentMethodChange = (e) => {
    setPaymentMethod(e.target.value);
  };

  const handleSubmitOrder = async () => {
    if (!paymentMethod) {
      setError('Please select a payment method');
      return;
    }

    try {
      const orderData = {
        items: [{
          medicine: selectedMedicine._id,
          quantity: quantity,
          price: selectedMedicine.price
        }],
        paymentMethod,
        shippingAddress: {
          // Use user's address from Redux store
          ...useSelector(state => state.auth.user.address)
        }
      };

      await dispatch(createOrder(orderData));
      setOpenDialog(false);
      setQuantity(1);
      setPaymentMethod('');
      setError(null);
    } catch (err) {
      setError(err.message || 'Failed to create order');
    }
  };

  if (loading) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <Container>
      <Grid container spacing={3}>
        {medicines.map(medicine => (
          <Grid item xs={12} sm={6} md={4} key={medicine._id}>
            <Card>
              <CardMedia
                component="img"
                height="200"
                image={medicine.image}
                alt={medicine.name}
              />
              <CardContent>
                <Typography gutterBottom variant="h5" component="div">
                  {medicine.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {medicine.description}
                </Typography>
                <Typography variant="h6" color="primary">
                  ${medicine.price}
                </Typography>
                <Typography variant="body2">
                  Stock: {medicine.stockQuantity}
                </Typography>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => handleOrder(medicine)}
                  disabled={medicine.stockQuantity === 0}
                  sx={{ mt: 2 }}
                >
                  Order Now
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Place Order</DialogTitle>
        <DialogContent>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          {selectedMedicine && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="h6">{selectedMedicine.name}</Typography>
              <Typography variant="body2" color="text.secondary">
                Price: ${selectedMedicine.price}
              </Typography>
              <TextField
                label="Quantity"
                type="number"
                value={quantity}
                onChange={handleQuantityChange}
                inputProps={{ min: 1, max: selectedMedicine.stockQuantity }}
                fullWidth
                sx={{ mt: 2 }}
              />
              <FormControl fullWidth sx={{ mt: 2 }}>
                <InputLabel>Payment Method</InputLabel>
                <Select
                  value={paymentMethod}
                  onChange={handlePaymentMethodChange}
                  label="Payment Method"
                >
                  <MenuItem value="credit_card">Credit Card</MenuItem>
                  <MenuItem value="debit_card">Debit Card</MenuItem>
                  <MenuItem value="upi">UPI</MenuItem>
                  <MenuItem value="net_banking">Net Banking</MenuItem>
                </Select>
              </FormControl>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button onClick={handleSubmitOrder} variant="contained" color="primary">
            Place Order
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default MedicineList; 