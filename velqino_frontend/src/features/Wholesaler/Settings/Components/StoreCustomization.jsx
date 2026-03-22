"use client"

import React, { useState, useRef } from 'react'
import {
  Palette,
  Image,
  FileText,
  Upload,
  Camera,
  X,
  CheckCircle,
  Save,
  Edit,
  RefreshCw,
  Eye,
  Globe,
  Layout,
  Type,
  Sparkles
} from '../../../../utils/icons'
import '../../../../styles/Wholesaler/Settings/StoreCustomization.scss'

export default function StoreCustomization() {
  const [isEditing, setIsEditing] = useState(false)
  const [saveSuccess, setSaveSuccess] = useState(false)
  const [selectedTheme, setSelectedTheme] = useState('light')
  const [bannerPreview, setBannerPreview] = useState(null)
  const [logoPreview, setLogoPreview] = useState(null)
  const bannerInputRef = useRef(null)
  const logoInputRef = useRef(null)

  const [storeSettings, setStoreSettings] = useState({
    storeName: 'VELTRIX Wholesale',
    storeTagline: 'Premium Products for Your Business',
    storeDescription: 'VELTRIX Wholesale is a leading distributor of premium electronics and lifestyle products, serving retailers across India since 2020. We offer high-quality products at competitive wholesale prices with reliable shipping and dedicated customer support.',
    storeLogo: null,
    bannerImages: [],
    theme: 'light',
    primaryColor: '#CE8E6A',
    secondaryColor: '#A25690',
    accentColor: '#E3B751',
    layout: 'grid',
    showFeaturedProducts: true,
    showCategories: true,
    showTestimonials: true,
    footerText: '© 2024 VELTRIX Wholesale. All rights reserved.'
  })

  const [editedSettings, setEditedSettings] = useState(storeSettings)

  const themes = [
    { id: 'light', name: 'Light', color: '#FFFFFF', textColor: '#1F2937', bgColor: '#F9FAFB' },
    { id: 'dark', name: 'Dark', color: '#1F2937', textColor: '#F9FAFB', bgColor: '#111827' },
    { id: 'colorful', name: 'Colorful', color: '#CE8E6A', textColor: '#FFFFFF', bgColor: '#A25690' }
  ]

  const handleLogoUpload = (e) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setLogoPreview(reader.result)
        setEditedSettings({ ...editedSettings, storeLogo: file })
      }
      reader.readAsDataURL(file)
    }
  }

  const handleBannerUpload = (e) => {
    const files = Array.from(e.target.files)
    files.forEach(file => {
      const reader = new FileReader()
      reader.onloadend = () => {
        setBannerPreview(reader.result)
        setEditedSettings({ ...editedSettings, bannerImages: [...editedSettings.bannerImages, reader.result] })
      }
      reader.readAsDataURL(file)
    })
  }

  const removeBanner = (index) => {
    const newBanners = [...editedSettings.bannerImages]
    newBanners.splice(index, 1)
    setEditedSettings({ ...editedSettings, bannerImages: newBanners })
  }

  const handleSave = () => {
    setSaveSuccess(false)
    setTimeout(() => {
      setStoreSettings(editedSettings)
      setSaveSuccess(true)
      setIsEditing(false)
      setTimeout(() => setSaveSuccess(false), 3000)
    }, 1000)
  }

  const handleCancel = () => {
    setEditedSettings(storeSettings)
    setLogoPreview(null)
    setBannerPreview(null)
    setIsEditing(false)
  }

  return (
    <div className="store-customization bg-white rounded-xl border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="px-4 sm:px-6 py-4 border-b border-gray-200 bg-gray-50/50 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-primary-100 flex items-center justify-center text-primary-600">
            <Palette size={20} />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-semibold text-gray-900">Store Customization</h3>
            <p className="text-xs sm:text-sm text-gray-500">Customize your store appearance and branding</p>
          </div>
        </div>
        {!isEditing ? (
          <button
            onClick={() => setIsEditing(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-primary-500 text-white text-sm rounded-lg hover:bg-primary-600 transition-all"
          >
            <Edit size={14} />
            Customize Store
          </button>
        ) : (
          <div className="flex items-center gap-2">
            <button onClick={handleCancel} className="px-3 py-1.5 text-sm text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50">
              Cancel
            </button>
            <button onClick={handleSave} className="px-3 py-1.5 bg-primary-500 text-white text-sm rounded-lg hover:bg-primary-600 flex items-center gap-1">
              <Save size={14} />
              Save Changes
            </button>
          </div>
        )}
      </div>

      <div className="p-4 sm:p-6 space-y-6">
        {/* Store Logo */}
        <div className="border border-gray-200 rounded-xl overflow-hidden">
          <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
            <h4 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
              <Image size={16} className="text-gray-500" />
              Store Logo
            </h4>
          </div>
          <div className="p-4 flex items-center gap-4">
            <div className="relative">
              <div className="w-20 h-20 rounded-lg bg-gray-100 border-2 border-gray-200 overflow-hidden flex items-center justify-center">
                {logoPreview || storeSettings.storeLogo ? (
                  <img src={logoPreview || storeSettings.storeLogo} alt="Store Logo" className="w-full h-full object-cover" />
                ) : (
                  <Globe size={32} className="text-gray-400" />
                )}
              </div>
              {isEditing && (
                <button
                  onClick={() => logoInputRef.current?.click()}
                  className="absolute -bottom-2 -right-2 p-1.5 bg-primary-500 rounded-full text-white hover:bg-primary-600 transition-all"
                >
                  <Camera size={12} />
                </button>
              )}
              <input ref={logoInputRef} type="file" accept="image/*" onChange={handleLogoUpload} className="hidden" />
            </div>
            {isEditing && <p className="text-xs text-gray-500">Recommended size: 200x200px (PNG, JPG)</p>}
          </div>
        </div>

        {/* Banner Images */}
        <div className="border border-gray-200 rounded-xl overflow-hidden">
          <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
            <h4 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
              <Image size={16} className="text-gray-500" />
              Banner Images
            </h4>
          </div>
          <div className="p-4">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-3">
              {editedSettings.bannerImages.map((banner, index) => (
                <div key={index} className="relative group">
                  <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden">
                    <img src={banner} alt={`Banner ${index + 1}`} className="w-full h-full object-cover" />
                  </div>
                  {isEditing && (
                    <button
                      onClick={() => removeBanner(index)}
                      className="absolute top-1 right-1 p-1 bg-red-500 rounded-full text-white opacity-0 group-hover:opacity-100 transition-all"
                    >
                      <X size={12} />
                    </button>
                  )}
                </div>
              ))}
              {isEditing && (
                <button
                  onClick={() => bannerInputRef.current?.click()}
                  className="aspect-video border-2 border-dashed border-gray-200 rounded-lg flex flex-col items-center justify-center hover:border-primary-300 transition-all"
                >
                  <Upload size={24} className="text-gray-400 mb-1" />
                  <span className="text-xs text-gray-500">Upload Banner</span>
                </button>
              )}
            </div>
            <input ref={bannerInputRef} type="file" accept="image/*" multiple onChange={handleBannerUpload} className="hidden" />
            {isEditing && <p className="text-xs text-gray-500 mt-2">Recommended size: 1200x400px. Supports JPG, PNG, WebP</p>}
          </div>
        </div>

        {/* Store Information */}
        <div className="border border-gray-200 rounded-xl overflow-hidden">
          <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
            <h4 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
              <FileText size={16} className="text-gray-500" />
              Store Information
            </h4>
          </div>
          <div className="p-4 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Store Name</label>
              {isEditing ? (
                <input
                  type="text"
                  value={editedSettings.storeName}
                  onChange={(e) => setEditedSettings({ ...editedSettings, storeName: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-primary-500"
                />
              ) : (
                <p className="text-sm text-gray-900">{storeSettings.storeName}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Store Tagline</label>
              {isEditing ? (
                <input
                  type="text"
                  value={editedSettings.storeTagline}
                  onChange={(e) => setEditedSettings({ ...editedSettings, storeTagline: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-primary-500"
                />
              ) : (
                <p className="text-sm text-gray-600">{storeSettings.storeTagline}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Store Description</label>
              {isEditing ? (
                <textarea
                  rows="4"
                  value={editedSettings.storeDescription}
                  onChange={(e) => setEditedSettings({ ...editedSettings, storeDescription: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-primary-500"
                />
              ) : (
                <p className="text-sm text-gray-600">{storeSettings.storeDescription}</p>
              )}
            </div>
          </div>
        </div>

        {/* Theme Settings */}
        <div className="border border-gray-200 rounded-xl overflow-hidden">
          <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
            <h4 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
              <Palette size={16} className="text-gray-500" />
              Theme Settings
            </h4>
          </div>
          <div className="p-4">
            <div className="grid grid-cols-3 gap-3 mb-4">
              {themes.map(theme => (
                <button
                  key={theme.id}
                  className={`p-3 rounded-lg border-2 transition-all ${
                    editedSettings.theme === theme.id
                      ? 'border-primary-500 bg-primary-50'
                      : 'border-gray-200 hover:border-primary-300'
                  }`}
                  onClick={() => setEditedSettings({ ...editedSettings, theme: theme.id })}
                  disabled={!isEditing}
                >
                  <div className="flex items-center justify-center mb-2">
                    <div className="w-8 h-8 rounded-full" style={{ backgroundColor: theme.color }}></div>
                  </div>
                  <p className="text-sm font-medium text-gray-900">{theme.name}</p>
                </button>
              ))}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Primary Color</label>
                {isEditing ? (
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={editedSettings.primaryColor}
                      onChange={(e) => setEditedSettings({ ...editedSettings, primaryColor: e.target.value })}
                      className="w-10 h-10 rounded-lg border border-gray-200 cursor-pointer"
                    />
                    <span className="text-xs text-gray-500">{editedSettings.primaryColor}</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full" style={{ backgroundColor: storeSettings.primaryColor }}></div>
                    <span className="text-xs text-gray-600">{storeSettings.primaryColor}</span>
                  </div>
                )}
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Secondary Color</label>
                {isEditing ? (
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={editedSettings.secondaryColor}
                      onChange={(e) => setEditedSettings({ ...editedSettings, secondaryColor: e.target.value })}
                      className="w-10 h-10 rounded-lg border border-gray-200 cursor-pointer"
                    />
                    <span className="text-xs text-gray-500">{editedSettings.secondaryColor}</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full" style={{ backgroundColor: storeSettings.secondaryColor }}></div>
                    <span className="text-xs text-gray-600">{storeSettings.secondaryColor}</span>
                  </div>
                )}
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Accent Color</label>
                {isEditing ? (
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={editedSettings.accentColor}
                      onChange={(e) => setEditedSettings({ ...editedSettings, accentColor: e.target.value })}
                      className="w-10 h-10 rounded-lg border border-gray-200 cursor-pointer"
                    />
                    <span className="text-xs text-gray-500">{editedSettings.accentColor}</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full" style={{ backgroundColor: storeSettings.accentColor }}></div>
                    <span className="text-xs text-gray-600">{storeSettings.accentColor}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Layout Settings */}
        <div className="border border-gray-200 rounded-xl overflow-hidden">
          <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
            <h4 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
              <Layout size={16} className="text-gray-500" />
              Layout Settings
            </h4>
          </div>
          <div className="p-4 space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Default Layout</label>
              {isEditing ? (
                <select
                  value={editedSettings.layout}
                  onChange={(e) => setEditedSettings({ ...editedSettings, layout: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-primary-500"
                >
                  <option value="grid">Grid Layout</option>
                  <option value="list">List Layout</option>
                </select>
              ) : (
                <p className="text-sm text-gray-900 capitalize">{storeSettings.layout} Layout</p>
              )}
            </div>
            <div className="space-y-2">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={editedSettings.showFeaturedProducts}
                  onChange={(e) => setEditedSettings({ ...editedSettings, showFeaturedProducts: e.target.checked })}
                  disabled={!isEditing}
                  className="rounded border-gray-300 text-primary-600"
                />
                <span className="text-sm text-gray-700">Show Featured Products on Homepage</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={editedSettings.showCategories}
                  onChange={(e) => setEditedSettings({ ...editedSettings, showCategories: e.target.checked })}
                  disabled={!isEditing}
                  className="rounded border-gray-300 text-primary-600"
                />
                <span className="text-sm text-gray-700">Show Categories on Homepage</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={editedSettings.showTestimonials}
                  onChange={(e) => setEditedSettings({ ...editedSettings, showTestimonials: e.target.checked })}
                  disabled={!isEditing}
                  className="rounded border-gray-300 text-primary-600"
                />
                <span className="text-sm text-gray-700">Show Testimonials Section</span>
              </label>
            </div>
          </div>
        </div>

        {/* Footer Settings */}
        <div className="border border-gray-200 rounded-xl overflow-hidden">
          <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
            <h4 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
              <Type size={16} className="text-gray-500" />
              Footer Settings
            </h4>
          </div>
          <div className="p-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Footer Text</label>
              {isEditing ? (
                <input
                  type="text"
                  value={editedSettings.footerText}
                  onChange={(e) => setEditedSettings({ ...editedSettings, footerText: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-primary-500"
                />
              ) : (
                <p className="text-sm text-gray-600">{storeSettings.footerText}</p>
              )}
            </div>
          </div>
        </div>

        {/* Success Message */}
        {saveSuccess && (
          <div className="p-3 bg-success-50 rounded-lg flex items-center gap-2">
            <CheckCircle size={16} className="text-success-600" />
            <p className="text-sm text-success-600">Store customization saved successfully!</p>
          </div>
        )}

        {/* Preview Card */}
        <div className="bg-gradient-to-r from-primary-50 to-primary-100 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-3">
            <Eye size={18} className="text-primary-600" />
            <h4 className="text-sm font-semibold text-primary-700">Live Preview</h4>
          </div>
          <div className="bg-white rounded-lg p-3 shadow-sm">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 rounded-lg bg-primary-100 flex items-center justify-center text-primary-600">
                {logoPreview || storeSettings.storeLogo ? (
                  <img src={logoPreview || storeSettings.storeLogo} alt="Logo" className="w-6 h-6 object-cover rounded" />
                ) : (
                  <Globe size={16} />
                )}
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-900">{editedSettings.storeName}</p>
                <p className="text-xs text-gray-500">{editedSettings.storeTagline}</p>
              </div>
            </div>
            <p className="text-xs text-gray-600 line-clamp-2">{editedSettings.storeDescription}</p>
          </div>
        </div>
      </div>
    </div>
  )
}