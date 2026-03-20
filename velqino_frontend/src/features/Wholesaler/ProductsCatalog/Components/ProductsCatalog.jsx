"use client"

import React, { useState } from 'react'
import { 
  Grid,
  List,
  Package,
  Search,
  Filter,
  Star,
  Eye,
  Edit,
  Trash2,
  Copy,
  MoreVertical,
  Plus,
  Download,
  Upload,
  X
} from '../../../../utils/icons'
import '../../../../styles/Wholesaler/ProductsCatalog/ProductsCatalog.scss'

export default function ProductsCatalog() {
  const [viewMode, setViewMode] = useState('grid') // 'grid' or 'list'
  const [selectedProducts, setSelectedProducts] = useState([])
  const [hoveredProduct, setHoveredProduct] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All Categories')
  const [showFilters, setShowFilters] = useState(false)

  const products = [
    {
      id: 1,
      name: 'Wireless Headphones',
      sku: 'WH-001',
      category: 'Electronics',
      price: 1250,
      stock: 45,
      threshold: 10,
      image: '🎧',
      rating: 4.5,
      reviews: 128,
      status: 'Active',
      vendor: 'Sony Corp',
      tags: ['Bestseller', 'New']
    },
    {
      id: 2,
      name: 'Cotton T-Shirt',
      sku: 'CT-045',
      category: 'Clothing',
      price: 450,
      stock: 120,
      threshold: 20,
      image: '👕',
      rating: 4.2,
      reviews: 89,
      status: 'Active',
      vendor: 'Fashion Hub',
      tags: ['Trending']
    },
    {
      id: 3,
      name: 'Ceramic Mug',
      sku: 'CM-112',
      category: 'Home Decor',
      price: 299,
      stock: 8,
      threshold: 15,
      image: '☕',
      rating: 4.8,
      reviews: 56,
      status: 'Low Stock',
      vendor: 'Home Essentials',
      tags: ['Eco-friendly']
    },
    {
      id: 4,
      name: 'Yoga Mat',
      sku: 'YM-078',
      category: 'Fitness',
      price: 899,
      stock: 34,
      threshold: 12,
      image: '🧘',
      rating: 4.6,
      reviews: 67,
      status: 'Active',
      vendor: 'FitLife',
      tags: ['Premium']
    },
    {
      id: 5,
      name: 'Desk Lamp',
      sku: 'DL-234',
      category: 'Home Decor',
      price: 1299,
      stock: 18,
      threshold: 8,
      image: '💡',
      rating: 4.3,
      reviews: 42,
      status: 'Active',
      vendor: 'Lighting Co',
      tags: ['Energy Saving']
    },
    {
      id: 6,
      name: 'Notebook Set',
      sku: 'NB-056',
      category: 'Stationery',
      price: 199,
      stock: 6,
      threshold: 25,
      image: '📓',
      rating: 4.7,
      reviews: 34,
      status: 'Low Stock',
      vendor: 'Paper World',
      tags: ['Back to School']
    },
    {
      id: 7,
      name: 'Bluetooth Speaker',
      sku: 'BS-089',
      category: 'Electronics',
      price: 2499,
      stock: 23,
      threshold: 10,
      image: '🔊',
      rating: 4.4,
      reviews: 156,
      status: 'Active',
      vendor: 'AudioTech',
      tags: ['Bestseller', 'Waterproof']
    },
    {
      id: 8,
      name: 'Denim Jeans',
      sku: 'DJ-123',
      category: 'Clothing',
      price: 1299,
      stock: 0,
      threshold: 15,
      image: '👖',
      rating: 4.1,
      reviews: 73,
      status: 'Out of Stock',
      vendor: 'Fashion Hub',
      tags: ['Premium']
    }
  ]

  const categories = ['All Categories', 'Electronics', 'Clothing', 'Home Decor', 'Fitness', 'Stationery']

  const toggleProductSelection = (productId) => {
    if (selectedProducts.includes(productId)) {
      setSelectedProducts(selectedProducts.filter(id => id !== productId))
    } else {
      setSelectedProducts([...selectedProducts, productId])
    }
  }

  const toggleSelectAll = () => {
    if (selectedProducts.length === products.length) {
      setSelectedProducts([])
    } else {
      setSelectedProducts(products.map(p => p.id))
    }
  }

  const getStockStatusClass = (stock, threshold) => {
    if (stock === 0) return 'bg-error-100 text-error-700'
    if (stock <= threshold) return 'bg-warning-100 text-warning-700'
    return 'bg-success-100 text-success-700'
  }

  const getStockText = (stock, threshold) => {
    if (stock === 0) return 'Out of Stock'
    if (stock <= threshold) return 'Low Stock'
    return 'In Stock'
  }

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
          <button className="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-all flex items-center gap-2">
            <Download size={16} />
            <span className="hidden sm:inline">Export</span>
          </button>
          <button className="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-all flex items-center gap-2">
            <Upload size={16} />
            <span className="hidden sm:inline">Import</span>
          </button>
          <button className="px-4 py-2 text-sm font-medium text-white bg-primary-500 rounded-lg hover:bg-primary-600 transition-all flex items-center gap-2">
            <Plus size={16} />
            <span>Add Product</span>
          </button>
        </div>
      </div>

      {/* Search and Filter Bar */}
      <div className="bg-white border border-gray-200 rounded-xl p-4 mb-6">
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search */}
          <div className="flex-1 relative">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search products by name, SKU, category..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
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

          {/* View Toggle */}
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
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
                >
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Stock Status</label>
                <select className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100">
                  <option>All</option>
                  <option>In Stock</option>
                  <option>Low Stock</option>
                  <option>Out of Stock</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Price Range</label>
                <div className="flex items-center gap-2">
                  <input type="number" placeholder="Min" className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-primary-500" />
                  <span>-</span>
                  <input type="number" placeholder="Max" className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-primary-500" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Vendor</label>
                <input type="text" placeholder="Search vendor" className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-primary-500" />
              </div>
            </div>
            <div className="flex items-center justify-end gap-2 mt-4">
              <button className="px-3 py-1.5 text-sm text-gray-600 hover:text-gray-900">Reset</button>
              <button className="px-4 py-1.5 text-sm bg-primary-500 text-white rounded-lg hover:bg-primary-600">Apply Filters</button>
            </div>
          </div>
        )}
      </div>

      {/* Selection Bar */}
      {selectedProducts.length > 0 && (
        <div className="bg-primary-50 border border-primary-200 rounded-lg p-3 mb-4 flex items-center justify-between">
          <span className="text-sm text-primary-700">
            <span className="font-semibold">{selectedProducts.length}</span> products selected
          </span>
          <div className="flex items-center gap-2">
            <button className="px-3 py-1.5 text-sm bg-white border border-primary-200 text-primary-700 rounded-lg hover:bg-primary-100 transition-all">
              Bulk Edit
            </button>
            <button className="px-3 py-1.5 text-sm bg-white border border-error-200 text-error-700 rounded-lg hover:bg-error-50 transition-all">
              Delete
            </button>
          </div>
        </div>
      )}

      {/* Products Grid/List View */}
      {viewMode === 'grid' ? (
        /* Grid View */
        <div className="products-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {products.map((product, index) => (
            <div
              key={product.id}
              className={`products-grid-card bg-white border rounded-xl p-4 transition-all ${
                selectedProducts.includes(product.id) ? 'border-primary-500 ring-2 ring-primary-100' : 'border-gray-200 hover:shadow-lg'
              }`}
              onMouseEnter={() => setHoveredProduct(product.id)}
              onMouseLeave={() => setHoveredProduct(null)}
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              {/* Checkbox */}
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

              {/* Product Image */}
              <div className="w-full h-32 bg-gray-50 rounded-lg flex items-center justify-center text-4xl mb-3">
                {product.image}
              </div>

              {/* Product Info */}
              <div className="mb-3">
                <h3 className="font-semibold text-gray-900 truncate">{product.name}</h3>
                <p className="text-xs text-gray-500">SKU: {product.sku}</p>
                <p className="text-xs text-gray-500 mt-1">{product.category}</p>
              </div>

              {/* Price & Stock */}
              <div className="flex items-center justify-between mb-3">
                <span className="text-lg font-bold text-gray-900">₹{product.price}</span>
                <span className={`text-xs px-2 py-1 rounded-full ${getStockStatusClass(product.stock, product.threshold)}`}>
                  {getStockText(product.stock, product.threshold)}
                </span>
              </div>

              {/* Rating */}
              <div className="flex items-center gap-1 mb-3">
                <Star size={14} className="text-warning-400 fill-current" />
                <span className="text-xs font-medium text-gray-700">{product.rating}</span>
                <span className="text-xs text-gray-500">({product.reviews})</span>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-1 mb-3">
                {product.tags.map(tag => (
                  <span key={tag} className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded-full">
                    {tag}
                  </span>
                ))}
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 mt-2 pt-2 border-t border-gray-100">
                <button className="flex-1 flex items-center justify-center gap-1 py-1.5 text-xs bg-primary-50 text-primary-700 rounded-lg hover:bg-primary-100 transition-all">
                  <Eye size={14} />
                  <span>View</span>
                </button>
                <button className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all">
                  <Edit size={14} />
                </button>
                <button className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all">
                  <Copy size={14} />
                </button>
              </div>

              {/* Hover Effect */}
              {hoveredProduct === product.id && (
                <div className={`absolute inset-0 rounded-xl opacity-10 blur-xl pointer-events-none ${
                  product.stock === 0 ? 'bg-error-500' : 
                  product.stock <= product.threshold ? 'bg-warning-500' : 'bg-primary-500'
                }`} />
              )}
            </div>
          ))}
        </div>
      ) : (
        /* List View */
        <div className="products-list bg-white border border-gray-200 rounded-xl overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="w-10 px-4 py-3">
                  <input 
                    type="checkbox"
                    checked={selectedProducts.length === products.length}
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
              {products.map((product, index) => (
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
                      <div className="w-10 h-10 bg-gray-50 rounded-lg flex items-center justify-center text-xl">
                        {product.image}
                      </div>
                      <span className="text-sm font-medium text-gray-900">{product.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700">{product.sku}</td>
                  <td className="px-4 py-3 text-sm text-gray-700">{product.category}</td>
                  <td className="px-4 py-3 text-sm font-semibold text-gray-900">₹{product.price}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-1 rounded-full ${getStockStatusClass(product.stock, product.threshold)}`}>
                      {product.stock} units
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      product.status === 'Active' ? 'bg-success-100 text-success-700' :
                      product.status === 'Low Stock' ? 'bg-warning-100 text-warning-700' :
                      'bg-error-100 text-error-700'
                    }`}>
                      {product.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <button className="p-1 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-all">
                      <MoreVertical size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      <div className="flex items-center justify-between mt-6">
        <p className="text-sm text-gray-600">Showing 1 to 8 of 24 products</p>
        <div className="flex items-center gap-2">
          <button className="px-3 py-1.5 text-sm border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50" disabled>
            Previous
          </button>
          <button className="px-3 py-1.5 text-sm bg-primary-500 text-white rounded-lg hover:bg-primary-600">1</button>
          <button className="px-3 py-1.5 text-sm border border-gray-200 rounded-lg hover:bg-gray-50">2</button>
          <button className="px-3 py-1.5 text-sm border border-gray-200 rounded-lg hover:bg-gray-50">3</button>
          <button className="px-3 py-1.5 text-sm border border-gray-200 rounded-lg hover:bg-gray-50">Next</button>
        </div>
      </div>
    </div>
  )
}