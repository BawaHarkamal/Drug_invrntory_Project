import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { 
  Box, 
  Typography, 
  CircularProgress, 
  Paper, 
  Button, 
  Alert,
  List,
  ListItem,
  ListItemText,
  Divider,
  TextField,
  Tab,
  Tabs
} from '@mui/material';
import { fetchMedicines } from '../../utils/api';

const TestMedicines = () => {
  const [medicines, setMedicines] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [apiResponse, setApiResponse] = useState(null);
  const [serverUrl, setServerUrl] = useState('/api/medicines');
  const [activeTab, setActiveTab] = useState(0);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const fetchMedicinesProxy = async () => {
    setLoading(true);
    setError(null);
    setApiResponse(null);
    
    try {
      console.log(`Fetching medicines from: ${serverUrl}`);
      
      // Add some request debugging
      const requestConfig = {
        headers: {
          'Content-Type': 'application/json'
        },
        timeout: 10000 // 10 second timeout
      };
      
      // Directly call the API without using Redux
      const response = await axios.get(serverUrl, requestConfig);
      
      console.log('API Raw Response:', response);
      setApiResponse(JSON.stringify(response.data, null, 2));
      
      // Check if response has the expected format
      if (response.data && response.data.data && Array.isArray(response.data.data)) {
        console.log(`Received ${response.data.data.length} medicines from API`);
        setMedicines(response.data.data || []);
      } else {
        console.error('API response does not contain expected data format:', response.data);
        setError('API response is not in the expected format');
        setMedicines([]);
      }
    } catch (err) {
      console.error('Error fetching medicines:', err);
      setError(err.message || 'Failed to fetch medicines');
      
      // Try to capture more error details
      if (err.response) {
        // Server responded with an error
        setApiResponse(JSON.stringify({
          status: err.response.status,
          statusText: err.response.statusText,
          data: err.response.data
        }, null, 2));
      } else if (err.request) {
        // Request was made but no response received
        setApiResponse(JSON.stringify({
          request: 'Request was sent but no response was received',
          error: err.message
        }, null, 2));
      } else {
        // Error occurred during request setup
        setApiResponse(JSON.stringify({
          setupError: 'Error occurred during request setup',
          error: err.message
        }, null, 2));
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchMedicinesDirect = async () => {
    setLoading(true);
    setError(null);
    setApiResponse(null);
    
    try {
      // Use a direct URL approach without any utility
      const directUrl = 'http://localhost:5002/api/medicines';
      console.log('Fetching medicines directly from:', directUrl);
      
      const response = await axios.get(directUrl, {
        headers: { 'Content-Type': 'application/json' },
        timeout: 10000
      });
      
      setApiResponse(JSON.stringify(response.data, null, 2));
      
      if (response.data && response.data.success && Array.isArray(response.data.data)) {
        console.log(`Received ${response.data.data.length} medicines from API`);
        setMedicines(response.data.data);
      } else {
        console.error('API response does not contain expected data format:', response.data);
        setError('API response is not in the expected format');
        setMedicines([]);
      }
    } catch (err) {
      console.error('Error using direct API:', err);
      setError(err.message || 'Failed to fetch medicines directly');
      
      if (err.response) {
        setApiResponse(JSON.stringify({
          status: err.response.status,
          statusText: err.response.statusText,
          data: err.response.data
        }, null, 2));
      } else {
        setApiResponse(JSON.stringify({
          error: err.message
        }, null, 2));
      }
    } finally {
      setLoading(false);
    }
  };

  const handleUrlChange = (e) => {
    setServerUrl(e.target.value);
  };

  return (
    <Box sx={{ mt: 4, p: 2 }}>
      <Typography variant="h4" gutterBottom>
        API Testing: Medicines
      </Typography>
      
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
        <Tabs value={activeTab} onChange={handleTabChange} aria-label="api test tabs">
          <Tab label="Using Proxy" />
          <Tab label="Direct API" />
        </Tabs>
      </Box>
      
      {activeTab === 0 && (
        <Box sx={{ mb: 2 }}>
          <TextField
            fullWidth
            label="API URL"
            variant="outlined"
            value={serverUrl}
            onChange={handleUrlChange}
            sx={{ mb: 2 }}
          />
          
          <Button 
            variant="contained" 
            onClick={fetchMedicinesProxy}
            disabled={loading}
          >
            Fetch Medicines via Proxy
          </Button>
        </Box>
      )}
      
      {activeTab === 1 && (
        <Box sx={{ mb: 2 }}>
          <Typography variant="body2" sx={{ mb: 2 }}>
            This method directly calls http://localhost:5002/api/medicines without using the proxy
          </Typography>
          
          <Button 
            variant="contained" 
            onClick={fetchMedicinesDirect}
            disabled={loading}
            color="secondary"
          >
            Fetch Medicines Directly
          </Button>
        </Box>  
      )}
      
      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <CircularProgress />
        </Box>
      )}
      
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      
      {apiResponse && (
        <Paper sx={{ p: 2, mb: 2, maxHeight: '300px', overflow: 'auto' }}>
          <Typography variant="h6" gutterBottom>
            Raw API Response
          </Typography>
          <pre style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
            {apiResponse}
          </pre>
        </Paper>
      )}
      
      <Paper sx={{ p: 2 }}>
        <Typography variant="h6" gutterBottom>
          API Results: {medicines.length} medicines found
        </Typography>
        
        {medicines.length > 0 ? (
          <List>
            {medicines.map((medicine, index) => (
              <React.Fragment key={medicine._id || index}>
                <ListItem>
                  <ListItemText
                    primary={medicine.name}
                    secondary={`${medicine.category} - $${medicine.price} - Stock: ${medicine.stockQuantity}`}
                  />
                </ListItem>
                {index < medicines.length - 1 && <Divider />}
              </React.Fragment>
            ))}
          </List>
        ) : (
          <Typography variant="body1">
            No medicines found. Try clicking the button above to fetch medicines.
          </Typography>
        )}
      </Paper>
    </Box>
  );
};

export default TestMedicines; 