'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Search, ShoppingCart, User, ChevronDown, Menu, X, Store, Package, LogIn, Heart, Truck, Shield, Bell, Sun, Moon } from '../../utils/icons';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import WholesalerLoginModal from "./WholesalerLoginModal";
import RetailerLoginModal from "./RetailerLoginModal";
import CustomerLoginModal from "./CustomerLoginModal";
import { useGetCartQuery } from '@/redux/wholesaler/slices/cartSlice';

export default function Navbar() {
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCitiesDropdownOpen, setIsCitiesDropdownOpen] = useState(false);
  const [isBecomeSellerOpen, setIsBecomeSellerOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [userName, setUserName] = useState('');
  
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  // Modal states
  const [isWholesalerLoginOpen, setIsWholesalerLoginOpen] = useState(false);
  const [isRetailerLoginOpen, setIsRetailerLoginOpen] = useState(false);
  const [isCustomerLoginOpen, setIsCustomerLoginOpen] = useState(false);

  const citiesDropdownRef = useRef(null);
  const becomeSellerDropdownRef = useRef(null);
  const userDropdownRef = useRef(null);
  const mobileMenuRef = useRef(null);
  
  const citiesHoverTimeout = useRef(null);
  const sellerHoverTimeout = useRef(null);

  // Add this at the top of Navbar component
  const pathname = usePathname();
  const isHomePage = pathname === '/';

  // Fetch cart count
  const { data: cartData, refetch: refetchCart } = useGetCartQuery();
  const cartCount = cartData?.data?.item_count || 0;

  useEffect(() => {
    setMounted(true);
    // Check if user is logged in
    const token = localStorage.getItem('access');
    const role = localStorage.getItem('user_role');
    const name = localStorage.getItem('user_name');
    if (token && role) {
      setIsLoggedIn(true);
      setUserRole(role);
      setUserName(name || 'User');
    }
  }, []);

// Add this useEffect
useEffect(() => {
  const handleScroll = () => {
    if (window.scrollY > lastScrollY && window.scrollY > 100) {
      setIsVisible(false); // Scrolling down - hide navbar
    } else {
      setIsVisible(true); // Scrolling up - show navbar
    }
    setLastScrollY(window.scrollY);
  };

  window.addEventListener('scroll', handleScroll);
  return () => window.removeEventListener('scroll', handleScroll);
}, [lastScrollY]);

useEffect(() => {
  if (mounted && (isLoggedIn || !isLoggedIn)) {
    refetchCart();
  }
}, [isLoggedIn, mounted, refetchCart]);


  // Add this useEffect with your other useEffects
useEffect(() => {
  function handleClickOutside(event) {
    // Close user dropdown when clicking outside
    if (userDropdownRef.current && !userDropdownRef.current.contains(event.target)) {
      setIsUserDropdownOpen(false);
    }
    // Close cities dropdown
    if (citiesDropdownRef.current && !citiesDropdownRef.current.contains(event.target)) {
      setIsCitiesDropdownOpen(false);
    }
    // Close become seller dropdown
    if (becomeSellerDropdownRef.current && !becomeSellerDropdownRef.current.contains(event.target)) {
      setIsBecomeSellerOpen(false);
    }
  }

  document.addEventListener('mousedown', handleClickOutside);
  return () => document.removeEventListener('mousedown', handleClickOutside);
}, []);

  const handleLogout = () => {
    localStorage.removeItem('access');
    localStorage.removeItem('refresh');
    localStorage.removeItem('user_role');
    localStorage.removeItem('user_name');
    setIsLoggedIn(false);
    setUserRole(null);
    router.push('/');
  };

  const cities = ['Mumbai', 'Delhi', 'Bangalore', 'Chennai', 'Kolkata', 'Pune', 'Jaipur', 'Hyderabad', 'Ahmedabad', 'Lucknow'];

  const handleCitiesMouseEnter = () => {
    if (citiesHoverTimeout.current) clearTimeout(citiesHoverTimeout.current);
    setIsCitiesDropdownOpen(true);
  };

  const handleCitiesMouseLeave = () => {
    citiesHoverTimeout.current = setTimeout(() => {
      setIsCitiesDropdownOpen(false);
    }, 200);
  };

  const handleBecomeSellerMouseEnter = () => {
    if (sellerHoverTimeout.current) clearTimeout(sellerHoverTimeout.current);
    setIsBecomeSellerOpen(true);
  };

  const handleBecomeSellerMouseLeave = () => {
    sellerHoverTimeout.current = setTimeout(() => {
      setIsBecomeSellerOpen(false);
    }, 200);
  };

  const handleNavigation = (path) => {
    setIsMobileMenuOpen(false);
    setIsCitiesDropdownOpen(false);
    setIsBecomeSellerOpen(false);
    setIsUserDropdownOpen(false);
    router.push(path);
  };

  const handleRoleLogin = (role) => {
    const token = localStorage.getItem('access');
    const userRole = localStorage.getItem('user_role');
    
    // If already logged in with same role, redirect directly
    if (token && userRole === role) {
      if (role === 'wholesaler') router.push('/wholesaler/wholesalerdashboard');
      else if (role === 'retailer') router.push('/retailer/retailerdashboard');
      else router.push('/customer/dashboard');
    } else {
      // Otherwise open login modal
      if (role === 'wholesaler') setIsWholesalerLoginOpen(true);
      else if (role === 'retailer') setIsRetailerLoginOpen(true);
      else setIsCustomerLoginOpen(true);
    }
  };

  const handleLoginSuccess = (role, userData) => {
    localStorage.setItem('user_role', role);
    localStorage.setItem('user_name', userData.name || userData.email?.split('@')[0]);
    setIsLoggedIn(true);
    setUserRole(role);
    setUserName(userData.name || userData.email?.split('@')[0]);
    
    setIsWholesalerLoginOpen(false);
    setIsRetailerLoginOpen(false);
    setIsCustomerLoginOpen(false);
    
    if (role === 'wholesaler') router.push('/wholesaler/wholesalerdashboard');
    else if (role === 'retailer') router.push('/retailer/retailerdashboard');
    else router.push('/customer/dashboard');
  };

  const getDashboardLink = () => {
    if (userRole === 'wholesaler') return '/wholesaler/wholesalerdashboard';
    if (userRole === 'retailer') return '/retailer/retailerdashboard';
    return '/customer/dashboard';
  };

  const getRoleBadgeColor = () => {
    if (userRole === 'wholesaler') return 'bg-purple-100 text-purple-700';
    if (userRole === 'retailer') return 'bg-blue-100 text-blue-700';
    return 'bg-green-100 text-green-700';
  };

  if (!mounted) {
    return (
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-2">
            <div className="flex-shrink-0">
              <Link href="/" className="text-2xl font-bold bg-gradient-to-r from-primary-600 to-primary-800 bg-clip-text text-transparent">VELTRIX</Link>
            </div>
          </div>
        </div>
      </nav>
    );
  }

  return (
    <>
      <nav className={`bg-white border-b border-gray-200 fixed top-0 w-full z-50 shadow-sm transition-transform duration-300 ${isVisible ? 'translate-y-0' : '-translate-y-full'}`}>
  <div className="container mx-auto px-4 py-2">
          {/* Top Bar - Free Shipping Banner */}
          {isHomePage && (
          <div className="hidden lg:flex items-center justify-between py-1.5 border-b border-gray-100 text-xs">
            <div className="flex items-center gap-4">
              <span className="text-green-600 font-medium">✓ Free Shipping on orders above ₹999</span>
              <span className="text-gray-400">|</span>
              <span className="text-gray-500">30 Days Return Policy</span>
              <span className="text-gray-400">|</span>
              <span className="text-gray-500">100% Secure Payments</span>
            </div>
            <div className="flex items-center gap-4">
              <button className="text-gray-500 hover:text-primary-600 transition-all flex items-center gap-1">
                <Bell size={12} />
                <span>Notifications</span>
              </button>
              <button className="text-gray-500 hover:text-primary-600 transition-all flex items-center gap-1">
                <Heart size={12} />
                <span>Wishlist</span>
              </button>
              <button className="text-gray-500 hover:text-primary-600 transition-all flex items-center gap-1">
                <Truck size={12} />
                <span>Track Order</span>
              </button>
            </div>
          </div>
        )}

          {/* Main Navbar */}
          <div className="flex items-center justify-between h-16 lg:h-20">
            {/* Logo */}
            <div className="flex-shrink-0">
              <Link href="/" className="text-xl lg:text-2xl font-bold text-primary-600 hover:text-primary-700 transition-colors">
                VELTRIX
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center flex-1 ml-8 gap-3">
              {/* Cities Dropdown */}
              <div 
                className="relative" 
                ref={citiesDropdownRef}
                onMouseEnter={handleCitiesMouseEnter}
                onMouseLeave={handleCitiesMouseLeave}
              >
                <button className="flex items-center gap-2 text-gray-700 hover:text-primary-600 transition-all px-3 py-2 rounded-lg border border-gray-200 bg-gray-50 hover:border-primary-300">
                  <span className="text-sm font-medium">📍 Select City</span>
                  <ChevronDown size={16} className={`transition-transform duration-200 ${isCitiesDropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {isCitiesDropdownOpen && (
                  <div className="absolute top-full left-0 mt-2 w-72 bg-white border border-gray-200 rounded-xl shadow-lg py-2 z-50 animate-fadeIn">
                    <div className="px-4 py-2 border-b border-gray-100">
                      <span className="text-sm font-semibold text-gray-900">Select your city</span>
                    </div>
                    <div className="py-1 max-h-64 overflow-y-auto">
                      {cities.map((city, index) => (
                        <button
                          key={index}
                          onClick={() => handleNavigation(`/city/${city.toLowerCase()}`)}
                          className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-50 hover:text-primary-600 transition-all"
                        >
                          {city}
                        </button>
                      ))}
                    </div>
                    <div className="px-4 py-2 border-t border-gray-100">
                      <button onClick={() => handleNavigation('/locations')} className="text-sm text-primary-600 hover:text-primary-700 flex items-center gap-1">
                        View all locations →
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Become a Seller Dropdown */}
              <div 
                className="relative"
                ref={becomeSellerDropdownRef}
                onMouseEnter={handleBecomeSellerMouseEnter}
                onMouseLeave={handleBecomeSellerMouseLeave}
              >
                <button className="flex items-center gap-2 text-gray-700 hover:text-primary-600 transition-all px-3 py-2 rounded-lg border border-gray-200 bg-gray-50 hover:border-primary-300">
                  <Store size={16} />
                  <span className="text-sm font-medium">Become a Seller</span>
                  <ChevronDown size={16} className={`transition-transform duration-200 ${isBecomeSellerOpen ? 'rotate-180' : ''}`} />
                </button>

                {isBecomeSellerOpen && (
                  <div className="absolute top-full left-0 mt-2 w-80 bg-white border border-gray-200 rounded-xl shadow-lg py-2 z-50 animate-fadeIn">
                    <div className="px-4 py-2 border-b border-gray-100">
                      <span className="text-sm font-semibold text-gray-900">Sell on VELTRIX</span>
                    </div>
                    <div className="py-1">
                      <button 
                        onClick={() => handleRoleLogin('wholesaler')}
                        className="w-full flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50 hover:text-primary-600 transition-all border-b border-gray-100"
                      >
                        <Shield size={18} className="text-purple-500" />
                        <div className="text-left">
                          <div className="text-sm font-medium">Wholesaler</div>
                          <div className="text-xs text-gray-400">Sell in bulk to retailers</div>
                        </div>
                      </button>
                      
                      <button 
                        onClick={() => handleRoleLogin('retailer')}
                        className="w-full flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50 hover:text-primary-600 transition-all"
                      >
                        <Store size={18} className="text-blue-500" />
                        <div className="text-left">
                          <div className="text-sm font-medium">Retailer</div>
                          <div className="text-xs text-gray-400">Sell to customers in your store</div>
                        </div>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Search Bar */}
            <div className="hidden lg:block flex-1 max-w-xl mx-6">
              <div className="relative group">
                <input
                  type="text"
                  placeholder="Search for products, brands and more..."
                  className="w-full pl-11 pr-28 py-2.5 border border-gray-200 rounded-full focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-100 bg-gray-50 text-gray-700 placeholder-gray-400 transition-all"
                />
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-hover:text-primary-500 transition-colors" size={18} />
                <button className="absolute right-1.5 top-1/2 -translate-y-1/2 px-4 py-1 bg-primary-500 text-white rounded-full text-sm font-medium hover:bg-primary-600 transition-all">
                  Search
                </button>
              </div>
            </div>

            {/* Right Section - Cart & User */}
            <div className="flex items-center gap-4">
              {/* Cart */}
              <button onClick={() => handleNavigation('/product/cartpage')} className="relative text-gray-700 hover:text-primary-600 transition-all p-1.5">
                <ShoppingCart size={24} />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full font-medium">
                    {cartCount}
                  </span>
                )}
              </button>

              {/* User Dropdown */}
              <div className="relative" ref={userDropdownRef}>
                <button 
                  onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                  className="flex items-center gap-2 text-gray-700 hover:text-primary-600 transition-all p-1.5"
                >
                  <User size={22} />
                  <span className="hidden lg:block text-sm font-medium">
                    {isLoggedIn ? `Hi, ${userName}` : 'Account'}
                  </span>
                  <ChevronDown size={14} className={`hidden lg:block transition-transform duration-200 ${isUserDropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {isUserDropdownOpen && (
                  <div className="absolute right-0 top-full mt-2 w-72 bg-white border border-gray-200 rounded-xl shadow-lg py-2 z-50 animate-fadeIn">
                    {isLoggedIn ? (
                      <>
                        <div className="px-4 py-3 border-b border-gray-100">
                          <p className="text-sm font-semibold text-gray-900">{userName}</p>
                          <p className="text-xs text-gray-500 mt-0.5">{userRole === 'wholesaler' ? 'Wholesaler Account' : userRole === 'retailer' ? 'Retailer Account' : 'Customer Account'}</p>
                          <span className={`inline-block mt-1.5 text-[10px] px-2 py-0.5 rounded-full ${getRoleBadgeColor()}`}>
                            {userRole?.charAt(0).toUpperCase() + userRole?.slice(1)}
                          </span>
                        </div>
                        
                        <button onClick={() => handleNavigation(getDashboardLink())} className="w-full flex items-center gap-3 px-4 py-2.5 text-gray-700 hover:bg-gray-50 hover:text-primary-600 transition-all border-b border-gray-100">
                          <Package size={16} />
                          <span className="text-sm">Dashboard</span>
                        </button>
                        
                        <button onClick={() => handleNavigation('/orders')} className="w-full flex items-center gap-3 px-4 py-2.5 text-gray-700 hover:bg-gray-50 hover:text-primary-600 transition-all border-b border-gray-100">
                          <Truck size={16} />
                          <span className="text-sm">My Orders</span>
                        </button>
                        
                        <button onClick={() => handleNavigation('/wishlist')} className="w-full flex items-center gap-3 px-4 py-2.5 text-gray-700 hover:bg-gray-50 hover:text-primary-600 transition-all border-b border-gray-100">
                          <Heart size={16} />
                          <span className="text-sm">Wishlist</span>
                        </button>
                        
                        <button onClick={() => handleNavigation('/settings')} className="w-full flex items-center gap-3 px-4 py-2.5 text-gray-700 hover:bg-gray-50 hover:text-primary-600 transition-all border-b border-gray-100">
                          <User size={16} />
                          <span className="text-sm">Profile Settings</span>
                        </button>
                        
                        <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-2.5 text-red-600 hover:bg-red-50 transition-all">
                          <LogIn size={16} />
                          <span className="text-sm">Sign Out</span>
                        </button>
                      </>
                    ) : (
                      <>
                        <div className="px-4 py-3 border-b border-gray-100">
                          <p className="text-sm font-semibold text-gray-900">Welcome to VELTRIX!</p>
                          <p className="text-xs text-gray-500 mt-0.5">Sign in to get personalized experience</p>
                        </div>
                        
                        <button onClick={() => handleRoleLogin('customer')} className="w-full flex items-center gap-3 px-4 py-2.5 text-gray-700 hover:bg-gray-50 hover:text-primary-600 transition-all border-b border-gray-100">
                          <User size={16} className="text-green-500" />
                          <div className="text-left">
                            <div className="text-sm font-medium">Customer Sign In</div>
                            <div className="text-xs text-gray-400">Shop for personal use</div>
                          </div>
                        </button>
                        
                        <button onClick={() => handleRoleLogin('retailer')} className="w-full flex items-center gap-3 px-4 py-2.5 text-gray-700 hover:bg-gray-50 hover:text-primary-600 transition-all border-b border-gray-100">
                          <Store size={16} className="text-blue-500" />
                          <div className="text-left">
                            <div className="text-sm font-medium">Retailer Sign In</div>
                            <div className="text-xs text-gray-400">Bulk purchases & wholesale</div>
                          </div>
                        </button>
                        
                        <button onClick={() => handleRoleLogin('wholesaler')} className="w-full flex items-center gap-3 px-4 py-2.5 text-gray-700 hover:bg-gray-50 hover:text-primary-600 transition-all">
                          <Shield size={16} className="text-purple-500" />
                          <div className="text-left">
                            <div className="text-sm font-medium">Wholesaler Sign In</div>
                            <div className="text-xs text-gray-400">Sell products in bulk</div>
                          </div>
                        </button>
                      </>
                    )}
                  </div>
                )}
              </div>

              {/* Mobile Menu Button */}
              <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="lg:hidden text-gray-700 hover:text-primary-600 p-1.5">
                {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>

          {/* Mobile Search */}
          <div className="lg:hidden pb-3">
            <div className="relative">
              <input
                type="text"
                placeholder="Search products..."
                className="w-full pl-10 pr-16 py-2 border border-gray-200 rounded-full bg-gray-50 text-sm focus:outline-none focus:border-primary-400"
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
              <button className="absolute right-1.5 top-1/2 -translate-y-1/2 px-3 py-0.5 bg-primary-500 text-white rounded-full text-xs">
                Go
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          {isMobileMenuOpen && (
            <div className="lg:hidden border-t border-gray-100 py-3 animate-slideDown" ref={mobileMenuRef}>
              <button onClick={() => handleRoleLogin('customer')} className="w-full flex items-center gap-3 py-3 px-4 text-gray-700 hover:bg-gray-50 border-b border-gray-100">
                <User size={18} />
                <span className="text-sm font-medium">Customer Sign In</span>
              </button>
              
              <button onClick={() => handleRoleLogin('retailer')} className="w-full flex items-center gap-3 py-3 px-4 text-gray-700 hover:bg-gray-50 border-b border-gray-100">
                <Store size={18} />
                <span className="text-sm font-medium">Retailer Sign In</span>
              </button>
              
              <button onClick={() => handleRoleLogin('wholesaler')} className="w-full flex items-center gap-3 py-3 px-4 text-gray-700 hover:bg-gray-50 border-b border-gray-100">
                <Shield size={18} />
                <span className="text-sm font-medium">Wholesaler Sign In</span>
              </button>
              
              <button onClick={() => handleNavigation('/product/cartpage')} className="w-full flex items-center gap-3 py-3 px-4 text-gray-700 hover:bg-gray-50 border-b border-gray-100">
                <ShoppingCart size={18} />
                <span className="text-sm font-medium">Cart ({cartCount})</span>
              </button>
              
              <button onClick={() => handleNavigation('/wishlist')} className="w-full flex items-center gap-3 py-3 px-4 text-gray-700 hover:bg-gray-50">
                <Heart size={18} />
                <span className="text-sm font-medium">Wishlist</span>
              </button>
            </div>
          )}
        </div>
      </nav>

      {/* Login Modals */}
      <WholesalerLoginModal
        isOpen={isWholesalerLoginOpen}
        onClose={() => setIsWholesalerLoginOpen(false)}
        onLogin={(data) => handleLoginSuccess('wholesaler', data)}
      />
      <RetailerLoginModal
        isOpen={isRetailerLoginOpen}
        onClose={() => setIsRetailerLoginOpen(false)}
        onLogin={(data) => handleLoginSuccess('retailer', data)}
      />
      <CustomerLoginModal
        isOpen={isCustomerLoginOpen}
        onClose={() => setIsCustomerLoginOpen(false)}
        onLogin={(data) => handleLoginSuccess('customer', data)}
      />
    </>
  );
}