"use client"

import React, { useState } from 'react'
import {
  Eye,
  Edit,
  Copy,
  Trash2,
  MoreVertical,
  Star,
  ChevronLeft,
  ChevronRight,
  Package,
  AlertCircle
} from '../../../../utils/icons'
import '../../../../styles/Wholesaler/ProductsCatalog/ProductsTable.scss'

export default function ProductsTable({ onEditProduct, onProductsSelect }) {
  const [selectedProducts, setSelectedProducts] = useState([])
  const [hoveredRow, setHoveredRow] = useState(null)
  const [sortConfig, setSortConfig] = useState({ key: 'name', direction: 'asc' })
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  const products = [
    {
      id: 1,
      image: '🎧',
      name: 'Wireless Headphones',
      sku: 'WH-001',
      category: 'Electronics',
      price: 1250,
      stock: 45,
      threshold: 10,
      status: 'Active',
      sales: 128,
      rating: 4.5,
      vendor: 'Sony Corp'
    },
    {
      id: 2,
      image: '👕',
      name: 'Cotton T-Shirt',
      sku: 'CT-045',
      category: 'Clothing',
      price: 450,
      stock: 120,
      threshold: 20,
      status: 'Active',
      sales: 89,
      rating: 4.2,
      vendor: 'Fashion Hub'
    },
    {
      id: 3,
      image: '☕',
      name: 'Ceramic Mug',
      sku: 'CM-112',
      category: 'Home Decor',
      price: 299,
      stock: 8,
      threshold: 15,
      status: 'Low Stock',
      sales: 56,
      rating: 4.8,
      vendor: 'Home Essentials'
    },
    {
      id: 4,
      image: '🧘',
      name: 'Yoga Mat',
      sku: 'YM-078',
      category: 'Fitness',
      price: 899,
      stock: 34,
      threshold: 12,
      status: 'Active',
      sales: 67,
      rating: 4.6,
      vendor: 'FitLife'
    },
    {
      id: 5,
      image: '💡',
      name: 'Desk Lamp',
      sku: 'DL-234',
      category: 'Home Decor',
      price: 1299,
      stock: 18,
      threshold: 8,
      status: 'Active',
      sales: 42,
      rating: 4.3,
      vendor: 'Lighting Co'
    },
    {
      id: 6,
      image: '📓',
      name: 'Notebook Set',
      sku: 'NB-056',
      category: 'Stationery',
      price: 199,
      stock: 6,
      threshold: 25,
      status: 'Low Stock',
      sales: 34,
      rating: 4.7,
      vendor: 'Paper World'
    },
    {
      id: 7,
      image: '🔊',
      name: 'Bluetooth Speaker',
      sku: 'BS-089',
      category: 'Electronics',
      price: 2499,
      stock: 23,
      threshold: 10,
      status: 'Active',
      sales: 156,
      rating: 4.4,
      vendor: 'AudioTech'
    },
    {
      id: 8,
      image: '👖',
      name: 'Denim Jeans',
      sku: 'DJ-123',
      category: 'Clothing',
      price: 1299,
      stock: 0,
      threshold: 15,
      status: 'Out of Stock',
      sales: 73,
      rating: 4.1,
      vendor: 'Fashion Hub'
    }
  ]

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
    if (selectedProducts.length === products.length) {
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

  const totalPages = Math.ceil(products.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedProducts = sortedProducts.slice(startIndex, startIndex + itemsPerPage)

  return (
    <div className="products-table-container bg-white rounded-xl border border-gray-200 overflow-hidden">
      {/* Table Header with Title */}
      <div className="px-4 py-3 border-b border-gray-200 bg-gray-50/50 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Package size={18} className="text-gray-500" />
          <h3 className="font-semibold text-gray-900">Products Inventory</h3>
          <span className="px-2 py-0.5 bg-gray-200 text-gray-700 text-xs rounded-full">
            {products.length} items
          </span>
        </div>
        {selectedProducts.length > 0 && (
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">
              {selectedProducts.length} selected
            </span>
            <button className="p-1 text-gray-400 hover:text-gray-600">
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
                  checked={selectedProducts.length === products.length}
                  onChange={toggleSelectAll}
                  className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                />
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Image</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase cursor-pointer" onClick={() => handleSort('name')}>
                <div className="flex items-center gap-1">
                  Product Name
                  {sortConfig.key === 'name' && (
                    <span>{sortConfig.direction === 'asc' ? '↑' : '↓'}</span>
                  )}
                </div>
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">SKU</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase cursor-pointer" onClick={() => handleSort('price')}>
                <div className="flex items-center gap-1">
                  Price
                  {sortConfig.key === 'price' && (
                    <span>{sortConfig.direction === 'asc' ? '↑' : '↓'}</span>
                  )}
                </div>
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Stock</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase cursor-pointer" onClick={() => handleSort('sales')}>
                <div className="flex items-center gap-1">
                  Sales
                  {sortConfig.key === 'sales' && (
                    <span>{sortConfig.direction === 'asc' ? '↑' : '↓'}</span>
                  )}
                </div>
              </th>
              <th className="w-20 px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {paginatedProducts.map((product, index) => (
              <tr
                key={product.id}
                className={`products-table-row ${hoveredRow === product.id ? 'products-table-row-hover' : ''} ${
                  selectedProducts.includes(product.id) ? 'bg-primary-50/30' : ''
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
                  <div className="w-10 h-10 bg-gray-50 rounded-lg flex items-center justify-center text-xl">
                    {product.image}
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{product.name}</p>
                    <div className="flex items-center gap-1 mt-0.5">
                      <Star size={12} className="text-warning-400 fill-current" />
                      <span className="text-xs text-gray-600">{product.rating}</span>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <span className="text-sm text-gray-600">{product.sku}</span>
                </td>
                <td className="px-4 py-3">
                  <span className="text-sm text-gray-600">{product.category}</span>
                </td>
                <td className="px-4 py-3">
                  <span className="text-sm font-semibold text-gray-900">₹{product.price}</span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <span className={`text-sm ${product.stock === 0 ? 'text-error-600' : product.stock <= product.threshold ? 'text-warning-600' : 'text-gray-900'}`}>
                      {product.stock}
                    </span>
                    {product.stock <= product.threshold && (
                      <AlertCircle size={14} className="text-warning-500" />
                    )}
                  </div>
                </td>
                <td className="px-4 py-3">
                  <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${getStockStatusClass(product.stock, product.threshold)}`}>
                    {getStockText(product.stock, product.threshold)}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span className="text-sm font-medium text-gray-900">{product.sales}</span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1">
                    <button
                      className="p-1.5 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-all"
                      onClick={() => onEditProduct?.(product)}
                    >
                      <Eye size={16} />
                    </button>
                    <button
                      className="p-1.5 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-all"
                      onClick={() => onEditProduct?.(product)}
                    >
                      <Edit size={16} />
                    </button>
                    <button className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all">
                      <Copy size={16} />
                    </button>
                    <button className="p-1.5 text-gray-400 hover:text-error-600 hover:bg-error-50 rounded-lg transition-all">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="px-4 py-3 border-t border-gray-200 flex items-center justify-between">
        <p className="text-sm text-gray-600">
          Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, products.length)} of {products.length} products
        </p>
        <div className="flex items-center gap-2">
          <button
            className="p-1.5 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1}
          >
            <ChevronLeft size={16} />
          </button>
          {[...Array(totalPages)].map((_, i) => (
            <button
              key={i}
              className={`w-8 h-8 text-sm rounded-lg transition-all ${
                currentPage === i + 1
                  ? 'bg-primary-500 text-white'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
              onClick={() => setCurrentPage(i + 1)}
            >
              {i + 1}
            </button>
          ))}
          <button
            className="p-1.5 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </div>
  )
}