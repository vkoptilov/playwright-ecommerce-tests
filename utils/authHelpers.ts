import { Page } from '@playwright/test';
import { SignupLoginPage } from '../pages/SignupLoginPage';
import { SignupFormPage } from '../pages/SignupFormPage';
import { AccountCreatedPage } from '../pages/AccountCreatedPage';
import { User } from '../data/testData';

export async function registerNewUser(page: Page, user: User): Promise<void> {
  console.log(`🔧 Starting registration for: ${user.email}`);
  
  const signupLoginPage = new SignupLoginPage(page);
  const signupFormPage = new SignupFormPage(page);
  const accountCreatedPage = new AccountCreatedPage(page);
  
  try {
    await signupLoginPage.open();
    await signupLoginPage.startSignup(user.name, user.email);
    await signupFormPage.completeSignup(user);
    const isCreated = await accountCreatedPage.isAccountCreated();
    if (!isCreated) {
      throw new Error('Account creation failed - confirmation page not shown!');
    }
    
    await accountCreatedPage.clickContinue();
    
    console.log(`✅ User registered successfully: ${user.email}`);
  } catch (error) {
    console.error(`❌ Registration failed for ${user.email}:`, error);
    throw error;
  }
}

export async function loginUser(page: Page, email: string, password: string): Promise<void> {
  console.log(`🔐 Logging in user: ${email}`);
  
  const signupLoginPage = new SignupLoginPage(page);
  
  await signupLoginPage.open();
  await signupLoginPage.login(email, password);
  
  console.log(`✅ User logged in: ${email}`);
}

export async function logoutUser(page: Page): Promise<void> {
  const logoutButton = page.locator('a:has-text("Logout")');
  
  if (await logoutButton.isVisible()) {
    await logoutButton.click();
    await page.waitForURL(/.*login/, { timeout: 5000 });
    console.log('🚪 User logged out');
  }
}

export async function deleteAccount(page: Page): Promise<void> {
  const deleteAccountButton = page.locator('a:has-text("Delete Account")');
  
  if (await deleteAccountButton.isVisible()) {
    await deleteAccountButton.click();
    
    await page.waitForURL(/.*delete_account/, { timeout: 5000 });
    
    const continueButton = page.locator('[data-qa="continue-button"]');
    if (await continueButton.isVisible()) {
      await continueButton.click();
    }
    
    console.log('🗑️  Account deleted');
  }
}