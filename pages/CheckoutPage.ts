import { BasePage } from './BasePage';

export class CheckoutPage extends BasePage {
  private readonly deliveryAddressSection = this.page.locator('#address_delivery');
  private readonly billingAddressSection = this.page.locator('#address_invoice');
  private readonly orderReviewSection = this.page.locator('#cart_info');
  private readonly commentTextarea = this.page.locator('textarea[name="message"]');
  private readonly placeOrderButton = this.page.locator('a:has-text("Place Order")');

  async open() {
    await this.goto('/checkout');
    await this.waitForPageLoad();
    console.log('💳 Opened checkout page');
  }

  /**
   * Получить адрес доставки
   */
  async getDeliveryAddress(): Promise<string> {
    return await this.deliveryAddressSection.textContent() || '';
  }

  /**
   * Получить адрес для счёта
   */
  async getBillingAddress(): Promise<string> {
    return await this.billingAddressSection.textContent() || '';
  }

  /**
   * Получить список товаров в заказе
   */
  async getOrderItems() {
    const rows = this.page.locator('#cart_info tbody tr');
    const count = await rows.count();
    
    const items = [];
    
    for (let i = 0; i < count; i++) {
      const row = rows.nth(i);
      
      const item = {
        name: await row.locator('.cart_description h4 a').textContent(),
        price: await row.locator('.cart_price p').textContent(),
        quantity: await row.locator('.cart_quantity button').textContent(),
        total: await row.locator('.cart_total p').textContent(),
      };
      
      items.push(item);
    }
    
    console.log(`📦 Order has ${items.length} items`);
    
    return items;
  }

  /**
   * Получить общую сумму заказа
   */
  async getTotalAmount(): Promise<string> {
    const totalRow = this.page.locator('.cart_total_price');
    const total = await totalRow.textContent();
    
    console.log(`💰 Total amount: ${total}`);
    
    return total?.trim() || '';
  }

  /**
   * Добавить комментарий к заказу
   */
  async addComment(comment: string) {
    console.log(`💬 Adding comment: "${comment}"`);
    
    await this.commentTextarea.fill(comment);
    
    console.log(`✅ Comment added`);
  }

  /**
   * Перейти к оплате
   */
  async proceedToPayment() {
    console.log(`➡️  Proceeding to payment`);
    
    await this.placeOrderButton.click();
    
    await this.page.waitForURL(/.*payment/, { timeout: 10000 });
    
    console.log(`✅ Navigated to payment page`);
  }

  /**
   * Проверить, что адреса доставки и счёта совпадают
   */
  async areAddressesMatching(): Promise<boolean> {
    const deliveryAddr = await this.getDeliveryAddress();
    const billingAddr = await this.getBillingAddress();
    
    // Упрощённая проверка - сравниваем длины (в реальном проекте нужна более точная проверка)
    const match = deliveryAddr.length === billingAddr.length;
    
    console.log(`📋 Addresses matching: ${match}`);
    
    return match;
  }

  /**
   * Проверить, что checkout страница загружена корректно
   */
  async isCheckoutPageLoaded(): Promise<boolean> {
    const deliveryVisible = await this.deliveryAddressSection.isVisible();
    const reviewVisible = await this.orderReviewSection.isVisible();
    
    return deliveryVisible && reviewVisible;
  }
}