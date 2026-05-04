"use client";

import React from 'react';
import Link from 'next/link';
import { ShoppingBag, Heart, MapPin, User } from '../../../utils/icons';

export default function QuickActions() {
  const actions = [
    { icon: <ShoppingBag size={18} />, label: 'Continue Shopping', href: '/product/productlistingpage', color: 'bg-primary-500' },
    { icon: <Heart size={18} />, label: 'My Wishlist', href: '/profile/wishlist', color: 'bg-pink-500' },
    { icon: <MapPin size={18} />, label: 'Add Address', href: '/profile/addresses', color: 'bg-blue-500' },
    { icon: <User size={18} />, label: 'Edit Profile', href: '/profile/settings', color: 'bg-purple-500' },
  ];
  
  return (
    <div className="bg-white rounded-xl border border-gray-100 p-5">
      <h2 className="font-semibold text-gray-900 mb-4">Quick Actions</h2>
      <div className="grid grid-cols-2 gap-3">
        {actions.map((action, index) => (
          <Link
            key={index}
            href={action.href}
            className="flex items-center gap-2 p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
          >
            <span className="text-gray-600">{action.icon}</span>
            <span className="text-sm font-medium text-gray-700">{action.label}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}