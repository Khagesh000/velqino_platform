"use client";

import React, { useState, lazy, Suspense, useEffect } from 'react';
import RetailerNavbar from '../RetailerDashboard/components/RetailerNavbar';
import { useGetRetailerCustomersSummaryQuery } from '@/redux/retailer/slices/statsSlice';
import { toast } from 'react-toastify';
import { 
  Users, 
  DollarSign, 
  TrendingUp, 
  Star, 
  Award, 
  RefreshCw, 
  Sparkles, 
  UserCheck,
  ShoppingBag
} from '../../../utils/icons';

// Lazy load child components
const CustomersList = lazy(() => import('./components/CustomersList'));
const LoyaltyProgram = lazy(() => import('./components/LoyaltyProgram'));
const CustomerDetails = lazy(() => import('./components/CustomerDetails'));
const WalkInTracker = lazy(() => import('./components/WalkInTracker'));
const FeedbackReviews = lazy(() => import('./components/FeedbackReviews'));
const BirthdayAnniversary = lazy(() => import('./components/BirthdayAnniversary'));
const QuickActions = lazy(() => import('./components/QuickActions'));

// Card placeholder
const CardPlaceholder = ({ height = '350px' }) => (
  <div 
    style={{ minHeight: height }} 
    className="w-full bg-white rounded-3xl border border-gray-200/80 p-6 shadow-2xs flex flex-col justify-between animate-pulse"
  >
    <div className="flex items-center justify-between">
      <div className="h-6 w-36 bg-gray-200 rounded-xl" />
      <div className="h-6 w-16 bg-gray-100 rounded-lg" />
    </div>
    <div className="space-y-3 my-4">
      <div className="h-4 w-full bg-gray-100 rounded-lg" />
      <div className="h-4 w-5/6 bg-gray-100 rounded-lg" />
      <div className="h-4 w-4/6 bg-gray-100 rounded-lg" />
    </div>
    <div className="h-9 w-full bg-gray-100 rounded-xl" />
  </div>
);

