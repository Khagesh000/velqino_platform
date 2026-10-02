'use client'

import React, { useState, useRef } from 'react'
import { X, Upload, ImageIcon, Package, Check, Sparkles, AlertCircle } from '../../../../utils/icons'
import { toast } from 'react-toastify'
import productsAPI from '../../../../redux/wholesaler/Api/productsAPI'
import '../../../../styles/Wholesaler/ProductsCatalog/CatalogModals.scss'

export default function ImportImagesModal({ onClose, categories = [] }) {
  // Modes: 'bulk_single_product' (default), 'front_only', 'front_back'
  const [mode, setMode] = useState('bulk_single_product')
  const [images, setImages] = useState([])
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [progressMessage, setProgressMessage] = useState('')
  const [selectedSizes, setSelectedSizes] = useState([])
  const [dragActive, setDragActive] = useState(false)
  const fileInputRef = useRef(null)

  const availableSizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL']

  const [formData, setFormData] = useState({
    common_price: '',
    common_cost: '',
    category_id: '',
    common_name_prefix: '',
    brand: '',
    description: ''
  })

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const toggleSize = (size) => {
    setSelectedSizes(prev =>
      prev.includes(size) ? prev.filter(s => s !== size) : [...prev, size]
    )
  }

  // Handle files selection
  const processFiles = (fileList) => {
    const files = Array.from(fileList)
    if (!files.length) return

    const validFormats = ['image/jpeg', 'image/png', 'image/webp']
    const invalid = files.find(f => !validFormats.includes(f.type))
    if (invalid) {
      toast.error('Please upload valid images (JPG, PNG, WEBP)')
      return
    }

    if (files.length > 20) {
      toast.error('Maximum 20 images allowed in one batch')
      return
    }

    if (mode === 'front_back' && files.length % 2 !== 0) {
      toast.error('Front + Back pairs mode requires an even number of images')
      return
    }

    setImages(files)
    const productCount = mode === 'bulk_single_product' 
      ? 1 
      : mode === 'front_back' 
        ? Math.floor(files.length / 2) 
        : files.length
    
    toast.success(`${files.length} images selected → ${productCount} product${productCount > 1 ? 's' : ''}`)
  }

  const handleImagesSelect = (e) => {
    processFiles(e.target.files)
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(true)
  }

  const handleDragLeave = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    if (e.dataTransfer?.files) {
      processFiles(e.dataTransfer.files)
    }
  }

  const removeImage = (index) => {
    const updated = images.filter((_, i) => i !== index)
    setImages(updated)
  }

  // Handle submit with WebSocket live updates
  const handleSubmit = async () => {
    if (!images.length) {
      toast.error('Please select images to upload')
      return
    }

    if (!formData.common_price || !formData.common_cost) {
      toast.error('Please fill in both Selling Price and Cost Price')
      return
    }

    setUploading(true)
    setProgress(5)
    setProgressMessage('Preparing image bundle...')

    const data = new FormData()
    images.forEach(img => data.append('images', img))

    Object.keys(formData).forEach(key => {
      if (formData[key] !== '' && formData[key] !== null) {
        if (key === 'category_id') {
          data.append(key, Number(formData[key]))
        } else {
          data.append(key, formData[key])
        }
      }
    })

    data.append('upload_mode', mode)
    selectedSizes.forEach(size => data.append('sizes', size))

    try {
      const response = await productsAPI.bulkImageUpload(data)

      if (response.data.status === 'error') {
        toast.error(response.data.message || 'Bulk upload failed')
        setUploading(false)
        return
      }

      const taskId = response.data.task_id
      toast.info('AI catalog vision processing initiated...')
      setProgress(15)
      setProgressMessage('Uploading images to vision pipeline...')

      const wsProtocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:'
      const wsHost = process.env.NEXT_PUBLIC_WS_URL || `${wsProtocol}//${window.location.host}`
      const socket = new WebSocket(`${wsHost}/ws/ai-progress/${taskId}/`)

      socket.onopen = () => {
        console.log('🟢 WebSocket Connected to vision task:', taskId)
      }

      socket.onmessage = (event) => {
        try {
          const wsData = JSON.parse(event.data)
          if (wsData.type === 'send_progress') {
            setProgress(wsData.progress || 0)
            setProgressMessage(wsData.message || 'Processing catalog images...')
          }

          if (wsData.progress === 100) {
            setProgress(100)
            setProgressMessage('Completed successfully!')
            toast.success('Products cataloged and published successfully!')
            setTimeout(() => {
              setUploading(false)
              socket.close()
              onClose()
              window.location.reload()
            }, 1200)
          }
        } catch (err) {
          console.error('Error parsing progress update', err)
        }
      }

      socket.onerror = (error) => {
        console.warn('WebSocket notification issue:', error)
        setTimeout(() => {
          setProgress(100)
          setProgressMessage('Completed!')
          setUploading(false)
          toast.success('Products processed successfully!')
          onClose()
          window.location.reload()
        }, 3000)
      }

      socket.onclose = () => {
        console.log('🔴 WebSocket Closed')
      }

    } catch (error) {
      toast.error(error.response?.data?.message || 'Bulk upload failed. Please try again.')
      setUploading(false)
    }
  }

  const expectedProductsCount = mode === 'bulk_single_product'
    ? 1
    : mode === 'front_back'
      ? Math.floor(images.length / 2)
      : images.length

  return (
    <div 
      className="velqino-modal-overlay fixed inset-0 z-[1050] flex justify-end bg-slate-900/50 backdrop-blur-sm"
      onClick={onClose}
    >
      <div 
        className="velqino-modal-drawer w-full max-w-xl h-full bg-white shadow-2xl flex flex-col sm:rounded-l-2xl overflow-hidden" 
        onClick={(e) => e.stopPropagation()}
        role="dialog"
      >
        {/* Header - Clean Slate & Terracotta */}
        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between flex-shrink-0 bg-white">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-primary-50 text-primary-700 border border-primary-100 mb-1">
              <Sparkles size={11} />
              AI Catalog Automation
            </div>
            <h2 className="text-xl font-bold text-slate-900">Bulk Image Upload</h2>
            <p className="text-xs text-slate-500">Convert product photos into ready-to-sell listings</p>
          </div>
          <button 
            type="button" 
            onClick={onClose} 
            className="w-8 h-8 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 flex items-center justify-center transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          
          {/* STEP 1: Upload Mode */}
          {!uploading && (
            <div className="space-y-2.5">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                1. Select Upload Mode
              </label>

              <div className="space-y-2">
                {/* Mode 1: Bulk Single Product */}
                <div 
                  onClick={() => setMode('bulk_single_product')}
                  className={`p-3.5 rounded-xl border-2 transition-all cursor-pointer flex items-center gap-3.5 ${
                    mode === 'bulk_single_product'
                      ? 'border-primary-500 bg-primary-50/50 ring-1 ring-primary-500/20'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${mode === 'bulk_single_product' ? 'bg-primary-500 text-white' : 'bg-slate-100 text-slate-600'}`}>
                    <Package size={20} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-slate-900">Bulk Single Product</span>
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-primary-100 text-primary-700">
                        Recommended
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5">All photos merge into 1 product (Stock = total photos)</p>
                  </div>
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center border-2 ${mode === 'bulk_single_product' ? 'border-primary-600 bg-primary-600 text-white' : 'border-slate-300'}`}>
                    {mode === 'bulk_single_product' && <Check size={12} />}
                  </div>
                </div>

                {/* Mode 2: Individual Products */}
                <div 
                  onClick={() => setMode('front_only')}
                  className={`p-3.5 rounded-xl border-2 transition-all cursor-pointer flex items-center gap-3.5 ${
                    mode === 'front_only'
                      ? 'border-primary-500 bg-primary-50/50 ring-1 ring-primary-500/20'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${mode === 'front_only' ? 'bg-primary-500 text-white' : 'bg-slate-100 text-slate-600'}`}>
                    <ImageIcon size={20} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="text-sm font-bold text-slate-900">Individual Products</span>
                    <p className="text-xs text-slate-500 mt-0.5">1 photo generates 1 distinct product listing</p>
                  </div>
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center border-2 ${mode === 'front_only' ? 'border-primary-600 bg-primary-600 text-white' : 'border-slate-300'}`}>
                    {mode === 'front_only' && <Check size={12} />}
                  </div>
                </div>

                {/* Mode 3: Front + Back Pairs */}
                <div 
                  onClick={() => setMode('front_back')}
                  className={`p-3.5 rounded-xl border-2 transition-all cursor-pointer flex items-center gap-3.5 ${
                    mode === 'front_back'
                      ? 'border-primary-500 bg-primary-50/50 ring-1 ring-primary-500/20'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${mode === 'front_back' ? 'bg-primary-500 text-white' : 'bg-slate-100 text-slate-600'}`}>
                    <ImageIcon size={20} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="text-sm font-bold text-slate-900">Front + Back Pairs</span>
                    <p className="text-xs text-slate-500 mt-0.5">Two photos per product (front & back angles)</p>
                  </div>
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center border-2 ${mode === 'front_back' ? 'border-primary-600 bg-primary-600 text-white' : 'border-slate-300'}`}>
                    {mode === 'front_back' && <Check size={12} />}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: Dropzone */}
          <div className="space-y-2.5">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
              2. Upload Photographs
            </label>

            <input
              type="file"
              ref={fileInputRef}
              accept="image/jpeg,image/png,image/webp"
              multiple
              className="hidden"
              onChange={handleImagesSelect}
            />

            {images.length === 0 ? (
              <div 
                className={`p-8 border-2 border-dashed rounded-2xl text-center cursor-pointer transition-all ${
                  dragActive 
                    ? 'border-primary-500 bg-primary-50/60 ring-2 ring-primary-500/20' 
                    : 'border-slate-300 hover:border-primary-400 bg-slate-50/50 hover:bg-primary-50/30'
                }`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
              >
                <div className="w-12 h-12 mx-auto rounded-full bg-white border border-slate-200 shadow-sm flex items-center justify-center text-primary-600 mb-3">
                  <Upload size={22} />
                </div>
                <div className="text-sm font-bold text-slate-900">Click or drag images here</div>
                <div className="text-xs text-slate-500 mt-1">
                  JPG, PNG, WEBP • Up to 20 images
                </div>
                <button
                  type="button"
                  className="mt-3 px-4 py-2 rounded-xl bg-primary-600 hover:bg-primary-700 text-white text-xs font-semibold shadow-sm inline-flex items-center gap-1.5 transition-colors"
                >
                  <Upload size={14} />
                  Choose Files
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-slate-50 border border-slate-200 rounded-xl">
                  <span className="text-xs font-semibold text-slate-800">
                    📸 {images.length} images selected → {expectedProductsCount} {expectedProductsCount === 1 ? 'product' : 'products'}
                  </span>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="text-xs font-bold text-primary-600 hover:text-primary-700"
                  >
                    + Add More
                  </button>
                </div>

                {/* Thumbnails */}
                <div className="grid grid-cols-4 gap-2.5 max-h-40 overflow-y-auto p-2 bg-slate-50 border border-slate-200 rounded-xl">
                  {images.map((img, i) => (
                    <div key={i} className="relative aspect-square rounded-lg overflow-hidden border border-slate-200 bg-white">
                      <img
                        src={URL.createObjectURL(img)}
                        alt={img.name}
                        className="w-full h-full object-cover"
                      />
                      <span className="absolute bottom-1 left-1 text-[10px] font-bold bg-slate-900/75 text-white px-1.5 py-0.5 rounded">
                        {mode === 'front_back' ? (i % 2 === 0 ? `P${Math.floor(i / 2) + 1}F` : `P${Math.floor(i / 2) + 1}B`) : `#${i + 1}`}
                      </span>
                      <button
                        type="button"
                        onClick={() => removeImage(i)}
                        className="absolute top-1 right-1 w-5 h-5 rounded-full bg-white/90 text-rose-600 hover:bg-rose-600 hover:text-white flex items-center justify-center shadow transition-colors"
                      >
                        <X size={11} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* STEP 3: Details */}
          {images.length > 0 && !uploading && (
            <div className="space-y-4 pt-3 border-t border-slate-100">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                3. Listing Parameters
              </label>

              {/* Price & Cost */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Selling Price (₹) <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="number"
                    name="common_price"
                    placeholder="e.g. 1299"
                    value={formData.common_price}
                    onChange={handleChange}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-1 focus:ring-primary-500 focus:border-primary-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Cost Price (₹) <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="number"
                    name="common_cost"
                    placeholder="e.g. 650"
                    value={formData.common_cost}
                    onChange={handleChange}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-1 focus:ring-primary-500 focus:border-primary-500 outline-none"
                  />
                </div>
              </div>

              {/* Title & Brand */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Title Prefix
                  </label>
                  <input
                    type="text"
                    name="common_name_prefix"
                    placeholder="e.g. Cotton Shirt"
                    value={formData.common_name_prefix}
                    onChange={handleChange}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-1 focus:ring-primary-500 focus:border-primary-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Brand
                  </label>
                  <input
                    type="text"
                    name="brand"
                    placeholder="e.g. Veltrix Atelier"
                    value={formData.brand}
                    onChange={handleChange}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-1 focus:ring-primary-500 focus:border-primary-500 outline-none"
                  />
                </div>
              </div>

              {/* Category */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Category
                </label>
                <select
                  name="category_id"
                  value={formData.category_id}
                  onChange={handleChange}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-1 focus:ring-primary-500 focus:border-primary-500 outline-none bg-white"
                >
                  <option value="">Select Category</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Sizes */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Sizes Available
                </label>
                <div className="flex flex-wrap gap-2">
                  {availableSizes.map(size => (
                    <button
                      key={size}
                      type="button"
                      onClick={() => toggleSize(size)}
                      className={`px-3 py-1 text-xs font-semibold rounded-lg border transition-all ${
                        selectedSizes.includes(size)
                          ? 'border-primary-600 bg-primary-600 text-white shadow-sm'
                          : 'border-slate-300 bg-white text-slate-700 hover:border-slate-400'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Description <span className="text-slate-400 font-normal">(optional)</span>
                </label>
                <textarea
                  name="description"
                  rows={2}
                  placeholder="Fabric details, product highlights..."
                  value={formData.description}
                  onChange={handleChange}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-1 focus:ring-primary-500 focus:border-primary-500 outline-none resize-none"
                />
              </div>
            </div>
          )}

          {/* AI Progress Tracker */}
          {uploading && (
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary-50 border border-primary-200 flex items-center justify-center text-primary-600 font-bold text-xs">
                  {progress}%
                </div>
                <div>
                  <div className="text-sm font-bold text-slate-900">{progressMessage || 'Processing images...'}</div>
                  <div className="text-xs text-slate-500">AI vision pipeline is cataloging your products</div>
                </div>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-200 overflow-hidden">
                <div 
                  className="h-full bg-primary-600 transition-all duration-300 rounded-full" 
                  style={{ width: `${Math.max(5, progress)}%` }} 
                />
              </div>
            </div>
          )}

        </div>

        {/* Footer - Clean Neutral & Primary */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-end gap-3 flex-shrink-0">
          <button 
            type="button" 
            onClick={onClose} 
            disabled={uploading}
            className="px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-700 text-sm font-medium hover:bg-slate-100 transition-colors"
          >
            Cancel
          </button>
          
          <button
            type="button"
            onClick={handleSubmit}
            disabled={uploading || images.length === 0}
            className="px-6 py-2.5 rounded-xl bg-primary-600 hover:bg-primary-700 text-white text-sm font-semibold shadow-sm flex items-center gap-2 transition-all disabled:opacity-50"
          >
            {uploading ? (
              <>
                <Sparkles size={16} className="animate-spin" />
                <span>Processing... {progress}%</span>
              </>
            ) : (
              <>
                <Upload size={16} />
                <span>
                  Publish {images.length > 0 ? `${expectedProductsCount} ${expectedProductsCount === 1 ? 'Product' : 'Products'}` : 'Catalog'}
                </span>
              </>
            )}
          </button>
        </div>

      </div>
    </div>
  )
}
