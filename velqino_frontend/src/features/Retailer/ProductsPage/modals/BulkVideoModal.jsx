'use client';

import React, { useState, useEffect, useRef } from 'react';
import { X, Upload, Video, Package, DollarSign, Tag, Box, Archive, FileText, Save, Play, Pause } from '../../../../utils/icons';
import { useBulkVideoMutation } from '@/redux/retailer/slices/retailerProductsSlice';
import { toast } from 'react-toastify';

export default function BulkVideoModal({ onClose, onSave, categories = [], isOpen }) {
  const [uploading, setUploading] = useState(false);
  const [videoFile, setVideoFile] = useState(null);
  const [videoPreview, setVideoPreview] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [progressMessage, setProgressMessage] = useState('');
  const videoRef = useRef(null);
  
  const [formData, setFormData] = useState({
    common_price: '',
    common_cost: '',
    category_id: '',
    common_name_prefix: '',
    brand: '',
    description: '',
    stock: '',
    threshold: 10,
    status: 'active',
    product_count: '',
    grid_rows: '',
    grid_columns: ''
  });

  const [selectedSizes, setSelectedSizes] = useState([]);
  const availableSizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL'];
  const [bulkVideo, { isLoading: isVideoUploading }] = useBulkVideoMutation();

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
        status: 'active',
        product_count: '',
        grid_rows: '',
        grid_columns: ''
      });
      setVideoFile(null);
      setVideoPreview(null);
      setSelectedSizes([]);
      setProgress(0);
      setProgressMessage('');
      setIsPlaying(false);
    }
  }, [isOpen]);

  const handleVideoSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    if (!file.type.startsWith('video/')) {
      toast.error('Please select a video file');
      return;
    }
    
    if (file.size > 100 * 1024 * 1024) {
      toast.error('Video size should be less than 100MB');
      return;
    }
    
    setVideoFile(file);
    const url = URL.createObjectURL(file);
    setVideoPreview(url);
  };

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
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
    if (!videoFile) {
        toast.error('Please select a video file');
        return;
    }
    if (!formData.product_count) {
        toast.error('Please enter number of products in video');
        return;
    }
    if (!formData.grid_rows || !formData.grid_columns) {
        toast.error('Please enter grid layout (rows and columns)');
        return;
    }

    setUploading(true);
    setProgress(10);
    setProgressMessage('Processing video...');
    
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
        submitData.append('product_count', formData.product_count);
        submitData.append('grid_rows', formData.grid_rows);
        submitData.append('grid_columns', formData.grid_columns);
        submitData.append('video', videoFile);
        
        if (selectedSizes.length > 0) {
            selectedSizes.forEach(size => {
                submitData.append('sizes', size);
            });
        }
        
        setProgress(30);
        setProgressMessage('Uploading video to Cloudinary...');
        
        // ✅ Call the API mutation
        const response = await bulkVideo(submitData).unwrap();
        
        setProgress(100);
        setProgressMessage('Complete!');
        toast.success('Products from video uploaded successfully');
        onClose();
    } catch (error) {
        toast.error(error?.data?.message || 'Failed to process video');
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
                  <Video size={20} className="text-primary-600" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Bulk Video Upload</h2>
                  <p className="text-sm text-gray-500">Upload video with product grid</p>
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
              {/* Video Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Product Video <span className="text-red-500">*</span>
                </label>
                
                {!videoPreview ? (
                  <div className="relative">
                    <input
                      type="file"
                      accept="video/*"
                      onChange={handleVideoSelect}
                      className="hidden"
                      id="bulk-video"
                    />
                    <label
                      htmlFor="bulk-video"
                      className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-primary-500 transition-all bg-gray-50"
                    >
                      <Upload size={32} className="text-gray-400 mb-2" />
                      <span className="text-sm text-gray-500">Click to upload video</span>
                      <span className="text-xs text-gray-400">MP4, MOV, AVI (Max 100MB)</span>
                    </label>
                  </div>
                ) : (
                  <div className="relative">
                    <video
                      ref={videoRef}
                      src={videoPreview}
                      className="w-full h-48 object-cover rounded-lg border border-gray-200"
                      onEnded={() => setIsPlaying(false)}
                    />
                    <button
                      onClick={togglePlay}
                      className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 bg-black/50 rounded-full flex items-center justify-center hover:bg-black/70 transition-all"
                    >
                      {isPlaying ? <Pause size={20} className="text-white" /> : <Play size={20} className="text-white" />}
                    </button>
                    <button
                      onClick={() => {
                        setVideoFile(null);
                        setVideoPreview(null);
                      }}
                        className="absolute top-2 right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-all"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  )}
                </div>

                {/* Grid Layout */}
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Product Count <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      name="product_count"
                      value={formData.product_count}
                      onChange={handleChange}
                      placeholder="e.g., 6"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Grid Rows <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      name="grid_rows"
                      value={formData.grid_rows}
                      onChange={handleChange}
                      placeholder="e.g., 2"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Grid Columns <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      name="grid_columns"
                      value={formData.grid_columns}
                      onChange={handleChange}
                      placeholder="e.g., 3"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary-500"
                    />
                  </div>
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
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary-500"
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
                      Processing...
                    </>
                  ) : (
                    <>
                      <Video size={16} />
                      Process Video
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