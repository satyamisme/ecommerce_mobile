import { Product, User, Order, OrderItem } from '../types';
import { mockProducts, mockUsers, mockOrders } from '../data/mockData';

// In-memory copies
let products: Product[] = JSON.parse(JSON.stringify(mockProducts));
let users: User[] = JSON.parse(JSON.stringify(mockUsers));
let orders: Order[] = JSON.parse(JSON.stringify(mockOrders));

const SIMULATED_DELAY = 500; // ms

// Helper to simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// --- Product Services ---
export const getProducts = async (filters?: { featured?: boolean; brand?: string; model?: string }): Promise<Product[]> => {
  await delay(SIMULATED_DELAY);
  let filteredProducts = products;

  if (filters?.featured !== undefined) {
    filteredProducts = filteredProducts.filter(p => p.featured === filters.featured);
  }
  if (filters?.brand) {
    filteredProducts = filteredProducts.filter(p => p.brand.toLowerCase() === filters.brand?.toLowerCase());
  }
  // Add more filters as needed (e.g., model, price range)

  return JSON.parse(JSON.stringify(filteredProducts)); // Return deep copy
};

export const getProductById = async (id: string): Promise<Product | undefined> => {
  await delay(SIMULATED_DELAY);
  const product = products.find(p => p.id === id);
  return product ? JSON.parse(JSON.stringify(product)) : undefined;
};

export const addProduct = async (productData: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>): Promise<Product> => {
  await delay(SIMULATED_DELAY);
  const newProduct: Product = {
    ...productData,
    id: `product-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  products.push(newProduct);
  return JSON.parse(JSON.stringify(newProduct));
};

export const updateProduct = async (id: string, updates: Partial<Omit<Product, 'id' | 'createdAt'>>): Promise<Product | undefined> => {
  await delay(SIMULATED_DELAY);
  const productIndex = products.findIndex(p => p.id === id);
  if (productIndex === -1) {
    return undefined;
  }
  const updatedProduct = {
    ...products[productIndex],
    ...updates,
    updatedAt: new Date().toISOString(),
  };
  products[productIndex] = updatedProduct;
  return JSON.parse(JSON.stringify(updatedProduct));
};

export const deleteProduct = async (id: string): Promise<boolean> => {
  await delay(SIMULATED_DELAY);
  const initialLength = products.length;
  products = products.filter(p => p.id !== id);
  return products.length < initialLength;
};

export const updateStock = async (productId: string, quantityChange: number): Promise<Product | undefined> => {
  await delay(SIMULATED_DELAY);
  const productIndex = products.findIndex(p => p.id === productId);
  if (productIndex === -1) {
    return undefined;
  }
  const product = products[productIndex];
  if (product.stock + quantityChange < 0) {
    throw new Error('Not enough stock');
  }
  product.stock += quantityChange;
  product.updatedAt = new Date().toISOString();
  products[productIndex] = product;
  return JSON.parse(JSON.stringify(product));
};

// --- User Services ---
export const getUsers = async (): Promise<User[]> => {
  await delay(SIMULATED_DELAY);
  return JSON.parse(JSON.stringify(users));
};

export const getUserByEmail = async (email: string): Promise<User | undefined> => {
  await delay(SIMULATED_DELAY);
  const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());
  return user ? JSON.parse(JSON.stringify(user)) : undefined;
};

// --- Order Services ---
export const getOrders = async (userId?: string): Promise<Order[]> => {
  await delay(SIMULATED_DELAY);
  let userOrders = orders;
  if (userId) {
    userOrders = orders.filter(o => o.userId === userId);
  }
  return JSON.parse(JSON.stringify(userOrders));
};

export const addOrder = async (orderData: Omit<Order, 'id' | 'createdAt' | 'updatedAt'>): Promise<Order> => {
  await delay(SIMULATED_DELAY);
  const newOrder: Order = {
    ...orderData,
    id: `order-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  orders.push(newOrder);
  return JSON.parse(JSON.stringify(newOrder));
};

// TODO: Potentially add getOrderById, updateOrderStatus, etc.
