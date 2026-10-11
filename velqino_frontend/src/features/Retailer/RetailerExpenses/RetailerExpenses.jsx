"use client"

import React, { useState, lazy, Suspense } from 'react'
import RetailerNavbar from '../RetailerDashboard/components/RetailerNavbar'
import { 
  Receipt, Plus, RefreshCw, Wallet, Target, 
  TrendingUp, Layers, ChevronRight, CheckCircle, AlertCircle
} from '../../../utils/icons'

// Lazy load all components
const ExpenseList = lazy(() => import('./components/ExpenseList'))
const ExpenseCategories = lazy(() => import('./components/ExpenseCategories'))
const AddExpense = lazy(() => import('./components/AddExpense'))
const ExpenseReport = lazy(() => import('./components/ExpenseReport'))
const BudgetTracking = lazy(() => import('./components/BudgetTracking'))

// Loading placeholders
const TablePlaceholder = () => (
  <div className="w-full h-96 bg-white rounded-2xl border border-gray-100 p-6 flex flex-col justify-center items-center space-y-3">
    <div className="w-10 h-10 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" />
    <span className="text-xs font-semibold text-gray-500">Loading ledger data...</span>
  </div>
)
const CardPlaceholder = () => (
  <div className="w-full h-80 bg-white rounded-2xl border border-gray-100 p-6 flex flex-col justify-center items-center space-y-3">
    <div className="w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" />
    <span className="text-xs font-semibold text-gray-500">Loading metrics...</span>
  </div>
)
const SidebarPlaceholder = () => (
  <div className="w-full h-64 bg-white rounded-2xl border border-gray-100 p-6 flex flex-col justify-center items-center space-y-3">
    <div className="w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" />
    <span className="text-xs font-semibold text-gray-500">Loading widget...</span>
  </div>
)

