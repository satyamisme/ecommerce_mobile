import { Link } from 'react-router-dom';
import { Smartphone, Mail, Phone, MapPin, Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-neutral-900 text-neutral-300">
      <div className="container mx-auto px-4 md:px-6 py-12">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          <div>
            <div className="flex items-center space-x-2">
              <Smartphone className="h-6 w-6 text-primary-500" />
              <span className="text-lg font-bold text-white">Mobile Store</span>
            </div>
            <p className="mt-4 text-sm">
              Your one-stop shop for premium mobile phones and accessories.
            </p>
            <div className="mt-6 flex space-x-4">
              <a
                href="#"
                className="text-neutral-400 hover:text-primary-500 transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="text-neutral-400 hover:text-primary-500 transition-colors"
                aria-label="Twitter"
              >
                <Twitter className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="text-neutral-400 hover:text-primary-500 transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="text-neutral-400 hover:text-primary-500 transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin className="h-5 w-5" />
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold text-white">Shop</h3>
            <ul className="mt-4 space-y-2">
              <li>
                <Link to="/products" className="text-sm hover:text-primary-500 transition-colors">
                  All Products
                </Link>
              </li>
              <li>
                <Link to="/products?brand=Apple" className="text-sm hover:text-primary-500 transition-colors">
                  Apple
                </Link>
              </li>
              <li>
                <Link to="/products?brand=Samsung" className="text-sm hover:text-primary-500 transition-colors">
                  Samsung
                </Link>
              </li>
              <li>
                <Link to="/products?brand=Google" className="text-sm hover:text-primary-500 transition-colors">
                  Google
                </Link>
              </li>
              <li>
                <Link to="/products?brand=OnePlus" className="text-sm hover:text-primary-500 transition-colors">
                  OnePlus
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold text-white">Support</h3>
            <ul className="mt-4 space-y-2">
              <li>
                <Link to="/faq" className="text-sm hover:text-primary-500 transition-colors">
                  FAQ
                </Link>
              </li>
              <li>
                <Link to="/shipping" className="text-sm hover:text-primary-500 transition-colors">
                  Shipping & Returns
                </Link>
              </li>
              <li>
                <Link to="/warranty" className="text-sm hover:text-primary-500 transition-colors">
                  Warranty
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-sm hover:text-primary-500 transition-colors">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold text-white">Contact</h3>
            <ul className="mt-4 space-y-3">
              <li className="flex items-start">
                <MapPin className="mr-2 h-5 w-5 text-primary-500 flex-shrink-0" />
                <span className="text-sm">
                  123 Mobile Street, Tech City, TC 98765
                </span>
              </li>
              <li className="flex items-center">
                <Phone className="mr-2 h-5 w-5 text-primary-500 flex-shrink-0" />
                <span className="text-sm">+1 (555) 123-4567</span>
              </li>
              <li className="flex items-center">
                <Mail className="mr-2 h-5 w-5 text-primary-500 flex-shrink-0" />
                <span className="text-sm">support@mobilestore.com</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="mt-12 border-t border-neutral-800 pt-8">
          <div className="flex flex-col items-center justify-between space-y-4 md:flex-row md:space-y-0">
            <p className="text-sm text-neutral-400">
              &copy; {new Date().getFullYear()} Mobile Store. All rights reserved.
            </p>
            <div className="flex space-x-4">
              <Link to="/privacy" className="text-sm text-neutral-400 hover:text-primary-500 transition-colors">
                Privacy Policy
              </Link>
              <Link to="/terms" className="text-sm text-neutral-400 hover:text-primary-500 transition-colors">
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}