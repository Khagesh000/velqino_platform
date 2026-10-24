"use client"

import React, { useState, useRef, useEffect, useMemo } from 'react'
import { usePathname, useRouter } from 'next/navigation';
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
  ShoppingBag, 
  Heart, 
  Settings, 
  PlusCircle,
  ShoppingCart, 
  Users, 
  Box, 
  Wallet, 
  Truck, 
  Star, 
  LogOut,
  Sparkles
} from '@/utils/icons';
import { useGetRetailerProfileQuery } from '@/redux/retailer/slices/retailerSlice';
import { clearAuthTokens, getAuthUser, setAuthUser } from '@/utils/cookieUtils';
import '../../../../styles/Retailer/RetailerDashboard/RetailerNavbar.scss'

export default function RetailerNavbar({ isSidebarCollapsed, setIsSidebarCollapsed }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false)
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false)
  const [lastScrollTop, setLastScrollTop] = useState(0)
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false)
  
  const navbarRef = useRef(null)
  const profileDropdownRef = useRef(null)
  const notificationsRef = useRef(null)
  const pathname = usePathname();
  const router = useRouter();

  // Instant synchronous auth extraction from cookies / storage
  const initialAuth = useMemo(() => getAuthUser(), []);

  const [userName, setUserName] = useState(
    initialAuth.name && initialAuth.name !== 'undefined' ? initialAuth.name : ''
  );
  const [userEmail, setUserEmail] = useState(
    initialAuth.email && initialAuth.email !== 'undefined' ? initialAuth.email : ''
  );
  const [userId, setUserId] = useState(
    initialAuth.id && initialAuth.id !== 'undefined' ? initialAuth.id : null
  );

  // Fetch retailer profile ONCE via RTK Query cache if name or email is missing
  const needsProfileFetch = Boolean(userId) && (!userName || !userEmail);
  const { data: profileResponse } = useGetRetailerProfileQuery(userId, {
    skip: !needsProfileFetch,
  });

  useEffect(() => {
    if (profileResponse?.data) {
      const p = profileResponse.data;
      const resolvedName = p.business_name || p.username || (p.email ? p.email.split('@')[0] : '');
      const resolvedEmail = p.email || userEmail;
      if (resolvedName && resolvedName !== 'undefined') setUserName(resolvedName);
      if (resolvedEmail && resolvedEmail !== 'undefined') setUserEmail(resolvedEmail);
      setAuthUser({ name: resolvedName, email: resolvedEmail, role: 'retailer', id: userId });
    }
  }, [profileResponse, userId, userEmail]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const auth = getAuthUser();
      if (auth.name && auth.name !== 'undefined') setUserName(auth.name);
      if (auth.email && auth.email !== 'undefined') setUserEmail(auth.email);
      if (auth.id && auth.id !== 'undefined') setUserId(auth.id);

      const handleAuthUpdate = (e) => {
        const detail = e?.detail || getAuthUser();
        if (detail.name && detail.name !== 'undefined') setUserName(detail.name);
        if (detail.email && detail.email !== 'undefined') setUserEmail(detail.email);
        if (detail.id && detail.id !== 'undefined') setUserId(detail.id);
      };

      window.addEventListener('velqino:auth-user-updated', handleAuthUpdate);
      return () => window.removeEventListener('velqino:auth-user-updated', handleAuthUpdate);
    }
  }, []);

  const displayName = useMemo(() => {
    if (userName && userName !== 'undefined' && userName !== 'null') return userName;
    if (userEmail && userEmail !== 'undefined' && userEmail !== 'null') return userEmail.split('@')[0];
    return 'Retail Store';
  }, [userName, userEmail]);

  const displayEmail = useMemo(() => {
    if (userEmail && userEmail !== 'undefined' && userEmail !== 'null') return userEmail;
    return '';
  }, [userEmail]);

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

  const handleLogout = () => {
    try {
      clearAuthTokens();
      localStorage.removeItem('user_role');
      localStorage.removeItem('user_name');
      localStorage.removeItem('user_id');
      localStorage.removeItem('is_retailer_registered');
    } catch (e) {
      console.error('Logout error:', e);
    }
    router.push('/');
  };

  // Handle click outside for dropdowns
  useEffect(() => {
    function handleClickOutside(event) {
      if (profileDropdownRef.current && !profileDropdownRef.current.contains(event.target)) {
        setIsProfileDropdownOpen(false)
      }
      if (notificationsRef.current && !notificationsRef.current.contains(event.target)) {
        setIsNotificationsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Handle scroll hide/show
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop
      
      if (navbarRef.current) {
        if (scrollTop > lastScrollTop && scrollTop > 80) {
          navbarRef.current.classList.add('navbar-hidden')
          navbarRef.current.classList.remove('navbar-visible')
        } else {
          navbarRef.current.classList.add('navbar-visible')
          navbarRef.current.classList.remove('navbar-hidden')
        }
      }
      
      setLastScrollTop(scrollTop <= 0 ? 0 : scrollTop)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [lastScrollTop])

  const notifications = [
    { id: 1, type: 'order', message: 'Your order #12345 has been shipped', time: '2 min ago', read: false },
    { id: 2, type: 'delivery', message: 'Order #12344 out for delivery', time: '15 min ago', read: false },
    { id: 3, type: 'offer', message: '20% off on bulk purchases', time: '1 hour ago', read: true },
    { id: 4, type: 'payment', message: 'Payment successful for order #12343', time: '2 hours ago', read: true },
  ]

  const unreadCount = notifications.filter(n => !n.read).length

  const navItems = [
    { icon: <Home size={19} />, label: 'Dashboard', href: '/retailer/retailerdashboard', badge: null },
    { icon: <ShoppingCart size={19} />, label: 'POS / Sales', href: '/retailer/possales', badge: null },
    { icon: <Package size={19} />, label: 'Products', href: '/retailer/retailerproducts', badge: null },
    { icon: <Sparkles size={19} />, label: 'AI Model Studio', href: '/retailer/aistudio', badge: 'AI' },
    { icon: <ShoppingBag size={19} />, label: 'Orders', href: '/retailer/retailerorders', badge: '3' },
    { icon: <Users size={19} />, label: 'Customers', href: '/retailer/retailercustomers', badge: null },
    { icon: <Box size={19} />, label: 'Inventory', href: '/retailer/retailerinventory', badge: '5' },
    { icon: <BarChart3 size={19} />, label: 'Reports & Analytics', href: '/retailer/retailerreports', badge: null },
    { icon: <Wallet size={19} />, label: 'Expenses', href: '/retailer/retailerexpenses', badge: null },
    { icon: <Truck size={19} />, label: 'Suppliers', href: '/retailer/retailersuppliers', badge: null },
    { icon: <Star size={19} />, label: 'Loyalty Program', href: '/retailer/retailerloyalty', badge: null },
    { icon: <Users size={19} />, label: 'Staff Management', href: '/retailer/retailerstaff', badge: null },
    { icon: <Settings size={19} />, label: 'Settings', href: '/retailer/retailersettings', badge: null },
  ]

  const isActive = (href) => {
    if (pathname === href) return true;
    return pathname?.startsWith(href) && pathname?.charAt(href.length) === '/';
  };

  return (
    <>
      {/* Top Navigation Bar */}
      <nav ref={navbarRef} className="bg-white border-b border-slate-200/80 sticky top-0 z-50 shadow-2xs">
        <div className="px-4 lg:px-6">
          <div className="flex items-center justify-between h-16 lg:h-20">
            {/* Left Section */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden p-2 text-slate-600 hover:text-primary-600 hover:bg-primary-50 rounded-xl transition-all"
                aria-label="Toggle menu"
              >
                {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>

              <div className="flex items-center gap-2">
                <Link href="/" className="flex items-center gap-2 hover:opacity-85 transition-opacity">
                  <span className="text-2xl font-extrabold tracking-tight bg-gradient-to-r from-primary-700 via-primary-600 to-primary-500 bg-clip-text text-transparent">
                    VELTRIX
                  </span>
                </Link>
                <Link 
                  href="/retailer/retailerdashboard" 
                  className="hidden sm:inline-block px-2 py-0.5 bg-primary-50 text-primary-700 text-3xs font-bold rounded-full border border-primary-200/60 uppercase"
                >
                  RETAILER
                </Link>
              </div>
            </div>

            {/* Center Search */}
            <div className="hidden md:flex flex-1 max-w-xl mx-8">
              <div className="relative w-full">
                <input
                  type="text"
                  placeholder="Search products, orders, customers..."
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-medium focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100 transition-all"
                />
                <Search size={18} className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-slate-400" />
              </div>
            </div>

            {/* Right Section */}
            <div className="flex items-center gap-2 lg:gap-3">
              {/* Mobile Search Trigger */}
              <div className="md:hidden">
                <button
                  onClick={() => setIsMobileSearchOpen(true)}
                  className="p-2.5 text-slate-600 hover:text-primary-600 hover:bg-primary-50 rounded-xl transition-all"
                  aria-label="Search"
                >
                  <Search size={20} />
                </button>
              </div>

              {/* Notifications */}
              <div className="relative" ref={notificationsRef}>
                <button
                  onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                  className="relative p-2.5 text-slate-600 hover:text-primary-600 hover:bg-primary-50 rounded-xl transition-all"
                  aria-label="Notifications"
                >
                  <Bell size={20} />
                  {unreadCount > 0 && (
                    <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full ring-2 ring-white"></span>
                  )}
                </button>

                {isNotificationsOpen && (
                  <div className="absolute right-0 top-12 w-80 bg-white border border-slate-200/80 rounded-2xl shadow-xl py-2 z-50 notifications-dropdown">
                    <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between">
                      <span className="font-bold text-xs text-slate-900">Notifications</span>
                      {unreadCount > 0 && (
                        <span className="px-2 py-0.5 bg-primary-50 text-primary-600 text-3xs font-bold rounded-full border border-primary-200/60">
                          {unreadCount} new
                        </span>
                      )}
                    </div>
                    
                    <div className="max-h-96 overflow-y-auto">
                      {notifications.map((notification) => (
                        <div
                          key={notification.id}
                          className={`px-4 py-3 hover:bg-primary-50/50 transition-all cursor-pointer border-b border-slate-100 last:border-0 ${
                            !notification.read ? 'bg-primary-50/20' : ''
                          }`}
                        >
                          <div className="flex items-start gap-3">
                            <div className={`w-2 h-2 mt-2 rounded-full shrink-0 ${
                              notification.type === 'order' ? 'bg-primary-500' :
                              notification.type === 'delivery' ? 'bg-emerald-500' :
                              notification.type === 'offer' ? 'bg-amber-500' : 'bg-blue-500'
                            }`} />
                            <div className="flex-1">
                              <p className={`text-xs ${!notification.read ? 'font-semibold text-slate-900' : 'text-slate-600'}`}>
                                {notification.message}
                              </p>
                              <p className="text-[10px] text-slate-400 mt-1">{notification.time}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    <div className="px-4 py-2.5 border-t border-slate-100 bg-slate-50/50">
                      <button className="text-xs text-primary-600 hover:text-primary-700 font-bold transition-all w-full text-center">
                        View all notifications
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Profile Dropdown */}
              <div className="relative" ref={profileDropdownRef}>
                <button
                  onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                  className="flex items-center gap-2 lg:gap-3 p-1.5 lg:pr-3 hover:bg-slate-50 rounded-2xl transition-all"
                >
                  <div className="w-8 h-8 lg:w-9 lg:h-9 rounded-full bg-gradient-to-r from-primary-600 to-primary-700 flex items-center justify-center shadow-xs shrink-0">
                    <User size={18} className="text-white" />
                  </div>
                  <div className="hidden lg:block text-left max-w-[130px]">
                    <p className="text-xs font-bold text-slate-900 truncate">{displayName}</p>
                    <p className="text-[10px] text-slate-400 truncate">{displayEmail}</p>
                  </div>
                  <ChevronDown size={15} className={`hidden lg:block text-slate-400 transition-transform duration-200 ${isProfileDropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {isProfileDropdownOpen && (
                  <div className="absolute right-0 top-12 lg:top-14 w-64 bg-white border border-slate-200/80 rounded-2xl shadow-xl py-2 z-50">
                    <div className="px-4 py-3 border-b border-slate-100 lg:hidden bg-slate-50/60">
                      <p className="text-xs font-bold text-slate-900 truncate">{displayName}</p>
                      <p className="text-[10px] text-slate-400 truncate">{displayEmail}</p>
                    </div>
                    
                    <Link 
                      href="/retailer/profile" 
                      onClick={() => setIsProfileDropdownOpen(false)}
                      className="flex items-center gap-3 px-4 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:text-primary-600 transition-all"
                    >
                      <User size={16} />
                      <span>My Profile</span>
                    </Link>
                    
                    <Link 
                      href="/retailer/retailersettings" 
                      onClick={() => setIsProfileDropdownOpen(false)}
                      className="flex items-center gap-3 px-4 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:text-primary-600 transition-all"
                    >
                      <Settings size={16} />
                      <span>Store Settings</span>
                    </Link>
                    
                    <Link 
                      href="/retailer/retailersupport" 
                      onClick={() => setIsProfileDropdownOpen(false)}
                      className="flex items-center gap-3 px-4 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:text-primary-600 transition-all"
                    >
                      <HelpCircle size={16} />
                      <span>Support Desk</span>
                    </Link>
                    
                    <div className="border-t border-slate-100 my-1.5"></div>
                    
                    <button 
                      onClick={() => {
                        setIsProfileDropdownOpen(false);
                        handleLogout();
                      }}
                      className="w-full flex items-center gap-3 px-4 py-2 text-xs font-bold text-rose-600 hover:bg-rose-50 transition-all cursor-pointer text-left"
                    >
                      <LogOut size={16} />
                      <span>Sign Out</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Search Overlay */}
      {isMobileSearchOpen && (
        <div className="md:hidden fixed inset-x-0 top-16 z-[100] bg-white border-b border-slate-200 px-4 py-3 animate-slide-down shadow-md">
          <div className="flex items-center gap-2">
            <div className="flex-1 relative">
              <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search products, orders, customers..."
                className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-medium focus:outline-none focus:border-primary-500"
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
        {/* Sidebar Navigation - Desktop / Laptop (Matching WholesaleSidebar) */}
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

          {/* Desktop Sidebar Bottom Area: Support & LOGOUT BUTTON (Identical to WholesaleSidebar) */}
          <div className="p-3 border-t border-slate-100 bg-slate-50/50 space-y-1">
            <Link
              href="/retailer/retailersupport"
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                isActive('/retailer/retailersupport')
                  ? 'bg-primary-50 text-primary-700 border border-primary-200/60'
                  : 'text-slate-600 hover:bg-white hover:text-slate-900'
              }`}
              title={isSidebarCollapsed ? 'Support' : undefined}
            >
              <HelpCircle size={18} className={isActive('/retailer/retailersupport') ? 'text-primary-600' : 'text-slate-400'} />
              {!isSidebarCollapsed && <span className="truncate">Support Desk</span>}
            </Link>

            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold text-rose-600 hover:bg-rose-50 hover:text-rose-700 transition-all text-left active:scale-95 cursor-pointer"
              title={isSidebarCollapsed ? 'Sign Out' : undefined}
            >
              <LogOut size={18} className="shrink-0" />
              {!isSidebarCollapsed && <span>Sign Out</span>}
            </button>
          </div>
        </aside>

        {/* Mobile / Tablet Sidebar Drawer (Matching WholesaleDrawer with Fixed Bottom Logout) */}
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
            {/* Drawer Header with Logo & Retailer Badge */}
            <div className="p-4 sm:p-5 border-b border-slate-200/80 flex items-center justify-between">
              <Link href="/" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-2">
                <span className="text-2xl font-extrabold tracking-tight bg-gradient-to-r from-primary-700 via-primary-600 to-primary-500 bg-clip-text text-transparent">
                  VELTRIX
                </span>
                <span className="px-2 py-0.5 bg-primary-50 text-primary-700 text-3xs font-bold rounded-full border border-primary-200/60 uppercase">
                  Retailer
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
                <p className="text-xs font-bold text-slate-900 truncate">{displayName}</p>
                <p className="text-2xs text-slate-500 truncate">{displayEmail}</p>
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
                href="/retailer/retailersupport"
                onClick={() => setIsMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                  isActive('/retailer/retailersupport')
                    ? 'bg-primary-50 text-primary-700 shadow-2xs border border-primary-200/60'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <HelpCircle size={19} className={isActive('/retailer/retailersupport') ? 'text-primary-600' : 'text-slate-400'} />
                <span>Support Desk</span>
              </Link>
            </div>

            {/* Mobile / Tablet Drawer Bottom: SIGNOUT BUTTON IN SIDEBAR (Always Visible at bottom) */}
            <div className="p-4 border-t border-slate-200/80 bg-slate-50/50 space-y-2">
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  handleLogout();
                }}
                className="w-full flex items-center justify-center gap-2.5 px-4 py-2.5 bg-white hover:bg-rose-50 text-rose-600 hover:text-rose-700 border border-slate-200 hover:border-rose-200 rounded-xl text-xs sm:text-sm font-bold shadow-2xs transition-all active:scale-95 cursor-pointer"
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
            href="/retailer/retailerdashboard"
            className={`flex flex-col items-center p-2 rounded-xl transition-colors ${
              isActive('/retailer/retailerdashboard') ? 'text-primary-600 font-bold' : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <Home size={19} />
            <span className="text-3xs mt-1">Home</span>
          </Link>

          <Link
            href="/retailer/possales"
            className={`flex flex-col items-center p-2 rounded-xl transition-colors ${
              isActive('/retailer/possales') ? 'text-primary-600 font-bold' : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <ShoppingCart size={19} />
            <span className="text-3xs mt-1">POS Sales</span>
          </Link>

          <Link
            href="/retailer/retailerproducts"
            className={`flex flex-col items-center p-2 rounded-xl transition-colors ${
              isActive('/retailer/retailerproducts') ? 'text-primary-600 font-bold' : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <Package size={19} />
            <span className="text-3xs mt-1">Products</span>
          </Link>

          <Link
            href="/retailer/retailerorders"
            className={`flex flex-col items-center p-2 rounded-xl transition-colors relative ${
              isActive('/retailer/retailerorders') ? 'text-primary-600 font-bold' : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <ShoppingBag size={19} />
            <span className="text-3xs mt-1">Orders</span>
            <span className="absolute top-1 right-1 w-4 h-4 bg-primary-600 text-white text-3xs font-bold rounded-full flex items-center justify-center">
              3
            </span>
          </Link>

          <Link
            href="/retailer/retailerinventory"
            className={`flex flex-col items-center p-2 rounded-xl transition-colors ${
              isActive('/retailer/retailerinventory') ? 'text-primary-600 font-bold' : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <Box size={19} />
            <span className="text-3xs mt-1">Inventory</span>
          </Link>
        </div>
      </div>
    </>
  )
}
