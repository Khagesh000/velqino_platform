import { useState, useEffect } from 'react'
import { X, Upload, ImageIcon, PackageIcon } from '../../../../utils/icons'
import { toast } from 'react-toastify'
import productsAPI from '../../../../redux/wholesaler/Api/productsAPI'

export default function ImportImagesModal({ onClose, categories = [] }) {

  const [images, setImages] = useState([])
  const [uploading, setUploading] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [mode, setMode] = useState('bulk_single_product'); // 'front_only' or 'front_back'
  const [progress, setProgress] = useState(0)
  const [progressMessage, setProgressMessage] = useState('')
  const [selectedSizes, setSelectedSizes] = useState([])
  const availableSizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL']
  const [isOpen, setIsOpen] = useState(false);

  const [formData, setFormData] = useState({
    common_price: '',
    common_cost: '',
    category_id: '',
    common_name_prefix: '',
    brand: '',
    description: ''
  })

        // Add this useEffect right after all useState declarations
      // ✅ Add this instead - only resets when modal first mounts
  useEffect(() => {
    return () => {
      // Cleanup when component unmounts
      setMode(null);
      setShowForm(false);
      setImages([]);
      setSelectedSizes([]);
      setProgress(0);
      setProgressMessage('');
    };
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  // ✅ Handle image selection
        const handleImagesSelect = (e) => {
        const files = Array.from(e.target.files)
        if (!files.length) return

        const validFormats = ['image/jpeg', 'image/png', 'image/webp']
        const invalid = files.find(f => !validFormats.includes(f.type))
        if (invalid) {
            toast.error('Upload valid images (JPG, PNG, WEBP)')
            return
        }

        if (files.length > 20) {
            toast.error('Maximum 20 images at once')
            return
        }

        // ✅ Validate based on selected mode
        if (mode === 'front_back' && files.length % 2 !== 0) {
            toast.error('Front + Back mode needs even number of images')
            return
        }

        setImages(files)
        setShowForm(true)

        const productCount = mode === 'front_back' ? files.length / 2 : files.length
        toast.success(`${files.length} images selected → ${productCount} products ✅`)
        }

        const toggleSize = (size) => {
        setSelectedSizes(prev =>
          prev.includes(size) ? prev.filter(s => s !== size) : [...prev, size]
        )
      }

      // ✅ Handle submit
    const handleSubmit = async () => {
      if (!images.length) {
        toast.error('Please select images first')
        return
      }

      if (!formData.common_price || !formData.common_cost) {
        toast.error('Please fill price and cost')
        return
      }

      setUploading(true)

      const data = new FormData()

      // ✅ Append all images
      images.forEach(img => data.append('images', img))

      // ✅ Append form fields
      Object.keys(formData).forEach(key => {
        if (formData[key] !== '' && formData[key] !== null) {
          if (key === 'category_id') {
            data.append(key, Number(formData[key]))
          } else {
            data.append(key, formData[key])
          }
        }
      })

      // ✅ Send mode to backend so it knows pairing logic
      data.append('upload_mode', mode)
      selectedSizes.forEach(size => data.append('sizes', size))

      // ✅ ADD before productsAPI.bulkImageUpload(data)
    console.log('📦 Selected sizes:', selectedSizes)
    for (let pair of data.entries()) {
      console.log('FormData entry:', pair[0], pair[1])
    }

      try {
        const response = await productsAPI.bulkImageUpload(data)

        if (response.data.status === 'error') {
          toast.error(response.data.message)
          setUploading(false)
          return
        }

        const taskId = response.data.task_id
        toast.info('AI processing started... ⏳')

        const socket = new WebSocket(`${process.env.NEXT_PUBLIC_WS_URL}/ws/ai-progress/${taskId}/`)

        socket.onopen = () => {
      console.log('🟢 WebSocket Connected')
      console.log('🔗 Connected to:', `${process.env.NEXT_PUBLIC_WS_URL}/ws/ai-progress/${taskId}/`)
    }

    socket.onmessage = (event) => {
      console.log('📨 Raw message received:', event.data)
      
      const data = JSON.parse(event.data)
      console.log('📦 Parsed data:', data)
      console.log('📌 Type:', data.type)
      console.log('📊 Progress:', data.progress)
      console.log('💬 Message:', data.message)

      if (data.type === 'send_progress') {
        console.log('✅ Updating progress bar to:', data.progress)
        setProgress(data.progress)
        setProgressMessage(data.message)
      }

      if (data.progress === 100) {
        console.log('🎉 100% reached — closing')
        setProgress(100)
        setProgressMessage('Completed!')
        toast.success('✅ Products created successfully!')
        setTimeout(() => {
          setUploading(false)
          socket.close()
          onClose()
          window.location.reload()
        }, 1000)
      }
    }

    socket.onerror = (error) => {
      console.log('❌ WebSocket error:', error)
      toast.error('WebSocket error')
      setUploading(false)
    }

    socket.onclose = (event) => {
      console.log('🔴 WebSocket Closed')
      console.log('Close code:', event.code)
      console.log('Close reason:', event.reason)
      console.log('Was clean:', event.wasClean)
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
          <h2 className="text-xl font-bold text-gray-900">Bulk Image Upload</h2>
          <button onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        {/* MODE SELECTION — show before upload */}
        {!mode && (
          <div className="space-y-3">
            <p className="text-sm font-medium text-gray-700">Select upload type:</p>

            {/* Front Only */}
            <button
              onClick={() => setMode('front_only')}
              className="w-full flex items-center gap-3 p-4 border-2 border-gray-200 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-all text-left"
            >
              <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                <ImageIcon size={20} className="text-primary-600" />
              </div>
              <div>
                <div className="text-sm font-medium text-gray-900">Front Only</div>
                <div className="text-xs text-gray-500">One image per product</div>
              </div>
            </button>

            {/* Front + Back */}
            <button
              onClick={() => setMode('front_back')}
              className="w-full flex items-center gap-3 p-4 border-2 border-gray-200 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-all text-left"
            >
              <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                <ImageIcon size={20} className="text-primary-600" />
              </div>
              <div>
                <div className="text-sm font-medium text-gray-900">Front + Back</div>
                <div className="text-xs text-gray-500">Two images per product (pairs)</div>
              </div>
            </button>

            {/* ✅ Bulk Single Product - DEFAULT HIGHLIGHTED */}
            <button
              onClick={() => setMode('bulk_single_product')}
              className="w-full flex items-center gap-3 p-4 border-2 border-primary-500 bg-primary-50 rounded-lg hover:bg-primary-100 transition-all text-left"
            >
              <div className="w-10 h-10 bg-primary-200 rounded-lg flex items-center justify-center">
                <PackageIcon size={20} className="text-primary-700" />
              </div>
              <div>
                <div className="text-sm font-medium text-gray-900">Bulk Single Product</div>
                <div className="text-xs text-gray-600 font-medium">📦 Multiple images → ONE product</div>
                <div className="text-xs text-gray-500">All images become one product (stock = image count)</div>
              </div>
            </button>
          </div>
        )}

        {/* IMAGE UPLOAD — show after mode selected */}
        {mode && !showForm && (
          <div className="space-y-3">

            {/* Show selected mode with change option */}
            <div className="flex items-center justify-between bg-primary-50 px-3 py-2 rounded-lg">
              <span className="text-sm text-primary-700 font-medium">
                {mode === 'front_only' && '📸 Front Only'}
                {mode === 'front_back' && '📸 Front + Back pairs'}
                {mode === 'bulk_single_product' && '📦 Bulk Single Product (Multiple images → ONE product)'}
              </span>
              <button onClick={() => setMode(null)} className="text-xs text-gray-500 underline">
                Change
              </button>
            </div>

            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
              <Upload className="w-10 h-10 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-600">
                {mode === 'front_only' && 'Select front images (1 per product)'}
                {mode === 'front_back' && 'Select images in pairs (front1, back1, front2, back2...)'}
                {mode === 'bulk_single_product' && 'Select multiple images — ALL will become ONE product (stock = image count)'}
              </p>
              <p className="text-xs text-gray-400 mt-1">JPG, PNG, WEBP — Max 20 images</p>

              <input
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                id="imagesUpload"
                onChange={handleImagesSelect}
              />

              <button
                onClick={() => document.getElementById('imagesUpload').click()}
                className="mt-4 px-4 py-2 bg-primary-600 text-white rounded-lg"
              >
                Select Images
              </button>
            </div>
          </div>
        )}

        {/* FORM AFTER IMAGES */}
        {showForm && (
          <div className="space-y-4">

            <p className="text-sm text-green-600">
              {mode === 'bulk_single_product' ? (
                <>🖼️ {images.length} images selected → <span className="font-bold">1 product</span> (Stock: {images.length})</>
              ) : (
                <>🖼️ {images.length} images selected ({mode === 'front_back' ? images.length / 2 : images.length} products)</>
              )}
            </p>

            {/* Image preview */}
            <div className="grid grid-cols-4 gap-2 max-h-32 overflow-y-auto">
              {images.map((img, i) => (
                <div key={i} className="relative">
                  <img
                    src={URL.createObjectURL(img)}
                    className="w-full h-16 object-cover rounded border"
                    alt={img.name}
                  />
                  <span className="absolute bottom-0 left-0 text-xs bg-black/50 text-white px-1 rounded">
                    {mode === 'front_back' ? (i % 2 === 0 ? 'F' : 'B') : i + 1}
                  </span>
                </div>
              ))}
            </div>

            <input
              type="number"
              name="common_price"
              placeholder="Common Price *"
              onChange={handleChange}
              className="w-full border p-2 rounded"
            />

            <input
              type="number"
              name="common_cost"
              placeholder="Common Cost *"
              onChange={handleChange}
              className="w-full border p-2 rounded"
            />

            <input
              type="text"
              name="common_name_prefix"
              placeholder="Name Prefix (e.g. Shirt)"
              onChange={handleChange}
              className="w-full border p-2 rounded"
            />

            <input
              type="text"
              name="brand"
              placeholder="Brand"
              onChange={handleChange}
              className="w-full border p-2 rounded"
            />

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
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>

            <textarea
              name="description"
              placeholder="Description (optional)"
              onChange={handleChange}
              className="w-full border p-2 rounded"
              rows={3}
            />

            {/* Progress Bar */}
            {uploading && (
              <div className="rounded-2xl border border-primary-100 bg-gradient-to-br from-primary-50 to-white p-5 space-y-4 shadow-sm">
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
                      {progressMessage || 'Starting AI processing...'}
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {progress < 30 && '🔍 Analyzing images...'}
                      {progress >= 30 && progress < 60 && '🎨 Removing backgrounds...'}
                      {progress >= 60 && progress < 90 && '✨ Enhancing quality...'}
                      {progress >= 90 && '🚀 Almost done...'}
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
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse rounded-full" />
                    </div>
                  </div>
                  <div className="flex justify-between text-[10px] text-gray-400 px-0.5">
                    <span className={progress >= 10 ? 'text-primary-500 font-medium' : ''}>Upload</span>
                    <span className={progress >= 30 ? 'text-primary-500 font-medium' : ''}>Analyze</span>
                    <span className={progress >= 60 ? 'text-primary-500 font-medium' : ''}>Process</span>
                    <span className={progress >= 90 ? 'text-primary-500 font-medium' : ''}>Finish</span>
                  </div>
                </div>
                <p className="text-center text-xs text-gray-400 italic">
                  {progress < 50
                    ? '⚡ Our AI is working hard on your products...'
                    : '🎯 Almost ready — professional listings incoming!'}
                </p>
              </div>
            )}

            <button
              onClick={handleSubmit}
              disabled={uploading}
              className="w-full py-3 bg-primary-600 text-white rounded-lg font-medium disabled:opacity-50"
            >
              {uploading ? 'Processing... ⏳' : `Upload ${mode === 'bulk_single_product' ? '1 Product' : mode === 'front_back' ? images.length / 2 : images.length} Products`}
            </button>

            <button
              onClick={() => { setShowForm(false); setImages([]) }}
              className="w-full py-2 border border-gray-300 rounded-lg text-gray-600"
            >
              Change Images
            </button>

          </div>
        )}

      </div>
    </div>
  </div>
</div>
  )
}