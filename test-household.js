// Quick test script for household functionality
console.log('Testing if household API endpoints are accessible...');

async function testEndpoints() {
  console.log('Available API endpoints:');
  
  try {
    // Test a simple request to see if server responds
    const response = await fetch('http://localhost:5174/api/households', {
      method: 'GET'
    });
    
    console.log('Household API response status:', response.status);
    const responseText = await response.text();
    console.log('Response body:', responseText.substring(0, 200) + '...');
    
    if (response.status === 401) {
      console.log('✅ API is working (401 = auth required, as expected)');
    } else if (response.status === 500) {
      console.log('❌ Server error - check the API implementation');
    } else if (response.ok) {
      console.log('⚠️  API returned success without auth - check auth middleware');
    } else {
      console.log('⚠️  Unexpected response status');
    }
  } catch (error) {
    console.error('❌ API test failed:', error.message);
  }
}

testEndpoints();
