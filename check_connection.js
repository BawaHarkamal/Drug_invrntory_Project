const axios = require('axios');

// Function to test API connectivity
async function testConnection() {
  console.log('Testing API connectivity...');
  
  // Check server health
  try {
    console.log('\nTesting server health (direct)...');
    const healthResponse = await axios.get('http://localhost:5001/api/medicines', {
      timeout: 5000
    });
    console.log('✅ Server is running and responding!');
    console.log(`Response status: ${healthResponse.status}`);
    console.log(`Data received: ${JSON.stringify(healthResponse.data).substring(0, 200)}...`);
  } catch (err) {
    console.log('❌ Failed to connect to server directly:');
    if (err.response) {
      console.log(`Status: ${err.response.status}`);
      console.log(`Message: ${JSON.stringify(err.response.data)}`);
    } else if (err.request) {
      console.log('No response received. Server might be down.');
    } else {
      console.log(`Error: ${err.message}`);
    }
  }

  // Check proxy connectivity
  try {
    console.log('\nTesting proxy connectivity...');
    const proxyResponse = await axios.get('http://localhost:3001/api/medicines', {
      timeout: 5000
    });
    console.log('✅ Proxy is working correctly!');
    console.log(`Response status: ${proxyResponse.status}`);
    console.log(`Data received: ${JSON.stringify(proxyResponse.data).substring(0, 200)}...`);
  } catch (err) {
    console.log('❌ Failed to connect through proxy:');
    if (err.response) {
      console.log(`Status: ${err.response.status}`);
      console.log(`Message: ${JSON.stringify(err.response.data)}`);
    } else if (err.request) {
      console.log('No response received. Proxy might not be configured correctly.');
    } else {
      console.log(`Error: ${err.message}`);
    }
  }
}

// Run the test
testConnection()
  .then(() => {
    console.log('\nTests completed. Check results above.');
  })
  .catch(err => {
    console.error('Unexpected error:', err);
  }); 