import { test as uiTest, expect as uiExpect } from '../../fixtures/loggedUser';
import { test as hybridTest, expect as hybridExpect } from '../../fixtures/hybridLoggedUser';
import { BasePage } from '../../pages/BasePage';

// ========================================
// UI TESTS (Медленные - каждый тест создаёт пользователя)
// ========================================

uiTest.describe('UI Login Approach (Slow)', () => {
  
  uiTest('Test 1: Check logged in status', async ({ loggedUser }) => {
    const { page, user } = loggedUser;
    const basePage = new BasePage(page);
    
    await page.goto('/');
    
    uiExpect(await basePage.isLoggedIn()).toBeTruthy();
    console.log(`✅ UI Test 1: User ${user.name} is logged in`);
  });

  uiTest('Test 2: Access products page', async ({ loggedUser }) => {
    const { page } = loggedUser;
    
    await page.goto('/products');
    
    uiExpect(page.url()).toContain('products');
    console.log(`✅ UI Test 2: Products page accessed`);
  });

  uiTest('Test 3: Access cart page', async ({ loggedUser }) => {
    const { page } = loggedUser;
    
    await page.goto('/view_cart');
    
    uiExpect(page.url()).toContain('view_cart');
    console.log(`✅ UI Test 3: Cart page accessed`);
  });
});

// ========================================
// HYBRID TESTS (Быстрые - переиспользуют пользователя)
// ========================================

hybridTest.describe.serial('Hybrid Login Approach (Fast)', () => {
  
  hybridTest('Test 1: Check logged in status', async ({ hybridLoggedUser }) => {
    const { page, user } = hybridLoggedUser;
    const basePage = new BasePage(page);
    
    await page.goto('/');
    
    hybridExpect(await basePage.isLoggedIn()).toBeTruthy();
    console.log(`✅ Hybrid Test 1: User ${user.name} is logged in`);
  });

  hybridTest('Test 2: Access products page', async ({ hybridLoggedUser }) => {
    const { page } = hybridLoggedUser;
    
    await page.goto('/products');
    
    hybridExpect(page.url()).toContain('products');
    console.log(`✅ Hybrid Test 2: Products page accessed`);
  });

  hybridTest('Test 3: Access cart page', async ({ hybridLoggedUser }) => {
    const { page } = hybridLoggedUser;
    
    await page.goto('/view_cart');
    
    hybridExpect(page.url()).toContain('view_cart');
    console.log(`✅ Hybrid Test 3: Cart page accessed`);
  });

  hybridTest('Test 4: Check user profile', async ({ hybridLoggedUser }) => {
    const { page, user } = hybridLoggedUser;
    
    await page.goto('/');
    
    const username = await page.locator('a:has-text("Logged in as") b').textContent();
    hybridExpect(username).toBe(user.name);
    
    console.log(`✅ Hybrid Test 4: Profile verified for ${user.name}`);
  });

  hybridTest('Test 5: Multiple navigation', async ({ hybridLoggedUser }) => {
    const { page } = hybridLoggedUser;
    
    await page.goto('/products');
    await page.goto('/');
    await page.goto('/view_cart');
    await page.goto('/products');
    
    console.log(`✅ Hybrid Test 5: Multiple navigations completed`);
  });
});