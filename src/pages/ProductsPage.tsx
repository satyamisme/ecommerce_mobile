import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { SlidersHorizontal, Search } from 'lucide-react';
import ProductCard from '../components/ui/ProductCard';
import { mockProducts } from '../data/mockData';
import { Product } from '../types';

export default function ProductsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    brand: searchParams.get('brand') || '',
    priceRange: '',
    sortBy: 'featured',
  });
  
  useEffect(() => {
    // Apply initial brand filter from URL if present
    const brandFromUrl = searchParams.get('brand');
    if (brandFromUrl) {
      setFilters(prev => ({ ...prev, brand: brandFromUrl }));
    }
    
    setProducts(mockProducts);
  }, [searchParams]);
  
  useEffect(() => {
    let result = [...products];
    
    // Apply brand filter
    if (filters.brand) {
      result = result.filter(product => 
        product.brand.toLowerCase() === filters.brand.toLowerCase()
      );
    }
    
    // Apply price range filter
    if (filters.priceRange) {
      const [min, max] = filters.priceRange.split('-').map(Number);
      result = result.filter(product => 
        product.price >= min && (max ? product.price <= max : true)
      );
    }
    
    // Apply search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(product => 
        product.name.toLowerCase().includes(query) || 
        product.brand.toLowerCase().includes(query) ||
        product.description.toLowerCase().includes(query)
      );
    }
    
    // Apply sorting
    switch (filters.sortBy) {
      case 'price-asc':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'newest':
        result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
      case 'featured':
      default:
        result.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
        break;
    }
    
    setFilteredProducts(result);
    
    // Update URL with brand filter if present
    if (filters.brand) {
      setSearchParams({ brand: filters.brand });
    } else {
      setSearchParams({});
    }
  }, [products, filters, searchQuery, setSearchParams]);
  
  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Search is applied via the useEffect above
  };
  
  const clearFilters = () => {
    setFilters({
      brand: '',
      priceRange: '',
      sortBy: 'featured',
    });
    setSearchQuery('');
    setSearchParams({});
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-8 text-3xl font-bold">Mobile Phones</h1>
      
      {/* Search and Filter Controls */}
      <div className="mb-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <form onSubmit={handleSearch} className="relative max-w-md flex-1">
            <input
              type="text"
              placeholder="Search phones..."
              className="input w-full pr-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button
              type="submit"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500"
              aria-label="Search"
            >
              <Search className="h-5 w-5" />
            </button>
          </form>
          
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 rounded-lg border border-neutral-300 bg-white px-4 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-50"
            >
              <SlidersHorizontal className="h-4 w-4" />
              Filters
            </button>
            
            <select
              value={filters.sortBy}
              onChange={(e) => handleFilterChange('sortBy', e.target.value)}
              className="input"
            >
              <option value="featured">Featured</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="newest">Newest First</option>
            </select>
          </div>
        </div>
        
        {/* Filter panel */}
        {showFilters && (
          <div className="mt-4 rounded-lg bg-white p-4 shadow-soft">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              <div>
                <label className="block text-sm font-medium text-neutral-700">Brand</label>
                <select
                  value={filters.brand}
                  onChange={(e) => handleFilterChange('brand', e.target.value)}
                  className="mt-1 input w-full"
                >
                  <option value="">All Brands</option>
                  <option value="Apple">Apple</option>
                  <option value="Samsung">Samsung</option>
                  <option value="Google">Google</option>
                  <option value="OnePlus">OnePlus</option>
                  <option value="Xiaomi">Xiaomi</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-neutral-700">Price Range</label>
                <select
                  value={filters.priceRange}
                  onChange={(e) => handleFilterChange('priceRange', e.target.value)}
                  className="mt-1 input w-full"
                >
                  <option value="">All Prices</option>
                  <option value="0-500">Under $500</option>
                  <option value="500-1000">$500 - $1000</option>
                  <option value="1000-1500">$1000 - $1500</option>
                  <option value="1500-">$1500+</option>
                </select>
              </div>
            </div>
            
            <div className="mt-4 flex justify-end">
              <button
                onClick={clearFilters}
                className="text-sm text-neutral-500 hover:text-neutral-700"
              >
                Clear Filters
              </button>
            </div>
          </div>
        )}
      </div>
      
      {/* Results info */}
      <div className="mb-6 flex items-center justify-between">
        <p className="text-sm text-neutral-600">
          Showing {filteredProducts.length} {filteredProducts.length === 1 ? 'product' : 'products'}
        </p>
        
        {/* Active filters */}
        {(filters.brand || filters.priceRange) && (
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm text-neutral-500">Active filters:</span>
            {filters.brand && (
              <span className="rounded-full bg-primary-100 px-3 py-1 text-xs font-medium text-primary-700">
                {filters.brand}
              </span>
            )}
            {filters.priceRange && (
              <span className="rounded-full bg-primary-100 px-3 py-1 text-xs font-medium text-primary-700">
                {filters.priceRange === '0-500'
                  ? 'Under $500'
                  : filters.priceRange === '500-1000'
                  ? '$500 - $1000'
                  : filters.priceRange === '1000-1500'
                  ? '$1000 - $1500'
                  : '$1500+'}
              </span>
            )}
          </div>
        )}
      </div>
      
      {/* Products grid */}
      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="my-12 text-center">
          <p className="text-lg text-neutral-600">No products found matching your criteria.</p>
          <button
            onClick={clearFilters}
            className="mt-4 text-primary-500 hover:text-primary-600"
          >
            Clear all filters
          </button>
        </div>
      )}
    </div>
  );
}