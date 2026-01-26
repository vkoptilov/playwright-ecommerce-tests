import { ApiClient } from './apiClient.js';

export class ProductsApi {
  constructor(private client: ApiClient) {}

  async getAll() {
    console.log('📦 Getting all products');
    
    const response = await this.client.get('/api/productsList');
    
    if (!this.client.isSuccessful(response)) {
      throw new Error(`Failed to get products: ${response.status()}`);
    }
    
    const data = await this.client.getJSON(response);
    
    console.log(`✅ Got ${data.products?.length || 0} products`);
    
    return data;
  }

  async search(keyword: string) {
    console.log(`🔍 Searching products for: "${keyword}"`);
    
    const response = await this.client.post('/api/searchProduct', {
      form: {
        search_product: keyword
      }
    });
    
    if (!this.client.isSuccessful(response)) {
      throw new Error(`Failed to search products: ${response.status()}`);
    }
    
    const data = await this.client.getJSON(response);
    
    console.log(`✅ Found ${data.products?.length || 0} products for "${keyword}"`);
    
    return data;
  }

  async getBrands() {
    console.log('🏷️  Getting brands list');
    
    const response = await this.client.get('/api/brandsList');
    
    if (!this.client.isSuccessful(response)) {
      throw new Error(`Failed to get brands: ${response.status()}`);
    }
    
    const data = await this.client.getJSON(response);
    
    console.log(`✅ Got ${data.brands?.length || 0} brands`);
    
    return data;
  }

  async getById(productId: number) {
    const allProducts = await this.getAll();
    
    const product = allProducts.products?.find((p: any) => p.id === productId);
    
    if (!product) {
      throw new Error(`Product with ID ${productId} not found`);
    }
    
    console.log(`✅ Got product: ${product.name}`);
    
    return product;
  }
}