"use client"

import React, { useState, useEffect } from 'react'
import { Search, Scan, Filter, Grid, List, Star, Eye, Edit, Trash2, Copy, Package, AlertCircle, CheckCircle } from '../../../../utils/icons'
import '../../../../styles/Retailer/RetailerProducts/ProductsGrid.scss'

export default function ProductsGrid({ selectedProduct, setSelectedProduct, refreshTrigger }) {
  const [mounted, setMounted] = useState(false)
  const [viewMode, setViewMode] = useState('grid')
  const [searchQuery, setSearchQuery] = useState('')
  const [hoveredProduct, setHoveredProduct] = useState(null)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  const products = [
    { id: 1, name: 'Premium Cotton T-Shirt', sku: 'CT-001', price: 499, cost: 299, stock: 45, threshold: 20, status: 'active', image: '👕', barcode: '890123456789', supplier: 'Fashion Hub', location: 'A-12', margin: 40 },
    { id: 2, name: 'Wireless Headphones', sku: 'WH-002', price: 2499, cost: 1800, stock: 12, threshold: 25, status: 'low', image: '🎧', barcode: '890123456788', supplier: 'ElectroMart', location: 'B-05', margin: 28 },
    { id: 3, name: 'Smart Watch Pro', sku: 'SW-003', price: 4999, cost: 3500, stock: 8, threshold: 15, status: 'critical', image: '⌚', barcode: '890123456787', supplier: 'TechGadgets', location: 'C-08', margin: 30 },
    { id: 4, name: 'Leather Wallet', sku: 'LW-004', price: 1499, cost: 900, stock: 23, threshold: 20, status: 'active', image: '👛', barcode: '890123456786', supplier: 'LeatherCraft', location: 'D-03', margin: 40 },
    { id: 5, name: 'Running Shoes', sku: 'RS-005', price: 2999, cost: 2000, stock: 15, threshold: 12, status: 'active', image: '👟', barcode: '890123456785', supplier: 'SportFit', location: 'E-07', margin: 33 },
    { id: 6, name: 'Coffee Mug', sku: 'CM-006', price: 299, cost: 150, stock: 45, threshold: 30, status: 'active', image: '☕', barcode: '890123456784', supplier: 'HomeDecor', location: 'F-02', margin: 50 },
  ]

  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.barcode.includes(searchQuery)
  )

  const getStockStatusClass = (stock, threshold) => {
    if (stock === 0) return 'bg-red-100 text-red-700'
    if (stock <= threshold) return 'bg-orange-100 text-orange-700'
    return 'bg-green-100 text-green-700'
  }

  const getStockText = (stock, threshold) => {
    if (stock === 0) return 'Out of Stock'
    if (stock <= threshold) return 'Low Stock'
    return 'In Stock'
  }

  return (
    <div className="products-grid-container bg-white rounded-xl shadow-sm border border-gray-100">
      {/* Header */}
      <div className="p-4 border-b border-gray-100">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="flex items-center gap-2">
            <Package size={18} className="text-primary-500" />
            <h3 className="text-base font-semibold text-gray-900">Products Inventory</h3>
            <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
              {filteredProducts.length} items
            </span>
          </div>
          
          {/* Search and View Toggle */}
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
            <div className="flex bg-gray-100 rounded-lg p-0.5">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-md transition-all ${viewMode === 'grid' ? 'bg-white shadow-sm text-primary-600' : 'text-gray-500'}`}
              >
                <Grid size={14} />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-1.5 rounded-md transition-all ${viewMode === 'list' ? 'bg-white shadow-sm text-primary-600' : 'text-gray-500'}`}
              >
                <List size={14} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <div className="p-4">
        {viewMode === 'grid' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredProducts.map((product, index) => (
              <div
                key={product.id}
                className={`product-card border rounded-xl p-4 transition-all cursor-pointer ${
                  selectedProduct?.id === product.id ? 'border-primary-500 ring-2 ring-primary-100' : 'border-gray-200 hover:shadow-md'
                }`}
                onClick={() => setSelectedProduct(product)}
                onMouseEnter={() => setHoveredProduct(product.id)}
                onMouseLeave={() => setHoveredProduct(null)}
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                {/* Product Image */}
                <div className="w-full h-28 bg-gray-50 rounded-lg flex items-center justify-center text-4xl mb-3">
                  {product.image}
                </div>
                
                {/* Product Info */}
                <div className="mb-2">
                  <h4 className="text-sm font-semibold text-gray-900 truncate">{product.name}</h4>
                  <p className="text-xs text-gray-500">SKU: {product.sku}</p>
                </div>
                
                {/* Barcode */}
                <div className="flex items-center gap-1 mb-2 text-[10px] text-gray-400">
                  <Scan size={10} />
                  <span>{product.barcode.slice(-8)}</span>
                </div>
                
                {/* Price & Stock */}
                <div className="flex items-center justify-between mb-3">
                  <span className="text-lg font-bold text-gray-900">₹{product.price}</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${getStockStatusClass(product.stock, product.threshold)}`}>
                    {getStockText(product.stock, product.threshold)}
                  </span>
                </div>
                
                {/* Stock Level Bar */}
                <div className="w-full h-1 bg-gray-200 rounded-full overflow-hidden mb-3">
                  <div 
                    className={`h-full rounded-full transition-all duration-500 ${
                      product.stock === 0 ? 'bg-red-500' : 
                      product.stock <= product.threshold ? 'bg-orange-500' : 'bg-green-500'
                    }`}
                    style={{ width: `${Math.min((product.stock / product.threshold) * 100, 100)}%` }}
                  />
                </div>
                
                {/* Actions */}
                <div className="flex gap-2 pt-2 border-t border-gray-100">
                  <button className="flex-1 py-1.5 text-xs bg-gray-100 text-gray-700 rounded-lg hover:bg-primary-100 hover:text-primary-700 transition-all flex items-center justify-center gap-1">
                    <Eye size={12} />
                    <span>View</span>
                  </button>
                  <button className="p-1.5 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-all">
                    <Edit size={12} />
                  </button>
                  <button className="p-1.5 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-all">
                    <Copy size={12} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* List View */
          <div className="overflow-x-auto">
            <table className="w-full min-w-[600px]">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr className="text-left text-xs font-medium text-gray-500">
                  <th className="px-3 py-2">Product</th>
                  <th className="px-3 py-2">SKU</th>
                  <th className="px-3 py-2">Price</th>
                  <th className="px-3 py-2">Stock</th>
                  <th className="px-3 py-2">Status</th>
                  <th className="px-3 py-2"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredProducts.map((product) => (
                  <tr 
                    key={product.id} 
                    className="hover:bg-gray-50 cursor-pointer transition-all"
                    onClick={() => setSelectedProduct(product)}
                  >
                    <td className="px-3 py-2">
                      <div className="flex items-center gap-2">
                        <span className="text-xl">{product.image}</span>
                        <span className="text-sm font-medium text-gray-900">{product.name}</span>
                      </div>
                    </td>
                    <td className="px-3 py-2 text-xs text-gray-600">{product.sku}</td>
                    <td className="px-3 py-2 text-sm font-semibold text-gray-900">₹{product.price}</td>
                    <td className="px-3 py-2">
                      <span className="text-xs">{product.stock} units</span>
                    </td>
                    <td className="px-3 py-2">
                      <span className={`text-xs px-2 py-0.5 rounded-full ${getStockStatusClass(product.stock, product.threshold)}`}>
                        {getStockText(product.stock, product.threshold)}
                      </span>
                    </td>
                    <td className="px-3 py-2">
                      <button className="p-1 text-gray-400 hover:text-primary-600">
                        <Eye size={14} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}