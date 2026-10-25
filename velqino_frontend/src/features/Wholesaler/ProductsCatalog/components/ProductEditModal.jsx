"use client";

import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  X,
  Package,
  DollarSign,
  Box,
  Save,
  Eye,
  Upload,
  Trash2,
  AlertCircle,
  Sparkles,
  RefreshCw,
  CheckCircle,
  Check,
  User,
  Users,
  ImageIcon
} from '../../../../utils/icons';
import '../../../../styles/Wholesaler/ProductsCatalog/ProductEditModal.scss';
import { useCreateProductMutation, useUpdateProductMutation, useGetProductQuery } from '@/redux/wholesaler/slices/productsSlice';
import { toast } from 'react-toastify';
import API, { BASE_IMAGE_URL, resolveImageUrl } from '@/utils/apiConfig';

export default function ProductEditModal({ product = null, onClose, onSave, categories = [] }) {
  const [createProduct, { isLoading: isCreating }] = useCreateProductMutation();
  const [updateProduct, { isLoading: isUpdating }] = useUpdateProductMutation();
  const [selectedSizes, setSelectedSizes] = useState([]);
  const [selectedImages, setSelectedImages] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [errors, setErrors] = useState({});
  const availableSizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL', '28', '30', '32', '34', '36', '38', '40'];
  
  // AI Model Virtual Fitting states
  const [frontGarment, setFrontGarment] = useState(null);
  const [backGarment, setBackGarment] = useState(null);
  const [frontGarmentPreview, setFrontGarmentPreview] = useState('');
  const [backGarmentPreview, setBackGarmentPreview] = useState('');
  const [fitSilhouette, setFitSilhouette] = useState('regular');
  const [demographicOverride, setDemographicOverride] = useState('auto');
  const [useAiFit, setUseAiFit] = useState(true);
  const [isGeneratingFit, setIsGeneratingFit] = useState(false);
  const [fitPreviewResult, setFitPreviewResult] = useState(null);
  const [activePreviewAngle, setActivePreviewAngle] = useState('front');

  const frontInputRef = useRef(null);
  const backInputRef = useRef(null);

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

  // Clean up object URLs on unmount
  useEffect(() => {
    return () => {
      if (frontGarmentPreview) URL.revokeObjectURL(frontGarmentPreview);
      if (backGarmentPreview) URL.revokeObjectURL(backGarmentPreview);
    };
  }, [frontGarmentPreview, backGarmentPreview]);

  // Real-time Category, Demographic, and Model Analysis
  const detectedAnalysis = useMemo(() => {
    const selectedCategory = categories.find(c => String(c.id) === String(formData.category_id));
    const catName = selectedCategory ? selectedCategory.name.toLowerCase() : '';
    const nameStr = (formData.name || '').toLowerCase();
    const descStr = (formData.description || '').toLowerCase();
    const fullText = `${catName} ${nameStr} ${descStr}`;

    // Garment type analysis (topwear vs bottomwear)
    const bottomKeywords = ['pant', 'pants', 'trouser', 'trousers', 'jeans', 'denim', 'short', 'shorts', 'cargo', 'jogger', 'trackpant', 'skirt', 'legging'];
    const isBottom = bottomKeywords.some(kw => fullText.includes(kw));
    const garmentType = isBottom ? 'bottom' : 'top';

    // Demographic analysis (Kids vs Women vs Men)
    let demographic = demographicOverride;
    if (demographicOverride === 'auto') {
      const kidsSizes = ['2', '3', '4', '6', '8', '10', '12', '14', '16', '6Y', '8Y', '10Y', '12Y', '14Y', '8-10', '10-12', '12-14'];
      const hasKidsSize = selectedSizes.some(s => kidsSizes.includes(String(s).trim().toUpperCase()));
      const kidsKeywords = ['kid', 'kids', 'boy', 'boys', 'girl', 'girls', 'child', 'junior', 'baby', 'teen'];
      const hasKidsKeyword = kidsKeywords.some(kw => fullText.includes(kw));

      if (hasKidsSize || hasKidsKeyword) {
        demographic = 'kids';
      } else {
        const womenKeywords = ['women', 'woman', 'womens', 'ladies', 'female', 'girl', 'saree', 'kurti', 'dress', 'blouse', 'skirt', 'gown'];
        if (womenKeywords.some(kw => fullText.includes(kw))) {
          demographic = 'women';
        } else {
          demographic = 'men';
        }
      }
    }

    const modelNames = {
      men: 'Ares - Athletic Male',
      women: 'Sienna - Athletic Fit Female',
      kids: 'Kai - Junior Boy (8-10 yrs)'
    };

    return {
      garmentType,
      garmentTypeLabel: garmentType === 'top' ? 'Topwear' : 'Bottomwear',
      demographic,
      demographicLabel: demographic === 'kids' ? 'Junior / Kids (Boy/Girl)' : demographic === 'women' ? "Women's Fashion" : "Men's Apparel",
      defaultModelName: modelNames[demographic] || 'Ares - Athletic Male'
    };
  }, [formData.category_id, formData.name, formData.description, selectedSizes, demographicOverride, categories]);

  const toggleSize = (size) => {
    setSelectedSizes(prev => prev.includes(size) ? prev.filter(s => s !== size) : [...prev, size]);
  };

  const handleFrontGarmentChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setFrontGarment(file);
      setFrontGarmentPreview(URL.createObjectURL(file));
      setFitPreviewResult(null);
    }
  };

  const handleBackGarmentChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setBackGarment(file);
      setBackGarmentPreview(URL.createObjectURL(file));
      setFitPreviewResult(null);
    }
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

  // Generate live AI virtual photoshoot fitting
  const handleGenerateFitPreview = async () => {
    if (!frontGarment && selectedImages.length === 0) {
      toast.error('Please upload at least the Front Garment image');
      return;
    }

    const activeFront = frontGarment || selectedImages[0];
    const activeBack = backGarment || (selectedImages.length > 1 ? selectedImages[1] : null);

    setIsGeneratingFit(true);
    const data = new FormData();
    data.append('front_image', activeFront);
    if (activeBack) {
      data.append('back_image', activeBack);
    }
    const selectedCategory = categories.find(c => String(c.id) === String(formData.category_id));
    if (selectedCategory) {
      data.append('category_name', selectedCategory.name);
    }
    data.append('product_name', formData.name || 'Product');
    data.append('description', formData.description || '');
    data.append('fit_silhouette', fitSilhouette);
    if (demographicOverride !== 'auto') {
      data.append('demographic', demographicOverride);
    }
    selectedSizes.forEach(s => data.append('sizes', s));

    try {
      const res = await API.post('/intelligence/fit-garment/', data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      if (res.data?.success) {
        setFitPreviewResult(res.data);
        setActivePreviewAngle('front');
        toast.success(`✨ Garment fitted onto ${res.data.model?.name || 'AI Model'} with exact colors!`);
      } else {
        toast.error(res.data?.error || 'Failed to fit garment on AI model');
      }
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.error || 'AI Try-on service unavailable');
    } finally {
      setIsGeneratingFit(false);
    }
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
    
    // AI Model Fitting parameters
    payload.append('ai_fit_enabled', useAiFit ? 'true' : 'false');
    payload.append('fit_silhouette', fitSilhouette);
    if (demographicOverride !== 'auto') {
      payload.append('demographic', demographicOverride);
    }
    if (frontGarment) {
      payload.append('front_image', frontGarment);
    }
    if (backGarment) {
      payload.append('back_image', backGarment);
    }

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
        toast.success('Product created with AI Model Photoshoot successfully!');
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

          {/* AI Model Fitting & Photoshoot Section */}
          <div className="bg-gradient-to-br from-primary-50/40 via-white to-amber-50/30 border border-primary-200/80 rounded-2xl p-4 sm:p-5 space-y-4 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-primary-100">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-primary-600 text-white flex items-center justify-center shadow-xs">
                  <Sparkles size={16} />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-bold text-slate-900">AI Model Virtual Photoshoot Fitting</h4>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                      100% Exact Colors
                    </span>
                  </div>
                  <p className="text-xs text-slate-500">Fit front & back garment photos onto our hyper-realistic default AI human mannequin</p>
                </div>
              </div>
              
              <label className="inline-flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-700 bg-white px-3 py-1.5 rounded-xl border border-slate-200 hover:border-primary-300">
                <input
                  type="checkbox"
                  checked={useAiFit}
                  onChange={(e) => setUseAiFit(e.target.checked)}
                  className="rounded text-primary-600 focus:ring-primary-500"
                />
                <span>Enable AI Photoshoot</span>
              </label>
            </div>

            {useAiFit && (
              <>
                {/* Real-time Category & Demographic AI Intelligence Bar */}
                <div className="bg-white/90 border border-slate-200/80 rounded-xl p-3 flex flex-wrap items-center justify-between gap-3 text-xs">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-bold text-slate-500 uppercase tracking-wider text-[10px]">AI Auto-Detected:</span>
                    <span className="px-2.5 py-1 rounded-lg font-bold bg-primary-50 text-primary-700 border border-primary-200/60 flex items-center gap-1">
                      <span>🏷️</span> {detectedAnalysis.garmentTypeLabel}
                    </span>
                    <span className="px-2.5 py-1 rounded-lg font-bold bg-amber-50 text-amber-800 border border-amber-200/60 flex items-center gap-1">
                      <span>👤</span> {detectedAnalysis.demographicLabel}
                    </span>
                    <span className="px-2.5 py-1 rounded-lg font-bold bg-slate-100 text-slate-700 border border-slate-200 flex items-center gap-1">
                      <span>✨</span> Model: {detectedAnalysis.defaultModelName}
                    </span>
                  </div>
                </div>

                {/* Dropdowns: Fit Silhouette & Demographic Control */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Fit Silhouette <span className="text-primary-600">*</span>
                    </label>
                    <select
                      value={fitSilhouette}
                      onChange={(e) => setFitSilhouette(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-semibold text-slate-800 focus:outline-none focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 transition-all"
                    >
                      <option value="regular">Regular Fit (Standard Drape)</option>
                      <option value="slim">Slim Fit (Contoured Waist & Sleeves)</option>
                      <option value="relaxed">Relaxed Fit (Comfort Room)</option>
                      <option value="oversized">Loose / Oversized Fit (Dropped Shoulders)</option>
                    </select>
                    <p className="text-[11px] text-slate-400 mt-1">Adjusts body contouring and shoulder drape</p>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Demographic & AI Model
                    </label>
                    <select
                      value={demographicOverride}
                      onChange={(e) => setDemographicOverride(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-semibold text-slate-800 focus:outline-none focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 transition-all"
                    >
                      <option value="auto">Auto-Detect from Category & Sizes (Recommended)</option>
                      <option value="men">Men's Apparel (Ares - Athletic Male)</option>
                      <option value="women">Women's Apparel (Sienna - Fit Female)</option>
                      <option value="kids">Junior / Kids (Kai - Junior Boy 8-10 yrs)</option>
                    </select>
                    <p className="text-[11px] text-slate-400 mt-1">Automatically assigns default studio mannequin</p>
                  </div>
                </div>

                {/* Front & Back Garment Upload Boxes */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Front Garment */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                      Front Side Photo <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="file"
                      ref={frontInputRef}
                      accept="image/*"
                      onChange={handleFrontGarmentChange}
                      className="hidden"
                    />

                    {frontGarmentPreview ? (
                      <div className="relative aspect-4/3 rounded-xl border border-slate-200 bg-slate-50 overflow-hidden group">
                        <img
                          src={frontGarmentPreview}
                          alt="Front Garment"
                          className="w-full h-full object-contain p-2"
                        />
                        <div className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-slate-900/70 text-white text-[10px] font-bold">
                          Front Garment
                        </div>
                        <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                          <button
                            type="button"
                            onClick={() => frontInputRef.current?.click()}
                            className="px-3 py-1.5 rounded-lg bg-white text-slate-900 text-xs font-bold shadow-md hover:bg-slate-100"
                          >
                            Replace
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setFrontGarment(null);
                              setFrontGarmentPreview('');
                              setFitPreviewResult(null);
                            }}
                            className="p-1.5 rounded-lg bg-rose-600 text-white shadow-md hover:bg-rose-700"
                            title="Remove image"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div
                        onClick={() => frontInputRef.current?.click()}
                        className="aspect-4/3 border-2 border-dashed border-slate-300 hover:border-primary-500 bg-white hover:bg-primary-50/20 rounded-xl p-4 flex flex-col items-center justify-center text-center cursor-pointer transition-all"
                      >
                        <div className="w-10 h-10 rounded-xl bg-primary-50 text-primary-600 flex items-center justify-center mb-2">
                          <Upload size={18} />
                        </div>
                        <p className="text-xs font-bold text-slate-800">Upload Front Garment</p>
                        <p className="text-[10px] text-slate-400 mt-0.5">Flat-lay or ghost mannequin</p>
                      </div>
                    )}
                  </div>

                  {/* Back Garment */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                      Back Side Photo <span className="text-slate-400 text-[10px] font-normal">(Optional for 360°)</span>
                    </label>
                    <input
                      type="file"
                      ref={backInputRef}
                      accept="image/*"
                      onChange={handleBackGarmentChange}
                      className="hidden"
                    />

                    {backGarmentPreview ? (
                      <div className="relative aspect-4/3 rounded-xl border border-slate-200 bg-slate-50 overflow-hidden group">
                        <img
                          src={backGarmentPreview}
                          alt="Back Garment"
                          className="w-full h-full object-contain p-2"
                        />
                        <div className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-slate-900/70 text-white text-[10px] font-bold">
                          Back Garment
                        </div>
                        <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                          <button
                            type="button"
                            onClick={() => backInputRef.current?.click()}
                            className="px-3 py-1.5 rounded-lg bg-white text-slate-900 text-xs font-bold shadow-md hover:bg-slate-100"
                          >
                            Replace
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setBackGarment(null);
                              setBackGarmentPreview('');
                              setFitPreviewResult(null);
                            }}
                            className="p-1.5 rounded-lg bg-rose-600 text-white shadow-md hover:bg-rose-700"
                            title="Remove image"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div
                        onClick={() => backInputRef.current?.click()}
                        className="aspect-4/3 border-2 border-dashed border-slate-300 hover:border-primary-500 bg-white hover:bg-primary-50/20 rounded-xl p-4 flex flex-col items-center justify-center text-center cursor-pointer transition-all"
                      >
                        <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-500 flex items-center justify-center mb-2">
                          <Upload size={18} />
                        </div>
                        <p className="text-xs font-bold text-slate-800">Upload Back Garment</p>
                        <p className="text-[10px] text-slate-400 mt-0.5">Auto-synthesized if left empty</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Preview on AI Model Trigger Button */}
                <div className="pt-1 flex flex-col sm:flex-row items-center justify-between gap-3">
                  <button
                    type="button"
                    onClick={handleGenerateFitPreview}
                    disabled={isGeneratingFit || (!frontGarment && selectedImages.length === 0)}
                    className="w-full sm:w-auto px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 active:bg-slate-950 transition-all flex items-center justify-center gap-2 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isGeneratingFit ? (
                      <>
                        <RefreshCw size={14} className="animate-spin text-amber-400" />
                        <span>Fitting Garment onto {detectedAnalysis.defaultModelName}...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles size={14} className="text-amber-400" />
                        <span>Preview on AI Model Photoshoot</span>
                      </>
                    )}
                  </button>

                  <p className="text-[11px] text-slate-500 flex items-center gap-1.5">
                    <CheckCircle size={13} className="text-emerald-600" />
                    <span>Colours, patterns, buttons & texture 100% untouched</span>
                  </p>
                </div>

                {/* Live Generated AI Photoshoot Preview Canvas */}
                {fitPreviewResult && (
                  <div className="bg-white border-2 border-primary-300 rounded-2xl p-4 shadow-sm space-y-3">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                        <span className="text-xs font-bold text-slate-900">
                          Photoshoot Preview: {fitPreviewResult.model?.name}
                        </span>
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                          {fitPreviewResult.analysis?.fit_label}
                        </span>
                      </div>

                      {/* View Angle Tabs */}
                      <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
                        {fitPreviewResult.renders?.map(r => (
                          <button
                            key={r.angle_key}
                            type="button"
                            onClick={() => setActivePreviewAngle(r.angle_key)}
                            className={`px-3 py-1 text-[11px] font-bold rounded-lg transition-all ${
                              activePreviewAngle === r.angle_key
                                ? 'bg-white text-slate-900 shadow-xs'
                                : 'text-slate-500 hover:text-slate-800'
                            }`}
                          >
                            {r.angle_key === 'front' ? 'Front (0°)' : 'Back (180°)'}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Preview Image Frame */}
                    <div className="relative aspect-3/4 max-w-[280px] mx-auto rounded-xl bg-slate-50 border border-slate-200 overflow-hidden shadow-xs flex items-center justify-center">
                      {fitPreviewResult.renders?.find(r => r.angle_key === activePreviewAngle) ? (
                        <img
                          src={resolveImageUrl(fitPreviewResult.renders.find(r => r.angle_key === activePreviewAngle).image_url)}
                          alt="AI Model Photoshoot"
                          className="w-full h-full object-contain"
                        />
                      ) : (
                        <div className="text-xs text-slate-400">Loading render...</div>
                      )}
                      <div className="absolute bottom-2 left-2 right-2 px-2.5 py-1 rounded-lg bg-slate-900/80 backdrop-blur-xs text-white text-[10px] flex items-center justify-between">
                        <span>{activePreviewAngle === 'front' ? 'Front View' : 'Back View'}</span>
                        <span className="text-emerald-400 font-bold">✓ Original Color Preserved</span>
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Optional Additional Product Gallery Images */}
          <div className="pt-2">
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
              Additional Catalog Photos (Optional Gallery Images)
            </label>
            <div className="border border-slate-200 hover:border-slate-300 bg-white rounded-xl p-4 text-center transition-all cursor-pointer">
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageSelect}
                className="hidden"
                id="gallery-image-upload"
              />
              <label htmlFor="gallery-image-upload" className="cursor-pointer block">
                <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-600 flex items-center justify-center mx-auto mb-1.5">
                  <Upload size={16} />
                </div>
                <p className="text-xs font-semibold text-slate-700">Add extra flat-lay or fabric detail photos</p>
                <p className="text-[10px] text-slate-400">Appended to product gallery</p>
              </label>
            </div>

            {selectedImages.length > 0 && (
              <div className="grid grid-cols-4 sm:grid-cols-6 gap-2.5 mt-3">
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
                      className="absolute top-1 right-1 w-5 h-5 rounded-full bg-rose-600 text-white flex items-center justify-center shadow-md hover:bg-rose-700 transition-colors"
                      title="Remove image"
                    >
                      <Trash2 size={11} />
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
