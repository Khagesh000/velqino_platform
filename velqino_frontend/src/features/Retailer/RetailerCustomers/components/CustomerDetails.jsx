"use client"

import React, { useState, useEffect } from 'react'
import { User, Phone, Mail, MapPin, Calendar, CheckCircle, Package, TrendingUp, Clock, Star, Award, FileText, Edit, Save, X, Plus } from '../../../../utils/icons'
import '../../../../styles/Retailer/RetailerCustomers/CustomerDetails.scss'

export default function CustomerDetails({ selectedCustomer, customerOrders = [] }) {
  const [mounted, setMounted] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [editedCustomer, setEditedCustomer] = useState(null)
  const [activeTab, setActiveTab] = useState('purchase')
  const [newNote, setNewNote] = useState('')
  const [notes, setNotes] = useState([])

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (selectedCustomer) {
      setEditedCustomer(selectedCustomer)
      setIsEditing(false)
    }
  }, [selectedCustomer])

  if (!mounted) return null

  if (!selectedCustomer) {
    return (
      <div className="customer-details bg-white rounded-xl shadow-sm border border-gray-100 h-full">
        <div className="p-8 text-center">
          <User size={48} className="mx-auto text-gray-200 mb-3" />
          <p className="text-sm text-gray-500">Select a customer to view details</p>
          <p className="text-xs text-gray-400 mt-1">Click on any customer from the list</p>
        </div>
      </div>
    )
  }

  // Use real customer orders from props instead of mock data
  const purchaseHistory = customerOrders.map(order => ({
    id: order.order_number,
    date: order.created_at,
    amount: parseFloat(order.grand_total || 0),
    items: order.items?.length || 0,
    status: order.status
  }))

  // Calculate total spent from real orders
  const totalSpent = purchaseHistory.reduce((sum, order) => sum + order.amount, 0)

  // Calculate tier based on total spent
  function calculateTier(spent) {
    if (spent >= 50000) return 'Platinum'
    if (spent >= 25000) return 'Gold'
    if (spent >= 10000) return 'Silver'
    return 'Bronze'
  }

  // Get display customer info
  const displayCustomer = {
    name: selectedCustomer.full_name || selectedCustomer.name || selectedCustomer.user?.full_name || 'N/A',
    phone: selectedCustomer.phone || selectedCustomer.mobile || selectedCustomer.user?.mobile || 'N/A',
    email: selectedCustomer.email || selectedCustomer.user?.email || 'N/A',
    tier: selectedCustomer.tier || calculateTier(totalSpent),
    points: selectedCustomer.points || Math.floor(totalSpent / 10)
  }

  // Preferences from customer data or defaults
  const preferences = {
    categories: selectedCustomer.preferred_categories || ['General'],
    priceRange: selectedCustomer.price_range || 'All ranges',
    communication: selectedCustomer.communication_preference || 'Email & WhatsApp',
    preferredPayment: selectedCustomer.payment_preference || 'All methods'
  }

  const formatDate = (date) => {
    if (!date) return 'Not provided'
    return new Date(date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
  }

  const getStatusBadge = (status) => {
    switch(status) {
      case 'delivered': return 'bg-green-100 text-green-700'
      case 'shipped': return 'bg-blue-100 text-blue-700'
      case 'processing': return 'bg-yellow-100 text-yellow-700'
      case 'pending': return 'bg-orange-100 text-orange-700'
      case 'cancelled': return 'bg-red-100 text-red-700'
      default: return 'bg-gray-100 text-gray-700'
    }
  }

  const handleAddNote = () => {
    if (newNote.trim()) {
      setNotes([{ id: Date.now(), text: newNote, date: new Date().toISOString() }, ...notes])
      setNewNote('')
    }
  }

  const getTierBadge = (tier) => {
    switch(tier) {
      case 'Platinum': return 'bg-gradient-to-r from-gray-400 to-gray-600 text-white'
      case 'Gold': return 'bg-yellow-500 text-white'
      case 'Silver': return 'bg-gray-400 text-white'
      default: return 'bg-orange-600 text-white'
    }
  }

  return (
    <div className="customer-details bg-white rounded-xl shadow-sm border border-gray-100 h-full">
      {/* Header */}
      <div className="p-4 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <User size={18} className="text-primary-500" />
            <h3 className="text-base font-semibold text-gray-900">Customer Details</h3>
          </div>
          {isEditing ? (
            <div className="flex gap-1">
              <button onClick={() => setIsEditing(false)} className="p-1 text-gray-400 hover:text-gray-600 rounded-lg">
                <X size={14} />
              </button>
              <button onClick={() => setIsEditing(false)} className="p-1 text-green-500 hover:bg-green-50 rounded-lg">
                <Save size={14} />
              </button>
            </div>
          ) : (
            <button onClick={() => setIsEditing(true)} className="p-1 text-gray-400 hover:text-primary-600 rounded-lg">
              <Edit size={14} />
            </button>
          )}
        </div>
        <p className="text-xs text-gray-500 mt-1">Complete customer information</p>
      </div>

      {/* Customer Basic Info */}
      <div className="p-4 border-b border-gray-100 bg-gray-50">
        <div className="flex items-start gap-3">
          <div className="w-14 h-14 rounded-full bg-primary-500 flex items-center justify-center">
            <span className="text-white text-xl font-bold">{displayCustomer.name.charAt(0)}</span>
          </div>
          <div className="flex-1">
            <h4 className="text-base font-bold text-gray-900">{displayCustomer.name}</h4>
            <div className="flex items-center gap-2 mt-1">
              <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium ${
                displayCustomer.tier === 'Platinum' ? 'bg-gradient-to-r from-gray-400 to-gray-600 text-white' :
                displayCustomer.tier === 'Gold' ? 'bg-yellow-500 text-white' :
                displayCustomer.tier === 'Silver' ? 'bg-gray-400 text-white' : 'bg-orange-600 text-white'
              }`}>
                <Award size={10} />
                {displayCustomer.tier}
              </span>
              <span className="text-xs text-gray-500">Customer since {selectedCustomer.created_at ? new Date(selectedCustomer.created_at).getFullYear() : '2025'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-100">
        <button
          onClick={() => setActiveTab('purchase')}
          className={`flex-1 py-2 text-xs font-medium transition-all ${activeTab === 'purchase' ? 'text-primary-600 border-b-2 border-primary-500' : 'text-gray-500'}`}
        >
          Purchase History
        </button>
        <button
          onClick={() => setActiveTab('preferences')}
          className={`flex-1 py-2 text-xs font-medium transition-all ${activeTab === 'preferences' ? 'text-primary-600 border-b-2 border-primary-500' : 'text-gray-500'}`}
        >
          Preferences
        </button>
        <button
          onClick={() => setActiveTab('notes')}
          className={`flex-1 py-2 text-xs font-medium transition-all ${activeTab === 'notes' ? 'text-primary-600 border-b-2 border-primary-500' : 'text-gray-500'}`}
        >
          Notes
        </button>
      </div>

      {/* Content */}
      <div className="p-4 max-h-[350px] overflow-y-auto custom-scroll">
        {activeTab === 'purchase' && (
          <div className="space-y-3">
            {/* Summary Stats */}
            <div className="grid grid-cols-3 gap-2 mb-3">
              <div className="bg-green-50 rounded-lg p-2 text-center">
                <p className="text-lg font-bold text-green-700">{purchaseHistory.length}</p>
                <p className="text-[10px] text-green-600">Orders</p>
              </div>
              <div className="bg-blue-50 rounded-lg p-2 text-center">
                <p className="text-lg font-bold text-blue-700">₹{totalSpent.toLocaleString()}</p>
                <p className="text-[10px] text-blue-600">Total Spent</p>
              </div>
              <div className="bg-purple-50 rounded-lg p-2 text-center">
                <p className="text-lg font-bold text-purple-700">₹{purchaseHistory.length ? (totalSpent / purchaseHistory.length).toFixed(0) : 0}</p>
                <p className="text-[10px] text-purple-600">Avg Order</p>
              </div>
            </div>

            {/* Order List */}
            {purchaseHistory.length === 0 ? (
              <div className="text-center py-8">
                <Package size={32} className="mx-auto text-gray-300 mb-2" />
                <p className="text-sm text-gray-500">No orders yet</p>
              </div>
            ) : (
              purchaseHistory.map((order) => (
                <div key={order.id} className="border border-gray-200 rounded-lg p-3 hover:shadow-md transition-all">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className="text-sm font-semibold text-gray-900">{order.id}</p>
                      <div className="flex items-center gap-2 text-xs text-gray-500 mt-0.5">
                        <Calendar size={10} />
                        <span>{formatDate(order.date)}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-gray-900">₹{order.amount.toLocaleString()}</p>
                      <p className="text-[10px] text-gray-500">{order.items} items</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className={`flex items-center gap-1 text-xs ${getStatusBadge(order.status)} px-2 py-0.5 rounded-full`}>
                      <CheckCircle size={10} />
                      <span>{order.status}</span>
                    </div>
                    <button className="text-xs text-primary-600">View Order</button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === 'preferences' && (
          <div className="space-y-4">
            {/* Contact Details */}
            <div className="bg-gray-50 rounded-lg p-3">
              <h4 className="text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">Contact Details</h4>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <Phone size={14} className="text-gray-400" />
                  <span className="text-gray-700">{displayCustomer.phone}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Mail size={14} className="text-gray-400" />
                  <span className="text-gray-700">{displayCustomer.email}</span>
                </div>
              </div>
            </div>

            {/* Shopping Preferences */}
            <div className="bg-gray-50 rounded-lg p-3">
              <h4 className="text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">Shopping Preferences</h4>
              <div className="space-y-2">
                <div>
                  <p className="text-xs text-gray-500">Preferred Categories</p>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {preferences.categories.map(cat => (
                      <span key={cat} className="text-xs bg-primary-100 text-primary-700 px-2 py-0.5 rounded-full">{cat}</span>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Price Range</p>
                  <p className="text-sm text-gray-700">{preferences.priceRange}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Communication Channel</p>
                  <p className="text-sm text-gray-700">{preferences.communication}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Preferred Payment</p>
                  <p className="text-sm text-gray-700">{preferences.preferredPayment}</p>
                </div>
              </div>
            </div>

            {/* Loyalty Info */}
            <div className="bg-yellow-50 rounded-lg p-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Star size={14} className="text-yellow-500" />
                  <span className="text-sm font-semibold text-gray-900">Loyalty Points</span>
                </div>
                <span className="text-lg font-bold text-yellow-700">{displayCustomer.points.toLocaleString()}</span>
              </div>
              <p className="text-xs text-gray-500 mt-1">Next tier: {displayCustomer.tier === 'Gold' ? 'Platinum' : displayCustomer.tier === 'Silver' ? 'Gold' : 'Silver'}</p>
            </div>
          </div>
        )}

        {activeTab === 'notes' && (
          <div className="space-y-3">
            {/* Add Note */}
            <div className="flex gap-2">
              <textarea
                placeholder="Add a note about this customer..."
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                rows={2}
                className="flex-1 px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-primary-500 resize-none"
              />
              <button
                onClick={handleAddNote}
                className="px-3 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-all"
              >
                <Plus size={16} />
              </button>
            </div>

            {/* Notes List */}
            <div className="space-y-2">
              {notes.length === 0 ? (
                <div className="text-center py-6">
                  <FileText size={32} className="mx-auto text-gray-300 mb-2" />
                  <p className="text-sm text-gray-500">No notes yet</p>
                  <p className="text-xs text-gray-400">Add notes to track customer interactions</p>
                </div>
              ) : (
                notes.map(note => (
                  <div key={note.id} className="bg-gray-50 rounded-lg p-3">
                    <p className="text-sm text-gray-700">{note.text}</p>
                    <p className="text-[10px] text-gray-400 mt-1">{formatDate(note.date)}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}