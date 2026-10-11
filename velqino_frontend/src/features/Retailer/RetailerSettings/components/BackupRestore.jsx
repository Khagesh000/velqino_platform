"use client"

import React, { useState, useEffect } from 'react'
import { Database, Download, Upload, RefreshCw, CheckCircle, AlertCircle, Clock, Calendar, Trash2, Save, X, FileText, HardDrive } from '../../../../utils/icons'

export default function BackupRestore() {
  const [mounted, setMounted] = useState(false)
  const [isBackingUp, setIsBackingUp] = useState(false)
  const [isRestoring, setIsRestoring] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [showConfirmModal, setShowConfirmModal] = useState(false)
  const [selectedFile, setSelectedFile] = useState(null)
  
  const [backupHistory, setBackupHistory] = useState([
    { id: 1, date: '2026-04-14', time: '10:30 AM', size: '2.4 MB', type: 'Automated Cloud', status: 'success' },
    { id: 2, date: '2026-04-13', time: '10:30 AM', size: '2.4 MB', type: 'Automated Cloud', status: 'success' },
    { id: 3, date: '2026-04-12', time: '02:15 PM', size: '2.3 MB', type: 'Manual Snapshot', status: 'success' },
    { id: 4, date: '2026-04-11', time: '10:30 AM', size: '2.3 MB', type: 'Automated Cloud', status: 'success' },
    { id: 5, date: '2026-04-10', time: '09:00 AM', size: '2.2 MB', type: 'Manual Snapshot', status: 'success' },
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
      const now = new Date()
      const newBackup = {
        id: Date.now(),
        date: now.toISOString().split('T')[0],
        time: now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
        size: '2.5 MB',
        type: 'Manual Snapshot',
        status: 'success'
      }
      setBackupHistory(prev => [newBackup, ...prev])
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

  const handleDeleteBackup = (id) => {
    if (confirm('Are you sure you want to delete this backup snapshot?')) {
      setBackupHistory(prev => prev.filter(b => b.id !== id))
    }
  }

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
  }

  return (
    <div className="bg-white rounded-3xl border border-gray-200/80 shadow-2xs overflow-hidden transition-all duration-300">
      {/* Header */}
      <div className="p-5 sm:p-6 border-b border-gray-100 bg-gradient-to-r from-gray-50/60 via-white to-gray-50/30">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-primary-50 border border-primary-100 flex items-center justify-center text-primary-600 shadow-2xs shrink-0">
              <Database size={20} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-extrabold text-gray-900 tracking-tight">Data Safety &amp; Cloud Vault</h3>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  AES-256 Encrypted
                </span>
              </div>
              <p className="text-xs text-gray-500 mt-0.5">Automate continuous snapshots, off-site cloud storage, and database recovery</p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3.5 py-2 rounded-xl self-start sm:self-auto">
            <CheckCircle size={14} />
            <span>Last Sync: Today 10:30 AM</span>
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
            <p className="text-xs font-bold text-emerald-900">Backup Operation Successful</p>
            <p className="text-xs text-emerald-700">Snapshot created and synchronized with encrypted cloud replica vault.</p>
          </div>
        </div>
      )}

      <div className="p-5 sm:p-6 space-y-6">
        {/* Quick Actions (Two interactive feature cards) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button
            type="button"
            onClick={handleBackup}
            disabled={isBackingUp}
            className="p-5 bg-gradient-to-br from-primary-50/70 to-white border border-primary-200/80 rounded-2xl hover:border-primary-300 hover:shadow-xs transition-all text-left flex items-start justify-between group disabled:opacity-50"
          >
            <div className="flex items-start gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-primary-600 text-white flex items-center justify-center shadow-xs shrink-0 group-hover:scale-105 transition-transform">
                {isBackingUp ? <RefreshCw size={22} className="animate-spin" /> : <Download size={22} />}
              </div>
              <div>
                <h4 className="text-sm font-bold text-gray-900">Create Instant Backup Snapshot</h4>
                <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">
                  Generates full compressed archive of products, sales registers, and customer accounts.
                </p>
                <span className="inline-flex items-center gap-1.5 text-2xs font-bold text-primary-700 mt-2.5">
                  {isBackingUp ? 'Generating snapshot...' : 'Trigger Now →'}
                </span>
              </div>
            </div>
          </button>

          <label className="p-5 bg-gradient-to-br from-gray-50/80 to-white border border-gray-200/80 rounded-2xl hover:border-gray-300 hover:shadow-xs transition-all text-left flex items-start justify-between cursor-pointer group">
            <div className="flex items-start gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-gray-800 text-white flex items-center justify-center shadow-xs shrink-0 group-hover:scale-105 transition-transform">
                <Upload size={22} />
              </div>
              <div>
                <h4 className="text-sm font-bold text-gray-900">Restore Data From Archive</h4>
                <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">
                  Upload previously downloaded .zip or .json snapshot to restore store database state.
                </p>
                <span className="inline-flex items-center gap-1.5 text-2xs font-bold text-gray-700 mt-2.5">
                  Select Backup Archive →
                </span>
              </div>
            </div>
            <input type="file" accept=".zip,.json" onChange={handleFileUpload} className="hidden" />
          </label>
        </div>

        {/* Section 1: Automated Cloud Backup Policy */}
        <div>
          <div className="flex items-center gap-2 mb-3.5">
            <div className="w-7 h-7 rounded-lg bg-gray-100 flex items-center justify-center text-gray-700">
              <Clock size={16} />
            </div>
            <div>
              <h4 className="text-sm font-bold text-gray-900">Automated Backup Schedule</h4>
              <p className="text-xs text-gray-500">Scheduled nightly synchronization to off-site cloud storage</p>
            </div>
          </div>

          <div className="p-5 rounded-2xl border border-gray-200/80 bg-gray-50/40 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-gray-200/70">
              <div>
                <span className="text-xs font-bold text-gray-900 block">Automatic Cloud Vault Snapshots</span>
                <span className="text-2xs text-gray-500">Executes silently without interfering with ongoing POS billing</span>
              </div>
              <button
                type="button"
                onClick={() => setSettings(prev => ({ ...prev, autoBackup: !prev.autoBackup }))}
                className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${
                  settings.autoBackup ? 'bg-primary-600' : 'bg-gray-300'
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition duration-200 ease-in-out ${
                    settings.autoBackup ? 'translate-x-4' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {settings.autoBackup && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-1">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5">Backup Frequency</label>
                  <select
                    value={settings.backupFrequency}
                    onChange={(e) => setSettings(prev => ({ ...prev, backupFrequency: e.target.value }))}
                    className="w-full px-3.5 py-2 text-sm bg-white border border-gray-200 rounded-xl text-gray-900 font-semibold focus:outline-none focus:ring-2 focus:ring-primary-500/20"
                  >
                    <option value="daily">Nightly (Every 24 Hours)</option>
                    <option value="weekly">Weekly (Every Sunday)</option>
                    <option value="monthly">Monthly Cycle</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5">Scheduled Execution Time</label>
                  <input
                    type="time"
                    value={settings.backupTime}
                    onChange={(e) => setSettings(prev => ({ ...prev, backupTime: e.target.value }))}
                    className="w-full px-3.5 py-2 text-sm bg-white border border-gray-200 rounded-xl text-gray-900 font-semibold focus:outline-none focus:ring-2 focus:ring-primary-500/20"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5">Retention Window</label>
                  <select
                    value={settings.retentionDays}
                    onChange={(e) => setSettings(prev => ({ ...prev, retentionDays: parseInt(e.target.value) }))}
                    className="w-full px-3.5 py-2 text-sm bg-white border border-gray-200 rounded-xl text-gray-900 font-semibold focus:outline-none focus:ring-2 focus:ring-primary-500/20"
                  >
                    <option value={15}>15 Rolling Days</option>
                    <option value={30}>30 Rolling Days (Recommended)</option>
                    <option value={60}>60 Rolling Days</option>
                    <option value={90}>90 Rolling Days</option>
                  </select>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Section 2: Scope of Included Data */}
        <div>
          <div className="flex items-center gap-2 mb-3.5">
            <div className="w-7 h-7 rounded-lg bg-gray-100 flex items-center justify-center text-gray-700">
              <HardDrive size={16} />
            </div>
            <div>
              <h4 className="text-sm font-bold text-gray-900">Snapshot Content Coverage</h4>
              <p className="text-xs text-gray-500">Modules and data partitions included in automatic and manual backups</p>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            {[
              { key: 'includeProducts', label: 'Products & SKUs', desc: 'Catalog, barcodes & pricing' },
              { key: 'includeOrders', label: 'Sales & Invoices', desc: 'Transactions & bills' },
              { key: 'includeCustomers', label: 'Customer CRM', desc: 'Loyalty balances & ledger' },
              { key: 'includeMedia', label: 'Product Images', desc: 'Visual media assets' },
              { key: 'includeSettings', label: 'Store Config', desc: 'Taxes, staff PINs & POS' },
            ].map(({ key, label, desc }) => {
              const isChecked = settings[key]
              return (
                <button
                  type="button"
                  key={key}
                  onClick={() => setSettings(prev => ({ ...prev, [key]: !prev[key] }))}
                  className={`p-3.5 rounded-2xl border text-left transition-all ${
                    isChecked
                      ? 'border-primary-200/80 bg-primary-50/20 shadow-2xs'
                      : 'border-gray-200/70 bg-gray-50/40 text-gray-400'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-bold text-gray-900">{label}</span>
                    <span className={`w-4 h-4 rounded-md flex items-center justify-center text-2xs ${
                      isChecked ? 'bg-primary-600 text-white' : 'bg-gray-200 text-transparent'
                    }`}>
                      ✓
                    </span>
                  </div>
                  <p className="text-2xs text-gray-500">{desc}</p>
                </button>
              )
            })}
          </div>
        </div>

        {/* Section 3: Snapshot History Ledger */}
        <div>
          <div className="flex items-center justify-between mb-3.5">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-gray-100 flex items-center justify-center text-gray-700">
                <FileText size={16} />
              </div>
              <div>
                <h4 className="text-sm font-bold text-gray-900">Recent Backup Ledger</h4>
                <p className="text-xs text-gray-500">Historical archive points stored in high-durability cloud storage</p>
              </div>
            </div>

            <span className="text-xs font-semibold text-gray-500">
              Showing {backupHistory.length} checkpoints
            </span>
          </div>

          <div className="border border-gray-200/80 rounded-2xl overflow-hidden bg-white shadow-2xs">
            <div className="divide-y divide-gray-100">
              {backupHistory.map((backup) => (
                <div key={backup.id} className="p-4 flex items-center justify-between hover:bg-gray-50/60 transition-colors">
                  <div className="flex items-center gap-3.5">
                    <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center justify-center shrink-0">
                      <CheckCircle size={17} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-gray-900">{formatDate(backup.date)} at {backup.time}</span>
                        <span className="text-2xs font-semibold px-2 py-0.5 rounded-full bg-gray-100 text-gray-600 border border-gray-200">
                          {backup.type}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 mt-0.5">Archive Size: {backup.size} • Status: Verified Valid</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      className="p-2 text-gray-500 hover:text-primary-600 hover:bg-primary-50 rounded-xl transition-all"
                      title="Download archive"
                    >
                      <Download size={16} />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteBackup(backup.id)}
                      className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
                      title="Delete checkpoint"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Section 4: Storage Meter */}
        <div className="p-5 rounded-2xl border border-gray-200/80 bg-gray-50/40">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-gray-900">Cloud Vault Storage Quota</span>
            <span className="text-xs font-bold text-primary-700">156 MB / 1.0 GB (15% Allocated)</span>
          </div>
          <div className="w-full h-2.5 bg-gray-200/80 rounded-full overflow-hidden mb-2">
            <div className="h-full bg-primary-600 rounded-full transition-all duration-500" style={{ width: '15.6%' }} />
          </div>
          <div className="flex justify-between text-2xs text-gray-500">
            <span>844 MB free cloud storage available</span>
            <span>Upgraded to Velqino Enterprise Cloud Vault</span>
          </div>
        </div>
      </div>

      {/* Restore Confirmation Caution Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-950/60 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-gray-100">
            <div className="flex items-center justify-between pb-4 border-b border-gray-100">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-700 border border-amber-200 flex items-center justify-center">
                  <AlertCircle size={20} />
                </div>
                <h3 className="text-base font-bold text-gray-900">Confirm Database Rollback</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowConfirmModal(false)}
                className="w-7 h-7 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 flex items-center justify-center"
              >
                <X size={16} />
              </button>
            </div>

            <div className="py-4 space-y-3">
              <p className="text-xs text-gray-600 leading-relaxed">
                You are about to restore the store database from archive:
              </p>
              
              <div className="p-3 rounded-xl bg-gray-50 border border-gray-200 font-mono text-xs text-gray-800">
                <span className="font-bold">{selectedFile?.name || 'velqino_snapshot_20260414.zip'}</span>
                <span className="text-gray-500 block text-2xs mt-0.5">
                  Size: {selectedFile?.size ? `${(selectedFile.size / 1024 / 1024).toFixed(2)} MB` : '2.4 MB'}
                </span>
              </div>

              <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs">
                ⚠️ <span className="font-bold">Caution:</span> Any transactions recorded after this snapshot was created will be superseded by the restored backup.
              </div>
            </div>

            <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
              <button
                type="button"
                onClick={() => setShowConfirmModal(false)}
                className="flex-1 py-2.5 text-xs sm:text-sm font-semibold text-gray-700 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-all"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmRestore}
                disabled={isRestoring}
                className="flex-1 py-2.5 text-xs sm:text-sm font-semibold text-white bg-amber-600 hover:bg-amber-700 rounded-xl transition-all shadow-xs flex items-center justify-center gap-1.5"
              >
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
