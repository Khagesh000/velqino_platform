"use client"

import React, { useState, lazy, Suspense } from 'react'
import WholesaleNavbar from '../WholesalerDashboard/components/WholesaleNavbar'
import {
  BookOpen,
  MessageCircle,
  Ticket,
  Activity,
  Shield,
  Clock,
  Sparkles,
  Headphones
} from '@/utils/icons'

// Lazy load all non-critical components
const HelpCenter = lazy(() => import('./components/HelpCenter'))
const ContactSupport = lazy(() => import('./components/ContactSupport'))
const TicketHistory = lazy(() => import('./components/TicketHistory'))
const SystemStatus = lazy(() => import('./components/SystemStatus'))

// Executive loading placeholders
const SupportPlaceholder = () => (
  <div className="w-full bg-white rounded-2xl border border-slate-200/80 p-8 shadow-xs animate-pulse space-y-6">
    <div className="flex items-center gap-4">
      <div className="w-12 h-12 bg-slate-200 rounded-xl"></div>
      <div className="space-y-2 flex-1">
        <div className="h-5 bg-slate-200 rounded w-1/4"></div>
        <div className="h-3 bg-slate-200 rounded w-1/3"></div>
      </div>
    </div>
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <div className="h-28 bg-slate-100 rounded-xl"></div>
      <div className="h-28 bg-slate-100 rounded-xl"></div>
      <div className="h-28 bg-slate-100 rounded-xl"></div>
    </div>
    <div className="h-64 bg-slate-50 rounded-xl"></div>
  </div>
)

export default function Support() {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)
  const [activeTab, setActiveTab] = useState('helpcenter')

  const tabs = [
    { id: 'helpcenter', label: 'Help Center & Guides', icon: BookOpen, description: 'Articles, FAQs & video walkthroughs' },
    { id: 'contact', label: 'Contact Support & Desk', icon: MessageCircle, description: 'Live agent chat & ticket submission' },
    { id: 'tickets', label: 'Ticket History', icon: Ticket, description: 'Track open & resolved support inquiries' },
    { id: 'status', label: 'Infrastructure Status', icon: Activity, description: 'Real-time API & gateway uptime' }
  ]

  return (
    <div className="min-h-screen bg-slate-50/50 pb-20 lg:pb-12">
      <WholesaleNavbar 
        isSidebarCollapsed={isSidebarCollapsed}
        setIsSidebarCollapsed={setIsSidebarCollapsed}
      />
      
      <main className={`
        transition-all duration-300 p-3.5 sm:p-5 lg:p-7
        ${isSidebarCollapsed ? 'lg:ml-20' : 'lg:ml-64'}
      `}>
        <div className="w-full px-1 sm:px-2 md:px-4 lg:max-w-7xl lg:mx-auto space-y-6">
          
          {/* Executive Header Banner */}
          <div className="bg-gradient-to-r from-primary-600 via-primary-500 to-primary-600 text-white rounded-2xl p-6 sm:p-7 shadow-sm relative overflow-hidden">
            {/* Subtle background ornamentation */}
            <div className="absolute top-0 right-0 w-80 h-80 bg-white/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>
            <div className="absolute bottom-0 left-1/3 w-64 h-64 bg-black/10 rounded-full blur-2xl pointer-events-none"></div>

            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-5">
              <div className="space-y-2">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md border border-white/20 text-xs font-semibold text-white">
                  <Shield size={13} className="text-emerald-300" />
                  <span>24/7 Enterprise Merchant Care • Priority SLA</span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
                  Support & Resolution Center
                </h1>
                <p className="text-xs sm:text-sm text-primary-100 max-w-2xl font-medium leading-relaxed">
                  Access direct merchant assistance, real-time ticket escalation, B2B knowledge base guides, and platform health telemetry.
                </p>
              </div>

              {/* Live Support Metric Pills */}
              <div className="flex flex-wrap sm:flex-nowrap items-center gap-2.5">
                <div className="flex-1 sm:flex-initial bg-white/10 backdrop-blur-md border border-white/15 rounded-xl px-4 py-2.5 text-center min-w-[120px]">
                  <div className="flex items-center justify-center gap-1.5 text-emerald-300 text-xs font-bold">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                    <span>Desk Live</span>
                  </div>
                  <p className="text-2xs text-primary-150 uppercase tracking-wider font-semibold mt-0.5">Agent Status</p>
                </div>

                <div className="flex-1 sm:flex-initial bg-white/10 backdrop-blur-md border border-white/15 rounded-xl px-4 py-2.5 text-center min-w-[120px]">
                  <p className="text-sm font-bold text-white">&lt; 2 Mins</p>
                  <p className="text-2xs text-primary-150 uppercase tracking-wider font-semibold mt-0.5">Avg Response</p>
                </div>

                <div className="flex-1 sm:flex-initial bg-white/10 backdrop-blur-md border border-white/15 rounded-xl px-4 py-2.5 text-center min-w-[120px]">
                  <p className="text-sm font-bold text-white">99.98%</p>
                  <p className="text-2xs text-primary-150 uppercase tracking-wider font-semibold mt-0.5">System SLA</p>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Pill Tabs */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-2 shadow-xs overflow-x-auto scrollbar-none">
            <div className="flex items-center gap-1.5 min-w-max">
              {tabs.map(tab => {
                const Icon = tab.icon
                const isActive = activeTab === tab.id
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                      isActive
                        ? 'bg-primary-50 text-primary-700 shadow-2xs border border-primary-200/60'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                    }`}
                  >
                    <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                      isActive ? 'bg-primary-600 text-white' : 'bg-slate-100 text-slate-500'
                    }`}>
                      <Icon size={14} />
                    </div>
                    <div className="text-left">
                      <p className="leading-tight">{tab.label}</p>
                    </div>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Dynamic Tab Content Panels */}
          <div className="transition-all">
            {activeTab === 'helpcenter' && (
              <Suspense fallback={<SupportPlaceholder />}>
                <HelpCenter isActive={activeTab === 'helpcenter'} />
              </Suspense>
            )}

            {activeTab === 'contact' && (
              <Suspense fallback={<SupportPlaceholder />}>
                <ContactSupport isActive={activeTab === 'contact'} />
              </Suspense>
            )}

            {activeTab === 'tickets' && (
              <Suspense fallback={<SupportPlaceholder />}>
                <TicketHistory isActive={activeTab === 'tickets'} />
              </Suspense>
            )}

            {activeTab === 'status' && (
              <Suspense fallback={<SupportPlaceholder />}>
                <SystemStatus isActive={activeTab === 'status'} />
              </Suspense>
            )}
          </div>

        </div>
      </main>
    </div>
  )
}
