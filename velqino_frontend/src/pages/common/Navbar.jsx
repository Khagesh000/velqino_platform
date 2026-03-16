'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Search, ShoppingCart, User, ChevronDown, Menu, X, Store, Package, LogIn } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function Navbar() {
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCitiesDropdownOpen, setIsCitiesDropdownOpen] = useState(false);
  const [isVendorDropdownOpen, setIsVendorDropdownOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  
  const citiesDropdownRef = useRef(null);
  const vendorDropdownRef = useRef(null);
  const userDropdownRef = useRef(null);
  const mobileMenuRef = useRef(null);
  
  const citiesHoverTimeout = useRef(null);
  const vendorHoverTimeout = useRef(null);

  useEffect(() => {
    setMounted(true);
  }, []);

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

  const handleVendorMouseEnter = () => {
    if (vendorHoverTimeout.current) clearTimeout(vendorHoverTimeout.current);
    setIsVendorDropdownOpen(true);
  };

  const handleVendorMouseLeave = () => {
    vendorHoverTimeout.current = setTimeout(() => {
      setIsVendorDropdownOpen(false);
    }, 200);
  };

  const handleUserMouseEnter = () => {
    if (vendorHoverTimeout.current) clearTimeout(vendorHoverTimeout.current);
    setIsUserDropdownOpen(true);
  };

  const handleUserMouseLeave = () => {
    vendorHoverTimeout.current = setTimeout(() => {
      setIsUserDropdownOpen(false);
    }, 200);
  };

  const handleNavigation = (path) => {
    setIsMobileMenuOpen(false);
    setIsCitiesDropdownOpen(false);
    setIsVendorDropdownOpen(false);
    setIsUserDropdownOpen(false);
    router.push(path);
  };

  useEffect(() => {
    function handleClickOutside(event) {
      if (mobileMenuRef.current && mobileMenuRef.current.contains(event.target)) {
        return;
      }

      if (citiesDropdownRef.current && !citiesDropdownRef.current.contains(event.target)) {
        setIsCitiesDropdownOpen(false);
      }

      if (vendorDropdownRef.current && !vendorDropdownRef.current.contains(event.target)) {
        setIsVendorDropdownOpen(false);
      }

      if (userDropdownRef.current && !userDropdownRef.current.contains(event.target)) {
        setIsUserDropdownOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!mounted) {
    return (
      <nav className="bg-primary border-light sticky top-0 z-navbar shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-14 lg:h-16">
            <div className="flex-shrink-0">
              <Link href="/" className="text-2xl lg:text-3xl font-bold text-primary-600">VELTRIX</Link>
            </div>
          </div>
        </div>
      </nav>
    );
  }

  return (
    <nav className="bg-primary border-light sticky top-0 z-navbar shadow-sm">
      <div className="container mx-auto px-4">
        {/* Main Navbar - Reduced Height */}
        <div className="flex items-center justify-between h-14 lg:h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="text-xl lg:text-2xl font-bold text-primary-600">
              VELTRIX
            </Link>
          </div>

          {/* Desktop Navigation - Reduced Padding & Heights */}
          <div className="hidden lg:flex items-center flex-1 ml-8 gap-2">
            {/* Cities Dropdown - Same Style */}
            <div 
              className="relative" 
              ref={citiesDropdownRef}
              onMouseEnter={handleCitiesMouseEnter}
              onMouseLeave={handleCitiesMouseLeave}
            >
              <button 
                onClick={() => setIsCitiesDropdownOpen(!isCitiesDropdownOpen)}
                className="flex items-center gap-2 text-secondary hover:text-primary-600 transition-fast px-3 py-2 radius-large border border-medium bg-surface-1 hover:border-primary-400 shadow-sm w-[130px] justify-between"
              >
                <span className="text-sm font-medium truncate">Select Cities</span>
                <ChevronDown size={16} className={`transition-transform duration-200 flex-shrink-0 ${isCitiesDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {isCitiesDropdownOpen && (
                <div className="absolute top-full left-0 mt-1 w-[280px] bg-card border-2 border-medium radius-xl shadow-xl py-2 z-dropdown slide-down">
                  <div className="px-4 py-2 border-b border-light">
                    <span className="text-sm font-semibold text-primary-600">Select your city</span>
                  </div>
                  
                  <div className="py-1 max-h-60 overflow-y-auto">
                    {cities.map((city, index) => (
                      <button
                        key={index}
                        onClick={() => handleNavigation(`/city/${city.toLowerCase()}`)}
                        className="w-full text-left px-4 py-2 text-secondary hover:bg-primary-100 hover:text-primary-600 transition-fast border-b border-light last:border-0"
                      >
                        {city}
                      </button>
                    ))}
                  </div>
                  
                  <div className="px-4 py-2 border-t border-light mt-1">
                    <button 
                      onClick={() => handleNavigation('/locations')}
                      className="text-sm text-accent-600 hover:text-accent-700 flex items-center gap-1 transition-fast"
                    >
                      <span>View all locations</span>
                      <ChevronDown size={14} className="rotate-[-90deg] flex-shrink-0" />
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Wholesale Manager Button - Same Style as Cities */}
            <div 
              className="relative"
              ref={vendorDropdownRef}
              onMouseEnter={handleVendorMouseEnter}
              onMouseLeave={handleVendorMouseLeave}
            >
              <button 
                onClick={() => setIsVendorDropdownOpen(!isVendorDropdownOpen)}
                className="flex items-center gap-2 text-secondary hover:text-primary-600 transition-fast px-3 py-2 radius-large border border-medium bg-surface-1 hover:border-primary-400 shadow-sm"
              >
                <Store size={16} className="text-secondary" />
                <span className="text-sm font-medium">Wholesale</span>
                <ChevronDown size={16} className={`transition-transform duration-200 ${isVendorDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {isVendorDropdownOpen && (
                <div className="absolute top-full left-0 mt-1 w-80 bg-card border-2 border-medium radius-xl shadow-xl py-2 z-dropdown slide-down">
                  <div className="px-4 py-2 border-b border-light">
                    <span className="text-sm font-semibold text-primary-600">Wholesale Portal</span>
                  </div>
                  
                  <div className="py-1">
                    <button 
                      onClick={() => handleNavigation('/wholesaler/wholesalerregistrationform')}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-secondary hover:bg-primary-100 hover:text-primary-600 transition-fast border-b border-light"
                    >
                      <Package size={16} className="text-primary-500" />
                      <div className="text-left">
                        <div className="text-sm font-medium">Become a Vendor</div>
                        <div className="text-xs text-tertiary">Register your business for wholesale</div>
                      </div>
                    </button>
                    
                    <button 
                      onClick={() => handleNavigation('/wholesaler/wholesalerdashboard')}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-secondary hover:bg-primary-100 hover:text-primary-600 transition-fast border-b border-light"
                    >
                      <Store size={16} className="text-accent-500" />
                      <div className="text-left">
                        <div className="text-sm font-medium">Vendor Dashboard</div>
                        <div className="text-xs text-tertiary">Manage your inventory & orders</div>
                      </div>
                    </button>
                    
                    <button 
                      onClick={() => handleNavigation('/wholesale/bulk-orders')}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-secondary hover:bg-primary-100 hover:text-primary-600 transition-fast"
                    >
                      <ShoppingCart size={16} className="text-success-500" />
                      <div className="text-left">
                        <div className="text-sm font-medium">Bulk Orders</div>
                        <div className="text-xs text-tertiary">View wholesale pricing & deals</div>
                      </div>
                    </button>
                  </div>
                  
                  <div className="px-4 py-2 border-t border-light mt-1">
                    <button 
                      onClick={() => handleNavigation('/wholesale')}
                      className="text-sm text-accent-600 hover:text-accent-700 flex items-center gap-1 justify-center w-full transition-fast"
                    >
                      <span>Visit Wholesale Center</span>
                      <ChevronDown size={14} className="rotate-[-90deg]" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Search Bar - Desktop - Reduced Height */}
          <div className="hidden lg:block flex-1 max-w-xl mx-6">
            <div className="relative group">
              <input
                type="text"
                placeholder="Search for shirts, products, and more..."
                className="w-full pl-10 pr-12 py-2 border-2 border-medium radius-large focus:border-focus focus:outline-none bg-surface-1 text-secondary placeholder-tertiary/60 text-sm transition-all duration-200 group-hover:border-primary-300"
              />
              <Search className="absolute left-3 top-2.5 text-tertiary group-hover:text-primary-500 transition-colors" size={18} />
              <button 
                onClick={() => handleNavigation('/search')}
                className="absolute right-2 top-1.5 px-3 py-1 bg-primary-500 text-inverse radius-md text-xs font-medium hover:bg-primary-600 transition-fast"
              >
                Go
              </button>
            </div>
          </div>

          {/* Cart & Profile - Desktop - Reduced Size */}
          <div className="hidden lg:flex items-center gap-3">
            <button 
              onClick={() => handleNavigation('/cart')}
              className="relative text-secondary hover:text-primary-600 transition-fast p-1.5"
            >
              <ShoppingCart size={22} />
              <span className="absolute -top-1 -right-1 bg-accent-500 text-inverse text-xs w-4 h-4 flex items-center justify-center rounded-full font-medium">3</span>
            </button>
            
            {/* User Dropdown */}
            <div 
              className="relative"
              ref={userDropdownRef}
              onMouseEnter={handleUserMouseEnter}
              onMouseLeave={handleUserMouseLeave}
            >
              <button 
                onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                className="flex items-center gap-1 text-secondary hover:text-primary-600 transition-fast p-1.5"
              >
                <User size={22} />
                <span className="text-sm font-medium">Account</span>
                <ChevronDown size={14} className={`transition-transform duration-200 ${isUserDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {isUserDropdownOpen && (
                <div className="absolute top-full right-0 mt-1 w-64 bg-card border-2 border-medium radius-xl shadow-xl py-2 z-dropdown slide-down">
                  <div className="px-4 py-2 border-b border-light">
                    <span className="text-sm font-semibold text-primary-600">Welcome!</span>
                  </div>
                  
                  <div className="py-1">
                    <button 
                      onClick={() => handleNavigation('/auth/retailer/signin')}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-secondary hover:bg-primary-100 hover:text-primary-600 transition-fast border-b border-light"
                    >
                      <LogIn size={16} className="text-primary-500" />
                      <div className="text-left">
                        <div className="text-sm font-medium">Retailer Sign In</div>
                        <div className="text-xs text-tertiary">Access your retailer account</div>
                      </div>
                    </button>
                    
                    <button 
                      onClick={() => handleNavigation('/auth/wholesaler/signin')}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-secondary hover:bg-primary-100 hover:text-primary-600 transition-fast"
                    >
                      <Store size={16} className="text-accent-500" />
                      <div className="text-left">
                        <div className="text-sm font-medium">Wholesaler Sign In</div>
                        <div className="text-xs text-tertiary">Access your wholesale account</div>
                      </div>
                    </button>
                  </div>
                  
                  <div className="px-4 py-2 border-t border-light mt-1">
                    <button 
                      onClick={() => handleNavigation('/auth/retailer/signup')}
                      className="text-sm text-accent-600 hover:text-accent-700 flex items-center gap-1 justify-center w-full transition-fast"
                    >
                      <span>New customer? Sign up</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden flex items-center gap-2">
            <button 
              onClick={() => handleNavigation('/cart')}
              className="relative text-secondary hover:text-primary-600 p-1.5"
            >
              <ShoppingCart size={22} />
              <span className="absolute -top-1 -right-1 bg-accent-500 text-inverse text-xs w-4 h-4 flex items-center justify-center rounded-full">3</span>
            </button>
            
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-secondary hover:text-primary-600 p-1.5"
            >
              {isMobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {/* Mobile Search - Reduced Height */}
        <div className="lg:hidden pb-2">
          <div className="relative">
            <input
              type="text"
              placeholder="Search products..."
              className="w-full pl-8 pr-12 py-1.5 border-2 border-medium radius-large focus:border-focus focus:outline-none bg-surface-1 text-secondary text-sm"
            />
            <Search className="absolute left-2.5 top-2 text-tertiary" size={16} />
            <button 
              onClick={() => handleNavigation('/search')}
              className="absolute right-1.5 top-1 px-2 py-0.5 bg-primary-500 text-inverse radius-md text-xs font-medium"
            >
              Go
            </button>
          </div>
        </div>

        {/* Mobile Menu - Same Styles, Compact */}
        {isMobileMenuOpen && (
          <div className="lg:hidden border-t border-light py-3 slide-down" ref={mobileMenuRef}>
            {/* Wholesale Section - MOBILE - Same Style */}
            <div className="mb-3">
              <button 
                onClick={(e) => {
                  e.preventDefault();
                  setIsVendorDropdownOpen(!isVendorDropdownOpen);
                }}
                className="flex items-center justify-between w-full px-4 py-2.5 text-secondary hover:text-primary-600 border border-medium radius-large bg-surface-1"
              >
                <div className="flex items-center gap-2">
                  <Store size={18} />
                  <span className="text-base font-medium">Wholesale</span>
                </div>
                <ChevronDown size={18} className={`transition-transform duration-200 ${isVendorDropdownOpen ? 'rotate-180' : ''}`} />
              </button>
              
              {isVendorDropdownOpen && (
                <div className="mt-2 border border-medium radius-large bg-card overflow-hidden">
                  <button 
                    onClick={() => handleNavigation('/wholesale/register')}
                    className="w-full flex items-center gap-3 py-2.5 px-4 text-secondary hover:bg-primary-100 border-b border-light"
                  >
                    <Package size={16} className="text-primary-500" />
                    <div className="text-left">
                      <div className="text-sm font-medium">Become a Vendor</div>
                      <div className="text-xs text-tertiary">Register your business</div>
                    </div>
                  </button>
                  
                  <button 
                    onClick={() => handleNavigation('/wholesale/dashboard')}
                    className="w-full flex items-center gap-3 py-2.5 px-4 text-secondary hover:bg-primary-100 border-b border-light"
                  >
                    <Store size={16} className="text-accent-500" />
                    <div className="text-left">
                      <div className="text-sm font-medium">Vendor Dashboard</div>
                      <div className="text-xs text-tertiary">Manage inventory</div>
                    </div>
                  </button>
                  
                  <button 
                    onClick={() => handleNavigation('/wholesale/bulk-orders')}
                    className="w-full flex items-center gap-3 py-2.5 px-4 text-secondary hover:bg-primary-100"
                  >
                    <ShoppingCart size={16} className="text-success-500" />
                    <div className="text-left">
                      <div className="text-sm font-medium">Bulk Orders</div>
                      <div className="text-xs text-tertiary">Wholesale pricing</div>
                    </div>
                  </button>
                </div>
              )}
            </div>

            {/* Cities Section - MOBILE - Same Style */}
            <div className="mb-3">
              <button 
                onClick={(e) => {
                  e.preventDefault();
                  setIsCitiesDropdownOpen(!isCitiesDropdownOpen);
                }}
                className="flex items-center justify-between w-full px-4 py-2.5 text-secondary hover:text-primary-600 border border-medium radius-large bg-surface-1"
              >
                <span className="text-base font-medium">Select Cities</span>
                <ChevronDown size={18} className={`transition-transform duration-200 ${isCitiesDropdownOpen ? 'rotate-180' : ''}`} />
              </button>
              
              {isCitiesDropdownOpen && (
                <div className="mt-2 border border-medium radius-large bg-card overflow-hidden">
                  {cities.map((city, index) => (
                    <button
                      key={index}
                      onClick={() => handleNavigation(`/city/${city.toLowerCase()}`)}
                      className="w-full text-left py-2.5 px-4 text-secondary hover:bg-primary-100 hover:text-primary-600 border-b border-light last:border-0"
                    >
                      {city}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Account Section - MOBILE - Same Style */}
            <div className="mb-3">
              <button 
                onClick={(e) => {
                  e.preventDefault();
                  setIsUserDropdownOpen(!isUserDropdownOpen);
                }}
                className="flex items-center justify-between w-full px-4 py-2.5 text-secondary hover:text-primary-600 border border-medium radius-large bg-surface-1"
              >
                <div className="flex items-center gap-2">
                  <User size={20} />
                  <span className="text-base font-medium">Account</span>
                </div>
                <ChevronDown size={18} className={`transition-transform duration-200 ${isUserDropdownOpen ? 'rotate-180' : ''}`} />
              </button>
              
              {isUserDropdownOpen && (
                <div className="mt-2 border border-medium radius-large bg-card overflow-hidden">
                  <button 
                    onClick={() => handleNavigation('/auth/retailer/signin')}
                    className="w-full flex items-center gap-3 py-2.5 px-4 text-secondary hover:bg-primary-100 border-b border-light"
                  >
                    <LogIn size={16} className="text-primary-500" />
                    <div className="text-left">
                      <div className="text-sm font-medium">Retailer Sign In</div>
                      <div className="text-xs text-tertiary">Access your account</div>
                    </div>
                  </button>
                  
                  <button 
                    onClick={() => handleNavigation('/auth/wholesaler/signin')}
                    className="w-full flex items-center gap-3 py-2.5 px-4 text-secondary hover:bg-primary-100"
                  >
                    <Store size={16} className="text-accent-500" />
                    <div className="text-left">
                      <div className="text-sm font-medium">Wholesaler Sign In</div>
                      <div className="text-xs text-tertiary">Access wholesale account</div>
                    </div>
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}