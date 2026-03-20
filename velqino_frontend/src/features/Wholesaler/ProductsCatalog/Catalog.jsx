"use client"

import React, { useState, lazy, Suspense } from 'react'
import WholesaleNavbar from '../WholesalerDashboard/components/WholesaleNavbar'

// Lazy load all non-critical components
const ProductsCatalog = lazy(() => import('./Components/ProductsCatalog'))
const QuickActionsBar = lazy(() => import('./Components/QuickActionsBar'))
const ProductsTable = lazy(() => import('./Components/ProductsTable'))
const ProductEditModal = lazy(() => import('./Components/ProductEditModal'))
const CategoriesManager = lazy(() => import('./Components/CategoriesManager'))
const BulkEditTool = lazy(() => import('./Components/BulkEditTool')) 

// Loading placeholders with EXACT heights to prevent layout shift
const CatalogPlaceholder = () => <div className="w-full h-[600px] bg-gray-50 rounded-xl animate-pulse" />
const QuickActionsPlaceholder = () => <div className="w-full h-[120px] bg-gray-50 rounded-xl animate-pulse" />
const TablePlaceholder = () => <div className="w-full h-[500px] bg-gray-50 rounded-xl animate-pulse" />
const ModalPlaceholder = () => <div className="w-full h-full bg-gray-50 animate-pulse" />
const CategoriesPlaceholder = () => <div className="w-full h-[400px] bg-gray-50 rounded-xl animate-pulse" />
const BulkEditPlaceholder = () => <div className="w-full h-[300px] bg-gray-50 rounded-xl animate-pulse" /> 

export default function Catalog() {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showCategoriesManager, setShowCategoriesManager] = useState(false)
  const [showBulkEdit, setShowBulkEdit] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [selectedProducts, setSelectedProducts] = useState([])

  return (
    <div className="min-h-screen bg-gray-50">
      <WholesaleNavbar 
        isSidebarCollapsed={isSidebarCollapsed}
        setIsSidebarCollapsed={setIsSidebarCollapsed}
      />
      
      {/* Main content with dynamic margin based on sidebar state */}
      <main className={`
        transition-all duration-300 p-3 sm:p-4 lg:p-6
        ${isSidebarCollapsed ? 'lg:ml-20' : 'lg:ml-64'}
      `}>
        <div className="max-w-7xl mx-auto">
          
          {/* Products Catalog - Main Component */}
          <div style={{ minHeight: '600px' }}>
            <Suspense fallback={<CatalogPlaceholder />}>
              <ProductsCatalog 
                onEditProduct={(product) => {
                  setSelectedProduct(product)
                  setShowEditModal(true)
                }}
                onBulkEdit={() => setShowBulkEdit(true)}
                onManageCategories={() => setShowCategoriesManager(true)}
                onProductsSelect={setSelectedProducts}
              />
            </Suspense>
          </div>

          {/* Quick Actions Bar */}
         <div className="mt-6" style={{ minHeight: '120px' }}>
            <Suspense fallback={<QuickActionsPlaceholder />}>
              <QuickActionsBar 
                onAddNew={() => {
                  setSelectedProduct(null)
                  setShowEditModal(true)
                }}
                onImport={() => console.log('Import products')}
                onExport={() => console.log('Export products')}
                onBulkEdit={() => setShowBulkEdit(true)}
                onManageCategories={() => setShowCategoriesManager(true)}
                onManageAttributes={() => console.log('Manage attributes')}
              />
            </Suspense>
          </div> 

          {/* Products Table */}
          <div className="mt-6" style={{ minHeight: '500px' }}>
            <Suspense fallback={<TablePlaceholder />}>
              <ProductsTable 
                onEditProduct={(product) => {
                  setSelectedProduct(product)
                  setShowEditModal(true)
                }}
                onProductsSelect={setSelectedProducts}
              />
            </Suspense>
          </div> 

        </div>
      </main>

      {showEditModal && (
  <div className="fixed inset-0 z-50 overflow-hidden">
    {/* Backdrop */}
    <div 
      className="absolute inset-0 bg-black/50 backdrop-blur-sm"
      onClick={() => setShowEditModal(false)}
    />
    
    {/* Panel */}
    <div className="absolute inset-y-0 right-0 w-full max-w-4xl pt-[56px] pb-[70px] sm:pt-20 sm:pb-16">
      <Suspense fallback={<ModalPlaceholder />}>
        <ProductEditModal 
          product={selectedProduct}
          onClose={() => setShowEditModal(false)}
          onSave={() => {
            console.log('Product saved')
            setShowEditModal(false)
          }}
        />
      </Suspense>
    </div>
  </div>
)}

      {/* Categories Manager Modal */}
    {showCategoriesManager && (
  <div className="fixed inset-0 z-50 overflow-hidden">
    {/* Backdrop */}
    <div 
      className="absolute inset-0 bg-black/50 backdrop-blur-sm"
      onClick={() => setShowCategoriesManager(false)}
    />
    
    {/* Panel - Mobile optimized with padding */}
    <div className="absolute inset-y-0 right-0 w-full max-w-2xl pt-[56px] pb-[70px] sm:pt-20 sm:pb-16">
      <Suspense fallback={<CategoriesPlaceholder />}>
        <CategoriesManager 
          onClose={() => setShowCategoriesManager(false)}
          onSave={() => {
            console.log('Categories updated')
            setShowCategoriesManager(false)
          }}
        />
      </Suspense>
    </div>
  </div>
)}

      {/* Bulk Edit Tool Modal */}
{showBulkEdit && (
  <div className="fixed inset-0 z-50 overflow-hidden">
    {/* Backdrop */}
    <div 
      className="absolute inset-0 bg-black/50 backdrop-blur-sm"
      onClick={() => setShowBulkEdit(false)}
    />
    
    {/* Panel - Mobile optimized with padding */}
    <div className="absolute inset-y-0 right-0 w-full max-w-2xl pt-[56px] pb-[70px] sm:pt-20 sm:pb-16">
      <Suspense fallback={<BulkEditPlaceholder />}>
        <BulkEditTool 
          selectedProducts={selectedProducts}
          onClose={() => setShowBulkEdit(false)}
          onApply={(updates) => {
            console.log('Bulk updates applied:', updates)
            setShowBulkEdit(false)
          }}
        />
      </Suspense>
    </div>
  </div>
)}
    </div>
  )
}