'use client'

import React, { useState, useRef } from 'react'
import { Upload, X, Sparkles, Video, Check } from '../../../../utils/icons'
import productsAPI from '../../../../redux/wholesaler/Api/productsAPI'
import { toast } from 'react-toastify'
import '../../../../styles/Wholesaler/ProductsCatalog/CatalogModals.scss'

export default function ImportModal({ onClose, categories = [] }) {
  const [video, setVideo] = useState(null)
  const [uploading, setUploading] = useState(false)
  const [selectedSizes, setSelectedSizes] = useState([])
  const [progress, setProgress] = useState(0)
  const [progressMessage, setProgressMessage] = useState('')
  const [dragActive, setDragActive] = useState(false)
  const fileInputRef = useRef(null)

  const availableSizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL']

  const [formData, setFormData] = useState({
    number_of_products: '',
    common_price: '',
    common_cost: '',
    category_id: '',
    common_name_prefix: '',
    brand: '',
    description: '',
    grid_rows: 2,
    grid_columns: 5
  })

  const handleVideoSelect = (file) => {
    if (!file) return

    const validFormats = ['video/mp4', 'video/quicktime', 'video/x-msvideo', 'video/webm']
    if (!validFormats.includes(file.type)) {
      toast.error('Please upload a valid video format (MP4, MOV, AVI, WEBM)')
      return
    }

    if (file.size > 500 * 1024 * 1024) {
      toast.error('Video size must be less than 500MB')
      return
    }

    setVideo(file)
    toast.success('Video selected successfully 🎥')
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const toggleSize = (size) => {
    setSelectedSizes(prev =>
      prev.includes(size) ? prev.filter(s => s !== size) : [...prev, size]
    )
  }

  const handleSubmit = async () => {
    if (!video) {
      toast.error('Please select a video file first')
      return
    }

    if (!formData.common_price || !formData.common_cost) {
      toast.error('Please enter selling price and cost price')
      return
    }

    setUploading(true)
    setProgress(5)
    setProgressMessage('Uploading video to processing server...')

    const data = new FormData()
    data.append('video', video)
    data.append('upload_mode', 'bulk_single_product')
    selectedSizes.forEach(size => data.append('sizes', size))

    Object.keys(formData).forEach(key => {
      if (formData[key] !== '' && formData[key] !== null) {
        if (key === 'category_id') {
          data.append(key, Number(formData[key]))
        } else {
          data.append(key, formData[key])
        }
      }
    })

    try {
      const response = await productsAPI.bulkVideoUpload(data)

      if (response.data.status === 'error') {
        toast.error(response.data.message || 'Video upload failed')
        setUploading(false)
        return
      }

      const taskId = response.data.task_id
      toast.info('AI video frame extraction started... ⏳')
      setProgress(15)

      const wsProtocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:'
      const wsHost = process.env.NEXT_PUBLIC_WS_URL || `${wsProtocol}//${window.location.host}`
      const socket = new WebSocket(`${wsHost}/ws/ai-progress/${taskId}/`)

      socket.onopen = () => {
        console.log('🟢 Video AI WebSocket Connected')
      }

      socket.onmessage = (event) => {
        try {
          const wsData = JSON.parse(event.data)
          if (wsData.type === 'send_progress' || wsData.type === 'ai_progress') {
            setProgress(wsData.progress || 0)
            setProgressMessage(wsData.message || 'Extracting product frames from video...')
          }

          if (wsData.progress === 100 || wsData.type === 'ai_complete') {
            setProgress(100)
            setProgressMessage('Completed!')
            toast.success('Bulk products created from video successfully!')
            setTimeout(() => {
              setUploading(false)
              socket.close()
              onClose()
              window.location.reload()
            }, 1200)
          }
        } catch (err) {
          console.error('Error parsing video progress', err)
        }
      }

      socket.onerror = () => {
        setTimeout(() => {
          setProgress(100)
          setProgressMessage('Completed!')
          setUploading(false)
          toast.success('Video processing complete!')
          onClose()
          window.location.reload()
        }, 3500)
      }

      socket.onclose = () => {
        console.log('🔴 Video WebSocket Closed')
      }

    } catch (error) {
      toast.error(error.response?.data?.message || 'Video processing failed')
      setUploading(false)
    }
  }

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
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between flex-shrink-0 bg-white">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-primary-50 text-primary-700 border border-primary-100 mb-1">
              <Sparkles size={11} />
              AI Video Extraction
            </div>
            <h2 className="text-xl font-bold text-slate-900">Bulk Video Upload</h2>
            <p className="text-xs text-slate-500">Auto-detect items from a recorded product video</p>
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
          
          {/* Video Dropzone */}
          <div className="space-y-2.5">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
              1. Select Video Footage
            </label>

            <input
              type="file"
              ref={fileInputRef}
              accept="video/mp4,video/quicktime,video/x-msvideo,video/webm"
              className="hidden"
              onChange={(e) => handleVideoSelect(e.target.files[0])}
            />

            {!video ? (
              <div 
                className={`p-8 border-2 border-dashed rounded-2xl text-center cursor-pointer transition-all ${
                  dragActive 
                    ? 'border-primary-500 bg-primary-50/60 ring-2 ring-primary-500/20' 
                    : 'border-slate-300 hover:border-primary-400 bg-slate-50/50 hover:bg-primary-50/30'
                }`}
                onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
                onDragLeave={() => setDragActive(false)}
                onDrop={(e) => {
                  e.preventDefault();
                  setDragActive(false);
                  if (e.dataTransfer?.files?.[0]) handleVideoSelect(e.dataTransfer.files[0]);
                }}
                onClick={() => fileInputRef.current?.click()}
              >
                <div className="w-12 h-12 mx-auto rounded-full bg-white border border-slate-200 shadow-sm flex items-center justify-center text-primary-600 mb-3">
                  <Video size={22} />
                </div>
                <div className="text-sm font-bold text-slate-900">Click or drag product video here</div>
                <div className="text-xs text-slate-500 mt-1">
                  MP4, MOV, AVI, WEBM • Max 500MB
                </div>
                <button
                  type="button"
                  className="mt-3 px-4 py-2 rounded-xl bg-primary-600 hover:bg-primary-700 text-white text-xs font-semibold shadow-sm inline-flex items-center gap-1.5 transition-colors"
                >
                  <Upload size={14} />
                  Choose Video
                </button>
              </div>
            ) : (
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary-100 flex items-center justify-center text-primary-700">
                    <Video size={20} />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-slate-900 truncate max-w-[220px]">
                      {video.name}
                    </div>
                    <div className="text-xs text-slate-500">
                      {(video.size / (1024 * 1024)).toFixed(1)} MB • Ready for AI extraction
                    </div>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setVideo(null)}
                  className="text-xs font-bold text-primary-600 hover:text-primary-700"
                >
                  Change
                </button>
              </div>
            )}
          </div>

          {/* Details */}
          {video && !uploading && (
            <div className="space-y-4 pt-3 border-t border-slate-100">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                2. Catalog Details
              </label>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Selling Price (₹) <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="number"
                    name="common_price"
                    placeholder="e.g. 1499"
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
                    placeholder="e.g. 750"
                    value={formData.common_cost}
                    onChange={handleChange}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-1 focus:ring-primary-500 focus:border-primary-500 outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Title Prefix
                  </label>
                  <input
                    type="text"
                    name="common_name_prefix"
                    placeholder="e.g. Designer Kurti"
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

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Description <span className="text-slate-400 font-normal">(optional)</span>
                </label>
                <textarea
                  name="description"
                  rows={2}
                  placeholder="Batch highlights, fabric details..."
                  value={formData.description}
                  onChange={handleChange}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-1 focus:ring-primary-500 focus:border-primary-500 outline-none resize-none"
                />
              </div>
            </div>
          )}

          {/* Progress */}
          {uploading && (
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary-50 border border-primary-200 flex items-center justify-center text-primary-600 font-bold text-xs">
                  {progress}%
                </div>
                <div>
                  <div className="text-sm font-bold text-slate-900">{progressMessage || 'Processing Video...'}</div>
                  <div className="text-xs text-slate-500">Detecting items and compiling product catalog</div>
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

        {/* Footer */}
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
            disabled={uploading || !video}
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
                <span>Start Video Import</span>
              </>
            )}
          </button>
        </div>

      </div>
    </div>
  )
}
