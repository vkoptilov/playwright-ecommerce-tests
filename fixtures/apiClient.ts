import { test as base } from '@playwright/test';
import { ApiClient } from '../api/apiClient';
import { ProductsApi } from '../api/products.api';
import { AuthApi } from '../api/auth.api';
import { testData } from '../data/testData';

// Типы для fixtures
type ApiFixtures = {
  testData: typeof testData;
  apiClient: ApiClient;
  productsApi: ProductsApi;
  authApi: AuthApi;
};

// Экспортируем типизированный test
export const test = base.extend<ApiFixtures>({
  // Test data fixture
  testData: async ({}, use) => {
    await use(testData);
  },

  // API Client fixture
  apiClient: async ({}, use) => {
    console.log('🔧 [apiClient fixture] Initializing API client');
    
    const client = new ApiClient();
    await client.init();
    
    await use(client);
    
    console.log('🧹 [apiClient fixture] Disposing API client');
    await client.dispose();
  },

  // Products API fixture (зависит от apiClient)
  productsApi: async ({ apiClient }, use) => {
    console.log('🔧 [productsApi fixture] Initializing Products API');
    
    const productsApi = new ProductsApi(apiClient);
    
    await use(productsApi);
    
    console.log('🧹 [productsApi fixture] Products API cleaned up');
  },

  // Auth API fixture (зависит от apiClient)
    // Auth API fixture (зависит от apiClient)
  authApi: async ({ apiClient }, use) => {
    console.log('🔧 [authApi fixture] Initializing Auth API');
    
    const authApi = new AuthApi(apiClient);
    
    await use(authApi);
    
    console.log('🧹 [authApi fixture] Auth API cleaned up');
  }
  
});

export { expect } from '@playwright/test';