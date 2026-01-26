import { test, expect } from '../../fixtures/base';

test.describe('Product Search', () => {
  
  test.beforeEach(async ({ page }) => {
    await page.goto('/products');
    await expect(page.locator('.features_items h2.title')).toContainText('All Products');
  });

  test('should search with valid queries', async ({ page, testData }) => {
    const query = testData.search.validQueries[0]; // 'dress'
    
    console.log(`🔍 Searching for: "${query}"`);
    
    await page.fill('#search_product', query);
    await page.click('#submit_search');
    
    await expect(page.locator('.features_items h2.title')).toContainText('Searched Products');
    
    const products = page.locator('.features_items .productinfo');
    const count = await products.count();
    
    expect(count).toBeGreaterThan(0);
    console.log(`✅ Found ${count} products`);
  });

  test('should handle empty search', async ({ page, testData }) => {
    const query = testData.search.invalidQueries[0]; // empty string
    
    console.log('🔍 Testing empty search');
    
    await page.fill('#search_product', query);
    await page.click('#submit_search');
    
    const products = page.locator('.features_items .productinfo');
    const count = await products.count();
    
    expect(count).toBeGreaterThan(0);
    console.log(`✅ Empty search returned ${count} products (all products)`);
  });

  test('should search for multiple products from test data', async ({ page, testData }) => {
    for (const query of testData.search.validQueries) {
      console.log(`🔍 Searching for: "${query}"`);
      
      await page.fill('#search_product', query);
      await page.click('#submit_search');
      
      await expect(page.locator('.features_items h2.title')).toContainText('Searched Products');
      
      const products = page.locator('.features_items .productinfo');
      const count = await products.count();
      
      expect(count).toBeGreaterThan(0);
      console.log(`   ✅ Found ${count} products for "${query}"`);
      
      await page.goto('/products');
    }
  });

  test('should verify product details in search results', async ({ page, testData }) => {
    const query = testData.search.validQueries[0];
    
    await page.fill('#search_product', query);
    await page.click('#submit_search');
    
    const firstProduct = page.locator('.features_items .productinfo').first();
    
    await expect(firstProduct.locator('img')).toBeVisible();
    await expect(firstProduct.locator('h2')).toBeVisible(); // цена
    await expect(firstProduct.locator('p')).toBeVisible(); // название
    
    const productName = await firstProduct.locator('p').textContent();
    const productPrice = await firstProduct.locator('h2').textContent();
    
    console.log(`✅ Product found: ${productName} - ${productPrice}`);
  });
});