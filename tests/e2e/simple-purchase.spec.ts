import { test, expect } from '../../fixtures/hybridLoggedUser';
import { ProductsPage } from '../../pages/ProductsPage';
import { ProductPage } from '../../pages/ProductPage';
import { CartPage } from '../../pages/CartPage';
import { CheckoutPage } from '../../pages/CheckoutPage';
import { PaymentPage } from '../../pages/PaymentPage';
import { OrderConfirmationPage } from '../../pages/OrderConfirmationPage';
import { testData } from '../../data/testData';

test.describe('E2E: Simple Purchase Flow', () => {
  
  test('should complete full purchase journey', async ({ hybridLoggedUser }) => {
    const { page } = hybridLoggedUser;
    
    console.log('=== Starting E2E Purchase Test ===');
    
    // Шаг 1: Открываем каталог продуктов
    const productsPage = new ProductsPage(page);
    await productsPage.open();
    
    const productsCount = await productsPage.getProductsCount();
    expect(productsCount).toBeGreaterThan(0);
    console.log(`✅ Step 1: Products page loaded with ${productsCount} products`);
    
    // Шаг 2: Открываем первый продукт
    await productsPage.openFirstProduct();
    console.log(`✅ Step 2: Product page opened`);
    
    // Шаг 3: Добавляем в корзину
    const productPage = new ProductPage(page);
    const productName = await productPage.getProductName();
    await productPage.addToCartWithQuantity(2);
    console.log(`✅ Step 3: Added "${productName}" to cart (qty: 2)`);
    
    // Шаг 4: Переходим в корзину
    await productPage.goToCart();
    console.log(`✅ Step 4: Navigated to cart`);
    
    // Шаг 5: Проверяем корзину
    const cartPage = new CartPage(page);
    const itemsCount = await cartPage.getItemsCount();
    expect(itemsCount).toBe(1);
    
    const hasProduct = await cartPage.hasProduct(productName);
    expect(hasProduct).toBeTruthy();
    console.log(`✅ Step 5: Cart verified (${itemsCount} items)`);
    
    // Шаг 6: Переходим к checkout
    await cartPage.proceedToCheckout();
    console.log(`✅ Step 6: Proceeded to checkout`);
    
    // Шаг 7: Проверяем checkout страницу
    const checkoutPage = new CheckoutPage(page);
    const isLoaded = await checkoutPage.isCheckoutPageLoaded();
    expect(isLoaded).toBeTruthy();
    
    await checkoutPage.addComment('Test order - please ignore');
    console.log(`✅ Step 7: Checkout page verified, comment added`);
    
    // Шаг 8: Переходим к оплате
    await checkoutPage.proceedToPayment();
    console.log(`✅ Step 8: Proceeded to payment`);
    
    // Шаг 9: Заполняем платёжные данные
    const paymentPage = new PaymentPage(page);
    const isPaymentFormVisible = await paymentPage.isPaymentFormVisible();
    expect(isPaymentFormVisible).toBeTruthy();
    
    await paymentPage.completePayment(testData.payment);
    console.log(`✅ Step 9: Payment completed`);
    
    // Шаг 10: Проверяем подтверждение заказа
    const confirmationPage = new OrderConfirmationPage(page);
    const isOrderPlaced = await confirmationPage.isOrderPlaced();
    expect(isOrderPlaced).toBeTruthy();
    
    const successMessage = await confirmationPage.getSuccessMessage();
    expect(successMessage).toContain('Congratulations');
    
    console.log(`✅ Step 10: Order confirmed!`);
    console.log(`   Message: ${successMessage}`);
    
    // Делаем скриншот для подтверждения
    await confirmationPage.takeScreenshot('test-results/order-confirmation.png');
    
    console.log('=== E2E Purchase Test COMPLETED ===');
  });
});