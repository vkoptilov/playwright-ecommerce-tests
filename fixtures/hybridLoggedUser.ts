import { test as base, Page } from '@playwright/test';
import { testData, generateUniqueUser, User } from '../data/testData';
import { registerNewUser, deleteAccount } from '../utils/authHelpers';
import { saveCookies, loadCookies, logAllCookies } from '../utils/cookieHelper';

type HybridLoggedUserFixtures = {
  testData: typeof testData;
  hybridLoggedUser: { page: Page; user: User; cookies: any[] };
};

// Хранилище для переиспользования пользователя между тестами (worker-scope)
let cachedUser: User | null = null;
let cachedCookies: any[] | null = null;

export const test = base.extend<HybridLoggedUserFixtures>({
  testData: async ({}, use) => {
    await use(testData);
  },

  hybridLoggedUser: async ({ page }, use) => {``
    console.log('🔧 [hybridLoggedUser] Setup started');
    const startTime = Date.now();

    let user: User;
    let cookies: any[];

    // Проверяем, есть ли закэшированный пользователь
    if (cachedUser && cachedCookies) {
      console.log('⚡ [hybridLoggedUser] Reusing cached user (FAST PATH)');
      
      user = cachedUser;
      cookies = cachedCookies;
      
      // Загружаем cookies в page
      await loadCookies(page, cookies);
      await page.goto('/');
      
      // Проверяем, что всё ещё залогинены
      const loggedInText = page.locator('a:has-text("Logged in as")');
      const isLoggedIn = await loggedInText.isVisible().catch(() => false);
      
      if (isLoggedIn) {
        const setupTime = Date.now() - startTime;
        console.log(`✅ [hybridLoggedUser] User ready in ${setupTime}ms (via cookies)`);
        
        await use({ page, user, cookies });
        return;
      } else {
        console.log('⚠️  [hybridLoggedUser] Cached cookies expired, re-registering...');
        cachedUser = null;
        cachedCookies = null;
      }
    }

    // SLOW PATH: Регистрируем нового пользователя через UI
    console.log('🐌 [hybridLoggedUser] Creating new user (SLOW PATH)');
    
    user = generateUniqueUser();
    
    console.log(`👤 Generated user:`);
    console.log(`   Name: ${user.name}`);
    console.log(`   Email: ${user.email}`);
    
    // Регистрируем через UI
    await registerNewUser(page, user);
    
    // Сохраняем cookies для переиспользования
    cookies = await saveCookies(page);
    
    // Кэшируем пользователя и cookies
    cachedUser = user;
    cachedCookies = cookies;
    
    const setupTime = Date.now() - startTime;
    console.log(`✅ [hybridLoggedUser] User ready in ${setupTime}ms (via UI registration)`);
    
    await use({ page, user, cookies });
    
    // Cleanup: удаляем аккаунт после теста
    console.log('🧹 [hybridLoggedUser] Cleanup started');
    
    try {
      await deleteAccount(page);
      
      // Очищаем кэш
      cachedUser = null;
      cachedCookies = null;
      
      console.log('✅ [hybridLoggedUser] Cleanup completed');
    } catch (error) {
      console.log('⚠️  [hybridLoggedUser] Cleanup failed');
    }
  },
});

export { expect } from '@playwright/test';