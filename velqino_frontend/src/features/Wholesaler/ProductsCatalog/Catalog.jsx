"use client"

import React, { useState, lazy, Suspense } from 'react'
import WholesaleNavbar from '../WholesalerDashboard/components/WholesaleNavbar'
import ImportModal from './Modals/ImportModal'
import ExportModal from './Modals/ExportModal'
import ImportImagesModal from './Modals/ImportImagesModal'
import { useGetProductsQuery } from '@/redux/wholesaler/slices/productsSlice'
import { useGetCategoriesQuery } from '@/redux/wholesaler/slices/categoriesSlice'

import ProductEditModal from './components/ProductEditModal'
import CategoriesManager from './components/CategoriesManager'
import BulkEditTool from './components/BulkEditTool'
import ProductsCatalog from './components/ProductsCatalog'
import QuickActionsBar from './components/QuickActionsBar'
import ProductsTable from './components/ProductTables'
import '../../../styles/Wholesaler/ProductsCatalog/CatalogModals.scss' 

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
          <div>
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
              
              // ✅ Props
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
          </div>

          {/* Quick Actions Bar */}
          <div className="mt-6">
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
              onManageAttributes={() => setShowCategoriesManager(true)}
              selectedCount={selectedProducts.length}
            />
          </div> 

          {/* Products Table */}
          <div className="mt-6">
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
              
              // ✅ Props
              productsData={productsData}
              isLoading={isLoading}
              currentPage={currentPage}
              setCurrentPage={setCurrentPage}
              itemsPerPage={itemsPerPage}
              refetch={refetch}
            />
          </div> 

        </div>
      </main>

      {/* Product Edit Modal */}
      {showEditModal && (
        <div 
          className="velqino-modal-overlay fixed inset-0 z-[1050] flex justify-end bg-slate-900/60 backdrop-blur-sm transition-opacity" 
          onClick={() => setShowEditModal(false)}
        >
          <div 
            className="velqino-modal-drawer relative w-full sm:max-w-2xl lg:max-w-3xl h-full bg-white shadow-2xl flex flex-col overflow-hidden sm:rounded-l-2xl animate-in slide-in-from-right duration-200"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
          >
            <ProductEditModal 
              product={selectedProduct}
              onClose={() => setShowEditModal(false)}
              onSave={() => {
                refetch()
                setShowEditModal(false)
              }}
              categories={categories}
            />
          </div>
        </div>
      )}

      {/* Categories Manager Modal */}
      {showCategoriesManager && (
        <div 
          className="velqino-modal-overlay fixed inset-0 z-[1050] flex justify-end bg-slate-900/60 backdrop-blur-sm transition-opacity" 
          onClick={() => setShowCategoriesManager(false)}
        >
          <div 
            className="velqino-modal-drawer relative w-full sm:max-w-xl h-full bg-white shadow-2xl flex flex-col overflow-hidden sm:rounded-l-2xl animate-in slide-in-from-right duration-200"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
          >
            <CategoriesManager 
              onClose={() => setShowCategoriesManager(false)}
              onSave={() => {
                refetch()
                setShowCategoriesManager(false)
              }}
            />
          </div>
        </div>
      )}

      {/* Bulk Edit Tool Modal */}
      {showBulkEdit && (
        <div 
          className="velqino-modal-overlay fixed inset-0 z-[1050] flex justify-end bg-slate-900/60 backdrop-blur-sm transition-opacity" 
          onClick={() => setShowBulkEdit(false)}
        >
          <div 
            className="velqino-modal-drawer relative w-full sm:max-w-2xl h-full bg-white shadow-2xl flex flex-col overflow-hidden sm:rounded-l-2xl animate-in slide-in-from-right duration-200"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
          >
            <BulkEditTool 
              selectedProducts={selectedProducts}
              onClose={() => setShowBulkEdit(false)}
              onApply={() => {
                refetch()
                setShowBulkEdit(false)
              }}
            />
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
