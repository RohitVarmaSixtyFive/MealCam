// Test script for image upload and analysis
const fs = require('fs');
const FormData = require('form-data');
const axios = require('axios');

async function testImageUpload() {
  try {
    // You would need to add a test image file here
    console.log('Test image upload endpoint...');
    
    // For now, just test if the endpoint exists
    const response = await axios.get('http://localhost:3002/api/meals/');
    console.log('Meals service is running:', response.status);
    
  } catch (error) {
    console.error('Test failed:', error.message);
  }
}

testImageUpload();
