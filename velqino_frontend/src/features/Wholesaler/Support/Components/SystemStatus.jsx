"use client"

import React, { useState, useEffect } from 'react'
import {
  Activity,
  CheckCircle,
  AlertCircle,
  XCircle,
  Clock,
  RefreshCw,
  Server,
  Database,
  Cloud,
  Shield,
  Bell,
  Calendar,
  ChevronRight,
  ExternalLink
} from '../../../../utils/icons'
import '../../../../styles/Wholesaler/Support/SystemStatus.scss'

export default function SystemStatus() {
  const [lastChecked, setLastChecked] = useState(new Date())
  const [refreshing, setRefreshing] = useState(false)

  const services = [
    {
      id: 'api',
      name: 'API Gateway',
      icon: Server,
      status: 'operational',
      uptime: '99.99%',
      responseTime: '120ms',
      lastIncident: 'No incidents in last 30 days'
    },
    {
      id: 'database',
      name: 'Database',
      icon: Database,
      status: 'operational',
      uptime: '99.95%',
      responseTime: '45ms',
      lastIncident: 'Mar 15, 2024 - 5 min downtime'
    },
    {
      id: 'payment',
      name: 'Payment Gateway',
      icon: Cloud,
      status: 'operational',
      uptime: '99.98%',
      responseTime: '230ms',
      lastIncident: 'No incidents in last 30 days'
    },
    {
      id: 'notifications',
      name: 'Notification Service',
      icon: Bell,
      status: 'degraded',
      uptime: '99.85%',
      responseTime: '310ms',
      lastIncident: 'Mar 20, 2024 - Delayed notifications'
    },
    {
      id: 'search',
      name: 'Search Service',
      icon: Activity,
      status: 'operational',
      uptime: '99.97%',
      responseTime: '85ms',
      lastIncident: 'No incidents in last 30 days'
    },
    {
      id: 'storage',
      name: 'File Storage',
      icon: Database,
      status: 'operational',
      uptime: '99.99%',
      responseTime: '95ms',
      lastIncident: 'No incidents in last 30 days'
    }
  ]

  const maintenanceHistory = [
    {
      id: 1,
      title: 'Scheduled Maintenance - Database Upgrade',
      status: 'completed',
      date: '2024-03-20',
      duration: '2 hours',
      impact: 'Read-only mode for 30 mins'
    },
    {
      id: 2,
      title: 'API Performance Optimization',
      status: 'completed',
      date: '2024-03-15',
      duration: '1 hour',
      impact: 'No downtime, slight latency increase'
    },
    {
      id: 3,
      title: 'Payment Gateway Integration Update',
      status: 'upcoming',
      date: '2024-03-25',
      duration: '3 hours',
      impact: 'Payment processing may be delayed'
    },
    {
      id: 4,
      title: 'Security Patch Deployment',
      status: 'in-progress',
      date: '2024-03-22',
      duration: '4 hours',
      impact: 'No expected downtime'
    }
  ]

  const incidents = [
    {
      id: 1,
      title: 'Payment Gateway Timeout',
      status: 'resolved',
      date: '2024-03-18',
      resolution: 'Fixed within 15 minutes',
      affected: 'Payment Service'
    },
    {
      id: 2,
      title: 'Delayed Email Notifications',
      status: 'monitoring',
      date: '2024-03-20',
      resolution: 'Currently investigating',
      affected: 'Notification Service'
    }
  ]

  const getStatusColor = (status) => {
    const colors = {
      operational: 'bg-success-500',
      degraded: 'bg-warning-500',
      outage: 'bg-error-500',
      maintenance: 'bg-info-500'
    }
    return colors[status] || colors.operational
  }

  const getStatusTextColor = (status) => {
    const colors = {
      operational: 'text-success-600',
      degraded: 'text-warning-600',
      outage: 'text-error-600',
      maintenance: 'text-info-600'
    }
    return colors[status] || colors.operational
  }

  const getStatusBgLight = (status) => {
    const colors = {
      operational: 'bg-success-50',
      degraded: 'bg-warning-50',
      outage: 'bg-error-50',
      maintenance: 'bg-info-50'
    }
    return colors[status] || colors.operational
  }

  const getStatusIcon = (status) => {
    switch(status) {
      case 'operational': return <CheckCircle size={16} />
      case 'degraded': return <AlertCircle size={16} />
      case 'outage': return <XCircle size={16} />
      case 'completed': return <CheckCircle size={16} />
      case 'upcoming': return <Clock size={16} />
      case 'in-progress': return <RefreshCw size={16} />
      case 'resolved': return <CheckCircle size={16} />
      case 'monitoring': return <AlertCircle size={16} />
      default: return <Activity size={16} />
    }
  }

  const handleRefresh = () => {
    setRefreshing(true)
    setTimeout(() => {
      setLastChecked(new Date())
      setRefreshing(false)
    }, 1000)
  }

  const overallStatus = services.every(s => s.status === 'operational') ? 'All Systems Operational' :
                         services.some(s => s.status === 'outage') ? 'Partial Outage Detected' :
                         'Degraded Performance'

  return (
    <div className="system-status bg-white rounded-xl border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="px-4 sm:px-6 py-4 border-b border-gray-200 bg-gray-50/50 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-primary-100 flex items-center justify-center text-primary-600">
            <Activity size={20} />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-semibold text-gray-900">System Status</h3>
            <p className="text-xs sm:text-sm text-gray-500">Monitor platform health and service availability</p>
          </div>
        </div>
        <button
          onClick={handleRefresh}
          disabled={refreshing}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-gray-200 text-gray-700 text-sm rounded-lg hover:bg-gray-50 transition-all disabled:opacity-50"
        >
          <RefreshCw size={14} className={refreshing ? 'animate-spin' : ''} />
          Refresh
        </button>
      </div>

      {/* Overall Status Banner */}
      <div className={`p-4 ${services.some(s => s.status !== 'operational') ? 'bg-warning-50' : 'bg-success-50'}`}>
        <div className="flex items-center gap-3">
          <div className={`w-3 h-3 rounded-full ${services.some(s => s.status !== 'operational') ? 'bg-warning-500 animate-pulse' : 'bg-success-500'}`}></div>
          <div>
            <p className="text-sm font-semibold text-gray-900">{overallStatus}</p>
            <p className="text-xs text-gray-500">Last checked: {lastChecked.toLocaleTimeString()}</p>
          </div>
        </div>
      </div>

      {/* Services Grid */}
      <div className="p-4 sm:p-6">
        <h4 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Server size={16} className="text-gray-500" />
          Service Status
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {services.map((service, index) => {
            const Icon = service.icon
            return (
              <div
                key={service.id}
                className={`service-card border rounded-xl p-4 transition-all ${getStatusBgLight(service.status)} border-${service.status === 'operational' ? 'success' : service.status === 'degraded' ? 'warning' : 'error'}-200`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className={`w-10 h-10 rounded-lg ${getStatusBgLight(service.status)} flex items-center justify-center ${getStatusTextColor(service.status)}`}>
                    <Icon size={20} />
                  </div>
                  <div className={`w-2 h-2 rounded-full ${getStatusColor(service.status)}`}></div>
                </div>
                <h5 className="text-sm font-semibold text-gray-900 mb-1">{service.name}</h5>
                <div className="space-y-1 text-xs">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Uptime</span>
                    <span className="font-medium text-gray-900">{service.uptime}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Response</span>
                    <span className="font-medium text-gray-900">{service.responseTime}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Status</span>
                    <span className={`capitalize font-medium ${getStatusTextColor(service.status)}`}>
                      {service.status}
                    </span>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Maintenance Updates */}
      <div className="border-t border-gray-200">
        <div className="px-4 sm:px-6 py-3 bg-gray-50/50 border-b border-gray-200">
          <h4 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
            <Calendar size={16} className="text-gray-500" />
            Maintenance Updates
          </h4>
        </div>
        <div className="p-4 space-y-3">
          {maintenanceHistory.map((update, index) => (
            <div key={update.id} className="flex items-start gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-all">
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                update.status === 'completed' ? 'bg-success-100 text-success-600' :
                update.status === 'upcoming' ? 'bg-warning-100 text-warning-600' :
                'bg-info-100 text-info-600'
              }`}>
                {getStatusIcon(update.status)}
              </div>
              <div className="flex-1">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h5 className="text-sm font-medium text-gray-900">{update.title}</h5>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${
                    update.status === 'completed' ? 'bg-success-100 text-success-700' :
                    update.status === 'upcoming' ? 'bg-warning-100 text-warning-700' :
                    'bg-info-100 text-info-700'
                  }`}>
                    {update.status}
                  </span>
                </div>
                <p className="text-xs text-gray-500 mt-1">Date: {update.date} • Duration: {update.duration}</p>
                <p className="text-xs text-gray-600 mt-1">Impact: {update.impact}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Incidents */}
      <div className="border-t border-gray-200">
        <div className="px-4 sm:px-6 py-3 bg-gray-50/50 border-b border-gray-200">
          <h4 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
            <AlertCircle size={16} className="text-gray-500" />
            Recent Incidents
          </h4>
        </div>
        <div className="p-4 space-y-3">
          {incidents.map((incident, index) => (
            <div key={incident.id} className="flex items-start gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-all">
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                incident.status === 'resolved' ? 'bg-success-100 text-success-600' :
                'bg-warning-100 text-warning-600'
              }`}>
                {getStatusIcon(incident.status)}
              </div>
              <div className="flex-1">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h5 className="text-sm font-medium text-gray-900">{incident.title}</h5>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${
                    incident.status === 'resolved' ? 'bg-success-100 text-success-700' :
                    'bg-warning-100 text-warning-700'
                  }`}>
                    {incident.status}
                  </span>
                </div>
                <p className="text-xs text-gray-500 mt-1">Date: {incident.date} • Affected: {incident.affected}</p>
                <p className="text-xs text-gray-600 mt-1">Resolution: {incident.resolution}</p>
              </div>
            </div>
          ))}
          {incidents.length === 0 && (
            <div className="text-center py-6">
              <CheckCircle size={32} className="mx-auto text-success-500 mb-2" />
              <p className="text-sm text-gray-500">No recent incidents reported</p>
            </div>
          )}
        </div>
      </div>

      {/* Subscription Section */}
      <div className="border-t border-gray-200 bg-gray-50/50 p-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Bell size={18} className="text-primary-500" />
            <span className="text-sm text-gray-700">Get status updates via email</span>
          </div>
          <div className="flex gap-2 w-full sm:w-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 sm:w-64 px-3 py-1.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-primary-500"
            />
            <button className="px-4 py-1.5 bg-primary-500 text-white text-sm rounded-lg hover:bg-primary-600 transition-all">
              Subscribe
            </button>
          </div>
        </div>
      </div>

      {/* Status Page Link */}
      <div className="border-t border-gray-200 p-4 text-center">
        <button className="text-sm text-primary-600 hover:text-primary-700 flex items-center justify-center gap-1 mx-auto">
          View full status history
          <ExternalLink size={14} />
        </button>
      </div>
    </div>
  )
}