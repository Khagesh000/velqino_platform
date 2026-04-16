"use client"

import React, { useState, useEffect } from 'react'
import { Activity, CheckCircle, ChevronRight, AlertCircle, Clock, RefreshCw, Server, Database, Cloud, Wifi, Shield, Zap, TrendingUp, Bell } from '../../../../utils/icons'
import '../../../../styles/Retailer/RetailerSupport/SystemStatus.scss'

export default function SystemStatus() {
  const [mounted, setMounted] = useState(false)
  const [lastUpdated, setLastUpdated] = useState(new Date())
  const [refreshing, setRefreshing] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  const handleRefresh = () => {
    setRefreshing(true)
    setTimeout(() => {
      setLastUpdated(new Date())
      setRefreshing(false)
    }, 1000)
  }

  const overallStatus = {
    status: 'operational',
    uptime: '99.98%',
    uptimeText: 'All systems operational',
    color: 'green'
  }

  const services = [
    { name: 'API Gateway', status: 'operational', uptime: '99.99%', latency: '45ms', icon: <Server size={16} /> },
    { name: 'Database', status: 'operational', uptime: '99.99%', latency: '12ms', icon: <Database size={16} /> },
    { name: 'Cloud Storage', status: 'operational', uptime: '99.98%', latency: '78ms', icon: <Cloud size={16} /> },
    { name: 'POS System', status: 'operational', uptime: '99.97%', latency: '34ms', icon: <Activity size={16} /> },
    { name: 'Payment Gateway', status: 'operational', uptime: '99.99%', latency: '156ms', icon: <Shield size={16} /> },
    { name: 'WebSocket', status: 'operational', uptime: '99.95%', latency: '23ms', icon: <Wifi size={16} /> },
  ]

  const incidents = [
    { id: 1, title: 'Payment Gateway Delay', status: 'resolved', date: '2026-04-10', duration: '15 minutes', severity: 'minor' },
    { id: 2, title: 'API Response Time High', status: 'resolved', date: '2026-04-05', duration: '30 minutes', severity: 'minor' },
    { id: 3, title: 'Database Backup Maintenance', status: 'completed', date: '2026-04-01', duration: '2 hours', severity: 'info' },
  ]

  const uptimeHistory = [
    { month: 'Jan', uptime: '99.99%' },
    { month: 'Feb', uptime: '99.98%' },
    { month: 'Mar', uptime: '99.99%' },
    { month: 'Apr', uptime: '99.98%' },
  ]

  const getStatusIcon = (status) => {
    switch(status) {
      case 'operational': return <CheckCircle size={14} className="text-green-500" />
      case 'degraded': return <AlertCircle size={14} className="text-yellow-500" />
      case 'outage': return <AlertCircle size={14} className="text-red-500" />
      default: return <CheckCircle size={14} className="text-green-500" />
    }
  }

  const getIncidentBadge = (status) => {
    switch(status) {
      case 'resolved': return 'bg-green-100 text-green-700'
      case 'completed': return 'bg-blue-100 text-blue-700'
      case 'investigating': return 'bg-yellow-100 text-yellow-700'
      default: return 'bg-gray-100 text-gray-700'
    }
  }

  return (
    <div className="system-status bg-white rounded-xl shadow-sm border border-gray-100">
      {/* Header */}
      <div className="p-5 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Activity size={22} className="text-primary-500" />
            <div>
              <h3 className="text-lg font-semibold text-gray-900">System Status</h3>
              <p className="text-sm text-gray-500">Platform uptime and service health</p>
            </div>
          </div>
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="p-2 text-gray-400 hover:text-primary-600 rounded-lg transition-all"
          >
            <RefreshCw size={16} className={refreshing ? 'animate-spin' : ''} />
          </button>
        </div>
      </div>

      {/* Overall Status Banner */}
      <div className={`mx-5 mt-4 p-4 rounded-xl bg-${overallStatus.color}-50 border border-${overallStatus.color}-100`}>
        <div className="flex items-center gap-3">
          <div className={`w-3 h-3 bg-${overallStatus.color}-500 rounded-full animate-pulse`} />
          <div className="flex-1">
            <h4 className={`text-sm font-semibold text-${overallStatus.color}-800`}>All Systems Operational</h4>
            <p className={`text-xs text-${overallStatus.color}-600 mt-0.5`}>All services are running normally</p>
          </div>
          <div className="text-right">
            <p className={`text-lg font-bold text-${overallStatus.color}-700`}>{overallStatus.uptime}</p>
            <p className={`text-[10px] text-${overallStatus.color}-600`}>Uptime (30 days)</p>
          </div>
        </div>
      </div>

      {/* Last Updated */}
      <div className="px-5 pt-4">
        <p className="text-[10px] text-gray-400 flex items-center gap-1">
          <Clock size={10} />
          Last updated: {lastUpdated.toLocaleTimeString()}
        </p>
      </div>

      {/* Services Grid */}
      <div className="p-5">
        <h4 className="text-sm font-semibold text-gray-900 mb-3">Service Status</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {services.map((service, idx) => (
            <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="text-gray-500">{service.icon}</div>
                <div>
                  <p className="text-sm font-medium text-gray-900">{service.name}</p>
                  <p className="text-[10px] text-gray-500">Latency: {service.latency}</p>
                </div>
              </div>
              <div className="text-right">
                <div className="flex items-center gap-1">
                  {getStatusIcon(service.status)}
                  <span className="text-xs font-medium text-gray-700 capitalize">{service.status}</span>
                </div>
                <p className="text-[10px] text-gray-400">{service.uptime} uptime</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Uptime History */}
      <div className="px-5 pb-4">
        <h4 className="text-sm font-semibold text-gray-900 mb-3">Uptime History (Last 4 Months)</h4>
        <div className="space-y-2">
          {uptimeHistory.map((item, idx) => (
            <div key={idx} className="flex items-center gap-3">
              <span className="text-xs text-gray-500 w-10">{item.month}</span>
              <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                <div className="h-full bg-green-500 rounded-full" style={{ width: '99.98%' }} />
              </div>
              <span className="text-xs font-medium text-gray-700">{item.uptime}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Incidents */}
      <div className="p-5 border-t border-gray-100 bg-gray-50 rounded-b-xl">
        <div className="flex items-center gap-2 mb-3">
          <Bell size={14} className="text-gray-500" />
          <h4 className="text-sm font-semibold text-gray-900">Recent Incidents</h4>
        </div>
        <div className="space-y-2">
          {incidents.map((incident) => (
            <div key={incident.id} className="flex items-center justify-between p-2 bg-white rounded-lg">
              <div>
                <p className="text-sm font-medium text-gray-900">{incident.title}</p>
                <p className="text-[10px] text-gray-400">{incident.date} • Duration: {incident.duration}</p>
              </div>
              <span className={`text-[10px] px-2 py-0.5 rounded-full ${getIncidentBadge(incident.status)}`}>
                {incident.status}
              </span>
            </div>
          ))}
        </div>
        <button className="mt-3 text-xs text-primary-600 hover:text-primary-700 flex items-center gap-1">
          View full history
          <ChevronRight size={12} />
        </button>
      </div>

      {/* Subscribe Section */}
      <div className="p-4 border-t border-gray-100 bg-white rounded-b-xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bell size={14} className="text-primary-500" />
            <span className="text-xs text-gray-700">Get status updates</span>
          </div>
          <button className="text-xs text-primary-600 hover:text-primary-700">Subscribe to notifications →</button>
        </div>
      </div>
    </div>
  )
}