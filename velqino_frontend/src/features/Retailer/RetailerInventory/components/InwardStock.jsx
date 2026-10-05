"use client";

import React, { useState, useEffect } from 'react';
import { 
  Package, 
  Truck, 
  Plus, 
  Minus, 
  Save, 
  X, 
  Search, 
  Calendar, 
  FileText, 
  CheckCircle, 
  RefreshCw, 
  AlertCircle
} from '../../../../utils/icons';
import { toast } from 'react-toastify';

export default function InwardStock({ onComplete }) {
  const [mounted, setMounted] = useState(false);
  const [supplier, setSupplier] = useState('Fashion Hub Wholesaler');
  const [invoiceNo, setInvoiceNo] = useState('');
  const [selectedItems, setSelectedItems] = useState([
    { id: 1, name: 'Premium Cotton T-Shirt', sku: 'CT-001', qty: 50, batchNo: 'BATCH-501', unitCost: 350 },
    { id: 2, name: 'Wireless Headphones', sku: 'WH-002', qty: 20, batchNo: 'BATCH-502', unitCost: 1800 },
  ]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const catalogProducts = [
    { id: 1, name: 'Premium Cotton T-Shirt', sku: 'CT-001', defaultCost: 350 },
    { id: 2, name: 'Wireless Headphones', sku: 'WH-002', defaultCost: 1800 },
    { id: 3, name: 'Smart Watch Pro', sku: 'SW-003', defaultCost: 3800 },
    { id: 4, name: 'Leather Wallet', sku: 'LW-004', defaultCost: 1100 },
    { id: 5, name: 'Running Shoes', sku: 'RS-005', defaultCost: 2200 },
  ];

  const updateQuantity = (id, delta) => {
    setSelectedItems(prev => prev.map(item => {
      if (item.id === id) {
        return { ...item, qty: Math.max(1, item.qty + delta) };
      }
      return item;
    }));
  };

  const updateBatchNo = (id, batch) => {
    setSelectedItems(prev => prev.map(item => item.id === id ? { ...item, batchNo: batch } : item));
  };

  const removeItem = (id) => {
    setSelectedItems(prev => prev.filter(item => item.id !== id));
  };

  const addItemToConsignment = (prod) => {
    if (selectedItems.some(i => i.id === prod.id)) {
      toast.info('Item already present in inward receipt lines');
      return;
    }
    setSelectedItems(prev => [
      ...prev,
      {
        id: prod.id,
        name: prod.name,
        sku: prod.sku,
        qty: 10,
        batchNo: `BATCH-${Math.floor(100 + Math.random() * 900)}`,
        unitCost: prod.defaultCost
      }
    ]);
  };

  const totalUnits = selectedItems.reduce((sum, item) => sum + item.qty, 0);
  const totalValuation = selectedItems.reduce((sum, item) => sum + (item.qty * item.unitCost), 0);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!invoiceNo.trim()) {
      toast.error('Please enter the supplier invoice or Challan number');
      return;
    }
    if (selectedItems.length === 0) {
      toast.error('Please add at least one line item to receive');
      return;
    }

    setIsSubmitting(true);
    await new Promise(r => setTimeout(r, 800));
    setIsSubmitting(false);

    toast.success(`Inward consignment ${invoiceNo} recorded with ${totalUnits} units added to live stock!`);
    setInvoiceNo('');
    if (onComplete) onComplete();
  };

  return (
    <div className="bg-white rounded-3xl border border-gray-200/80 shadow-2xs overflow-hidden flex flex-col justify-between">
      <form onSubmit={handleSubmit}>
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Truck size={18} />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-bold text-gray-900 tracking-tight">Receive Inward Stock</h3>
              <p className="text-[11px] text-gray-400">Log incoming wholesale stock & supplier invoices</p>
            </div>
          </div>
          <span className="text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full">
            {totalUnits} Units
          </span>
        </div>

        {/* Invoice & Supplier Form Strip */}
        <div className="p-4 sm:p-5 border-b border-gray-100 bg-gray-50/50 grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">
              Select Supplier
            </label>
            <select
              value={supplier}
              onChange={(e) => setSupplier(e.target.value)}
              className="w-full px-3 py-1.5 text-xs bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-primary-500 font-semibold text-gray-800"
            >
              <option value="Fashion Hub Wholesaler">Fashion Hub Wholesaler</option>
              <option value="ElectroMart Supplies">ElectroMart Supplies</option>
              <option value="SportFit Athletics">SportFit Athletics</option>
              <option value="LeatherCraft Artisans">LeatherCraft Artisans</option>
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">
              Supplier Invoice / Challan #
            </label>
            <input
              type="text"
              placeholder="e.g. INV-2026-908"
              value={invoiceNo}
              onChange={(e) => setInvoiceNo(e.target.value)}
              className="w-full px-3 py-1.5 text-xs bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-primary-500 font-mono"
            />
          </div>
        </div>

        {/* Line Items List */}
        <div className="p-4 sm:p-5 max-h-[220px] overflow-y-auto space-y-2.5">
          {selectedItems.map((item) => (
            <div 
              key={item.id}
              className="p-3 rounded-2xl border border-gray-200/80 bg-white flex items-center justify-between gap-3 text-xs"
            >
              <div className="min-w-0 flex-1">
                <p className="font-bold text-gray-900 truncate">{item.name}</p>
                <div className="flex items-center gap-2 text-[10px] text-gray-400 mt-0.5">
                  <span className="font-mono text-gray-700">SKU: {item.sku}</span>
                  <span>•</span>
                  <span>Unit: ₹{item.unitCost}</span>
                </div>
              </div>

              {/* Quantity Adjuster */}
              <div className="flex items-center gap-1.5 shrink-0">
                <div className="flex items-center border border-gray-200 rounded-xl bg-gray-50 overflow-hidden">
                  <button
                    type="button"
                    onClick={() => updateQuantity(item.id, -5)}
                    className="px-2 py-1 text-gray-500 hover:bg-gray-200"
                  >
                    -
                  </button>
                  <span className="px-2 font-bold text-gray-900 text-xs">{item.qty}</span>
                  <button
                    type="button"
                    onClick={() => updateQuantity(item.id, 5)}
                    className="px-2 py-1 text-gray-500 hover:bg-gray-200"
                  >
                    +
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => removeItem(item.id)}
                  className="p-1 text-gray-400 hover:text-rose-600 rounded-lg"
                >
                  <X size={14} />
                </button>
              </div>
            </div>
          ))}

          {/* Quick SKU Add Selector */}
          <div className="pt-2 flex items-center gap-1.5 overflow-x-auto">
            <span className="text-[10px] font-bold text-gray-400 uppercase shrink-0">+ Add SKU:</span>
            {catalogProducts.map(p => (
              <button
                key={p.id}
                type="button"
                onClick={() => addItemToConsignment(p)}
                className="px-2.5 py-1 rounded-xl bg-gray-100 hover:bg-primary-50 hover:text-primary-700 text-gray-600 text-[11px] font-bold shrink-0 transition-all"
              >
                {p.name.split(' ')[0]}
              </button>
            ))}
          </div>
        </div>

        {/* Submit Bottom Bar */}
        <div className="p-4 sm:p-5 border-t border-gray-100 bg-gray-50/70 flex items-center justify-between gap-3">
          <div>
            <span className="text-[10px] font-bold text-gray-400 uppercase block">Consignment Total</span>
            <p className="text-sm sm:text-base font-extrabold text-emerald-800">
              ₹{totalValuation.toLocaleString('en-IN')}
            </p>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 active:scale-95 disabled:opacity-40 transition-all shadow-xs flex items-center gap-1.5"
          >
            {isSubmitting ? <RefreshCw size={13} className="animate-spin" /> : <CheckCircle size={13} />}
            <span>Accept Inward Stock</span>
          </button>
        </div>
      </form>
    </div>
  );
}
