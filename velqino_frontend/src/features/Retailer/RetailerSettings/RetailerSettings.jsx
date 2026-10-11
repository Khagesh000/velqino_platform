"use client"

import React, { useState, useEffect, lazy, Suspense } from 'react'
import RetailerNavbar from '../RetailerDashboard/components/RetailerNavbar'
import {
  Store,
  Printer,
  FileText,
  Tag,
  Receipt,
  Database,
  Shield,
  Bell,
  RefreshCw,
  CheckCircle,
  AlertCircle,
  HelpCircle,
  Settings,
  Sparkles,
  ShieldCheck
} from '../../../utils/icons'

// Lazy load settings tabs for snappy route transitions
const StoreProfile = lazy(() => import('./components/StoreProfile'))
const PosSettings = lazy(() => import('./components/PosSettings'))
const TaxSettings = lazy(() => import('./components/TaxSettings'))
const DiscountSettings = lazy(() => import('./components/DiscountSettings'))
const ReceiptCustomization = lazy(() => import('./components/ReceiptCustomization'))
const BackupRestore = lazy(() => import('./components/BackupRestore'))
const StaffAccess = lazy(() => import('./components/StaffAccess'))
const NotificationPreferences = lazy(() => import('./components/NotificationPreferences'))

export default function RetailerSettings() {
  const [mounted, setMounted] = useState(false)
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)
  const [activeTab, setActiveTab] = useState('profile')
  const [isSyncing, setIsSyncing] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleRefresh = () => {
    setIsSyncing(true)
    setTimeout(() => {
      setIsSyncing(false)
    }, 800)
  }

  const settingsTabs = [
    { id: 'profile', label: 'Store Profile', icon: <Store size={15} /> },
    { id: 'pos', label: 'POS Peripherals', icon: <Printer size={15} /> },
    { id: 'tax', label: 'Tax & GST', icon: <FileText size={15} /> },
    { id: 'discount', label: 'Discounts & Offers', icon: <Tag size={15} /> },
    { id: 'receipt', label: 'Receipt Template', icon: <Receipt size={15} /> },
    { id: 'backup', label: 'Cloud Backups', icon: <Database size={15} /> },
    { id: 'staff', label: 'Security & Access', icon: <Shield size={15} /> },
    { id: 'notifications', label: 'Notifications', icon: <Bell size={15} /> },
  ]

  const CardPlaceholder = () => (
    <div className="bg-white rounded-3xl border border-gray-200/80 p-8 flex items-center justify-center min-h-[400px]">
      <div className="flex flex-col items-center gap-3">
        <RefreshCw size={24} className="animate-spin text-primary-600" />
        <span className="text-xs font-semibold text-gray-500">Loading module configuration...</span>
      </div>
    </div>
  )

  if (!mounted) return null

  return (
    <div className="min-h-screen bg-[#f8fafc] text-gray-900 pb-20 lg:pb-12">
      <RetailerNavbar
        isSidebarCollapsed={isSidebarCollapsed}
        setIsSidebarCollapsed={setIsSidebarCollapsed}
      />

      <main className={`
        transition-all duration-300 p-4 sm:p-6 lg:p-8
        ${isSidebarCollapsed ? 'lg:ml-20' : 'lg:ml-64'}
      `}>
        <div className="max-w-[1600px] mx-auto space-y-6">

          {/* Executive Header Ribbon */}
          <div className="bg-white rounded-3xl p-5 sm:p-7 border border-gray-200/80 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-primary-50 text-primary-700 border border-primary-100">
                  <Settings size={12} className="text-primary-600" />
                  Store Controls &amp; Preferences Hub
                </span>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping inline-block" />
                  Live Sync Active
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
                Store Settings &amp; System Governance
              </h1>
              <p className="text-xs sm:text-sm text-gray-500 mt-1 max-w-3xl leading-relaxed">
                Supervise store profile credentials, hardware POS peripherals, GST taxation, promotional discount rules, thermal receipts, cloud backups, and staff credentials.
              </p>
            </div>

            {/* Quick Actions / Sync */}
            <div className="flex items-center gap-2.5 self-start md:self-auto shrink-0">
              <button
                type="button"
                onClick={handleRefresh}
                disabled={isSyncing}
                className="px-4 py-2.5 rounded-2xl bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 active:scale-95 text-xs font-bold transition-all shadow-2xs flex items-center gap-2 disabled:opacity-50"
              >
                <RefreshCw size={14} className={isSyncing ? 'animate-spin text-primary-600' : 'text-gray-500'} />
                <span>{isSyncing ? 'Syncing...' : 'Sync Settings'}</span>
              </button>
            </div>
          </div>

          {/* Top KPI Metrics Ribbon (4 Standard Global Cards) */}
          {/*   <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4">
            
            <div className="bg-white rounded-3xl p-4 sm:p-5 border border-gray-200/80 shadow-2xs flex items-center justify-between">
              <div>
                <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Store Identity</p>
                <h3 className="text-xl sm:text-2xl font-extrabold text-gray-900 mt-1 tracking-tight">
                  Verified Store
                </h3>
                <span className="text-[10px] text-emerald-600 font-semibold mt-0.5 inline-flex items-center gap-0.5">
                  <ShieldCheck size={10} /> GST Active (29ABCDE...)
                </span>
              </div>
              <div className="w-11 h-11 rounded-2xl bg-primary-50 text-primary-600 flex items-center justify-center shrink-0">
                <Store size={20} />
              </div>
            </div>

            
            <div className="bg-white rounded-3xl p-4 sm:p-5 border border-gray-200/80 shadow-2xs flex items-center justify-between">
              <div>
                <p className="text-[11px] font-bold text-emerald-700 uppercase tracking-wider">POS Peripherals</p>
                <h3 className="text-xl sm:text-2xl font-extrabold text-emerald-800 mt-1 tracking-tight">
                  3 Devices Online
                </h3>
                <span className="text-[10px] text-emerald-700/80 mt-0.5 inline-flex items-center gap-0.5">
                  <Printer size={10} /> Printer, Scanner &amp; Drawer
                </span>
              </div>
              <div className="w-11 h-11 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                <Printer size={20} />
              </div>
            </div>

       
            <div className="bg-white rounded-3xl p-4 sm:p-5 border border-gray-200/80 shadow-2xs flex items-center justify-between">
              <div>
                <p className="text-[11px] font-bold text-indigo-600 uppercase tracking-wider">Security Access</p>
                <h3 className="text-xl sm:text-2xl font-extrabold text-indigo-700 mt-1 tracking-tight">
                  4 Staff Accounts
                </h3>
                <span className="text-[10px] text-indigo-600/80 mt-0.5 inline-flex items-center gap-0.5">
                  <Shield size={10} /> Role ACL &amp; PIN Lock Active
                </span>
              </div>
              <div className="w-11 h-11 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                <Shield size={20} />
              </div>
            </div>

           
            <div className="bg-white rounded-3xl p-4 sm:p-5 border border-gray-200/80 shadow-2xs flex items-center justify-between">
              <div>
                <p className="text-[11px] font-bold text-amber-600 uppercase tracking-wider">Cloud Recovery</p>
                <h3 className="text-xl sm:text-2xl font-extrabold text-amber-700 mt-1 tracking-tight">
                  Auto-Sync On
                </h3>
                <span className="text-[10px] text-amber-600/80 mt-0.5 inline-flex items-center gap-0.5">
                  <Database size={10} /> Daily snapshot at 10 PM
                </span>
              </div>
              <div className="w-11 h-11 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                <Database size={20} />
              </div>
            </div>
          </div> */}

          {/* Navigation Tabs Bar */}
          <div className="bg-white rounded-3xl p-2.5 sm:p-3 border border-gray-200/80 shadow-2xs flex overflow-x-auto gap-2">
            {settingsTabs.map((tab) => {
              const isActive = activeTab === tab.id
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-2.5 shrink-0 ${isActive
                      ? 'bg-primary-600 text-white shadow-xs'
                      : 'bg-gray-50/70 text-gray-600 hover:bg-gray-100 hover:text-gray-900 border border-gray-200/60'
                    }`}
                >
                  <span className={isActive ? 'text-white' : 'text-primary-600'}>
                    {tab.icon}
                  </span>
                  <span>{tab.label}</span>
                </button>
              )
            })}
          </div>

          {/* Main Settings Console Layout: 2/3 Content + 1/3 Sidebar Info */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">

            {/* Left Column - Active Settings Module (2/3 width) */}
            <div className="lg:col-span-2">
              <Suspense fallback={<CardPlaceholder />}>
                {activeTab === 'profile' && <StoreProfile />}
                {activeTab === 'pos' && <PosSettings />}
                {activeTab === 'tax' && <TaxSettings />}
                {activeTab === 'discount' && <DiscountSettings />}
                {activeTab === 'receipt' && <ReceiptCustomization />}
                {activeTab === 'backup' && <BackupRestore />}
                {activeTab === 'staff' && <StaffAccess />}
                {activeTab === 'notifications' && <NotificationPreferences />}
              </Suspense>
            </div>

            {/* Right Column - System Health & Guidance Console (1/3 width) */}
            <div className="space-y-6">
              {/* System Compliance Card */}
              <div className="bg-white rounded-3xl p-5 sm:p-6 border border-gray-200/80 shadow-2xs space-y-4">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                    <ShieldCheck size={18} />
                  </div>
                  <div>
                    <h4 className="text-sm font-extrabold text-gray-900">System Compliance Status</h4>
                    <p className="text-[11px] text-gray-400">Security &amp; legal readiness</p>
                  </div>
                </div>

                <div className="space-y-2.5 text-xs">
                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-gray-50/80 border border-gray-200/60">
                    <span className="text-gray-600 font-medium">GST Invoicing Engine</span>
                    <span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md text-[10px]">Active</span>
                  </div>
                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-gray-50/80 border border-gray-200/60">
                    <span className="text-gray-600 font-medium">Thermal Print Driver</span>
                    <span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md text-[10px]">Connected</span>
                  </div>
                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-gray-50/80 border border-gray-200/60">
                    <span className="text-gray-600 font-medium">Cloud Vault Snapshot</span>
                    <span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md text-[10px]">Up-to-Date</span>
                  </div>
                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-gray-50/80 border border-gray-200/60">
                    <span className="text-gray-600 font-medium">Database Encryption</span>
                    <span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md text-[10px]">AES-256</span>
                  </div>
                </div>
              </div>

              {/* Quick Operation Guidelines */}
              <div className="bg-white rounded-3xl p-5 sm:p-6 border border-gray-200/80 shadow-2xs space-y-3.5">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-2xl bg-primary-50 text-primary-600 flex items-center justify-center shrink-0">
                    <Sparkles size={18} />
                  </div>
                  <div>
                    <h4 className="text-sm font-extrabold text-gray-900">Operational Best Practices</h4>
                    <p className="text-[11px] text-gray-400">Store administration tips</p>
                  </div>
                </div>

                <ul className="text-xs text-gray-600 space-y-2.5 leading-relaxed">
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary-600 mt-1.5 shrink-0" />
                    <span>Verify GSTIN and PAN details on invoices to ensure valid tax credit passes to buyers.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary-600 mt-1.5 shrink-0" />
                    <span>Always run a test print after changing thermal paper roll widths (58mm vs 80mm).</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary-600 mt-1.5 shrink-0" />
                    <span>Enforce daily automated cloud backups to safeguard against localized terminal failures.</span>
                  </li>
                </ul>
              </div>

              {/* Support & Docs Card */}
              <div className="bg-gradient-to-br from-primary-900 to-indigo-950 rounded-3xl p-5 sm:p-6 text-white shadow-2xs space-y-3.5">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-2xl bg-white/10 text-white flex items-center justify-center shrink-0 backdrop-blur-xs">
                    <HelpCircle size={18} />
                  </div>
                  <div>
                    <h4 className="text-sm font-extrabold text-white">Velqino Enterprise Support</h4>
                    <p className="text-[11px] text-gray-300">24/7 Priority SLA assistance</p>
                  </div>
                </div>

                <p className="text-xs text-gray-300 leading-relaxed">
                  Need assistance calibrating barcode scanners or synchronizing GST return filings? Contact our technical engineering team.
                </p>

                <div className="pt-1 flex items-center gap-2.5">
                  <a
                    href="mailto:support@velqino.com"
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white text-primary-950 font-bold text-xs hover:bg-gray-100 transition-colors shadow-2xs"
                  >
                    Open Support Ticket
                  </a>
                  <span className="text-[10px] text-gray-400">Typical reply: &lt; 15 mins</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
