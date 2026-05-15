'use client';

import React, { useState, useEffect, useRef } from 'react';
import { X, ChevronLeft, ChevronRight, Save, Package, DollarSign, Tag, Box, Archive, FileText, TrendingUp, AlertCircle } from '../../../../utils/icons';
import { useBulkEditProductsMutation } from '@/redux/retailer/slices/retailerProductsSlice';
import { toast } from 'react-toastify';


export default function BulkEditModal({ isOpen, onClose, products = [], onSave, categories = [] }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [bulkChanges, setBulkChanges] = useState({});
  const scrollContainerRef = useRef(null);
  const [bulkEditProducts, { isLoading: isBulkEditing }] = useBulkEditProductsMutation();

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

  // Reset when modal opens
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
    setFormData({
      ...formData,
      [field]: value
    });
    
    if (value !== '') {
      setBulkChanges({
        ...bulkChanges,
        [field]: value
      });
    } else {
      const newChanges = { ...bulkChanges };
      delete newChanges[field];
      setBulkChanges(newChanges);
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

  const handleSubmit = async () => {
    if (Object.keys(bulkChanges).length === 0) {
        toast.error('No changes to apply');
        return;
    }
    
    setUploading(true);
    try {
        const productIds = products.map(p => p.id);
        const payload = {
            product_ids: productIds,
            updates: bulkChanges
        };
        
        // ✅ Call the API mutation
        const response = await bulkEditProducts(payload).unwrap();
        
        toast.success(`${products.length} products updated successfully`);
        onClose();
    } catch (error) {
        toast.error(error?.data?.message || 'Failed to update products');
        console.error(error);
    } finally {
        setUploading(false);
    }
};

  const hasChanges = Object.keys(bulkChanges).length > 0;

  if (!isOpen || products.length === 0) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      
      <div className="absolute inset-y-0 right-0 w-full max-w-2xl pt-[56px] pb-[70px] sm:pt-20 sm:pb-16">
        <div className="h-full bg-white rounded-l-2xl shadow-xl overflow-y-auto">
          <div className="p-6">
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary-100 flex items-center justify-center">
                  <TrendingUp size={20} className="text-primary-600" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Bulk Edit Products</h2>
                  <p className="text-sm text-gray-500">Update {products.length} products at once</p>
                </div>
              </div>
              <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition-all">
                <X size={20} className="text-gray-500" />
              </button>
            </div>

            {/* Product Carousel */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-500">Products</span>
                  <span className="text-sm font-semibold text-primary-600">{currentIndex + 1} / {products.length}</span>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={handlePrev}
                    disabled={currentIndex === 0}
                    className="p-1 rounded-lg border border-gray-300 disabled:opacity-50 hover:bg-gray-50"
                  >
                    <ChevronLeft size={16} />
                  </button>
                  <button
                    onClick={handleNext}
                    disabled={currentIndex === products.length - 1}
                    className="p-1 rounded-lg border border-gray-300 disabled:opacity-50 hover:bg-gray-50"
                  >
                    <ChevronRight size={16} />
                  </button>
                </div>
              </div>

              {/* Horizontal Scroll Product Cards */}
              <div
                ref={scrollContainerRef}
                className="flex gap-3 overflow-x-auto pb-2 scroll-smooth hide-scrollbar"
                style={{ scrollbarWidth: 'none' }}
              >
                {products.map((product, idx) => (
                  <div
                    key={product.id}
                    onClick={() => scrollToProduct(idx)}
                    className={`flex-shrink-0 w-32 p-3 rounded-lg border-2 cursor-pointer transition-all ${
                      currentIndex === idx
                        ? 'border-primary-500 bg-primary-50'
                        : 'border-gray-200 hover:border-primary-300'
                    }`}
                  >
                    <div className="w-full h-16 bg-gray-100 rounded-lg flex items-center justify-center mb-2 overflow-hidden">
                      {product.primary_image || product.images?.[0]?.image ? (
                        <img
                          src={product.primary_image || product.images?.[0]?.image}
                          alt={product.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <Package size={24} className="text-gray-400" />
                      )}
                    </div>
                    <p className="text-xs font-medium text-gray-800 truncate">{product.name}</p>
                    <p className="text-[10px] text-gray-500">₹{product.price}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Current Product Preview */}
            <div className="mb-6 p-4 bg-gray-50 rounded-lg">
              <h3 className="text-sm font-medium text-gray-700 mb-2">Currently Editing:</h3>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center overflow-hidden">
                  {currentProduct?.primary_image || currentProduct?.images?.[0]?.image ? (
                    <img
                      src={currentProduct?.primary_image || currentProduct?.images?.[0]?.image}
                      alt={currentProduct?.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <Package size={20} className="text-gray-400" />
                  )}
                </div>
                <div>
                  <p className="font-semibold text-gray-900">{currentProduct?.name}</p>
                  <p className="text-xs text-gray-500">SKU: {currentProduct?.sku}</p>
                  <p className="text-sm font-bold text-primary-600">₹{currentProduct?.price}</p>
                </div>
              </div>
            </div>

            {/* Bulk Edit Fields */}
            <div className="space-y-4">
              <div className="border-b border-gray-200 pb-2 mb-2">
                <h3 className="text-sm font-medium text-gray-900">Apply to all {products.length} products:</h3>
              </div>

              {/* Price */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Price (Selling)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">₹</span>
                  <input
                    type="number"
                    value={formData.price}
                    onChange={(e) => handleFieldChange('price', e.target.value)}
                    placeholder="Enter new price"
                    className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary-500"
                  />
                </div>
                {bulkChanges.price && (
                  <p className="text-xs text-green-600 mt-1">Will set price to ₹{bulkChanges.price} for all products</p>
                )}
              </div>

              {/* Cost */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Cost (Your expense)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">₹</span>
                  <input
                    type="number"
                    value={formData.cost}
                    onChange={(e) => handleFieldChange('cost', e.target.value)}
                    placeholder="Enter new cost"
                    className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary-500"
                  />
                </div>
                {bulkChanges.cost && (
                  <p className="text-xs text-green-600 mt-1">Will set cost to ₹{bulkChanges.cost} for all products</p>
                )}
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <select
                  value={formData.category_id}
                  onChange={(e) => handleFieldChange('category_id', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary-500"
                >
                  <option value="">-- No change --</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
                {bulkChanges.category_id && (
                  <p className="text-xs text-green-600 mt-1">Will change category for all products</p>
                )}
              </div>

              {/* Brand */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Brand</label>
                <input
                  type="text"
                  value={formData.brand}
                  onChange={(e) => handleFieldChange('brand', e.target.value)}
                  placeholder="Enter brand name"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary-500"
                />
                {bulkChanges.brand && (
                  <p className="text-xs text-green-600 mt-1">Will set brand to "{bulkChanges.brand}" for all products</p>
                )}
              </div>

              {/* Stock */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Stock Quantity
                </label>
                <input
                  type="number"
                  value={formData.stock}
                  onChange={(e) => handleFieldChange('stock', e.target.value)}
                  placeholder="Enter stock quantity"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary-500"
                />
                {bulkChanges.stock && (
                  <p className="text-xs text-green-600 mt-1">Will set stock to {bulkChanges.stock} for all products</p>
                )}
              </div>

              {/* Threshold */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Low Stock Alert
                </label>
                <input
                  type="number"
                  value={formData.threshold}
                  onChange={(e) => handleFieldChange('threshold', e.target.value)}
                  placeholder="Enter alert threshold"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary-500"
                />
                {bulkChanges.threshold && (
                  <p className="text-xs text-green-600 mt-1">Will set alert at {bulkChanges.threshold} for all products</p>
                )}
              </div>

              {/* Status */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => handleFieldChange('status', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary-500"
                >
                  <option value="">-- No change --</option>
                  <option value="active">Active</option>
                  <option value="draft">Draft</option>
                  <option value="archived">Archived</option>
                </select>
                {bulkChanges.status && (
                  <p className="text-xs text-green-600 mt-1">Will set status to {bulkChanges.status} for all products</p>
                )}
              </div>
            </div>

            {/* Changes Summary */}
            {hasChanges && (
              <div className="mt-6 p-3 bg-primary-50 rounded-lg">
                <div className="flex items-start gap-2">
                  <AlertCircle size={14} className="text-primary-500 mt-0.5" />
                  <div className="text-xs text-primary-700">
                    <p className="font-medium mb-1">Changes to apply:</p>
                    <ul className="list-disc list-inside">
                      {bulkChanges.price && <li>Price: ₹{bulkChanges.price}</li>}
                      {bulkChanges.cost && <li>Cost: ₹{bulkChanges.cost}</li>}
                      {bulkChanges.category_id && <li>Category: Changed</li>}
                      {bulkChanges.brand && <li>Brand: {bulkChanges.brand}</li>}
                      {bulkChanges.stock && <li>Stock: {bulkChanges.stock}</li>}
                      {bulkChanges.threshold && <li>Low Stock Alert: {bulkChanges.threshold}</li>}
                      {bulkChanges.status && <li>Status: {bulkChanges.status}</li>}
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-3 mt-6 pt-4 border-t border-gray-200">
              <button
                onClick={onClose}
                disabled={uploading}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={uploading || !hasChanges}
                className="flex-1 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {uploading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Updating...
                  </>
                ) : (
                  <>
                    <Save size={16} />
                    Update {products.length} Products
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}