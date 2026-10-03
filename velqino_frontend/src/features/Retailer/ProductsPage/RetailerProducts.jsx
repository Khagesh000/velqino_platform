"use client";

import React, { useState, lazy, Suspense, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import RetailerNavbar from '../RetailerDashboard/components/RetailerNavbar';
import AddProductModal from './modals/AddProductModal';
import BulkImagesModal from './modals/BulkImagesModal';
import BulkVideoModal from './modals/BulkVideoModal';
import ImportProductsModal from './modals/ImportProductsModal';
import ExportProductsModal from './modals/ExportProductsModal';
import BulkEditModal from './modals/BulkEditModal';
import EditProductModal from './modals/EditProductModal';
import { toast } from 'react-toastify';
import { 
  Package, 
  Sparkles, 
  TrendingUp, 
  RefreshCw, 
  Plus, 
  Upload, 
  Grid,
  CheckCircle,
  AlertCircle
} from '../../../utils/icons';

import { 
  useCreateRetailerProductMutation, 
  useGetRetailerProductsQuery,
  useUpdateRetailerProductMutation, 
  useBulkImagesSameMutation,
  useBulkVideoMutation,
  useBulkEditProductsMutation,
  useDeleteRetailerProductMutation,
  useImportProductsMutation,
  useExportProductsMutation
} from '@/redux/retailer/slices/retailerProductsSlice';
import { useGetCategoriesQuery } from '@/redux/wholesaler/slices/categoriesSlice';

// Core Components
import QuickActionsBar from './components/QuickActionsBar';
import ProductsGrid from './components/ProductsGrid';
import ProductDetails from './components/ProductDetails';
import Categories from './components/Categories';
import StockAlerts from './components/StockAlerts';

const BulkPriceUpdate = lazy(() => import('./components/BulkPriceUpdate'));
const BarcodePrinting = lazy(() => import('./components/BarcodePrinting'));

const WidgetPlaceholder = ({ height = "h-72" }) => (
  <div className={`w-full ${height} bg-white rounded-3xl border border-gray-200/80 p-6 shadow-2xs animate-pulse flex flex-col justify-between`}>
    <div className="space-y-3">
      <div className="h-5 bg-gray-200 rounded w-1/3" />
      <div className="h-4 bg-gray-100 rounded w-1/2" />
    </div>
    <div className="h-36 bg-gray-50 rounded-2xl" />
  </div>
);

export default function RetailerProducts() {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [currentView, setCurrentView] = useState('grid');
  
  // Modals state
  const [showAddProductModal, setShowAddProductModal] = useState(false);
  const [showBulkImagesModal, setShowBulkImagesModal] = useState(false);
  const [showBulkVideoModal, setShowBulkVideoModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [showBulkEditModal, setShowBulkEditModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterParams, setFilterParams] = useState({});
  const [selectedCategory, setSelectedCategory] = useState(null);

  const searchParams = useSearchParams();

  // Handle URL action triggers (e.g., from Dashboard quick actions)
  useEffect(() => {
    const action = searchParams?.get('action');
    if (action === 'add-single') {
      setShowAddProductModal(true);
    } else if (action === 'bulk-images') {
      setShowBulkImagesModal(true);
    } else if (action === 'bulk-video') {
      setShowBulkVideoModal(true);
    } else if (action === 'import') {
      setShowImportModal(true);
    } else if (action === 'export') {
      setShowExportModal(true);
    }
  }, [searchParams]);

  // Mutations
  const [createProduct] = useCreateRetailerProductMutation();
  const [bulkImagesSame] = useBulkImagesSameMutation();
  const [bulkVideo] = useBulkVideoMutation();
  const [bulkEditProducts] = useBulkEditProductsMutation();
  const [importProducts] = useImportProductsMutation();
  const [exportProducts] = useExportProductsMutation();
  const [updateProduct] = useUpdateRetailerProductMutation();

  // Categories API
  const { data: categoriesData, refetch: refetchCategories } = useGetCategoriesQuery(undefined, {
    refetchOnMountOrArgChange: false,
    refetchOnFocus: false,
  });
  const categories = categoriesData?.data || categoriesData || [];

  // Products API Query
  const { 
    data: productsData, 
    refetch, 
    isLoading,
    isFetching 
  } = useGetRetailerProductsQuery({ 
    page: currentPage, 
    per_page: 12,
    search: searchQuery || undefined,
    category_id: selectedCategory || undefined,
    ...filterParams
  });

  const products = productsData?.data?.products || productsData?.products || [];
  const totalProducts = productsData?.data?.pagination?.total || products.length || 0;
  const totalPages = productsData?.data?.pagination?.total_pages || Math.max(1, Math.ceil(totalProducts / 12));

  // Auto-scroll when selectedProduct changes
  useEffect(() => {
    if (selectedProduct) {
      const el = document.getElementById('product-details-section');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  }, [selectedProduct]);

  // Handlers
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
    try {
      const response = await createProduct(formData).unwrap();
      toast.success('Product created successfully');
      setShowAddProductModal(false);
      refetch();
      return response;
    } catch (error) {
      toast.error(error?.data?.message || 'Failed to add product');
      throw error;
    }
  };

  const handleBulkImagesSave = async (formData) => {
    try {
      const response = await bulkImagesSame(formData).unwrap();
      toast.success('Products batch uploaded successfully');
      setShowBulkImagesModal(false);
      refetch();
      return response;
    } catch (error) {
      toast.error(error?.data?.message || 'Failed to upload products');
      throw error;
    }
  };

  const handleBulkVideoSave = async (formData) => {
    try {
      const response = await bulkVideo(formData).unwrap();
      toast.success('Video processed & products uploaded');
      setShowBulkVideoModal(false);
      refetch();
      return response;
    } catch (error) {
      toast.error(error?.data?.message || 'Failed to upload video');
      throw error;
    }
  };

  const handleImportProducts = async (formData) => {
    try {
      const response = await importProducts(formData).unwrap();
      toast.success('Products imported successfully');
      setShowImportModal(false);
      refetch();
      return response;
    } catch (error) {
      toast.error(error?.data?.message || 'Failed to import products');
      throw error;
    }
  };

  const handleExportProducts = async (params) => {
    try {
      const response = await exportProducts(params).unwrap();
      toast.success('Catalog exported successfully');
      return response;
    } catch (error) {
      toast.error(error?.data?.message || 'Failed to export catalog');
      throw error;
    }
  };

  const handleBulkEdit = async (payload) => {
    try {
      const response = await bulkEditProducts(payload).unwrap();
      toast.success('Selected products updated successfully');
      setShowBulkEditModal(false);
      setSelectedProducts([]);
      refetch();
      return response;
    } catch (error) {
      toast.error(error?.data?.message || 'Failed to update products');
      throw error;
    }
  };

  const handleUpdateProduct = async (productId, formData) => {
    try {
      const response = await updateProduct({ productId, data: formData }).unwrap();
      toast.success('Product updated successfully');
      setShowEditModal(false);
      setEditingProduct(null);
      if (selectedProduct?.id === productId) {
        setSelectedProduct(prev => ({ ...prev, ...formData }));
      }
      refetch();
      return response;
    } catch (error) {
      toast.error(error?.data?.message || 'Failed to update product');
      throw error;
    }
  };

  const handleSelectCategory = (categoryId) => {
    setSelectedCategory(categoryId);
    setFilterParams(prev => ({ ...prev, category_id: categoryId || undefined }));
    setCurrentPage(1);
  };

  const handleScanBarcode = (barcode) => {
    setSearchQuery(barcode);
  };

  return (
    <div className="min-h-screen bg-gray-50/50 pb-20 lg:pb-12">
      {/* Top Navbar */}
      <RetailerNavbar 
        isSidebarCollapsed={isSidebarCollapsed}
        setIsSidebarCollapsed={setIsSidebarCollapsed}
      />
      
      {/* Main Content */}
      <main className={`transition-all duration-300 p-3 sm:p-5 lg:p-7 ${isSidebarCollapsed ? 'lg:ml-20' : 'lg:ml-64'}`}>
        <div className="max-w-[1540px] mx-auto space-y-6">
          
          {/* Header Command Strip */}
          <div className="bg-white rounded-3xl border border-gray-200/80 p-5 sm:p-6 shadow-2xs">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-[11px] font-extrabold uppercase tracking-wider text-primary-700 bg-primary-50 px-2.5 py-0.5 rounded-full border border-primary-200">
                    Store Catalog Management
                  </span>
                </div>

                <h1 className="text-xl sm:text-3xl font-black text-gray-900 tracking-tight flex items-center gap-2">
                  <span>Product Inventory</span>
                </h1>
                
                <p className="text-xs text-gray-500 mt-0.5">
                  Manage inventory lots, batch upload photos/videos, print barcodes, and audit profit margins.
                </p>
              </div>

              {/* Refresh & Live Sync */}
              <div className="flex items-center gap-2 flex-wrap">
                <button
                  type="button"
                  onClick={() => refetch()}
                  disabled={isFetching}
                  className="px-3.5 py-2 rounded-xl bg-gray-50 hover:bg-gray-100 border border-gray-200 text-gray-700 font-bold text-xs flex items-center gap-2 transition-all active:scale-95 shadow-2xs"
                >
                  <RefreshCw size={14} className={isFetching ? 'animate-spin text-primary-600' : 'text-gray-500'} />
                  <span>{isFetching ? 'Refreshing...' : 'Refresh'}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Quick Actions Bar with First-Class Creation Tools */}
          <QuickActionsBar 
            onAddProduct={handleAddProduct}
            onScanBarcode={handleScanBarcode}
            onImport={() => setShowImportModal(true)}
            onPrintLabels={() => {
              const el = document.getElementById('barcode-printing-section');
              el?.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }}
            onBulkPriceUpdate={() => {
              const el = document.getElementById('bulk-price-section');
              el?.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }}
            onViewChange={setCurrentView}
            currentView={currentView}
            onExportClick={() => setShowExportModal(true)}
            onBulkEdit={() => {
              if (selectedProducts.length > 0) {
                setShowBulkEditModal(true);
              } else {
                toast.info('Select products in the catalog to use Bulk Edit');
              }
            }}
            selectedCount={selectedProducts.length}
          />

          {/* Critical Stock Alerts Pill (Collapsible & Compact) */}
          <Suspense fallback={<WidgetPlaceholder height="h-28" />}>
            <StockAlerts />
          </Suspense>

          {/* Main 2-Column Catalog Workspace: Robust Flexbox (Sidebar on Left, Full Width Catalog on Right) */}
          <div className="flex flex-col lg:flex-row gap-6 items-start w-full">
            
            {/* Left Sidebar: Categories Manager & Filter (fixed width on desktop) */}
            <div className="w-full lg:w-72 xl:w-80 flex-shrink-0 space-y-4">
              <Suspense fallback={<WidgetPlaceholder height="h-[480px]" />}>
                <Categories 
                  categories={categories}
                  onSelectCategory={handleSelectCategory}
                  selectedCategory={selectedCategory}
                  onRefresh={refetchCategories}
                />
              </Suspense>
            </div>

            {/* Right Main Area: Products Grid or List View (always takes 100% of remaining width) */}
            <div className="flex-1 min-w-0 w-full space-y-4">
              <Suspense fallback={<WidgetPlaceholder height="h-[580px]" />}>
                <ProductsGrid 
                  selectedProduct={selectedProduct}
                  setSelectedProduct={setSelectedProduct}
                  refreshTrigger={refreshTrigger}
                  categories={categories}
                  products={products}
                  totalProducts={totalProducts}
                  totalPages={totalPages}
                  currentPage={currentPage}
                  isLoading={isLoading}        
                  searchQuery={searchQuery} 
                  onPageChange={setCurrentPage}
                  onSearch={setSearchQuery}
                  onFilter={setFilterParams}
                  onRefresh={refetch}
                  onEditProduct={(product) => {
                    setEditingProduct(product);
                    setShowEditModal(true);
                  }}
                  onBulkEdit={(items) => {
                    setSelectedProducts(items);
                    setShowBulkEditModal(true);
                  }}
                />
              </Suspense>
            </div>

          </div>

          {/* Lower Workspace: Product Details Inspector (Auto-scrolled), Price Update, and Barcodes */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
            
            {/* Product Details Inspector (5 cols) */}
            <div className="lg:col-span-5" id="product-details-section">
              <ProductDetails 
                selectedProduct={selectedProduct} 
                onClear={() => setSelectedProduct(null)}
                onEditProduct={(p) => {
                  setEditingProduct(p);
                  setShowEditModal(true);
                }}
                onUpdate={() => refetch()}
              />
            </div>

            {/* Bulk Price Update (4 cols) */}
            <div className="lg:col-span-4" id="bulk-price-section">
              <Suspense fallback={<WidgetPlaceholder height="h-[400px]" />}>
                <BulkPriceUpdate 
                  onComplete={() => {
                    setRefreshTrigger(prev => prev + 1);
                    refetch();
                  }} 
                  categories={categories}
                />
              </Suspense>
            </div>

            {/* Barcode Printing Sheet (3 cols) */}
            <div className="lg:col-span-3" id="barcode-printing-section">
              <Suspense fallback={<WidgetPlaceholder height="h-[400px]" />}>
                <BarcodePrinting />
              </Suspense>
            </div>

          </div>

          {/* Modals Suite */}
          {showAddProductModal && (
            <AddProductModal 
              isOpen={showAddProductModal}
              onClose={() => setShowAddProductModal(false)} 
              onSave={handleSaveProduct}
              categories={categories}
            />
          )}

          {showBulkImagesModal && (
            <BulkImagesModal 
              isOpen={showBulkImagesModal}
              onClose={() => setShowBulkImagesModal(false)} 
              onSave={handleBulkImagesSave}
              categories={categories}
            />
          )}

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

          {showExportModal && (
            <ExportProductsModal 
              isOpen={showExportModal}
              onClose={() => setShowExportModal(false)} 
              onExport={handleExportProducts}
              totalProducts={totalProducts}
            />
          )}

          {showBulkEditModal && (
            <BulkEditModal 
              isOpen={showBulkEditModal}
              onClose={() => {
                setShowBulkEditModal(false);
                setSelectedProducts([]);
              }}
              products={selectedProducts}
              onSave={handleBulkEdit}
              categories={categories}
            />
          )}

          {showEditModal && editingProduct && (
            <EditProductModal 
              isOpen={showEditModal}
              onClose={() => {
                setShowEditModal(false);
                setEditingProduct(null);
              }}
              product={editingProduct}
              onSave={(formData) => handleUpdateProduct(editingProduct.id, formData)}
              categories={categories}
            />
          )}

        </div>
      </main>
    </div>
  );
}
