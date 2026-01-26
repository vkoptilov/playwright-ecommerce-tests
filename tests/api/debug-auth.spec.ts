import { test, expect } from '../../fixtures/apiClient';
import { generateUniqueUser } from '../../data/testData';

test.describe('Debug: Auth API Exploration', () => {
  
  test('explore verifyLogin endpoint', async ({ apiClient }) => {
    console.log('=== Testing /api/verifyLogin ===');
    
    const response = await apiClient.post('/api/verifyLogin', {
      form: {
        email: 'invalid@example.com',
        password: 'invalid123'
      }
    });
    
    await apiClient.logResponse(response);
    
    const data = await apiClient.getJSON(response);
    console.log('\n=== Response Data ===');
    console.log(JSON.stringify(data, null, 2));
  });

  test('explore createAccount endpoint', async ({ apiClient }) => {
    console.log('=== Testing /api/createAccount ===');
    
    const user = generateUniqueUser();
    
    const response = await apiClient.post('/api/createAccount', {
      form: {
        name: user.name,
        email: user.email,
        password: user.password,
        title: user.title,
        birth_date: user.birth_date,
        birth_month: user.birth_month,
        birth_year: user.birth_year,
        firstname: user.firstName,
        lastname: user.lastName,
        company: user.company,
        address1: user.address,
        address2: user.address2,
        country: user.country,
        zipcode: user.zipcode,
        state: user.state,
        city: user.city,
        mobile_number: user.mobile_number
      }
    });
    
    await apiClient.logResponse(response);
    
    const data = await apiClient.getJSON(response);
    console.log('\n=== Response Data ===');
    console.log(JSON.stringify(data, null, 2));
  });

  test('explore deleteAccount endpoint', async ({ apiClient }) => {
    console.log('=== Testing /api/deleteAccount ===');
    
    const response = await apiClient.delete('/api/deleteAccount', {
      form: {
        email: 'test@example.com',
        password: 'test123'
      }
    });
    
    await apiClient.logResponse(response);
    
    const data = await apiClient.getJSON(response);
    console.log('\n=== Response Data ===');
    console.log(JSON.stringify(data, null, 2));
  });
});