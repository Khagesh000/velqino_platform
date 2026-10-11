"use client"

import React, { useState, lazy, Suspense } from 'react'
import RetailerNavbar from '../RetailerDashboard/components/RetailerNavbar'
import { Truck, RefreshCw, Plus, Users, ShieldCheck, ShoppingCart } from '../../../utils/icons'

// Lazy load all components
const SuppliersList = lazy(() => import('./components/SuppliersList'))
const SupplierDetails = lazy(() => import('./components/SupplierDetails'))
const PurchaseOrders = lazy(() => import('./components/PurchaseOrders'))
const ReorderSuggestions = lazy(() => import('./components/ReorderSuggestions'))
const PaymentTracking = lazy(() => import('./components/PaymentTracking'))

// Loading placeholders with smooth pulse
const TablePlaceholder = () => <div className="w-full h-[520px] bg-gray-100 rounded-2xl animate-pulse" />
const SidebarPlaceholder = () => <div className="w-full h-[520px] bg-gray-100 rounded-2xl animate-pulse" />
const CardPlaceholder = () => <div className="w-full h-[400px] bg-gray-100 rounded-2xl animate-pulse" />

export default function RetailerSuppliers() {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)
  const [selectedSupplier, setSelectedSupplier] = useState(null)
  const [refreshTrigger, setRefreshTrigger] = useState(0)

  const handleRefresh = () => {
    setRefreshTrigger(prev => prev + 1)
  }

  return (
    <div className="min-h-screen bg-gray-50/50 pb-20 lg:pb-10">
      <RetailerNavbar 
        isSidebarCollapsed={isSidebarCollapsed}
        setIsSidebarCollapsed={setIsSidebarCollapsed}
      />
      
      <main className={`
        transition-all duration-300 p-4 lg:p-8
        ${isSidebarCollapsed ? 'lg:ml-20' : 'lg:ml-64'}
      `}>
        <div className="max-w-7xl mx-auto space-y-6">
          
          {/* Executive Header Ribbon */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-5 lg:p-6 rounded-2xl border border-gray-200/80 shadow-xs">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-primary-50 text-primary-700 ring-1 ring-primary-100">
                  <Truck size={13} />
                  Wholesale &amp; Supply Chain Hub
                </span>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700">
                  <ShieldCheck size={11} />
                  Active Network
                </span>
              </div>
              <h1 className="text-2xl lg:text-3xl font-extrabold text-gray-900 tracking-tight">
                Supplier Management
              </h1>
              <p className="text-xs lg:text-sm text-gray-500">
                Directory of verified vendors, purchase order contracts, automated stock replenishment, and payable disbursements.
              </p>
            </div>

            <div className="flex items-center gap-2.5 self-start sm:self-auto">
              <button
                onClick={handleRefresh}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 active:scale-95 rounded-xl transition-all"
                title="Refresh suppliers and orders"
              >
                <RefreshCw size={14} />
                <span>Sync Data</span>
              </button>
            </div>
          </div>

          {/* Top Section - Suppliers Directory (2 Cols) & Supplier Dossier (1 Col) */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
            
            {/* Left Column - Suppliers List (2/3 width) */}
            <div className="lg:col-span-2 flex flex-col">
              <div className="flex-1 min-h-[500px]">
                <Suspense fallback={<TablePlaceholder />}>
                  <SuppliersList 
                    selectedSupplier={selectedSupplier}
                    setSelectedSupplier={setSelectedSupplier}
                    refreshTrigger={refreshTrigger}
                  />
                </Suspense>
              </div>
            </div>

            {/* Right Column - Supplier Details Dossier (1/3 width) */}
            <div className="flex flex-col">
              <div className="flex-1 min-h-[500px]">
                <Suspense fallback={<SidebarPlaceholder />}>
                  <SupplierDetails selectedSupplier={selectedSupplier} />
                </Suspense>
              </div>
            </div>

          </div>

          {/* Bottom Section - 3 Equal Operational Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
            
            {/* 1. Purchase Orders Ledger */}
            <div className="flex flex-col min-h-[420px]">
              <Suspense fallback={<CardPlaceholder />}>
                <PurchaseOrders selectedSupplier={selectedSupplier} />
              </Suspense>
            </div>
            
            {/* 2. Algorithmic Reorder Signals */}
            <div className="flex flex-col min-h-[420px]">
              <Suspense fallback={<CardPlaceholder />}>
                <ReorderSuggestions />
              </Suspense>
            </div>
            
            {/* 3. Supplier Disbursement & Payment Tracking */}
            <div className="flex flex-col min-h-[420px]">
              <Suspense fallback={<CardPlaceholder />}>
                <PaymentTracking selectedSupplier={selectedSupplier} />
              </Suspense>
            </div>

          </div>
        </div>
      </main>
    </div>
  )
}
