"use client"

import React, { useState, useEffect } from 'react'
import { Bell, Mail, Smartphone, Package, Calendar, CreditCard, TrendingUp, AlertCircle, Users, ShoppingBag, Settings, Save, Edit, X, CheckCircle, RefreshCw } from '../../../../utils/icons'

export default function NotificationPreferences() {
  const [mounted, setMounted] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [testSending, setTestSending] = useState(false)
  
  const [preferences, setPreferences] = useState({
    email: {
      enabled: true,
      emailAddress: 'store@velqino.com',
      backupEmail: 'admin@velqino.com'
    },
    sms: {
      enabled: true,
      phoneNumber: '+91 98765 43210',
      backupPhone: '+91 87654 32109'
    },
    inApp: {
      enabled: true,
      sound: true,
      desktop: true
    },
    alerts: {
      lowStock: true,
      stockThreshold: 10,
      outOfStock: true,
      newOrder: true,
      orderStatus: true,
      paymentReceived: true,
      customerFeedback: true,
      dailySummary: true,
      weeklyReport: true,
      systemUpdate: true,
      promotion: false
    }
  })

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  const handleToggle = (category, field) => {
    setPreferences(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [field]: !prev[category][field]
      }
    }))
  }

  const handleInputChange = (category, field, value) => {
    setPreferences(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [field]: value
      }
    }))
  }

  const handleSave = () => {
    setIsEditing(false)
    setShowSuccess(true)
    setTimeout(() => setShowSuccess(false), 3000)
  }

  const handleTestNotification = (type) => {
    setTestSending(true)
    setTimeout(() => {
      setTestSending(false)
      alert(`Test ${type} alert dispatched successfully!`)
    }, 1200)
  }

  return (
    <div className="bg-white rounded-3xl border border-gray-200/80 shadow-2xs overflow-hidden transition-all duration-300">
      {/* Header */}
      <div className="p-5 sm:p-6 border-b border-gray-100 bg-gradient-to-r from-gray-50/60 via-white to-gray-50/30">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-primary-50 border border-primary-100 flex items-center justify-center text-primary-600 shadow-2xs">
              <Bell size={20} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-extrabold text-gray-900 tracking-tight">Notification Channels &amp; Alerts</h3>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  Active Channels
                </span>
              </div>
              <p className="text-xs text-gray-500 mt-0.5">Configure SMS gateway, transactional emails, and real-time counter sound alerts</p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-auto">
            {isEditing ? (
              <>
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-3.5 py-2 text-xs font-bold text-gray-700 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-all shadow-2xs"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSave}
                  className="px-4 py-2 text-xs font-bold text-white bg-primary-600 hover:bg-primary-700 rounded-xl transition-all shadow-xs flex items-center gap-1.5"
                >
                  <Save size={14} />
                  Save Preferences
                </button>
              </>
            ) : (
              <button
                type="button"
                onClick={() => setIsEditing(true)}
                className="px-4 py-2 text-xs font-bold text-white bg-primary-600 hover:bg-primary-700 rounded-xl transition-all flex items-center gap-1.5 shadow-xs"
              >
                <Edit size={14} />
                Edit Alerts
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Success Notification */}
      {showSuccess && (
        <div className="mx-6 mt-5 p-3.5 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center gap-3 animate-fadeIn">
          <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
            <CheckCircle size={18} />
          </div>
          <div>
            <p className="text-xs font-bold text-emerald-900">Preferences Saved</p>
            <p className="text-xs text-emerald-700">Notification dispatch channels have been synchronized.</p>
          </div>
        </div>
      )}

      <div className="p-5 sm:p-6 space-y-6">
        {/* Section 1: Email & SMS Notification Channels */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Email Settings */}
          <div className="p-4 rounded-xl border border-gray-200/80 bg-gray-50/40 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-gray-200/70">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-primary-50 text-primary-600 flex items-center justify-center">
                  <Mail size={14} />
                </div>
                <h4 className="text-xs font-bold text-gray-900">Email Notifications</h4>
              </div>
              {isEditing ? (
                <button
                  type="button"
                  onClick={() => handleToggle('email', 'enabled')}
                  className={`relative inline-flex h-4.5 w-8 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${
                    preferences.email.enabled ? 'bg-primary-600' : 'bg-gray-300'
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow-sm transition duration-200 ease-in-out ${
                      preferences.email.enabled ? 'translate-x-3.5' : 'translate-x-0'
                    }`}
                  />
                </button>
              ) : (
                <span className={`text-2xs font-bold px-2 py-0.5 rounded-full ${
                  preferences.email.enabled ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-gray-100 text-gray-500'
                }`}>
                  {preferences.email.enabled ? 'Active' : 'Muted'}
                </span>
              )}
            </div>

            {preferences.email.enabled && (
              <div className="space-y-2.5">
                <div>
                  <label className="block text-2xs font-semibold text-gray-600 mb-1">Primary Recipient</label>
                  {isEditing ? (
                    <input
                      type="email"
                      value={preferences.email.emailAddress}
                      onChange={(e) => handleInputChange('email', 'emailAddress', e.target.value)}
                      className="w-full px-3 py-1.5 text-xs bg-white border border-gray-200 rounded-lg text-gray-900 focus:outline-none focus:ring-1 focus:ring-primary-500 font-medium"
                    />
                  ) : (
                    <p className="text-xs font-semibold text-gray-800 bg-white p-2 rounded-lg border border-gray-200/70">
                      {preferences.email.emailAddress}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-2xs font-semibold text-gray-600 mb-1">Backup Recipient</label>
                  {isEditing ? (
                    <input
                      type="email"
                      value={preferences.email.backupEmail}
                      onChange={(e) => handleInputChange('email', 'backupEmail', e.target.value)}
                      className="w-full px-3 py-1.5 text-xs bg-white border border-gray-200 rounded-lg text-gray-900 focus:outline-none focus:ring-1 focus:ring-primary-500 font-medium"
                    />
                  ) : (
                    <p className="text-xs text-gray-600 bg-white p-2 rounded-lg border border-gray-200/70">
                      {preferences.email.backupEmail}
                    </p>
                  )}
                </div>

                {!isEditing && (
                  <button
                    type="button"
                    onClick={() => handleTestNotification('Email')}
                    disabled={testSending}
                    className="text-2xs font-bold text-primary-700 hover:text-primary-800 flex items-center gap-1 mt-1 pt-1"
                  >
                    {testSending ? <RefreshCw size={11} className="animate-spin" /> : <Mail size={11} />}
                    <span>Send Test Dispatch</span>
                  </button>
                )}
              </div>
            )}
          </div>

          {/* SMS Settings */}
          <div className="p-4 rounded-xl border border-gray-200/80 bg-gray-50/40 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-gray-200/70">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <Smartphone size={14} />
                </div>
                <h4 className="text-xs font-bold text-gray-900">SMS Gateway</h4>
              </div>
              {isEditing ? (
                <button
                  type="button"
                  onClick={() => handleToggle('sms', 'enabled')}
                  className={`relative inline-flex h-4.5 w-8 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${
                    preferences.sms.enabled ? 'bg-primary-600' : 'bg-gray-300'
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow-sm transition duration-200 ease-in-out ${
                      preferences.sms.enabled ? 'translate-x-3.5' : 'translate-x-0'
                    }`}
                  />
                </button>
              ) : (
                <span className={`text-2xs font-bold px-2 py-0.5 rounded-full ${
                  preferences.sms.enabled ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-gray-100 text-gray-500'
                }`}>
                  {preferences.sms.enabled ? 'Active' : 'Muted'}
                </span>
              )}
            </div>

            {preferences.sms.enabled && (
              <div className="space-y-2.5">
                <div>
                  <label className="block text-2xs font-semibold text-gray-600 mb-1">Primary Mobile Number</label>
                  {isEditing ? (
                    <input
                      type="tel"
                      value={preferences.sms.phoneNumber}
                      onChange={(e) => handleInputChange('sms', 'phoneNumber', e.target.value)}
                      className="w-full px-3 py-1.5 text-xs bg-white border border-gray-200 rounded-lg text-gray-900 focus:outline-none focus:ring-1 focus:ring-primary-500 font-medium"
                    />
                  ) : (
                    <p className="text-xs font-semibold text-gray-800 bg-white p-2 rounded-lg border border-gray-200/70">
                      {preferences.sms.phoneNumber}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-2xs font-semibold text-gray-600 mb-1">Emergency Manager Phone</label>
                  {isEditing ? (
                    <input
                      type="tel"
                      value={preferences.sms.backupPhone}
                      onChange={(e) => handleInputChange('sms', 'backupPhone', e.target.value)}
                      className="w-full px-3 py-1.5 text-xs bg-white border border-gray-200 rounded-lg text-gray-900 focus:outline-none focus:ring-1 focus:ring-primary-500 font-medium"
                    />
                  ) : (
                    <p className="text-xs text-gray-600 bg-white p-2 rounded-lg border border-gray-200/70">
                      {preferences.sms.backupPhone}
                    </p>
                  )}
                </div>

                {!isEditing && (
                  <button
                    type="button"
                    onClick={() => handleTestNotification('SMS')}
                    disabled={testSending}
                    className="text-2xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 mt-1 pt-1"
                  >
                    {testSending ? <RefreshCw size={11} className="animate-spin" /> : <Smartphone size={11} />}
                    <span>Send Test SMS OTP</span>
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Section 2: Operational Trigger Events */}
        <div className="p-4 rounded-xl border border-gray-200/80 bg-gray-50/40">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-7 h-7 rounded-lg bg-gray-100 flex items-center justify-center text-gray-700">
              <AlertCircle size={14} />
            </div>
            <div>
              <h4 className="text-xs font-bold text-gray-900">Event Triggers &amp; Thresholds</h4>
              <p className="text-2xs text-gray-500">Select what triggers alerts across connected channels</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
            {[
              { key: 'lowStock', label: 'Low Stock Level', desc: `Threshold: ${preferences.alerts.stockThreshold} units` },
              { key: 'outOfStock', label: 'Stock Exhaustion', desc: 'Instant zero-unit alert' },
              { key: 'newOrder', label: 'New Online Order', desc: 'B2C / Web order alert' },
              { key: 'paymentReceived', label: 'Cash Settlement', desc: 'Daily drawer close count' },
              { key: 'customerFeedback', label: 'Negative Feedback', desc: 'Sub-3 star review ping' },
              { key: 'dailySummary', label: 'Day-End Report', desc: 'Automated 10 PM PDF digest' },
              { key: 'weeklyReport', label: 'Weekly Analytics', desc: 'Revenue & profit margins' },
              { key: 'systemUpdate', label: 'Cloud Security Alert', desc: 'Firmware & compliance pings' },
            ].map(({ key, label, desc }) => {
              const isActive = preferences.alerts[key]
              return (
                <div
                  key={key}
                  className={`p-2.5 rounded-lg border transition-all ${
                    isActive ? 'border-primary-200/80 bg-white shadow-2xs' : 'border-gray-200/70 bg-gray-50/50'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-gray-900">{label}</span>
                    {isEditing ? (
                      <button
                        type="button"
                        onClick={() => handleToggle('alerts', key)}
                        className={`relative inline-flex h-4 w-7 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${
                          isActive ? 'bg-primary-600' : 'bg-gray-300'
                        }`}
                      >
                        <span
                          className={`pointer-events-none inline-block h-3 w-3 transform rounded-full bg-white shadow-sm transition duration-200 ease-in-out ${
                            isActive ? 'translate-x-3' : 'translate-x-0'
                          }`}
                        />
                      </button>
                    ) : (
                      <span className={`text-3xs font-extrabold px-1.5 py-0.5 rounded ${
                        isActive ? 'bg-emerald-50 text-emerald-700' : 'bg-gray-100 text-gray-400'
                      }`}>
                        {isActive ? 'ON' : 'OFF'}
                      </span>
                    )}
                  </div>
                  <p className="text-3xs text-gray-500">{desc}</p>
                </div>
              )
            })}
          </div>
        </div>

        {/* Section 3: POS In-App Audio & Desktop Alerts */}
        <div className="p-4 rounded-xl border border-gray-200/80 bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h4 className="text-xs font-bold text-gray-900">Counter Terminal Sound &amp; Desktop Chimes</h4>
            <p className="text-2xs text-gray-500">Play pleasant notification tones on barcode scans and cash drawer opens</p>
          </div>
          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <span className="text-xs text-gray-700 font-medium">Sound Chime</span>
              {isEditing ? (
                <button
                  type="button"
                  onClick={() => handleToggle('inApp', 'sound')}
                  className={`relative inline-flex h-4 w-7 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${
                    preferences.inApp.sound ? 'bg-primary-600' : 'bg-gray-300'
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-3 w-3 transform rounded-full bg-white shadow-sm transition duration-200 ease-in-out ${
                      preferences.inApp.sound ? 'translate-x-3' : 'translate-x-0'
                    }`}
                  />
                </button>
              ) : (
                <span className="text-2xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                  {preferences.inApp.sound ? 'Enabled' : 'Muted'}
                </span>
              )}
            </label>

            <label className="flex items-center gap-2 cursor-pointer">
              <span className="text-xs text-gray-700 font-medium">Desktop Toast</span>
              {isEditing ? (
                <button
                  type="button"
                  onClick={() => handleToggle('inApp', 'desktop')}
                  className={`relative inline-flex h-4 w-7 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${
                    preferences.inApp.desktop ? 'bg-primary-600' : 'bg-gray-300'
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-3 w-3 transform rounded-full bg-white shadow-sm transition duration-200 ease-in-out ${
                      preferences.inApp.desktop ? 'translate-x-3' : 'translate-x-0'
                    }`}
                  />
                </button>
              ) : (
                <span className="text-2xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                  {preferences.inApp.desktop ? 'Enabled' : 'Muted'}
                </span>
              )}
            </label>
          </div>
        </div>
      </div>
    </div>
  )
}
