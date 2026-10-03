"use client";

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Home, ShoppingBag, Heart, MapPin, User, Settings, Package, LogOut } from '../../../utils/icons';
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
    return '';
  }, [userEmail]);
  
  const navItems = [
    { icon: <Home size={18} />, label: 'Dashboard', href: '/customer/dashboard' },
    { icon: <ShoppingBag size={18} />, label: 'My Orders', href: '/customer/orderslist' },
    { icon: <Heart size={18} />, label: 'Wishlist', href: '/customer/wishlist' },
    { icon: <MapPin size={18} />, label: 'Address Book', href: '/customer/addresses' },
    { icon: <User size={18} />, label: 'Profile Settings', href: '/customer/profilesettings' },
    { icon: <Settings size={18} />, label: 'Change Password', href: '/customer/changepassword' },
  ];
  
  const sidebarClasses = `
    fixed top-16 left-0 h-full bg-white border-r border-gray-200 w-64 transform transition-transform duration-300 z-20
    ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
  `;

  const handleLogout = () => {
    clearAuthTokens();
    router.push('/');
    if (onClose) onClose();
  };
  
  return (
    <aside className={sidebarClasses}>
  <div className="p-4 border-b border-gray-200">
    <h2 className="text-xl font-bold text-primary-600">My Account</h2>
    <p className="text-sm font-semibold text-gray-800 mt-1 truncate">
      {displayName}
    </p>
    {displayEmail ? (
      <p className="text-xs text-gray-500 truncate">
        {displayEmail}
      </p>
    ) : null}
  </div>
  
  <nav className="p-4 space-y-1">
    {navItems.map((item) => (
      <Link
        key={item.href}
        href={item.href}
        onClick={() => onClose && onClose()}
        className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
          pathname === item.href
            ? 'bg-primary-50 text-primary-600'
            : 'text-gray-700 hover:bg-gray-50 hover:text-primary-600'
        }`}
      >
        {item.icon}
        <span>{item.label}</span>
      </Link>
    ))}
  </nav>
  
  <div className="p-4 pt-0 mt-4 border-t border-gray-200">
    <button
      onClick={handleLogout}
      className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-all"
    >
      <LogOut size={18} />
      <span>Logout</span>
    </button>
  </div>
</aside>
  );
}
