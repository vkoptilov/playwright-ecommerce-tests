# 🎭 Playwright E-commerce Test Automation

![Playwright Tests](https://github.com/YOUR_USERNAME/playwright-ecommerce-tests/actions/workflows/playwright.yml/badge.svg)
![Smoke Tests](https://github.com/YOUR_USERNAME/playwright-ecommerce-tests/actions/workflows/smoke.yml/badge.svg)

Полноценный фреймворк для автоматизации тестирования e-commerce сайта с использованием Playwright + TypeScript.

## 🚀 Особенности

- ✅ **Page Object Model** — чистая архитектура
- ✅ **Fixtures** — переиспользуемые компоненты
- ✅ **Hybrid Tests** — API + UI тестирование
- ✅ **API Client** — работа с REST API
- ✅ **Custom Utilities** — assertions и waiters
- ✅ **CI/CD** — GitHub Actions
- ✅ **Multi-browser** — Chromium, Firefox, WebKit
- ✅ **Parallel Execution** — быстрое выполнение

## 📁 Структура проекта

```
playwright-ecommerce-tests/
├── tests/
│   ├── api/              # API тесты
│   ├── ui/               # UI тесты
│   ├── hybrid/           # Hybrid (API + UI) тесты
│   ├── e2e/              # End-to-end сценарии
│   └── architecture/     # Архитектурные тесты
├── pages/                # Page Objects
├── api/                  # API клиенты
├── fixtures/             # Playwright fixtures
├── data/                 # Тестовые данные и builders
├── utils/                # Утилиты (assertions, waiters)
└── .github/workflows/    # CI/CD конфигурация
```

## 🛠️ Установка

```bash
# Клонировать репозиторий
git clone https://github.com/YOUR_USERNAME/playwright-ecommerce-tests.git
cd playwright-ecommerce-tests

# Установить зависимости
npm install

# Установить браузеры
npx playwright install
```

## 🧪 Запуск тестов

```bash
# Все тесты
npm test

# Smoke тесты
npm run test:smoke

# API тесты
npm run test:api

# E2E тесты
npm run test:e2e

# Hybrid тесты
npm run test:hybrid

# Конкретный браузер
npm run test:chromium

# UI режим (интерактивный)
npm run test:ui

# Headed режим (видно браузер)
npm run test:headed
```

## 📊 Отчёты

```bash
# Открыть HTML отчёт
npm run report
```

## 🏗️ Архитектура

### Page Object Model

Все страницы наследуются от `BasePage`:

```typescript
export class ProductsPage extends BasePage {
  async openFirstProduct() {
    // ...
  }
}
```

### Fixtures

Переиспользуемые компоненты для тестов:

```typescript
test('my test', async ({ hybridLoggedUser, productsApi }) => {
  // Пользователь уже залогинен!
  // API client готов к использованию!
});
```

### Hybrid Tests

Комбинируем API и UI:

```typescript
// Подготовка данных через API (быстро)
await productsApi.search('dress');

// Проверка в UI (надёжно)
await productsPage.openFirstProduct();
```

## 🔄 CI/CD

Тесты автоматически запускаются на:

- ✅ Push в main/master/develop
- ✅ Pull Request
- ✅ Schedule (ежедневно в 2:00 AM)
- ✅ Вручную (workflow_dispatch)

### Matrix Strategy

Тесты выполняются параллельно на:
- 3 браузерах (Chromium, Firefox, WebKit)
- 3 shards (разделение тестов на части)

## 📈 Статистика тестов

| Категория | Количество |
|-----------|------------|
| API Tests | 15+ |
| UI Tests | 10+ |
| Hybrid Tests | 12+ |
| E2E Tests | 16+ |
| **TOTAL** | **50+** |

## 🎯 Test Coverage

- ✅ Authentication (Login/Signup)
- ✅ Product Search
- ✅ Cart Operations
- ✅ Checkout Flow
- ✅ Payment Process
- ✅ Order Confirmation
- ✅ Edge Cases
- ✅ Negative Scenarios

## 📝 Примеры тестов

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

## 📄 License

MIT License

## 👤 Author

Your Name

## 🙏 Acknowledgments

- [Playwright](https://playwright.dev/)
- [Automation Exercise](https://automationexercise.com/)
- [TypeScript](https://www.typescriptlang.org/)