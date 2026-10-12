"use client";

import React, { useState, useRef, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  Bell, 
  Search, 
  Menu, 
  X, 
  LogOut, 
  User, 
  ShoppingBag, 
  Heart, 
  ChevronDown,
  Settings,
  Sparkles 
} from '../../../utils/icons';
import { toast } from 'react-toastify';
import { clearAuthTokens, getAuthUser } from '@/utils/cookieUtils';

export default function DashboardHeader({ isMobileMenuOpen, setIsMobileMenuOpen }) {
  const router = useRouter();
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const notificationsRef = useRef(null);
  const profileRef = useRef(null);
  
  const initialAuth = useMemo(() => getAuthUser(), []);
  const [userName, setUserName] = useState(
    initialAuth.name && initialAuth.name !== 'undefined' ? initialAuth.name : ''
  );
  const [userEmail, setUserEmail] = useState(
    initialAuth.email && initialAuth.email !== 'undefined' ? initialAuth.email : ''
  );

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const auth = getAuthUser();
      if (auth.name && auth.name !== 'undefined') setUserName(auth.name);
      if (auth.email && auth.email !== 'undefined') setUserEmail(auth.email);

      const handleUpdate = (e) => {
        const detail = e?.detail || getAuthUser();
        if (detail.name && detail.name !== 'undefined') setUserName(detail.name);
        if (detail.email && detail.email !== 'undefined') setUserEmail(detail.email);
      };

      window.addEventListener('velqino:auth-user-updated', handleUpdate);
      return () => window.removeEventListener('velqino:auth-user-updated', handleUpdate);
    }
  }, []);

  const displayName = useMemo(() => {
    if (userName && userName !== 'undefined' && userName !== 'null') return userName;
    if (userEmail && userEmail !== 'undefined' && userEmail !== 'null') return userEmail.split('@')[0];
    return 'Customer';
  }, [userName, userEmail]);

  const displayEmail = useMemo(() => {
    if (userEmail && userEmail !== 'undefined' && userEmail !== 'null') return userEmail;
    return 'customer@velqino.com';
  }, [userEmail]);

  const notifications = [
    { id: 1, type: 'order', message: 'Your order has been confirmed & dispatched to courier', time: '2 hours ago', read: false },
    { id: 2, type: 'delivery', message: 'Courier partner is arriving today with your package', time: '1 day ago', read: true },
    { id: 3, type: 'offer', message: 'Exclusive 15% VIP discount code unlocked: VIP15', time: '2 days ago', read: true },
  ];
  const unreadCount = notifications.filter(n => !n.read).length;
  
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notificationsRef.current && !notificationsRef.current.contains(event.target)) {
        setIsNotificationsOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  
  const handleLogout = () => {
    clearAuthTokens();
    localStorage.removeItem('user_role');
    localStorage.removeItem('user_name');
    toast.success('Logged out successfully');
    router.push('/');
  };
  
  return (
    <header className="bg-white border-b border-slate-200/80 sticky top-0 z-40 shadow-2xs">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Left Section: Mobile Toggle & Brand Logo */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 text-slate-600 hover:text-primary-600 hover:bg-primary-50 rounded-xl transition-all"
              aria-label="Toggle navigation menu"
            >
              {isMobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
            <div className="flex items-center gap-2">
              <Link href="/" className="flex items-center gap-2 hover:opacity-85 transition-opacity">
                <span className="text-2xl font-extrabold tracking-tight bg-gradient-to-r from-primary-700 via-primary-600 to-primary-500 bg-clip-text text-transparent">
                  VELTRIX
                </span>
              </Link>
              <span className="hidden sm:inline-block px-2 py-0.5 bg-primary-50 text-primary-700 text-3xs font-bold rounded-full border border-primary-200/60 uppercase">
                Customer
              </span>
            </div>
          </div>

          {/* Center Search / Browse Shortcut */}
          <div className="hidden md:flex flex-1 max-w-md mx-8">
            <Link
              href="/product/productlistingpage"
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200/80 rounded-xl text-xs sm:text-sm font-medium text-slate-400 hover:text-slate-600 hover:border-primary-300 flex items-center justify-between transition-all group"
            >
              <div className="flex items-center gap-2.5">
                <Search size={16} className="text-slate-400 group-hover:text-primary-600" />
                <span>Search catalog products, categories...</span>
              </div>
              <span className="text-[10px] font-bold text-primary-600 bg-primary-50 px-2 py-0.5 rounded-md border border-primary-100">
                Shop Now
              </span>
            </Link>
          </div>
          
          {/* Right Section: Shopping Shortcut, Notifications & Profile */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Wishlist Shortcut */}
            <Link
              href="/customer/wishlist"
              className="p-2.5 text-slate-600 hover:text-primary-600 hover:bg-primary-50 rounded-xl transition-all hidden sm:flex items-center justify-center"
              title="My Wishlist"
            >
              <Heart size={19} />
            </Link>

            {/* Notifications Dropdown */}
            <div className="relative" ref={notificationsRef}>
              <button
                onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                className="relative p-2.5 text-slate-600 hover:text-primary-600 hover:bg-primary-50 rounded-xl transition-all"
                aria-label="View notifications"
              >
                <Bell size={19} />
                {unreadCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full ring-2 ring-white"></span>
                )}
              </button>

              {isNotificationsOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-xl border border-slate-200/80 py-2 z-50 animate-fadeIn">
                  <div className="px-4 py-2.5 border-b border-slate-100 flex items-center justify-between">
                    <span className="font-bold text-xs text-slate-900">Notifications</span>
                    {unreadCount > 0 && (
                      <span className="px-2 py-0.5 bg-primary-50 text-primary-600 text-3xs font-bold rounded-full border border-primary-200/60">
                        {unreadCount} new
                      </span>
                    )}
                  </div>
                  <div className="max-h-72 overflow-y-auto">
                    {notifications.map((notif) => (
                      <div key={notif.id} className="px-4 py-3 hover:bg-slate-50 transition-colors border-b border-slate-100 last:border-0 cursor-pointer">
                        <p className="text-xs font-semibold text-slate-800">{notif.message}</p>
                        <p className="text-[10px] text-slate-400 mt-1">{notif.time}</p>
                      </div>
                    ))}
                  </div>
                  <div className="px-4 py-2 border-t border-slate-100 bg-slate-50/50">
                    <button className="text-xs text-primary-600 hover:text-primary-700 font-bold transition-all w-full text-center">
                      Mark all as read
                    </button>
                  </div>
                </div>
              )}
            </div>
            
            {/* User Profile Dropdown */}
            <div className="relative" ref={profileRef}>
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center gap-2 p-1.5 sm:pr-3 hover:bg-slate-50 rounded-2xl transition-all"
              >
                <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-gradient-to-r from-primary-600 to-primary-700 text-white font-bold flex items-center justify-center text-xs shadow-xs shrink-0">
                  {displayName ? displayName.charAt(0).toUpperCase() : 'C'}
                </div>
                <div className="hidden sm:block text-left max-w-[120px]">
                  <p className="text-xs font-bold text-slate-900 truncate">{displayName}</p>
                  <p className="text-[10px] text-slate-400 truncate">{displayEmail}</p>
                </div>
                <ChevronDown size={14} className={`hidden sm:block text-slate-400 transition-transform duration-200 ${isProfileOpen ? 'rotate-180' : ''}`} />
              </button>

              {isProfileOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-200/80 py-2 z-50 animate-fadeIn">
                  <div className="px-4 py-2.5 border-b border-slate-100 bg-slate-50/60 sm:hidden">
                    <p className="text-xs font-bold text-slate-900 truncate">{displayName}</p>
                    <p className="text-[10px] text-slate-400 truncate">{displayEmail}</p>
                  </div>

                  <Link 
                    href="/customer/profilesettings" 
                    onClick={() => setIsProfileOpen(false)}
                    className="flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:text-primary-600 transition-colors"
                  >
                    <User size={15} />
                    <span>Profile Settings</span>
                  </Link>

                  <Link 
                    href="/customer/orderslist" 
                    onClick={() => setIsProfileOpen(false)}
                    className="flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:text-primary-600 transition-colors"
                  >
                    <ShoppingBag size={15} />
                    <span>My Orders</span>
                  </Link>

                  <Link 
                    href="/customer/wishlist" 
                    onClick={() => setIsProfileOpen(false)}
                    className="flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:text-primary-600 transition-colors"
                  >
                    <Heart size={15} />
                    <span>Wishlist Items</span>
                  </Link>

                  <div className="border-t border-slate-100 my-1"></div>

                  <button
                    onClick={() => {
                      setIsProfileOpen(false);
                      handleLogout();
                    }}
                    className="w-full flex items-center gap-2.5 px-4 py-2 text-xs font-bold text-rose-600 hover:bg-rose-50 transition-colors text-left cursor-pointer"
                  >
                    <LogOut size={15} />
                    <span>Sign Out</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
