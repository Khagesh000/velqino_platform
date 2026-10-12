"use client";

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { 
  Home, 
  ShoppingBag, 
  Heart, 
  MapPin, 
  User, 
  Settings, 
  Package, 
  LogOut, 
  HelpCircle,
  X,
  Sparkles,
  ShieldCheck
} from '../../../utils/icons';
import { clearAuthTokens, getAuthUser } from '@/utils/cookieUtils';

export default function DashboardSidebar({ isMobileMenuOpen, onClose }) {
  const pathname = usePathname();
  const router = useRouter();

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
  
  const navItems = [
    { icon: <Home size={19} />, label: 'Dashboard Overview', href: '/customer/dashboard' },
    { icon: <ShoppingBag size={19} />, label: 'My Orders', href: '/customer/orderslist' },
    { icon: <Heart size={19} />, label: 'Saved Wishlist', href: '/customer/wishlist' },
    { icon: <MapPin size={19} />, label: 'Address Book', href: '/customer/addresses' },
    { icon: <User size={19} />, label: 'Profile Settings', href: '/customer/profilesettings' },
    { icon: <Settings size={19} />, label: 'Change Password', href: '/customer/changepassword' },
  ];

  const isActive = (href) => {
    if (pathname === href) return true;
    return pathname?.startsWith(href) && pathname?.charAt(href.length) === '/';
  };

  const handleLogout = () => {
    clearAuthTokens();
    localStorage.removeItem('user_role');
    localStorage.removeItem('user_name');
    router.push('/');
    if (onClose) onClose();
  };
  
  return (
    <>
      {/* Desktop / Laptop Sidebar (Fixed left) */}
      <aside className="hidden lg:flex flex-col justify-between fixed top-16 sm:top-20 left-0 h-[calc(100vh-4rem)] sm:h-[calc(100vh-5rem)] bg-white border-r border-slate-200/80 w-64 z-30 shadow-2xs">
        {/* Top Profile & Navigation */}
        <div className="flex-1 overflow-y-auto scrollbar-none">
          {/* User Profile Mini Card */}
          <div className="p-4 border-b border-slate-100 bg-slate-50/50">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-primary-100 text-primary-700 font-extrabold flex items-center justify-center text-sm shadow-2xs shrink-0 border border-primary-200/60">
                {displayName ? displayName.charAt(0).toUpperCase() : 'C'}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold text-slate-900 truncate">{displayName}</p>
                <p className="text-[10px] text-slate-400 truncate">{displayEmail}</p>
                <span className="inline-flex items-center gap-0.5 text-[9px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded mt-1 border border-emerald-200">
                  <ShieldCheck size={9} /> Verified Buyer
                </span>
              </div>
            </div>
          </div>
          
          {/* Nav List */}
          <nav className="p-3 space-y-1">
            {navItems.map((item) => {
              const active = isActive(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all group ${
                    active
                      ? 'bg-primary-50 text-primary-700 shadow-2xs border border-primary-200/60'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  <span className={`shrink-0 transition-colors ${
                    active ? 'text-primary-600' : 'text-slate-400 group-hover:text-primary-600'
                  }`}>
                    {item.icon}
                  </span>
                  <span className="flex-1 truncate">{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>
        
        {/* Desktop Sidebar Bottom Pinned Sign Out */}
        <div className="p-3 border-t border-slate-100 bg-slate-50/50 space-y-1">
          <Link
            href="/product/productlistingpage"
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold text-slate-600 hover:bg-white hover:text-primary-600 transition-all"
          >
            <Sparkles size={16} className="text-primary-600" />
            <span className="truncate">Continue Shopping</span>
          </Link>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold text-rose-600 hover:bg-rose-50 hover:text-rose-700 transition-all text-left active:scale-95 cursor-pointer"
          >
            <LogOut size={16} className="shrink-0" />
            <span>Sign Out Account</span>
          </button>
        </div>
      </aside>

      {/* Mobile / Tablet Sidebar Drawer (Matching Wholesale/Retailer drawer) */}
      <div className={`
        lg:hidden fixed inset-0 z-[100000] transition-opacity duration-300
        ${isMobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}
      `}>
        {/* Backdrop overlay */}
        <div
          className="absolute inset-0 bg-slate-950/60 backdrop-blur-xs transition-opacity"
          onClick={() => onClose && onClose()}
        />

        <aside className={`
          fixed left-0 top-0 h-full w-80 max-w-[85vw] bg-white shadow-2xl z-10 flex flex-col justify-between transform transition-transform duration-300 ease-in-out
          ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
        `}>
          {/* Drawer Header with Logo & Close button */}
          <div className="p-4 sm:p-5 border-b border-slate-200/80 flex items-center justify-between">
            <Link href="/" onClick={() => onClose && onClose()} className="flex items-center gap-2">
              <span className="text-2xl font-extrabold tracking-tight bg-gradient-to-r from-primary-700 via-primary-600 to-primary-500 bg-clip-text text-transparent">
                VELTRIX
              </span>
              <span className="px-2 py-0.5 bg-primary-50 text-primary-700 text-3xs font-bold rounded-full border border-primary-200/60 uppercase">
                Customer
              </span>
            </Link>
            <button
              onClick={() => onClose && onClose()}
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
            {navItems.map((item) => {
              const active = isActive(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => onClose && onClose()}
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
                </Link>
              );
            })}
          </div>

          {/* Mobile / Tablet Drawer Bottom: SIGNOUT BUTTON IN SIDEBAR (Always Visible at bottom) */}
          <div className="p-4 border-t border-slate-200/80 bg-slate-50/50 space-y-2">
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-2.5 px-4 py-2.5 bg-white hover:bg-rose-50 text-rose-600 hover:text-rose-700 border border-slate-200 hover:border-rose-200 rounded-xl text-xs sm:text-sm font-bold shadow-2xs transition-all active:scale-95 cursor-pointer"
            >
              <LogOut size={16} />
              <span>Sign Out Account</span>
            </button>
          </div>
        </aside>
      </div>
    </>
  );
}
