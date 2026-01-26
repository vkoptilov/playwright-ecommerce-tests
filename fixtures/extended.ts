import { test as base } from '@playwright/test';
import { testData } from '../data/testData';

type ExtendedFixture = {
  testData: typeof testData;
  testStartTime: number;
  sharedData: { counter: number };
};

export const test = base.extend<ExtendedFixture>({
  // Test-scope fixture: создаётся для каждого теста
  testData: async ({}, use) => {
    console.log('🔧 [Test scope] Setting up test data');
    await use(testData);
    console.log('🧹 [Test scope] Cleaning up test data');
  },

  // Test-scope fixture: время запуска теста
  testStartTime: async ({}, use) => {
    const startTime = Date.now();
    console.log(`⏰ Test started at: ${new Date(startTime).toISOString()}`);
    
    await use(startTime);
    
    const duration = Date.now() - startTime;
    console.log(`⏱️  Test duration: ${duration}ms`);
  },

  // Worker-scope fixture: создаётся один раз для всех тестов в worker
  // @ts-ignore
  sharedData: [async ({}, use) => {
    const data = { counter: 0 };
    console.log('🌍 [Worker scope] Shared data initialized');
    
    await use(data);
    
    console.log(`🌍 [Worker scope] Final counter value: ${data.counter}`);
  }, { scope: 'worker' }],
});

export { expect } from '@playwright/test';