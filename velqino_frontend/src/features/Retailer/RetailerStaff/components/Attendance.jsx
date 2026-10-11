"use client"

import React, { useState, useEffect } from 'react'
import { 
  Clock, Calendar, CheckCircle, XCircle, Clock as ClockIcon, 
  User, Filter, Search, ChevronLeft, ChevronRight, Eye, 
  Download, Plus, Sparkles 
} from '../../../../utils/icons'

export default function Attendance({ selectedStaff }) {
  const [mounted, setMounted] = useState(false)
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth())
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear())
  const [viewMode, setViewMode] = useState('calendar')
  const [hoveredDay, setHoveredDay] = useState(null)

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
        return { bg: 'bg-emerald-50 text-emerald-700 border-emerald-200', dot: 'bg-emerald-500', label: 'Present' }
      case 'absent':
        return { bg: 'bg-rose-50 text-rose-700 border-rose-200', dot: 'bg-rose-500', label: 'Absent' }
      case 'late':
        return { bg: 'bg-amber-50 text-amber-700 border-amber-200', dot: 'bg-amber-500', label: 'Late' }
      case 'half-day':
        return { bg: 'bg-orange-50 text-orange-700 border-orange-200', dot: 'bg-orange-500', label: 'Half Day' }
      case 'leave':
        return { bg: 'bg-sky-50 text-sky-700 border-sky-200', dot: 'bg-sky-500', label: 'On Leave' }
      default:
        return { bg: 'bg-gray-100 text-gray-700 border-gray-200', dot: 'bg-gray-400', label: status }
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
    <div className="bg-white rounded-3xl border border-gray-200/80 shadow-2xs h-full flex flex-col justify-between overflow-hidden">
      <div>
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-gray-100">
          <div className="flex items-center justify-between gap-3 mb-3 flex-wrap">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                <Clock size={18} />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base sm:text-lg font-extrabold text-gray-900 tracking-tight">Shift Timesheets &amp; Attendance</h3>
                  {selectedStaff && (
                    <span className="text-[11px] font-bold bg-primary-50 text-primary-700 border border-primary-100 px-2.5 py-0.5 rounded-full">
                      {selectedStaff.name}
                    </span>
                  )}
                </div>
                <p className="text-xs text-gray-500 mt-0.5">Floor clock-in logs, punctuality tracking, and leave entitlements</p>
              </div>
            </div>

            {/* Month Navigator */}
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1 bg-gray-50/80 p-1 rounded-xl border border-gray-200/60">
                <button
                  type="button"
                  onClick={() => setSelectedMonth(prev => prev === 0 ? 11 : prev - 1)}
                  className="p-1 text-gray-400 hover:text-gray-700 rounded-lg hover:bg-white"
                >
                  <ChevronLeft size={13} />
                </button>
                <span className="text-xs font-bold text-gray-700 px-2">
                  {months[selectedMonth]} {selectedYear}
                </span>
                <button
                  type="button"
                  onClick={() => setSelectedMonth(prev => prev === 11 ? 0 : prev + 1)}
                  className="p-1 text-gray-400 hover:text-gray-700 rounded-lg hover:bg-white"
                >
                  <ChevronRight size={13} />
                </button>
              </div>

              {/* View Toggle */}
              <div className="flex bg-gray-100 p-0.5 rounded-xl text-[11px] font-bold">
                <button
                  type="button"
                  onClick={() => setViewMode('calendar')}
                  className={`px-2.5 py-1 rounded-lg transition-all ${
                    viewMode === 'calendar' ? 'bg-white text-gray-900 shadow-2xs' : 'text-gray-500 hover:text-gray-900'
                  }`}
                >
                  Calendar
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode('list')}
                  className={`px-2.5 py-1 rounded-lg transition-all ${
                    viewMode === 'list' ? 'bg-white text-gray-900 shadow-2xs' : 'text-gray-500 hover:text-gray-900'
                  }`}
                >
                  Leaves
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* 4 Summary Ribbon */}
        <div className="grid grid-cols-4 gap-2.5 p-3.5 bg-gray-50/60 border-b border-gray-100 text-center">
          <div className="bg-white p-2.5 rounded-2xl border border-gray-200/60 shadow-2xs">
            <p className="text-[10px] font-bold uppercase text-emerald-700">Present Days</p>
            <p className="text-base font-extrabold text-emerald-800 mt-0.5">{summary.present} days</p>
          </div>
          <div className="bg-white p-2.5 rounded-2xl border border-gray-200/60 shadow-2xs">
            <p className="text-[10px] font-bold uppercase text-amber-600">Late Shifts</p>
            <p className="text-base font-extrabold text-amber-700 mt-0.5">{summary.late} shifts</p>
          </div>
          <div className="bg-white p-2.5 rounded-2xl border border-gray-200/60 shadow-2xs">
            <p className="text-[10px] font-bold uppercase text-rose-600">Absences</p>
            <p className="text-base font-extrabold text-rose-700 mt-0.5">{summary.absent} days</p>
          </div>
          <div className="bg-white p-2.5 rounded-2xl border border-gray-200/60 shadow-2xs">
            <p className="text-[10px] font-bold uppercase text-primary-600">Hours Logged</p>
            <p className="text-base font-extrabold text-primary-700 mt-0.5">{summary.totalHours} hrs</p>
          </div>
        </div>

        {/* View Mode: Calendar */}
        {viewMode === 'calendar' ? (
          <div className="p-4 sm:p-5 max-h-[350px] overflow-y-auto">
            {/* Days of week header */}
            <div className="grid grid-cols-7 gap-1.5 text-center text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-2">
              {days.map(d => (
                <div key={d} className="py-1">{d}</div>
              ))}
            </div>

            {/* Days Grid */}
            <div className="grid grid-cols-7 gap-1.5">
              {calendarDays.map((day, idx) => {
                if (!day) {
                  return <div key={`empty-${idx}`} className="h-11 rounded-xl bg-gray-50/40" />
                }

                const dayData = attendanceData[day]
                const status = dayData ? getStatusConfig(dayData.status) : null

                return (
                  <div
                    key={day}
                    onMouseEnter={() => setHoveredDay(day)}
                    onMouseLeave={() => setHoveredDay(null)}
                    className={`h-11 rounded-xl border p-1 flex flex-col justify-between transition-all relative ${
                      status 
                        ? `${status.bg}` 
                        : 'bg-white border-gray-100 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-extrabold text-gray-800">{day}</span>
                      {status && (
                        <span className={`w-1.5 h-1.5 rounded-full ${status.dot}`} />
                      )}
                    </div>
                    {dayData && (
                      <span className="text-[9px] font-semibold truncate leading-none">
                        {dayData.status === 'present' ? `${dayData.hours}h` : dayData.status}
                      </span>
                    )}
                  </div>
                )
              })}
            </div>

            {/* Hover details badge if day hovered */}
            {hoveredDay && attendanceData[hoveredDay] && (
              <div className="mt-3 p-3 rounded-2xl bg-gray-50 border border-gray-200/80 flex items-center justify-between text-xs animate-fadeIn">
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-gray-900">{months[selectedMonth]} {hoveredDay}</span>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${getStatusConfig(attendanceData[hoveredDay].status).bg}`}>
                    {getStatusConfig(attendanceData[hoveredDay].status).label}
                  </span>
                </div>
                {attendanceData[hoveredDay].checkIn ? (
                  <span className="text-gray-500 text-[11px]">
                    In: <strong className="text-gray-800">{attendanceData[hoveredDay].checkIn}</strong> · Out: <strong className="text-gray-800">{attendanceData[hoveredDay].checkOut}</strong> ({attendanceData[hoveredDay].hours} hrs)
                  </span>
                ) : (
                  <span className="text-gray-400 text-[11px]">No shift hours logged</span>
                )}
              </div>
            )}
          </div>
        ) : (
          /* View Mode: Leave Requests */
          <div className="p-4 sm:p-5 max-h-[350px] overflow-y-auto space-y-2.5">
            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Pending &amp; Approved Leave Applications</h4>
            {leaveRequests.map(leave => (
              <div
                key={leave.id}
                className="p-3.5 rounded-2xl border border-gray-200/80 bg-white flex items-center justify-between gap-3"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <p className="text-xs font-bold text-gray-900">{leave.staff}</p>
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-sky-50 text-sky-700 border border-sky-200">
                      {leave.type}
                    </span>
                  </div>
                  <p className="text-[11px] text-gray-500 mt-1">
                    {leave.from} to {leave.to} · Reason: {leave.reason}
                  </p>
                </div>
                <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border shrink-0 ${
                  leave.status === 'approved' 
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                    : 'bg-amber-50 text-amber-700 border-amber-200'
                }`}>
                  {leave.status === 'approved' ? 'Approved' : 'Pending Review'}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer Info */}
      <div className="p-4 border-t border-gray-100 bg-gray-50/40 text-[11px] text-gray-400 flex items-center justify-between">
        <span className="inline-flex items-center gap-1.5">
          <CheckCircle size={12} className="text-emerald-500" />
          Shift Geofencing Enabled
        </span>
        <span className="font-bold text-gray-700">9 AM Store Open</span>
      </div>
    </div>
  )
}
