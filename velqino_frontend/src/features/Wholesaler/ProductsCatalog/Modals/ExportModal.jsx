'use client'

import React, { useState } from 'react'
import { FileText, X, Download } from '../../../../utils/icons'
import productsAPI from '../../../../redux/wholesaler/Api/productsAPI'

export default function ExportModal({ onClose }) {
  const [format, setFormat] = useState('csv')
  const [exporting, setExporting] = useState(false)

  const handleExport = async () => {
  setExporting(true)
  try {
    const response = await productsAPI.exportProducts({ format })
    // ✅ response is the axios response object
    const blob = response.data  // ✅ Get blob from response.data
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `products.${format === 'excel' ? 'xlsx' : 'csv'}`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    window.URL.revokeObjectURL(url)
    onClose()
  } catch (error) {
    console.error('Export error:', error)
    alert('Export failed: ' + (error.response?.data?.message || error.message))
  } finally {
    setExporting(false)
  }
}

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="absolute inset-y-0 right-0 w-full max-w-2xl pt-[56px] pb-[70px] sm:pt-20 sm:pb-16">
        <div className="h-full bg-white rounded-l-2xl shadow-xl overflow-y-auto">
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-900">Export Products</h2>
              <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                <X size={20} />
              </button>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2">Format</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => setFormat('csv')}
                    className={`p-3 border-2 rounded-lg ${format === 'csv' ? 'border-primary-600 bg-primary-50' : 'border-gray-200'}`}
                  >
                    <FileText className="w-5 h-5 mx-auto mb-1 text-primary-600" />
                    CSV
                  </button>
                  <button
                    onClick={() => setFormat('excel')}
                    className={`p-3 border-2 rounded-lg ${format === 'excel' ? 'border-primary-600 bg-primary-50' : 'border-gray-200'}`}
                  >
                    <FileText className="w-5 h-5 mx-auto mb-1 text-green-600" />
                    Excel
                  </button>
                </div>
              </div>

              <div className="flex gap-3">
                <button onClick={onClose} className="flex-1 px-4 py-2 border rounded-lg">Cancel</button>
                <button 
                  onClick={handleExport}
                  disabled={exporting}
                  className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-lg flex items-center justify-center gap-2"
                >
                  <Download size={16} />
                  {exporting ? 'Exporting...' : 'Export'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}