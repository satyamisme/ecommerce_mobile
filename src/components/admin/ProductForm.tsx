import { useState, useEffect, FormEvent } from 'react';
import { Product } from '../../types';

interface ProductFormProps {
  initialProduct?: Product;
  onSubmit: (data: Partial<Product>) // Using Partial<Product> for flexibility, can be more specific
    => Promise<void> | void;
  isSaving: boolean;
  submitButtonText?: string;
}

// Helper to ensure values are not undefined for controlled inputs
const ensureDefined = (value: any, defaultValue: any = '') => value === undefined || value === null ? defaultValue : value;

export default function ProductForm({
  initialProduct,
  onSubmit,
  isSaving,
  submitButtonText = 'Save Product',
}: ProductFormProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState<number | ''>('');
  const [originalPrice, setOriginalPrice] = useState<number | ''>('');
  const [discount, setDiscount] = useState<number | ''>('');
  const [stock, setStock] = useState<number | ''>('');
  const [category, setCategory] = useState(''); // Assuming category is a string, might be product.specs.category
  const [imageUrl, setImageUrl] = useState('');
  const [brand, setBrand] = useState('');
  const [featured, setFeatured] = useState(false);
  // For simplicity, 'images' array and 'specs' object are not fully editable in this form
  // but category is extracted from specs as an example

  useEffect(() => {
    if (initialProduct) {
      setName(ensureDefined(initialProduct.name));
      setDescription(ensureDefined(initialProduct.description));
      setPrice(ensureDefined(initialProduct.price, ''));
      setOriginalPrice(ensureDefined(initialProduct.originalPrice, ''));
      setDiscount(ensureDefined(initialProduct.discount, ''));
      setStock(ensureDefined(initialProduct.stock, ''));
      // Assuming category might be nested in specs for this form
      setCategory(ensureDefined(initialProduct.specs?.category, ''));
      setImageUrl(ensureDefined(initialProduct.image));
      setBrand(ensureDefined(initialProduct.brand));
      setFeatured(ensureDefined(initialProduct.featured, false));
    }
  }, [initialProduct]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const numericPrice = parseFloat(String(price));
    const numericOriginalPrice = originalPrice === '' ? numericPrice : parseFloat(String(originalPrice)); // Default to price if empty
    const numericDiscount = discount === '' ? 0 : parseFloat(String(discount)); // Default to 0 if empty
    const numericStock = parseInt(String(stock), 10);

    const productData: Partial<Product> = {
      name,
      description,
      price: isNaN(numericPrice) ? undefined : numericPrice,
      originalPrice: isNaN(numericOriginalPrice) ? undefined : numericOriginalPrice,
      discount: isNaN(numericDiscount) ? undefined : numericDiscount,
      stock: isNaN(numericStock) ? undefined : numericStock,
      image: imageUrl, // Renamed from imageUrl in form state to image in Product type
      brand,
      featured,
      // For category, we'd need to decide how to structure it back into specs if that's the source.
      // For now, if 'category' is a top-level concept for this form:
      specs: { ...(initialProduct?.specs || {}), category },
      // If your Product type doesn't have specs.category, adjust accordingly.
      // Or, if category is a new top-level field you're adding to Product:
      // category,
    };

    // Logic for originalPrice and discount consistency
    if (productData.originalPrice === undefined || productData.originalPrice < (productData.price || 0)) {
      productData.originalPrice = productData.price;
    }
    if (productData.discount === undefined) {
        productData.discount = (productData.originalPrice || 0) - (productData.price || 0);
    }
    if (productData.price !== undefined && productData.originalPrice !== undefined && productData.discount !== undefined) {
        if ( (productData.price + productData.discount) !== productData.originalPrice) {
            // Prioritize price and discount to calculate originalPrice
            productData.originalPrice = (productData.price || 0) + (productData.discount || 0);
        }
    }


    await onSubmit(productData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-neutral-700">Product Name</label>
        <input type="text" id="name" value={name} onChange={(e) => setName(e.target.value)} required className="mt-1 input w-full" />
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-neutral-700">Description</label>
        <textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} rows={4} className="mt-1 input w-full"></textarea>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="price" className="block text-sm font-medium text-neutral-700">Selling Price ($)</label>
          <input type="number" id="price" value={price} onChange={(e) => setPrice(parseFloat(e.target.value) || '')} required step="0.01" className="mt-1 input w-full" />
        </div>
        <div>
          <label htmlFor="originalPrice" className="block text-sm font-medium text-neutral-700">Original Price ($) (Optional)</label>
          <input type="number" id="originalPrice" value={originalPrice} onChange={(e) => setOriginalPrice(parseFloat(e.target.value) || '')} step="0.01" className="mt-1 input w-full" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="discount" className="block text-sm font-medium text-neutral-700">Discount ($) (Optional)</label>
          <input type="number" id="discount" value={discount} onChange={(e) => setDiscount(parseFloat(e.target.value) || '')} step="0.01" className="mt-1 input w-full" />
        </div>
        <div>
          <label htmlFor="stock" className="block text-sm font-medium text-neutral-700">Stock Quantity</label>
          <input type="number" id="stock" value={stock} onChange={(e) => setStock(parseInt(e.target.value, 10) || '')} required className="mt-1 input w-full" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="category" className="block text-sm font-medium text-neutral-700">Category</label>
          <input type="text" id="category" value={category} onChange={(e) => setCategory(e.target.value)} className="mt-1 input w-full" />
        </div>
        <div>
          <label htmlFor="brand" className="block text-sm font-medium text-neutral-700">Brand</label>
          <input type="text" id="brand" value={brand} onChange={(e) => setBrand(e.target.value)} className="mt-1 input w-full" />
        </div>
      </div>

      <div>
        <label htmlFor="imageUrl" className="block text-sm font-medium text-neutral-700">Image URL</label>
        <input type="text" id="imageUrl" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} className="mt-1 input w-full" />
      </div>

      <div className="flex items-center">
        <input id="featured" type="checkbox" checked={featured} onChange={(e) => setFeatured(e.target.checked)} className="h-4 w-4 rounded border-neutral-300 text-primary-600 focus:ring-primary-500" />
        <label htmlFor="featured" className="ml-2 block text-sm text-neutral-900">Featured Product</label>
      </div>

      <div>
        <button type="submit" className="btn-primary w-full py-2.5" disabled={isSaving}>
          {isSaving ? 'Saving...' : submitButtonText}
        </button>
      </div>
    </form>
  );
}
