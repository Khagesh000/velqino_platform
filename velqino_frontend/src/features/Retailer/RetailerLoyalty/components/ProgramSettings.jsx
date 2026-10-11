"use client"

import React, { useState, useEffect } from 'react'
import { 
  Settings, Star, Award, Gift, Save, Edit, X, 
  CheckCircle, TrendingUp, Users, ShoppingBag, ShieldCheck, Sparkles 
} from '../../../../utils/icons'

export default function ProgramSettings({ onRefresh, settings: propSettings, tiers: propTiers, summary: propSummary }) {
  const [mounted, setMounted] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [settings, setSettings] = useState({
    points_per_rupee: 1,
    min_redemption_points: 100,
    max_redemption_points: 5000,
    points_expiry_months: 6,
    welcome_bonus_points: 50,
    birthday_bonus_points: 100,
    referral_bonus_points: 200
  })
  const [tiers, setTiers] = useState([
    { name: 'Bronze', minPoints: 0, benefits: ['Welcome bonus 50pts', 'Standard store rewards'], color: 'bronze' },
    { name: 'Silver', minPoints: 500, benefits: ['2% extra points', 'Priority billing desk'], color: 'silver' },
    { name: 'Gold', minPoints: 1500, benefits: ['5% extra points', 'Free home delivery', 'Birthday bonus treat'], color: 'gold' },
    { name: 'Platinum', minPoints: 3000, benefits: ['10% extra points', 'Complimentary express delivery', 'Exclusive VIP previews', 'Dedicated concierge'], color: 'platinum' }
  ])
  const [editingTier, setEditingTier] = useState(null)
  const [showSuccess, setShowSuccess] = useState(false)

  useEffect(() => {
    if (propSettings) {
      setSettings({
        points_per_rupee: propSettings.points_per_rupee || 1,
        min_redemption_points: propSettings.min_redemption_points || 100,
        max_redemption_points: propSettings.max_redemption_points || 5000,
        points_expiry_months: propSettings.points_expiry_months || 6,
        welcome_bonus_points: propSettings.welcome_bonus_points || 50,
        birthday_bonus_points: propSettings.birthday_bonus_points || 100,
        referral_bonus_points: propSettings.referral_bonus_points || 200
      })
    }
  }, [propSettings])

  useEffect(() => {
    if (propTiers) {
      setTiers(propTiers)
    }
  }, [propTiers])

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  const handleSaveSettings = () => {
    setIsEditing(false)
    setShowSuccess(true)
    setTimeout(() => setShowSuccess(false), 2500)
    if (onRefresh) onRefresh()
  }

  const handleUpdateTier = (index, field, value) => {
    const newTiers = [...tiers]
    newTiers[index][field] = value
    setTiers(newTiers)
  }

  const getTierCardTheme = (tierName) => {
    switch(tierName) {
      case 'Platinum':
        return {
          headerBg: 'bg-gradient-to-r from-slate-900 via-slate-800 to-slate-950 text-white',
          border: 'border-slate-800',
          badge: 'bg-white/10 text-amber-300 border-white/20',
          accent: 'text-amber-300',
          icon: <Award size={16} className="text-amber-300" />
        }
      case 'Gold':
        return {
          headerBg: 'bg-gradient-to-r from-amber-500 via-amber-600 to-amber-700 text-white',
          border: 'border-amber-300',
          badge: 'bg-white/20 text-white border-white/30',
          accent: 'text-amber-100',
          icon: <Star size={16} className="text-white fill-white" />
        }
      case 'Silver':
        return {
          headerBg: 'bg-gradient-to-r from-slate-500 to-slate-600 text-white',
          border: 'border-slate-300',
          badge: 'bg-white/20 text-white border-white/30',
          accent: 'text-slate-100',
          icon: <Star size={16} className="text-white" />
        }
      default: // Bronze
        return {
          headerBg: 'bg-gradient-to-r from-amber-700 to-amber-800 text-white',
          border: 'border-amber-400',
          badge: 'bg-white/20 text-white border-white/30',
          accent: 'text-amber-100',
          icon: <Award size={16} className="text-white" />
        }
    }
  }

  return (
    <div className="bg-white rounded-3xl border border-gray-200/80 shadow-2xs w-full overflow-hidden">
      {/* Header */}
      <div className="p-5 sm:p-6 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-primary-50 text-primary-600 flex items-center justify-center shrink-0">
            <Settings size={20} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base sm:text-lg font-extrabold text-gray-900 tracking-tight">Program Rules &amp; Tier Matrix</h3>
              <span className="text-[11px] font-bold bg-primary-50 text-primary-700 border border-primary-100 px-2.5 py-0.5 rounded-full">
                Live Configuration
              </span>
            </div>
            <p className="text-xs text-gray-500 mt-0.5">Define points conversion, minimum redemptions, expiry schedules, and tier threshold privileges</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {isEditing ? (
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="px-3.5 py-2 text-xs font-bold text-gray-600 hover:bg-gray-100 rounded-xl transition-all"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveSettings}
                className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-primary-600 hover:bg-primary-700 rounded-xl shadow-xs transition-all"
              >
                <Save size={13} />
                <span>Save Changes</span>
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setIsEditing(true)}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-gray-700 bg-white border border-gray-200 hover:bg-gray-50 active:scale-95 rounded-xl shadow-2xs transition-all"
            >
              <Edit size={13} />
              <span>Modify Rules</span>
            </button>
          )}
        </div>
      </div>

      {/* Success Notification Alert */}
      {showSuccess && (
        <div className="mx-6 mt-4 p-3 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center gap-2 text-xs font-bold text-emerald-800 animate-fadeIn">
          <CheckCircle size={16} className="text-emerald-600 shrink-0" />
          <span>Loyalty rules and tier thresholds updated successfully!</span>
        </div>
      )}

      {/* Core Rules & Bonuses (2 Columns Grid) */}
      <div className="p-5 sm:p-6 border-b border-gray-100 grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Point Accrual & Redemption Rules */}
        <div className="bg-gray-50/50 p-4 sm:p-5 rounded-2xl border border-gray-200/60 shadow-2xs">
          <div className="flex items-center gap-2 mb-4">
            <span className="w-2 h-2 rounded-full bg-primary-600 inline-block" />
            <h4 className="text-xs font-extrabold uppercase tracking-wider text-gray-700">Point Accrual &amp; Redemption</h4>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-white p-3.5 rounded-xl border border-gray-200/60 shadow-2xs">
              <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1">Accrual Rate</label>
              {isEditing ? (
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    value={settings.points_per_rupee}
                    onChange={(e) => setSettings({ ...settings, points_per_rupee: parseInt(e.target.value) || 1 })}
                    className="w-full px-3 py-1.5 text-xs border border-gray-200 rounded-lg focus:border-primary-500"
                  />
                  <span className="text-xs font-semibold text-gray-500 shrink-0">pts / ₹1</span>
                </div>
              ) : (
                <p className="text-sm font-extrabold text-gray-900">{settings.points_per_rupee} pt per ₹1 spent</p>
              )}
            </div>

            <div className="bg-white p-3.5 rounded-xl border border-gray-200/60 shadow-2xs">
              <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1">Min. Redemption</label>
              {isEditing ? (
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    value={settings.min_redemption_points}
                    onChange={(e) => setSettings({ ...settings, min_redemption_points: parseInt(e.target.value) || 0 })}
                    className="w-full px-3 py-1.5 text-xs border border-gray-200 rounded-lg focus:border-primary-500"
                  />
                  <span className="text-xs font-semibold text-gray-500 shrink-0">pts</span>
                </div>
              ) : (
                <p className="text-sm font-extrabold text-gray-900">{settings.min_redemption_points.toLocaleString()} pts</p>
              )}
            </div>

            <div className="bg-white p-3.5 rounded-xl border border-gray-200/60 shadow-2xs">
              <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1">Max. Redemption Cap</label>
              {isEditing ? (
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    value={settings.max_redemption_points}
                    onChange={(e) => setSettings({ ...settings, max_redemption_points: parseInt(e.target.value) || 0 })}
                    className="w-full px-3 py-1.5 text-xs border border-gray-200 rounded-lg focus:border-primary-500"
                  />
                  <span className="text-xs font-semibold text-gray-500 shrink-0">pts</span>
                </div>
              ) : (
                <p className="text-sm font-extrabold text-gray-900">{settings.max_redemption_points.toLocaleString()} pts</p>
              )}
            </div>

            <div className="bg-white p-3.5 rounded-xl border border-gray-200/60 shadow-2xs">
              <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1">Point Expiry Window</label>
              {isEditing ? (
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    value={settings.points_expiry_months}
                    onChange={(e) => setSettings({ ...settings, points_expiry_months: parseInt(e.target.value) || 6 })}
                    className="w-full px-3 py-1.5 text-xs border border-gray-200 rounded-lg focus:border-primary-500"
                  />
                  <span className="text-xs font-semibold text-gray-500 shrink-0">months</span>
                </div>
              ) : (
                <p className="text-sm font-extrabold text-gray-900">{settings.points_expiry_months} months</p>
              )}
            </div>
          </div>
        </div>

        {/* Automated Bonus Rewards */}
        <div className="bg-gray-50/50 p-4 sm:p-5 rounded-2xl border border-gray-200/60 shadow-2xs">
          <div className="flex items-center gap-2 mb-4">
            <span className="w-2 h-2 rounded-full bg-emerald-600 inline-block" />
            <h4 className="text-xs font-extrabold uppercase tracking-wider text-gray-700">Automated Milestone Rewards</h4>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="bg-white p-3.5 rounded-xl border border-gray-200/60 shadow-2xs">
              <label className="block text-[10px] font-bold text-purple-600 uppercase tracking-wider mb-1">Welcome Gift</label>
              {isEditing ? (
                <input
                  type="number"
                  value={settings.welcome_bonus_points}
                  onChange={(e) => setSettings({ ...settings, welcome_bonus_points: parseInt(e.target.value) || 0 })}
                  className="w-full px-2 py-1 text-xs border border-gray-200 rounded-lg focus:border-primary-500"
                />
              ) : (
                <p className="text-base font-extrabold text-purple-700 mt-1">+{settings.welcome_bonus_points} pts</p>
              )}
              <span className="text-[10px] text-gray-400 mt-0.5 block">Upon first sign-up</span>
            </div>

            <div className="bg-white p-3.5 rounded-xl border border-gray-200/60 shadow-2xs">
              <label className="block text-[10px] font-bold text-pink-600 uppercase tracking-wider mb-1">Birthday Treat</label>
              {isEditing ? (
                <input
                  type="number"
                  value={settings.birthday_bonus_points}
                  onChange={(e) => setSettings({ ...settings, birthday_bonus_points: parseInt(e.target.value) || 0 })}
                  className="w-full px-2 py-1 text-xs border border-gray-200 rounded-lg focus:border-primary-500"
                />
              ) : (
                <p className="text-base font-extrabold text-pink-700 mt-1">+{settings.birthday_bonus_points} pts</p>
              )}
              <span className="text-[10px] text-gray-400 mt-0.5 block">Annual celebration</span>
            </div>

            <div className="bg-white p-3.5 rounded-xl border border-gray-200/60 shadow-2xs">
              <label className="block text-[10px] font-bold text-sky-600 uppercase tracking-wider mb-1">Referral Reward</label>
              {isEditing ? (
                <input
                  type="number"
                  value={settings.referral_bonus_points}
                  onChange={(e) => setSettings({ ...settings, referral_bonus_points: parseInt(e.target.value) || 0 })}
                  className="w-full px-2 py-1 text-xs border border-gray-200 rounded-lg focus:border-primary-500"
                />
              ) : (
                <p className="text-base font-extrabold text-sky-700 mt-1">+{settings.referral_bonus_points} pts</p>
              )}
              <span className="text-[10px] text-gray-400 mt-0.5 block">When friend buys</span>
            </div>
          </div>
        </div>
      </div>

      {/* 4 Membership Tiers Matrix */}
      <div className="p-5 sm:p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h4 className="text-xs font-extrabold uppercase tracking-wider text-gray-700">Membership Tiers &amp; Privileges Matrix</h4>
            <p className="text-xs text-gray-500 mt-0.5">Shoppers automatically unlock higher tiers as their spending accumulates</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {tiers.map((tier, idx) => {
            const theme = getTierCardTheme(tier.name)
            return (
              <div 
                key={tier.name}
                className={`rounded-2xl border ${theme.border} overflow-hidden shadow-2xs flex flex-col justify-between bg-white`}
              >
                {/* Header with Luxury Gradient */}
                <div className={`p-4 ${theme.headerBg}`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {theme.icon}
                      <span className="text-sm font-extrabold tracking-wide">{tier.name} VIP</span>
                    </div>
                    {isEditing && (
                      <span className="text-[10px] font-bold bg-white/20 px-2 py-0.5 rounded-md">
                        Editable
                      </span>
                    )}
                  </div>

                  <div className="mt-3">
                    {isEditing ? (
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-bold opacity-80">Threshold:</span>
                        <input
                          type="number"
                          value={tier.minPoints}
                          onChange={(e) => handleUpdateTier(idx, 'minPoints', parseInt(e.target.value) || 0)}
                          className="w-20 px-2 py-1 text-xs rounded-lg bg-white/20 text-white placeholder-white/50 border border-white/30 focus:outline-none"
                        />
                        <span className="text-xs">pts</span>
                      </div>
                    ) : (
                      <p className="text-xs font-bold opacity-90">
                        {tier.minPoints > 0 ? `${tier.minPoints.toLocaleString()}+ points spent` : 'Entry level (0 points)'}
                      </p>
                    )}
                  </div>
                </div>

                {/* Benefits List */}
                <div className="p-4 bg-white flex-1 flex flex-col justify-between">
                  <div>
                    <p className="text-[10px] font-bold uppercase text-gray-400 tracking-wider mb-2">Exclusive Benefits</p>
                    <ul className="space-y-1.5 text-xs text-gray-700">
                      {tier.benefits.map((benefit, i) => (
                        <li key={i} className="flex items-start gap-1.5 leading-tight">
                          <CheckCircle size={12} className="text-emerald-500 shrink-0 mt-0.5" />
                          <span>{benefit}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-[11px] text-gray-400">
                    <span>Rank Tier #{idx + 1}</span>
                    <span className="font-bold text-gray-700">Active</span>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}