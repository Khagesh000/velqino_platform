"use client"

import React, { useState, useEffect } from 'react'
import { Store, MapPin, Phone, Mail, FileText, Edit, Save, X, Camera, Upload, CheckCircle, ShieldCheck } from '../../../../utils/icons'

export default function StoreProfile() {
  const [mounted, setMounted] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    storeName: 'Veltrix Retail Store',
    ownerName: 'Rajesh Kumar',
    email: 'store@veltrix.com',
    phone: '+91 98765 43210',
    alternatePhone: '+91 87654 32109',
    address: '123, MG Road, Brigade Road Junction',
    city: 'Bangalore',
    state: 'Karnataka',
    pincode: '560001',
    gstNumber: '29ABCDE1234F1Z5',
    panNumber: 'ABCDE1234F',
    website: 'www.veltrix.com',
    description: 'Leading retail store for electronics, appliances, and fashion lifestyle.'
  })
  const [logoPreview, setLogoPreview] = useState(null)
  const [showSuccess, setShowSuccess] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  const handleInputChange = (field, value) => {
    setFormData({ ...formData, [field]: value })
  }

  const handleSave = () => {
    setIsEditing(false)
    setShowSuccess(true)
    setTimeout(() => setShowSuccess(false), 2500)
  }

  const handleLogoUpload = (e) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setLogoPreview(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  return (
    <div className="bg-white rounded-3xl border border-gray-200/80 shadow-2xs overflow-hidden">
      {/* Header */}
      <div className="p-5 sm:p-6 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-primary-50 text-primary-600 flex items-center justify-center shrink-0">
            <Store size={20} />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-extrabold text-gray-900 tracking-tight">Store Profile &amp; Legal Identity</h3>
            <p className="text-xs text-gray-500">Official business credentials, registered location, and contact lines</p>
          </div>
        </div>

        <div>
          {isEditing ? (
            <div className="flex items-center gap-2">
              <button 
                type="button"
                onClick={() => setIsEditing(false)} 
                className="px-3.5 py-2 text-xs font-bold text-gray-600 hover:bg-gray-100 rounded-xl transition-all"
              >
                Cancel
              </button>
              <button 
                type="button"
                onClick={handleSave} 
                className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-primary-600 hover:bg-primary-700 rounded-xl shadow-xs transition-all"
              >
                <Save size={13} />
                <span>Save Changes</span>
              </button>
            </div>
          ) : (
            <button 
              type="button"
              onClick={() => setIsEditing(true)} 
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-gray-700 bg-white border border-gray-200 hover:bg-gray-50 active:scale-95 rounded-xl shadow-2xs transition-all"
            >
              <Edit size={13} />
              <span>Edit Profile</span>
            </button>
          )}
        </div>
      </div>

      {/* Success Notification */}
      {showSuccess && (
        <div className="mx-6 mt-4 p-3 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center gap-2 text-xs font-bold text-emerald-800 animate-fadeIn">
          <CheckCircle size={16} className="text-emerald-600 shrink-0" />
          <span>Store credentials updated and verified successfully!</span>
        </div>
      )}

      {/* Brand Logo Upload Banner */}
      <div className="p-5 sm:p-6 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center gap-4">
        <div className="w-20 h-20 bg-gray-50 border border-gray-200/80 rounded-2xl flex items-center justify-center overflow-hidden shrink-0 shadow-2xs">
          {logoPreview ? (
            <img src={logoPreview} alt="Store logo" className="w-full h-full object-cover" />
          ) : (
            <Store size={28} className="text-gray-300" />
          )}
        </div>
        <div>
          <label className="block text-xs font-bold text-gray-700 mb-1">Official Brand Emblem</label>
          <div className="flex items-center gap-2 mt-1">
            <input
              type="file"
              accept="image/*"
              onChange={handleLogoUpload}
              className="hidden"
              id="logo-upload"
            />
            <label 
              htmlFor="logo-upload" 
              className="px-3.5 py-1.5 text-xs font-bold bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl cursor-pointer transition-all inline-flex items-center gap-1.5"
            >
              <Upload size={13} />
              <span>Upload New Emblem</span>
            </label>
          </div>
          <p className="text-[11px] text-gray-400 mt-1">Rendered on thermal receipts, order invoices, and wholesale purchase vouchers.</p>
        </div>
      </div>

      {/* Form Fields */}
      <div className="p-4 sm:p-5 space-y-3.5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-3.5 rounded-2xl border border-gray-200/60 bg-gray-50/40">
            <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1">Store Legal Name *</label>
            {isEditing ? (
              <input
                type="text"
                value={formData.storeName}
                onChange={(e) => handleInputChange('storeName', e.target.value)}
                className="w-full px-3 py-1.5 text-xs sm:text-sm bg-white border border-gray-200 rounded-xl focus:border-primary-500"
              />
            ) : (
              <p className="text-xs sm:text-sm font-extrabold text-gray-900">{formData.storeName}</p>
            )}
          </div>

          <div className="p-3.5 rounded-2xl border border-gray-200/60 bg-gray-50/40">
            <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1">Proprietor / Managing Partner</label>
            {isEditing ? (
              <input
                type="text"
                value={formData.ownerName}
                onChange={(e) => handleInputChange('ownerName', e.target.value)}
                className="w-full px-3 py-1.5 text-xs sm:text-sm bg-white border border-gray-200 rounded-xl focus:border-primary-500"
              />
            ) : (
              <p className="text-xs sm:text-sm font-extrabold text-gray-900">{formData.ownerName}</p>
            )}
          </div>

          <div className="p-3.5 rounded-2xl border border-gray-200/60 bg-gray-50/40">
            <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1">Official Business Email *</label>
            {isEditing ? (
              <input
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className="w-full px-3 py-1.5 text-xs sm:text-sm bg-white border border-gray-200 rounded-xl focus:border-primary-500"
              />
            ) : (
              <p className="text-xs sm:text-sm font-extrabold text-gray-900">{formData.email}</p>
            )}
          </div>

          <div className="p-3.5 rounded-2xl border border-gray-200/60 bg-gray-50/40">
            <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1">Primary Desk Contact *</label>
            {isEditing ? (
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                className="w-full px-3 py-1.5 text-xs sm:text-sm bg-white border border-gray-200 rounded-xl focus:border-primary-500"
              />
            ) : (
              <p className="text-xs sm:text-sm font-extrabold text-gray-900">{formData.phone}</p>
            )}
          </div>

          <div className="p-3.5 rounded-2xl border border-gray-200/60 bg-gray-50/40">
            <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1">Alternate Escalation Phone</label>
            {isEditing ? (
              <input
                type="tel"
                value={formData.alternatePhone}
                onChange={(e) => handleInputChange('alternatePhone', e.target.value)}
                className="w-full px-3 py-1.5 text-xs sm:text-sm bg-white border border-gray-200 rounded-xl focus:border-primary-500"
              />
            ) : (
              <p className="text-xs sm:text-sm font-extrabold text-gray-900">{formData.alternatePhone || '-'}</p>
            )}
          </div>

          <div className="p-3.5 rounded-2xl border border-gray-200/60 bg-gray-50/40">
            <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1">Store Web Domain</label>
            {isEditing ? (
              <input
                type="url"
                value={formData.website}
                onChange={(e) => handleInputChange('website', e.target.value)}
                className="w-full px-3 py-1.5 text-xs sm:text-sm bg-white border border-gray-200 rounded-xl focus:border-primary-500"
              />
            ) : (
              <p className="text-xs sm:text-sm font-extrabold text-gray-900">{formData.website || '-'}</p>
            )}
          </div>
        </div>

        {/* Physical Address */}
        <div className="p-3.5 rounded-2xl border border-gray-200/60 bg-gray-50/40">
          <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1">Registered Store Address *</label>
          {isEditing ? (
            <textarea
              rows={2}
              value={formData.address}
              onChange={(e) => handleInputChange('address', e.target.value)}
              className="w-full px-3 py-1.5 text-xs sm:text-sm bg-white border border-gray-200 rounded-xl focus:border-primary-500 resize-none"
            />
          ) : (
            <p className="text-xs sm:text-sm font-semibold text-gray-800">{formData.address}</p>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-3.5 rounded-2xl border border-gray-200/60 bg-gray-50/40">
            <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1">City</label>
            {isEditing ? (
              <input
                type="text"
                value={formData.city}
                onChange={(e) => handleInputChange('city', e.target.value)}
                className="w-full px-3 py-1.5 text-xs sm:text-sm bg-white border border-gray-200 rounded-xl focus:border-primary-500"
              />
            ) : (
              <p className="text-xs sm:text-sm font-extrabold text-gray-900">{formData.city}</p>
            )}
          </div>

          <div className="p-3.5 rounded-2xl border border-gray-200/60 bg-gray-50/40">
            <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1">State / Province</label>
            {isEditing ? (
              <input
                type="text"
                value={formData.state}
                onChange={(e) => handleInputChange('state', e.target.value)}
                className="w-full px-3 py-1.5 text-xs sm:text-sm bg-white border border-gray-200 rounded-xl focus:border-primary-500"
              />
            ) : (
              <p className="text-xs sm:text-sm font-extrabold text-gray-900">{formData.state}</p>
            )}
          </div>

          <div className="p-3.5 rounded-2xl border border-gray-200/60 bg-gray-50/40">
            <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1">Postal Code (PIN)</label>
            {isEditing ? (
              <input
                type="text"
                value={formData.pincode}
                onChange={(e) => handleInputChange('pincode', e.target.value)}
                className="w-full px-3 py-1.5 text-xs sm:text-sm bg-white border border-gray-200 rounded-xl focus:border-primary-500"
              />
            ) : (
              <p className="text-xs sm:text-sm font-extrabold text-gray-900">{formData.pincode}</p>
            )}
          </div>
        </div>

        {/* GST & PAN Identification */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-3.5 rounded-2xl border border-gray-200/60 bg-gray-50/40">
            <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1">GSTIN Identification *</label>
            {isEditing ? (
              <input
                type="text"
                value={formData.gstNumber}
                onChange={(e) => handleInputChange('gstNumber', e.target.value)}
                className="w-full px-3 py-1.5 text-xs sm:text-sm bg-white border border-gray-200 rounded-xl focus:border-primary-500 font-mono"
              />
            ) : (
              <p className="text-xs sm:text-sm font-extrabold text-emerald-800 font-mono">{formData.gstNumber || '-'}</p>
            )}
          </div>

          <div className="p-3.5 rounded-2xl border border-gray-200/60 bg-gray-50/40">
            <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1">Income Tax PAN</label>
            {isEditing ? (
              <input
                type="text"
                value={formData.panNumber}
                onChange={(e) => handleInputChange('panNumber', e.target.value)}
                className="w-full px-3 py-1.5 text-xs sm:text-sm bg-white border border-gray-200 rounded-xl focus:border-primary-500 font-mono"
              />
            ) : (
              <p className="text-xs sm:text-sm font-extrabold text-gray-900 font-mono">{formData.panNumber || '-'}</p>
            )}
          </div>
        </div>

        {/* Description */}
        <div className="p-3.5 rounded-2xl border border-gray-200/60 bg-gray-50/40">
          <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1">Store Overview</label>
          {isEditing ? (
            <textarea
              rows={2}
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              className="w-full px-3 py-1.5 text-xs sm:text-sm bg-white border border-gray-200 rounded-xl focus:border-primary-500 resize-none"
            />
          ) : (
            <p className="text-xs text-gray-600 leading-relaxed">{formData.description || '-'}</p>
          )}
        </div>
      </div>
    </div>
  )
}
