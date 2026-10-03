"use client";

import React, { useState, useMemo } from 'react';
import { 
  Users, 
  UserPlus, 
  Search, 
  X, 
  Check, 
  Gift, 
  Phone, 
  Mail, 
  Star,
  CheckCircle
} from '../../../../utils/icons';
import { useGetRetailerCustomersQuery } from '@/redux/retailer/slices/retailerOrdersSlice';

export default function CustomerInfo({ 
  selectedCustomer, 
  setSelectedCustomer,
  applyLoyalty = false,
  setApplyLoyalty
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  
  const [newCustomer, setNewCustomer] = useState({
    name: '',
    phone: '',
    email: '',
  });

  // Query customers from real backend API endpoint: commerce/retailer/customers/
  const { data: customerApiResponse, isLoading } = useGetRetailerCustomersQuery(undefined, {
    refetchOnMountOrArgChange: false,
    refetchOnFocus: false,
  });

  // Parse backend data (which returns an array of customer order records)
  const customerList = useMemo(() => {
    const rawList = Array.isArray(customerApiResponse?.data) 
      ? customerApiResponse.data 
      : (customerApiResponse?.data?.customers || customerApiResponse?.customers || []);

    if (!Array.isArray(rawList) || rawList.length === 0) {
      return [];
    }

    // De-duplicate customers by customer__id or customer__mobile
    const map = new Map();
    rawList.forEach((c, idx) => {
      const id = c.customer__id || c.id || idx + 1;
      const email = c.customer__email || c.email || '';
      const phone = c.customer__mobile || c.phone || c.mobile || 'No Phone';
      const name = c.customer__name 
        || c.name 
        || (email ? email.split('@')[0] : `Customer #${id}`);
      const spent = Number(c.grand_total || c.total_spent || c.totalSpent || 0);

      if (map.has(id)) {
        const existing = map.get(id);
        existing.totalSpent += spent;
        existing.visits += 1;
        existing.points = Math.floor(existing.totalSpent / 10);
      } else {
        map.set(id, {
          id,
          name,
          email,
          phone,
          totalSpent: spent,
          points: Math.floor(spent / 10), // 1 point per ₹10 spent
          tier: spent > 20000 ? 'Platinum' : spent > 5000 ? 'Gold' : 'Silver',
          visits: 1
        });
      }
    });

    return Array.from(map.values());
  }, [customerApiResponse]);

  const filteredCustomers = useMemo(() => {
    if (!searchQuery.trim()) return customerList;
    const q = searchQuery.toLowerCase().trim();
    return customerList.filter(c => 
      c.name.toLowerCase().includes(q) ||
      c.phone.includes(q) ||
      (c.email && c.email.toLowerCase().includes(q))
    );
  }, [customerList, searchQuery]);

  const handleSelect = (customer) => {
    setSelectedCustomer(customer);
    setShowDropdown(false);
    setSearchQuery('');
  };

  const handleCreateCustomer = (e) => {
    e.preventDefault();
    if (!newCustomer.name || !newCustomer.phone) {
      alert('Please enter at least a name and mobile number.');
      return;
    }

    const created = {
      id: Date.now(),
      name: newCustomer.name,
      phone: newCustomer.phone,
      email: newCustomer.email,
      totalSpent: 0,
      points: 100, // Welcome points
      tier: 'Silver',
      visits: 1
    };

    setSelectedCustomer(created);
    setShowAddModal(false);
    setNewCustomer({ name: '', phone: '', email: '' });
  };

  const getTierBadge = (tier = 'Silver') => {
    const t = (tier || '').toLowerCase();
    if (t === 'platinum') {
      return 'bg-indigo-50 text-indigo-700 border-indigo-200';
    }
    if (t === 'gold') {
      return 'bg-amber-50 text-amber-700 border-amber-200';
    }
    return 'bg-gray-100 text-gray-700 border-gray-200';
  };

  return (
    <div className="bg-white rounded-3xl border border-gray-200/80 p-4 sm:p-5 shadow-2xs">
      {/* Header */}
      <div className="flex items-center justify-between mb-3.5 pb-2.5 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <span className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600">
            <Users size={17} />
          </span>
          <div>
            <h3 className="text-sm sm:text-base font-bold text-gray-900">
              Customer Details
            </h3>
            <p className="text-[11px] text-gray-400">Buyer linkage & loyalty rewards</p>
          </div>
        </div>

        {!selectedCustomer ? (
          <button
            type="button"
            onClick={() => setShowAddModal(true)}
            className="text-xs font-bold text-primary-600 hover:text-primary-700 flex items-center gap-1 p-1 rounded-lg hover:bg-primary-50 transition-colors"
          >
            <UserPlus size={14} />
            <span>New Buyer</span>
          </button>
        ) : (
          <button
            type="button"
            onClick={() => {
              setSelectedCustomer(null);
              if (setApplyLoyalty) setApplyLoyalty(false);
            }}
            className="text-xs font-bold text-gray-400 hover:text-gray-700 transition-colors"
          >
            Change
          </button>
        )}
      </div>

      {/* Unselected State: Search & Dropdown */}
      {!selectedCustomer ? (
        <div className="relative">
          <div className="relative">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search buyer by name, phone or email..."
              value={searchQuery}
              onFocus={() => setShowDropdown(true)}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setShowDropdown(true);
              }}
              className="w-full pl-9 pr-8 py-2.5 bg-gray-50/70 hover:bg-gray-50 focus:bg-white border border-gray-200 rounded-2xl text-xs sm:text-sm text-gray-900 focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100 transition-all"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600"
              >
                <X size={14} />
              </button>
            )}
          </div>

          {/* Quick Dropdown */}
          {showDropdown && (
            <div className="absolute left-0 right-0 top-full mt-1.5 bg-white rounded-2xl border border-gray-200/90 shadow-xl max-h-56 overflow-y-auto z-30 p-1.5 animate-fadeIn">
              {isLoading ? (
                <div className="p-4 text-center text-xs text-gray-400 animate-pulse">
                  Loading customers...
                </div>
              ) : customerList.length === 0 ? (
                <div className="p-4 text-center">
                  <p className="text-xs text-gray-500 font-medium">No registered customers in database</p>
                  <button
                    type="button"
                    onClick={() => {
                      setShowDropdown(false);
                      setShowAddModal(true);
                    }}
                    className="mt-2 text-xs font-bold text-primary-600 hover:text-primary-700"
                  >
                    + Register New Customer
                  </button>
                </div>
              ) : filteredCustomers.length === 0 ? (
                <div className="p-4 text-center">
                  <p className="text-xs text-gray-500 font-medium">No customer matching &ldquo;{searchQuery}&rdquo;</p>
                  <button
                    type="button"
                    onClick={() => {
                      setShowDropdown(false);
                      setShowAddModal(true);
                    }}
                    className="mt-2 text-xs font-bold text-primary-600 hover:text-primary-700"
                  >
                    + Register &ldquo;{searchQuery}&rdquo;
                  </button>
                </div>
              ) : (
                filteredCustomers.map((c) => (
                  <div
                    key={c.id}
                    onClick={() => handleSelect(c)}
                    className="p-2.5 hover:bg-primary-50/60 rounded-xl cursor-pointer transition-colors flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-primary-100 text-primary-700 font-bold text-xs flex items-center justify-center">
                        {c.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="text-xs font-bold text-gray-900">{c.name}</p>
                        <p className="text-[10px] text-gray-400">{c.phone}</p>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full border ${getTierBadge(c.tier)}`}>
                        {c.tier}
                      </span>
                      {c.points > 0 && (
                        <p className="text-[10px] text-amber-600 font-bold mt-0.5">
                          {c.points} pts
                        </p>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      ) : (
        /* Selected Customer Card */
        <div className="space-y-3 animate-fadeIn">
          <div className="p-3 rounded-2xl bg-gradient-to-r from-primary-50/50 to-white border border-primary-200/90">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-primary-600 text-white font-extrabold text-sm flex items-center justify-center shadow-xs">
                  {selectedCustomer.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-xs sm:text-sm font-bold text-gray-900">
                      {selectedCustomer.name}
                    </h4>
                    <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded-full border ${getTierBadge(selectedCustomer.tier)}`}>
                      {selectedCustomer.tier}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-[11px] text-gray-500 mt-0.5">
                    <span>{selectedCustomer.phone}</span>
                    {selectedCustomer.email && (
                      <>
                        <span>•</span>
                        <span className="truncate max-w-[120px]">{selectedCustomer.email}</span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  setSelectedCustomer(null);
                  if (setApplyLoyalty) setApplyLoyalty(false);
                }}
                className="p-1 text-gray-400 hover:text-gray-600 rounded-lg"
                title="Remove Customer"
              >
                <X size={15} />
              </button>
            </div>
          </div>

          {/* Loyalty Reward Pill */}
          {selectedCustomer.points > 0 && (
            <div className="p-2.5 rounded-2xl bg-amber-50/60 border border-amber-200/80 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="p-1 rounded-lg bg-amber-100 text-amber-700">
                  <Gift size={15} />
                </span>
                <div>
                  <span className="text-xs font-bold text-amber-900 block">
                    {selectedCustomer.points} Loyalty Points Available
                  </span>
                  <span className="text-[10px] text-amber-700">
                    {Math.floor(selectedCustomer.points / 100) * 50 > 0 
                      ? `Worth ₹${Math.floor(selectedCustomer.points / 100) * 50} discount` 
                      : '100 pts needed for ₹50 off'}
                  </span>
                </div>
              </div>

              {selectedCustomer.points >= 100 && (
                <button
                  type="button"
                  onClick={() => setApplyLoyalty && setApplyLoyalty(!applyLoyalty)}
                  className={`
                    px-2.5 py-1 rounded-xl text-xs font-bold transition-all shadow-2xs
                    ${applyLoyalty 
                      ? 'bg-emerald-600 text-white' 
                      : 'bg-white border border-amber-300 text-amber-800 hover:bg-amber-100'
                    }
                  `}
                >
                  {applyLoyalty ? 'Applied' : 'Redeem'}
                </button>
              )}
            </div>
          )}
        </div>
      )}

      {/* Add New Customer Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-gray-100 animate-scale">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100 mb-4">
              <div className="flex items-center gap-2">
                <span className="p-1.5 rounded-xl bg-primary-50 text-primary-600">
                  <UserPlus size={18} />
                </span>
                <h3 className="text-base font-bold text-gray-900">
                  Quick Add Buyer
                </h3>
              </div>
              <button 
                type="button"
                onClick={() => setShowAddModal(false)} 
                className="p-1 text-gray-400 hover:text-gray-600 rounded-lg"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreateCustomer} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ramesh Patel"
                  value={newCustomer.name}
                  onChange={(e) => setNewCustomer({ ...newCustomer, name: e.target.value })}
                  className="w-full px-3 py-2 text-xs sm:text-sm border border-gray-200 rounded-xl focus:outline-none focus:border-primary-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Mobile Number *</label>
                <input
                  type="tel"
                  required
                  placeholder="e.g. 9876543210"
                  value={newCustomer.phone}
                  onChange={(e) => setNewCustomer({ ...newCustomer, phone: e.target.value })}
                  className="w-full px-3 py-2 text-xs sm:text-sm border border-gray-200 rounded-xl focus:outline-none focus:border-primary-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Email Address</label>
                <input
                  type="email"
                  placeholder="e.g. ramesh@gmail.com"
                  value={newCustomer.email}
                  onChange={(e) => setNewCustomer({ ...newCustomer, email: e.target.value })}
                  className="w-full px-3 py-2 text-xs sm:text-sm border border-gray-200 rounded-xl focus:outline-none focus:border-primary-500"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 py-2 text-xs font-bold text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 text-xs font-bold text-white bg-primary-600 hover:bg-primary-700 rounded-xl transition-colors shadow-2xs"
                >
                  Save & Link
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
