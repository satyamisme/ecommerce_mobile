import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronRight, Star, Smartphone, Truck, Shield, CreditCard } from 'lucide-react';
import ProductCard from '../components/ui/ProductCard';
// import { mockProducts } from '../data/mockData'; // Removed
import * as mockApiService from '../services/mockApiService'; // Added
import { Product } from '../types';

export default function HomePage() {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [latestProducts, setLatestProducts] = useState<Product[]>([]);
  
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        // Get featured products
        const featured = await mockApiService.getProducts({ featured: true });
        setFeaturedProducts(featured);

        // Get latest products
        const allProducts = await mockApiService.getProducts();
        const latest = [...allProducts].sort(
          (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        ).slice(0, 4);
        setLatestProducts(latest);
      } catch (error) {
        console.error("Failed to fetch products for homepage:", error);
        // Optionally set an error state here to render an error message
      }
    };

    fetchProducts();
  }, []);

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-primary-500 to-primary-700 text-white">
        <div className="container mx-auto px-4 py-16 md:py-24">
          <div className="flex flex-col items-center text-center md:flex-row md:text-left">
            <div className="mb-10 md:mb-0 md:w-1/2">
              <motion.h1 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="mb-4 text-4xl font-bold leading-tight md:text-5xl lg:text-6xl"
              >
                Discover the Latest <br /> Mobile Technology
              </motion.h1>
              <motion.p 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="mb-8 text-lg text-white/90"
              >
                Explore our collection of premium smartphones from top brands. Find the perfect device that matches your lifestyle.
              </motion.p>
              <motion.div 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="flex flex-wrap justify-center gap-4 md:justify-start"
              >
                <Link to="/products" className="btn-accent">
                  Shop Now
                </Link>
                <Link to="/products" className="btn bg-white text-primary-700 hover:bg-white/90">
                  View All Phones
                </Link>
              </motion.div>
            </div>
            <div className="md:w-1/2">
              <motion.img
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                src="https://images.pexels.com/photos/7034511/pexels-photo-7034511.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
                alt="Latest smartphones"
                className="mx-auto h-auto max-w-full rounded-xl shadow-xl md:max-w-md"
              />
            </div>
          </div>
        </div>
        
        {/* Wave divider */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 100" className="fill-white">
            <path d="M0,32L60,42.7C120,53,240,75,360,80C480,85,600,75,720,58.7C840,43,960,21,1080,21.3C1200,21,1320,43,1380,53.3L1440,64L1440,100L1380,100C1320,100,1200,100,1080,100C960,100,840,100,720,100C600,100,480,100,360,100C240,100,120,100,60,100L0,100Z"></path>
          </svg>
        </div>
      </section>

      {/* Featured Categories */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          <h2 className="mb-8 text-center text-3xl font-bold">Popular Brands</h2>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {['Apple', 'Samsung', 'Google', 'OnePlus', 'Xiaomi'].map((brand) => (
              <Link
                key={brand}
                to={`/products?brand=${brand}`}
                className="flex flex-col items-center justify-center rounded-lg bg-white p-6 text-center shadow-soft transition-all hover:shadow-product hover:transform hover:scale-105"
              >
                <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-primary-50 text-primary-500">
                  <Smartphone className="h-6 w-6" />
                </div>
                <h3 className="font-medium text-neutral-900">{brand}</h3>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="bg-neutral-50 py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="mb-8 flex items-center justify-between">
            <h2 className="text-3xl font-bold">Featured Products</h2>
            <Link
              to="/products"
              className="flex items-center text-sm font-medium text-primary-500 hover:text-primary-600"
            >
              View All <ChevronRight className="ml-1 h-4 w-4" />
            </Link>
          </div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* Latest Arrivals */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="mb-8 flex items-center justify-between">
            <h2 className="text-3xl font-bold">Latest Arrivals</h2>
            <Link
              to="/products"
              className="flex items-center text-sm font-medium text-primary-500 hover:text-primary-600"
            >
              View All <ChevronRight className="ml-1 h-4 w-4" />
            </Link>
          </div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {latestProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-white py-12 md:py-16">
        <div className="container mx-auto px-4">
          <h2 className="mb-12 text-center text-3xl font-bold">Why Choose Us</h2>
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            <div className="flex flex-col items-center text-center">
              <div className="mb-4 rounded-full bg-primary-50 p-4 text-primary-500">
                <Smartphone className="h-8 w-8" />
              </div>
              <h3 className="mb-2 text-xl font-semibold">Authentic Products</h3>
              <p className="text-neutral-600">
                All our products are genuine with full manufacturer warranty.
              </p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="mb-4 rounded-full bg-primary-50 p-4 text-primary-500">
                <Truck className="h-8 w-8" />
              </div>
              <h3 className="mb-2 text-xl font-semibold">Fast Delivery</h3>
              <p className="text-neutral-600">
                Quick and reliable shipping to your doorstep nationwide.
              </p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="mb-4 rounded-full bg-primary-50 p-4 text-primary-500">
                <Shield className="h-8 w-8" />
              </div>
              <h3 className="mb-2 text-xl font-semibold">Secure Shopping</h3>
              <p className="text-neutral-600">
                Your personal information is always protected.
              </p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="mb-4 rounded-full bg-primary-50 p-4 text-primary-500">
                <CreditCard className="h-8 w-8" />
              </div>
              <h3 className="mb-2 text-xl font-semibold">Easy Payments</h3>
              <p className="text-neutral-600">
                Multiple payment options for a hassle-free checkout.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-neutral-50 py-12 md:py-16">
        <div className="container mx-auto px-4">
          <h2 className="mb-8 text-center text-3xl font-bold">Customer Reviews</h2>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[
              {
                name: 'Alex Johnson',
                review: 'The service was exceptional, and my new phone arrived earlier than expected. Highly recommend!',
                rating: 5,
                avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=60',
              },
              {
                name: 'Sarah Wilson',
                review: 'Great selection of phones and competitive prices. The staff was very helpful in selecting the right device for my needs.',
                rating: 4,
                avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=60',
              },
              {
                name: 'Michael Brown',
                review: 'Fast shipping and the phone was exactly as described. Will definitely shop here again for future upgrades!',
                rating: 5,
                avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=60',
              },
            ].map((testimonial, index) => (
              <div key={index} className="card flex flex-col p-6">
                <div className="mb-4 flex items-center">
                  <img
                    src={testimonial.avatar}
                    alt={testimonial.name}
                    className="mr-4 h-12 w-12 rounded-full object-cover"
                  />
                  <div>
                    <h3 className="text-lg font-semibold">{testimonial.name}</h3>
                    <div className="flex text-accent-500">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${
                            i < testimonial.rating ? 'fill-current' : 'text-neutral-200'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                </div>
                <p className="text-neutral-600">{testimonial.review}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="bg-primary-500 py-12 md:py-16 text-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center text-center">
            <h2 className="mb-4 text-3xl font-bold">Stay Updated</h2>
            <p className="mb-8 max-w-2xl text-lg text-white/90">
              Subscribe to our newsletter to receive updates on new arrivals, special offers, and exclusive discounts.
            </p>
            <form className="flex w-full max-w-lg flex-col gap-3 sm:flex-row">
              <input
                type="email"
                placeholder="Your email address"
                className="flex-1 rounded-lg border-0 px-4 py-3 text-neutral-900 shadow-sm focus:ring-2 focus:ring-white"
                required
              />
              <button
                type="submit"
                className="rounded-lg bg-accent-500 px-6 py-3 font-semibold text-white shadow-sm hover:bg-accent-600 focus:outline-none focus:ring-2 focus:ring-white"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}