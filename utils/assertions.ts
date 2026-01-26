import { expect, Locator, Page } from '@playwright/test';

/**
 * Custom assertions для улучшения читаемости тестов
 */

export class CustomAssertions {
  /**
   * Проверить, что элемент видим с кастомным сообщением
   */
  static async assertVisible(locator: Locator, elementName: string) {
    await expect(locator, `${elementName} should be visible`).toBeVisible();
    console.log(`✅ ${elementName} is visible`);
  }

  /**
   * Проверить, что элемент скрыт
   */
  static async assertHidden(locator: Locator, elementName: string) {
    await expect(locator, `${elementName} should be hidden`).toBeHidden();
    console.log(`✅ ${elementName} is hidden`);
  }

  /**
   * Проверить текст элемента
   */
  static async assertText(locator: Locator, expectedText: string, elementName: string) {
    await expect(locator, `${elementName} should contain "${expectedText}"`).toContainText(expectedText);
    console.log(`✅ ${elementName} contains "${expectedText}"`);
  }

  /**
   * Проверить точное совпадение текста
   */
  static async assertExactText(locator: Locator, expectedText: string, elementName: string) {
    await expect(locator, `${elementName} should have exact text "${expectedText}"`).toHaveText(expectedText);
    console.log(`✅ ${elementName} has exact text "${expectedText}"`);
  }

  /**
   * Проверить количество элементов
   */
  static async assertCount(locator: Locator, expectedCount: number, elementName: string) {
    await expect(locator, `${elementName} count should be ${expectedCount}`).toHaveCount(expectedCount);
    console.log(`✅ ${elementName} count is ${expectedCount}`);
  }

  /**
   * Проверить, что URL содержит подстроку
   */
  static async assertUrlContains(page: Page, expectedSubstring: string) {
    await expect(page, `URL should contain "${expectedSubstring}"`).toHaveURL(new RegExp(expectedSubstring));
    console.log(`✅ URL contains "${expectedSubstring}"`);
  }

  /**
   * Проверить заголовок страницы
   */
  static async assertTitle(page: Page, expectedTitle: string | RegExp) {
    await expect(page, `Page title should match`).toHaveTitle(expectedTitle);
    console.log(`✅ Page title matches`);
  }

  /**
   * Проверить, что элемент активен (enabled)
   */
  static async assertEnabled(locator: Locator, elementName: string) {
    await expect(locator, `${elementName} should be enabled`).toBeEnabled();
    console.log(`✅ ${elementName} is enabled`);
  }

  /**
   * Проверить, что элемент неактивен (disabled)
   */
  static async assertDisabled(locator: Locator, elementName: string) {
    await expect(locator, `${elementName} should be disabled`).toBeDisabled();
    console.log(`✅ ${elementName} is disabled`);
  }

  /**
   * Проверить, что checkbox отмечен
   */
  static async assertChecked(locator: Locator, elementName: string) {
    await expect(locator, `${elementName} should be checked`).toBeChecked();
    console.log(`✅ ${elementName} is checked`);
  }

  /**
   * Проверить значение input
   */
  static async assertValue(locator: Locator, expectedValue: string, elementName: string) {
    await expect(locator, `${elementName} should have value "${expectedValue}"`).toHaveValue(expectedValue);
    console.log(`✅ ${elementName} has value "${expectedValue}"`);
  }

  /**
   * Проверить атрибут элемента
   */
  static async assertAttribute(locator: Locator, attributeName: string, expectedValue: string, elementName: string) {
    await expect(locator, `${elementName} should have ${attributeName}="${expectedValue}"`).toHaveAttribute(attributeName, expectedValue);
    console.log(`✅ ${elementName} has ${attributeName}="${expectedValue}"`);
  }

  /**
   * Проверить, что число больше ожидаемого
   */
  static assertGreaterThan(actual: number, expected: number, valueName: string) {
    expect(actual, `${valueName} should be greater than ${expected}`).toBeGreaterThan(expected);
    console.log(`✅ ${valueName} (${actual}) is greater than ${expected}`);
  }

  /**
   * Проверить, что число меньше ожидаемого
   */
  static assertLessThan(actual: number, expected: number, valueName: string) {
    expect(actual, `${valueName} should be less than ${expected}`).toBeLessThan(expected);
    console.log(`✅ ${valueName} (${actual}) is less than ${expected}`);
  }

  /**
   * Проверить, что массив содержит элемент
   */
  static assertArrayContains<T>(array: T[], item: T, arrayName: string) {
    expect(array, `${arrayName} should contain item`).toContain(item);
    console.log(`✅ ${arrayName} contains item`);
  }

  /**
   * Проверить длину массива
   */
  static assertArrayLength<T>(array: T[], expectedLength: number, arrayName: string) {
    expect(array.length, `${arrayName} length should be ${expectedLength}`).toBe(expectedLength);
    console.log(`✅ ${arrayName} length is ${expectedLength}`);
  }

  /**
   * Soft assertion - не падает тест, только логирует
   */
  static async softAssertText(locator: Locator, expectedText: string, elementName: string) {
    try {
      await expect(locator).toContainText(expectedText);
      console.log(`✅ [SOFT] ${elementName} contains "${expectedText}"`);
      return true;
    } catch (error) {
      console.warn(`⚠️  [SOFT] ${elementName} does not contain "${expectedText}"`);
      return false;
    }
  }
}