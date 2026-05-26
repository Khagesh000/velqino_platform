"use client"

import React, { useState, lazy, Suspense, useEffect } from 'react'
import RetailerNavbar from '../RetailerDashboard/components/RetailerNavbar'
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

          {/* Main Content - 2 Columns */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            
            {/* Left Column - Member List (2/3 width) */}
            <div className="lg:col-span-2 h-full">
              <div style={{ minHeight: '450px' }}>
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
            </div>

            {/* Right Column - Points Transaction (1/3 width) */}
            <div className="h-full">
              <div style={{ minHeight: '450px' }}>
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

          </div>

          {/* Bottom Section - 2 Columns */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            <div className="h-full">
              <div style={{ minHeight: '400px' }}>
                <Suspense fallback={<CardPlaceholder />}>
                  <RewardsCatalog 
                    onRefresh={refreshAll}
                    rewards={rewardsData?.data?.rewards || []}
                  />
                </Suspense>
              </div>
            </div>
            
            <div className="h-full">
              <div style={{ minHeight: '400px' }}>
                <Suspense fallback={<CardPlaceholder />}>
                  <Campaigns 
                    onRefresh={refreshAll}
                    campaigns={campaignsData?.data?.campaigns || []}
                  />
                </Suspense>
              </div>
            </div>

          </div>
        </div>
      </main>
    </div>
  )
}