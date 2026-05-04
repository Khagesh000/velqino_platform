"use client";

import React, { useState, useEffect } from 'react';
import {
  Eye,
  Edit,
  Copy,
  Trash2,
  Star,
  ChevronLeft,
  ChevronRight,
  Package,
  AlertCircle
} from '../../../../utils/icons';
import '../../../../styles/Wholesaler/ProductsCatalog/ProductsTable.scss';
import { useDeleteProductMutation } from '@/redux/wholesaler/slices/productsSlice';
import { toast } from 'react-toastify';
import { BASE_IMAGE_URL } from '../../../../utils/apiConfig';

export default function ProductsTables({ 
  productsData,        
  isLoading,           
  onEditProduct, 
  onViewProduct, 
  onProductsSelect,
  currentPage,
  setCurrentPage,
  itemsPerPage = 10,
}) {
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [hoveredRow, setHoveredRow] = useState(null);
  const [sortConfig, setSortConfig] = useState({ key: 'name', direction: 'asc' });
  
  // ✅ Use props, not local state
  const products = productsData?.data?.products || [];
  const totalProducts = productsData?.data?.pagination?.total || 0;
  const totalPages = productsData?.data?.pagination?.total_pages || 1;


  const [deleteProduct] = useDeleteProductMutation();

  const toggleProductSelection = (productId) => {
    let newSelected
    if (selectedProducts.includes(productId)) {
      newSelected = selectedProducts.filter(id => id !== productId)
    } else {
      newSelected = [...selectedProducts, productId]
    }
    setSelectedProducts(newSelected)
    if (onProductsSelect) onProductsSelect(newSelected)
  }

  const toggleSelectAll = () => {
    let newSelected
    if (selectedProducts.length === products.length && products.length > 0) {
      newSelected = []
    } else {
      newSelected = products.map(p => p.id)
    }
    setSelectedProducts(newSelected)
    if (onProductsSelect) onProductsSelect(newSelected)
  }

  const getStockStatusClass = (stock, threshold) => {
    if (stock === 0) return 'status-out-of-stock'
    if (stock <= threshold) return 'status-low-stock'
    return 'status-in-stock'
  }

  const getStockText = (stock, threshold) => {
    if (stock === 0) return 'Out of Stock'
    if (stock <= threshold) return 'Low Stock'
    return 'In Stock'
  }

  const handleSort = (key) => {
    setSortConfig({
      key,
      direction: sortConfig.key === key && sortConfig.direction === 'asc' ? 'desc' : 'asc'
    })
  }

  const sortedProducts = [...products].sort((a, b) => {
    if (sortConfig.direction === 'asc') {
      return a[sortConfig.key] > b[sortConfig.key] ? 1 : -1
    }
    return a[sortConfig.key] < b[sortConfig.key] ? 1 : -1
  })

  const handleDeleteProduct = async (productId) => {
    if (confirm('Are you sure you want to delete this product?')) {
      try {
        await deleteProduct(productId).unwrap()
        toast.success('Product deleted successfully')
        refetch()
        setSelectedProducts(prev => prev.filter(id => id !== productId))
      } catch (error) {
        toast.error('Failed to delete product')
      }
    }
  }

  // Add this function before return (around line 70)
const handleBulkDelete = async () => {
  if (selectedProducts.length === 0) {
    toast.error('Please select products to delete')
    return
  }
  
  if (confirm(`Are you sure you want to delete ${selectedProducts.length} products?`)) {
    try {
      // Delete each selected product
      for (const productId of selectedProducts) {
        await deleteProduct(productId).unwrap()
      }
      toast.success(`${selectedProducts.length} products deleted successfully`)
      refetch()
      setSelectedProducts([]) // Clear selection after delete
      if (onProductsSelect) onProductsSelect([])
    } catch (error) {
      toast.error('Failed to delete some products')
    }
  }
}

  const handlePageChange = (page) => {
    setCurrentPage(page)
  }

  const getProductImage = (product) => {
    if (product.primary_image) {
      return `${BASE_IMAGE_URL}${product.primary_image}`
    }
    return null
  }

  return (
    <div className="products-table-container bg-white rounded-xl border border-gray-200 overflow-hidden">
      {/* Table Header with Title */}
      <div className="px-4 py-3 border-b border-gray-200 bg-gray-50/50 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Package size={18} className="text-gray-500" />
          <h3 className="font-semibold text-gray-900">Products Inventory</h3>
          <span className="px-2 py-0.5 bg-gray-200 text-gray-700 text-xs rounded-full">
            {totalProducts} items
          </span>
        </div>
        {selectedProducts.length > 0 && (
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">
              {selectedProducts.length} selected
            </span>
            <button 
      onClick={handleBulkDelete}
      className="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-all"
      title="Delete selected"
    >
      <Trash2 size={16} />
    </button>
          </div>
        )}
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="products-table w-full">
          <thead>
            <tr>
              <th className="w-10 px-4 py-3">
                <input 
                  type="checkbox" 
                  checked={products.length > 0 && selectedProducts.length === products.length}
                  onChange={toggleSelectAll}
                  className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                />
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Image</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase cursor-pointer" onClick={() => handleSort('name')}>
                <div className="flex items-center gap-1">Product Name</div>
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">SKU</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase cursor-pointer" onClick={() => handleSort('price')}>
                <div className="flex items-center gap-1">Price</div>
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Stock</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="w-20 px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {isLoading ? (
              <tr>
                <td colSpan="9" className="px-4 py-8 text-center text-gray-500">
                  <div className="flex justify-center items-center gap-2">
                    <div className="w-5 h-5 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" />
                    Loading products...
                  </div>
                </td>
              </tr>
            ) : sortedProducts.length === 0 ? (
              <tr>
                <td colSpan="9" className="px-4 py-8 text-center text-gray-500">
                  No products found
                </td>
              </tr>
            ) : (
              sortedProducts.map((product, index) => (
                <tr
                  key={product.id}
                  className={`products-table-row ${hoveredRow === product.id ? 'products-table-row-hover' : ''} ${
                    selectedProducts.includes(product.id) ? 'bg-primary-50' : ''
                  }`}
                  onMouseEnter={() => setHoveredRow(product.id)}
                  onMouseLeave={() => setHoveredRow(null)}
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
    <div className="w-10 h-10 bg-gray-50 rounded-lg flex items-center justify-center overflow-hidden relative">
      {product.images && product.images.length > 0 ? (
        <img 
          src={`${BASE_IMAGE_URL}${product.images[0].image}`} 
          alt={product.name} 
          className="w-full h-full object-cover"
          onError={(e) => { e.target.src = '/images/placeholder.jpg'; }}
        />
      ) : (
        <span className="text-xl">📦</span>
      )}
      {product.images && product.images.length > 1 && (
        <span className="absolute bottom-0 right-0 bg-primary-500 text-white text-[8px] px-1 rounded-tl">
          +{product.images.length}
        </span>
      )}
    </div>
    <span className="text-sm font-medium text-gray-900 truncate max-w-[150px]">{product.name}</span>
  </div>
</td>
                  <td className="px-4 py-3">
                    <div>
                      <p className="text-sm font-medium text-gray-900">{product.name}</p>
                      <p className="text-xs text-gray-500 mt-0.5">ID: {product.sku}</p>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-sm text-gray-600">{product.sku}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-sm text-gray-600">{product.category_name || '-'}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-sm font-semibold text-gray-900">₹{product.price}</span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <span className={`text-sm ${product.stock === 0 ? 'text-error-600' : product.stock <= (product.threshold || 10) ? 'text-warning-600' : 'text-gray-900'}`}>
                        {product.stock}
                      </span>
                      {product.stock <= (product.threshold || 10) && product.stock > 0 && (
                        <AlertCircle size={14} className="text-warning-500" />
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${getStockStatusClass(product.stock, product.threshold || 10)}`}>
                      {getStockText(product.stock, product.threshold || 10)}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      {/* EYE BUTTON - View only, no modal */}
                      <button
                        className="p-1.5 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-all"
                        onClick={() => {
                          console.log('View product:', product.id, product.name)
                          if (onViewProduct) {
                            onViewProduct(product)
                          } else {
                            console.warn('onViewProduct prop is not provided')
                          }
                        }}
                        title="View Product"
                      >
                        <Eye size={16} />
                      </button>
                      
                      {/* EDIT BUTTON - Opens edit modal */}
                      <button
                        className="p-1.5 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-all"
                        onClick={() => {
                          console.log('Edit product:', product.id, product.name)
                          if (onEditProduct) {
                            onEditProduct(product)
                          } else {
                            console.warn('onEditProduct prop is not provided')
                          }
                        }}
                        title="Edit Product"
                      >
                        <Edit size={16} />
                      </button>
                      
                      {/* DELETE BUTTON */}
                      <button 
                        className="p-1.5 text-gray-400 hover:text-error-600 hover:bg-error-50 rounded-lg transition-all"
                        onClick={() => handleDeleteProduct(product.id)}
                        title="Delete Product"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="px-4 py-3 border-t border-gray-200 flex items-center justify-between">
          <p className="text-sm text-gray-600">
            Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, totalProducts)} of {totalProducts} products
          </p>
          <div className="flex items-center gap-2">
            <button
              className="p-1.5 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              <ChevronLeft size={16} />
            </button>
            {[...Array(Math.min(totalPages, 5))].map((_, i) => {
              let pageNum
              if (totalPages <= 5) {
                pageNum = i + 1
              } else if (currentPage <= 3) {
                pageNum = i + 1
              } else if (currentPage >= totalPages - 2) {
                pageNum = totalPages - 4 + i
              } else {
                pageNum = currentPage - 2 + i
              }
              return (
                <button
                  key={pageNum}
                  className={`w-8 h-8 text-sm rounded-lg transition-all ${
                    currentPage === pageNum
                      ? 'bg-primary-500 text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                  onClick={() => handlePageChange(pageNum)}
                >
                  {pageNum}
                </button>
              )
            })}
            <button
              className="p-1.5 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}