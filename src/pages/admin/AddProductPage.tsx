import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ProductForm from '../../components/admin/ProductForm';
import * as mockApiService from '../../services/mockApiService';
import { Product } from '../../types'; // Omit is not directly used from Product in addProduct

export default function AddProductPage() {
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSubmit = async (data: Partial<Product>) => {
    setIsSaving(true);
    setError(null);
    try {
      // Ensure required fields for addProduct are present, even if Partial<Product> is broad.
      // mockApiService.addProduct expects Omit<Product, 'id' | 'createdAt' | 'updatedAt'>
      // So, we need to ensure 'name', 'price', 'stock', etc., are there.
      // The form validation (required fields) should handle this for the most part.
      // The 'as any' is a temporary workaround if types don't perfectly align,
      // but ideally, data should be shaped correctly.

      const productDataForApi = {
        name: data.name || 'Unnamed Product',
        description: data.description || '',
        price: data.price === undefined ? 0 : data.price, // Default price to 0 if not set
        originalPrice: data.originalPrice, // Will be handled by form logic or service
        discount: data.discount, // Will be handled by form logic or service
        stock: data.stock === undefined ? 0 : data.stock, // Default stock to 0
        image: data.image || '',
        images: data.images || (data.image ? [data.image] : []), // Ensure images array
        brand: data.brand || 'Unknown Brand',
        model: data.model || 'N/A', // Add default for model if not in form
        specs: data.specs || { category: 'General' }, // Add default for specs
        featured: data.featured || false,
        ratings: data.ratings || { average: 0, count: 0 }, // Add default for ratings
      };

      await mockApiService.addProduct(productDataForApi as Omit<Product, 'id' | 'createdAt' | 'updatedAt'>);
      // TODO: Show success toast/message
      navigate('/admin/products');
    } catch (err) {
      console.error('Failed to add product:', err);
      setError((err as Error).message || 'Failed to add product. Please try again.');
      // TODO: Show error toast/message
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Add New Product</h1>
      {error && (
        <div className="mb-4 rounded-md bg-red-50 p-4 text-red-700">
          <p>{error}</p>
        </div>
      )}
      <div className="max-w-2xl rounded-lg border border-neutral-200 bg-white p-6 shadow-sm">
        <ProductForm onSubmit={handleSubmit} isSaving={isSaving} submitButtonText="Add Product" />
      </div>
    </div>
  );
}
