import { test, expect } from '../../fixtures/loggedUser';
import { BasePage } from '../../pages/BasePage';

test.describe('Tests with Logged User', () => {
  
  test('should start with logged in user', async ({ loggedUser }) => {
    const { page, user } = loggedUser;
    const basePage = new BasePage(page);
    
    await page.goto('/');
    
    expect(await basePage.isLoggedIn()).toBeTruthy();
    
    const username = await basePage.getLoggedInUsername();
    console.log(`✅ Test started with logged user: ${username}`);
    console.log(`   Email: ${user.email}`);
    
    expect(username).toBe(user.name);
  });

  test('should access products page as logged user', async ({ loggedUser }) => {
    const { page, user } = loggedUser;
    
    await page.goto('/products');
    
    const loggedInText = page.locator(`a:has-text("Logged in as") b:has-text("${user.name}")`);
    await expect(loggedInText).toBeVisible();
    
    console.log(`✅ User ${user.name} accessed products page`);
  });

  test('should add product to cart as logged user', async ({ loggedUser }) => {
    const { page, user } = loggedUser;
    
    await page.goto('/products');
    
    await page.locator('.choose a[href*="/product_details/"]').first().click();
    await page.locator('#quantity').fill('2');
    await page.locator('button:has-text("Add to cart")').click();
    
    const modal = page.locator('.modal-content');
    await expect(modal).toBeVisible();
    
    const successMessage = modal.locator('p:has-text("Your product has been added to cart")');
    await expect(successMessage).toBeVisible();
    
    console.log(`✅ User ${user.name} added product to cart`);
    
    await page.locator('a:has-text("View Cart")').click();
    
    await expect(page).toHaveURL(/.*view_cart/);
    
    const cartTable = page.locator('#cart_info_table');
    await expect(cartTable).toBeVisible();
    
    console.log(`✅ Cart page opened successfully`);
  });

  test('should view account information', async ({ loggedUser }) => {
    const { page, user } = loggedUser;
    
    await page.goto('/');
    
    const logoutButton = page.locator('a:has-text("Logout")');
    const deleteAccountButton = page.locator('a:has-text("Delete Account")');
    
    await expect(logoutButton).toBeVisible();
    await expect(deleteAccountButton).toBeVisible();
    
    console.log(`✅ User ${user.name} has access to account features`);
  });

  test('multiple tests can use loggedUser independently', async ({ loggedUser }) => {
    const { page, user } = loggedUser;
    
    await page.goto('/');
    
    console.log(`✅ This test got a NEW user: ${user.email}`);
    console.log(`   This is a DIFFERENT user from previous tests!`);
    
    await page.goto('/products');
    
    const basePage = new BasePage(page);
    expect(await basePage.isLoggedIn()).toBeTruthy();
  });
});