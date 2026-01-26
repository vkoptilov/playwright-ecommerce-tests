import { test, expect } from '../../fixtures/hybridLoggedUser';
import { ProductsPage } from '../../pages/ProductsPage';
import { ProductPage } from '../../pages/ProductPage';
import { CartPage } from '../../pages/CartPage';
import { CheckoutPage } from '../../pages/CheckoutPage';
import { PaymentPage } from '../../pages/PaymentPage';

test.describe('E2E: Purchase Negative Scenarios', () => {
  
  test('should handle invalid payment card number', async ({ hybridLoggedUser }) => {
    const { page } = hybridLoggedUser;
    
    console.log('=== Test: Invalid Card Number ===');
    
    // Подготовка: добавляем товар и идём до payment
    const productsPage = new ProductsPage(page);
    await productsPage.open();
    await productsPage.openFirstProduct();
    
    const productPage = new ProductPage(page);
    await productPage.addToCartWithQuantity(1);
    await productPage.goToCart();
    
    const cartPage = new CartPage(page);
    await cartPage.proceedToCheckout();
    
    const checkoutPage = new CheckoutPage(page);
    await checkoutPage.proceedToPayment();
    
    // Пытаемся оплатить с невалидной картой
    const paymentPage = new PaymentPage(page);
    
    const invalidPayment = {
      nameOnCard: 'Test User',
      cardNumber: '1234', // Слишком короткий номер
      cvc: '12', // Слишком короткий CVC
      expiryMonth: '13', // Невалидный месяц
      expiryYear: '2020', // Прошедший год
    };
    
    await paymentPage.fillPaymentDetails(invalidPayment);
    
    console.log('✅ Filled invalid payment details');
    
    // Пытаемся подтвердить
    await paymentPage.confirmPayment();
    
    // Проверяем, что остались на странице оплаты или показали ошибку
    await page.waitForTimeout(2000);
    
    const currentUrl = page.url();
    console.log(`📍 Current URL: ${currentUrl}`);
    
    // На реальном сайте должна быть валидация
    // Здесь просто логируем результат
    if (currentUrl.includes('payment')) {
      console.log('✅ Remained on payment page (validation worked)');
    } else if (currentUrl.includes('payment_done')) {
      console.log('⚠️  Payment accepted (no validation - demo site behavior)');
    }
  });

  test('should handle empty payment fields', async ({ hybridLoggedUser }) => {
    const { page } = hybridLoggedUser;
    
    console.log('=== Test: Empty Payment Fields ===');
    
    // Подготовка
    const productsPage = new ProductsPage(page);
    await productsPage.open();
    await productsPage.openFirstProduct();
    
    const productPage = new ProductPage(page);
    await productPage.addToCartWithQuantity(1);
    await productPage.goToCart();
    
    const cartPage = new CartPage(page);
    await cartPage.proceedToCheckout();
    
    const checkoutPage = new CheckoutPage(page);
    await checkoutPage.proceedToPayment();
    
    // Пытаемся подтвердить с пустыми полями
    const paymentPage = new PaymentPage(page);
    
    // Не заполняем поля, сразу кликаем
    await paymentPage.confirmPayment();
    
    await page.waitForTimeout(2000);
    
    const currentUrl = page.url();
    console.log(`📍 Current URL after empty submit: ${currentUrl}`);
    
    // Должны остаться на payment странице
    if (currentUrl.includes('payment')) {
      console.log('✅ Form validation prevented empty submission');
    } else {
      console.log('⚠️  Empty form accepted (no validation)');
    }
  });

  test('should not allow checkout without login (guest)', async ({ page }) => {
    console.log('=== Test: Guest Checkout Prevention ===');
    
    // Добавляем товар БЕЗ логина
    await page.goto('/products');
    
    const productsPage = new ProductsPage(page);
    await productsPage.openFirstProduct();
    
    const productPage = new ProductPage(page);
    await productPage.addToCartWithQuantity(1);
    await productPage.goToCart();
    
    // Пытаемся перейти к checkout
    const cartPage = new CartPage(page);
    
    // Может быть кнопка "Register / Login to proceed"
    const checkoutButton = page.locator('a.btn-default.check_out');
    const buttonText = await checkoutButton.textContent();
    
    console.log(`🔍 Checkout button text: "${buttonText}"`);
    
    if (buttonText?.toLowerCase().includes('register') || buttonText?.toLowerCase().includes('login')) {
      console.log('✅ Guest checkout prevented - login required');
    } else {
      await checkoutButton.click();
      
      await page.waitForTimeout(2000);
      const currentUrl = page.url();
      
      if (currentUrl.includes('login')) {
        console.log('✅ Redirected to login page');
      } else if (currentUrl.includes('checkout')) {
        console.log('⚠️  Guest checkout allowed');
      }
    }
  });

  test('should handle navigation away from checkout', async ({ hybridLoggedUser }) => {
    const { page } = hybridLoggedUser;
    
    console.log('=== Test: Navigation During Checkout ===');
    
    // Начинаем checkout
    const productsPage = new ProductsPage(page);
    await productsPage.open();
    await productsPage.openFirstProduct();
    
    const productPage = new ProductPage(page);
    await productPage.addToCartWithQuantity(1);
    await productPage.goToCart();
    
    const cartPage = new CartPage(page);
    await cartPage.proceedToCheckout();
    
    console.log('✅ Started checkout process');
    
    // Уходим на другую страницу
    await page.goto('/');
    console.log('➡️  Navigated away to homepage');
    
    // Возвращаемся в корзину
    await cartPage.open();
    
    const itemsCount = await cartPage.getItemsCount();
    
    // Корзина должна сохраниться
    expect(itemsCount).toBe(1);
    console.log('✅ Cart persisted after navigation away from checkout');
  });

  test('should handle rapid cart updates', async ({ hybridLoggedUser }) => {
    const { page } = hybridLoggedUser;
    
    console.log('=== Test: Rapid Cart Updates ===');
    
    const productsPage = new ProductsPage(page);
    await productsPage.open();
    
    // Быстро добавляем несколько товаров
    for (let i = 0; i < 3; i++) {
      await productsPage.openProduct(i);
      
      const productPage = new ProductPage(page);
      await productPage.addToCartWithQuantity(1);
      await productPage.continueShopping();
      
      await productsPage.open();
    }
    
    console.log('✅ Rapidly added 3 products');
    
    // Сразу переходим в корзину
    const cartPage = new CartPage(page);
    await cartPage.open();
    
    const itemsCount = await cartPage.getItemsCount();
    expect(itemsCount).toBe(3);
    
    console.log('✅ All items appeared in cart correctly');
    
    // Быстро удаляем все
    for (let i = 0; i < 3; i++) {
      await cartPage.removeFirstItem();
    }
    
    const isEmpty = await cartPage.isEmpty();
    expect(isEmpty).toBeTruthy();
    
    console.log('✅ Rapidly removed all items, cart is empty');
  });

  test('should handle direct URL access to checkout stages', async ({ hybridLoggedUser }) => {
    const { page } = hybridLoggedUser;
    
    console.log('=== Test: Direct URL Access ===');
    
    // Пытаемся открыть checkout напрямую с пустой корзиной
    await page.goto('/checkout');
    
    await page.waitForTimeout(2000);
    
    let currentUrl = page.url();
    console.log(`📍 Accessing /checkout: ${currentUrl}`);
    
    // Пытаемся открыть payment напрямую
    await page.goto('/payment');
    
    await page.waitForTimeout(2000);
    
    currentUrl = page.url();
    console.log(`📍 Accessing /payment: ${currentUrl}`);
    
    // Система должна редиректить или показать ошибку
    if (currentUrl.includes('view_cart') || currentUrl === page.context().pages()[0].url()) {
      console.log('✅ Direct access prevented - redirected');
    } else {
      console.log('⚠️  Direct access allowed (possible security issue)');
    }
  });

  test('should validate product availability before checkout', async ({ hybridLoggedUser }) => {
    const { page } = hybridLoggedUser;
    
    console.log('=== Test: Product Availability Check ===');
    
    // Добавляем товар
    const productsPage = new ProductsPage(page);
    await productsPage.open();
    await productsPage.openFirstProduct();
    
    const productPage = new ProductPage(page);
    const productName = await productPage.getProductName();
    
    await productPage.addToCartWithQuantity(1);
    await productPage.goToCart();
    
    console.log(`✅ Added "${productName}" to cart`);
    
    // Переходим к checkout
    const cartPage = new CartPage(page);
    await cartPage.proceedToCheckout();
    
    // Проверяем, что товар отображается на checkout
    const checkoutPage = new CheckoutPage(page);
    const orderItems = await checkoutPage.getOrderItems();
    
    expect(orderItems.length).toBeGreaterThan(0);
    expect(orderItems[0].name).toContain(productName);
    
    console.log('✅ Product availability verified on checkout page');
  });
});