'use client';

import React, { useState, useEffect, useRef } from 'react';
import { 
  X, 
  Upload, 
  Video, 
  Package, 
  DollarSign, 
  Tag, 
  Box, 
  Archive, 
  FileText, 
  Save, 
  Play, 
  Pause,
  Sparkles
} from '../../../../utils/icons';
import { useBulkVideoMutation } from '@/redux/retailer/slices/retailerProductsSlice';
import { toast } from 'react-toastify';

export default function BulkVideoModal({ onClose, onSave, categories = [], isOpen }) {
  const [uploading, setUploading] = useState(false);
  const [videoFile, setVideoFile] = useState(null);
  const [videoPreview, setVideoPreview] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef(null);
  
  const [formData, setFormData] = useState({
    common_price: '',
    common_cost: '',
    category_id: '',
    common_name_prefix: '',
    brand: '',
    description: '',
    stock: '10',
    threshold: 5,
    status: 'active',
    product_count: '6'
  });

  const [selectedSizes, setSelectedSizes] = useState([]);
  const availableSizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL', '3XL'];
  const [bulkVideo] = useBulkVideoMutation();

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
        status: 'active',
        product_count: '6'
      });
      setVideoFile(null);
      setVideoPreview(null);
      setSelectedSizes([]);
      setIsPlaying(false);
    }
  }, [isOpen]);

  const handleVideoSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    if (!file.type.startsWith('video/')) {
      toast.error('Please select a video file (MP4, WebM, MOV)');
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

  const toggleSize = (size) => {
    if (selectedSizes.includes(size)) {
      setSelectedSizes(selectedSizes.filter(s => s !== size));
    } else {
      setSelectedSizes([...selectedSizes, size]);
    }
  };

  const handleSubmit = async (e) => {
    e?.preventDefault();
    if (!videoFile) {
      toast.error('Please upload a video showcase');
      return;
    }
    if (!formData.common_price) {
      toast.error('Please enter default selling price');
      return;
    }
    if (!formData.category_id) {
      toast.error('Please select a category');
      return;
    }

    setUploading(true);
    try {
      const submitData = new FormData();
      submitData.append('video', videoFile);
      submitData.append('price', formData.common_price);
      submitData.append('cost', formData.common_cost || 0);
      submitData.append('category_id', formData.category_id);
      submitData.append('name_prefix', formData.common_name_prefix || 'Video Product');
      submitData.append('brand', formData.brand || '');
      submitData.append('description', formData.description || '');
      submitData.append('stock', formData.stock || 10);
      submitData.append('threshold', formData.threshold || 5);
      submitData.append('product_count', formData.product_count || 6);

      if (selectedSizes.length > 0) {
        selectedSizes.forEach(size => {
          submitData.append('sizes', size);
        });
      }

      if (onSave) {
        await onSave(submitData);
      } else {
        await bulkVideo(submitData).unwrap();
        toast.success('Video uploaded for AI frame extraction');
        onClose();
      }
    } catch (error) {
      toast.error(error?.data?.message || 'Failed to process video');
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
            <div className="w-10 h-10 rounded-2xl bg-accent-50 text-accent-700 flex items-center justify-center border border-accent-200/60 shadow-2xs">
              <Video size={20} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-black text-gray-900 tracking-tight">Bulk Video Ingestion</h2>
                <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-accent-100 text-accent-900">
                  AI Extractor
                </span>
              </div>
              <p className="text-xs text-gray-500">Extract individual product SKUs automatically from video frame passes</p>
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
          {/* Video Upload Dropzone */}
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1.5">
              Showcase Video Clip <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <input
                type="file"
                accept="video/*"
                onChange={handleVideoSelect}
                className="hidden"
                id="bulk-video-file-input"
              />
              {!videoPreview ? (
                <label
                  htmlFor="bulk-video-file-input"
                  className="flex flex-col items-center justify-center w-full h-44 border-2 border-dashed border-gray-200 rounded-2xl cursor-pointer hover:border-accent-400 hover:bg-accent-50/20 transition-all bg-gray-50/60"
                >
                  <div className="w-12 h-12 rounded-2xl bg-accent-50 text-accent-700 flex items-center justify-center mb-2 shadow-2xs">
                    <Video size={22} />
                  </div>
                  <span className="text-xs font-bold text-gray-800">Upload Product Walkthrough Video</span>
                  <span className="text-[11px] text-gray-400 mt-0.5">MP4, WebM or MOV up to 100MB</span>
                </label>
              ) : (
                <div className="relative rounded-2xl overflow-hidden bg-black aspect-video flex items-center justify-center">
                  <video
                    ref={videoRef}
                    src={videoPreview}
                    className="w-full h-full object-contain"
                    onEnded={() => setIsPlaying(false)}
                  />
                  <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                    <button
                      type="button"
                      onClick={togglePlay}
                      className="w-12 h-12 rounded-full bg-white/90 text-gray-900 flex items-center justify-center shadow-lg hover:scale-105 transition-transform"
                    >
                      {isPlaying ? <Pause size={20} /> : <Play size={20} className="ml-1" />}
                    </button>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setVideoFile(null);
                      setVideoPreview(null);
                    }}
                    className="absolute top-3 right-3 p-1.5 rounded-lg bg-black/60 text-white hover:bg-rose-600 transition-colors"
                  >
                    <X size={14} />
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Product Prefix & Extraction Target Count */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-gray-700 mb-1">
                Common Title Prefix <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                name="common_name_prefix"
                placeholder="e.g. Designer Saree Showcase"
                value={formData.common_name_prefix}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-primary-500 focus:bg-white"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                Products In Video
              </label>
              <input
                type="number"
                name="product_count"
                placeholder="6"
                value={formData.product_count}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-primary-500 focus:bg-white"
              />
            </div>
          </div>

          {/* Category & Brand */}
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

          {/* Price & Cost */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                Default Selling Price (₹) <span className="text-rose-500">*</span>
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
            disabled={uploading || !videoFile}
            className="px-6 py-2.5 text-xs font-bold text-white bg-primary-600 hover:bg-primary-700 rounded-xl transition-all shadow-2xs flex items-center gap-2 disabled:opacity-40 active:scale-95"
          >
            {uploading ? (
              <>
                <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Processing Video...</span>
              </>
            ) : (
              <>
                <Save size={14} />
                <span>Upload & Extract Products</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}