'use client';

import React, { useState, useEffect } from 'react';
import { Search, Scan, Filter, Grid, Edit3, List, Eye, Edit, Trash2, Copy, Package, AlertCircle } from '../../../../utils/icons';
import { toast } from 'react-toastify';
import EditProductModal from '../modals/EditProductModal';
import BulkEditModal from '../modals/BulkEditModal';
import ProductsFilter from './filters/ProductsFilter';
import { useGetRetailerProductsQuery, useDeleteRetailerProductMutation } from '@/redux/retailer/slices/retailerProductsSlice';

export default function ProductsGrid({ 
  selectedProduct, 
  setSelectedProduct, 
  refreshTrigger, 
  categories = [],
  products = [],        
  totalProducts = 0,   
  totalPages = 1,       
  currentPage = 1,    
  onPageChange,      
  onSearch,            
  onFilter,             
  onRefresh,            
  onDelete              
}) {
  const [mounted, setMounted] = useState(false);
  const [viewMode, setViewMode] = useState('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [hoveredProduct, setHoveredProduct] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [showBulkEditModal, setShowBulkEditModal] = useState(false);
  const [selectedProductIds, setSelectedProductIds] = useState([]);
  const [bulkProducts, setBulkProducts] = useState([]);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [filterParams, setFilterParams] = useState({});
  const itemsPerPage = 12;

  // Real API call


  const [deleteProduct] = useDeleteRetailerProductMutation();


  useEffect(() => {
  if (refreshTrigger && onRefresh) {
    onRefresh();
  }
}, [refreshTrigger, onRefresh]);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const getStockStatusClass = (stock, threshold) => {
    if (stock === 0) return 'bg-red-100 text-red-700';
    if (stock <= threshold) return 'bg-orange-100 text-orange-700';
    return 'bg-green-100 text-green-700';
  };

  const getStockText = (stock, threshold) => {
    if (stock === 0) return 'Out of Stock';
    if (stock <= threshold) return 'Low Stock';
    return 'In Stock';
  };

  const handleUpdateProduct = async (productId, formData) => {
    console.log('Updating product:', productId);
    toast.success('Product updated successfully');
    refetch();
    return Promise.resolve();
  };

  const handleDeleteProduct = async (productId) => {
    if (window.confirm('Delete this product?')) {
      try {
        await deleteProduct(productId).unwrap();
        toast.success('Product deleted successfully');
        refetch();
      } catch (error) {
        toast.error('Failed to delete product');
      }
    }
  };

  const handleBulkUpdate = async (payload) => {
    console.log('Bulk updating:', payload);
    toast.success(`${payload.product_ids.length} products updated`);
    refetch();
    return Promise.resolve();
  };

  const handleSelectProduct = (productId, isChecked) => {
    if (isChecked) {
      setSelectedProductIds([...selectedProductIds, productId]);
    } else {
      setSelectedProductIds(selectedProductIds.filter(id => id !== productId));
    }
  };

  const handleSelectAll = () => {
    if (selectedProductIds.length === products.length && products.length > 0) {
      setSelectedProductIds([]);
    } else {
      setSelectedProductIds(products.map(p => p.id));
    }
  };

  const handleBulkEditClick = () => {
    const selectedProductsList = products.filter(p => selectedProductIds.includes(p.id));
    setBulkProducts(selectedProductsList);
    setShowBulkEditModal(true);
  };

  const handleBulkDelete = () => {
    if (window.confirm(`Delete ${selectedProductIds.length} products?`)) {
      selectedProductIds.forEach(async (id) => {
        await deleteProduct(id).unwrap();
      });
      toast.success(`${selectedProductIds.length} products deleted`);
      setSelectedProductIds([]);
      refetch();
    }
  };

  const handleApplyFilters = (filters) => {
    setFilterParams(filters);
    setCurrentPage(1);
    setShowFilterModal(false);
  };

  const getImageUrl = (product) => {
    return product?.primary_image || product?.images?.[0]?.image || null;
  };

  if (!products || products.length === 0) {
  return (
    <div className="products-grid-container bg-white rounded-xl shadow-sm border border-gray-100 p-4">
      <div className="text-center py-12">
        <Package size={48} className="mx-auto text-gray-300 mb-3" />
        <p className="text-sm text-gray-500">No products found</p>
      </div>
    </div>
  );
}

  return (
    <div className="products-grid-container bg-white rounded-xl shadow-sm border border-gray-100">
      {/* Header */}
      <div className="p-4 border-b border-gray-100">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="flex items-center gap-2 flex-wrap">
            <Package size={18} className="text-primary-500" />
            <h3 className="text-base font-semibold text-gray-900">Products Inventory</h3>
            <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
              {totalProducts} items
            </span>
            
            {selectedProductIds.length > 0 && (
              <div className="flex items-center gap-2 ml-2">
                <span className="text-xs text-primary-600 bg-primary-50 px-2 py-1 rounded-full">
                  {selectedProductIds.length} selected
                </span>
                <button onClick={handleBulkEditClick} className="px-3 py-1 text-xs font-medium text-white bg-primary-500 rounded-lg hover:bg-primary-600 transition-all flex items-center gap-1">
                  <Edit3 size={12} />
                  Bulk Edit
                </button>
                <button onClick={handleBulkDelete} className="px-3 py-1 text-xs font-medium text-white bg-red-500 rounded-lg hover:bg-red-600 transition-all flex items-center gap-1">
                  <Trash2 size={12} />
                  Delete
                </button>
              </div>
            )}
          </div>
          
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 pr-3 py-1.5 text-sm border border-gray-200 rounded-lg w-48 focus:outline-none focus:border-primary-500"
              />
            </div>
            <button
              onClick={() => setShowFilterModal(true)}
              className="p-1.5 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-all"
            >
              <Filter size={14} />
            </button>
            <div className="flex bg-gray-100 rounded-lg p-0.5">
              <button onClick={() => setViewMode('grid')} className={`p-1.5 rounded-md transition-all ${viewMode === 'grid' ? 'bg-white shadow-sm text-primary-600' : 'text-gray-500'}`}>
                <Grid size={14} />
              </button>
              <button onClick={() => setViewMode('list')} className={`p-1.5 rounded-md transition-all ${viewMode === 'list' ? 'bg-white shadow-sm text-primary-600' : 'text-gray-500'}`}>
                <List size={14} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Products Grid/List */}
      <div className="p-4">
        {products.length === 0 ? (
          <div className="text-center py-12">
            <Package size={48} className="mx-auto text-gray-300 mb-3" />
            <p className="text-sm text-gray-500">No products found</p>
            <button className="mt-2 text-xs text-primary-500">Add your first product</button>
          </div>
        ) : viewMode === 'grid' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {products.map((product, index) => (
              <div key={product.id} className="product-card border rounded-xl p-4 transition-all cursor-pointer relative hover:shadow-md" onClick={() => setSelectedProduct(product)}>
                <div className="absolute top-2 right-2 z-10" onClick={(e) => e.stopPropagation()}>
                  <input type="checkbox" checked={selectedProductIds.includes(product.id)} onChange={(e) => handleSelectProduct(product.id, e.target.checked)} className="w-4 h-4 rounded border-gray-300 text-primary-500" />
                </div>
                <div className="w-full h-28 bg-gray-50 rounded-lg flex items-center justify-center overflow-hidden">
                  {getImageUrl(product) ? (
                    <img src={getImageUrl(product)} alt={product.name} className="w-full h-full object-cover" />
                  ) : (
                    <Package size={32} className="text-gray-400" />
                  )}
                </div>
                <div className="mb-2 mt-2">
                  <h4 className="text-sm font-semibold text-gray-900 truncate">{product.name}</h4>
                  <p className="text-xs text-gray-500">SKU: {product.sku}</p>
                </div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-lg font-bold text-gray-900">₹{product.display_price || product.price}</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${getStockStatusClass(product.stock, product.threshold)}`}>
                    {getStockText(product.stock, product.threshold)}
                  </span>
                </div>
                <div className="w-full h-1 bg-gray-200 rounded-full overflow-hidden mb-3">
                  <div className={`h-full rounded-full ${product.stock === 0 ? 'bg-red-500' : product.stock <= product.threshold ? 'bg-orange-500' : 'bg-green-500'}`} style={{ width: `${Math.min((product.stock / (product.threshold || 1)) * 100, 100)}%` }} />
                </div>
                <div className="flex gap-2 pt-2 border-t border-gray-100">
                  <button className="flex-1 py-1.5 text-xs bg-gray-100 text-gray-700 rounded-lg hover:bg-primary-100 hover:text-primary-700 transition-all flex items-center justify-center gap-1"><Eye size={12} /><span>View</span></button>
                  <button onClick={(e) => { e.stopPropagation(); setEditingProduct(product); setShowEditModal(true); }} className="p-1.5 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-all"><Edit size={12} /></button>
                  <button onClick={(e) => { e.stopPropagation(); handleDeleteProduct(product.id); }} className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"><Trash2 size={12} /></button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[600px]">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr className="text-left text-xs font-medium text-gray-500">
                  <th className="px-3 py-2 w-8"><input type="checkbox" checked={selectedProductIds.length === products.length && products.length > 0} onChange={handleSelectAll} className="w-4 h-4 rounded border-gray-300" /></th>
                  <th className="px-3 py-2">Product</th>
                  <th className="px-3 py-2">SKU</th>
                  <th className="px-3 py-2">Price</th>
                  <th className="px-3 py-2">Stock</th>
                  <th className="px-3 py-2">Status</th>
                  <th className="px-3 py-2"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {products.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50 cursor-pointer" onClick={() => setSelectedProduct(product)}>
                    <td className="px-3 py-2 w-8" onClick={(e) => e.stopPropagation()}><input type="checkbox" checked={selectedProductIds.includes(product.id)} onChange={(e) => handleSelectProduct(product.id, e.target.checked)} className="w-4 h-4 rounded border-gray-300" /></td>
                    <td className="px-3 py-2"><div className="flex items-center gap-2"><div className="w-8 h-8 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">{getImageUrl(product) ? <img src={getImageUrl(product)} alt={product.name} className="w-full h-full object-cover" /> : <Package size={16} className="text-gray-400" />}</div><span className="text-sm font-medium text-gray-900">{product.name}</span></div></td>
                    <td className="px-3 py-2 text-xs text-gray-600">{product.sku}</td>
                    <td className="px-3 py-2 text-sm font-semibold text-gray-900">₹{product.display_price || product.price}</td>
                    <td className="px-3 py-2"><span className="text-xs">{product.stock} units</span></td>
                    <td className="px-3 py-2"><span className={`text-xs px-2 py-0.5 rounded-full ${getStockStatusClass(product.stock, product.threshold)}`}>{getStockText(product.stock, product.threshold)}</span></td>
                    <td className="px-3 py-2"><button onClick={(e) => { e.stopPropagation(); setEditingProduct(product); setShowEditModal(true); }} className="p-1 text-gray-400 hover:text-primary-600"><Eye size={14} /></button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="p-4 border-t border-gray-100 flex items-center justify-between">
          <div className="text-xs text-gray-500">Showing {(currentPage - 1) * itemsPerPage + 1} - {Math.min(currentPage * itemsPerPage, totalProducts)} of {totalProducts}</div>
          <div className="flex gap-1">
            <button onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} disabled={currentPage === 1} className="px-2 py-1 text-xs border rounded disabled:opacity-50 hover:bg-gray-100">Previous</button>
            <span className="px-2 py-1 text-xs bg-primary-500 text-white rounded">{currentPage}</span>
            <button onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} disabled={currentPage === totalPages} className="px-2 py-1 text-xs border rounded disabled:opacity-50 hover:bg-gray-100">Next</button>
          </div>
        </div>
      )}

      {/* Modals */}
      {showEditModal && <EditProductModal isOpen={showEditModal} onClose={() => { setShowEditModal(false); setEditingProduct(null); }} product={editingProduct} onSave={handleUpdateProduct} categories={categories} />}
      {showBulkEditModal && <BulkEditModal isOpen={showBulkEditModal} onClose={() => { setShowBulkEditModal(false); setBulkProducts([]); }} products={bulkProducts} onSave={handleBulkUpdate} categories={categories} />}
      {showFilterModal && <ProductsFilter isOpen={showFilterModal} onClose={() => setShowFilterModal(false)} onApply={handleApplyFilters} categories={categories} />}
    </div>
  );
}