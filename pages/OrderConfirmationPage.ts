import { BasePage } from './BasePage';

export class OrderConfirmationPage extends BasePage {
  private readonly successMessage = this.page.locator('p:has-text("Congratulations")');
  private readonly orderPlacedTitle = this.page.locator('h2[data-qa="order-placed"]');
  private readonly congratulationsMessage = this.page.locator('.col-sm-9.col-sm-offset-1 p');
  private readonly continueButton = this.page.locator('[data-qa="continue-button"]');
  private readonly downloadInvoiceButton = this.page.locator('a:has-text("Download Invoice")');

  /**
   * Проверить, что заказ успешно размещён
   */
  async isOrderPlaced(): Promise<boolean> {
    try {
      await this.orderPlacedTitle.waitFor({ state: 'visible', timeout: 5000 });
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Получить сообщение об успехе
   */
  async getSuccessMessage(): Promise<string> {
    const message = await this.congratulationsMessage.textContent();
    
    console.log(`✅ Success message: ${message}`);
    
    return message?.trim() || '';
  }

  /**
   * Получить заголовок страницы
   */
  async getOrderPlacedTitle(): Promise<string> {
    const title = await this.orderPlacedTitle.textContent();
    return title?.trim() || '';
  }

  /**
   * Продолжить (вернуться на главную)
   */
  async clickContinue() {
    console.log(`➡️  Clicking continue`);
    
    await this.continueButton.click();
    await this.page.waitForLoadState('domcontentloaded');
    
    console.log(`✅ Returned to homepage`);
  }

  /**
   * Скачать счёт
   */
  async downloadInvoice() {
    console.log(`📄 Downloading invoice`);
    
    const downloadPromise = this.page.waitForEvent('download');
    
    await this.downloadInvoiceButton.click();
    
    const download = await downloadPromise;
    const fileName = download.suggestedFilename();
    
    console.log(`✅ Invoice downloaded: ${fileName}`);
    
    return fileName;
  }

  /**
   * Проверить, есть ли кнопка скачивания счёта
   */
  async isDownloadInvoiceButtonVisible(): Promise<boolean> {
    return await this.downloadInvoiceButton.isVisible().catch(() => false);
  }

  /**
   * Сделать скриншот страницы подтверждения
   */
  async takeScreenshot(path: string) {
    await this.page.screenshot({ path, fullPage: true });
    console.log(`📸 Screenshot saved: ${path}`);
  }
}