export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'user';
  createdAt: string;
  avatar?: string;
}

export interface Product {
  id: string;
  name: string;
  brand: string;
  model: string;
  description: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  stock: number;
  image: string;
  images: string[];
  specs: {
    display: string;
    camera: string;
    processor: string;
    ram: string;
    storage: string;
    battery: string;
    os: string;
    connectivity: string[];
    color: string;
    dimensions: string;
    weight: string;
    releaseDate: string;
  };
  ratings: {
    average: number;
    count: number;
  };
  featured: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CartItem {
  id: string;
  productId: string;
  product: Product;
  quantity: number;
  price: number;
}

export interface Cart {
  id: string;
  userId: string;
  items: CartItem[];
  subtotal: number;
  tax: number;
  total: number;
}

// New OrderItem interface
export interface OrderItem {
  productId: string;
  productName: string; // Denormalized for easier display
  quantity: number;
  price: number; // Price at the time of order
}

export interface Order {
  id: string;
  userId: string;
  items: OrderItem[]; // Changed from CartItem[]
  subtotal: number; // Sum of OrderItem.price * OrderItem.quantity
  tax: number; // Calculated on subtotal
  shipping?: number; // Optional shipping cost
  totalAmount: number; // subtotal + tax + shipping
  paymentMethod?: string; // Optional
  paymentStatus?: 'pending' | 'paid' | 'failed'; // Optional
  shippingAddress?: Address; // Optional, using existing Address type
  status: 'Pending' | 'Shipped' | 'Delivered' | 'Cancelled'; // Simplified status
  trackingNumber?: string; // Optional
  notes?: string; // Optional
  createdAt: string;
  updatedAt: string;
}

export interface Address {
  id: string;
  userId: string;
  name: string;
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phone: string;
  isDefault: boolean;
}

export interface PaymentMethod {
  id: string;
  userId: string;
  type: 'card' | 'paypal' | 'other';
  cardBrand?: string;
  last4?: string;
  expiryMonth?: number;
  expiryYear?: number;
  isDefault: boolean;
}

export interface Invitation {
  id: string;
  email: string;
  code: string;
  senderId: string;
  status: 'pending' | 'accepted' | 'expired';
  expiresAt: string;
  createdAt: string;
}