"use client"

import React, { useState, lazy, Suspense } from 'react'
import RetailerNavbar from '../RetailerDashboard/components/RetailerNavbar'

// Lazy load all components
const HelpCenter = lazy(() => import('./Components/HelpCenter'))
const ContactSupport = lazy(() => import('./Components/ContactSupport'))
const KnowledgeBase = lazy(() => import('./Components/KnowledgeBase'))
const SystemStatus = lazy(() => import('./Components/SystemStatus'))

// Loading placeholders
const CardPlaceholder = () => <div className="w-full h-[350px] bg-gray-100 rounded-xl animate-pulse" />
const SidebarPlaceholder = () => <div className="w-full h-[250px] bg-gray-100 rounded-xl animate-pulse" />

export default function RetailerSupport() {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)
  const [activeTab, setActiveTab] = useState('help')

  const supportTabs = [
    { id: 'help', label: 'Help Center', icon: '📚' },
    { id: 'contact', label: 'Contact Support', icon: '💬' },
    { id: 'knowledge', label: 'Knowledge Base', icon: '📖' },
    { id: 'status', label: 'System Status', icon: '🟢' },
  ]

  return (
    <div className="min-h-screen bg-gray-50 pb-20 lg:pb-0">
      <RetailerNavbar 
        isSidebarCollapsed={isSidebarCollapsed}
        setIsSidebarCollapsed={setIsSidebarCollapsed}
      />
      
      <main className={`
        transition-all duration-300 p-4 lg:p-6
        ${isSidebarCollapsed ? 'lg:ml-20' : 'lg:ml-64'}
      `}>
        <div className="max-w-7xl mx-auto">
          
          {/* Page Header */}
          <div className="mb-6">
            <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">Support Center</h1>
            <p className="text-sm text-gray-500 mt-1">Get help and support for your store</p>
          </div>

          {/* Support Tabs */}
          <div className="flex overflow-x-auto gap-2 mb-6 pb-2 border-b border-gray-200">
            {supportTabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-5 py-2.5 text-sm font-medium rounded-lg transition-all whitespace-nowrap flex items-center gap-2 ${
                  activeTab === tab.id
                    ? 'bg-primary-500 text-white shadow-md'
                    : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
                }`}
              >
                <span>{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            ))}
          </div>

          {/* Content based on active tab */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Main Content (2/3 width) */}
            <div className="lg:col-span-2">
              <div style={{ minHeight: '500px' }}>
                <Suspense fallback={<CardPlaceholder />}>
                  {activeTab === 'help' && <HelpCenter />}
                  {activeTab === 'contact' && <ContactSupport />}
                  {activeTab === 'knowledge' && <KnowledgeBase />}
                  {activeTab === 'status' && <SystemStatus />}
                </Suspense>
              </div>
            </div>

            {/* Right Sidebar - Quick Help (1/3 width) */}
            <div className="space-y-6">
              <div className="bg-gradient-to-r from-primary-50 to-blue-50 rounded-xl p-5 border border-primary-100">
                <h4 className="text-sm font-semibold text-primary-800 mb-2">🚀 Need Immediate Help?</h4>
                <p className="text-xs text-primary-600 mb-3">Our support team is available 24/7 to assist you.</p>
                <button 
                  onClick={() => setActiveTab('contact')}
                  className="text-xs bg-primary-500 text-white px-4 py-2 rounded-lg hover:bg-primary-600 transition-all"
                >
                  Contact Support Now
                </button>
              </div>
              
              <div className="bg-gray-50 rounded-xl p-5 border border-gray-200">
                <h4 className="text-sm font-semibold text-gray-800 mb-3">📋 Quick Links</h4>
                <ul className="text-xs text-gray-600 space-y-2">
                  <li className="flex items-center gap-2 cursor-pointer hover:text-primary-600">
                    <span>•</span> POS Setup Guide
                  </li>
                  <li className="flex items-center gap-2 cursor-pointer hover:text-primary-600">
                    <span>•</span> How to add products?
                  </li>
                  <li className="flex items-center gap-2 cursor-pointer hover:text-primary-600">
                    <span>•</span> Managing orders
                  </li>
                  <li className="flex items-center gap-2 cursor-pointer hover:text-primary-600">
                    <span>•</span> GST filing guide
                  </li>
                </ul>
              </div>

              <div className="bg-green-50 rounded-xl p-5 border border-green-100">
                <h4 className="text-sm font-semibold text-green-800 mb-2">✅ System Status</h4>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                  <span className="text-xs text-green-700">All systems operational</span>
                </div>
                <p className="text-xs text-green-600 mt-2">Last checked: Just now</p>
              </div>
            </div>

          </div>
        </div>
      </main>
    </div>
  )
}