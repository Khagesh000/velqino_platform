'use client';

import React, { useState, useEffect } from 'react';
import { X, Upload, ImageIcon, Package, DollarSign, Tag, Box, Archive, FileText, Save, Plus } from '../../../../utils/icons';
import { toast } from 'react-toastify';

export default function BulkImagesModal({ onClose, onSave, categories = [], isOpen }) {
  const [uploading, setUploading] = useState(false);
  const [images, setImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [progress, setProgress] = useState(0);
  const [progressMessage, setProgressMessage] = useState('');
  
  const [formData, setFormData] = useState({
    common_price: '',
    common_cost: '',
    category_id: '',
    common_name_prefix: '',
    brand: '',
    description: '',
    stock: '',
    threshold: 10,
    status: 'active'
  });

  const [selectedSizes, setSelectedSizes] = useState([]);
  const availableSizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL'];

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      setFormData({
        common_price: '',
        common_cost: '',
        category_id: '',
        common_name_prefix: '',
        brand: '',
        description: '',
        stock: '',
        threshold: 10,
        status: 'active'
      });
      setImages([]);
      setImagePreviews([]);
      setSelectedSizes([]);
      setProgress(0);
      setProgressMessage('');
    }
  }, [isOpen]);

  const handleImageSelect = (e) => {
    const files = Array.from(e.target.files);
    const validFiles = files.filter(file => {
      if (!file.type.startsWith('image/')) {
        toast.error(`${file.name} is not an image`);
        return false;
      }
      if (file.size > 5 * 1024 * 1024) {
        toast.error(`${file.name} exceeds 5MB`);
        return false;
      }
      return true;
    });

    if (validFiles.length + images.length > 20) {
      toast.error('Maximum 20 images allowed');
      return;
    }

    setImages([...images, ...validFiles]);
    
    // Generate previews
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

  const handleSubmit = async () => {
    if (!formData.common_price) {
      toast.error('Please enter price');
      return;
    }
    if (!formData.common_name_prefix) {
      toast.error('Please enter product name prefix');
      return;
    }
    if (images.length === 0) {
      toast.error('Please select at least one image');
      return;
    }

    setUploading(true);
    setProgress(10);
    setProgressMessage('Preparing upload...');
    
    try {
      const submitData = new FormData();
      submitData.append('common_price', formData.common_price);
      submitData.append('common_cost', formData.common_cost || 0);
      submitData.append('category_id', formData.category_id || '');
      submitData.append('common_name_prefix', formData.common_name_prefix);
      submitData.append('brand', formData.brand || '');
      submitData.append('description', formData.description || '');
      submitData.append('stock', formData.stock || 1);
      submitData.append('threshold', formData.threshold);
      submitData.append('status', formData.status);
      submitData.append('upload_mode', 'bulk_single_product');
      
      images.forEach(img => {
        submitData.append('images', img);
      });
      
      if (selectedSizes.length > 0) {
        selectedSizes.forEach(size => {
          submitData.append('sizes', size);
        });
      }
      
      setProgress(30);
      setProgressMessage('Uploading images to Cloudinary...');
      
      if (onSave) {
        await onSave(submitData);
      }
      
      setProgress(100);
      setProgressMessage('Complete!');
      toast.success(`${images.length} products uploaded successfully`);
      onClose();
    } catch (error) {
      toast.error('Failed to upload products');
      console.error(error);
    } finally {
      setUploading(false);
    }
  };

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
                  <ImageIcon size={20} className="text-primary-600" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Bulk Images Upload</h2>
                  <p className="text-sm text-gray-500">Upload multiple images at once</p>
                </div>
              </div>
              <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition-all">
                <X size={20} className="text-gray-500" />
              </button>
            </div>

            {/* Progress Bar */}
            {uploading && (
              <div className="mb-6">
                <div className="flex justify-between text-sm text-gray-600 mb-1">
                  <span>{progressMessage}</span>
                  <span>{progress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-primary-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            )}

            {/* Form - Disabled while uploading */}
            <div className={`space-y-4 ${uploading ? 'opacity-50 pointer-events-none' : ''}`}>
              {/* Image Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Product Images <span className="text-red-500">*</span>
                  <span className="text-gray-400 text-xs ml-2">(Max 20 images)</span>
                </label>
                <div className="relative">
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageSelect}
                    className="hidden"
                    id="bulk-images"
                    disabled={uploading}
                  />
                  <label
                    htmlFor="bulk-images"
                    className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-primary-500 transition-all bg-gray-50"
                  >
                    <Upload size={24} className="text-gray-400 mb-2" />
                    <span className="text-sm text-gray-500">Click to upload images</span>
                    <span className="text-xs text-gray-400">JPG, PNG, WEBP (Max 5MB each)</span>
                  </label>
                </div>
                
                {/* Image Previews */}
                {imagePreviews.length > 0 && (
                  <div className="mt-3 grid grid-cols-4 gap-2">
                    {imagePreviews.map((preview, idx) => (
                      <div key={idx} className="relative group">
                        <img src={preview} alt={`Preview ${idx + 1}`} className="w-full h-20 object-cover rounded-lg border border-gray-200" />
                        <button
                          onClick={() => removeImage(idx)}
                          className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-all"
                        >
                          <X size={12} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
                {images.length > 0 && (
                  <p className="text-xs text-gray-500 mt-2">{images.length} image(s) selected</p>
                )}
              </div>

              {/* Product Name Prefix */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Product Name Prefix <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="common_name_prefix"
                  value={formData.common_name_prefix}
                  onChange={handleChange}
                  placeholder="e.g., Cotton T-Shirt"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
                />
                <p className="text-xs text-gray-400 mt-1">Products will be named: {formData.common_name_prefix} 1, {formData.common_name_prefix} 2, etc.</p>
              </div>

              {/* Price and Cost Row */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Common Price <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">₹</span>
                    <input
                      type="number"
                      name="common_price"
                      value={formData.common_price}
                      onChange={handleChange}
                      placeholder="0.00"
                      className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary-500"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Common Cost (Your expense)</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">₹</span>
                    <input
                      type="number"
                      name="common_cost"
                      value={formData.common_cost}
                      onChange={handleChange}
                      placeholder="0.00"
                      className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary-500"
                    />
                  </div>
                </div>
              </div>

              {/* Category and Brand Row */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                  <select
                    name="category_id"
                    value={formData.category_id}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary-500"
                  >
                    <option value="">Select Category</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Brand</label>
                  <input
                    type="text"
                    name="brand"
                    value={formData.brand}
                    onChange={handleChange}
                    placeholder="e.g., Velqino"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary-500"
                  />
                </div>
              </div>

              {/* Sizes / Variants */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Sizes (Variants)
                </label>
                <div className="flex flex-wrap gap-2">
                  {availableSizes.map((size) => (
                    <button
                      key={size}
                      type="button"
                      onClick={() => {
                        if (selectedSizes.includes(size)) {
                          setSelectedSizes(selectedSizes.filter(s => s !== size));
                        } else {
                          setSelectedSizes([...selectedSizes, size]);
                        }
                      }}
                      className={`px-3 py-1.5 text-sm rounded-lg border transition-all ${
                        selectedSizes.includes(size)
                          ? 'bg-primary-500 border-primary-500 text-white'
                          : 'bg-white border-gray-300 text-gray-700 hover:border-primary-400'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
                {selectedSizes.length > 0 && (
                  <p className="text-xs text-gray-500 mt-2">
                    Selected: {selectedSizes.join(', ')}
                  </p>
                )}
              </div>

              {/* Stock and Threshold Row */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Current Stock <span className="text-gray-400 text-xs">(How many you have now)</span>
                  </label>
                  <input
                    type="number"
                    name="stock"
                    value={formData.stock}
                    onChange={handleChange}
                    placeholder="e.g., 50"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Reorder Alert <span className="text-gray-400 text-xs">(Alert when stock reaches)</span>
                  </label>
                  <input
                    type="number"
                    name="threshold"
                    value={formData.threshold}
                    onChange={handleChange}
                    placeholder="e.g., 10"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary-500"
                  />
                  <p className="text-xs text-gray-400 mt-1">Example: Set 10 → get alert when stock ≤ 10</p>
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description (Common for all)</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows="3"
                  placeholder="Product description..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary-500"
                />
              </div>

              {/* Status */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary-500"
                >
                  <option value="active">Active</option>
                  <option value="draft">Draft</option>
                </select>
              </div>
            </div>

            {/* Buttons */}
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
                disabled={uploading}
                className="flex-1 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {uploading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <Save size={16} />
                    Upload {images.length} Product{images.length !== 1 ? 's' : ''}
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