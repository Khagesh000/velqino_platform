"use client"

import React, { useState, useEffect } from 'react'
import { 
  Download, Edit, FileText, FileSpreadsheet, Mail, CheckCircle, 
  AlertCircle, Calendar, RefreshCw, X, Plus, Trash2 
} from '../../../../utils/icons'
import { 
  useExportReportMutation, 
  useEmailReportMutation,
  useGetScheduledReportsQuery,
  useCreateScheduledReportMutation,
  useUpdateScheduledReportMutation,
  useDeleteScheduledReportMutation
} from '@/redux/retailer/slices/retailerReportsSlice'

export default function ExportOptions({ 
  onRefresh, 
  dateRange: propDateRange, 
  scheduledReports: propScheduledReports, 
  isLoading: propLoading 
}) {
  const [mounted, setMounted] = useState(false)
  const [selectedFormat, setSelectedFormat] = useState('excel')
  const [selectedReport, setSelectedReport] = useState('sales')
  const [emailAddress, setEmailAddress] = useState('')
  const [dateRange, setDateRange] = useState({ start: '', end: '' })
  const [isExporting, setIsExporting] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [showEmailModal, setShowEmailModal] = useState(false)
  const [showScheduleModal, setShowScheduleModal] = useState(false)
  const [editingSchedule, setEditingSchedule] = useState(null)
  const [scheduleForm, setScheduleForm] = useState({
    name: '',
    report_type: 'sales',
    frequency: 'daily',
    format_type: 'excel',
    recipients: '',
    is_active: true
  })

  // RTK Query hooks - skip fetching if propScheduledReports provided
  const [exportReport, { isLoading: exportLoading }] = useExportReportMutation()
  const [emailReport, { isLoading: emailLoading }] = useEmailReportMutation()
  const { data: scheduledReportsData, refetch: refetchScheduled } = useGetScheduledReportsQuery(undefined, {
    skip: Array.isArray(propScheduledReports) && propScheduledReports.length > 0
  })
  const [createScheduledReport, { isLoading: createLoading }] = useCreateScheduledReportMutation()
  const [updateScheduledReport, { isLoading: updateLoading }] = useUpdateScheduledReportMutation()
  const [deleteScheduledReport, { isLoading: deleteLoading }] = useDeleteScheduledReportMutation()

  const scheduledReports = propScheduledReports || scheduledReportsData?.data || []
  const isLoading = propLoading || exportLoading || emailLoading || createLoading || updateLoading || deleteLoading

  useEffect(() => {
    setMounted(true)
    const end = new Date()
    const start = new Date()
    start.setDate(start.getDate() - 30)
    setDateRange({
      start: start.toISOString().split('T')[0],
      end: end.toISOString().split('T')[0]
    })
  }, [])

  if (!mounted) return null

  const reportTypes = [
    { id: 'sales', label: 'Sales Report', icon: <FileText size={15} />, description: 'Volume, revenue & average bill' },
    { id: 'products', label: 'Product Report', icon: <FileText size={15} />, description: 'COGS, stock & margin matrix' },
    { id: 'customers', label: 'Customer Report', icon: <FileText size={15} />, description: 'Lifetime spend & order counts' },
    { id: 'tax', label: 'Tax & GST Report', icon: <FileText size={15} />, description: 'CGST, SGST & filing ledger' },
    { id: 'profit_loss', label: 'Profit & Loss', icon: <FileText size={15} />, description: 'Net profit & cost statement' },
  ]

  const exportFormats = [
    { id: 'excel', label: 'Excel / CSV', icon: <FileSpreadsheet size={18} />, color: 'emerald', description: 'Raw spreadsheet data' },
    { id: 'pdf', label: 'PDF Document', icon: <FileText size={18} />, color: 'rose', description: 'Executive print document' },
    { id: 'email', label: 'Direct Email', icon: <Mail size={18} />, color: 'primary', description: 'Dispatch via email' },
  ]

  const frequencyOptions = [
    { id: 'daily', label: 'Daily' },
    { id: 'weekly', label: 'Weekly' },
    { id: 'monthly', label: 'Monthly' },
  ]

  const handleExport = async () => {
    setIsExporting(true)
    try {
      if (selectedFormat === 'email') {
        setShowEmailModal(true)
        setIsExporting(false)
        return
      }
      
      const result = await exportReport({
        report_type: selectedReport,
        format: selectedFormat,
        start_date: dateRange.start,
        end_date: dateRange.end
      }).unwrap()
      
      if (result instanceof Blob) {
        const url = window.URL.createObjectURL(result)
        const a = document.createElement('a')
        a.href = url
        a.download = `${selectedReport}_report_${new Date().toISOString().split('T')[0]}.${selectedFormat === 'excel' ? 'xlsx' : 'pdf'}`
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
        document.body.removeChild(a)
      }
      
      setShowSuccess(true)
      setTimeout(() => setShowSuccess(false), 3000)
    } catch (error) {
      console.error('Export failed:', error)
      alert('Failed to export report. Please try again.')
    } finally {
      setIsExporting(false)
    }
  }

  const handleSendEmail = async () => {
    if (!emailAddress) return
    try {
      await emailReport({
        report_type: selectedReport,
        format: selectedFormat,
        start_date: dateRange.start,
        end_date: dateRange.end,
        email: emailAddress
      }).unwrap()
      
      setShowEmailModal(false)
      setShowSuccess(true)
      setTimeout(() => setShowSuccess(false), 3000)
      setEmailAddress('')
    } catch (error) {
      console.error('Email send failed:', error)
      alert('Failed to send report. Please try again.')
    }
  }

  const handleCreateSchedule = async () => {
    if (!scheduleForm.name || !scheduleForm.recipients) {
      alert('Please fill all required fields')
      return
    }
    
    try {
      if (editingSchedule) {
        await updateScheduledReport({
          reportId: editingSchedule.id,
          data: scheduleForm
        }).unwrap()
      } else {
        await createScheduledReport(scheduleForm).unwrap()
      }
      setShowScheduleModal(false)
      setScheduleForm({ name: '', report_type: 'sales', frequency: 'daily', format_type: 'excel', recipients: '', is_active: true })
      setEditingSchedule(null)
      refetchScheduled()
      if (onRefresh) onRefresh()
    } catch (error) {
      console.error('Schedule failed:', error)
      alert('Failed to save schedule. Please try again.')
    }
  }

  const handleDeleteSchedule = async (scheduleId) => {
    if (confirm('Are you sure you want to delete this scheduled report?')) {
      try {
        await deleteScheduledReport(scheduleId).unwrap()
        refetchScheduled()
        if (onRefresh) onRefresh()
      } catch (error) {
        console.error('Delete failed:', error)
        alert('Failed to delete schedule. Please try again.')
      }
    }
  }

  const handleEditSchedule = (schedule) => {
    setEditingSchedule(schedule)
    setScheduleForm({
      name: schedule.name,
      report_type: schedule.report_type,
      frequency: schedule.frequency,
      format_type: schedule.format_type,
      recipients: schedule.recipients,
      is_active: schedule.is_active
    })
    setShowScheduleModal(true)
  }

  return (
    <div className="bg-white rounded-2xl shadow-xs border border-gray-100 flex flex-col h-full overflow-hidden transition-all duration-200">
      {/* Header */}
      <div className="p-4 sm:p-5 border-b border-gray-100 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-teal-50 flex items-center justify-center text-teal-600">
            <Download size={18} />
          </div>
          <div>
            <h3 className="text-sm sm:text-base font-semibold text-gray-900">Export & Automation</h3>
            <p className="text-xs text-gray-400 mt-0.5">Generate downloads or schedule recurring dispatch</p>
          </div>
        </div>
        <button
          onClick={() => {
            setEditingSchedule(null)
            setScheduleForm({ name: '', report_type: 'sales', frequency: 'daily', format_type: 'excel', recipients: '', is_active: true })
            setShowScheduleModal(true)
          }}
          className="px-2.5 py-1.5 text-xs font-semibold bg-primary-500 hover:bg-primary-600 text-white rounded-xl shadow-xs transition-all flex items-center gap-1"
        >
          <Plus size={14} /> Schedule
        </button>
      </div>

      {/* Success Notification */}
      {showSuccess && (
        <div className="mx-4 mt-4 p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-2 text-emerald-800 text-xs">
          <CheckCircle size={15} className="text-emerald-600 shrink-0" />
          <span>Report dispatch processed successfully!</span>
        </div>
      )}

      {/* Body Options */}
      <div className="p-4 sm:p-5 space-y-4 flex-1 overflow-y-auto max-h-[360px]">
        {/* Report Type Selection */}
        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-2">1. Select Report Focus</label>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
            {reportTypes.map((report) => (
              <button
                key={report.id}
                onClick={() => setSelectedReport(report.id)}
                className={`p-2.5 rounded-xl border text-left transition-all ${
                  selectedReport === report.id
                    ? 'border-primary-500 bg-primary-50/60 shadow-xs'
                    : 'border-gray-200 bg-white hover:border-gray-300'
                }`}
              >
                <div className="flex items-center gap-1.5 mb-1">
                  <span className={selectedReport === report.id ? 'text-primary-600' : 'text-gray-400'}>
                    {report.icon}
                  </span>
                  <span className={`text-xs font-bold truncate ${selectedReport === report.id ? 'text-primary-950' : 'text-gray-800'}`}>
                    {report.label}
                  </span>
                </div>
                <p className="text-[10px] text-gray-400 line-clamp-1">{report.description}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Date Interval Picker */}
        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-2">2. Custom Date Range</label>
          <div className="flex flex-col sm:flex-row items-center gap-2">
            <div className="w-full relative">
              <Calendar size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="date"
                value={dateRange.start}
                onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
                className="w-full pl-8 pr-3 py-2 text-xs border border-gray-200 rounded-xl focus:outline-none focus:border-primary-500 bg-gray-50/50"
              />
            </div>
            <span className="text-xs text-gray-400">to</span>
            <div className="w-full relative">
              <Calendar size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="date"
                value={dateRange.end}
                onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
                className="w-full pl-8 pr-3 py-2 text-xs border border-gray-200 rounded-xl focus:outline-none focus:border-primary-500 bg-gray-50/50"
              />
            </div>
          </div>
        </div>

        {/* Export Format Selector */}
        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-2">3. Destination Format</label>
          <div className="grid grid-cols-3 gap-2.5">
            {exportFormats.map((format) => {
              const isSelected = selectedFormat === format.id
              return (
                <button
                  key={format.id}
                  onClick={() => setSelectedFormat(format.id)}
                  className={`p-3 rounded-xl border text-center transition-all ${
                    isSelected
                      ? 'border-primary-500 bg-primary-50/60 shadow-xs'
                      : 'border-gray-200 bg-white hover:border-gray-300'
                  }`}
                >
                  <div className={`flex justify-center mb-1 ${isSelected ? 'text-primary-600' : 'text-gray-400'}`}>
                    {format.icon}
                  </div>
                  <span className={`text-xs font-bold block ${isSelected ? 'text-primary-950' : 'text-gray-800'}`}>
                    {format.label}
                  </span>
                  <p className="text-[9px] text-gray-400 mt-0.5">{format.description}</p>
                </button>
              )
            })}
          </div>
        </div>

        {/* Download Action Button */}
        <button
          onClick={handleExport}
          disabled={isExporting || isLoading}
          className="w-full py-2.5 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-2 bg-primary-500 text-white hover:bg-primary-600 shadow-xs disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isExporting || isLoading ? (
            <>
              <RefreshCw size={14} className="animate-spin" />
              <span>Generating Report...</span>
            </>
          ) : (
            <>
              <Download size={14} />
              <span>Download / Send Report Now</span>
            </>
          )}
        </button>
      </div>

      {/* Scheduled Subscriptions Ribbon */}
      <div className="border-t border-gray-100 p-4 bg-gray-50/60">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[11px] font-bold text-gray-700 uppercase tracking-wider">Scheduled Subscriptions</span>
          <span className="text-[10px] text-gray-400">{scheduledReports.length} automated jobs</span>
        </div>
        {scheduledReports.length === 0 ? (
          <p className="text-xs text-gray-400 text-center py-2">No active automated delivery schedules.</p>
        ) : (
          <div className="space-y-1.5 max-h-24 overflow-y-auto">
            {scheduledReports.map((schedule) => (
              <div key={schedule.id} className="p-2 bg-white rounded-xl border border-gray-100 flex items-center justify-between gap-2 text-xs">
                <div className="min-w-0">
                  <p className="font-semibold text-gray-800 truncate">{schedule.name}</p>
                  <p className="text-[10px] text-gray-400 truncate">{schedule.frequency} • {schedule.recipients}</p>
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                  <button onClick={() => handleEditSchedule(schedule)} className="p-1 text-gray-400 hover:text-primary-600">
                    <Edit size={13} />
                  </button>
                  <button onClick={() => handleDeleteSchedule(schedule.id)} className="p-1 text-gray-400 hover:text-rose-600">
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Email Modal */}
      {showEmailModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-sm w-full p-5 shadow-xl border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2 text-primary-600">
                <Mail size={18} />
                <h3 className="text-sm font-bold text-gray-900">Email Report Dispatch</h3>
              </div>
              <button onClick={() => setShowEmailModal(false)} className="text-gray-400 hover:text-gray-600">
                <X size={18} />
              </button>
            </div>
            <input
              type="email"
              placeholder="store-director@example.com"
              value={emailAddress}
              onChange={(e) => setEmailAddress(e.target.value)}
              className="w-full px-3 py-2 text-xs border border-gray-200 rounded-xl focus:outline-none focus:border-primary-500 mb-4"
            />
            <div className="flex gap-2">
              <button
                onClick={() => setShowEmailModal(false)}
                className="flex-1 py-2 text-xs text-gray-600 border border-gray-200 rounded-xl hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSendEmail}
                disabled={!emailAddress}
                className="flex-1 py-2 text-xs font-bold bg-primary-500 text-white rounded-xl hover:bg-primary-600 disabled:opacity-50"
              >
                Send Now
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Schedule Modal */}
      {showScheduleModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-5 shadow-xl border border-gray-100 space-y-3.5">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-gray-900">
                {editingSchedule ? 'Edit Schedule' : 'Create Automated Delivery'}
              </h3>
              <button onClick={() => setShowScheduleModal(false)} className="text-gray-400 hover:text-gray-600">
                <X size={18} />
              </button>
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-gray-700 mb-1">Schedule Label</label>
              <input
                type="text"
                placeholder="e.g., Weekly Executive Financials"
                value={scheduleForm.name}
                onChange={(e) => setScheduleForm({ ...scheduleForm, name: e.target.value })}
                className="w-full px-3 py-2 text-xs border border-gray-200 rounded-xl focus:outline-none focus:border-primary-500"
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-[11px] font-semibold text-gray-700 mb-1">Report</label>
                <select
                  value={scheduleForm.report_type}
                  onChange={(e) => setScheduleForm({ ...scheduleForm, report_type: e.target.value })}
                  className="w-full px-2.5 py-2 text-xs border border-gray-200 rounded-xl"
                >
                  {reportTypes.map(t => <option key={t.id} value={t.id}>{t.label}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-gray-700 mb-1">Interval</label>
                <select
                  value={scheduleForm.frequency}
                  onChange={(e) => setScheduleForm({ ...scheduleForm, frequency: e.target.value })}
                  className="w-full px-2.5 py-2 text-xs border border-gray-200 rounded-xl"
                >
                  {frequencyOptions.map(f => <option key={f.id} value={f.id}>{f.label}</option>)}
                </select>
              </div>
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-gray-700 mb-1">Recipients (comma separated)</label>
              <input
                type="text"
                placeholder="auditor@firm.com, owner@shop.com"
                value={scheduleForm.recipients}
                onChange={(e) => setScheduleForm({ ...scheduleForm, recipients: e.target.value })}
                className="w-full px-3 py-2 text-xs border border-gray-200 rounded-xl focus:outline-none focus:border-primary-500"
              />
            </div>
            <div className="flex gap-2 pt-2">
              <button
                onClick={() => setShowScheduleModal(false)}
                className="flex-1 py-2 text-xs text-gray-600 border border-gray-200 rounded-xl hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateSchedule}
                className="flex-1 py-2 text-xs font-bold bg-primary-500 text-white rounded-xl hover:bg-primary-600"
              >
                Save Schedule
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}