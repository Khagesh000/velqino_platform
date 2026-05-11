"use client"

import React, { useState, lazy, Suspense } from 'react'
import RetailerNavbar from '../RetailerDashboard/components/RetailerNavbar'
import AddProductModal from './modals/AddProductModal'
import BulkImagesModal from './modals/BulkImagesModal'
import BulkVideoModal from './modals/BulkVideoModal'
import ImportProductsModal from './modals/ImportProductsModal'
import ExportProductsModal from './modals/ExportProductsModal'

// Lazy load all components
const ProductsGrid = lazy(() => import('./components/ProductsGrid'))
const QuickActionsBar = lazy(() => import('./components/QuickActionsBar'))
const StockAlerts = lazy(() => import('./components/StockAlerts'))
const Categories = lazy(() => import('./components/Categories'))
const ProductDetails = lazy(() => import('./components/ProductDetails'))
const BulkPriceUpdate = lazy(() => import('./components/BulkPriceUpdate'))
const BarcodePrinting = lazy(() => import('./components/BarcodePrinting')) 

// Loading placeholders
const GridPlaceholder = () => <div className="w-full h-[500px] bg-gray-100 rounded-xl animate-pulse" />
const SidebarPlaceholder = () => <div className="w-full h-[300px] bg-gray-100 rounded-xl animate-pulse" />
const AlertsPlaceholder = () => <div className="w-full h-[150px] bg-gray-100 rounded-xl animate-pulse" /> 

export default function RetailerProducts() {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [refreshTrigger, setRefreshTrigger] = useState(0)
  const [currentView, setCurrentView] = useState('grid');
  const [showAddProductModal, setShowAddProductModal] = useState(false);
  const [categories, setCategories] = useState([]);
  const [showBulkImagesModal, setShowBulkImagesModal] = useState(false);
  const [showBulkVideoModal, setShowBulkVideoModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  

      const handleAddProduct = (type) => {
      if (type === 'single') {
        setShowAddProductModal(true);
      } else if (type === 'bulk-images') {
        setShowBulkImagesModal(true);
      } else if (type === 'bulk-video') {
        setShowBulkVideoModal(true);
      }
    };

    const handleSaveProduct = async (formData) => {
    // Your API call to save product
    console.log('Saving product:', formData);
    // Call your API here
  };

  const handleBulkSave = async (formData) => {
    // Your API call to save product
    console.log('Saving product:', formData);
    // Call your API here
  };

  const handleBulkVideoSave = async (formData) => {
    // Your API call to save product
    console.log('Saving product:', formData);
    // Call your API here
  };

  const handleImportProducts = async (formData) => {
    // Your API call to save product
    console.log('Saving product:', formData);
    // Call your API here
  };

  const handleExportProducts = async (formData) => {
    // Your API call to save product
    console.log('Saving product:', formData);
    // Call your API here
  };

    const handleScanBarcode = (barcode) => {
      console.log('Scanned:', barcode);
    };

    const handleImport = () => {
      setShowImportModal(true);
    };

    const handlePrintLabels = () => {
      setShowPrintLabelsModal(true);
    };




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
            <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">Products</h1>
            <p className="text-sm text-gray-500 mt-1">Manage your product inventory</p>
          </div>

          {/* Quick Actions Bar */}
          <div className="mb-6" style={{ minHeight: '80px' }}>
            <Suspense fallback={<AlertsPlaceholder />}>
              <QuickActionsBar 
                onAddProduct={handleAddProduct}
                onScanBarcode={handleScanBarcode}
                onImport={handleImport}
                onPrintLabels={handlePrintLabels}
                onViewChange={setCurrentView}
                currentView={currentView}
                onExportClick={() => setShowExportModal(true)}
              />
            </Suspense>
          </div>

          {/* Stock Alerts */}
          <div className="mb-6" style={{ minHeight: '100px' }}>
            <Suspense fallback={<AlertsPlaceholder />}>
              <StockAlerts />
            </Suspense>
          </div> 

          {/* Main Content - 2 Columns */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            
            {/* Left Column - Categories (1/4 width) */}
            <div className="lg:col-span-1">
              <div style={{ minHeight: '400px' }}>
                <Suspense fallback={<SidebarPlaceholder />}>
                  <Categories />
                </Suspense>
              </div>
            </div> 

            {/* Right Column - Products Grid (3/4 width) */}
            <div className="lg:col-span-3">
              <div style={{ minHeight: '500px' }}>
                <Suspense fallback={<GridPlaceholder />}>
                  <ProductsGrid 
                    selectedProduct={selectedProduct}
                    setSelectedProduct={setSelectedProduct}
                    refreshTrigger={refreshTrigger}
                  />
                </Suspense>
              </div>
            </div>

          </div>

          {/* Bottom Section - 3 Columns */}
           <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
            
            <div style={{ minHeight: '350px' }}>
              <Suspense fallback={<SidebarPlaceholder />}>
                <ProductDetails selectedProduct={selectedProduct} />
              </Suspense>
            </div>
            
           <div style={{ minHeight: '350px' }}>
              <Suspense fallback={<SidebarPlaceholder />}>
                <BulkPriceUpdate onComplete={() => setRefreshTrigger(prev => prev + 1)} />
              </Suspense>
            </div> 
            
           <div style={{ minHeight: '350px' }}>
              <Suspense fallback={<SidebarPlaceholder />}>
                <BarcodePrinting />
              </Suspense>
            </div> 

                        {/* Add Product Modal */}
            {showAddProductModal && (
              <AddProductModal 
                isOpen={showAddProductModal}
                onClose={() => setShowAddProductModal(false)} 
                onSave={handleSaveProduct}
                categories={categories}
              />
            )}

            {/* Import Images Modal */}
           {showBulkImagesModal && (
              <BulkImagesModal 
                isOpen={showBulkImagesModal}
                onClose={() => setShowBulkImagesModal(false)} 
                onSave={handleBulkSave}
                categories={categories}
              />
            )}

            {/* Import Video Modal */}
           {showBulkVideoModal && (
              <BulkVideoModal 
                isOpen={showBulkVideoModal}
                onClose={() => setShowBulkVideoModal(false)} 
                onSave={handleBulkVideoSave}
                categories={categories}
              />
            )}

            {showImportModal && (
              <ImportProductsModal 
                isOpen={showImportModal}
                onClose={() => setShowImportModal(false)} 
                onImport={handleImportProducts}
              />
            )}

            {/* Export Modal */}
            {showExportModal && (
              <ExportProductsModal 
                isOpen={showExportModal}
                onClose={() => setShowExportModal(false)} 
                onExport={handleExportProducts}
               // totalProducts={products?.length || 0}
              />
            )}

          </div> 
        </div>
      </main>
    </div>
  )
}
