"use client"

import React, { useState, useEffect } from 'react'
import { Tag, Percent, Gift, Calendar, Users, ShoppingBag, Plus, Edit, Trash2, Save, X, CheckCircle, AlertCircle, Clock, TrendingUp } from '../../../../utils/icons'
import '../../../../styles/Retailer/RetailerSettings/DiscountSettings.scss'

export default function DiscountSettings() {
  const [mounted, setMounted] = useState(false)
  const [activeTab, setActiveTab] = useState('auto')
  const [showAddModal, setShowAddModal] = useState(false)
  const [editingDiscount, setEditingDiscount] = useState(null)
  const [showSuccess, setShowSuccess] = useState(false)
  
  const [formData, setFormData] = useState({
    autoDiscounts: [
      { id: 1, name: 'Weekend Special', type: 'percentage', value: 10, minPurchase: 1000, maxDiscount: 500, applicableTo: 'all', active: true, startDate: '2026-04-01', endDate: '2026-04-30' },
      { id: 2, name: 'Senior Citizen', type: 'percentage', value: 15, minPurchase: 500, maxDiscount: 300, applicableTo: 'senior', active: true, startDate: '2026-01-01', endDate: '2026-12-31' },
      { id: 3, name: 'First Order', type: 'fixed', value: 100, minPurchase: 500, maxDiscount: 100, applicableTo: 'new', active: true, startDate: '2026-01-01', endDate: '2026-12-31' },
    ],
    festiveOffers: [
      { id: 1, name: 'Diwali Dhamaka', type: 'percentage', value: 20, minPurchase: 2000, maxDiscount: 1000, active: false, startDate: '2026-10-15', endDate: '2026-11-15' },
      { id: 2, name: 'New Year Sale', type: 'percentage', value: 25, minPurchase: 3000, maxDiscount: 1500, active: false, startDate: '2026-12-25', endDate: '2027-01-05' },
    ],
    bulkDiscounts: [
      { id: 1, name: 'Buy 2 Get 5%', type: 'bulk', minQty: 2, discount: 5, applicableProducts: 'all', active: true },
      { id: 2, name: 'Buy 5 Get 10%', type: 'bulk', minQty: 5, discount: 10, applicableProducts: 'all', active: true },
      { id: 3, name: 'Buy 10 Get 15%', type: 'bulk', minQty: 10, discount: 15, applicableProducts: 'all', active: false },
    ]
  })

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  const handleToggleActive = (section, id) => {
    setFormData({
      ...formData,
      [section]: formData[section].map(item =>
        item.id === id ? { ...item, active: !item.active } : item
      )
    })
  }

  const handleDelete = (section, id) => {
    if (confirm('Are you sure you want to delete this discount?')) {
      setFormData({
        ...formData,
        [section]: formData[section].filter(item => item.id !== id)
      })
      setShowSuccess(true)
      setTimeout(() => setShowSuccess(false), 2000)
    }
  }

  const getTypeBadge = (type) => {
    switch(type) {
      case 'percentage': return { bg: 'bg-green-100', text: 'text-green-700', label: 'Percentage' }
      case 'fixed': return { bg: 'bg-blue-100', text: 'text-blue-700', label: 'Fixed Amount' }
      case 'bulk': return { bg: 'bg-purple-100', text: 'text-purple-700', label: 'Bulk Discount' }
      default: return { bg: 'bg-gray-100', text: 'text-gray-700', label: type }
    }
  }

  const formatDate = (date) => {
    if (!date) return '-'
    return new Date(date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })
  }

  return (
    <div className="discount-settings bg-white rounded-xl shadow-sm border border-gray-100">
      {/* Header */}
      <div className="p-5 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Tag size={22} className="text-primary-500" />
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Discount Settings</h3>
              <p className="text-sm text-gray-500">Configure auto discounts, schemes and festive offers</p>
            </div>
          </div>
          <button
            onClick={() => {
              setEditingDiscount(null)
              setShowAddModal(true)
            }}
            className="px-4 py-2 text-sm bg-primary-500 text-white rounded-lg hover:bg-primary-600 flex items-center gap-2"
          >
            <Plus size={16} />
            Add Discount
          </button>
        </div>
      </div>

      {/* Success Message */}
      {showSuccess && (
        <div className="mx-5 mt-4 p-3 bg-green-100 rounded-lg flex items-center gap-2 animate-fadeIn">
          <CheckCircle size={16} className="text-green-600" />
          <span className="text-sm text-green-700">Discount updated successfully!</span>
        </div>
      )}

      {/* Tabs */}
      <div className="flex border-b border-gray-100">
        <button
          onClick={() => setActiveTab('auto')}
          className={`px-5 py-3 text-sm font-medium transition-all ${activeTab === 'auto' ? 'text-primary-600 border-b-2 border-primary-500' : 'text-gray-500'}`}
        >
          Auto Discounts
        </button>
        <button
          onClick={() => setActiveTab('festive')}
          className={`px-5 py-3 text-sm font-medium transition-all ${activeTab === 'festive' ? 'text-primary-600 border-b-2 border-primary-500' : 'text-gray-500'}`}
        >
          Festive Offers
        </button>
        <button
          onClick={() => setActiveTab('bulk')}
          className={`px-5 py-3 text-sm font-medium transition-all ${activeTab === 'bulk' ? 'text-primary-600 border-b-2 border-primary-500' : 'text-gray-500'}`}
        >
          Bulk Discounts
        </button>
      </div>

      <div className="p-5">
        {/* Auto Discounts List */}
        {activeTab === 'auto' && (
          <div className="space-y-3">
            {formData.autoDiscounts.length === 0 ? (
              <div className="text-center py-8">
                <Tag size={48} className="mx-auto text-gray-300 mb-3" />
                <p className="text-gray-500">No auto discounts configured</p>
                <button className="mt-2 text-primary-600">Add your first discount</button>
              </div>
            ) : (
              formData.autoDiscounts.map((discount) => {
                const typeBadge = getTypeBadge(discount.type)
                return (
                  <div key={discount.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-all">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h4 className="text-base font-semibold text-gray-900">{discount.name}</h4>
                          <span className={`text-xs px-2 py-0.5 rounded-full ${typeBadge.bg} ${typeBadge.text}`}>
                            {typeBadge.label}
                          </span>
                          {discount.active ? (
                            <span className="text-xs px-2 py-0.5 rounded-full bg-green-100 text-green-700">Active</span>
                          ) : (
                            <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-500">Inactive</span>
                          )}
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm mb-3">
                          <div>
                            <p className="text-gray-500">Discount</p>
                            <p className="font-semibold text-gray-900">
                              {discount.type === 'percentage' ? `${discount.value}% OFF` : `₹${discount.value} OFF`}
                            </p>
                          </div>
                          <div>
                            <p className="text-gray-500">Min Purchase</p>
                            <p className="font-semibold text-gray-900">₹{discount.minPurchase.toLocaleString()}</p>
                          </div>
                          <div>
                            <p className="text-gray-500">Max Discount</p>
                            <p className="font-semibold text-gray-900">₹{discount.maxDiscount.toLocaleString()}</p>
                          </div>
                          <div>
                            <p className="text-gray-500">Applicable To</p>
                            <p className="font-semibold text-gray-900 capitalize">{discount.applicableTo}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 text-xs text-gray-500">
                          <div className="flex items-center gap-1">
                            <Calendar size={12} />
                            <span>{formatDate(discount.startDate)} - {formatDate(discount.endDate)}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-1">
                        <button className="p-2 text-gray-400 hover:text-primary-600 rounded-lg">
                          <Edit size={16} />
                        </button>
                        <button onClick={() => handleDelete('autoDiscounts', discount.id)} className="p-2 text-gray-400 hover:text-red-600 rounded-lg">
                          <Trash2 size={16} />
                        </button>
                        <label className="flex items-center gap-1 ml-2">
                          <input
                            type="checkbox"
                            checked={discount.active}
                            onChange={() => handleToggleActive('autoDiscounts', discount.id)}
                            className="rounded border-gray-300 text-primary-500"
                          />
                          <span className="text-xs text-gray-500">Active</span>
                        </label>
                      </div>
                    </div>
                  </div>
                )
              })
            )}
          </div>
        )}

        {/* Festive Offers List */}
        {activeTab === 'festive' && (
          <div className="space-y-3">
            {formData.festiveOffers.length === 0 ? (
              <div className="text-center py-8">
                <Gift size={48} className="mx-auto text-gray-300 mb-3" />
                <p className="text-gray-500">No festive offers configured</p>
                <button className="mt-2 text-primary-600">Create festive offer</button>
              </div>
            ) : (
              formData.festiveOffers.map((offer) => {
                const typeBadge = getTypeBadge(offer.type)
                return (
                  <div key={offer.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-all">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h4 className="text-base font-semibold text-gray-900">{offer.name}</h4>
                          <span className={`text-xs px-2 py-0.5 rounded-full ${typeBadge.bg} ${typeBadge.text}`}>
                            {typeBadge.label}
                          </span>
                          {offer.active ? (
                            <span className="text-xs px-2 py-0.5 rounded-full bg-green-100 text-green-700">Active</span>
                          ) : (
                            <span className="text-xs px-2 py-0.5 rounded-full bg-yellow-100 text-yellow-700">Upcoming</span>
                          )}
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-sm mb-3">
                          <div>
                            <p className="text-gray-500">Offer</p>
                            <p className="font-semibold text-gray-900">{offer.value}% OFF</p>
                          </div>
                          <div>
                            <p className="text-gray-500">Min Purchase</p>
                            <p className="font-semibold text-gray-900">₹{offer.minPurchase.toLocaleString()}</p>
                          </div>
                          <div>
                            <p className="text-gray-500">Max Discount</p>
                            <p className="font-semibold text-gray-900">₹{offer.maxDiscount.toLocaleString()}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 text-xs text-gray-500">
                          <div className="flex items-center gap-1">
                            <Calendar size={12} />
                            <span>{formatDate(offer.startDate)} - {formatDate(offer.endDate)}</span>
                          </div>
                          {!offer.active && new Date(offer.startDate) > new Date() && (
                            <div className="flex items-center gap-1 text-orange-600">
                              <Clock size={12} />
                              <span>Starts in {Math.ceil((new Date(offer.startDate) - new Date()) / (1000 * 60 * 60 * 24))} days</span>
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="flex gap-1">
                        <button className="p-2 text-gray-400 hover:text-primary-600 rounded-lg">
                          <Edit size={16} />
                        </button>
                        <button onClick={() => handleDelete('festiveOffers', offer.id)} className="p-2 text-gray-400 hover:text-red-600 rounded-lg">
                          <Trash2 size={16} />
                        </button>
                        <label className="flex items-center gap-1 ml-2">
                          <input
                            type="checkbox"
                            checked={offer.active}
                            onChange={() => handleToggleActive('festiveOffers', offer.id)}
                            className="rounded border-gray-300 text-primary-500"
                          />
                          <span className="text-xs text-gray-500">Active</span>
                        </label>
                      </div>
                    </div>
                  </div>
                )
              })
            )}
          </div>
        )}

        {/* Bulk Discounts List */}
        {activeTab === 'bulk' && (
          <div className="space-y-3">
            {formData.bulkDiscounts.length === 0 ? (
              <div className="text-center py-8">
                <ShoppingBag size={48} className="mx-auto text-gray-300 mb-3" />
                <p className="text-gray-500">No bulk discounts configured</p>
                <button className="mt-2 text-primary-600">Add bulk discount</button>
              </div>
            ) : (
              formData.bulkDiscounts.map((discount) => {
                const typeBadge = getTypeBadge(discount.type)
                return (
                  <div key={discount.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-all">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h4 className="text-base font-semibold text-gray-900">{discount.name}</h4>
                          <span className={`text-xs px-2 py-0.5 rounded-full ${typeBadge.bg} ${typeBadge.text}`}>
                            {typeBadge.label}
                          </span>
                          {discount.active ? (
                            <span className="text-xs px-2 py-0.5 rounded-full bg-green-100 text-green-700">Active</span>
                          ) : (
                            <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-500">Inactive</span>
                          )}
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-sm mb-3">
                          <div>
                            <p className="text-gray-500">Min Quantity</p>
                            <p className="font-semibold text-gray-900">{discount.minQty}+ items</p>
                          </div>
                          <div>
                            <p className="text-gray-500">Discount</p>
                            <p className="font-semibold text-gray-900">{discount.discount}% OFF</p>
                          </div>
                          <div>
                            <p className="text-gray-500">Applicable Products</p>
                            <p className="font-semibold text-gray-900 capitalize">{discount.applicableProducts}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                          <TrendingUp size={12} />
                          <span>Best for bulk purchases</span>
                        </div>
                      </div>
                      <div className="flex gap-1">
                        <button className="p-2 text-gray-400 hover:text-primary-600 rounded-lg">
                          <Edit size={16} />
                        </button>
                        <button onClick={() => handleDelete('bulkDiscounts', discount.id)} className="p-2 text-gray-400 hover:text-red-600 rounded-lg">
                          <Trash2 size={16} />
                        </button>
                        <label className="flex items-center gap-1 ml-2">
                          <input
                            type="checkbox"
                            checked={discount.active}
                            onChange={() => handleToggleActive('bulkDiscounts', discount.id)}
                            className="rounded border-gray-300 text-primary-500"
                          />
                          <span className="text-xs text-gray-500">Active</span>
                        </label>
                      </div>
                    </div>
                  </div>
                )
              })
            )}
          </div>
        )}
      </div>

      {/* Add/Edit Discount Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 animate-fadeIn">
          <div className="bg-white rounded-xl max-w-md w-full p-5">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Tag size={18} className="text-primary-500" />
                <h3 className="text-lg font-semibold text-gray-900">
                  {editingDiscount ? 'Edit Discount' : 'Add New Discount'}
                </h3>
              </div>
              <button onClick={() => setShowAddModal(false)} className="p-1 text-gray-400 hover:text-gray-600">
                <X size={20} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Discount Name</label>
                <input type="text" placeholder="e.g., Weekend Special" className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-primary-500" />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Discount Type</label>
                  <select className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-primary-500">
                    <option>Percentage (%)</option>
                    <option>Fixed Amount (₹)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Discount Value</label>
                  <input type="number" placeholder="10" className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-primary-500" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Min Purchase (₹)</label>
                  <input type="number" placeholder="1000" className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-primary-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Max Discount (₹)</label>
                  <input type="number" placeholder="500" className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-primary-500" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                  <input type="date" className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-primary-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                  <input type="date" className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-primary-500" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Applicable To</label>
                <select className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-primary-500">
                  <option>All Customers</option>
                  <option>New Customers</option>
                  <option>Senior Citizens</option>
                  <option>Premium Members</option>
                </select>
              </div>
            </div>

            <div className="flex gap-2 mt-5">
              <button onClick={() => setShowAddModal(false)} className="flex-1 px-4 py-2 text-sm text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50">
                Cancel
              </button>
              <button onClick={() => { setShowAddModal(false); setShowSuccess(true); setTimeout(() => setShowSuccess(false), 2000); }} className="flex-1 px-4 py-2 text-sm bg-primary-500 text-white rounded-lg hover:bg-primary-600">
                {editingDiscount ? 'Update' : 'Add'} Discount
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}