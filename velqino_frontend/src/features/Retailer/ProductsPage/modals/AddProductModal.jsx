'use client';

import React, { useState, useEffect } from 'react';
import { 
  X, 
  Upload, 
  Tag, 
  DollarSign, 
  Box, 
  Archive, 
  FileText, 
  Save, 
  Package, 
  Sparkles,
  TrendingUp,
  Image as ImageIcon
} from '../../../../utils/icons';
import { toast } from 'react-toastify';

export default function AddProductModal({ onClose, onSave, categories = [], isOpen }) {
  const [uploading, setUploading] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [selectedSizes, setSelectedSizes] = useState([]);
  const availableSizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL', '3XL'];
  
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    cost: '',
    category_id: '',
    brand: '',
    description: '',
    stock: '',
    threshold: 10,
    status: 'active'
  });

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      setFormData({
        name: '',
        price: '',
        cost: '',
        category_id: '',
        brand: '',
        description: '',
        stock: '',
        threshold: 10,
        status: 'active'
      });
      setSelectedImage(null);
      setImagePreview(null);
      setSelectedSizes([]);
    }
  }, [isOpen]);

  const handleImageSelect = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image size should be less than 5MB');
        return;
      }
      if (!file.type.startsWith('image/')) {
        toast.error('Please select an image file');
        return;
      }
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const toggleSize = (size) => {
    if (selectedSizes.includes(size)) {
      setSelectedSizes(selectedSizes.filter(s => s !== size));
    } else {
      setSelectedSizes([...selectedSizes, size]);
    }
  };

  const priceNum = Number(formData.price || 0);
  const costNum = Number(formData.cost || 0);
  const profitMargin = priceNum > 0 && costNum > 0 ? Math.round(((priceNum - costNum) / priceNum) * 100) : null;

  const handleSubmit = async (e) => {
    e?.preventDefault();
    
    if (!formData.name.trim()) {
      toast.error('Please enter product name');
      return;
    }
    if (!formData.price) {
      toast.error('Please enter selling price');
      return;
    }
    if (!selectedImage) {
      toast.error('Please select a product image');
      return;
    }
    if (!formData.category_id) {
      toast.error('Please select a category');
      return;
    }

    setUploading(true);
    try {
      const submitData = new FormData();
      submitData.append('name', formData.name.trim());
      submitData.append('price', formData.price);
      submitData.append('cost', formData.cost || 0);
      submitData.append('category_id', formData.category_id || '');
      submitData.append('brand', formData.brand || '');
      submitData.append('description', formData.description || '');
      submitData.append('stock', formData.stock || 1);
      submitData.append('threshold', formData.threshold || 10);
      submitData.append('status', formData.status || 'active');
      
      if (selectedImage) {
        submitData.append('images', selectedImage);
      }
      
      if (selectedSizes.length > 0) {
        selectedSizes.forEach(size => {
          submitData.append('sizes', size);
        });
      }
      
      if (onSave) {
        await onSave(submitData);
      }
    } catch (error) {
      console.error('Error adding product:', error);
    } finally {
      setUploading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden animate-fadeIn">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-xs transition-opacity" 
        onClick={onClose} 
      />
      
      {/* Right Drawer */}
      <div className="absolute inset-y-0 right-0 w-full max-w-2xl bg-white shadow-2xl flex flex-col justify-between overflow-hidden">
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-gray-100 flex items-center justify-between bg-white z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-primary-50 text-primary-600 flex items-center justify-center border border-primary-200/60 shadow-2xs">
              <Package size={20} />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black text-gray-900 tracking-tight">Add New Product</h2>
              <p className="text-xs text-gray-500">Create a SKU lot in your retail inventory</p>
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

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-5">
          {/* Image Upload Dropzone */}
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1.5">
              Primary Product Photo <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageSelect}
                className="hidden"
                id="add-product-image-file"
              />
              <label
                htmlFor="add-product-image-file"
                className={`
                  flex flex-col items-center justify-center w-full h-44 border-2 border-dashed rounded-2xl cursor-pointer transition-all
                  ${imagePreview 
                    ? 'border-primary-400 bg-primary-50/20' 
                    : 'border-gray-200 bg-gray-50/60 hover:bg-gray-50 hover:border-primary-400'
                  }
                `}
              >
                {imagePreview ? (
                  <div className="relative w-full h-full p-2 flex items-center justify-center">
                    <img 
                      src={imagePreview} 
                      alt="Preview" 
                      className="max-h-full max-w-full object-contain rounded-xl" 
                    />
                    <span className="absolute bottom-3 right-3 text-[10px] font-bold px-2.5 py-1 rounded-lg bg-gray-900/80 text-white backdrop-blur-xs">
                      Click to Replace
                    </span>
                  </div>
                ) : (
                  <div className="flex flex-col items-center text-center p-4">
                    <div className="w-12 h-12 rounded-2xl bg-primary-50 text-primary-600 flex items-center justify-center mb-2 shadow-2xs">
                      <Upload size={20} />
                    </div>
                    <span className="text-xs font-bold text-gray-800">Upload Product Image</span>
                    <span className="text-[11px] text-gray-400 mt-0.5">PNG, JPG or WEBP up to 5MB</span>
                  </div>
                )}
              </label>
            </div>
          </div>

          {/* Product Name */}
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">
              Product Title <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              name="name"
              placeholder="e.g. Slim-Fit Cotton Chino Pants"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-3.5 py-2.5 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-primary-500 focus:bg-white transition-all"
              required
            />
          </div>

          {/* Category & Brand (2 Cols) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                Category <span className="text-rose-500">*</span>
              </label>
              <select
                name="category_id"
                value={formData.category_id}
                onChange={handleChange}
                className="w-full px-3 py-2.5 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-primary-500 focus:bg-white"
                required
              >
                <option value="">Select category...</option>
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
                name="brand"
                placeholder="e.g. Velqino, Raymond"
                value={formData.brand}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-primary-500 focus:bg-white"
              />
            </div>
          </div>

          {/* Pricing & Cost with Dynamic Profit Margin */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-bold text-gray-700">
                Financials (₹) <span className="text-rose-500">*</span>
              </label>
              {profitMargin !== null && (
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 ${
                  profitMargin > 0 ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-rose-50 text-rose-700'
                }`}>
                  <TrendingUp size={11} />
                  <span>{profitMargin}% estimated profit margin</span>
                </span>
              )}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <span className="text-[10px] text-gray-400 font-bold uppercase">Selling Price (₹)</span>
                <input
                  type="number"
                  name="price"
                  placeholder="0.00"
                  value={formData.price}
                  onChange={handleChange}
                  className="w-full mt-1 px-3.5 py-2.5 text-xs font-bold bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-primary-500 focus:bg-white"
                  required
                />
              </div>

              <div>
                <span className="text-[10px] text-gray-400 font-bold uppercase">Cost Price (₹)</span>
                <input
                  type="number"
                  name="cost"
                  placeholder="0.00"
                  value={formData.cost}
                  onChange={handleChange}
                  className="w-full mt-1 px-3.5 py-2.5 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-primary-500 focus:bg-white"
                />
              </div>
            </div>
          </div>

          {/* Stock & Low Threshold (2 Cols) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                Initial Stock Units
              </label>
              <input
                type="number"
                name="stock"
                placeholder="10"
                value={formData.stock}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-primary-500 focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                Low Stock Alert Threshold
              </label>
              <input
                type="number"
                name="threshold"
                placeholder="10"
                value={formData.threshold}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-primary-500 focus:bg-white"
              />
            </div>
          </div>

          {/* Sizes Chips */}
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1.5">
              Available Sizes / Variants
            </label>
            <div className="flex flex-wrap gap-2">
              {availableSizes.map(size => {
                const isSelected = selectedSizes.includes(size);
                return (
                  <button
                    key={size}
                    type="button"
                    onClick={() => toggleSize(size)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                      isSelected 
                        ? 'bg-primary-600 text-white shadow-2xs' 
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {size}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">
              Description & Fabric Details
            </label>
            <textarea
              name="description"
              rows={3}
              placeholder="Provide product highlights, wash instructions, or fabric composition..."
              value={formData.description}
              onChange={handleChange}
              className="w-full px-3.5 py-2.5 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-primary-500 focus:bg-white"
            />
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
            disabled={uploading}
            className="px-6 py-2.5 text-xs font-bold text-white bg-primary-600 hover:bg-primary-700 rounded-xl transition-all shadow-2xs flex items-center gap-2 disabled:opacity-50 active:scale-95"
          >
            {uploading ? (
              <>
                <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Creating Product...</span>
              </>
            ) : (
              <>
                <Save size={14} />
                <span>Save to Inventory</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}