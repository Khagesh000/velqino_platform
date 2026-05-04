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
  Calendar
} from '../../../../utils/icons'
import { useUpdateProfileMutation } from '@/redux/wholesaler/slices/wholesalerSlice'
import { toast } from 'react-toastify'
import '../../../../styles/Wholesaler/Settings/ProfileSettings.scss'

export default function ProfileSettings({ wholesaler, isLoading: parentLoading }) {
  console.log('ProfileSettings received wholesaler:', wholesaler)
  
  const [isEditing, setIsEditing] = useState(false)
  const [saveSuccess, setSaveSuccess] = useState(false)
  const [logoPreview, setLogoPreview] = useState(null)
  const [isUploading, setIsUploading] = useState(false)
  const fileInputRef = useRef(null)

  const [updateProfile, { isLoading: isUpdating }] = useUpdateProfileMutation();

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
      console.log('Loading wholesaler data into profile:', wholesaler)
      
      setProfile({
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
      })
      
      setEditedProfile({
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
      })
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
      console.log('Updating profile for userId:', userId)
      
      const result = await updateProfile({ userId: userId, data: formData }).unwrap()
      console.log('Update result:', result)
      
      setProfile(editedProfile)
      setSaveSuccess(true)
      toast.success('Profile updated successfully!')
      setIsEditing(false)
      setTimeout(() => setSaveSuccess(false), 3000)
    } catch (error) {
      console.error('Update error:', error)
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
  const dayLabels = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']

  if (parentLoading) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
        <div className="animate-pulse">
          <div className="w-24 h-24 mx-auto bg-gray-200 rounded-full mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto mb-2"></div>
          <div className="h-3 bg-gray-200 rounded w-1/3 mx-auto"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="profile-settings bg-white rounded-xl border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="px-4 sm:px-6 py-4 border-b border-gray-200 bg-gray-50/50 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-primary-100 flex items-center justify-center text-primary-600">
            <Building size={20} />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-semibold text-gray-900">Profile Settings</h3>
            <p className="text-xs sm:text-sm text-gray-500">Manage your business profile and information</p>
          </div>
        </div>
        {!isEditing ? (
          <button
            onClick={() => setIsEditing(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-primary-500 text-white text-sm rounded-lg hover:bg-primary-600 transition-all"
          >
            <Edit size={14} />
            Edit Profile
          </button>
        ) : (
          <div className="flex items-center gap-2">
            <button
              onClick={handleCancel}
              disabled={isUploading}
              className="px-3 py-1.5 text-sm text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={isUploading}
              className="px-3 py-1.5 bg-primary-500 text-white text-sm rounded-lg hover:bg-primary-600 flex items-center gap-1 disabled:opacity-50"
            >
              <Save size={14} />
              {isUploading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4 sm:p-6 space-y-6">
        {/* Business Logo */}
        <div className="flex flex-col items-center">
          <div className="relative">
            <div className="w-24 h-24 rounded-full bg-gray-100 border-2 border-gray-200 overflow-hidden flex items-center justify-center">
              {logoPreview || profile.businessLogo ? (
                <img src={logoPreview || profile.businessLogo} alt="Logo" className="w-full h-full object-cover" />
              ) : (
                <Building size={48} className="text-gray-400" />
              )}
            </div>
            {isEditing && (
              <button
                onClick={() => fileInputRef.current?.click()}
                className="absolute bottom-0 right-0 p-1.5 bg-primary-500 rounded-full text-white hover:bg-primary-600 transition-all"
              >
                <Camera size={14} />
              </button>
            )}
            <input ref={fileInputRef} type="file" accept="image/*" onChange={handleLogoUpload} className="hidden" />
          </div>
          {isEditing && <p className="text-xs text-gray-500 mt-2">Click camera to upload logo (PNG, JPG, max 2MB)</p>}
        </div>

        {/* Business Information */}
        <div className="border-b border-gray-200 pb-4">
          <h4 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <Building size={16} className="text-gray-500" />
            Business Information
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Business Name</label>
              {isEditing ? (
                <input
                  type="text"
                  value={editedProfile.businessName}
                  onChange={(e) => setEditedProfile({ ...editedProfile, businessName: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-primary-500"
                />
              ) : (
                <p className="text-sm text-gray-900">{profile.businessName || '-'}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">GST Number</label>
              {isEditing ? (
                <input
                  type="text"
                  value={editedProfile.gstNumber}
                  onChange={(e) => setEditedProfile({ ...editedProfile, gstNumber: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-primary-500"
                />
              ) : (
                <p className="text-sm text-gray-900">{profile.gstNumber || '-'}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">PAN Number</label>
              {isEditing ? (
                <input
                  type="text"
                  value={editedProfile.panNumber}
                  onChange={(e) => setEditedProfile({ ...editedProfile, panNumber: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-primary-500"
                />
              ) : (
                <p className="text-sm text-gray-900">{profile.panNumber || '-'}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Established Year</label>
              {isEditing ? (
                <input
                  type="text"
                  placeholder="e.g., 2020"
                  value={editedProfile.establishedYear}
                  onChange={(e) => setEditedProfile({ ...editedProfile, establishedYear: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-primary-500"
                />
              ) : (
                <p className="text-sm text-gray-900">{profile.establishedYear || '-'}</p>
              )}
            </div>
          </div>
        </div>

        {/* Contact Details */}
        <div className="border-b border-gray-200 pb-4">
          <h4 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <Mail size={16} className="text-gray-500" />
            Contact Details
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
              {isEditing ? (
                <input
                  type="email"
                  value={editedProfile.businessEmail}
                  onChange={(e) => setEditedProfile({ ...editedProfile, businessEmail: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-primary-500"
                />
              ) : (
                <p className="text-sm text-gray-900">{profile.businessEmail || '-'}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
              {isEditing ? (
                <input
                  type="tel"
                  value={editedProfile.businessPhone}
                  onChange={(e) => setEditedProfile({ ...editedProfile, businessPhone: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-primary-500"
                />
              ) : (
                <p className="text-sm text-gray-900">{profile.businessPhone || '-'}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Website</label>
              {isEditing ? (
                <input
                  type="text"
                  placeholder="https://yourwebsite.com"
                  value={editedProfile.businessWebsite}
                  onChange={(e) => setEditedProfile({ ...editedProfile, businessWebsite: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-primary-500"
                />
              ) : (
                <p className="text-sm text-primary-600">{profile.businessWebsite || '-'}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">About Us</label>
              {isEditing ? (
                <textarea
                  rows="2"
                  placeholder="Tell us about your business..."
                  value={editedProfile.aboutUs}
                  onChange={(e) => setEditedProfile({ ...editedProfile, aboutUs: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-primary-500"
                />
              ) : (
                <p className="text-sm text-gray-600 line-clamp-2">{profile.aboutUs || '-'}</p>
              )}
            </div>
          </div>
        </div>

        {/* Address Management */}
        <div className="border-b border-gray-200 pb-4">
          <h4 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <MapPin size={16} className="text-gray-500" />
            Address Management
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Address Line 1</label>
              {isEditing ? (
                <input
                  type="text"
                  value={editedProfile.address.line1}
                  onChange={(e) => setEditedProfile({ ...editedProfile, address: { ...editedProfile.address, line1: e.target.value } })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-primary-500"
                />
              ) : (
                <p className="text-sm text-gray-900">{profile.address.line1 || '-'}</p>
              )}
            </div>
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Address Line 2 (Landmark)</label>
              {isEditing ? (
                <input
                  type="text"
                  value={editedProfile.address.line2}
                  onChange={(e) => setEditedProfile({ ...editedProfile, address: { ...editedProfile.address, line2: e.target.value } })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-primary-500"
                />
              ) : (
                <p className="text-sm text-gray-900">{profile.address.line2 || '-'}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
              {isEditing ? (
                <input
                  type="text"
                  value={editedProfile.address.city}
                  onChange={(e) => setEditedProfile({ ...editedProfile, address: { ...editedProfile.address, city: e.target.value } })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-primary-500"
                />
              ) : (
                <p className="text-sm text-gray-900">{profile.address.city || '-'}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
              {isEditing ? (
                <input
                  type="text"
                  value={editedProfile.address.state}
                  onChange={(e) => setEditedProfile({ ...editedProfile, address: { ...editedProfile.address, state: e.target.value } })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-primary-500"
                />
              ) : (
                <p className="text-sm text-gray-900">{profile.address.state || '-'}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Pincode</label>
              {isEditing ? (
                <input
                  type="text"
                  value={editedProfile.address.pincode}
                  onChange={(e) => setEditedProfile({ ...editedProfile, address: { ...editedProfile.address, pincode: e.target.value } })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-primary-500"
                />
              ) : (
                <p className="text-sm text-gray-900">{profile.address.pincode || '-'}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
              {isEditing ? (
                <input
                  type="text"
                  value={editedProfile.address.country}
                  onChange={(e) => setEditedProfile({ ...editedProfile, address: { ...editedProfile.address, country: e.target.value } })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-primary-500"
                />
              ) : (
                <p className="text-sm text-gray-900">{profile.address.country || '-'}</p>
              )}
            </div>
          </div>
        </div>

        {/* Store Timings */}
        <div>
          <h4 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <Clock size={16} className="text-gray-500" />
            Store Timings
          </h4>
          <div className="space-y-2">
            {days.map((day, index) => (
              <div key={day} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                <span className="text-sm font-medium text-gray-700 w-24">{dayLabels[index]}</span>
                {isEditing ? (
                  <div className="flex items-center gap-2">
                    <label className="flex items-center gap-1 text-sm text-gray-600">
                      <input
                        type="checkbox"
                        checked={!editedProfile.timings[day].closed}
                        onChange={(e) => setEditedProfile({
                          ...editedProfile,
                          timings: {
                            ...editedProfile.timings,
                            [day]: { ...editedProfile.timings[day], closed: !e.target.checked }
                          }
                        })}
                        className="rounded border-gray-300 text-primary-600"
                      />
                      <span className="text-xs">Open</span>
                    </label>
                    {!editedProfile.timings[day].closed && (
                      <div className="flex items-center gap-2">
                        <input
                          type="time"
                          value={editedProfile.timings[day].open}
                          onChange={(e) => setEditedProfile({
                            ...editedProfile,
                            timings: {
                              ...editedProfile.timings,
                              [day]: { ...editedProfile.timings[day], open: e.target.value }
                            }
                          })}
                          className="px-2 py-1 border border-gray-200 rounded text-sm"
                        />
                        <span>-</span>
                        <input
                          type="time"
                          value={editedProfile.timings[day].close}
                          onChange={(e) => setEditedProfile({
                            ...editedProfile,
                            timings: {
                              ...editedProfile.timings,
                              [day]: { ...editedProfile.timings[day], close: e.target.value }
                            }
                          })}
                          className="px-2 py-1 border border-gray-200 rounded text-sm"
                        />
                      </div>
                    )}
                    {editedProfile.timings[day].closed && (
                      <span className="text-sm text-gray-500 ml-2">Closed</span>
                    )}
                  </div>
                ) : (
                  <span className="text-sm text-gray-600">
                    {profile.timings[day]?.closed ? 'Closed' : `${profile.timings[day]?.open || '09:00'} - ${profile.timings[day]?.close || '18:00'}`}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Success Message */}
        {saveSuccess && (
          <div className="mt-4 p-3 bg-success-50 rounded-lg flex items-center gap-2">
            <CheckCircle size={16} className="text-success-600" />
            <p className="text-sm text-success-600">Profile updated successfully!</p>
          </div>
        )}
      </div>
    </div>
  )
}