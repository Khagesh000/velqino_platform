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
  Trash2,
  TrendingUp,
  Sparkles
} from '../../../../utils/icons';
import { toast } from 'react-toastify';

export default function EditProductModal({ isOpen, onClose, product, onSave, categories = [] }) {
  const [uploading, setUploading] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [deleteImage, setDeleteImage] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    sku: '',
    price: '',
    cost: '',
    category_id: '',
    brand: '',
    description: '',
    stock: '',
    threshold: 10,
    status: 'active'
  });

  const [selectedSizes, setSelectedSizes] = useState([]);
  const availableSizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL', '3XL'];

  useEffect(() => {
    if (isOpen && product) {
      setFormData({
        name: product.name || '',
        sku: product.sku || '',
        price: product.price || product.display_price || '',
        cost: product.cost || '',
        category_id: product.category_id || '',
        brand: product.brand || '',
        description: product.description || '',
        stock: product.stock ?? '',
        threshold: product.threshold || 10,
        status: product.status || 'active'
      });
      
      const primaryImg = product.primary_image || product.images?.[0]?.image || product.image;
      if (primaryImg) {
        setImagePreview(primaryImg);
      } else {
        setImagePreview(null);
      }
      
      if (product.variants && Array.isArray(product.variants)) {
        const sizes = product.variants.map(v => v.size).filter(Boolean);
        setSelectedSizes(sizes);
      } else {
        setSelectedSizes([]);
      }
      
      setSelectedImage(null);
      setDeleteImage(false);
    }
  }, [isOpen, product]);

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
      setDeleteImage(false);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setSelectedImage(null);
    setImagePreview(null);
    setDeleteImage(true);
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

    setUploading(true);
    try {
      const submitData = new FormData();
      submitData.append('name', formData.name.trim());
      submitData.append('price', formData.price);
      submitData.append('cost', formData.cost || 0);
      submitData.append('category_id', formData.category_id || '');
      submitData.append('brand', formData.brand || '');
      submitData.append('description', formData.description || '');
      submitData.append('stock', formData.stock || 0);
      submitData.append('threshold', formData.threshold || 10);
      submitData.append('status', formData.status || 'active');
      
      if (selectedImage) {
        submitData.append('images', selectedImage);
      }
      if (deleteImage) {
        submitData.append('delete_image', 'true');
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
      console.error('Error updating product:', error);
    } finally {
      setUploading(false);
    }
  };

  if (!isOpen || !product) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden animate-fadeIn">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-xs transition-opacity" onClick={onClose} />
      
      <div className="absolute inset-y-0 right-0 w-full max-w-2xl bg-white shadow-2xl flex flex-col justify-between overflow-hidden">
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-gray-100 flex items-center justify-between bg-white z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-primary-50 text-primary-600 flex items-center justify-center border border-primary-200/60 shadow-2xs">
              <Package size={20} />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black text-gray-900 tracking-tight">Edit Product</h2>
              <p className="text-xs font-mono text-gray-400">SKU: {formData.sku || 'N/A'}</p>
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
          {/* Photo Management */}
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1.5">
              Product Photo
            </label>
            <div className="relative">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageSelect}
                className="hidden"
                id="edit-product-image-file"
              />
              <div className="flex items-center gap-4 p-3 bg-gray-50 rounded-2xl border border-gray-200">
                <div className="w-20 h-20 rounded-xl bg-white border border-gray-200 overflow-hidden flex items-center justify-center flex-shrink-0">
                  {imagePreview ? (
                    <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                  ) : (
                    <Package size={28} className="text-gray-300" />
                  )}
                </div>

                <div className="flex-1 space-y-1.5">
                  <div className="flex items-center gap-2">
                    <label
                      htmlFor="edit-product-image-file"
                      className="px-3 py-1.5 bg-white border border-gray-200 rounded-xl text-xs font-bold text-gray-700 hover:bg-gray-100 cursor-pointer transition-colors shadow-2xs"
                    >
                      Change Photo
                    </label>
                    {imagePreview && (
                      <button
                        type="button"
                        onClick={handleRemoveImage}
                        className="px-3 py-1.5 bg-rose-50 border border-rose-200 rounded-xl text-xs font-bold text-rose-700 hover:bg-rose-100 transition-colors"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                  <p className="text-[10px] text-gray-400">JPG, PNG, or WEBP up to 5MB</p>
                </div>
              </div>
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
              value={formData.name}
              onChange={handleChange}
              className="w-full px-3.5 py-2.5 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-primary-500 focus:bg-white"
              required
            />
          </div>

          {/* Category & Brand */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                Category
              </label>
              <select
                name="category_id"
                value={formData.category_id}
                onChange={handleChange}
                className="w-full px-3 py-2.5 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-primary-500 focus:bg-white"
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
                value={formData.brand}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-primary-500 focus:bg-white"
              />
            </div>
          </div>

          {/* Price & Cost */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-bold text-gray-700">Financials (₹)</label>
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
                  value={formData.cost}
                  onChange={handleChange}
                  className="w-full mt-1 px-3.5 py-2.5 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-primary-500 focus:bg-white"
                />
              </div>
            </div>
          </div>

          {/* Stock & Low Threshold */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                Current Stock (Units)
              </label>
              <input
                type="number"
                name="stock"
                value={formData.stock}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-primary-500 focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                Reorder Threshold
              </label>
              <input
                type="number"
                name="threshold"
                value={formData.threshold}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-primary-500 focus:bg-white"
              />
            </div>
          </div>

          {/* Sizes */}
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1.5">
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
              Description
            </label>
            <textarea
              name="description"
              rows={3}
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
                <span>Saving Changes...</span>
              </>
            ) : (
              <>
                <Save size={14} />
                <span>Update Product</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}