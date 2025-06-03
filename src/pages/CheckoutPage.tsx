import { useState, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import * as mockApiService from '../services/mockApiService';
import { Order, OrderItem, Address } from '../types'; // Ensure Address is defined or simplify
import LoadingSpinner from '../components/ui/LoadingSpinner';

export default function CheckoutPage() {
  const { cart, clearCart, itemCount } = useCart();
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [shippingDetails, setShippingDetails] = useState({
    name: user?.name || '',
    street: '',
    city: '',
    postalCode: '',
    country: '',
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setShippingDetails(prev => ({ ...prev, [name]: value }));
  };

  const handlePlaceOrder = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);

    if (!isAuthenticated || !user) {
      setError('You must be logged in to place an order.');
      navigate('/login?redirect=/checkout');
      return;
    }

    if (itemCount === 0) {
      setError('Your cart is empty.');
      return;
    }

    setIsProcessing(true);

    const orderItems: OrderItem[] = cart.items.map(item => ({
      productId: item.productId,
      productName: item.product.name, // Denormalized product name
      quantity: item.quantity,
      price: item.price, // Price at the time of adding to cart
    }));

    // Simplified Address structure for this form
    const shippingAddress: Partial<Address> = {
      name: shippingDetails.name,
      street: shippingDetails.street,
      city: shippingDetails.city,
      postalCode: shippingDetails.postalCode,
      country: shippingDetails.country,
      // Other Address fields like id, userId, phone, isDefault would be set by a real backend/address management system
    };

    const orderData: Omit<Order, 'id' | 'createdAt' | 'updatedAt'> = {
      userId: user.id,
      items: orderItems,
      subtotal: cart.subtotal,
      tax: cart.tax,
      shipping: 5.00, // Example fixed shipping, could be calculated
      totalAmount: cart.total + 5.00, // Add shipping to total
      status: 'Pending',
      shippingAddress: shippingAddress as Address, // Cast if Address type expects more fields; ensure mockApiService handles this
      // paymentMethod and paymentStatus would be set after payment integration
    };

    try {
      const newOrder = await mockApiService.addOrder(orderData);

      // Update stock for each item
      for (const item of cart.items) {
        try {
          // Note: quantityChange should be negative for stock reduction
          await mockApiService.updateStock(item.productId, -item.quantity);
        } catch (stockError) {
          console.warn(`Failed to update stock for product ${item.productId}:`, stockError);
          // Decide if this is a critical failure or just a warning
          // For now, we'll just warn and continue
        }
      }

      clearCart();
      setSuccessMessage(`Order placed successfully! Your Order ID is: ${newOrder.id}`);
      // Optional: Redirect after a delay
      setTimeout(() => {
        navigate('/');
      }, 3000);

    } catch (err) {
      console.error('Failed to place order:', err);
      setError((err as Error).message || 'Failed to place your order. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  if (!isAuthenticated) {
     // This check can be part of a ProtectedRoute wrapper in a real app
    navigate('/login?redirect=/checkout');
    return <LoadingSpinner />; // Or some other placeholder while redirecting
  }


  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">Checkout</h1>

      {successMessage && (
        <div className="mb-6 rounded-md bg-green-50 p-4 text-center text-green-700">
          <p>{successMessage}</p>
        </div>
      )}

      {error && (
        <div className="mb-6 rounded-md bg-red-50 p-4 text-center text-red-700">
          <p>{error}</p>
        </div>
      )}

      {!successMessage && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Order Summary */}
          <div className="md:col-span-1 order-last md:order-first rounded-lg border border-neutral-200 bg-white p-6 shadow-sm h-fit">
            <h2 className="text-xl font-semibold mb-4 border-b pb-2">Order Summary</h2>
            {itemCount === 0 ? (
              <p>Your cart is empty.</p>
            ) : (
              <>
                {cart.items.map(item => (
                  <div key={item.id} className="flex justify-between items-center py-2 border-b last:border-b-0">
                    <div>
                      <p className="font-medium">{item.product.name}</p>
                      <p className="text-sm text-neutral-600">Qty: {item.quantity}</p>
                    </div>
                    <p className="text-neutral-700">${(item.price * item.quantity).toFixed(2)}</p>
                  </div>
                ))}
                <div className="mt-4 space-y-1 border-t pt-4">
                  <div className="flex justify-between text-sm text-neutral-600"><span>Subtotal:</span><span>${cart.subtotal.toFixed(2)}</span></div>
                  <div className="flex justify-between text-sm text-neutral-600"><span>Tax (8%):</span><span>${cart.tax.toFixed(2)}</span></div>
                  <div className="flex justify-between text-sm text-neutral-600"><span>Shipping:</span><span>$5.00</span></div>
                  <div className="flex justify-between text-lg font-bold"><span>Total:</span><span>${(cart.total + 5.00).toFixed(2)}</span></div>
                </div>
              </>
            )}
          </div>

          {/* Shipping Details Form */}
          <div className="md:col-span-2 rounded-lg border border-neutral-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-semibold mb-6">Shipping Details</h2>
            <form onSubmit={handlePlaceOrder} className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-neutral-700">Full Name</label>
                <input type="text" name="name" id="name" value={shippingDetails.name} onChange={handleInputChange} required className="mt-1 input w-full" />
              </div>
              <div>
                <label htmlFor="street" className="block text-sm font-medium text-neutral-700">Street Address</label>
                <input type="text" name="street" id="street" value={shippingDetails.street} onChange={handleInputChange} required className="mt-1 input w-full" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="city" className="block text-sm font-medium text-neutral-700">City</label>
                  <input type="text" name="city" id="city" value={shippingDetails.city} onChange={handleInputChange} required className="mt-1 input w-full" />
                </div>
                <div>
                  <label htmlFor="postalCode" className="block text-sm font-medium text-neutral-700">Postal Code</label>
                  <input type="text" name="postalCode" id="postalCode" value={shippingDetails.postalCode} onChange={handleInputChange} required className="mt-1 input w-full" />
                </div>
              </div>
              <div>
                <label htmlFor="country" className="block text-sm font-medium text-neutral-700">Country</label>
                <input type="text" name="country" id="country" value={shippingDetails.country} onChange={handleInputChange} required className="mt-1 input w-full" />
              </div>

              <button
                type="submit"
                className="btn-primary w-full py-3 mt-6"
                disabled={isProcessing || itemCount === 0 || !!successMessage}
              >
                {isProcessing ? <LoadingSpinner size="small" /> : 'Place Order'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
