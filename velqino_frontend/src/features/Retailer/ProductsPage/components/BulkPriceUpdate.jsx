'use client';

import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  Percent, 
  DollarSign, 
  Filter, 
  RefreshCw, 
  CheckCircle, 
  AlertCircle, 
  Save, 
  X, 
  Tag, 
  Truck, 
  FolderTree,
  Sparkles
} from '../../../../utils/icons';
import { toast } from 'react-toastify';
import { useBulkEditProductsMutation } from '@/redux/retailer/slices/retailerProductsSlice';

export default function BulkPriceUpdate({ onComplete, categories = [] }) {
  const [mounted, setMounted] = useState(false);
  const [updateType, setUpdateType] = useState('percentage');
  const [updateScope, setUpdateScope] = useState('category');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedSupplier, setSelectedSupplier] = useState('');
  const [percentageValue, setPercentageValue] = useState('');
  const [fixedValue, setFixedValue] = useState('');
  const [previewCount, setPreviewCount] = useState(0);
  const [isApplying, setIsApplying] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const [bulkEditProducts] = useBulkEditProductsMutation();

  const suppliers = [
    { id: 1, name: 'Velqino Direct', productCount: 38 },
    { id: 2, name: 'Fashion Hub', productCount: 24 },
    { id: 3, name: 'Cotton Club', productCount: 16 },
  ];

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const handlePreview = () => {
    if (updateScope === 'category' && selectedCategory) {
      const category = categories.find(c => c.id === parseInt(selectedCategory));
      setPreviewCount(category?.productCount || 12);
    } else if (updateScope === 'supplier' && selectedSupplier) {
      const supplier = suppliers.find(s => s.id === parseInt(selectedSupplier));
      setPreviewCount(supplier?.productCount || 8);
    } else if (updateScope === 'all') {
      setPreviewCount(38);
    }
  };

  const handleApply = async () => {
    setIsApplying(true);
    try {
      const updateValue = updateType === 'percentage' ? parseFloat(percentageValue) : parseFloat(fixedValue);
      const payload = {
        update_type: updateType,
        update_value: updateValue,
        scope: updateScope,
        category_id: updateScope === 'category' ? selectedCategory : null,
        supplier_id: updateScope === 'supplier' ? selectedSupplier : null
      };
      
      await bulkEditProducts(payload).unwrap();
      toast.success(`${previewCount} products updated successfully`);
      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        if (onComplete) onComplete();
      }, 2000);
    } catch (error) {
      toast.error(error?.data?.message || 'Failed to update prices');
    } finally {
      setIsApplying(false);
    }
  };

  const handleReset = () => {
    setUpdateType('percentage');
    setUpdateScope('category');
    setSelectedCategory('');
    setSelectedSupplier('');
    setPercentageValue('');
    setFixedValue('');
    setPreviewCount(0);
  };

  if (showSuccess) {
    return (
      <div className="bg-white rounded-3xl border border-gray-200/80 p-8 shadow-2xs h-full flex flex-col items-center justify-center text-center">
        <div className="w-14 h-14 bg-emerald-100 rounded-2xl flex items-center justify-center mb-3">
          <CheckCircle size={28} className="text-emerald-600" />
        </div>
        <h3 className="text-base font-bold text-gray-900">Price Update Complete!</h3>
        <p className="text-xs text-gray-500 mt-0.5">{previewCount} products updated with new pricing.</p>
        <button
          type="button"
          onClick={() => setShowSuccess(false)}
          className="mt-4 px-4 py-2 bg-primary-600 text-white text-xs font-bold rounded-xl hover:bg-primary-700 shadow-2xs"
        >
          Done
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl border border-gray-200/80 p-5 sm:p-6 shadow-2xs h-full flex flex-col justify-between space-y-4">
      <div>
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-primary-50 text-primary-600">
              <Tag size={16} />
            </span>
            <div>
              <h3 className="text-sm sm:text-base font-bold text-gray-900">
                Bulk Price Tool
              </h3>
              <p className="text-[11px] text-gray-400">Apply price changes across collections</p>
            </div>
          </div>
          <button 
            type="button"
            onClick={handleReset} 
            className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition-colors"
            title="Reset form"
          >
            <RefreshCw size={13} />
          </button>
        </div>

        <div className="space-y-4 mt-4">
          {/* Update Type Toggle */}
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1.5">Adjustment Mode</label>
            <div className="grid grid-cols-2 gap-2 bg-gray-50 p-1 rounded-2xl border border-gray-200">
              <button
                type="button"
                onClick={() => setUpdateType('percentage')}
                className={`py-2 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 ${
                  updateType === 'percentage' 
                    ? 'bg-white text-primary-900 shadow-2xs border border-gray-200/60' 
                    : 'text-gray-500 hover:text-gray-800'
                }`}
              >
                <Percent size={13} />
                <span>Percentage (%)</span>
              </button>
              <button
                type="button"
                onClick={() => setUpdateType('fixed')}
                className={`py-2 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 ${
                  updateType === 'fixed' 
                    ? 'bg-white text-primary-900 shadow-2xs border border-gray-200/60' 
                    : 'text-gray-500 hover:text-gray-800'
                }`}
              >
                <DollarSign size={13} />
                <span>Fixed Amount (₹)</span>
              </button>
            </div>
          </div>

          {/* Scope Selector */}
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1.5">Target Products</label>
            <div className="grid grid-cols-3 gap-1.5 bg-gray-50 p-1 rounded-2xl border border-gray-200 text-xs">
              <button
                type="button"
                onClick={() => setUpdateScope('all')}
                className={`py-1.5 font-bold rounded-xl transition-all ${
                  updateScope === 'all' ? 'bg-white text-gray-900 shadow-2xs' : 'text-gray-500 hover:text-gray-800'
                }`}
              >
                All
              </button>
              <button
                type="button"
                onClick={() => setUpdateScope('category')}
                className={`py-1.5 font-bold rounded-xl transition-all flex items-center justify-center gap-1 ${
                  updateScope === 'category' ? 'bg-white text-gray-900 shadow-2xs' : 'text-gray-500 hover:text-gray-800'
                }`}
              >
                <FolderTree size={12} />
                <span>Category</span>
              </button>
              <button
                type="button"
                onClick={() => setUpdateScope('supplier')}
                className={`py-1.5 font-bold rounded-xl transition-all flex items-center justify-center gap-1 ${
                  updateScope === 'supplier' ? 'bg-white text-gray-900 shadow-2xs' : 'text-gray-500 hover:text-gray-800'
                }`}
              >
                <Truck size={12} />
                <span>Supplier</span>
              </button>
            </div>
          </div>

          {/* Category Dropdown */}
          {updateScope === 'category' && (
            <div className="animate-fadeIn">
              <label className="block text-xs font-bold text-gray-700 mb-1">Select Category</label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-primary-500 focus:bg-white"
              >
                <option value="">Choose category...</option>
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name} ({cat.productCount ?? 0} items)</option>
                ))}
              </select>
            </div>
          )}

          {/* Supplier Dropdown */}
          {updateScope === 'supplier' && (
            <div className="animate-fadeIn">
              <label className="block text-xs font-bold text-gray-700 mb-1">Select Supplier</label>
              <select
                value={selectedSupplier}
                onChange={(e) => setSelectedSupplier(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-primary-500 focus:bg-white"
              >
                <option value="">Choose supplier...</option>
                {suppliers.map(sup => (
                  <option key={sup.id} value={sup.id}>{sup.name} ({sup.productCount} items)</option>
                ))}
              </select>
            </div>
          )}

          {/* Value Input */}
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">
              {updateType === 'percentage' ? 'Percentage Value (+ for increase, - for decrease)' : 'Amount in ₹ (+ or -)'}
            </label>
            <div className="relative">
              {updateType === 'percentage' ? (
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs font-bold">%</span>
              ) : (
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs font-bold">₹</span>
              )}
              <input
                type="number"
                placeholder={updateType === 'percentage' ? 'e.g., 10 for 10% hike or -5' : 'e.g., 100 or -50'}
                value={updateType === 'percentage' ? percentageValue : fixedValue}
                onChange={(e) => updateType === 'percentage' ? setPercentageValue(e.target.value) : setFixedValue(e.target.value)}
                className="w-full pl-7 pr-3 py-2 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-primary-500 focus:bg-white"
              />
            </div>
          </div>

          {/* Preview Trigger */}
          <button
            type="button"
            onClick={handlePreview}
            className="w-full py-2 text-xs font-bold bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl transition-all flex items-center justify-center gap-1.5"
          >
            <Filter size={13} />
            <span>Preview Affected Products</span>
          </button>

          {/* Preview Result */}
          {previewCount > 0 && (
            <div className="bg-primary-50/70 border border-primary-200 rounded-2xl p-3 animate-fadeIn flex items-center justify-between">
              <div>
                <p className="text-[10px] font-bold uppercase text-primary-800">Target Count</p>
                <p className="text-xl font-black text-primary-950">{previewCount} items</p>
              </div>
              <div className="text-right">
                <p className="text-[10px] font-bold uppercase text-primary-800">Shift</p>
                <p className="text-xs font-black text-primary-900">
                  {updateType === 'percentage' 
                    ? `${percentageValue}%` 
                    : `₹${fixedValue}`
                  }
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Apply Button & Safety Note */}
      <div className="space-y-2 pt-2 border-t border-gray-100">
        <button
          type="button"
          onClick={handleApply}
          disabled={isApplying || previewCount === 0}
          className="w-full py-2.5 text-xs font-bold text-white bg-primary-600 hover:bg-primary-700 rounded-xl transition-all flex items-center justify-center gap-2 shadow-2xs disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {isApplying ? (
            <>
              <RefreshCw size={14} className="animate-spin" />
              <span>Applying Updates...</span>
            </>
          ) : (
            <>
              <Save size={14} />
              <span>Apply Price Update</span>
            </>
          )}
        </button>

        <p className="text-[10px] text-gray-400 text-center">
          Changes will re-index real-time catalog prices for selected items.
        </p>
      </div>
    </div>
  );
}
