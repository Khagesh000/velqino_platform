"use client"

import React, { useState, useRef, useEffect, useCallback } from 'react'
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link'
import {
  ChevronDown,
  Bell,
  User,
  HelpCircle,
  Search,
  Menu,
  X,
  Home,
  Package,
  Grid,
  BarChart3,
  Users,
  Wallet,
  Settings,
  PlusCircle,
  Upload,
  LogOut,
  Shield,
  ExternalLink,
  Check,
  Sparkles
} from '@/utils/icons';
import { toast } from 'react-toastify';
import '../../../../styles/Wholesaler/WholesalerDashboard/WholesaleNavbar.scss'
import ImportImagesModal from '../../ProductsCatalog/Modals/ImportImagesModal';
import ImportModal from '../../ProductsCatalog/Modals/ImportModal';
import { useGetCategoriesQuery } from '@/redux/wholesaler/slices/categoriesSlice';

export default function WholesaleNavbar({ isSidebarCollapsed, setIsSidebarCollapsed }) {
  const router = useRouter();
  const pathname = usePathname();

  const { data: categoriesData } = useGetCategoriesQuery();
  const categories = categoriesData?.data || categoriesData || [];

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false)
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false)
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false)
  const [showImportDropdown, setShowImportDropdown] = useState(false)
  const [showAddProductModal, setShowAddProductModal] = useState(false)
  const [showImportImagesModal, setShowImportImagesModal] = useState(false)
  const [showImportVideoModal, setShowImportVideoModal] = useState(false)

  // User details from localStorage (SSR-safe)
  const [userName, setUserName] = useState('Wholesale Store')
  const [userEmail, setUserEmail] = useState('merchant@velqino.com')
  const [pendingOrdersCount, setPendingOrdersCount] = useState(0)
  const [customersCount, setCustomersCount] = useState(0)

  const navbarRef = useRef(null);
  const lastScrollTopRef = useRef(0);
  const scrollRafRef = useRef(null);
  const profileDropdownRef = useRef(null)
  const notificationsRef = useRef(null)
  const importDropdownRef = useRef(null)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedName = localStorage.getItem('user_name');
      const storedEmail = localStorage.getItem('user_email');
      const storedPending = parseInt(localStorage.getItem('wholesaler_pending_orders')) || 0;
      const storedCustomers = parseInt(localStorage.getItem('wholesaler_customers_count')) || 0;

      if (storedName) setUserName(storedName);
      if (storedEmail) setUserEmail(storedEmail);
      if (storedPending) setPendingOrdersCount(storedPending);
      if (storedCustomers) setCustomersCount(storedCustomers);
    }
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (typeof document !== 'undefined') {
      if (isMobileMenuOpen) {
        document.body.style.overflow = 'hidden';
      } else {
        document.body.style.overflow = '';
      }
    }
    return () => {
      if (typeof document !== 'undefined') {
        document.body.style.overflow = '';
      }
    };
  }, [isMobileMenuOpen]);

  // Handle click outside for dropdowns
  useEffect(() => {
    function handleClickOutside(event) {
      if (profileDropdownRef.current && !profileDropdownRef.current.contains(event.target)) {
        setIsProfileDropdownOpen(false)
      }
      if (notificationsRef.current && !notificationsRef.current.contains(event.target)) {
        setIsNotificationsOpen(false)
      }
      if (importDropdownRef.current && !importDropdownRef.current.contains(event.target)) {
        setShowImportDropdown(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // High-performance scroll handler without triggering React re-renders on every scroll tick
  useEffect(() => {
    const handleScroll = () => {
      if (scrollRafRef.current) return;

      scrollRafRef.current = requestAnimationFrame(() => {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const lastScroll = lastScrollTopRef.current;

        if (navbarRef.current) {
          if (scrollTop > lastScroll && scrollTop > 80) {
            navbarRef.current.classList.add('navbar-hidden');
            navbarRef.current.classList.remove('navbar-visible');
          } else {
            navbarRef.current.classList.add('navbar-visible');
            navbarRef.current.classList.remove('navbar-hidden');
          }
        }

        lastScrollTopRef.current = scrollTop <= 0 ? 0 : scrollTop;
        scrollRafRef.current = null;
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (scrollRafRef.current) cancelAnimationFrame(scrollRafRef.current);
    };
  }, []);

  // Unified Logout action
  const handleLogout = useCallback(() => {
    try {
      localStorage.removeItem('access');
      localStorage.removeItem('refresh');
      localStorage.removeItem('user_role');
      localStorage.removeItem('user_name');
      localStorage.removeItem('user_id');
      localStorage.removeItem('user_email');
      localStorage.removeItem('token');
      localStorage.removeItem('wholesaler_id');
      localStorage.removeItem('wholesaler_pending_orders');
      localStorage.removeItem('wholesaler_customers_count');

      // Clear authentication cookies
      document.cookie = 'access=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
      document.cookie = 'refresh=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    } catch (err) {
      console.error('Logout error:', err);
    }

    toast.success('Signed out successfully');
    setIsMobileMenuOpen(false);
    setIsProfileDropdownOpen(false);
    router.push('/login');
  }, [router]);

  // Notifications mock data
  const notifications = [
    { id: 1, type: 'order', message: 'New wholesale order received #ORD-8492', time: '2 min ago', read: false },
    { id: 2, type: 'stock', message: 'Low inventory alert: Premium Silk SKU-104', time: '15 min ago', read: false },
    { id: 3, type: 'payment', message: 'Settlement disbursement ₹45,000 processed', time: '1 hour ago', read: true },
    { id: 4, type: 'inquiry', message: 'New verified retailer connection request', time: '2 hours ago', read: true },
  ]

  const unreadCount = notifications.filter(n => !n.read).length

  // Navigation items for sidebar
  const navItems = [
    { icon: <Home size={19} />, label: 'Home Dashboard', href: '/wholesaler/wholesalerdashboard', badge: null },
    { icon: <Package size={19} />, label: 'Orders Management', href: '/wholesaler/ordermanagment', badge: pendingOrdersCount > 0 ? pendingOrdersCount.toString() : null },
    { icon: <Grid size={19} />, label: 'Products Catalog', href: '/wholesaler/productcatalog', badge: null },
    { icon: <BarChart3 size={19} />, label: 'Analytics & Reports', href: '/wholesaler/analyticsreports', badge: null },
    { icon: <Users size={19} />, label: 'Customers', href: '/wholesaler/customers', badge: customersCount > 0 ? customersCount.toString() : null },
    { icon: <Wallet size={19} />, label: 'Payments & Payouts', href: '/wholesaler/paymentsandpayouts', badge: null },
    { icon: <Settings size={19} />, label: 'Settings', href: '/wholesaler/settings', badge: null },
  ]

  const isActive = (href) => {
    if (pathname === href) return true;
    return pathname?.startsWith(href) && pathname?.charAt(href.length) === '/';
  };

  const handleAddProduct = () => {
    setShowAddProductModal(true)
  }

  const handleImportImages = () => {
    setShowImportDropdown(false)
    setShowImportImagesModal(true)
  }

  const handleImportVideo = () => {
    setShowImportDropdown(false)
    setShowImportVideoModal(true)
  }

  return (
    <>
      {/* Top Navigation Bar */}
      <nav
        ref={navbarRef}
        className="bg-white border-b border-slate-200/80 sticky top-0 z-40 shadow-xs transition-transform duration-300"
      >
        <div className="px-3 sm:px-5 lg:px-6">
          <div className="flex items-center justify-between h-16 lg:h-20 gap-2">
            {/* Left Section: Logo & Mobile Menu Toggle */}
            <div className="flex items-center gap-2.5 sm:gap-3.5">
              {/* Mobile Menu Toggle Button */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-all active:scale-95"
                aria-label="Open Navigation Menu"
              >
                {isMobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
              </button>

              {/* Logo - Kept exact color gradient as requested */}
              <Link href="/" className="flex items-center gap-2">
                <span className="text-2xl font-extrabold tracking-tight bg-gradient-to-r from-primary-700 via-primary-600 to-primary-500 bg-clip-text text-transparent">
                  VELTRIX
                </span>
              </Link>

              {/* Wholesale Badge */}
              <Link href="/wholesaler/wholesalerdashboard">
                <span className="hidden sm:inline-flex items-center px-2.5 py-0.5 bg-primary-50 text-primary-700 text-xs font-bold rounded-full border border-primary-200/60 uppercase tracking-wider cursor-pointer hover:bg-primary-100 transition-colors">
                  WHOLESALE
                </span>
              </Link>
            </div>

            {/* Center: Global Search - Desktop & Tablet */}
            <div className="hidden md:flex flex-1 max-w-xl mx-4 lg:mx-8">
              <div className="relative w-full">
                <input
                  type="text"
                  placeholder="Search orders, SKU items, retail buyers..."
                  className="w-full pl-10 pr-4 py-2 bg-slate-50/70 border border-slate-200 rounded-xl text-xs sm:text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all placeholder:text-slate-400"
                />
                <Search size={17} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              </div>
            </div>

            {/* Right Section: Mobile Search, Add Product, Notifications, Profile */}
            <div className="flex items-center gap-1 sm:gap-2 lg:gap-3">
              {/* Mobile Search Trigger Icon */}
              <button
                onClick={() => setIsMobileSearchOpen(true)}
                className="md:hidden p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-all active:scale-95"
                aria-label="Search Catalog"
              >
                <Search size={20} />
              </button>

              {/* Quick Add Product Button with Dropdown - Desktop */}
              <div className="relative" ref={importDropdownRef}>
                <button 
                  onClick={() => setShowImportDropdown(!showImportDropdown)}
                  className="hidden lg:inline-flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all shadow-xs active:scale-95"
                >
                  <PlusCircle size={16} />
                  <span>Add Product</span>
                  <ChevronDown size={14} className={`transition-transform duration-200 ${showImportDropdown ? 'rotate-180' : ''}`} />
                </button>
                
                {showImportDropdown && (
                  <div className="absolute right-0 mt-2 w-52 bg-white border border-slate-200/80 rounded-2xl shadow-xl z-50 py-2 animate-scale-up">
                    <button 
                      onClick={handleImportImages}
                      className="w-full px-4 py-2.5 text-left text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:text-primary-600 transition-colors flex items-center gap-2"
                    >
                      <Upload size={14} className="text-primary-600" />
                      <span>Bulk Image Upload</span>
                    </button>
                    <button 
                      onClick={handleImportVideo}
                      className="w-full px-4 py-2.5 text-left text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:text-primary-600 transition-colors flex items-center gap-2"
                    >
                      <Upload size={14} className="text-primary-600" />
                      <span>Bulk Video Import</span>
                    </button>
                  </div>
                )}
              </div>

              {/* Notifications Icon (VISIBLE ON BOTH MOBILE AND DESKTOP!) */}
              <div className="relative" ref={notificationsRef}>
                <button
                  onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                  className="relative p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-all active:scale-95"
                  aria-label="View Notifications"
                >
                  <Bell size={20} />
                  {unreadCount > 0 && (
                    <span className="absolute top-1.5 right-1.5 flex h-2.5 w-2.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-rose-500"></span>
                    </span>
                  )}
                </button>

                {/* Notifications Dropdown */}
                {isNotificationsOpen && (
                  <div className="absolute right-0 top-12 w-80 max-w-[calc(100vw-24px)] bg-white border border-slate-200/80 rounded-2xl shadow-2xl py-2 z-50 notifications-dropdown animate-scale-up">
                    <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-xs sm:text-sm text-slate-900">Notifications</span>
                        {unreadCount > 0 && (
                          <span className="px-2 py-0.5 bg-primary-50 text-primary-700 text-2xs font-bold rounded-full border border-primary-200/60">
                            {unreadCount} new
                          </span>
                        )}
                      </div>
                      <span className="text-2xs text-slate-400 font-medium">Real-time alerts</span>
                    </div>
                    
                    <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
                      {notifications.map((notification) => (
                        <div
                          key={notification.id}
                          className={`p-3.5 hover:bg-slate-50 transition-colors cursor-pointer ${
                            !notification.read ? 'bg-primary-50/30' : ''
                          }`}
                        >
                          <div className="flex items-start gap-3">
                            <div className={`w-2 h-2 mt-1.5 rounded-full shrink-0 ${
                              notification.type === 'order' ? 'bg-primary-500' :
                              notification.type === 'stock' ? 'bg-amber-500' :
                              notification.type === 'payment' ? 'bg-emerald-500' : 'bg-blue-500'
                            }`} />
                            <div className="flex-1 min-w-0">
                              <p className={`text-xs ${!notification.read ? 'font-bold text-slate-900' : 'font-medium text-slate-600'}`}>
                                {notification.message}
                              </p>
                              <p className="text-3xs text-slate-400 font-medium mt-1">{notification.time}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    <div className="px-4 py-2.5 border-t border-slate-100 bg-slate-50/50 text-center">
                      <Link
                        href="/wholesaler/ordermanagment"
                        onClick={() => setIsNotificationsOpen(false)}
                        className="text-xs text-primary-600 hover:text-primary-700 font-bold transition-colors"
                      >
                        View all activity updates →
                      </Link>
                    </div>
                  </div>
                )}
              </div>

              {/* Profile Dropdown */}
              <div className="relative" ref={profileDropdownRef}>
                <button
                  onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                  className="flex items-center gap-2 p-1 sm:pr-2.5 hover:bg-slate-100 rounded-xl transition-all active:scale-95"
                  aria-label="User Account Menu"
                >
                  <div className="w-8 h-8 lg:w-9 lg:h-9 rounded-full bg-primary-100 text-primary-700 border border-primary-200/60 flex items-center justify-center font-bold text-xs shrink-0">
                    <User size={18} />
                  </div>
                  <div className="hidden lg:block text-left max-w-[130px]">
                    <p className="text-xs font-bold text-slate-900 truncate">{userName}</p>
                    <p className="text-2xs text-slate-400 font-medium truncate">{userEmail}</p>
                  </div>
                  <ChevronDown size={14} className={`hidden lg:block text-slate-400 transition-transform duration-200 ${isProfileDropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {/* Profile Dropdown Menu */}
                {isProfileDropdownOpen && (
                  <div className="absolute right-0 top-12 lg:top-14 w-60 bg-white border border-slate-200/80 rounded-2xl shadow-xl py-2 z-50 animate-scale-up">
                    <div className="px-4 py-3 border-b border-slate-100">
                      <p className="text-xs font-bold text-slate-900 truncate">{userName}</p>
                      <p className="text-2xs text-slate-400 font-medium truncate">{userEmail}</p>
                    </div>
                    
                    <Link
                      href="/wholesaler/settings"
                      onClick={() => setIsProfileDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:text-primary-600 transition-colors"
                    >
                      <User size={15} />
                      <span>Account Profile</span>
                    </Link>
                    
                    <Link
                      href="/wholesaler/settings"
                      onClick={() => setIsProfileDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:text-primary-600 transition-colors"
                    >
                      <Settings size={15} />
                      <span>Merchant Settings</span>
                    </Link>

                    <Link
                      href="/wholesaler/support"
                      onClick={() => setIsProfileDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:text-primary-600 transition-colors"
                    >
                      <HelpCircle size={15} />
                      <span>Support Desk</span>
                    </Link>
                    
                    <div className="border-t border-slate-100 my-1"></div>
                    
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2.5 px-4 py-2.5 text-xs font-bold text-rose-600 hover:bg-rose-50 transition-colors text-left"
                    >
                      <LogOut size={15} />
                      <span>Sign Out</span>
                    </button>
                  </div>
                )}
              </div>

              {/* Support Icon - Desktop */}
              <Link
                href="/wholesaler/support"
                className="hidden lg:flex p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-all"
                title="Support Center"
              >
                <HelpCircle size={20} />
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Search Overlay */}
      {isMobileSearchOpen && (
        <div className="md:hidden fixed inset-x-0 top-16 z-50 bg-white border-b border-slate-200/80 px-4 py-3 animate-slide-down shadow-md">
          <div className="flex items-center gap-2">
            <div className="flex-1 relative">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search orders, products, customers..."
                className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
                autoFocus
              />
            </div>
            <button
              onClick={() => setIsMobileSearchOpen(false)}
              className="p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-all"
            >
              <X size={20} />
            </button>
          </div>
        </div>
      )}

      {/* Sidebar & Main Navigation Layout */}
      <div className="flex">
        {/* Sidebar Navigation - Desktop / Laptop */}
        <aside className={`
          hidden lg:flex flex-col justify-between fixed left-0 top-20 h-[calc(100vh-5rem)] 
          bg-white border-r border-slate-200/80 transition-all duration-300 z-30 shadow-2xs
          ${isSidebarCollapsed ? 'w-20' : 'w-64'}
        `}>
          {/* Top: Nav Items */}
          <div className="py-5 px-3 flex-1 overflow-y-auto scrollbar-none">
            <nav className="space-y-1">
              {navItems.map((item, index) => {
                const active = isActive(item.href);
                return (
                  <Link
                    key={index}
                    href={item.href}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all group relative ${
                      active
                        ? 'bg-primary-50 text-primary-700 shadow-2xs border border-primary-200/60'
                        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                    }`}
                    title={isSidebarCollapsed ? item.label : undefined}
                  >
                    <span className={`shrink-0 transition-colors ${
                      active ? 'text-primary-600' : 'text-slate-400 group-hover:text-primary-600'
                    }`}>
                      {item.icon}
                    </span>
                    {!isSidebarCollapsed && (
                      <>
                        <span className="flex-1 truncate">{item.label}</span>
                        {item.badge && (
                          <span className="px-2 py-0.5 text-white text-2xs font-bold bg-primary-600 rounded-full">
                            {item.badge}
                          </span>
                        )}
                      </>
                    )}
                    {isSidebarCollapsed && item.badge && (
                      <span className="absolute -top-1 -right-1 w-5 h-5 bg-primary-600 text-white text-3xs font-bold rounded-full flex items-center justify-center">
                        {item.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Desktop Sidebar Bottom Area: Support & LOGOUT BUTTON */}
          <div className="p-3 border-t border-slate-100 bg-slate-50/50 space-y-1">
            <Link
              href="/wholesaler/support"
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                isActive('/wholesaler/support')
                  ? 'bg-primary-50 text-primary-700 border border-primary-200/60'
                  : 'text-slate-600 hover:bg-white hover:text-slate-900'
              }`}
              title={isSidebarCollapsed ? 'Support' : undefined}
            >
              <HelpCircle size={18} className={isActive('/wholesaler/support') ? 'text-primary-600' : 'text-slate-400'} />
              {!isSidebarCollapsed && <span className="truncate">Support Desk</span>}
            </Link>

            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold text-rose-600 hover:bg-rose-50 hover:text-rose-700 transition-all text-left active:scale-95"
              title={isSidebarCollapsed ? 'Sign Out' : undefined}
            >
              <LogOut size={18} className="shrink-0" />
              {!isSidebarCollapsed && <span>Sign Out</span>}
            </button>
          </div>
        </aside>

        {/* Mobile / Tablet Sidebar Drawer */}
        <div className={`
          lg:hidden fixed inset-0 z-[100000] transition-opacity duration-300
          ${isMobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}
        `}>
          {/* Backdrop overlay */}
          <div
            className="absolute inset-0 bg-slate-950/60 backdrop-blur-xs transition-opacity"
            onClick={() => setIsMobileMenuOpen(false)}
          />

          <aside className={`
            fixed left-0 top-0 h-full w-80 max-w-[85vw] bg-white shadow-2xl z-10 flex flex-col justify-between transform transition-transform duration-300 ease-in-out
            ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
          `}>
            {/* Drawer Header with Logo (exact color preserved) */}
            <div className="p-4 sm:p-5 border-b border-slate-200/80 flex items-center justify-between">
              <Link href="/" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-2">
                <span className="text-2xl font-extrabold tracking-tight bg-gradient-to-r from-primary-700 via-primary-600 to-primary-500 bg-clip-text text-transparent">
                  VELTRIX
                </span>
                <span className="px-2 py-0.5 bg-primary-50 text-primary-700 text-3xs font-bold rounded-full border border-primary-200/60 uppercase">
                  Wholesale
                </span>
              </Link>
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-all"
                aria-label="Close Sidebar"
              >
                <X size={20} />
              </button>
            </div>

            {/* User Profile Mini Banner in Drawer */}
            <div className="px-4 py-3 bg-slate-50/70 border-b border-slate-200/80 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary-100 text-primary-700 font-bold flex items-center justify-center border border-primary-200/60 shrink-0">
                <User size={18} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold text-slate-900 truncate">{userName}</p>
                <p className="text-2xs text-slate-500 truncate">{userEmail}</p>
              </div>
            </div>

            {/* Navigation Links Scrollable Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-1">
              {navItems.map((item, index) => {
                const active = isActive(item.href);
                return (
                  <Link
                    key={index}
                    href={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                      active
                        ? 'bg-primary-50 text-primary-700 shadow-2xs border border-primary-200/60'
                        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                    }`}
                  >
                    <span className={active ? 'text-primary-600' : 'text-slate-400'}>
                      {item.icon}
                    </span>
                    <span className="flex-1">{item.label}</span>
                    {item.badge && (
                      <span className="px-2 py-0.5 text-white text-2xs font-bold bg-primary-600 rounded-full">
                        {item.badge}
                      </span>
                    )}
                  </Link>
                );
              })}

              <Link
                href="/wholesaler/support"
                onClick={() => setIsMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                  isActive('/wholesaler/support')
                    ? 'bg-primary-50 text-primary-700 shadow-2xs border border-primary-200/60'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <HelpCircle size={19} className={isActive('/wholesaler/support') ? 'text-primary-600' : 'text-slate-400'} />
                <span>Support Desk</span>
              </Link>
            </div>

            {/* Mobile / Tablet Drawer Bottom: LOGOUT BUTTON IN SIDEBAR */}
            <div className="p-4 border-t border-slate-200/80 bg-slate-50/50 space-y-2">
              <button
                onClick={handleLogout}
                className="w-full flex items-center justify-center gap-2.5 px-4 py-2.5 bg-white hover:bg-rose-50 text-rose-600 hover:text-rose-700 border border-slate-200 hover:border-rose-200 rounded-xl text-xs sm:text-sm font-bold shadow-2xs transition-all active:scale-95"
              >
                <LogOut size={16} />
                <span>Sign Out Account</span>
              </button>
            </div>
          </aside>
        </div>
      </div>

      {/* Mobile Bottom Navigation Bar (Fast Thumb Navigation) */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200/80 z-30 shadow-md">
        <div className="flex items-center justify-around px-2 py-1.5">
          <Link
            href="/wholesaler/wholesalerdashboard"
            className={`flex flex-col items-center p-2 rounded-xl transition-colors ${
              isActive('/wholesaler/wholesalerdashboard') ? 'text-primary-600 font-bold' : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <Home size={19} />
            <span className="text-3xs mt-1">Home</span>
          </Link>

          <Link
            href="/wholesaler/ordermanagment"
            className={`flex flex-col items-center p-2 rounded-xl transition-colors relative ${
              isActive('/wholesaler/ordermanagment') ? 'text-primary-600 font-bold' : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <Package size={19} />
            <span className="text-3xs mt-1">Orders</span>
            {pendingOrdersCount > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 bg-primary-600 text-white text-3xs font-bold rounded-full flex items-center justify-center">
                {pendingOrdersCount}
              </span>
            )}
          </Link>

          {/* Quick Floating Add Button */}
          <div className="relative">
            <button 
              onClick={() => setShowImportDropdown(!showImportDropdown)}
              className="flex flex-col items-center p-1 -mt-5"
              aria-label="Add Product"
            >
              <div className="w-12 h-12 rounded-full bg-primary-600 hover:bg-primary-700 flex items-center justify-center text-white shadow-lg active:scale-95 transition-all">
                <PlusCircle size={24} />
              </div>
              <span className="text-3xs mt-1 font-semibold text-slate-700">Add</span>
            </button>
            
            {showImportDropdown && (
              <div className="absolute bottom-16 left-1/2 -translate-x-1/2 w-48 bg-white border border-slate-200/80 rounded-2xl shadow-2xl z-50 py-2 animate-scale-up">
                <button 
                  onClick={handleImportImages}
                  className="w-full px-4 py-2.5 text-left text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:text-primary-600 transition-colors flex items-center gap-2"
                >
                  <Upload size={14} className="text-primary-600" />
                  <span>Bulk Images</span>
                </button>
                <button 
                  onClick={handleImportVideo}
                  className="w-full px-4 py-2.5 text-left text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:text-primary-600 transition-colors flex items-center gap-2"
                >
                  <Upload size={14} className="text-primary-600" />
                  <span>Bulk Video</span>
                </button>
              </div>
            )}
          </div>

          <Link
            href="/wholesaler/productcatalog"
            className={`flex flex-col items-center p-2 rounded-xl transition-colors ${
              isActive('/wholesaler/productcatalog') ? 'text-primary-600 font-bold' : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <Grid size={19} />
            <span className="text-3xs mt-1">Catalog</span>
          </Link>

          <Link
            href="/wholesaler/customers"
            className={`flex flex-col items-center p-2 rounded-xl transition-colors ${
              isActive('/wholesaler/customers') ? 'text-primary-600 font-bold' : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <Users size={19} />
            <span className="text-3xs mt-1">Customers</span>
          </Link>
        </div>
      </div>

      {/* Import Images Modal */}
      {showImportImagesModal && (
        <ImportImagesModal 
          onClose={() => setShowImportImagesModal(false)} 
          categories={categories}
        />
      )}

      {/* Import Video Modal */}
      {showImportVideoModal && (
        <ImportModal 
          onClose={() => setShowImportVideoModal(false)} 
          categories={categories}
        />
      )}
    </>
  )
}
