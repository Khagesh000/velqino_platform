"use client"

import React, { useState, useRef } from 'react'
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
import '../../../../styles/Wholesaler/Settings/ProfileSettings.scss'

export default function ProfileSettings() {
  const [isEditing, setIsEditing] = useState(false)
  const [saveSuccess, setSaveSuccess] = useState(false)
  const [logoPreview, setLogoPreview] = useState(null)
  const fileInputRef = useRef(null)

  const [profile, setProfile] = useState({
    businessLogo: null,
    businessName: 'VELTRIX Wholesale',
    businessEmail: 'contact@veltrix.com',
    businessPhone: '+91 80 1234 5678',
    businessWebsite: 'www.veltrix.com',
    establishedYear: '2020',
    gstNumber: '27AAACV1234E1Z5',
    panNumber: 'AAACV1234E',
    aboutUs: 'VELTRIX Wholesale is a leading distributor of premium electronics and lifestyle products, serving retailers across India since 2020.',
    address: {
      line1: '123, MG Road',
      line2: 'Indiranagar',
      city: 'Bangalore',
      state: 'Karnataka',
      pincode: '560001',
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

  const handleLogoUpload = (e) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setLogoPreview(reader.result)
        setEditedProfile({ ...editedProfile, businessLogo: file })
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSave = () => {
    setSaveSuccess(false)
    setTimeout(() => {
      setProfile(editedProfile)
      setSaveSuccess(true)
      setIsEditing(false)
      setTimeout(() => setSaveSuccess(false), 3000)
    }, 1000)
  }

  const handleCancel = () => {
    setEditedProfile(profile)
    setLogoPreview(null)
    setIsEditing(false)
  }

  const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']
  const dayLabels = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']

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
              className="px-3 py-1.5 text-sm text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-3 py-1.5 bg-primary-500 text-white text-sm rounded-lg hover:bg-primary-600 flex items-center gap-1"
            >
              <Save size={14} />
              Save Changes
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
                <p className="text-sm text-gray-900">{profile.businessName}</p>
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
                <p className="text-sm text-gray-900">{profile.gstNumber}</p>
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
                <p className="text-sm text-gray-900">{profile.panNumber}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Established Year</label>
              {isEditing ? (
                <input
                  type="text"
                  value={editedProfile.establishedYear}
                  onChange={(e) => setEditedProfile({ ...editedProfile, establishedYear: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-primary-500"
                />
              ) : (
                <p className="text-sm text-gray-900">{profile.establishedYear}</p>
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
                <p className="text-sm text-gray-900">{profile.businessEmail}</p>
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
                <p className="text-sm text-gray-900">{profile.businessPhone}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Website</label>
              {isEditing ? (
                <input
                  type="text"
                  value={editedProfile.businessWebsite}
                  onChange={(e) => setEditedProfile({ ...editedProfile, businessWebsite: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-primary-500"
                />
              ) : (
                <p className="text-sm text-primary-600">{profile.businessWebsite}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">About Us</label>
              {isEditing ? (
                <textarea
                  rows="2"
                  value={editedProfile.aboutUs}
                  onChange={(e) => setEditedProfile({ ...editedProfile, aboutUs: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-primary-500"
                />
              ) : (
                <p className="text-sm text-gray-600 line-clamp-2">{profile.aboutUs}</p>
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
                <p className="text-sm text-gray-900">{profile.address.line1}</p>
              )}
            </div>
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Address Line 2</label>
              {isEditing ? (
                <input
                  type="text"
                  value={editedProfile.address.line2}
                  onChange={(e) => setEditedProfile({ ...editedProfile, address: { ...editedProfile.address, line2: e.target.value } })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-primary-500"
                />
              ) : (
                <p className="text-sm text-gray-900">{profile.address.line2}</p>
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
                <p className="text-sm text-gray-900">{profile.address.city}</p>
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
                <p className="text-sm text-gray-900">{profile.address.state}</p>
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
                <p className="text-sm text-gray-900">{profile.address.pincode}</p>
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
                <p className="text-sm text-gray-900">{profile.address.country}</p>
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
                    {!editedProfile.timings[day].closed ? (
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
                    ) : (
                      <span className="text-sm text-gray-500">Closed</span>
                    )}
                  </div>
                ) : (
                  <span className="text-sm text-gray-600">
                    {profile.timings[day].closed ? 'Closed' : `${profile.timings[day].open} - ${profile.timings[day].close}`}
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