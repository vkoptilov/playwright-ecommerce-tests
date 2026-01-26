import { APIRequestContext, request } from '@playwright/test';

export class ApiClient {
  private context!: APIRequestContext;
  private baseURL: string;

  constructor(baseURL: string = 'https://automationexercise.com') {
    this.baseURL = baseURL;
  }

  /**
   * Инициализация API context
   */
  async init() {
    this.context = await request.newContext({
      baseURL: this.baseURL,
      extraHTTPHeaders: {
        'Accept': '*/*',
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });
    
    console.log(`🔧 API Client initialized with baseURL: ${this.baseURL}`);
  }

  /**
   * Закрытие context (cleanup)
   */
  async dispose() {
    await this.context.dispose();
    console.log('🧹 API Client disposed');
  }

  async get(url: string, options?: any) {
    console.log(`📤 GET ${url}`);
    
    const response = await this.context.get(url, options);
    
    console.log(`📥 Response status: ${response.status()}`);
    
    return response;
  }

  async post(url: string, options?: any) {
    console.log(`📤 POST ${url}`);
    
    const response = await this.context.post(url, options);
    
    console.log(`📥 Response status: ${response.status()}`);
    
    return response;
  }

  async put(url: string, options?: any) {
    console.log(`📤 PUT ${url}`);
    
    const response = await this.context.put(url, options);
    
    console.log(`📥 Response status: ${response.status()}`);
    
    return response;
  }

  async delete(url: string, options?: any) {
    console.log(`📤 DELETE ${url}`);
    
    const response = await this.context.delete(url, options);
    
    console.log(`📥 Response status: ${response.status()}`);
    
    return response;
  }

  /**
   * Получить response body как JSON
   */
  async getJSON(response: any) {
    try {
      return await response.json();
    } catch (error) {
      console.error('❌ Failed to parse JSON:', error);
      throw error;
    }
  }

  /**
   * Получить response body как текст
   */
  async getText(response: any) {
    return await response.text();
  }

  /**
   * Проверка статуса ответа
   */
  isSuccessful(response: any): boolean {
    const status = response.status();
    return status >= 200 && status < 300;
  }

  /**
   * Логирование response для debug
   */
  async logResponse(response: any) {
    console.log('=== Response Details ===');
    console.log(`Status: ${response.status()}`);
    console.log(`Status Text: ${response.statusText()}`);
    console.log(`Headers:`, response.headers());
    
    const body = await response.text();
    console.log(`Body (first 500 chars): ${body.substring(0, 500)}`);
  }
}