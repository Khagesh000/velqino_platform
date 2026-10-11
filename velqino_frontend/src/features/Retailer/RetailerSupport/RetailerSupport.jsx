"use client"

import React, { useState, lazy, Suspense } from 'react'
import RetailerNavbar from '../RetailerDashboard/components/RetailerNavbar'
import {
  HelpCircle,
  Headphones,
  BookOpen,
  Activity,
  CheckCircle,
  Clock,
  Sparkles,
  RefreshCw,
  Phone,
  Mail,
  ShieldCheck,
  ChevronRight,
  ExternalLink,
  MessageSquare
} from '../../../utils/icons'

// Lazy load all components
const HelpCenter = lazy(() => import('./components/HelpCenter'))
const ContactSupport = lazy(() => import('./components/ContactSupport'))
const KnowledgeBase = lazy(() => import('./components/KnowledgeBase'))
const SystemStatus = lazy(() => import('./components/SystemStatus'))

// Loading placeholders
const CardPlaceholder = () => (
  <div className="w-full h-[450px] bg-white rounded-3xl border border-gray-200/80 p-8 flex items-center justify-center animate-pulse">
    <div className="flex flex-col items-center gap-3">
      <div className="w-12 h-12 rounded-2xl bg-gray-100 flex items-center justify-center">
        <RefreshCw size={22} className="animate-spin text-gray-400" />
      </div>
      <p className="text-xs font-semibold text-gray-400">Loading support module...</p>
    </div>
  </div>
)

