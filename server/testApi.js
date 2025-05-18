const axios = require('axios');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Get port from environment
const PORT = process.env.PORT || 5001;

async function testApi() {
  try {
    console.log(`Testing API at http://localhost:${PORT}/api/medicines`);
    
    const response = await axios.get(`http://localhost:${PORT}/api/medicines`);
    
    console.log('API Response Status:', response.status);
    console.log('API Response:', JSON.stringify(response.data, null, 2));
    
    if (response.data && response.data.success && response.data.data) {
      console.log(`✅ API test successful - found ${response.data.data.length} medicines`);
    } else {
      console.log('❌ API test failed - response format is not as expected');
    }
  } catch (error) {
    console.error('❌ API test failed:', error.message);
    if (error.response) {
      console.error('Error response:', error.response.status, error.response.data);
    } else if (error.request) {
      console.error('No response received. Check if server is running.');
    }
  }
}

testApi(); 