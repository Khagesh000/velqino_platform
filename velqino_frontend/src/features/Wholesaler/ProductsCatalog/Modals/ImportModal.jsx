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

      if (data.type === 'ai_progress') {
        console.log(`Progress: ${data.progress}% - ${data.message}`)
      }

      if (data.type === 'ai_complete') {
        toast.success("✅ Products created successfully!")

        setUploading(false)
        socket.close()

        onClose()
        window.location.reload()
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

                <div className="flex gap-3 mt-4">
                  <button onClick={onClose} className="flex-1 border p-2 rounded">
                    Cancel
                  </button>

                  <button
                    onClick={handleSubmit}
                    disabled={uploading}
                    className="flex-1 bg-primary-600 text-white p-2 rounded"
                  >
                    {uploading ? 'Uploading...' : 'Submit'}
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