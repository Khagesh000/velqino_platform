"use client"

import React, { useState, lazy, Suspense } from 'react'
import RetailerNavbar from '../RetailerDashboard/components/RetailerNavbar'

// Lazy load all components
const ProgramSettings = lazy(() => import('./Components/ProgramSettings'))
const MemberList = lazy(() => import('./Components/MemberList'))
const PointsTransaction = lazy(() => import('./Components/PointsTransaction'))
const RewardsCatalog = lazy(() => import('./Components/RewardsCatalog'))
const Campaigns = lazy(() => import('./Components/Campaigns'))

// Loading placeholders
const TablePlaceholder = () => <div className="w-full h-[400px] bg-gray-100 rounded-xl animate-pulse" />
const CardPlaceholder = () => <div className="w-full h-[300px] bg-gray-100 rounded-xl animate-pulse" />
const SidebarPlaceholder = () => <div className="w-full h-[350px] bg-gray-100 rounded-xl animate-pulse" />

export default function RetailerLoyalty() {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)
  const [refreshTrigger, setRefreshTrigger] = useState(0)

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
            <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">Loyalty Program</h1>
            <p className="text-sm text-gray-500 mt-1">Manage customer rewards and loyalty points</p>
          </div>

          {/* Program Settings - Full Width */}
          <div className="mb-6">
            <div style={{ minHeight: '200px' }}>
              <Suspense fallback={<CardPlaceholder />}>
                <ProgramSettings />
              </Suspense>
            </div>
          </div>

          {/* Main Content - 2 Columns */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            
            {/* Left Column - Member List (2/3 width) */}
            <div className="lg:col-span-2 h-full">
              <div style={{ minHeight: '450px' }}>
                <Suspense fallback={<TablePlaceholder />}>
                  <MemberList refreshTrigger={refreshTrigger} />
                </Suspense>
              </div>
            </div>

            {/* Right Column - Points Transaction (1/3 width) */}
            <div className="h-full">
              <div style={{ minHeight: '450px' }}>
                <Suspense fallback={<SidebarPlaceholder />}>
                  <PointsTransaction refreshTrigger={refreshTrigger} />
                </Suspense>
              </div>
            </div>

          </div>

          {/* Bottom Section - 2 Columns */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            <div className="h-full">
              <div style={{ minHeight: '400px' }}>
                <Suspense fallback={<CardPlaceholder />}>
                  <RewardsCatalog />
                </Suspense>
              </div>
            </div>
            
            <div className="h-full">
              <div style={{ minHeight: '400px' }}>
                <Suspense fallback={<CardPlaceholder />}>
                  <Campaigns />
                </Suspense>
              </div>
            </div>

          </div>
        </div>
      </main>
    </div>
  )
}