/**
 * Utility to set or remove the authentication token in axios defaults.
 * This ensures all axios requests will include the token when available.
 */
import axios from 'axios';

const setAuthToken = token => {
  if (token) {
    console.log('Setting auth token in axios defaults');
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    localStorage.setItem('token', token);
  } else {
    console.log('Removing auth token from axios defaults');
    delete axios.defaults.headers.common['Authorization'];
    localStorage.removeItem('token');
  }
};

export default setAuthToken; 