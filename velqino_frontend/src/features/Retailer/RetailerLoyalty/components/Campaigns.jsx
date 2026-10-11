"use client"

import React, { useState, useEffect } from 'react'
import { 
  Megaphone, Calendar, Gift, Star, Users, TrendingUp, 
  Plus, Edit, Trash2, Eye, CheckCircle, X, Save, Search, 
  Filter, ChevronLeft, ChevronRight, Clock, Rocket, Sparkles 
} from '../../../../utils/icons'

export default function Campaigns({ onRefresh, campaigns = [] }) {
  const [mounted, setMounted] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [currentPage, setCurrentPage] = useState(1)
  const [hoveredCampaign, setHoveredCampaign] = useState(null)
  const [showAddModal, setShowAddModal] = useState(false)
  const [editingCampaign, setEditingCampaign] = useState(null)
  const [formData, setFormData] = useState({
    name: '',
    type: 'bonus',
    bonusPoints: '',
    startDate: '',
    endDate: '',
    description: '',
    eligibility: 'all'
  })
  const itemsPerPage = 3

  useEffect(() => {
    setMounted(true)
  }, [])

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1)
  }, [searchQuery, statusFilter])

  if (!mounted) return null

  // Transform backend campaigns to component format
  const transformedCampaigns = campaigns.map(campaign => ({
    id: campaign.id,
    name: campaign.name,
    type: campaign.campaign_type || 'bonus',
    bonusPoints: campaign.bonus_points || 0,
    startDate: campaign.start_date?.split('T')[0] || '',
    endDate: campaign.end_date?.split('T')[0] || '',
    status: campaign.status || 'active',
    description: campaign.description || '',
    redeemed: campaign.total_redeemed || 0,
    eligible: campaign.eligible_tiers?.length > 0 ? campaign.eligible_tiers.join(', ') : 'all'
  }))

  const getTypeConfig = (type) => {
    switch(type) {
      case 'bonus':
        return { bg: 'bg-emerald-50 text-emerald-800 border-emerald-200', icon: <Star size={12} className="text-emerald-600" />, label: 'Bonus Points' }
      case 'birthday':
        return { bg: 'bg-pink-50 text-pink-800 border-pink-200', icon: <Gift size={12} className="text-pink-600" />, label: 'Birthday' }
      case 'referral':
        return { bg: 'bg-sky-50 text-sky-800 border-sky-200', icon: <Users size={12} className="text-sky-600" />, label: 'Referral' }
      case 'welcome':
        return { bg: 'bg-purple-50 text-purple-800 border-purple-200', icon: <Rocket size={12} className="text-purple-600" />, label: 'Welcome Bonus' }
      case 'festival':
        return { bg: 'bg-amber-50 text-amber-800 border-amber-200', icon: <Megaphone size={12} className="text-amber-600" />, label: 'Festival Special' }
      default:
        return { bg: 'bg-gray-100 text-gray-800 border-gray-200', icon: <Megaphone size={12} />, label: type }
    }
  }

  const getStatusBadge = (status) => {
    switch(status) {
      case 'active':
        return { bg: 'bg-emerald-50 text-emerald-700 border-emerald-200', icon: <CheckCircle size={10} />, label: 'Active' }
      case 'scheduled':
        return { bg: 'bg-amber-50 text-amber-700 border-amber-200', icon: <Clock size={10} />, label: 'Scheduled' }
      case 'expired':
        return { bg: 'bg-gray-100 text-gray-600 border-gray-200', icon: <X size={10} />, label: 'Expired' }
      case 'cancelled':
        return { bg: 'bg-rose-50 text-rose-700 border-rose-200', icon: <X size={10} />, label: 'Cancelled' }
      default:
        return { bg: 'bg-gray-100 text-gray-700 border-gray-200', icon: <Clock size={10} />, label: status }
    }
  }

  const filteredCampaigns = transformedCampaigns.filter(campaign => {
    const matchesSearch = searchQuery === '' || 
      campaign.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      campaign.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === 'all' || campaign.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const totalPages = Math.ceil(filteredCampaigns.length / itemsPerPage)
  const paginatedCampaigns = filteredCampaigns.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

  const summary = {
    active: transformedCampaigns.filter(c => c.status === 'active').length,
    scheduled: transformedCampaigns.filter(c => c.status === 'scheduled').length,
    totalRedeemed: transformedCampaigns.reduce((sum, c) => sum + c.redeemed, 0),
    bonusGiven: transformedCampaigns.reduce((sum, c) => sum + (c.redeemed * c.bonusPoints), 0)
  }

  const formatDate = (date) => {
    if (!date) return 'N/A'
    return new Date(date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })
  }

  const handleAddCampaign = async () => {
    if (!formData.name || !formData.bonusPoints) return
    setShowAddModal(false)
    setFormData({ name: '', type: 'bonus', bonusPoints: '', startDate: '', endDate: '', description: '', eligibility: 'all' })
    if (onRefresh) onRefresh()
  }

  const handleEditCampaign = (campaign) => {
    setEditingCampaign(campaign)
    setFormData({
      name: campaign.name,
      type: campaign.type,
      bonusPoints: campaign.bonusPoints.toString(),
      startDate: campaign.startDate,
      endDate: campaign.endDate,
      description: campaign.description,
      eligibility: campaign.eligible
    })
    setShowAddModal(true)
  }

  const handleDeleteCampaign = async (campaignId) => {
    if (confirm('Are you sure you want to cancel this campaign?')) {
      if (onRefresh) onRefresh()
    }
  }

  return (
    <div className="bg-white rounded-3xl border border-gray-200/80 shadow-2xs h-full flex flex-col justify-between overflow-hidden">
      <div>
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-gray-100">
          <div className="flex items-center justify-between gap-3 mb-4 flex-wrap">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
                <Megaphone size={18} />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base sm:text-lg font-extrabold text-gray-900 tracking-tight">Promotional Campaigns</h3>
                  <span className="text-[11px] font-bold bg-purple-50 text-purple-800 border border-purple-200 px-2.5 py-0.5 rounded-full">
                    {filteredCampaigns.length} offers
                  </span>
                </div>
                <p className="text-xs text-gray-500 mt-0.5">Seasonal multipliers, birthday treats, and referral incentives</p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                setEditingCampaign(null)
                setFormData({ name: '', type: 'bonus', bonusPoints: '100', startDate: '', endDate: '', description: '', eligibility: 'all' })
                setShowAddModal(true)
              }}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold rounded-xl bg-primary-600 hover:bg-primary-700 active:scale-95 text-white shadow-xs transition-all"
            >
              <Plus size={13} />
              <span>Create Campaign</span>
            </button>
          </div>

          {/* Search Bar & Status Filters */}
          <div className="flex flex-col sm:flex-row gap-2.5">
            <div className="flex-1 relative">
              <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search campaigns..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm bg-gray-50/50 hover:bg-white focus:bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-primary-500 transition-all"
              />
            </div>
            
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
              {['all', 'active', 'scheduled', 'expired'].map(status => {
                const isActive = statusFilter === status
                return (
                  <button
                    key={status}
                    type="button"
                    onClick={() => setStatusFilter(status)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
                      isActive 
                        ? 'bg-purple-600 text-white shadow-xs' 
                        : 'bg-gray-100/80 text-gray-600 hover:bg-gray-200/70'
                    }`}
                  >
                    {status === 'all' ? 'All' : status.charAt(0).toUpperCase() + status.slice(1)}
                  </button>
                )
              })}
            </div>
          </div>
        </div>

        {/* 4 KPI Summary Ribbon */}
        <div className="grid grid-cols-4 gap-2.5 p-3.5 bg-gray-50/60 border-b border-gray-100 text-center">
          <div className="bg-white p-2.5 rounded-2xl border border-gray-200/60 shadow-2xs">
            <p className="text-[10px] font-bold uppercase text-emerald-700">Active</p>
            <p className="text-base font-extrabold text-emerald-800 mt-0.5">{summary.active}</p>
          </div>
          <div className="bg-white p-2.5 rounded-2xl border border-gray-200/60 shadow-2xs">
            <p className="text-[10px] font-bold uppercase text-amber-600">Scheduled</p>
            <p className="text-base font-extrabold text-amber-700 mt-0.5">{summary.scheduled}</p>
          </div>
          <div className="bg-white p-2.5 rounded-2xl border border-gray-200/60 shadow-2xs">
            <p className="text-[10px] font-bold uppercase text-primary-600">Redeemed</p>
            <p className="text-base font-extrabold text-primary-700 mt-0.5">{summary.totalRedeemed.toLocaleString()}</p>
          </div>
          <div className="bg-white p-2.5 rounded-2xl border border-gray-200/60 shadow-2xs">
            <p className="text-[10px] font-bold uppercase text-purple-600">Bonus Pool</p>
            <p className="text-base font-extrabold text-purple-700 mt-0.5">{summary.bonusGiven.toLocaleString()}</p>
          </div>
        </div>

        {/* Campaigns List */}
        <div className="p-4 sm:p-5 max-h-[360px] overflow-y-auto space-y-3">
          {transformedCampaigns.length === 0 ? (
            <div className="text-center py-10">
              <Megaphone size={32} className="mx-auto text-gray-300 mb-2" />
              <p className="text-sm font-bold text-gray-800">No campaigns launched</p>
              <p className="text-xs text-gray-400 mt-1">Click "Create Campaign" to launch bonus multipliers.</p>
            </div>
          ) : filteredCampaigns.length === 0 ? (
            <div className="text-center py-10">
              <Search size={32} className="mx-auto text-gray-300 mb-2" />
              <p className="text-sm font-bold text-gray-800">No matching campaigns found</p>
            </div>
          ) : (
            paginatedCampaigns.map((campaign) => {
              const typeConfig = getTypeConfig(campaign.type)
              const statusConfig = getStatusBadge(campaign.status)
              return (
                <div
                  key={campaign.id}
                  onMouseEnter={() => setHoveredCampaign(campaign.id)}
                  onMouseLeave={() => setHoveredCampaign(null)}
                  className={`p-3.5 rounded-2xl border transition-all ${
                    hoveredCampaign === campaign.id 
                      ? 'border-primary-300 bg-gray-50/60 shadow-xs' 
                      : 'border-gray-200/80 bg-white'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="flex items-center gap-3">
                      <div className={`w-9 h-9 rounded-2xl flex items-center justify-center shrink-0 border ${typeConfig.bg}`}>
                        {typeConfig.icon}
                      </div>
                      <div>
                        <h4 className="text-xs sm:text-sm font-bold text-gray-900 leading-snug">{campaign.name}</h4>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-bold border ${typeConfig.bg}`}>
                            {typeConfig.label}
                          </span>
                          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-bold border ${statusConfig.bg}`}>
                            {statusConfig.icon}
                            {statusConfig.label}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-xs sm:text-sm font-extrabold text-primary-600">+{campaign.bonusPoints.toLocaleString()} pts</p>
                      <p className="text-[10px] text-gray-400">{campaign.redeemed.toLocaleString()} claimed</p>
                    </div>
                  </div>

                  <p className="text-xs text-gray-500 mb-2.5 line-clamp-2 leading-relaxed">
                    {campaign.description || 'Special multiplier campaign active for VIP patrons.'}
                  </p>

                  <div className="flex items-center justify-between text-xs text-gray-500 pt-2 border-t border-gray-100 flex-wrap gap-2">
                    <div className="flex items-center gap-1 text-[11px] text-gray-400">
                      <Calendar size={11} className="shrink-0" />
                      <span>{formatDate(campaign.startDate)} - {formatDate(campaign.endDate)}</span>
                    </div>
                    <div className="flex items-center gap-1 text-[11px] text-gray-500">
                      <Users size={11} className="text-gray-400 shrink-0" />
                      <span className="font-semibold">{campaign.eligible === 'all' ? 'All Members' : campaign.eligible}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => handleEditCampaign(campaign)}
                        className="p-1 text-gray-400 hover:text-primary-600 rounded-lg"
                        title="Edit campaign"
                      >
                        <Edit size={12} />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteCampaign(campaign.id)}
                        className="p-1 text-gray-400 hover:text-rose-600 rounded-lg"
                        title="Cancel campaign"
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  </div>
                </div>
              )
            })
          )}
        </div>
      </div>

      {/* Pagination Footer */}
      {totalPages > 1 && (
        <div className="p-3.5 border-t border-gray-100 flex items-center justify-between bg-white">
          <p className="text-xs text-gray-400">
            {filteredCampaigns.length} campaigns
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

      {/* Add / Edit Campaign Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="bg-white rounded-3xl border border-gray-200/80 shadow-2xl max-w-md w-full p-6 animate-fadeIn">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Megaphone size={20} className="text-primary-600" />
                <h3 className="text-lg font-extrabold text-gray-900">
                  {editingCampaign ? 'Edit Campaign' : 'Create Campaign'}
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
                <label className="block text-xs font-bold text-gray-700 mb-1">Campaign Title</label>
                <input
                  type="text"
                  placeholder="e.g. Diwali Mega Multiplier"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3.5 py-2.5 text-xs sm:text-sm border border-gray-200 rounded-xl focus:outline-none focus:border-primary-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Type</label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-xs sm:text-sm border border-gray-200 rounded-xl focus:outline-none focus:border-primary-500"
                  >
                    <option value="bonus">Bonus Points</option>
                    <option value="birthday">Birthday Special</option>
                    <option value="referral">Friend Referral</option>
                    <option value="welcome">Welcome Onboarding</option>
                    <option value="festival">Festival Special</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Bonus Points</label>
                  <input
                    type="number"
                    placeholder="e.g. 200"
                    value={formData.bonusPoints}
                    onChange={(e) => setFormData({ ...formData, bonusPoints: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-xs sm:text-sm border border-gray-200 rounded-xl focus:outline-none focus:border-primary-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Start Date</label>
                  <input
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-gray-200 rounded-xl focus:outline-none focus:border-primary-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">End Date</label>
                  <input
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-gray-200 rounded-xl focus:outline-none focus:border-primary-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Description</label>
                <textarea
                  rows={2}
                  placeholder="Terms and trigger conditions..."
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
                  onClick={handleAddCampaign}
                  className="px-4 py-2 text-xs font-bold text-white bg-primary-600 hover:bg-primary-700 rounded-xl shadow-xs"
                >
                  Save Campaign
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}