import { test, expect } from '../../fixtures/base';
import { SignupLoginPage } from '../../pages/SignupLoginPage';
import { BasePage } from '../../pages/BasePage';

test.describe('Authentication Tests', () => {
  let loginPage: SignupLoginPage;

  test.beforeEach(async ({ page }) => {
     loginPage = new SignupLoginPage(page);
     await loginPage.open();
  })
  
  test('should display login form', async () => {
    expect(await loginPage.isLoginFormVisible()).toBeTruthy();
    expect(await loginPage.isSignupFormVisible()).toBeTruthy();
    
    console.log('✅ Login and Signup forms are visible');
  });

  test('should show error for invalid credentials', async ({ testData }) => {
    await loginPage.login(
      testData.users.invalid.email,
      testData.users.invalid.password
    );
    
    expect(await loginPage.isLoginErrorVisible()).toBeTruthy();
    
    const errorText = await loginPage.getLoginErrorText();
    console.log(`✅ Error message displayed: "${errorText}"`);
  });

  test('should login with valid credentials', async ({ page, testData }) => {
    const basePage = new BasePage(page);
    
    await loginPage.login(
      testData.users.valid.email,
      testData.users.valid.password
    );
    
    expect(await basePage.isLoggedIn()).toBeTruthy();
    
    const username = await basePage.getLoggedInUsername();
    console.log(`✅ Logged in as: ${username}`);
  });

  test('should navigate to signup form', async ({ page, testData }) => {
    await loginPage.startSignup(
      testData.users.valid.name,
      `test_${Date.now()}@example.com` // уникальный email
    );
    
    await expect(page).toHaveURL(/.*signup/);
    
    console.log('✅ Navigated to signup form');
  });
});