"use client"

import React, { useState, lazy, Suspense, useEffect } from 'react'
import RetailerNavbar from '../RetailerDashboard/components/RetailerNavbar'
import { Award, Star, Users, TrendingUp, Gift, Sparkles, RefreshCw } from '../../../utils/icons'
import { 
  useGetCustomersListQuery, 
  useGetRetailerCustomersQuery,
  useGetLoyaltySettingsQuery,
  useGetRewardsQuery,
  useGetCampaignsQuery,
  useGetPointsTransactionsQuery,
  useGetPointsSummaryQuery
} from '@/redux/retailer/slices/retailerLoyaltySlice'

// Lazy load all components
const ProgramSettings = lazy(() => import('./components/ProgramSettings'))
const MemberList = lazy(() => import('./components/MemberList'))
const PointsTransaction = lazy(() => import('./components/PointsTransaction'))
const RewardsCatalog = lazy(() => import('./components/RewardsCatalog'))
const Campaigns = lazy(() => import('./components/Campaigns'))

// Loading placeholders
const TablePlaceholder = () => <div className="w-full h-[400px] bg-gray-100 rounded-xl animate-pulse" />
const CardPlaceholder = () => <div className="w-full h-[300px] bg-gray-100 rounded-xl animate-pulse" />
const SidebarPlaceholder = () => <div className="w-full h-[350px] bg-gray-100 rounded-xl animate-pulse" />

