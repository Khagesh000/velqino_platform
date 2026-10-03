'use client';

import React, { useState, useEffect, useRef } from 'react';
import { 
  X, 
  ChevronLeft, 
  ChevronRight, 
  Save, 
  Package, 
  DollarSign, 
  Tag, 
  Box, 
  Archive, 
  FileText, 
  TrendingUp, 
  AlertCircle,
  Sparkles,
  Edit3
} from '../../../../utils/icons';
import { useBulkEditProductsMutation } from '@/redux/retailer/slices/retailerProductsSlice';
import { toast } from 'react-toastify';

export default function BulkEditModal({ isOpen, onClose, products = [], onSave, categories = [] }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [bulkChanges, setBulkChanges] = useState({});
  const scrollContainerRef = useRef(null);
  const [bulkEditProducts] = useBulkEditProductsMutation();

  const [formData, setFormData] = useState({
    price: '',
    cost: '',
    category_id: '',
    brand: '',
    stock: '',
    threshold: '',
    status: ''
  });

  const currentProduct = products[currentIndex];

  useEffect(() => {
    if (isOpen && products.length > 0) {
      setCurrentIndex(0);
      setBulkChanges({});
      setFormData({
        price: '',
        cost: '',
        category_id: '',
        brand: '',
        stock: '',
        threshold: '',
        status: ''
      });
    }
  }, [isOpen, products]);

  const handleFieldChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    if (value !== '') {
      setBulkChanges(prev => ({ ...prev, [field]: value }));
    } else {
      setBulkChanges(prev => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  const scrollToProduct = (index) => {
    if (scrollContainerRef.current) {
      const cards = scrollContainerRef.current.children;
      if (cards[index]) {
        cards[index].scrollIntoView({
          behavior: 'smooth',
          block: 'nearest',
          inline: 'center'
        });
      }
    }
    setCurrentIndex(index);
  };

  const handleNext = () => {
    if (currentIndex < products.length - 1) {
      scrollToProduct(currentIndex + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      scrollToProduct(currentIndex - 1);
    }
  };

  const handleSubmit = async (e) => {
    e?.preventDefault();
    if (Object.keys(bulkChanges).length === 0) {
      toast.error('No changes entered to apply');
      return;
    }
    
    setUploading(true);
    try {
      const productIds = products.map(p => p.id);
      const payload = {
        product_ids: productIds,
        updates: bulkChanges
      };

      if (onSave) {
        await onSave(payload);
      } else {
        await bulkEditProducts(payload).unwrap();
        toast.success(`Successfully updated ${products.length} products`);
        onClose();
      }
    } catch (error) {
      toast.error(error?.data?.message || 'Failed to apply bulk edits');
    } finally {
      setUploading(false);
    }
  };

  if (!isOpen || products.length === 0) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden animate-fadeIn">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-xs transition-opacity" onClick={onClose} />
      
      <div className="absolute inset-y-0 right-0 w-full max-w-2xl bg-white shadow-2xl flex flex-col justify-between overflow-hidden">
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-gray-100 flex items-center justify-between bg-white z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-primary-50 text-primary-600 flex items-center justify-center border border-primary-200/60 shadow-2xs">
              <Edit3 size={20} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-black text-gray-900 tracking-tight">Bulk Edit Products</h2>
                <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-amber-100 text-amber-800">
                  {products.length} Selected
                </span>
              </div>
              <p className="text-xs text-gray-500">Apply uniform updates across multiple catalog items at once</p>
            </div>
          </div>
          <button 
            type="button"
            onClick={onClose} 
            className="p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-xl transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Selected Products Carousel Bar */}
        <div className="bg-gray-50/70 p-3 sm:p-4 border-b border-gray-100">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-gray-700">
              Selected Item {currentIndex + 1} of {products.length}
            </span>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={handlePrev}
                disabled={currentIndex === 0}
                className="p-1 rounded-lg border border-gray-200 bg-white text-gray-600 disabled:opacity-40 hover:bg-gray-100"
              >
                <ChevronLeft size={14} />
              </button>
              <button
                type="button"
                onClick={handleNext}
                disabled={currentIndex === products.length - 1}
                className="p-1 rounded-lg border border-gray-200 bg-white text-gray-600 disabled:opacity-40 hover:bg-gray-100"
              >
                <ChevronRight size={14} />
              </button>
            </div>
          </div>

          <div ref={scrollContainerRef} className="flex gap-2 overflow-x-auto pb-1">
            {products.map((p, idx) => {
              const isCurrent = idx === currentIndex;
              const img = p.primary_image || p.images?.[0]?.image || p.image;
              return (
                <div
                  key={p.id}
                  onClick={() => setCurrentIndex(idx)}
                  className={`
                    w-28 flex-shrink-0 p-2 rounded-xl border cursor-pointer transition-all bg-white
                    ${isCurrent 
                      ? 'border-primary-500 ring-2 ring-primary-200 shadow-2xs' 
                      : 'border-gray-200/80 opacity-70 hover:opacity-100'
                    }
                  `}
                >
                  <div className="w-full aspect-square bg-gray-100 rounded-lg overflow-hidden mb-1 flex items-center justify-center">
                    {img ? (
                      <img src={img} alt={p.name} className="w-full h-full object-cover" />
                    ) : (
                      <Package size={16} className="text-gray-400" />
                    )}
                  </div>
                  <p className="text-[10px] font-bold text-gray-900 truncate">{p.name}</p>
                  <p className="text-[9px] font-mono text-gray-400 truncate">{p.sku}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-4">
          <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200/70 text-xs text-amber-800 flex items-start gap-2">
            <AlertCircle size={15} className="flex-shrink-0 mt-0.5 text-amber-600" />
            <span>
              Leave fields blank to preserve their existing values on the selected products. Only filled fields will overwrite current settings.
            </span>
          </div>

          {/* Pricing Updates */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                New Selling Price (₹)
              </label>
              <input
                type="number"
                placeholder="Preserve current price"
                value={formData.price}
                onChange={(e) => handleFieldChange('price', e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-primary-500 focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                New Cost Price (₹)
              </label>
              <input
                type="number"
                placeholder="Preserve current cost"
                value={formData.cost}
                onChange={(e) => handleFieldChange('cost', e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-primary-500 focus:bg-white"
              />
            </div>
          </div>

          {/* Category & Brand */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                Move to Category
              </label>
              <select
                value={formData.category_id}
                onChange={(e) => handleFieldChange('category_id', e.target.value)}
                className="w-full px-3 py-2.5 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-primary-500 focus:bg-white"
              >
                <option value="">Preserve current categories</option>
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                Brand / Manufacturer
              </label>
              <input
                type="text"
                placeholder="Preserve current brand"
                value={formData.brand}
                onChange={(e) => handleFieldChange('brand', e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-primary-500 focus:bg-white"
              />
            </div>
          </div>

          {/* Stock & Threshold */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                Set Stock Units
              </label>
              <input
                type="number"
                placeholder="Preserve current stock"
                value={formData.stock}
                onChange={(e) => handleFieldChange('stock', e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-primary-500 focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                Reorder Threshold
              </label>
              <input
                type="number"
                placeholder="Preserve current threshold"
                value={formData.threshold}
                onChange={(e) => handleFieldChange('threshold', e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-primary-500 focus:bg-white"
              />
            </div>
          </div>

          {/* Status */}
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">
              Catalog Visibility Status
            </label>
            <select
              value={formData.status}
              onChange={(e) => handleFieldChange('status', e.target.value)}
              className="w-full px-3 py-2.5 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-primary-500 focus:bg-white"
            >
              <option value="">Preserve current status</option>
              <option value="active">Active (Visible)</option>
              <option value="inactive">Inactive (Hidden)</option>
            </select>
          </div>
        </form>

        {/* Footer Bar */}
        <div className="p-4 sm:p-5 border-t border-gray-100 bg-gray-50/50 flex items-center justify-end gap-3 z-10">
          <button 
            type="button"
            onClick={onClose} 
            className="px-5 py-2.5 text-xs font-bold text-gray-600 hover:text-gray-900 border border-gray-200 rounded-xl hover:bg-gray-100 transition-colors"
          >
            Cancel
          </button>
          <button 
            type="button"
            onClick={handleSubmit}
            disabled={uploading || Object.keys(bulkChanges).length === 0}
            className="px-6 py-2.5 text-xs font-bold text-white bg-primary-600 hover:bg-primary-700 rounded-xl transition-all shadow-2xs flex items-center gap-2 disabled:opacity-40 active:scale-95"
          >
            {uploading ? (
              <>
                <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Applying to {products.length} Products...</span>
              </>
            ) : (
              <>
                <Save size={14} />
                <span>Apply to {products.length} Products</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}