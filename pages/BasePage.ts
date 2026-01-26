import { Page, Locator } from '@playwright/test';

export class BasePage {
  protected page: Page;
  protected pageName: string;

  constructor(page: Page, pageName: string = 'BasePage') {
    this.page = page;
    this.pageName = pageName;
  }

  // ========== NAVIGATION ==========
  
  async goto(path: string) {
    this.log(`Navigating to: ${path}`);
    await this.page.goto(path);
  }

  async waitForPageLoad() {
    await this.page.waitForLoadState('domcontentloaded');
  }

  async reload() {
    this.log('Reloading page');
    await this.page.reload();
  }

  async goBack() {
    this.log('Going back');
    await this.page.goBack();
  }

  async goForward() {
    this.log('Going forward');
    await this.page.goForward();
  }

  // ========== ACTIONS ==========
  
  async clickElement(locator: Locator, options?: { timeout?: number }) {
    await locator.click(options);
  }

  async fillInput(locator: Locator, value: string) {
    await locator.fill(value);
  }

  async selectOption(locator: Locator, value: string) {
    await locator.selectOption(value);
  }

  async checkCheckbox(locator: Locator) {
    if (!await locator.isChecked()) {
      await locator.check();
    }
  }

  async uncheckCheckbox(locator: Locator) {
    if (await locator.isChecked()) {
      await locator.uncheck();
    }
  }

  async hover(locator: Locator) {
    await locator.hover();
  }

  // ========== GETTERS ==========
  
  async getText(locator: Locator): Promise<string> {
    return await locator.textContent() || '';
  }

  async getValue(locator: Locator): Promise<string> {
    return await locator.inputValue();
  }

  async getAttribute(locator: Locator, name: string): Promise<string | null> {
    return await locator.getAttribute(name);
  }

  // ========== VISIBILITY CHECKS ==========
  
  async isVisible(locator: Locator): Promise<boolean> {
    return await locator.isVisible();
  }

  async isHidden(locator: Locator): Promise<boolean> {
    return await locator.isHidden();
  }

  async isEnabled(locator: Locator): Promise<boolean> {
    return await locator.isEnabled();
  }

  async isDisabled(locator: Locator): Promise<boolean> {
    return await locator.isDisabled();
  }

  async isChecked(locator: Locator): Promise<boolean> {
    return await locator.isChecked();
  }

  // ========== WAITERS ==========
  
  async waitForElement(locator: Locator, state: 'visible' | 'hidden' = 'visible', timeout: number = 10000) {
    await locator.waitFor({ state, timeout });
  }

  async waitForURL(pattern: string | RegExp, timeout: number = 10000) {
    await this.page.waitForURL(pattern, { timeout });
  }

  async waitForTimeout(ms: number) {
    await this.page.waitForTimeout(ms);
  }

  // ========== AUTHENTICATION HELPERS ==========
  
  async isLoggedIn(): Promise<boolean> {
    const logoutLink = this.page.locator('a:has-text("Logout")');
    return await logoutLink.isVisible();
  }

  async getLoggedInUsername(): Promise<string> {
    const usernameElement = this.page.locator('a:has-text("Logged in as") b');
    if (await usernameElement.isVisible()) {
      return await usernameElement.textContent() || '';
    }
    return '';
  }

  // ========== SCREENSHOTS & DEBUGGING ==========
  
  async takeScreenshot(path: string) {
    this.log(`Taking screenshot: ${path}`);
    await this.page.screenshot({ path, fullPage: true });
  }

  async getPageTitle(): Promise<string> {
    return await this.page.title();
  }

  async getCurrentUrl(): Promise<string> {
    return this.page.url();
  }

  // ========== LOGGING ==========
  
  protected log(message: string, level: 'info' | 'warn' | 'error' = 'info') {
    const timestamp = new Date().toISOString();
    const prefix = `[${timestamp}] [${this.pageName}]`;
    
    switch (level) {
      case 'info':
        console.log(`${prefix} ℹ️  ${message}`);
        break;
      case 'warn':
        console.warn(`${prefix} ⚠️  ${message}`);
        break;
      case 'error':
        console.error(`${prefix} ❌ ${message}`);
        break;
    }
  }

  protected logAction(action: string, details?: string) {
    const message = details ? `${action}: ${details}` : action;
    this.log(message);
  }

  // ========== ERROR HANDLING ==========
  
  async safeClick(locator: Locator, errorMessage?: string): Promise<boolean> {
    try {
      await this.clickElement(locator);
      return true;
    } catch (error) {
      this.log(errorMessage || `Failed to click element: ${error}`, 'error');
      return false;
    }
  }

  async safeFill(locator: Locator, value: string, errorMessage?: string): Promise<boolean> {
    try {
      await this.fillInput(locator, value);
      return true;
    } catch (error) {
      this.log(errorMessage || `Failed to fill input: ${error}`, 'error');
      return false;
    }
  }

  // ========== COMMON ASSERTIONS ==========
  
  async assertElementVisible(locator: Locator, elementName: string) {
    const isVisible = await this.isVisible(locator);
    if (!isVisible) {
      throw new Error(`Expected ${elementName} to be visible on ${this.pageName}`);
    }
    this.log(`✅ ${elementName} is visible`);
  }

  async assertUrlContains(expected: string) {
    const currentUrl = await this.getCurrentUrl();
    if (!currentUrl.includes(expected)) {
      throw new Error(`Expected URL to contain "${expected}", but got "${currentUrl}"`);
    }
    this.log(`✅ URL contains "${expected}"`);
  }
}