import api, { directApi } from '../utils/api';
import axios from 'axios';
import { setAlert } from './alert';
import {
  REGISTER_SUCCESS,
  REGISTER_FAIL,
  USER_LOADED,
  AUTH_ERROR,
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  LOGOUT
} from './types';

// Load User
export const loadUser = () => async dispatch => {
  try {
    // First try using the API with proxy
    try {
      const res = await api.get('/auth/me');

      if (!res.data || !res.data.data) {
        throw new Error('Invalid response format from server');
      }

      dispatch({
        type: USER_LOADED,
        payload: res.data.data
      });
      return;
    } catch (proxyError) {
      console.error('Error loading user with proxy, trying direct API:', proxyError);
      
      // If proxy fails, try direct API
      const directRes = await directApi.get('/auth/me');
      
      if (!directRes.data || !directRes.data.data) {
        throw new Error('Invalid response format from direct server');
      }
      
      dispatch({
        type: USER_LOADED,
        payload: directRes.data.data
      });
    }
  } catch (err) {
    console.error('Error loading user:', err);
    dispatch({
      type: AUTH_ERROR
    });
  }
};

// Register User
export const register = (name, email, password, role) => async dispatch => {
  try {
    const res = await api.post('/auth/register', { name, email, password, role });

    dispatch({
      type: REGISTER_SUCCESS,
      payload: res.data
    });

    dispatch(loadUser());
  } catch (err) {
    console.error('Registration error:', err);
    
    const errors = err.response?.data?.errors;

    if (errors) {
      errors.forEach(error => dispatch(setAlert(error.msg, 'error')));
    }

    dispatch({
      type: REGISTER_FAIL
    });
  }
};

// Login User
export const login = (email, password) => async dispatch => {
  try {
    console.log('Attempting login with:', { email });
    
    // Try the standard API first
    try {
      const res = await api.post('/auth/login', { email, password });
      console.log('Login response:', res);

      if (!res.data) {
        throw new Error('Invalid response format from server');
      }

      dispatch({
        type: LOGIN_SUCCESS,
        payload: res.data
      });

      dispatch(loadUser());
      return;
    } catch (apiError) {
      console.error('Standard API login failed, trying direct:', apiError);
      
      // If standard API fails, try direct connection
      const directRes = await directApi.post('/auth/login', { email, password });
      
      console.log('Direct login response:', directRes);
      
      if (!directRes.data) {
        throw new Error('Invalid response format from direct server');
      }
      
      dispatch({
        type: LOGIN_SUCCESS,
        payload: directRes.data
      });
      
      dispatch(loadUser());
      return;
    }
  } catch (err) {
    console.error('Login error:', err);
    
    if (err.response && err.response.data && err.response.data.error) {
      const errors = err.response.data.error;

      if (Array.isArray(errors)) {
        errors.forEach(error => dispatch(setAlert(error, 'error')));
      } else {
        dispatch(setAlert(errors, 'error'));
      }
    } else {
      dispatch(setAlert(err.message || 'Login failed. Please check your credentials.', 'error'));
    }

    dispatch({
      type: LOGIN_FAIL
    });
  }
};

// Logout
export const logout = () => dispatch => {
  dispatch({ type: LOGOUT });
}; 