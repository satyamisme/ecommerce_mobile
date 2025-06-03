import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Cart, CartItem, Product } from '../types';
import { useAuth } from './AuthContext';

interface CartContextType {
  cart: Cart;
  addToCart: (product: Product, quantity: number) => void;
  removeFromCart: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  itemCount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = 'cart';

const createEmptyCart = (userId?: string): Cart => ({
  id: `cart-${Date.now()}`,
  userId: userId || 'guest',
  items: [],
  subtotal: 0,
  tax: 0,
  total: 0,
});

export function CartProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [cart, setCart] = useState<Cart>(() => {
    // Try to load cart from localStorage
    const savedCart = localStorage.getItem(CART_STORAGE_KEY);
    if (savedCart) {
      try {
        return JSON.parse(savedCart);
      } catch (err) {
        console.error('Failed to parse saved cart', err);
      }
    }
    return createEmptyCart(user?.id);
  });

  // Update cart when user changes
  useEffect(() => {
    if (user?.id && cart.userId !== user.id) {
      // If user logs in and cart is for guest, assign the cart to the user
      if (cart.userId === 'guest' && cart.items.length > 0) {
        setCart({
          ...cart,
          userId: user.id,
        });
      } else {
        // If user changes or logs out, create a new cart
        setCart(createEmptyCart(user.id));
      }
    } else if (!user && cart.userId !== 'guest') {
      // If user logs out, create a guest cart
      setCart(createEmptyCart());
    }
  }, [user, cart.userId]);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
  }, [cart]);

  // Calculate totals whenever items change
  useEffect(() => {
    const subtotal = cart.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const tax = subtotal * 0.08; // 8% tax
    const total = subtotal + tax;
    
    setCart(prev => ({
      ...prev,
      subtotal,
      tax,
      total,
    }));
  }, [cart.items]);

  const addToCart = (product: Product, quantity: number) => {
    setCart(prev => {
      // Check if product already in cart
      const existingItemIndex = prev.items.findIndex(item => item.productId === product.id);
      
      if (existingItemIndex >= 0) {
        // Update quantity if product already in cart
        const updatedItems = [...prev.items];
        updatedItems[existingItemIndex] = {
          ...updatedItems[existingItemIndex],
          quantity: updatedItems[existingItemIndex].quantity + quantity,
        };
        
        return {
          ...prev,
          items: updatedItems,
        };
      } else {
        // Add new item to cart
        const newItem: CartItem = {
          id: `item-${Date.now()}-${product.id}`,
          productId: product.id,
          product,
          quantity,
          price: product.price,
        };
        
        return {
          ...prev,
          items: [...prev.items, newItem],
        };
      }
    });
  };

  const removeFromCart = (itemId: string) => {
    setCart(prev => ({
      ...prev,
      items: prev.items.filter(item => item.id !== itemId),
    }));
  };

  const updateQuantity = (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(itemId);
      return;
    }
    
    setCart(prev => ({
      ...prev,
      items: prev.items.map(item => 
        item.id === itemId ? { ...item, quantity } : item
      ),
    }));
  };

  const clearCart = () => {
    setCart(createEmptyCart(user?.id));
  };

  const itemCount = cart.items.reduce((count, item) => count + item.quantity, 0);

  return (
    <CartContext.Provider value={{ 
      cart, 
      addToCart, 
      removeFromCart, 
      updateQuantity, 
      clearCart,
      itemCount,
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}