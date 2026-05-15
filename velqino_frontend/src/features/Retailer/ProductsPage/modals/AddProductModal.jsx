'use client';

import React, { useState, useEffect } from 'react';
import { X, Upload, Tag, DollarSign, Box, Archive, FileText, Save, Package } from '../../../../utils/icons';
import { useCreateRetailerProductMutation } from '@/redux/retailer/slices/retailerProductsSlice';
import { toast } from 'react-toastify';

export default function AddProductModal({ onClose, onSave, categories = [], isOpen }) {
  const [uploading, setUploading] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [selectedSizes, setSelectedSizes] = useState([]);
  const availableSizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL'];
  
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
    const file = e.target.files[0];
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

  const handleSubmit = async () => {
    console.log('🔵 Submitting product...');
    
    if (!formData.name) {
      toast.error('Please enter product name');
      return;
    }
    if (!formData.price) {
      toast.error('Please enter price');
      return;
    }
    if (!selectedImage) {
      toast.error('Please select product image');
      return;
    }

    setUploading(true);
    try {
      const submitData = new FormData();
      submitData.append('name', formData.name);
      submitData.append('price', formData.price);
      submitData.append('cost', formData.cost || 0);
      submitData.append('category_id', formData.category_id || '');
      submitData.append('brand', formData.brand || '');
      submitData.append('description', formData.description || '');
      submitData.append('stock', formData.stock || 1);
      submitData.append('threshold', formData.threshold);
      submitData.append('status', formData.status);
      
      // Append image
      if (selectedImage) {
        submitData.append('images', selectedImage);
      }
      
      // Append sizes
      if (selectedSizes.length > 0) {
        selectedSizes.forEach(size => {
          submitData.append('sizes', size);
        });
      }
      
      // Log FormData contents for debugging
      console.log('🔵 FormData entries:');
      for (let pair of submitData.entries()) {
        console.log(pair[0], pair[1]);
      }
      
      if (onSave) {
        const response = await onSave(submitData);
        console.log('🔵 Response:', response);
        toast.success('Product added successfully');
        onClose();
      }
    } catch (error) {
      console.error('🔴 Error:', error);
      toast.error(error?.data?.message || 'Failed to add product');
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
                  <Package size={20} className="text-primary-600" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Add Product</h2>
                  <p className="text-sm text-gray-500">Create a new product</p>
                </div>
              </div>
              <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition-all">
                <X size={20} className="text-gray-500" />
              </button>
            </div>

            {/* Form */}
            <div className="space-y-4">
              {/* Image Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Product Image <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageSelect}
                      className="hidden"
                      id="product-image"
                  />
                  <label
                      htmlFor="product-image"
                      onClick={() => document.getElementById('product-image').click()}  // ✅ ADD THIS
                      className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-primary-500 transition-all bg-gray-50"
                  >
                      {imagePreview ? (
                          <img src={imagePreview} alt="Preview" className="h-full object-contain rounded-lg" />
                      ) : (
                          <div className="flex flex-col items-center">
                              <Upload size={24} className="text-gray-400 mb-2" />
                              <span className="text-sm text-gray-500">Click to upload image</span>
                              <span className="text-xs text-gray-400">JPG, PNG, WEBP (Max 5MB)</span>
                          </div>
                      )}
                  </label>
                </div>
              </div>

              {/* Product Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Product Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g., Cotton T-Shirt"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
                />
              </div>

      

              {/* Price and Cost Row */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Price (Selling) <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">₹</span>
                    <input
                      type="number"
                      name="price"
                      value={formData.price}
                      onChange={handleChange}
                      placeholder="0.00"
                      className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary-500"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Cost (Your expense)</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">₹</span>
                    <input
                      type="number"
                      name="cost"
                      value={formData.cost}
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

              {/* Stock and Threshold Row */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Stock</label>
                  <input
                    type="number"
                    name="stock"
                    value={formData.stock}
                    onChange={handleChange}
                    placeholder="Quantity"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Low Stock Alert</label>
                  <input
                    type="number"
                    name="threshold"
                    value={formData.threshold}
                    onChange={handleChange}
                    placeholder="Alert at"
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

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
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
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all"
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
                    Saving...
                  </>
                ) : (
                  <>
                    <Save size={16} />
                    Save Product
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