export default function RetailerCustomers() {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // SINGLE UNIFIED BACKEND CALL — replaces all 5 separate requests
  const { data: summaryData, isLoading, isFetching, refetch } = useGetRetailerCustomersSummaryQuery({
    force_refresh: refreshTrigger > 0
  });

  const customers = summaryData?.data?.customers || [];
  const stats = summaryData?.data?.stats || {};
  const upcomingBirthdays = summaryData?.data?.upcomingBirthdays || [];
  const upcomingAnniversaries = summaryData?.data?.upcomingAnniversaries || [];
  const footfall = summaryData?.data?.footfall || {};
  const reviews = summaryData?.data?.reviews || {};

  // Auto-select first customer
  useEffect(() => {
    if (customers.length > 0 && !selectedCustomer) {
      setSelectedCustomer(customers[0]);
    }
  }, [customers, selectedCustomer]);

  // Keep selectedCustomer updated with latest data on refetch
  useEffect(() => {
    if (selectedCustomer && customers.length > 0) {
      const match = customers.find(c => (c.id === selectedCustomer.id || c.user_id === selectedCustomer.user_id));
      if (match) setSelectedCustomer(match);
    }
  }, [customers]);

  const handleSelectCustomer = (customer) => {
    setSelectedCustomer(customer);
  };

  const handleRefresh = () => {
    setRefreshTrigger(prev => prev + 1);
    refetch();
    toast.info('Syncing CRM records...');
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] text-gray-900 pb-20 lg:pb-12">
      <RetailerNavbar 
        isSidebarCollapsed={isSidebarCollapsed}
        setIsSidebarCollapsed={setIsSidebarCollapsed}
      />
      
      <main className={`transition-all duration-300 p-4 sm:p-6 lg:p-8 ${isSidebarCollapsed ? 'lg:ml-20' : 'lg:ml-64'}`}>
        <div className="max-w-[1600px] mx-auto space-y-6">
          
          {/* Executive Header Ribbon */}
          <div className="bg-white rounded-3xl p-5 sm:p-7 border border-gray-200/80 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-primary-50 text-primary-700 border border-primary-100">
                  <Sparkles size={11} className="text-primary-500" />
                  Retailer CRM Intelligence
                </span>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping inline-block" />
                  Live Sync
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
                Customers & Loyalty Hub
              </h1>
              <p className="text-xs sm:text-sm text-gray-500 mt-1 max-w-2xl leading-relaxed">
                Supervise customer directories, loyalty tiers, in-store footfall dynamics, special milestones, and buyer feedback in a unified real-time CRM suite.
              </p>
            </div>

            {/* Quick Actions / Refresh */}
            <div className="flex items-center gap-2.5 self-start md:self-auto shrink-0">
              <button
                type="button"
                onClick={handleRefresh}
                disabled={isFetching}
                className="px-4 py-2.5 rounded-2xl bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 active:scale-95 text-xs font-bold transition-all shadow-2xs flex items-center gap-2 disabled:opacity-50"
              >
                <RefreshCw size={14} className={isFetching ? 'animate-spin text-primary-600' : 'text-gray-500'} />
                <span>{isFetching ? 'Syncing...' : 'Sync CRM'}</span>
              </button>
            </div>
          </div>

          {/* Top KPI Metrics Ribbon */}
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
            {/* Total Customers */}
            <div className="bg-white rounded-3xl p-4 sm:p-5 border border-gray-200/80 shadow-2xs flex items-center justify-between">
              <div>
                <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Total Customers</p>
                <h3 className="text-xl sm:text-2xl font-extrabold text-gray-900 mt-1 tracking-tight">
                  {stats.total_customers || customers.length || 0}
                </h3>
                <span className="text-[10px] text-gray-400 mt-0.5 block">Registered buyers</span>
              </div>
              <div className="w-10 h-10 rounded-2xl bg-primary-50 text-primary-600 flex items-center justify-center shrink-0">
                <Users size={20} />
              </div>
            </div>

            {/* Gross Customer Spend */}
            <div className="bg-white rounded-3xl p-4 sm:p-5 border border-gray-200/80 shadow-2xs flex items-center justify-between">
              <div>
                <p className="text-[11px] font-bold text-emerald-700 uppercase tracking-wider">Customer Spend</p>
                <h3 className="text-xl sm:text-2xl font-extrabold text-emerald-800 mt-1 tracking-tight">
                  ₹{(stats.total_revenue || 0).toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                </h3>
                <span className="text-[10px] text-emerald-700/80 mt-0.5 inline-flex items-center gap-0.5">
                  <TrendingUp size={10} /> Cumulative volume
                </span>
              </div>
              <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                <DollarSign size={20} />
              </div>
            </div>

            {/* Average Order Value (AOV) */}
            <div className="bg-white rounded-3xl p-4 sm:p-5 border border-gray-200/80 shadow-2xs flex items-center justify-between">
              <div>
                <p className="text-[11px] font-bold text-indigo-600 uppercase tracking-wider">Average Basket</p>
                <h3 className="text-xl sm:text-2xl font-extrabold text-indigo-700 mt-1 tracking-tight">
                  ₹{(stats.average_order_value || 0).toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                </h3>
                <span className="text-[10px] text-indigo-600/80 mt-0.5 block">Per completed transaction</span>
              </div>
              <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                <ShoppingBag size={20} />
              </div>
            </div>

            {/* Repeat Customer Rate */}
            <div className="bg-white rounded-3xl p-4 sm:p-5 border border-gray-200/80 shadow-2xs flex items-center justify-between">
              <div>
                <p className="text-[11px] font-bold text-amber-700 uppercase tracking-wider">Repeat Rate</p>
                <h3 className="text-xl sm:text-2xl font-extrabold text-amber-800 mt-1 tracking-tight">
                  {stats.repeat_rate || 0}%
                </h3>
                <span className="text-[10px] text-amber-700/80 mt-0.5 block">
                  {stats.repeat_customers || 0} repeat buyers
                </span>
              </div>
              <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                <UserCheck size={20} />
              </div>
            </div>

            {/* VIP Customers */}
            <div className="col-span-2 sm:col-span-2 lg:col-span-1 bg-white rounded-3xl p-4 sm:p-5 border border-gray-200/80 shadow-2xs flex items-center justify-between">
              <div>
                <p className="text-[11px] font-bold text-primary-700 uppercase tracking-wider">VIP Tier Members</p>
                <h3 className="text-xl sm:text-2xl font-extrabold text-gray-900 mt-1 tracking-tight">
                  {stats.vip_count || 0}
                </h3>
                <span className="text-[10px] text-amber-600 font-bold mt-0.5 inline-flex items-center gap-0.5">
                  <Star size={10} className="fill-amber-400 text-amber-400" /> Gold & Platinum
                </span>
              </div>
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-500 to-amber-400 text-white flex items-center justify-center shrink-0 shadow-xs">
                <Award size={20} />
              </div>
            </div>
          </div>

          {/* Primary Workspace: Customers Directory (Left 2 Col) + Dossier & Engagement (Right 1 Col) */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Left 2 Columns: Customers Directory */}
            <div className="lg:col-span-2">
              <Suspense fallback={<CardPlaceholder height="550px" />}>
                <CustomersList 
                  customers={customers}
                  selectedCustomer={selectedCustomer}
                  setSelectedCustomer={handleSelectCustomer}
                  refreshTrigger={refreshTrigger}
                  isLoading={isLoading}
                />
              </Suspense>
            </div>

            {/* Right 1 Column: Customer Dossier + Direct Engagement */}
            <div className="space-y-6">
              <Suspense fallback={<CardPlaceholder height="380px" />}>
                <CustomerDetails 
                  selectedCustomer={selectedCustomer}
                  customerOrders={selectedCustomer?.orders || []}
                />
              </Suspense>

              <Suspense fallback={<CardPlaceholder height="200px" />}>
                <QuickActions 
                  selectedCustomer={selectedCustomer}
                  onRefresh={handleRefresh}
                />
              </Suspense>
            </div>

          </div>

          {/* Row 2: Loyalty & Privileges + Special Milestones (Side-by-Side) */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
            <div className="flex flex-col h-full min-h-0">
              <Suspense fallback={<CardPlaceholder height="380px" />}>
                <LoyaltyProgram 
                  selectedCustomer={selectedCustomer}
                  customerTotalSpent={selectedCustomer?.totalSpent || selectedCustomer?.total_spent || 0}
                  customerOrders={selectedCustomer?.orders || []}
                />
              </Suspense>
            </div>

            <div className="flex flex-col h-full min-h-0">
              <Suspense fallback={<CardPlaceholder height="380px" />}>
                <BirthdayAnniversary 
                  upcomingBirthdays={upcomingBirthdays}
                  upcomingAnniversaries={upcomingAnniversaries}
                  onSelectCustomer={handleSelectCustomer}
                />
              </Suspense>
            </div>
          </div>

          {/* Row 3: Footfall & Store Activity + Customer Feedback & Reviews (Side-by-Side) */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
            <div className="flex flex-col h-full min-h-0">
              <Suspense fallback={<CardPlaceholder height="380px" />}>
                <WalkInTracker 
                  footfall={footfall}
                  customers={customers}
                />
              </Suspense>
            </div>

            <div className="flex flex-col h-full min-h-0">
              <Suspense fallback={<CardPlaceholder height="380px" />}>
                <FeedbackReviews 
                  reviews={reviews}
                  selectedCustomer={selectedCustomer}
                />
              </Suspense>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}