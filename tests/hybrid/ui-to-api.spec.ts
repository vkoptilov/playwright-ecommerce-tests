import { test, expect } from '../../fixtures/withCart';
import { ProductPage } from '../../pages/ProductPage'
import { CartPage } from '../../pages/CartPage';

test.describe.serial('Hybrid: UI → API', () => {
  
  test('should add product via UI and verify via Cart API', async ({ loggedUserWithCart, productsApi }) => {
    const { page, cartApi } = loggedUserWithCart;
    
    console.log('=== Test: Add via UI, verify via API ===');
    
    // Очищаем корзину
    await cartApi.clearCart();
    
    // Получаем продукт через API
    const productsResponse = await productsApi.getAll();
    const product = productsResponse.products[0]; // Blue Top
    
    console.log(`📦 Selected product: ${product.name} (ID: ${product.id})`);
    
    // Добавляем через UI
    const productPage = new ProductPage(page);
    await productPage.openProduct(product.id);
    await productPage.addToCartWithQuantity(3);
    await productPage.continueShopping();
    
    // Проверяем через Cart API
    const cartItems = await cartApi.getCartItems();
    
    expect(cartItems.length).toBe(1);
    expect(cartItems[0].name).toContain(product.name);
    expect(cartItems[0].quantity).toContain('3');
    
    console.log(`✅ UI action verified via Cart API`);
    console.log(`   Product: ${cartItems[0].name}`);
    console.log(`   Quantity: ${cartItems[0].quantity}`);
  });

  test('should add multiple products via UI and verify count via API', async ({ loggedUserWithCart, productsApi }) => {
    const { page, cartApi } = loggedUserWithCart;
    
    console.log('=== Test: Add multiple via UI, verify via API ===');
    
    // Очищаем корзину
    await cartApi.clearCart();
    
    // Получаем несколько продуктов
    const productsResponse = await productsApi.getAll();
    const selectedProducts = productsResponse.products.slice(0, 3);
    
    const productPage = new ProductPage(page);
    
    // Добавляем каждый продукт через UI
    for (const product of selectedProducts) {
      await productPage.openProduct(product.id);
      await productPage.addToCartWithQuantity(1);
      await productPage.continueShopping();
      
      console.log(`✅ Added: ${product.name}`);
    }
    
    // Проверяем через API
    const cartItems = await cartApi.getCartItems();
    
    expect(cartItems.length).toBe(3);
    
    console.log(`✅ All products verified via API: ${cartItems.length} items`);
  });

  test('should remove product via UI and verify via API', async ({ loggedUserWithCart, productsApi }) => {
    const { page, cartApi } = loggedUserWithCart;
    
    console.log('=== Test: Remove via UI, verify via API ===');
    
    // Подготовка: добавляем 2 продукта
    await cartApi.clearCart();
    await cartApi.addProduct(1, 1);
    await cartApi.addProduct(2, 1);
    
    // Проверяем начальное состояние
    let cartItems = await cartApi.getCartItems();
    expect(cartItems.length).toBe(2);
    console.log(`📦 Initial cart: ${cartItems.length} items`);
    
    // Удаляем один товар через UI
    const cartPage = new CartPage(page);
    await cartPage.open();
    await cartPage.removeFirstItem();
    
    // Проверяем через API
    cartItems = await cartApi.getCartItems();
    
    expect(cartItems.length).toBe(1);
    
    console.log(`✅ Product removed and verified via API`);
    console.log(`   Remaining items: ${cartItems.length}`);
  });

  test('should search and add product, then verify via API', async ({ loggedUserWithCart, productsApi }) => {
    const { page, cartApi } = loggedUserWithCart;
    
    console.log('=== Test: Search via UI → Add → Verify via API ===');
    
    // Очищаем корзину
    await cartApi.clearCart();
    
    // Ищем продукт через API (чтобы знать, что искать)
    const searchResults = await productsApi.search('jeans');
    const targetProduct = searchResults.products[0];
    
    console.log(`🔍 Target product: ${targetProduct.name}`);
    
    // Ищем через UI
    await page.goto('/products');
    await page.fill('#search_product', 'jeans');
    await page.click('#submit_search');
    
    // Добавляем первый найденный продукт
    await page.locator('.choose a[href*="/product_details/"]').first().click();
    
    const productPage = new ProductPage(page);
    await productPage.addToCartWithQuantity(2);
    await productPage.continueShopping();
    
    // Проверяем через API
    const cartItems = await cartApi.getCartItems();
    
    expect(cartItems.length).toBeGreaterThan(0);
    expect(cartItems[0].quantity).toContain('2');
    
    console.log(`✅ Search → Add → Verified via API`);
    console.log(`   Added: ${cartItems[0].name}`);
  });

  test('should verify cart persistence across pages', async ({ loggedUserWithCart }) => {
    const { page, cartApi } = loggedUserWithCart;
    
    console.log('=== Test: Cart persistence ===');
    
    // Добавляем продукт
    await cartApi.clearCart();
    await cartApi.addProduct(1, 1);
    
    // Проверяем начальное состояние
    let cartItems = await cartApi.getCartItems();
    const initialCount = cartItems.length;
    console.log(`📦 Initial cart: ${initialCount} items`);
    
    // Переходим на разные страницы
    await page.goto('/');
    await page.goto('/products');
    await page.goto('/');
    
    // Проверяем, что корзина сохранилась
    cartItems = await cartApi.getCartItems();
    
    expect(cartItems.length).toBe(initialCount);
    
    console.log(`✅ Cart persisted across navigation: ${cartItems.length} items`);
  });

  test('should verify total price calculation UI vs API', async ({ loggedUserWithCart, productsApi }) => {
    const { page, cartApi } = loggedUserWithCart;
    
    console.log('=== Test: Total price UI vs API ===');
    
    // Подготовка: добавляем несколько продуктов
    await cartApi.clearCart();
    await cartApi.addProduct(1, 2); // Blue Top x2
    await cartApi.addProduct(2, 1); // Men Tshirt x1
    
    // Получаем total через Cart API
    const apiTotal = await cartApi.getCartTotal();
    
    // Получаем total через UI
    const cartPage = new CartPage(page);
    await cartPage.open();
    const uiTotal = await cartPage.getTotalPrice();
    
    // Сравниваем
    expect(uiTotal).toBe(apiTotal);
    
    console.log(`✅ Total price verified:`);
    console.log(`   API: ${apiTotal}`);
    console.log(`   UI:  ${uiTotal}`);
  });
});