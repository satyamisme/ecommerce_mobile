import { Link } from 'react-router-dom';
import { ShoppingCart, Heart, CheckCircle } from 'lucide-react'; // Added CheckCircle
import { Product } from '../../types';
import { useCart } from '../../contexts/CartContext';
import { useState } from 'react'; // Added useState
import { motion } from 'framer-motion';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();
  const [justAdded, setJustAdded] = useState(false);
  
  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (product.stock === 0 || justAdded) return;

    addToCart(product, 1);
    setJustAdded(true);
    setTimeout(() => {
      setJustAdded(false);
    }, 2000); // Revert after 2 seconds
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Link 
        to={`/products/${product.id}`} 
        className="card group relative flex h-full flex-col overflow-hidden"
      >
        {/* Discount tag */}
        {product.discount && product.originalPrice && product.originalPrice > 0 && (
          <div className="absolute left-4 top-4 z-10 rounded-full bg-accent-500 px-2 py-1 text-xs font-bold text-white">
            -{Math.round((product.discount / product.originalPrice) * 100)}%
          </div>
        )}
        
        {/* Favorite button */}
        <button 
          className="absolute right-4 top-4 z-10 rounded-full bg-white p-1.5 text-neutral-500 shadow-md transition-colors hover:text-accent-500"
          onClick={(e) => e.preventDefault()}
          aria-label="Add to favorites"
        >
          <Heart className="h-4 w-4" />
        </button>
        
        {/* Image */}
        <div className="aspect-square overflow-hidden bg-neutral-100">
          <img
            src={product.image}
            alt={product.name}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </div>
        
        {/* Content */}
        <div className="flex flex-1 flex-col p-4">
          <div className="mb-2">
            <span className="text-xs font-medium text-primary-500">{product.brand}</span>
            <h3 className="text-sm font-medium text-neutral-900">{product.name}</h3>
          </div>
          
          <div className="mt-auto flex items-center justify-between">
            <div className="flex items-center">
              <span className="text-sm font-bold text-neutral-900">${product.price}</span>
              {product.originalPrice && product.originalPrice > product.price && (
                <span className="ml-2 text-xs text-neutral-500 line-through">
                  ${product.originalPrice}
                </span>
              )}
            </div>
            
            <button
              onClick={handleAddToCart}
              disabled={product.stock === 0}
              className={`rounded-full p-2 transition-colors
                ${product.stock === 0
                  ? 'bg-neutral-200 text-neutral-400 cursor-not-allowed'
                  : 'bg-neutral-100 text-neutral-700 hover:bg-primary-500 hover:text-white'
                }`}
              aria-label={product.stock === 0 ? "Out of stock" : justAdded ? "Added to cart" : "Add to cart"}
            >
              {justAdded ? <CheckCircle className="h-4 w-4 text-green-500" /> : <ShoppingCart className="h-4 w-4" />}
            </button>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}