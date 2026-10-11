"use client"

import React, { useState, useEffect } from 'react'
import { 
  Activity, 
  CheckCircle, 
  ChevronRight, 
  AlertCircle, 
  Clock, 
  RefreshCw, 
  Server, 
  Database, 
  Cloud, 
  Wifi, 
  Shield, 
  Zap, 
  TrendingUp, 
  Bell,
  Sparkles,
  ShieldCheck
} from '../../../../utils/icons'

export default function SystemStatus() {
  const [mounted, setMounted] = useState(false)
  const [lastUpdated, setLastUpdated] = useState(new Date())
  const [refreshing, setRefreshing] = useState(false)
  const [isSubscribed, setIsSubscribed] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  const handleRefresh = () => {
    setRefreshing(true)
    setTimeout(() => {
      setLastUpdated(new Date())
      setRefreshing(false)
    }, 800)
  }

  const overallStatus = {
    status: 'operational',
    uptime: '99.98%',
    uptimeText: 'All systems operational',
  }

  const services = [
    { name: 'API Gateway & GraphQL', status: 'operational', uptime: '99.99%', latency: '45ms', icon: <Server size={18} /> },
    { name: 'Primary Relational Database', status: 'operational', uptime: '99.99%', latency: '12ms', icon: <Database size={18} /> },
    { name: 'Encrypted Cloud Vault Storage', status: 'operational', uptime: '99.98%', latency: '78ms', icon: <Cloud size={18} /> },
    { name: 'POS Real-Time Billing Engine', status: 'operational', uptime: '99.97%', latency: '34ms', icon: <Activity size={18} /> },
    { name: 'UPI & Payment Gateway Bridge', status: 'operational', uptime: '99.99%', latency: '156ms', icon: <Shield size={18} /> },
    { name: 'WebSocket Counter Telemetry', status: 'operational', uptime: '99.95%', latency: '23ms', icon: <Wifi size={18} /> },
  ]

  const incidents = [
    { id: 1, title: 'Payment Gateway Bank Webhook Delay', status: 'resolved', date: '2026-04-10', duration: '15 minutes', severity: 'minor' },
    { id: 2, title: 'Scheduled Database Replica Maintenance', status: 'completed', date: '2026-04-05', duration: '30 minutes', severity: 'scheduled' },
    { id: 3, title: 'Daily Cloud Snapshot Backup Sync', status: 'completed', date: '2026-04-01', duration: '2 hours', severity: 'info' },
  ]

  const uptimeHistory = [
    { month: 'January', uptime: '99.99%', width: '99.99%' },
    { month: 'February', uptime: '99.98%', width: '99.98%' },
    { month: 'March', uptime: '99.99%', width: '99.99%' },
    { month: 'April (MTD)', uptime: '99.98%', width: '99.98%' },
  ]

  const getIncidentBadge = (status) => {
    switch(status) {
      case 'resolved': return 'bg-emerald-50 text-emerald-700 border-emerald-200'
      case 'completed': return 'bg-blue-50 text-blue-700 border-blue-200'
      case 'investigating': return 'bg-amber-50 text-amber-700 border-amber-200'
      default: return 'bg-gray-100 text-gray-700 border-gray-200'
    }
  }

  return (
    <div className="bg-white rounded-3xl border border-gray-200/80 shadow-2xs overflow-hidden transition-all duration-300">
      {/* Header */}
      <div className="p-5 sm:p-6 border-b border-gray-100 bg-gradient-to-r from-gray-50/60 via-white to-gray-50/30">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 shadow-2xs shrink-0">
              <Activity size={20} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-extrabold text-gray-900 tracking-tight">Platform Telemetry &amp; System Health</h3>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Live Uptime 99.98%
                </span>
              </div>
              <p className="text-xs text-gray-500 mt-0.5">Real-time status of APIs, billing servers, databases, and payment processors</p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            <button
              type="button"
              onClick={handleRefresh}
              disabled={refreshing}
              className="px-3.5 py-2 text-xs font-bold text-gray-700 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 active:scale-95 transition-all shadow-2xs flex items-center gap-1.5"
            >
              <RefreshCw size={13} className={refreshing ? 'animate-spin text-primary-600' : 'text-gray-500'} />
              <span>{refreshing ? 'Checking...' : 'Refresh Telemetry'}</span>
            </button>
          </div>
        </div>
      </div>

      <div className="p-5 sm:p-6 space-y-6">
        {/* Overall Status Banner */}
        <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-emerald-50/90 via-emerald-50/40 to-white border border-emerald-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-emerald-500 text-white flex items-center justify-center shadow-xs shrink-0">
              <ShieldCheck size={22} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="text-sm sm:text-base font-extrabold text-emerald-950">All Core Services Fully Operational</h4>
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping inline-block" />
              </div>
              <p className="text-xs text-emerald-700 mt-0.5">
                Zero service disruptions across all merchant clusters. Last telemetry ping checked at {lastUpdated.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}.
              </p>
            </div>
          </div>

          <div className="text-left sm:text-right shrink-0 border-t sm:border-t-0 pt-2 sm:pt-0 border-emerald-100">
            <p className="text-xl sm:text-2xl font-black text-emerald-800 tracking-tight">{overallStatus.uptime}</p>
            <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider">Rolling 30-Day SLA</p>
          </div>
        </div>

        {/* Services Status Grid */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Server size={16} className="text-primary-600" />
            <h4 className="text-xs sm:text-sm font-extrabold text-gray-900">Cluster Services &amp; Network Nodes</h4>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {services.map((service, idx) => (
              <div 
                key={idx} 
                className="p-4 bg-gray-50/70 border border-gray-200/80 rounded-2xl hover:border-emerald-300 hover:bg-emerald-50/20 transition-all flex items-center justify-between gap-3"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-white border border-gray-200/70 text-gray-700 flex items-center justify-center shrink-0 shadow-2xs">
                    {service.icon}
                  </div>
                  <div>
                    <p className="text-xs sm:text-sm font-bold text-gray-900">{service.name}</p>
                    <p className="text-[11px] text-gray-400 mt-0.5">
                      Latency: <span className="font-semibold text-gray-600 font-mono">{service.latency}</span>
                    </p>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                    <CheckCircle size={10} /> Operational
                  </span>
                  <p className="text-[10px] text-gray-400 font-semibold mt-1">{service.uptime} uptime</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Uptime History Progress */}
        <div className="p-4 sm:p-5 bg-gray-50/60 rounded-2xl border border-gray-200/80 space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-xs sm:text-sm font-extrabold text-gray-900">Historical System Reliability (Last 4 Months)</h4>
            <span className="text-[11px] font-bold text-emerald-600">Global Average: 99.985%</span>
          </div>

          <div className="space-y-2.5">
            {uptimeHistory.map((item, idx) => (
              <div key={idx} className="flex items-center gap-3 text-xs">
                <span className="text-gray-600 font-semibold w-24 shrink-0">{item.month}</span>
                <div className="flex-1 h-2.5 bg-gray-200/80 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500 rounded-full transition-all duration-500" style={{ width: item.width }} />
                </div>
                <span className="font-mono font-bold text-gray-800 w-14 text-right shrink-0">{item.uptime}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Incidents Log */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Clock size={16} className="text-primary-600" />
            <h4 className="text-xs sm:text-sm font-extrabold text-gray-900">Incident &amp; Maintenance Log</h4>
          </div>

          <div className="space-y-2.5">
            {incidents.map((incident) => (
              <div 
                key={incident.id} 
                className="p-3.5 bg-white border border-gray-200/80 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 hover:shadow-2xs transition-all"
              >
                <div>
                  <p className="text-xs sm:text-sm font-bold text-gray-900">{incident.title}</p>
                  <p className="text-[11px] text-gray-400 mt-0.5">
                    {incident.date} • Duration: {incident.duration}
                  </p>
                </div>
                <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2.5 py-0.5 rounded-full border self-start sm:self-auto capitalize ${getIncidentBadge(incident.status)}`}>
                  <CheckCircle size={10} /> {incident.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Subscribe for Alerts Banner */}
        <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-primary-50/70 to-indigo-50/50 border border-primary-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-primary-600 text-white flex items-center justify-center shrink-0 shadow-2xs">
              <Bell size={16} />
            </div>
            <div>
              <h5 className="text-xs sm:text-sm font-bold text-gray-900">Emergency Maintenance SMS &amp; Email Dispatch</h5>
              <p className="text-xs text-gray-500 mt-0.5">Receive immediate notifications regarding scheduled cloud patches and banking gateway alerts.</p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setIsSubscribed(!isSubscribed)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 self-start sm:self-auto shadow-xs ${
              isSubscribed
                ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                : 'bg-primary-600 text-white hover:bg-primary-700'
            }`}
          >
            {isSubscribed ? '✓ Subscribed to Alerts' : 'Subscribe to Alerts'}
          </button>
        </div>
      </div>
    </div>
  )
}
