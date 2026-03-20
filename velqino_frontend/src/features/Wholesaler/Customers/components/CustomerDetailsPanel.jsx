"use client"

import React, { useState } from 'react'
import {
  X,
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Award,
  ShoppingBag,
  CreditCard,
  BookOpen,
  FileText,
  Clock,
  Edit,
  Trash2,
  MoreVertical,
  Star,
  CheckCircle,
  XCircle,
  AlertCircle,
  Package,
  DollarSign,
  TrendingUp,
  MessageCircle,
  Send,
  Download
} from '../../../../utils/icons'
import '../../../../styles/Wholesaler/Customers/CustomerDetailsPanel.scss'

export default function CustomerDetailsPanel({ customer, onClose, onSendEmail, onCreateOrder }) {
  const [activeTab, setActiveTab] = useState('profile')
  const [showActions, setShowActions] = useState(false)

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'orders', label: 'Recent Orders', icon: ShoppingBag },
    { id: 'payments', label: 'Payment Methods', icon: CreditCard },
    { id: 'addresses', label: 'Address Book', icon: MapPin },
    { id: 'notes', label: 'Notes', icon: FileText },
    { id: 'activity', label: 'Activity', icon: Clock }
  ]

  const recentOrders = [
    { id: '#ORD-2024-001', date: '2024-03-15', total: 125000, status: 'Delivered', items: 5 },
    { id: '#ORD-2024-002', date: '2024-03-10', total: 45000, status: 'Shipped', items: 2 },
    { id: '#ORD-2024-003', date: '2024-03-05', total: 78000, status: 'Processing', items: 3 },
    { id: '#ORD-2024-004', date: '2024-02-28', total: 32000, status: 'Delivered', items: 1 }
  ]

  const paymentMethods = [
    { type: 'Credit Card', last4: '4242', expiry: '05/25', brand: 'Visa', default: true },
    { type: 'UPI', id: 'rajesh@okhdfcbank', default: false },
    { type: 'Bank Transfer', account: 'XXXX1234', bank: 'HDFC', default: false }
  ]

  const addresses = [
    { 
      type: 'Shipping', 
      line1: '123, MG Road', 
      city: 'Bangalore', 
      state: 'Karnataka', 
      pincode: '560001',
      default: true 
    },
    { 
      type: 'Billing', 
      line1: '456, Brigade Road', 
      city: 'Bangalore', 
      state: 'Karnataka', 
      pincode: '560001',
      default: false 
    }
  ]

  const notes = [
    { id: 1, author: 'Priya (Support)', content: 'Customer requested bulk discount for next order', date: '2024-03-14 10:30 AM' },
    { id: 2, author: 'Rahul (Sales)', content: 'Interested in new electronics collection', date: '2024-03-12 03:45 PM' },
    { id: 3, author: 'System', content: 'Customer reached Gold tier', date: '2024-03-01 09:15 AM' }
  ]

  const activities = [
    { action: 'Placed order', details: '#ORD-2024-001', date: '2024-03-15 02:30 PM' },
    { action: 'Logged in', details: 'From Mumbai, India', date: '2024-03-15 10:15 AM' },
    { action: 'Updated profile', details: 'Changed phone number', date: '2024-03-14 04:20 PM' },
    { action: 'Viewed product', details: 'Wireless Headphones', date: '2024-03-14 11:05 AM' },
    { action: 'Added to cart', details: '3 items', date: '2024-03-13 08:45 PM' }
  ]

  const getStatusIcon = (status) => {
    switch(status) {
      case 'Delivered': return <CheckCircle size={14} className="text-success-500" />
      case 'Shipped': return <Package size={14} className="text-info-500" />
      case 'Processing': return <Clock size={14} className="text-warning-500" />
      default: return <AlertCircle size={14} className="text-gray-400" />
    }
  }

  return (
    <div className="customer-details-panel bg-white h-full flex flex-col">
      {/* Header */}
      <div className="profile-header px-4 sm:px-6 py-2 sm:py-4 border-b border-gray-200 flex items-center justify-between">
  <div className="flex items-center gap-2 sm:gap-3">
    <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-primary-100 flex items-center justify-center text-primary-600">
      <User size={16} className="sm:w-5 sm:h-5" />
    </div>
    <div>
      <h2 className="text-sm sm:text-lg font-semibold text-gray-900">Customer Details</h2>
      <p className="text-xs sm:text-sm text-gray-500 truncate max-w-[150px] sm:max-w-none">
        {customer?.name || 'Select a customer'}
      </p>
    </div>
  </div>
  <div className="flex items-center gap-1 sm:gap-2">
    <button 
      className="p-1.5 sm:p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all"
      onClick={() => setShowActions(!showActions)}
    >
      <MoreVertical size={16} className="sm:w-[18px] sm:h-[18px]" />
    </button>
    <button 
      className="p-1.5 sm:p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all"
      onClick={onClose}
    >
      <X size={16} className="sm:w-[18px] sm:h-[18px]" />
    </button>
  </div>
</div>

      {/* Actions Dropdown */}
      {showActions && (
        <div className="absolute top-16 right-8 w-48 bg-white rounded-xl border border-gray-200 shadow-lg overflow-hidden z-30">
          <button className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2">
            <Edit size={14} /> Edit Customer
          </button>
          <button className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2">
            <Send size={14} /> Send Email
          </button>
          <button className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2">
            <ShoppingBag size={14} /> Create Order
          </button>
          <button className="w-full px-4 py-2 text-left text-sm text-error-600 hover:bg-error-50 flex items-center gap-2">
            <Trash2 size={14} /> Delete Customer
          </button>
        </div>
      )}

      <div className="profile-header px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-200">
  <div className="flex items-start gap-3 sm:gap-4">
    <div className="w-10 h-10 sm:w-16 sm:h-16 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-semibold text-sm sm:text-xl">
      {customer?.avatar || 'RK'}
    </div>
    <div className="flex-1 min-w-0">
      <div className="flex items-center gap-1 sm:gap-2 mb-0.5 sm:mb-1">
        <h3 className="text-sm sm:text-lg font-semibold text-gray-900 truncate max-w-[120px] sm:max-w-none">
          {customer?.name || 'Rajesh Kumar'}
        </h3>
        <span className="px-1.5 sm:px-2 py-0.5 bg-success-100 text-success-700 text-xxs sm:text-xs rounded-full whitespace-nowrap">
          Active
        </span>
      </div>
      <p className="text-xs text-gray-600 mb-1 hidden sm:block">{customer?.company || 'Kumar Enterprises'}</p>
      <div className="flex items-center gap-2 sm:gap-4 text-xxs sm:text-xs">
        <span className="flex items-center gap-0.5 sm:gap-1 text-gray-500">
          <Award size={10} className="sm:hidden text-warning-500" />
          <Award size={14} className="hidden sm:block text-warning-500" />
          <span className="truncate">Gold</span>
        </span>
        <span className="flex items-center gap-0.5 sm:gap-1 text-gray-500">
          <Calendar size={10} className="sm:hidden" />
          <Calendar size={14} className="hidden sm:block" />
          <span className="truncate">2023</span>
        </span>
      </div>
    </div>
  </div>

  {/* Quick Stats */}
  <div className="grid grid-cols-3 gap-1 sm:gap-2 mt-2 sm:mt-4">
    <div className="bg-gray-50 rounded-lg p-1 sm:p-2 text-center">
      <p className="text-xxs sm:text-xs text-gray-500">Orders</p>
      <p className="text-xs sm:text-base font-semibold text-gray-900">45</p>
    </div>
    <div className="bg-gray-50 rounded-lg p-1 sm:p-2 text-center">
      <p className="text-xxs sm:text-xs text-gray-500">Spent</p>
      <p className="text-xs sm:text-base font-semibold text-gray-900">₹12.5L</p>
    </div>
    <div className="bg-gray-50 rounded-lg p-1 sm:p-2 text-center">
      <p className="text-xxs sm:text-xs text-gray-500">AOV</p>
      <p className="text-xs sm:text-base font-semibold text-gray-900">₹27.8K</p>
    </div>
  </div>

  {/* Contact Info */}
  <div className="mt-1 sm:mt-3 space-y-0.5 sm:space-y-1">
  <div className="flex items-center gap-1 sm:gap-2 text-[10px] sm:text-sm">
    <Mail size={8} className="sm:hidden text-gray-400" />
    <Mail size={14} className="hidden sm:block text-gray-400" />
    <span className="text-gray-500 truncate">rajesh.k@example.com</span>
  </div>
  <div className="flex items-center gap-1 sm:gap-2 text-[10px] sm:text-sm">
    <Phone size={8} className="sm:hidden text-gray-400" />
    <Phone size={14} className="hidden sm:block text-gray-400" />
    <span className="text-gray-500 truncate">+91 98765 43210</span>
  </div>
  <div className="flex items-center gap-1 sm:gap-2 text-[10px] sm:text-sm">
    <MapPin size={8} className="sm:hidden text-gray-400" />
    <MapPin size={14} className="hidden sm:block text-gray-400" />
    <span className="text-gray-500 truncate">Mumbai, Maharashtra</span>
  </div>
</div>
</div>

      {/* Tabs */}
      <div className="panel-tabs px-4 sm:px-6 border-b border-gray-200 overflow-x-auto">
  <div className="flex gap-1 min-w-max">
    {tabs.map(tab => {
      const Icon = tab.icon
      return (
        <button
          key={tab.id}
          className={`panel-tab px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm font-medium flex items-center gap-1 sm:gap-2 border-b-2 transition-all whitespace-nowrap ${
            activeTab === tab.id
              ? 'border-primary-500 text-primary-600'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
          onClick={() => setActiveTab(tab.id)}
        >
          <Icon size={14} className="sm:w-4 sm:h-4" />
          <span className="hidden sm:inline">{tab.label}</span>
          <span className="sm:hidden">{tab.label.substring(0, 3)}</span>
        </button>
      )
    })}
  </div>
</div>

      {/* Content */}
      <div className="panel-content flex-1 overflow-y-auto p-3 sm:p-6">
        {/* Profile Tab */}
        {activeTab === 'profile' && (
          <div className="space-y-4 sm:space-y-6">
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-3">Customer Information</h4>
              <div className="bg-gray-50 rounded-xl p-3 sm:p-4 space-y-1.5 sm:space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Customer ID</span>
                  <span className="text-sm font-medium text-gray-900">CUST-001</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Customer Type</span>
                  <span className="text-sm px-2 py-0.5 bg-primary-100 text-primary-700 rounded-full">Wholesaler</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Loyalty Tier</span>
                  <span className="text-sm font-medium text-warning-600">Gold</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Member Since</span>
                  <span className="text-sm text-gray-900">15 Jan 2023</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Last Active</span>
                  <span className="text-sm text-gray-900">Today 10:30 AM</span>
                </div>
              </div>
            </div>

            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-3">Statistics</h4>
              <div className="grid grid-cols-2 gap-2 sm:gap-3">
                <div className="bg-gray-50 rounded-xl p-3">
                  <ShoppingBag size={18} className="text-primary-500 mb-1" />
                  <p className="text-xl sm:text-2xl font-bold text-gray-900">45</p>
                  <p className="text-xs text-gray-500">Total Orders</p>
                </div>
                <div className="bg-gray-50 rounded-xl p-2 sm:p-3">
                  <DollarSign size={18} className="text-success-500 mb-1" />
                  <p className="text-2xl font-bold text-gray-900">₹12.5L</p>
                  <p className="text-xs text-gray-500">Total Spent</p>
                </div>
                <div className="bg-gray-50 rounded-xl p-3">
                  <TrendingUp size={18} className="text-info-500 mb-1" />
                  <p className="text-2xl font-bold text-gray-900">₹27.8K</p>
                  <p className="text-xs text-gray-500">Avg Order</p>
                </div>
                <div className="bg-gray-50 rounded-xl p-3">
                  <Star size={18} className="text-warning-500 mb-1" />
                  <p className="text-2xl font-bold text-gray-900">4.8</p>
                  <p className="text-xs text-gray-500">Avg Rating</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Recent Orders Tab */}
        {activeTab === 'orders' && (
          <div className="space-y-3">
            {recentOrders.map(order => (
              <div key={order.id} className="order-item bg-gray-50 rounded-xl p-2.5 sm:p-3">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <p className="text-sm font-semibold text-gray-900">{order.id}</p>
                    <p className="text-xs text-gray-500">{order.date}</p>
                  </div>
                  <span className="flex items-center gap-1 text-xs px-2 py-0.5 rounded-full bg-white">
                    {getStatusIcon(order.status)}
                    <span>{order.status}</span>
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">{order.items} items</span>
                  <span className="font-semibold text-gray-900">₹{order.total.toLocaleString()}</span>
                </div>
              </div>
            ))}
            <button className="w-full mt-2 text-sm text-primary-600 hover:text-primary-700">
              View All Orders
            </button>
          </div>
        )}

        {/* Payment Methods Tab */}
        {activeTab === 'payments' && (
          <div className="space-y-3">
            {paymentMethods.map((method, index) => (
              <div key={index} className="payment-item bg-gray-50 rounded-xl p-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <CreditCard size={18} className="text-gray-500" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {method.type} {method.default && '(Default)'}
                      </p>
                      <p className="text-xs text-gray-500">
                        {method.last4 ? `•••• ${method.last4}` : method.id || method.account}
                      </p>
                    </div>
                  </div>
                  {method.default && (
                    <span className="px-2 py-0.5 bg-success-100 text-success-700 text-xs rounded-full">
                      Default
                    </span>
                  )}
                </div>
              </div>
            ))}
            <button className="w-full mt-2 text-sm text-primary-600 hover:text-primary-700">
              Add Payment Method
            </button>
          </div>
        )}

        {/* Address Book Tab */}
        {activeTab === 'addresses' && (
          <div className="space-y-3">
            {addresses.map((address, index) => (
              <div key={index} className="address-item bg-gray-50 rounded-xl p-3">
                <div className="flex items-start justify-between mb-2">
                  <span className="text-xs font-medium px-2 py-0.5 bg-primary-100 text-primary-700 rounded-full">
                    {address.type}
                  </span>
                  {address.default && (
                    <span className="text-xs text-success-600">Default</span>
                  )}
                </div>
                <p className="text-sm text-gray-900">{address.line1}</p>
                <p className="text-sm text-gray-600">
                  {address.city}, {address.state} - {address.pincode}
                </p>
              </div>
            ))}
            <button className="w-full mt-2 text-sm text-primary-600 hover:text-primary-700">
              Add New Address
            </button>
          </div>
        )}

        {/* Notes Tab */}
        {activeTab === 'notes' && (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <input
                type="text"
                placeholder="Add a note..."
                className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-primary-500"
              />
              <button className="px-3 py-2 bg-primary-500 text-white text-sm rounded-lg hover:bg-primary-600">
                Add
              </button>
            </div>
            <div className="space-y-3">
              {notes.map(note => (
                <div key={note.id} className="note-item bg-gray-50 rounded-xl p-3">
                  <div className="flex items-start justify-between mb-1">
                    <span className="text-sm font-medium text-gray-900">{note.author}</span>
                    <span className="text-xs text-gray-400">{note.date}</span>
                  </div>
                  <p className="text-sm text-gray-600">{note.content}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Activity Timeline Tab */}
        {activeTab === 'activity' && (
          <div className="timeline relative">
            {activities.map((activity, index) => (
              <div key={index} className="timeline-item mb-4 relative pl-6">
                <div className="timeline-dot absolute left-0 w-2 h-2 rounded-full bg-primary-400" />
                {index < activities.length - 1 && (
                  <div className="timeline-line absolute left-[3px] top-2 w-0.5 h-10 bg-gray-200" />
                )}
                <div className="timeline-content">
                  <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                  <p className="text-xs text-gray-500">{activity.details}</p>
                  <p className="text-xs text-gray-400 mt-1">{activity.date}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer Actions */}
      <div className="panel-footer px-4 sm:px-6 py-2 sm:py-4 border-t border-gray-200 flex flex-row sm:flex-row gap-1 sm:gap-2">
  <button 
    className="flex-1 px-2 sm:px-3 py-1.5 sm:py-2 bg-primary-500 text-white text-xs sm:text-sm font-medium rounded-lg hover:bg-primary-600 transition-all flex items-center justify-center gap-1 sm:gap-2"
    onClick={onCreateOrder}
  >
    <ShoppingBag size={14} className="sm:w-4 sm:h-4" />
    <span className="sm:hidden">Order</span>
    <span className="hidden sm:inline">Create Order</span>
  </button>
  <button 
    className="flex-1 px-2 sm:px-3 py-1.5 sm:py-2 bg-white border border-gray-200 text-gray-700 text-xs sm:text-sm font-medium rounded-lg hover:bg-gray-50 transition-all flex items-center justify-center gap-1 sm:gap-2"
    onClick={onSendEmail}
  >
    <Mail size={14} className="sm:w-4 sm:h-4" />
    <span className="sm:hidden">Email</span>
    <span className="hidden sm:inline">Send Email</span>
  </button>
</div>
    </div>
  )
}