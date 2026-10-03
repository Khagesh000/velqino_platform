'use client';

import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Scan, 
  Filter, 
  Grid, 
  Edit3, 
  List, 
  Eye, 
  Edit, 
  Trash2, 
  X, 
  Copy, 
  Package, 
  AlertCircle,
  CheckCircle,
  Plus,
  TrendingUp,
  Tag
} from '../../../../utils/icons';
import { toast } from 'react-toastify';
import ProductsFilter from './filters/ProductsFilter';
import { 
  useUpdateRetailerProductMutation, 
  useDeleteRetailerProductMutation 
} from '@/redux/retailer/slices/retailerProductsSlice';

export default function ProductsGrid({ 
  selectedProduct, 
  setSelectedProduct, 
  refreshTrigger, 
  categories = [],
  products = [],        
  totalProducts = 0,   
  totalPages = 1,       
  currentPage = 1, 
  isLoading = false,
  searchQuery = '',
  onPageChange,      
  onSearch,            
  onFilter,             
  onRefresh,            
  onEditProduct,
  onBulkEdit
}) {
  const [mounted, setMounted] = useState(false);
  const [viewMode, setViewMode] = useState('grid');
  const [selectedProductIds, setSelectedProductIds] = useState([]);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [activeFilters, setActiveFilters] = useState({});
  const itemsPerPage = 12;

  const [deleteProduct] = useDeleteRetailerProductMutation();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (refreshTrigger && onRefresh) {
      onRefresh();
    }
  }, [refreshTrigger, onRefresh]);

  if (!mounted) return null;

  const handleProductClick = (product) => {
    if (setSelectedProduct) {
      setSelectedProduct(product);
    }
    const el = document.getElementById('product-details-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  const handleDeleteProduct = async (productId, e) => {
    e?.stopPropagation();
    if (window.confirm('Are you sure you want to delete this product from your inventory?')) {
      try {
        await deleteProduct(productId).unwrap();
        toast.success('Product removed from catalog');
        if (selectedProduct?.id === productId && setSelectedProduct) {
          setSelectedProduct(null);
        }
        if (onRefresh) onRefresh();
      } catch (error) {
        toast.error(error?.data?.message || 'Failed to delete product');
      }
    }
  };

  const handleSelectProduct = (productId, isChecked, e) => {
    e?.stopPropagation();
    if (isChecked) {
      setSelectedProductIds([...selectedProductIds, productId]);
    } else {
      setSelectedProductIds(selectedProductIds.filter(id => id !== productId));
    }
  };

  const handleSelectAll = (e) => {
    e?.stopPropagation();
    if (selectedProductIds.length === products.length && products.length > 0) {
      setSelectedProductIds([]);
    } else {
      setSelectedProductIds(products.map(p => p.id));
    }
  };

  const handleBulkEditTrigger = () => {
    const selectedItems = products.filter(p => selectedProductIds.includes(p.id));
    if (onBulkEdit) {
      onBulkEdit(selectedItems);
    }
  };

  const getImageUrl = (product) => {
    return product?.primary_image || product?.images?.[0]?.image || product?.image || null;
  };

  const getStockStatusPill = (stock, threshold = 10) => {
    const num = Number(stock || 0);
    if (num <= 0) {
      return (
        <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200">
          Out of Stock
        </span>
      );
    }
    if (num <= threshold) {
      return (
        <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200">
          Low ({num})
        </span>
      );
    }
    return (
      <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
        In Stock ({num})
      </span>
    );
  };

  return (
    <div className="w-full bg-white rounded-3xl border border-gray-200/80 shadow-2xs overflow-hidden flex flex-col justify-between">
      <div>
        {/* Header Bar */}
        <div className="p-4 sm:p-5 border-b border-gray-100 flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 flex-wrap">
            <span className="p-1.5 rounded-lg bg-primary-50 text-primary-600">
              <Package size={18} />
            </span>
            <h3 className="text-base font-bold text-gray-900 tracking-tight">
              Products Catalog
            </h3>
            <span className="text-xs font-bold text-primary-800 bg-primary-50 border border-primary-200/70 px-2.5 py-0.5 rounded-full">
              {totalProducts} items
            </span>

            {selectedProductIds.length > 0 && (
              <div className="flex items-center gap-2 ml-2">
                <span className="text-xs font-bold text-amber-800 bg-amber-100 px-2.5 py-0.5 rounded-full border border-amber-200">
                  {selectedProductIds.length} selected
                </span>
                <button
                  type="button"
                  onClick={handleBulkEditTrigger}
                  className="px-3 py-1 text-xs font-bold text-white bg-primary-600 hover:bg-primary-700 rounded-xl transition-all flex items-center gap-1 shadow-2xs active:scale-95"
                >
                  <Edit3 size={13} />
                  <span>Bulk Edit</span>
                </button>
              </div>
            )}
          </div>

          {/* Search, Filter & View Controls */}
          <div className="flex items-center gap-2 flex-wrap self-end lg:self-auto">
            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search catalog..."
                value={searchQuery}
                onChange={(e) => onSearch?.(e.target.value)}
                className="pl-8 pr-7 py-1.5 text-xs bg-gray-50 border border-gray-200 rounded-xl w-44 sm:w-56 focus:outline-none focus:border-primary-500 focus:bg-white transition-all"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => onSearch?.('')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-0.5"
                >
                  <X size={13} />
                </button>
              )}
            </div>

            <button
              type="button"
              onClick={() => setShowFilterModal(true)}
              className="p-2 text-gray-600 hover:text-primary-700 bg-gray-50 hover:bg-primary-50 border border-gray-200 rounded-xl transition-all"
              title="Filter Catalog"
            >
              <Filter size={14} />
            </button>

            <div className="flex items-center bg-gray-100 p-0.5 rounded-xl border border-gray-200">
              <button
                type="button"
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-lg transition-all ${
                  viewMode === 'grid' 
                    ? 'bg-white shadow-2xs text-primary-700 font-bold' 
                    : 'text-gray-400 hover:text-gray-700'
                }`}
                title="Grid View"
              >
                <Grid size={14} />
              </button>
              <button
                type="button"
                onClick={() => setViewMode('list')}
                className={`p-1.5 rounded-lg transition-all ${
                  viewMode === 'list' 
                    ? 'bg-white shadow-2xs text-primary-700 font-bold' 
                    : 'text-gray-400 hover:text-gray-700'
                }`}
                title="List View"
              >
                <List size={14} />
              </button>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="p-4 sm:p-5">
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="h-72 bg-gray-100 rounded-3xl animate-pulse p-4 flex flex-col justify-between">
                  <div className="h-40 bg-gray-200 rounded-2xl" />
                  <div className="space-y-2 mt-2">
                    <div className="h-4 bg-gray-200 rounded w-3/4" />
                    <div className="h-3 bg-gray-200 rounded w-1/2" />
                  </div>
                  <div className="h-8 bg-gray-200 rounded-xl mt-3" />
                </div>
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-20 px-4 bg-gray-50/60 rounded-3xl border border-dashed border-gray-200">
              <Package size={40} className="text-gray-300 mx-auto mb-2" />
              <h4 className="text-sm font-bold text-gray-800">No Products in Inventory</h4>
              <p className="text-xs text-gray-500 mt-1 max-w-sm mx-auto">
                No inventory items match the current search or filters. Use &ldquo;Add Product&rdquo; or &ldquo;Bulk Images&rdquo; above to stock your catalog.
              </p>
            </div>
          ) : viewMode === 'grid' ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4 sm:gap-5">
              {products.map((product) => {
                const isSelected = selectedProduct?.id === product.id;
                const isChecked = selectedProductIds.includes(product.id);
                const price = Number(product.display_price ?? product.price ?? 0);
                const cost = Number(product.cost ?? 0);
                const profitMargin = price > 0 && cost > 0 ? Math.round(((price - cost) / price) * 100) : null;
                const imgUrl = getImageUrl(product);

                return (
                  <div 
                    key={product.id}
                    onClick={() => handleProductClick(product)}
                    className={`
                      group relative rounded-3xl p-3.5 sm:p-4 border transition-all duration-200 cursor-pointer flex flex-col justify-between
                      ${isSelected 
                        ? 'border-primary-500 ring-2 ring-primary-300/80 bg-primary-50/20 shadow-md' 
                        : 'bg-white border-gray-200/90 hover:border-primary-300 hover:shadow-md hover:-translate-y-0.5'
                      }
                    `}
                  >
                    <div>
                      {/* Image Thumbnail Container */}
                      <div className="relative w-full aspect-square bg-gray-100 rounded-2xl overflow-hidden mb-3 flex items-center justify-center border border-gray-100">
                        {imgUrl ? (
                          <img 
                            src={imgUrl} 
                            alt={product.name} 
                            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                            onError={(e) => {
                              e.target.style.display = 'none';
                              e.target.parentNode.classList.add('flex', 'items-center', 'justify-center');
                            }}
                          />
                        ) : (
                          <Package size={36} className="text-gray-300" />
                        )}

                        {/* Top-Right Selection Checkbox */}
                        <div 
                          className="absolute top-2.5 right-2.5 z-10 bg-white/90 backdrop-blur-xs p-1 rounded-lg shadow-2xs" 
                          onClick={(e) => e.stopPropagation()}
                        >
                          <input 
                            type="checkbox" 
                            checked={isChecked} 
                            onChange={(e) => handleSelectProduct(product.id, e.target.checked, e)} 
                            className="w-4 h-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500 cursor-pointer" 
                          />
                        </div>

                        {/* Top-Left Category Badge */}
                        <span className="absolute top-2.5 left-2.5 text-[9px] font-extrabold px-2 py-0.5 rounded-md bg-white/90 text-gray-800 shadow-2xs backdrop-blur-xs">
                          {product.category_name || product.category || 'Apparel'}
                        </span>

                        {/* Profit Margin Pill */}
                        {profitMargin !== null && profitMargin > 0 && (
                          <span className="absolute bottom-2 left-2 text-[9px] font-bold px-1.5 py-0.5 rounded-md bg-emerald-500/90 text-white shadow-2xs backdrop-blur-xs flex items-center gap-0.5">
                            <TrendingUp size={9} />
                            <span>{profitMargin}% margin</span>
                          </span>
                        )}
                      </div>

                      {/* Product Title & SKU */}
                      <h4 className="text-xs sm:text-sm font-bold text-gray-900 group-hover:text-primary-700 transition-colors line-clamp-1">
                        {product.name}
                      </h4>
                      <p className="text-[10px] font-mono text-gray-400 mt-0.5">
                        {product.sku}
                      </p>
                    </div>

                    {/* Pricing, Stock Status & Actions */}
                    <div className="mt-3 pt-2.5 border-t border-gray-100">
                      <div className="flex items-center justify-between mb-2.5">
                        <span className="text-base sm:text-lg font-black text-gray-900 tracking-tight">
                          ₹{price.toLocaleString('en-IN')}
                        </span>
                        {getStockStatusPill(product.stock, product.threshold)}
                      </div>

                      {/* Card Action Buttons */}
                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleProductClick(product);
                          }}
                          className="flex-1 py-1.5 text-xs font-bold bg-primary-50 hover:bg-primary-600 text-primary-700 hover:text-white rounded-xl transition-all flex items-center justify-center gap-1 shadow-2xs active:scale-95"
                        >
                          <Eye size={12} />
                          <span>Inspect</span>
                        </button>

                        <button 
                          type="button"
                          onClick={(e) => { 
                            e.stopPropagation(); 
                            if (onEditProduct) onEditProduct(product);
                          }} 
                          className="p-1.5 text-gray-500 hover:text-primary-700 hover:bg-primary-50 rounded-xl transition-colors border border-gray-200"
                          title="Edit Product"
                        >
                          <Edit size={13} />
                        </button>

                        <button 
                          type="button"
                          onClick={(e) => handleDeleteProduct(product.id, e)} 
                          className="p-1.5 text-gray-500 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors border border-gray-200"
                          title="Delete Product"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            /* List / Table View */
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-gray-50/80 border-b border-gray-200 text-gray-500 font-bold uppercase text-[10px]">
                  <tr>
                    <th className="p-3 w-8">
                      <input 
                        type="checkbox" 
                        checked={selectedProductIds.length === products.length && products.length > 0} 
                        onChange={handleSelectAll} 
                        className="w-4 h-4 rounded border-gray-300 text-primary-600 cursor-pointer" 
                      />
                    </th>
                    <th className="p-3">Product</th>
                    <th className="p-3">SKU</th>
                    <th className="p-3">Category</th>
                    <th className="p-3">Selling Price</th>
                    <th className="p-3">Stock Units</th>
                    <th className="p-3">Status</th>
                    <th className="p-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {products.map((product) => {
                    const isSelected = selectedProduct?.id === product.id;
                    const isChecked = selectedProductIds.includes(product.id);
                    const price = Number(product.display_price ?? product.price ?? 0);
                    const imgUrl = getImageUrl(product);

                    return (
                      <tr 
                        key={product.id}
                        onClick={() => handleProductClick(product)}
                        className={`hover:bg-primary-50/30 cursor-pointer transition-colors ${
                          isSelected ? 'bg-primary-50/40' : ''
                        }`}
                      >
                        <td className="p-3" onClick={(e) => e.stopPropagation()}>
                          <input 
                            type="checkbox" 
                            checked={isChecked} 
                            onChange={(e) => handleSelectProduct(product.id, e.target.checked, e)} 
                            className="w-4 h-4 rounded border-gray-300 text-primary-600 cursor-pointer" 
                          />
                        </td>
                        <td className="p-3">
                          <div className="flex items-center gap-2.5">
                            <div className="w-10 h-10 rounded-xl bg-gray-100 overflow-hidden flex-shrink-0 flex items-center justify-center border border-gray-100">
                              {imgUrl ? (
                                <img src={imgUrl} alt={product.name} className="w-full h-full object-cover" />
                              ) : (
                                <Package size={16} className="text-gray-400" />
                              )}
                            </div>
                            <span className="font-bold text-gray-900">{product.name}</span>
                          </div>
                        </td>
                        <td className="p-3 font-mono text-gray-500">{product.sku}</td>
                        <td className="p-3">
                          <span className="font-semibold text-gray-700">
                            {product.category_name || product.category || 'General'}
                          </span>
                        </td>
                        <td className="p-3 font-extrabold text-gray-900">
                          ₹{price.toLocaleString('en-IN')}
                        </td>
                        <td className="p-3 font-bold text-gray-800">
                          {product.stock || 0} pcs
                        </td>
                        <td className="p-3">
                          {getStockStatusPill(product.stock, product.threshold)}
                        </td>
                        <td className="p-3 text-right">
                          <div className="flex items-center justify-end gap-1.5" onClick={(e) => e.stopPropagation()}>
                            <button
                              type="button"
                              onClick={() => handleProductClick(product)}
                              className="p-1.5 text-gray-400 hover:text-primary-700 hover:bg-primary-50 rounded-lg transition-colors"
                              title="Inspect Details"
                            >
                              <Eye size={14} />
                            </button>
                            <button
                              type="button"
                              onClick={() => onEditProduct && onEditProduct(product)}
                              className="p-1.5 text-gray-400 hover:text-primary-700 hover:bg-primary-50 rounded-lg transition-colors"
                              title="Edit"
                            >
                              <Edit size={14} />
                            </button>
                            <button
                              type="button"
                              onClick={(e) => handleDeleteProduct(product.id, e)}
                              className="p-1.5 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                              title="Delete"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Pagination Footer */}
      {totalPages > 1 && (
        <div className="p-4 sm:p-5 border-t border-gray-100 flex items-center justify-between text-xs bg-gray-50/50">
          <span className="text-gray-500">
            Showing {(currentPage - 1) * itemsPerPage + 1} - {Math.min(currentPage * itemsPerPage, totalProducts)} of {totalProducts} items
          </span>
          <div className="flex items-center gap-1.5">
            <button 
              type="button"
              onClick={() => onPageChange?.(currentPage - 1)} 
              disabled={currentPage <= 1} 
              className="px-3 py-1.5 border border-gray-200 rounded-xl font-bold text-gray-700 disabled:opacity-40 hover:bg-gray-100 transition-colors"
            >
              Previous
            </button>
            <span className="px-3 py-1.5 bg-primary-600 text-white font-bold rounded-xl shadow-2xs">
              {currentPage} / {totalPages}
            </span>
            <button 
              type="button"
              onClick={() => onPageChange?.(currentPage + 1)} 
              disabled={currentPage >= totalPages} 
              className="px-3 py-1.5 border border-gray-200 rounded-xl font-bold text-gray-700 disabled:opacity-40 hover:bg-gray-100 transition-colors"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* Filter Modal */}
      {showFilterModal && (
        <ProductsFilter 
          isOpen={showFilterModal} 
          onClose={() => setShowFilterModal(false)} 
          onApply={(filters) => {
            setActiveFilters(filters);
            onFilter?.(filters);
            setShowFilterModal(false);
          }} 
          categories={categories} 
        />
      )}
    </div>
  );
}