import api from './api';

export function fetchProducts() {
  return api.get('/products');
}

export function fetchProduct(slug: string) {
  return api.get(`/products/${slug}`);
}
