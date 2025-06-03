import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShoppingCart, Heart, ChevronLeft, Star } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
// import { mockProducts } from '../data/mockData'; // Removed
import * as mockApiService from '../services/mockApiService'; // Added
import { Product } from '../types';
import LoadingSpinner from '../components/ui/LoadingSpinner';

export default function ProductDetailPage() {
  const { id } = useParams();
  const { addToCart } = useCart();
  const [product, setProduct] = useState<Product | null>(null);
  const [selectedImage, setSelectedImage] = useState<string>('');
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProductDetails = async () => {
      if (!id) {
        setLoading(false);
        setProduct(null); // Or handle as an error state
        return;
      }
      setLoading(true);
      try {
        const foundProduct = await mockApiService.getProductById(id);
        if (foundProduct) {
          setProduct(foundProduct);
          // Ensure images array is not empty before accessing index 0
          if (foundProduct.images && foundProduct.images.length > 0) {
            setSelectedImage(foundProduct.images[0]);
          } else if (foundProduct.image) { // Fallback to main image if images array is empty
            setSelectedImage(foundProduct.image);
          }
        } else {
          setProduct(null); // Product not found
        }
      } catch (error) {
        console.error(`Failed to fetch product with id ${id}:`, error);
        setProduct(null); // Set product to null or handle error state
      } finally {
        setLoading(false);
      }
    };

    fetchProductDetails();
  }, [id]);

  const handleAddToCart = () => {
    if (product) {
      addToCart(product, quantity);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="mb-4 text-2xl font-bold">Product Not Found</h1>
          <p className="mb-6 text-neutral-600">The product you're looking for doesn't exist.</p>
          <Link to="/products" className="btn-primary">
            Back to Products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <div className="mb-6">
        <Link
          to="/products"
          className="flex items-center text-sm text-neutral-600 hover:text-primary-500"
        >
          <ChevronLeft className="mr-1 h-4 w-4" />
          Back to Products
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        {/* Product Images */}
        <div className="space-y-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="aspect-square overflow-hidden rounded-xl bg-white"
          >
            <img
              src={selectedImage}
              alt={product.name}
              className="h-full w-full object-cover"
            />
          </motion.div>
          <div className="grid grid-cols-4 gap-4">
            {product.images.map((image, index) => (
              <button
                key={index}
                onClick={() => setSelectedImage(image)}
                className={`aspect-square overflow-hidden rounded-lg border-2 ${
                  selectedImage === image
                    ? 'border-primary-500'
                    : 'border-transparent'
                }`}
              >
                <img
                  src={image}
                  alt={`${product.name} view ${index + 1}`}
                  className="h-full w-full object-cover"
                />
              </button>
            ))}
          </div>
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          <div>
            <h1 className="mb-2 text-3xl font-bold">{product.name}</h1>
            <div className="flex items-center space-x-4">
              <div className="flex items-center">
                {Array.from({ length: 5 }).map((_, index) => (
                  <Star
                    key={index}
                    className={`h-5 w-5 ${
                      index < Math.floor(product.ratings.average)
                        ? 'fill-accent-500 text-accent-500'
                        : 'text-neutral-300'
                    }`}
                  />
                ))}
                <span className="ml-2 text-sm text-neutral-600">
                  ({product.ratings.count} reviews)
                </span>
              </div>
              <button
                className="flex items-center space-x-1 text-neutral-600 hover:text-accent-500"
                aria-label="Add to wishlist"
              >
                <Heart className="h-5 w-5" />
                <span className="text-sm">Add to Wishlist</span>
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-baseline space-x-2">
              <span className="text-3xl font-bold">${product.price}</span>
              {product.originalPrice && product.originalPrice > product.price && (
                <span className="text-lg text-neutral-500 line-through">
                  ${product.originalPrice}
                </span>
              )}
            </div>
            {product.discount && product.discount > 0 && (
              <span className="inline-block rounded-full bg-accent-500 px-2 py-1 text-xs font-semibold text-white">
                Save ${product.discount}
              </span>
            )}
          </div>

          {/* Stock Information */}
          <div className="my-4">
            {product.stock > 0 ? (
              <p className="text-sm text-green-600">
                Availability: {product.stock} in stock
                {product.stock < 5 && product.stock > 0 && (
                  <span className="ml-2 font-semibold text-orange-500">Only {product.stock} left!</span>
                )}
              </p>
            ) : (
              <p className="text-sm font-semibold text-red-500">Out of Stock</p>
            )}
          </div>

          <div className="space-y-4 border-y border-neutral-200 py-6">
            <div className="flex items-center justify-between">
              <span className="font-medium">Quantity</span>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="rounded-md border border-neutral-300 p-2 hover:bg-neutral-100"
                >
                  -
                </button>
                <span className="w-12 text-center">{quantity}</span>
                <button
                  onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                  className="rounded-md border border-neutral-300 p-2 hover:bg-neutral-100"
                >
                  +
                </button>
              </div>
            </div>
            <button
              onClick={handleAddToCart}
              className={`btn-primary w-full space-x-2 py-3 ${product.stock === 0 ? 'cursor-not-allowed bg-neutral-400 hover:bg-neutral-400' : ''}`}
              disabled={product.stock === 0}
            >
              <ShoppingCart className="h-5 w-5" />
              <span>{product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}</span>
            </button>
          </div>

          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Specifications</h2>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-neutral-600">Display</span>
                  <span className="font-medium">{product.specs.display}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-600">Processor</span>
                  <span className="font-medium">{product.specs.processor}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-600">RAM</span>
                  <span className="font-medium">{product.specs.ram}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-600">Storage</span>
                  <span className="font-medium">{product.specs.storage}</span>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-neutral-600">Battery</span>
                  <span className="font-medium">{product.specs.battery}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-600">OS</span>
                  <span className="font-medium">{product.specs.os}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-600">Color</span>
                  <span className="font-medium">{product.specs.color}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-600">Weight</span>
                  <span className="font-medium">{product.specs.weight}</span>
                </div>
              </div>
            </div>
          </div>

          <div>
            <h2 className="mb-2 text-xl font-semibold">Description</h2>
            <p className="text-neutral-600">{product.description}</p>
          </div>
        </div>
      </div>
    </div>
  );
}