import { BasePage } from './BasePage';
import { PaymentInfo } from '../data/testData';

export class PaymentPage extends BasePage {
  private readonly nameOnCardInput = this.page.locator('[data-qa="name-on-card"]');
  private readonly cardNumberInput = this.page.locator('[data-qa="card-number"]');
  private readonly cvcInput = this.page.locator('[data-qa="cvc"]');
  private readonly expiryMonthInput = this.page.locator('[data-qa="expiry-month"]');
  private readonly expiryYearInput = this.page.locator('[data-qa="expiry-year"]');
  private readonly payAndConfirmButton = this.page.locator('[data-qa="pay-button"]');

  /**
   * Заполнить данные карты
   */
  async fillPaymentDetails(paymentInfo: PaymentInfo) {
    console.log(`💳 Filling payment details`);
    
    await this.nameOnCardInput.fill(paymentInfo.nameOnCard);
    await this.cardNumberInput.fill(paymentInfo.cardNumber);
    await this.cvcInput.fill(paymentInfo.cvc);
    await this.expiryMonthInput.fill(paymentInfo.expiryMonth);
    await this.expiryYearInput.fill(paymentInfo.expiryYear);
    
    console.log(`✅ Payment details filled`);
  }

  /**
   * Подтвердить оплату
   */
  async confirmPayment() {
    console.log(`💰 Confirming payment`);
    
    await this.payAndConfirmButton.click();
    
    // Ждём перехода на страницу подтверждения
    await this.page.waitForLoadState('domcontentloaded');
    
    console.log(`✅ Payment confirmed`);
  }

  /**
   * Заполнить форму и подтвердить оплату
   */
  async completePayment(paymentInfo: PaymentInfo) {
    await this.fillPaymentDetails(paymentInfo);
    await this.confirmPayment();
  }

  /**
   * Проверить, что форма оплаты отображается
   */
  async isPaymentFormVisible(): Promise<boolean> {
    const cardInputVisible = await this.cardNumberInput.isVisible();
    const buttonVisible = await this.payAndConfirmButton.isVisible();
    
    return cardInputVisible && buttonVisible;
  }
}