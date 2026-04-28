# 🎭 Playwright E-commerce Test Automation

Solution for automation testing e-commerce project with Playwright + TypeScript created with free plan Claude Sonnet 

- ✅ **Page Object Model** 
- ✅ **Fixtures**
- ✅ **Hybrid Tests** — API + UI 
- ✅ **API Client** — work REST API
- ✅ **Custom Utilities** — assertions и waiters
- ✅ **CI/CD** — GitHub Actions
- ✅ **Multi-browser** 
- ✅ **Parallel Execution** 

## 📁 Project structure

```
playwright-ecommerce-tests/
├── tests/
│   ├── api/              # API 
│   ├── ui/               # UI 
│   ├── hybrid/           # Hybrid (API + UI) 
│   ├── e2e/              # End-to-end 
│   └── architecture/     # Architecture tests
├── pages/                # Page Objects
├── api/                  # API clients
├── fixtures/             # Playwright fixtures
├── data/                 # Testing data builders
├── utils/                # assertions, waiters
└── .github/workflows/    # CI/CD config
```

## 🧪 Run tests

```bash
# All
npm test

# Smoke 
npm run test:smoke

# API 
npm run test:api

# E2E 
npm run test:e2e

# Hybrid 
npm run test:hybrid

# Chromium browser
npm run test:chromium

# UI mode
npm run test:ui

# Headed mode
npm run test:headed
```

## 📊 Reports

```bash
# Open report
npm run report
```

## 🏗️ Architecture

### Page Object Model

All pages extends from `BasePage`:

```typescript
export class ProductsPage extends BasePage {
  async openFirstProduct() {
    // ...
  }
}
```

### Fixtures

Reusable components for tests:

```typescript
test('my test', async ({ hybridLoggedUser, productsApi }) => {
  
});
```

### Hybrid Tests

Combined API and UI:

```typescript
await productsApi.search('dress');
await productsPage.openFirstProduct();
```

## 🔄 CI/CD

- ✅ Push в main/master/develop
- ✅ Pull Request
- ✅ Schedule
- ✅ Manualy (workflow_dispatch)

## 🎯 Test Coverage

- ✅ Authentication (Login/Signup)
- ✅ Product Search
- ✅ Cart Operations
- ✅ Checkout Flow
- ✅ Payment Process
- ✅ Order Confirmation
- ✅ Edge Cases
- ✅ Negative Scenarios

## 📝 Examples

### Simple E2E Test

```typescript
test('complete purchase', async ({ hybridLoggedUser }) => {
  const { page } = hybridLoggedUser;
  
  await productsPage.open();
  await productsPage.openFirstProduct();
  await productPage.addToCart();
  await cartPage.proceedToCheckout();
  await checkoutPage.proceedToPayment();
  await paymentPage.completePayment();
  
  expect(await confirmationPage.isOrderPlaced()).toBeTruthy();
});
```

### Hybrid Test

```typescript
test('API → UI verification', async ({ productsApi, cartApi }) => {
  // Get data via API
  const products = await productsApi.getAll();
  
  // Add via Cart API
  await cartApi.addProduct(products[0].id, 2);
  
  // Verify in UI
  const cartItems = await cartApi.getCartItems();
  expect(cartItems[0].name).toBe(products[0].name);
});
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 👤 Author

Vlad K.

## 🙏 Acknowledgments

- [Playwright](https://playwright.dev/)
- [Automation Exercise](https://automationexercise.com/)
- [TypeScript](https://www.typescriptlang.org/)
