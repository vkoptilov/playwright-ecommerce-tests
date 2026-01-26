import { test, expect } from '../../fixtures/extended';

// Отключаем параллельность для этой группы тестов
test.describe.serial('Fixtures Scope Demo', () => {
  
  test('Test 1: Using test-scope fixtures', async ({ page, testData, testStartTime, sharedData }) => {
    console.log(`📝 Test 1 - User email: ${testData.users.valid.email}`);
    console.log(`📝 Test 1 - Start time: ${testStartTime}`);
    console.log(`📝 Test 1 - Shared counter BEFORE: ${sharedData.counter}`);
    
    sharedData.counter++;
    
    await page.goto('/');
    await expect(page).toHaveTitle(/Automation Exercise/);
    
    console.log(`📝 Test 1 - Shared counter AFTER: ${sharedData.counter}`);
  });

  test('Test 2: Shared data persists', async ({ page, testData, testStartTime, sharedData }) => {
    console.log(`📝 Test 2 - User email: ${testData.users.valid.email}`);
    console.log(`📝 Test 2 - Start time: ${testStartTime}`);
    console.log(`📝 Test 2 - Shared counter BEFORE: ${sharedData.counter}`);
    
    // Счётчик должен сохраниться с предыдущего теста!
    expect(sharedData.counter).toBeGreaterThan(0);
    
    sharedData.counter++;
    
    await page.goto('/products');
    
    console.log(`📝 Test 2 - Shared counter AFTER: ${sharedData.counter}`);
  });

  test('Test 3: Test-scope creates new instance', async ({ page, testStartTime, sharedData }) => {
    console.log(`📝 Test 3 - Start time: ${testStartTime}`);
    console.log(`📝 Test 3 - Shared counter BEFORE: ${sharedData.counter}`);
    
    // Счётчик продолжает расти
    expect(sharedData.counter).toBe(2);
    
    sharedData.counter++;
    
    await page.goto('/');
    
    console.log(`📝 Test 3 - Shared counter AFTER: ${sharedData.counter}`);
  });
});