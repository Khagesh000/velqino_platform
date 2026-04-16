"use client"

import React, { useState, useEffect } from 'react'
import { Megaphone, Calendar, Gift, Star, Users, TrendingUp, Plus, Edit, Trash2, Eye, CheckCircle, X, Save, Search, Filter, ChevronLeft, ChevronRight, Clock, Rocket } from '../../../../utils/icons'
import '../../../../styles/Retailer/RetailerLoyalty/Campaigns.scss'

export default function Campaigns() {
  const [mounted, setMounted] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [currentPage, setCurrentPage] = useState(1)
  const [hoveredCampaign, setHoveredCampaign] = useState(null)
  const [showAddModal, setShowAddModal] = useState(false)
  const [editingCampaign, setEditingCampaign] = useState(null)
  const [formData, setFormData] = useState({
    name: '',
    type: '',
    bonusPoints: '',
    startDate: '',
    endDate: '',
    description: '',
    eligibility: 'all'
  })
  const itemsPerPage = 4

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  const campaigns = [
    { id: 1, name: 'Weekend Special', type: 'bonus', bonusPoints: 50, startDate: '2026-04-01', endDate: '2026-04-30', status: 'active', description: 'Double points on weekend purchases', redeemed: 245, eligible: 'all' },
    { id: 2, name: 'Birthday Month', type: 'birthday', bonusPoints: 100, startDate: '2026-04-01', endDate: '2026-04-30', status: 'active', description: '100 bonus points for birthday month customers', redeemed: 89, eligible: 'birthday' },
    { id: 3, name: 'Referral Program', type: 'referral', bonusPoints: 200, startDate: '2026-03-01', endDate: '2026-05-31', status: 'active', description: 'Get 200 points for each successful referral', redeemed: 156, eligible: 'all' },
    { id: 4, name: 'Festival Sale', type: 'bonus', bonusPoints: 100, startDate: '2026-05-01', endDate: '2026-05-15', status: 'scheduled', description: '100 bonus points on orders above ₹2000', redeemed: 0, eligible: 'all' },
    { id: 5, name: 'New Year Special', type: 'bonus', bonusPoints: 150, startDate: '2025-12-25', endDate: '2026-01-05', status: 'expired', description: 'New Year celebration bonus', redeemed: 890, eligible: 'all' },
    { id: 6, name: 'First Purchase', type: 'welcome', bonusPoints: 50, startDate: '2026-01-01', endDate: '2026-12-31', status: 'active', description: 'Welcome bonus for new customers', redeemed: 234, eligible: 'new' },
  ]

  const getTypeConfig = (type) => {
    switch(type) {
      case 'bonus':
        return { bg: 'bg-green-100', text: 'text-green-700', icon: <Star size={12} />, label: 'Bonus Points' }
      case 'birthday':
        return { bg: 'bg-pink-100', text: 'text-pink-700', icon: <Gift size={12} />, label: 'Birthday' }
      case 'referral':
        return { bg: 'bg-blue-100', text: 'text-blue-700', icon: <Users size={12} />, label: 'Referral' }
      case 'welcome':
        return { bg: 'bg-purple-100', text: 'text-purple-700', icon: <Rocket size={12} />, label: 'Welcome' }
      default:
        return { bg: 'bg-gray-100', text: 'text-gray-700', icon: <Megaphone size={12} />, label: type }
    }
  }

  const getStatusBadge = (status) => {
    switch(status) {
      case 'active':
        return { bg: 'bg-green-100', text: 'text-green-700', icon: <CheckCircle size={10} />, label: 'Active' }
      case 'scheduled':
        return { bg: 'bg-yellow-100', text: 'text-yellow-700', icon: <Clock size={10} />, label: 'Scheduled' }
      case 'expired':
        return { bg: 'bg-gray-100', text: 'text-gray-700', icon: <X size={10} />, label: 'Expired' }
      default:
        return { bg: 'bg-gray-100', text: 'text-gray-700', icon: <Clock size={10} />, label: status }
    }
  }

  const filteredCampaigns = campaigns.filter(campaign => {
    const matchesSearch = searchQuery === '' || 
      campaign.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      campaign.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === 'all' || campaign.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const totalPages = Math.ceil(filteredCampaigns.length / itemsPerPage)
  const paginatedCampaigns = filteredCampaigns.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

  const summary = {
    active: campaigns.filter(c => c.status === 'active').length,
    scheduled: campaigns.filter(c => c.status === 'scheduled').length,
    totalRedeemed: campaigns.reduce((sum, c) => sum + c.redeemed, 0),
    bonusGiven: campaigns.reduce((sum, c) => sum + (c.redeemed * c.bonusPoints), 0)
  }

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })
  }

  const handleAddCampaign = () => {
    if (!formData.name || !formData.bonusPoints) return
    setShowAddModal(false)
    setFormData({ name: '', type: '', bonusPoints: '', startDate: '', endDate: '', description: '', eligibility: 'all' })
  }

  return (
    <div className="campaigns bg-white rounded-xl shadow-sm border border-gray-100 h-full">
      {/* Header */}
      <div className="p-4 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Megaphone size={18} className="text-primary-500" />
            <h3 className="text-base font-semibold text-gray-900">Campaigns</h3>
            <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
              {filteredCampaigns.length} campaigns
            </span>
          </div>
          <button
            onClick={() => {
              setEditingCampaign(null)
              setFormData({ name: '', type: '', bonusPoints: '', startDate: '', endDate: '', description: '', eligibility: 'all' })
              setShowAddModal(true)
            }}
            className="px-3 py-1.5 text-xs font-medium bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-all flex items-center gap-1"
          >
            <Plus size={12} />
            Create Campaign
          </button>
        </div>
        <p className="text-xs text-gray-500 mt-1">Special offers and bonus points campaigns</p>
      </div>

      {/* Summary Stats */}
      <div className="p-4 grid grid-cols-4 gap-2 border-b border-gray-100 bg-gray-50">
        <div className="text-center">
          <p className="text-lg font-bold text-green-600">{summary.active}</p>
          <p className="text-[10px] text-gray-500">Active</p>
        </div>
        <div className="text-center">
          <p className="text-lg font-bold text-yellow-600">{summary.scheduled}</p>
          <p className="text-[10px] text-gray-500">Scheduled</p>
        </div>
        <div className="text-center">
          <p className="text-lg font-bold text-blue-600">{summary.totalRedeemed.toLocaleString()}</p>
          <p className="text-[10px] text-gray-500">Redeemed</p>
        </div>
        <div className="text-center">
          <p className="text-lg font-bold text-purple-600">{summary.bonusGiven.toLocaleString()}</p>
          <p className="text-[10px] text-gray-500">Bonus Given</p>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="p-4 border-b border-gray-100">
        <div className="flex flex-col sm:flex-row gap-2">
          <div className="flex-1 relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search campaigns..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-primary-500"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-primary-500"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="scheduled">Scheduled</option>
            <option value="expired">Expired</option>
          </select>
        </div>
      </div>

      {/* Campaigns List */}
      <div className="p-4 max-h-[350px] overflow-y-auto custom-scroll">
        <div className="space-y-3">
          {paginatedCampaigns.length === 0 ? (
            <div className="text-center py-8">
              <Megaphone size={32} className="mx-auto text-gray-300 mb-2" />
              <p className="text-sm text-gray-500">No campaigns found</p>
            </div>
          ) : (
            paginatedCampaigns.map((campaign, index) => {
              const typeConfig = getTypeConfig(campaign.type)
              const statusConfig = getStatusBadge(campaign.status)
              return (
                <div
                  key={campaign.id}
                  className={`campaign-card border rounded-lg p-3 transition-all ${hoveredCampaign === campaign.id ? 'shadow-md transform -translate-y-0.5 border-primary-300' : 'border-gray-200'}`}
                  onMouseEnter={() => setHoveredCampaign(campaign.id)}
                  onMouseLeave={() => setHoveredCampaign(null)}
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${typeConfig.bg}`}>
                        {typeConfig.icon}
                      </div>
                      <div>
                        <h4 className="text-sm font-semibold text-gray-900">{campaign.name}</h4>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium ${typeConfig.bg} ${typeConfig.text}`}>
                            {typeConfig.icon}
                            {typeConfig.label}
                          </span>
                          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium ${statusConfig.bg} ${statusConfig.text}`}>
                            {statusConfig.icon}
                            {statusConfig.label}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-primary-600">+{campaign.bonusPoints} pts</p>
                      <p className="text-[10px] text-gray-500">{campaign.redeemed} redeemed</p>
                    </div>
                  </div>

                  <p className="text-xs text-gray-600 mb-2">{campaign.description}</p>

                  <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
                    <div className="flex items-center gap-1">
                      <Calendar size={10} className="text-gray-400" />
                      <span>{formatDate(campaign.startDate)} - {formatDate(campaign.endDate)}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Users size={10} className="text-gray-400" />
                      <span>{campaign.eligibility === 'all' ? 'All Customers' : campaign.eligibility === 'new' ? 'New Customers' : 'Birthday Customers'}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-100">
                    <div className="flex items-center gap-1 text-[10px] text-gray-500">
                      <TrendingUp size={10} className="text-green-500" />
                      <span>Engagement: {(campaign.redeemed / 500 * 100).toFixed(1)}%</span>
                    </div>
                    <div className="flex gap-1">
                      <button className="p-1 text-gray-400 hover:text-primary-600 rounded-lg">
                        <Eye size={12} />
                      </button>
                      <button onClick={() => setEditingCampaign(campaign)} className="p-1 text-gray-400 hover:text-primary-600 rounded-lg">
                        <Edit size={12} />
                      </button>
                      <button className="p-1 text-gray-400 hover:text-red-600 rounded-lg">
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

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="px-4 py-3 border-t border-gray-100 flex items-center justify-between">
          <p className="text-[10px] text-gray-500">
            {filteredCampaigns.length} campaigns
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

      {/* Add/Edit Campaign Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 animate-fadeIn">
          <div className="bg-white rounded-xl max-w-md w-full p-5">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Megaphone size={18} className="text-primary-500" />
                <h3 className="text-lg font-semibold text-gray-900">
                  {editingCampaign ? 'Edit Campaign' : 'Create Campaign'}
                </h3>
              </div>
              <button onClick={() => setShowAddModal(false)} className="p-1 text-gray-400 hover:text-gray-600">
                <X size={20} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Campaign Name</label>
                <input
                  type="text"
                  placeholder="e.g., Weekend Special"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-primary-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Campaign Type</label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-primary-500"
                  >
                    <option value="">Select</option>
                    <option value="bonus">Bonus Points</option>
                    <option value="birthday">Birthday</option>
                    <option value="referral">Referral</option>
                    <option value="welcome">Welcome</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Bonus Points</label>
                  <input
                    type="number"
                    placeholder="Points"
                    value={formData.bonusPoints}
                    onChange={(e) => setFormData({ ...formData, bonusPoints: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-primary-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                  <input
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-primary-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                  <input
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-primary-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Eligibility</label>
                <select
                  value={formData.eligibility}
                  onChange={(e) => setFormData({ ...formData, eligibility: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-primary-500"
                >
                  <option value="all">All Customers</option>
                  <option value="new">New Customers Only</option>
                  <option value="birthday">Birthday Customers</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  rows={2}
                  placeholder="Campaign description..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-primary-500 resize-none"
                />
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
                onClick={handleAddCampaign}
                className="flex-1 px-4 py-2 text-sm bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-all"
              >
                {editingCampaign ? 'Update' : 'Create'} Campaign
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}