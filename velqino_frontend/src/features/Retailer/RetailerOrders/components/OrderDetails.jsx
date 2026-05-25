"use client"

import React, { useState, useEffect } from 'react'
import { User, MapPin, CreditCard, Package, Truck, Calendar, Phone, Mail, FileText, Download, Printer } from '../../../../utils/icons'
import '../../../../styles/Retailer/RetailerOrders/OrderDetails.scss'

export default function OrderDetails({ selectedOrder }) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  const formatDate = (date) => {
    if (!date) return 'N/A'
    return new Date(date).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    })
  }

  // If no order selected
  if (!selectedOrder) {
    return (
      <div className="order-details bg-white rounded-xl shadow-sm border border-gray-100 h-full">
        <div className="p-8 text-center">
          <FileText size={48} className="mx-auto text-gray-200 mb-3" />
          <p className="text-sm text-gray-500">Select an order to view details</p>
          <p className="text-xs text-gray-400 mt-1">Click on any order from the table</p>
        </div>
      </div>
    )
  }

  return (
    <div className="order-details bg-white rounded-xl shadow-sm border border-gray-100 h-full">
      {/* Header */}
      <div className="p-4 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileText size={18} className="text-primary-500" />
            <h3 className="text-base font-semibold text-gray-900">Order Details</h3>
          </div>
          <div className="flex gap-1">
            <button className="p-1.5 text-gray-400 hover:text-primary-600 rounded-lg transition-all">
              <Printer size={14} />
            </button>
            <button className="p-1.5 text-gray-400 hover:text-primary-600 rounded-lg transition-all">
              <Download size={14} />
            </button>
          </div>
        </div>
        <p className="text-xs text-gray-500 mt-1">Complete order information</p>
      </div>

      <div className="p-4 space-y-4 overflow-y-auto max-h-[500px]">
        {/* Order Header */}
        <div className="bg-gray-50 rounded-lg p-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-500">Order ID</p>
              <p className="text-sm font-bold text-gray-900">{selectedOrder.order_number}</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-gray-500">Order Date</p>
              <p className="text-sm font-medium text-gray-700">{formatDate(selectedOrder.created_at)}</p>
            </div>
          </div>
        </div>

        {/* Customer Information */}
        <div>
          <h4 className="text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2 flex items-center gap-2">
            <User size={12} />
            Customer Information
          </h4>
          <div className="bg-gray-50 rounded-lg p-3 space-y-2">
            <div className="flex items-center gap-2">
              <User size={12} className="text-gray-400" />
              <span className="text-sm font-medium text-gray-900">{selectedOrder.customer_name || 'N/A'}</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone size={12} className="text-gray-400" />
              <span className="text-sm text-gray-700">{selectedOrder.customer_phone || 'N/A'}</span>
            </div>
            <div className="flex items-center gap-2">
              <Mail size={12} className="text-gray-400" />
              <span className="text-sm text-gray-700">{selectedOrder.customer_email || 'N/A'}</span>
            </div>
          </div>
        </div>

        {/* Items Purchased */}
        <div>
          <h4 className="text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2 flex items-center gap-2">
            <Package size={12} />
            Items Purchased ({selectedOrder.items?.length || 0})
          </h4>
          <div className="space-y-2">
            {selectedOrder.items?.map((item, idx) => (
              <div key={idx} className="bg-gray-50 rounded-lg p-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{item.product_name}</p>
                    <p className="text-xs text-gray-500">SKU: {item.product_sku}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-gray-900">₹{parseFloat(item.total).toLocaleString()}</p>
                    <p className="text-xs text-gray-500">Qty: {item.quantity} × ₹{parseFloat(item.price).toLocaleString()}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Payment Details */}
        <div>
          <h4 className="text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2 flex items-center gap-2">
            <CreditCard size={12} />
            Payment Details
          </h4>
          <div className="bg-gray-50 rounded-lg p-3 space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Method</span>
              <span className="text-sm font-medium text-gray-900 uppercase">{selectedOrder.payment_method || 'N/A'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Status</span>
              <span className={`text-sm font-medium ${selectedOrder.payment_status === 'paid' ? 'text-green-600' : selectedOrder.payment_status === 'pending' ? 'text-yellow-600' : 'text-red-600'}`}>
                {selectedOrder.payment_status || 'Pending'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Order Status</span>
              <span className={`text-sm font-medium ${
                selectedOrder.status === 'delivered' ? 'text-green-600' : 
                selectedOrder.status === 'cancelled' ? 'text-red-600' : 
                selectedOrder.status === 'shipped' ? 'text-purple-600' : 'text-blue-600'
              }`}>
                {selectedOrder.status || 'Pending'}
              </span>
            </div>
          </div>
        </div>

        {/* Delivery Address */}
        <div>
          <h4 className="text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2 flex items-center gap-2">
            <MapPin size={12} />
            Delivery Address
          </h4>
          <div className="bg-gray-50 rounded-lg p-3">
            <p className="text-sm font-medium text-gray-900">{selectedOrder.shipping_full_address?.name || 'N/A'}</p>
            <p className="text-sm text-gray-700 mt-1">{selectedOrder.shipping_full_address?.address || 'N/A'}</p>
            <p className="text-sm text-gray-700">
              {selectedOrder.shipping_full_address?.city || ''}, {selectedOrder.shipping_full_address?.state || ''} - {selectedOrder.shipping_full_address?.pincode || ''}
            </p>
            <p className="text-sm text-gray-700">Phone: {selectedOrder.shipping_full_address?.phone || 'N/A'}</p>
          </div>
        </div>

        {/* Order Summary */}
        <div>
          <h4 className="text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">Order Summary</h4>
          <div className="bg-gray-50 rounded-lg p-3 space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Subtotal</span>
              <span className="text-sm text-gray-900">₹{parseFloat(selectedOrder.grand_total || 0).toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Shipping</span>
              <span className="text-sm text-gray-900">{selectedOrder.delivery_type === 'express' ? '₹99' : 'Free'}</span>
            </div>
            <div className="flex justify-between pt-2 border-t border-gray-200">
              <span className="text-sm font-semibold text-gray-900">Total</span>
              <span className="text-base font-bold text-primary-600">₹{parseFloat(selectedOrder.grand_total || 0).toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Delivery Timeline */}
        {selectedOrder.status !== 'delivered' && selectedOrder.status !== 'cancelled' && (
          <div className="bg-blue-50 rounded-lg p-3">
            <div className="flex items-center gap-2">
              <Truck size={14} className="text-blue-600" />
              <p className="text-xs font-medium text-blue-700">Expected Delivery</p>
            </div>
            <p className="text-sm text-blue-800 mt-1">
              {selectedOrder.expected_delivery_date ? formatDate(selectedOrder.expected_delivery_date) : '3-5 business days'}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}