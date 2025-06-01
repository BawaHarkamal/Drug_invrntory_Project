import api from '../utils/api';
import { setAlert } from './alert';
import {
  CREATE_ORDER,
  GET_ORDERS,
  GET_ORDER,
  ORDER_ERROR,
  UPDATE_ORDER_STATUS,
  UPDATE_PAYMENT_STATUS
} from './types';

// Create Order
export const createOrder = (orderData) => async dispatch => {
  try {
    const res = await api.post('/orders', orderData);

    dispatch({
      type: CREATE_ORDER,
      payload: res.data
    });

    dispatch(setAlert('Order created successfully', 'success'));
  } catch (err) {
    console.error('Order creation error:', err);
    
    if (err.response && err.response.data && err.response.data.error) {
      const errors = err.response.data.error;

      if (Array.isArray(errors)) {
        errors.forEach(error => dispatch(setAlert(error, 'error')));
      } else {
        dispatch(setAlert(errors, 'error'));
      }
    } else {
      dispatch(setAlert('Failed to create order', 'error'));
    }

    dispatch({
      type: ORDER_ERROR
    });
  }
};

// Get All Orders
export const getOrders = () => async dispatch => {
  try {
    const res = await api.get('/orders');

    dispatch({
      type: GET_ORDERS,
      payload: res.data.data
    });
  } catch (err) {
    console.error('Error fetching orders:', err);
    dispatch({
      type: ORDER_ERROR
    });
  }
};

// Get Single Order
export const getOrder = (id) => async dispatch => {
  try {
    const res = await api.get(`/orders/${id}`);

    dispatch({
      type: GET_ORDER,
      payload: res.data.data
    });
  } catch (err) {
    console.error('Error fetching order:', err);
    dispatch({
      type: ORDER_ERROR
    });
  }
};

// Update Order Status
export const updateOrderStatus = (id, status) => async dispatch => {
  try {
    const res = await api.put(`/orders/${id}/status`, { status });

    dispatch({
      type: UPDATE_ORDER_STATUS,
      payload: res.data.data
    });

    dispatch(setAlert('Order status updated successfully', 'success'));
  } catch (err) {
    console.error('Error updating order status:', err);
    dispatch({
      type: ORDER_ERROR
    });
  }
};

// Update Payment Status
export const updatePaymentStatus = (id, paymentStatus, paymentDetails) => async dispatch => {
  try {
    const res = await api.put(`/orders/${id}/payment`, {
      paymentStatus,
      paymentDetails
    });

    dispatch({
      type: UPDATE_PAYMENT_STATUS,
      payload: res.data.data
    });

    dispatch(setAlert('Payment status updated successfully', 'success'));
  } catch (err) {
    console.error('Error updating payment status:', err);
    dispatch({
      type: ORDER_ERROR
    });
  }
}; 