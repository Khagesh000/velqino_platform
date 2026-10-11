"use client"

import React, { useState, useEffect } from 'react'
import { Receipt, Printer, Image, MessageCircle, Type, AlignLeft, Palette, Save, Edit, X, CheckCircle, Upload, Eye, RefreshCw } from '../../../../utils/icons'

export default function ReceiptCustomization() {
  const [mounted, setMounted] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [showPreview, setShowPreview] = useState(false)
  const [logoPreview, setLogoPreview] = useState(null)
  
  const [formData, setFormData] = useState({
    header: {
      showLogo: true,
      storeName: 'Velqino Retail Flagship',
      tagline: 'Your Trusted Omnichannel Superstore',
      address: '123, MG Road, Indiranagar, Bangalore - 560001',
      phone: '+91 98765 43210',
      email: 'care@velqino.com',
      gstNumber: '29ABCDE1234F1Z5'
    },
    footer: {
      thankYouMessage: 'Thank you for shopping at Velqino!',
      returnPolicy: 'Items can be exchanged within 7 days with original invoice & tags intact.',
      website: 'www.velqino.com',
      supportNumber: '+91 80 4000 8900',
      socialMedia: {
        instagram: '@velqino_official',
        facebook: 'velqinostore',
        twitter: '@velqino'
      }
    },
    design: {
      paperSize: '80mm',
      fontSize: 'normal',
      primaryColor: '#4f46e5',
      showBarcode: true,
      showQRCode: true,
      showTaxBreakdown: true,
      showItemDiscount: true
    },
    customMessage: {
      enabled: true,
      message: '🎉 Flat 10% OFF on your next visit with coupon: VELQINO10',
      position: 'bottom'
    }
  })

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  const handleInputChange = (section, field, value) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }))
  }

  const handleToggle = (section, field) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: !prev[section][field]
      }
    }))
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
  }

  return (
    <div className="bg-white rounded-3xl border border-gray-200/80 shadow-2xs overflow-hidden transition-all duration-300">
      {/* Header */}
      <div className="p-5 sm:p-6 border-b border-gray-100 bg-gradient-to-r from-gray-50/60 via-white to-gray-50/30">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-primary-50 border border-primary-100 flex items-center justify-center text-primary-600 shadow-2xs shrink-0">
              <Receipt size={20} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-extrabold text-gray-900 tracking-tight">Receipt &amp; Thermal Slip Design</h3>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  ESC/POS Ready
                </span>
              </div>
              <p className="text-xs text-gray-500 mt-0.5">Customize print layout, header brand branding, barcodes, and return policy disclaimers</p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-auto">
            {isEditing ? (
              <>
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-3.5 py-2 text-xs font-bold text-gray-700 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-all shadow-2xs"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSave}
                  className="px-4 py-2 text-xs font-bold text-white bg-primary-600 hover:bg-primary-700 rounded-xl transition-all shadow-xs flex items-center gap-1.5"
                >
                  <Save size={14} />
                  Save Template
                </button>
              </>
            ) : (
              <>
                <button
                  type="button"
                  onClick={handleTestPrint}
                  className="px-3.5 py-2 text-xs font-bold text-gray-700 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-all flex items-center gap-1.5 shadow-2xs"
                >
                  <Eye size={14} className="text-gray-500" />
                  Live Preview
                </button>
                <button
                  type="button"
                  onClick={() => setIsEditing(true)}
                  className="px-4 py-2 text-xs font-bold text-white bg-primary-600 hover:bg-primary-700 rounded-xl transition-all flex items-center gap-1.5 shadow-xs"
                >
                  <Edit size={14} />
                  Customize Slip
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Success Notification */}
      {showSuccess && (
        <div className="mx-6 mt-5 p-3.5 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center gap-3 animate-fadeIn">
          <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
            <CheckCircle size={18} />
          </div>
          <div>
            <p className="text-xs font-bold text-emerald-900">Receipt Template Deployed</p>
            <p className="text-xs text-emerald-700">Thermal printer profiles and customer slip templates updated successfully.</p>
          </div>
        </div>
      )}

      <div className="p-5 sm:p-6 space-y-6">
        {/* Section 1: Header Identity */}
        <div>
          <div className="flex items-center gap-2 mb-3.5">
            <div className="w-7 h-7 rounded-lg bg-gray-100 flex items-center justify-center text-gray-700">
              <Type size={16} />
            </div>
            <div>
              <h4 className="text-sm font-bold text-gray-900">Receipt Header & Store Brand</h4>
              <p className="text-xs text-gray-500">Information displayed prominently at the top of customer sales slips</p>
            </div>
          </div>

          <div className="p-5 rounded-2xl border border-gray-200/80 bg-gray-50/40 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-gray-200/70">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-primary-50 text-primary-600 flex items-center justify-center">
                  <Image size={18} />
                </div>
                <div>
                  <span className="text-xs font-bold text-gray-900 block">Print Store Logo Graphic</span>
                  <span className="text-2xs text-gray-500">Recommended: Monochrome 1-bit bitmap, 384x120 px</span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                {formData.header.showLogo && isEditing && (
                  <div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleLogoUpload}
                      className="hidden"
                      id="receipt-logo-upload"
                    />
                    <label
                      htmlFor="receipt-logo-upload"
                      className="px-3 py-1.5 text-xs font-semibold text-primary-700 bg-white border border-primary-200 rounded-lg cursor-pointer hover:bg-primary-50 flex items-center gap-1.5 transition-all shadow-2xs"
                    >
                      <Upload size={13} />
                      Upload Logo
                    </label>
                  </div>
                )}
                {isEditing ? (
                  <button
                    type="button"
                    onClick={() => handleToggle('header', 'showLogo')}
                    className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${
                      formData.header.showLogo ? 'bg-primary-600' : 'bg-gray-300'
                    }`}
                  >
                    <span
                      className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition duration-200 ease-in-out ${
                        formData.header.showLogo ? 'translate-x-4' : 'translate-x-0'
                      }`}
                    />
                  </button>
                ) : (
                  <span className={`text-2xs font-bold px-2 py-0.5 rounded-full ${
                    formData.header.showLogo ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-gray-100 text-gray-500'
                  }`}>
                    {formData.header.showLogo ? 'Logo Enabled' : 'Logo Hidden'}
                  </span>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">Store Trading Title</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={formData.header.storeName}
                    onChange={(e) => handleInputChange('header', 'storeName', e.target.value)}
                    className="w-full px-3.5 py-2 text-sm bg-white border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all font-bold"
                  />
                ) : (
                  <p className="text-sm font-bold text-gray-900 bg-white p-2.5 rounded-xl border border-gray-200/70">
                    {formData.header.storeName}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">Store Slogan / Tagline</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={formData.header.tagline}
                    onChange={(e) => handleInputChange('header', 'tagline', e.target.value)}
                    className="w-full px-3.5 py-2 text-sm bg-white border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all font-medium"
                  />
                ) : (
                  <p className="text-sm text-gray-700 bg-white p-2.5 rounded-xl border border-gray-200/70">
                    {formData.header.tagline}
                  </p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">Outlet Physical Address</label>
              {isEditing ? (
                <textarea
                  rows={2}
                  value={formData.header.address}
                  onChange={(e) => handleInputChange('header', 'address', e.target.value)}
                  className="w-full px-3.5 py-2 text-sm bg-white border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all font-medium resize-none"
                />
              ) : (
                <p className="text-sm text-gray-700 bg-white p-2.5 rounded-xl border border-gray-200/70">
                  {formData.header.address}
                </p>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">Telephone Helpline</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={formData.header.phone}
                    onChange={(e) => handleInputChange('header', 'phone', e.target.value)}
                    className="w-full px-3.5 py-2 text-sm bg-white border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all"
                  />
                ) : (
                  <p className="text-xs font-semibold text-gray-800 bg-white p-2 rounded-lg border border-gray-200/70">
                    {formData.header.phone}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">Support Email</label>
                {isEditing ? (
                  <input
                    type="email"
                    value={formData.header.email}
                    onChange={(e) => handleInputChange('header', 'email', e.target.value)}
                    className="w-full px-3.5 py-2 text-sm bg-white border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all"
                  />
                ) : (
                  <p className="text-xs font-semibold text-gray-800 bg-white p-2 rounded-lg border border-gray-200/70">
                    {formData.header.email}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">Invoice GSTIN</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={formData.header.gstNumber}
                    onChange={(e) => handleInputChange('header', 'gstNumber', e.target.value)}
                    className="w-full px-3.5 py-2 text-sm font-mono bg-white border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all uppercase"
                  />
                ) : (
                  <p className="text-xs font-mono font-bold text-gray-900 bg-white p-2 rounded-lg border border-gray-200/70 uppercase">
                    {formData.header.gstNumber}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Section 2: Layout & Hardware Specs */}
        <div>
          <div className="flex items-center gap-2 mb-3.5">
            <div className="w-7 h-7 rounded-lg bg-gray-100 flex items-center justify-center text-gray-700">
              <Palette size={16} />
            </div>
            <div>
              <h4 className="text-sm font-bold text-gray-900">Printer Media & Layout Specs</h4>
              <p className="text-xs text-gray-500">Configure roll roll width, typography scaling, barcode printing, and tax itemization</p>
            </div>
          </div>

          <div className="p-5 rounded-2xl border border-gray-200/80 bg-gray-50/40 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">Thermal Roll Width</label>
                {isEditing ? (
                  <select
                    value={formData.design.paperSize}
                    onChange={(e) => handleInputChange('design', 'paperSize', e.target.value)}
                    className="w-full px-3.5 py-2 text-sm bg-white border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all font-semibold"
                  >
                    <option value="58mm">58mm (2-inch Compact Mobile POS)</option>
                    <option value="80mm">80mm (3-inch Standard Desktop POS)</option>
                    <option value="112mm">112mm (4-inch Extended Superstore)</option>
                  </select>
                ) : (
                  <div className="flex items-center gap-2 bg-white p-2.5 rounded-xl border border-gray-200/70">
                    <span className="font-bold text-gray-900 text-sm">{formData.design.paperSize}</span>
                    <span className="text-xs text-gray-500">(Standard Desktop POS Roll)</span>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">Font Scaling Density</label>
                {isEditing ? (
                  <select
                    value={formData.design.fontSize}
                    onChange={(e) => handleInputChange('design', 'fontSize', e.target.value)}
                    className="w-full px-3.5 py-2 text-sm bg-white border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all font-semibold capitalize"
                  >
                    <option value="small">Compact (Dense Item List)</option>
                    <option value="normal">Standard (Balanced Legibility)</option>
                    <option value="large">Enlarged (Senior Friendly)</option>
                  </select>
                ) : (
                  <div className="flex items-center gap-2 bg-white p-2.5 rounded-xl border border-gray-200/70">
                    <span className="font-bold text-gray-900 text-sm capitalize">{formData.design.fontSize}</span>
                    <span className="text-xs text-gray-500">(12-point thermal font)</span>
                  </div>
                )}
              </div>
            </div>

            {/* Feature Toggles */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 pt-2">
              {[
                { key: 'showBarcode', label: 'Order Barcode', desc: 'Scan code at return desk' },
                { key: 'showQRCode', label: 'UPI QR Payment Code', desc: 'Instant UPI dynamic QR' },
                { key: 'showTaxBreakdown', label: 'Tax Breakdown Table', desc: 'CGST / SGST split' },
                { key: 'showItemDiscount', label: 'Line-Item Savings', desc: 'Shows MRP vs Sold price' },
              ].map(({ key, label, desc }) => {
                const isActive = formData.design[key]
                return (
                  <div
                    key={key}
                    className={`p-3.5 rounded-xl border transition-all ${
                      isActive ? 'border-primary-200/80 bg-white shadow-2xs' : 'border-gray-200/70 bg-gray-50/50'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-xs font-bold text-gray-900">{label}</span>
                      {isEditing ? (
                        <button
                          type="button"
                          onClick={() => handleToggle('design', key)}
                          className={`relative inline-flex h-4.5 w-8 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${
                            isActive ? 'bg-primary-600' : 'bg-gray-300'
                          }`}
                        >
                          <span
                            className={`pointer-events-none inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow-sm transition duration-200 ease-in-out ${
                              isActive ? 'translate-x-3.5' : 'translate-x-0'
                            }`}
                          />
                        </button>
                      ) : (
                        <span className={`text-2xs font-extrabold px-1.5 py-0.5 rounded-md ${
                          isActive ? 'bg-emerald-50 text-emerald-700' : 'bg-gray-100 text-gray-400'
                        }`}>
                          {isActive ? 'ON' : 'OFF'}
                        </span>
                      )}
                    </div>
                    <p className="text-2xs text-gray-500">{desc}</p>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* Section 3: Footer & Disclaimers */}
        <div>
          <div className="flex items-center gap-2 mb-3.5">
            <div className="w-7 h-7 rounded-lg bg-gray-100 flex items-center justify-center text-gray-700">
              <AlignLeft size={16} />
            </div>
            <div>
              <h4 className="text-sm font-bold text-gray-900">Receipt Footer & Customer Disclaimers</h4>
              <p className="text-xs text-gray-500">Terms of return, appreciation tagline, website, and support contact</p>
            </div>
          </div>

          <div className="p-5 rounded-2xl border border-gray-200/80 bg-gray-50/40 space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">Thank You Greeting</label>
              {isEditing ? (
                <input
                  type="text"
                  value={formData.footer.thankYouMessage}
                  onChange={(e) => handleInputChange('footer', 'thankYouMessage', e.target.value)}
                  className="w-full px-3.5 py-2 text-sm bg-white border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all font-medium"
                />
              ) : (
                <p className="text-sm font-semibold text-gray-800 italic bg-white p-2.5 rounded-xl border border-gray-200/70">
                  "{formData.footer.thankYouMessage}"
                </p>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">Return & Exchange Policy Terms</label>
              {isEditing ? (
                <textarea
                  rows={2}
                  value={formData.footer.returnPolicy}
                  onChange={(e) => handleInputChange('footer', 'returnPolicy', e.target.value)}
                  className="w-full px-3.5 py-2 text-xs bg-white border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all font-medium resize-none"
                />
              ) : (
                <p className="text-xs text-gray-600 bg-white p-2.5 rounded-xl border border-gray-200/70">
                  {formData.footer.returnPolicy}
                </p>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">Store Web Address</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={formData.footer.website}
                    onChange={(e) => handleInputChange('footer', 'website', e.target.value)}
                    className="w-full px-3.5 py-2 text-sm bg-white border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all"
                  />
                ) : (
                  <p className="text-xs font-bold text-gray-800 bg-white p-2.5 rounded-xl border border-gray-200/70">
                    {formData.footer.website}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">Customer Care Toll-Free</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={formData.footer.supportNumber}
                    onChange={(e) => handleInputChange('footer', 'supportNumber', e.target.value)}
                    className="w-full px-3.5 py-2 text-sm bg-white border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all"
                  />
                ) : (
                  <p className="text-xs font-bold text-gray-800 bg-white p-2.5 rounded-xl border border-gray-200/70">
                    {formData.footer.supportNumber}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Section 4: Promotional Custom Banner Message */}
        <div className="p-5 rounded-2xl border border-gray-200/80 bg-white">
          <div className="flex items-center justify-between mb-3.5">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-primary-50 text-primary-600 flex items-center justify-center">
                <MessageCircle size={16} />
              </div>
              <h4 className="text-sm font-bold text-gray-900">Seasonal Promotional Slip Banner</h4>
            </div>
            {isEditing ? (
              <button
                type="button"
                onClick={() => handleToggle('customMessage', 'enabled')}
                className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${
                  formData.customMessage.enabled ? 'bg-primary-600' : 'bg-gray-300'
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition duration-200 ease-in-out ${
                    formData.customMessage.enabled ? 'translate-x-4' : 'translate-x-0'
                  }`}
                />
              </button>
            ) : (
              <span className={`text-2xs font-bold px-2 py-0.5 rounded-full ${
                formData.customMessage.enabled ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-gray-100 text-gray-400'
              }`}>
                {formData.customMessage.enabled ? 'Printed on Slips' : 'Disabled'}
              </span>
            )}
          </div>

          {formData.customMessage.enabled && (
            <div className="p-3.5 rounded-xl bg-primary-50/40 border border-primary-100 space-y-2">
              <label className="block text-2xs font-bold text-primary-800 uppercase tracking-wider">Active Promotional Callout</label>
              {isEditing ? (
                <input
                  type="text"
                  value={formData.customMessage.message}
                  onChange={(e) => handleInputChange('customMessage', 'message', e.target.value)}
                  className="w-full px-3.5 py-2 text-sm bg-white border border-primary-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-500/20 font-semibold"
                />
              ) : (
                <p className="text-xs font-bold text-primary-900">
                  {formData.customMessage.message}
                </p>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Realistic Thermal Receipt Live Preview Modal */}
      {showPreview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-950/60 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-sm w-full p-5 shadow-2xl border border-gray-100 max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <Printer size={16} className="text-primary-600" />
                <h3 className="text-sm font-bold text-gray-900">Thermal Receipt Preview (80mm)</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowPreview(false)}
                className="w-7 h-7 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 flex items-center justify-center"
              >
                <X size={16} />
              </button>
            </div>

            {/* Thermal Slip Simulation */}
            <div className="bg-amber-50/30 p-5 rounded-2xl border border-dashed border-gray-300 font-mono text-2xs text-gray-800 leading-tight space-y-2">
              <div className="text-center space-y-1">
                {logoPreview && (
                  <img src={logoPreview} alt="Store Logo" className="h-10 mx-auto object-contain mb-1" />
                )}
                <h4 className="font-extrabold text-sm text-gray-900 tracking-tight">{formData.header.storeName}</h4>
                <p className="text-3xs text-gray-500">{formData.header.tagline}</p>
                <p className="text-3xs text-gray-600">{formData.header.address}</p>
                <p className="text-3xs text-gray-600">Ph: {formData.header.phone}</p>
                <p className="text-3xs font-bold text-gray-800">GSTIN: {formData.header.gstNumber}</p>
              </div>

              <div className="border-t border-dashed border-gray-300 pt-2 flex justify-between text-3xs text-gray-500">
                <span>Receipt: #POS-9812</span>
                <span>{new Date().toLocaleDateString('en-IN')} 18:24</span>
              </div>

              <div className="border-t border-dashed border-gray-300 pt-2">
                <div className="flex justify-between font-bold text-gray-900 mb-1">
                  <span>ITEM</span>
                  <span>QTY</span>
                  <span>AMT</span>
                </div>
                <div className="flex justify-between">
                  <span>Organic Cotton Shirt (M)</span>
                  <span>1</span>
                  <span>₹1,499.00</span>
                </div>
                <div className="flex justify-between">
                  <span>Denim Slim Trousers (32)</span>
                  <span>1</span>
                  <span>₹2,199.00</span>
                </div>
              </div>

              <div className="border-t border-dashed border-gray-300 pt-2 space-y-1">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span>₹3,698.00</span>
                </div>
                {formData.design.showItemDiscount && (
                  <div className="flex justify-between text-emerald-700">
                    <span>Discount:</span>
                    <span>- ₹369.80</span>
                  </div>
                )}
                {formData.design.showTaxBreakdown && (
                  <>
                    <div className="flex justify-between text-gray-500">
                      <span>CGST (2.5%):</span>
                      <span>₹83.20</span>
                    </div>
                    <div className="flex justify-between text-gray-500">
                      <span>SGST (2.5%):</span>
                      <span>₹83.20</span>
                    </div>
                  </>
                )}
                <div className="flex justify-between font-bold text-xs text-gray-900 pt-1 border-t border-gray-400">
                  <span>GRAND TOTAL:</span>
                  <span>₹3,494.60</span>
                </div>
              </div>

              {formData.design.showBarcode && (
                <div className="pt-2 text-center">
                  <div className="h-7 bg-gray-900 mx-6 rounded-xs flex items-center justify-center text-white text-3xs tracking-widest">
                    ||| | |||| | |||||| || | ||
                  </div>
                  <span className="text-3xs text-gray-500">8901234567890</span>
                </div>
              )}

              {formData.customMessage.enabled && (
                <div className="border-t border-dashed border-gray-300 pt-2 text-center text-3xs font-bold text-primary-700">
                  {formData.customMessage.message}
                </div>
              )}

              <div className="border-t border-dashed border-gray-300 pt-2 text-center text-3xs text-gray-500 space-y-0.5">
                <p className="font-bold text-gray-700">{formData.footer.thankYouMessage}</p>
                <p>{formData.footer.returnPolicy}</p>
                <p>{formData.footer.website} • {formData.footer.supportNumber}</p>
              </div>
            </div>

            <div className="flex items-center gap-2.5 mt-4">
              <button
                type="button"
                onClick={() => setShowPreview(false)}
                className="flex-1 py-2 text-xs font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl"
              >
                Close Preview
              </button>
              <button
                type="button"
                onClick={() => window.print()}
                className="flex-1 py-2 text-xs font-semibold text-white bg-primary-600 hover:bg-primary-700 rounded-xl flex items-center justify-center gap-1.5 shadow-xs"
              >
                <Printer size={14} />
                Send Print Test
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
