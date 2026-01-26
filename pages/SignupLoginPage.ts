import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class SignupLoginPage extends BasePage {
  // Locators для Login секции
  private readonly loginEmailInput: Locator;
  private readonly loginPasswordInput: Locator;
  private readonly loginButton: Locator;
  
  // Locators для Signup секции
  private readonly signupNameInput: Locator;
  private readonly signupEmailInput: Locator;
  private readonly signupButton: Locator;
  
  // Сообщения об ошибках
  private readonly loginErrorMessage: Locator;

  constructor(page: Page) {
    super(page);
    
    // Login form
    this.loginEmailInput = page.locator('[data-qa="login-email"]');
    this.loginPasswordInput = page.locator('[data-qa="login-password"]');
    this.loginButton = page.locator('[data-qa="login-button"]');
    
    // Signup form
    this.signupNameInput = page.locator('[data-qa="signup-name"]');
    this.signupEmailInput = page.locator('[data-qa="signup-email"]');
    this.signupButton = page.locator('[data-qa="signup-button"]');
    
    // Error messages
    this.loginErrorMessage = page.locator('p:has-text("Your email or password is incorrect!")');
  }

  // Переход на страницу Login/Signup
  async open() {
    await this.goto('/login');
    await this.waitForPageLoad();
    
    // Ждём, пока форма точно загрузится
    await this.page.waitForSelector('form', { state: 'visible', timeout: 10000 });
  }

  // ======== LOGIN METHODS ========
  
  /**
   * Логин через UI
   * @param email - email пользователя
   * @param password - пароль
   */
  async login(email: string, password: string) {
    console.log(`🔐 Logging in as: ${email}`);
    
    await this.loginEmailInput.fill(email);
    await this.loginPasswordInput.fill(password);
    await this.loginButton.click();
    
    // Ждём редиректа после логина
    await this.page.waitForURL(/.*/, { timeout: 5000 });
    
    console.log(`✅ Login completed`);
  }

  /**
   * Проверка ошибки логина
   */
  async isLoginErrorVisible(): Promise<boolean> {
    return await this.loginErrorMessage.isVisible();
  }

  async getLoginErrorText(): Promise<string> {
    return await this.getText(this.loginErrorMessage);
  }

  // ======== SIGNUP METHODS ========
  
  /**
   * Начало процесса регистрации (первый шаг)
   * @param name - имя пользователя
   * @param email - email
   */
  async startSignup(name: string, email: string) {
    console.log(`📝 Starting signup for: ${email}`);
    
    // Ждём видимости формы signup
    await this.signupNameInput.waitFor({ state: 'visible', timeout: 10000 });
    
    await this.signupNameInput.fill(name);
    await this.signupEmailInput.fill(email);
    await this.signupButton.click();
    
    // Ждём перехода на страницу с формой регистрации (увеличен timeout)
    try {
      await this.page.waitForURL(/.*signup/, { timeout: 15000 });
      console.log(`✅ Signup form opened`);
    } catch (error) {
      // Проверяем, не появилось ли сообщение об ошибке (email уже существует)
      const errorMessage = this.page.locator('p:has-text("Email Address already exist!")');
      const hasError = await errorMessage.isVisible().catch(() => false);
      
      if (hasError) {
        throw new Error(`Email already exists: ${email}`);
      }
      
      // Если не перешли на signup и нет ошибки - выбрасываем оригинальную ошибку
      throw error;
    }
  }

  /**
   * Проверка, что мы на странице логина
   */
  async isLoginFormVisible(): Promise<boolean> {
    return await this.loginEmailInput.isVisible();
  }

  async isSignupFormVisible(): Promise<boolean> {
    return await this.signupNameInput.isVisible();
  }
}