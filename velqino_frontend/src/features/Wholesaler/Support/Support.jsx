"use client"

import React, { useState, lazy, Suspense } from 'react'
import WholesaleNavbar from '../WholesalerDashboard/components/WholesaleNavbar'

// Lazy load all non-critical components
const HelpCenter = lazy(() => import('./components/HelpCenter'))
const ContactSupport = lazy(() => import('./Components/ContactSupport'))
const TicketHistory = lazy(() => import('./Components/TicketHistory'))
const SystemStatus = lazy(() => import('./Components/SystemStatus')) 

// Loading placeholders
const HelpCenterPlaceholder = () => <div className="w-full h-[500px] bg-gray-50 rounded-xl animate-pulse" />
const ContactPlaceholder = () => <div className="w-full h-[450px] bg-gray-50 rounded-xl animate-pulse" />
const TicketPlaceholder = () => <div className="w-full h-[400px] bg-gray-50 rounded-xl animate-pulse" />
const StatusPlaceholder = () => <div className="w-full h-[350px] bg-gray-50 rounded-xl animate-pulse" /> 

export default function Support() {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)
  const [activeTab, setActiveTab] = useState('helpcenter')

  const tabs = [
    { id: 'helpcenter', label: 'Help Center', icon: '📚' },
    { id: 'contact', label: 'Contact Support', icon: '💬' },
    { id: 'tickets', label: 'Ticket History', icon: '🎫' },
    { id: 'status', label: 'System Status', icon: '📊' }
  ]

  return (
    <div className="min-h-screen bg-gray-50 pb-20 lg:pb-0">
      <WholesaleNavbar 
        isSidebarCollapsed={isSidebarCollapsed}
        setIsSidebarCollapsed={setIsSidebarCollapsed}
      />
      
      <main className={`
        transition-all duration-300 p-3 sm:p-4  lg:p-6
        ${isSidebarCollapsed ? 'lg:ml-20' : 'lg:ml-64'}
      `}>
        <div className="w-full px-2 sm:px-4 md:px-6 lg:max-w-7xl lg:mx-auto overflow-x-hidden">
          
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-lg lg:rounded-xl bg-primary-100 flex items-center justify-center text-primary-600">
                <svg className="w-5 h-5 lg:w-6 lg:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636L16.95 7.05m2.828 2.828l-1.414 1.414M12 4.5v2m0 0H9m3 0h3m-6 0H6m12 0h-3M6 12H4.5M12 12h9m-9 0v6m0-6h-3m3 0h3m-6 0h-3m12 0h3M6 21h12a2 2 0 002-2V9a2 2 0 00-2-2H6a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <h1 className="text-xl lg:text-2xl font-bold text-gray-900">Support Center</h1>
                <p className="text-sm text-gray-500">Get help, browse resources, and track your support requests</p>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="overflow-x-auto scrollbar-hide  mb-6">
            <div className="flex items-center gap-1 border-b border-gray-200 min-w-max pb-px">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium capitalize border-b-2 transition-all whitespace-nowrap flex items-center gap-1 sm:gap-2 ${
                    activeTab === tab.id
                      ? 'border-primary-500 text-primary-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <span className="text-sm sm:text-base">{tab.icon}</span>
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Tab Content */}
          {activeTab === 'helpcenter' && (
            <div style={{ minHeight: '500px' }}>
              <Suspense fallback={<HelpCenterPlaceholder />}>
                <HelpCenter />
              </Suspense>
            </div>
          )}

           {activeTab === 'contact' && (
            <div style={{ minHeight: '450px' }}>
              <Suspense fallback={<ContactPlaceholder />}>
                <ContactSupport />
              </Suspense>
            </div>
          )} 

           {activeTab === 'tickets' && (
            <div style={{ minHeight: '400px' }}>
              <Suspense fallback={<TicketPlaceholder />}>
                <TicketHistory />
              </Suspense>
            </div>
          )} 

         {activeTab === 'status' && (
            <div style={{ minHeight: '350px' }}>
              <Suspense fallback={<StatusPlaceholder />}>
                <SystemStatus />
              </Suspense>
            </div>
          )} 

        </div>
      </main>
    </div>
  )
}