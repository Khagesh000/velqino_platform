"use client"

import React, { useState, lazy, Suspense } from 'react'
import RetailerNavbar from '../RetailerDashboard/components/RetailerNavbar'

// Lazy load all components
const ExpenseList = lazy(() => import('./Components/ExpenseList'))
const ExpenseCategories = lazy(() => import('./Components/ExpenseCategories'))
const AddExpense = lazy(() => import('./Components/AddExpense'))
const ExpenseReport = lazy(() => import('./Components/ExpenseReport'))
const BudgetTracking = lazy(() => import('./Components/BudgetTracking'))

// Loading placeholders
const TablePlaceholder = () => <div className="w-full h-[400px] bg-gray-100 rounded-xl animate-pulse" />
const CardPlaceholder = () => <div className="w-full h-[300px] bg-gray-100 rounded-xl animate-pulse" />
const SidebarPlaceholder = () => <div className="w-full h-[250px] bg-gray-100 rounded-xl animate-pulse" />

export default function RetailerExpenses() {
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
            <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">Expense Management</h1>
            <p className="text-sm text-gray-500 mt-1">Track and manage business expenses</p>
          </div>

          {/* Main Content - 2 Columns */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            
            {/* Left Column - Expense List (2/3 width) */}
            <div className="lg:col-span-2">
              <div style={{ minHeight: '450px' }}>
                <Suspense fallback={<TablePlaceholder />}>
                  <ExpenseList refreshTrigger={refreshTrigger} />
                </Suspense>
              </div>
            </div>

            {/* Right Column - Add Expense + Categories (1/3 width) */}
            <div className="space-y-6">
              <div style={{ minHeight: '300px' }}>
                <Suspense fallback={<SidebarPlaceholder />}>
                  <AddExpense onComplete={() => setRefreshTrigger(prev => prev + 1)} />
                </Suspense>
              </div>
              <div style={{ minHeight: '250px' }}>
                <Suspense fallback={<SidebarPlaceholder />}>
                  <ExpenseCategories />
                </Suspense>
              </div>
            </div>

          </div>

          {/* Bottom Section - 2 Columns */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            <div style={{ minHeight: '350px' }}>
              <Suspense fallback={<CardPlaceholder />}>
                <ExpenseReport refreshTrigger={refreshTrigger} />
              </Suspense>
            </div>
            
            <div style={{ minHeight: '350px' }}>
              <Suspense fallback={<CardPlaceholder />}>
                <BudgetTracking refreshTrigger={refreshTrigger} />
              </Suspense>
            </div>

          </div>
        </div>
      </main>
    </div>
  )
}