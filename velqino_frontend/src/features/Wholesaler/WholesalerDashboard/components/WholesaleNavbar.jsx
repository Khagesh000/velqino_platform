"use client"

import React, { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { ChevronDown, Bell, User, HelpCircle, Search, Menu, X, Home, Package, Grid, BarChart3, Users, Wallet, Settings, PlusCircle } from '../../../../utils/icons';
import '../../../../styles/Wholesaler/WholesalerDashboard/WholesaleNavbar.scss'

export default function WholesaleNavbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false)
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false)
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)
  const [lastScrollTop, setLastScrollTop] = useState(0);
  const navbarRef = useRef(null);
  const profileDropdownRef = useRef(null)
  const notificationsRef = useRef(null)
  const mobileMenuRef = useRef(null)
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false)

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

  useEffect(() => {
  const handleScroll = () => {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    
    if (navbarRef.current) {
      if (scrollTop > lastScrollTop && scrollTop > 80) {
        // Scrolling down - hide navbar
        navbarRef.current.classList.add('navbar-hidden');
        navbarRef.current.classList.remove('navbar-visible');
      } else {
        // Scrolling up - show navbar
        navbarRef.current.classList.add('navbar-visible');
        navbarRef.current.classList.remove('navbar-hidden');
      }
    }
    
    setLastScrollTop(scrollTop <= 0 ? 0 : scrollTop);
  };

  window.addEventListener('scroll', handleScroll);
  
  return () => {
    window.removeEventListener('scroll', handleScroll);
  };
}, [lastScrollTop]);

  // Notification data
  const notifications = [
    { id: 1, type: 'order', message: 'New order received #12345', time: '2 min ago', read: false },
    { id: 2, type: 'stock', message: 'Low stock alert: Product XYZ', time: '15 min ago', read: false },
    { id: 3, type: 'payment', message: 'Payment of ₹4,500 received', time: '1 hour ago', read: true },
    { id: 4, type: 'inquiry', message: 'New customer inquiry', time: '2 hours ago', read: true },
  ]

  const unreadCount = notifications.filter(n => !n.read).length

  // Navigation items for sidebar
  const navItems = [
    { icon: <Home size={20} />, label: 'Home Dashboard', href: '/wholesaler/wholesalerdashboard', badge: null },
    { icon: <Package size={20} />, label: 'Orders Management', href: '/wholesaler/ordermanagment', badge: '12' },
    { icon: <Grid size={20} />, label: 'Products Catalog', href: '/wholesaler/productcatalog', badge: null },
    { icon: <BarChart3 size={20} />, label: 'Analytics & Reports', href: '/wholesaler/analyticsreports', badge: null },
    { icon: <Users size={20} />, label: 'Customers', href: '/wholesaler/customers', badge: '3' },
    { icon: <Wallet size={20} />, label: 'Payments & Payouts', href: '/wholesaler/paymentsandpayouts', badge: null },
    { icon: <Settings size={20} />, label: 'Settings', href: '/wholesaler/settings', badge: null },
  ]

  return (
    <>
      {/* Top Navigation Bar */}
      <nav
      ref={navbarRef}
      className="bg-card border-b border-light sticky top-0 z-navbar shadow-sm">
        <div className="px-4 lg:px-6">
          <div className="flex items-center justify-between h-16 lg:h-20">
            {/* Left Section: Logo & Mobile Menu Toggle */}
            <div className="flex items-center gap-3">
              {/* Mobile Menu Toggle */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden p-2 text-secondary hover:text-primary-600 hover:bg-primary-100 rounded-lg transition-fast"
              >
                {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>

              {/* Logo */}
              <Link href="/wholesale" className="flex items-center gap-2">
                <span className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                  VELTRIX
                </span>
                <span className="hidden sm:inline-block px-2 py-1 bg-accent-100 text-accent-700 text-xs font-semibold rounded-full">
                  WHOLESALE
                </span>
              </Link>
            </div>

            {/* Center: Global Search - Hidden on Mobile */}
            <div className="hidden md:flex flex-1 max-w-xl mx-8">
              <div className="relative w-full">
                <input
                  type="text"
                  placeholder="Search orders, products, customers..."
                  className="w-full pl-10 pr-4 py-2.5 bg-surface-1 border border-medium rounded-xl text-sm focus:outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-100 transition-fast"
                />
                <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-tertiary" />
              </div>
            </div>

            {/* Right Section: Icons & Profile */}
            <div className="flex items-center gap-2 lg:gap-3">
  {/* Mobile Search Icon */}
  <div className="md:hidden">
    <button
      onClick={() => setIsMobileSearchOpen(true)}
      className="p-2.5 text-secondary hover:text-primary-600 hover:bg-primary-100 rounded-xl transition-fast"
    >
      <Search size={20} />
    </button>
  </div>

  {/* Quick Add Product Button - Desktop */}
  <button className="hidden lg:flex items-center gap-2 bg-primary-500 hover:bg-primary-600 text-inverse px-4 py-2 rounded-xl text-sm font-medium transition-fast shadow-sm hover:shadow-md">
    <PlusCircle size={18} />
    <span>Add Product</span>
  </button>

              {/* Notifications */}
              <div className="relative" ref={notificationsRef}>
                <button
                  onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                  className="relative p-2.5 text-secondary hover:text-primary-600 hover:bg-primary-100 rounded-xl transition-fast"
                >
                  <Bell size={20} />
                  {unreadCount > 0 && (
                    <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-error-500 rounded-full ring-2 ring-card"></span>
                  )}
                </button>

                {/* Notifications Dropdown */}
                {isNotificationsOpen && (
                  <div className="absolute top-12 w-80 max-w-[calc(100vw-32px)] bg-card border-2 border-medium rounded-xl shadow-xl py-2 z-dropdown slide-down notifications-dropdown">
                    <div className="px-4 py-3 border-b border-light flex items-center justify-between">
                      <span className="font-semibold text-primary-600">Notifications</span>
                      {unreadCount > 0 && (
                        <span className="px-2 py-1 bg-primary-100 text-primary-600 text-xs rounded-full">
                          {unreadCount} new
                        </span>
                      )}
                    </div>
                    
                    <div className="max-h-96 overflow-y-auto">
                      {notifications.map((notification) => (
                        <div
                          key={notification.id}
                          className={`px-4 py-3 hover:bg-primary-100 transition-fast cursor-pointer border-b border-light last:border-0 ${
                            !notification.read ? 'bg-primary-50' : ''
                          }`}
                        >
                          <div className="flex items-start gap-3">
                            <div className={`w-2 h-2 mt-2 rounded-full flex-shrink-0 ${
                              notification.type === 'order' ? 'bg-primary-500' :
                              notification.type === 'stock' ? 'bg-warning-500' :
                              notification.type === 'payment' ? 'bg-success-500' : 'bg-accent-500'
                            }`} />
                            <div className="flex-1">
                              <p className={`text-sm ${!notification.read ? 'font-medium text-primary' : 'text-secondary'}`}>
                                {notification.message}
                              </p>
                              <p className="text-xs text-tertiary mt-1">{notification.time}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    <div className="px-4 py-3 border-t border-light">
                      <button className="text-sm text-accent-600 hover:text-accent-700 font-medium transition-fast">
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
                  className="flex items-center gap-2 lg:gap-3 p-1.5 lg:pr-3 hover:bg-primary-100 rounded-xl transition-fast"
                >
                  <div className="w-8 h-8 lg:w-10 lg:h-10 rounded-full bg-gradient-primary flex items-center justify-center">
                    <User size={18} className="text-inverse lg:hidden" />
                    <User size={22} className="text-inverse hidden lg:block" />
                  </div>
                  <div className="hidden lg:block text-left">
                    <p className="text-sm font-medium text-primary">Wholesale Store</p>
                    <p className="text-xs text-tertiary">seller@veltrix.com</p>
                  </div>
                  <ChevronDown size={16} className={`hidden lg:block text-tertiary transition-transform duration-200 ${isProfileDropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {/* Profile Dropdown Menu */}
                {isProfileDropdownOpen && (
                  <div className="absolute right-0 top-12 lg:top-14 w-64 bg-card border-2 border-medium rounded-xl shadow-xl py-2 z-dropdown slide-down">
                    <div className="px-4 py-3 border-b border-light lg:hidden">
                      <p className="text-sm font-medium text-primary">Wholesale Store</p>
                      <p className="text-xs text-tertiary">seller@veltrix.com</p>
                    </div>
                    
                    <Link href="/wholesale/profile" className="flex items-center gap-3 px-4 py-2.5 text-secondary hover:bg-primary-100 hover:text-primary-600 transition-fast">
                      <User size={18} />
                      <span className="text-sm">My Profile</span>
                    </Link>
                    
                    <Link href="/wholesale/settings" className="flex items-center gap-3 px-4 py-2.5 text-secondary hover:bg-primary-100 hover:text-primary-600 transition-fast">
                      <Settings size={18} />
                      <span className="text-sm">Settings</span>
                    </Link>
                    
                    <div className="border-t border-light my-2"></div>
                    
                    <button className="w-full flex items-center gap-3 px-4 py-2.5 text-error-600 hover:bg-error-100 transition-fast">
                      <span className="text-sm">Sign Out</span>
                    </button>
                  </div>
                )}
              </div>

              {/* Help Icon - Desktop */}
              <button className="hidden lg:flex p-2.5 text-secondary hover:text-primary-600 hover:bg-primary-100 rounded-xl transition-fast">
                <HelpCircle size={20} />
              </button>
            </div>
          </div>

          
        </div>
      </nav>

      {/* Mobile Search Overlay */}
{isMobileSearchOpen && (
  <div className="md:hidden fixed inset-x-0 top-16 z-[100] bg-card border-b border-light px-4 py-3 animate-slide-down">
    <div className="flex items-center gap-2">
      <div className="flex-1 relative">
        <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-tertiary" />
        <input
          type="text"
          placeholder="Search orders, products, customers..."
          className="w-full pl-10 pr-4 py-2.5 bg-surface-1 border border-medium rounded-xl text-sm focus:outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-100"
          autoFocus
        />
      </div>
      <button
        onClick={() => setIsMobileSearchOpen(false)}
        className="p-2 text-secondary hover:text-primary-600 hover:bg-primary-100 rounded-lg transition-fast"
      >
        <X size={20} />
      </button>
    </div>
  </div>
)}

      {/* Sidebar & Main Content Wrapper */}
      <div className="flex">
        {/* Sidebar Navigation - Desktop */}
        <aside className={`
          hidden lg:block fixed left-0 top-20 h-[calc(100vh-5rem)] 
          bg-card border-r border-light transition-all duration-300 z-sticky
          ${isSidebarCollapsed ? 'w-20' : 'w-64'}
        `}>
          {/* Sidebar Toggle */}
         {/*  <button
            onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
            className="absolute -right-3 top-6 w-6 h-6 bg-primary-500 rounded-full flex items-center justify-center text-inverse shadow-md hover:bg-primary-600 transition-fast"
          >
            <ChevronDown size={14} className={`transform transition-transform ${isSidebarCollapsed ? 'rotate-90' : '-rotate-90'}`} />
          </button> */}

          {/* Navigation Items */}
          <div className="py-6 px-3">
            {/* Quick Add Product - Mobile Inside Sidebar */}
            <button className="lg:hidden w-full mb-4 flex items-center justify-center gap-2 bg-primary-500 hover:bg-primary-600 text-inverse px-4 py-3 rounded-xl text-sm font-medium transition-fast">
              <PlusCircle size={18} />
              <span>Add Product</span>
            </button>

            <nav className="space-y-1">
              {navItems.map((item, index) => (
                <Link
                  key={index}
                  href={item.href}
                  className="flex items-center gap-3 px-3 py-2.5 text-secondary hover:bg-primary-100 hover:text-primary-600 rounded-xl transition-fast group relative"
                >
                  <span className="text-secondary group-hover:text-primary-600 transition-fast">
                    {item.icon}
                  </span>
                  {!isSidebarCollapsed && (
                    <>
                      <span className="text-sm font-medium flex-1">{item.label}</span>
                      {item.badge && (
                        <span className="px-2 py-0.5 bg-primary-500 text-inverse text-xs rounded-full">
                          {item.badge}
                        </span>
                      )}
                    </>
                  )}
                  {isSidebarCollapsed && item.badge && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-primary-500 text-inverse text-xs rounded-full flex items-center justify-center">
                      {item.badge}
                    </span>
                  )}
                </Link>
              ))}
            </nav>

            {/* Support Link at Bottom */}
            {!isSidebarCollapsed && (
              <div className="absolute bottom-6 left-3 right-3">
                <Link
                  href="/wholesaler/support"
                  className="flex items-center gap-3 px-3 py-2.5 text-secondary hover:bg-primary-100 hover:text-primary-600 rounded-xl transition-fast"
                >
                  <HelpCircle size={20} />
                  <span className="text-sm font-medium">Support</span>
                </Link>
              </div>
            )}
          </div>
        </aside>

        {/* Mobile Sidebar (Drawer) */}
        <div className={`
          lg:hidden fixed inset-0 bg-overlay z-modal transition-opacity duration-300
          ${isMobileMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}
        `}>
          <aside className={`
            fixed left-0 top-0 h-full w-72 bg-card shadow-xl transform transition-transform duration-300 ease-in-out
            ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
          `}>
            <div className="p-4 border-b border-light flex items-center justify-between">
              <Link href="/wholesale" className="text-xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                VELTRIX
              </Link>
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-2 text-secondary hover:text-primary-600 hover:bg-primary-100 rounded-lg transition-fast"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-4">
              <nav className="space-y-1">
                {navItems.map((item, index) => (
                  <Link
                    key={index}
                    href={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center gap-3 px-3 py-3 text-secondary hover:bg-primary-100 hover:text-primary-600 rounded-xl transition-fast"
                  >
                    <span className="text-secondary">{item.icon}</span>
                    <span className="text-sm font-medium flex-1">{item.label}</span>
                    {item.badge && (
                      <span className="px-2 py-0.5 bg-primary-500 text-inverse text-xs rounded-full">
                        {item.badge}
                      </span>
                    )}
                  </Link>
                ))}

                <Link
                  href="/wholesaler/support"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center gap-3 px-3 py-3 text-secondary hover:bg-primary-100 hover:text-primary-600 rounded-xl transition-fast"
                >
                  <HelpCircle size={20} />
                  <span className="text-sm font-medium">Support</span>
                </Link>
              </nav>
            </div>
          </aside>
        </div>

        {/* Main Content Area with Dynamic Margin */}
        <main className={`
          flex-1 transition-all duration-300
          lg:ml-${isSidebarCollapsed ? '20' : '64'}
          w-full
        `}>
          {/* Your dashboard content goes here */}
          <div className="p-4 lg:p-6">
            {/* Page content */}
          </div>
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-card border-t border-light z-sticky ">
        <div className="flex items-center justify-around px-2 py-1">
          <Link href="/wholesale" className="flex flex-col items-center p-2 text-secondary hover:text-primary-600 transition-fast">
            <Home size={20} />
            <span className="text-xs mt-1">Home</span>
          </Link>
          <Link href="/wholesale/orders" className="flex flex-col items-center p-2 text-secondary hover:text-primary-600 transition-fast relative">
            <Package size={20} />
            <span className="text-xs mt-1">Orders</span>
            <span className="absolute top-0 right-0 w-4 h-4 bg-primary-500 text-inverse text-xs rounded-full flex items-center justify-center">
              12
            </span>
          </Link>
          <button className="flex flex-col items-center p-2 -mt-5">
            <div className="w-12 h-12 rounded-full bg-primary-500 flex items-center justify-center text-inverse shadow-lg">
              <PlusCircle size={24} />
            </div>
            <span className="text-xs mt-1">Add</span>
          </button>
          <Link href="/wholesale/products" className="flex flex-col items-center p-2 text-secondary hover:text-primary-600 transition-fast">
            <Grid size={20} />
            <span className="text-xs mt-1">Products</span>
          </Link>
          <Link href="/wholesale/profile" className="flex flex-col items-center p-2 text-secondary hover:text-primary-600 transition-fast">
            <User size={20} />
            <span className="text-xs mt-1">Profile</span>
          </Link>
        </div>
      </div>

      
    </>
  )
}