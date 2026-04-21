"use client";

import React from 'react';
import { MapPin, Truck, Clock, Calendar } from '../../../../../utils/icons';

export default function ShippingCard({ order }) {
  return (
    <div className="space-y-4">
      {/* Shipping Address */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
        <div className="flex items-center gap-3 mb-4">
          <MapPin size={18} className="text-primary-500" />
          <h2 className="font-semibold text-gray-900">Shipping Address</h2>
        </div>
        <div className="space-y-2 text-sm">
          <p className="font-medium text-gray-800">{order.shipping_address?.full_name}</p>
          <p className="text-gray-600">📞 {order.shipping_address?.phone}</p>
          <p className="text-gray-600">{order.shipping_address?.address}</p>
          <p className="text-gray-600">{order.shipping_address?.city}, {order.shipping_address?.state} - {order.shipping_address?.pincode}</p>
        </div>
      </div>

      {/* Delivery Information */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
        <div className="flex items-center gap-3 mb-4">
          <Truck size={18} className="text-primary-500" />
          <h2 className="font-semibold text-gray-900">Delivery Information</h2>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-start gap-2">
            <Clock size={14} className="text-gray-400 mt-0.5" />
            <div>
              <p className="text-xs text-gray-500">Delivery Type</p>
              <p className="text-sm font-medium text-gray-800 capitalize">{order.delivery_type}</p>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <Calendar size={14} className="text-gray-400 mt-0.5" />
            <div>
              <p className="text-xs text-gray-500">Expected Delivery</p>
              <p className="text-sm font-medium text-gray-800">
                {order.expected_delivery_date ? new Date(order.expected_delivery_date).toLocaleDateString('en-IN') : '5-7 business days'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}