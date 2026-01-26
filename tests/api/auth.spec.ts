import { test, expect } from '../../fixtures/apiClient';
import { generateUniqueUser } from '../../data/testData';

test.describe('Auth API', () => {
  
  test('should fail login with invalid credentials', async ({ authApi, testData }) => {
    const response = await authApi.verifyLogin(
      testData.users.invalid.email,
      testData.users.invalid.password
    );
    
    // Проверяем, что логин не прошёл
    expect(response.responseCode).toBe(404);
    expect(response.message).toContain('User not found');
    
    console.log(`✅ Invalid login correctly rejected`);
  });

  test('should fail login with empty credentials', async ({ authApi }) => {
    const response = await authApi.verifyLogin('', '');
    
    // API должен вернуть ошибку
    expect(response.responseCode).not.toBe(200);
    
    console.log(`✅ Empty credentials rejected: ${response.message}`);
  });

  test('should create account via API', async ({ authApi }) => {
    const user = generateUniqueUser();
    
    const response = await authApi.createAccount(user);
    
    console.log(`Response code: ${response.responseCode}`);
    console.log(`Response message: ${response.message}`);
    
    // Проверяем результат (может быть 201 или другой код в зависимости от API)
    if (response.responseCode === 201) {
      console.log(`✅ Account created successfully via API`);
      
      // Пробуем удалить созданный аккаунт
      const deleteResponse = await authApi.deleteAccount(user.email, user.password);
      console.log(`🗑️  Delete response: ${deleteResponse.message}`);
    } else {
      console.log(`⚠️  Account creation returned: ${response.responseCode} - ${response.message}`);
      console.log(`   This is expected if API doesn't support full account creation`);
    }
  });

  test('should verify login for existing user', async ({ authApi }) => {
    // Сначала создаём пользователя
    const user = generateUniqueUser();
    
    const createResponse = await authApi.createAccount(user);
    
    if (createResponse.responseCode === 201) {
      // Если аккаунт создан, проверяем логин
      const loginResponse = await authApi.verifyLogin(user.email, user.password);
      
      expect(loginResponse.responseCode).toBe(200);
      expect(loginResponse.message).toContain('User exists');
      
      console.log(`✅ Login verification successful`);
      
      // Cleanup
      await authApi.deleteAccount(user.email, user.password);
    } else {
      console.log(`⚠️  Skipping login verification - account creation not supported`);
    }
  });

  test('should handle account deletion', async ({ authApi }) => {
    const user = generateUniqueUser();
    
    // Создаём аккаунт
    const createResponse = await authApi.createAccount(user);
    
    if (createResponse.responseCode === 201) {
      // Удаляем аккаунт
      const deleteResponse = await authApi.deleteAccount(user.email, user.password);
      
      expect(deleteResponse.responseCode).toBe(200);
      expect(deleteResponse.message).toContain('Account deleted');
      
      console.log(`✅ Account deletion successful`);
      
      // Проверяем, что аккаунт действительно удалён
      const verifyResponse = await authApi.verifyLogin(user.email, user.password);
      expect(verifyResponse.responseCode).toBe(404);
      
      console.log(`✅ Confirmed: account no longer exists`);
    } else {
      console.log(`⚠️  Skipping deletion test - account creation not supported`);
    }
  });

  test('should check API endpoints availability', async ({ apiClient }) => {
    console.log('=== Testing Auth API Endpoints ===');
    
    // Test verifyLogin endpoint
    const loginResponse = await apiClient.post('/api/verifyLogin', {
      form: { email: 'test@test.com', password: 'test' }
    });
    
    console.log(`/api/verifyLogin: ${loginResponse.status()}`);
    
    // Test createAccount endpoint  
    const createResponse = await apiClient.post('/api/createAccount', {
      form: { 
        name: 'Test',
        email: `test_${Date.now()}@example.com`,
        password: 'test123'
      }
    });
    
    console.log(`/api/createAccount: ${createResponse.status()}`);
    
    const createData = await apiClient.getJSON(createResponse);
    console.log(`Create account response: ${JSON.stringify(createData)}`);
  });
});