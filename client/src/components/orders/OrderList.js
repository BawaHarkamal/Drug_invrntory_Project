import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Chip,
  Button,
  CircularProgress,
  Alert,
  Container
} from '@mui/material';
import axios from 'axios';

const OrderList = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await axios.get('/api/orders');
      setOrders(response.data.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to fetch orders');
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

  if (error) {
    return (
      <Alert severity="error" sx={{ mt: 2 }}>
        {error}
      </Alert>
    );
  }

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
          <Typography variant="h4">My Orders</Typography>
          <Button
            component={Link}
            to="/orders/new"
            variant="contained"
            color="primary"
          >
            Place New Order
          </Button>
        </Box>

        <Grid container spacing={3}>
          {orders.map((order) => (
            <Grid item xs={12} key={order._id}>
              <Card>
                <CardContent>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="h6" gutterBottom>
                        Order #{order._id.substr(-6)}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Placed on: {new Date(order.createdAt).toLocaleDateString()}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={6} sx={{ textAlign: 'right' }}>
                      <Chip
                        label={order.orderStatus.toUpperCase()}
                        color={
                          order.orderStatus === 'delivered'
                            ? 'success'
                            : order.orderStatus === 'cancelled'
                            ? 'error'
                            : 'primary'
                        }
                        sx={{ mb: 1 }}
                      />
                      <Typography variant="h6">
                        Total: ${order.totalAmount.toFixed(2)}
                      </Typography>
                    </Grid>
                    <Grid item xs={12}>
                      <Typography variant="subtitle2" gutterBottom>
                        Items:
                      </Typography>
                      {order.items.map((item) => (
                        <Typography key={item._id} variant="body2">
                          {item.medicine.name} × {item.quantity}
                        </Typography>
                      ))}
                    </Grid>
                    <Grid item xs={12} sx={{ textAlign: 'right' }}>
                      <Button
                        component={Link}
                        to={`/orders/${order._id}`}
                        variant="outlined"
                        color="primary"
                      >
                        View Details
                      </Button>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {orders.length === 0 && (
          <Box sx={{ textAlign: 'center', mt: 4 }}>
            <Typography variant="h6" color="text.secondary">
              No orders found
            </Typography>
            <Button
              component={Link}
              to="/orders/new"
              variant="contained"
              color="primary"
              sx={{ mt: 2 }}
            >
              Place Your First Order
            </Button>
          </Box>
        )}
      </Box>
    </Container>
  );
};

export default OrderList; 