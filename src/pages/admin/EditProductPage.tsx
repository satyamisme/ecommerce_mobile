import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ProductForm from '../../components/admin/ProductForm';
import * as mockApiService from '../../services/mockApiService';
import { Product } from '../../types';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

export default function EditProductPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      setIsLoading(false);
      setError('No product ID provided.');
      return;
    }

    const fetchProduct = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const fetchedProduct = await mockApiService.getProductById(id);
        if (fetchedProduct) {
          setProduct(fetchedProduct);
        } else {
          setError('Product not found.');
        }
      } catch (err) {
        console.error(`Failed to fetch product ${id}:`, err);
        setError('Failed to load product details.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleSubmit = async (data: Partial<Product>) => {
    if (!id) return;

    setIsSaving(true);
    setError(null);
    try {
      await mockApiService.updateProduct(id, data);
      // TODO: Show success toast/message
      navigate('/admin/products');
    } catch (err) {
      console.error(`Failed to update product ${id}:`, err);
      setError((err as Error).message || 'Failed to update product. Please try again.');
      // TODO: Show error toast/message
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-200px)]">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  if (error && !product) { // Show error prominently if product couldn't be loaded
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <p className="text-red-500">{error}</p>
        <button onClick={() => navigate('/admin/products')} className="mt-4 btn-secondary">
          Back to Products
        </button>
      </div>
    );
  }

  if (!product) { // Should be caught by error state above if loading is done
     return (
      <div className="container mx-auto px-4 py-8 text-center">
        <p className="text-neutral-600">Product not found or could not be loaded.</p>
         <button onClick={() => navigate('/admin/products')} className="mt-4 btn-secondary">
          Back to Products
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Edit Product</h1>
      {error && ( // Show non-critical errors (e.g. save error) above the form
        <div className="mb-4 rounded-md bg-red-50 p-4 text-red-700">
          <p>{error}</p>
        </div>
      )}
      <div className="max-w-2xl rounded-lg border border-neutral-200 bg-white p-6 shadow-sm">
        <ProductForm
          initialProduct={product}
          onSubmit={handleSubmit}
          isSaving={isSaving}
          submitButtonText="Update Product"
        />
      </div>
    </div>
  );
}
