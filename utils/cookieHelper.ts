import { Page, BrowserContext } from '@playwright/test';

/**
 * Сохранить cookies из page
 */
export async function saveCookies(page: Page) {
  const cookies = await page.context().cookies();
  console.log(`🍪 Saved ${cookies.length} cookies`);
  return cookies;
}

/**
 * Загрузить cookies в page
 */
export async function loadCookies(page: Page, cookies: any[]) {
  await page.context().addCookies(cookies);
  console.log(`🍪 Loaded ${cookies.length} cookies`);
}

/**
 * Сохранить storage state (cookies + localStorage)
 */
export async function saveStorageState(page: Page) {
  const storageState = await page.context().storageState();
  console.log(`💾 Saved storage state (${storageState.cookies.length} cookies)`);
  return storageState;
}

/**
 * Получить конкретный cookie по имени
 */
export async function getCookie(page: Page, name: string) {
  const cookies = await page.context().cookies();
  const cookie = cookies.find(c => c.name === name);
  
  if (cookie) {
    console.log(`🍪 Found cookie: ${name} = ${cookie.value.substring(0, 20)}...`);
  } else {
    console.log(`⚠️  Cookie not found: ${name}`);
  }
  
  return cookie;
}

/**
 * Проверить, есть ли session cookies
 */
export async function hasSessionCookies(page: Page): Promise<boolean> {
  const cookies = await page.context().cookies();
  
  // Проверяем наличие типичных session cookies
  const sessionCookies = cookies.filter(c => 
    c.name.toLowerCase().includes('session') || 
    c.name.toLowerCase().includes('token') ||
    c.name.toLowerCase().includes('auth')
  );
  
  return sessionCookies.length > 0;
}

/**
 * Очистить все cookies
 */
export async function clearCookies(page: Page) {
  await page.context().clearCookies();
  console.log('🧹 All cookies cleared');
}

/**
 * Логировать все cookies (для debug)
 */
export async function logAllCookies(page: Page) {
  const cookies = await page.context().cookies();
  
  console.log('=== All Cookies ===');
  cookies.forEach(cookie => {
    console.log(`  ${cookie.name}: ${cookie.value.substring(0, 30)}...`);
  });
  console.log(`Total: ${cookies.length} cookies`);
}