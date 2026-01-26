import { Page } from '@playwright/test';

/**
 * Cart API - работа с корзиной
 * 
 * Примечание: На automationexercise.com нет полноценного Cart API,
 * поэтому мы будем использовать комбинацию UI actions с API verification
 */
export class CartApi {
  constructor(private page: Page) {}

  /**
   * Добавить товар в корзину через UI (имитация API)
   * В реальном проекте это был бы POST /api/cart
   */
  async addProduct(productId: number, quantity: number = 1) {
    console.log(`🛒 Adding product #${productId} to cart (quantity: ${quantity})`);
    
    // Переходим на страницу продукта
    await this.page.goto(`/product_details/${productId}`);
    
    // Устанавливаем количество
    await this.page.locator('#quantity').fill(quantity.toString());
    
    // Добавляем в корзину
    await this.page.locator('button:has-text("Add to cart")').click();
    
    // Ждём модалку подтверждения
    const modal = this.page.locator('.modal-content');
    await modal.waitFor({ state: 'visible', timeout: 5000 });
    
    // Закрываем модалку
    await this.page.locator('button.close-modal').click();
    
    console.log(`✅ Product #${productId} added to cart`);
  }

  /**
   * Добавить несколько товаров в корзину
   */
  async addMultipleProducts(products: Array<{ id: number; quantity: number }>) {
    console.log(`🛒 Adding ${products.length} products to cart`);
    
    for (const product of products) {
      await this.addProduct(product.id, product.quantity);
    }
    
    console.log(`✅ All ${products.length} products added`);
  }

  /**
   * Получить товары из корзины (читаем UI)
   */
  async getCartItems() {
    console.log(`📦 Getting cart items`);
    
    await this.page.goto('/view_cart');
    
    const rows = this.page.locator('#cart_info_table tbody tr');
    const count = await rows.count();
    
    const items = [];
    
    for (let i = 0; i < count; i++) {
      const row = rows.nth(i);
      
      // Получаем product ID из ссылки
      const productLink = row.locator('.cart_product a');
      const href = await productLink.getAttribute('href');
      
      let productId = 0;
      if (href) {
        const match = href.match(/product_details\/(\d+)/);
        if (match) {
          productId = parseInt(match[1]);
        }
      }
      
      const item = {
        productId: productId,
        name: await row.locator('.cart_description h4 a').textContent(),
        price: await row.locator('.cart_price p').textContent(),
        quantity: await row.locator('.cart_quantity button').textContent(),
        total: await row.locator('.cart_total p').textContent(),
      };
      
      items.push(item);
    }
    
    console.log(`✅ Found ${items.length} items in cart`);
    
    // Логируем для debug
    items.forEach(item => {
      console.log(`   - Product ID: ${item.productId}, Name: ${item.name}, Qty: ${item.quantity}`);
    });
    
    return items;
  }

  /**
   * Очистить корзину
   */
  async clearCart() {
    console.log(`🗑️  Clearing cart`);
    
    await this.page.goto('/view_cart');
    
    const deleteButtons = this.page.locator('.cart_quantity_delete');
    const count = await deleteButtons.count();
    
    for (let i = 0; i < count; i++) {
      // Всегда кликаем на первую кнопку, так как после удаления список обновляется
      await this.page.locator('.cart_quantity_delete').first().click();
      await this.page.waitForTimeout(500); // Даём время на обновление
    }
    
    console.log(`✅ Cart cleared (${count} items removed)`);
  }

  /**
   * Проверить, пуста ли корзина
   */
  async isCartEmpty(): Promise<boolean> {
    await this.page.goto('/view_cart');
    
    const emptyMessage = this.page.locator('text=Cart is empty');
    const isVisible = await emptyMessage.isVisible().catch(() => false);
    
    if (isVisible) {
      console.log(`✅ Cart is empty`);
      return true;
    }
    
    const items = await this.getCartItems();
    const isEmpty = items.length === 0;
    
    console.log(`✅ Cart has ${items.length} items`);
    
    return isEmpty;
  }

  /**
   * Получить общую сумму корзины
   */
  async getCartTotal(): Promise<string> {
    await this.page.goto('/view_cart');
    
    const items = await this.getCartItems();
    
    if (items.length === 0) {
      return 'Rs. 0';
    }
    
    // Суммируем все total
    let total = 0;
    for (const item of items) {
      const priceStr = item.total?.replace('Rs. ', '') || '0';
      total += parseInt(priceStr);
    }
    
    console.log(`💰 Cart total: Rs. ${total}`);
    
    return `Rs. ${total}`;
  }
}