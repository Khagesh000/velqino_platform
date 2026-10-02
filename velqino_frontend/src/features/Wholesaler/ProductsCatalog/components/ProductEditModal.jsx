"use client";

import React, { useState, useEffect } from 'react';
import {
  X,
  Package,
  DollarSign,
  Box,
  Save,
  Eye,
  Upload,
  Trash2,
  AlertCircle
} from '../../../../utils/icons';
import '../../../../styles/Wholesaler/ProductsCatalog/ProductEditModal.scss';
import { useCreateProductMutation, useUpdateProductMutation, useGetProductQuery } from '@/redux/wholesaler/slices/productsSlice';
import { toast } from 'react-toastify';

export default function ProductEditModal({ product = null, onClose, onSave, categories = [] }) {
  const [createProduct, { isLoading: isCreating }] = useCreateProductMutation();
  const [updateProduct, { isLoading: isUpdating }] = useUpdateProductMutation();
  const [selectedSizes, setSelectedSizes] = useState([]);
  const [selectedImages, setSelectedImages] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [errors, setErrors] = useState({});
  const availableSizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL', '28', '30', '32', '34', '36', '38', '40'];
  
  const isLoading = isCreating || isUpdating;
  
  const { data: fullProductData } = useGetProductQuery(product?.id, {
    skip: !product?.id
  });
  
  const actualProduct = fullProductData?.data || product;
  
  const [formData, setFormData] = useState({
    name: '',
    sku: '',
    category_id: '',
    brand: '',
    description: '',
    price: '',
    compare_price: '',
    cost: '',
    threshold: 10,
    weight: '',
    status: 'draft',
    pattern: '',
    primary_color: '',
  });

  useEffect(() => {
    if (actualProduct) {
      setFormData({
        name: actualProduct.name || '',
        sku: actualProduct.sku || '',
        category_id: actualProduct.category_id || actualProduct.category || '',
        brand: actualProduct.brand || '',
        description: actualProduct.description || '',
        price: actualProduct.price || '',
        compare_price: actualProduct.compare_price || '',
        cost: actualProduct.cost || '',
        threshold: actualProduct.threshold || 10,
        weight: actualProduct.weight || '',
        status: actualProduct.status || 'draft',
        pattern: actualProduct.pattern || '',
        primary_color: actualProduct.primary_color || '',
      });
      
      if (actualProduct.variants && actualProduct.variants.length > 0) {
        setSelectedSizes(actualProduct.variants.map(v => v.size));
      } else {
        setSelectedSizes([]);
      }
    } else {
      setFormData({
        name: '',
        sku: '',
        category_id: '',
        brand: '',
        description: '',
        price: '',
        compare_price: '',
        cost: '',
        threshold: 10,
        weight: '',
        status: 'draft',
        pattern: '',
        primary_color: '',
      });
      setSelectedSizes([]);
    }
  }, [actualProduct]);

  const toggleSize = (size) => {
    setSelectedSizes(prev => prev.includes(size) ? prev.filter(s => s !== size) : [...prev, size]);
  };

  const handleImageSelect = (e) => {
    const files = Array.from(e.target.files);
    setSelectedImages(prev => [...prev, ...files]);
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Clear validation error if user types
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name?.trim()) {
      newErrors.name = 'Product title is required';
    }
    if (!formData.price || Number(formData.price) <= 0) {
      newErrors.price = 'Wholesale price is required (must be > 0)';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) {
      toast.error('Please fill in all required fields marked with *');
      return;
    }
    
    setUploading(true);
    
    const payload = new FormData();
    payload.append('name', formData.name.trim());
    payload.append('price', formData.price);
    payload.append('sku', formData.sku || '');
    payload.append('cost', formData.cost || '');
    payload.append('category_id', formData.category_id || '');
    payload.append('brand', formData.brand || '');
    payload.append('description', formData.description || '');
    payload.append('threshold', (formData.threshold || 10).toString());
    payload.append('weight', formData.weight || '');
    payload.append('status', formData.status);
    payload.append('pattern', formData.pattern || '');
    payload.append('primary_color', formData.primary_color || '');
    
    if (selectedSizes.length > 0) {
      selectedSizes.forEach(size => payload.append('sizes', size));
    }
    
    if (selectedImages.length > 0) {
      selectedImages.forEach(image => payload.append('images', image));
    }
    
    try {
      let result;
      if (actualProduct?.id) {
        result = await updateProduct({ 
          productId: actualProduct.id, 
          data: payload 
        }).unwrap();
        toast.success('Product updated successfully!');
      } else {
        result = await createProduct(payload).unwrap();
        toast.success('Product created successfully!');
      }
      
      onSave?.(result);
      onClose();
    } catch (error) {
      console.error('Save product error:', error);
      toast.error(error?.data?.message || 'Failed to save product');
      setUploading(false);
    }
  };

  return (
    <div className="product-edit-modal bg-white h-full flex flex-col w-full overflow-hidden">
      {/* Header */}
      <div className="px-5 sm:px-6 py-4 border-b border-slate-100 flex items-center justify-between flex-shrink-0 bg-white">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary-100 flex items-center justify-center text-primary-600 shadow-sm flex-shrink-0">
            <Package size={20} />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-bold text-slate-900">
              {product ? 'Edit Product' : 'Add New Product'}
            </h2>
            <p className="text-xs text-slate-500 truncate max-w-[200px] sm:max-w-none">
              {product ? `Editing: ${product.name}` : 'Fill in the information below to add a new product'}
            </p>
          </div>
        </div>
        <button 
          onClick={onClose} 
          className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-colors"
          aria-label="Close modal"
        >
          <X size={18} />
        </button>
      </div>

      {/* Single Scrollable Form View (No separate tabs) */}
      <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6">
        
        {/* Section 1: Basic Information */}
        <div className="bg-slate-50/60 border border-slate-200/80 rounded-2xl p-4 sm:p-5 space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-200/60">
            <div className="w-7 h-7 rounded-lg bg-primary-100 flex items-center justify-center text-primary-600">
              <Package size={15} />
            </div>
            <h3 className="text-sm font-bold text-slate-900">Basic Information</h3>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Product Title <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className={`w-full px-3.5 py-2.5 bg-white border rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:outline-none transition-all ${
                errors.name 
                  ? 'border-rose-400 focus:border-rose-500 focus:ring-4 focus:ring-rose-500/10' 
                  : 'border-slate-200 focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10'
              }`}
              placeholder="e.g., Slim Fit Cotton Track Pants"
            />
            {errors.name && (
              <p className="text-xs text-rose-500 font-medium mt-1.5 flex items-center gap-1">
                <AlertCircle size={12} />
                <span>{errors.name}</span>
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Category
              </label>
              <select
                name="category_id"
                value={formData.category_id}
                onChange={handleInputChange}
                className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-none focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 transition-all"
              >
                <option value="">Select Category</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Brand Name
              </label>
              <input
                type="text"
                name="brand"
                value={formData.brand}
                onChange={handleInputChange}
                className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 transition-all"
                placeholder="e.g., Velqino Premium"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Primary Color
              </label>
              <input
                type="text"
                name="primary_color"
                value={formData.primary_color}
                onChange={handleInputChange}
                className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 transition-all"
                placeholder="e.g., Black, Olive Green"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Pattern / Style
              </label>
              <input
                type="text"
                name="pattern"
                value={formData.pattern}
                onChange={handleInputChange}
                className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 transition-all"
                placeholder="e.g., Solid, Striped, Printed"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Product Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows={3}
              className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 transition-all"
              placeholder="Describe material, specifications, fit, care instructions..."
            />
          </div>
        </div>

        {/* Section 2: Pricing & Valuation */}
        <div className="bg-slate-50/60 border border-slate-200/80 rounded-2xl p-4 sm:p-5 space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-200/60">
            <div className="w-7 h-7 rounded-lg bg-primary-100 flex items-center justify-center text-primary-600">
              <DollarSign size={15} />
            </div>
            <h3 className="text-sm font-bold text-slate-900">Pricing & Cost</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Wholesale Price (₹) <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-sm">₹</span>
                <input
                  type="number"
                  step="0.01"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  className={`w-full pl-8 pr-3.5 py-2.5 bg-white border rounded-xl text-sm text-slate-900 font-semibold focus:outline-none transition-all ${
                    errors.price 
                      ? 'border-rose-400 focus:border-rose-500 focus:ring-4 focus:ring-rose-500/10' 
                      : 'border-slate-200 focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10'
                  }`}
                  placeholder="0.00"
                />
              </div>
              {errors.price && (
                <p className="text-xs text-rose-500 font-medium mt-1.5 flex items-center gap-1">
                  <AlertCircle size={12} />
                  <span>{errors.price}</span>
                </p>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Compare At / MRP (₹)
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-sm">₹</span>
                <input
                  type="number"
                  step="0.01"
                  name="compare_price"
                  value={formData.compare_price}
                  onChange={handleInputChange}
                  className="w-full pl-8 pr-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-none focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 transition-all"
                  placeholder="0.00"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Cost per Item (₹)
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-sm">₹</span>
                <input
                  type="number"
                  step="0.01"
                  name="cost"
                  value={formData.cost}
                  onChange={handleInputChange}
                  className="w-full pl-8 pr-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-none focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 transition-all"
                  placeholder="Internal procurement cost"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Weight
              </label>
              <input
                type="text"
                name="weight"
                value={formData.weight}
                onChange={handleInputChange}
                className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-none focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 transition-all"
                placeholder="e.g., 450g or 0.45kg"
              />
            </div>
          </div>
        </div>

        {/* Section 3: Inventory, Sizes & Media */}
        <div className="bg-slate-50/60 border border-slate-200/80 rounded-2xl p-4 sm:p-5 space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-200/60">
            <div className="w-7 h-7 rounded-lg bg-primary-100 flex items-center justify-center text-primary-600">
              <Box size={15} />
            </div>
            <h3 className="text-sm font-bold text-slate-900">Inventory & Media</h3>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Low Stock Alert Threshold
            </label>
            <input
              type="number"
              name="threshold"
              value={formData.threshold}
              onChange={handleInputChange}
              className="w-full max-w-xs px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-none focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 transition-all"
              placeholder="10"
            />
            <p className="text-xs text-slate-500 mt-1">Triggers low stock alert when inventory reaches this amount or less.</p>
          </div>

          {/* Size Variants */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
              Available Sizes
            </label>
            <div className="flex flex-wrap gap-2">
              {availableSizes.map(size => {
                const isSelected = selectedSizes.includes(size);
                return (
                  <button
                    key={size}
                    type="button"
                    onClick={() => toggleSize(size)}
                    className={`px-3.5 py-1.5 text-xs font-bold rounded-xl border transition-all ${
                      isSelected
                        ? 'bg-primary-600 text-white border-primary-600 shadow-sm'
                        : 'bg-white text-slate-700 border-slate-200 hover:border-primary-300 hover:bg-slate-50'
                    }`}
                  >
                    {size}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Media Upload Area */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
              Product Images
            </label>
            <div className="border-2 border-dashed border-slate-200 hover:border-primary-400 bg-white hover:bg-primary-50/20 rounded-2xl p-6 text-center transition-all cursor-pointer">
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageSelect}
                className="hidden"
                id="image-upload"
              />
              <label htmlFor="image-upload" className="cursor-pointer block">
                <div className="w-12 h-12 rounded-xl bg-primary-50 text-primary-600 flex items-center justify-center mx-auto mb-2.5">
                  <Upload size={22} />
                </div>
                <p className="text-sm font-semibold text-slate-800 mb-0.5">Click to browse or drop images here</p>
                <p className="text-xs text-slate-400">Supports JPG, PNG, WEBP</p>
              </label>
            </div>

            {selectedImages.length > 0 && (
              <div className="grid grid-cols-4 sm:grid-cols-6 gap-3 mt-4">
                {selectedImages.map((img, idx) => (
                  <div key={idx} className="relative aspect-square bg-slate-100 rounded-xl overflow-hidden border border-slate-200 shadow-xs">
                    <img 
                      src={URL.createObjectURL(img)} 
                      alt="preview" 
                      className="w-full h-full object-cover" 
                    />
                    <button 
                      type="button"
                      onClick={() => setSelectedImages(prev => prev.filter((_, i) => i !== idx))}
                      className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-rose-600 text-white flex items-center justify-center shadow-md hover:bg-rose-700 transition-colors"
                      title="Remove image"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Section 4: Visibility Status */}
        <div className="bg-slate-50/60 border border-slate-200/80 rounded-2xl p-4 sm:p-5 space-y-3">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-200/60">
            <div className="w-7 h-7 rounded-lg bg-primary-100 flex items-center justify-center text-primary-600">
              <Eye size={15} />
            </div>
            <h3 className="text-sm font-bold text-slate-900">Visibility & Status</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              { id: 'active', label: 'Active & Live', desc: 'Visible to retailers in the marketplace' },
              { id: 'draft', label: 'Draft', desc: 'Saved privately for further review' }
            ].map(st => {
              const isSelected = formData.status === st.id;
              return (
                <label
                  key={st.id}
                  className={`p-3.5 rounded-xl border-2 cursor-pointer transition-all flex items-start gap-3 ${
                    isSelected
                      ? 'border-primary-500 bg-primary-50/40 shadow-xs'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <input
                    type="radio"
                    name="status"
                    value={st.id}
                    checked={isSelected}
                    onChange={handleInputChange}
                    className="mt-1 text-primary-600 focus:ring-primary-500"
                  />
                  <div>
                    <p className="text-sm font-bold text-slate-900">{st.label}</p>
                    <p className="text-xs text-slate-500 mt-0.5">{st.desc}</p>
                  </div>
                </label>
              );
            })}
          </div>
        </div>

      </div>

      {/* Sticky Footer */}
      <div className="px-5 sm:px-6 py-4 border-t border-slate-100 bg-slate-50/80 backdrop-blur-sm flex items-center justify-between gap-3 flex-shrink-0">
        <button 
          type="button"
          onClick={onClose} 
          className="px-4 py-2.5 text-sm font-medium text-slate-700 bg-white border border-slate-200 rounded-xl hover:bg-slate-100 transition-colors"
        >
          Cancel
        </button>
        <button 
          type="button"
          onClick={handleSave}
          disabled={uploading || isLoading}
          className="px-6 py-2.5 text-sm font-semibold text-white bg-primary-600 hover:bg-primary-700 active:bg-primary-800 rounded-xl shadow-sm hover:shadow transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {uploading || isLoading ? (
            <>
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              <span>Saving...</span>
            </>
          ) : (
            <>
              <Save size={16} />
              <span>{product ? 'Update Product' : 'Publish Product'}</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
