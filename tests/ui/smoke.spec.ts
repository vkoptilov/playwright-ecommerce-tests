import { test, expect } from '@playwright/test';

test.describe('Smoke Tests', () => {
  
  test('should open homepage successfully', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/Automation Exercise/);
    const logo = page.locator('img[alt="Website for automation practice"]');
    await expect(logo).toBeVisible();
    await expect(page.locator('a:has-text("Products")')).toBeVisible();
    await expect(page.getByRole('link', { name: ' Cart' })).toBeVisible();
    await expect(page.getByRole('listitem').filter({ hasText: 'Signup / Login' })).toBeVisible();
    console.log('✅ Homepage loaded successfully!');
  });

  test('should navigate to products page', async ({ page }) => {
    await page.goto('/');
    await page.click('a:has-text("Products")');
    await expect(page).toHaveURL(/.*products/);
    const heading = page.locator('.features_items h2.title');
    await expect(heading).toContainText('All Products');
    const products = page.locator('.features_items .col-sm-4');
    await expect(products.first()).toBeVisible();
    console.log('✅ Products page loaded successfully!');
  });

  test('should search for a product', async ({ page }) => {
    await page.goto('/products');
    await page.fill('#search_product', 'dress');
    await page.click('#submit_search');
    const heading = page.locator('.features_items h2.title');
    await expect(heading).toContainText('Searched Products');
    const products = page.locator('.features_items .productinfo');
    const count = await products.count();
    expect(count).toBeGreaterThan(0);
    console.log(`✅ Found ${count} products for "dress"`);
  });
});