export default function RetailerSupport() {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)
  const [activeTab, setActiveTab] = useState('help')
  const [isRefreshing, setIsRefreshing] = useState(false)

  const supportTabs = [
    { id: 'help', label: 'Help Center', icon: <HelpCircle size={15} /> },
    { id: 'contact', label: 'Contact Support', icon: <Headphones size={15} /> },
    { id: 'knowledge', label: 'Knowledge Base', icon: <BookOpen size={15} /> },
    { id: 'status', label: 'System Status', icon: <Activity size={15} /> },
  ]

  const handleRefresh = () => {
    setIsRefreshing(true)
    setTimeout(() => {
      setIsRefreshing(false)
    }, 800)
  }

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
                  <HelpCircle size={12} className="text-primary-600" />
                  Merchant Support &amp; Knowledge Hub
                </span>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping inline-block" />
                  Live Support Desk Online
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
                Support Desk &amp; Merchant Assistance
              </h1>
              <p className="text-xs sm:text-sm text-gray-500 mt-1 max-w-3xl leading-relaxed">
                Access 24/7 priority live assistance, submit ticket requests, explore merchant training tutorials, and monitor real-time platform system operational metrics.
              </p>
            </div>

            {/* Quick Actions / Sync */}
            <div className="flex items-center gap-2.5 self-start md:self-auto shrink-0">
              <button
                type="button"
                onClick={handleRefresh}
                disabled={isRefreshing}
                className="px-4 py-2.5 rounded-2xl bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 active:scale-95 text-xs font-bold transition-all shadow-2xs flex items-center gap-2 disabled:opacity-50"
              >
                <RefreshCw size={14} className={isRefreshing ? 'animate-spin text-primary-600' : 'text-gray-500'} />
                <span>{isRefreshing ? 'Refreshing...' : 'Refresh Status'}</span>
              </button>
            </div>
          </div>

          {/* Top KPI Metrics Ribbon (4 Cards) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4">
            {/* Resolution Rate */}
            <div className="bg-white rounded-3xl p-4 sm:p-5 border border-gray-200/80 shadow-2xs flex items-center justify-between">
              <div>
                <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Resolution SLA</p>
                <h3 className="text-xl sm:text-2xl font-extrabold text-gray-900 mt-1 tracking-tight">
                  99.4%
                </h3>
                <span className="text-[10px] text-emerald-600 font-semibold mt-0.5 inline-flex items-center gap-0.5">
                  <CheckCircle size={10} /> 24h turn-around guarantee
                </span>
              </div>
              <div className="w-11 h-11 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                <CheckCircle size={20} />
              </div>
            </div>

            {/* Live Queue Wait */}
            <div className="bg-white rounded-3xl p-4 sm:p-5 border border-gray-200/80 shadow-2xs flex items-center justify-between">
              <div>
                <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Avg Response Time</p>
                <h3 className="text-xl sm:text-2xl font-extrabold text-gray-900 mt-1 tracking-tight">
                  &lt; 2 Mins
                </h3>
                <span className="text-[10px] text-emerald-600 font-semibold mt-0.5 inline-flex items-center gap-0.5">
                  <Clock size={10} /> Live chat instant queue
                </span>
              </div>
              <div className="w-11 h-11 rounded-2xl bg-primary-50 text-primary-600 flex items-center justify-center shrink-0">
                <Clock size={20} />
              </div>
            </div>

            {/* Channels Active */}
            <div className="bg-white rounded-3xl p-4 sm:p-5 border border-gray-200/80 shadow-2xs flex items-center justify-between">
              <div>
                <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Support Channels</p>
                <h3 className="text-xl sm:text-2xl font-extrabold text-gray-900 mt-1 tracking-tight">
                  4 Active
                </h3>
                <span className="text-[10px] text-primary-600 font-semibold mt-0.5 inline-flex items-center gap-0.5">
                  <Headphones size={10} /> Chat, Call, Mail &amp; Tickets
                </span>
              </div>
              <div className="w-11 h-11 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                <Headphones size={20} />
              </div>
            </div>

            {/* Platform Uptime */}
            <div className="bg-white rounded-3xl p-4 sm:p-5 border border-gray-200/80 shadow-2xs flex items-center justify-between">
              <div>
                <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Infrastructure</p>
                <h3 className="text-xl sm:text-2xl font-extrabold text-gray-900 mt-1 tracking-tight">
                  99.98%
                </h3>
                <span className="text-[10px] text-emerald-600 font-semibold mt-0.5 inline-flex items-center gap-0.5">
                  <Activity size={10} /> All clusters operational
                </span>
              </div>
              <div className="w-11 h-11 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                <Activity size={20} />
              </div>
            </div>
          </div>

          {/* Support Navigation Tabs */}
          <div className="bg-white rounded-3xl p-2.5 sm:p-3 border border-gray-200/80 shadow-2xs flex overflow-x-auto gap-2">
            {supportTabs.map((tab) => {
              const isActive = activeTab === tab.id
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-2.5 shrink-0 ${
                    isActive
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

          {/* Main Support Grid (2/3 + 1/3) */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
            
            {/* Left Column - Active Tab Module (2/3 width) */}
            <div className="lg:col-span-2">
              <Suspense fallback={<CardPlaceholder />}>
                {activeTab === 'help' && <HelpCenter />}
                {activeTab === 'contact' && <ContactSupport />}
                {activeTab === 'knowledge' && <KnowledgeBase />}
                {activeTab === 'status' && <SystemStatus />}
              </Suspense>
            </div>

            {/* Right Column - Quick Help & Hotline Console (1/3 width) */}
            <div className="space-y-6">
              {/* Emergency Hotline Card */}
              <div className="bg-gradient-to-br from-primary-900 to-indigo-950 rounded-3xl p-5 sm:p-6 text-white shadow-2xs space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-white/10 text-white flex items-center justify-center shrink-0 backdrop-blur-xs">
                    <Headphones size={20} />
                  </div>
                  <div>
                    <h4 className="text-sm font-extrabold text-white">24/7 Priority Desk</h4>
                    <p className="text-[11px] text-gray-300">Dedicated retail technical support</p>
                  </div>
                </div>

                <p className="text-xs text-gray-300 leading-relaxed">
                  Experiencing hardware printer drops or POS counter checkout halts? Reach our priority engineering desk immediately.
                </p>

                <div className="p-3.5 bg-white/10 rounded-2xl border border-white/10 flex items-center justify-between">
                  <div>
                    <p className="text-[10px] text-gray-300 uppercase tracking-wider font-semibold">Toll-Free Hotline</p>
                    <p className="text-base font-extrabold text-white mt-0.5 tracking-wide">+91 1800 123 4567</p>
                  </div>
                  <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                    <Phone size={16} />
                  </div>
                </div>

                <div className="pt-1 flex items-center gap-2.5">
                  <button
                    type="button"
                    onClick={() => setActiveTab('contact')}
                    className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-white text-primary-950 font-bold text-xs hover:bg-gray-100 transition-colors shadow-2xs"
                  >
                    <MessageSquare size={14} />
                    <span>Open Live Chat</span>
                  </button>
                  <span className="text-[10px] text-emerald-300 font-semibold flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    Queue: Free
                  </span>
                </div>
              </div>

              {/* System Compliance & Operational Card */}
              <div className="bg-white rounded-3xl p-5 sm:p-6 border border-gray-200/80 shadow-2xs space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                      <ShieldCheck size={18} />
                    </div>
                    <div>
                      <h4 className="text-sm font-extrabold text-gray-900">System Operational Status</h4>
                      <p className="text-[11px] text-gray-400">Continuous health telemetry</p>
                    </div>
                  </div>
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    Healthy
                  </span>
                </div>

                <div className="space-y-2.5 text-xs">
                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-gray-50/80 border border-gray-200/60">
                    <span className="text-gray-600 font-medium">POS Billing Engine</span>
                    <span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md text-[10px]">Operational</span>
                  </div>
                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-gray-50/80 border border-gray-200/60">
                    <span className="text-gray-600 font-medium">Payment Gateway Bridge</span>
                    <span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md text-[10px]">Operational</span>
                  </div>
                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-gray-50/80 border border-gray-200/60">
                    <span className="text-gray-600 font-medium">Cloud Vault Replication</span>
                    <span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md text-[10px]">Synchronized</span>
                  </div>
                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-gray-50/80 border border-gray-200/60">
                    <span className="text-gray-600 font-medium">GST Invoicing Gateway</span>
                    <span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md text-[10px]">Operational</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setActiveTab('status')}
                  className="w-full text-center text-xs font-bold text-primary-600 hover:text-primary-700 pt-1 flex items-center justify-center gap-1"
                >
                  <span>View Detailed Health Telemetry</span>
                  <ChevronRight size={13} />
                </button>
              </div>

              {/* Quick Knowledge Links */}
              <div className="bg-white rounded-3xl p-5 sm:p-6 border border-gray-200/80 shadow-2xs space-y-3.5">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-2xl bg-primary-50 text-primary-600 flex items-center justify-center shrink-0">
                    <Sparkles size={18} />
                  </div>
                  <div>
                    <h4 className="text-sm font-extrabold text-gray-900">Recommended Merchant Guides</h4>
                    <p className="text-[11px] text-gray-400">Step-by-step documentation</p>
                  </div>
                </div>

                <ul className="text-xs text-gray-600 space-y-2.5">
                  <li 
                    onClick={() => setActiveTab('help')}
                    className="flex items-center justify-between p-2 rounded-xl hover:bg-gray-50 cursor-pointer transition-colors border border-transparent hover:border-gray-200"
                  >
                    <span className="font-medium text-gray-800">Thermal Receipt Setup (58mm vs 80mm)</span>
                    <ChevronRight size={14} className="text-gray-400" />
                  </li>
                  <li 
                    onClick={() => setActiveTab('help')}
                    className="flex items-center justify-between p-2 rounded-xl hover:bg-gray-50 cursor-pointer transition-colors border border-transparent hover:border-gray-200"
                  >
                    <span className="font-medium text-gray-800">Multi-Counter Staff PIN Lock Setup</span>
                    <ChevronRight size={14} className="text-gray-400" />
                  </li>
                  <li 
                    onClick={() => setActiveTab('knowledge')}
                    className="flex items-center justify-between p-2 rounded-xl hover:bg-gray-50 cursor-pointer transition-colors border border-transparent hover:border-gray-200"
                  >
                    <span className="font-medium text-gray-800">GST Quarterly Invoice Filing Process</span>
                    <ChevronRight size={14} className="text-gray-400" />
                  </li>
                  <li 
                    onClick={() => setActiveTab('knowledge')}
                    className="flex items-center justify-between p-2 rounded-xl hover:bg-gray-50 cursor-pointer transition-colors border border-transparent hover:border-gray-200"
                  >
                    <span className="font-medium text-gray-800">Offline POS Sales Auto-Recovery</span>
                    <ChevronRight size={14} className="text-gray-400" />
                  </li>
                </ul>
              </div>

            </div>

          </div>
        </div>
      </main>
    </div>
  )
}
