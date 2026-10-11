"use client"

import React, { useState, useEffect } from 'react'
import { 
  Printer, CreditCard, Scan, Monitor, Settings, Save, 
  Edit, X, CheckCircle, AlertCircle, RefreshCw, Plus, 
  Trash2, ShieldCheck, Sparkles 
} from '../../../../utils/icons'

export default function PosSettings() {
  const [mounted, setMounted] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [testPrinting, setTestPrinting] = useState(false)
  const [testScanner, setTestScanner] = useState(false)
  
  const [formData, setFormData] = useState({
    receiptPrinter: {
      name: 'Epson TM-T20',
      port: 'USB-001',
      paperSize: '80mm',
      copies: 2,
      enabled: true
    },
    cashDrawer: {
      name: 'Star Micronics',
      port: 'COM3',
      enabled: true,
      autoOpen: true
    },
    barcodeScanner: {
      name: 'Honeywell 1900',
      port: 'USB-002',
      enabled: true,
      beepOnScan: true
    },
    displaySettings: {
      showCustomerDetails: true,
      showProductImage: true,
      showDiscountPopup: true,
      autoPrintReceipt: true
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
    setTimeout(() => setShowSuccess(false), 2500)
  }

  const handleTestPrint = () => {
    setTestPrinting(true)
    setTimeout(() => {
      setTestPrinting(false)
    }, 1500)
  }

  const handleTestScanner = () => {
    setTestScanner(true)
    setTimeout(() => {
      setTestScanner(false)
    }, 1500)
  }

  return (
    <div className="bg-white rounded-3xl border border-gray-200/80 shadow-2xs overflow-hidden">
      {/* Header */}
      <div className="p-5 sm:p-6 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <Printer size={20} />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-extrabold text-gray-900 tracking-tight">POS Hardware &amp; Peripherals</h3>
            <p className="text-xs text-gray-500">Receipt printer drivers, barcode decoders, and cash drawer interfaces</p>
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
                <span>Save Hardware</span>
              </button>
            </div>
          ) : (
            <button 
              type="button"
              onClick={() => setIsEditing(true)} 
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-gray-700 bg-white border border-gray-200 hover:bg-gray-50 active:scale-95 rounded-xl shadow-2xs transition-all"
            >
              <Edit size={13} />
              <span>Configure Devices</span>
            </button>
          )}
        </div>
      </div>

      {/* Success Notification */}
      {showSuccess && (
        <div className="mx-6 mt-4 p-3 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center gap-2 text-xs font-bold text-emerald-800 animate-fadeIn">
          <CheckCircle size={16} className="text-emerald-600 shrink-0" />
          <span>POS peripheral parameters calibrated successfully!</span>
        </div>
      )}

      <div className="p-5 sm:p-6 space-y-5">
        {/* Receipt Printer Card */}
        <div className="p-4 sm:p-5 rounded-2xl border border-gray-200/80 bg-gray-50/30">
          <div className="flex items-center justify-between mb-3.5">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-primary-50 text-primary-600 flex items-center justify-center">
                <Printer size={16} />
              </div>
              <div>
                <h4 className="text-xs sm:text-sm font-extrabold text-gray-900">Thermal Receipt Printer</h4>
                <p className="text-[10px] text-gray-400">High-speed customer receipt and tax invoice dispenser</p>
              </div>
            </div>
            
            {isEditing ? (
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.receiptPrinter.enabled}
                  onChange={() => handleToggle('receiptPrinter', 'enabled')}
                  className="rounded text-primary-600 focus:ring-primary-500"
                />
                <span className="text-xs font-bold text-gray-700">Driver Active</span>
              </label>
            ) : (
              <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                formData.receiptPrinter.enabled ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-gray-100 text-gray-500 border-gray-200'
              }`}>
                {formData.receiptPrinter.enabled ? 'Online' : 'Disabled'}
              </span>
            )}
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 pt-2">
            <div className="p-3 bg-white rounded-xl border border-gray-200/60 shadow-2xs">
              <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Model Name</label>
              {isEditing ? (
                <input
                  type="text"
                  value={formData.receiptPrinter.name}
                  onChange={(e) => handleInputChange('receiptPrinter', 'name', e.target.value)}
                  className="w-full px-2.5 py-1 text-xs border border-gray-200 rounded-lg focus:border-primary-500 font-bold"
                />
              ) : (
                <p className="text-xs font-extrabold text-gray-900">{formData.receiptPrinter.name}</p>
              )}
            </div>

            <div className="p-3 bg-white rounded-xl border border-gray-200/60 shadow-2xs">
              <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Interface Port</label>
              {isEditing ? (
                <select
                  value={formData.receiptPrinter.port}
                  onChange={(e) => handleInputChange('receiptPrinter', 'port', e.target.value)}
                  className="w-full px-2 py-1 text-xs border border-gray-200 rounded-lg focus:border-primary-500 font-bold"
                >
                  <option>USB-001</option>
                  <option>USB-002</option>
                  <option>COM1</option>
                  <option>COM2</option>
                  <option>COM3</option>
                </select>
              ) : (
                <p className="text-xs font-extrabold text-gray-900 font-mono">{formData.receiptPrinter.port}</p>
              )}
            </div>

            <div className="p-3 bg-white rounded-xl border border-gray-200/60 shadow-2xs">
              <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Paper Roll Width</label>
              {isEditing ? (
                <select
                  value={formData.receiptPrinter.paperSize}
                  onChange={(e) => handleInputChange('receiptPrinter', 'paperSize', e.target.value)}
                  className="w-full px-2 py-1 text-xs border border-gray-200 rounded-lg focus:border-primary-500 font-bold"
                >
                  <option>58mm</option>
                  <option>80mm (Standard)</option>
                  <option>112mm</option>
                </select>
              ) : (
                <p className="text-xs font-extrabold text-gray-900">{formData.receiptPrinter.paperSize}</p>
              )}
            </div>

            <div className="p-3 bg-white rounded-xl border border-gray-200/60 shadow-2xs">
              <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Copies Printed</label>
              {isEditing ? (
                <select
                  value={formData.receiptPrinter.copies}
                  onChange={(e) => handleInputChange('receiptPrinter', 'copies', parseInt(e.target.value))}
                  className="w-full px-2 py-1 text-xs border border-gray-200 rounded-lg focus:border-primary-500 font-bold"
                >
                  <option value={1}>1 Original</option>
                  <option value={2}>2 (Customer + Store)</option>
                  <option value={3}>3 Copies</option>
                </select>
              ) : (
                <p className="text-xs font-extrabold text-gray-900">{formData.receiptPrinter.copies} Copies</p>
              )}
            </div>
          </div>
          
          {formData.receiptPrinter.enabled && (
            <div className="mt-3.5 pt-3 border-t border-gray-200/60 flex items-center justify-between">
              <span className="text-[11px] text-gray-400">Prints self-test diagnostics page</span>
              <button
                type="button"
                onClick={handleTestPrint}
                disabled={testPrinting}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-xl bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 shadow-2xs transition-all disabled:opacity-50"
              >
                {testPrinting ? <RefreshCw size={13} className="animate-spin text-primary-600" /> : <Printer size={13} />}
                <span>{testPrinting ? 'Transmitting...' : 'Dispatch Test Slip'}</span>
              </button>
            </div>
          )}
        </div>

        {/* Cash Drawer Card */}
        <div className="p-4 sm:p-5 rounded-2xl border border-gray-200/80 bg-gray-50/30">
          <div className="flex items-center justify-between mb-3.5">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                <CreditCard size={16} />
              </div>
              <div>
                <h4 className="text-xs sm:text-sm font-extrabold text-gray-900">Automatic Cash Drawer (RJ11/COM)</h4>
                <p className="text-[10px] text-gray-400">Solenoid trigger mechanism for currency drawers</p>
              </div>
            </div>
            
            {isEditing ? (
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.cashDrawer.enabled}
                  onChange={() => handleToggle('cashDrawer', 'enabled')}
                  className="rounded text-primary-600 focus:ring-primary-500"
                />
                <span className="text-xs font-bold text-gray-700">Driver Active</span>
              </label>
            ) : (
              <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                formData.cashDrawer.enabled ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-gray-100 text-gray-500 border-gray-200'
              }`}>
                {formData.cashDrawer.enabled ? 'Connected' : 'Disabled'}
              </span>
            )}
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2">
            <div className="p-3 bg-white rounded-xl border border-gray-200/60 shadow-2xs">
              <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Drawer Mechanism</label>
              {isEditing ? (
                <input
                  type="text"
                  value={formData.cashDrawer.name}
                  onChange={(e) => handleInputChange('cashDrawer', 'name', e.target.value)}
                  className="w-full px-2.5 py-1 text-xs border border-gray-200 rounded-lg focus:border-primary-500 font-bold"
                />
              ) : (
                <p className="text-xs font-extrabold text-gray-900">{formData.cashDrawer.name}</p>
              )}
            </div>

            <div className="p-3 bg-white rounded-xl border border-gray-200/60 shadow-2xs">
              <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Trigger Port</label>
              {isEditing ? (
                <select
                  value={formData.cashDrawer.port}
                  onChange={(e) => handleInputChange('cashDrawer', 'port', e.target.value)}
                  className="w-full px-2 py-1 text-xs border border-gray-200 rounded-lg focus:border-primary-500 font-bold"
                >
                  <option>COM1</option>
                  <option>COM2</option>
                  <option>COM3</option>
                  <option>RJ11 (Printer Kick)</option>
                </select>
              ) : (
                <p className="text-xs font-extrabold text-gray-900 font-mono">{formData.cashDrawer.port}</p>
              )}
            </div>
          </div>
          
          {isEditing && (
            <div className="mt-3 pt-2.5 border-t border-gray-200/60 flex items-center justify-between">
              <span className="text-xs text-gray-600 font-medium">Automatic solenoid ejection on finalized transaction:</span>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.cashDrawer.autoOpen}
                  onChange={() => handleToggle('cashDrawer', 'autoOpen')}
                  className="rounded text-primary-600"
                />
                <span className="text-xs font-bold text-gray-800">Auto Kick</span>
              </label>
            </div>
          )}
        </div>

        {/* Barcode Scanner Card */}
        <div className="p-4 sm:p-5 rounded-2xl border border-gray-200/80 bg-gray-50/30">
          <div className="flex items-center justify-between mb-3.5">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
                <Scan size={16} />
              </div>
              <div>
                <h4 className="text-xs sm:text-sm font-extrabold text-gray-900">1D / 2D Barcode &amp; QR Scanner</h4>
                <p className="text-[10px] text-gray-400">High-speed optical laser reader for retail checkout</p>
              </div>
            </div>
            
            {isEditing ? (
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.barcodeScanner.enabled}
                  onChange={() => handleToggle('barcodeScanner', 'enabled')}
                  className="rounded text-primary-600 focus:ring-primary-500"
                />
                <span className="text-xs font-bold text-gray-700">Driver Active</span>
              </label>
            ) : (
              <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                formData.barcodeScanner.enabled ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-gray-100 text-gray-500 border-gray-200'
              }`}>
                {formData.barcodeScanner.enabled ? 'Armed & Listening' : 'Disabled'}
              </span>
            )}
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2">
            <div className="p-3 bg-white rounded-xl border border-gray-200/60 shadow-2xs">
              <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Scanner Engine</label>
              {isEditing ? (
                <input
                  type="text"
                  value={formData.barcodeScanner.name}
                  onChange={(e) => handleInputChange('barcodeScanner', 'name', e.target.value)}
                  className="w-full px-2.5 py-1 text-xs border border-gray-200 rounded-lg focus:border-primary-500 font-bold"
                />
              ) : (
                <p className="text-xs font-extrabold text-gray-900">{formData.barcodeScanner.name}</p>
              )}
            </div>

            <div className="p-3 bg-white rounded-xl border border-gray-200/60 shadow-2xs">
              <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Comms Port</label>
              {isEditing ? (
                <select
                  value={formData.barcodeScanner.port}
                  onChange={(e) => handleInputChange('barcodeScanner', 'port', e.target.value)}
                  className="w-full px-2 py-1 text-xs border border-gray-200 rounded-lg focus:border-primary-500 font-bold"
                >
                  <option>USB-001 (HID Emulation)</option>
                  <option>USB-002</option>
                  <option>Virtual COM</option>
                </select>
              ) : (
                <p className="text-xs font-extrabold text-gray-900 font-mono">{formData.barcodeScanner.port}</p>
              )}
            </div>
          </div>
          
          {formData.barcodeScanner.enabled && (
            <div className="mt-3.5 pt-3 border-t border-gray-200/60 flex items-center justify-between">
              <span className="text-[11px] text-gray-400">Decodes UPC, EAN-13, Code-128, and GS1 DataBar</span>
              <button
                type="button"
                onClick={handleTestScanner}
                disabled={testScanner}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-xl bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 shadow-2xs transition-all disabled:opacity-50"
              >
                {testScanner ? <RefreshCw size={13} className="animate-spin text-primary-600" /> : <Scan size={13} />}
                <span>{testScanner ? 'Scanning...' : 'Test Laser Decode'}</span>
              </button>
            </div>
          )}
        </div>

        {/* Display & Checkout Screen Preferences */}
        <div className="p-4 sm:p-5 rounded-2xl border border-gray-200/80 bg-gray-50/30">
          <div className="flex items-center gap-2.5 mb-3.5">
            <div className="w-8 h-8 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center">
              <Monitor size={16} />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-extrabold text-gray-900">Dual Display &amp; Checkout Preferences</h4>
              <p className="text-[10px] text-gray-400">Customer pole display and cashier screen behaviors</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            {[
              { id: 'showCustomerDetails', label: 'Display Customer VIP Name & Points on Register' },
              { id: 'showProductImage', label: 'Render High-Res Product Thumbnail on POS Cart Grid' },
              { id: 'showDiscountPopup', label: 'Prompt Quick-Discount Modal on Order Checkout' },
              { id: 'autoPrintReceipt', label: 'Instantly Fire Print Job on Successful Payment' },
            ].map(setting => {
              const isChecked = formData.displaySettings[setting.id]
              return (
                <div 
                  key={setting.id}
                  className="p-3 bg-white rounded-xl border border-gray-200/60 shadow-2xs flex items-center justify-between gap-3"
                >
                  <span className="text-xs text-gray-700 font-medium">{setting.label}</span>
                  {isEditing ? (
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => handleToggle('displaySettings', setting.id)}
                      className="rounded text-primary-600 focus:ring-primary-500"
                    />
                  ) : (
                    <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                      isChecked ? 'bg-emerald-50 text-emerald-700' : 'bg-gray-100 text-gray-400'
                    }`}>
                      {isChecked ? 'Active' : 'Off'}
                    </span>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
