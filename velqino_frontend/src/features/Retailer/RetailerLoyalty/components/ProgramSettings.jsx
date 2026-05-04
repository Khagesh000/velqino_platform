"use client"

import React, { useState, useEffect } from 'react'
import { Settings, Star, Award, Gift, Save, Edit, X, CheckCircle, TrendingUp, Users, ShoppingBag } from '../../../../utils/icons'
import '../../../../styles/Retailer/RetailerLoyalty/ProgramSettings.scss'

export default function ProgramSettings() {
  const [mounted, setMounted] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [settings, setSettings] = useState({
    pointsPerRupee: 1,
    minRedemption: 100,
    maxRedemption: 5000,
    pointsExpiry: 6,
    welcomeBonus: 50,
    birthdayBonus: 100,
    referralBonus: 200
  })
  const [tiers, setTiers] = useState([
    { name: 'Bronze', minPoints: 0, benefits: ['Welcome bonus 50pts', 'Basic support'], color: 'bronze' },
    { name: 'Silver', minPoints: 500, benefits: ['2% extra points', 'Priority support'], color: 'silver' },
    { name: 'Gold', minPoints: 1500, benefits: ['5% extra points', 'Free shipping', 'Birthday bonus'], color: 'gold' },
    { name: 'Platinum', minPoints: 3000, benefits: ['10% extra points', 'Free express shipping', 'Exclusive offers', 'Dedicated manager'], color: 'platinum' }
  ])
  const [editingTier, setEditingTier] = useState(null)
  const [showSuccess, setShowSuccess] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  const handleSaveSettings = () => {
    setIsEditing(false)
    setShowSuccess(true)
    setTimeout(() => setShowSuccess(false), 2000)
  }

  const handleUpdateTier = (index, field, value) => {
    const newTiers = [...tiers]
    newTiers[index][field] = value
    setTiers(newTiers)
  }

  const getTierColor = (color) => {
    switch(color) {
      case 'bronze': return 'bg-orange-600'
      case 'silver': return 'bg-gray-400'
      case 'gold': return 'bg-yellow-500'
      case 'platinum': return 'bg-gradient-to-r from-gray-400 to-gray-600'
      default: return 'bg-gray-500'
    }
  }

  const summary = {
    totalMembers: 245,
    pointsEarned: 12500,
    pointsRedeemed: 4800,
    activeMembers: 189
  }

  return (
    <div className="program-settings bg-white rounded-xl shadow-sm border border-gray-100">
      {/* Header */}
      <div className="p-4 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Settings size={18} className="text-primary-500" />
            <h3 className="text-base font-semibold text-gray-900">Program Settings</h3>
          </div>
          {isEditing ? (
            <div className="flex gap-1">
              <button onClick={() => setIsEditing(false)} className="p-1 text-gray-400 hover:text-gray-600 rounded-lg">
                <X size={14} />
              </button>
              <button onClick={handleSaveSettings} className="p-1 text-green-500 hover:bg-green-50 rounded-lg">
                <Save size={14} />
              </button>
            </div>
          ) : (
            <button onClick={() => setIsEditing(true)} className="p-1 text-gray-400 hover:text-primary-600 rounded-lg">
              <Edit size={14} />
            </button>
          )}
        </div>
        <p className="text-xs text-gray-500 mt-1">Configure loyalty program rules</p>
      </div>

      {/* Success Message */}
      {showSuccess && (
        <div className="mx-4 mt-4 p-2 bg-green-100 rounded-lg flex items-center gap-2 animate-fadeIn">
          <CheckCircle size={14} className="text-green-600" />
          <span className="text-xs text-green-700">Settings saved successfully!</span>
        </div>
      )}

      {/* Stats Summary */}
      <div className="p-4 grid grid-cols-4 gap-2 border-b border-gray-100 bg-gray-50">
        <div className="text-center">
          <p className="text-lg font-bold text-gray-900">{summary.totalMembers}</p>
          <p className="text-[10px] text-gray-500">Total Members</p>
        </div>
        <div className="text-center">
          <p className="text-lg font-bold text-green-600">{summary.pointsEarned.toLocaleString()}</p>
          <p className="text-[10px] text-gray-500">Points Earned</p>
        </div>
        <div className="text-center">
          <p className="text-lg font-bold text-orange-600">{summary.pointsRedeemed.toLocaleString()}</p>
          <p className="text-[10px] text-gray-500">Points Redeemed</p>
        </div>
        <div className="text-center">
          <p className="text-lg font-bold text-blue-600">{summary.activeMembers}</p>
          <p className="text-[10px] text-gray-500">Active Members</p>
        </div>
      </div>

      {/* Settings Form */}
      <div className="p-4 border-b border-gray-100">
        <h4 className="text-xs font-semibold text-gray-700 uppercase tracking-wider mb-3">Point Rules</h4>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs text-gray-600 mb-1">Points per ₹1 spent</label>
            {isEditing ? (
              <input
                type="number"
                value={settings.pointsPerRupee}
                onChange={(e) => setSettings({ ...settings, pointsPerRupee: parseInt(e.target.value) })}
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-primary-500"
              />
            ) : (
              <p className="text-sm font-semibold text-gray-900">{settings.pointsPerRupee} point per ₹1</p>
            )}
          </div>
          <div>
            <label className="block text-xs text-gray-600 mb-1">Minimum Redemption (points)</label>
            {isEditing ? (
              <input
                type="number"
                value={settings.minRedemption}
                onChange={(e) => setSettings({ ...settings, minRedemption: parseInt(e.target.value) })}
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-primary-500"
              />
            ) : (
              <p className="text-sm font-semibold text-gray-900">{settings.minRedemption} points</p>
            )}
          </div>
          <div>
            <label className="block text-xs text-gray-600 mb-1">Maximum Redemption (points)</label>
            {isEditing ? (
              <input
                type="number"
                value={settings.maxRedemption}
                onChange={(e) => setSettings({ ...settings, maxRedemption: parseInt(e.target.value) })}
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-primary-500"
              />
            ) : (
              <p className="text-sm font-semibold text-gray-900">{settings.maxRedemption} points</p>
            )}
          </div>
          <div>
            <label className="block text-xs text-gray-600 mb-1">Points Expiry (months)</label>
            {isEditing ? (
              <input
                type="number"
                value={settings.pointsExpiry}
                onChange={(e) => setSettings({ ...settings, pointsExpiry: parseInt(e.target.value) })}
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-primary-500"
              />
            ) : (
              <p className="text-sm font-semibold text-gray-900">{settings.pointsExpiry} months</p>
            )}
          </div>
        </div>
      </div>

      {/* Bonus Settings */}
      <div className="p-4 border-b border-gray-100">
        <h4 className="text-xs font-semibold text-gray-700 uppercase tracking-wider mb-3">Bonuses</h4>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-xs text-gray-600 mb-1">Welcome Bonus</label>
            {isEditing ? (
              <input
                type="number"
                value={settings.welcomeBonus}
                onChange={(e) => setSettings({ ...settings, welcomeBonus: parseInt(e.target.value) })}
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-primary-500"
              />
            ) : (
              <p className="text-sm font-semibold text-gray-900">{settings.welcomeBonus} points</p>
            )}
          </div>
          <div>
            <label className="block text-xs text-gray-600 mb-1">Birthday Bonus</label>
            {isEditing ? (
              <input
                type="number"
                value={settings.birthdayBonus}
                onChange={(e) => setSettings({ ...settings, birthdayBonus: parseInt(e.target.value) })}
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-primary-500"
              />
            ) : (
              <p className="text-sm font-semibold text-gray-900">{settings.birthdayBonus} points</p>
            )}
          </div>
          <div>
            <label className="block text-xs text-gray-600 mb-1">Referral Bonus</label>
            {isEditing ? (
              <input
                type="number"
                value={settings.referralBonus}
                onChange={(e) => setSettings({ ...settings, referralBonus: parseInt(e.target.value) })}
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-primary-500"
              />
            ) : (
              <p className="text-sm font-semibold text-gray-900">{settings.referralBonus} points</p>
            )}
          </div>
        </div>
      </div>

      {/* Tier Settings */}
      <div className="p-4">
        <h4 className="text-xs font-semibold text-gray-700 uppercase tracking-wider mb-3">Membership Tiers</h4>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {tiers.map((tier, idx) => (
            <div key={tier.name} className={`rounded-lg p-3 text-white ${getTierColor(tier.color)}`}>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-1">
                  {tier.name === 'Bronze' && <Award size={14} />}
                  {tier.name === 'Silver' && <Award size={14} />}
                  {tier.name === 'Gold' && <Star size={14} />}
                  {tier.name === 'Platinum' && <Gift size={14} />}
                  <span className="text-sm font-bold">{tier.name}</span>
                </div>
                {isEditing && editingTier === idx ? (
                  <button onClick={() => setEditingTier(null)} className="text-white opacity-80">
                    <Save size={12} />
                  </button>
                ) : isEditing && (
                  <button onClick={() => setEditingTier(idx)} className="text-white opacity-80">
                    <Edit size={12} />
                  </button>
                )}
              </div>
              {editingTier === idx && isEditing ? (
                <input
                  type="number"
                  value={tier.minPoints}
                  onChange={(e) => handleUpdateTier(idx, 'minPoints', parseInt(e.target.value))}
                  className="w-full px-2 py-1 text-xs rounded bg-white/20 text-white placeholder-white/50"
                />
              ) : (
                <p className="text-xs opacity-90">{tier.minPoints}+ points</p>
              )}
              <ul className="mt-2 space-y-0.5">
                {tier.benefits.slice(0, 2).map((benefit, i) => (
                  <li key={i} className="text-[9px] opacity-80">✓ {benefit}</li>
                ))}
                {tier.benefits.length > 2 && (
                  <li className="text-[9px] opacity-80">+{tier.benefits.length - 2} more</li>
                )}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}