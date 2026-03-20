"use client"

import React, { useState, lazy, Suspense, useEffect } from 'react'
import WholesaleNavbar from '../WholesalerDashboard/components/WholesaleNavbar'

// Lazy load all non-critical components
const BalanceCards = lazy(() => import('./Components/BalanceCards'))
/* const TransactionsTable = lazy(() => import('./Components/TransactionsTable'))
const WithdrawalSection = lazy(() => import('./Components/WithdrawalSection'))
const PaymentMethods = lazy(() => import('./Components/PaymentMethods'))
const TaxInformation = lazy(() => import('./Components/TaxInformation'))
const InvoiceGenerator = lazy(() => import('./Components/InvoiceGenerator')) */

// Loading placeholders
const BalancePlaceholder = () => <div className="w-full h-[180px] bg-gray-50 rounded-xl animate-pulse" />
/* const TablePlaceholder = () => <div className="w-full h-[400px] bg-gray-50 rounded-xl animate-pulse" />
const WithdrawalPlaceholder = () => <div className="w-full h-[280px] bg-gray-50 rounded-xl animate-pulse" />
const MethodsPlaceholder = () => <div className="w-full h-[220px] bg-gray-50 rounded-xl animate-pulse" />
const TaxPlaceholder = () => <div className="w-full h-[280px] bg-gray-50 rounded-xl animate-pulse" />
const InvoicePlaceholder = () => <div className="w-full h-[300px] bg-gray-50 rounded-xl animate-pulse" /> */

export default function PaymentsAndPayouts() {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)
  const [showWithdrawModal, setShowWithdrawModal] = useState(false)

  return (
    <div className="min-h-screen bg-gray-50">
      <WholesaleNavbar 
        isSidebarCollapsed={isSidebarCollapsed}
        setIsSidebarCollapsed={setIsSidebarCollapsed}
      />
      
      <main className={`
        transition-all duration-300 p-3 sm:p-4 lg:p-6
        ${isSidebarCollapsed ? 'lg:ml-20' : 'lg:ml-64'}
      `}>
        <div className="w-full px-2 sm:px-4 md:px-6 lg:max-w-7xl lg:mx-auto overflow-x-hidden">
          
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-lg lg:rounded-xl bg-primary-100 flex items-center justify-center text-primary-600">
                <svg className="w-5 h-5 lg:w-6 lg:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h1 className="text-xl lg:text-2xl font-bold text-gray-900">Payments & Payouts</h1>
                <p className="text-sm text-gray-500">Manage your earnings and withdrawals</p>
              </div>
            </div>
          </div>

          {/* Balance Cards */}
          <div style={{ minHeight: '180px' }}>
            <Suspense fallback={<BalancePlaceholder />}>
              <BalanceCards />
            </Suspense>
          </div>

          {/* Withdrawal Section */}
         {/*  <div className="mt-6" style={{ minHeight: '280px' }}>
            <Suspense fallback={<WithdrawalPlaceholder />}>
              <WithdrawalSection onWithdraw={() => setShowWithdrawModal(true)} />
            </Suspense>
          </div> */}

          {/* Transaction History */}
          {/* <div className="mt-6" style={{ minHeight: '400px' }}>
            <Suspense fallback={<TablePlaceholder />}>
              <TransactionsTable />
            </Suspense>
          </div> */}

          {/* Payment Methods & Tax Information Grid */}
          {/* <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div style={{ minHeight: '220px' }}>
              <Suspense fallback={<MethodsPlaceholder />}>
                <PaymentMethods />
              </Suspense>
            </div>
            <div style={{ minHeight: '280px' }}>
              <Suspense fallback={<TaxPlaceholder />}>
                <TaxInformation />
              </Suspense>
            </div>
          </div> */}

          {/* Invoice Generator */}
          {/* <div className="mt-6" style={{ minHeight: '300px' }}>
            <Suspense fallback={<InvoicePlaceholder />}>
              <InvoiceGenerator />
            </Suspense>
          </div> */}

        </div>
      </main>

      {/* Withdraw Modal */}
      {/* {showWithdrawModal && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          <div 
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setShowWithdrawModal(false)}
          />
          <div className="absolute inset-y-0 right-0 w-full sm:w-[480px] md:w-[560px]">
            <Suspense fallback={<ModalPlaceholder />}>
              <WithdrawModal onClose={() => setShowWithdrawModal(false)} />
            </Suspense>
          </div>
        </div>
      )} */}
    </div>
  )
}