"use client"

import React, { useState, useRef } from 'react'
import {
  FileText,
  Download,
  Mail,
  Printer,
  Search,
  ChevronDown,
  Calendar,
  Eye,
  CheckCircle,
  X,
  RefreshCw,
  Building,
  User,
  MapPin,
  Phone,
  CreditCard
} from '../../../../utils/icons'
import '../../../../styles/Wholesaler/PaymentsPayouts/InvoiceGenerator.scss'

export default function InvoiceGenerator() {
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [generating, setGenerating] = useState(false)
  const [generated, setGenerated] = useState(false)
  const [showPreview, setShowPreview] = useState(false)
  const [invoiceNumber, setInvoiceNumber] = useState('INV-2024-001')
  const [invoiceDate, setInvoiceDate] = useState(new Date().toISOString().split('T')[0])
  const [dueDate, setDueDate] = useState(() => {
    const date = new Date()
    date.setDate(date.getDate() + 15)
    return date.toISOString().split('T')[0]
  })
  const [notes, setNotes] = useState('Thank you for your business!')

  const orders = [
    {
      id: '#ORD-2024-001',
      customer: 'Rajesh Kumar',
      date: '2024-03-15',
      amount: 124750,
      items: [
        { name: 'Wireless Headphones', quantity: 50, price: 1250, total: 62500 },
        { name: 'Bluetooth Speaker', quantity: 25, price: 2499, total: 62475 }
      ],
      status: 'Delivered',
      address: {
        name: 'Rajesh Kumar',
        company: 'Kumar Enterprises',
        address: '123, MG Road, Bangalore - 560001',
        phone: '+91 98765 43210',
        email: 'rajesh@example.com'
      }
    },
    {
      id: '#ORD-2024-002',
      customer: 'Priya Sharma',
      date: '2024-03-14',
      amount: 45000,
      items: [
        { name: 'Cotton T-Shirt', quantity: 100, price: 450, total: 45000 }
      ],
      status: 'Delivered',
      address: {
        name: 'Priya Sharma',
        company: 'Sharma Stores',
        address: '456, Brigade Road, Bangalore - 560001',
        phone: '+91 87654 32109',
        email: 'priya@example.com'
      }
    },
    {
      id: '#ORD-2024-003',
      customer: 'Amit Patel',
      date: '2024-03-13',
      amount: 78000,
      items: [
        { name: 'Yoga Mat', quantity: 50, price: 899, total: 44950 },
        { name: 'Desk Lamp', quantity: 25, price: 1299, total: 32475 }
      ],
      status: 'Delivered',
      address: {
        name: 'Amit Patel',
        company: 'Patel Group',
        address: '789, Park Street, Bangalore - 560001',
        phone: '+91 76543 21098',
        email: 'amit@example.com'
      }
    }
  ]

  const filteredOrders = orders.filter(order =>
    order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    order.customer.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const companyInfo = {
    name: 'VELTRIX Wholesale',
    address: '123 Business Park, MG Road, Bangalore - 560001',
    phone: '+91 80 1234 5678',
    email: 'billing@veltrix.com',
    gst: '27AAACV1234E1Z5',
    pan: 'AAACV1234E'
  }

  const handleGenerateInvoice = () => {
    if (!selectedOrder) return
    setGenerating(true)
    setTimeout(() => {
      setGenerating(false)
      setGenerated(true)
      setTimeout(() => setGenerated(false), 3000)
    }, 1500)
  }

  const handleDownload = () => {
    console.log('Downloading invoice...')
  }

  const handleEmail = () => {
    console.log('Emailing invoice...')
  }

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value)
  }

  const calculateSubtotal = () => {
    return selectedOrder?.items?.reduce((sum, item) => sum + item.total, 0) || 0
  }

  const calculateTax = () => {
    return calculateSubtotal() * 0.18
  }

  const calculateTotal = () => {
    return calculateSubtotal() + calculateTax()
  }

  return (
    <div className="invoice-generator bg-white rounded-xl border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="px-4 sm:px-6 py-4 border-b border-gray-200 bg-gray-50/50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-primary-100 flex items-center justify-center text-primary-600">
            <FileText size={20} />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-semibold text-gray-900">Invoice Generator</h3>
            <p className="text-xs sm:text-sm text-gray-500">Create invoices for orders, download PDF, email to customers</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x divide-gray-200">
        {/* Left Panel - Order Selection */}
        <div className="p-4 sm:p-6">
          <div className="mb-4">
            <div className="relative">
              <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search by order ID or customer name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-primary-500"
              />
            </div>
          </div>

          <div className="space-y-2 max-h-[400px] overflow-y-auto">
            {filteredOrders.map(order => (
              <button
                key={order.id}
                className={`w-full p-3 rounded-xl border-2 text-left transition-all ${
                  selectedOrder?.id === order.id
                    ? 'border-primary-500 bg-primary-50'
                    : 'border-gray-200 hover:border-primary-300 hover:bg-gray-50'
                }`}
                onClick={() => setSelectedOrder(order)}
              >
                <div className="flex items-start justify-between mb-1">
                  <span className={`text-sm font-semibold ${selectedOrder?.id === order.id ? 'text-primary-700' : 'text-gray-900'}`}>
                    {order.id}
                  </span>
                  <span className="text-xs text-gray-500">{order.date}</span>
                </div>
                <p className="text-sm text-gray-600 mb-1">{order.customer}</p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500">{order.items.length} items</span>
                  <span className="text-sm font-semibold text-gray-900">{formatCurrency(order.amount)}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Right Panel - Invoice Form */}
        <div className="p-4 sm:p-6">
          {selectedOrder ? (
            <div className="space-y-4">
              {/* Invoice Details */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Invoice Number</label>
                  <input
                    type="text"
                    value={invoiceNumber}
                    onChange={(e) => setInvoiceNumber(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-primary-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Invoice Date</label>
                  <input
                    type="date"
                    value={invoiceDate}
                    onChange={(e) => setInvoiceDate(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-primary-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Due Date</label>
                  <input
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-primary-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Order ID</label>
                  <input
                    type="text"
                    value={selectedOrder.id}
                    disabled
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-600"
                  />
                </div>
              </div>

              {/* Preview Button */}
              <button
                onClick={() => setShowPreview(!showPreview)}
                className="w-full py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-all flex items-center justify-center gap-2"
              >
                <Eye size={16} />
                {showPreview ? 'Hide Preview' : 'Show Preview'}
              </button>

              {/* Invoice Preview */}
              {showPreview && (
                <div className="invoice-preview border border-gray-200 rounded-xl overflow-hidden">
                  <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
                    <h4 className="text-sm font-semibold text-gray-900">Invoice Preview</h4>
                  </div>
                  <div className="p-4 space-y-4 text-sm">
                    {/* Header */}
                    <div className="text-center border-b border-gray-200 pb-3">
                      <h2 className="text-lg font-bold text-gray-900">{companyInfo.name}</h2>
                      <p className="text-xs text-gray-500">{companyInfo.address}</p>
                      <p className="text-xs text-gray-500">Phone: {companyInfo.phone} | Email: {companyInfo.email}</p>
                      <p className="text-xs text-gray-500">GST: {companyInfo.gst} | PAN: {companyInfo.pan}</p>
                    </div>

                    {/* Invoice Info */}
                    <div className="flex justify-between">
                      <div>
                        <p className="text-xs text-gray-500">Invoice No: <span className="font-medium text-gray-900">{invoiceNumber}</span></p>
                        <p className="text-xs text-gray-500">Invoice Date: {invoiceDate}</p>
                        <p className="text-xs text-gray-500">Due Date: {dueDate}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Order ID: {selectedOrder.id}</p>
                        <p className="text-xs text-gray-500">Order Date: {selectedOrder.date}</p>
                      </div>
                    </div>

                    {/* Bill To */}
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <p className="text-xs font-semibold text-gray-700 mb-1">Bill To:</p>
                      <p className="text-sm font-medium text-gray-900">{selectedOrder.address.name}</p>
                      <p className="text-xs text-gray-600">{selectedOrder.address.company}</p>
                      <p className="text-xs text-gray-600">{selectedOrder.address.address}</p>
                      <p className="text-xs text-gray-600">Phone: {selectedOrder.address.phone}</p>
                      <p className="text-xs text-gray-600">Email: {selectedOrder.address.email}</p>
                    </div>

                    {/* Items Table */}
                    <table className="w-full text-xs">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-2 py-1 text-left">Item</th>
                          <th className="px-2 py-1 text-right">Qty</th>
                          <th className="px-2 py-1 text-right">Price</th>
                          <th className="px-2 py-1 text-right">Total</th>
                        </tr>
                      </thead>
                      <tbody>
                        {selectedOrder.items.map((item, i) => (
                          <tr key={i}>
                            <td className="px-2 py-1">{item.name}</td>
                            <td className="px-2 py-1 text-right">{item.quantity}</td>
                            <td className="px-2 py-1 text-right">{formatCurrency(item.price)}</td>
                            <td className="px-2 py-1 text-right">{formatCurrency(item.total)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>

                    {/* Totals */}
                    <div className="border-t border-gray-200 pt-2">
                      <div className="flex justify-end">
                        <div className="w-40 space-y-1">
                          <div className="flex justify-between">
                            <span className="text-xs text-gray-500">Subtotal:</span>
                            <span className="text-xs font-medium">{formatCurrency(calculateSubtotal())}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-xs text-gray-500">GST (18%):</span>
                            <span className="text-xs font-medium">{formatCurrency(calculateTax())}</span>
                          </div>
                          <div className="flex justify-between pt-1 border-t border-gray-200">
                            <span className="text-sm font-semibold text-gray-900">Total:</span>
                            <span className="text-sm font-bold text-primary-600">{formatCurrency(calculateTotal())}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Notes */}
                    <div className="border-t border-gray-200 pt-2">
                      <p className="text-xs text-gray-500">Notes:</p>
                      <p className="text-xs text-gray-600">{notes}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Notes */}
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Notes / Terms</label>
                <textarea
                  rows="2"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-primary-500"
                  placeholder="Thank you for your business!"
                />
              </div>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-2 pt-2">
                <button
                  onClick={handleGenerateInvoice}
                  disabled={generating}
                  className="flex-1 py-2 bg-primary-500 text-white text-sm font-medium rounded-lg hover:bg-primary-600 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {generating ? (
                    <>
                      <RefreshCw size={16} className="animate-spin" />
                      Generating...
                    </>
                  ) : generated ? (
                    <>
                      <CheckCircle size={16} />
                      Generated!
                    </>
                  ) : (
                    <>
                      <FileText size={16} />
                      Generate Invoice
                    </>
                  )}
                </button>
                <button
                  onClick={handleDownload}
                  className="flex-1 py-2 bg-white border border-gray-200 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-all flex items-center justify-center gap-2"
                >
                  <Download size={16} />
                  Download PDF
                </button>
                <button
                  onClick={handleEmail}
                  className="flex-1 py-2 bg-white border border-gray-200 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-all flex items-center justify-center gap-2"
                >
                  <Mail size={16} />
                  Email
                </button>
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <FileText size={48} className="mx-auto text-gray-300 mb-3" />
              <p className="text-sm text-gray-500">Select an order to generate invoice</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}