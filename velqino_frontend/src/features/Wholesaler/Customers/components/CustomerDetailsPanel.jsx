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
  CheckCircle,
  Package,
  DollarSign,
  TrendingUp,
  Ban,
  Building,
  Check
} from '@/utils/icons';
import '../../../../styles/Wholesaler/Customers/CustomerDetailsPanel.scss';

export default function CustomerDetailsPanel({ customer, onClose, onSendEmail, onCreateOrder }) {
  const [activeTab, setActiveTab] = useState('profile');
  const [copiedField, setCopiedField] = useState(null);

  if (!customer) return null;

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'orders', label: 'Orders', icon: ShoppingBag },
    { id: 'payments', label: 'Payments', icon: CreditCard },
    { id: 'addresses', label: 'Addresses', icon: MapPin },
    { id: 'activity', label: 'Activity', icon: Clock }
  ];

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value || 0);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'No order placed yet';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return 'Recently';
    return date.toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const handleCopy = (text, fieldName) => {
    if (!text || text === 'N/A') return;
    navigator.clipboard?.writeText(text);
    setCopiedField(fieldName);
    setTimeout(() => setCopiedField(null), 1500);
  };

  const initials = (customer.name || customer.business_name || 'RT')
    .split(' ')
    .map(n => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  const spent = Number(customer.total_spent) || 0;
  const orderCount = Number(customer.orders) || 0;

  return (
    <div className="customer-details-panel bg-white h-full flex flex-col shadow-2xl border-l border-slate-200 overflow-hidden">
      {/* Header Bar - Sticky Top & High Contrast Close Button */}
      <div className="px-4 sm:px-5 py-3 border-b border-slate-200/80 flex items-center justify-between bg-white sticky top-0 z-30 shadow-2xs">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center text-white shadow-2xs font-extrabold text-xs sm:text-sm flex-shrink-0">
            {initials}
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="text-sm sm:text-base font-extrabold text-slate-900 truncate">
              {customer.name}
            </h3>
            <p className="text-xs text-slate-500 truncate">
              {customer.business_name || 'Verified Retailer'}
            </p>
          </div>
        </div>

        {/* Prominent Header Close Button */}
        <button 
          onClick={onClose}
          type="button"
          aria-label="Close details"
          className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-slate-900 rounded-xl text-xs font-bold transition-all border border-slate-200/80 shadow-2xs flex-shrink-0 ml-2 cursor-pointer active:scale-95"
        >
          <X size={15} className="text-slate-600" />
          <span>Close</span>
        </button>
      </div>

      {/* Profile Overview Card - Reduced Height & Compact Stats */}
      <div className="p-3 sm:p-4 border-b border-slate-200/80 bg-gradient-to-br from-primary-50/30 via-white to-white">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 flex-wrap">
            <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 text-[11px] font-bold rounded-full ${
              customer.status === 'active' 
                ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' 
                : 'bg-slate-100 text-slate-700 border border-slate-200'
            }`}>
              <CheckCircle size={11} className={customer.status === 'active' ? 'text-emerald-600' : 'text-slate-400'} />
              {customer.status === 'active' ? 'Active Retailer' : 'Inactive / Blocked'}
            </span>
            <span className="text-[11px] text-slate-500 flex items-center gap-1">
              <Calendar size={12} className="text-slate-400" />
              <span>Partner since {formatDate(customer.joined_at)}</span>
            </span>
          </div>

          <div className="flex items-center gap-1.5 flex-shrink-0">
            <button
              onClick={() => onSendEmail?.(customer)}
              className="p-1.5 bg-primary-50 hover:bg-primary-100 text-primary-700 rounded-lg border border-primary-200 text-xs font-bold transition-all shadow-2xs cursor-pointer"
              title="Email Customer"
            >
              <Mail size={14} />
            </button>
            {customer.phone && customer.phone !== 'N/A' && (
              <a
                href={`tel:${customer.phone}`}
                className="p-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-lg border border-emerald-200 text-xs font-bold transition-all shadow-2xs"
                title="Call Customer"
              >
                <Phone size={14} />
              </a>
            )}
          </div>
        </div>

        {/* 3 Compact Stat Chips */}
        <div className="grid grid-cols-3 gap-2 mt-2.5">
          <div className="bg-white rounded-xl border border-slate-200/80 py-2 px-2 text-center shadow-2xs">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total Spent</p>
            <p className="text-xs sm:text-sm font-black text-slate-900 mt-0.5 truncate">{formatCurrency(spent)}</p>
          </div>
          <div className="bg-white rounded-xl border border-slate-200/80 py-2 px-2 text-center shadow-2xs">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Orders</p>
            <p className="text-xs sm:text-sm font-black text-slate-900 mt-0.5 truncate">{orderCount}</p>
          </div>
          <div className="bg-white rounded-xl border border-slate-200/80 py-2 px-2 text-center shadow-2xs">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Avg Order</p>
            <p className="text-xs sm:text-sm font-black text-slate-900 mt-0.5 truncate">
              {formatCurrency(orderCount > 0 ? Math.round(spent / orderCount) : 0)}
            </p>
          </div>
        </div>
      </div>

      {/* Tabs Navigation - Sleek Compact Bar */}
      <div className="flex border-b border-slate-200/80 px-3 sm:px-4 bg-slate-50/70 overflow-x-auto scrollbar-none py-1.5 gap-1 flex-shrink-0">
        {tabs.map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`
                flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg transition-all whitespace-nowrap cursor-pointer
                ${isActive
                  ? 'bg-primary-600 text-white shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'}
              `}
            >
              <Icon size={13} className={isActive ? 'text-white' : 'text-slate-400'} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab Body */}
      <div className="flex-1 overflow-y-auto p-3.5 sm:p-4 space-y-3">
        {activeTab === 'profile' && (
          <div className="space-y-3">
            <div className="bg-white rounded-xl border border-slate-200/80 p-3 sm:p-3.5 space-y-2">
              <h4 className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Contact Credentials</h4>
              
              <div className="space-y-1.5 text-xs">
                <div 
                  onClick={() => handleCopy(customer.email, 'email')}
                  className="flex items-center justify-between p-2 rounded-lg hover:bg-slate-50 cursor-pointer border border-transparent hover:border-slate-200/60 transition-colors"
                >
                  <div className="flex items-center gap-2 text-slate-600">
                    <Mail size={14} className="text-slate-400 flex-shrink-0" />
                    <span>Email</span>
                  </div>
                  <span className="font-bold text-slate-900 truncate max-w-[200px]">
                    {copiedField === 'email' ? 'Copied!' : (customer.email || 'N/A')}
                  </span>
                </div>

                <div 
                  onClick={() => handleCopy(customer.phone, 'phone')}
                  className="flex items-center justify-between p-2 rounded-lg hover:bg-slate-50 cursor-pointer border border-transparent hover:border-slate-200/60 transition-colors"
                >
                  <div className="flex items-center gap-2 text-slate-600">
                    <Phone size={14} className="text-slate-400 flex-shrink-0" />
                    <span>Contact</span>
                  </div>
                  <span className="font-bold text-slate-900 truncate max-w-[200px]">
                    {copiedField === 'phone' ? 'Copied!' : (customer.phone || 'N/A')}
                  </span>
                </div>

                <div className="flex items-center justify-between p-2 rounded-lg">
                  <div className="flex items-center gap-2 text-slate-600">
                    <Building size={14} className="text-slate-400 flex-shrink-0" />
                    <span>Firm</span>
                  </div>
                  <span className="font-bold text-slate-900 truncate max-w-[200px]">{customer.business_name || 'Retailer'}</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-slate-200/80 p-3 sm:p-3.5 space-y-1.5">
              <h4 className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Fulfillment Summary</h4>
              <div className="flex items-center justify-between text-xs py-1 border-b border-slate-100 last:border-0">
                <span className="text-slate-500">Last Active Order</span>
                <span className="font-bold text-slate-800">{formatDate(customer.last_order)}</span>
              </div>
              <div className="flex items-center justify-between text-xs py-1">
                <span className="text-slate-500">Shipping Territory</span>
                <span className="font-bold text-slate-800">{customer.city || 'Regional'}{customer.state ? `, ${customer.state}` : ''}</span>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'orders' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700">Order History ({orderCount})</span>
              <button 
                onClick={() => onCreateOrder?.(customer)}
                className="text-xs font-bold text-primary-600 hover:text-primary-700 cursor-pointer"
              >
                + New Order
              </button>
            </div>

            {orderCount === 0 ? (
              <div className="p-6 text-center bg-slate-50 rounded-xl border border-dashed border-slate-200">
                <ShoppingBag size={22} className="mx-auto text-slate-400 mb-2" />
                <p className="text-xs font-bold text-slate-700">No Purchase Orders Yet</p>
                <p className="text-[11px] text-slate-400 mt-0.5">Orders placed by this retailer will appear here.</p>
              </div>
            ) : (
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-slate-900">{orderCount} Total Orders Completed</p>
                  <p className="text-[11px] text-slate-500">Latest activity on {formatDate(customer.last_order)}</p>
                </div>
                <span className="text-sm font-extrabold text-slate-900">{formatCurrency(spent)}</span>
              </div>
            )}
          </div>
        )}

        {activeTab === 'payments' && (
          <div className="space-y-3">
            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-500">Settled Revenue</span>
                <span className="text-sm font-extrabold text-slate-900">{formatCurrency(spent)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-500">Payment Standing</span>
                <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-bold bg-emerald-100 text-emerald-800">
                  Good Standing
                </span>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'addresses' && (
          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
            <div className="flex items-start gap-2.5">
              <MapPin size={16} className="text-primary-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-bold text-slate-900">Primary Delivery Address</p>
                <p className="text-xs text-slate-600 mt-1">
                  {customer.city || 'Regional Center'}{customer.state ? `, ${customer.state}` : ''}
                </p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'activity' && (
          <div className="space-y-3">
            <div className="flex items-start gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs">
              <Clock size={15} className="text-slate-400 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-bold text-slate-800">Account Registered</p>
                <p className="text-slate-500 text-[11px]">{formatDate(customer.joined_at)}</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Drawer Action Footer - Sticky Bottom */}
      <div className="p-3 sm:p-4 border-t border-slate-200/80 bg-white sticky bottom-0 z-30 flex items-center justify-between gap-3 shadow-sm flex-shrink-0">
        <div className="text-xs text-slate-500">
          ID: <span className="font-mono font-bold text-slate-700">#{String(customer.id || '').slice(-6)}</span>
        </div>
        <button
          onClick={onClose}
          type="button"
          className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition-all shadow-2xs flex items-center gap-1.5 cursor-pointer active:scale-95"
        >
          <X size={14} />
          <span>Close Details</span>
        </button>
      </div>
    </div>
  );
}
