import { test as base, Page } from '@playwright/test';
import { testData, generateUniqueUser, User } from '../data/testData';
import { registerNewUser, deleteAccount } from '../utils/authHelpers';
import { saveCookies, loadCookies } from '../utils/cookieHelper';
import { CartApi } from '../api/cart.api';
import { ProductsApi } from '../api/products.api';
import { ApiClient } from '../api/apiClient';

type CartFixtures = {
  testData: typeof testData;
  loggedUserWithCart: { page: Page; user: User; cartApi: CartApi };
  productsApi: ProductsApi;
  apiClient: ApiClient;
};

// Кэш для переиспользования
let cachedUser: User | null = null;
let cachedCookies: any[] | null = null;

export const test = base.extend<CartFixtures>({
  testData: async ({}, use) => {
    await use(testData);
  },

  // API Client для получения данных о продуктах
  apiClient: async ({}, use) => {
    const client = new ApiClient();
    await client.init();
    await use(client);
    await client.dispose();
  },

  productsApi: async ({ apiClient }, use) => {
    const productsApi = new ProductsApi(apiClient);
    await use(productsApi);
  },

  // Logged user с Cart API
  loggedUserWithCart: async ({ page }, use) => {
    console.log('🔧 [loggedUserWithCart] Setup started');
    const startTime = Date.now();

    let user: User;
    let cookies: any[];

    // Пытаемся переиспользовать кэш
    if (cachedUser && cachedCookies) {
      console.log('⚡ Reusing cached user');
      user = cachedUser;
      cookies = cachedCookies;
      
      await loadCookies(page, cookies);
      await page.goto('/');
      
      const isLoggedIn = await page.locator('a:has-text("Logged in as")').isVisible().catch(() => false);
      
      if (isLoggedIn) {
        const cartApi = new CartApi(page);
        const setupTime = Date.now() - startTime;
        console.log(`✅ User ready in ${setupTime}ms (via cookies)`);
        
        await use({ page, user, cartApi });
        return;
      } else {
        cachedUser = null;
        cachedCookies = null;
      }
    }

    // Создаём нового пользователя
    console.log('🐌 Creating new user');
    user = generateUniqueUser();
    
    await registerNewUser(page, user);
    cookies = await saveCookies(page);
    
    cachedUser = user;
    cachedCookies = cookies;
    
    const cartApi = new CartApi(page);
    
    const setupTime = Date.now() - startTime;
    console.log(`✅ User ready in ${setupTime}ms (via UI)`);
    
    await use({ page, user, cartApi });
    
    // Cleanup
    console.log('🧹 Cleanup started');
    try {
      await deleteAccount(page);
      cachedUser = null;
      cachedCookies = null;
      console.log('✅ Cleanup completed');
    } catch (error) {
      console.log('⚠️  Cleanup failed');
    }
  },
});

export { expect } from '@playwright/test';