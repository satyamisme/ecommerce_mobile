import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Minus, Plus, Trash2, ShoppingBag } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import { motion } from 'framer-motion';

export default function CartPage() {
  const { cart, removeFromCart, updateQuantity } = useCart();
  const [isUpdating, setIsUpdating] = useState(false);

  const handleQuantityChange = async (itemId: string, newQuantity: number) => {
    setIsUpdating(true);
    await updateQuantity(itemId, newQuantity);
    setIsUpdating(false);
  };

  if (cart.items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="flex flex-col items-center justify-center text-center">
          <div className="mb-6 rounded-full bg-neutral-100 p-6">
            <ShoppingBag className="h-12 w-12 text-neutral-400" />
          </div>
          <h1 className="mb-4 text-2xl font-bold">Your cart is empty</h1>
          <p className="mb-8 text-neutral-600">
            Looks like you haven't added any items to your cart yet.
          </p>
          <Link
            to="/products"
            className="btn-primary"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-8 text-3xl font-bold">Shopping Cart</h1>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Cart Items */}
        <div className="lg:col-span-2">
          <div className="space-y-4">
            {cart.items.map((item) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="flex items-center gap-4 rounded-lg bg-white p-4 shadow-soft"
              >
                <Link to={`/products/${item.productId}`} className="shrink-0">
                  <img
                    src={item.product.image}
                    alt={item.product.name}
                    className="h-24 w-24 rounded-md object-cover"
                  />
                </Link>

                <div className="flex flex-1 flex-col">
                  <div className="flex items-start justify-between">
                    <div>
                      <Link
                        to={`/products/${item.productId}`}
                        className="text-lg font-medium text-neutral-900 hover:text-primary-500"
                      >
                        {item.product.name}
                      </Link>
                      <p className="text-sm text-neutral-500">{item.product.brand}</p>
                    </div>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="text-neutral-400 hover:text-error-500"
                      aria-label="Remove item"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>

                  <div className="mt-4 flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                        disabled={isUpdating || item.quantity <= 1}
                        className="rounded-full bg-neutral-100 p-1 text-neutral-600 transition-colors hover:bg-neutral-200 disabled:opacity-50"
                        aria-label="Decrease quantity"
                      >
                        <Minus className="h-4 w-4" />
                      </button>
                      <span className="w-8 text-center">{item.quantity}</span>
                      <button
                        onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                        disabled={isUpdating}
                        className="rounded-full bg-neutral-100 p-1 text-neutral-600 transition-colors hover:bg-neutral-200 disabled:opacity-50"
                        aria-label="Increase quantity"
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-medium text-neutral-900">
                        ${(item.price * item.quantity).toFixed(2)}
                      </div>
                      {item.quantity > 1 && (
                        <div className="text-sm text-neutral-500">
                          ${item.price.toFixed(2)} each
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Order Summary */}
        <div className="lg:sticky lg:top-20">
          <div className="rounded-lg bg-white p-6 shadow-soft">
            <h2 className="mb-4 text-xl font-semibold">Order Summary</h2>
            
            <div className="space-y-3 border-b border-neutral-200 pb-4">
              <div className="flex justify-between">
                <span className="text-neutral-600">Subtotal</span>
                <span className="font-medium">${cart.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-600">Tax</span>
                <span className="font-medium">${cart.tax.toFixed(2)}</span>
              </div>
            </div>
            
            <div className="mt-4 flex justify-between">
              <span className="text-lg font-semibold">Total</span>
              <span className="text-lg font-semibold">${cart.total.toFixed(2)}</span>
            </div>
            
            <Link
              to="/checkout"
              className="btn-primary mt-6 w-full py-3"
            >
              Proceed to Checkout
            </Link>
            
            <Link
              to="/products"
              className="btn-ghost mt-4 w-full"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}