"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, ShoppingBag, Heart, MapPin, User, Settings, Package } from '../../../utils/icons';

export default function DashboardSidebar({ isMobileMenuOpen }) {
  const pathname = usePathname();
  
  const navItems = [
    { icon: <Home size={18} />, label: 'Dashboard', href: '/customer/dashboard' },
    { icon: <ShoppingBag size={18} />, label: 'My Orders', href: '/product/orderslist' },
    { icon: <Heart size={18} />, label: 'Wishlist', href: '/profile/wishlist' },
    { icon: <MapPin size={18} />, label: 'Address Book', href: '/profile/addresses' },
    { icon: <User size={18} />, label: 'Profile Settings', href: '/profile/profilesettings' },
    { icon: <Settings size={18} />, label: 'Change Password', href: '/profile/changepassword' },
  ];
  
  const sidebarClasses = `
    fixed top-16 left-0 h-full bg-white border-r border-gray-200 w-64 transform transition-transform duration-300 z-20
    ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
  `;
  
  return (
    <aside className={sidebarClasses}>
      <nav className="p-4 space-y-1">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
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
    </aside>
  );
}