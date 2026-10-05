"use client";

import React, { useState, useEffect } from 'react';
import { 
  Package, 
  Truck, 
  Clock, 
  AlertCircle, 
  ShoppingCart, 
  RefreshCw, 
  CheckCircle,
  Phone,
  Sparkles
} from '../../../../utils/icons';
import { toast } from 'react-toastify';

export default function ReorderList({ onReorder }) {
  const [mounted, setMounted] = useState(false);
  const [selectedItems, setSelectedItems] = useState([]);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const reorderItems = [
    { id: 1, name: 'Premium Cotton T-Shirt', sku: 'CT-001', currentStock: 8, reorderLevel: 20, requiredQty: 12, supplier: 'Fashion Hub', supplierContact: '+91 98765 43210', leadTime: '3-5 days', price: 499, status: 'critical' },
    { id: 2, name: 'Wireless Headphones', sku: 'WH-002', currentStock: 12, reorderLevel: 25, requiredQty: 13, supplier: 'ElectroMart', supplierContact: '+91 87654 32109', leadTime: '5-7 days', price: 2499, status: 'warning' },
    { id: 3, name: 'Smart Watch Pro', sku: 'SW-003', currentStock: 5, reorderLevel: 15, requiredQty: 10, supplier: 'TechGadgets', supplierContact: '+91 76543 21098', leadTime: '7-10 days', price: 4999, status: 'critical' },
    { id: 4, name: 'Leather Wallet', sku: 'LW-004', currentStock: 15, reorderLevel: 20, requiredQty: 5, supplier: 'LeatherCraft', supplierContact: '+91 65432 10987', leadTime: '3-5 days', price: 1499, status: 'warning' },
    { id: 5, name: 'Running Shoes', sku: 'RS-005', currentStock: 3, reorderLevel: 12, requiredQty: 9, supplier: 'SportFit', supplierContact: '+91 54321 09876', leadTime: '4-6 days', price: 2999, status: 'critical' },
  ];

  const filteredItems = filter === 'all' ? reorderItems : reorderItems.filter(item => item.status === filter);

  const toggleItemSelection = (id) => {
    if (selectedItems.includes(id)) {
      setSelectedItems(selectedItems.filter(i => i !== id));
    } else {
      setSelectedItems([...selectedItems, id]);
    }
  };

  const toggleSelectAll = () => {
    if (selectedItems.length === filteredItems.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(filteredItems.map(i => i.id));
    }
  };

  const handleReorder = () => {
    if (selectedItems.length === 0) return;
    toast.success(`Purchase order generated for ${selectedItems.length} SKU line items!`);
    if (onReorder) onReorder();
    setSelectedItems([]);
  };

  const totalReorderCost = reorderItems
    .filter(item => selectedItems.includes(item.id))
    .reduce((sum, item) => sum + (item.requiredQty * item.price), 0);

  return (
    <div className="bg-white rounded-3xl border border-gray-200/80 shadow-2xs overflow-hidden flex flex-col justify-between">
      <div>
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <ShoppingCart size={18} />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-bold text-gray-900 tracking-tight">Reorder Queue</h3>
              <p className="text-[11px] text-gray-400">Low stock SKUs with supplier lead times</p>
            </div>
          </div>
          <span className="text-xs font-bold text-amber-800 bg-amber-50 border border-amber-200 px-2.5 py-0.5 rounded-full">
            {reorderItems.length} Needed
          </span>
        </div>

        {/* Filter Tabs */}
        <div className="px-4 sm:px-5 py-2.5 border-b border-gray-100 bg-gray-50/50 flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => setFilter('all')}
              className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${
                filter === 'all' 
                  ? 'bg-white text-primary-600 shadow-2xs border border-gray-200/80' 
                  : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              All ({reorderItems.length})
            </button>
            <button
              type="button"
              onClick={() => setFilter('critical')}
              className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${
                filter === 'critical' 
                  ? 'bg-rose-600 text-white shadow-xs' 
                  : 'text-rose-600 hover:bg-rose-50'
              }`}
            >
              Critical ({reorderItems.filter(i => i.status === 'critical').length})
            </button>
          </div>

          <button
            type="button"
            onClick={toggleSelectAll}
            className="text-[11px] font-bold text-primary-600 hover:text-primary-800"
          >
            {selectedItems.length === filteredItems.length ? 'Deselect All' : 'Select All'}
          </button>
        </div>

        {/* Item List */}
        <div className="p-4 sm:p-5 max-h-[380px] overflow-y-auto space-y-2.5">
          {filteredItems.map((item) => {
            const isSelected = selectedItems.includes(item.id);
            const isCritical = item.status === 'critical';
            const pct = Math.min(100, Math.round((item.currentStock / item.reorderLevel) * 100));

            return (
              <div
                key={item.id}
                onClick={() => toggleItemSelection(item.id)}
                className={`p-3.5 rounded-2xl border cursor-pointer transition-all ${
                  isSelected 
                    ? 'border-primary-500 bg-primary-50/50 shadow-2xs' 
                    : 'border-gray-200/80 bg-white hover:border-gray-300'
                }`}
              >
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="flex items-start gap-2.5 min-w-0">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => toggleItemSelection(item.id)}
                      className="mt-0.5 rounded text-primary-600 focus:ring-primary-500"
                    />
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-gray-900 truncate">{item.name}</p>
                      <span className="text-[10px] text-gray-400 font-mono">SKU: {item.sku} • {item.supplier}</span>
                    </div>
                  </div>

                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 ${
                    isCritical ? 'bg-rose-50 text-rose-700 border border-rose-200' : 'bg-amber-50 text-amber-800 border border-amber-200'
                  }`}>
                    {isCritical ? 'Critical' : 'Low'}
                  </span>
                </div>

                {/* Stock bar & Order Specs */}
                <div className="space-y-1.5 pt-1">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-gray-500">
                      Stock: <strong className="text-gray-900">{item.currentStock}</strong> / {item.reorderLevel}
                    </span>
                    <span className="font-bold text-primary-700">
                      Order +{item.requiredQty} units
                    </span>
                  </div>

                  <div className="w-full h-1.5 rounded-full bg-gray-100 overflow-hidden">
                    <div 
                      className={`h-full rounded-full ${isCritical ? 'bg-rose-500' : 'bg-amber-500'}`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>

                  <div className="flex items-center justify-between text-[10px] text-gray-400 pt-1">
                    <span>Lead time: {item.leadTime}</span>
                    <span className="font-bold text-gray-700">₹{(item.requiredQty * item.price).toLocaleString('en-IN')}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Reorder Action Bottom Bar */}
      <div className="p-4 sm:p-5 border-t border-gray-100 bg-gray-50/70 flex items-center justify-between gap-3">
        <div>
          <span className="text-[10px] font-bold text-gray-400 uppercase block">Selected Cost</span>
          <p className="text-sm sm:text-base font-extrabold text-gray-900">
            ₹{totalReorderCost.toLocaleString('en-IN')}
          </p>
        </div>

        <button
          type="button"
          onClick={handleReorder}
          disabled={selectedItems.length === 0}
          className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-primary-600 hover:bg-primary-700 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-xs flex items-center gap-1.5"
        >
          <ShoppingCart size={13} />
          <span>Place PO ({selectedItems.length})</span>
        </button>
      </div>
    </div>
  );
}
