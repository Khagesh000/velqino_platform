"use client"

import React, { useState, useEffect } from 'react'
import { Truck, Search, Plus, Filter, ChevronLeft, ChevronRight, Eye, Edit, Trash2, Phone, Mail, Clock, Package, Star } from '../../../../utils/icons'
import '../../../../styles/Retailer/RetailerSuppliers/SuppliersList.scss'

export default function SuppliersList({ selectedSupplier, setSelectedSupplier, refreshTrigger }) {
  const [mounted, setMounted] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [hoveredRow, setHoveredRow] = useState(null)
  const itemsPerPage = 4

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  const suppliers = [
    { id: 1, name: 'Fashion Hub', contact: '+91 98765 43210', email: 'orders@fashionhub.com', products: ['T-Shirts', 'Jeans', 'Jackets'], leadTime: '3-5 days', minOrder: '₹5,000', rating: 4.8, totalOrders: 45, onTime: '98%', paymentTerms: 'Net 15' },
    { id: 2, name: 'ElectroMart', contact: '+91 87654 32109', email: 'sales@electromart.com', products: ['Headphones', 'Speakers', 'Chargers'], leadTime: '5-7 days', minOrder: '₹10,000', rating: 4.6, totalOrders: 32, onTime: '95%', paymentTerms: 'Net 30' },
    { id: 3, name: 'TechGadgets', contact: '+91 76543 21098', email: 'support@techgadgets.com', products: ['Smart Watches', 'Power Banks'], leadTime: '7-10 days', minOrder: '₹15,000', rating: 4.9, totalOrders: 28, onTime: '99%', paymentTerms: 'Net 7' },
    { id: 4, name: 'LeatherCraft', contact: '+91 65432 10987', email: 'info@leathercraft.com', products: ['Wallets', 'Belts', 'Bags'], leadTime: '3-5 days', minOrder: '₹3,000', rating: 4.7, totalOrders: 52, onTime: '97%', paymentTerms: 'Net 30' },
    { id: 5, name: 'SportFit', contact: '+91 54321 09876', email: 'orders@sportfit.com', products: ['Shoes', 'Track Suits'], leadTime: '4-6 days', minOrder: '₹8,000', rating: 4.5, totalOrders: 38, onTime: '94%', paymentTerms: 'Net 15' },
  ]

  const filteredSuppliers = suppliers.filter(supplier =>
    supplier.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    supplier.contact.includes(searchQuery) ||
    supplier.email.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const totalPages = Math.ceil(filteredSuppliers.length / itemsPerPage)
  const paginatedSuppliers = filteredSuppliers.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

  const renderStars = (rating) => {
    return (
      <div className="flex items-center gap-0.5">
        {[1,2,3,4,5].map((star) => (
          <Star key={star} size={10} className={star <= rating ? 'text-yellow-400 fill-current' : 'text-gray-300'} />
        ))}
      </div>
    )
  }

  return (
    <div className="suppliers-list bg-white rounded-xl shadow-sm border border-gray-100 h-full">
      {/* Header */}
      <div className="p-4 border-b border-gray-100">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Truck size={18} className="text-primary-500" />
            <h3 className="text-base font-semibold text-gray-900">Suppliers List</h3>
            <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
              {filteredSuppliers.length} suppliers
            </span>
          </div>
          <button className="p-1.5 text-gray-400 hover:text-primary-600 rounded-lg transition-all">
            <Plus size={14} />
          </button>
        </div>

        {/* Search */}
        <div className="relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search suppliers..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-primary-500"
          />
        </div>
      </div>

      {/* Suppliers Table */}
      <div className="overflow-x-auto">
        <table className="w-full min-w-[800px]">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr className="text-left text-xs font-medium text-gray-500">
              <th className="px-4 py-3">Supplier</th>
              <th className="px-4 py-3">Contact</th>
              <th className="px-4 py-3">Lead Time</th>
              <th className="px-4 py-3">Min Order</th>
              <th className="px-4 py-3">Rating</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {paginatedSuppliers.map((supplier, index) => (
              <tr
                key={supplier.id}
                className={`supplier-row cursor-pointer transition-all ${selectedSupplier?.id === supplier.id ? 'bg-primary-50' : 'hover:bg-gray-50'}`}
                onClick={() => setSelectedSupplier(supplier)}
                onMouseEnter={() => setHoveredRow(supplier.id)}
                onMouseLeave={() => setHoveredRow(null)}
                style={{ animationDelay: `${index * 0.03}s` }}
              >
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-primary-100 flex items-center justify-center">
                      <Truck size={16} className="text-primary-600" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900">{supplier.name}</p>
                      <p className="text-xs text-gray-500">{supplier.products.slice(0, 2).join(', ')}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-1 text-xs text-gray-600">
                      <Phone size={10} className="text-gray-400" />
                      <span>{supplier.contact}</span>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-gray-500">
                      <Mail size={10} className="text-gray-400" />
                      <span className="truncate max-w-[150px]">{supplier.email}</span>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1">
                    <Clock size={10} className="text-gray-400" />
                    <span className="text-sm text-gray-700">{supplier.leadTime}</span>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <span className="text-sm font-semibold text-gray-900">{supplier.minOrder}</span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex flex-col gap-0.5">
                    {renderStars(supplier.rating)}
                    <span className="text-[10px] text-gray-500">{supplier.totalOrders} orders</span>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <button className="p-1 text-gray-400 hover:text-primary-600 rounded-lg transition-all">
                    <Eye size={14} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="px-4 py-3 border-t border-gray-100 flex items-center justify-between">
          <p className="text-[10px] text-gray-500">
            Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, filteredSuppliers.length)} of {filteredSuppliers.length} suppliers
          </p>
          <div className="flex gap-1">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-50 rounded"
            >
              <ChevronLeft size={12} />
            </button>
            <span className="text-xs text-gray-600">{currentPage} / {totalPages}</span>
            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-50 rounded"
            >
              <ChevronRight size={12} />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}