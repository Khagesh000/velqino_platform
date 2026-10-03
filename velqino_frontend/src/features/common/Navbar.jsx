'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { 
  Search, 
  ShoppingCart, 
  MapPin, 
  User, 
  ChevronDown, 
  Menu, 
  X, 
  Store, 
  Package, 
  LogIn, 
  Heart, 
  Truck, 
  Shield, 
  Bell, 
  Sparkles,
  ArrowRight
} from '../../utils/icons';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import WholesalerLoginModal from "./WholesalerLoginModal";
import RetailerLoginModal from "./RetailerLoginModal";
import CustomerLoginModal from "./CustomerLoginModal";
import { useGetCartQuery } from '@/redux/wholesaler/slices/cartSlice';
import { getAccessToken, clearAuthTokens, getAuthUser, setAuthUser } from '@/utils/cookieUtils';
import '../../styles/common/Navbar.scss';

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
  const [userEmail, setUserEmail] = useState('');
  
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

  const pathname = usePathname();
  const isHomePage = pathname === '/';

  // Fetch cart count
  const { data: cartData, refetch: refetchCart } = useGetCartQuery();
  const cartCount = cartData?.summary?.item_count || 0;

  const displayName = useMemo(() => {
    if (userName && userName !== 'undefined' && userName !== 'null') return userName;
    if (userEmail && userEmail !== 'undefined' && userEmail !== 'null') return userEmail.split('@')[0];
    return 'User';
  }, [userName, userEmail]);

  const displayEmail = useMemo(() => {
    if (userEmail && userEmail !== 'undefined' && userEmail !== 'null') return userEmail;
    return '';
  }, [userEmail]);

  useEffect(() => {
    setMounted(true);
    const syncAuth = () => {
      const token = getAccessToken();
      const auth = getAuthUser();
      const role = auth.role || (typeof window !== 'undefined' ? localStorage.getItem('user_role') : null);
      if (token && role) {
        setIsLoggedIn(true);
        setUserRole(role);
        setUserName(auth.name && auth.name !== 'undefined' ? auth.name : '');
        setUserEmail(auth.email && auth.email !== 'undefined' ? auth.email : '');
      } else {
        setIsLoggedIn(false);
        setUserRole(null);
        setUserName('');
        setUserEmail('');
      }
    };

    syncAuth();

    const handleAuthUpdated = () => {
      syncAuth();
    };

    window.addEventListener('velqino:auth-user-updated', handleAuthUpdated);
    window.addEventListener('storage', handleAuthUpdated);
    return () => {
      window.removeEventListener('velqino:auth-user-updated', handleAuthUpdated);
      window.removeEventListener('storage', handleAuthUpdated);
    };
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > lastScrollY && window.scrollY > 120) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }
      setLastScrollY(window.scrollY);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  useEffect(() => {
    if (mounted) {
      refetchCart();
    }
  }, [isLoggedIn, mounted, refetchCart]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (userDropdownRef.current && !userDropdownRef.current.contains(event.target)) {
        setIsUserDropdownOpen(false);
      }
      if (citiesDropdownRef.current && !citiesDropdownRef.current.contains(event.target)) {
        setIsCitiesDropdownOpen(false);
      }
      if (becomeSellerDropdownRef.current && !becomeSellerDropdownRef.current.contains(event.target)) {
        setIsBecomeSellerOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleDashboardNavigation = useMemo(() => {
    return () => {
      const token = getAccessToken();
      const role = localStorage.getItem('user_role');
      
      if (!token || !role) {
        toast.error('Please login to access dashboard', {
          position: 'bottom-right',
          duration: 3000
        });
        router.push('/');
        return;
      }
      
      const dashboardMap = {
        wholesaler: '/wholesaler/wholesalerdashboard',
        retailer: '/retailer/retailerdashboard',
        customer: '/customer/dashboard'
      };
      
      const dashboardUrl = dashboardMap[role];
      
      if (!dashboardUrl) {
        toast.error('Invalid user role');
        return;
      }
      
      router.push(dashboardUrl);
    };
  }, [router]);

  const handleLogout = () => {
    clearAuthTokens();
    setIsLoggedIn(false);
    setUserRole(null);
    setUserName('');
    setUserEmail('');
    router.push('/');
  };

  const cities = ['Mumbai', 'Delhi', 'Bangalore', 'Chennai', 'Kolkata', 'Pune', 'Jaipur', 'Hyderabad', 'Ahmedabad', 'Surat'];

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
    const token = getAccessToken();
    const userRoleCurrent = localStorage.getItem('user_role');
    
    if (token && userRoleCurrent === role) {
      if (role === 'wholesaler') router.push('/wholesaler/wholesalerdashboard');
      else if (role === 'retailer') router.push('/retailer/retailerdashboard');
      else router.push('/customer/dashboard');
    } else {
      if (role === 'wholesaler') setIsWholesalerLoginOpen(true);
      else if (role === 'retailer') setIsRetailerLoginOpen(true);
      else setIsCustomerLoginOpen(true);
    }
  };

  const handleLoginSuccess = (role, userData) => {
    const resolvedName = userData?.name || (userData?.email ? userData.email.split('@')[0] : '');
    const resolvedEmail = userData?.email || '';
    setAuthUser({ name: resolvedName, email: resolvedEmail, role, id: userData?.id });
    setIsLoggedIn(true);
    setUserRole(role);
    setUserName(resolvedName);
    setUserEmail(resolvedEmail);
    
    setIsWholesalerLoginOpen(false);
    setIsRetailerLoginOpen(false);
    setIsCustomerLoginOpen(false);
    
    if (role === 'wholesaler') router.push('/wholesaler/wholesalerdashboard');
    else if (role === 'retailer') router.push('/retailer/retailerdashboard');
    else router.push('/customer/dashboard');
  };

  const getRoleBadgeColor = () => {
    if (userRole === 'wholesaler') return 'bg-primary-100 text-primary-800 border border-primary-200';
    if (userRole === 'retailer') return 'bg-accent-100 text-accent-800 border border-accent-200';
    return 'bg-emerald-50 text-emerald-700 border border-emerald-200';
  };

  if (!mounted) {
    return (
      <nav className="bg-white border-b border-primary-100 sticky top-0 z-50 shadow-2xs">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16 lg:h-20">
            <div className="flex-shrink-0">
              <Link href="/" className="flex items-center gap-1.5">
                <span className="text-2xl font-black tracking-tight text-gray-900">VELTRIX</span>
                <span className="w-2 h-2 rounded-full bg-accent-500" />
              </Link>
            </div>
          </div>
        </div>
      </nav>
    );
  }

  return (
    <>
      <nav className={`bg-white/95 backdrop-blur-md border-b border-primary-200/80 fixed top-0 w-full z-50 shadow-2xs transition-transform duration-300 ${isVisible ? 'translate-y-0' : '-translate-y-full'}`}>
        <div className="container mx-auto px-4">
          
          {/* Top Bar - Free Shipping & Trust Bar */}
          {isHomePage && (
            <div className="hidden lg:flex items-center justify-between py-1.5 border-b border-primary-100/70 text-[11px] font-medium text-gray-500">
              <div className="flex items-center gap-4">
                <span className="inline-flex items-center gap-1.5 text-primary-700 font-semibold">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                  Free Shipping on Orders Above ₹999
                </span>
                <span className="text-primary-200">|</span>
                <span className="hover:text-primary-700 transition-colors">100% Escrow Trade Guarantee</span>
                <span className="text-primary-200">|</span>
                <span className="hover:text-primary-700 transition-colors">Direct Factory Mill Lots</span>
              </div>
              <div className="flex items-center gap-5">
                <button 
                  onClick={() => handleNavigation('/track-order')} 
                  className="text-gray-500 hover:text-primary-600 transition-colors flex items-center gap-1"
                >
                  <Truck size={12} className="text-primary-500" />
                  <span>Track Freight Order</span>
                </button>
                <button 
                  onClick={() => handleNavigation('/profile/wishlist')} 
                  className="text-gray-500 hover:text-primary-600 transition-colors flex items-center gap-1"
                >
                  <Heart size={12} className="text-primary-500" />
                  <span>Wholesale Wishlist</span>
                </button>
                <button 
                  onClick={() => handleNavigation('/help')} 
                  className="text-gray-500 hover:text-primary-600 transition-colors flex items-center gap-1"
                >
                  <Shield size={12} className="text-primary-500" />
                  <span>B2B Help Desk</span>
                </button>
              </div>
            </div>
          )}

          {/* Main Navbar */}
          <div className="flex items-center justify-between h-16 lg:h-18">
            
            {/* Logo */}
            <div className="flex-shrink-0">
              <Link href="/" className="flex items-center gap-1.5 group">
                <span className="text-xl lg:text-2xl font-black tracking-tight text-gray-900 group-hover:text-primary-600 transition-colors">
                  VELTRIX
                </span>
                <span className="w-2 h-2 rounded-full bg-accent-500 group-hover:scale-125 transition-transform" />
              </Link>
            </div>

            {/* Desktop Navigation Controls */}
            <div className="hidden lg:flex items-center flex-1 ml-6 gap-3">
              
              {/* Cities Dropdown */}
              <div 
                className="relative" 
                ref={citiesDropdownRef}
                onMouseEnter={handleCitiesMouseEnter}
                onMouseLeave={handleCitiesMouseLeave}
              >
                <button className="flex items-center gap-1.5 text-gray-800 hover:text-primary-700 transition-all px-3 py-1.5 rounded-xl border border-primary-200/80 bg-primary-50/40 hover:bg-primary-50 hover:border-primary-400 shadow-2xs font-semibold text-xs">
                  <MapPin size={14} className="text-primary-600" />
                  <span>Select City</span>
                  <ChevronDown size={13} className={`transition-transform duration-200 ${isCitiesDropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {isCitiesDropdownOpen && (
                  <div className="absolute top-full left-0 mt-2 w-72 bg-white border border-primary-200/90 rounded-2xl shadow-xl py-2 z-50 animate-fadeIn">
                    <div className="px-4 py-2 border-b border-primary-100 flex items-center justify-between">
                      <span className="text-xs font-bold text-gray-900 uppercase tracking-wider">Select Hub City</span>
                      <span className="text-[10px] font-bold text-primary-700 bg-primary-100 px-2 py-0.5 rounded-full">Pan-India</span>
                    </div>
                    <div className="py-1 max-h-60 overflow-y-auto">
                      {cities.map((city, index) => (
                        <button
                          key={index}
                          onClick={() => handleNavigation(`/city/${city.toLowerCase()}`)}
                          className="w-full text-left px-4 py-2 text-xs font-medium text-gray-700 hover:bg-primary-50 hover:text-primary-700 transition-all flex items-center justify-between"
                        >
                          <span>{city}</span>
                          <span className="text-[10px] text-gray-400">Hub Active</span>
                        </button>
                      ))}
                    </div>
                    <div className="px-4 py-2 border-t border-primary-100">
                      <button onClick={() => handleNavigation('/locations')} className="text-xs font-bold text-primary-600 hover:text-primary-700 flex items-center gap-1">
                        <span>View all 19,000+ PIN hubs</span>
                        <ArrowRight size={12} />
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
                <button className="flex items-center gap-1.5 text-gray-800 hover:text-primary-700 transition-all px-3 py-1.5 rounded-xl border border-primary-200/80 bg-primary-50/40 hover:bg-primary-50 hover:border-primary-400 shadow-2xs font-semibold text-xs">
                  <Store size={14} className="text-primary-600" />
                  <span>Become a Seller</span>
                  <ChevronDown size={13} className={`transition-transform duration-200 ${isBecomeSellerOpen ? 'rotate-180' : ''}`} />
                </button>

                {isBecomeSellerOpen && (
                  <div className="absolute top-full left-0 mt-2 w-80 bg-white border border-primary-200/90 rounded-2xl shadow-xl p-2 z-50 animate-fadeIn">
                    <div className="px-3 py-2 border-b border-primary-100">
                      <span className="text-xs font-bold text-gray-900 uppercase tracking-wider">Sell on VELTRIX B2B</span>
                    </div>
                    <div className="py-1 space-y-1">
                      <button 
                        onClick={() => handleRoleLogin('wholesaler')}
                        className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-primary-50/60 transition-all text-left group"
                      >
                        <div className="w-8 h-8 rounded-lg bg-primary-100 text-primary-700 flex items-center justify-center flex-shrink-0 group-hover:bg-primary-600 group-hover:text-white transition-colors">
                          <Shield size={16} />
                        </div>
                        <div>
                          <div className="text-xs font-bold text-gray-900 group-hover:text-primary-700">Wholesale Mill / Supplier</div>
                          <div className="text-[11px] text-gray-500">List volume denim & fabric lots</div>
                        </div>
                      </button>
                      
                      <button 
                        onClick={() => handleRoleLogin('retailer')}
                        className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-primary-50/60 transition-all text-left group"
                      >
                        <div className="w-8 h-8 rounded-lg bg-primary-100 text-primary-700 flex items-center justify-center flex-shrink-0 group-hover:bg-primary-600 group-hover:text-white transition-colors">
                          <Store size={16} />
                        </div>
                        <div>
                          <div className="text-xs font-bold text-gray-900 group-hover:text-primary-700">Verified Retail Buyer</div>
                          <div className="text-[11px] text-gray-500">Source direct stock for your store</div>
                        </div>
                      </button>
                    </div>
                  </div>
                )}
              </div>

            </div>

            {/* Center Omni Search Bar */}
            <div className="hidden lg:block flex-1 max-w-xl mx-4 xl:mx-6">
              <div className="relative group">
                <input
                  type="text"
                  placeholder="Search fabric lots, baggy denim, cotton shirts, brands..."
                  className="w-full pl-10 pr-24 py-2 border border-primary-200/80 rounded-full focus:border-primary-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary-200/50 bg-primary-50/30 text-xs sm:text-sm text-gray-900 placeholder-gray-400 transition-all font-medium"
                />
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary-600 transition-colors" size={16} />
                <button className="absolute right-1 top-1/2 -translate-y-1/2 px-4 py-1.5 bg-primary-600 hover:bg-primary-700 active:scale-95 text-white rounded-full text-xs font-bold transition-all shadow-xs">
                  Search
                </button>
              </div>
            </div>

            {/* Right Section - Cart & Account Controls */}
            <div className="flex items-center gap-3">
              
              {/* Cart Button */}
              <button 
                onClick={() => handleNavigation('/product/cartpage')} 
                className="relative text-gray-700 hover:text-primary-600 hover:bg-primary-50/60 p-2 rounded-xl transition-all"
                aria-label="View Cart"
              >
                <ShoppingCart size={22} />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-primary-600 text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full font-bold shadow-xs border-2 border-white">
                    {cartCount}
                  </span>
                )}
              </button>

              {/* User Dropdown */}
              <div className="relative" ref={userDropdownRef}>
                <button 
                  onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                  className="flex items-center gap-1.5 text-gray-800 hover:text-primary-700 transition-all px-3 py-1.5 rounded-xl border border-primary-200/80 bg-primary-50/40 hover:bg-primary-50 hover:border-primary-400 shadow-2xs font-semibold text-xs"
                >
                  <User size={16} className="text-primary-600" />
                  <span className="hidden lg:block">
                    {isLoggedIn ? `Hi, ${displayName}` : 'Account'}
                  </span>
                  <ChevronDown size={13} className={`hidden lg:block transition-transform duration-200 ${isUserDropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {isUserDropdownOpen && (
                  <div className="absolute right-0 top-full mt-2 w-72 bg-white border border-primary-200/90 rounded-2xl shadow-xl p-2 z-50 animate-fadeIn">
                    {isLoggedIn ? (
                      <>
                        <div className="px-3 py-2.5 border-b border-primary-100">
                          <p className="text-xs font-bold text-gray-900 truncate">{displayName}</p>
                          {displayEmail ? (
                            <p className="text-[11px] text-gray-500 truncate">{displayEmail}</p>
                          ) : null}
                          <p className="text-[11px] text-gray-500 mt-0.5">{userRole === 'wholesaler' ? 'Wholesaler Account' : userRole === 'retailer' ? 'Retailer Account' : 'Customer Account'}</p>
                          <span className={`inline-block mt-1.5 text-[10px] px-2 py-0.5 rounded-full font-bold ${getRoleBadgeColor()}`}>
                            {userRole?.charAt(0).toUpperCase() + userRole?.slice(1)}
                          </span>
                        </div>
                        
                        <div className="py-1">
                          <button 
                            onClick={handleDashboardNavigation}
                            className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-gray-700 hover:bg-primary-50 hover:text-primary-700 rounded-lg transition-all"
                          >
                            <Package size={15} className="text-primary-500" />
                            <span>Dashboard</span>
                          </button>
                          
                          <button 
                            onClick={() => handleNavigation('/product/orderslist')} 
                            className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-gray-700 hover:bg-primary-50 hover:text-primary-700 rounded-lg transition-all"
                          >
                            <Truck size={15} className="text-primary-500" />
                            <span>My Orders</span>
                          </button>

                          <button 
                            onClick={() => router.push('/profile/addresses')} 
                            className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-gray-700 hover:bg-primary-50 hover:text-primary-700 rounded-lg transition-all"
                          >
                            <MapPin size={15} className="text-primary-500" />
                            <span>Saved Addresses</span>
                          </button>
                          
                          <button 
                            onClick={() => handleNavigation('/profile/wishlist')} 
                            className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-gray-700 hover:bg-primary-50 hover:text-primary-700 rounded-lg transition-all"
                          >
                            <Heart size={15} className="text-primary-500" />
                            <span>Wishlist</span>
                          </button>
                          
                          <button 
                            onClick={() => handleNavigation('/settings')} 
                            className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-gray-700 hover:bg-primary-50 hover:text-primary-700 rounded-lg transition-all"
                          >
                            <User size={15} className="text-primary-500" />
                            <span>Profile Settings</span>
                          </button>
                        </div>
                        
                        <div className="pt-1 border-t border-primary-100">
                          <button 
                            onClick={handleLogout} 
                            className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-bold text-red-600 hover:bg-red-50 rounded-lg transition-all"
                          >
                            <LogIn size={15} />
                            <span>Sign Out</span>
                          </button>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="px-3 py-2.5 border-b border-primary-100">
                          <p className="text-xs font-bold text-gray-900">Welcome to VELTRIX B2B</p>
                          <p className="text-[11px] text-gray-500 mt-0.5">Select your portal to log in:</p>
                        </div>
                        
                        <div className="py-1 space-y-1">
                          <button 
                            onClick={() => handleRoleLogin('customer')} 
                            className="w-full flex items-center gap-2.5 px-3 py-2.5 text-gray-700 hover:bg-primary-50 hover:text-primary-700 rounded-lg transition-all text-left"
                          >
                            <User size={15} className="text-emerald-600" />
                            <div>
                              <div className="text-xs font-bold">Customer Portal</div>
                              <div className="text-[10px] text-gray-400">Personal retail purchases</div>
                            </div>
                          </button>
                          
                          <button 
                            onClick={() => handleRoleLogin('retailer')} 
                            className="w-full flex items-center gap-2.5 px-3 py-2.5 text-gray-700 hover:bg-primary-50 hover:text-primary-700 rounded-lg transition-all text-left"
                          >
                            <Store size={15} className="text-primary-600" />
                            <div>
                              <div className="text-xs font-bold">Retailer Portal</div>
                              <div className="text-[10px] text-gray-400">Store orders & wholesale lots</div>
                            </div>
                          </button>
                          
                          <button 
                            onClick={() => handleRoleLogin('wholesaler')} 
                            className="w-full flex items-center gap-2.5 px-3 py-2.5 text-gray-700 hover:bg-primary-50 hover:text-primary-700 rounded-lg transition-all text-left"
                          >
                            <Shield size={15} className="text-accent-600" />
                            <div>
                              <div className="text-xs font-bold">Wholesaler Mill Portal</div>
                              <div className="text-[10px] text-gray-400">Factory lot distribution</div>
                            </div>
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                )}
              </div>

              {/* Mobile Menu Toggle Button */}
              <button 
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} 
                className="lg:hidden text-gray-700 hover:text-primary-600 p-2 rounded-xl hover:bg-primary-50 transition-all"
                aria-label="Toggle mobile menu"
              >
                {isMobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
              </button>
            </div>

          </div>

          {/* Mobile Search Bar */}
          <div className="lg:hidden pb-3">
            <div className="relative">
              <input
                type="text"
                placeholder="Search products, denim, fabric lots..."
                className="w-full pl-10 pr-16 py-2 border border-primary-200/80 rounded-full bg-primary-50/40 text-xs focus:outline-none focus:border-primary-500 text-gray-900"
              />
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={15} />
              <button className="absolute right-1 top-1/2 -translate-y-1/2 px-3 py-1 bg-primary-600 text-white rounded-full text-xs font-bold">
                Go
              </button>
            </div>
          </div>

          {/* Mobile Menu Drawer */}
          {isMobileMenuOpen && (
            <div className="lg:hidden border-t border-primary-100 py-3 animate-slideDown" ref={mobileMenuRef}>
              {isLoggedIn && (
                <div className="px-3 py-2 mb-2 bg-primary-50/50 rounded-xl border border-primary-100 flex items-center justify-between">
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-bold text-gray-900 truncate">{displayName}</p>
                    {displayEmail && <p className="text-[11px] text-gray-500 truncate">{displayEmail}</p>}
                    <span className={`inline-block mt-1 text-[9px] px-2 py-0.5 rounded-full font-bold ${getRoleBadgeColor()}`}>
                      {userRole?.charAt(0).toUpperCase() + userRole?.slice(1)}
                    </span>
                  </div>
                  <button 
                    onClick={handleLogout}
                    className="ml-2 text-xs font-bold text-red-600 hover:text-red-700 px-2 py-1 rounded-lg hover:bg-red-50"
                  >
                    Logout
                  </button>
                </div>
              )}
              <div className="space-y-1">
                {!isLoggedIn ? (
                  <>
                    <button 
                      onClick={() => handleRoleLogin('customer')} 
                      className="w-full flex items-center gap-3 py-2.5 px-3 text-gray-700 hover:bg-primary-50 rounded-xl text-xs font-semibold"
                    >
                      <User size={16} className="text-emerald-600" />
                      <span>Customer Sign In</span>
                    </button>
                    
                    <button 
                      onClick={() => handleRoleLogin('retailer')} 
                      className="w-full flex items-center gap-3 py-2.5 px-3 text-gray-700 hover:bg-primary-50 rounded-xl text-xs font-semibold"
                    >
                      <Store size={16} className="text-primary-600" />
                      <span>Retailer Sign In</span>
                    </button>
                    
                    <button 
                      onClick={() => handleRoleLogin('wholesaler')} 
                      className="w-full flex items-center gap-3 py-2.5 px-3 text-gray-700 hover:bg-primary-50 rounded-xl text-xs font-semibold"
                    >
                      <Shield size={16} className="text-accent-600" />
                      <span>Wholesaler Sign In</span>
                    </button>
                  </>
                ) : (
                  <button 
                    onClick={handleDashboardNavigation} 
                    className="w-full flex items-center gap-3 py-2.5 px-3 text-gray-700 hover:bg-primary-50 rounded-xl text-xs font-semibold"
                  >
                    <Package size={16} className="text-primary-600" />
                    <span>Go to Dashboard</span>
                  </button>
                )}
                
                <button 
                  onClick={() => handleNavigation('/product/cartpage')} 
                  className="w-full flex items-center gap-3 py-2.5 px-3 text-gray-700 hover:bg-primary-50 rounded-xl text-xs font-semibold"
                >
                  <ShoppingCart size={16} className="text-primary-600" />
                  <span>View Cart ({cartCount})</span>
                </button>
                
                <button 
                  onClick={() => handleNavigation('/profile/wishlist')} 
                  className="w-full flex items-center gap-3 py-2.5 px-3 text-gray-700 hover:bg-primary-50 rounded-xl text-xs font-semibold"
                >
                  <Heart size={16} className="text-primary-600" />
                  <span>Wholesale Wishlist</span>
                </button>
              </div>
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
