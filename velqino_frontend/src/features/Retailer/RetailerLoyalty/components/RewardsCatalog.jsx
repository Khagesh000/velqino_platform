"use client"

import React, { useState, useEffect } from 'react'
import { 
  Gift, Star, Award, Tag, Plus, Edit, Trash2, Eye, 
  ShoppingCart, CheckCircle, X, Save, Search, Filter, 
  ChevronLeft, ChevronRight, Sparkles 
} from '../../../../utils/icons'

export default function RewardsCatalog({ onRefresh, rewards = [] }) {
  const [mounted, setMounted] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [currentPage, setCurrentPage] = useState(1)
  const [hoveredReward, setHoveredReward] = useState(null)
  const [showAddModal, setShowAddModal] = useState(false)
  const [editingReward, setEditingReward] = useState(null)
  const [formData, setFormData] = useState({
    name: '',
    points: '',
    category: '',
    description: '',
    image: '',
    stock: ''
  })
  const itemsPerPage = 4

  useEffect(() => {
    setMounted(true)
  }, [])

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1)
  }, [searchQuery, categoryFilter])

  if (!mounted) return null

  // Transform backend rewards to component format
  const transformedRewards = rewards.map(reward => ({
    id: reward.id,
    name: reward.name,
    points: reward.points_required,
    category: reward.category,
    description: reward.description,
    image: reward.image_url || reward.icon || '🎁',
    stock: reward.stock === -1 ? 'Unlimited' : reward.stock,
    popular: reward.is_popular,
    used: reward.total_redeemed || 0,
    is_active: reward.is_active
  }))

  const categories = ['all', 'discount', 'shipping', 'gift', 'product', 'access']

  const filteredRewards = transformedRewards.filter(reward => {
    const matchesSearch = searchQuery === '' || 
      reward.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      reward.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = categoryFilter === 'all' || reward.category === categoryFilter
    return matchesSearch && matchesCategory
  })

  const totalPages = Math.ceil(filteredRewards.length / itemsPerPage)
  const paginatedRewards = filteredRewards.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

  const getCategoryBadge = (category) => {
    switch(category) {
      case 'discount': return { bg: 'bg-emerald-50 text-emerald-700 border-emerald-200', icon: <Tag size={10} /> }
      case 'shipping': return { bg: 'bg-sky-50 text-sky-700 border-sky-200', icon: <Gift size={10} /> }
      case 'gift': return { bg: 'bg-pink-50 text-pink-700 border-pink-200', icon: <Gift size={10} /> }
      case 'product': return { bg: 'bg-purple-50 text-purple-700 border-purple-200', icon: <Award size={10} /> }
      case 'access': return { bg: 'bg-amber-50 text-amber-800 border-amber-200', icon: <Star size={10} /> }
      default: return { bg: 'bg-gray-100 text-gray-700 border-gray-200', icon: <Gift size={10} /> }
    }
  }

  const handleAddReward = async () => {
    if (!formData.name || !formData.points) return
    setShowAddModal(false)
    setFormData({ name: '', points: '', category: '', description: '', image: '', stock: '' })
    if (onRefresh) onRefresh()
  }

  const handleEditReward = (reward) => {
    setEditingReward(reward)
    setFormData({
      name: reward.name,
      points: reward.points.toString(),
      category: reward.category,
      description: reward.description,
      image: reward.image,
      stock: reward.stock === 'Unlimited' ? '-1' : reward.stock.toString()
    })
    setShowAddModal(true)
  }

  const handleDeleteReward = async (rewardId) => {
    if (confirm('Are you sure you want to delete this reward?')) {
      if (onRefresh) onRefresh()
    }
  }

  const summary = {
    totalRewards: transformedRewards.length,
    totalRedeemed: transformedRewards.reduce((sum, r) => sum + r.used, 0),
    popularRewards: transformedRewards.filter(r => r.popular).length,
    lowStock: transformedRewards.filter(r => r.stock !== 'Unlimited' && parseInt(r.stock) < 20).length
  }

  return (
    <div className="bg-white rounded-3xl border border-gray-200/80 shadow-2xs h-full flex flex-col justify-between overflow-hidden">
      <div>
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-gray-100">
          <div className="flex items-center justify-between gap-3 mb-4 flex-wrap">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                <Gift size={18} />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base sm:text-lg font-extrabold text-gray-900 tracking-tight">Rewards &amp; Catalog</h3>
                  <span className="text-[11px] font-bold bg-amber-50 text-amber-800 border border-amber-200 px-2.5 py-0.5 rounded-full">
                    {filteredRewards.length} perks
                  </span>
                </div>
                <p className="text-xs text-gray-500 mt-0.5">Redeemable merchandise, vouchers, and member benefits</p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                setEditingReward(null)
                setFormData({ name: '', points: '', category: 'discount', description: '', image: '🎁', stock: '-1' })
                setShowAddModal(true)
              }}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold rounded-xl bg-primary-600 hover:bg-primary-700 active:scale-95 text-white shadow-xs transition-all"
            >
              <Plus size={13} />
              <span>Add Reward</span>
            </button>
          </div>

          {/* Search Bar & Categories */}
          <div className="flex flex-col sm:flex-row gap-2.5">
            <div className="flex-1 relative">
              <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search catalog rewards..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm bg-gray-50/50 hover:bg-white focus:bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-primary-500 transition-all"
              />
            </div>
            
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
              {categories.map(cat => {
                const isActive = categoryFilter === cat
                return (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setCategoryFilter(cat)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
                      isActive 
                        ? 'bg-amber-600 text-white shadow-xs' 
                        : 'bg-gray-100/80 text-gray-600 hover:bg-gray-200/70'
                    }`}
                  >
                    {cat === 'all' ? 'All' : cat.charAt(0).toUpperCase() + cat.slice(1)}
                  </button>
                )
              })}
            </div>
          </div>
        </div>

        {/* 4 KPI Summary Ribbon */}
        <div className="grid grid-cols-4 gap-2.5 p-3.5 bg-gray-50/60 border-b border-gray-100 text-center">
          <div className="bg-white p-2.5 rounded-2xl border border-gray-200/60 shadow-2xs">
            <p className="text-[10px] font-bold uppercase text-gray-400">Total Items</p>
            <p className="text-base font-extrabold text-gray-900 mt-0.5">{summary.totalRewards}</p>
          </div>
          <div className="bg-white p-2.5 rounded-2xl border border-gray-200/60 shadow-2xs">
            <p className="text-[10px] font-bold uppercase text-emerald-700">Claimed</p>
            <p className="text-base font-extrabold text-emerald-800 mt-0.5">{summary.totalRedeemed.toLocaleString()}</p>
          </div>
          <div className="bg-white p-2.5 rounded-2xl border border-gray-200/60 shadow-2xs">
            <p className="text-[10px] font-bold uppercase text-amber-600">Featured</p>
            <p className="text-base font-extrabold text-amber-700 mt-0.5">{summary.popularRewards}</p>
          </div>
          <div className="bg-white p-2.5 rounded-2xl border border-gray-200/60 shadow-2xs">
            <p className="text-[10px] font-bold uppercase text-rose-600">Low Stock</p>
            <p className="text-base font-extrabold text-rose-700 mt-0.5">{summary.lowStock}</p>
          </div>
        </div>

        {/* Rewards Grid */}
        <div className="p-4 sm:p-5 max-h-[360px] overflow-y-auto">
          {transformedRewards.length === 0 ? (
            <div className="text-center py-10">
              <Gift size={32} className="mx-auto text-gray-300 mb-2" />
              <p className="text-sm font-bold text-gray-800">No rewards configured</p>
              <p className="text-xs text-gray-400 mt-1">Click "Add Reward" to create your first redeemable perk.</p>
            </div>
          ) : filteredRewards.length === 0 ? (
            <div className="text-center py-10">
              <Search size={32} className="mx-auto text-gray-300 mb-2" />
              <p className="text-sm font-bold text-gray-800">No matching perks found</p>
              <p className="text-xs text-gray-400 mt-1">Try another category or search keyword.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {paginatedRewards.map((reward) => {
                const category = getCategoryBadge(reward.category)
                return (
                  <div
                    key={reward.id}
                    onMouseEnter={() => setHoveredReward(reward.id)}
                    onMouseLeave={() => setHoveredReward(null)}
                    className={`p-3.5 rounded-2xl border transition-all flex flex-col justify-between ${
                      hoveredReward === reward.id 
                        ? 'border-primary-300 bg-gray-50/60 shadow-xs' 
                        : 'border-gray-200/80 bg-white'
                    }`}
                  >
                    <div>
                      <div className="flex items-start gap-3">
                        <div className="w-12 h-12 rounded-2xl bg-gray-100 flex items-center justify-center text-2xl shrink-0">
                          {reward.image}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-1">
                            <h4 className="text-xs sm:text-sm font-bold text-gray-900 truncate">{reward.name}</h4>
                            <span className="text-xs font-extrabold text-primary-600 shrink-0">
                              {reward.points.toLocaleString()} pts
                            </span>
                          </div>
                          <div className="flex items-center gap-1.5 mt-1 flex-wrap">
                            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-bold border ${category.bg}`}>
                              {category.icon}
                              {reward.category}
                            </span>
                            {reward.popular && (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
                                <Star size={8} className="fill-amber-500 text-amber-500" />
                                Popular
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      <p className="text-xs text-gray-500 mt-2 line-clamp-2 leading-relaxed">
                        {reward.description || 'Exclusive loyalty reward redemption opportunity.'}
                      </p>
                    </div>

                    <div className="flex items-center justify-between mt-3 pt-2.5 border-t border-gray-100 text-xs">
                      <span className="text-[11px] text-gray-400 font-medium">
                        {reward.used} redeemed · Stock: {reward.stock}
                      </span>
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => handleEditReward(reward)}
                          className="p-1.5 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-all"
                          title="Edit perk"
                        >
                          <Edit size={12} />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteReward(reward.id)}
                          className="p-1.5 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all"
                          title="Delete perk"
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>

      {/* Pagination Footer */}
      {totalPages > 1 && (
        <div className="p-3.5 border-t border-gray-100 flex items-center justify-between bg-white">
          <p className="text-xs text-gray-400">
            {filteredRewards.length} catalog perks
          </p>
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-1.5 text-gray-500 hover:text-gray-900 disabled:opacity-40 rounded-xl"
            >
              <ChevronLeft size={14} />
            </button>
            <span className="text-xs font-bold px-2 py-0.5 rounded bg-gray-100 text-gray-700">
              {currentPage} / {totalPages}
            </span>
            <button
              type="button"
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-1.5 text-gray-500 hover:text-gray-900 disabled:opacity-40 rounded-xl"
            >
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
      )}

      {/* Add / Edit Reward Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="bg-white rounded-3xl border border-gray-200/80 shadow-2xl max-w-md w-full p-6 animate-fadeIn">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Gift size={20} className="text-primary-600" />
                <h3 className="text-lg font-extrabold text-gray-900">
                  {editingReward ? 'Edit Catalog Perk' : 'Create New Perk'}
                </h3>
              </div>
              <button 
                type="button"
                onClick={() => setShowAddModal(false)}
                className="p-1.5 text-gray-400 hover:text-gray-700 rounded-xl hover:bg-gray-100"
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Perk Title</label>
                <input
                  type="text"
                  placeholder="e.g. ₹500 Discount Voucher"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3.5 py-2.5 text-xs sm:text-sm border border-gray-200 rounded-xl focus:outline-none focus:border-primary-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Required Points</label>
                  <input
                    type="number"
                    placeholder="e.g. 500"
                    value={formData.points}
                    onChange={(e) => setFormData({ ...formData, points: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-xs sm:text-sm border border-gray-200 rounded-xl focus:outline-none focus:border-primary-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-xs sm:text-sm border border-gray-200 rounded-xl focus:outline-none focus:border-primary-500"
                  >
                    <option value="discount">Discount Voucher</option>
                    <option value="shipping">Free Shipping</option>
                    <option value="gift">Physical Gift</option>
                    <option value="product">Free Product</option>
                    <option value="access">VIP Access</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Description</label>
                <textarea
                  rows={2}
                  placeholder="Terms and details about the reward..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3.5 py-2 text-xs sm:text-sm border border-gray-200 rounded-xl focus:outline-none focus:border-primary-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-xs font-bold text-gray-600 hover:bg-gray-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleAddReward}
                  className="px-4 py-2 text-xs font-bold text-white bg-primary-600 hover:bg-primary-700 rounded-xl shadow-xs"
                >
                  Save Perk
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}