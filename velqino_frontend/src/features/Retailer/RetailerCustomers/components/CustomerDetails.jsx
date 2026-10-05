"use client";

import React, { useState, useEffect } from 'react';
import { 
  User, 
  Phone, 
  Mail, 
  MapPin, 
  Calendar, 
  CheckCircle, 
  Package, 
  TrendingUp, 
  Clock, 
  Star, 
  Award, 
  FileText, 
  Plus,
  Sparkles,
  ShoppingBag
} from '../../../../utils/icons';

export default function CustomerDetails({ selectedCustomer, customerOrders = [] }) {
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState('purchase');
  const [newNote, setNewNote] = useState('');
  const [notes, setNotes] = useState([]);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  if (!selectedCustomer) {
    return (
      <div className="bg-white rounded-3xl border border-gray-200/80 p-8 shadow-2xs h-full flex flex-col items-center justify-center text-center">
        <div className="w-14 h-14 rounded-2xl bg-primary-50 text-primary-600 flex items-center justify-center mb-3 shadow-2xs">
          <User size={26} />
        </div>
        <h4 className="text-sm sm:text-base font-bold text-gray-900">Customer Dossier</h4>
        <p className="text-xs text-gray-400 mt-1 max-w-xs">
          Select any customer from the directory to inspect their purchase history, contact preferences, and loyalty profile.
        </p>
      </div>
    );
  }

  // Orders list
  const orders = customerOrders.length > 0 ? customerOrders : (selectedCustomer.orders || []);
  const totalSpent = selectedCustomer.totalSpent || selectedCustomer.total_spent || orders.reduce((sum, o) => sum + parseFloat(o.grand_total || 0), 0);

  const displayCustomer = {
    name: selectedCustomer.full_name || selectedCustomer.name || 'Customer',
    phone: selectedCustomer.phone || selectedCustomer.mobile || '—',
    email: selectedCustomer.email || '—',
    city: selectedCustomer.city || '',
    state: selectedCustomer.state || '',
    address: selectedCustomer.address || 'Standard store customer',
    tier: selectedCustomer.tier || 'Bronze',
    points: selectedCustomer.points || Math.floor(totalSpent / 10),
    dob: selectedCustomer.date_of_birth,
    anniversary: selectedCustomer.anniversary_date,
    firstVisit: selectedCustomer.first_visit || selectedCustomer.created_at,
  };

  const formatDate = (date) => {
    if (!date) return 'Not recorded';
    try {
      return new Date(date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
    } catch {
      return 'Not recorded';
    }
  };

  const getStatusBadge = (status) => {
    const s = status?.toLowerCase() || 'pending';
    switch(s) {
      case 'delivered':
      case 'completed':
        return <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">Delivered</span>;
      case 'shipped':
        return <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">Shipped</span>;
      case 'processing':
      case 'confirmed':
        return <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200 capitalize">{s}</span>;
      case 'cancelled':
        return <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200">Cancelled</span>;
      default:
        return <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-gray-100 text-gray-700 border border-gray-200 capitalize">{s}</span>;
    }
  };

  const handleAddNote = () => {
    if (newNote.trim()) {
      setNotes([{ id: Date.now(), text: newNote.trim(), date: new Date().toISOString() }, ...notes]);
      setNewNote('');
    }
  };

  return (
    <div className="bg-white rounded-3xl border border-gray-200/80 shadow-2xs overflow-hidden flex flex-col justify-between">
      <div>
        {/* Header Profile Section */}
        <div className="p-4 sm:p-5 border-b border-gray-100 bg-gradient-to-br from-gray-50 via-white to-gray-50/50">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-primary-600 to-primary-500 text-white flex items-center justify-center font-bold text-base shadow-xs shrink-0">
                {displayCustomer.name.charAt(0).toUpperCase()}
              </div>
              <div className="min-w-0">
                <h4 className="text-sm sm:text-base font-bold text-gray-900 truncate flex items-center gap-2">
                  <span>{displayCustomer.name}</span>
                  {displayCustomer.tier === 'Platinum' || displayCustomer.tier === 'Gold' ? (
                    <span className="text-[10px] font-bold text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full inline-flex items-center gap-1">
                      <Sparkles size={10} /> VIP
                    </span>
                  ) : null}
                </h4>
                <div className="flex items-center gap-2 text-[11px] text-gray-500 mt-0.5 flex-wrap">
                  <span className="flex items-center gap-1">
                    <Phone size={11} className="text-gray-400" />
                    <span>{displayCustomer.phone}</span>
                  </span>
                  <span className="text-gray-300">•</span>
                  <span className="flex items-center gap-1 truncate max-w-[140px]">
                    <Mail size={11} className="text-gray-400" />
                    <span>{displayCustomer.email}</span>
                  </span>
                </div>
              </div>
            </div>

            {/* Total Spent Stat Badge */}
            <div className="text-right shrink-0">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Total Spent</span>
              <p className="text-base sm:text-lg font-extrabold text-primary-600 tracking-tight">
                ₹{totalSpent.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
              </p>
              <span className="text-[10px] text-gray-500 font-medium">
                {orders.length} order(s)
              </span>
            </div>
          </div>
        </div>

        {/* Tab Selection */}
        <div className="px-4 sm:px-5 border-b border-gray-100 flex items-center gap-2 bg-white">
          <button
            type="button"
            onClick={() => setActiveTab('purchase')}
            className={`py-3 text-xs font-bold border-b-2 transition-all flex items-center gap-1.5 ${
              activeTab === 'purchase'
                ? 'border-primary-600 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-900'
            }`}
          >
            <ShoppingBag size={13} />
            <span>Orders ({orders.length})</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('profile')}
            className={`py-3 text-xs font-bold border-b-2 transition-all flex items-center gap-1.5 ${
              activeTab === 'profile'
                ? 'border-primary-600 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-900'
            }`}
          >
            <User size={13} />
            <span>Profile & Address</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('notes')}
            className={`py-3 text-xs font-bold border-b-2 transition-all flex items-center gap-1.5 ${
              activeTab === 'notes'
                ? 'border-primary-600 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-900'
            }`}
          >
            <FileText size={13} />
            <span>Notes ({notes.length})</span>
          </button>
        </div>

        {/* Tab Body */}
        <div className="p-4 sm:p-5 max-h-[300px] overflow-y-auto">
          {activeTab === 'purchase' && (
            <div className="space-y-2.5">
              {orders.length === 0 ? (
                <div className="py-8 text-center">
                  <Package size={28} className="mx-auto text-gray-300 mb-2" />
                  <p className="text-xs text-gray-400">No orders recorded for this customer yet</p>
                </div>
              ) : (
                orders.map((ord, idx) => (
                  <div 
                    key={idx}
                    className="p-3 rounded-2xl border border-gray-200/80 bg-white hover:border-gray-300 transition-all"
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-gray-900 font-mono">
                          {ord.order_number || `#ORD-${ord.id}`}
                        </span>
                        <span className="text-[11px] text-gray-400 flex items-center gap-1">
                          <Calendar size={11} />
                          <span>{formatDate(ord.created_at)}</span>
                        </span>
                      </div>
                      {getStatusBadge(ord.status)}
                    </div>

                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <div className="flex items-center gap-1.5">
                        <Package size={11} className="text-gray-400" />
                        <span className="font-semibold text-gray-700">{ord.items?.length || 1} item(s)</span>
                      </div>
                      <span className="font-bold text-gray-900 text-xs sm:text-sm">
                        ₹{parseFloat(ord.grand_total || 0).toLocaleString('en-IN')}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {activeTab === 'profile' && (
            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-2xl bg-gray-50 border border-gray-100 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-gray-400 font-medium">Customer Since</span>
                  <span className="font-bold text-gray-800">{formatDate(displayCustomer.firstVisit)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400 font-medium">Birthday</span>
                  <span className="font-bold text-gray-800">{displayCustomer.dob ? formatDate(displayCustomer.dob) : 'Not shared'}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400 font-medium">Anniversary</span>
                  <span className="font-bold text-gray-800">{displayCustomer.anniversary ? formatDate(displayCustomer.anniversary) : 'Not shared'}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400 font-medium">Loyalty Tier</span>
                  <span className="font-bold text-primary-600">{displayCustomer.tier}</span>
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-gray-50 border border-gray-100">
                <div className="flex items-center gap-1.5 text-gray-700 font-bold mb-1">
                  <MapPin size={12} className="text-primary-600" />
                  <span>Delivery Address</span>
                </div>
                <p className="text-gray-600 text-[11px] leading-relaxed">
                  {displayCustomer.address || 'Store walk-in customer (no home delivery address registered)'}
                </p>
                {displayCustomer.city && (
                  <p className="text-gray-400 text-[10px] mt-1">
                    {displayCustomer.city}, {displayCustomer.state}
                  </p>
                )}
              </div>
            </div>
          )}

          {activeTab === 'notes' && (
            <div className="space-y-3">
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Add a customer note..."
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAddNote()}
                  className="flex-1 px-3 py-1.5 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-primary-500 focus:bg-white"
                />
                <button
                  type="button"
                  onClick={handleAddNote}
                  disabled={!newNote.trim()}
                  className="px-3 py-1.5 rounded-xl bg-primary-600 text-white font-bold text-xs hover:bg-primary-700 active:scale-95 disabled:opacity-40"
                >
                  <Plus size={14} />
                </button>
              </div>

              {notes.length === 0 ? (
                <p className="text-center py-6 text-xs text-gray-400">No notes recorded yet</p>
              ) : (
                <div className="space-y-2">
                  {notes.map(n => (
                    <div key={n.id} className="p-2.5 rounded-xl bg-gray-50 border border-gray-100 text-xs">
                      <p className="text-gray-800 font-medium">{n.text}</p>
                      <span className="text-[10px] text-gray-400 mt-1 block">{formatDate(n.date)}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}