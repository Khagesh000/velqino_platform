"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Package, AlertTriangle, RefreshCw, ChevronRight } from '../../../../utils/icons';
import '../../../../styles/Wholesaler/WholesalerDashboard/LowStockAlerts.scss';
import { toast } from 'react-toastify';
import { useUpdateProductMutation } from '@/redux/wholesaler/slices/productsSlice';

export default function LowStockAlerts({ items, isLoading, page, onPageChange, refetch }) {
  const router = useRouter();
  const [hoveredItem, setHoveredItem] = useState(null);
  const [failedImages, setFailedImages] = useState({});
  const [updateProduct] = useUpdateProductMutation();
  
  const itemsList = Array.isArray(items) ? items : (items?.items || items?.data || []);
  const hasMore = items?.has_next || false;
  const totalCount = items?.count || itemsList.length;
  const [showReorderModal, setShowReorderModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [reorderQuantity, setReorderQuantity] = useState(0);
  const [isReordering, setIsReordering] = useState(false);

  // Performance-optimized Cloudinary thumbnail transformation:
  // Converts 4.3MB PNGs to ~4KB lightweight WebP/JPEGs directly from Cloudinary CDN
  const getOptimizedThumb = (url) => {
    if (!url || typeof url !== 'string') return null;
    if (url.includes('res.cloudinary.com') && url.includes('/upload/') && !url.includes('/upload/w_')) {
      return url.replace('/upload/', '/upload/w_200,c_fill,q_auto,f_auto/');
    }
    return url;
  };

  const getStockLevelClass = (stock) => {
    if (stock === 0) return 'bg-rose-500 text-white';
    if (stock <= 5) return 'bg-amber-500 text-white';
    if (stock <= 10) return 'bg-yellow-500 text-white';
    return 'bg-emerald-500 text-white';
  };

  const getProgressColor = (stock, threshold) => {
    const percentage = threshold > 0 ? (stock / threshold) * 100 : 0;
    if (percentage <= 25) return 'bg-rose-500';
    if (percentage <= 50) return 'bg-amber-500';
    if (percentage <= 75) return 'bg-yellow-500';
    return 'bg-emerald-500';
  };

  const handleReorder = (product) => {
    setSelectedProduct(product);
    const threshold = product.reorderLevel ?? product.threshold ?? 10;
    setReorderQuantity(threshold * 2 || 10);
    setShowReorderModal(true);
  };

  const confirmReorder = async () => {
    const productId = Number(selectedProduct?.id);
    
    if (!productId || reorderQuantity <= 0) {
      toast.error('Invalid product or quantity');
      return;
    }
    
    setIsReordering(true);
    try {
      const currentStock = selectedProduct.currentStock ?? selectedProduct.stock ?? 0;
      const newStock = currentStock + reorderQuantity;
      
      await updateProduct({ 
        productId: productId, 
        data: { stock: newStock } 
      }).unwrap();
      
      toast.success(`Added ${reorderQuantity} units to ${selectedProduct.name}`);
      setShowReorderModal(false);
      refetch?.();
    } catch (error) {
      console.error('Reorder error:', error);
      toast.error(error?.data?.message || 'Failed to update stock');
    } finally {
      setIsReordering(false);
    }
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-slate-200 rounded w-1/3" />
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
            <div className="h-44 bg-slate-100 rounded-xl" />
            <div className="h-44 bg-slate-100 rounded-xl" />
            <div className="h-44 bg-slate-100 rounded-xl" />
          </div>
        </div>
      </div>
    );
  }

  if (itemsList.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200/80 p-8 text-center shadow-xs flex flex-col items-center justify-center">
        <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-3">
          <Package size={24} />
        </div>
        <h3 className="text-base font-bold text-slate-900">No Low Stock Alerts</h3>
        <p className="text-xs text-slate-500 mt-1 mb-4">All products are healthy and above reorder thresholds</p>
        <button
          type="button"
          onClick={() => router.push('/wholesaler/productcatalog')}
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-primary-50 text-primary-700 border border-primary-200/80 rounded-xl text-xs font-semibold hover:bg-primary-100 transition-all shadow-2xs"
        >
          <span>View Catalog</span>
          <ChevronRight size={14} />
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-4 lg:p-6 shadow-xs flex flex-col justify-between h-full">
      <div>
        {/* Header */}
        <div className="flex items-center justify-between mb-4 lg:mb-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-600 flex-shrink-0">
              <AlertTriangle size={20} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base lg:text-lg font-bold text-slate-900">Low Stock Alerts</h3>
                <span className="px-2 py-0.5 text-[11px] font-semibold bg-rose-50 text-rose-600 border border-rose-100 rounded-full">
                  {itemsList.length} items
                </span>
              </div>
              <p className="text-xs text-slate-500">Products currently below replenishment threshold</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button 
              type="button"
              onClick={() => refetch?.()} 
              className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-700 hover:bg-slate-100 hover:text-primary-600 transition-all shadow-2xs"
              title="Refresh alerts"
            >
              <RefreshCw size={13} />
              <span className="hidden sm:inline">Refresh</span>
            </button>

            <button 
              type="button"
              onClick={() => router.push('/wholesaler/productcatalog')} 
              className="flex items-center gap-1.5 px-3 py-1.5 bg-primary-50 border border-primary-200/80 rounded-xl text-xs font-semibold text-primary-700 hover:bg-primary-100 transition-all shadow-2xs group"
            >
              <span>View Catalog</span>
              <ChevronRight size={13} className="transition-transform group-hover:translate-x-0.5" />
            </button>
          </div>
        </div>

        {/* Low Stock Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {itemsList.map((item) => {
            const currentStock = item.currentStock ?? item.stock ?? 0;
            const threshold = item.reorderLevel ?? item.threshold ?? 10;
            const stockPercentage = threshold > 0 ? Math.min(Math.round((currentStock / threshold) * 100), 100) : 0;
            const rawImageUrl = item.image_url || item.image || item.primary_image;
            const optimizedImageUrl = getOptimizedThumb(rawImageUrl);
            const hasImageError = failedImages[item.id];

            return (
              <div
                key={item.id}
                className={`group relative bg-white rounded-2xl p-4 border border-slate-200/90 shadow-2xs hover:shadow-md transition-all duration-200 flex flex-col justify-between ${
                  hoveredItem === item.id ? 'translate-y-[-2px] border-primary-200' : ''
                }`}
                onMouseEnter={() => setHoveredItem(item.id)}
                onMouseLeave={() => setHoveredItem(null)}
              >
                {/* Critical Stock Pulsing Dot */}
                <div 
                  className={`absolute top-3.5 right-3.5 w-2.5 h-2.5 rounded-full ${
                    currentStock <= 2 
                      ? 'bg-rose-500 animate-pulse ring-4 ring-rose-100' 
                      : currentStock <= 5 
                      ? 'bg-amber-500' 
                      : 'bg-emerald-500'
                  }`}
                  title={`Status: ${item.status || 'Low Stock'}`}
                />

                <div>
                  {/* Product Header: Image + Name + SKU */}
                  <div className="flex items-start gap-3.5 mb-3.5 pr-4">
                    <div className="w-12 h-12 lg:w-14 lg:h-14 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-center overflow-hidden flex-shrink-0 shadow-2xs">
                      {rawImageUrl && !hasImageError ? (
                        <img
                          src={optimizedImageUrl}
                          alt={item.name || 'Product'}
                          loading="lazy"
                          decoding="async"
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                          onError={(e) => {
                            if (optimizedImageUrl !== rawImageUrl && e.currentTarget.src !== rawImageUrl) {
                              e.currentTarget.src = rawImageUrl;
                            } else {
                              setFailedImages(prev => ({ ...prev, [item.id]: true }));
                            }
                          }}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-primary-50 text-primary-600">
                          <Package size={22} />
                        </div>
                      )}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <h4 
                        className="text-xs sm:text-sm font-bold text-slate-900 group-hover:text-primary-600 transition-colors line-clamp-1" 
                        title={item.name}
                      >
                        {item.name}
                      </h4>
                      <p className="text-[11px] font-mono text-slate-500 mt-0.5">
                        SKU: {item.sku || 'N/A'}
                      </p>
                      {item.category && (
                        <span className="inline-block mt-1 px-2 py-0.5 text-[10px] font-semibold bg-slate-100 text-slate-600 rounded-md">
                          {item.category}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Stock Stats Row */}
                  <div className="space-y-2 mb-3 bg-slate-50/80 rounded-xl p-2.5 border border-slate-100">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-500 font-medium">Current Stock</span>
                      <span className={`font-bold px-2 py-0.5 rounded-md text-[11px] ${getStockLevelClass(currentStock)}`}>
                        {currentStock} units
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-500 font-medium">Reorder Threshold</span>
                      <span className="text-slate-700 font-semibold">{threshold} units</span>
                    </div>
                  </div>

                  {/* Progress bar */}
                  <div className="space-y-1 mb-4">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-slate-400 font-medium">Stock capacity</span>
                      <span className="font-semibold text-slate-600">{stockPercentage}%</span>
                    </div>
                    <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full transition-all duration-500 ${getProgressColor(currentStock, threshold)}`}
                        style={{ width: `${Math.max(stockPercentage, 6)}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-2 pt-1 border-t border-slate-100">
                  <button 
                    type="button"
                    onClick={() => handleReorder(item)}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 bg-primary-600 hover:bg-primary-700 active:bg-primary-800 text-white text-xs font-semibold rounded-xl transition-all shadow-2xs hover:shadow"
                  >
                    <Package size={14} />
                    <span>Reorder</span>
                  </button>
                  <button 
                    type="button"
                    onClick={() => handleReorder(item)}
                    className="p-2 bg-slate-50 border border-slate-200/80 rounded-xl hover:bg-primary-50 hover:text-primary-600 hover:border-primary-200 transition-all text-slate-500"
                    title="View details"
                  >
                    <ChevronRight size={15} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Footer Navigation */}
      <div className="flex items-center justify-between mt-5 pt-3.5 border-t border-slate-100 text-xs">
        <span className="text-slate-400 font-medium">
          {itemsList.length} alert{itemsList.length !== 1 ? 's' : ''} below threshold
        </span>
        <button
          type="button"
          onClick={() => router.push('/wholesaler/productcatalog')}
          className="flex items-center gap-1 font-semibold text-primary-600 hover:text-primary-700 transition-all hover:gap-1.5"
        >
          <span>Manage Inventory Catalog</span>
          <ChevronRight size={14} />
        </button>
      </div>

      {/* Reorder Modal */}
      {showReorderModal && selectedProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-primary-100 text-primary-600 flex items-center justify-center">
                  <Package size={18} />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">Reorder Stock</h3>
                  <p className="text-xs text-slate-500">Quick inventory top-up</p>
                </div>
              </div>
            </div>
            
            <div className="bg-slate-50 rounded-xl p-3.5 border border-slate-100 space-y-1.5 mb-4 text-xs">
              <p className="text-slate-600 flex justify-between">
                <span className="text-slate-400">Product:</span>
                <span className="font-semibold text-slate-900">{selectedProduct.name}</span>
              </p>
              <p className="text-slate-600 flex justify-between">
                <span className="text-slate-400">Current Stock:</span>
                <span className="font-bold text-amber-600">
                  {selectedProduct.currentStock ?? selectedProduct.stock ?? 0} units
                </span>
              </p>
              <p className="text-slate-600 flex justify-between">
                <span className="text-slate-400">Reorder Level:</span>
                <span className="font-medium text-slate-700">
                  {selectedProduct.reorderLevel ?? selectedProduct.threshold ?? 10} units
                </span>
              </p>
            </div>

            <div className="mb-5">
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Quantity to Add
              </label>
              <input
                type="number"
                value={reorderQuantity}
                onChange={(e) => setReorderQuantity(Math.max(1, parseInt(e.target.value) || 0))}
                className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all font-semibold"
                min="1"
              />
            </div>

            <div className="flex gap-2.5">
              <button 
                type="button"
                onClick={() => setShowReorderModal(false)} 
                className="flex-1 px-4 py-2.5 text-xs font-semibold border border-slate-200 text-slate-700 rounded-xl hover:bg-slate-50 transition-all"
              >
                Cancel
              </button>
              <button 
                type="button"
                onClick={confirmReorder} 
                disabled={isReordering} 
                className="flex-1 px-4 py-2.5 text-xs font-semibold bg-primary-600 text-white rounded-xl hover:bg-primary-700 disabled:opacity-50 transition-all shadow-xs"
              >
                {isReordering ? 'Processing...' : 'Confirm Reorder'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

