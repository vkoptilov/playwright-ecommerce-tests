export const testData = {
  users: {
    valid: {
      name: 'Test User',
      email: 'testVkop@example.com',
      password: '123456',
      title: 'Mr',
      birth_date: '15',
      birth_month: '5',
      birth_year: '1990',
      firstName: 'John',
      lastName: 'Doe',
      company: 'Test Company',
      address: '123 Test Street',
      address2: 'Apt 4B',
      country: 'United States',
      state: 'California',
      city: 'Los Angeles',
      zipcode: '90001',
      mobile_number: '+1234567890'
    },
    invalid: {
      email: 'invalid@email',
      password: '123',
    }
  },

  search: {
    validQueries: ['dress', 'jeans', 'top', 'shirt'],
    invalidQueries: ['', 'xyzabc123notexist'],
    category: {
      women: 'Women',
      men: 'Men',
      kids: 'Kids'
    }
  },
 
  cart: {
    products: [
      { id: 1, name: 'Blue Top', quantity: 2, price: 500 },
      { id: 2, name: 'Men Tshirt', quantity: 1, price: 400 },
    ]
  },
 
  payment: {
    nameOnCard: 'John Doe',
    cardNumber: '4111111111111111',
    cvc: '123',
    expiryMonth: '12',
    expiryYear: '2028'
  },
 
  promoCodes: {
    valid: 'SAVE10',
    invalid: 'EXPIRED123',
    empty: ''
  }
};

export type User = typeof testData.users.valid;
export type PaymentInfo = typeof testData.payment;

export function generateUniqueUser(): User {
  const timestamp = Date.now();
  const randomId = Math.floor(Math.random() * 1000);
  
  return {
    ...testData.users.valid,
    name: `Test User ${timestamp}`,
    email: `testuser_${timestamp}_${randomId}@example.com`,
    firstName: `John${randomId}`,
    lastName: `Doe${timestamp}`,
  };
}