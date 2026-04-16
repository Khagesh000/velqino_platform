"use client"

import React, { useState, useEffect } from 'react'
import { Gift, Star, Award, Tag, Plus, Edit, Trash2, Eye, ShoppingCart, CheckCircle, X, Save, Search, Filter, ChevronLeft, ChevronRight } from '../../../../utils/icons'
import '../../../../styles/Retailer/RetailerLoyalty/RewardsCatalog.scss'

export default function RewardsCatalog() {
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
  const itemsPerPage = 6

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  const rewards = [
    { id: 1, name: '₹50 Off Coupon', points: 500, category: 'discount', description: 'Get ₹50 off on next purchase', image: '🏷️', stock: 45, popular: true, used: 120 },
    { id: 2, name: 'Free Shipping', points: 800, category: 'shipping', description: 'Free shipping on orders above ₹999', image: '🚚', stock: 100, popular: true, used: 85 },
    { id: 3, name: '10% Discount', points: 1000, category: 'discount', description: '10% off on total purchase', image: '💰', stock: 30, popular: false, used: 45 },
    { id: 4, name: '₹100 Gift Card', points: 1500, category: 'gift', description: '₹100 store credit', image: '🎁', stock: 20, popular: true, used: 62 },
    { id: 5, name: 'Free Product', points: 2500, category: 'product', description: 'Choose any product under ₹500', image: '🎁', stock: 10, popular: false, used: 18 },
    { id: 6, name: 'Premium T-Shirt', points: 3500, category: 'product', description: 'Exclusive premium cotton t-shirt', image: '👕', stock: 5, popular: true, used: 12 },
    { id: 7, name: '20% Discount', points: 2000, category: 'discount', description: '20% off on total purchase', image: '💰', stock: 25, popular: false, used: 38 },
    { id: 8, name: 'Early Access', points: 1200, category: 'access', description: 'Early access to new products', image: '🔑', stock: 999, popular: false, used: 28 },
  ]

  const categories = ['all', 'discount', 'shipping', 'gift', 'product', 'access']

  const filteredRewards = rewards.filter(reward => {
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
      case 'discount': return { bg: 'bg-green-100', text: 'text-green-700', icon: <Tag size={10} /> }
      case 'shipping': return { bg: 'bg-blue-100', text: 'text-blue-700', icon: <Gift size={10} /> }
      case 'gift': return { bg: 'bg-pink-100', text: 'text-pink-700', icon: <Gift size={10} /> }
      case 'product': return { bg: 'bg-purple-100', text: 'text-purple-700', icon: <Award size={10} /> }
      case 'access': return { bg: 'bg-orange-100', text: 'text-orange-700', icon: <Star size={10} /> }
      default: return { bg: 'bg-gray-100', text: 'text-gray-700', icon: <Gift size={10} /> }
    }
  }

  const handleAddReward = () => {
    if (!formData.name || !formData.points) return
    setShowAddModal(false)
    setFormData({ name: '', points: '', category: '', description: '', image: '', stock: '' })
  }

  const handleEditReward = (reward) => {
    setEditingReward(reward)
    setFormData({
      name: reward.name,
      points: reward.points.toString(),
      category: reward.category,
      description: reward.description,
      image: reward.image,
      stock: reward.stock.toString()
    })
    setShowAddModal(true)
  }

  const summary = {
    totalRewards: rewards.length,
    totalRedeemed: rewards.reduce((sum, r) => sum + r.used, 0),
    popularRewards: rewards.filter(r => r.popular).length,
    lowStock: rewards.filter(r => r.stock < 20).length
  }

  return (
    <div className="rewards-catalog bg-white rounded-xl shadow-sm border border-gray-100 h-full">
      {/* Header */}
      <div className="p-4 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Gift size={18} className="text-primary-500" />
            <h3 className="text-base font-semibold text-gray-900">Rewards Catalog</h3>
            <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
              {filteredRewards.length} rewards
            </span>
          </div>
          <button
            onClick={() => {
              setEditingReward(null)
              setFormData({ name: '', points: '', category: '', description: '', image: '', stock: '' })
              setShowAddModal(true)
            }}
            className="px-3 py-1.5 text-xs font-medium bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-all flex items-center gap-1"
          >
            <Plus size={12} />
            Add Reward
          </button>
        </div>
        <p className="text-xs text-gray-500 mt-1">Available rewards for customer redemption</p>
      </div>

      {/* Summary Stats */}
      <div className="p-4 grid grid-cols-4 gap-2 border-b border-gray-100 bg-gray-50">
        <div className="text-center">
          <p className="text-lg font-bold text-gray-900">{summary.totalRewards}</p>
          <p className="text-[10px] text-gray-500">Total Rewards</p>
        </div>
        <div className="text-center">
          <p className="text-lg font-bold text-green-600">{summary.totalRedeemed.toLocaleString()}</p>
          <p className="text-[10px] text-gray-500">Total Redeemed</p>
        </div>
        <div className="text-center">
          <p className="text-lg font-bold text-yellow-600">{summary.popularRewards}</p>
          <p className="text-[10px] text-gray-500">Popular</p>
        </div>
        <div className="text-center">
          <p className="text-lg font-bold text-red-600">{summary.lowStock}</p>
          <p className="text-[10px] text-gray-500">Low Stock</p>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="p-4 border-b border-gray-100">
        <div className="flex flex-col sm:flex-row gap-2">
          <div className="flex-1 relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search rewards..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-primary-500"
            />
          </div>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-primary-500"
          >
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat === 'all' ? 'All Categories' : cat.charAt(0).toUpperCase() + cat.slice(1)}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Rewards Grid */}
      <div className="p-4 max-h-[360px] overflow-y-auto custom-scroll">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {paginatedRewards.length === 0 ? (
            <div className="col-span-2 text-center py-8">
              <Gift size={32} className="mx-auto text-gray-300 mb-2" />
              <p className="text-sm text-gray-500">No rewards found</p>
            </div>
          ) : (
            paginatedRewards.map((reward, index) => {
              const category = getCategoryBadge(reward.category)
              return (
                <div
                  key={reward.id}
                  className={`reward-card border rounded-lg p-3 transition-all ${hoveredReward === reward.id ? 'shadow-md transform -translate-y-0.5 border-primary-300' : 'border-gray-200'}`}
                  onMouseEnter={() => setHoveredReward(reward.id)}
                  onMouseLeave={() => setHoveredReward(null)}
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  <div className="flex items-start gap-3">
                    <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center text-2xl">
                      {reward.image}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="text-sm font-semibold text-gray-900">{reward.name}</h4>
                          <div className="flex items-center gap-1 mt-0.5">
                            <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[9px] font-medium ${category.bg} ${category.text}`}>
                              {category.icon}
                              {reward.category}
                            </span>
                            {reward.popular && (
                              <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[9px] font-medium bg-yellow-100 text-yellow-700">
                                <Star size={8} />
                                Popular
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-bold text-primary-600">{reward.points} pts</p>
                          <p className="text-[10px] text-gray-500">Stock: {reward.stock}</p>
                        </div>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">{reward.description}</p>
                      <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-100">
                        <div className="flex items-center gap-1 text-[10px] text-gray-500">
                          <CheckCircle size={10} className="text-green-500" />
                          <span>{reward.used} redeemed</span>
                        </div>
                        <div className="flex gap-1">
                          <button className="p-1 text-gray-400 hover:text-primary-600 rounded-lg">
                            <Eye size={12} />
                          </button>
                          <button onClick={() => handleEditReward(reward)} className="p-1 text-gray-400 hover:text-primary-600 rounded-lg">
                            <Edit size={12} />
                          </button>
                          <button className="p-1 text-gray-400 hover:text-red-600 rounded-lg">
                            <Trash2 size={12} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })
          )}
        </div>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="px-4 py-3 border-t border-gray-100 flex items-center justify-between">
          <p className="text-[10px] text-gray-500">
            {filteredRewards.length} rewards
          </p>
          <div className="flex gap-1">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-50 rounded"
            >
              <ChevronLeft size={12} />
            </button>
            <span className="text-xs text-gray-600">{currentPage} / {totalPages}</span>
            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-50 rounded"
            >
              <ChevronRight size={12} />
            </button>
          </div>
        </div>
      )}

      {/* Add/Edit Reward Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 animate-fadeIn">
          <div className="bg-white rounded-xl max-w-md w-full p-5">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Gift size={18} className="text-primary-500" />
                <h3 className="text-lg font-semibold text-gray-900">
                  {editingReward ? 'Edit Reward' : 'Add New Reward'}
                </h3>
              </div>
              <button onClick={() => setShowAddModal(false)} className="p-1 text-gray-400 hover:text-gray-600">
                <X size={20} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Reward Name</label>
                <input
                  type="text"
                  placeholder="e.g., ₹50 Off Coupon"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-primary-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Points Required</label>
                  <input
                    type="number"
                    placeholder="Points"
                    value={formData.points}
                    onChange={(e) => setFormData({ ...formData, points: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-primary-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-primary-500"
                  >
                    <option value="">Select</option>
                    <option value="discount">Discount</option>
                    <option value="shipping">Shipping</option>
                    <option value="gift">Gift Card</option>
                    <option value="product">Product</option>
                    <option value="access">Early Access</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  rows={2}
                  placeholder="Reward description..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-primary-500 resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Stock</label>
                  <input
                    type="number"
                    placeholder="Stock quantity"
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-primary-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Icon/Image</label>
                  <input
                    type="text"
                    placeholder="Emoji or image URL"
                    value={formData.image}
                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-primary-500"
                  />
                </div>
              </div>
            </div>

            <div className="flex gap-2 mt-5">
              <button
                onClick={() => setShowAddModal(false)}
                className="flex-1 px-4 py-2 text-sm text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleAddReward}
                className="flex-1 px-4 py-2 text-sm bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-all"
              >
                {editingReward ? 'Update' : 'Add'} Reward
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}