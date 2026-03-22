"use client"

import React, { useState, lazy, Suspense } from 'react'
import WholesaleNavbar from '../WholesalerDashboard/components/WholesaleNavbar'

// Lazy load all non-critical components
const CustomersTable = lazy(() => import('./Components/CustomersTable'))
const CustomerDetailsPanel = lazy(() => import('./components/CustomerDetailsPanel'))
const CustomerFilters = lazy(() => import('./components/CustomerFilters'))
const QuickActions = lazy(() => import('./Components/QuickActions'))
const ImportExport = lazy(() => import('./components/ImportExport')) 

// Loading placeholders with EXACT heights to prevent layout shift
const TablePlaceholder = () => <div className="w-full h-[500px] bg-gray-50 rounded-xl animate-pulse" />
const DetailsPlaceholder = () => <div className="w-full h-full bg-gray-50 animate-pulse" />
const FiltersPlaceholder = () => <div className="w-full h-[120px] bg-gray-50 rounded-xl animate-pulse" />

const QuickActionsPlaceholder = () => <div className="w-full h-[100px] bg-gray-50 rounded-xl animate-pulse" />
const ImportExportPlaceholder = () => <div className="w-full h-[80px] bg-gray-50 rounded-xl animate-pulse" />

export default function Customers() {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)
  const [selectedCustomer, setSelectedCustomer] = useState(null)
  const [customerFilters, setCustomerFilters] = useState({
    type: 'all',
    status: 'all',
    location: 'all',
    orderRange: { min: '', max: '' },
    spendRange: { min: '', max: '' },
    lastOrder: 'all',
    searchQuery: ''
  })
  const [selectedCustomers, setSelectedCustomers] = useState([])

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <WholesaleNavbar 
        isSidebarCollapsed={isSidebarCollapsed}
        setIsSidebarCollapsed={setIsSidebarCollapsed}
      />
      
      {/* Main content with dynamic margin based on sidebar state */}
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
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
              <div>
                <h1 className="text-xl lg:text-2xl font-bold text-gray-900">Customers</h1>
                <p className="text-sm text-gray-500">Manage your customer relationships</p>
              </div>
            </div>
            
            {/* Import/Export */}
          <div className="w-full sm:w-auto" style={{ minHeight: '80px' }}>
              <Suspense fallback={<ImportExportPlaceholder />}>
                <ImportExport 
                  selectedCount={selectedCustomers.length}
                  onImport={() => console.log('Import customers')}
                  onExport={() => console.log('Export customers')}
                />
              </Suspense>
            </div> 
          </div>

          {/* Quick Actions */}
          <div className="mb-6" style={{ minHeight: '100px' }}>
            <Suspense fallback={<QuickActionsPlaceholder />}>
              <QuickActions 
                selectedCustomer={selectedCustomer}
                selectedCount={selectedCustomers.length}
                onSendEmail={() => console.log('Send email')}
                onCall={() => console.log('Call')}
                onCreateOrder={() => console.log('Create order')}
                onAddNote={() => console.log('Add note')}
                onBlockCustomer={() => console.log('Block customer')}
              />
            </Suspense>
          </div> 

          
          <div className="mt-6" style={{ minHeight: '120px' }}>
            <Suspense fallback={<FiltersPlaceholder />}>
              <CustomerFilters 
                filters={customerFilters}
                onFilterChange={setCustomerFilters}
              />
            </Suspense>
          </div>  

          
          <div className="mt-6" style={{ minHeight: '500px' }}>
            <Suspense fallback={<TablePlaceholder />}>
              <CustomersTable 
                onSelectCustomer={setSelectedCustomer}
                onSelectCustomers={setSelectedCustomers}
                filters={customerFilters}
              />
            </Suspense>
          </div> 

        </div>
      </main>

      {/* Customer Details Panel */}
   
        {selectedCustomer && (
  <div className="fixed inset-0 z-50 overflow-hidden">
    {/* Backdrop */}
    <div 
      className="absolute inset-0 bg-black/20 backdrop-blur-sm"
      onClick={() => setSelectedCustomer(null)}
    />
    
    {/* Panel - Add pt-20 pb-16 here */}
    <div className="absolute inset-y-0 right-0 w-full sm:w-[480px] md:w-[560px] lg:w-[640px] xl:w-[720px] pt-[56px] pb-[70px] sm:pt-0 sm:pb-0">
      <Suspense fallback={<DetailsPlaceholder />}>
        <CustomerDetailsPanel 
          customer={selectedCustomer}
          onClose={() => setSelectedCustomer(null)}
          onSendEmail={() => console.log('Send email')}
          onCreateOrder={() => console.log('Create order')}
        />
      </Suspense>
    </div>
  </div>
)}
     
    </div>
  )
}