"use client"

import React, { useState } from 'react'
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
  Calendar
} from '../../../../utils/icons'
import '../../../../styles/Wholesaler/Settings/NotificationPreferences.scss'

export default function NotificationPreferences() {
  const [isSaving, setIsSaving] = useState(false)
  const [saveSuccess, setSaveSuccess] = useState(false)
  const [activeTab, setActiveTab] = useState('email')

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

  const handleToggle = (channel, setting) => {
    setPreferences({
      ...preferences,
      [channel]: {
        ...preferences[channel],
        [setting]: !preferences[channel][setting]
      }
    })
  }

  const handleSave = () => {
    setIsSaving(true)
    setTimeout(() => {
      setIsSaving(false)
      setSaveSuccess(true)
      setTimeout(() => setSaveSuccess(false), 3000)
    }, 1000)
  }

  const tabs = [
    { id: 'email', label: 'Email', icon: Mail },
    { id: 'sms', label: 'SMS', icon: Smartphone },
    { id: 'push', label: 'Push', icon: Globe },
    { id: 'digest', label: 'Digest', icon: Calendar }
  ]

  const emailCategories = [
    { id: 'orderUpdates', label: 'Order Updates', icon: Package, description: 'New orders, status changes, delivery updates' },
    { id: 'paymentReceived', label: 'Payment Received', icon: DollarSign, description: 'When you receive payment for orders' },
    { id: 'paymentDisbursed', label: 'Payment Disbursed', icon: TrendingUp, description: 'When payout is sent to your account' },
    { id: 'lowStockAlerts', label: 'Low Stock Alerts', icon: AlertCircle, description: 'Products running below threshold' },
    { id: 'newCustomerSignup', label: 'New Customer Signup', icon: Users, description: 'When new customers register' },
    { id: 'productReviews', label: 'Product Reviews', icon: MessageCircle, description: 'New reviews on your products' },
    { id: 'promotionalOffers', label: 'Promotional Offers', icon: Bell, description: 'Deals, discounts, and marketing emails' },
    { id: 'newsletter', label: 'Newsletter', icon: Mail, description: 'Monthly updates and industry news' }
  ]

  const smsCategories = [
    { id: 'orderUpdates', label: 'Order Updates', icon: Package, description: 'Critical order status changes' },
    { id: 'paymentReceived', label: 'Payment Received', icon: DollarSign, description: 'Instant payment notifications' },
    { id: 'paymentDisbursed', label: 'Payment Disbursed', icon: TrendingUp, description: 'Payout confirmation' },
    { id: 'lowStockAlerts', label: 'Low Stock Alerts', icon: AlertCircle, description: 'Urgent stock alerts' },
    { id: 'otpVerification', label: 'OTP Verification', icon: Shield, description: 'Login and transaction OTPs' }
  ]

  const pushCategories = [
    { id: 'orderUpdates', label: 'Order Updates', icon: Package, description: 'Real-time order notifications' },
    { id: 'paymentReceived', label: 'Payment Received', icon: DollarSign, description: 'Payment received alerts' },
    { id: 'lowStockAlerts', label: 'Low Stock Alerts', icon: AlertCircle, description: 'Instant stock alerts' },
    { id: 'newCustomerSignup', label: 'New Customer', icon: Users, description: 'New customer registrations' },
    { id: 'promotionalOffers', label: 'Promotions', icon: Bell, description: 'Marketing and offers' }
  ]

  const renderEmailSettings = () => (
    <div className="space-y-3">
      {emailCategories.map(cat => {
        const Icon = cat.icon
        return (
          <div key={cat.id} className="flex items-start justify-between py-3 border-b border-gray-100 last:border-0">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center text-gray-500">
                <Icon size={16} />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">{cat.label}</p>
                <p className="text-xs text-gray-500">{cat.description}</p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={preferences.email[cat.id]}
                onChange={() => handleToggle('email', cat.id)}
                className="sr-only peer"
              />
              <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary-500"></div>
            </label>
          </div>
        )
      })}
    </div>
  )

  const renderSMSSettings = () => (
    <div className="space-y-3">
      {smsCategories.map(cat => {
        const Icon = cat.icon
        return (
          <div key={cat.id} className="flex items-start justify-between py-3 border-b border-gray-100 last:border-0">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center text-gray-500">
                <Icon size={16} />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">{cat.label}</p>
                <p className="text-xs text-gray-500">{cat.description}</p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={preferences.sms[cat.id]}
                onChange={() => handleToggle('sms', cat.id)}
                className="sr-only peer"
              />
              <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary-500"></div>
            </label>
          </div>
        )
      })}
    </div>
  )

  const renderPushSettings = () => (
    <div className="space-y-3">
      {pushCategories.map(cat => {
        const Icon = cat.icon
        return (
          <div key={cat.id} className="flex items-start justify-between py-3 border-b border-gray-100 last:border-0">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center text-gray-500">
                <Icon size={16} />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">{cat.label}</p>
                <p className="text-xs text-gray-500">{cat.description}</p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={preferences.push[cat.id]}
                onChange={() => handleToggle('push', cat.id)}
                className="sr-only peer"
              />
              <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary-500"></div>
            </label>
          </div>
        )
      })}
    </div>
  )

  const renderDigestSettings = () => (
    <div className="space-y-6">
      <div className="border border-gray-200 rounded-xl p-4">
        <div className="flex items-center gap-3 mb-4">
          <Clock size={20} className="text-primary-500" />
          <div>
            <h4 className="text-sm font-semibold text-gray-900">Daily Digest</h4>
            <p className="text-xs text-gray-500">Get a summary of daily activities</p>
          </div>
        </div>
        <label className="flex items-center justify-between cursor-pointer">
          <span className="text-sm text-gray-700">Enable Daily Digest</span>
          <label className="relative inline-flex items-center cursor-pointer">
            <input type="checkbox" checked={preferences.email.dailyDigest} onChange={() => handleToggle('email', 'dailyDigest')} className="sr-only peer" />
            <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary-500"></div>
          </label>
        </label>
        {preferences.email.dailyDigest && (
          <div className="mt-3 ml-8">
            <label className="block text-xs font-medium text-gray-500 mb-1">Delivery Time</label>
            <select
              value={digestSettings.dailyDigestTime}
              onChange={(e) => setDigestSettings({ ...digestSettings, dailyDigestTime: e.target.value })}
              className="px-3 py-1.5 border border-gray-200 rounded-lg text-sm"
            >
              <option>09:00</option>
              <option>10:00</option>
              <option>11:00</option>
              <option>12:00</option>
              <option>13:00</option>
              <option>14:00</option>
              <option>15:00</option>
              <option>16:00</option>
              <option>17:00</option>
            </select>
          </div>
        )}
      </div>

      <div className="border border-gray-200 rounded-xl p-4">
        <div className="flex items-center gap-3 mb-4">
          <Calendar size={20} className="text-primary-500" />
          <div>
            <h4 className="text-sm font-semibold text-gray-900">Weekly Digest</h4>
            <p className="text-xs text-gray-500">Weekly performance summary</p>
          </div>
        </div>
        <label className="flex items-center justify-between cursor-pointer">
          <span className="text-sm text-gray-700">Enable Weekly Digest</span>
          <label className="relative inline-flex items-center cursor-pointer">
            <input type="checkbox" checked={preferences.email.weeklyDigest} onChange={() => handleToggle('email', 'weeklyDigest')} className="sr-only peer" />
            <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary-500"></div>
          </label>
        </label>
      </div>

      <div className="border border-gray-200 rounded-xl p-4">
        <div className="flex items-center gap-3 mb-4">
          <TrendingUp size={20} className="text-primary-500" />
          <div>
            <h4 className="text-sm font-semibold text-gray-900">Monthly Digest</h4>
            <p className="text-xs text-gray-500">Comprehensive monthly analytics</p>
          </div>
        </div>
        <label className="flex items-center justify-between cursor-pointer">
          <span className="text-sm text-gray-700">Enable Monthly Digest</span>
          <label className="relative inline-flex items-center cursor-pointer">
            <input type="checkbox" checked={preferences.email.monthlyDigest} onChange={() => handleToggle('email', 'monthlyDigest')} className="sr-only peer" />
            <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary-500"></div>
          </label>
        </label>
      </div>
    </div>
  )

  const CurrentIcon = tabs.find(t => t.id === activeTab)?.icon || Mail

  return (
    <div className="notification-preferences bg-white rounded-xl border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="px-4 sm:px-6 py-4 border-b border-gray-200 bg-gray-50/50 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-primary-100 flex items-center justify-center text-primary-600">
            <Bell size={20} />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-semibold text-gray-900">Notification Preferences</h3>
            <p className="text-xs sm:text-sm text-gray-500">Manage how and when you receive notifications</p>
          </div>
        </div>
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-primary-500 text-white text-sm rounded-lg hover:bg-primary-600 transition-all disabled:opacity-50"
        >
          {isSaving ? (
            <>
              <RefreshCw size={14} className="animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save size={14} />
              Save Preferences
            </>
          )}
        </button>
      </div>

      {/* Tabs */}
      <div className="px-4 sm:px-6 border-b border-gray-200 overflow-x-auto">
        <div className="flex gap-1 min-w-max">
          {tabs.map(tab => {
            const Icon = tab.icon
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-3 sm:px-4 py-2.5 text-sm font-medium flex items-center gap-2 border-b-2 transition-all whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <Icon size={16} />
                {tab.label}
              </button>
            )
          })}
        </div>
      </div>

      {/* Content */}
      <div className="p-4 sm:p-6">
        {activeTab === 'email' && renderEmailSettings()}
        {activeTab === 'sms' && renderSMSSettings()}
        {activeTab === 'push' && renderPushSettings()}
        {activeTab === 'digest' && renderDigestSettings()}
      </div>

      {/* Success Message */}
      {saveSuccess && (
        <div className="mx-4 sm:mx-6 mb-4 p-3 bg-success-50 rounded-lg flex items-center gap-2">
          <CheckCircle size={16} className="text-success-600" />
          <p className="text-sm text-success-600">Notification preferences saved successfully!</p>
        </div>
      )}
    </div>
  )
}