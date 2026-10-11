"use client"

import React, { useState, useEffect } from 'react'
import { Tag, Percent, Gift, Calendar, Users, ShoppingBag, Plus, Edit, Trash2, Save, X, CheckCircle, AlertCircle, Clock, TrendingUp } from '../../../../utils/icons'

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
      { id: 3, name: 'First Order Privilege', type: 'fixed', value: 100, minPurchase: 500, maxDiscount: 100, applicableTo: 'new', active: true, startDate: '2026-01-01', endDate: '2026-12-31' },
    ],
    festiveOffers: [
      { id: 1, name: 'Diwali Dhamaka', type: 'percentage', value: 20, minPurchase: 2000, maxDiscount: 1000, active: false, startDate: '2026-10-15', endDate: '2026-11-15' },
      { id: 2, name: 'New Year Mega Bash', type: 'percentage', value: 25, minPurchase: 3000, maxDiscount: 1500, active: false, startDate: '2026-12-25', endDate: '2027-01-05' },
    ],
    bulkDiscounts: [
      { id: 1, name: 'Buy 2 Get 5%', type: 'bulk', minQty: 2, discount: 5, applicableProducts: 'all', active: true },
      { id: 2, name: 'Buy 5 Get 10%', type: 'bulk', minQty: 5, discount: 10, applicableProducts: 'all', active: true },
      { id: 3, name: 'Buy 10 Get 15%', type: 'bulk', minQty: 10, discount: 15, applicableProducts: 'all', active: false },
    ]
  })

  // Modal form temporary state
  const [modalForm, setModalForm] = useState({
    name: '',
    type: 'percentage',
    value: 10,
    minPurchase: 1000,
    maxDiscount: 500,
    startDate: '',
    endDate: '',
    applicableTo: 'all'
  })

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  const handleToggleActive = (section, id) => {
    setFormData(prev => ({
      ...prev,
      [section]: prev[section].map(item =>
        item.id === id ? { ...item, active: !item.active } : item
      )
    }))
  }

  const handleDelete = (section, id) => {
    if (confirm('Are you sure you want to remove this discount scheme?')) {
      setFormData(prev => ({
        ...prev,
        [section]: prev[section].filter(item => item.id !== id)
      }))
      setShowSuccess(true)
      setTimeout(() => setShowSuccess(false), 2000)
    }
  }

  const handleOpenAdd = () => {
    setEditingDiscount(null)
    setModalForm({
      name: '',
      type: activeTab === 'bulk' ? 'bulk' : 'percentage',
      value: 10,
      minPurchase: 1000,
      maxDiscount: 500,
      startDate: new Date().toISOString().split('T')[0],
      endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      applicableTo: 'all'
    })
    setShowAddModal(true)
  }

  const handleSaveModal = () => {
    if (!modalForm.name) return
    const sectionKey = activeTab === 'auto' ? 'autoDiscounts' : activeTab === 'festive' ? 'festiveOffers' : 'bulkDiscounts'
    
    if (editingDiscount) {
      setFormData(prev => ({
        ...prev,
        [sectionKey]: prev[sectionKey].map(item =>
          item.id === editingDiscount.id ? { ...item, ...modalForm } : item
        )
      }))
    } else {
      const newId = Math.max(0, ...formData[sectionKey].map(i => i.id)) + 1
      const newItem = activeTab === 'bulk'
        ? { id: newId, name: modalForm.name, type: 'bulk', minQty: 3, discount: modalForm.value, applicableProducts: 'all', active: true }
        : { id: newId, ...modalForm, active: true }

      setFormData(prev => ({
        ...prev,
        [sectionKey]: [...prev[sectionKey], newItem]
      }))
    }

    setShowAddModal(false)
    setShowSuccess(true)
    setTimeout(() => setShowSuccess(false), 2500)
  }

  const getTypeBadge = (type) => {
    switch(type) {
      case 'percentage':
        return { bg: 'bg-emerald-50 border-emerald-200 text-emerald-700', label: 'Percentage' }
      case 'fixed':
        return { bg: 'bg-primary-50 border-primary-200 text-primary-700', label: 'Flat Cash' }
      case 'bulk':
        return { bg: 'bg-purple-50 border-purple-200 text-purple-700', label: 'Volume Tier' }
      default:
        return { bg: 'bg-gray-100 border-gray-200 text-gray-700', label: type }
    }
  }

  const formatDate = (date) => {
    if (!date) return '-'
    return new Date(date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
  }

  return (
    <div className="bg-white rounded-3xl border border-gray-200/80 shadow-2xs overflow-hidden transition-all duration-300">
      {/* Header */}
      <div className="p-5 sm:p-7 border-b border-gray-100 bg-gradient-to-r from-gray-50/60 via-white to-gray-50/30">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-primary-50 border border-primary-100 flex items-center justify-center text-primary-600 shadow-2xs">
              <Tag size={22} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg md:text-xl font-bold text-gray-900 tracking-tight">Promotions &amp; Discounts</h3>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-primary-50 text-primary-700 border border-primary-200">
                  POS Synchronized
                </span>
              </div>
              <p className="text-xs sm:text-sm text-gray-500 mt-0.5">Automate cashier cart promotions, festival coupons, and volume quantity tiers</p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleOpenAdd}
            className="px-4.5 py-2.5 text-xs sm:text-sm font-semibold text-white bg-primary-600 hover:bg-primary-700 rounded-xl transition-all shadow-xs flex items-center gap-2 self-start sm:self-auto"
          >
            <Plus size={16} />
            Create Promo Scheme
          </button>
        </div>
      </div>

      {/* Success Notification */}
      {showSuccess && (
        <div className="mx-6 mt-5 p-3.5 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center gap-3 animate-fadeIn">
          <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
            <CheckCircle size={18} />
          </div>
          <div>
            <p className="text-xs font-bold text-emerald-900">Discount Engine Updated</p>
            <p className="text-xs text-emerald-700">Changes were applied and are now active across all active billing counters.</p>
          </div>
        </div>
      )}

      {/* Sub-tab Navigation */}
      <div className="px-6 pt-5 pb-2 border-b border-gray-100 flex items-center gap-2 overflow-x-auto">
        {[
          { key: 'auto', label: 'Cart Auto Discounts', count: formData.autoDiscounts.length, icon: Percent },
          { key: 'festive', label: 'Festive & Seasonal Campaigns', count: formData.festiveOffers.length, icon: Gift },
          { key: 'bulk', label: 'Volume Tiered Slabs', count: formData.bulkDiscounts.length, icon: ShoppingBag },
        ].map(({ key, label, count, icon: TabIcon }) => (
          <button
            key={key}
            type="button"
            onClick={() => setActiveTab(key)}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all shrink-0 ${
              activeTab === key
                ? 'bg-primary-50 text-primary-700 border border-primary-200 shadow-2xs'
                : 'text-gray-600 hover:bg-gray-100/70 border border-transparent'
            }`}
          >
            <TabIcon size={15} />
            <span>{label}</span>
            <span className={`px-2 py-0.5 rounded-full text-2xs font-extrabold ${
              activeTab === key ? 'bg-primary-200/80 text-primary-900' : 'bg-gray-200/80 text-gray-700'
            }`}>
              {count}
            </span>
          </button>
        ))}
      </div>

      <div className="p-6 md:p-7">
        {/* Tab 1: Auto Discounts */}
        {activeTab === 'auto' && (
          <div className="space-y-4">
            {formData.autoDiscounts.length === 0 ? (
              <div className="text-center py-12 rounded-2xl border border-dashed border-gray-200 bg-gray-50/50">
                <Tag size={40} className="mx-auto text-gray-300 mb-2.5" />
                <h4 className="text-sm font-bold text-gray-800">No Auto Discounts Active</h4>
                <p className="text-xs text-gray-500 mt-1">Create promotional rules applied automatically at POS checkout</p>
                <button
                  type="button"
                  onClick={handleOpenAdd}
                  className="mt-3.5 px-4 py-2 text-xs font-semibold text-primary-700 bg-primary-50 rounded-xl hover:bg-primary-100"
                >
                  Add Your First Discount
                </button>
              </div>
            ) : (
              formData.autoDiscounts.map((discount) => {
                const typeBadge = getTypeBadge(discount.type)
                return (
                  <div
                    key={discount.id}
                    className="p-5 rounded-2xl border border-gray-200/80 bg-white hover:border-primary-200/80 hover:shadow-2xs transition-all"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2.5 mb-2.5 flex-wrap">
                          <h4 className="text-base font-bold text-gray-900">{discount.name}</h4>
                          <span className={`text-2xs px-2.5 py-0.5 rounded-full font-bold border ${typeBadge.bg}`}>
                            {typeBadge.label}
                          </span>
                          <span className={`text-2xs px-2.5 py-0.5 rounded-full font-bold border ${
                            discount.active
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                              : 'bg-gray-100 text-gray-500 border-gray-200'
                          }`}>
                            {discount.active ? 'Active on Registers' : 'Disabled'}
                          </span>
                        </div>

                        {/* Metric Grid */}
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3.5 rounded-xl bg-gray-50/80 border border-gray-100 mb-3.5">
                          <div>
                            <span className="text-2xs font-semibold text-gray-500 block">Deduction Value</span>
                            <span className="text-sm font-extrabold text-primary-700">
                              {discount.type === 'percentage' ? `${discount.value}% OFF` : `₹${discount.value} FLAT`}
                            </span>
                          </div>
                          <div>
                            <span className="text-2xs font-semibold text-gray-500 block">Min Cart Value</span>
                            <span className="text-sm font-bold text-gray-800">₹{discount.minPurchase.toLocaleString()}</span>
                          </div>
                          <div>
                            <span className="text-2xs font-semibold text-gray-500 block">Cap Limit</span>
                            <span className="text-sm font-bold text-gray-800">₹{discount.maxDiscount.toLocaleString()}</span>
                          </div>
                          <div>
                            <span className="text-2xs font-semibold text-gray-500 block">Eligible Audience</span>
                            <span className="text-sm font-bold text-gray-800 capitalize">{discount.applicableTo} Customers</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-4 text-xs text-gray-500">
                          <div className="flex items-center gap-1.5 font-medium">
                            <Calendar size={13} className="text-gray-400" />
                            <span>Valid: {formatDate(discount.startDate)} - {formatDate(discount.endDate)}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 self-end sm:self-auto">
                        <button
                          type="button"
                          onClick={() => {
                            setEditingDiscount(discount)
                            setModalForm({ ...discount })
                            setShowAddModal(true)
                          }}
                          className="p-2 text-gray-500 hover:text-primary-600 hover:bg-primary-50 rounded-xl transition-all"
                          title="Edit discount"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete('autoDiscounts', discount.id)}
                          className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
                          title="Delete discount"
                        >
                          <Trash2 size={16} />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleToggleActive('autoDiscounts', discount.id)}
                          className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ml-1 ${
                            discount.active ? 'bg-primary-600' : 'bg-gray-300'
                          }`}
                        >
                          <span
                            className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition duration-200 ease-in-out ${
                              discount.active ? 'translate-x-4' : 'translate-x-0'
                            }`}
                          />
                        </button>
                      </div>
                    </div>
                  </div>
                )
              })
            )}
          </div>
        )}

        {/* Tab 2: Festive Offers */}
        {activeTab === 'festive' && (
          <div className="space-y-4">
            {formData.festiveOffers.length === 0 ? (
              <div className="text-center py-12 rounded-2xl border border-dashed border-gray-200 bg-gray-50/50">
                <Gift size={40} className="mx-auto text-gray-300 mb-2.5" />
                <h4 className="text-sm font-bold text-gray-800">No Festive Campaigns Configured</h4>
                <p className="text-xs text-gray-500 mt-1">Set up calendar-scheduled festival promotions that activate on specific dates</p>
                <button
                  type="button"
                  onClick={handleOpenAdd}
                  className="mt-3.5 px-4 py-2 text-xs font-semibold text-primary-700 bg-primary-50 rounded-xl hover:bg-primary-100"
                >
                  Create Festive Campaign
                </button>
              </div>
            ) : (
              formData.festiveOffers.map((offer) => {
                const typeBadge = getTypeBadge(offer.type)
                const isUpcoming = !offer.active && new Date(offer.startDate) > new Date()
                return (
                  <div
                    key={offer.id}
                    className="p-5 rounded-2xl border border-gray-200/80 bg-white hover:border-primary-200/80 hover:shadow-2xs transition-all"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2.5 mb-2.5 flex-wrap">
                          <h4 className="text-base font-bold text-gray-900">{offer.name}</h4>
                          <span className={`text-2xs px-2.5 py-0.5 rounded-full font-bold border ${typeBadge.bg}`}>
                            {typeBadge.label}
                          </span>
                          <span className={`text-2xs px-2.5 py-0.5 rounded-full font-bold border ${
                            offer.active
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                              : 'bg-amber-50 text-amber-700 border-amber-200'
                          }`}>
                            {offer.active ? 'Running Now' : 'Scheduled / Paused'}
                          </span>
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-3.5 rounded-xl bg-gray-50/80 border border-gray-100 mb-3.5">
                          <div>
                            <span className="text-2xs font-semibold text-gray-500 block">Offer Discount</span>
                            <span className="text-sm font-extrabold text-primary-700">{offer.value}% OFF</span>
                          </div>
                          <div>
                            <span className="text-2xs font-semibold text-gray-500 block">Min Cart Value</span>
                            <span className="text-sm font-bold text-gray-800">₹{offer.minPurchase.toLocaleString()}</span>
                          </div>
                          <div>
                            <span className="text-2xs font-semibold text-gray-500 block">Maximum Benefit</span>
                            <span className="text-sm font-bold text-gray-800">₹{offer.maxDiscount.toLocaleString()}</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-4 text-xs text-gray-500 flex-wrap">
                          <div className="flex items-center gap-1.5 font-medium">
                            <Calendar size={13} className="text-gray-400" />
                            <span>Schedule: {formatDate(offer.startDate)} - {formatDate(offer.endDate)}</span>
                          </div>
                          {isUpcoming && (
                            <div className="flex items-center gap-1.5 text-amber-600 font-bold bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200 text-2xs">
                              <Clock size={12} />
                              <span>Activates automatically in {Math.ceil((new Date(offer.startDate) - new Date()) / (1000 * 60 * 60 * 24))} days</span>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-2 self-end sm:self-auto">
                        <button
                          type="button"
                          onClick={() => {
                            setEditingDiscount(offer)
                            setModalForm({ ...offer })
                            setShowAddModal(true)
                          }}
                          className="p-2 text-gray-500 hover:text-primary-600 hover:bg-primary-50 rounded-xl transition-all"
                          title="Edit campaign"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete('festiveOffers', offer.id)}
                          className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
                          title="Delete campaign"
                        >
                          <Trash2 size={16} />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleToggleActive('festiveOffers', offer.id)}
                          className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ml-1 ${
                            offer.active ? 'bg-primary-600' : 'bg-gray-300'
                          }`}
                        >
                          <span
                            className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition duration-200 ease-in-out ${
                              offer.active ? 'translate-x-4' : 'translate-x-0'
                            }`}
                          />
                        </button>
                      </div>
                    </div>
                  </div>
                )
              })
            )}
          </div>
        )}

        {/* Tab 3: Bulk Discounts */}
        {activeTab === 'bulk' && (
          <div className="space-y-4">
            {formData.bulkDiscounts.length === 0 ? (
              <div className="text-center py-12 rounded-2xl border border-dashed border-gray-200 bg-gray-50/50">
                <ShoppingBag size={40} className="mx-auto text-gray-300 mb-2.5" />
                <h4 className="text-sm font-bold text-gray-800">No Volume Tiers Configured</h4>
                <p className="text-xs text-gray-500 mt-1">Encourage wholesale and multi-pack purchases with tiered quantity discounts</p>
                <button
                  type="button"
                  onClick={handleOpenAdd}
                  className="mt-3.5 px-4 py-2 text-xs font-semibold text-primary-700 bg-primary-50 rounded-xl hover:bg-primary-100"
                >
                  Create Volume Tier
                </button>
              </div>
            ) : (
              formData.bulkDiscounts.map((discount) => {
                const typeBadge = getTypeBadge(discount.type)
                return (
                  <div
                    key={discount.id}
                    className="p-5 rounded-2xl border border-gray-200/80 bg-white hover:border-primary-200/80 hover:shadow-2xs transition-all"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2.5 mb-2.5 flex-wrap">
                          <h4 className="text-base font-bold text-gray-900">{discount.name}</h4>
                          <span className={`text-2xs px-2.5 py-0.5 rounded-full font-bold border ${typeBadge.bg}`}>
                            {typeBadge.label}
                          </span>
                          <span className={`text-2xs px-2.5 py-0.5 rounded-full font-bold border ${
                            discount.active
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                              : 'bg-gray-100 text-gray-500 border-gray-200'
                          }`}>
                            {discount.active ? 'Active Tier' : 'Inactive'}
                          </span>
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-3.5 rounded-xl bg-gray-50/80 border border-gray-100 mb-3.5">
                          <div>
                            <span className="text-2xs font-semibold text-gray-500 block">Min Threshold Units</span>
                            <span className="text-sm font-extrabold text-gray-900">{discount.minQty}+ Units</span>
                          </div>
                          <div>
                            <span className="text-2xs font-semibold text-gray-500 block">Applied Discount</span>
                            <span className="text-sm font-extrabold text-primary-700">{discount.discount}% OFF</span>
                          </div>
                          <div>
                            <span className="text-2xs font-semibold text-gray-500 block">Eligible Product Range</span>
                            <span className="text-sm font-bold text-gray-800 capitalize">{discount.applicableProducts} Catalog</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-1.5 text-xs text-gray-500 font-medium">
                          <TrendingUp size={13} className="text-primary-600" />
                          <span>Automatically triggers at checkout when item unit count threshold is fulfilled</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 self-end sm:self-auto">
                        <button
                          type="button"
                          onClick={() => {
                            setEditingDiscount(discount)
                            setModalForm({ ...discount, value: discount.discount })
                            setShowAddModal(true)
                          }}
                          className="p-2 text-gray-500 hover:text-primary-600 hover:bg-primary-50 rounded-xl transition-all"
                          title="Edit tier"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete('bulkDiscounts', discount.id)}
                          className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
                          title="Delete tier"
                        >
                          <Trash2 size={16} />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleToggleActive('bulkDiscounts', discount.id)}
                          className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ml-1 ${
                            discount.active ? 'bg-primary-600' : 'bg-gray-300'
                          }`}
                        >
                          <span
                            className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition duration-200 ease-in-out ${
                              discount.active ? 'translate-x-4' : 'translate-x-0'
                            }`}
                          />
                        </button>
                      </div>
                    </div>
                  </div>
                )
              })
            )}
          </div>
        )}
      </div>

      {/* Add / Edit Promo Scheme Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-950/60 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 md:p-7 shadow-2xl border border-gray-100 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-primary-50 text-primary-600 flex items-center justify-center border border-primary-100">
                  <Tag size={20} />
                </div>
                <div>
                  <h3 className="text-base md:text-lg font-bold text-gray-900">
                    {editingDiscount ? 'Update Promotion Scheme' : 'Configure New Scheme'}
                  </h3>
                  <p className="text-xs text-gray-500">Add or alter discount logic rules</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="w-8 h-8 rounded-xl text-gray-400 hover:text-gray-700 hover:bg-gray-100 flex items-center justify-center transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            <div className="py-5 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">Promotion Scheme Name *</label>
                <input
                  type="text"
                  placeholder="e.g. Summer Super Saver"
                  value={modalForm.name}
                  onChange={(e) => setModalForm({ ...modalForm, name: e.target.value })}
                  className="w-full px-3.5 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">Discount Calculation</label>
                  <select
                    value={modalForm.type}
                    onChange={(e) => setModalForm({ ...modalForm, type: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:bg-white focus:outline-none focus:border-primary-500 transition-all font-medium"
                  >
                    <option value="percentage">Percentage (%)</option>
                    <option value="fixed">Flat Amount (₹)</option>
                    <option value="bulk">Volume Tier (%)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">Discount Value *</label>
                  <input
                    type="number"
                    value={modalForm.value}
                    onChange={(e) => setModalForm({ ...modalForm, value: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3.5 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:bg-white focus:outline-none focus:border-primary-500 transition-all font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">Min Cart Amount (₹)</label>
                  <input
                    type="number"
                    value={modalForm.minPurchase}
                    onChange={(e) => setModalForm({ ...modalForm, minPurchase: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3.5 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:bg-white focus:outline-none focus:border-primary-500 transition-all font-medium"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">Maximum Cap (₹)</label>
                  <input
                    type="number"
                    value={modalForm.maxDiscount}
                    onChange={(e) => setModalForm({ ...modalForm, maxDiscount: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3.5 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:bg-white focus:outline-none focus:border-primary-500 transition-all font-medium"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">Activation Date</label>
                  <input
                    type="date"
                    value={modalForm.startDate}
                    onChange={(e) => setModalForm({ ...modalForm, startDate: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-xs bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:bg-white focus:outline-none focus:border-primary-500 transition-all font-medium"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">Expiry Date</label>
                  <input
                    type="date"
                    value={modalForm.endDate}
                    onChange={(e) => setModalForm({ ...modalForm, endDate: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-xs bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:bg-white focus:outline-none focus:border-primary-500 transition-all font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">Target Customer Category</label>
                <select
                  value={modalForm.applicableTo}
                  onChange={(e) => setModalForm({ ...modalForm, applicableTo: e.target.value })}
                  className="w-full px-3.5 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:bg-white focus:outline-none focus:border-primary-500 transition-all font-medium"
                >
                  <option value="all">All Retail Customers</option>
                  <option value="new">First Time Shoppers</option>
                  <option value="senior">Senior Citizens (60+)</option>
                  <option value="vip">Loyalty VIP Tier Members</option>
                </select>
              </div>
            </div>

            <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="flex-1 py-2.5 text-xs sm:text-sm font-semibold text-gray-700 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-all"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveModal}
                className="flex-1 py-2.5 text-xs sm:text-sm font-semibold text-white bg-primary-600 hover:bg-primary-700 rounded-xl transition-all shadow-xs"
              >
                {editingDiscount ? 'Update Scheme' : 'Activate Scheme'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
