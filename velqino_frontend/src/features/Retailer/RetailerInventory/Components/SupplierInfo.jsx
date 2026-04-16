"use client"

import React, { useState, useEffect } from 'react'
import { Truck, Phone, Mail, MapPin, Clock, Package, Star, Edit, Trash2, Plus, Search, ChevronLeft, ChevronRight, Eye } from '../../../../utils/icons'
import '../../../../styles/Retailer/RetailerInventory/SupplierInfo.scss'

export default function SupplierInfo() {
  const [mounted, setMounted] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedSupplier, setSelectedSupplier] = useState(null)
  const [hoveredSupplier, setHoveredSupplier] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 3

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  const suppliers = [
    { 
      id: 1, 
      name: 'Fashion Hub', 
      contact: '+91 98765 43210', 
      email: 'orders@fashionhub.com',
      address: '123, MG Road, Bangalore',
      leadTime: '3-5 days',
      minOrder: '₹5,000',
      products: ['Premium Cotton T-Shirt', 'Leather Wallet'],
      rating: 4.8,
      totalOrders: 45,
      onTimeDelivery: '98%',
      paymentTerms: 'Net 15',
      categories: ['Clothing', 'Accessories']
    },
    { 
      id: 2, 
      name: 'ElectroMart', 
      contact: '+91 87654 32109', 
      email: 'sales@electromart.com',
      address: '456, Brigade Road, Bangalore',
      leadTime: '5-7 days',
      minOrder: '₹10,000',
      products: ['Wireless Headphones', 'Smart Watch Pro'],
      rating: 4.6,
      totalOrders: 32,
      onTimeDelivery: '95%',
      paymentTerms: 'Net 30',
      categories: ['Electronics', 'Accessories']
    },
    { 
      id: 3, 
      name: 'TechGadgets', 
      contact: '+91 76543 21098', 
      email: 'support@techgadgets.com',
      address: '789, Church Street, Bangalore',
      leadTime: '7-10 days',
      minOrder: '₹15,000',
      products: ['Smart Watch Pro', 'Wireless Headphones'],
      rating: 4.9,
      totalOrders: 28,
      onTimeDelivery: '99%',
      paymentTerms: 'Net 7',
      categories: ['Electronics']
    },
    { 
      id: 4, 
      name: 'LeatherCraft', 
      contact: '+91 65432 10987', 
      email: 'info@leathercraft.com',
      address: '321, Commercial Street, Bangalore',
      leadTime: '3-5 days',
      minOrder: '₹3,000',
      products: ['Leather Wallet', 'Belt'],
      rating: 4.7,
      totalOrders: 52,
      onTimeDelivery: '97%',
      paymentTerms: 'Net 30',
      categories: ['Accessories']
    },
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
          <Star 
            key={star} 
            size={10} 
            className={star <= rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}
          />
        ))}
      </div>
    )
  }

  return (
    <div className="supplier-info bg-white rounded-xl shadow-sm border border-gray-100 h-full">
      {/* Header */}
      <div className="p-4 border-b border-gray-100">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Truck size={18} className="text-primary-500" />
            <h3 className="text-base font-semibold text-gray-900">Supplier Information</h3>
          </div>
          <button className="p-1.5 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-all">
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

      {/* Suppliers List */}
      <div className="p-4 max-h-[350px] overflow-y-auto custom-scroll">
        <div className="space-y-3">
          {paginatedSuppliers.length === 0 ? (
            <div className="text-center py-8">
              <Truck size={32} className="mx-auto text-gray-300 mb-2" />
              <p className="text-sm text-gray-500">No suppliers found</p>
            </div>
          ) : (
            paginatedSuppliers.map((supplier, index) => (
              <div
                key={supplier.id}
                className={`supplier-card border rounded-lg p-3 transition-all cursor-pointer ${
                  selectedSupplier?.id === supplier.id ? 'border-primary-500 bg-primary-50' : 'border-gray-200 hover:shadow-md'
                }`}
                onClick={() => setSelectedSupplier(supplier)}
                onMouseEnter={() => setHoveredSupplier(supplier.id)}
                onMouseLeave={() => setHoveredSupplier(null)}
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-primary-100 flex items-center justify-center">
                      <Truck size={18} className="text-primary-600" />
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-gray-900">{supplier.name}</h4>
                      <div className="flex items-center gap-2 mt-0.5">
                        {renderStars(supplier.rating)}
                        <span className="text-[10px] text-gray-500">({supplier.totalOrders} orders)</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <button className="p-1 text-gray-400 hover:text-primary-600 rounded-lg transition-all">
                      <Edit size={12} />
                    </button>
                    <button className="p-1 text-gray-400 hover:text-red-600 rounded-lg transition-all">
                      <Trash2 size={12} />
                    </button>
                  </div>
                </div>

                {/* Contact Info */}
                <div className="space-y-1 text-xs text-gray-600">
                  <div className="flex items-center gap-2">
                    <Phone size={10} className="text-gray-400" />
                    <span>{supplier.contact}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail size={10} className="text-gray-400" />
                    <span className="truncate">{supplier.email}</span>
                  </div>
                </div>

                {/* Supplier Metrics */}
                <div className="mt-2 pt-2 border-t border-gray-100 grid grid-cols-3 gap-2 text-[10px]">
                  <div>
                    <p className="text-gray-500">Lead Time</p>
                    <p className="font-medium text-gray-700">{supplier.leadTime}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Min Order</p>
                    <p className="font-medium text-gray-700">{supplier.minOrder}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">On-Time</p>
                    <p className="font-medium text-green-600">{supplier.onTimeDelivery}</p>
                  </div>
                </div>

                {/* Products */}
                <div className="mt-2 flex flex-wrap gap-1">
                  {supplier.products.slice(0, 2).map(product => (
                    <span key={product} className="text-[9px] bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded-full">
                      {product}
                    </span>
                  ))}
                  {supplier.products.length > 2 && (
                    <span className="text-[9px] text-gray-400">+{supplier.products.length - 2}</span>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="px-4 py-3 border-t border-gray-100 flex items-center justify-between">
          <p className="text-[10px] text-gray-500">
            {filteredSuppliers.length} suppliers
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

      {/* Selected Supplier Details */}
      {selectedSupplier && (
        <div className="border-t border-gray-100 p-4 bg-gray-50 rounded-b-xl">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-xs font-semibold text-gray-700">Supplier Details</h4>
            <button className="text-[10px] text-primary-600">View All</button>
          </div>
          <div className="space-y-1 text-xs">
            <div className="flex items-center gap-2">
              <MapPin size={10} className="text-gray-400" />
              <span className="text-gray-600">{selectedSupplier.address}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock size={10} className="text-gray-400" />
              <span className="text-gray-600">Payment: {selectedSupplier.paymentTerms}</span>
            </div>
            <div className="flex items-center gap-2">
              <Package size={10} className="text-gray-400" />
              <span className="text-gray-600">Categories: {selectedSupplier.categories.join(', ')}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}