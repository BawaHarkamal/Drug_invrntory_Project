import React from 'react';
import { useParams } from 'react-router-dom';
import { Box, Typography } from '@mui/material';

const OrderDetail = () => {
  const { id } = useParams();
  
  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Order Details
      </Typography>
      <Typography variant="body1">
        Details for order with ID: {id} will be displayed here. This is a placeholder component.
      </Typography>
    </Box>
  );
};

export default OrderDetail; 