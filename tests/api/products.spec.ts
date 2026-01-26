import { test, expect } from '../../fixtures/apiClient';

test.describe('Products API', () => {
  
  test('should get all products', async ({ productsApi }) => {
    const response = await productsApi.getAll();
    
    expect(response).toHaveProperty('responseCode');
    expect(response.responseCode).toBe(200);
    expect(response).toHaveProperty('products');
    expect(Array.isArray(response.products)).toBeTruthy();
    
    expect(response.products.length).toBeGreaterThan(0);
    
    const firstProduct = response.products[0];
    expect(firstProduct).toHaveProperty('id');
    expect(firstProduct).toHaveProperty('name');
    expect(firstProduct).toHaveProperty('price');
    expect(firstProduct).toHaveProperty('brand');
    expect(firstProduct).toHaveProperty('category');
    
    console.log(`✅ Total products: ${response.products.length}`);
    console.log(`✅ First product: ${firstProduct.name} - ${firstProduct.price}`);
  });

  test('should search for products', async ({ productsApi, testData }) => {
    const keyword = testData.search.validQueries[0]; // 'dress'
    
    const response = await productsApi.search(keyword);
    
    expect(response.responseCode).toBe(200);
    expect(Array.isArray(response.products)).toBeTruthy();
    expect(response.products.length).toBeGreaterThan(0);
    
    console.log(`✅ Found ${response.products.length} products for "${keyword}"`);
    
    response.products.forEach((product: any) => {
      console.log(`   - ${product.name}`);
    });
    
    expect(response.products.length).toBeGreaterThan(0);
  });

  test('should search with multiple keywords', async ({ productsApi, testData }) => {
    // Тестируем несколько поисковых запросов
    for (const keyword of testData.search.validQueries) {
      const response = await productsApi.search(keyword);
      
      expect(response.responseCode).toBe(200);
      expect(response.products.length).toBeGreaterThan(0);
      
      console.log(`✅ "${keyword}": ${response.products.length} products found`);
    }
  });

  test('should get product by ID', async ({ productsApi }) => {
    const productId = 1;
    
    const product = await productsApi.getById(productId);
    
    expect(product).toBeDefined();
    expect(product.id).toBe(productId);
    expect(product.name).toBeTruthy();
    expect(product.price).toBeTruthy();
    
    console.log(`✅ Product #${productId}:`);
    console.log(`   Name: ${product.name}`);
    console.log(`   Price: ${product.price}`);
    console.log(`   Brand: ${product.brand}`);
    console.log(`   Category: ${product.category.usertype.usertype} > ${product.category.category}`);
  });

  test('should get brands list', async ({ productsApi }) => {
    const response = await productsApi.getBrands();
    
    expect(response.responseCode).toBe(200);
    expect(Array.isArray(response.brands)).toBeTruthy();
    expect(response.brands.length).toBeGreaterThan(0);
    
    const firstBrand = response.brands[0];
    expect(firstBrand).toHaveProperty('id');
    expect(firstBrand).toHaveProperty('brand');
    
    console.log(`✅ Total brands: ${response.brands.length}`);
    
    response.brands.slice(0, 5).forEach((brand: any) => {
      console.log(`   - ${brand.brand}`);
    });
  });

  test('should handle empty search results gracefully', async ({ productsApi }) => {
    const keyword = 'xyzabc123notexist';
    
    const response = await productsApi.search(keyword);
    
    expect(response.responseCode).toBe(200);
    expect(response.products.length).toBe(0);
    
    console.log(`✅ No products found for "${keyword}" (as expected)`);
  });

  test('should validate product data structure', async ({ productsApi }) => {
    const products = await productsApi.getAll();
    
    // Проверяем несколько продуктов
    const sampleProducts = products.products.slice(0, 5);
    
    for (const product of sampleProducts) {
      // Обязательные поля
      expect(product.id).toBeGreaterThan(0);
      expect(product.name).toBeTruthy();
      expect(product.price).toMatch(/Rs\. \d+/); // Формат цены
      
      // Вложенные объекты
      expect(product.category).toHaveProperty('usertype');
      expect(product.category).toHaveProperty('category');
      expect(product.category.usertype).toHaveProperty('usertype');
      
      console.log(`✅ Product #${product.id} structure is valid`);
    }
  });
});