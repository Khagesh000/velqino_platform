"use client";

import React, { useState } from 'react';
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
  FileText,
  Clock,
  Edit,
  Trash2,
  MoreVertical,
  Star,
  CheckCircle,
  Package,
  DollarSign,
  TrendingUp
} from '../../../../utils/icons';
import '../../../../styles/Wholesaler/Customers/CustomerDetailsPanel.scss';

export default function CustomerDetailsPanel({ customer, onClose, onSendEmail, onCreateOrder }) {
  const [activeTab, setActiveTab] = useState('profile');
  const [showActions, setShowActions] = useState(false);

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'orders', label: 'Orders', icon: ShoppingBag },
    { id: 'payments', label: 'Payments', icon: CreditCard },
    { id: 'addresses', label: 'Addresses', icon: MapPin },
    { id: 'activity', label: 'Activity', icon: Clock }
  ];

  const getStatusIcon = (status) => {
    switch(status) {
      case 'delivered': return <CheckCircle size={14} className="text-success-500" />;
      case 'shipped': return <Package size={14} className="text-info-500" />;
      case 'processing': return <Clock size={14} className="text-warning-500" />;
      default: return <Clock size={14} className="text-gray-400" />;
    }
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value || 0);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  if (!customer) return null;

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
              {customer.name}
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
            <Mail size={14} /> Send Email
          </button>
          <button className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2">
            <ShoppingBag size={14} /> Create Order
          </button>
          <button className="w-full px-4 py-2 text-left text-sm text-error-600 hover:bg-error-50 flex items-center gap-2">
            <Trash2 size={14} /> Delete Customer
          </button>
        </div>
      )}

      {/* Profile Info */}
      <div className="profile-header px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-200">
        <div className="flex items-start gap-3 sm:gap-4">
          <div className="w-10 h-10 sm:w-16 sm:h-16 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-semibold text-sm sm:text-xl">
            {customer.name?.substring(0, 2).toUpperCase() || 'RE'}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1 sm:gap-2 mb-0.5 sm:mb-1">
              <h3 className="text-sm sm:text-lg font-semibold text-gray-900 truncate">
                {customer.name}
              </h3>
              <span className={`px-1.5 sm:px-2 py-0.5 text-xxs sm:text-xs rounded-full whitespace-nowrap ${
                customer.status === 'active' ? 'bg-success-100 text-success-700' : 'bg-gray-100 text-gray-700'
              }`}>
                {customer.status === 'active' ? 'Active' : 'Inactive'}
              </span>
            </div>
            <p className="text-xs text-gray-600 mb-1 hidden sm:block">{customer.business_name}</p>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-1 sm:gap-2 mt-2 sm:mt-4">
          <div className="bg-gray-50 rounded-lg p-1 sm:p-2 text-center">
            <p className="text-xxs sm:text-xs text-gray-500">Orders</p>
            <p className="text-xs sm:text-base font-semibold text-gray-900">{customer.orders || 0}</p>
          </div>
          <div className="bg-gray-50 rounded-lg p-1 sm:p-2 text-center">
            <p className="text-xxs sm:text-xs text-gray-500">Spent</p>
            <p className="text-xs sm:text-base font-semibold text-gray-900">{formatCurrency(customer.total_spent)}</p>
          </div>
          <div className="bg-gray-50 rounded-lg p-1 sm:p-2 text-center">
            <p className="text-xxs sm:text-xs text-gray-500">AOV</p>
            <p className="text-xs sm:text-base font-semibold text-gray-900">
              {formatCurrency(customer.total_spent / (customer.orders || 1))}
            </p>
          </div>
        </div>

        {/* Contact Info */}
        <div className="mt-1 sm:mt-3 space-y-0.5 sm:space-y-1">
          <div className="flex items-center gap-1 sm:gap-2 text-[10px] sm:text-sm">
            <Mail size={8} className="sm:hidden text-gray-400" />
            <Mail size={14} className="hidden sm:block text-gray-400" />
            <span className="text-gray-500 truncate">{customer.email}</span>
          </div>
          <div className="flex items-center gap-1 sm:gap-2 text-[10px] sm:text-sm">
            <Phone size={8} className="sm:hidden text-gray-400" />
            <Phone size={14} className="hidden sm:block text-gray-400" />
            <span className="text-gray-500 truncate">{customer.phone}</span>
          </div>
          <div className="flex items-center gap-1 sm:gap-2 text-[10px] sm:text-sm">
            <MapPin size={8} className="sm:hidden text-gray-400" />
            <MapPin size={14} className="hidden sm:block text-gray-400" />
            <span className="text-gray-500 truncate">{customer.city}, {customer.state}</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="panel-tabs px-4 sm:px-6 border-b border-gray-200 overflow-x-auto">
        <div className="flex gap-1 min-w-max">
          {tabs.map(tab => {
            const Icon = tab.icon;
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
            );
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
                  <span className="text-sm font-medium text-gray-900">{customer.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Customer Type</span>
                  <span className="text-sm px-2 py-0.5 bg-primary-100 text-primary-700 rounded-full">Retailer</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Member Since</span>
                  <span className="text-sm text-gray-900">{formatDate(customer.joined_at)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Last Order</span>
                  <span className="text-sm text-gray-900">{formatDate(customer.last_order)}</span>
                </div>
              </div>
            </div>

            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-3">Statistics</h4>
              <div className="grid grid-cols-2 gap-2 sm:gap-3">
                <div className="bg-gray-50 rounded-xl p-2 sm:p-3">
                  <ShoppingBag size={18} className="text-primary-500 mb-1" />
                  <p className="text-xl sm:text-2xl font-bold text-gray-900">{customer.orders || 0}</p>
                  <p className="text-xs text-gray-500">Total Orders</p>
                </div>
                <div className="bg-gray-50 rounded-xl p-2 sm:p-3">
                  <DollarSign size={18} className="text-success-500 mb-1" />
                  <p className="text-xl sm:text-2xl font-bold text-gray-900">{formatCurrency(customer.total_spent)}</p>
                  <p className="text-xs text-gray-500">Total Spent</p>
                </div>
                <div className="bg-gray-50 rounded-xl p-2 sm:p-3">
                  <TrendingUp size={18} className="text-info-500 mb-1" />
                  <p className="text-xl sm:text-2xl font-bold text-gray-900">
                    {formatCurrency(customer.total_spent / (customer.orders || 1))}
                  </p>
                  <p className="text-xs text-gray-500">Avg Order</p>
                </div>
                <div className="bg-gray-50 rounded-xl p-2 sm:p-3">
                  <Star size={18} className="text-warning-500 mb-1" />
                  <p className="text-xl sm:text-2xl font-bold text-gray-900">4.8</p>
                  <p className="text-xs text-gray-500">Rating</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Orders Tab */}
        {activeTab === 'orders' && (
          <div className="space-y-3">
            <p className="text-sm text-gray-500 text-center py-8">Order history will appear here</p>
          </div>
        )}

        {/* Payments Tab */}
        {activeTab === 'payments' && (
          <div className="space-y-3">
            <p className="text-sm text-gray-500 text-center py-8">Payment methods will appear here</p>
          </div>
        )}

        {/* Addresses Tab */}
        {activeTab === 'addresses' && (
          <div className="space-y-3">
            <div className="address-item bg-gray-50 rounded-xl p-3">
              <div className="flex items-start justify-between mb-2">
                <span className="text-xs font-medium px-2 py-0.5 bg-primary-100 text-primary-700 rounded-full">
                  Default Address
                </span>
              </div>
              <p className="text-sm text-gray-900">{customer.business_name}</p>
              <p className="text-sm text-gray-600">{customer.city}, {customer.state}</p>
              <p className="text-sm text-gray-600">Phone: {customer.phone}</p>
            </div>
          </div>
        )}

        {/* Activity Tab */}
        {activeTab === 'activity' && (
          <div className="space-y-3">
            <p className="text-sm text-gray-500 text-center py-8">Recent activity will appear here</p>
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
  );
}