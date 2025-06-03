import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Smartphone, ShoppingCart, User, Menu, X, Search, LogOut, ChevronDown } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useCart } from '../../contexts/CartContext';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const { itemCount } = useCart();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsProfileMenuOpen(false);
    setIsMobileMenuOpen(false);
  };

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-white shadow-sm' : 'bg-transparent'
      }`}
    >
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <Smartphone className="h-6 w-6 text-primary-500" />
            <span className="text-lg font-bold text-neutral-900">Mobile Store</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-6">
            <Link
              to="/"
              className={`text-sm font-medium transition-colors hover:text-primary-500 ${
                isActive('/') ? 'text-primary-500' : 'text-neutral-700'
              }`}
            >
              Home
            </Link>
            <Link
              to="/products"
              className={`text-sm font-medium transition-colors hover:text-primary-500 ${
                isActive('/products') ? 'text-primary-500' : 'text-neutral-700'
              }`}
            >
              Products
            </Link>
          </nav>

          {/* Desktop Right Section */}
          <div className="hidden md:flex items-center space-x-4">
            <button
              className="text-neutral-700 hover:text-primary-500"
              aria-label="Search"
            >
              <Search className="h-5 w-5" />
            </button>
            
            <Link to="/cart" className="relative text-neutral-700 hover:text-primary-500">
              <ShoppingCart className="h-5 w-5" />
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary-500 text-xs font-medium text-white">
                  {itemCount}
                </span>
              )}
            </Link>

            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                  className="flex items-center space-x-1 text-sm font-medium text-neutral-700 hover:text-primary-500"
                >
                  <div className="flex items-center">
                    {user?.avatar ? (
                      <img
                        src={user.avatar}
                        alt={user.name}
                        className="h-8 w-8 rounded-full object-cover"
                      />
                    ) : (
                      <User className="h-5 w-5" />
                    )}
                    <ChevronDown className="ml-1 h-4 w-4" />
                  </div>
                </button>

                {isProfileMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5">
                    <div className="border-b border-neutral-100 px-4 py-2">
                      <p className="text-sm font-medium text-neutral-900">{user?.name}</p>
                      <p className="text-xs text-neutral-500">{user?.email}</p>
                    </div>
                    <Link
                      to="/profile"
                      onClick={() => setIsProfileMenuOpen(false)}
                      className="block px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-50"
                    >
                      Profile
                    </Link>
                    {isAdmin && (
                      <Link
                        to="/admin"
                        onClick={() => setIsProfileMenuOpen(false)}
                        className="block px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-50"
                      >
                        Admin Dashboard
                      </Link>
                    )}
                    <button
                      onClick={handleLogout}
                      className="flex w-full items-center px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-50"
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                to="/login"
                className="flex items-center space-x-1 text-sm font-medium text-neutral-700 hover:text-primary-500"
              >
                <User className="h-5 w-5" />
                <span>Login</span>
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="inline-flex items-center justify-center md:hidden"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? (
              <X className="h-6 w-6 text-neutral-700" />
            ) : (
              <Menu className="h-6 w-6 text-neutral-700" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden">
          <div className="space-y-1 px-4 py-3">
            <Link
              to="/"
              onClick={() => setIsMobileMenuOpen(false)}
              className={`block rounded-lg px-3 py-2 text-base font-medium ${
                isActive('/') ? 'bg-primary-50 text-primary-500' : 'text-neutral-700 hover:bg-neutral-50'
              }`}
            >
              Home
            </Link>
            <Link
              to="/products"
              onClick={() => setIsMobileMenuOpen(false)}
              className={`block rounded-lg px-3 py-2 text-base font-medium ${
                isActive('/products') ? 'bg-primary-50 text-primary-500' : 'text-neutral-700 hover:bg-neutral-50'
              }`}
            >
              Products
            </Link>
            <Link
              to="/cart"
              onClick={() => setIsMobileMenuOpen(false)}
              className={`flex items-center justify-between rounded-lg px-3 py-2 text-base font-medium ${
                isActive('/cart') ? 'bg-primary-50 text-primary-500' : 'text-neutral-700 hover:bg-neutral-50'
              }`}
            >
              <span>Cart</span>
              {itemCount > 0 && (
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary-500 text-xs font-medium text-white">
                  {itemCount}
                </span>
              )}
            </Link>
            {isAuthenticated ? (
              <>
                <Link
                  to="/profile"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`block rounded-lg px-3 py-2 text-base font-medium ${
                    isActive('/profile') ? 'bg-primary-50 text-primary-500' : 'text-neutral-700 hover:bg-neutral-50'
                  }`}
                >
                  Profile
                </Link>
                {isAdmin && (
                  <Link
                    to="/admin"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`block rounded-lg px-3 py-2 text-base font-medium ${
                      isActive('/admin') ? 'bg-primary-50 text-primary-500' : 'text-neutral-700 hover:bg-neutral-50'
                    }`}
                  >
                    Admin Dashboard
                  </Link>
                )}
                <button
                  onClick={handleLogout}
                  className="flex w-full items-center rounded-lg px-3 py-2 text-base font-medium text-neutral-700 hover:bg-neutral-50"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </button>
              </>
            ) : (
              <Link
                to="/login"
                onClick={() => setIsMobileMenuOpen(false)}
                className={`flex items-center rounded-lg px-3 py-2 text-base font-medium ${
                  isActive('/login') ? 'bg-primary-50 text-primary-500' : 'text-neutral-700 hover:bg-neutral-50'
                }`}
              >
                <User className="mr-2 h-4 w-4" />
                Login
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}