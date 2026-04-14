"use client"

import React, { useState, useEffect } from 'react'
import { Users, UserPlus, Star, Phone, Mail, MapPin, Award, Plus, Search, X, Check, Gift } from '../../../../utils/icons'
import '../../../../styles/Retailer/PosSales/CustomerInfo.scss'

export default function CustomerInfo({ selectedCustomer, setSelectedCustomer }) {
  const [mounted, setMounted] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [showCustomerList, setShowCustomerList] = useState(false)
  const [showAddCustomer, setShowAddCustomer] = useState(false)
  const [loyaltyPoints, setLoyaltyPoints] = useState(0)
  const [applyLoyalty, setApplyLoyalty] = useState(false)
  
  const [newCustomer, setNewCustomer] = useState({
    name: '',
    phone: '',
    email: '',
    address: ''
  })

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  // Mock customers data
  const customers = [
    { id: 1, name: 'Rajesh Kumar', phone: '+91 98765 43210', email: 'rajesh@example.com', address: 'MG Road, Bangalore', totalSpent: 24500, points: 1250, tier: 'Gold', visits: 12 },
    { id: 2, name: 'Priya Sharma', phone: '+91 87654 32109', email: 'priya@example.com', address: 'Indiranagar, Bangalore', totalSpent: 8900, points: 450, tier: 'Silver', visits: 5 },
    { id: 3, name: 'Amit Singh', phone: '+91 76543 21098', email: 'amit@example.com', address: 'Koramangala, Bangalore', totalSpent: 15600, points: 780, tier: 'Gold', visits: 8 },
    { id: 4, name: 'Sneha Reddy', phone: '+91 65432 10987', email: 'sneha@example.com', address: 'Whitefield, Bangalore', totalSpent: 3200, points: 160, tier: 'Silver', visits: 3 },
    { id: 5, name: 'Vikram Mehta', phone: '+91 54321 09876', email: 'vikram@example.com', address: 'Jayanagar, Bangalore', totalSpent: 45200, points: 2250, tier: 'Platinum', visits: 25 },
  ]

  const filteredCustomers = customers.filter(c => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.phone.includes(searchQuery) ||
    c.email.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleSelectCustomer = (customer) => {
    setSelectedCustomer(customer)
    setLoyaltyPoints(customer.points)
    setShowCustomerList(false)
    setSearchQuery('')
  }

  const handleAddCustomer = () => {
    if (newCustomer.name && newCustomer.phone) {
      const customer = {
        id: customers.length + 1,
        ...newCustomer,
        totalSpent: 0,
        points: 0,
        tier: 'New',
        visits: 0
      }
      setSelectedCustomer(customer)
      setShowAddCustomer(false)
      setNewCustomer({ name: '', phone: '', email: '', address: '' })
    }
  }

  const handleApplyLoyalty = () => {
    if (applyLoyalty) {
      setApplyLoyalty(false)
      setLoyaltyPoints(selectedCustomer?.points || 0)
    } else {
      setApplyLoyalty(true)
      // Apply loyalty points as discount logic here
    }
  }

  const getTierColor = (tier) => {
    switch(tier) {
      case 'Platinum': return 'bg-gradient-to-r from-gray-400 to-gray-600 text-white'
      case 'Gold': return 'bg-gradient-to-r from-yellow-500 to-yellow-600 text-white'
      case 'Silver': return 'bg-gradient-to-r from-gray-300 to-gray-400 text-gray-800'
      default: return 'bg-gray-100 text-gray-600'
    }
  }

  return (
    <div className="customer-info bg-white rounded-xl shadow-sm border border-gray-100">
      {/* Header */}
      <div className="p-4 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users size={18} className="text-primary-500" />
            <h3 className="text-base font-semibold text-gray-900">Customer Info</h3>
          </div>
          {!selectedCustomer && (
            <button 
              onClick={() => setShowAddCustomer(true)}
              className="text-xs text-primary-600 hover:text-primary-700 flex items-center gap-1"
            >
              <UserPlus size={12} />
              <span>New Customer</span>
            </button>
          )}
        </div>
        <p className="text-xs text-gray-500 mt-1">Link customer to this transaction</p>
      </div>

      {/* Search / Selected Customer */}
      <div className="p-4">
        {!selectedCustomer ? (
          <div>
            <div className="relative">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name, phone or email..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value)
                  setShowCustomerList(true)
                }}
                onFocus={() => setShowCustomerList(true)}
                className="w-full pl-9 pr-3 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:border-primary-500"
              />
            </div>

            {/* Customer List Dropdown */}
            {showCustomerList && searchQuery && (
              <div className="mt-2 border border-gray-200 rounded-xl max-h-60 overflow-y-auto animate-fadeIn">
                {filteredCustomers.length > 0 ? (
                  filteredCustomers.map(customer => (
                    <button
                      key={customer.id}
                      onClick={() => handleSelectCustomer(customer)}
                      className="w-full p-3 text-left hover:bg-gray-50 transition-all border-b border-gray-100 last:border-0 flex items-center gap-3"
                    >
                      <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center">
                        <span className="text-primary-600 font-semibold">{customer.name.charAt(0)}</span>
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">{customer.name}</p>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-xs text-gray-500">{customer.phone}</span>
                          <span className="w-1 h-1 bg-gray-300 rounded-full" />
                          <span className="text-xs text-gray-500">{customer.visits} visits</span>
                        </div>
                      </div>
                      <div className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${getTierColor(customer.tier)}`}>
                        {customer.tier}
                      </div>
                    </button>
                  ))
                ) : (
                  <div className="p-4 text-center">
                    <p className="text-sm text-gray-500">No customers found</p>
                    <button 
                      onClick={() => {
                        setShowCustomerList(false)
                        setShowAddCustomer(true)
                      }}
                      className="mt-2 text-xs text-primary-600"
                    >
                      Add new customer
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        ) : (
          <div className="selected-customer animate-fadeIn">
            {/* Customer Card */}
            <div className="bg-primary-50 rounded-xl p-3">
              <div className="flex items-start gap-3">
                <div className="w-12 h-12 rounded-full bg-primary-500 flex items-center justify-center">
                  <span className="text-white font-semibold text-lg">
                    {selectedCustomer.name.charAt(0)}
                  </span>
                </div>
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="text-sm font-semibold text-gray-900">{selectedCustomer.name}</h4>
                      <div className="flex items-center gap-2 mt-0.5">
                        <div className="flex items-center gap-1">
                          <Phone size={10} className="text-gray-400" />
                          <span className="text-xs text-gray-600">{selectedCustomer.phone}</span>
                        </div>
                        {selectedCustomer.email && (
                          <>
                            <span className="w-1 h-1 bg-gray-300 rounded-full" />
                            <div className="flex items-center gap-1">
                              <Mail size={10} className="text-gray-400" />
                              <span className="text-xs text-gray-600 truncate max-w-[100px]">{selectedCustomer.email}</span>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                    <button 
                      onClick={() => setSelectedCustomer(null)}
                      className="p-1 text-gray-400 hover:text-gray-600"
                    >
                      <X size={14} />
                    </button>
                  </div>

                  {/* Customer Stats */}
                  <div className="flex items-center gap-3 mt-2 pt-2 border-t border-primary-100">
                    <div>
                      <p className="text-[10px] text-gray-500">Total Spent</p>
                      <p className="text-xs font-semibold text-gray-900">₹{selectedCustomer.totalSpent?.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-gray-500">Visits</p>
                      <p className="text-xs font-semibold text-gray-900">{selectedCustomer.visits}</p>
                    </div>
                    <div className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${getTierColor(selectedCustomer.tier)}`}>
                      {selectedCustomer.tier}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Loyalty Points Section */}
            <div className="mt-3 p-3 bg-yellow-50 rounded-xl border border-yellow-100">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 bg-yellow-100 rounded-lg">
                    <Gift size={14} className="text-yellow-600" />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-gray-700">Loyalty Points</p>
                    <p className="text-lg font-bold text-yellow-600">{loyaltyPoints}</p>
                  </div>
                </div>
                <button
                  onClick={handleApplyLoyalty}
                  className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all flex items-center gap-1 ${
                    applyLoyalty 
                      ? 'bg-green-500 text-white' 
                      : 'bg-white border border-yellow-300 text-yellow-700 hover:bg-yellow-100'
                  }`}
                >
                  {applyLoyalty ? <Check size={12} /> : <Star size={12} />}
                  <span>{applyLoyalty ? 'Applied' : 'Apply Points'}</span>
                </button>
              </div>
              {applyLoyalty && (
                <p className="text-[10px] text-yellow-600 mt-2">
                  {Math.floor(loyaltyPoints / 100)} points redeemed = ₹{Math.floor(loyaltyPoints / 10)} discount
                </p>
              )}
            </div>

            {/* Change Customer Button */}
            <button
              onClick={() => setSelectedCustomer(null)}
              className="w-full mt-2 py-2 text-xs text-gray-500 hover:text-primary-600 transition-all"
            >
              Change Customer
            </button>
          </div>
        )}
      </div>

      {/* Add Customer Modal */}
      {showAddCustomer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 animate-fadeIn">
          <div className="bg-white rounded-xl max-w-md w-full p-5">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <UserPlus size={18} className="text-primary-500" />
                <h3 className="text-lg font-semibold text-gray-900">Add New Customer</h3>
              </div>
              <button onClick={() => setShowAddCustomer(false)} className="p-1 text-gray-400 hover:text-gray-600">
                <X size={20} />
              </button>
            </div>

            <div className="space-y-3">
              <input
                type="text"
                placeholder="Full Name *"
                value={newCustomer.name}
                onChange={(e) => setNewCustomer({...newCustomer, name: e.target.value})}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-primary-500"
              />
              <input
                type="tel"
                placeholder="Phone Number *"
                value={newCustomer.phone}
                onChange={(e) => setNewCustomer({...newCustomer, phone: e.target.value})}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-primary-500"
              />
              <input
                type="email"
                placeholder="Email (Optional)"
                value={newCustomer.email}
                onChange={(e) => setNewCustomer({...newCustomer, email: e.target.value})}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-primary-500"
              />
              <textarea
                placeholder="Address (Optional)"
                value={newCustomer.address}
                onChange={(e) => setNewCustomer({...newCustomer, address: e.target.value})}
                rows={2}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-primary-500 resize-none"
              />
            </div>

            <div className="flex gap-2 mt-5">
              <button
                onClick={() => setShowAddCustomer(false)}
                className="flex-1 px-4 py-2 text-sm text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleAddCustomer}
                className="flex-1 px-4 py-2 text-sm bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-all"
              >
                Add Customer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}