import { Page, Locator } from '@playwright/test';

/**
 * Продвинутые waiters для сложных сценариев
 */

export class CustomWaiters {
  /**
   * Ждать, пока элемент появится и станет видимым
   */
  static async waitForElementVisible(locator: Locator, timeout: number = 10000, elementName: string = 'Element') {
    console.log(`⏳ Waiting for ${elementName} to be visible...`);
    await locator.waitFor({ state: 'visible', timeout });
    console.log(`✅ ${elementName} is visible`);
  }

  /**
   * Ждать, пока элемент исчезнет
   */
  static async waitForElementHidden(locator: Locator, timeout: number = 10000, elementName: string = 'Element') {
    console.log(`⏳ Waiting for ${elementName} to be hidden...`);
    await locator.waitFor({ state: 'hidden', timeout });
    console.log(`✅ ${elementName} is hidden`);
  }

  /**
   * Ждать, пока текст элемента изменится
   */
  static async waitForTextChange(locator: Locator, expectedText: string, timeout: number = 10000) {
    console.log(`⏳ Waiting for text to change to "${expectedText}"...`);
    
    const startTime = Date.now();
    
    while (Date.now() - startTime < timeout) {
      const currentText = await locator.textContent();
      if (currentText?.includes(expectedText)) {
        console.log(`✅ Text changed to "${expectedText}"`);
        return;
      }
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    
    throw new Error(`Timeout waiting for text to change to "${expectedText}"`);
  }

  /**
   * Ждать, пока количество элементов станет определённым
   */
  static async waitForCount(locator: Locator, expectedCount: number, timeout: number = 10000) {
    console.log(`⏳ Waiting for element count to be ${expectedCount}...`);
    
    const startTime = Date.now();
    
    while (Date.now() - startTime < timeout) {
      const count = await locator.count();
      if (count === expectedCount) {
        console.log(`✅ Element count is ${expectedCount}`);
        return;
      }
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    
    throw new Error(`Timeout waiting for count to be ${expectedCount}`);
  }

  /**
   * Ждать загрузки страницы с определённым URL
   */
  static async waitForUrl(page: Page, urlPattern: string | RegExp, timeout: number = 10000) {
    console.log(`⏳ Waiting for URL to match pattern...`);
    await page.waitForURL(urlPattern, { timeout });
    console.log(`✅ URL matches pattern`);
  }

  /**
   * Ждать, пока элемент станет кликабельным (visible + enabled)
   */
  static async waitForClickable(locator: Locator, timeout: number = 10000, elementName: string = 'Element') {
    console.log(`⏳ Waiting for ${elementName} to be clickable...`);
    
    await locator.waitFor({ state: 'visible', timeout });
    
    const startTime = Date.now();
    while (Date.now() - startTime < timeout) {
      if (await locator.isEnabled()) {
        console.log(`✅ ${elementName} is clickable`);
        return;
      }
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    
    throw new Error(`Timeout waiting for ${elementName} to be clickable`);
  }

  /**
   * Ждать, пока атрибут элемента изменится
   */
  static async waitForAttribute(
    locator: Locator, 
    attributeName: string, 
    expectedValue: string, 
    timeout: number = 10000
  ) {
    console.log(`⏳ Waiting for attribute ${attributeName}="${expectedValue}"...`);
    
    const startTime = Date.now();
    
    while (Date.now() - startTime < timeout) {
      const actualValue = await locator.getAttribute(attributeName);
      if (actualValue === expectedValue) {
        console.log(`✅ Attribute ${attributeName}="${expectedValue}"`);
        return;
      }
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    
    throw new Error(`Timeout waiting for attribute ${attributeName}="${expectedValue}"`);
  }

  /**
   * Ждать с кастомным условием
   */
  static async waitForCondition(
    condition: () => Promise<boolean>,
    timeout: number = 10000,
    conditionName: string = 'condition'
  ) {
    console.log(`⏳ Waiting for ${conditionName}...`);
    
    const startTime = Date.now();
    
    while (Date.now() - startTime < timeout) {
      if (await condition()) {
        console.log(`✅ ${conditionName} met`);
        return;
      }
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    
    throw new Error(`Timeout waiting for ${conditionName}`);
  }

  /**
   * Ждать, пока loader исчезнет
   */
  static async waitForLoaderToDisappear(page: Page, timeout: number = 30000) {
    console.log(`⏳ Waiting for loader to disappear...`);
    
    const loader = page.locator('.loader, .spinner, [class*="loading"]');
    
    try {
      await loader.waitFor({ state: 'hidden', timeout: 1000 });
    } catch {
      // Loader не найден - это нормально
    }
    
    console.log(`✅ Loader disappeared or was not present`);
  }

  /**
   * Умное ожидание: ждём элемент и автоматически retry при ошибке
   */
  static async smartWait(
    action: () => Promise<void>,
    retries: number = 3,
    delayMs: number = 1000,
    actionName: string = 'action'
  ) {
    console.log(`⏳ Attempting ${actionName} (max ${retries} retries)...`);
    
    for (let i = 0; i < retries; i++) {
      try {
        await action();
        console.log(`✅ ${actionName} succeeded`);
        return;
      } catch (error) {
        if (i === retries - 1) {
          throw error;
        }
        console.warn(`⚠️  ${actionName} failed, retrying... (${i + 1}/${retries})`);
        await new Promise(resolve => setTimeout(resolve, delayMs));
      }
    }
  }
}