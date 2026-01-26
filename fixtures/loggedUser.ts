import { test as base, Page } from '@playwright/test';
import { testData, generateUniqueUser, User } from '../data/testData';
import { registerNewUser, deleteAccount } from '../utils/authHelpers';

type LoggedUserFixtures = {
  testData: typeof testData;
  loggedUser: { page: Page; user: User };
};

export const test = base.extend<LoggedUserFixtures>({
  // Fixture для test data (переиспользуем из base.ts)
  testData: async ({}, use) => {
    await use(testData);
  },

  loggedUser: async ({ page }, use) => {
    console.log('🔧 [loggedUser fixture] Setup started');
    
    const user = generateUniqueUser();
    
    console.log(`Generated user:`);
    console.log(`Name: ${user.name}`);
    console.log(`Email: ${user.email}`);
    console.log(`Password: ${user.password}`);
    
    
    await registerNewUser(page, user);
    
    const loggedInText = page.locator('a:has-text("Logged in as")');
    await loggedInText.waitFor({ state: 'visible', timeout: 5000 });
    
    console.log('✅ [loggedUser fixture] User is logged in and ready!');
    
    await use({ page, user });
    
    console.log('🧹 [loggedUser fixture] Cleanup started');
    
    try {
      await deleteAccount(page);
      console.log('✅ [loggedUser fixture] Cleanup completed');
    } catch (error) {
      console.log('⚠️  [loggedUser fixture] Cleanup failed (account might be already deleted)');
    }
  },
});

export { expect } from '@playwright/test';