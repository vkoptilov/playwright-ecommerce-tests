import { test, expect } from '../../fixtures/hybridLoggedUser';
import { BasePage } from '../../pages/BasePage';

// Используем serial для переиспользования пользователя
test.describe.serial('Hybrid Logged User Tests', () => {
  
  test('should have user logged in from cookies', async ({ hybridLoggedUser }) => {
    const { page, user } = hybridLoggedUser;
    const basePage = new BasePage(page);
    
    await page.goto('/');
    
    expect(await basePage.isLoggedIn()).toBeTruthy();
    
    const username = await basePage.getLoggedInUsername();
    expect(username).toBe(user.name);
    
    console.log(`✅ User logged in: ${username}`);
  });

  test('should add product to cart', async ({ hybridLoggedUser }) => {
    const { page } = hybridLoggedUser;
    
    await page.goto('/products');
    
    // Кликаем на первый продукт
    await page.locator('.choose a[href*="/product_details/"]').first().click();
    
    // Добавляем в корзину
    await page.locator('button:has-text("Add to cart")').click();
    
    // Проверяем модалку
    const modal = page.locator('.modal-content');
    await expect(modal).toBeVisible();
    
    console.log(`✅ Product added to cart`);
  });

  test('should view cart with items', async ({ hybridLoggedUser }) => {
    const { page } = hybridLoggedUser;
    
    // Переходим в корзину (товар должен быть там с предыдущего теста!)
    await page.goto('/view_cart');
    
    const cartTable = page.locator('#cart_info_table');
    await expect(cartTable).toBeVisible();
    
    console.log(`✅ Cart page opened`);
  });

  test('should search products', async ({ hybridLoggedUser }) => {
    const { page } = hybridLoggedUser;
    
    await page.goto('/products');
    
    await page.fill('#search_product', 'dress');
    await page.click('#submit_search');
    
    const results = page.locator('.features_items .productinfo');
    await expect(results.first()).toBeVisible();
    
    console.log(`✅ Search completed`);
  });

  test('should persist session across navigation', async ({ hybridLoggedUser }) => {
    const { page, user } = hybridLoggedUser;
    const basePage = new BasePage(page);
    
    // Переходим на разные страницы
    await page.goto('/');
    expect(await basePage.isLoggedIn()).toBeTruthy();
    
    await page.goto('/products');
    expect(await basePage.isLoggedIn()).toBeTruthy();
    
    await page.goto('/view_cart');
    expect(await basePage.isLoggedIn()).toBeTruthy();
    
    console.log(`✅ Session persisted across ${user.name}'s navigation`);
  });
});
