"use client";

import React from 'react';
import { MapPin, Truck, Clock, Calendar, Phone, CheckCircle } from '@/utils/icons';

export default function ShippingCard({ order }) {
  const isExpress = order?.delivery_type === 'express';
  const shippingAddress = order?.shipping_address || {};

  return (
    <div className="confirmation-card">
      <div className="card-header flex items-center gap-2.5">
        <div className="w-7 h-7 rounded-lg bg-primary-600 text-white flex items-center justify-center text-xs font-bold shadow-2xs">
          <Truck size={15} />
        </div>
        <div>
          <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wide">
            Delivery & Logistics Information
          </h2>
          <p className="text-[11px] text-gray-500">
            Dispatch coordinates and estimated delivery timeline
          </p>
        </div>
      </div>

      <div className="p-4 sm:p-6 grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
        
        {/* Shipping Destination */}
        <div className="p-4 bg-gray-50/80 rounded-2xl border border-gray-100 space-y-2">
          <div className="flex items-center gap-2 text-xs font-bold text-primary-700 uppercase tracking-wider mb-1">
            <MapPin size={14} className="text-primary-600" />
            <span>Delivery Destination</span>
          </div>

          <h4 className="text-sm font-bold text-gray-900">
            {shippingAddress.full_name || 'Designated Recipient'}
          </h4>

          <p className="text-xs text-gray-600 leading-relaxed">
            {shippingAddress.address}
          </p>
          <p className="text-xs text-gray-500 font-medium">
            {shippingAddress.city}, {shippingAddress.state} - <strong className="text-gray-700">{shippingAddress.pincode}</strong>
          </p>

          {shippingAddress.phone && (
            <div className="pt-1 flex items-center gap-1.5 text-xs text-gray-500">
              <Phone size={12} className="text-primary-600" />
              <span className="font-semibold text-primary-800">+91 {shippingAddress.phone}</span>
            </div>
          )}
        </div>

        {/* Delivery Logistics */}
        <div className="p-4 bg-gray-50/80 rounded-2xl border border-gray-100 space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold text-primary-700 uppercase tracking-wider mb-1">
            <Truck size={14} className="text-primary-600" />
            <span>Transport Logistics</span>
          </div>

          <div>
            <span className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider block">
              Dispatch Mode
            </span>
            <span className="text-sm font-bold text-gray-900 flex items-center gap-1.5 mt-0.5">
              {isExpress ? 'Priority Express Dispatch' : 'Standard Direct Mill Freight'}
              <CheckCircle size={13} className="text-emerald-600" />
            </span>
          </div>

          <div>
            <span className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider block">
              Estimated Delivery Window
            </span>
            <div className="flex items-center gap-1.5 text-xs font-bold text-primary-800 mt-0.5">
              <Calendar size={13} className="text-primary-600" />
              <span>
                {order?.expected_delivery_date 
                  ? new Date(order.expected_delivery_date).toLocaleDateString('en-IN', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric'
                    })
                  : (isExpress ? '2-3 Business Days' : '5-7 Business Days')}
              </span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
