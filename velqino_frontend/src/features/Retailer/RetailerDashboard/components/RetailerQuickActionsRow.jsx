"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  ShoppingCart, 
  ShoppingBag, 
  Package, 
  Truck, 
  BarChart3, 
  Users, 
  ArrowRight,
  Sparkles
} from '../../../../utils/icons';

export default function RetailerQuickActionsRow() {
  const [hoveredAction, setHoveredAction] = useState(null);

  const actions = [
    {
      id: 'pos',
      title: 'POS Terminal',
      description: 'Quick counter checkout',
      icon: <ShoppingCart size={18} />,
      href: '/retailer/possales',
      badge: 'Fast',
      badgeColor: 'bg-primary-100 text-primary-700'
    },
    {
      id: 'orders',
      title: 'Store Orders',
      description: 'Track orders & packing',
      icon: <ShoppingBag size={18} />,
      href: '/retailer/retailerorders',
      badge: null
    },
    {
      id: 'inventory',
      title: 'Inventory & Stock',
      description: 'Audit SKU counts',
      icon: <Package size={18} />,
      href: '/retailer/retailerinventory',
      badge: null
    },
    {
      id: 'restock',
      title: 'Wholesale Restock',
      description: 'Direct factory lots',
      icon: <Truck size={18} />,
      href: '/product/productlistingpage',
      badge: 'Factory Direct',
      badgeColor: 'bg-accent-100 text-accent-800'
    },
    {
      id: 'reports',
      title: 'Sales Analytics',
      description: 'Profit & revenue reports',
      icon: <BarChart3 size={18} />,
      href: '/retailer/retailerreports',
      badge: null
    },
    {
      id: 'customers',
      title: 'Customers',
      description: 'Buyer directory & loyalty',
      icon: <Users size={18} />,
      href: '/retailer/retailercustomers',
      badge: null
    }
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-3.5">
      {actions.map((action) => {
        const isHovered = hoveredAction === action.id;

        return (
          <Link
            key={action.id}
            href={action.href}
            onMouseEnter={() => setHoveredAction(action.id)}
            onMouseLeave={() => setHoveredAction(null)}
            className={`
              group relative p-3.5 rounded-2xl bg-white border border-gray-200/80
              shadow-2xs hover:shadow-md transition-all duration-300
              ${isHovered ? '-translate-y-0.5 border-primary-300 bg-primary-50/20' : ''}
              flex flex-col justify-between
            `}
          >
            <div>
              <div className="flex items-center justify-between mb-2.5">
                <div className="w-8 h-8 rounded-xl bg-primary-50 text-primary-600 flex items-center justify-center transition-colors group-hover:bg-primary-600 group-hover:text-white">
                  {action.icon}
                </div>
                {action.badge && (
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${action.badgeColor}`}>
                    {action.badge}
                  </span>
                )}
              </div>
              <h4 className="text-xs sm:text-sm font-bold text-gray-900 group-hover:text-primary-700 transition-colors">
                {action.title}
              </h4>
              <p className="text-[11px] text-gray-500 mt-0.5 line-clamp-1">
                {action.description}
              </p>
            </div>

            <div className="mt-3 pt-2 border-t border-gray-100 flex items-center justify-between text-[11px] font-bold text-primary-600 group-hover:text-primary-700">
              <span>Open</span>
              <ArrowRight size={12} className="transition-transform group-hover:translate-x-1" />
            </div>
          </Link>
        );
      })}
    </div>
  );
}
