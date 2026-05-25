"use client"

import React, { useState, lazy, Suspense, useEffect } from 'react'
import RetailerNavbar from '../RetailerDashboard/components/RetailerNavbar'
import { useGetRetailerCustomersQuery } from '@/redux/retailer/slices/retailerOrdersSlice'
import { useGetCustomersListQuery } from '@/redux/customer/slices/customerSlice'
import { useGetRetailerProductsQuery } from '@/redux/retailer/slices/retailerProductsSlice'

// Lazy load all components
const CustomersList = lazy(() => import('./components/CustomersList'))
const LoyaltyProgram = lazy(() => import('./components/LoyaltyProgram'))
const CustomerDetails = lazy(() => import('./components/CustomerDetails'))
const WalkInTracker = lazy(() => import('./components/WalkInTracker'))
const FeedbackReviews = lazy(() => import('./components/FeedbackReviews'))
const BirthdayAnniversary = lazy(() => import('./components/BirthdayAnniversary'))
const QuickActions = lazy(() => import('./components/QuickActions'))

// Loading placeholders
const TablePlaceholder = () => <div className="w-full h-[400px] bg-gray-100 rounded-xl animate-pulse" />
const CardPlaceholder = () => <div className="w-full h-[300px] bg-gray-100 rounded-xl animate-pulse" />
const SidebarPlaceholder = () => <div className="w-full h-[250px] bg-gray-100 rounded-xl animate-pulse" />

export default function RetailerCustomers() {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)
  const [selectedCustomer, setSelectedCustomer] = useState(null)
  const [refreshTrigger, setRefreshTrigger] = useState(0)

  // API Calls
  const { data: customersData, isLoading: customersLoading, refetch: refetchCustomers } = useGetCustomersListQuery()
  const { data: retailerCustomersData, isLoading: retailerCustomersLoading } = useGetRetailerCustomersQuery()
  const { data: productsData } = useGetRetailerProductsQuery()

  // Transform customers data from backend
  const customers = customersData?.data || []
  const retailerCustomers = retailerCustomersData?.data || []

  // Get customer orders from retailer perspective
  const getCustomerOrders = (customerId) => {
    return retailerCustomers.filter(order => order.customer_id === customerId)
  }

  // Get customer total spent
  const getCustomerTotalSpent = (customerId) => {
    const orders = getCustomerOrders(customerId)
    return orders.reduce((sum, order) => sum + parseFloat(order.grand_total || 0), 0)
  }

  // Get customer visit count
  const getCustomerVisitCount = (customerId) => {
    return getCustomerOrders(customerId).length
  }

  // Get customer last visit
  const getCustomerLastVisit = (customerId) => {
    const orders = getCustomerOrders(customerId)
    if (orders.length === 0) return null
    return orders[0]?.created_at
  }

  // Enrich customers with order data
  const enrichedCustomers = customers.map(customer => ({
    ...customer,
    totalSpent: getCustomerTotalSpent(customer.id),
    visits: getCustomerVisitCount(customer.id),
    lastVisit: getCustomerLastVisit(customer.id),
    orders: getCustomerOrders(customer.id)
  }))

  // Handle customer selection
  const handleSelectCustomer = (customer) => {
    setSelectedCustomer(customer)
  }

  // Refresh data when needed
  useEffect(() => {
    if (refreshTrigger > 0) {
      refetchCustomers()
    }
  }, [refreshTrigger, refetchCustomers])

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
            <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">Customers</h1>
            <p className="text-sm text-gray-500 mt-1">Manage customer relationships and loyalty</p>
          </div>

          {/* Loading State */}
          {customersLoading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto"></div>
              <p className="text-gray-500 mt-3">Loading customers...</p>
            </div>
          ) : (
            <>
              {/* Main Content - 2 Columns */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Left Column - Customers List (2/3 width) */}
                <div className="lg:col-span-2">
                  <div style={{ minHeight: '500px' }}>
                    <Suspense fallback={<TablePlaceholder />}>
                      <CustomersList 
                        customers={enrichedCustomers}
                        selectedCustomer={selectedCustomer}
                        setSelectedCustomer={handleSelectCustomer}
                        refreshTrigger={refreshTrigger}
                        isLoading={customersLoading}
                      />
                    </Suspense>
                  </div>
                </div>

                {/* Right Column - Customer Details & Quick Actions (1/3 width) */}
                <div className="space-y-6">
                  <div style={{ minHeight: '350px' }}>
                    <Suspense fallback={<SidebarPlaceholder />}>
                      <CustomerDetails 
                        selectedCustomer={selectedCustomer}
                        customerOrders={selectedCustomer?.orders || []}
                      />
                    </Suspense>
                  </div> 
                  <div style={{ minHeight: '200px' }}>
                    <Suspense fallback={<SidebarPlaceholder />}>
                      <QuickActions 
                        selectedCustomer={selectedCustomer}
                        onRefresh={() => setRefreshTrigger(prev => prev + 1)}
                      />
                    </Suspense>
                  </div> 
                </div>

              </div>

              {/* Bottom Section - 3 Columns */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
                
                <div style={{ minHeight: '300px' }}>
                  <Suspense fallback={<CardPlaceholder />}>
                    <LoyaltyProgram 
                      selectedCustomer={selectedCustomer}
                      customerTotalSpent={selectedCustomer?.totalSpent || 0}
                      customerOrders={selectedCustomer?.orders || []}
                    />
                  </Suspense>
                </div> 
                
                <div style={{ minHeight: '300px' }}>
                  <Suspense fallback={<CardPlaceholder />}>
                    <WalkInTracker 
                      customers={enrichedCustomers}
                    />
                  </Suspense>
                </div> 
                
                <div className="space-y-6">
                  <div style={{ minHeight: '250px' }}>
                    <Suspense fallback={<CardPlaceholder />}>
                      <FeedbackReviews 
                        selectedCustomer={selectedCustomer}
                        customerOrders={selectedCustomer?.orders || []}
                      />
                    </Suspense>
                  </div> 
                  <div style={{ minHeight: '200px' }}>
                    <Suspense fallback={<CardPlaceholder />}>
                      <BirthdayAnniversary 
                        customers={enrichedCustomers}
                        onSelectCustomer={handleSelectCustomer}
                      />
                    </Suspense>
                  </div> 
                </div>

              </div>
            </>
          )}
        </div>
      </main>
    </div>
  )
}