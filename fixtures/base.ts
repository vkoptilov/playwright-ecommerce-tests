import { test as base } from '@playwright/test';
import { testData } from '../data/testData';

// Расширяем базовый тест с нашими fixtures
type BaseFixture = {
  testData: typeof testData;
};

// Создаём расширенный test с fixtures
export const test = base.extend<BaseFixture>({
  // Fixture для test data
  testData: async ({}, use) => {
    console.log('🔧 Setting up test data fixture');
    
    // Передаём testData в тест
    await use(testData);
    
    console.log('🧹 Cleaning up test data fixture');
    // Здесь можно добавить cleanup logic если нужно
  },
});

export { expect } from '@playwright/test';