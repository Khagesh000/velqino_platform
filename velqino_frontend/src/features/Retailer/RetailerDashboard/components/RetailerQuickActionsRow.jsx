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
  Plus,
  Image as ImageIcon,
  Video,
  Sparkles
} from '../../../../utils/icons';

export default function RetailerQuickActionsRow() {
  const [hoveredAction, setHoveredAction] = useState(null);

  const actions = [
    {
      id: 'add-product',
      title: 'Add Product',
      description: 'Create single listing',
      icon: <Plus size={18} strokeWidth={2.5} />,
      href: '/retailer/retailerproducts?action=add-single',
      badge: 'Create',
      badgeColor: 'bg-primary-100 text-primary-800'
    },
    {
      id: 'bulk-images',
      title: 'Bulk Images',
      description: 'Upload multiple photos',
      icon: <ImageIcon size={18} />,
      href: '/retailer/retailerproducts?action=bulk-images',
      badge: 'Batch',
      badgeColor: 'bg-emerald-100 text-emerald-800'
    },
    {
      id: 'bulk-video',
      title: 'Bulk Video',
      description: 'Import from MP4 clips',
      icon: <Video size={18} />,
      href: '/retailer/retailerproducts?action=bulk-video',
      badge: 'Video',
      badgeColor: 'bg-accent-100 text-accent-900'
    },
    {
      id: 'pos',
      title: 'POS Terminal',
      description: 'Fast counter register',
      icon: <ShoppingCart size={18} />,
      href: '/retailer/possales',
      badge: 'Fast',
      badgeColor: 'bg-primary-100 text-primary-700'
    },
    {
      id: 'inventory',
      title: 'Inventory Catalog',
      description: 'Audit SKU stock counts',
      icon: <Package size={18} />,
      href: '/retailer/retailerproducts',
      badge: null
    },
    {
      id: 'restock',
      title: 'Wholesale Restock',
      description: 'Direct factory lots',
      icon: <Truck size={18} />,
      href: '/product/productlistingpage',
      badge: 'Direct',
      badgeColor: 'bg-indigo-100 text-indigo-800'
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
      id: 'customers',
      title: 'Buyers & Loyalty',
      description: 'Directory & points',
      icon: <Users size={18} />,
      href: '/retailer/retailercustomers',
      badge: null
    }
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3 sm:gap-3.5">
      {actions.map((action) => {
        const isHovered = hoveredAction === action.id;

        return (
          <Link
            key={action.id}
            href={action.href}
            onMouseEnter={() => setHoveredAction(action.id)}
            onMouseLeave={() => setHoveredAction(null)}
            className={`
              group relative p-3 sm:p-3.5 rounded-2xl bg-white border border-gray-200/80
              shadow-2xs hover:shadow-md transition-all duration-300
              ${isHovered ? '-translate-y-0.5 border-primary-300 bg-primary-50/20' : ''}
              flex flex-col justify-between
            `}
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="w-8 h-8 rounded-xl bg-primary-50 text-primary-600 flex items-center justify-center transition-colors group-hover:bg-primary-600 group-hover:text-white">
                  {action.icon}
                </div>
                {action.badge && (
                  <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded-full ${action.badgeColor}`}>
                    {action.badge}
                  </span>
                )}
              </div>
              <h4 className="text-xs sm:text-sm font-bold text-gray-900 group-hover:text-primary-700 transition-colors line-clamp-1">
                {action.title}
              </h4>
              <p className="text-[10px] text-gray-500 mt-0.5 line-clamp-1">
                {action.description}
              </p>
            </div>

            <div className="mt-2.5 pt-2 border-t border-gray-100 flex items-center justify-between text-[11px] font-bold text-primary-600 group-hover:text-primary-700">
              <span>Open</span>
              <ArrowRight size={12} className="transition-transform group-hover:translate-x-1" />
            </div>
          </Link>
        );
      })}
    </div>
  );
}
