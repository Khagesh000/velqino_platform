"use client"

import React, { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { ChevronDown, Bell, User, HelpCircle, Search, Menu, X, Home, 
         Package, Grid, BarChart3, ShoppingBag, Heart, Settings, PlusCircle,
         ShoppingCart, Users, Box, Wallet, Truck, Star    } from '../../../../utils/icons';
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
    { icon: <Home size={20} />, label: 'Dashboard', href: '/retailer/retailerdashboard', badge: null },
    { icon: <ShoppingCart size={20} />, label: 'POS / Sales', href: '/retailer/possales', badge: null },
    { icon: <Package size={20} />, label: 'Products', href: '/retailer/retailerproducts', badge: null },
    { icon: <ShoppingBag size={20} />, label: 'Orders', href: '/retailer/retailerorders', badge: '3' },
    { icon: <Users size={20} />, label: 'Customers', href: '/retailer/retailercustomers', badge: null },
    { icon: <Box size={20} />, label: 'Inventory', href: '/retailer/inventory', badge: '5' },
    { icon: <BarChart3 size={20} />, label: 'Reports & Analytics', href: '/retailer/reports', badge: null },
    { icon: <Wallet size={20} />, label: 'Expenses', href: '/retailer/expenses', badge: null },
    { icon: <Truck size={20} />, label: 'Suppliers', href: '/retailer/suppliers', badge: null },
    { icon: <Star size={20} />, label: 'Loyalty Program', href: '/retailer/loyalty', badge: null },
    { icon: <Users size={20} />, label: 'Staff Management', href: '/retailer/staff', badge: null },
    { icon: <Settings size={20} />, label: 'Settings', href: '/retailer/settings', badge: null },
  ]

  return (
    <>
      {/* Top Navigation Bar */}
      <nav ref={navbarRef} className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="px-4 lg:px-6">
          <div className="flex items-center justify-between h-16 lg:h-20">
            {/* Left Section */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden p-2 text-gray-600 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-all"
              >
                {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>

              <Link href="/retailer" className="flex items-center gap-2">
                <span className="text-2xl font-bold bg-gradient-to-r from-primary-600 to-primary-800 bg-clip-text text-transparent">
                  VELTRIX
                </span>
                <span className="hidden sm:inline-block px-2 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full">
                  RETAILER
                </span>
              </Link>
            </div>

            {/* Center Search */}
            <div className="hidden md:flex flex-1 max-w-xl mx-8">
              <div className="relative w-full">
                <input
                  type="text"
                  placeholder="Search products, orders..."
                  className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-100 transition-all"
                />
                <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              </div>
            </div>

            {/* Right Section */}
            <div className="flex items-center gap-2 lg:gap-3">
              {/* Mobile Search */}
              <div className="md:hidden">
                <button
                  onClick={() => setIsMobileSearchOpen(true)}
                  className="p-2.5 text-gray-600 hover:text-primary-600 hover:bg-primary-50 rounded-xl transition-all"
                >
                  <Search size={20} />
                </button>
              </div>

              {/* Notifications */}
              <div className="relative" ref={notificationsRef}>
                <button
                  onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                  className="relative p-2.5 text-gray-600 hover:text-primary-600 hover:bg-primary-50 rounded-xl transition-all"
                >
                  <Bell size={20} />
                  {unreadCount > 0 && (
                    <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white"></span>
                  )}
                </button>

                {isNotificationsOpen && (
                  <div className="absolute right-0 top-12 w-80 bg-white border border-gray-200 rounded-xl shadow-xl py-2 z-50 notifications-dropdown">
                    <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
                      <span className="font-semibold text-gray-900">Notifications</span>
                      {unreadCount > 0 && (
                        <span className="px-2 py-1 bg-primary-50 text-primary-600 text-xs rounded-full">
                          {unreadCount} new
                        </span>
                      )}
                    </div>
                    
                    <div className="max-h-96 overflow-y-auto">
                      {notifications.map((notification) => (
                        <div
                          key={notification.id}
                          className={`px-4 py-3 hover:bg-primary-50 transition-all cursor-pointer border-b border-gray-100 last:border-0 ${
                            !notification.read ? 'bg-primary-50/30' : ''
                          }`}
                        >
                          <div className="flex items-start gap-3">
                            <div className={`w-2 h-2 mt-2 rounded-full flex-shrink-0 ${
                              notification.type === 'order' ? 'bg-primary-500' :
                              notification.type === 'delivery' ? 'bg-green-500' :
                              notification.type === 'offer' ? 'bg-orange-500' : 'bg-blue-500'
                            }`} />
                            <div className="flex-1">
                              <p className={`text-sm ${!notification.read ? 'font-medium text-gray-900' : 'text-gray-600'}`}>
                                {notification.message}
                              </p>
                              <p className="text-xs text-gray-400 mt-1">{notification.time}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    <div className="px-4 py-3 border-t border-gray-100">
                      <button className="text-sm text-primary-600 hover:text-primary-700 font-medium transition-all">
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
                  className="flex items-center gap-2 lg:gap-3 p-1.5 lg:pr-3 hover:bg-primary-50 rounded-xl transition-all"
                >
                  <div className="w-8 h-8 lg:w-10 lg:h-10 rounded-full bg-gradient-to-r from-primary-500 to-primary-700 flex items-center justify-center">
                    <User size={18} className="text-white lg:hidden" />
                    <User size={22} className="text-white hidden lg:block" />
                  </div>
                  <div className="hidden lg:block text-left">
                    <p className="text-sm font-medium text-gray-900">Retail Store</p>
                    <p className="text-xs text-gray-500">retailer@veltrix.com</p>
                  </div>
                  <ChevronDown size={16} className={`hidden lg:block text-gray-400 transition-transform duration-200 ${isProfileDropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {isProfileDropdownOpen && (
                  <div className="absolute right-0 top-12 lg:top-14 w-64 bg-white border border-gray-200 rounded-xl shadow-xl py-2 z-50">
                    <div className="px-4 py-3 border-b border-gray-100 lg:hidden">
                      <p className="text-sm font-medium text-gray-900">Retail Store</p>
                      <p className="text-xs text-gray-500">retailer@veltrix.com</p>
                    </div>
                    
                    <Link href="/retailer/profile" className="flex items-center gap-3 px-4 py-2.5 text-gray-600 hover:bg-primary-50 hover:text-primary-600 transition-all">
                      <User size={18} />
                      <span className="text-sm">My Profile</span>
                    </Link>
                    
                    <Link href="/retailer/settings" className="flex items-center gap-3 px-4 py-2.5 text-gray-600 hover:bg-primary-50 hover:text-primary-600 transition-all">
                      <Settings size={18} />
                      <span className="text-sm">Settings</span>
                    </Link>
                    
                    <div className="border-t border-gray-100 my-2"></div>
                    
                    <button className="w-full flex items-center gap-3 px-4 py-2.5 text-red-600 hover:bg-red-50 transition-all">
                      <span className="text-sm">Sign Out</span>
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
        <div className="md:hidden fixed inset-x-0 top-16 z-[100] bg-white border-b border-gray-200 px-4 py-3 animate-slide-down">
          <div className="flex items-center gap-2">
            <div className="flex-1 relative">
              <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search products, orders..."
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-100"
                autoFocus
              />
            </div>
            <button
              onClick={() => setIsMobileSearchOpen(false)}
              className="p-2 text-gray-600 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-all"
            >
              <X size={20} />
            </button>
          </div>
        </div>
      )}

      {/* Sidebar */}
      <aside className={`
        hidden lg:block fixed left-0 top-20 h-[calc(100vh-5rem)] 
        bg-white border-r border-gray-200 transition-all duration-300 z-40
        ${isSidebarCollapsed ? 'w-20' : 'w-64'}
      `}>
        <div className="py-6 px-3">
          <nav className="space-y-1">
            {navItems.map((item, index) => (
              <Link
                key={index}
                href={item.href}
                className="flex items-center gap-3 px-3 py-2.5 text-gray-600 hover:bg-primary-50 hover:text-primary-600 rounded-xl transition-all group relative"
              >
                <span className="text-gray-500 group-hover:text-primary-600 transition-all">
                  {item.icon}
                </span>
                {!isSidebarCollapsed && (
                  <>
                    <span className="text-sm font-medium flex-1">{item.label}</span>
                    {item.badge && (
                      <span className="px-2 py-0.5 bg-primary-500 text-white text-xs rounded-full">
                        {item.badge}
                      </span>
                    )}
                  </>
                )}
                {isSidebarCollapsed && item.badge && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-primary-500 text-white text-xs rounded-full flex items-center justify-center">
                    {item.badge}
                  </span>
                )}
              </Link>
            ))}
          </nav>

          {!isSidebarCollapsed && (
            <div className="absolute bottom-6 left-3 right-3">
              <Link
                href="/retailer/support"
                className="flex items-center gap-3 px-3 py-2.5 text-gray-600 hover:bg-primary-50 hover:text-primary-600 rounded-xl transition-all"
              >
                <HelpCircle size={20} />
                <span className="text-sm font-medium">Support</span>
              </Link>
            </div>
          )}
        </div>
      </aside>

      {/* Mobile Sidebar Drawer */}
      <div className={`
        lg:hidden fixed inset-0 bg-black/50 z-50 transition-opacity duration-300
        ${isMobileMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}
      `}>
        <aside className={`
          fixed left-0 top-0 h-full w-72 bg-white shadow-xl transform transition-transform duration-300 ease-in-out
          ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
        `}>
          <div className="p-4 border-b border-gray-200 flex items-center justify-between">
            <Link href="/retailer" className="text-xl font-bold bg-gradient-to-r from-primary-600 to-primary-800 bg-clip-text text-transparent">
              VELTRIX
            </Link>
            <button
              onClick={() => setIsMobileMenuOpen(false)}
              className="p-2 text-gray-600 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-all"
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
                  className="flex items-center gap-3 px-3 py-3 text-gray-600 hover:bg-primary-50 hover:text-primary-600 rounded-xl transition-all"
                >
                  <span className="text-gray-500">{item.icon}</span>
                  <span className="text-sm font-medium flex-1">{item.label}</span>
                  {item.badge && (
                    <span className="px-2 py-0.5 bg-primary-500 text-white text-xs rounded-full">
                      {item.badge}
                    </span>
                  )}
                </Link>
              ))}
              <Link
                href="/retailer/support"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center gap-3 px-3 py-3 text-gray-600 hover:bg-primary-50 hover:text-primary-600 rounded-xl transition-all"
              >
                <HelpCircle size={20} />
                <span className="text-sm font-medium">Support</span>
              </Link>
            </nav>
          </div>
        </aside>
      </div>
    </>
  )
}