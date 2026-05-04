"use client"

import React, { useState, useEffect } from 'react'
import { Clock, Calendar, CheckCircle, XCircle, Clock as ClockIcon, User, Filter, Search, ChevronLeft, ChevronRight, Eye, Download, Plus } from '../../../../utils/icons'
import '../../../../styles/Retailer/RetailerStaff/Attendance.scss'

export default function Attendance({ selectedStaff }) {
  const [mounted, setMounted] = useState(false)
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth())
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear())
  const [viewMode, setViewMode] = useState('calendar')
  const [currentPage, setCurrentPage] = useState(1)
  const [hoveredDay, setHoveredDay] = useState(null)
  const itemsPerPage = 7

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

  // Mock attendance data
  const attendanceData = {
    1: { status: 'present', checkIn: '09:00 AM', checkOut: '06:00 PM', hours: 9 },
    2: { status: 'present', checkIn: '09:15 AM', checkOut: '06:00 PM', hours: 8.75 },
    3: { status: 'absent', checkIn: null, checkOut: null, hours: 0 },
    4: { status: 'present', checkIn: '09:00 AM', checkOut: '06:00 PM', hours: 9 },
    5: { status: 'present', checkIn: '09:30 AM', checkOut: '06:30 PM', hours: 9 },
    6: { status: 'late', checkIn: '10:00 AM', checkOut: '06:30 PM', hours: 8.5 },
    7: { status: 'present', checkIn: '09:00 AM', checkOut: '06:00 PM', hours: 9 },
    8: { status: 'half-day', checkIn: '09:00 AM', checkOut: '01:00 PM', hours: 4 },
    9: { status: 'present', checkIn: '09:00 AM', checkOut: '06:00 PM', hours: 9 },
    10: { status: 'present', checkIn: '09:00 AM', checkOut: '06:00 PM', hours: 9 },
    11: { status: 'leave', checkIn: null, checkOut: null, hours: 0, leaveType: 'Sick Leave' },
    12: { status: 'present', checkIn: '09:00 AM', checkOut: '06:00 PM', hours: 9 },
    13: { status: 'present', checkIn: '09:00 AM', checkOut: '06:00 PM', hours: 9 },
    14: { status: 'late', checkIn: '09:45 AM', checkOut: '06:45 PM', hours: 9 },
    15: { status: 'present', checkIn: '09:00 AM', checkOut: '06:00 PM', hours: 9 },
  }

  const getStatusConfig = (status) => {
    switch(status) {
      case 'present':
        return { bg: 'bg-green-100', text: 'text-green-700', icon: <CheckCircle size={10} />, label: 'Present' }
      case 'absent':
        return { bg: 'bg-red-100', text: 'text-red-700', icon: <XCircle size={10} />, label: 'Absent' }
      case 'late':
        return { bg: 'bg-yellow-100', text: 'text-yellow-700', icon: <Clock size={10} />, label: 'Late' }
      case 'half-day':
        return { bg: 'bg-orange-100', text: 'text-orange-700', icon: <ClockIcon size={10} />, label: 'Half Day' }
      case 'leave':
        return { bg: 'bg-blue-100', text: 'text-blue-700', icon: <Calendar size={10} />, label: 'Leave' }
      default:
        return { bg: 'bg-gray-100', text: 'text-gray-700', icon: <Clock size={10} />, label: status }
    }
  }

  const getDaysInMonth = (year, month) => {
    return new Date(year, month + 1, 0).getDate()
  }

  const getFirstDayOfMonth = (year, month) => {
    return new Date(year, month, 1).getDay()
  }

  const daysInMonth = getDaysInMonth(selectedYear, selectedMonth)
  const firstDay = getFirstDayOfMonth(selectedYear, selectedMonth)
  
  const calendarDays = []
  for (let i = 0; i < firstDay; i++) {
    calendarDays.push(null)
  }
  for (let i = 1; i <= daysInMonth; i++) {
    calendarDays.push(i)
  }

  const summary = {
    present: Object.values(attendanceData).filter(a => a.status === 'present').length,
    absent: Object.values(attendanceData).filter(a => a.status === 'absent').length,
    late: Object.values(attendanceData).filter(a => a.status === 'late').length,
    leave: Object.values(attendanceData).filter(a => a.status === 'leave').length,
    totalHours: Object.values(attendanceData).reduce((sum, a) => sum + (a.hours || 0), 0)
  }

  const leaveRequests = [
    { id: 1, staff: 'Priya Sharma', type: 'Sick Leave', from: '2026-04-20', to: '2026-04-22', status: 'pending', reason: 'Fever' },
    { id: 2, staff: 'Amit Singh', type: 'Casual Leave', from: '2026-04-25', to: '2026-04-25', status: 'approved', reason: 'Personal work' },
  ]

  return (
    <div className="attendance bg-white rounded-xl shadow-sm border border-gray-100 h-full">
      {/* Header */}
      <div className="p-4 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock size={18} className="text-primary-500" />
            <h3 className="text-base font-semibold text-gray-900">Attendance</h3>
          </div>
          <button className="p-1.5 text-gray-400 hover:text-primary-600 rounded-lg transition-all">
            <Download size={14} />
          </button>
        </div>
        <p className="text-xs text-gray-500 mt-1">Track staff attendance and leaves</p>
      </div>

      {/* Summary Stats */}
      <div className="p-4 grid grid-cols-5 gap-2 border-b border-gray-100 bg-gray-50">
        <div className="text-center">
          <p className="text-lg font-bold text-green-600">{summary.present}</p>
          <p className="text-[9px] text-gray-500">Present</p>
        </div>
        <div className="text-center">
          <p className="text-lg font-bold text-red-600">{summary.absent}</p>
          <p className="text-[9px] text-gray-500">Absent</p>
        </div>
        <div className="text-center">
          <p className="text-lg font-bold text-yellow-600">{summary.late}</p>
          <p className="text-[9px] text-gray-500">Late</p>
        </div>
        <div className="text-center">
          <p className="text-lg font-bold text-blue-600">{summary.leave}</p>
          <p className="text-[9px] text-gray-500">Leave</p>
        </div>
        <div className="text-center">
          <p className="text-lg font-bold text-purple-600">{summary.totalHours}</p>
          <p className="text-[9px] text-gray-500">Hours</p>
        </div>
      </div>

      {/* Month Selector */}
      <div className="px-4 pt-3 pb-2 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <button
            onClick={() => setSelectedMonth(prev => prev === 0 ? 11 : prev - 1)}
            className="p-1 text-gray-400 hover:text-gray-600"
          >
            <ChevronLeft size={14} />
          </button>
          <span className="text-sm font-semibold text-gray-700">
            {months[selectedMonth]} {selectedYear}
          </span>
          <button
            onClick={() => setSelectedMonth(prev => prev === 11 ? 0 : prev + 1)}
            className="p-1 text-gray-400 hover:text-gray-600"
          >
            <ChevronRight size={14} />
          </button>
        </div>
      </div>

      {/* Calendar View */}
      <div className="p-4 max-h-[320px] overflow-y-auto custom-scroll">
        <div className="grid grid-cols-7 gap-1 mb-2">
          {days.map(day => (
            <div key={day} className="text-center text-[10px] font-medium text-gray-500 py-1">
              {day}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-1">
          {calendarDays.map((day, idx) => {
            const attendance = day ? attendanceData[day] : null
            const status = attendance?.status
            const statusConfig = status ? getStatusConfig(status) : null
            
            return (
              <div
                key={idx}
                className={`calendar-day p-2 text-center rounded-lg transition-all ${
                  day ? 'cursor-pointer hover:bg-gray-100' : ''
                } ${statusConfig?.bg || ''}`}
                onMouseEnter={() => setHoveredDay(day)}
                onMouseLeave={() => setHoveredDay(null)}
              >
                {day ? (
                  <>
                    <span className={`text-xs font-medium ${statusConfig?.text || 'text-gray-700'}`}>
                      {day}
                    </span>
                    {statusConfig && (
                      <div className="mt-1 flex justify-center">
                        {statusConfig.icon}
                      </div>
                    )}
                    {hoveredDay === day && attendance && (
                      <div className="absolute z-10 mt-1 p-2 bg-gray-900 text-white text-xs rounded-lg shadow-lg whitespace-nowrap">
                        <div>Check In: {attendance.checkIn || '-'}</div>
                        <div>Check Out: {attendance.checkOut || '-'}</div>
                        <div>Hours: {attendance.hours}</div>
                      </div>
                    )}
                  </>
                ) : (
                  <span className="text-xs text-gray-300">-</span>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* Leave Requests */}
      <div className="p-4 border-t border-gray-100 bg-gray-50 rounded-b-xl">
        <div className="flex items-center justify-between mb-2">
          <h4 className="text-xs font-semibold text-gray-700">Leave Requests</h4>
          <button className="text-[10px] text-primary-600">+ New Request</button>
        </div>
        <div className="space-y-2">
          {leaveRequests.map((request) => (
            <div key={request.id} className="flex items-center justify-between p-2 bg-white rounded-lg border border-gray-200">
              <div>
                <p className="text-xs font-medium text-gray-900">{request.staff}</p>
                <p className="text-[10px] text-gray-500">{request.type} • {request.from} to {request.to}</p>
              </div>
              <div className="flex items-center gap-2">
                <span className={`text-[9px] px-2 py-0.5 rounded-full ${
                  request.status === 'approved' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                }`}>
                  {request.status}
                </span>
                <button className="p-1 text-gray-400 hover:text-primary-600">
                  <Eye size={12} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}