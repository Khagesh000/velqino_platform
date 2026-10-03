'use client';

import React, { useState, useEffect } from 'react';
import { 
  X, 
  Upload, 
  ImageIcon, 
  Package, 
  DollarSign, 
  Tag, 
  Box, 
  Archive, 
  FileText, 
  Save, 
  Plus, 
  Trash2,
  Sparkles,
  CheckCircle
} from '../../../../utils/icons';
import { useBulkImagesSameMutation } from '@/redux/retailer/slices/retailerProductsSlice';
import { toast } from 'react-toastify';

export default function BulkImagesModal({ onClose, onSave, categories = [], isOpen }) {
  const [uploading, setUploading] = useState(false);
  const [images, setImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [progress, setProgress] = useState(0);
  
  const [formData, setFormData] = useState({
    common_price: '',
    common_cost: '',
    category_id: '',
    common_name_prefix: '',
    brand: '',
    description: '',
    stock: '10',
    threshold: 5,
    status: 'active'
  });

  const [selectedSizes, setSelectedSizes] = useState([]);
  const availableSizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL', '3XL'];
  const [bulkImagesSame] = useBulkImagesSameMutation();

  useEffect(() => {
    if (isOpen) {
      setFormData({
        common_price: '',
        common_cost: '',
        category_id: '',
        common_name_prefix: '',
        brand: '',
        description: '',
        stock: '10',
        threshold: 5,
        status: 'active'
      });
      setImages([]);
      setImagePreviews([]);
      setSelectedSizes([]);
      setProgress(0);
    }
  }, [isOpen]);

  const handleImageSelect = (e) => {
    const files = Array.from(e.target.files || []);
    const validFiles = files.filter(file => {
      if (!file.type.startsWith('image/')) {
        toast.error(`${file.name} is not an image file`);
        return false;
      }
      if (file.size > 5 * 1024 * 1024) {
        toast.error(`${file.name} exceeds 5MB limit`);
        return false;
      }
      return true;
    });

    if (validFiles.length + images.length > 25) {
      toast.error('Maximum 25 images per batch upload');
      return;
    }

    setImages(prev => [...prev, ...validFiles]);
    
    validFiles.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreviews(prev => [...prev, reader.result]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index) => {
    setImages(images.filter((_, i) => i !== index));
    setImagePreviews(imagePreviews.filter((_, i) => i !== index));
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

  const handleSubmit = async (e) => {
    e?.preventDefault();
    if (images.length === 0) {
      toast.error('Please select at least one product photo');
      return;
    }
    if (!formData.common_price) {
      toast.error('Please enter selling price');
      return;
    }
    if (!formData.category_id) {
      toast.error('Please select a category');
      return;
    }

    setUploading(true);
    setProgress(20);
    try {
      const submitData = new FormData();
      images.forEach((img) => {
        submitData.append('images', img);
      });
      submitData.append('price', formData.common_price);
      submitData.append('cost', formData.common_cost || 0);
      submitData.append('category_id', formData.category_id);
      submitData.append('name_prefix', formData.common_name_prefix || 'Batch Product');
      submitData.append('brand', formData.brand || '');
      submitData.append('description', formData.description || '');
      submitData.append('stock', formData.stock || 10);
      submitData.append('threshold', formData.threshold || 5);
      submitData.append('status', formData.status || 'active');

      if (selectedSizes.length > 0) {
        selectedSizes.forEach(size => {
          submitData.append('sizes', size);
        });
      }

      setProgress(60);
      if (onSave) {
        await onSave(submitData);
      } else {
        await bulkImagesSame(submitData).unwrap();
        toast.success(`Successfully uploaded ${images.length} products`);
        onClose();
      }
      setProgress(100);
    } catch (error) {
      toast.error(error?.data?.message || 'Failed to batch upload products');
    } finally {
      setUploading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden animate-fadeIn">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-xs transition-opacity" onClick={onClose} />
      
      <div className="absolute inset-y-0 right-0 w-full max-w-2xl bg-white shadow-2xl flex flex-col justify-between overflow-hidden">
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-gray-100 flex items-center justify-between bg-white z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-primary-50 text-primary-600 flex items-center justify-center border border-primary-200/60 shadow-2xs">
              <ImageIcon size={20} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-black text-gray-900 tracking-tight">Bulk Photos Ingestion</h2>
                <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-primary-100 text-primary-800">
                  Fast Import
                </span>
              </div>
              <p className="text-xs text-gray-500">Generate multiple products simultaneously from uploaded photo lots</p>
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
          {/* Images Upload Dropzone */}
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1.5">
              Product Images Lot ({images.length} / 25 selected) <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageSelect}
                className="hidden"
                id="bulk-images-input"
              />
              <label
                htmlFor="bulk-images-input"
                className="flex flex-col items-center justify-center w-full h-36 border-2 border-dashed border-gray-200 rounded-2xl cursor-pointer hover:border-primary-400 hover:bg-primary-50/20 transition-all bg-gray-50/60"
              >
                <div className="w-10 h-10 rounded-xl bg-primary-50 text-primary-600 flex items-center justify-center mb-1.5 shadow-2xs">
                  <Upload size={18} />
                </div>
                <span className="text-xs font-bold text-gray-800">Click or Drag & Drop Multiple Photos</span>
                <span className="text-[11px] text-gray-400 mt-0.5">Select up to 25 items at once (Max 5MB each)</span>
              </label>
            </div>

            {/* Thumbnail Preview Strip */}
            {imagePreviews.length > 0 && (
              <div className="grid grid-cols-4 sm:grid-cols-6 gap-2.5 mt-3 max-h-48 overflow-y-auto p-1 border border-gray-100 rounded-2xl bg-gray-50/40">
                {imagePreviews.map((preview, idx) => (
                  <div key={idx} className="relative aspect-square rounded-xl overflow-hidden border border-gray-200 group">
                    <img src={preview} alt="Upload Preview" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => removeImage(idx)}
                      className="absolute top-1 right-1 p-1 rounded-md bg-rose-600 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Trash2 size={11} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Common Naming Prefix */}
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">
              Common Product Name / Prefix <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              name="common_name_prefix"
              placeholder="e.g. Vintage Denim Shirt"
              value={formData.common_name_prefix}
              onChange={handleChange}
              className="w-full px-3.5 py-2.5 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-primary-500 focus:bg-white"
              required
            />
            <p className="text-[10px] text-gray-400 mt-1">Each product title will be appended with an index or photo identifier.</p>
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
                Brand / Label
              </label>
              <input
                type="text"
                name="brand"
                placeholder="e.g. Velqino"
                value={formData.brand}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-primary-500 focus:bg-white"
              />
            </div>
          </div>

          {/* Common Price & Cost */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                Selling Price (₹) <span className="text-rose-500">*</span>
              </label>
              <input
                type="number"
                name="common_price"
                placeholder="0.00"
                value={formData.common_price}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 text-xs font-bold bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-primary-500 focus:bg-white"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                Cost Price (₹)
              </label>
              <input
                type="number"
                name="common_cost"
                placeholder="0.00"
                value={formData.common_cost}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-primary-500 focus:bg-white"
              />
            </div>
          </div>

          {/* Stock & Low Threshold */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                Units Per Item
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
                Alert Threshold
              </label>
              <input
                type="number"
                name="threshold"
                placeholder="5"
                value={formData.threshold}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-primary-500 focus:bg-white"
              />
            </div>
          </div>

          {/* Sizes Chips */}
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
            disabled={uploading || images.length === 0}
            className="px-6 py-2.5 text-xs font-bold text-white bg-primary-600 hover:bg-primary-700 rounded-xl transition-all shadow-2xs flex items-center gap-2 disabled:opacity-40 active:scale-95"
          >
            {uploading ? (
              <>
                <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Uploading {images.length} Products...</span>
              </>
            ) : (
              <>
                <Save size={14} />
                <span>Publish Batch ({images.length})</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}