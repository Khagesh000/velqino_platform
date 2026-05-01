"use client";

import React, { useState, useCallback, useRef, useEffect, Suspense, lazy } from 'react';
import { 
  Grid, List, Package, Search, Filter, Star, Eye, Edit, Trash2, Copy, 
  MoreVertical, Plus, Download, Upload, X
} from '../../../../utils/icons';
import '../../../../styles/Wholesaler/ProductsCatalog/ProductsCatalog.scss';
import { useDeleteProductMutation } from '@/redux/wholesaler/slices/productsSlice';
import { BASE_IMAGE_URL } from '../../../../utils/apiConfig';
import { toast } from 'react-toastify';
import BulkEditTool from './BulkEditTool';

export default function ProductsCatalog({ 
  onEditProduct, 
  onBulkEdit, 
  onExport, 
  onImport,
  onImportImages, 
  categories = [],
  onAddProduct,
  productsData,
  isLoading,
  searchQuery,
  setSearchQuery,
  selectedCategory,
  setSelectedCategory,
  minPrice,
  setMinPrice,
  maxPrice,
  setMaxPrice,
  stockStatusFilter,
  setStockStatusFilter,
  currentPage,
  setCurrentPage,
  onProductsSelect 
}) {
  // Local UI state
  const [viewMode, setViewMode] = useState('grid');
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [hoveredProduct, setHoveredProduct] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [showBulkEditModal, setShowBulkEditModal] = useState(false);
  const [showImportDropdown, setShowImportDropdown] = useState(false);
  
  const itemsPerPage = 12;
  const [deleteProduct] = useDeleteProductMutation();
  const imageScrollRefs = useRef({});


  // Use props data
  const products = productsData?.data?.products || [];
  const totalProducts = productsData?.data?.pagination?.total || 0;
  const totalPages = productsData?.data?.pagination?.total_pages || 1;

  const categoriesFromProducts = ['All Categories', ...new Set(products.map(p => p.category_name).filter(Boolean))];
  const debounceTimeout = useRef(null);

  const handleSearch = useCallback((value) => {
    setSearchQuery(value);
    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current);
    }
    debounceTimeout.current = setTimeout(() => {
      setCurrentPage(1);
    }, 500);
  }, [setSearchQuery, setCurrentPage]);

  const getProductImage = (product) => {
    if (product?.primary_image) {
      return `${BASE_IMAGE_URL}${product.primary_image}`;
    }
    return null;
  };

  const toggleProductSelection = (productId) => {
    setSelectedProducts(prev => 
      prev.includes(productId) ? prev.filter(id => id !== productId) : [...prev, productId]
    );
  };

  const toggleSelectAll = () => {
    if (selectedProducts.length === filteredProducts.length && filteredProducts.length > 0) {
      setSelectedProducts([]);
    } else {
      setSelectedProducts(filteredProducts.map(p => p.id));
    }
  };

  const getStockStatusClass = (stock, threshold) => {
    if (stock === 0) return 'bg-error-100 text-error-700';
    if (stock <= threshold) return 'bg-warning-100 text-warning-700';
    return 'bg-success-100 text-success-700';
  };

  const getStockText = (stock, threshold) => {
    if (stock === 0) return 'Out of Stock';
    if (stock <= threshold) return 'Low Stock';
    return 'In Stock';
  };

  const handleDeleteProduct = async (productId, productName) => {
    if (confirm(`Are you sure you want to delete "${productName}"?`)) {
      try {
        await deleteProduct(productId).unwrap();
        toast.success(`${productName} deleted successfully`);
        setSelectedProducts(prev => prev.filter(id => id !== productId));
      } catch (error) {
        toast.error('Failed to delete product');
      }
    }
  };

  const handleBulkDelete = async () => {
    if (selectedProducts.length === 0) {
      toast.error('Please select products to delete');
      return;
    }
    if (confirm(`Are you sure you want to delete ${selectedProducts.length} product(s)?`)) {
      try {
        for (const productId of selectedProducts) {
          await deleteProduct(productId).unwrap();
        }
        toast.success(`${selectedProducts.length} product(s) deleted successfully`);
        setSelectedProducts([]);
      } catch (error) {
        toast.error('Failed to delete some products');
      }
    }
  };

  const handleCopyProduct = (product) => {
    const productDetails = `Product: ${product.name}\nSKU: ${product.sku}\nPrice: ₹${product.price}\nStock: ${product.stock}\nCategory: ${product.category_name || 'N/A'}`;
    navigator.clipboard.writeText(productDetails);
    toast.success('Product details copied to clipboard');
  };

  const handleEditProduct = (product) => {
    if (onEditProduct) {
      onEditProduct(product);
    }
  };

  const handleBulkEdit = () => {
    if (selectedProducts.length === 0) {
      toast.error('Please select products to bulk edit');
      return;
    }
    setShowBulkEditModal(true);
  };

  const handleViewProduct = (product) => {
    console.log('View product:', product);
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = searchQuery === '' || 
      product.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.sku?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = selectedCategory === 'All Categories' || product.category_id === selectedCategory;
    const matchesStockStatus = stockStatusFilter === 'All' || 
      (stockStatusFilter === 'In Stock' && product.stock > 0) ||
      (stockStatusFilter === 'Low Stock' && product.stock > 0 && product.stock <= (product.threshold || 10)) ||
      (stockStatusFilter === 'Out of Stock' && product.stock === 0);
    
    const matchesMinPrice = !minPrice || product.price >= Number(minPrice);
    const matchesMaxPrice = !maxPrice || product.price <= Number(maxPrice);
    
    return matchesSearch && matchesCategory && matchesStockStatus && matchesMinPrice && matchesMaxPrice;
  });

  // Pagination page numbers calculation
  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;
    
    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else if (currentPage <= 3) {
      for (let i = 1; i <= 4; i++) pages.push(i);
      pages.push('...');
      pages.push(totalPages);
    } else if (currentPage >= totalPages - 2) {
      pages.push(1);
      pages.push('...');
      for (let i = totalPages - 3; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      pages.push('...');
      for (let i = currentPage - 1; i <= currentPage + 1; i++) pages.push(i);
      pages.push('...');
      pages.push(totalPages);
    }
    return pages;
  };

  /* console.log('Filtered products count:', filteredProducts.length);
console.log('Total products:', products.length);
console.log('selectedCategory:', selectedCategory); */

  return (
    <div className="products-catalog">
      {/* Header with Title and Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-lg lg:rounded-xl bg-primary-100 flex items-center justify-center text-primary-600">
            <Package size={20} className="lg:w-6 lg:h-6" />
          </div>
          <div>
            <h1 className="text-xl lg:text-2xl font-bold text-gray-900">Products Catalog</h1>
            <p className="text-sm text-gray-500">Manage your product inventory and listings</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={onExport}
            className="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-all flex items-center gap-2"
          >
            <Download size={16} />
            <span className="hidden sm:inline">Export</span>
          </button>
          
          <div className="relative">
            <button 
              onClick={() => setShowImportDropdown(!showImportDropdown)}
              className="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-all flex items-center gap-2"
            >
              <Upload size={16} />
              <span className="hidden sm:inline">Import</span>
            </button>
            
            {showImportDropdown && (
              <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                <button 
                  onClick={() => {
                    onImportImages?.();
                    setShowImportDropdown(false);
                  }}
                  className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 rounded-t-lg"
                >
                  📷 Bulk Images
                </button>
                <button 
                  onClick={() => {
                    onImport?.();
                    setShowImportDropdown(false);
                  }}
                  className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 rounded-b-lg"
                >
                  🎥 Bulk Video
                </button>
              </div>
            )}
          </div>
          
          <button 
            onClick={onAddProduct}
            className="px-4 py-2 text-sm font-medium text-white bg-primary-500 rounded-lg hover:bg-primary-600 transition-all flex items-center gap-2"
          >
            <Plus size={16} />
            <span>Add Product</span>
          </button>
        </div>
      </div>

      {/* Search and Filter Bar */}
      <div className="bg-white border border-gray-200 rounded-xl p-4 mb-6">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1 relative">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search products by name, SKU, category..."
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              className="w-full pl-10 pr-10 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100 transition-all"
            />
            {searchQuery && (
              <button 
                className="absolute right-3 top-1/2 -translate-y-1/2 p-0.5 rounded-full hover:bg-gray-100 transition-all"
                onClick={() => setSearchQuery('')}
              >
                <X size={16} className="text-gray-400" />
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`px-3 py-2 border border-gray-200 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
                showFilters ? 'bg-primary-50 border-primary-200 text-primary-600' : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              <Filter size={16} />
              <span>Filters</span>
            </button>

            <div className="h-8 w-px bg-gray-200 mx-1"></div>

            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-lg transition-all ${
                viewMode === 'grid' 
                  ? 'bg-primary-500 text-white' 
                  : 'bg-white text-gray-400 border border-gray-200 hover:bg-gray-50'
              }`}
            >
              <Grid size={18} />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-lg transition-all ${
                viewMode === 'list' 
                  ? 'bg-primary-500 text-white' 
                  : 'bg-white text-gray-400 border border-gray-200 hover:bg-gray-50'
              }`}
            >
              <List size={18} />
            </button>
          </div>
        </div>

        {/* Filters Panel */}
        {showFilters && (
          <div className="products-filters-panel mt-4 pt-4 border-t border-gray-200">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Category</label>
                    <select 
                      value={selectedCategory}
                      onChange={(e) => {
                        const newValue = e.target.value === 'All Categories' ? 'All Categories' : Number(e.target.value);
                        console.log('🔍 Category selected - Raw value:', e.target.value);
                        console.log('🔍 Category selected - Converted value:', newValue);
                        console.log('🔍 Category selected - Type:', typeof newValue);
                        setSelectedCategory(newValue);
                      }}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
                    >
                      <option value="All Categories">All Categories</option>
                      {categories.map((cat) => (
                        <option key={cat.id} value={cat.id}>
                          {cat.name}
                        </option>
                      ))}
                    </select>
                  </div>
                            <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Stock Status</label>
                <select 
                  value={stockStatusFilter}
                  onChange={(e) => setStockStatusFilter(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
                >
                  <option>All</option>
                  <option>In Stock</option>
                  <option>Low Stock</option>
                  <option>Out of Stock</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Price Range</label>
                <div className="flex items-center gap-2">
                  <input 
                    type="number" 
                    placeholder="Min" 
                    value={minPrice}
                    onChange={(e) => setMinPrice(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-primary-500" 
                  />
                  <input 
                    type="number" 
                    placeholder="Max" 
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-primary-500" 
                  />
                </div>
              </div>
              {/* Vendor filter removed - was causing error */}
            </div>
            <div className="flex items-center justify-end gap-2 mt-4">
              <button 
                onClick={() => {
                  setSelectedCategory('All Categories');
                  setStockStatusFilter('All');
                  setMinPrice('');
                  setMaxPrice('');
                  setSearchQuery('');
                }}
                className="px-3 py-1.5 text-sm text-gray-600 hover:text-gray-900"
              >
                Reset
              </button>
              <button 
                onClick={() => setShowFilters(false)}
                className="px-4 py-1.5 text-sm bg-primary-500 text-white rounded-lg hover:bg-primary-600"
              >
                Apply Filters
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Selected Products Bar */}
      {selectedProducts.length > 0 && (
        <div className="bg-primary-50 border border-primary-200 rounded-lg p-3 mb-4 flex items-center justify-between">
          <span className="text-sm text-primary-700">
            <span className="font-semibold">{selectedProducts.length}</span> products selected
          </span>
          <div className="flex items-center gap-2">
            <button 
              onClick={handleBulkDelete}
              className="px-3 py-1.5 text-sm bg-white border border-error-200 text-error-700 rounded-lg hover:bg-error-50 transition-all"
            >
              Delete
            </button>
          </div>
        </div>
      )}

      {/* Loading State */}
      {isLoading ? (
        <div className="flex justify-center items-center py-12">
          <div className="w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" />
          <span className="ml-2 text-gray-500">Loading products...</span>
        </div>
      ) : viewMode === 'grid' ? (
        /* Grid View */
        <div className="products-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredProducts.map((product, index) => (
            <div
              key={product.id}
              className={`products-grid-card bg-white border rounded-xl p-4 transition-all relative ${
                selectedProducts.includes(product.id) ? 'border-primary-500 ring-2 ring-primary-100' : 'border-gray-200 hover:shadow-lg'
              }`}
              onMouseEnter={() => setHoveredProduct(product.id)}
              onMouseLeave={() => setHoveredProduct(null)}
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              <div className="flex justify-between items-start mb-2">
                <input
                  type="checkbox"
                  checked={selectedProducts.includes(product.id)}
                  onChange={() => toggleProductSelection(product.id)}
                  className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                />
                <button className="p-1 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-all">
                  <MoreVertical size={16} />
                </button>
              </div>

              <div className="w-full h-32 bg-gray-50 rounded-lg flex items-center justify-center overflow-hidden mb-3 relative group">
  {product.images && product.images.length > 0 ? (
    <>
      {/* Image Slider Container */}
      <div 
        ref={el => {
          if (!imageScrollRefs.current) imageScrollRefs.current = {};
          imageScrollRefs.current[product.id] = el;
        }}
        className="flex overflow-x-auto scroll-smooth h-full snap-x snap-mandatory hide-scrollbar"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {product.images.map((img, idx) => (
          <img 
            key={idx}
            src={`${BASE_IMAGE_URL}${img.image}`}
            alt={product.name}
            className="w-full h-full object-cover flex-shrink-0 snap-start"
            onError={(e) => { e.target.src = '/images/placeholder.jpg'; }}
          />
        ))}
      </div>
      
      {/* Left Scroll Button */}
      {product.images.length > 1 && (
        <button 
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            const container = imageScrollRefs.current[product.id];
            if (container) {
              const scrollAmount = container.clientWidth;
              container.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
            }
          }}
          className="absolute left-1 top-1/2 -translate-y-1/2 w-6 h-6 bg-white/80 hover:bg-white rounded-full flex items-center justify-center shadow-md opacity-0 group-hover:opacity-100 transition-all duration-200 z-10"
        >
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
      )}
      
      {/* Right Scroll Button */}
      {product.images.length > 1 && (
        <button 
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            const container = imageScrollRefs.current[product.id];
            if (container) {
              const scrollAmount = container.clientWidth;
              container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
            }
          }}
          className="absolute right-1 top-1/2 -translate-y-1/2 w-6 h-6 bg-white/80 hover:bg-white rounded-full flex items-center justify-center shadow-md opacity-0 group-hover:opacity-100 transition-all duration-200 z-10"
        >
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      )}
      
      {/* Image Counter Badge */}
      {product.images.length > 1 && (
        <div className="absolute bottom-1 right-1 bg-black/60 text-white text-xs px-1.5 py-0.5 rounded-full">
          {product.images.length}
        </div>
      )}
    </>
  ) : (
    <span className="text-4xl">📦</span>
  )}
</div>

              <div className="mb-3">
                <h3 className="font-semibold text-gray-900 truncate">{product.name}</h3>
                <p className="text-xs text-gray-500">SKU: {product.sku}</p>
                <p className="text-xs text-gray-500 mt-1">{product.category_name || '-'}</p>
              </div>

              <div className="flex items-center justify-between mb-3">
                <span className="text-lg font-bold text-gray-900">₹{product.price}</span>
                <span className={`text-xs px-2 py-1 rounded-full ${getStockStatusClass(product.stock, product.threshold || 10)}`}>
                  {getStockText(product.stock, product.threshold || 10)}
                </span>
              </div>

              <div className="flex items-center gap-2 mt-2 pt-2 border-t border-gray-100">
                <button 
                  onClick={() => handleViewProduct(product)}
                  className="flex-1 flex items-center justify-center gap-1 py-1.5 text-xs bg-primary-50 text-primary-700 rounded-lg hover:bg-primary-100 transition-all"
                >
                  <Eye size={14} />
                  <span>View</span>
                </button>
                <button 
                  onClick={() => handleEditProduct(product)}
                  className="p-1.5 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-all"
                >
                  <Edit size={14} />
                </button>
                <button 
                  onClick={() => handleCopyProduct(product)}
                  className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all"
                >
                  <Copy size={14} />
                </button>
                <button 
                  onClick={() => handleDeleteProduct(product.id, product.name)}
                  className="p-1.5 text-gray-400 hover:text-error-600 hover:bg-error-50 rounded-lg transition-all"
                >
                  <Trash2 size={14} />
                </button>
              </div>

              {hoveredProduct === product.id && (
                <div className={`absolute inset-0 rounded-xl opacity-10 blur-xl pointer-events-none ${
                  product.stock === 0 ? 'bg-error-500' : 
                  product.stock <= (product.threshold || 10) ? 'bg-warning-500' : 'bg-primary-500'
                }`} />
              )}
            </div>
          ))}
        </div>
      ) : (
        /* List View */
        <div className="products-list bg-white border border-gray-200 rounded-xl overflow-hidden overflow-x-auto">
          <table className="w-full min-w-[800px]">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="w-10 px-4 py-3">
                  <input 
                    type="checkbox"
                    checked={selectedProducts.length === filteredProducts.length && filteredProducts.length > 0}
                    onChange={toggleSelectAll}
                    className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  />
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Product</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">SKU</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Price</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Stock</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="w-10 px-4 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredProducts.map((product, index) => (
                <tr 
                  key={product.id}
                  className={`products-list-row hover:bg-gray-50 transition-all ${
                    selectedProducts.includes(product.id) ? 'bg-primary-50/30' : ''
                  }`}
                  style={{ animationDelay: `${index * 0.03}s` }}
                >
                  <td className="px-4 py-3">
                    <input 
                      type="checkbox"
                      checked={selectedProducts.includes(product.id)}
                      onChange={() => toggleProductSelection(product.id)}
                      className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                    />
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gray-50 rounded-lg flex items-center justify-center overflow-hidden">
                        {getProductImage(product) ? (
                          <img 
                            src={getProductImage(product)} 
                            alt={product.name}
                            className="w-full h-full object-cover"
                            loading="lazy"
                            onError={(e) => {
                              e.target.style.display = 'none';
                              e.target.parentElement.innerHTML = '<span class="text-xl">📦</span>';
                            }}
                          />
                        ) : (
                          <span className="text-xl">📦</span>
                        )}
                      </div>
                      <span className="text-sm font-medium text-gray-900">{product.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700">{product.sku}</td>
                  <td className="px-4 py-3 text-sm text-gray-700">{product.category_name || '-'}</td>
                  <td className="px-4 py-3 text-sm font-semibold text-gray-900">₹{product.price}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-1 rounded-full ${getStockStatusClass(product.stock, product.threshold || 10)}`}>
                      {product.stock} units
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      product.status === 'active' ? 'bg-success-100 text-success-700' :
                      product.stock <= (product.threshold || 10) && product.stock > 0 ? 'bg-warning-100 text-warning-700' :
                      product.stock === 0 ? 'bg-error-100 text-error-700' : 'bg-gray-100 text-gray-700'
                    }`}>
                      {product.status === 'active' ? 'Active' : product.stock === 0 ? 'Out of Stock' : 'Draft'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <button 
                        onClick={() => handleViewProduct(product)}
                        className="p-1 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-all"
                        title="View Product"
                      >
                        <Eye size={14} />
                      </button>
                      <button 
                        onClick={() => handleEditProduct(product)}
                        className="p-1 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-all"
                        title="Edit Product"
                      >
                        <Edit size={14} />
                      </button>
                      <button 
                        onClick={() => handleCopyProduct(product)}
                        className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all"
                        title="Copy Product"
                      >
                        <Copy size={14} />
                      </button>
                      <button 
                        onClick={() => handleDeleteProduct(product.id, product.name)}
                        className="p-1 text-gray-400 hover:text-error-600 hover:bg-error-50 rounded-lg transition-all"
                        title="Delete Product"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6">
          <p className="text-sm text-gray-600">
            Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, totalProducts)} of {totalProducts} products
          </p>
          <div className="flex items-center gap-2 flex-wrap justify-center">
            <button 
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-3 py-1.5 text-sm border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              Previous
            </button>
            
            {getPageNumbers().map((page, idx) => (
              page === '...' ? (
                <span key={idx} className="px-2 text-gray-400">...</span>
              ) : (
                <button 
                  key={idx}
                  onClick={() => setCurrentPage(page)}
                  className={`px-3 py-1.5 text-sm rounded-lg transition-all ${
                    currentPage === page
                      ? 'bg-primary-500 text-white shadow-sm' 
                      : 'border border-gray-200 hover:bg-gray-50 text-gray-700'
                  }`}
                >
                  {page}
                </button>
              )
            ))}
            
            <button 
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="px-3 py-1.5 text-sm border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* Bulk Edit Modal */}
      {showBulkEditModal && (
        <BulkEditTool 
          selectedProducts={selectedProducts}
          onClose={() => setShowBulkEditModal(false)}
          onApply={() => {
            setShowBulkEditModal(false);
            setSelectedProducts([]);
          }}
        />
      )}
    </div>
  );
}