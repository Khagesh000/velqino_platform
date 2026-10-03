"use client";

import React from 'react';
import Link from 'next/link';
import { 
  Package, 
  TrendingUp, 
  ArrowRight, 
  ShoppingCart,
  Sparkles 
} from '../../../../utils/icons';

export default function TopSellingProducts({ data = [], isLoading }) {
  const products = Array.isArray(data) ? data : [];

  if (isLoading) {
    return (
      <div className="bg-white rounded-2xl border border-gray-200/80 p-5 sm:p-6 shadow-2xs">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-gray-200 rounded w-1/3" />
          <div className="h-44 bg-gray-100 rounded-xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-200/80 p-5 sm:p-6 shadow-2xs flex flex-col justify-between h-full">
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-primary-50 text-primary-600">
              <TrendingUp size={18} />
            </span>
            <div>
              <h3 className="text-base font-bold text-gray-900">Top Selling Products</h3>
              <p className="text-xs text-gray-500">Highest volume SKUs by sales count</p>
            </div>
          </div>
        </div>

        {products.length === 0 ? (
          <div className="text-center py-10 px-4 bg-gray-50/70 rounded-xl border border-dashed border-gray-200">
            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mx-auto mb-2.5 text-primary-500 shadow-2xs">
              <Sparkles size={20} />
            </div>
            <p className="text-sm font-bold text-gray-800">No Sales Recorded Yet</p>
            <p className="text-xs text-gray-500 mt-1 max-w-xs mx-auto">
              As orders and counter checkouts are processed in your POS terminal, top-performing items will rank here automatically.
            </p>
            <Link
              href="/retailer/possales"
              className="inline-flex items-center gap-1.5 mt-3 px-3.5 py-1.5 rounded-xl bg-primary-600 text-white text-xs font-bold hover:bg-primary-700 transition-colors shadow-2xs"
            >
              <ShoppingCart size={13} />
              <span>Open POS Register</span>
            </Link>
          </div>
        ) : (
          <div className="space-y-2.5 max-h-[360px] overflow-y-auto pr-1">
            {products.map((product, index) => (
              <div
                key={product.id || index}
                className="p-3 rounded-xl border border-gray-100 bg-white hover:bg-gray-50/70 transition-all flex items-center gap-3"
              >
                {/* Rank Badge */}
                <div className="w-6 text-center font-black text-sm">
                  <span className={index === 0 ? 'text-amber-500' : index === 1 ? 'text-gray-400' : index === 2 ? 'text-amber-700' : 'text-gray-300'}>
                    #{index + 1}
                  </span>
                </div>

                {/* Thumbnail */}
                <div className="w-11 h-11 rounded-lg bg-gray-100 overflow-hidden flex-shrink-0 flex items-center justify-center">
                  {product.image_url ? (
                    <img 
                      src={product.image_url} 
                      alt={product.name} 
                      className="w-full h-full object-cover" 
                      onError={(e) => { e.target.src = '/images/products/placeholder.jpg'; }}
                    />
                  ) : (
                    <Package size={18} className="text-gray-400" />
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <h4 className="text-xs sm:text-sm font-bold text-gray-900 truncate">{product.name}</h4>
                  <p className="text-[11px] text-gray-400 font-mono mt-0.5">SKU: {product.sku}</p>
                </div>

                {/* Sales & Revenue */}
                <div className="text-right flex-shrink-0">
                  <p className="text-xs font-extrabold text-gray-900">
                    {product.sales} sold
                  </p>
                  <p className="text-[11px] text-emerald-600 font-semibold mt-0.5">
                    ₹{Number(product.revenue || 0).toLocaleString('en-IN')}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-xs">
        <span className="text-gray-400">Inventory Catalog</span>
        <Link 
          href="/retailer/retailerproducts" 
          className="font-bold text-primary-600 hover:text-primary-700 flex items-center gap-1 group"
        >
          <span>All Products</span>
          <ArrowRight size={13} className="transition-transform group-hover:translate-x-1" />
        </Link>
      </div>
    </div>
  );
}
