"use client";

import React, { useState } from 'react';
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
  CreditCard,
  Sparkles,
  ShoppingBag,
  ShieldCheck
} from '@/utils/icons';
import '../../../../styles/Wholesaler/PaymentsPayouts/InvoiceGenerator.scss';

export default function InvoiceGenerator() {
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [generating, setGenerating] = useState(false);
  const [generated, setGenerated] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [invoiceNumber, setInvoiceNumber] = useState('INV-2024-001');
  const [invoiceDate, setInvoiceDate] = useState(new Date().toISOString().split('T')[0]);
  const [dueDate, setDueDate] = useState(() => {
    const date = new Date();
    date.setDate(date.getDate() + 15);
    return date.toISOString().split('T')[0];
  });
  const [notes, setNotes] = useState('Payment due within 15 days of invoice date. Thank you for your business!');

  const orders = [
    {
      id: '#ORD-2024-001',
      customer: 'Rajesh Kumar Enterprises',
      date: '2024-03-15',
      amount: 124750,
      items: [
        { name: 'Wireless Headphones ANC', quantity: 50, price: 1250, total: 62500 },
        { name: 'Bluetooth Conference Speaker', quantity: 25, price: 2490, total: 62250 }
      ],
      status: 'Delivered',
      address: {
        name: 'Rajesh Kumar',
        company: 'Kumar Enterprises Pvt Ltd',
        address: '123, MG Road, Commercial Enclave, Bangalore - 560001',
        phone: '+91 98765 43210',
        email: 'rajesh@kumarenterprises.com'
      }
    },
    {
      id: '#ORD-2024-002',
      customer: 'Priya Sharma Stores',
      date: '2024-03-14',
      amount: 45000,
      items: [
        { name: 'Pure Cotton B2B T-Shirts (Pack of 10)', quantity: 100, price: 450, total: 45000 }
      ],
      status: 'Delivered',
      address: {
        name: 'Priya Sharma',
        company: 'Sharma Retail Hub',
        address: '456, Brigade Road, Bangalore - 560001',
        phone: '+91 87654 32109',
        email: 'priya@sharmaretail.com'
      }
    },
    {
      id: '#ORD-2024-003',
      customer: 'Amit Patel Logistics',
      date: '2024-03-13',
      amount: 78000,
      items: [
        { name: 'Premium Eco Yoga Mats', quantity: 50, price: 899, total: 44950 },
        { name: 'Adjustable LED Desk Lamps', quantity: 25, price: 1322, total: 33050 }
      ],
      status: 'Delivered',
      address: {
        name: 'Amit Patel',
        company: 'Patel Trading House',
        address: '789, Park Street, Indiranagar, Bangalore - 560001',
        phone: '+91 76543 21098',
        email: 'amit@pateltrading.com'
      }
    }
  ];

  const filteredOrders = orders.filter(order =>
    order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    order.customer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const companyInfo = {
    name: 'VELTRIX Wholesale Global Ltd',
    address: '123 Business Tower, Silicon Hub, Bangalore - 560001',
    phone: '+91 80 1234 5678',
    email: 'billing@veltrixwholesale.com',
    gst: '27AAACV1234E1Z5',
    pan: 'AAACV1234E'
  };

  const handleGenerateInvoice = () => {
    if (!selectedOrder) {
      alert('Please select an order from the list first.');
      return;
    }
    setGenerating(true);
    setTimeout(() => {
      setGenerating(false);
      setGenerated(true);
      setShowPreview(true);
    }, 1200);
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  const subtotal = selectedOrder?.items?.reduce((sum, item) => sum + item.total, 0) || 0;
  const gstAmount = Math.round(subtotal * 0.18);
  const grandTotal = subtotal + gstAmount;

  return (
    <div className="invoice-generator bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
      {/* Header */}
      <div className="p-4 sm:p-6 border-b border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50/60">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center text-white shadow-2xs">
            <FileText size={19} />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-extrabold text-slate-900 tracking-tight">
              B2B Tax Invoice Generator
            </h3>
            <p className="text-xs text-slate-500">
              Generate GST-compliant tax invoices and export ready-to-print commercial statements
            </p>
          </div>
        </div>

        {selectedOrder && (
          <button
            onClick={() => setShowPreview(true)}
            type="button"
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-all border border-slate-200/80 shadow-2xs self-start sm:self-auto cursor-pointer"
          >
            <Eye size={14} className="text-primary-600" />
            <span>Preview Invoice</span>
          </button>
        )}
      </div>

      <div className="p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Order Selector (5 cols) */}
        <div className="lg:col-span-5 space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
              1. Select Order for Invoicing
            </label>
            <span className="text-[11px] text-slate-400 font-semibold">{filteredOrders.length} Available</span>
          </div>

          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by Order ID or Buyer Name..."
              className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-primary-500"
            />
          </div>

          <div className="space-y-2 max-h-[360px] overflow-y-auto pr-1">
            {filteredOrders.map(order => {
              const isSelected = selectedOrder?.id === order.id;
              return (
                <div
                  key={order.id}
                  onClick={() => {
                    setSelectedOrder(order);
                    setInvoiceNumber(`INV-${order.id.replace('#ORD-', '')}`);
                  }}
                  className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'border-primary-600 bg-primary-50/50 shadow-xs'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-xs text-primary-700">{order.id}</span>
                    <span className="text-xs font-black text-slate-900">{formatCurrency(order.amount)}</span>
                  </div>
                  <p className="text-xs font-bold text-slate-800 mt-1 truncate">{order.customer}</p>
                  <div className="flex items-center justify-between text-[11px] text-slate-400 mt-1">
                    <span>{order.date}</span>
                    <span className="text-emerald-700 font-semibold">{order.items.length} items</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Invoice Customization (7 cols) */}
        <div className="lg:col-span-7 space-y-4 bg-slate-50/60 p-4 sm:p-5 rounded-2xl border border-slate-200/80">
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
            2. Invoice Metadata & Terms
          </label>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-[11px] font-semibold text-slate-600 mb-1">Invoice Number</label>
              <input
                type="text"
                value={invoiceNumber}
                onChange={(e) => setInvoiceNumber(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-mono font-bold text-slate-900"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-slate-600 mb-1">Invoice Date</label>
              <input
                type="date"
                value={invoiceDate}
                onChange={(e) => setInvoiceDate(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-900"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-slate-600 mb-1">Payment Due Date</label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-900"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-600 mb-1">Terms & Remittance Notes</label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full p-3 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-primary-500"
            />
          </div>

          {/* Computed Summary Preview */}
          {selectedOrder && (
            <div className="p-3.5 bg-white rounded-xl border border-slate-200/80 space-y-1.5 text-xs">
              <div className="flex justify-between text-slate-500">
                <span>Taxable Items Subtotal</span>
                <span className="font-semibold text-slate-800">{formatCurrency(subtotal)}</span>
              </div>
              <div className="flex justify-between text-slate-500">
                <span>Integrated GST (18%)</span>
                <span className="font-semibold text-slate-800">{formatCurrency(gstAmount)}</span>
              </div>
              <div className="flex justify-between pt-1.5 border-t border-slate-100 font-extrabold text-sm text-slate-900">
                <span>Total Invoice Value</span>
                <span className="text-primary-700 font-black">{formatCurrency(grandTotal)}</span>
              </div>
            </div>
          )}

          {/* Action Trigger */}
          <button
            onClick={handleGenerateInvoice}
            disabled={!selectedOrder || generating}
            type="button"
            className="w-full py-3 bg-primary-600 hover:bg-primary-700 text-white text-xs font-bold rounded-xl transition-all shadow-xs disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer active:scale-[0.99]"
          >
            {generating ? (
              <>
                <RefreshCw size={15} className="animate-spin" />
                <span>Compiling Tax Invoice PDF...</span>
              </>
            ) : (
              <>
                <FileText size={15} />
                <span>Generate Official Invoice</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Invoice Preview Modal */}
      {showPreview && selectedOrder && (
        <div className="fixed inset-0 z-[100000] overflow-hidden flex items-center justify-center p-3 sm:p-4">
          <div 
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity" 
            onClick={() => setShowPreview(false)} 
          />
          <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl z-10 overflow-hidden flex flex-col max-h-[92vh]">
            {/* Modal Header */}
            <div className="px-5 py-3.5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-2">
                <FileText size={16} className="text-primary-600" />
                <h4 className="text-sm font-extrabold text-slate-900">Tax Invoice #{invoiceNumber}</h4>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => window.print()}
                  type="button"
                  className="p-1.5 text-slate-600 hover:text-slate-900 bg-white border border-slate-200 rounded-lg text-xs font-bold flex items-center gap-1 shadow-2xs"
                >
                  <Printer size={13} />
                  <span>Print</span>
                </button>
                <button 
                  onClick={() => setShowPreview(false)}
                  type="button"
                  className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg cursor-pointer"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* Printable Invoice Sheet */}
            <div className="p-6 space-y-6 overflow-y-auto flex-1 text-xs">
              {/* Top Banner */}
              <div className="flex justify-between items-start border-b border-slate-200 pb-5">
                <div>
                  <h2 className="text-lg font-black tracking-tight text-slate-900">TAX INVOICE</h2>
                  <p className="font-mono text-slate-500 mt-0.5">#{invoiceNumber}</p>
                  <div className="mt-2 text-slate-600 space-y-0.5">
                    <p className="font-bold text-slate-900">{companyInfo.name}</p>
                    <p>{companyInfo.address}</p>
                    <p>GSTIN: <span className="font-mono font-bold text-slate-800">{companyInfo.gst}</span></p>
                  </div>
                </div>

                <div className="text-right text-slate-600 space-y-1">
                  <p>Date: <strong className="text-slate-900">{invoiceDate}</strong></p>
                  <p>Due: <strong className="text-slate-900">{dueDate}</strong></p>
                  <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200 mt-1">
                    GST COMPLIANT
                  </span>
                </div>
              </div>

              {/* Bill To */}
              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/80">
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Billed To (Retailer / Consignee)</p>
                <p className="font-extrabold text-sm text-slate-900">{selectedOrder.customer}</p>
                <p className="text-slate-600 mt-0.5">{selectedOrder.address.address}</p>
                <p className="text-slate-500 mt-0.5 font-mono">{selectedOrder.address.phone} · {selectedOrder.address.email}</p>
              </div>

              {/* Itemized Table */}
              <div className="rounded-xl border border-slate-200 overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 font-bold uppercase tracking-wider text-[10px] text-slate-500 border-b border-slate-200">
                    <tr>
                      <th className="px-3.5 py-2.5">Item Description</th>
                      <th className="px-3.5 py-2.5 text-center">Qty</th>
                      <th className="px-3.5 py-2.5 text-right">Unit Price</th>
                      <th className="px-3.5 py-2.5 text-right">Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {selectedOrder.items.map((item, i) => (
                      <tr key={i}>
                        <td className="px-3.5 py-2.5 font-medium text-slate-900">{item.name}</td>
                        <td className="px-3.5 py-2.5 text-center text-slate-600 font-mono">{item.quantity}</td>
                        <td className="px-3.5 py-2.5 text-right text-slate-600">{formatCurrency(item.price)}</td>
                        <td className="px-3.5 py-2.5 text-right font-extrabold text-slate-900">{formatCurrency(item.total)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Financial Calculation */}
              <div className="flex justify-end">
                <div className="w-64 space-y-1.5 text-xs">
                  <div className="flex justify-between text-slate-500">
                    <span>Taxable Value</span>
                    <span className="font-bold text-slate-800">{formatCurrency(subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-slate-500">
                    <span>IGST (18%)</span>
                    <span className="font-bold text-slate-800">{formatCurrency(gstAmount)}</span>
                  </div>
                  <div className="flex justify-between pt-1.5 border-t border-slate-200 text-sm font-black text-slate-900">
                    <span>Total Payable</span>
                    <span className="text-primary-700">{formatCurrency(grandTotal)}</span>
                  </div>
                </div>
              </div>

              {/* Notes */}
              <div className="p-3 bg-slate-50/80 rounded-xl text-[11px] text-slate-500 border border-slate-200/60">
                <strong>Remittance Instructions: </strong>{notes}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-5 py-3 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
              <span className="text-[11px] text-slate-500">Authorized Electronic Document</span>
              <button
                onClick={() => setShowPreview(false)}
                type="button"
                className="px-4 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold cursor-pointer"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
