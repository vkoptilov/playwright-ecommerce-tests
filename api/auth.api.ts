import { ApiClient } from './apiClient';
import { User } from '../data/testData';

export interface LoginResponse {
  responseCode: number;
  message: string;
}

export interface AccountResponse {
  responseCode: number;
  message: string;
}

export class AuthApi {
  private token?: string;
  private cookies?: any;

  constructor(private client: ApiClient) {}

  /**
   * Verify Login (проверка логина)
   * POST /api/verifyLogin
   */
  async verifyLogin(email: string, password: string): Promise<LoginResponse> {
    console.log(`🔐 Verifying login for: ${email}`);
    
    const response = await this.client.post('/api/verifyLogin', {
      form: {
        email: email,
        password: password
      }
    });
    
    const data = await this.client.getJSON(response);
    
    if (data.responseCode === 200) {
      console.log(`✅ Login verified: ${data.message}`);
      
      // Сохраняем cookies если есть
      const headers = response.headers();
      if (headers['set-cookie']) {
        this.cookies = headers['set-cookie'];
        console.log(`🍪 Cookies saved`);
      }
    } else {
      console.log(`❌ Login failed: ${data.message}`);
    }
    
    return data;
  }

  /**
   * Create Account через API
   * POST /api/createAccount
   * 
   * Примечание: На automationexercise.com этот endpoint может требовать 
   * все поля формы регистрации
   */
  async createAccount(user: User): Promise<AccountResponse> {
    console.log(`📝 Creating account for: ${user.email}`);
    
    const response = await this.client.post('/api/createAccount', {
      form: {
        name: user.name,
        email: user.email,
        password: user.password,
        title: user.title,
        birth_date: user.birth_date,
        birth_month: user.birth_month,
        birth_year: user.birth_year,
        firstname: user.firstName,
        lastname: user.lastName,
        company: user.company,
        address1: user.address,
        address2: user.address2,
        country: user.country,
        zipcode: user.zipcode,
        state: user.state,
        city: user.city,
        mobile_number: user.mobile_number
      }
    });
    
    const data = await this.client.getJSON(response);
    
    if (data.responseCode === 201) {
      console.log(`✅ Account created: ${data.message}`);
    } else {
      console.log(`❌ Account creation failed: ${data.message}`);
    }
    
    return data;
  }

  /**
   * Delete Account через API
   * DELETE /api/deleteAccount
   */
  async deleteAccount(email: string, password: string): Promise<AccountResponse> {
    console.log(`🗑️  Deleting account: ${email}`);
    
    const response = await this.client.delete('/api/deleteAccount', {
      form: {
        email: email,
        password: password
      }
    });
    
    const data = await this.client.getJSON(response);
    
    if (data.responseCode === 200) {
      console.log(`✅ Account deleted: ${data.message}`);
    } else {
      console.log(`❌ Account deletion failed: ${data.message}`);
    }
    
    return data;
  }

  /**
   * Получить сохранённые cookies
   */
  getCookies() {
    return this.cookies;
  }

  /**
   * Установить cookies
   */
  setCookies(cookies: any) {
    this.cookies = cookies;
  }

  /**
   * Проверка, залогинен ли пользователь
   */
  isLoggedIn(): boolean {
    return !!this.cookies;
  }
}