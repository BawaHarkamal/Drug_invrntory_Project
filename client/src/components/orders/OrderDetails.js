import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
  Box,
  Card,
  CardContent,
  Grid,
  Typography,
  Button,
  Chip,
  CircularProgress,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField
} from '@mui/material';
import axios from 'axios';

const OrderDetails = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [paymentDialog, setPaymentDialog] = useState(false);
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [cardDetails, setCardDetails] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: ''
  });

  useEffect(() => {
    fetchOrder();
  }, [id]);

  const fetchOrder = async () => {
    try {
      const response = await axios.get(`/api/orders/${id}`);
      setOrder(response.data.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to fetch order details');
    }
    setLoading(false);
  };

  const handlePayment = async () => {
    setPaymentLoading(true);
    try {
      // In a real application, you would integrate with a payment gateway here
      // For this demo, we'll simulate a successful payment
      const response = await axios.put(`/api/orders/${id}/payment`, {
        paymentStatus: 'completed'
      });
      
      setOrder(response.data.data);
      setPaymentDialog(false);
    } catch (err) {
      setError(err.response?.data?.error || 'Payment failed');
    }
    setPaymentLoading(false);
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mt: 2 }}>
        {error}
      </Alert>
    );
  }

  if (!order) {
    return (
      <Alert severity="info" sx={{ mt: 2 }}>
        Order not found
      </Alert>
    );
  }

  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Order Details
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Order Status
              </Typography>
              <Box sx={{ mb: 2 }}>
                <Chip
                  label={order.orderStatus.toUpperCase()}
                  color={
                    order.orderStatus === 'delivered'
                      ? 'success'
                      : order.orderStatus === 'cancelled'
                      ? 'error'
                      : 'primary'
                  }
                />
              </Box>
              <Typography variant="h6" gutterBottom>
                Payment Status
              </Typography>
              <Box sx={{ mb: 2 }}>
                <Chip
                  label={order.paymentStatus.toUpperCase()}
                  color={
                    order.paymentStatus === 'completed'
                      ? 'success'
                      : order.paymentStatus === 'failed'
                      ? 'error'
                      : 'warning'
                  }
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Order Items
              </Typography>
              {order.items.map((item) => (
                <Box key={item._id} sx={{ mb: 2 }}>
                  <Typography variant="subtitle1">
                    {item.medicine.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Quantity: {item.quantity} × ${item.price}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Subtotal: ${(item.quantity * item.price).toFixed(2)}
                  </Typography>
                </Box>
              ))}
              <Typography variant="h6" sx={{ mt: 2 }}>
                Total Amount: ${order.totalAmount.toFixed(2)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Shipping Address
              </Typography>
              <Typography>
                {order.shippingAddress.street}
              </Typography>
              <Typography>
                {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {order.paymentStatus === 'pending' && (
          <Grid item xs={12}>
            <Button
              variant="contained"
              color="primary"
              fullWidth
              onClick={() => setPaymentDialog(true)}
            >
              Complete Payment
            </Button>
          </Grid>
        )}
      </Grid>

      <Dialog open={paymentDialog} onClose={() => setPaymentDialog(false)}>
        <DialogTitle>Payment Details</DialogTitle>
        <DialogContent>
          <TextField
            label="Card Number"
            fullWidth
            margin="normal"
            value={cardDetails.cardNumber}
            onChange={(e) =>
              setCardDetails({ ...cardDetails, cardNumber: e.target.value })
            }
          />
          <TextField
            label="Expiry Date (MM/YY)"
            fullWidth
            margin="normal"
            value={cardDetails.expiryDate}
            onChange={(e) =>
              setCardDetails({ ...cardDetails, expiryDate: e.target.value })
            }
          />
          <TextField
            label="CVV"
            fullWidth
            margin="normal"
            value={cardDetails.cvv}
            onChange={(e) =>
              setCardDetails({ ...cardDetails, cvv: e.target.value })
            }
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPaymentDialog(false)}>Cancel</Button>
          <Button
            onClick={handlePayment}
            variant="contained"
            color="primary"
            disabled={paymentLoading}
          >
            {paymentLoading ? 'Processing...' : 'Pay Now'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default OrderDetails; 