import { BasePage } from './BasePage';

export class CartPage extends BasePage {
  private readonly cartTable = this.page.locator('#cart_info_table');
  private readonly cartRows = this.page.locator('#cart_info_table tbody tr');
  private readonly proceedToCheckoutButton = this.page.locator('a.btn-default.check_out');
  private readonly emptyCartMessage= this.page.locator('text=Cart is empty');

  async open() {
    await this.goto('/view_cart');
    await this.waitForPageLoad();
  }

  /**
   * Получить количество товаров в корзине
   */
  async getItemsCount(): Promise<number> {
    const count = await this.cartRows.count();
    console.log(`🛒 Cart has ${count} items`);
    return count;
  }

  /**
   * Получить товары из корзины
   */
  async getItems() {
    const count = await this.cartRows.count();
    const items = [];

    for (let i = 0; i < count; i++) {
      const row = this.cartRows.nth(i);
      
      const item = {
        name: await row.locator('.cart_description h4 a').textContent(),
        price: await row.locator('.cart_price p').textContent(),
        quantity: await row.locator('.cart_quantity button').textContent(),
        total: await row.locator('.cart_total p').textContent(),
      };
      
      items.push(item);
    }

    return items;
  }

  /**
   * Удалить товар по индексу
   */
  async removeItem(index: number) {
    console.log(`🗑️  Removing item at index ${index}`);
    
    const deleteButton = this.cartRows.nth(index).locator('.cart_quantity_delete');
    await deleteButton.click();
    
    // Ждём обновления страницы
    await this.page.waitForTimeout(1000);
    
    console.log(`✅ Item removed`);
  }

  /**
   * Удалить первый товар
   */
  async removeFirstItem() {
    await this.removeItem(0);
  }

  /**
   * Обновить количество товара
   */
  async updateQuantity(index: number, quantity: number) {
    console.log(`✏️  Updating quantity for item ${index} to ${quantity}`);
    
    const row = this.cartRows.nth(index);
    const quantityButton = row.locator('.cart_quantity button');
    
    // На automationexercise.com количество обычно не редактируется напрямую в корзине
    // Нужно удалить и добавить заново нужное количество
    console.log(`⚠️  Note: Quantity update requires removing and re-adding product`);
  }

  /**
   * Перейти к checkout
   */
  async proceedToCheckout() {
    console.log(`➡️  Proceeding to checkout`);
    await this.proceedToCheckoutButton.click();
    await this.page.waitForLoadState('domcontentloaded');
  }

  /**
   * Проверить, пуста ли корзина
   */
  async isEmpty(): Promise<boolean> {
    const isEmptyMessageVisible = await this.emptyCartMessage.isVisible().catch(() => false);
    
    if (isEmptyMessageVisible) {
      return true;
    }
    
    const count = await this.getItemsCount();
    return count === 0;
  }

  /**
   * Получить общую сумму
   */
  async getTotalPrice(): Promise<string> {
    const items = await this.getItems();
    
    if (items.length === 0) {
      return 'Rs. 0';
    }
    
    let total = 0;
    for (const item of items) {
      const priceStr = item.total?.replace('Rs. ', '').trim() || '0';
      total += parseInt(priceStr);
    }
    
    return `Rs. ${total}`;
  }

  /**
   * Проверить, есть ли товар в корзине по названию
   */
  async hasProduct(productName: string): Promise<boolean> {
    const items = await this.getItems();
    return items.some(item => item.name?.includes(productName));
  }
}