🎭 Playwright E-commerce Test Automation
A full-featured e-commerce testing automation framework using Playwright + TypeScript.
🚀 Features

✅ Page Object Model — clean architecture
✅ Fixtures — reusable components
✅ Hybrid Tests — API + UI testing
✅ API Client — REST API integration
✅ Custom Utilities — assertions and waiters
✅ CI/CD — GitHub Actions
✅ Multi-browser — Chromium, Firefox, WebKit
✅ Parallel Execution — fast test runs

📁 Project Structure
playwright-ecommerce-tests/
├── tests/
│   ├── api/              # API tests
│   ├── ui/               # UI tests
│   ├── hybrid/           # Hybrid (API + UI) tests
│   ├── e2e/              # End-to-end scenarios
│   └── architecture/     # Architecture tests
├── pages/                # Page Objects
├── api/                  # API clients
├── fixtures/             # Playwright fixtures
├── data/                 # Test data and builders
├── utils/                # Utilities (assertions, waiters)
└── .github/workflows/    # CI/CD configuration
🛠️ Installation
bash# Clone the repository
git clone https://github.com/YOUR_USERNAME/playwright-ecommerce-tests.git
cd playwright-ecommerce-tests

# Install dependencies
npm install

# Install browsers
npx playwright install
🧪 Running Tests
bash# All tests
npm test

# Smoke tests
npm run test:smoke

# API tests
npm run test:api

# E2E tests
npm run test:e2e

# Hybrid tests
npm run test:hybrid

# Specific browser
npm run test:chromium

# UI mode (interactive)
npm run test:ui

# Headed mode (browser visible)
npm run test:headed
📊 Reports
bash# Open HTML report
npm run report
🏗️ Architecture
Page Object Model
All pages extend BasePage:
typescriptexport class ProductsPage extends BasePage {
  async openFirstProduct() {
    // ...
  }
}
Fixtures
Reusable components for tests:
typescripttest('my test', async ({ hybridLoggedUser, productsApi }) => {
  // User is already logged in!
  // API client is ready to use!
});
Hybrid Tests
Combining API and UI:
typescript// Prepare data via API (fast)
await productsApi.search('dress');

// Verify in UI (reliable)
await productsPage.openFirstProduct();
🔄 CI/CD
Tests run automatically on:

✅ Push to main/master/develop
✅ Pull Request
✅ Schedule (daily at 2:00 AM)
✅ Manually (workflow_dispatch)

Matrix Strategy
Tests run in parallel across:

3 browsers (Chromium, Firefox, WebKit)
3 shards (splitting tests into parts)

📈 Test Statistics
CategoryCountAPI Tests15+UI Tests10+Hybrid Tests12+E2E Tests16+TOTAL50+
🎯 Test Coverage

✅ Authentication (Login/Signup)
✅ Product Search
✅ Cart Operations
✅ Checkout Flow
✅ Payment Process
✅ Order Confirmation
✅ Edge Cases
✅ Negative Scenarios

📝 Test Examples
Simple E2E Test
typescripttest('complete purchase', async ({ hybridLoggedUser }) => {
  const { page } = hybridLoggedUser;
  
  await productsPage.open();
  await productsPage.openFirstProduct();
  await productPage.addToCart();
  await cartPage.proceedToCheckout();
  await checkoutPage.proceedToPayment();
  await paymentPage.completePayment();
  
  expect(await confirmationPage.isOrderPlaced()).toBeTruthy();
});
Hybrid Test
typescripttest('API → UI verification', async ({ productsApi, cartApi }) => {
  // Get data via API
  const products = await productsApi.getAll();
  
  // Add via Cart API
  await cartApi.addProduct(products[0].id, 2);
  
  // Verify in UI
  const cartItems = await cartApi.getCartItems();
  expect(cartItems[0].name).toBe(products[0].name);
});
🤝 Contributing

Fork the repository
Create your feature branch (git checkout -b feature/amazing-feature)
Commit your changes (git commit -m 'Add amazing feature')
Push to the branch (git push origin feature/amazing-feature)
Open a Pull Request

👤 Author
Vladyslav Koptilov
🙏 Acknowledgments

Playwright
Automation Exercise
TypeScript
