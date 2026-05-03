"use client";

import React, { useState } from 'react'
import { Package, AlertTriangle, RefreshCw, ChevronRight } from '../../../../utils/icons';
import '../../../../styles/Wholesaler/WholesalerDashboard/LowStockAlerts.scss';
import { toast } from 'react-toastify';
import { useUpdateProductMutation } from '@/redux/wholesaler/slices/productsSlice';

export default function LowStockAlerts({ items, isLoading, page, onPageChange, refetch }) {
  const [hoveredItem, setHoveredItem] = useState(null);
  const [updateProduct] = useUpdateProductMutation();
  
  const hasMore = items?.has_next || false;
  const totalCount = items?.count || 0;
  const currentPage = items?.page || 1;
  const totalPages = items?.total_pages || 1;
  const [showReorderModal, setShowReorderModal] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [reorderQuantity, setReorderQuantity] = useState(0)
  const [isReordering, setIsReordering] = useState(false)

  const loadMore = () => {
      if (hasMore) {
          setPage(prev => prev + 1);
      }
  };

  const getStockLevelClass = (stock) => {
    if (stock <= 2) return 'bg-error-100 text-error-600';
    if (stock <= 5) return 'bg-warning-100 text-warning-600';
    return 'bg-accent-100 text-accent-600';
  };

  const getProgressColor = (stock, threshold) => {
    const percentage = (stock / threshold) * 100;
    if (percentage <= 20) return 'bg-error-500';
    if (percentage <= 40) return 'bg-warning-500';
    return 'bg-accent-500';
  };

  const handleReorder = (product) => {
  setSelectedProduct(product)
  setReorderQuantity(product.threshold * 2 || 10)
  setShowReorderModal(true)
}

  const confirmReorder = async () => {
  const productId = Number(selectedProduct?.id)
  
  if (!productId || reorderQuantity <= 0) {
    toast.error('Invalid product or quantity')
    return
  }
  
  setIsReordering(true)
  try {
    const newStock = (selectedProduct.stock || 0) + reorderQuantity
    
    // ✅ Use productId (NOT id)
    await updateProduct({ 
      productId: productId, 
      data: { stock: newStock } 
    }).unwrap()
    
    toast.success(`Added ${reorderQuantity} units to ${selectedProduct.name}`)
    setShowReorderModal(false)
    refetch()
  } catch (error) {
    console.log('❌ Error:', error)
    toast.error(error?.data?.message || 'Failed to update stock')
  } finally {
    setIsReordering(false)
  }
}

  if (isLoading) {
    return <div className="bg-white rounded-2xl p-6">Loading...</div>;
  }

  if (items.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-light p-6 text-center">
        <AlertTriangle size={32} className="text-success-500 mx-auto mb-3" />
        <h3 className="text-lg font-semibold text-primary">No Low Stock Alerts</h3>
        <p className="text-sm text-tertiary">All products are above threshold levels</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-light p-4 lg:p-6 shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 lg:mb-6">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 lg:w-10 lg:h-10 rounded-lg lg:rounded-xl bg-error-100 flex items-center justify-center text-error-600">
            <AlertTriangle size={18} className="lg:w-5 lg:h-5" />
          </div>
          <div>
            <h3 className="text-base lg:text-lg xl:text-xl font-semibold text-primary">Low Stock Alerts</h3>
            <p className="text-xs lg:text-sm text-tertiary">Products below threshold level</p>
          </div>
        </div>
        <button onClick={() => refetch()} className="flex items-center gap-1 px-3 py-1.5 lg:px-4 lg:py-2 bg-surface-1 border border-light rounded-full text-xs lg:text-sm text-secondary hover:bg-surface-2 hover:text-primary-600 transition-all">
          <RefreshCw size={14} className="lg:w-4 lg:h-4" />
          <span>Refresh</span>
        </button>
      </div>

      {items.length === 0 && (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Package size={32} className="text-green-500" />
          </div>
          <h4 className="text-lg font-semibold text-gray-900 mb-2">No low stock alerts</h4>
          <p className="text-sm text-gray-500">All products are above threshold levels</p>
        </div>
      )}

      {/* Low Stock Grid */}
      {items.length > 0 && (
  <>
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3 lg:gap-4">
        {items.map((item) => (
          <div
            key={item.id}
            className={`group relative bg-surface-1 rounded-xl p-4 border border-light transition-all hover:shadow-md ${
              hoveredItem === item.id ? 'scale-[1.02]' : ''
            }`}
            onMouseEnter={() => setHoveredItem(item.id)}
            onMouseLeave={() => setHoveredItem(null)}
          >
            <div className={`absolute top-3 right-3 w-2 h-2 rounded-full ${
              item.stock <= 2 ? 'bg-error-500 animate-pulse' : 
              item.stock <= 5 ? 'bg-warning-500' : 'bg-accent-500'
            }`} />

            <div className="flex items-start gap-3 mb-3">
              <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-lg lg:rounded-xl bg-white border border-light flex items-center justify-center text-xl">
                📦
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-sm lg:text-base font-semibold text-primary truncate">{item.name}</h4>
                <p className="text-xs text-tertiary">SKU: {item.sku}</p>
                <p className="text-xs text-secondary mt-0.5">{item.category}</p>
              </div>
            </div>

            <div className="space-y-2 mb-3">
              <div className="flex items-center justify-between text-xs">
                <span className="text-secondary">Current Stock</span>
                <span className={`font-semibold px-2 py-0.5 rounded-full ${getStockLevelClass(item.stock)}`}>
                  {item.stock} units
                </span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-secondary">Threshold</span>
                <span className="text-primary font-medium">{item.threshold} units</span>
              </div>
            </div>

            <div className="space-y-1 mb-4">
              <div className="flex items-center justify-between text-xs">
                <span className="text-tertiary">Stock level</span>
                <span className="text-tertiary">{Math.round((item.stock / item.threshold) * 100)}%</span>
              </div>
              <div className="w-full h-1.5 bg-surface-2 rounded-full overflow-hidden">
                <div 
                  className={`h-full rounded-full transition-all duration-500 ${getProgressColor(item.stock, item.threshold)}`}
                  style={{ width: `${(item.stock / item.threshold) * 100}%` }}
                />
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button 
                onClick={() => handleReorder(item)}
                className="flex-1 flex items-center justify-center gap-1 py-2 bg-primary-500 hover:bg-primary-600 text-white text-xs font-medium rounded-lg transition-all hover:shadow-md"
              >
                <Package size={14} />
                <span>Reorder</span>
              </button>
              <button className="p-2 bg-white border border-light rounded-lg hover:bg-primary-50 transition-all text-tertiary hover:text-primary-600">
                <ChevronRight size={16} />
              </button>
            </div>

            {hoveredItem === item.id && (
              <div className={`absolute inset-0 rounded-xl opacity-10 blur-xl pointer-events-none ${
                item.stock <= 2 ? 'bg-error-500' : 
                item.stock <= 5 ? 'bg-warning-500' : 'bg-accent-500'
              }`} />
            )}
          </div>
        ))}
      </div>

      <div className="flex items-center justify-center mt-4 lg:mt-6 pt-3 lg:pt-4 border-t border-light">
        {hasMore && (
            <button onClick={loadMore} className="flex items-center gap-1 text-xs lg:text-sm text-primary-600 hover:text-primary-700 transition-all hover:gap-2">
                <span>Load more ({items.length}/{totalCount})</span>
                <ChevronRight size={14} />
            </button>
        )}

        {!hasMore && items.length > 0 && (
            <p className="text-xs text-tertiary text-center">All low stock products loaded</p>
        )}
      </div>
      </>
)}

{showReorderModal && selectedProduct && (
  <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
    <div className="bg-white rounded-xl max-w-md w-full p-6">
      <h3 className="text-lg font-semibold mb-2">Reorder Product</h3>
      <p className="text-sm text-gray-500 mb-4">Product: <span className="font-medium">{selectedProduct.name}</span></p>
      <p className="text-sm mb-2">Current Stock: <span className="font-medium">{selectedProduct.stock}</span></p>
      <p className="text-sm mb-2">Threshold: <span className="font-medium">{selectedProduct.threshold}</span></p>
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Quantity to Add</label>
        <input
          type="number"
          value={reorderQuantity}
          onChange={(e) => setReorderQuantity(parseInt(e.target.value) || 0)}
          className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-primary-500"
          min="1"
        />
      </div>
      <div className="flex gap-2">
        <button onClick={() => setShowReorderModal(false)} className="flex-1 px-4 py-2 border rounded-lg hover:bg-gray-50">Cancel</button>
        <button onClick={confirmReorder} disabled={isReordering} className="flex-1 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 disabled:opacity-50">
          {isReordering ? 'Processing...' : 'Confirm Reorder'}
        </button>
      </div>
    </div>
  </div>
)}

    </div>

    
  );
}