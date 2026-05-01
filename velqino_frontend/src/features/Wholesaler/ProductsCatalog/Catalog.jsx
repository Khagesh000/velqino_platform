"use client"

import React, { useState, lazy, Suspense } from 'react'
import WholesaleNavbar from '../WholesalerDashboard/components/WholesaleNavbar'
import ImportModal from './Modals/ImportModal'
import ExportModal from './Modals/ExportModal'
import ImportImagesModal from './Modals/ImportImagesModal'
import { useGetProductsQuery } from '@/redux/wholesaler/slices/productsSlice'
import { useGetCategoriesQuery } from '@/redux/wholesaler/slices/categoriesSlice'

// Lazy load all non-critical components
const ProductsCatalog = lazy(() => import('./Components/ProductsCatalog'))
const QuickActionsBar = lazy(() => import('./Components/QuickActionsBar'))
const ProductsTable = lazy(() => import('./Components/ProductTables'))
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
  const [showImportModal, setShowImportModal] = useState(false)
  const [showExportModal, setShowExportModal] = useState(false)
  const [showImportImagesModal, setShowImportImagesModal] = useState(false)

  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(12)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All Categories')
  const [minPrice, setMinPrice] = useState('')
  const [maxPrice, setMaxPrice] = useState('')
  const [stockStatusFilter, setStockStatusFilter] = useState('All')

  const { data: productsData, isLoading, refetch } = useGetProductsQuery({
  page: currentPage,
  per_page: itemsPerPage,
  search: searchQuery || undefined,
  category_id: selectedCategory && selectedCategory !== 'All Categories' ? Number(selectedCategory) : undefined,
  min_price: minPrice ? Number(minPrice) : undefined,
  max_price: maxPrice ? Number(maxPrice) : undefined,
  stock_status: stockStatusFilter !== 'All' ? stockStatusFilter : undefined
})

   

    // Fetch categories once
    const { data: categoriesData } = useGetCategoriesQuery();
    const categories = categoriesData?.data || categoriesData || [];

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
        <div className="max-w-7xl mx-auto">
          
          {/* Products Catalog - Main Component */}
          <div style={{ minHeight: '600px' }}>
          <Suspense fallback={<CatalogPlaceholder />}>
            <ProductsCatalog 
              // ✅ Existing props
              onEditProduct={(product) => {
                console.log('Editing product:', product);
                setSelectedProduct(product)
                setShowEditModal(true)
              }}
              onBulkEdit={() => setShowBulkEdit(true)}
              onExport={() => setShowExportModal(true)}
              onImport={() => setShowImportModal(true)}
              onImportImages={() => setShowImportImagesModal(true)}
              onAddProduct={() => {
                setSelectedProduct(null)
                setShowEditModal(true)
              }}
              onManageCategories={() => setShowCategoriesManager(true)}
              onProductsSelect={setSelectedProducts}
              
              // ✅ ADD THESE MISSING PROPS
              productsData={productsData}
              isLoading={isLoading}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
              minPrice={minPrice}
              setMinPrice={setMinPrice}
              maxPrice={maxPrice}
              setMaxPrice={setMaxPrice}
              stockStatusFilter={stockStatusFilter}
              setStockStatusFilter={setStockStatusFilter}
              currentPage={currentPage}
              setCurrentPage={setCurrentPage}
              categories={categories}
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
                onImport={() => setShowImportModal(true)}
                onImportImages={() => setShowImportImagesModal(true)}
                onExport={() => setShowExportModal(true)}
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
                onViewProduct={(product) => {
                  console.log('View product called:', product)
                }}
                onEditProduct={(product) => {
                  console.log('Edit product called:', product)
                  setSelectedProduct(product)
                  setShowEditModal(true)
                }}
                onProductsSelect={setSelectedProducts}
                
                // ✅ ADD THESE MISSING PROPS
                productsData={productsData}
                isLoading={isLoading}
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
                itemsPerPage={itemsPerPage}
                refetch={refetch}
              />
            </Suspense>
          </div> 

        </div>
      </main>

      {/* Product Edit Modal */}
      {showEditModal && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          <div 
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setShowEditModal(false)}
          />
          <div className="absolute inset-y-0 right-0 w-full max-w-4xl pt-[56px] pb-[70px] sm:pt-20 sm:pb-16">
            <Suspense fallback={<ModalPlaceholder />}>
              <ProductEditModal 
                product={selectedProduct}
                onClose={() => setShowEditModal(false)}
                onSave={() => {
                  console.log('Product saved')
                  setShowEditModal(false)
                }}
                categories={categories}
              />
            </Suspense>
          </div>
        </div>
      )}

      {/* Categories Manager Modal */}
      {showCategoriesManager && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          <div 
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setShowCategoriesManager(false)}
          />
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
          <div 
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setShowBulkEdit(false)}
          />
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

      {/* Import Products Modal */}
      {showImportModal && (
        <ImportModal 
          onClose={() => setShowImportModal(false)} 
          categories={categories}  // ✅ ADD THIS
        />
      )}

      {showImportImagesModal && (
        <ImportImagesModal 
          onClose={() => setShowImportImagesModal(false)} 
          categories={categories}  // ✅ ADD THIS
        />
      )}

      {/* Export Products Modal */}
      {showExportModal && (
        <ExportModal onClose={() => setShowExportModal(false)} />
      )}

    </div>
  )
}