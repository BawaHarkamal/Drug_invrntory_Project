import axios from 'axios';
import store from '../store';
import { LOGOUT } from '../actions/types';
import { setAlert } from '../actions/alert';

console.log('Initializing API utilities...');

// Create an instance of axios
const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 10000
});

/*
  Intercept requests and add authorization token
*/
api.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    console.log(`API Request: ${config.method.toUpperCase()} ${config.baseURL}${config.url}`);
    return config;
  },
  error => {
    console.error('API Request Error:', error);
    return Promise.reject(error);
  }
);

/*
  Intercept responses and handle token expiration
*/
api.interceptors.response.use(
  res => {
    // Validate the response format
    if (!res.data) {
      console.error('API response missing data property:', res);
      store.dispatch(setAlert('Invalid server response', 'error'));
    }
    return res;
  },
  err => {
    // Handle network errors
    if (!err.response) {
      console.error('Network error:', err);
      store.dispatch(setAlert('Network error - Please check your connection', 'error'));
      return Promise.reject(err);
    }
    
    // Handle authentication errors
    if (err.response.status === 401) {
      console.log('Authentication error - logging out');
      store.dispatch({ type: LOGOUT });
    }
    
    // Handle server errors
    if (err.response.status >= 500) {
      console.error('Server error:', err.response);
      store.dispatch(setAlert('Server error - Please try again later', 'error'));
    }
    
    return Promise.reject(err);
  }
);

// Create a direct API call utility that doesn't rely on the proxy
// Use current hostname to make it work in both development and production
const API_BASE_URL = `${window.location.protocol}//${window.location.hostname}:5001/api`;
console.log(`Direct API Base URL: ${API_BASE_URL}`);

// Create a configured axios instance for direct API calls
const directApi = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 15000
});

// Add auth token to direct API requests
directApi.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    console.log(`Direct API Request: ${config.method.toUpperCase()} ${config.baseURL}${config.url}`);
    return config;
  },
  error => Promise.reject(error)
);

// Same response interceptor for direct API
directApi.interceptors.response.use(
  res => {
    if (!res.data) {
      console.error('Direct API response missing data property:', res);
      store.dispatch(setAlert('Invalid server response', 'error'));
    }
    return res;
  },
  err => {
    if (err.response && err.response.status === 401) {
      store.dispatch({ type: LOGOUT });
    }
    return Promise.reject(err);
  }
);

export const fetchMedicines = async () => {
  try {
    console.log('Fetching medicines directly from:', `${API_BASE_URL}/medicines`);
    const response = await directApi.get('/medicines');
    console.log('Direct API response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Direct API error:', error);
    throw error;
  }
};

export const fetchMedicine = async (id) => {
  try {
    const response = await directApi.get(`/medicines/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Direct API error fetching medicine ${id}:`, error);
    throw error;
  }
};

export { directApi };
export default api; 