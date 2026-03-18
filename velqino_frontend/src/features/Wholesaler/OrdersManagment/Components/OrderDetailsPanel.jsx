"use client"

import React, { useState } from 'react'
import { 
  X,
  Clock,
  User,
  Package,
  CreditCard,
  Truck,
  FileText,
  MessageCircle,
  Download,
  Printer,
  Edit,
  ChevronRight,
  CheckCircle,
  AlertCircle,
  MapPin,
  Phone,
  Mail,
  Calendar
} from '../../../../utils/icons'
import '../../../../styles/Wholesaler/OrdersManagment/OrderDetailsPanel.scss'

export default function OrderDetailsPanel({ order = mockOrder, onClose }) {
  const [activeTab, setActiveTab] = useState('timeline')
  const [expandedSection, setExpandedSection] = useState(null)

  const tabs = [
    { id: 'timeline', label: 'Timeline', icon: Clock },
    { id: 'items', label: 'Items', icon: Package },
    { id: 'payment', label: 'Payment', icon: CreditCard },
    { id: 'shipping', label: 'Shipping', icon: Truck },
    { id: 'notes', label: 'Notes', icon: FileText }
  ]

  const timeline = [
    { status: 'Order Placed', date: '2024-01-15 10:30 AM', by: 'Customer', icon: Clock, completed: true },
    { status: 'Payment Confirmed', date: '2024-01-15 10:35 AM', by: 'System', icon: CreditCard, completed: true },
    { status: 'Processing', date: '2024-01-15 11:00 AM', by: 'Warehouse', icon: Package, completed: true },
    { status: 'Shipped', date: '2024-01-16 09:15 AM', by: 'Logistics', icon: Truck, completed: true },
    { status: 'Out for Delivery', date: '2024-01-17 08:00 AM', by: 'Courier', icon: Truck, completed: false },
    { status: 'Delivered', date: 'Expected 2024-01-18', by: '', icon: CheckCircle, completed: false }
  ]

  return (
    <div className="order-details-panel bg-white border-l border-gray-200 w-full max-w-2xl">
      {/* Header */}
      <div className="order-details-header px-6 py-4 border-b border-gray-200 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-primary-100 flex items-center justify-center text-primary-600">
            <Package size={20} />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Order Details</h3>
            <p className="text-sm text-gray-500">{order?.id || '#ORD-2024-001'}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all">
            <Printer size={18} />
          </button>
          <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all">
            <Download size={18} />
          </button>
          <button 
  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all"
  onClick={() => {
    console.log('🔴 X button clicked in panel')
    onClose()
  }}
>
  <X size={18} />
</button>
        </div>
      </div>

      {/* Tabs */}
      <div className="order-details-tabs px-6 border-b border-gray-200 flex gap-1">
        {tabs.map(tab => {
          const Icon = tab.icon
          return (
            <button
              key={tab.id}
              className={`order-details-tab px-4 py-3 text-sm font-medium flex items-center gap-2 border-b-2 transition-all ${
                activeTab === tab.id
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setActiveTab(tab.id)}
            >
              <Icon size={16} />
              {tab.label}
            </button>
          )
        })}
      </div>

      {/* Content */}
      <div className="order-details-content p-6 overflow-y-auto" style={{ maxHeight: 'calc(100vh - 200px)' }}>
        
        {/* Timeline Tab */}
        {activeTab === 'timeline' && (
          <div className="timeline-container">
            <h4 className="text-sm font-medium text-gray-700 mb-4 flex items-center gap-2">
              <Clock size={16} className="text-gray-400" />
              Order Timeline
            </h4>
            <div className="timeline relative">
              {timeline.map((event, index) => (
                <div key={index} className="timeline-item mb-6 relative pl-8">
                  <div className={`timeline-dot absolute left-0 w-4 h-4 rounded-full border-2 ${
                    event.completed 
                      ? 'bg-success-500 border-success-200' 
                      : 'bg-gray-300 border-gray-200'
                  }`} />
                  {index < timeline.length - 1 && (
                    <div className={`timeline-line absolute left-[7px] top-4 w-0.5 h-12 ${
                      event.completed ? 'bg-success-200' : 'bg-gray-200'
                    }`} />
                  )}
                  <div className="timeline-content">
                    <div className="flex items-center justify-between">
                      <h5 className="text-sm font-medium text-gray-900">{event.status}</h5>
                      <span className="text-xs text-gray-500">{event.date}</span>
                    </div>
                    {event.by && (
                      <p className="text-xs text-gray-500 mt-0.5">by {event.by}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Items Tab */}
        {activeTab === 'items' && (
          <div className="items-container">
            <h4 className="text-sm font-medium text-gray-700 mb-4 flex items-center gap-2">
              <Package size={16} className="text-gray-400" />
              Items Purchased
            </h4>
            <div className="space-y-4">
              {order?.products?.map((item, index) => (
                <div key={index} className="item-card p-4 bg-gray-50 rounded-xl">
                  <div className="flex items-start gap-3">
                    <div className="w-16 h-16 bg-white rounded-lg border border-gray-200 flex items-center justify-center text-2xl">
                      {item.image || '📦'}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <div>
                          <h5 className="text-sm font-semibold text-gray-900">{item.name}</h5>
                          <p className="text-xs text-gray-500 mt-0.5">SKU: {item.sku || 'WH-001'}</p>
                        </div>
                        <span className="text-sm font-semibold text-gray-900">
                          ₹{(item.price * item.qty).toLocaleString()}
                        </span>
                      </div>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-xs text-gray-500">Qty: {item.qty} × ₹{item.price}</span>
                        <span className="text-xs px-2 py-1 bg-primary-50 text-primary-700 rounded-full">
                          {item.status || 'In Stock'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              <div className="total-section pt-4 border-t border-gray-200">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium">₹{order?.total?.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between text-sm mt-2">
                  <span className="text-gray-600">Shipping</span>
                  <span className="font-medium">₹{order?.shipping || 0}</span>
                </div>
                <div className="flex items-center justify-between text-sm mt-2">
                  <span className="text-gray-600">Tax</span>
                  <span className="font-medium">₹{order?.tax || 0}</span>
                </div>
                <div className="flex items-center justify-between text-base font-semibold mt-3 pt-3 border-t border-gray-200">
                  <span className="text-gray-900">Total</span>
                  <span className="text-primary-600">₹{((order?.total || 0) + (order?.shipping || 0) + (order?.tax || 0)).toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Payment Tab */}
        {activeTab === 'payment' && (
          <div className="payment-container">
            <h4 className="text-sm font-medium text-gray-700 mb-4 flex items-center gap-2">
              <CreditCard size={16} className="text-gray-400" />
              Payment Information
            </h4>
            <div className="payment-card p-4 bg-gray-50 rounded-xl space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Status</span>
                <span className={`px-3 py-1 text-xs font-medium rounded-full ${
                  order?.payment?.status === 'Paid' ? 'bg-success-50 text-success-700' : 'bg-warning-50 text-warning-700'
                }`}>
                  {order?.payment?.status || 'Paid'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Method</span>
                <span className="text-sm font-medium text-gray-900">{order?.payment?.method || 'UPI'}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Transaction ID</span>
                <span className="text-sm text-gray-900">{order?.payment?.txnId || 'TXN123456789'}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Date</span>
                <span className="text-sm text-gray-900">{order?.payment?.date || '2024-01-15'}</span>
              </div>
            </div>
          </div>
        )}

        {/* Shipping Tab */}
        {activeTab === 'shipping' && (
          <div className="shipping-container space-y-6">
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-4 flex items-center gap-2">
                <Truck size={16} className="text-gray-400" />
                Shipping Information
              </h4>
              <div className="shipping-card p-4 bg-gray-50 rounded-xl space-y-3">
                <div className="flex items-start gap-3">
                  <MapPin size={16} className="text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">{order?.shippingAddress?.name || 'Rajesh Kumar'}</p>
                    <p className="text-xs text-gray-600 mt-1">
                      {order?.shippingAddress?.line1 || '123, MG Road'},<br />
                      {order?.shippingAddress?.city || 'Bangalore'}, {order?.shippingAddress?.state || 'Karnataka'}<br />
                      {order?.shippingAddress?.pincode || '560001'}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Phone size={16} className="text-gray-400" />
                  <span className="text-sm text-gray-900">{order?.shippingAddress?.phone || '+91 98765 43210'}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Mail size={16} className="text-gray-400" />
                  <span className="text-sm text-gray-900">{order?.shippingAddress?.email || 'rajesh@example.com'}</span>
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-4 flex items-center gap-2">
                <Truck size={16} className="text-gray-400" />
                Tracking Information
              </h4>
              <div className="tracking-card p-4 bg-gray-50 rounded-xl">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Courier</span>
                  <span className="text-sm font-medium text-gray-900">{order?.courier || 'Delhivery'}</span>
                </div>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-sm text-gray-600">Tracking No.</span>
                  <span className="text-sm font-medium text-primary-600">{order?.tracking || 'TRK123456789'}</span>
                </div>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-sm text-gray-600">Expected Delivery</span>
                  <span className="text-sm text-gray-900">{order?.deliveryDate || '2024-01-18'}</span>
                </div>
                <button className="w-full mt-3 px-3 py-2 bg-primary-500 text-white text-sm font-medium rounded-lg hover:bg-primary-600 transition-all">
                  Track Package
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Notes Tab */}
        {activeTab === 'notes' && (
          <div className="notes-container">
            <h4 className="text-sm font-medium text-gray-700 mb-4 flex items-center gap-2">
              <FileText size={16} className="text-gray-400" />
              Order Notes
            </h4>
            
            <div className="notes-list space-y-4 mb-6">
              {order?.notes?.map((note, index) => (
                <div key={index} className="note-item p-4 bg-gray-50 rounded-xl">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center text-primary-600">
                        <User size={14} />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{note.author}</p>
                        <p className="text-xs text-gray-500 mt-1">{note.content}</p>
                        <p className="text-xs text-gray-400 mt-2">{note.date}</p>
                      </div>
                    </div>
                    <button className="text-gray-400 hover:text-gray-600">
                      <MoreVertical size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Add Note */}
            <div className="add-note">
              <h5 className="text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
                <MessageCircle size={14} className="text-gray-400" />
                Add a Note
              </h5>
              <textarea 
                placeholder="Write your note here..."
                rows="3"
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
              />
              <button className="mt-2 px-4 py-2 bg-primary-500 text-white text-sm font-medium rounded-lg hover:bg-primary-600 transition-all">
                Add Note
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Footer Actions */}
      <div className="order-details-footer px-6 py-4 border-t border-gray-200 flex items-center justify-between">
        <button className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-all">
          <Edit size={16} className="inline mr-2" />
          Edit Order
        </button>
        <div className="flex items-center gap-2">
          <button className="px-4 py-2 text-sm font-medium text-error-600 bg-error-50 rounded-lg hover:bg-error-100 transition-all">
            Cancel Order
          </button>
          <button className="px-4 py-2 text-sm font-medium text-white bg-primary-500 rounded-lg hover:bg-primary-600 transition-all">
            Update Status
          </button>
        </div>
      </div>
    </div>
  )
}

// Mock data for preview
const mockOrder = {
  id: '#ORD-2024-001',
  customer: { name: 'Rajesh Kumar', type: 'Wholesaler' },
  products: [
    { name: 'Wireless Headphones', qty: 50, price: 1250, image: '🎧', sku: 'WH-001', status: 'In Stock' },
    { name: 'Bluetooth Speaker', qty: 25, price: 2499, image: '🔊', sku: 'BS-002', status: 'In Stock' },
    { name: 'Smart Watch', qty: 10, price: 3499, image: '⌚', sku: 'SW-003', status: 'Pre-order' }
  ],
  total: 124750,
  shipping: 500,
  tax: 11250,
  payment: { status: 'Paid', method: 'UPI', txnId: 'TXN123456789', date: '2024-01-15' },
  shippingAddress: {
    name: 'Rajesh Kumar',
    line1: '123, MG Road',
    city: 'Bangalore',
    state: 'Karnataka',
    pincode: '560001',
    phone: '+91 98765 43210',
    email: 'rajesh@example.com'
  },
  courier: 'Delhivery',
  tracking: 'TRK123456789',
  deliveryDate: '2024-01-18',
  notes: [
    { author: 'Priya (Customer Support)', content: 'Customer requested gift wrapping', date: '2024-01-15 11:30 AM' },
    { author: 'Rahul (Warehouse)', content: 'Items packed and ready for pickup', date: '2024-01-16 09:00 AM' }
  ]
}