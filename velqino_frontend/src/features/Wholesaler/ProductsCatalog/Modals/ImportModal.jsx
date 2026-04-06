'use client'

import React, { useState } from 'react'
import { Upload, X } from '../../../../utils/icons'
import productsAPI from '../../../../redux/wholesaler/Api/productsAPI'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

export default function ImportModal({ onClose }) {

  const [video, setVideo] = useState(null)
  const [uploading, setUploading] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [taskId, setTaskId] = useState(null)
  const [selectedSizes, setSelectedSizes] = useState([])
  const availableSizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL']
  const [progress, setProgress] = useState(0)
  const [progressMessage, setProgressMessage] = useState('')

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

  // =============================
  // 🎥 HANDLE VIDEO SELECT
  // =============================
  const handleVideoSelect = (e) => {
    const file = e.target.files[0]
    if (!file) return

    const validFormats = ['video/mp4', 'video/quicktime', 'video/x-msvideo', 'video/webm']

    if (!validFormats.includes(file.type)) {
      toast.error('Upload valid video (MP4, MOV, AVI, WEBM)')
      return
    }

    if (file.size > 500 * 1024 * 1024) {
      toast.error('Video must be less than 500MB')
      return
    }

    setVideo(file)
    setShowForm(true)

    toast.success('Video selected successfully 🎥')
  }

  // =============================
  // 📝 HANDLE INPUT CHANGE
  // =============================
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

  // =============================
  // 🚀 SUBMIT DATA
  // =============================
  const handleSubmit = async () => {
  if (!video) {
    toast.error('Please upload video first')
    return
  }

  setUploading(true)

  const data = new FormData()
  data.append('video', video)
  selectedSizes.forEach(size => data.append('sizes', size))

  Object.keys(formData).forEach(key => {
  if (formData[key] !== "" && formData[key] !== null) {
    if (key === "category_id") {
      data.append(key, Number(formData[key]))
    } else {
      data.append(key, formData[key])
    }
  }
})

  try {
    const response = await productsAPI.bulkVideoUpload(data)

    if (response.data.status === 'error') {
      toast.error(response.data.message)
      setUploading(false)
      return
    }

    const taskId = response.data.task_id
    toast.info("AI processing started... ⏳")

    // 🔥 WebSocket Start
    const socket = new WebSocket(`${process.env.NEXT_PUBLIC_WS_URL}/ws/ai-progress/${taskId}/`)

    socket.onopen = () => {
      console.log("🟢 WebSocket Connected")
    }

    socket.onmessage = (event) => {
    const data = JSON.parse(event.data)
    console.log('📦 Video progress:', data)

    if (data.type === 'send_progress' || data.type === 'ai_progress') {
      setProgress(data.progress)
      setProgressMessage(data.message)
    }

    if (data.progress === 100 || data.type === 'ai_complete') {
      setProgress(100)
      setProgressMessage('Completed!')
      toast.success("✅ Products created successfully!")
      setTimeout(() => {
        setUploading(false)
        socket.close()
        onClose()
        window.location.reload()
      }, 1000)
    }
  }

    socket.onerror = () => {
      toast.error("WebSocket error")
      setUploading(false)
    }

    socket.onclose = () => {
      console.log("🔴 WebSocket Closed")
    }

  } catch (error) {
    toast.error(error.response?.data?.message || 'Upload failed')
    setUploading(false)
  }
}

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

      <div className="absolute inset-y-0 right-0 w-full max-w-2xl pt-[56px] pb-[70px] sm:pt-20 sm:pb-16">
        <div className="h-full bg-white rounded-l-2xl shadow-xl overflow-y-auto">

          <div className="p-6">

            {/* HEADER */}
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-900">Bulk Video Upload</h2>
              <button onClick={onClose}>
                <X size={20} />
              </button>
            </div>

            {/* VIDEO UPLOAD */}
            {!showForm && (
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                <Upload className="w-10 h-10 text-gray-400 mx-auto mb-3" />

                <p className="text-gray-600">Upload Product Video</p>
                <p className="text-xs text-gray-400">MP4, MOV, AVI, WEBM (Max 500MB)</p>

                <input
                  type="file"
                  accept="video/*"
                  className="hidden"
                  id="videoUpload"
                  onChange={handleVideoSelect}
                />

                <button
                  onClick={() => document.getElementById('videoUpload').click()}
                  className="mt-4 px-4 py-2 bg-primary-600 text-white rounded-lg"
                >
                  Select Video
                </button>
              </div>
            )}

            {/* FORM AFTER VIDEO */}
            {showForm && (
              <div className="space-y-4">

                <p className="text-sm text-green-600">🎥 {video?.name}</p>

                <input type="number" name="number_of_products" placeholder="Number of Products"
                  onChange={handleChange} className="w-full border p-2 rounded" />

                <input type="number" name="common_price" placeholder="Common Price"
                  onChange={handleChange} className="w-full border p-2 rounded" />

                <input type="number" name="common_cost" placeholder="Common Cost"
                  onChange={handleChange} className="w-full border p-2 rounded" />

                <input type="text" name="common_name_prefix" placeholder="Name Prefix"
                  onChange={handleChange} className="w-full border p-2 rounded" />

                <input type="text" name="brand" placeholder="Brand"
                  onChange={handleChange} className="w-full border p-2 rounded" />

                  <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Available Sizes <span className="text-xs text-gray-400">(optional)</span>
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {availableSizes.map(size => (
                      <button
                        key={size}
                        type="button"
                        onClick={() => toggleSize(size)}
                        className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-all ${
                          selectedSizes.includes(size)
                            ? 'bg-primary-600 text-white border-primary-600'
                            : 'bg-white text-gray-600 border-gray-300 hover:border-primary-400'
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                  {selectedSizes.length > 0 && (
                    <p className="text-xs text-primary-600 mt-1">
                      ✅ {selectedSizes.length} sizes — applied to all products
                    </p>
                  )}
                </div>

                <select
                    name="category_id"
                    onChange={handleChange}
                    className="w-full border p-2 rounded"
                    value={formData.category_id}
                  >
                    <option value="">Select Category</option>
                    <option value="1">Shirt</option>
                    <option value="2">Pant</option>
                    <option value="3">T-Shirt</option>
                  </select>

                <textarea name="description" placeholder="Description"
                  onChange={handleChange} className="w-full border p-2 rounded" />

                <div className="flex gap-3">
                  <input type="number" name="grid_rows" placeholder="Rows"
                    onChange={handleChange} className="w-full border p-2 rounded" />

                  <input type="number" name="grid_columns" placeholder="Columns"
                    onChange={handleChange} className="w-full border p-2 rounded" />
                </div>

                {uploading && (
                <div className="rounded-2xl border border-primary-100 bg-gradient-to-br from-primary-50 to-white p-5 space-y-4 shadow-sm mb-4">
                  <div className="flex items-center gap-3">
                    <div className="relative w-10 h-10 flex-shrink-0">
                      <svg className="animate-spin w-10 h-10 text-primary-200" viewBox="0 0 36 36">
                        <circle cx="18" cy="18" r="16" fill="none" stroke="currentColor" strokeWidth="3" />
                      </svg>
                      <svg className="absolute inset-0 w-10 h-10 -rotate-90" viewBox="0 0 36 36">
                        <circle
                          cx="18" cy="18" r="16"
                          fill="none"
                          stroke="#6366f1"
                          strokeWidth="3"
                          strokeLinecap="round"
                          strokeDasharray={`${progress} 100`}
                          className="transition-all duration-500"
                        />
                      </svg>
                      <span className="absolute inset-0 flex items-center justify-center text-[9px] font-bold text-primary-700">
                        {progress}%
                      </span>
                    </div>

                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-800 truncate">
                        {progressMessage || 'Processing video...'}
                      </p>
                      <p className="text-xs text-gray-400 mt-0.5">
                        {progress < 30 && '🎬 Extracting frames...'}
                        {progress >= 30 && progress < 60 && '🖼️ Processing images...'}
                        {progress >= 60 && progress < 90 && '✨ AI enhancement...'}
                        {progress >= 90 && '🚀 Creating products...'}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <div className="relative w-full bg-gray-100 rounded-full h-3 overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent animate-pulse" />
                      <div
                        className="h-3 rounded-full transition-all duration-500 relative"
                        style={{
                          width: `${progress}%`,
                          background: 'linear-gradient(90deg, #6366f1, #8b5cf6, #a855f7)'
                        }}
                      />
                    </div>
                    <div className="flex justify-between text-[10px] text-gray-400 px-0.5">
                      <span className={progress >= 10 ? 'text-primary-500 font-medium' : ''}>Upload</span>
                      <span className={progress >= 30 ? 'text-primary-500 font-medium' : ''}>Extract</span>
                      <span className={progress >= 60 ? 'text-primary-500 font-medium' : ''}>Process</span>
                      <span className={progress >= 90 ? 'text-primary-500 font-medium' : ''}>Finish</span>
                    </div>
                  </div>

                  <p className="text-center text-xs text-gray-400 italic">
                    {progress < 50
                      ? '🎥 AI is analyzing your video frames...'
                      : '✨ Creating professional product listings!'}
                  </p>
                </div>
              )}

                <div className="flex gap-3 mt-4">
                  <button onClick={onClose} className="flex-1 border p-2 rounded">
                    Cancel
                  </button>

                  <button
                    onClick={handleSubmit}
                    disabled={uploading}
                    className="flex-1 bg-primary-600 text-white p-2 rounded"
                  >
                    {uploading ? `Processing ${progress}%...` : 'Submit'}
                  </button>
                </div>

              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  )
}