export default function RetailerLoyalty() {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)
  const [refreshTrigger, setRefreshTrigger] = useState(0)
  const [selectedCustomer, setSelectedCustomer] = useState(null)


    // ========== API CALLS ==========
  const { data: customersData, isLoading: customersLoading, refetch: refetchCustomers } = useGetCustomersListQuery()
  const { data: retailerCustomersData, isLoading: retailerCustomersLoading, refetch: refetchRetailerCustomers } = useGetRetailerCustomersQuery()
  const { data: loyaltySettingsData, refetch: refetchLoyaltySettings } = useGetLoyaltySettingsQuery()
  const { data: rewardsData, refetch: refetchRewards } = useGetRewardsQuery({ active_only: true })
  const { data: campaignsData, refetch: refetchCampaigns } = useGetCampaignsQuery({})
  const { data: pointsTransactionsData, refetch: refetchPointsTransactions } = useGetPointsTransactionsQuery(
    { customer_id: selectedCustomer?.user?.id },
    { skip: !selectedCustomer?.user?.id }
  )
  const { data: pointsSummaryData, refetch: refetchPointsSummary } = useGetPointsSummaryQuery(
    selectedCustomer?.user?.id,
    { skip: !selectedCustomer?.user?.id }
  )

  // ========== TRANSFORM CUSTOMERS DATA ==========
  const customers = customersData?.data || []
  const retailerCustomers = retailerCustomersData?.data || []

  const getCustomerOrders = (userId) => {
    return retailerCustomers.filter(order => Number(order.customer__id) === Number(userId))
  }

  const getCustomerTotalSpent = (userId) => {
    const orders = getCustomerOrders(userId)
    return orders.reduce((sum, order) => sum + parseFloat(order.grand_total || 0), 0)
  }

  const getCustomerVisitCount = (userId) => {
    return getCustomerOrders(userId).length
  }

  const getCustomerLastVisit = (userId) => {
    const orders = getCustomerOrders(userId)
    if (orders.length === 0) return null
    return orders[0]?.created_at
  }

  // Enrich customers with order data
  const enrichedCustomers = customers
    .filter(customer => getCustomerOrders(customer.user?.id).length > 0)
    .map(customer => ({
      ...customer,
      totalSpent: getCustomerTotalSpent(customer.user?.id),
      visits: getCustomerVisitCount(customer.user?.id),
      lastVisit: getCustomerLastVisit(customer.user?.id),
      orders: getCustomerOrders(customer.user?.id),
      points: Math.floor(getCustomerTotalSpent(customer.user?.id) / 10),
      tier: getTierFromTotalSpent(getCustomerTotalSpent(customer.user?.id))
    }))

  // Helper function to determine tier
  function getTierFromTotalSpent(spent) {
    if (spent >= 50000) return 'Platinum'
    if (spent >= 25000) return 'Gold'
    if (spent >= 10000) return 'Silver'
    return 'Bronze'
  }

  // ========== SUMMARY CALCULATIONS ==========
  const totalMembers = enrichedCustomers.length
  const totalPointsEarned = enrichedCustomers.reduce((sum, c) => sum + (c.points || 0), 0)
  const totalPointsRedeemed = enrichedCustomers.reduce((sum, c) => sum + (c.pointsRedeemed || 0), 0)
  const activeMembers = enrichedCustomers.filter(c => c.visits > 0).length

  // ========== TIERS FROM BACKEND SETTINGS ==========
  const tiersFromSettings = [
    { name: 'Bronze', minPoints: 0, benefits: ['Welcome bonus 50pts', 'Basic support'], color: 'bronze' },
    { name: 'Silver', minPoints: loyaltySettingsData?.data?.silver_threshold || 500, benefits: ['2% extra points', 'Priority support'], color: 'silver' },
    { name: 'Gold', minPoints: loyaltySettingsData?.data?.gold_threshold || 1500, benefits: ['5% extra points', 'Free shipping', 'Birthday bonus'], color: 'gold' },
    { name: 'Platinum', minPoints: loyaltySettingsData?.data?.platinum_threshold || 3000, benefits: ['10% extra points', 'Free express shipping', 'Exclusive offers', 'Dedicated manager'], color: 'platinum' }
  ]

  // ========== HANDLERS ==========
  const handleSelectCustomer = (customer) => {
    setSelectedCustomer(customer)
  }

    const refreshAll = () => {
    setRefreshTrigger(prev => prev + 1)
    refetchCustomers()
    refetchRetailerCustomers()
    refetchLoyaltySettings()
    refetchRewards()
    refetchCampaigns()
    // ✅ Only refetch if customer is selected (query has started)
    if (selectedCustomer?.user?.id) {
      refetchPointsTransactions()
      refetchPointsSummary()
    }
  }

  useEffect(() => {
  if (refreshTrigger > 0) {
    refetchCustomers()
    refetchRetailerCustomers()
    refetchLoyaltySettings()
    refetchRewards()
    refetchCampaigns()
    if (selectedCustomer?.user?.id) {
      refetchPointsTransactions()
      refetchPointsSummary()
    }
  }
}, [refreshTrigger, refetchCustomers, refetchRetailerCustomers, refetchLoyaltySettings, refetchRewards, refetchCampaigns, refetchPointsTransactions, refetchPointsSummary, selectedCustomer?.user?.id])
  const isLoading = customersLoading || retailerCustomersLoading

  const [isRefreshing, setIsRefreshing] = useState(false)

  const handleManualRefresh = async () => {
    setIsRefreshing(true)
    refreshAll()
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
                  <Award size={12} className="text-primary-600" />
                  VIP Privileges &amp; Rewards Engine
                </span>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping inline-block" />
                  Active Tier Multipliers
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
                Loyalty Program &amp; Customer Privileges
              </h1>
              <p className="text-xs sm:text-sm text-gray-500 mt-1 max-w-3xl leading-relaxed">
                Supervise VIP member tiers, real-time point transactions, redeemable catalog rewards, promotional bonus multipliers, and global loyalty engine rules.
              </p>
            </div>

            {/* Quick Actions / Sync */}
            <div className="flex items-center gap-2.5 self-start md:self-auto shrink-0">
              <button
                type="button"
                onClick={handleManualRefresh}
                disabled={isRefreshing}
                className="px-4 py-2.5 rounded-2xl bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 active:scale-95 text-xs font-bold transition-all shadow-2xs flex items-center gap-2 disabled:opacity-50"
              >
                <RefreshCw size={14} className={isRefreshing ? 'animate-spin text-primary-600' : 'text-gray-500'} />
                <span>{isRefreshing ? 'Syncing...' : 'Sync Loyalty Data'}</span>
              </button>
            </div>
          </div>

          {/* Top KPI Metrics Ribbon (4 Cards) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4">
            {/* Total VIP Members */}
            <div className="bg-white rounded-3xl p-4 sm:p-5 border border-gray-200/80 shadow-2xs flex items-center justify-between">
              <div>
                <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">VIP Members</p>
                <h3 className="text-xl sm:text-2xl font-extrabold text-gray-900 mt-1 tracking-tight">
                  {totalMembers.toLocaleString()}
                </h3>
                <span className="text-[10px] text-emerald-600 font-semibold mt-0.5 inline-flex items-center gap-0.5">
                  <Users size={10} /> {activeMembers} active shoppers
                </span>
              </div>
              <div className="w-11 h-11 rounded-2xl bg-primary-50 text-primary-600 flex items-center justify-center shrink-0">
                <Users size={20} />
              </div>
            </div>

            {/* Points Issued / Circulation */}
            <div className="bg-white rounded-3xl p-4 sm:p-5 border border-gray-200/80 shadow-2xs flex items-center justify-between">
              <div>
                <p className="text-[11px] font-bold text-emerald-700 uppercase tracking-wider">Points Issued</p>
                <h3 className="text-xl sm:text-2xl font-extrabold text-emerald-800 mt-1 tracking-tight">
                  {totalPointsEarned.toLocaleString()}
                </h3>
                <span className="text-[10px] text-emerald-700/80 mt-0.5 inline-flex items-center gap-0.5">
                  <TrendingUp size={10} /> Lifetime circulation
                </span>
              </div>
              <div className="w-11 h-11 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                <Star size={20} />
              </div>
            </div>

            {/* Points Redeemed */}
            <div className="bg-white rounded-3xl p-4 sm:p-5 border border-gray-200/80 shadow-2xs flex items-center justify-between">
              <div>
                <p className="text-[11px] font-bold text-amber-600 uppercase tracking-wider">Points Redeemed</p>
                <h3 className="text-xl sm:text-2xl font-extrabold text-amber-700 mt-1 tracking-tight">
                  {totalPointsRedeemed.toLocaleString()}
                </h3>
                <span className="text-[10px] text-amber-600/80 mt-0.5 inline-flex items-center gap-0.5">
                  <Gift size={10} /> Reward conversions
                </span>
              </div>
              <div className="w-11 h-11 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                <Gift size={20} />
              </div>
            </div>

            {/* Active Schemes & Tiers */}
            <div className="bg-white rounded-3xl p-4 sm:p-5 border border-gray-200/80 shadow-2xs flex items-center justify-between">
              <div>
                <p className="text-[11px] font-bold text-purple-600 uppercase tracking-wider">Tiers &amp; Campaigns</p>
                <h3 className="text-xl sm:text-2xl font-extrabold text-purple-700 mt-1 tracking-tight">
                  4 Tiers · {(campaignsData?.data?.campaigns || []).length} Campaigns
                </h3>
                <span className="text-[10px] text-purple-600/80 mt-0.5 inline-flex items-center gap-0.5">
                  <Sparkles size={10} /> {(rewardsData?.data?.rewards || []).length} Catalog rewards
                </span>
              </div>
              <div className="w-11 h-11 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
                <Award size={20} />
              </div>
            </div>
          </div>

          {/* Row 1: Member List (2/3 width) + Points Transaction Audit (1/3 width) */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
            {/* Left: Member Directory (2 cols) */}
            <div className="lg:col-span-2 flex flex-col min-h-0">
              <Suspense fallback={<TablePlaceholder />}>
                <MemberList 
                  customers={enrichedCustomers}
                  selectedCustomer={selectedCustomer}
                  setSelectedCustomer={handleSelectCustomer}
                  isLoading={isLoading}
                  refreshTrigger={refreshTrigger}
                />
              </Suspense>
            </div>

            {/* Right: Selected Member's Point Ledger (1 col) */}
            <div className="flex flex-col min-h-0">
              <Suspense fallback={<SidebarPlaceholder />}>
                <PointsTransaction 
                  selectedCustomer={selectedCustomer}
                  pointsTransactions={pointsTransactionsData?.data?.transactions || []}
                  pointsSummary={pointsSummaryData?.data}
                  refreshTrigger={refreshTrigger}
                />
              </Suspense>
            </div>
          </div>

          {/* Row 2: Rewards Catalog & Campaigns (Side-by-Side 2 Columns) */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
            {/* Left: Rewards Catalog */}
            <div className="flex flex-col min-h-0">
              <Suspense fallback={<CardPlaceholder />}>
                <RewardsCatalog 
                  onRefresh={refreshAll}
                  rewards={rewardsData?.data?.rewards || []}
                />
              </Suspense>
            </div>
            
            {/* Right: Bonus Campaigns */}
            <div className="flex flex-col min-h-0">
              <Suspense fallback={<CardPlaceholder />}>
                <Campaigns 
                  onRefresh={refreshAll}
                  campaigns={campaignsData?.data?.campaigns || []}
                />
              </Suspense>
            </div>
          </div>

          {/* Row 3: Program Settings & Membership Tiers Matrix (Full Width) */}
          <div className="w-full">
            <Suspense fallback={<CardPlaceholder />}>
              <ProgramSettings 
                onRefresh={refreshAll}
                settings={loyaltySettingsData?.data}
                tiers={tiersFromSettings}
                summary={{
                  totalMembers: totalMembers,
                  pointsEarned: totalPointsEarned,
                  pointsRedeemed: totalPointsRedeemed,
                  activeMembers: activeMembers
                }}
              />
            </Suspense>
          </div>

        </div>
      </main>
    </div>
  )
}