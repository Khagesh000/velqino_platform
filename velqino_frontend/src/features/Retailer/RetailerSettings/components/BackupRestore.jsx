"use client"

import React, { useState, useEffect } from 'react'
import { Database, Download, Upload, RefreshCw, CheckCircle, AlertCircle, Clock, Calendar, Trash2, Save, X, FileText, HardDrive } from '../../../../utils/icons'
import '../../../../styles/Retailer/RetailerSettings/BackupRestore.scss'

export default function BackupRestore() {
  const [mounted, setMounted] = useState(false)
  const [isBackingUp, setIsBackingUp] = useState(false)
  const [isRestoring, setIsRestoring] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [showConfirmModal, setShowConfirmModal] = useState(false)
  const [selectedFile, setSelectedFile] = useState(null)
  const [backupHistory, setBackupHistory] = useState([
    { id: 1, date: '2026-04-14', time: '10:30 AM', size: '2.4 MB', type: 'Auto', status: 'success' },
    { id: 2, date: '2026-04-13', time: '10:30 AM', size: '2.4 MB', type: 'Auto', status: 'success' },
    { id: 3, date: '2026-04-12', time: '02:15 PM', size: '2.4 MB', type: 'Manual', status: 'success' },
    { id: 4, date: '2026-04-11', time: '10:30 AM', size: '2.4 MB', type: 'Auto', status: 'success' },
    { id: 5, date: '2026-04-10', time: '09:00 AM', size: '2.4 MB', type: 'Manual', status: 'success' },
  ])

  const [settings, setSettings] = useState({
    autoBackup: true,
    backupFrequency: 'daily',
    backupTime: '22:00',
    retentionDays: 30,
    backupLocation: 'cloud',
    includeMedia: true,
    includeOrders: true,
    includeCustomers: true,
    includeProducts: true,
    includeSettings: true
  })

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  const handleBackup = async () => {
    setIsBackingUp(true)
    setTimeout(() => {
      setIsBackingUp(false)
      setShowSuccess(true)
      setTimeout(() => setShowSuccess(false), 3000)
    }, 2000)
  }

  const handleRestore = () => {
    setShowConfirmModal(true)
  }

  const confirmRestore = () => {
    setIsRestoring(true)
    setTimeout(() => {
      setIsRestoring(false)
      setShowConfirmModal(false)
      setShowSuccess(true)
      setTimeout(() => setShowSuccess(false), 3000)
    }, 2000)
  }

  const handleFileUpload = (e) => {
    const file = e.target.files[0]
    if (file) {
      setSelectedFile(file)
      handleRestore()
    }
  }

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
  }

  return (
    <div className="backup-restore bg-white rounded-xl shadow-sm border border-gray-100">
      {/* Header */}
      <div className="p-5 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <Database size={22} className="text-primary-500" />
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Backup & Restore</h3>
            <p className="text-sm text-gray-500">Manage your data backups and restore</p>
          </div>
        </div>
      </div>

      {/* Success Message */}
      {showSuccess && (
        <div className="mx-5 mt-4 p-3 bg-green-100 rounded-lg flex items-center gap-2 animate-fadeIn">
          <CheckCircle size={16} className="text-green-600" />
          <span className="text-sm text-green-700">Operation completed successfully!</span>
        </div>
      )}

      <div className="p-5 space-y-6">
        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button
            onClick={handleBackup}
            disabled={isBackingUp}
            className="p-4 bg-primary-50 border border-primary-200 rounded-xl hover:bg-primary-100 transition-all disabled:opacity-50"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary-500 rounded-lg">
                <Download size={20} className="text-white" />
              </div>
              <div className="text-left">
                <h4 className="font-semibold text-gray-900">Create Backup</h4>
                <p className="text-xs text-gray-500">Backup all store data</p>
              </div>
              {isBackingUp && <RefreshCw size={16} className="animate-spin ml-auto text-primary-500" />}
            </div>
          </button>

          <label className="p-4 bg-gray-50 border border-gray-200 rounded-xl hover:bg-gray-100 transition-all cursor-pointer">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gray-600 rounded-lg">
                <Upload size={20} className="text-white" />
              </div>
              <div className="text-left flex-1">
                <h4 className="font-semibold text-gray-900">Restore Backup</h4>
                <p className="text-xs text-gray-500">Restore from backup file</p>
              </div>
              <input type="file" accept=".zip,.json" onChange={handleFileUpload} className="hidden" />
            </div>
          </label>
        </div>

        {/* Auto Backup Settings */}
        <div className="border border-gray-200 rounded-lg p-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Clock size={18} className="text-gray-600" />
              <h4 className="text-base font-semibold text-gray-900">Auto Backup Settings</h4>
            </div>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={settings.autoBackup}
                onChange={(e) => setSettings({ ...settings, autoBackup: e.target.checked })}
                className="rounded border-gray-300 text-primary-500"
              />
              <span className="text-sm text-gray-600">Enable Auto Backup</span>
            </label>
          </div>
          
          {settings.autoBackup && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Backup Frequency</label>
                  <select
                    value={settings.backupFrequency}
                    onChange={(e) => setSettings({ ...settings, backupFrequency: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-primary-500"
                  >
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Backup Time</label>
                  <input
                    type="time"
                    value={settings.backupTime}
                    onChange={(e) => setSettings({ ...settings, backupTime: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-primary-500"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Retention Period (days)</label>
                <select
                  value={settings.retentionDays}
                  onChange={(e) => setSettings({ ...settings, retentionDays: parseInt(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-primary-500"
                >
                  <option value={15}>15 days</option>
                  <option value={30}>30 days</option>
                  <option value={60}>60 days</option>
                  <option value={90}>90 days</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Backup Location</label>
                <select
                  value={settings.backupLocation}
                  onChange={(e) => setSettings({ ...settings, backupLocation: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-primary-500"
                >
                  <option value="cloud">Cloud Storage</option>
                  <option value="local">Local Storage</option>
                  <option value="both">Both</option>
                </select>
              </div>
            </div>
          )}
        </div>

        {/* Backup Content Selection */}
        <div className="border border-gray-200 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-4">
            <HardDrive size={18} className="text-gray-600" />
            <h4 className="text-base font-semibold text-gray-900">Backup Content</h4>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={settings.includeProducts}
                onChange={(e) => setSettings({ ...settings, includeProducts: e.target.checked })}
                className="rounded border-gray-300 text-primary-500"
              />
              <span className="text-sm text-gray-700">Products</span>
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={settings.includeOrders}
                onChange={(e) => setSettings({ ...settings, includeOrders: e.target.checked })}
                className="rounded border-gray-300 text-primary-500"
              />
              <span className="text-sm text-gray-700">Orders</span>
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={settings.includeCustomers}
                onChange={(e) => setSettings({ ...settings, includeCustomers: e.target.checked })}
                className="rounded border-gray-300 text-primary-500"
              />
              <span className="text-sm text-gray-700">Customers</span>
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={settings.includeMedia}
                onChange={(e) => setSettings({ ...settings, includeMedia: e.target.checked })}
                className="rounded border-gray-300 text-primary-500"
              />
              <span className="text-sm text-gray-700">Media Files</span>
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={settings.includeSettings}
                onChange={(e) => setSettings({ ...settings, includeSettings: e.target.checked })}
                className="rounded border-gray-300 text-primary-500"
              />
              <span className="text-sm text-gray-700">Settings</span>
            </label>
          </div>
        </div>

        {/* Backup History */}
        <div className="border border-gray-200 rounded-lg p-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <FileText size={18} className="text-gray-600" />
              <h4 className="text-base font-semibold text-gray-900">Backup History</h4>
            </div>
            <button className="text-xs text-primary-600">View All</button>
          </div>
          
          <div className="space-y-2">
            {backupHistory.slice(0, 3).map((backup) => (
              <div key={backup.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="p-1.5 bg-green-100 rounded-lg">
                    <CheckCircle size={14} className="text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{formatDate(backup.date)} at {backup.time}</p>
                    <p className="text-xs text-gray-500">{backup.size} • {backup.type} Backup</p>
                  </div>
                </div>
                <div className="flex gap-1">
                  <button className="p-1 text-gray-400 hover:text-primary-600">
                    <Download size={14} />
                  </button>
                  <button className="p-1 text-gray-400 hover:text-red-600">
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-3 p-3 bg-blue-50 rounded-lg">
            <div className="flex items-center gap-2">
              <AlertCircle size={14} className="text-blue-600" />
              <p className="text-xs text-blue-700">Last backup: Today at 10:30 AM</p>
            </div>
          </div>
        </div>

        {/* Storage Info */}
        <div className="border border-gray-200 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-3">
            <HardDrive size={18} className="text-gray-600" />
            <h4 className="text-base font-semibold text-gray-900">Storage Usage</h4>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Used Storage</span>
              <span className="font-medium text-gray-900">156 MB / 1 GB</span>
            </div>
            <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
              <div className="h-full bg-primary-500 rounded-full" style={{ width: '15%' }} />
            </div>
            <p className="text-xs text-gray-500">15% used • 844 MB available</p>
          </div>
        </div>
      </div>

      {/* Restore Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 animate-fadeIn">
          <div className="bg-white rounded-xl max-w-md w-full p-5">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <AlertCircle size={18} className="text-orange-500" />
                <h3 className="text-lg font-semibold text-gray-900">Confirm Restore</h3>
              </div>
              <button onClick={() => setShowConfirmModal(false)} className="p-1 text-gray-400 hover:text-gray-600">
                <X size={20} />
              </button>
            </div>
            
            <div className="space-y-3">
              <p className="text-sm text-gray-700">Are you sure you want to restore from backup?</p>
              <div className="bg-yellow-50 rounded-lg p-3">
                <p className="text-xs text-yellow-700">⚠️ Warning: This will overwrite all current data. Current data will be lost.</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-xs text-gray-600">Backup file: {selectedFile?.name || 'backup_20260414.zip'}</p>
                <p className="text-xs text-gray-500">Size: {selectedFile?.size ? `${(selectedFile.size / 1024 / 1024).toFixed(2)} MB` : '2.4 MB'}</p>
              </div>
            </div>
            
            <div className="flex gap-2 mt-5">
              <button onClick={() => setShowConfirmModal(false)} className="flex-1 px-4 py-2 text-sm text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50">
                Cancel
              </button>
              <button onClick={confirmRestore} disabled={isRestoring} className="flex-1 px-4 py-2 text-sm bg-orange-500 text-white rounded-lg hover:bg-orange-600 flex items-center justify-center gap-2">
                {isRestoring ? <RefreshCw size={14} className="animate-spin" /> : <Upload size={14} />}
                Confirm Restore
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}