export default function RetailerExpenses() {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)
  const [refreshTrigger, setRefreshTrigger] = useState(0)
  const [activeTab, setActiveTab] = useState('overview') // 'overview' | 'ledger' | 'add' | 'budgets'

  const handleRefresh = () => {
    setRefreshTrigger(prev => prev + 1)
  }

  return (
    <div className="min-h-screen bg-gray-50/60 pb-20 lg:pb-10 font-sans antialiased text-gray-900">
      <RetailerNavbar 
        isSidebarCollapsed={isSidebarCollapsed}
        setIsSidebarCollapsed={setIsSidebarCollapsed}
      />
      
      <main className={`
        transition-all duration-300 p-4 lg:p-8
        ${isSidebarCollapsed ? 'lg:ml-20' : 'lg:ml-64'}
      `}>
        <div className="max-w-7xl mx-auto space-y-6">
          
          {/* Executive Header Banner */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-bold bg-primary-50 text-primary-700 border border-primary-200/50">
                  Fiscal Outflow Management
                </span>
                <span className="text-xs text-gray-400">•</span>
                <span className="text-xs font-medium text-gray-500">April 2026</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
                Operating Expenses & Budgets
              </h1>
              <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
                Monitor business disbursements, manage category allocations, and track budget utilization
              </p>
            </div>

            {/* Quick Actions */}
            <div className="flex items-center gap-2 self-start sm:self-auto">
              <button
                type="button"
                onClick={handleRefresh}
                title="Refresh Ledger and Analytics"
                className="flex items-center gap-1.5 px-3.5 py-2 bg-white hover:bg-gray-50 text-gray-700 font-bold rounded-xl text-xs border border-gray-200 shadow-2xs transition-all active:scale-[0.98]"
              >
                <RefreshCw size={13} className="text-gray-500" />
                <span>Refresh</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('add')}
                className="flex items-center gap-1.5 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white font-bold rounded-xl text-xs shadow-xs shadow-primary-500/20 transition-all active:scale-[0.98]"
              >
                <Plus size={14} />
                <span>Record Expense</span>
              </button>
            </div>
          </div>

          {/* Top 4 KPI Executive Metric Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Card 1: Total Outflow */}
            <div className="bg-white rounded-2xl p-4 sm:p-5 border border-gray-100 shadow-xs relative overflow-hidden group hover:border-gray-200 transition-all">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Total Outflow</span>
                <div className="w-8 h-8 rounded-xl bg-primary-50 text-primary-600 flex items-center justify-center font-bold">
                  <Wallet size={16} />
                </div>
              </div>
              <p className="text-2xl font-black text-gray-900 tracking-tight">₹56,200</p>
              <div className="flex items-center gap-1.5 mt-2 text-xs">
                <span className="inline-flex items-center text-[10px] font-bold text-rose-700 bg-rose-50 border border-rose-200/60 px-1.5 py-0.2 rounded-md">
                  +4.2% MoM
                </span>
                <span className="text-gray-400">7 transactions</span>
              </div>
            </div>

            {/* Card 2: Budget Ceiling */}
            <div className="bg-white rounded-2xl p-4 sm:p-5 border border-gray-100 shadow-xs relative overflow-hidden group hover:border-gray-200 transition-all">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Monthly Ceiling</span>
                <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
                  <Target size={16} />
                </div>
              </div>
              <p className="text-2xl font-black text-gray-900 tracking-tight">₹62,000</p>
              <div className="flex items-center gap-1.5 mt-2 text-xs">
                <span className="inline-flex items-center text-[10px] font-bold text-indigo-700 bg-indigo-50 border border-indigo-200/60 px-1.5 py-0.2 rounded-md">
                  90.6% used
                </span>
                <span className="text-gray-400">Fixed Cap</span>
              </div>
            </div>

            {/* Card 3: Safe Margin */}
            <div className="bg-white rounded-2xl p-4 sm:p-5 border border-gray-100 shadow-xs relative overflow-hidden group hover:border-gray-200 transition-all">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Remaining Buffer</span>
                <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                  <CheckCircle size={16} />
                </div>
              </div>
              <p className="text-2xl font-black text-emerald-600 tracking-tight">₹5,800</p>
              <div className="flex items-center gap-1.5 mt-2 text-xs">
                <span className="inline-flex items-center text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200/60 px-1.5 py-0.2 rounded-md">
                  Safe
                </span>
                <span className="text-gray-400">9.4% buffer left</span>
              </div>
            </div>

            {/* Card 4: Dominant Cost Center */}
            <div className="bg-white rounded-2xl p-4 sm:p-5 border border-gray-100 shadow-xs relative overflow-hidden group hover:border-gray-200 transition-all">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Top Cost Center</span>
                <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
                  <Layers size={16} />
                </div>
              </div>
              <p className="text-2xl font-black text-gray-900 tracking-tight truncate">Staff Salary</p>
              <div className="flex items-center gap-1.5 mt-2 text-xs">
                <span className="inline-flex items-center text-[10px] font-bold text-purple-700 bg-purple-50 border border-purple-200/60 px-1.5 py-0.2 rounded-md">
                  ₹25,000
                </span>
                <span className="text-gray-400">44.5% of total</span>
              </div>
            </div>
          </div>

          {/* Navigation Mode Tabs */}
          <div className="flex items-center gap-2 border-b border-gray-200/80 pb-3 overflow-x-auto">
            <button
              type="button"
              onClick={() => setActiveTab('overview')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                activeTab === 'overview'
                  ? 'bg-gray-900 text-white shadow-xs'
                  : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
              }`}
            >
              Overview Dashboard
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('ledger')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                activeTab === 'ledger'
                  ? 'bg-gray-900 text-white shadow-xs'
                  : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
              }`}
            >
              Expense Ledger
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('add')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                activeTab === 'add'
                  ? 'bg-gray-900 text-white shadow-xs'
                  : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
              }`}
            >
              Record New Expense
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('budgets')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                activeTab === 'budgets'
                  ? 'bg-gray-900 text-white shadow-xs'
                  : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
              }`}
            >
              Envelopes & Budgets
            </button>
          </div>

          {/* Tab 1: Overview View */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Primary Workspace Grid: 2/3 Ledger + 1/3 Quick Actions */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left: Expense Ledger Table (2 cols) */}
                <div className="lg:col-span-2">
                  <Suspense fallback={<TablePlaceholder />}>
                    <ExpenseList refreshTrigger={refreshTrigger} />
                  </Suspense>
                </div>

                {/* Right: Add Expense & Category Allocations (1 col) */}
                <div className="space-y-6">
                  <Suspense fallback={<SidebarPlaceholder />}>
                    <AddExpense onComplete={() => setRefreshTrigger(prev => prev + 1)} />
                  </Suspense>
                  <Suspense fallback={<SidebarPlaceholder />}>
                    <ExpenseCategories />
                  </Suspense>
                </div>
              </div>

              {/* Bottom Analytics & Budget Tracking: 2 Columns */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Suspense fallback={<CardPlaceholder />}>
                  <ExpenseReport refreshTrigger={refreshTrigger} />
                </Suspense>
                <Suspense fallback={<CardPlaceholder />}>
                  <BudgetTracking refreshTrigger={refreshTrigger} />
                </Suspense>
              </div>
            </div>
          )}

          {/* Tab 2: Full Width Ledger */}
          {activeTab === 'ledger' && (
            <div className="w-full">
              <Suspense fallback={<TablePlaceholder />}>
                <ExpenseList refreshTrigger={refreshTrigger} />
              </Suspense>
            </div>
          )}

          {/* Tab 3: Dedicated Add Expense Form */}
          {activeTab === 'add' && (
            <div className="max-w-xl mx-auto">
              <Suspense fallback={<SidebarPlaceholder />}>
                <AddExpense onComplete={() => {
                  setRefreshTrigger(prev => prev + 1)
                  setActiveTab('overview')
                }} />
              </Suspense>
            </div>
          )}

          {/* Tab 4: Categories & Budgets Dedicated View */}
          {activeTab === 'budgets' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Suspense fallback={<SidebarPlaceholder />}>
                <ExpenseCategories />
              </Suspense>
              <Suspense fallback={<CardPlaceholder />}>
                <BudgetTracking refreshTrigger={refreshTrigger} />
              </Suspense>
            </div>
          )}

        </div>
      </main>
    </div>
  )
}
