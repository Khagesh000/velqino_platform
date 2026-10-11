"use client"

import React, { useState, lazy, Suspense } from 'react'
import RetailerNavbar from '../RetailerDashboard/components/RetailerNavbar'
import { 
  Users, RefreshCw, ShieldCheck, DollarSign, Award, 
  Clock, TrendingUp, Sparkles, Wallet 
} from '../../../utils/icons'

// Lazy load all components
const StaffList = lazy(() => import('./components/StaffList'))
const RolesPermissions = lazy(() => import('./components/RolesPermissions'))
const Attendance = lazy(() => import('./components/Attendance'))
const StaffPerformance = lazy(() => import('./components/StaffPerformance'))
const StaffPayout = lazy(() => import('./components/StaffPayout'))

// Loading placeholders
const TablePlaceholder = () => <div className="w-full h-[450px] bg-gray-100 rounded-3xl animate-pulse" />
const CardPlaceholder = () => <div className="w-full h-[380px] bg-gray-100 rounded-3xl animate-pulse" />
const SidebarPlaceholder = () => <div className="w-full h-[450px] bg-gray-100 rounded-3xl animate-pulse" />

export default function RetailerStaff() {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)
  const [selectedStaff, setSelectedStaff] = useState(null)
  const [refreshTrigger, setRefreshTrigger] = useState(0)
  const [isRefreshing, setIsRefreshing] = useState(false)

  const handleRefresh = () => {
    setIsRefreshing(true)
    setRefreshTrigger(prev => prev + 1)
    setTimeout(() => setIsRefreshing(false), 800)
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
                  <Users size={12} className="text-primary-600" />
                  Workforce &amp; Human Capital Hub
                </span>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping inline-block" />
                  Active Shifts On-Floor
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
                Staff &amp; Workforce Management
              </h1>
              <p className="text-xs sm:text-sm text-gray-500 mt-1 max-w-3xl leading-relaxed">
                Supervise employee directories, role-based security permissions, daily shift timesheets, quota achievements, and payroll compensation.
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
                <span>{isRefreshing ? 'Syncing...' : 'Sync Staff Data'}</span>
              </button>
            </div>
          </div>

          {/* Top KPI Metrics Ribbon (4 Cards) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4">
            {/* Total Staff Size */}
            <div className="bg-white rounded-3xl p-4 sm:p-5 border border-gray-200/80 shadow-2xs flex items-center justify-between">
              <div>
                <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Active Workforce</p>
                <h3 className="text-xl sm:text-2xl font-extrabold text-gray-900 mt-1 tracking-tight">
                  5 Employees
                </h3>
                <span className="text-[10px] text-emerald-600 font-semibold mt-0.5 inline-flex items-center gap-0.5">
                  <ShieldCheck size={10} /> 4 Store Roles Configured
                </span>
              </div>
              <div className="w-11 h-11 rounded-2xl bg-primary-50 text-primary-600 flex items-center justify-center shrink-0">
                <Users size={20} />
              </div>
            </div>

            {/* Today's Attendance Rate */}
            <div className="bg-white rounded-3xl p-4 sm:p-5 border border-gray-200/80 shadow-2xs flex items-center justify-between">
              <div>
                <p className="text-[11px] font-bold text-emerald-700 uppercase tracking-wider">Floor Attendance</p>
                <h3 className="text-xl sm:text-2xl font-extrabold text-emerald-800 mt-1 tracking-tight">
                  92.5% Rate
                </h3>
                <span className="text-[10px] text-emerald-700/80 mt-0.5 inline-flex items-center gap-0.5">
                  <Clock size={10} /> Regular shift fulfillment
                </span>
              </div>
              <div className="w-11 h-11 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                <Clock size={20} />
              </div>
            </div>

            {/* Target Quota Completion */}
            <div className="bg-white rounded-3xl p-4 sm:p-5 border border-gray-200/80 shadow-2xs flex items-center justify-between">
              <div>
                <p className="text-[11px] font-bold text-indigo-600 uppercase tracking-wider">Target Quota</p>
                <h3 className="text-xl sm:text-2xl font-extrabold text-indigo-700 mt-1 tracking-tight">
                  96.7% Pace
                </h3>
                <span className="text-[10px] text-indigo-600/80 mt-0.5 inline-flex items-center gap-0.5">
                  <TrendingUp size={10} /> ₹13.57L cumulative sales
                </span>
              </div>
              <div className="w-11 h-11 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                <TrendingUp size={20} />
              </div>
            </div>

            {/* Monthly Payroll Outflow */}
            <div className="bg-white rounded-3xl p-4 sm:p-5 border border-gray-200/80 shadow-2xs flex items-center justify-between">
              <div>
                <p className="text-[11px] font-bold text-amber-600 uppercase tracking-wider">Monthly Payroll</p>
                <h3 className="text-xl sm:text-2xl font-extrabold text-amber-700 mt-1 tracking-tight">
                  ₹1,38,510
                </h3>
                <span className="text-[10px] text-amber-600/80 mt-0.5 inline-flex items-center gap-0.5">
                  <Wallet size={10} /> Base + Commissions &amp; Bonuses
                </span>
              </div>
              <div className="w-11 h-11 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                <Wallet size={20} />
              </div>
            </div>
          </div>

          {/* Row 1: Staff Directory (2/3 width) + Roles & Permissions Matrix (1/3 width) */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
            {/* Left Column - Staff List Directory (2 cols) */}
            <div className="lg:col-span-2 flex flex-col min-h-0">
              <Suspense fallback={<TablePlaceholder />}>
                <StaffList 
                  selectedStaff={selectedStaff}
                  setSelectedStaff={setSelectedStaff}
                  refreshTrigger={refreshTrigger}
                />
              </Suspense>
            </div>

            {/* Right Column - Roles & Permissions (1 col) */}
            <div className="flex flex-col min-h-0">
              <Suspense fallback={<SidebarPlaceholder />}>
                <RolesPermissions />
              </Suspense>
            </div>
          </div>

          {/* Row 2: Attendance & Shift Timesheets + Staff Performance (Side-by-Side 2 Columns) */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
            {/* Left Column - Attendance Timesheets */}
            <div className="flex flex-col min-h-0">
              <Suspense fallback={<CardPlaceholder />}>
                <Attendance selectedStaff={selectedStaff} />
              </Suspense>
            </div>
            
            {/* Right Column - Staff Performance & Quotas */}
            <div className="flex flex-col min-h-0">
              <Suspense fallback={<CardPlaceholder />}>
                <StaffPerformance selectedStaff={selectedStaff} />
              </Suspense>
            </div>
          </div>

          {/* Row 3: Staff Compensation & Payroll Disbursements (Full Width) */}
          <div className="w-full">
            <Suspense fallback={<CardPlaceholder />}>
              <StaffPayout selectedStaff={selectedStaff} />
            </Suspense>
          </div>

        </div>
      </main>
    </div>
  )
}
