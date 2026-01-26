import { BasePage } from './BasePage';

export class AccountCreatedPage extends BasePage {
  private readonly accountCreatedTitle =  this.page.locator('h2[data-qa="account-created"]');
  private readonly continueButton = this.page.locator('[data-qa="continue-button"]');

  async isAccountCreated(): Promise<boolean> {
    return await this.accountCreatedTitle.isVisible();
  }

  async getSuccessMessage(): Promise<string> {
    return await this.getText(this.accountCreatedTitle);
  }

  async clickContinue() {
    await this.continueButton.click();
    await this.page.waitForLoadState('domcontentloaded');
    
    console.log('✅ Clicked Continue button');
  }
}