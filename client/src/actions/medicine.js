import axios from 'axios';
import api, { directApi } from '../utils/api';
import {
  GET_MEDICINES,
  GET_MEDICINE,
  MEDICINE_ERROR
} from './types';

// Get all medicines
export const getMedicines = () => async dispatch => {
  try {
    console.log('Fetching medicines from API using URL: /api/medicines');
    
    // Try first with proxy approach
    try {
      // Add request debugging with explicit options
      const requestConfig = {
        headers: { 'Content-Type': 'application/json' },
        timeout: 10000 // 10 second timeout
      };
      
      console.log('Request config:', requestConfig);
      
      const res = await api.get('/medicines', requestConfig);
      
      console.log('Medicine API full response:', res);
      console.log('Medicine API response data:', res.data);

      if (!res.data || !res.data.success) {
        throw new Error(res.data?.message || 'API returned success: false or empty response');
      }

      dispatch({
        type: GET_MEDICINES,
        payload: res.data.data || []
      });
      
      return;
    } catch (proxyError) {
      console.error('Proxy approach failed, trying direct API:', proxyError);
      
      // If proxy approach fails, try direct API approach
      try {
        console.log('Using direct API via directApi utility');
        
        const directResponse = await directApi.get('/medicines');
        
        console.log('Direct API approach succeeded:', directResponse.data);
        
        if (!directResponse.data || !directResponse.data.success) {
          throw new Error('Direct API returned success: false or empty response');
        }
        
        dispatch({
          type: GET_MEDICINES,
          payload: directResponse.data.data || []
        });
        
        return;
      } catch (directError) {
        console.error('Both proxy and direct API approaches failed:', directError);
        throw directError;
      }
    }
  } catch (err) {
    console.error('Error fetching medicines:', err);
    
    dispatch({
      type: MEDICINE_ERROR,
      payload: { 
        msg: err.response?.data?.error || err.message || 'Server Error', 
        status: err.response?.status || 500 
      }
    });
  }
};

// Get medicine by ID
export const getMedicine = id => async dispatch => {
  try {
    console.log(`Fetching medicine with ID: ${id}`);
    
    // Try with proxy first
    try {
      const res = await api.get(`/medicines/${id}`);
      console.log('Medicine detail API response:', res.data);

      if (!res.data.success) {
        throw new Error('API returned success: false');
      }

      dispatch({
        type: GET_MEDICINE,
        payload: res.data.data
      });
      
      return;
    } catch (proxyError) {
      console.error('Proxy approach failed, trying direct API:', proxyError);
      
      // If proxy fails, try direct approach using directApi utility
      console.log('Using directApi utility to fetch medicine');
      const directResponse = await directApi.get(`/medicines/${id}`);
      
      console.log('Direct medicine detail API response:', directResponse.data);
      
      if (!directResponse.data || !directResponse.data.success) {
        throw new Error('Direct API returned success: false');
      }
      
      dispatch({
        type: GET_MEDICINE,
        payload: directResponse.data.data
      });
      
      return;
    }
  } catch (err) {
    console.error(`Error fetching medicine with ID ${id}:`, err);
    
    dispatch({
      type: MEDICINE_ERROR,
      payload: { 
        msg: err.response?.data?.error || err.message || 'Server Error', 
        status: err.response?.status || 500 
      }
    });
  }
};

// Search medicines
export const searchMedicines = (query) => async dispatch => {
  try {
    console.log(`Searching medicines with query: ${query}`);
    
    // Try proxy approach first
    try {
      const res = await api.get(`/medicines/search?q=${query}`);
      console.log('Medicine search API response:', res.data);

      if (!res.data.success) {
        throw new Error('API returned success: false');
      }

      dispatch({
        type: GET_MEDICINES,
        payload: res.data.data || []
      });
      
      return;
    } catch (proxyError) {
      console.error('Proxy approach failed, trying direct API:', proxyError);
      
      // If proxy fails, try direct approach
      console.log('Using directApi utility for search');
      
      const directResponse = await directApi.get(`/medicines/search?q=${query}`);
      
      console.log('Direct medicine search API response:', directResponse.data);
      
      if (!directResponse.data || !directResponse.data.success) {
        throw new Error('Direct API returned success: false');
      }
      
      dispatch({
        type: GET_MEDICINES,
        payload: directResponse.data.data || []
      });
      
      return;
    }
  } catch (err) {
    console.error('Error searching medicines:', err);
    
    dispatch({
      type: MEDICINE_ERROR,
      payload: { 
        msg: err.response?.data?.error || err.message || 'Server Error', 
        status: err.response?.status || 500 
      }
    });
  }
}; 