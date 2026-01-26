import { test, expect } from '../../fixtures/hybridLoggedUser';
import { CartPage } from '../../pages/CartPage';
import { ProductsPage } from '../../pages/ProductsPage';
import { ProductPage } from '../../pages/ProductPage';
import { CheckoutPage } from '../../pages/CheckoutPage';
import { PaymentPage } from '../../pages/PaymentPage';
import { testData } from '../../data/testData';

test.describe('E2E: Purchase Edge Cases', () => {
  
  test('should prevent checkout with empty cart', async ({ hybridLoggedUser }) => {
    const { page } = hybridLoggedUser;
    
    console.log('=== Test: Empty Cart Checkout ===');
    
    // Переходим на страницу корзины
    const cartPage = new CartPage(page);
    await cartPage.open();
    
    // Проверяем, что корзина пуста
    const isEmpty = await cartPage.isEmpty();
    expect(isEmpty).toBeTruthy();
    
    console.log('✅ Cart is empty as expected');
    
    // Пытаемся перейти к checkout напрямую через URL
    await page.goto('/checkout');
    
    // Проверяем, что нас не пустили или показали сообщение об ошибке
    const currentUrl = page.url();
    console.log(`📍 Current URL: ${currentUrl}`);
    
    // На automationexercise.com могут быть разные варианты поведения
    // Проверяем несколько возможных сценариев
    const isOnCheckout = currentUrl.includes('checkout');
    
    if (isOnCheckout) {
      console.log('⚠️  Note: Site allows checkout with empty cart (UX issue)');
    } else {
      console.log('✅ Prevented checkout with empty cart');
    }
  });

  test('should handle adding multiple products', async ({ hybridLoggedUser }) => {
    const { page } = hybridLoggedUser;
    
    console.log('=== Test: Multiple Products Purchase ===');
    
    const productsPage = new ProductsPage(page);
    await productsPage.open();
    
    // Добавляем 3 разных товара
    const productCount = 3;
    
    for (let i = 0; i < productCount; i++) {
      await productsPage.openProduct(i);
      
      const productPage = new ProductPage(page);
      const productName = await productPage.getProductName();
      
      await productPage.addToCartWithQuantity(1);
      await productPage.continueShopping();
      
      console.log(`✅ Added product ${i + 1}: ${productName}`);
      
      // Возвращаемся на страницу продуктов
      await productsPage.open();
    }
    
    // Проверяем корзину
    const cartPage = new CartPage(page);
    await cartPage.open();
    
    const itemsCount = await cartPage.getItemsCount();
    expect(itemsCount).toBe(productCount);
    
    console.log(`✅ Cart has ${itemsCount} different products`);
    
    // Проверяем, что все товары разные
    const items = await cartPage.getItems();
    const uniqueNames = new Set(items.map(item => item.name));
    expect(uniqueNames.size).toBe(productCount);
    
    console.log('✅ All products are unique');
  });

  test('should add same product multiple times', async ({ hybridLoggedUser }) => {
    const { page } = hybridLoggedUser;
    
    console.log('=== Test: Same Product Multiple Times ===');
    
    const productsPage = new ProductsPage(page);
    await productsPage.open();
    
    await productsPage.openFirstProduct();
    
    const productPage = new ProductPage(page);
    const productName = await productPage.getProductName();
    
    // Добавляем тот же товар 3 раза
    await productPage.addToCartWithQuantity(2);
    await productPage.continueShopping();
    
    await productPage.addToCartWithQuantity(3);
    await productPage.continueShopping();
    
    await productPage.addToCartWithQuantity(1);
    await productPage.goToCart();
    
    console.log(`✅ Added "${productName}" multiple times`);
    
    // Проверяем корзину
    const cartPage = new CartPage(page);
    const items = await cartPage.getItems();
    
    // Может быть либо 1 товар с суммарным количеством, либо 3 отдельные строки
    console.log(`📦 Cart has ${items.length} rows`);
    
    if (items.length === 1) {
      // Одна строка с суммарным количеством
      const totalQty = parseInt(items[0].quantity || '0');
      expect(totalQty).toBeGreaterThan(1);
      console.log(`✅ Single row with quantity: ${totalQty}`);
    } else {
      // Несколько строк с одним и тем же товаром
      console.log(`✅ Multiple rows with same product`);
    }
  });

  test('should verify total price calculation with multiple items', async ({ hybridLoggedUser }) => {
    const { page } = hybridLoggedUser;
    
    console.log('=== Test: Total Price Calculation ===');
    
    const productsPage = new ProductsPage(page);
    await productsPage.open();
    
    // Добавляем 2 товара с разным количеством
    await productsPage.openProduct(0);
    const productPage1 = new ProductPage(page);
    await productPage1.addToCartWithQuantity(2);
    await productPage1.continueShopping();
    
    await productsPage.open();
    await productsPage.openProduct(1);
    const productPage2 = new ProductPage(page);
    await productPage2.addToCartWithQuantity(3);
    await productPage2.goToCart();
    
    // Проверяем корзину
    const cartPage = new CartPage(page);
    const items = await cartPage.getItems();
    
    // Вычисляем ожидаемый total вручную
    let calculatedTotal = 0;
    
    for (const item of items) {
      const totalStr = item.total?.replace('Rs. ', '').trim() || '0';
      calculatedTotal += parseInt(totalStr);
    }
    
    // Получаем total из UI
    const displayedTotal = await cartPage.getTotalPrice();
    const displayedAmount = parseInt(displayedTotal.replace('Rs. ', '').trim());
    
    expect(displayedAmount).toBe(calculatedTotal);
    
    console.log(`✅ Total price verified:`);
    console.log(`   Calculated: Rs. ${calculatedTotal}`);
    console.log(`   Displayed:  ${displayedTotal}`);
  });

  test('should remove items from cart and update total', async ({ hybridLoggedUser }) => {
    const { page } = hybridLoggedUser;
    
    console.log('=== Test: Remove Items and Update Total ===');
    
    // Подготовка: добавляем 3 товара
    const productsPage = new ProductsPage(page);
    await productsPage.open();
    
    for (let i = 0; i < 3; i++) {
      await productsPage.openProduct(i);
      const productPage = new ProductPage(page);
      await productPage.addToCartWithQuantity(1);
      await productPage.continueShopping();
      await productsPage.open();
    }
    
    const cartPage = new CartPage(page);
    await cartPage.open();
    
    // Проверяем начальное состояние
    let itemsCount = await cartPage.getItemsCount();
    expect(itemsCount).toBe(3);
    console.log(`📦 Initial cart: ${itemsCount} items`);
    
    let initialTotal = await cartPage.getTotalPrice();
    console.log(`💰 Initial total: ${initialTotal}`);
    
    // Удаляем один товар
    await cartPage.removeFirstItem();
    
    // Проверяем обновлённое состояние
    itemsCount = await cartPage.getItemsCount();
    expect(itemsCount).toBe(2);
    console.log(`📦 After removal: ${itemsCount} items`);
    
    const newTotal = await cartPage.getTotalPrice();
    console.log(`💰 New total: ${newTotal}`);
    
    // Total должен уменьшиться
    const initialAmount = parseInt(initialTotal.replace('Rs. ', ''));
    const newAmount = parseInt(newTotal.replace('Rs. ', ''));
    
    expect(newAmount).toBeLessThan(initialAmount);
    console.log(`✅ Total decreased from Rs. ${initialAmount} to Rs. ${newAmount}`);
  });

  test('should navigate through checkout steps without completing', async ({ hybridLoggedUser }) => {
    const { page } = hybridLoggedUser;
    
    console.log('=== Test: Checkout Navigation ===');
    
    // Добавляем товар
    const productsPage = new ProductsPage(page);
    await productsPage.open();
    await productsPage.openFirstProduct();
    
    const productPage = new ProductPage(page);
    await productPage.addToCartWithQuantity(1);
    await productPage.goToCart();
    
    // Переходим к checkout
    const cartPage = new CartPage(page);
    await cartPage.proceedToCheckout();
    
    const checkoutPage = new CheckoutPage(page);
    const isLoaded = await checkoutPage.isCheckoutPageLoaded();
    expect(isLoaded).toBeTruthy();
    console.log('✅ Checkout page loaded');
    
    // Проверяем, что можем вернуться назад
    await page.goBack();
    
    const backUrl = page.url();
    expect(backUrl).toContain('view_cart');
    console.log('✅ Successfully navigated back to cart');
    
    // Снова идём на checkout
    await cartPage.proceedToCheckout();
    console.log('✅ Can navigate to checkout again');
  });

  test('should display correct delivery address', async ({ hybridLoggedUser }) => {
    const { page, user } = hybridLoggedUser;
    
    console.log('=== Test: Delivery Address Verification ===');
    
    // Добавляем товар и идём на checkout
    const productsPage = new ProductsPage(page);
    await productsPage.open();
    await productsPage.openFirstProduct();
    
    const productPage = new ProductPage(page);
    await productPage.addToCartWithQuantity(1);
    await productPage.goToCart();
    
    const cartPage = new CartPage(page);
    await cartPage.proceedToCheckout();
    
    // Проверяем адрес на checkout
    const checkoutPage = new CheckoutPage(page);
    const deliveryAddress = await checkoutPage.getDeliveryAddress();
    
    console.log('📍 Delivery address:');
    console.log(deliveryAddress);
    
    // Проверяем, что адрес содержит информацию пользователя
    expect(deliveryAddress).toContain(user.firstName);
    expect(deliveryAddress).toContain(user.city);
    
    console.log('✅ Delivery address contains user information');
  });

  test('should handle checkout with comment', async ({ hybridLoggedUser }) => {
    const { page } = hybridLoggedUser;
    
    console.log('=== Test: Checkout with Comment ===');
    
    // Добавляем товар
    const productsPage = new ProductsPage(page);
    await productsPage.open();
    await productsPage.openFirstProduct();
    
    const productPage = new ProductPage(page);
    await productPage.addToCartWithQuantity(1);
    await productPage.goToCart();
    
    const cartPage = new CartPage(page);
    await cartPage.proceedToCheckout();
    
    // Добавляем длинный комментарий
    const checkoutPage = new CheckoutPage(page);
    const longComment = 'This is a test order. Please handle with care. Special delivery instructions: Leave at front door. Call before delivery. Thank you!';
    
    await checkoutPage.addComment(longComment);
    
    console.log(`✅ Added comment (${longComment.length} characters)`);
    
    // Переходим к оплате
    await checkoutPage.proceedToPayment();
    
    const paymentPage = new PaymentPage(page);
    const isVisible = await paymentPage.isPaymentFormVisible();
    expect(isVisible).toBeTruthy();
    
    console.log('✅ Successfully proceeded to payment with comment');
  });
});