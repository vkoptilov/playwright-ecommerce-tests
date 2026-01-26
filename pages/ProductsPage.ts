import { BasePage } from './BasePage';

export class ProductsPage extends BasePage {
  private readonly pageTitle = this.page.locator('.features_items h2.title');
  private readonly searchInput = this.page.locator('#search_product');
  private readonly searchButton = this.page.locator('#submit_search');
  private readonly productsList = this.page.locator('.features_items');
  private readonly productCards = this.page.locator('.features_items .col-sm-4');
  private readonly viewProductLinks = this.page.locator('.choose a[href*="/product_details/"]');
  private readonly addToCartButtons = this.page.locator('.product-overlay .add-to-cart');

  async open() {
    await this.goto('/products');
    await this.waitForPageLoad();
    console.log('📦 Opened products page');
  }

  /**
   * Получить количество товаров на странице
   */
  async getProductsCount(): Promise<number> {
    const count = await this.productCards.count();
    console.log(`📦 Found ${count} products`);
    return count;
  }

  /**
   * Поиск товаров
   */
  async searchProducts(keyword: string) {
    console.log(`🔍 Searching for: "${keyword}"`);
    
    await this.searchInput.fill(keyword);
    await this.searchButton.click();
    
    await this.page.waitForLoadState('domcontentloaded');
    
    const resultsTitle = await this.pageTitle.textContent();
    console.log(`✅ Search completed: ${resultsTitle}`);
  }

  /**
   * Открыть товар по индексу
   */
  async openProduct(index: number) {
    console.log(`📦 Opening product at index ${index}`);
    
    await this.viewProductLinks.nth(index).click();
    await this.page.waitForLoadState('domcontentloaded');
    
    console.log(`✅ Product page opened`);
  }

  /**
   * Открыть первый товар
   */
  async openFirstProduct() {
    await this.openProduct(0);
  }

  /**
   * Получить название товара по индексу
   */
  async getProductName(index: number): Promise<string> {
    const card = this.productCards.nth(index);
    const name = await card.locator('.productinfo p').textContent();
    return name?.trim() || '';
  }

  /**
   * Получить цену товара по индексу
   */
  async getProductPrice(index: number): Promise<string> {
    const card = this.productCards.nth(index);
    const price = await card.locator('.productinfo h2').textContent();
    return price?.trim() || '';
  }

  /**
   * Добавить товар в корзину при наведении (hover)
   */
  async addProductToCartByHover(index: number) {
    console.log(`🛒 Adding product ${index} to cart via hover`);
    
    const card = this.productCards.nth(index);
    
    // Наводим мышку на карточку товара
    await card.hover();
    
    // Кликаем на кнопку Add to cart
    const addButton = card.locator('.add-to-cart');
    await addButton.click();
    
    // Ждём модалку
    await this.page.waitForSelector('.modal-content', { state: 'visible', timeout: 5000 });
    
    console.log(`✅ Product added to cart`);
  }

  /**
   * Продолжить покупки после добавления в корзину
   */
  async continueShopping() {
    const continueButton = this.page.locator('button:has-text("Continue Shopping")');
    await continueButton.click();
    
    // Ждём, пока модалка исчезнет
    await this.page.waitForSelector('.modal-content', { state: 'hidden', timeout: 5000 });
    
    console.log(`➡️  Continued shopping`);
  }

  /**
   * Перейти в корзину после добавления товара
   */
  async goToCart() {
    const viewCartButton = this.page.locator('a:has-text("View Cart")');
    await viewCartButton.click();
    
    await this.page.waitForURL(/.*view_cart/, { timeout: 5000 });
    
    console.log(`➡️  Navigated to cart`);
  }

  /**
   * Фильтр по категории (Women, Men, Kids)
   */
  async filterByCategory(category: string, subcategory: string) {
    console.log(`🔍 Filtering by category: ${category} > ${subcategory}`);
    
    // Раскрываем категорию
    const categoryLink = this.page.locator(`a[href="#${category}"]`);
    await categoryLink.click();
    
    // Кликаем на подкатегорию
    const subcategoryLink = this.page.locator(`a:has-text("${subcategory}")`);
    await subcategoryLink.click();
    
    await this.page.waitForLoadState('domcontentloaded');
    
    console.log(`✅ Filtered by ${category} > ${subcategory}`);
  }

  /**
   * Фильтр по бренду
   */
  async filterByBrand(brandName: string) {
    console.log(`🔍 Filtering by brand: ${brandName}`);
    
    const brandLink = this.page.locator(`.brands-name a:has-text("${brandName}")`);
    await brandLink.click();
    
    await this.page.waitForLoadState('domcontentloaded');
    
    console.log(`✅ Filtered by brand: ${brandName}`);
  }

  /**
   * Проверить, что на странице показаны результаты поиска
   */
  async isSearchResultsPage(): Promise<boolean> {
    const title = await this.pageTitle.textContent();
    return title?.includes('Searched Products') || false;
  }

  /**
   * Получить все названия товаров на странице
   */
  async getAllProductNames(): Promise<string[]> {
    const count = await this.productCards.count();
    const names: string[] = [];
    
    for (let i = 0; i < count; i++) {
      const name = await this.getProductName(i);
      names.push(name);
    }
    
    return names;
  }
}