"use client"

import React, { useState } from 'react'
import {
  Mail,
  Phone,
  MapPin,
  User,
  Star,
  MoreVertical,
  Eye,
  Edit,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Users,
  Award,
  Clock
} from '../../../../utils/icons'
import '../../../../styles/Wholesaler/Customers/CustomersTable.scss'

export default function CustomersTable({ onSelectCustomer, filters }) {
  const [selectedCustomers, setSelectedCustomers] = useState([])
  const [hoveredRow, setHoveredRow] = useState(null)
  const [sortConfig, setSortConfig] = useState({ key: 'name', direction: 'asc' })
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  const customers = [
    {
      id: 1,
      name: 'Rajesh Kumar',
      email: 'rajesh.k@example.com',
      phone: '+91 98765 43210',
      location: 'Mumbai, Maharashtra',
      type: 'Wholesaler',
      orders: 45,
      spent: 1250000,
      lastOrder: '2024-03-15',
      status: 'Active',
      avatar: 'RK',
      loyaltyTier: 'Gold',
      company: 'Kumar Enterprises'
    },
    {
      id: 2,
      name: 'Priya Sharma',
      email: 'priya.s@example.com',
      phone: '+91 87654 32109',
      location: 'Delhi, NCR',
      type: 'Retailer',
      orders: 28,
      spent: 450000,
      lastOrder: '2024-03-14',
      status: 'Active',
      avatar: 'PS',
      loyaltyTier: 'Silver',
      company: 'Sharma Stores'
    },
    {
      id: 3,
      name: 'Amit Patel',
      email: 'amit.p@example.com',
      phone: '+91 76543 21098',
      location: 'Ahmedabad, Gujarat',
      type: 'Distributor',
      orders: 67,
      spent: 2100000,
      lastOrder: '2024-03-13',
      status: 'Active',
      avatar: 'AP',
      loyaltyTier: 'Platinum',
      company: 'Patel Group'
    },
    {
      id: 4,
      name: 'Neha Singh',
      email: 'neha.s@example.com',
      phone: '+91 65432 10987',
      location: 'Bangalore, Karnataka',
      type: 'Retailer',
      orders: 15,
      spent: 180000,
      lastOrder: '2024-03-10',
      status: 'Inactive',
      avatar: 'NS',
      loyaltyTier: 'Bronze',
      company: 'Singh Boutique'
    },
    {
      id: 5,
      name: 'Vikram Mehta',
      email: 'vikram.m@example.com',
      phone: '+91 54321 09876',
      location: 'Pune, Maharashtra',
      type: 'Wholesaler',
      orders: 52,
      spent: 980000,
      lastOrder: '2024-03-12',
      status: 'Active',
      avatar: 'VM',
      loyaltyTier: 'Gold',
      company: 'Mehta Trading'
    },
    {
      id: 6,
      name: 'Anjali Desai',
      email: 'anjali.d@example.com',
      phone: '+91 43210 98765',
      location: 'Surat, Gujarat',
      type: 'Retailer',
      orders: 23,
      spent: 320000,
      lastOrder: '2024-03-09',
      status: 'Active',
      avatar: 'AD',
      loyaltyTier: 'Silver',
      company: 'Desai Collection'
    },
    {
      id: 7,
      name: 'Suresh Reddy',
      email: 'suresh.r@example.com',
      phone: '+91 32109 87654',
      location: 'Hyderabad, Telangana',
      type: 'Distributor',
      orders: 89,
      spent: 3450000,
      lastOrder: '2024-03-14',
      status: 'Active',
      avatar: 'SR',
      loyaltyTier: 'Platinum',
      company: 'Reddy Distributors'
    },
    {
      id: 8,
      name: 'Kavita Jain',
      email: 'kavita.j@example.com',
      phone: '+91 21098 76543',
      location: 'Jaipur, Rajasthan',
      type: 'Retailer',
      orders: 12,
      spent: 145000,
      lastOrder: '2024-03-05',
      status: 'Inactive',
      avatar: 'KJ',
      loyaltyTier: 'Bronze',
      company: 'Jain Emporium'
    }
  ]

  const toggleCustomerSelection = (customerId) => {
    if (selectedCustomers.includes(customerId)) {
      setSelectedCustomers(selectedCustomers.filter(id => id !== customerId))
    } else {
      setSelectedCustomers([...selectedCustomers, customerId])
    }
  }

  const toggleSelectAll = () => {
    if (selectedCustomers.length === customers.length) {
      setSelectedCustomers([])
    } else {
      setSelectedCustomers(customers.map(c => c.id))
    }
  }

  const handleSort = (key) => {
    setSortConfig({
      key,
      direction: sortConfig.key === key && sortConfig.direction === 'asc' ? 'desc' : 'asc'
    })
  }

  const getStatusBadge = (status) => {
    return status === 'Active' 
      ? 'bg-success-100 text-success-700' 
      : 'bg-gray-100 text-gray-700'
  }

  const getLoyaltyBadge = (tier) => {
    const tiers = {
      Platinum: 'bg-purple-100 text-purple-700',
      Gold: 'bg-warning-100 text-warning-700',
      Silver: 'bg-gray-100 text-gray-700',
      Bronze: 'bg-orange-100 text-orange-700'
    }
    return tiers[tier] || 'bg-gray-100 text-gray-700'
  }

  const getTypeBadge = (type) => {
    const types = {
      Wholesaler: 'bg-primary-100 text-primary-700',
      Retailer: 'bg-info-100 text-info-700',
      Distributor: 'bg-success-100 text-success-700'
    }
    return types[type] || 'bg-gray-100 text-gray-700'
  }

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value)
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  }

  const sortedCustomers = [...customers].sort((a, b) => {
    if (sortConfig.direction === 'asc') {
      return a[sortConfig.key] > b[sortConfig.key] ? 1 : -1
    }
    return a[sortConfig.key] < b[sortConfig.key] ? 1 : -1
  })

  const totalPages = Math.ceil(customers.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedCustomers = sortedCustomers.slice(startIndex, startIndex + itemsPerPage)

  return (
    <div className="customers-table-container bg-white rounded-xl border border-gray-200 overflow-hidden">
      {/* Table Header */}
      <div className="px-4 py-3 border-b border-gray-200 bg-gray-50/50 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Users size={18} className="text-gray-500" />
          <h3 className="font-semibold text-gray-900">Customer List</h3>
          <span className="px-2 py-0.5 bg-gray-200 text-gray-700 text-xs rounded-full">
            {customers.length} customers
          </span>
        </div>
        {selectedCustomers.length > 0 && (
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">
              {selectedCustomers.length} selected
            </span>
            <button className="p-1 text-gray-400 hover:text-error-600">
              <Trash2 size={16} />
            </button>
          </div>
        )}
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <div className="min-w-[1200px] lg:min-w-0">
          <table className="customers-table w-full">
            <thead>
              <tr>
                <th className="w-10 px-4 py-3">
                  <input
                    type="checkbox"
                    checked={selectedCustomers.length === customers.length}
                    onChange={toggleSelectAll}
                    className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  />
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase cursor-pointer" onClick={() => handleSort('name')}>
                  <div className="flex items-center gap-1">
                    Customer
                    {sortConfig.key === 'name' && (
                      <span>{sortConfig.direction === 'asc' ? '↑' : '↓'}</span>
                    )}
                  </div>
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Contact</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Location</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase cursor-pointer" onClick={() => handleSort('type')}>
                  <div className="flex items-center gap-1">
                    Type
                    {sortConfig.key === 'type' && (
                      <span>{sortConfig.direction === 'asc' ? '↑' : '↓'}</span>
                    )}
                  </div>
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase cursor-pointer" onClick={() => handleSort('orders')}>
                  <div className="flex items-center gap-1">
                    Orders
                    {sortConfig.key === 'orders' && (
                      <span>{sortConfig.direction === 'asc' ? '↑' : '↓'}</span>
                    )}
                  </div>
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase cursor-pointer" onClick={() => handleSort('spent')}>
                  <div className="flex items-center gap-1">
                    Total Spent
                    {sortConfig.key === 'spent' && (
                      <span>{sortConfig.direction === 'asc' ? '↑' : '↓'}</span>
                    )}
                  </div>
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Last Order</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Loyalty</th>
                <th className="w-20 px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {paginatedCustomers.map((customer, index) => (
                <tr
                  key={customer.id}
                  className={`customers-table-row ${hoveredRow === customer.id ? 'customers-table-row-hover' : ''} ${
                    selectedCustomers.includes(customer.id) ? 'bg-primary-50/30' : ''
                  }`}
                  onMouseEnter={() => setHoveredRow(customer.id)}
                  onMouseLeave={() => setHoveredRow(null)}
                  style={{ animationDelay: `${index * 0.03}s` }}
                >
                  <td className="px-4 py-3">
                    <input
                      type="checkbox"
                      checked={selectedCustomers.includes(customer.id)}
                      onChange={() => toggleCustomerSelection(customer.id)}
                      className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                    />
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-medium text-sm">
                        {customer.avatar}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{customer.name}</p>
                        <p className="text-xs text-gray-500">{customer.company}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-1 text-xs text-gray-600">
                        <Mail size={12} className="text-gray-400" />
                        <span>{customer.email}</span>
                      </div>
                      <div className="flex items-center gap-1 text-xs text-gray-600">
                        <Phone size={12} className="text-gray-400" />
                        <span>{customer.phone}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1 text-sm text-gray-700">
                      <MapPin size={14} className="text-gray-400" />
                      <span className="text-xs">{customer.location}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${getTypeBadge(customer.type)}`}>
                      {customer.type}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm font-medium text-gray-900">
                    {customer.orders}
                  </td>
                  <td className="px-4 py-3 text-sm font-semibold text-gray-900">
                    {formatCurrency(customer.spent)}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1 text-xs text-gray-600">
                      <Clock size={12} className="text-gray-400" />
                      <span>{formatDate(customer.lastOrder)}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${getStatusBadge(customer.status)}`}>
                      {customer.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <Award size={14} className="text-warning-500" />
                      <span className={`text-xs font-medium ${getLoyaltyBadge(customer.loyaltyTier).replace('bg-', 'text-').replace('100', '700')}`}>
                        {customer.loyaltyTier}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <button
                        className="p-1.5 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-all"
                        onClick={() => onSelectCustomer(customer)}
                      >
                        <Eye size={16} />
                      </button>
                      <button className="p-1.5 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-all">
                        <Edit size={16} />
                      </button>
                      <button className="p-1.5 text-gray-400 hover:text-error-600 hover:bg-error-50 rounded-lg transition-all">
                        <Trash2 size={16} />
                      </button>
                      <button className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all">
                        <MoreVertical size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      <div className="px-4 py-3 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-sm text-gray-600 order-2 sm:order-1">
          Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, customers.length)} of {customers.length} customers
        </p>
        <div className="flex items-center gap-2 order-1 sm:order-2">
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