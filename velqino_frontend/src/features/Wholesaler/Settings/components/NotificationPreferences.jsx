"use client"

import React, { useState, useEffect } from 'react'
import {
  Bell,
  Mail,
  Smartphone,
  Globe,
  MessageCircle,
  DollarSign,
  Package,
  Users,
  TrendingUp,
  Shield,
  AlertCircle,
  CheckCircle,
  Save,
  RefreshCw,
  Clock,
  Calendar,
  Sparkles
} from '@/utils/icons'
import { useUpdateProfileMutation } from '@/redux/wholesaler/slices/wholesalerSlice'
import { toast } from 'react-toastify'
import '../../../../styles/Wholesaler/Settings/NotificationPreferences.scss'

export default function NotificationPreferences({ wholesaler, isLoading: parentLoading }) {
  const [isSaving, setIsSaving] = useState(false)
  const [saveSuccess, setSaveSuccess] = useState(false)
  const [activeTab, setActiveTab] = useState('email')

  const [updateProfile, { isLoading: isUpdating }] = useUpdateProfileMutation()

  const [preferences, setPreferences] = useState({
    email: {
      orderUpdates: true,
      paymentReceived: true,
      paymentDisbursed: true,
      lowStockAlerts: true,
      newCustomerSignup: false,
      productReviews: true,
      promotionalOffers: false,
      newsletter: true,
      dailyDigest: true,
      weeklyDigest: false,
      monthlyDigest: false
    },
    sms: {
      orderUpdates: true,
      paymentReceived: true,
      paymentDisbursed: false,
      lowStockAlerts: true,
      otpVerification: true
    },
    push: {
      orderUpdates: true,
      paymentReceived: true,
      lowStockAlerts: true,
      newCustomerSignup: false,
      promotionalOffers: false
    }
  })

  const [digestSettings, setDigestSettings] = useState({
    dailyDigestTime: '09:00',
    weeklyDigestDay: 'Monday',
    weeklyDigestTime: '10:00',
    monthlyDigestDate: '1',
    monthlyDigestTime: '09:00'
  })

  // Load notification preferences from backend
  useEffect(() => {
    if (wholesaler?.notification_preferences) {
      const notifPrefs = wholesaler.notification_preferences
      setPreferences({
        email: { ...preferences.email, ...(notifPrefs.email || {}) },
        sms: { ...preferences.sms, ...(notifPrefs.sms || {}) },
        push: { ...preferences.push, ...(notifPrefs.push || {}) }
      })
      if (notifPrefs.digest_settings) {
        setDigestSettings(prev => ({ ...prev, ...notifPrefs.digest_settings }))
      }
    }
  }, [wholesaler])

  const handleToggle = (channel, setting) => {
    setPreferences(prev => ({
      ...prev,
      [channel]: {
        ...prev[channel],
        [setting]: !prev[channel][setting]
      }
    }))
  }

  const handleSave = async () => {
    setIsSaving(true)
    try {
      const formData = new FormData()
      formData.append('notification_preferences', JSON.stringify({
        email: preferences.email,
        sms: preferences.sms,
        push: preferences.push,
        digest_settings: digestSettings
      }))

      const userId = wholesaler?.user_id || wholesaler?.id
      await updateProfile({ userId: userId, data: formData }).unwrap()
      
      setSaveSuccess(true)
      toast.success('Notification preferences saved successfully!')
      setTimeout(() => setSaveSuccess(false), 3000)
    } catch (error) {
      toast.error(error?.data?.message || 'Failed to save notification preferences')
    } finally {
      setIsSaving(false)
    }
  }

  const tabs = [
    { id: 'email', label: 'Email Alerts', icon: Mail, count: Object.values(preferences.email).filter(Boolean).length },
    { id: 'sms', label: 'SMS & OTP', icon: Smartphone, count: Object.values(preferences.sms).filter(Boolean).length },
    { id: 'push', label: 'Push Alerts', icon: Globe, count: Object.values(preferences.push).filter(Boolean).length },
    { id: 'digest', label: 'Scheduled Digest', icon: Calendar, count: (preferences.email.dailyDigest ? 1 : 0) + (preferences.email.weeklyDigest ? 1 : 0) + (preferences.email.monthlyDigest ? 1 : 0) }
  ]

  const emailCategories = [
    { id: 'orderUpdates', label: 'Wholesale Order Lifecycle', icon: Package, description: 'Instant alerts on new orders, payments, fulfillments, and dispatch' },
    { id: 'paymentReceived', label: 'Customer Payments Received', icon: DollarSign, description: 'Confirmation receipt when buyers clear B2B invoice orders' },
    { id: 'paymentDisbursed', label: 'Payout Disbursements', icon: TrendingUp, description: 'Settlement credit notifications when funds reach your registered bank' },
    { id: 'lowStockAlerts', label: 'Catalog Stock Thresholds', icon: AlertCircle, description: 'Urgent notices when wholesale item inventory dips below critical level' },
    { id: 'newCustomerSignup', label: 'New Retailer Registrations', icon: Users, description: 'When new verified retailers register and bookmark your catalog' },
    { id: 'productReviews', label: 'Product Feedback & Reviews', icon: MessageCircle, description: 'When buyers submit quality ratings or inquiries on items' },
    { id: 'promotionalOffers', label: 'Velqino Platform Deals', icon: Bell, description: 'Promotional campaigns, wholesale discount opportunities, and feature updates' },
    { id: 'newsletter', label: 'Wholesale Industry Insights', icon: Mail, description: 'Monthly analytics digest and trade market trend reports' }
  ]

  const smsCategories = [
    { id: 'orderUpdates', label: 'Critical Order Dispatches', icon: Package, description: 'High-priority SMS alerts for urgent order acceptance & tracking' },
    { id: 'paymentReceived', label: 'Instant Payment Alerts', icon: DollarSign, description: 'Immediate SMS confirmation when payments are captured' },
    { id: 'paymentDisbursed', label: 'Disbursement Confirmations', icon: TrendingUp, description: 'Bank settlement transaction references sent directly to mobile' },
    { id: 'lowStockAlerts', label: 'Out of Stock Emergencies', icon: AlertCircle, description: 'Instant SMS alert when high-velocity inventory exhausts' },
    { id: 'otpVerification', label: 'Security & Two-Factor OTPs', icon: Shield, description: 'Mandatory security codes for high-value transactions and payouts' }
  ]

  const pushCategories = [
    { id: 'orderUpdates', label: 'Real-time Order Pushes', icon: Package, description: 'Live browser notifications for instant order fulfillment' },
    { id: 'paymentReceived', label: 'Instant Payment Receipts', icon: DollarSign, description: 'Sound and banner alerts when an invoice is settled' },
    { id: 'lowStockAlerts', label: 'Inventory Depletion Pushes', icon: AlertCircle, description: 'Proactive notification to restock warehouse SKUs' },
    { id: 'newCustomerSignup', label: 'Partner Connections', icon: Users, description: 'When retail buyers connect with your distributor profile' },
    { id: 'promotionalOffers', label: 'Spotlight Promotions', icon: Bell, description: 'Platform campaigns and seasonal distributor spotlights' }
  ]

  const renderToggle = (checked, onToggle) => (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={onToggle}
      className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary-500/20 ${
        checked ? 'bg-primary-600' : 'bg-slate-200'
      }`}
    >
      <span
        aria-hidden="true"
        className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-xs ring-0 transition duration-200 ease-in-out ${
          checked ? 'translate-x-5' : 'translate-x-0'
        }`}
      />
    </button>
  )

  const renderEmailSettings = () => (
    <div className="divide-y divide-slate-100">
      {emailCategories.map(cat => {
        const Icon = cat.icon
        const isChecked = Boolean(preferences.email[cat.id])
        return (
          <div key={cat.id} className="py-4 first:pt-0 last:pb-0 flex items-start sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-200/70 flex items-center justify-center text-slate-600 shrink-0 mt-0.5 sm:mt-0">
                <Icon size={18} />
              </div>
              <div>
                <p className="text-xs sm:text-sm font-bold text-slate-900">{cat.label}</p>
                <p className="text-xs font-medium text-slate-500 mt-0.5">{cat.description}</p>
              </div>
            </div>
            {renderToggle(isChecked, () => handleToggle('email', cat.id))}
          </div>
        )
      })}
    </div>
  )

  const renderSMSSettings = () => (
    <div className="divide-y divide-slate-100">
      {smsCategories.map(cat => {
        const Icon = cat.icon
        const isChecked = Boolean(preferences.sms[cat.id])
        const isProtected = cat.id === 'otpVerification'
        return (
          <div key={cat.id} className="py-4 first:pt-0 last:pb-0 flex items-start sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-200/70 flex items-center justify-center text-slate-600 shrink-0 mt-0.5 sm:mt-0">
                <Icon size={18} />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <p className="text-xs sm:text-sm font-bold text-slate-900">{cat.label}</p>
                  {isProtected && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-2xs font-bold bg-primary-50 text-primary-700 border border-primary-200/60 uppercase">
                      Mandatory Security
                    </span>
                  )}
                </div>
                <p className="text-xs font-medium text-slate-500 mt-0.5">{cat.description}</p>
              </div>
            </div>
            {renderToggle(isChecked, () => !isProtected && handleToggle('sms', cat.id))}
          </div>
        )
      })}
    </div>
  )

  const renderPushSettings = () => (
    <div className="divide-y divide-slate-100">
      {pushCategories.map(cat => {
        const Icon = cat.icon
        const isChecked = Boolean(preferences.push[cat.id])
        return (
          <div key={cat.id} className="py-4 first:pt-0 last:pb-0 flex items-start sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-200/70 flex items-center justify-center text-slate-600 shrink-0 mt-0.5 sm:mt-0">
                <Icon size={18} />
              </div>
              <div>
                <p className="text-xs sm:text-sm font-bold text-slate-900">{cat.label}</p>
                <p className="text-xs font-medium text-slate-500 mt-0.5">{cat.description}</p>
              </div>
            </div>
            {renderToggle(isChecked, () => handleToggle('push', cat.id))}
          </div>
        )
      })}
    </div>
  )

  const renderDigestSettings = () => (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {/* Daily Digest */}
      <div className="rounded-xl border border-slate-200/80 bg-slate-50/40 p-4 sm:p-5 flex flex-col justify-between space-y-4">
        <div>
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-xl bg-primary-50 border border-primary-100 text-primary-600 flex items-center justify-center">
              <Clock size={18} />
            </div>
            {renderToggle(preferences.email.dailyDigest, () => handleToggle('email', 'dailyDigest'))}
          </div>
          <h4 className="text-sm font-bold text-slate-900">Daily Activity Digest</h4>
          <p className="text-xs font-medium text-slate-500 mt-1">
            Condensed briefing of orders, revenue earned, and shipments fulfilled over the past 24 hours
          </p>
        </div>
        {preferences.email.dailyDigest && (
          <div className="pt-3 border-t border-slate-200/70">
            <label className="block text-2xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
              Dispatch Time
            </label>
            <select
              value={digestSettings.dailyDigestTime}
              onChange={(e) => setDigestSettings({ ...digestSettings, dailyDigestTime: e.target.value })}
              className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs font-semibold text-slate-800 focus:outline-none focus:ring-1 focus:ring-primary-500"
            >
              {['08:00', '09:00', '10:00', '11:00', '12:00', '14:00', '18:00', '20:00'].map(t => (
                <option key={t} value={t}>{t} IST</option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Weekly Digest */}
      <div className="rounded-xl border border-slate-200/80 bg-slate-50/40 p-4 sm:p-5 flex flex-col justify-between space-y-4">
        <div>
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 text-blue-600 flex items-center justify-center">
              <Calendar size={18} />
            </div>
            {renderToggle(preferences.email.weeklyDigest, () => handleToggle('email', 'weeklyDigest'))}
          </div>
          <h4 className="text-sm font-bold text-slate-900">Weekly Executive Report</h4>
          <p className="text-xs font-medium text-slate-500 mt-1">
            Performance analytics, top customers, inventory turnover, and weekly revenue trends
          </p>
        </div>
        {preferences.email.weeklyDigest && (
          <div className="pt-3 border-t border-slate-200/70 grid grid-cols-2 gap-2">
            <div>
              <label className="block text-2xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                Delivery Day
              </label>
              <select
                value={digestSettings.weeklyDigestDay}
                onChange={(e) => setDigestSettings({ ...digestSettings, weeklyDigestDay: e.target.value })}
                className="w-full px-2.5 py-2 bg-white border border-slate-200 rounded-lg text-xs font-semibold text-slate-800 focus:outline-none focus:ring-1 focus:ring-primary-500"
              >
                {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map(d => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-2xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                Delivery Time
              </label>
              <select
                value={digestSettings.weeklyDigestTime}
                onChange={(e) => setDigestSettings({ ...digestSettings, weeklyDigestTime: e.target.value })}
                className="w-full px-2.5 py-2 bg-white border border-slate-200 rounded-lg text-xs font-semibold text-slate-800 focus:outline-none focus:ring-1 focus:ring-primary-500"
              >
                {['09:00', '10:00', '12:00', '15:00', '18:00'].map(t => (
                  <option key={t} value={t}>{t} IST</option>
                ))}
              </select>
            </div>
          </div>
        )}
      </div>

      {/* Monthly Digest */}
      <div className="rounded-xl border border-slate-200/80 bg-slate-50/40 p-4 sm:p-5 flex flex-col justify-between space-y-4">
        <div>
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-xl bg-purple-50 border border-purple-100 text-purple-600 flex items-center justify-center">
              <TrendingUp size={18} />
            </div>
            {renderToggle(preferences.email.monthlyDigest, () => handleToggle('email', 'monthlyDigest'))}
          </div>
          <h4 className="text-sm font-bold text-slate-900">Monthly Trade Statement</h4>
          <p className="text-xs font-medium text-slate-500 mt-1">
            Complete reconciliation statement, tax summary estimates, and month-over-month growth stats
          </p>
        </div>
        {preferences.email.monthlyDigest && (
          <div className="pt-3 border-t border-slate-200/70">
            <label className="block text-2xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
              Filing Date
            </label>
            <select
              value={digestSettings.monthlyDigestDate}
              onChange={(e) => setDigestSettings({ ...digestSettings, monthlyDigestDate: e.target.value })}
              className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs font-semibold text-slate-800 focus:outline-none focus:ring-1 focus:ring-primary-500"
            >
              <option value="1">1st of every month</option>
              <option value="5">5th of every month</option>
              <option value="10">10th of every month</option>
            </select>
          </div>
        )}
      </div>
    </div>
  )

  if (parentLoading) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200/80 p-8 shadow-xs animate-pulse">
        <div className="h-6 bg-slate-200 rounded w-1/3 mb-4"></div>
        <div className="h-4 bg-slate-200 rounded w-1/2 mb-8"></div>
        <div className="h-12 bg-slate-100 rounded-xl mb-6"></div>
        <div className="space-y-4">
          <div className="h-16 bg-slate-100 rounded-xl"></div>
          <div className="h-16 bg-slate-100 rounded-xl"></div>
          <div className="h-16 bg-slate-100 rounded-xl"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="notification-preferences space-y-6">
      {/* Executive Card Header */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-xl bg-primary-50 text-primary-600 flex items-center justify-center shrink-0 border border-primary-100/60 shadow-2xs">
            <Bell size={22} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
                Notification Preferences
              </h3>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/60">
                <CheckCircle size={11} /> Real-time Dispatch Active
              </span>
            </div>
            <p className="text-xs sm:text-sm font-medium text-slate-500 mt-0.5">
              Configure communication channels, automated invoice notifications, and scheduled digest briefings
            </p>
          </div>
        </div>

        <button
          onClick={handleSave}
          disabled={isSaving || isUpdating}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white text-xs sm:text-sm font-semibold rounded-xl shadow-xs transition-all disabled:opacity-50 active:scale-95"
        >
          {isSaving || isUpdating ? (
            <>
              <RefreshCw size={14} className="animate-spin" />
              <span>Saving...</span>
            </>
          ) : (
            <>
              <Save size={14} />
              <span>Save Preferences</span>
            </>
          )}
        </button>
      </div>

      {/* Main Settings Card */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        {/* Navigation Tabs */}
        <div className="px-5 sm:px-6 pt-4 border-b border-slate-200/80 bg-slate-50/50 overflow-x-auto scrollbar-none">
          <div className="flex items-center gap-2 min-w-max pb-3">
            {tabs.map(tab => {
              const Icon = tab.icon
              const isActive = activeTab === tab.id
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-2 transition-all ${
                    isActive
                      ? 'bg-white text-primary-700 shadow-xs border border-slate-200/80'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
                  }`}
                >
                  <Icon size={15} className={isActive ? 'text-primary-600' : 'text-slate-400'} />
                  <span>{tab.label}</span>
                  <span className={`px-1.5 py-0.5 rounded-full text-2xs font-bold ${
                    isActive ? 'bg-primary-50 text-primary-700' : 'bg-slate-200 text-slate-600'
                  }`}>
                    {tab.count}
                  </span>
                </button>
              )
            })}
          </div>
        </div>

        {/* Tab Content Panel */}
        <div className="p-5 sm:p-6">
          {activeTab === 'email' && renderEmailSettings()}
          {activeTab === 'sms' && renderSMSSettings()}
          {activeTab === 'push' && renderPushSettings()}
          {activeTab === 'digest' && renderDigestSettings()}
        </div>

        {/* Save Success Alert */}
        {saveSuccess && (
          <div className="mx-5 sm:mx-6 mb-5 p-4 bg-emerald-50 border border-emerald-200/80 rounded-xl flex items-center gap-3">
            <CheckCircle size={18} className="text-emerald-600 shrink-0" />
            <p className="text-xs sm:text-sm font-semibold text-emerald-800">
              Notification channels updated and synced with messaging servers.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
