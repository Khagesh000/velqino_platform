"use client";

import React from 'react';
import Link from 'next/link';
import { ShoppingBag, Heart, MapPin, User, Sparkles, ChevronRight, Settings } from '../../../utils/icons';

export default function QuickActions() {
  const actions = [
    { 
      icon: <ShoppingBag size={18} />, 
      label: 'Explore Catalog', 
      desc: 'Discover new products & deals',
      href: '/product/productlistingpage', 
      bubble: 'bg-primary-50 text-primary-600 border border-primary-100' 
    },
    { 
      icon: <Heart size={18} />, 
      label: 'My Saved Wishlist', 
      desc: 'View saved favorite items',
      href: '/customer/wishlist', 
      bubble: 'bg-rose-50 text-rose-600 border border-rose-100' 
    },
    { 
      icon: <MapPin size={18} />, 
      label: 'Delivery Addresses', 
      desc: 'Manage shipping locations',
      href: '/customer/addresses', 
      bubble: 'bg-blue-50 text-blue-600 border border-blue-100' 
    },
    { 
      icon: <User size={18} />, 
      label: 'Profile & Security', 
      desc: 'Update credentials & PIN',
      href: '/customer/profilesettings', 
      bubble: 'bg-indigo-50 text-indigo-600 border border-indigo-100' 
    },
  ];
  
  return (
    <div className="bg-white rounded-3xl border border-gray-200/80 shadow-2xs p-5 sm:p-6 space-y-4">
      <div className="flex items-center gap-2.5">
        <div className="w-8 h-8 rounded-xl bg-primary-50 text-primary-600 flex items-center justify-center shrink-0">
          <Sparkles size={16} />
        </div>
        <div>
          <h3 className="text-sm sm:text-base font-extrabold text-gray-900">Account Quick Shortcuts</h3>
          <p className="text-[11px] text-gray-400">Common customer operations</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {actions.map((action, index) => (
          <Link
            key={index}
            href={action.href}
            className="flex items-center justify-between p-3.5 rounded-2xl bg-gray-50/70 border border-gray-200/70 hover:border-primary-300 hover:bg-primary-50/30 transition-all group"
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className={`w-10 h-10 rounded-xl ${action.bubble} flex items-center justify-center shrink-0 shadow-2xs group-hover:scale-105 transition-transform`}>
                {action.icon}
              </div>
              <div className="min-w-0">
                <p className="text-xs sm:text-sm font-bold text-gray-900 group-hover:text-primary-700 transition-colors truncate">
                  {action.label}
                </p>
                <p className="text-[11px] text-gray-500 truncate mt-0.5">
                  {action.desc}
                </p>
              </div>
            </div>
            <ChevronRight size={16} className="text-gray-400 group-hover:text-primary-600 group-hover:translate-x-0.5 transition-all shrink-0 ml-2" />
          </Link>
        ))}
      </div>
    </div>
  );
}
