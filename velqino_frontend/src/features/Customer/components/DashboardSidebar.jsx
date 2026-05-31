"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, ShoppingBag, Heart, MapPin, User, Settings, Package, LogOut } from '../../../utils/icons';

export default function DashboardSidebar({ isMobileMenuOpen }) {
  const pathname = usePathname();
  
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
  localStorage.removeItem('access');
  localStorage.removeItem('refresh');
  localStorage.removeItem('user_role');
  localStorage.removeItem('user_name');
  localStorage.removeItem('user_id');
  router.push('/');
  if (onClose) onClose();
};
  
  return (
    <aside className={sidebarClasses}>
  <div className="p-4 border-b border-gray-200">
    <h2 className="text-xl font-bold text-primary-600">My Account</h2>
    <p className="text-xs text-gray-500 mt-1">
      {typeof window !== 'undefined' ? localStorage.getItem('user_name') || 'Customer' : 'Customer'}
    </p>
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
