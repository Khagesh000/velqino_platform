"use client";

import React from 'react';
import { BASE_IMAGE_URL } from '@/utils/apiConfig';

export default function OrderDetailsTable({ items }) {
  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="p-5 border-b border-gray-100">
        <h2 className="font-semibold text-gray-900">Order Items</h2>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="text-left p-4 text-sm font-medium text-gray-600">Product</th>
              <th className="text-center p-4 text-sm font-medium text-gray-600">Quantity</th>
              <th className="text-right p-4 text-sm font-medium text-gray-600">Price</th>
              <th className="text-right p-4 text-sm font-medium text-gray-600">Total</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {items?.map((item) => (
              <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <img 
                    src={item.product_image ? `${BASE_IMAGE_URL}${item.product_image}` : '/images/placeholder.jpg'}
                    alt={item.product_name || 'Product'}
                    className="w-12 h-12 rounded-lg object-cover bg-gray-100 flex-shrink-0"
                    onError={(e) => { 
                      e.target.onerror = null;
                      e.target.src = '/images/placeholder.jpg'; 
                    }}
                  />
                    <div>
                      <p className="font-medium text-gray-800 text-sm">{item.product_name}</p>
                      <p className="text-xs text-gray-400">SKU: {item.product_sku}</p>
                    </div>
                  </div>
                </td>
                <td className="p-4 text-center text-gray-700">{item.quantity}</td>
                <td className="p-4 text-right text-gray-700">₹{item.price}</td>
                <td className="p-4 text-right font-semibold text-gray-900">₹{item.total}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}