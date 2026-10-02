"use client"

import React, { useState, useRef, useEffect } from 'react'
import {
  Palette,
  Image as ImageIcon,
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
  Sparkles,
  ShoppingBag
} from '@/utils/icons'
import { useUpdateProfileMutation } from '@/redux/wholesaler/slices/wholesalerSlice'
import { toast } from 'react-toastify'
import '../../../../styles/Wholesaler/Settings/StoreCustomization.scss'

export default function StoreCustomization({ wholesaler, isLoading: parentLoading }) {
  const [isEditing, setIsEditing] = useState(false)
  const [saveSuccess, setSaveSuccess] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [bannerPreview, setBannerPreview] = useState(null)
  const [logoPreview, setLogoPreview] = useState(null)
  const bannerInputRef = useRef(null)
  const logoInputRef = useRef(null)

  const [updateProfile, { isLoading: isUpdating }] = useUpdateProfileMutation()

  const [storeSettings, setStoreSettings] = useState({
    storeName: '',
    storeTagline: '',
    storeDescription: '',
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
    footerText: ''
  })

  const [editedSettings, setEditedSettings] = useState(storeSettings)

  const themes = [
    { id: 'light', name: 'Clean Light', color: '#FFFFFF', border: '#E2E8F0', textColor: '#0F172A', description: 'Optimal clarity with high contrast' },
    { id: 'dark', name: 'Executive Dark', color: '#0F172A', border: '#334155', textColor: '#F8FAFC', description: 'Sleek luxury enterprise presentation' },
    { id: 'colorful', name: 'Brand Accent', color: '#CE8E6A', border: '#A25690', textColor: '#FFFFFF', description: 'Vibrant highlight on brand colors' }
  ]

  // Load store settings from backend
  useEffect(() => {
    if (wholesaler) {
      const storeData = wholesaler.store_settings || {}
      const initial = {
        storeName: storeData.store_name || wholesaler.business_name || '',
        storeTagline: storeData.store_tagline || '',
        storeDescription: storeData.store_description || wholesaler.business_description || '',
        storeLogo: storeData.store_logo || wholesaler.logo || null,
        bannerImages: storeData.banner_images || [],
        theme: storeData.theme || 'light',
        primaryColor: storeData.primary_color || '#CE8E6A',
        secondaryColor: storeData.secondary_color || '#A25690',
        accentColor: storeData.accent_color || '#E3B751',
        layout: storeData.layout || 'grid',
        showFeaturedProducts: storeData.show_featured_products !== false,
        showCategories: storeData.show_categories !== false,
        showTestimonials: storeData.show_testimonials !== false,
        footerText: storeData.footer_text || `© ${new Date().getFullYear()} ${wholesaler.business_name || 'Wholesale Store'}. All rights reserved.`
      }
      setStoreSettings(initial)
      setEditedSettings(initial)
    }
  }, [wholesaler])

  const handleLogoUpload = (e) => {
    const file = e.target.files[0]
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        toast.error('Logo size should be less than 2MB')
        return
      }
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
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Banner image size should be less than 5MB')
        return
      }
      const reader = new FileReader()
      reader.onloadend = () => {
        setBannerPreview(reader.result)
        setEditedSettings(prev => ({
          ...prev,
          bannerImages: [...prev.bannerImages, reader.result]
        }))
      }
      reader.readAsDataURL(file)
    })
  }

  const removeBanner = (index) => {
    const newBanners = [...editedSettings.bannerImages]
    newBanners.splice(index, 1)
    setEditedSettings({ ...editedSettings, bannerImages: newBanners })
  }

  const handleSave = async () => {
    setIsSaving(true)
    try {
      const formData = new FormData()
      formData.append('store_settings', JSON.stringify({
        store_name: editedSettings.storeName,
        store_tagline: editedSettings.storeTagline,
        store_description: editedSettings.storeDescription,
        theme: editedSettings.theme,
        primary_color: editedSettings.primaryColor,
        secondary_color: editedSettings.secondaryColor,
        accent_color: editedSettings.accentColor,
        layout: editedSettings.layout,
        show_featured_products: editedSettings.showFeaturedProducts,
        show_categories: editedSettings.showCategories,
        showTestimonials: editedSettings.showTestimonials,
        footer_text: editedSettings.footerText,
        banner_images: editedSettings.bannerImages.filter(img => typeof img === 'string')
      }))

      // Only append new logo file if it's a File object
      if (editedSettings.storeLogo && typeof editedSettings.storeLogo !== 'string') {
        formData.append('store_logo', editedSettings.storeLogo)
      }

      // Only append new banner files
      const newBannerFiles = editedSettings.bannerImages.filter(img => typeof img !== 'string')
      newBannerFiles.forEach((file, index) => {
        formData.append(`banner_images_${index}`, file)
      })

      const userId = wholesaler?.user_id || wholesaler?.id
      await updateProfile({ userId: userId, data: formData }).unwrap()
      
      setStoreSettings(editedSettings)
      setSaveSuccess(true)
      toast.success('Storefront customization saved successfully!')
      setIsEditing(false)
      setTimeout(() => setSaveSuccess(false), 3000)
    } catch (error) {
      toast.error(error?.data?.message || 'Failed to save store customization')
    } finally {
      setIsSaving(false)
    }
  }

  const handleCancel = () => {
    setEditedSettings(storeSettings)
    setLogoPreview(null)
    setBannerPreview(null)
    setIsEditing(false)
  }

  if (parentLoading) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200/80 p-8 shadow-xs animate-pulse">
        <div className="h-6 bg-slate-200 rounded w-1/3 mb-4"></div>
        <div className="h-4 bg-slate-200 rounded w-1/2 mb-8"></div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="h-32 bg-slate-100 rounded-xl"></div>
          <div className="h-32 bg-slate-100 rounded-xl"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="store-customization space-y-6">
      {/* Executive Card Header */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-xl bg-primary-50 text-primary-600 flex items-center justify-center shrink-0 border border-primary-100/60 shadow-2xs">
            <Palette size={22} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
                Storefront Customization
              </h3>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/60">
                <CheckCircle size={11} /> Live Storefront
              </span>
            </div>
            <p className="text-xs sm:text-sm font-medium text-slate-500 mt-0.5">
              Personalize B2B storefront themes, hero marketing banners, brand colors, and catalog presentation
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          {!isEditing ? (
            <button
              onClick={() => setIsEditing(true)}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white text-xs sm:text-sm font-semibold rounded-xl shadow-xs transition-all active:scale-95"
            >
              <Edit size={15} />
              <span>Customize Storefront</span>
            </button>
          ) : (
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button
                onClick={handleCancel}
                disabled={isSaving || isUpdating}
                className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-3.5 py-2 text-xs sm:text-sm font-semibold text-slate-700 bg-white border border-slate-200/80 hover:bg-slate-50 rounded-xl shadow-xs transition-all disabled:opacity-50 active:scale-95"
              >
                <X size={14} />
                <span>Cancel</span>
              </button>
              <button
                onClick={handleSave}
                disabled={isSaving || isUpdating}
                className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white text-xs sm:text-sm font-semibold rounded-xl shadow-xs transition-all disabled:opacity-50 active:scale-95"
              >
                {isSaving || isUpdating ? (
                  <>
                    <RefreshCw size={14} className="animate-spin" />
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    <Save size={14} />
                    <span>Save Changes</span>
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Main Customization Sections */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-xs space-y-6">
        {/* Section 1: Store Logo & Media */}
        <div className="rounded-xl border border-slate-200/80 bg-white overflow-hidden shadow-2xs">
          <div className="px-4 py-3 bg-slate-50/70 border-b border-slate-200/80 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ImageIcon size={16} className="text-primary-600" />
              <h4 className="text-xs sm:text-sm font-bold text-slate-900 uppercase tracking-wider">
                Storefront Visual Assets
              </h4>
            </div>
            <span className="text-2xs font-bold text-slate-500 uppercase tracking-wider">Logo & Hero Banners</span>
          </div>

          <div className="p-4 sm:p-5 space-y-5">
            {/* Store Logo */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Storefront Logo
              </label>
              <div className="flex items-center gap-4">
                <div className="relative group">
                  <div className="w-20 h-20 rounded-2xl bg-slate-50 border-2 border-slate-200/80 overflow-hidden flex items-center justify-center shadow-2xs">
                    {logoPreview || editedSettings.storeLogo ? (
                      <img
                        src={logoPreview || editedSettings.storeLogo}
                        alt="Storefront Logo"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <Globe size={32} className="text-slate-300" />
                    )}
                  </div>
                  {isEditing && (
                    <button
                      type="button"
                      onClick={() => logoInputRef.current?.click()}
                      className="absolute -bottom-1.5 -right-1.5 p-2 bg-primary-600 text-white rounded-xl shadow-md hover:bg-primary-700 transition-all active:scale-90"
                    >
                      <Camera size={13} />
                    </button>
                  )}
                  <input
                    ref={logoInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleLogoUpload}
                    className="hidden"
                  />
                </div>
                <div className="space-y-0.5">
                  <p className="text-xs font-semibold text-slate-800">High-Resolution Store Badge</p>
                  <p className="text-2xs text-slate-400 font-medium">Recommended: 200x200px (PNG, JPG, max 2MB)</p>
                </div>
              </div>
            </div>

            {/* Banner Images */}
            <div className="pt-4 border-t border-slate-100">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Promotional Hero Banners
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {editedSettings.bannerImages.map((banner, index) => (
                  <div key={index} className="relative group aspect-video rounded-xl overflow-hidden border border-slate-200/80 bg-slate-50 shadow-2xs">
                    <img src={banner} alt={`Banner ${index + 1}`} className="w-full h-full object-cover" />
                    {isEditing && (
                      <button
                        type="button"
                        onClick={() => removeBanner(index)}
                        className="absolute top-2 right-2 p-1.5 bg-rose-600 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-all shadow-md hover:bg-rose-700"
                        title="Remove Banner"
                      >
                        <X size={13} />
                      </button>
                    )}
                  </div>
                ))}

                {isEditing && (
                  <button
                    type="button"
                    onClick={() => bannerInputRef.current?.click()}
                    className="aspect-video border-2 border-dashed border-slate-300 hover:border-primary-400 hover:bg-primary-50/20 rounded-xl flex flex-col items-center justify-center p-4 transition-all group cursor-pointer"
                  >
                    <Upload size={22} className="text-slate-400 group-hover:text-primary-600 mb-1 transition-colors" />
                    <span className="text-xs font-semibold text-slate-600 group-hover:text-primary-700">Upload Banner</span>
                    <span className="text-2xs text-slate-400 mt-0.5">1200x400px (Max 5MB)</span>
                  </button>
                )}
              </div>
              <input
                ref={bannerInputRef}
                type="file"
                accept="image/*"
                multiple
                onChange={handleBannerUpload}
                className="hidden"
              />
            </div>
          </div>
        </div>

        {/* Section 2: Store Information */}
        <div className="rounded-xl border border-slate-200/80 bg-white overflow-hidden shadow-2xs">
          <div className="px-4 py-3 bg-slate-50/70 border-b border-slate-200/80 flex items-center gap-2">
            <FileText size={16} className="text-primary-600" />
            <h4 className="text-xs sm:text-sm font-bold text-slate-900 uppercase tracking-wider">
              Storefront Information & Copy
            </h4>
          </div>
          <div className="p-4 sm:p-5 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Public Store Name
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={editedSettings.storeName}
                    onChange={(e) => setEditedSettings({ ...editedSettings, storeName: e.target.value })}
                    placeholder="Enter storefront brand name"
                    className="w-full px-3.5 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl text-xs sm:text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all"
                  />
                ) : (
                  <p className="text-sm font-semibold text-slate-900">{storeSettings.storeName || '-'}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Brand Tagline
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={editedSettings.storeTagline}
                    onChange={(e) => setEditedSettings({ ...editedSettings, storeTagline: e.target.value })}
                    placeholder="e.g. India's Leading Fast-Moving Wholesale Hub"
                    className="w-full px-3.5 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl text-xs sm:text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all"
                  />
                ) : (
                  <p className="text-sm font-semibold text-slate-700">{storeSettings.storeTagline || '-'}</p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Storefront Description
              </label>
              {isEditing ? (
                <textarea
                  rows="3"
                  value={editedSettings.storeDescription}
                  onChange={(e) => setEditedSettings({ ...editedSettings, storeDescription: e.target.value })}
                  placeholder="Describe your enterprise product catalog and wholesale commitments..."
                  className="w-full px-3.5 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl text-xs sm:text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all"
                />
              ) : (
                <p className="text-sm font-medium text-slate-600 whitespace-pre-line">{storeSettings.storeDescription || '-'}</p>
              )}
            </div>
          </div>
        </div>

        {/* Section 3: Theme & Palette Settings */}
        <div className="rounded-xl border border-slate-200/80 bg-white overflow-hidden shadow-2xs">
          <div className="px-4 py-3 bg-slate-50/70 border-b border-slate-200/80 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Palette size={16} className="text-primary-600" />
              <h4 className="text-xs sm:text-sm font-bold text-slate-900 uppercase tracking-wider">
                Theme & Color Palette
              </h4>
            </div>
            <span className="text-2xs font-bold text-slate-500 uppercase tracking-wider">Visual Styling</span>
          </div>

          <div className="p-4 sm:p-5 space-y-5">
            {/* Theme options */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {themes.map(t => {
                const isSelected = editedSettings.theme === t.id
                return (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => isEditing && setEditedSettings({ ...editedSettings, theme: t.id })}
                    disabled={!isEditing}
                    className={`p-4 rounded-xl border-2 text-left transition-all ${
                      isSelected
                        ? 'border-primary-600 bg-primary-50/40 shadow-xs'
                        : 'border-slate-200/80 hover:border-slate-300 bg-slate-50/40'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <div
                        className="w-6 h-6 rounded-full border border-slate-300 shadow-2xs"
                        style={{ backgroundColor: t.color }}
                      />
                      <span className="text-xs font-bold text-slate-900">{t.name}</span>
                    </div>
                    <p className="text-2xs text-slate-500 font-medium">{t.description}</p>
                  </button>
                )
              })}
            </div>

            {/* Colors picker */}
            <div className="pt-4 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-2xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">
                  Primary Brand Tone
                </label>
                <div className="flex items-center gap-2.5">
                  <input
                    type="color"
                    value={editedSettings.primaryColor}
                    disabled={!isEditing}
                    onChange={(e) => setEditedSettings({ ...editedSettings, primaryColor: e.target.value })}
                    className="w-9 h-9 rounded-lg border border-slate-300 cursor-pointer disabled:cursor-not-allowed"
                  />
                  <span className="font-mono text-xs font-semibold text-slate-700">{editedSettings.primaryColor}</span>
                </div>
              </div>

              <div>
                <label className="block text-2xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">
                  Secondary Complement
                </label>
                <div className="flex items-center gap-2.5">
                  <input
                    type="color"
                    value={editedSettings.secondaryColor}
                    disabled={!isEditing}
                    onChange={(e) => setEditedSettings({ ...editedSettings, secondaryColor: e.target.value })}
                    className="w-9 h-9 rounded-lg border border-slate-300 cursor-pointer disabled:cursor-not-allowed"
                  />
                  <span className="font-mono text-xs font-semibold text-slate-700">{editedSettings.secondaryColor}</span>
                </div>
              </div>

              <div>
                <label className="block text-2xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">
                  Accent Highlight
                </label>
                <div className="flex items-center gap-2.5">
                  <input
                    type="color"
                    value={editedSettings.accentColor}
                    disabled={!isEditing}
                    onChange={(e) => setEditedSettings({ ...editedSettings, accentColor: e.target.value })}
                    className="w-9 h-9 rounded-lg border border-slate-300 cursor-pointer disabled:cursor-not-allowed"
                  />
                  <span className="font-mono text-xs font-semibold text-slate-700">{editedSettings.accentColor}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Section 4: Layout & Sections */}
        <div className="rounded-xl border border-slate-200/80 bg-white overflow-hidden shadow-2xs">
          <div className="px-4 py-3 bg-slate-50/70 border-b border-slate-200/80 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Layout size={16} className="text-primary-600" />
              <h4 className="text-xs sm:text-sm font-bold text-slate-900 uppercase tracking-wider">
                Catalog Layout & Homepage Sections
              </h4>
            </div>
            <span className="text-2xs font-bold text-slate-500 uppercase tracking-wider">Display Options</span>
          </div>

          <div className="p-4 sm:p-5 space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Default Catalog Display Layout
              </label>
              {isEditing ? (
                <select
                  value={editedSettings.layout}
                  onChange={(e) => setEditedSettings({ ...editedSettings, layout: e.target.value })}
                  className="w-full sm:w-64 px-3.5 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl text-xs sm:text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all"
                >
                  <option value="grid">Grid Layout (Multi-card view)</option>
                  <option value="list">List Layout (Compact table view)</option>
                </select>
              ) : (
                <p className="text-sm font-semibold text-slate-900 capitalize">{storeSettings.layout} Layout</p>
              )}
            </div>

            <div className="pt-3 border-t border-slate-100 space-y-2.5">
              <label className="flex items-center gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={editedSettings.showFeaturedProducts}
                  onChange={(e) => setEditedSettings({ ...editedSettings, showFeaturedProducts: e.target.checked })}
                  disabled={!isEditing}
                  className="rounded border-slate-300 text-primary-600 focus:ring-primary-500"
                />
                <span className="text-xs sm:text-sm font-medium text-slate-700">
                  Feature Top-Velocity Products on Storefront Homepage
                </span>
              </label>

              <label className="flex items-center gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={editedSettings.showCategories}
                  onChange={(e) => setEditedSettings({ ...editedSettings, showCategories: e.target.checked })}
                  disabled={!isEditing}
                  className="rounded border-slate-300 text-primary-600 focus:ring-primary-500"
                />
                <span className="text-xs sm:text-sm font-medium text-slate-700">
                  Display Category Carousel on Storefront
                </span>
              </label>

              <label className="flex items-center gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={editedSettings.showTestimonials}
                  onChange={(e) => setEditedSettings({ ...editedSettings, showTestimonials: e.target.checked })}
                  disabled={!isEditing}
                  className="rounded border-slate-300 text-primary-600 focus:ring-primary-500"
                />
                <span className="text-xs sm:text-sm font-medium text-slate-700">
                  Show Verified Retailer Feedback & Testimonial Section
                </span>
              </label>
            </div>
          </div>
        </div>

        {/* Section 5: Footer Notice */}
        <div className="rounded-xl border border-slate-200/80 bg-white overflow-hidden shadow-2xs">
          <div className="px-4 py-3 bg-slate-50/70 border-b border-slate-200/80 flex items-center gap-2">
            <Type size={16} className="text-primary-600" />
            <h4 className="text-xs sm:text-sm font-bold text-slate-900 uppercase tracking-wider">
              Footer & Legal Copyright
            </h4>
          </div>
          <div className="p-4 sm:p-5">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Footer Text Notice
            </label>
            {isEditing ? (
              <input
                type="text"
                value={editedSettings.footerText}
                onChange={(e) => setEditedSettings({ ...editedSettings, footerText: e.target.value })}
                placeholder="© 2026 Your Enterprise. All rights reserved."
                className="w-full px-3.5 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl text-xs sm:text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all"
              />
            ) : (
              <p className="text-sm font-medium text-slate-600">{storeSettings.footerText || '-'}</p>
            )}
          </div>
        </div>

        {/* Live Storefront Preview */}
        <div className="rounded-2xl border border-slate-200/80 bg-gradient-to-r from-primary-50/50 via-slate-50 to-primary-50/30 p-5 shadow-2xs">
          <div className="flex items-center gap-2 mb-3">
            <Eye size={18} className="text-primary-600" />
            <h4 className="text-xs sm:text-sm font-bold text-slate-900 uppercase tracking-wider">
              Live Storefront Preview
            </h4>
          </div>
          <div className="bg-white rounded-xl border border-slate-200/80 p-4 shadow-sm flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-slate-100 border border-slate-200/80 flex items-center justify-center shrink-0 overflow-hidden">
              {logoPreview || editedSettings.storeLogo ? (
                <img
                  src={logoPreview || editedSettings.storeLogo}
                  alt="Preview"
                  className="w-full h-full object-cover"
                />
              ) : (
                <ShoppingBag size={20} className="text-slate-400" />
              )}
            </div>
            <div className="space-y-1">
              <h5 className="text-base font-bold text-slate-900 tracking-tight">
                {editedSettings.storeName || 'Wholesale Store Name'}
              </h5>
              <p className="text-xs font-semibold text-primary-600">
                {editedSettings.storeTagline || 'Enterprise Distributor'}
              </p>
              <p className="text-xs text-slate-500 line-clamp-2">
                {editedSettings.storeDescription || 'Storefront description appears here for verified retail buyers.'}
              </p>
            </div>
          </div>
        </div>

        {/* Success Alert */}
        {saveSuccess && (
          <div className="p-4 bg-emerald-50 border border-emerald-200/80 rounded-xl flex items-center gap-3">
            <CheckCircle size={18} className="text-emerald-600 shrink-0" />
            <p className="text-xs sm:text-sm font-semibold text-emerald-800">
              Storefront branding configuration saved and propagated to buyer catalogs.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
