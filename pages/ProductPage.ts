import { BasePage } from './BasePage';

export class ProductPage extends BasePage {
  private readonly quantityInput = this.page.locator('#quantity');
  private readonly addToCartButton = this.page.locator('button:has-text("Add to cart")');
  private readonly productName = this.page.locator('.product-information h2');
  private readonly productPrice = this.page.locator('.product-information span span');
  private readonly modal = this.page.locator('.modal-content');
  private readonly viewCartLink = this.page.locator('a:has-text("View Cart")');
  private readonly continueShoppingButton = this.page.locator('button:has-text("Continue Shopping")');

  /**
   * Открыть страницу продукта
   */
  async openProduct(productId: number) {
    this.logAction('Opening product', `ID: ${productId}`);
    await this.goto(`/product_details/${productId}`);
    await this.waitForPageLoad();
  }

  /**
   * Получить название продукта
   */
  async getProductName(): Promise<string> {
    return await this.getText(this.productName);
  }

  /**
   * Получить цену продукта
   */
  async getProductPrice(): Promise<string> {
    return await this.getText(this.productPrice);
  }

  /**
   * Установить количество
   */
  async setQuantity(quantity: number) {
    await this.quantityInput.fill(quantity.toString());
    console.log(`✏️  Set quantity to ${quantity}`);
  }

  /**
   * Добавить в корзину
   */
  async addToCart() {
    const productName = await this.getProductName();
    console.log(`🛒 Adding "${productName}" to cart`);
    
    await this.addToCartButton.click();
    
    // Ждём появления модалки
    await this.modal.waitFor({ state: 'visible', timeout: 5000 });
    
    console.log(`✅ Product added to cart`);
  }

  /**
   * Добавить в корзину с указанным количеством
   */
  async addToCartWithQuantity(quantity: number) {
    await this.setQuantity(quantity);
    await this.addToCart();
  }

  /**
   * Закрыть модалку и продолжить покупки
   */
  async continueShopping() {
    await this.continueShoppingButton.click();
    
    // Ждём, пока модалка исчезнет
    await this.modal.waitFor({ state: 'hidden', timeout: 5000 });
    
    console.log(`➡️  Continued shopping`);
  }

  /**
   * Перейти в корзину из модалки
   */
  async goToCart() {
    await this.viewCartLink.click();
    await this.page.waitForURL(/.*view_cart/, { timeout: 5000 });
    console.log(`➡️  Navigated to cart`);
  }

  /**
   * Проверить, отображается ли модалка успешного добавления
   */
  async isAddedToCartModalVisible(): Promise<boolean> {
    return await this.modal.isVisible();
  }
}