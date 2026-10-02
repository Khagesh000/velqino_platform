"use client";

import React, { useState, lazy, Suspense } from 'react';
import WholesaleNavbar from '../WholesalerDashboard/components/WholesaleNavbar';
import {
  Wallet,
  ArrowUp,
  RefreshCw,
  Sparkles,
  CreditCard,
  Building,
  CheckCircle,
  FileText
} from '@/utils/icons';

// Lazy load all non-critical components
const BalanceCards = lazy(() => import('./components/BalanceCard'));
const TransactionsTable = lazy(() => import('./components/TransactionsTable'));
const WithdrawalSection = lazy(() => import('./components/WithdrawalSection'));
const PaymentMethods = lazy(() => import('./components/PaymentMethods'));
const TaxInformation = lazy(() => import('./components/TaxInformation'));
const InvoiceGenerator = lazy(() => import('./components/InvoiceGenerator'));
const WithdrawModal = lazy(() => import('./components/WithdrawModal'));

// Structured executive skeleton placeholders
const BalancePlaceholder = () => (
  <div className="bg-white rounded-2xl border border-slate-200/80 p-6 animate-pulse shadow-xs space-y-4">
    <div className="flex items-center justify-between pb-4 border-b border-slate-100">
      <div className="w-48 h-5 rounded bg-slate-200" />
      <div className="w-24 h-7 rounded-lg bg-slate-100" />
    </div>
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="h-32 bg-slate-100 rounded-xl" />
      ))}
    </div>
  </div>
);

const WithdrawalPlaceholder = () => (
  <div className="bg-white rounded-2xl border border-slate-200/80 p-6 animate-pulse shadow-xs h-72" />
);

const TablePlaceholder = () => (
  <div className="bg-white rounded-2xl border border-slate-200/80 p-6 animate-pulse shadow-xs space-y-4">
    <div className="flex items-center justify-between pb-4 border-b border-slate-100">
      <div className="w-40 h-5 rounded bg-slate-200" />
      <div className="w-28 h-8 rounded-lg bg-slate-100" />
    </div>
    <div className="space-y-2">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="h-11 bg-slate-100 rounded-lg" />
      ))}
    </div>
  </div>
);

const MethodsPlaceholder = () => (
  <div className="bg-white rounded-2xl border border-slate-200/80 p-6 animate-pulse shadow-xs h-64" />
);

const TaxPlaceholder = () => (
  <div className="bg-white rounded-2xl border border-slate-200/80 p-6 animate-pulse shadow-xs h-64" />
);

const InvoicePlaceholder = () => (
  <div className="bg-white rounded-2xl border border-slate-200/80 p-6 animate-pulse shadow-xs h-80" />
);

const ModalPlaceholder = () => (
  <div className="w-full h-full bg-white animate-pulse p-6 space-y-4">
    <div className="w-48 h-6 rounded bg-slate-200" />
    <div className="w-full h-24 rounded-xl bg-slate-100" />
    <div className="w-full h-32 rounded-xl bg-slate-100" />
  </div>
);

export default function PaymentsAndPayouts() {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
    }, 800);
  };

  return (
    <div className="min-h-screen bg-slate-50/70 pb-20">
      <WholesaleNavbar 
        isSidebarCollapsed={isSidebarCollapsed}
        setIsSidebarCollapsed={setIsSidebarCollapsed}
      />
      
      <main className={`
        transition-all duration-300 p-3 sm:p-4 lg:p-6
        ${isSidebarCollapsed ? 'lg:ml-20' : 'lg:ml-64'}
      `}>
        <div className="max-w-7xl mx-auto space-y-6">
          
          {/* Executive Header Banner */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white rounded-2xl border border-slate-200/80 p-4 sm:p-6 shadow-xs">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center text-white shadow-sm flex-shrink-0">
                <Wallet size={24} />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
                    Payments & Merchant Payouts
                  </h1>
                  <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    Settled Daily
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                  Real-time liquidity, merchant settlement ledger, tax compliance, and automated disbursement
                </p>
              </div>
            </div>

            {/* Header Right Actions */}
            <div className="flex items-center gap-2.5 self-end sm:self-auto">
              <button
                onClick={handleRefresh}
                disabled={isRefreshing}
                title="Refresh treasury ledger"
                className="p-2.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-xl border border-slate-200 transition-all shadow-2xs disabled:opacity-50 cursor-pointer"
              >
                <RefreshCw size={17} className={isRefreshing ? 'animate-spin text-primary-600' : ''} />
              </button>

              <button
                onClick={() => setShowWithdrawModal(true)}
                type="button"
                className="flex items-center gap-1.5 px-4 py-2.5 bg-primary-600 hover:bg-primary-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer active:scale-95"
              >
                <ArrowUp size={15} />
                <span>Request Withdrawal</span>
              </button>
            </div>
          </div>

          {/* Balance Liquidity Cards */}
          <div style={{ minHeight: '180px' }}>
            <Suspense fallback={<BalancePlaceholder />}>
              <BalanceCards />
            </Suspense>
          </div>

          {/* Withdrawal Request Hub */}
          <div style={{ minHeight: '280px' }}>
            <Suspense fallback={<WithdrawalPlaceholder />}>
              <WithdrawalSection onWithdraw={() => setShowWithdrawModal(true)} />
            </Suspense>
          </div>

          {/* Transaction History Ledger */}
          <div style={{ minHeight: '400px' }}>
            <Suspense fallback={<TablePlaceholder />}>
              <TransactionsTable />
            </Suspense>
          </div>

          {/* Payment Methods & Tax Information Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
            <div style={{ minHeight: '240px' }} className="h-full">
              <Suspense fallback={<MethodsPlaceholder />}>
                <PaymentMethods />
              </Suspense>
            </div>
            <div style={{ minHeight: '280px' }} className="h-full">
              <Suspense fallback={<TaxPlaceholder />}>
                <TaxInformation />
              </Suspense>
            </div>
          </div>

          {/* Tax Invoice Generator */}
          <div style={{ minHeight: '300px' }}>
            <Suspense fallback={<InvoicePlaceholder />}>
              <InvoiceGenerator />
            </Suspense>
          </div>

        </div>
      </main>

      {/* Withdraw Modal Drawer */}
      {showWithdrawModal && (
        <div className="fixed inset-0 z-[100000] overflow-hidden flex justify-end">
          {/* Backdrop with click to close */}
          <div 
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity duration-300"
            onClick={() => setShowWithdrawModal(false)}
          />
          {/* Panel Container: full height, clean, responsive on all screens */}
          <div className="relative w-full sm:w-[480px] md:w-[540px] h-full bg-white shadow-2xl flex flex-col z-10 overflow-hidden animate-in slide-in-from-right duration-300">
            <Suspense fallback={<ModalPlaceholder />}>
              <WithdrawModal onClose={() => setShowWithdrawModal(false)} />
            </Suspense>
          </div>
        </div>
      )}
    </div>
  );
}
