'use client'

import React, { useState } from 'react'
import { FileText, X, Download, Check, FileSpreadsheet } from '../../../../utils/icons'
import productsAPI from '../../../../redux/wholesaler/Api/productsAPI'
import { toast } from 'react-toastify'
import '../../../../styles/Wholesaler/ProductsCatalog/CatalogModals.scss'

export default function ExportModal({ onClose }) {
  const [format, setFormat] = useState('csv')
  const [exporting, setExporting] = useState(false)

  const handleExport = async () => {
    setExporting(true)
    try {
      const response = await productsAPI.exportProducts({ format })
      const blob = response.data
      const url = window.URL.createObjectURL(new Blob([blob]))
      const a = document.createElement('a')
      a.href = url
      a.download = `products_catalog_${new Date().toISOString().slice(0, 10)}.${format === 'excel' ? 'xlsx' : 'csv'}`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      window.URL.revokeObjectURL(url)
      toast.success('Catalog exported successfully!')
      onClose()
    } catch (error) {
      console.error('Export error:', error)
      toast.error('Export failed: ' + (error.response?.data?.message || error.message || 'Please try again'))
    } finally {
      setExporting(false)
    }
  }

  return (
    <div 
      className="velqino-modal-overlay fixed inset-0 z-[1050] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm"
      onClick={onClose}
    >
      <div 
        className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
      >
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary-50 border border-primary-100 flex items-center justify-center text-primary-600">
              <Download size={20} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">Export Catalog</h2>
              <p className="text-xs text-slate-500">Download current products and inventory</p>
            </div>
          </div>
          <button 
            type="button" 
            onClick={onClose} 
            className="w-8 h-8 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 flex items-center justify-center transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
            Choose Format
          </label>

          <div className="grid grid-cols-2 gap-3">
            {/* CSV Option */}
            <button
              type="button"
              onClick={() => setFormat('csv')}
              className={`p-4 rounded-xl border-2 text-left transition-all relative ${
                format === 'csv'
                  ? 'border-primary-500 bg-primary-50/50 ring-1 ring-primary-500'
                  : 'border-slate-200 hover:border-slate-300 bg-white'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${format === 'csv' ? 'bg-primary-100 text-primary-600' : 'bg-slate-100 text-slate-500'}`}>
                  <FileText size={18} />
                </div>
                {format === 'csv' && (
                  <span className="w-5 h-5 rounded-full bg-primary-600 text-white flex items-center justify-center">
                    <Check size={12} />
                  </span>
                )}
              </div>
              <div className="text-sm font-bold text-slate-900">CSV File</div>
              <div className="text-[11px] text-slate-500 mt-0.5">Compatible with all spreadsheets & ERPs</div>
            </button>

            {/* Excel Option */}
            <button
              type="button"
              onClick={() => setFormat('excel')}
              className={`p-4 rounded-xl border-2 text-left transition-all relative ${
                format === 'excel'
                  ? 'border-primary-500 bg-primary-50/50 ring-1 ring-primary-500'
                  : 'border-slate-200 hover:border-slate-300 bg-white'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${format === 'excel' ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-100 text-slate-500'}`}>
                  <FileSpreadsheet size={18} />
                </div>
                {format === 'excel' && (
                  <span className="w-5 h-5 rounded-full bg-primary-600 text-white flex items-center justify-center">
                    <Check size={12} />
                  </span>
                )}
              </div>
              <div className="text-sm font-bold text-slate-900">Excel (.xlsx)</div>
              <div className="text-[11px] text-slate-500 mt-0.5">Formatted workbook with columns</div>
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-end gap-3">
          <button 
            type="button" 
            onClick={onClose} 
            disabled={exporting}
            className="px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-700 text-sm font-medium hover:bg-slate-50 transition-colors"
          >
            Cancel
          </button>
          <button 
            type="button" 
            onClick={handleExport}
            disabled={exporting}
            className="px-5 py-2.5 rounded-xl bg-primary-600 hover:bg-primary-700 text-white text-sm font-semibold shadow-sm flex items-center gap-2 transition-all disabled:opacity-50"
          >
            <Download size={16} />
            <span>{exporting ? 'Exporting...' : `Download ${format.toUpperCase()}`}</span>
          </button>
        </div>
      </div>
    </div>
  )
}
