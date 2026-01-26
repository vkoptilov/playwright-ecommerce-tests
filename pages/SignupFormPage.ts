import { BasePage } from './BasePage';
import { User } from '../data/testData';

export class SignupFormPage extends BasePage {
  private readonly titleMr = this.page.locator('#id_gender1');
  private readonly titleMrs = this.page.locator('#id_gender2');
  private readonly passwordInput =  this.page.locator('[data-qa="password"]');    
  private readonly daySelect = this.page.locator('[data-qa="days"]');
  private readonly monthSelect = this.page.locator('[data-qa="months"]');
  private readonly yearSelect = this.page.locator('[data-qa="years"]');
  
  private readonly firstNameInput = this.page.locator('[data-qa="first_name"]');
  private readonly lastNameInput = this.page.locator('[data-qa="last_name"]');
  private readonly companyInput = this.page.locator('[data-qa="company"]');
  private readonly address1Input = this.page.locator('[data-qa="address"]');
  private readonly address2Input = this.page.locator('[data-qa="address2"]');
  private readonly countrySelect = this.page.locator('[data-qa="country"]');
  private readonly stateInput = this.page.locator('[data-qa="state"]');
  private readonly cityInput = this.page.locator('[data-qa="city"]');
  private readonly zipcodeInput = this.page.locator('[data-qa="zipcode"]');
  private readonly mobileNumberInput = this.page.locator('[data-qa="mobile_number"]');
    
  private readonly createAccountButton = this.page.locator('[data-qa="create-account"]');

  async fillSignupForm(user: User) {
    console.log(`📝 Filling signup form for: ${user.firstName} ${user.lastName}`);
    
    if (user.title === 'Mr') {
      await this.titleMr.check();
    } else {
      await this.titleMrs.check();
    }
    
    await this.passwordInput.fill(user.password);
    await this.daySelect.selectOption(user.birth_date);
    await this.monthSelect.selectOption(user.birth_month);
    await this.yearSelect.selectOption(user.birth_year);
    
    await this.firstNameInput.fill(user.firstName);
    await this.lastNameInput.fill(user.lastName);
    await this.companyInput.fill(user.company);
    await this.address1Input.fill(user.address);
    await this.address2Input.fill(user.address2);
    await this.countrySelect.selectOption(user.country);
    await this.stateInput.fill(user.state);
    await this.cityInput.fill(user.city);
    await this.zipcodeInput.fill(user.zipcode);
    await this.mobileNumberInput.fill(user.mobile_number);
    
    console.log(`✅ Signup form filled`);
  }

  async submitForm() {
    await this.createAccountButton.click();
    
    await this.page.waitForURL(/.*account_created/, { timeout: 5000 });
    
    console.log(`✅ Account created`);
  }

  async completeSignup(user: User) {
    await this.fillSignupForm(user);
    await this.submitForm();
  }
}