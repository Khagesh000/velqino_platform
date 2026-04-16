"use client"

import React, { useState, useEffect } from 'react'
import { Bell, Mail, Smartphone, Package, Calendar, CreditCard, TrendingUp, AlertCircle, Users, ShoppingBag, Settings, Save, Edit, X, CheckCircle, RefreshCw } from '../../../../utils/icons'
import '../../../../styles/Retailer/RetailerSettings/NotificationPreferences.scss'

export default function NotificationPreferences() {
  const [mounted, setMounted] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [testSending, setTestSending] = useState(false)
  
  const [preferences, setPreferences] = useState({
    email: {
      enabled: true,
      emailAddress: 'store@veltrix.com',
      backupEmail: 'admin@veltrix.com'
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
    setPreferences({
      ...preferences,
      [category]: {
        ...preferences[category],
        [field]: !preferences[category][field]
      }
    })
  }

  const handleInputChange = (category, field, value) => {
    setPreferences({
      ...preferences,
      [category]: {
        ...preferences[category],
        [field]: value
      }
    })
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
      alert(`Test ${type} notification sent successfully!`)
    }, 1500)
  }

  return (
    <div className="notification-preferences bg-white rounded-xl shadow-sm border border-gray-100">
      {/* Header */}
      <div className="p-5 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Bell size={22} className="text-primary-500" />
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Notification Preferences</h3>
              <p className="text-sm text-gray-500">Configure SMS and email alerts</p>
            </div>
          </div>
          {isEditing ? (
            <div className="flex gap-2">
              <button onClick={() => setIsEditing(false)} className="px-4 py-2 text-sm text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50">
                Cancel
              </button>
              <button onClick={handleSave} className="px-4 py-2 text-sm bg-primary-500 text-white rounded-lg hover:bg-primary-600 flex items-center gap-2">
                <Save size={16} />
                Save Changes
              </button>
            </div>
          ) : (
            <button onClick={() => setIsEditing(true)} className="px-4 py-2 text-sm text-primary-600 border border-primary-200 rounded-lg hover:bg-primary-50 flex items-center gap-2">
              <Edit size={16} />
              Edit Preferences
            </button>
          )}
        </div>
      </div>

      {/* Success Message */}
      {showSuccess && (
        <div className="mx-5 mt-4 p-3 bg-green-100 rounded-lg flex items-center gap-2 animate-fadeIn">
          <CheckCircle size={16} className="text-green-600" />
          <span className="text-sm text-green-700">Notification preferences saved!</span>
        </div>
      )}

      <div className="p-5 space-y-6">
        {/* Email Settings */}
        <div className="border border-gray-200 rounded-lg p-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Mail size={18} className="text-gray-600" />
              <h4 className="text-base font-semibold text-gray-900">Email Notifications</h4>
            </div>
            {isEditing && (
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={preferences.email.enabled}
                  onChange={() => handleToggle('email', 'enabled')}
                  className="rounded border-gray-300 text-primary-500"
                />
                <span className="text-sm text-gray-600">Enable</span>
              </label>
            )}
          </div>
          
          {preferences.email.enabled && (
            <>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Primary Email</label>
                  {isEditing ? (
                    <input
                      type="email"
                      value={preferences.email.emailAddress}
                      onChange={(e) => handleInputChange('email', 'emailAddress', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-primary-500"
                    />
                  ) : (
                    <p className="text-gray-900">{preferences.email.emailAddress}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Backup Email</label>
                  {isEditing ? (
                    <input
                      type="email"
                      value={preferences.email.backupEmail}
                      onChange={(e) => handleInputChange('email', 'backupEmail', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-primary-500"
                    />
                  ) : (
                    <p className="text-gray-600">{preferences.email.backupEmail}</p>
                  )}
                </div>
              </div>
              {!isEditing && (
                <button
                  onClick={() => handleTestNotification('email')}
                  disabled={testSending}
                  className="mt-3 text-sm text-primary-600 hover:text-primary-700 flex items-center gap-1"
                >
                  {testSending ? <RefreshCw size={12} className="animate-spin" /> : <Mail size={12} />}
                  Test Email
                </button>
              )}
            </>
          )}
        </div>

        {/* SMS Settings */}
        <div className="border border-gray-200 rounded-lg p-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Smartphone size={18} className="text-gray-600" />
              <h4 className="text-base font-semibold text-gray-900">SMS Notifications</h4>
            </div>
            {isEditing && (
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={preferences.sms.enabled}
                  onChange={() => handleToggle('sms', 'enabled')}
                  className="rounded border-gray-300 text-primary-500"
                />
                <span className="text-sm text-gray-600">Enable</span>
              </label>
            )}
          </div>
          
          {preferences.sms.enabled && (
            <>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Primary Phone</label>
                  {isEditing ? (
                    <input
                      type="tel"
                      value={preferences.sms.phoneNumber}
                      onChange={(e) => handleInputChange('sms', 'phoneNumber', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-primary-500"
                    />
                  ) : (
                    <p className="text-gray-900">{preferences.sms.phoneNumber}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Backup Phone</label>
                  {isEditing ? (
                    <input
                      type="tel"
                      value={preferences.sms.backupPhone}
                      onChange={(e) => handleInputChange('sms', 'backupPhone', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-primary-500"
                    />
                  ) : (
                    <p className="text-gray-600">{preferences.sms.backupPhone}</p>
                  )}
                </div>
              </div>
              {!isEditing && (
                <button
                  onClick={() => handleTestNotification('SMS')}
                  disabled={testSending}
                  className="mt-3 text-sm text-primary-600 hover:text-primary-700 flex items-center gap-1"
                >
                  {testSending ? <RefreshCw size={12} className="animate-spin" /> : <Smartphone size={12} />}
                  Test SMS
                </button>
              )}
            </>
          )}
        </div>

        {/* Alert Types */}
        <div className="border border-gray-200 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-4">
            <AlertCircle size={18} className="text-gray-600" />
            <h4 className="text-base font-semibold text-gray-900">Alert Preferences</h4>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="space-y-2">
              <label className="flex items-center justify-between py-1">
                <div className="flex items-center gap-2">
                  <Package size={14} className="text-gray-400" />
                  <span className="text-sm text-gray-700">Low Stock Alert</span>
                </div>
                {isEditing ? (
                  <input
                    type="checkbox"
                    checked={preferences.alerts.lowStock}
                    onChange={() => handleToggle('alerts', 'lowStock')}
                    className="rounded border-gray-300 text-primary-500"
                  />
                ) : (
                  <span className={`text-sm ${preferences.alerts.lowStock ? 'text-green-600' : 'text-gray-400'}`}>
                    {preferences.alerts.lowStock ? 'Enabled' : 'Disabled'}
                  </span>
                )}
              </label>
              
              {preferences.alerts.lowStock && isEditing && (
                <div className="ml-6">
                  <label className="block text-xs text-gray-500 mb-1">Threshold (units)</label>
                  <input
                    type="number"
                    value={preferences.alerts.stockThreshold}
                    onChange={(e) => handleInputChange('alerts', 'stockThreshold', parseInt(e.target.value))}
                    className="w-24 px-2 py-1 text-sm border border-gray-200 rounded-lg"
                  />
                </div>
              )}
              
              <label className="flex items-center justify-between py-1">
                <div className="flex items-center gap-2">
                  <AlertCircle size={14} className="text-gray-400" />
                  <span className="text-sm text-gray-700">Out of Stock Alert</span>
                </div>
                {isEditing ? (
                  <input
                    type="checkbox"
                    checked={preferences.alerts.outOfStock}
                    onChange={() => handleToggle('alerts', 'outOfStock')}
                    className="rounded border-gray-300 text-primary-500"
                  />
                ) : (
                  <span className={`text-sm ${preferences.alerts.outOfStock ? 'text-green-600' : 'text-gray-400'}`}>
                    {preferences.alerts.outOfStock ? 'Enabled' : 'Disabled'}
                  </span>
                )}
              </label>
              
              <label className="flex items-center justify-between py-1">
                <div className="flex items-center gap-2">
                  <ShoppingBag size={14} className="text-gray-400" />
                  <span className="text-sm text-gray-700">New Order Alert</span>
                </div>
                {isEditing ? (
                  <input
                    type="checkbox"
                    checked={preferences.alerts.newOrder}
                    onChange={() => handleToggle('alerts', 'newOrder')}
                    className="rounded border-gray-300 text-primary-500"
                  />
                ) : (
                  <span className={`text-sm ${preferences.alerts.newOrder ? 'text-green-600' : 'text-gray-400'}`}>
                    {preferences.alerts.newOrder ? 'Enabled' : 'Disabled'}
                  </span>
                )}
              </label>
              
              <label className="flex items-center justify-between py-1">
                <div className="flex items-center gap-2">
                  <TrendingUp size={14} className="text-gray-400" />
                  <span className="text-sm text-gray-700">Order Status Update</span>
                </div>
                {isEditing ? (
                  <input
                    type="checkbox"
                    checked={preferences.alerts.orderStatus}
                    onChange={() => handleToggle('alerts', 'orderStatus')}
                    className="rounded border-gray-300 text-primary-500"
                  />
                ) : (
                  <span className={`text-sm ${preferences.alerts.orderStatus ? 'text-green-600' : 'text-gray-400'}`}>
                    {preferences.alerts.orderStatus ? 'Enabled' : 'Disabled'}
                  </span>
                )}
              </label>
            </div>
            
            <div className="space-y-2">
              <label className="flex items-center justify-between py-1">
                <div className="flex items-center gap-2">
                  <CreditCard size={14} className="text-gray-400" />
                  <span className="text-sm text-gray-700">Payment Received</span>
                </div>
                {isEditing ? (
                  <input
                    type="checkbox"
                    checked={preferences.alerts.paymentReceived}
                    onChange={() => handleToggle('alerts', 'paymentReceived')}
                    className="rounded border-gray-300 text-primary-500"
                  />
                ) : (
                  <span className={`text-sm ${preferences.alerts.paymentReceived ? 'text-green-600' : 'text-gray-400'}`}>
                    {preferences.alerts.paymentReceived ? 'Enabled' : 'Disabled'}
                  </span>
                )}
              </label>
              
              <label className="flex items-center justify-between py-1">
                <div className="flex items-center gap-2">
                  <Users size={14} className="text-gray-400" />
                  <span className="text-sm text-gray-700">Customer Feedback</span>
                </div>
                {isEditing ? (
                  <input
                    type="checkbox"
                    checked={preferences.alerts.customerFeedback}
                    onChange={() => handleToggle('alerts', 'customerFeedback')}
                    className="rounded border-gray-300 text-primary-500"
                  />
                ) : (
                  <span className={`text-sm ${preferences.alerts.customerFeedback ? 'text-green-600' : 'text-gray-400'}`}>
                    {preferences.alerts.customerFeedback ? 'Enabled' : 'Disabled'}
                  </span>
                )}
              </label>
              
              <label className="flex items-center justify-between py-1">
                <div className="flex items-center gap-2">
                  <Calendar size={14} className="text-gray-400" />
                  <span className="text-sm text-gray-700">Daily Summary</span>
                </div>
                {isEditing ? (
                  <input
                    type="checkbox"
                    checked={preferences.alerts.dailySummary}
                    onChange={() => handleToggle('alerts', 'dailySummary')}
                    className="rounded border-gray-300 text-primary-500"
                  />
                ) : (
                  <span className={`text-sm ${preferences.alerts.dailySummary ? 'text-green-600' : 'text-gray-400'}`}>
                    {preferences.alerts.dailySummary ? 'Enabled' : 'Disabled'}
                  </span>
                )}
              </label>
              
              <label className="flex items-center justify-between py-1">
                <div className="flex items-center gap-2">
                  <Settings size={14} className="text-gray-400" />
                  <span className="text-sm text-gray-700">Weekly Report</span>
                </div>
                {isEditing ? (
                  <input
                    type="checkbox"
                    checked={preferences.alerts.weeklyReport}
                    onChange={() => handleToggle('alerts', 'weeklyReport')}
                    className="rounded border-gray-300 text-primary-500"
                  />
                ) : (
                  <span className={`text-sm ${preferences.alerts.weeklyReport ? 'text-green-600' : 'text-gray-400'}`}>
                    {preferences.alerts.weeklyReport ? 'Enabled' : 'Disabled'}
                  </span>
                )}
              </label>
            </div>
          </div>
        </div>

        {/* In-App Notification Settings */}
        <div className="border border-gray-200 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-4">
            <Bell size={18} className="text-gray-600" />
            <h4 className="text-base font-semibold text-gray-900">In-App Notifications</h4>
          </div>
          
          <div className="space-y-2">
            <label className="flex items-center justify-between py-1">
              <span className="text-sm text-gray-700">Enable In-App Notifications</span>
              {isEditing ? (
                <input
                  type="checkbox"
                  checked={preferences.inApp.enabled}
                  onChange={() => handleToggle('inApp', 'enabled')}
                  className="rounded border-gray-300 text-primary-500"
                />
              ) : (
                <span className={`text-sm ${preferences.inApp.enabled ? 'text-green-600' : 'text-gray-400'}`}>
                  {preferences.inApp.enabled ? 'Enabled' : 'Disabled'}
                </span>
              )}
            </label>
            
            {preferences.inApp.enabled && (
              <>
                <label className="flex items-center justify-between py-1">
                  <span className="text-sm text-gray-700">Play Sound</span>
                  {isEditing ? (
                    <input
                      type="checkbox"
                      checked={preferences.inApp.sound}
                      onChange={() => handleToggle('inApp', 'sound')}
                      className="rounded border-gray-300 text-primary-500"
                    />
                  ) : (
                    <span className={`text-sm ${preferences.inApp.sound ? 'text-green-600' : 'text-gray-400'}`}>
                      {preferences.inApp.sound ? 'Enabled' : 'Disabled'}
                    </span>
                  )}
                </label>
                
                <label className="flex items-center justify-between py-1">
                  <span className="text-sm text-gray-700">Desktop Notifications</span>
                  {isEditing ? (
                    <input
                      type="checkbox"
                      checked={preferences.inApp.desktop}
                      onChange={() => handleToggle('inApp', 'desktop')}
                      className="rounded border-gray-300 text-primary-500"
                    />
                  ) : (
                    <span className={`text-sm ${preferences.inApp.desktop ? 'text-green-600' : 'text-gray-400'}`}>
                      {preferences.inApp.desktop ? 'Enabled' : 'Disabled'}
                    </span>
                  )}
                </label>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}