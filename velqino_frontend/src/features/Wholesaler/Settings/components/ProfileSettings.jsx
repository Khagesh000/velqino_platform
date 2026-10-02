"use client"

import React, { useState, useRef, useEffect } from 'react'
import {
  Upload,
  Camera,
  Building,
  Mail,
  Phone,
  MapPin,
  Clock,
  Save,
  Edit,
  X,
  CheckCircle,
  AlertCircle,
  User,
  Globe,
  Calendar,
  RefreshCw,
  Shield,
  Sparkles
} from '@/utils/icons'
import { useUpdateProfileMutation } from '@/redux/wholesaler/slices/wholesalerSlice'
import { toast } from 'react-toastify'
import '../../../../styles/Wholesaler/Settings/ProfileSettings.scss'

export default function ProfileSettings({ wholesaler, isLoading: parentLoading }) {
  const [isEditing, setIsEditing] = useState(false)
  const [saveSuccess, setSaveSuccess] = useState(false)
  const [logoPreview, setLogoPreview] = useState(null)
  const [isUploading, setIsUploading] = useState(false)
  const fileInputRef = useRef(null)

  const [updateProfile, { isLoading: isUpdating }] = useUpdateProfileMutation()

  // Initialize profile from backend data
  const [profile, setProfile] = useState({
    businessLogo: null,
    businessName: '',
    businessEmail: '',
    businessPhone: '',
    businessWebsite: '',
    establishedYear: '',
    gstNumber: '',
    panNumber: '',
    aboutUs: '',
    address: {
      line1: '',
      line2: '',
      city: '',
      state: '',
      pincode: '',
      country: 'India'
    },
    timings: {
      monday: { open: '09:00', close: '18:00', closed: false },
      tuesday: { open: '09:00', close: '18:00', closed: false },
      wednesday: { open: '09:00', close: '18:00', closed: false },
      thursday: { open: '09:00', close: '18:00', closed: false },
      friday: { open: '09:00', close: '18:00', closed: false },
      saturday: { open: '10:00', close: '16:00', closed: false },
      sunday: { open: '00:00', close: '00:00', closed: true }
    }
  })

  const [editedProfile, setEditedProfile] = useState(profile)

  // Load data from backend when available
  useEffect(() => {
    if (wholesaler) {
      const initialData = {
        businessLogo: wholesaler.logo || null,
        businessName: wholesaler.business_name || '',
        businessEmail: wholesaler.user?.email || '',
        businessPhone: wholesaler.user?.mobile || '',
        businessWebsite: wholesaler.website || '',
        establishedYear: wholesaler.established_year || '',
        gstNumber: wholesaler.gst_number || '',
        panNumber: wholesaler.pan_number || '',
        aboutUs: wholesaler.business_description || '',
        address: {
          line1: wholesaler.shop_address || '',
          line2: wholesaler.landmark || '',
          city: wholesaler.city || '',
          state: wholesaler.state || '',
          pincode: wholesaler.pincode || '',
          country: wholesaler.country || 'India'
        },
        timings: wholesaler.timings || profile.timings
      }
      setProfile(initialData)
      setEditedProfile(initialData)
    }
  }, [wholesaler])

  const handleLogoUpload = async (e) => {
    const file = e.target.files[0]
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        toast.error('Logo size should be less than 2MB')
        return
      }
      const reader = new FileReader()
      reader.onloadend = () => {
        setLogoPreview(reader.result)
        setEditedProfile({ ...editedProfile, businessLogo: file })
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSave = async () => {
    setIsUploading(true)
    try {
      const formData = new FormData()
      formData.append('business_name', editedProfile.businessName)
      formData.append('phone', editedProfile.businessPhone)
      formData.append('website', editedProfile.businessWebsite || '')
      formData.append('established_year', editedProfile.establishedYear || '')
      formData.append('gst_number', editedProfile.gstNumber || '')
      formData.append('pan_number', editedProfile.panNumber || '')
      formData.append('business_description', editedProfile.aboutUs || '')
      formData.append('shop_address', editedProfile.address.line1 || '')
      formData.append('landmark', editedProfile.address.line2 || '')
      formData.append('city', editedProfile.address.city || '')
      formData.append('state', editedProfile.address.state || '')
      formData.append('pincode', editedProfile.address.pincode || '')
      formData.append('country', editedProfile.address.country || 'India')
      formData.append('timings', JSON.stringify(editedProfile.timings))
      
      // Add categories if selected
      if (wholesaler?.categories) {
        formData.append('categories', JSON.stringify(wholesaler.categories))
      }
      
      if (editedProfile.businessLogo && typeof editedProfile.businessLogo !== 'string') {
        formData.append('logo', editedProfile.businessLogo)
      }

      const userId = wholesaler?.user_id || wholesaler?.id
      await updateProfile({ userId: userId, data: formData }).unwrap()
      
      setProfile(editedProfile)
      setSaveSuccess(true)
      toast.success('Business profile updated successfully!')
      setIsEditing(false)
      setTimeout(() => setSaveSuccess(false), 3000)
    } catch (error) {
      toast.error(error?.data?.message || 'Failed to update profile')
    } finally {
      setIsUploading(false)
    }
  }

  const handleCancel = () => {
    setEditedProfile(profile)
    setLogoPreview(null)
    setIsEditing(false)
  }

  const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']
  const dayLabels = {
    monday: 'Monday',
    tuesday: 'Tuesday',
    wednesday: 'Wednesday',
    thursday: 'Thursday',
    friday: 'Friday',
    saturday: 'Saturday',
    sunday: 'Sunday'
  }

  if (parentLoading) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200/80 p-8 shadow-xs animate-pulse">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-20 h-20 bg-slate-200 rounded-2xl"></div>
          <div className="space-y-2 flex-1">
            <div className="h-5 bg-slate-200 rounded w-1/3"></div>
            <div className="h-3 bg-slate-200 rounded w-1/4"></div>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="h-16 bg-slate-100 rounded-xl"></div>
          <div className="h-16 bg-slate-100 rounded-xl"></div>
          <div className="h-16 bg-slate-100 rounded-xl"></div>
          <div className="h-16 bg-slate-100 rounded-xl"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="profile-settings space-y-6">
      {/* Executive Card Header */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-xl bg-primary-50 text-primary-600 flex items-center justify-center shrink-0 border border-primary-100/60 shadow-2xs">
            <Building size={22} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">Business Profile & Identity</h3>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/60">
                <CheckCircle size={11} /> Verified Merchant
              </span>
            </div>
            <p className="text-xs sm:text-sm font-medium text-slate-500 mt-0.5">
              Manage your commercial credentials, contact points, registered address, and operating hours
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
              <span>Edit Profile</span>
            </button>
          ) : (
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button
                onClick={handleCancel}
                disabled={isUploading || isUpdating}
                className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-3.5 py-2 text-xs sm:text-sm font-semibold text-slate-700 bg-white border border-slate-200/80 hover:bg-slate-50 rounded-xl shadow-xs transition-all disabled:opacity-50 active:scale-95"
              >
                <X size={14} />
                <span>Cancel</span>
              </button>
              <button
                onClick={handleSave}
                disabled={isUploading || isUpdating}
                className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white text-xs sm:text-sm font-semibold rounded-xl shadow-xs transition-all disabled:opacity-50 active:scale-95"
              >
                {isUploading || isUpdating ? (
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

      {/* Main Profile Info & Avatar Card */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 pb-6 border-b border-slate-100">
          {/* Logo Showcase */}
          <div className="relative group shrink-0">
            <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl bg-slate-50 border-2 border-slate-200/80 shadow-2xs overflow-hidden flex items-center justify-center transition-all group-hover:border-primary-400">
              {logoPreview || profile.businessLogo ? (
                <img
                  src={logoPreview || profile.businessLogo}
                  alt="Business Logo"
                  className="w-full h-full object-cover"
                />
              ) : (
                <Building size={40} className="text-slate-300" />
              )}
            </div>
            {isEditing && (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="absolute -bottom-2 -right-2 p-2.5 bg-primary-600 text-white rounded-xl shadow-md hover:bg-primary-700 transition-all active:scale-90"
                title="Upload Business Logo"
              >
                <Camera size={15} />
              </button>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleLogoUpload}
              className="hidden"
            />
          </div>

          {/* Business Summary Meta */}
          <div className="flex-1 text-center sm:text-left space-y-2">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2">
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                {editedProfile.businessName || 'Business Name'}
              </h2>
              {profile.gstNumber && (
                <span className="self-center sm:self-auto inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-2xs font-bold uppercase tracking-wider bg-primary-50 text-primary-700 border border-primary-200/60">
                  GST Verified
                </span>
              )}
            </div>
            <p className="text-xs sm:text-sm font-medium text-slate-500 max-w-2xl">
              {editedProfile.aboutUs || 'No business description provided yet. Add an informative description so partners understand your enterprise catalog.'}
            </p>

            <div className="pt-2 flex flex-wrap items-center justify-center sm:justify-start gap-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-50 border border-slate-200/70 rounded-lg text-xs font-semibold text-slate-600">
                <MapPin size={13} className="text-primary-600" />
                <span>{editedProfile.address.city ? `${editedProfile.address.city}, ${editedProfile.address.state || 'India'}` : 'Location Unset'}</span>
              </div>
              {editedProfile.establishedYear && (
                <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-50 border border-slate-200/70 rounded-lg text-xs font-semibold text-slate-600">
                  <Calendar size={13} className="text-primary-600" />
                  <span>Est. {editedProfile.establishedYear}</span>
                </div>
              )}
              {editedProfile.businessWebsite && (
                <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-50 border border-slate-200/70 rounded-lg text-xs font-semibold text-slate-600">
                  <Globe size={13} className="text-primary-600" />
                  <span className="truncate max-w-[200px]">{editedProfile.businessWebsite.replace(/^https?:\/\//, '')}</span>
                </div>
              )}
            </div>

            {isEditing && (
              <p className="text-2xs font-medium text-slate-400 mt-2">
                Click camera badge to upload a high-resolution logo (PNG, JPG up to 2MB).
              </p>
            )}
          </div>
        </div>

        {/* Form Sections Grid */}
        <div className="mt-6 space-y-6">
          {/* 1. Official Business Information */}
          <div className="rounded-xl border border-slate-200/80 bg-white overflow-hidden shadow-2xs">
            <div className="px-4 py-3 bg-slate-50/70 border-b border-slate-200/80 flex items-center gap-2">
              <Building size={16} className="text-primary-600" />
              <h4 className="text-xs sm:text-sm font-bold text-slate-900 uppercase tracking-wider">
                Official Business Credentials
              </h4>
            </div>
            <div className="p-4 sm:p-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Business / Trading Name
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={editedProfile.businessName}
                    onChange={(e) => setEditedProfile({ ...editedProfile, businessName: e.target.value })}
                    placeholder="Enter registered business name"
                    className="w-full px-3.5 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl text-xs sm:text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all"
                  />
                ) : (
                  <p className="text-sm font-semibold text-slate-900">{profile.businessName || '-'}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  GST Identification Number (GSTIN)
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={editedProfile.gstNumber}
                    onChange={(e) => setEditedProfile({ ...editedProfile, gstNumber: e.target.value.toUpperCase() })}
                    placeholder="22AAAAA0000A1Z5"
                    className="w-full px-3.5 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl text-xs sm:text-sm font-mono font-medium text-slate-900 uppercase focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all"
                  />
                ) : (
                  <p className="text-sm font-mono font-semibold text-slate-900">{profile.gstNumber || '-'}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Permanent Account Number (PAN)
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={editedProfile.panNumber}
                    onChange={(e) => setEditedProfile({ ...editedProfile, panNumber: e.target.value.toUpperCase() })}
                    placeholder="ABCDE1234F"
                    className="w-full px-3.5 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl text-xs sm:text-sm font-mono font-medium text-slate-900 uppercase focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all"
                  />
                ) : (
                  <p className="text-sm font-mono font-semibold text-slate-900">{profile.panNumber || '-'}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Established Year
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    placeholder="e.g. 2018"
                    value={editedProfile.establishedYear}
                    onChange={(e) => setEditedProfile({ ...editedProfile, establishedYear: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl text-xs sm:text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all"
                  />
                ) : (
                  <p className="text-sm font-semibold text-slate-900">{profile.establishedYear || '-'}</p>
                )}
              </div>
            </div>
          </div>

          {/* 2. Contact Points & Online Presence */}
          <div className="rounded-xl border border-slate-200/80 bg-white overflow-hidden shadow-2xs">
            <div className="px-4 py-3 bg-slate-50/70 border-b border-slate-200/80 flex items-center gap-2">
              <Mail size={16} className="text-primary-600" />
              <h4 className="text-xs sm:text-sm font-bold text-slate-900 uppercase tracking-wider">
                Contact Points & Online Presence
              </h4>
            </div>
            <div className="p-4 sm:p-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Business Email Address
                </label>
                {isEditing ? (
                  <input
                    type="email"
                    value={editedProfile.businessEmail}
                    onChange={(e) => setEditedProfile({ ...editedProfile, businessEmail: e.target.value })}
                    placeholder="contact@company.com"
                    className="w-full px-3.5 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl text-xs sm:text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all"
                  />
                ) : (
                  <p className="text-sm font-semibold text-slate-900">{profile.businessEmail || '-'}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Commercial Phone Number
                </label>
                {isEditing ? (
                  <input
                    type="tel"
                    value={editedProfile.businessPhone}
                    onChange={(e) => setEditedProfile({ ...editedProfile, businessPhone: e.target.value })}
                    placeholder="+91 98765 43210"
                    className="w-full px-3.5 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl text-xs sm:text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all"
                  />
                ) : (
                  <p className="text-sm font-semibold text-slate-900">{profile.businessPhone || '-'}</p>
                )}
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Official Website
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    placeholder="https://company.com"
                    value={editedProfile.businessWebsite}
                    onChange={(e) => setEditedProfile({ ...editedProfile, businessWebsite: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl text-xs sm:text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all"
                  />
                ) : (
                  <p className="text-sm font-semibold text-primary-600 truncate">{profile.businessWebsite || '-'}</p>
                )}
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  About Business / Company Bio
                </label>
                {isEditing ? (
                  <textarea
                    rows="3"
                    placeholder="Share brief information regarding your supply chain, product ranges, and wholesale terms..."
                    value={editedProfile.aboutUs}
                    onChange={(e) => setEditedProfile({ ...editedProfile, aboutUs: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl text-xs sm:text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all resize-y"
                  />
                ) : (
                  <p className="text-sm font-medium text-slate-600 whitespace-pre-line">{profile.aboutUs || '-'}</p>
                )}
              </div>
            </div>
          </div>

          {/* 3. Address Management */}
          <div className="rounded-xl border border-slate-200/80 bg-white overflow-hidden shadow-2xs">
            <div className="px-4 py-3 bg-slate-50/70 border-b border-slate-200/80 flex items-center gap-2">
              <MapPin size={16} className="text-primary-600" />
              <h4 className="text-xs sm:text-sm font-bold text-slate-900 uppercase tracking-wider">
                Registered Commercial Address
              </h4>
            </div>
            <div className="p-4 sm:p-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Address Line 1 (Shop / Unit / Building)
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={editedProfile.address.line1}
                    onChange={(e) => setEditedProfile({ ...editedProfile, address: { ...editedProfile.address, line1: e.target.value } })}
                    placeholder="Shop / Unit No, Building, Street"
                    className="w-full px-3.5 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl text-xs sm:text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all"
                  />
                ) : (
                  <p className="text-sm font-semibold text-slate-900">{profile.address.line1 || '-'}</p>
                )}
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Address Line 2 (Area / Landmark)
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={editedProfile.address.line2}
                    onChange={(e) => setEditedProfile({ ...editedProfile, address: { ...editedProfile.address, line2: e.target.value } })}
                    placeholder="Nearby landmark or commercial hub"
                    className="w-full px-3.5 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl text-xs sm:text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all"
                  />
                ) : (
                  <p className="text-sm font-semibold text-slate-900">{profile.address.line2 || '-'}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">City</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={editedProfile.address.city}
                    onChange={(e) => setEditedProfile({ ...editedProfile, address: { ...editedProfile.address, city: e.target.value } })}
                    placeholder="City"
                    className="w-full px-3.5 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl text-xs sm:text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all"
                  />
                ) : (
                  <p className="text-sm font-semibold text-slate-900">{profile.address.city || '-'}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">State</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={editedProfile.address.state}
                    onChange={(e) => setEditedProfile({ ...editedProfile, address: { ...editedProfile.address, state: e.target.value } })}
                    placeholder="State"
                    className="w-full px-3.5 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl text-xs sm:text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all"
                  />
                ) : (
                  <p className="text-sm font-semibold text-slate-900">{profile.address.state || '-'}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Pincode</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={editedProfile.address.pincode}
                    onChange={(e) => setEditedProfile({ ...editedProfile, address: { ...editedProfile.address, pincode: e.target.value } })}
                    placeholder="6-digit pincode"
                    className="w-full px-3.5 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl text-xs sm:text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all"
                  />
                ) : (
                  <p className="text-sm font-semibold text-slate-900">{profile.address.pincode || '-'}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Country</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={editedProfile.address.country}
                    onChange={(e) => setEditedProfile({ ...editedProfile, address: { ...editedProfile.address, country: e.target.value } })}
                    className="w-full px-3.5 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl text-xs sm:text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all"
                  />
                ) : (
                  <p className="text-sm font-semibold text-slate-900">{profile.address.country || 'India'}</p>
                )}
              </div>
            </div>
          </div>

          {/* 4. Operating Hours / Store Timings */}
          <div className="rounded-xl border border-slate-200/80 bg-white overflow-hidden shadow-2xs">
            <div className="px-4 py-3 bg-slate-50/70 border-b border-slate-200/80 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock size={16} className="text-primary-600" />
                <h4 className="text-xs sm:text-sm font-bold text-slate-900 uppercase tracking-wider">
                  Store Operating Hours
                </h4>
              </div>
              <span className="text-xs font-medium text-slate-500">Local Indian Standard Time (IST)</span>
            </div>

            <div className="p-4 sm:p-5 divide-y divide-slate-100">
              {days.map((day) => {
                const dayConfig = isEditing ? editedProfile.timings[day] : profile.timings[day]
                const isClosed = dayConfig?.closed

                return (
                  <div key={day} className="py-3 first:pt-0 last:pb-0 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <span className="text-xs sm:text-sm font-bold text-slate-800 w-28">
                        {dayLabels[day]}
                      </span>
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-2xs font-bold uppercase tracking-wider ${
                        isClosed 
                          ? 'bg-rose-50 text-rose-700 border border-rose-200/60'
                          : 'bg-emerald-50 text-emerald-700 border border-emerald-200/60'
                      }`}>
                        {isClosed ? 'Closed' : 'Open'}
                      </span>
                    </div>

                    {isEditing ? (
                      <div className="flex flex-wrap items-center gap-3">
                        <label className="inline-flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-700">
                          <input
                            type="checkbox"
                            checked={!editedProfile.timings[day]?.closed}
                            onChange={(e) => setEditedProfile({
                              ...editedProfile,
                              timings: {
                                ...editedProfile.timings,
                                [day]: { ...editedProfile.timings[day], closed: !e.target.checked }
                              }
                            })}
                            className="rounded border-slate-300 text-primary-600 focus:ring-primary-500"
                          />
                          <span>Operating Today</span>
                        </label>

                        {!editedProfile.timings[day]?.closed && (
                          <div className="flex items-center gap-2">
                            <input
                              type="time"
                              value={editedProfile.timings[day]?.open || '09:00'}
                              onChange={(e) => setEditedProfile({
                                ...editedProfile,
                                timings: {
                                  ...editedProfile.timings,
                                  [day]: { ...editedProfile.timings[day], open: e.target.value }
                                }
                              })}
                              className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-800 focus:outline-none focus:ring-1 focus:ring-primary-500"
                            />
                            <span className="text-xs text-slate-400 font-medium">to</span>
                            <input
                              type="time"
                              value={editedProfile.timings[day]?.close || '18:00'}
                              onChange={(e) => setEditedProfile({
                                ...editedProfile,
                                timings: {
                                  ...editedProfile.timings,
                                  [day]: { ...editedProfile.timings[day], close: e.target.value }
                                }
                              })}
                              className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-800 focus:outline-none focus:ring-1 focus:ring-primary-500"
                            />
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="text-xs sm:text-sm font-semibold text-slate-600">
                        {isClosed ? (
                          <span className="text-slate-400 font-medium">Not operating / Closed</span>
                        ) : (
                          <span>{dayConfig?.open || '09:00'} - {dayConfig?.close || '18:00'}</span>
                        )}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* Success Alert Banner */}
        {saveSuccess && (
          <div className="mt-6 p-4 bg-emerald-50 border border-emerald-200/80 rounded-xl flex items-center gap-3">
            <CheckCircle size={18} className="text-emerald-600 shrink-0" />
            <p className="text-xs sm:text-sm font-semibold text-emerald-800">
              Profile details updated successfully across Velqino systems.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
