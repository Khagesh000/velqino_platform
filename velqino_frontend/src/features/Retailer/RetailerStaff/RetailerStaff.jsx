"use client"

import React, { useState, lazy, Suspense } from 'react'
import RetailerNavbar from '../RetailerDashboard/components/RetailerNavbar'

// Lazy load all components
const StaffList = lazy(() => import('./Components/StaffList'))
const RolesPermissions = lazy(() => import('./Components/RolesPermissions'))
const StaffPerformance = lazy(() => import('./Components/StaffPerformance'))
const Attendance = lazy(() => import('./Components/Attendance'))
const StaffPayout = lazy(() => import('./Components/StaffPayout'))

// Loading placeholders
const TablePlaceholder = () => <div className="w-full h-[400px] bg-gray-100 rounded-xl animate-pulse" />
const CardPlaceholder = () => <div className="w-full h-[350px] bg-gray-100 rounded-xl animate-pulse" />
const SidebarPlaceholder = () => <div className="w-full h-[300px] bg-gray-100 rounded-xl animate-pulse" />

export default function RetailerStaff() {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)
  const [selectedStaff, setSelectedStaff] = useState(null)
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
            <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">Staff Management</h1>
            <p className="text-sm text-gray-500 mt-1">Manage employees, roles, attendance and payroll</p>
          </div>

          {/* Main Content - 2 Columns */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            
            {/* Left Column - Staff List (2/3 width) */}
            <div className="lg:col-span-2 h-full">
              <div style={{ minHeight: '450px' }}>
                <Suspense fallback={<TablePlaceholder />}>
                  <StaffList 
                    selectedStaff={selectedStaff}
                    setSelectedStaff={setSelectedStaff}
                    refreshTrigger={refreshTrigger}
                  />
                </Suspense>
              </div>
            </div>

            {/* Right Column - Roles & Permissions (1/3 width) */}
            <div className="h-full">
              <div style={{ minHeight: '450px' }}>
                <Suspense fallback={<SidebarPlaceholder />}>
                  <RolesPermissions />
                </Suspense>
              </div>
            </div>

          </div>

          {/* Bottom Section - 3 Columns */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            <div className="h-full">
              <div style={{ minHeight: '350px' }}>
                <Suspense fallback={<CardPlaceholder />}>
                  <StaffPerformance selectedStaff={selectedStaff} />
                </Suspense>
              </div>
            </div>
            
            <div className="h-full">
              <div style={{ minHeight: '350px' }}>
                <Suspense fallback={<CardPlaceholder />}>
                  <Attendance selectedStaff={selectedStaff} />
                </Suspense>
              </div>
            </div>
            
            <div className="h-full">
              <div style={{ minHeight: '350px' }}>
                <Suspense fallback={<CardPlaceholder />}>
                  <StaffPayout selectedStaff={selectedStaff} />
                </Suspense>
              </div>
            </div>

          </div>
        </div>
      </main>
    </div>
  )
}