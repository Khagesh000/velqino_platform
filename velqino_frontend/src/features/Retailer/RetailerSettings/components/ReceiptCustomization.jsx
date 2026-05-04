"use client"

import React, { useState, useEffect } from 'react'
import { Receipt, Printer, Image, MessageCircle, Type, AlignLeft, Palette, Save, Edit, X, CheckCircle, Upload, Eye, RefreshCw } from '../../../../utils/icons'
import '../../../../styles/Retailer/RetailerSettings/ReceiptCustomization.scss'

export default function ReceiptCustomization() {
  const [mounted, setMounted] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [showPreview, setShowPreview] = useState(false)
  const [logoPreview, setLogoPreview] = useState(null)
  
  const [formData, setFormData] = useState({
    header: {
      showLogo: true,
      storeName: 'Veltrix Retail Store',
      tagline: 'Your Trusted Shopping Partner',
      address: '123, MG Road, Bangalore - 560001',
      phone: '+91 98765 43210',
      email: 'store@veltrix.com',
      gstNumber: '29ABCDE1234F1Z5'
    },
    footer: {
      thankYouMessage: 'Thank you for shopping with us!',
      returnPolicy: 'Items can be returned within 7 days',
      website: 'www.veltrix.com',
      supportNumber: '+91 87654 32109',
      socialMedia: {
        instagram: '@veltrix_store',
        facebook: 'veltrixstore',
        twitter: '@veltrix'
      }
    },
    design: {
      paperSize: '80mm',
      fontSize: 'small',
      primaryColor: '#4F46E5',
      showBarcode: true,
      showQRCode: true,
      showTaxBreakdown: true,
      showItemDiscount: true
    },
    customMessage: {
      enabled: true,
      message: '🎉 Get 10% off on your next purchase!',
      position: 'bottom'
    }
  })

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  const handleInputChange = (section, field, value) => {
    setFormData({
      ...formData,
      [section]: {
        ...formData[section],
        [field]: value
      }
    })
  }

  const handleNestedChange = (section, nested, field, value) => {
    setFormData({
      ...formData,
      [section]: {
        ...formData[section],
        [nested]: {
          ...formData[section][nested],
          [field]: value
        }
      }
    })
  }

  const handleToggle = (section, field) => {
    setFormData({
      ...formData,
      [section]: {
        ...formData[section],
        [field]: !formData[section][field]
      }
    })
  }

  const handleSave = () => {
    setIsEditing(false)
    setShowSuccess(true)
    setTimeout(() => setShowSuccess(false), 3000)
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

  const handleTestPrint = () => {
    setShowPreview(true)
    setTimeout(() => {
      window.print()
      setShowPreview(false)
    }, 500)
  }

  return (
    <div className="receipt-customization bg-white rounded-xl shadow-sm border border-gray-100">
      {/* Header */}
      <div className="p-5 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Receipt size={22} className="text-primary-500" />
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Receipt Customization</h3>
              <p className="text-sm text-gray-500">Design your store receipts</p>
            </div>
          </div>
          {isEditing ? (
            <div className="flex gap-2">
              <button onClick={() => setIsEditing(false)} className="px-4 py-2 text-sm text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50">
                Cancel
              </button>
              <button onClick={handleSave} className="px-4 py-2 text-sm bg-primary-500 text-white rounded-lg hover:bg-primary-600 flex items-center gap-2">
                <Save size={16} />
                Save Changes
              </button>
            </div>
          ) : (
            <div className="flex gap-2">
              <button onClick={handleTestPrint} className="px-4 py-2 text-sm text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 flex items-center gap-2">
                <Printer size={16} />
                Test Print
              </button>
              <button onClick={() => setIsEditing(true)} className="px-4 py-2 text-sm text-primary-600 border border-primary-200 rounded-lg hover:bg-primary-50 flex items-center gap-2">
                <Edit size={16} />
                Customize
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Success Message */}
      {showSuccess && (
        <div className="mx-5 mt-4 p-3 bg-green-100 rounded-lg flex items-center gap-2 animate-fadeIn">
          <CheckCircle size={16} className="text-green-600" />
          <span className="text-sm text-green-700">Receipt settings saved successfully!</span>
        </div>
      )}

      <div className="p-5 space-y-6">
        {/* Header Settings */}
        <div className="border border-gray-200 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-4">
            <Type size={18} className="text-gray-600" />
            <h4 className="text-base font-semibold text-gray-900">Receipt Header</h4>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.header.showLogo}
                  onChange={() => handleToggle('header', 'showLogo')}
                  disabled={!isEditing}
                  className="rounded border-gray-300 text-primary-500 disabled:opacity-50"
                />
                <span className="text-sm text-gray-700">Show Store Logo</span>
              </label>
              {formData.header.showLogo && isEditing && (
                <div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleLogoUpload}
                    className="hidden"
                    id="logo-upload"
                  />
                  <label htmlFor="logo-upload" className="text-xs text-primary-600 cursor-pointer flex items-center gap-1">
                    <Upload size={12} />
                    Upload Logo
                  </label>
                </div>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Store Name</label>
              {isEditing ? (
                <input
                  type="text"
                  value={formData.header.storeName}
                  onChange={(e) => handleInputChange('header', 'storeName', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-primary-500"
                />
              ) : (
                <p className="text-gray-900 font-semibold">{formData.header.storeName}</p>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tagline</label>
              {isEditing ? (
                <input
                  type="text"
                  value={formData.header.tagline}
                  onChange={(e) => handleInputChange('header', 'tagline', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-primary-500"
                />
              ) : (
                <p className="text-sm text-gray-500">{formData.header.tagline}</p>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
              {isEditing ? (
                <textarea
                  rows={2}
                  value={formData.header.address}
                  onChange={(e) => handleInputChange('header', 'address', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-primary-500 resize-none"
                />
              ) : (
                <p className="text-sm text-gray-600">{formData.header.address}</p>
              )}
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={formData.header.phone}
                    onChange={(e) => handleInputChange('header', 'phone', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-primary-500"
                  />
                ) : (
                  <p className="text-sm text-gray-600">{formData.header.phone}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                {isEditing ? (
                  <input
                    type="email"
                    value={formData.header.email}
                    onChange={(e) => handleInputChange('header', 'email', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-primary-500"
                  />
                ) : (
                  <p className="text-sm text-gray-600">{formData.header.email}</p>
                )}
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">GST Number</label>
              {isEditing ? (
                <input
                  type="text"
                  value={formData.header.gstNumber}
                  onChange={(e) => handleInputChange('header', 'gstNumber', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-primary-500"
                />
              ) : (
                <p className="text-sm text-gray-600">GST: {formData.header.gstNumber}</p>
              )}
            </div>
          </div>
        </div>

        {/* Design Settings */}
        <div className="border border-gray-200 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-4">
            <Palette size={18} className="text-gray-600" />
            <h4 className="text-base font-semibold text-gray-900">Design Settings</h4>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Paper Size</label>
              {isEditing ? (
                <select
                  value={formData.design.paperSize}
                  onChange={(e) => handleInputChange('design', 'paperSize', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-primary-500"
                >
                  <option>58mm</option>
                  <option>80mm</option>
                  <option>112mm</option>
                </select>
              ) : (
                <p className="text-gray-900">{formData.design.paperSize}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Font Size</label>
              {isEditing ? (
                <select
                  value={formData.design.fontSize}
                  onChange={(e) => handleInputChange('design', 'fontSize', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-primary-500"
                >
                  <option>small</option>
                  <option>normal</option>
                  <option>large</option>
                </select>
              ) : (
                <p className="text-gray-900 capitalize">{formData.design.fontSize}</p>
              )}
            </div>
          </div>
          
          <div className="mt-3">
            <label className="block text-sm font-medium text-gray-700 mb-1">Primary Color</label>
            {isEditing ? (
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={formData.design.primaryColor}
                  onChange={(e) => handleInputChange('design', 'primaryColor', e.target.value)}
                  className="w-12 h-10 rounded border border-gray-200 cursor-pointer"
                />
                <input
                  type="text"
                  value={formData.design.primaryColor}
                  onChange={(e) => handleInputChange('design', 'primaryColor', e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-primary-500"
                />
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full" style={{ backgroundColor: formData.design.primaryColor }} />
                <span className="text-gray-900">{formData.design.primaryColor}</span>
              </div>
            )}
          </div>
          
          <div className="mt-4 space-y-2">
            {isEditing ? (
              <>
                <label className="flex items-center justify-between">
                  <span className="text-sm text-gray-700">Show Barcode on Receipt</span>
                  <input
                    type="checkbox"
                    checked={formData.design.showBarcode}
                    onChange={() => handleToggle('design', 'showBarcode')}
                    className="rounded border-gray-300 text-primary-500"
                  />
                </label>
                <label className="flex items-center justify-between">
                  <span className="text-sm text-gray-700">Show QR Code</span>
                  <input
                    type="checkbox"
                    checked={formData.design.showQRCode}
                    onChange={() => handleToggle('design', 'showQRCode')}
                    className="rounded border-gray-300 text-primary-500"
                  />
                </label>
                <label className="flex items-center justify-between">
                  <span className="text-sm text-gray-700">Show Tax Breakdown (CGST/SGST)</span>
                  <input
                    type="checkbox"
                    checked={formData.design.showTaxBreakdown}
                    onChange={() => handleToggle('design', 'showTaxBreakdown')}
                    className="rounded border-gray-300 text-primary-500"
                  />
                </label>
                <label className="flex items-center justify-between">
                  <span className="text-sm text-gray-700">Show Item-wise Discount</span>
                  <input
                    type="checkbox"
                    checked={formData.design.showItemDiscount}
                    onChange={() => handleToggle('design', 'showItemDiscount')}
                    className="rounded border-gray-300 text-primary-500"
                  />
                </label>
              </>
            ) : (
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Barcode</span>
                  <span className="text-sm text-gray-900">{formData.design.showBarcode ? 'Yes' : 'No'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">QR Code</span>
                  <span className="text-sm text-gray-900">{formData.design.showQRCode ? 'Yes' : 'No'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Tax Breakdown</span>
                  <span className="text-sm text-gray-900">{formData.design.showTaxBreakdown ? 'Yes' : 'No'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Item Discount</span>
                  <span className="text-sm text-gray-900">{formData.design.showItemDiscount ? 'Yes' : 'No'}</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer Settings */}
        <div className="border border-gray-200 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-4">
            <AlignLeft size={18} className="text-gray-600" />
            <h4 className="text-base font-semibold text-gray-900">Receipt Footer</h4>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Thank You Message</label>
              {isEditing ? (
                <input
                  type="text"
                  value={formData.footer.thankYouMessage}
                  onChange={(e) => handleInputChange('footer', 'thankYouMessage', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-primary-500"
                />
              ) : (
                <p className="text-sm text-gray-600 italic">{formData.footer.thankYouMessage}</p>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Return Policy</label>
              {isEditing ? (
                <textarea
                  rows={2}
                  value={formData.footer.returnPolicy}
                  onChange={(e) => handleInputChange('footer', 'returnPolicy', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-primary-500 resize-none"
                />
              ) : (
                <p className="text-xs text-gray-500">{formData.footer.returnPolicy}</p>
              )}
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Website</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={formData.footer.website}
                    onChange={(e) => handleInputChange('footer', 'website', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-primary-500"
                  />
                ) : (
                  <p className="text-sm text-gray-600">{formData.footer.website}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Support Number</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={formData.footer.supportNumber}
                    onChange={(e) => handleInputChange('footer', 'supportNumber', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-primary-500"
                  />
                ) : (
                  <p className="text-sm text-gray-600">{formData.footer.supportNumber}</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Custom Message */}
        <div className="border border-gray-200 rounded-lg p-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <MessageCircle size={18} className="text-gray-600" />
              <h4 className="text-base font-semibold text-gray-900">Custom Message</h4>
            </div>
            {isEditing && (
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.customMessage.enabled}
                  onChange={() => handleToggle('customMessage', 'enabled')}
                  className="rounded border-gray-300 text-primary-500"
                />
                <span className="text-sm text-gray-600">Enable</span>
              </label>
            )}
          </div>
          
          {formData.customMessage.enabled && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={formData.customMessage.message}
                    onChange={(e) => handleInputChange('customMessage', 'message', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-primary-500"
                    placeholder="🎉 Special offer message..."
                  />
                ) : (
                  <p className="text-sm text-gray-600">{formData.customMessage.message}</p>
                )}
              </div>
              <div className="mt-3">
                <label className="block text-sm font-medium text-gray-700 mb-1">Position</label>
                {isEditing ? (
                  <select
                    value={formData.customMessage.position}
                    onChange={(e) => handleInputChange('customMessage', 'position', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-primary-500"
                  >
                    <option>top</option>
                    <option>bottom</option>
                  </select>
                ) : (
                  <p className="text-sm text-gray-600 capitalize">{formData.customMessage.position}</p>
                )}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Receipt Preview Modal */}
      {showPreview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 animate-fadeIn">
          <div className="bg-white rounded-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-100 p-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Receipt Preview</h3>
              <button onClick={() => setShowPreview(false)} className="p-1 text-gray-400 hover:text-gray-600">
                <X size={20} />
              </button>
            </div>
            <div className="p-4">
              <div className="border border-gray-200 rounded-lg p-4 text-center">
                {logoPreview && <img src={logoPreview} alt="Logo" className="h-12 mx-auto mb-2" />}
                <h4 className="font-bold">{formData.header.storeName}</h4>
                <p className="text-xs text-gray-500">{formData.header.tagline}</p>
                <div className="border-t border-dashed border-gray-200 my-2" />
                <div className="text-left text-xs space-y-1">
                  <p>{formData.header.address}</p>
                  <p>Ph: {formData.header.phone}</p>
                  <p>GST: {formData.header.gstNumber}</p>
                </div>
                <div className="border-t border-dashed border-gray-200 my-2" />
                <div className="text-left text-xs">
                  <div className="flex justify-between">
                    <span>Item</span>
                    <span>Qty</span>
                    <span>Price</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Sample Product</span>
                    <span>2</span>
                    <span>₹1,000</span>
                  </div>
                </div>
                <div className="border-t border-dashed border-gray-200 my-2" />
                <div className="text-left text-xs">
                  <div className="flex justify-between">
                    <span>Total</span>
                    <span>₹1,000</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tax (18%)</span>
                    <span>₹180</span>
                  </div>
                </div>
                <div className="border-t border-dashed border-gray-200 my-2" />
                <p className="text-xs">{formData.footer.thankYouMessage}</p>
                <p className="text-xs text-gray-500">{formData.footer.returnPolicy}</p>
                <p className="text-xs text-gray-500">{formData.footer.website}</p>
                {formData.customMessage.enabled && (
                  <p className="text-xs text-primary-600 mt-1">{formData.customMessage.message}</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}