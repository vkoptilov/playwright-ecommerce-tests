import { test, expect } from '../../fixtures/hybridLoggedUser';
import { ProductsPage } from '../../pages/ProductsPage';
import { ProductPage } from '../../pages/ProductPage';
import { CartPage } from '../../pages/CartPage';
import { CustomAssertions } from '../../utils/assertions';
import { CustomWaiters } from '../../utils/waiters';

test.describe('Architecture: Improved Test with Utils', () => {
  
  test('should use custom assertions and waiters', async ({ hybridLoggedUser }) => {
    const { page } = hybridLoggedUser;
    
    console.log('\n=== Testing Improved Architecture ===\n');
    
    // Используем улучшенный ProductsPage
    const productsPage = new ProductsPage(page);
    await productsPage.open();
    
    // Custom assertion для заголовка
    await CustomAssertions.assertTitle(page, /All Products/);
    
    // Custom assertion для количества продуктов
    const productCards = page.locator('.features_items .col-sm-4');
    CustomAssertions.assertGreaterThan(
      await productCards.count(), 
      0, 
      'Products count'
    );
    
    // Открываем первый продукт
    await productsPage.openFirstProduct();
    
    // Ждём загрузки страницы продукта
    const productPage = new ProductPage(page);
    const productNameLocator = page.locator('.product-information h2');
    
    await CustomWaiters.waitForElementVisible(
      productNameLocator, 
      10000, 
      'Product name'
    );
    
    // Проверяем текст
    const productName = await productPage.getProductName();
    console.log(`📦 Product: ${productName}`);
    
    // Добавляем в корзину
    await productPage.addToCartWithQuantity(2);
    
    // Ждём появления модалки
    const modal = page.locator('.modal-content');
    await CustomWaiters.waitForElementVisible(modal, 5000, 'Success modal');
    
    // Переходим в корзину
    await productPage.goToCart();
    
    // Проверяем URL
    await CustomAssertions.assertUrlContains(page, 'view_cart');
    
    // Проверяем корзину
    const cartPage = new CartPage(page);
    const itemsCount = await cartPage.getItemsCount();
    
    CustomAssertions.assertGreaterThan(itemsCount, 0, 'Cart items count');
    
    // Проверяем наличие продукта
    const hasProduct = await cartPage.hasProduct(productName);
    expect(hasProduct).toBeTruthy();
    
    console.log('\n✅ All custom assertions and waiters worked correctly!\n');
  });

  test('should demonstrate smart retry logic', async ({ hybridLoggedUser }) => {
    const { page } = hybridLoggedUser;
    
    console.log('\n=== Testing Smart Retry ===\n');
    
    // Используем smartWait для надёжного клика
    await CustomWaiters.smartWait(
      async () => {
        await page.goto('/products');
        await page.waitForLoadState('domcontentloaded');
      },
      3,
      1000,
      'Navigate to products'
    );
    
    // Ждём с кастомным условием
    await CustomWaiters.waitForCondition(
      async () => {
        const count = await page.locator('.features_items .col-sm-4').count();
        return count > 0;
      },
      10000,
      'Products to load'
    );
    
    console.log('\n✅ Smart retry worked!\n');
  });

  test('should demonstrate soft assertions', async ({ hybridLoggedUser }) => {
    const { page } = hybridLoggedUser;
    
    console.log('\n=== Testing Soft Assertions ===\n');
    
    await page.goto('/products');
    
    const title = page.locator('.features_items h2.title');
    
    // Soft assertion - не упадёт тест
    const result1 = await CustomAssertions.softAssertText(
      title, 
      'All Products', 
      'Page title'
    );
    
    // Другой soft assertion
    const result2 = await CustomAssertions.softAssertText(
      title, 
      'Non-existent text', 
      'Page title'
    );
    
    console.log(`\nSoft assertion results:`);
    console.log(`  All Products: ${result1 ? '✅' : '❌'}`);
    console.log(`  Non-existent: ${result2 ? '✅' : '❌'}`);
    
    console.log('\n✅ Test continued despite soft assertion failure!\n');
  });
});