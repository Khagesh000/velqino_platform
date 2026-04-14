"use client"

import React, { useState, lazy, Suspense } from 'react'
import RetailerNavbar from '../RetailerDashboard/Components/RetailerNavbar'

// Lazy load all POS components
const QuickSale = lazy(() => import('./Components/QuickSale'))
const CartSection = lazy(() => import('./Components/CartSection'))
const PaymentMethods = lazy(() => import('./Components/PaymentMethods'))
const CustomerInfo = lazy(() => import('./Components/CustomerInfo'))
const BillSummary = lazy(() => import('./Components/BillSummary'))
const RecentSale = lazy(() => import('./Components/RecentSale'))
const HoldCart = lazy(() => import('./Components/HoldCart')) 

// Loading placeholders
const QuickSalePlaceholder = () => <div className="w-full h-[400px] bg-gray-100 rounded-xl animate-pulse" />
const CartPlaceholder = () => <div className="w-full h-[300px] bg-gray-100 rounded-xl animate-pulse" />
const SidebarPlaceholder = () => <div className="w-full h-[200px] bg-gray-100 rounded-xl animate-pulse" /> 

export default function PosSales() {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)
  const [cart, setCart] = useState([])
  const [selectedCustomer, setSelectedCustomer] = useState(null)
  const [discount, setDiscount] = useState(0)
  const [selectedPayment, setSelectedPayment] = useState('cash')

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
            <h1 className="text-xl lg:text-2xl font-bold text-gray-900">Point of Sale (POS)</h1>
            <p className="text-sm text-gray-500 mt-1">Fast checkout & billing system</p>
          </div>

          {/* Main POS Grid - 2 columns */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Left Column - Takes 2/3 space */}
            <div className="lg:col-span-2 space-y-6">
              <div style={{ minHeight: '450px' }}>
                <Suspense fallback={<QuickSalePlaceholder />}>
                  <QuickSale cart={cart} setCart={setCart} />
                </Suspense>
              </div>
             <div style={{ minHeight: '300px' }}>
                <Suspense fallback={<CartPlaceholder />}>
                  <CartSection cart={cart} setCart={setCart} />
                </Suspense>
              </div>
            </div>

            {/* Right Column - Takes 1/3 space */}
            <div className="space-y-6">
                <div style={{ minHeight: '200px' }}>
                    <Suspense fallback={<SidebarPlaceholder />}>
                    <CustomerInfo 
                        selectedCustomer={selectedCustomer} 
                        setSelectedCustomer={setSelectedCustomer} 
                    />
                    </Suspense>
                </div> 
                
                <div style={{ minHeight: '250px' }}>
                    <Suspense fallback={<SidebarPlaceholder />}>
                    <BillSummary 
                        cart={cart} 
                        discount={discount} 
                        setDiscount={setDiscount}
                        selectedPayment={selectedPayment}
                    />
                    </Suspense>
                </div> 
                
                <div style={{ minHeight: '150px' }}>
                    <Suspense fallback={<SidebarPlaceholder />}>
                    <PaymentMethods 
                        selectedPayment={selectedPayment}
                        setSelectedPayment={setSelectedPayment}
                    />
                    </Suspense>
                </div>
                
                {/* Recent Sale and Hold Cart - Stacked Vertically */}
                <div className="space-y-4">
                    <div style={{ minHeight: '120px' }}>
                    <Suspense fallback={<SidebarPlaceholder />}>
                        <RecentSale />
                    </Suspense>
                    </div>
                    <div style={{ minHeight: '120px' }}>
                    <Suspense fallback={<SidebarPlaceholder />}>
                        <HoldCart />
                    </Suspense>
                    </div>
                </div>
                </div>

          </div>
        </div>
      </main>
    </div>
  )
}