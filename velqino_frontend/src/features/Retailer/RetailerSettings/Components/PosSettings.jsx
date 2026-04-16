"use client"

import React, { useState, useEffect } from 'react'
import { Printer, CreditCard, Scan, Monitor, Settings, Save, Edit, X, CheckCircle, AlertCircle, RefreshCw, Plus, Trash2 } from '../../../../utils/icons'
import '../../../../styles/Retailer/RetailerSettings/PosSettings.scss'

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
    setTimeout(() => setShowSuccess(false), 3000)
  }

  const handleTestPrint = () => {
    setTestPrinting(true)
    setTimeout(() => {
      setTestPrinting(false)
      alert('Test print sent to printer!')
    }, 1500)
  }

  const handleTestScanner = () => {
    setTestScanner(true)
    setTimeout(() => {
      setTestScanner(false)
      alert('Scanner test completed!')
    }, 1500)
  }

  return (
    <div className="pos-settings bg-white rounded-xl shadow-sm border border-gray-100">
      {/* Header */}
      <div className="p-5 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Printer size={22} className="text-primary-500" />
            <div>
              <h3 className="text-lg font-semibold text-gray-900">POS Settings</h3>
              <p className="text-sm text-gray-500">Configure hardware and display settings</p>
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
            <button onClick={() => setIsEditing(true)} className="px-4 py-2 text-sm text-primary-600 border border-primary-200 rounded-lg hover:bg-primary-50 flex items-center gap-2">
              <Edit size={16} />
              Edit Settings
            </button>
          )}
        </div>
      </div>

      {/* Success Message */}
      {showSuccess && (
        <div className="mx-5 mt-4 p-3 bg-green-100 rounded-lg flex items-center gap-2 animate-fadeIn">
          <CheckCircle size={16} className="text-green-600" />
          <span className="text-sm text-green-700">POS settings saved successfully!</span>
        </div>
      )}

      <div className="p-5 space-y-6">
        {/* Receipt Printer Settings */}
        <div className="border border-gray-200 rounded-lg p-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Printer size={18} className="text-gray-600" />
              <h4 className="text-base font-semibold text-gray-900">Receipt Printer</h4>
            </div>
            {isEditing && (
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.receiptPrinter.enabled}
                  onChange={() => handleToggle('receiptPrinter', 'enabled')}
                  className="rounded border-gray-300 text-primary-500"
                />
                <span className="text-sm text-gray-600">Enable</span>
              </label>
            )}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Printer Name</label>
              {isEditing ? (
                <input
                  type="text"
                  value={formData.receiptPrinter.name}
                  onChange={(e) => handleInputChange('receiptPrinter', 'name', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-primary-500"
                />
              ) : (
                <p className="text-gray-900">{formData.receiptPrinter.name}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Port</label>
              {isEditing ? (
                <select
                  value={formData.receiptPrinter.port}
                  onChange={(e) => handleInputChange('receiptPrinter', 'port', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-primary-500"
                >
                  <option>USB-001</option>
                  <option>USB-002</option>
                  <option>COM1</option>
                  <option>COM2</option>
                  <option>COM3</option>
                  <option>LPT1</option>
                </select>
              ) : (
                <p className="text-gray-900">{formData.receiptPrinter.port}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Paper Size</label>
              {isEditing ? (
                <select
                  value={formData.receiptPrinter.paperSize}
                  onChange={(e) => handleInputChange('receiptPrinter', 'paperSize', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-primary-500"
                >
                  <option>58mm</option>
                  <option>80mm</option>
                  <option>112mm</option>
                </select>
              ) : (
                <p className="text-gray-900">{formData.receiptPrinter.paperSize}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Copies</label>
              {isEditing ? (
                <select
                  value={formData.receiptPrinter.copies}
                  onChange={(e) => handleInputChange('receiptPrinter', 'copies', parseInt(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-primary-500"
                >
                  <option value={1}>1 Copy</option>
                  <option value={2}>2 Copies</option>
                  <option value={3}>3 Copies</option>
                </select>
              ) : (
                <p className="text-gray-900">{formData.receiptPrinter.copies} {formData.receiptPrinter.copies === 1 ? 'copy' : 'copies'}</p>
              )}
            </div>
          </div>
          
          {formData.receiptPrinter.enabled && (
            <div className="mt-4">
              <button
                onClick={handleTestPrint}
                disabled={testPrinting}
                className="px-4 py-2 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-all flex items-center gap-2"
              >
                {testPrinting ? <RefreshCw size={14} className="animate-spin" /> : <Printer size={14} />}
                Test Print
              </button>
            </div>
          )}
        </div>

        {/* Cash Drawer Settings */}
        <div className="border border-gray-200 rounded-lg p-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <CreditCard size={18} className="text-gray-600" />
              <h4 className="text-base font-semibold text-gray-900">Cash Drawer</h4>
            </div>
            {isEditing && (
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.cashDrawer.enabled}
                  onChange={() => handleToggle('cashDrawer', 'enabled')}
                  className="rounded border-gray-300 text-primary-500"
                />
                <span className="text-sm text-gray-600">Enable</span>
              </label>
            )}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Drawer Name</label>
              {isEditing ? (
                <input
                  type="text"
                  value={formData.cashDrawer.name}
                  onChange={(e) => handleInputChange('cashDrawer', 'name', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-primary-500"
                />
              ) : (
                <p className="text-gray-900">{formData.cashDrawer.name}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Port</label>
              {isEditing ? (
                <select
                  value={formData.cashDrawer.port}
                  onChange={(e) => handleInputChange('cashDrawer', 'port', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-primary-500"
                >
                  <option>COM1</option>
                  <option>COM2</option>
                  <option>COM3</option>
                  <option>USB-001</option>
                </select>
              ) : (
                <p className="text-gray-900">{formData.cashDrawer.port}</p>
              )}
            </div>
          </div>
          
          {isEditing && (
            <div className="mt-3">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.cashDrawer.autoOpen}
                  onChange={() => handleToggle('cashDrawer', 'autoOpen')}
                  className="rounded border-gray-300 text-primary-500"
                />
                <span className="text-sm text-gray-600">Auto-open on sale completion</span>
              </label>
            </div>
          )}
        </div>

        {/* Barcode Scanner Settings */}
        <div className="border border-gray-200 rounded-lg p-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Scan size={18} className="text-gray-600" />
              <h4 className="text-base font-semibold text-gray-900">Barcode Scanner</h4>
            </div>
            {isEditing && (
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.barcodeScanner.enabled}
                  onChange={() => handleToggle('barcodeScanner', 'enabled')}
                  className="rounded border-gray-300 text-primary-500"
                />
                <span className="text-sm text-gray-600">Enable</span>
              </label>
            )}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Scanner Name</label>
              {isEditing ? (
                <input
                  type="text"
                  value={formData.barcodeScanner.name}
                  onChange={(e) => handleInputChange('barcodeScanner', 'name', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-primary-500"
                />
              ) : (
                <p className="text-gray-900">{formData.barcodeScanner.name}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Port</label>
              {isEditing ? (
                <select
                  value={formData.barcodeScanner.port}
                  onChange={(e) => handleInputChange('barcodeScanner', 'port', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-primary-500"
                >
                  <option>USB-001</option>
                  <option>USB-002</option>
                  <option>COM1</option>
                </select>
              ) : (
                <p className="text-gray-900">{formData.barcodeScanner.port}</p>
              )}
            </div>
          </div>
          
          {isEditing && (
            <div className="mt-3">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.barcodeScanner.beepOnScan}
                  onChange={() => handleToggle('barcodeScanner', 'beepOnScan')}
                  className="rounded border-gray-300 text-primary-500"
                />
                <span className="text-sm text-gray-600">Beep on successful scan</span>
              </label>
            </div>
          )}
          
          {formData.barcodeScanner.enabled && (
            <div className="mt-4">
              <button
                onClick={handleTestScanner}
                disabled={testScanner}
                className="px-4 py-2 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-all flex items-center gap-2"
              >
                {testScanner ? <RefreshCw size={14} className="animate-spin" /> : <Scan size={14} />}
                Test Scanner
              </button>
            </div>
          )}
        </div>

        {/* Display Settings */}
        <div className="border border-gray-200 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-4">
            <Monitor size={18} className="text-gray-600" />
            <h4 className="text-base font-semibold text-gray-900">Display Settings</h4>
          </div>
          
          <div className="space-y-2">
            {isEditing ? (
              <>
                <label className="flex items-center justify-between py-2">
                  <span className="text-sm text-gray-700">Show Customer Details</span>
                  <input
                    type="checkbox"
                    checked={formData.displaySettings.showCustomerDetails}
                    onChange={() => handleToggle('displaySettings', 'showCustomerDetails')}
                    className="rounded border-gray-300 text-primary-500"
                  />
                </label>
                <label className="flex items-center justify-between py-2">
                  <span className="text-sm text-gray-700">Show Product Images</span>
                  <input
                    type="checkbox"
                    checked={formData.displaySettings.showProductImage}
                    onChange={() => handleToggle('displaySettings', 'showProductImage')}
                    className="rounded border-gray-300 text-primary-500"
                  />
                </label>
                <label className="flex items-center justify-between py-2">
                  <span className="text-sm text-gray-700">Show Discount Popup</span>
                  <input
                    type="checkbox"
                    checked={formData.displaySettings.showDiscountPopup}
                    onChange={() => handleToggle('displaySettings', 'showDiscountPopup')}
                    className="rounded border-gray-300 text-primary-500"
                  />
                </label>
                <label className="flex items-center justify-between py-2">
                  <span className="text-sm text-gray-700">Auto Print Receipt</span>
                  <input
                    type="checkbox"
                    checked={formData.displaySettings.autoPrintReceipt}
                    onChange={() => handleToggle('displaySettings', 'autoPrintReceipt')}
                    className="rounded border-gray-300 text-primary-500"
                  />
                </label>
              </>
            ) : (
              <div className="space-y-2">
                <div className="flex justify-between py-1">
                  <span className="text-sm text-gray-600">Show Customer Details</span>
                  <span className="text-sm text-gray-900">{formData.displaySettings.showCustomerDetails ? 'Yes' : 'No'}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-sm text-gray-600">Show Product Images</span>
                  <span className="text-sm text-gray-900">{formData.displaySettings.showProductImage ? 'Yes' : 'No'}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-sm text-gray-600">Show Discount Popup</span>
                  <span className="text-sm text-gray-900">{formData.displaySettings.showDiscountPopup ? 'Yes' : 'No'}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-sm text-gray-600">Auto Print Receipt</span>
                  <span className="text-sm text-gray-900">{formData.displaySettings.autoPrintReceipt ? 'Yes' : 'No'}</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}