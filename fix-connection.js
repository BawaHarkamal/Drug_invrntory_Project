/**
 * This script performs a series of checks and fixes for common connectivity issues
 * in the drug inventory system.
 */
const fs = require('fs');
const path = require('path');
const axios = require('axios');

console.log('🔧 Drug Inventory System - Connection Fixer 🔧');
console.log('==============================================');

// Function to check if a server is running
async function checkServerRunning(url) {
  try {
    const response = await axios.get(url, { timeout: 3000 });
    return { running: true, status: response.status };
  } catch (error) {
    if (error.response) {
      // Server responded with error status
      return { running: true, status: error.response.status };
    }
    return { running: false, error: error.message };
  }
}

async function runDiagnostics() {
  console.log('\n1. Checking server status...');
  
  const serverStatus = await checkServerRunning('http://localhost:5001/api/medicines');
  if (serverStatus.running) {
    console.log(`✅ API Server is running (status: ${serverStatus.status})`);
  } else {
    console.log(`❌ API Server is not accessible: ${serverStatus.error}`);
    console.log('   - Try running: npm run server');
  }
  
  const clientStatus = await checkServerRunning('http://localhost:3001');
  if (clientStatus.running) {
    console.log(`✅ Client is running (status: ${clientStatus.status})`);
  } else {
    console.log(`❌ Client is not accessible: ${clientStatus.error}`);
    console.log('   - Try running: npm run client');
  }
  
  console.log('\n2. Checking proxy configuration...');
  
  // Check setupProxy.js exists in src folder
  const srcProxyPath = path.join(__dirname, 'client', 'src', 'setupProxy.js');
  if (fs.existsSync(srcProxyPath)) {
    console.log('✅ setupProxy.js found in client/src');
  } else {
    console.log('❌ setupProxy.js missing from client/src');
  }
  
  // Check setupProxy.js exists in client root (it shouldn't matter but might cause issues)
  const rootProxyPath = path.join(__dirname, 'client', 'setupProxy.js');
  if (fs.existsSync(rootProxyPath)) {
    console.log('⚠️ setupProxy.js found in client root - this might cause conflicts');
  }
  
  console.log('\n3. Checking environment variables...');
  
  // Check server .env
  const serverEnvPath = path.join(__dirname, 'server', '.env');
  if (fs.existsSync(serverEnvPath)) {
    const serverEnv = fs.readFileSync(serverEnvPath, 'utf8');
    if (serverEnv.includes('PORT=5001')) {
      console.log('✅ Server PORT is correctly set to 5001');
    } else {
      console.log('❌ Server PORT may not be correctly set to 5001');
    }
  } else {
    console.log('❌ Server .env file is missing');
  }
  
  // Check client .env
  const clientEnvPath = path.join(__dirname, 'client', '.env');
  if (fs.existsSync(clientEnvPath)) {
    const clientEnv = fs.readFileSync(clientEnvPath, 'utf8');
    if (clientEnv.includes('PORT=3001')) {
      console.log('✅ Client PORT is correctly set to 3001');
    } else {
      console.log('❌ Client PORT may not be correctly set to 3001');
    }
    
    if (clientEnv.includes('REACT_APP_API_URL=http://localhost:5001/api')) {
      console.log('✅ Client API URL is correctly set');
    } else {
      console.log('❌ Client API URL may not be correctly set');
    }
  } else {
    console.log('❌ Client .env file is missing');
  }
  
  console.log('\n4. Checking package.json configurations...');
  
  // Check client package.json
  const clientPackagePath = path.join(__dirname, 'client', 'package.json');
  if (fs.existsSync(clientPackagePath)) {
    const clientPackage = JSON.parse(fs.readFileSync(clientPackagePath, 'utf8'));
    if (clientPackage.proxy === 'http://localhost:5001') {
      console.log('✅ Client proxy is correctly set in package.json');
    } else {
      console.log('❌ Client proxy may not be correctly set in package.json');
    }
  } else {
    console.log('❌ Client package.json file is missing');
  }
  
  console.log('\n==============================================');
  console.log('Diagnostics completed. Running automatic fixes...');
}

async function applyFixes() {
  // Fix 1: Ensure proxy is set correctly in client/package.json
  try {
    const clientPackagePath = path.join(__dirname, 'client', 'package.json');
    if (fs.existsSync(clientPackagePath)) {
      const clientPackage = JSON.parse(fs.readFileSync(clientPackagePath, 'utf8'));
      if (clientPackage.proxy !== 'http://localhost:5001') {
        clientPackage.proxy = 'http://localhost:5001';
        fs.writeFileSync(clientPackagePath, JSON.stringify(clientPackage, null, 2));
        console.log('✅ Fixed: Set client proxy to http://localhost:5001');
      }
    }
  } catch (error) {
    console.log(`❌ Error fixing client package.json: ${error.message}`);
  }
  
  // Fix 2: Ensure client .env exists and has correct settings
  try {
    const clientEnvPath = path.join(__dirname, 'client', '.env');
    const clientEnvContent = `PORT=3001
REACT_APP_API_URL=http://localhost:5001/api`;
    
    fs.writeFileSync(clientEnvPath, clientEnvContent);
    console.log('✅ Fixed: Created/updated client .env file');
  } catch (error) {
    console.log(`❌ Error fixing client .env: ${error.message}`);
  }
  
  // Fix 3: Clear cache folder if it exists
  try {
    const cachePath = path.join(__dirname, 'client', 'node_modules', '.cache');
    if (fs.existsSync(cachePath)) {
      fs.rmSync(cachePath, { recursive: true, force: true });
      console.log('✅ Fixed: Cleared React cache folder');
    }
  } catch (error) {
    console.log(`❌ Error clearing cache: ${error.message}`);
  }
  
  console.log('\n==============================================');
  console.log('Fixes applied. Please restart your server and client applications.');
  console.log('Run "npm run restart" or use the restart.bat script to restart everything.');
}

// Run the diagnostics and fixes
(async () => {
  await runDiagnostics();
  await applyFixes();
})(); 