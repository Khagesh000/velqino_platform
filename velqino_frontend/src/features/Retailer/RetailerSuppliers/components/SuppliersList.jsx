"use client"

import React, { useState, useEffect, useMemo } from 'react'
import { 
  Truck, Search, Plus, Filter, ChevronLeft, ChevronRight, Eye, Edit, Trash2, 
  Phone, Mail, Clock, Package, Star, CheckCircle, AlertCircle, Building, 
  ExternalLink, ArrowUpRight, X, Save, Shield
} from '../../../../utils/icons'

export default function SuppliersList({ selectedSupplier, setSelectedSupplier, refreshTrigger }) {
  const [mounted, setMounted] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [currentPage, setCurrentPage] = useState(1)
  const [showAddModal, setShowAddModal] = useState(false)
  const [suppliersData, setSuppliersData] = useState([
    { 
      id: 1, 
      name: 'Fashion Hub', 
      category: 'Apparel',
      contact: '+91 98765 43210', 
      email: 'orders@fashionhub.com', 
      products: ['T-Shirts', 'Jeans', 'Jackets'], 
      leadTime: '3-5 days', 
      minOrder: '₹5,000', 
      rating: 4.8, 
      totalOrders: 45, 
      onTime: '98%', 
      paymentTerms: 'Net 15',
      status: 'Active',
      location: 'Mumbai, MH'
    },
    { 
      id: 2, 
      name: 'ElectroMart', 
      category: 'Electronics',
      contact: '+91 87654 32109', 
      email: 'sales@electromart.com', 
      products: ['Headphones', 'Speakers', 'Chargers'], 
      leadTime: '5-7 days', 
      minOrder: '₹10,000', 
      rating: 4.6, 
      totalOrders: 32, 
      onTime: '95%', 
      paymentTerms: 'Net 30',
      status: 'Active',
      location: 'Bengaluru, KA'
    },
    { 
      id: 3, 
      name: 'TechGadgets', 
      category: 'Electronics',
      contact: '+91 76543 21098', 
      email: 'support@techgadgets.com', 
      products: ['Smart Watches', 'Power Banks'], 
      leadTime: '7-10 days', 
      minOrder: '₹15,000', 
      rating: 4.9, 
      totalOrders: 28, 
      onTime: '99%', 
      paymentTerms: 'Net 7',
      status: 'Active',
      location: 'Hyderabad, TS'
    },
    { 
      id: 4, 
      name: 'LeatherCraft', 
      category: 'Accessories',
      contact: '+91 65432 10987', 
      email: 'info@leathercraft.com', 
      products: ['Wallets', 'Belts', 'Bags'], 
      leadTime: '3-5 days', 
      minOrder: '₹3,000', 
      rating: 4.7, 
      totalOrders: 52, 
      onTime: '97%', 
      paymentTerms: 'Net 30',
      status: 'Active',
      location: 'Kanpur, UP'
    },
    { 
      id: 5, 
      name: 'SportFit', 
      category: 'Footwear',
      contact: '+91 54321 09876', 
      email: 'orders@sportfit.com', 
      products: ['Shoes', 'Track Suits'], 
      leadTime: '4-6 days', 
      minOrder: '₹8,000', 
      rating: 4.5, 
      totalOrders: 38, 
      onTime: '94%', 
      paymentTerms: 'Net 15',
      status: 'Active',
      location: 'Jalandhar, PB'
    },
  ])

  const [newSupplier, setNewSupplier] = useState({
    name: '',
    category: 'Apparel',
    contact: '',
    email: '',
    leadTime: '3-5 days',
    minOrder: '₹5,000',
    paymentTerms: 'Net 15',
    products: ''
  })

  const itemsPerPage = 4

  useEffect(() => {
    setMounted(true)
  }, [])

  // Auto-select first supplier if none selected
  useEffect(() => {
    if (mounted && !selectedSupplier && suppliersData.length > 0) {
      setSelectedSupplier(suppliersData[0])
    }
  }, [mounted, selectedSupplier, suppliersData, setSelectedSupplier])

  const categories = useMemo(() => {
    const cats = ['All', ...new Set(suppliersData.map(s => s.category))]
    return cats
  }, [suppliersData])

  const filteredSuppliers = useMemo(() => {
    return suppliersData.filter(supplier => {
      const matchesSearch = 
        supplier.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        supplier.contact.includes(searchQuery) ||
        supplier.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        supplier.products.some(p => p.toLowerCase().includes(searchQuery.toLowerCase()))
      
      const matchesCategory = selectedCategory === 'All' || supplier.category === selectedCategory
      return matchesSearch && matchesCategory
    })
  }, [suppliersData, searchQuery, selectedCategory])

  const totalPages = Math.ceil(filteredSuppliers.length / itemsPerPage) || 1
  const paginatedSuppliers = filteredSuppliers.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

  const handleAddSupplierSubmit = (e) => {
    e.preventDefault()
    if (!newSupplier.name.trim()) return

    const created = {
      id: Date.now(),
      name: newSupplier.name,
      category: newSupplier.category,
      contact: newSupplier.contact || '+91 99999 00000',
      email: newSupplier.email || 'vendor@example.com',
      products: newSupplier.products ? newSupplier.products.split(',').map(s => s.trim()) : ['General Goods'],
      leadTime: newSupplier.leadTime,
      minOrder: newSupplier.minOrder,
      rating: 5.0,
      totalOrders: 0,
      onTime: '100%',
      paymentTerms: newSupplier.paymentTerms,
      status: 'Active',
      location: 'Local Region'
    }

    setSuppliersData([created, ...suppliersData])
    setSelectedSupplier(created)
    setShowAddModal(false)
    setNewSupplier({
      name: '',
      category: 'Apparel',
      contact: '',
      email: '',
      leadTime: '3-5 days',
      minOrder: '₹5,000',
      paymentTerms: 'Net 15',
      products: ''
    })
  }

  if (!mounted) {
    return <div className="w-full h-96 bg-gray-100 rounded-2xl animate-pulse" />
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200/80 overflow-hidden flex flex-col h-full">
      {/* Top Header */}
      <div className="p-5 border-b border-gray-100 bg-gradient-to-r from-gray-50/80 via-white to-gray-50/40">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary-50 text-primary-600 flex items-center justify-center font-bold shadow-sm ring-1 ring-primary-100">
              <Truck size={20} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-gray-900 tracking-tight">Suppliers Directory</h3>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-primary-100 text-primary-800">
                  {suppliersData.length} Partners
                </span>
              </div>
              <p className="text-xs text-gray-500">Verified vendors & wholesale distributors</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowAddModal(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-primary-600 hover:bg-primary-700 active:scale-95 rounded-lg shadow-sm transition-all"
            >
              <Plus size={14} />
              Add Vendor
            </button>
          </div>
        </div>

        {/* Search & Category Filter Pills */}
        <div className="flex flex-col md:flex-row gap-2.5">
          <div className="relative flex-1">
            <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search vendor name, email, phone, or catalog product..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value)
                setCurrentPage(1)
              }}
              className="w-full pl-9 pr-3.5 py-2 text-xs text-gray-900 placeholder-gray-400 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all"
            />
          </div>

          {/* Category Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => {
                  setSelectedCategory(cat)
                  setCurrentPage(1)
                }}
                className={`px-2.5 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap transition-all ${
                  selectedCategory === cat
                    ? 'bg-primary-600 text-white shadow-sm'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-gray-900'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Suppliers Table Container */}
      <div className="overflow-x-auto flex-1">
        <table className="w-full min-w-[700px] border-collapse text-left">
          <thead>
            <tr className="bg-gray-50/75 border-b border-gray-200 text-[11px] font-semibold uppercase tracking-wider text-gray-500">
              <th className="px-5 py-3.5">Vendor Dossier</th>
              <th className="px-4 py-3.5">Contact Channel</th>
              <th className="px-4 py-3.5">Lead Time</th>
              <th className="px-4 py-3.5">Min Order</th>
              <th className="px-4 py-3.5">Reliability</th>
              <th className="px-4 py-3.5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 text-sm">
            {paginatedSuppliers.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-5 py-12 text-center">
                  <div className="max-w-xs mx-auto text-gray-400">
                    <Truck size={36} className="mx-auto mb-2 text-gray-300" />
                    <p className="text-sm font-semibold text-gray-700">No suppliers found</p>
                    <p className="text-xs text-gray-400 mt-1">Try adjusting your search query or category filter</p>
                  </div>
                </td>
              </tr>
            ) : (
              paginatedSuppliers.map((supplier) => {
                const isSelected = selectedSupplier?.id === supplier.id
                return (
                  <tr
                    key={supplier.id}
                    onClick={() => setSelectedSupplier(supplier)}
                    className={`group cursor-pointer transition-colors ${
                      isSelected 
                        ? 'bg-primary-50/70 border-l-4 border-l-primary-600' 
                        : 'hover:bg-gray-50/80 border-l-4 border-l-transparent'
                    }`}
                  >
                    {/* Vendor Dossier */}
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm transition-all ${
                          isSelected
                            ? 'bg-primary-600 text-white shadow-sm ring-2 ring-primary-300'
                            : 'bg-gray-100 text-gray-700 group-hover:bg-primary-100 group-hover:text-primary-700'
                        }`}>
                          {supplier.name.charAt(0)}
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="font-bold text-gray-900 group-hover:text-primary-600 transition-colors">
                              {supplier.name}
                            </span>
                            <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                              {supplier.category}
                            </span>
                          </div>
                          <div className="text-xs text-gray-500 mt-0.5 truncate max-w-[200px]">
                            {supplier.products.slice(0, 3).join(', ')}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Contact Channel */}
                    <td className="px-4 py-3.5">
                      <div className="space-y-1">
                        <div className="flex items-center gap-1.5 text-xs text-gray-700 font-medium">
                          <Phone size={12} className="text-gray-400" />
                          <span>{supplier.contact}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-xs text-gray-500">
                          <Mail size={12} className="text-gray-400" />
                          <span className="truncate max-w-[150px]">{supplier.email}</span>
                        </div>
                      </div>
                    </td>

                    {/* Lead Time */}
                    <td className="px-4 py-3.5">
                      <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold bg-gray-100 text-gray-700 border border-gray-200/70">
                        <Clock size={11} className="text-gray-500" />
                        <span>{supplier.leadTime}</span>
                      </div>
                    </td>

                    {/* Min Order */}
                    <td className="px-4 py-3.5">
                      <span className="font-semibold text-gray-900 text-xs">
                        {supplier.minOrder}
                      </span>
                      <p className="text-[10px] text-gray-400">{supplier.paymentTerms}</p>
                    </td>

                    {/* Reliability */}
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-1">
                        <Star size={12} className="text-amber-400 fill-amber-400" />
                        <span className="text-xs font-bold text-gray-900">{supplier.rating}</span>
                        <span className="text-[10px] text-gray-400 font-normal">({supplier.totalOrders})</span>
                      </div>
                      <div className="text-[10px] font-medium text-emerald-600 mt-0.5">
                        {supplier.onTime} on-time
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="px-4 py-3.5 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            setSelectedSupplier(supplier)
                          }}
                          className={`p-1.5 rounded-lg text-xs font-medium transition-all ${
                            isSelected
                              ? 'bg-primary-600 text-white'
                              : 'text-gray-400 hover:text-primary-600 hover:bg-primary-50'
                          }`}
                          title="View Details"
                        >
                          <Eye size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="p-4 border-t border-gray-100 bg-gray-50/50 flex flex-col sm:flex-row items-center justify-between gap-2">
        <p className="text-xs text-gray-500">
          Showing <span className="font-semibold text-gray-700">{paginatedSuppliers.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0}</span> to{' '}
          <span className="font-semibold text-gray-700">{Math.min(currentPage * itemsPerPage, filteredSuppliers.length)}</span> of{' '}
          <span className="font-semibold text-gray-700">{filteredSuppliers.length}</span> vendors
        </p>

        <div className="flex items-center gap-1">
          <button
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="p-1.5 rounded-lg border border-gray-200 text-gray-500 hover:bg-white disabled:opacity-40 disabled:cursor-not-allowed transition-all"
          >
            <ChevronLeft size={14} />
          </button>
          
          <div className="px-2.5 py-1 text-xs font-medium text-gray-700">
            Page {currentPage} of {totalPages}
          </div>

          <button
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="p-1.5 rounded-lg border border-gray-200 text-gray-500 hover:bg-white disabled:opacity-40 disabled:cursor-not-allowed transition-all"
          >
            <ChevronRight size={14} />
          </button>
        </div>
      </div>

      {/* Add Supplier Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-gray-200 overflow-hidden">
            <div className="p-5 border-b border-gray-100 flex items-center justify-between bg-gradient-to-r from-gray-50 to-white">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-primary-100 text-primary-700 flex items-center justify-center">
                  <Building size={16} />
                </div>
                <h3 className="text-base font-bold text-gray-900">Add New Partner Vendor</h3>
              </div>
              <button 
                onClick={() => setShowAddModal(false)}
                className="p-1.5 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-all"
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleAddSupplierSubmit} className="p-5 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Company / Vendor Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Apex Textiles Ltd"
                    value={newSupplier.name}
                    onChange={(e) => setNewSupplier({ ...newSupplier, name: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Primary Category</label>
                  <select
                    value={newSupplier.category}
                    onChange={(e) => setNewSupplier({ ...newSupplier, category: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
                  >
                    <option value="Apparel">Apparel</option>
                    <option value="Electronics">Electronics</option>
                    <option value="Accessories">Accessories</option>
                    <option value="Footwear">Footwear</option>
                    <option value="Grocery">Grocery</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Contact Phone</label>
                  <input
                    type="text"
                    placeholder="+91 98765 43210"
                    value={newSupplier.contact}
                    onChange={(e) => setNewSupplier({ ...newSupplier, contact: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Official Email</label>
                  <input
                    type="email"
                    placeholder="contact@apextextiles.com"
                    value={newSupplier.email}
                    onChange={(e) => setNewSupplier({ ...newSupplier, email: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Lead Time</label>
                  <input
                    type="text"
                    placeholder="e.g. 3-5 days"
                    value={newSupplier.leadTime}
                    onChange={(e) => setNewSupplier({ ...newSupplier, leadTime: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Minimum Order</label>
                  <input
                    type="text"
                    placeholder="e.g. ₹5,000"
                    value={newSupplier.minOrder}
                    onChange={(e) => setNewSupplier({ ...newSupplier, minOrder: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Products Supplied (comma separated)</label>
                  <input
                    type="text"
                    placeholder="Shirts, Trousers, Fabrics"
                    value={newSupplier.products}
                    onChange={(e) => setNewSupplier({ ...newSupplier, products: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-gray-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-100 rounded-xl transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold text-white bg-primary-600 hover:bg-primary-700 active:scale-95 rounded-xl shadow-sm transition-all"
                >
                  Save Partner
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
