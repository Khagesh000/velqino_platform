"use client"

import React, { useState } from 'react'
import {
  Ticket,
  Search,
  Filter,
  ChevronDown,
  ChevronRight,
  Eye,
  MessageCircle,
  CheckCircle,
  Clock,
  AlertCircle,
  XCircle,
  Download,
  RefreshCw,
  Star,
  ThumbsUp,
  ThumbsDown,
  Calendar,
  User,
  Mail,
  Paperclip,
  X
} from '../../../../utils/icons'
import '../../../../styles/Wholesaler/Support/TicketHistory.scss'

export default function TicketHistory() {
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [selectedTicket, setSelectedTicket] = useState(null)
  const [expandedTickets, setExpandedTickets] = useState([])

  const tickets = [
    {
      id: 'TKT-2024-001',
      subject: 'Unable to process order payment',
      description: 'Getting error while processing payment for order #ORD-2024-045. The payment gateway is showing timeout error.',
      category: 'payment',
      status: 'resolved',
      priority: 'high',
      createdAt: '2024-03-15T10:30:00',
      updatedAt: '2024-03-16T14:20:00',
      messages: [
        { id: 1, sender: 'user', message: 'Getting error while processing payment', time: '2024-03-15 10:30 AM' },
        { id: 2, sender: 'support', message: 'We are looking into this issue. Could you please share the error screenshot?', time: '2024-03-15 11:45 AM' },
        { id: 3, sender: 'user', message: 'Here is the screenshot showing the timeout error', time: '2024-03-15 02:15 PM' },
        { id: 4, sender: 'support', message: 'Thank you. The issue has been fixed. Please try again.', time: '2024-03-16 02:20 PM' }
      ],
      resolution: 'Payment gateway timeout issue resolved. Updated payment API configuration.'
    },
    {
      id: 'TKT-2024-002',
      subject: 'Payout delay inquiry',
      description: 'My payout for February has not been processed yet. Expected date was March 5th.',
      category: 'payout',
      status: 'in-progress',
      priority: 'medium',
      createdAt: '2024-03-10T09:15:00',
      updatedAt: '2024-03-18T11:30:00',
      messages: [
        { id: 1, sender: 'user', message: 'Payout for February not received', time: '2024-03-10 09:15 AM' },
        { id: 2, sender: 'support', message: 'We are checking your payout status. Will update shortly.', time: '2024-03-11 10:20 AM' }
      ],
      resolution: ''
    },
    {
      id: 'TKT-2024-003',
      subject: 'Product listing approval delay',
      description: 'Products added 3 days ago are still pending approval. Please review.',
      category: 'product',
      status: 'pending',
      priority: 'low',
      createdAt: '2024-03-18T08:00:00',
      updatedAt: '2024-03-18T08:00:00',
      messages: [],
      resolution: ''
    },
    {
      id: 'TKT-2024-004',
      subject: 'Wrong tax calculation on invoice',
      description: 'Invoice #INV-2024-089 shows incorrect GST calculation. Should be 18% but showing 28%.',
      category: 'tax',
      status: 'resolved',
      priority: 'high',
      createdAt: '2024-03-05T14:20:00',
      updatedAt: '2024-03-07T16:45:00',
      messages: [
        { id: 1, sender: 'user', message: 'Tax calculation error on invoice', time: '2024-03-05 02:20 PM' },
        { id: 2, sender: 'support', message: 'We have identified the issue. Corrected invoice will be sent shortly.', time: '2024-03-06 11:30 AM' },
        { id: 3, sender: 'support', message: 'Corrected invoice has been generated and emailed to you.', time: '2024-03-07 04:45 PM' }
      ],
      resolution: 'Tax rate corrected to 18%. New invoice generated and sent.'
    },
    {
      id: 'TKT-2024-005',
      subject: 'Unable to access seller dashboard',
      description: 'Getting 404 error when accessing the seller dashboard. Works fine on mobile though.',
      category: 'technical',
      status: 'resolved',
      priority: 'medium',
      createdAt: '2024-03-12T11:45:00',
      updatedAt: '2024-03-13T09:30:00',
      messages: [
        { id: 1, sender: 'user', message: 'Dashboard not loading on desktop', time: '2024-03-12 11:45 AM' },
        { id: 2, sender: 'support', message: 'Please clear your browser cache and try again.', time: '2024-03-12 02:30 PM' },
        { id: 3, sender: 'user', message: 'Working now! Thank you.', time: '2024-03-13 09:30 AM' }
      ],
      resolution: 'Cache issue resolved after clearing browser cache.'
    },
    {
      id: 'TKT-2024-006',
      subject: 'Bulk product import error',
      description: 'CSV import fails with validation errors even though format seems correct.',
      category: 'product',
      status: 'in-progress',
      priority: 'high',
      createdAt: '2024-03-17T13:20:00',
      updatedAt: '2024-03-18T10:15:00',
      messages: [
        { id: 1, sender: 'user', message: 'CSV import failing with validation errors', time: '2024-03-17 01:20 PM' },
        { id: 2, sender: 'support', message: 'We are analyzing your CSV file. Will update soon.', time: '2024-03-18 10:15 AM' }
      ],
      resolution: ''
    }
  ]

  const getStatusBadge = (status) => {
    const styles = {
      resolved: 'bg-success-100 text-success-700',
      'in-progress': 'bg-info-100 text-info-700',
      pending: 'bg-warning-100 text-warning-700',
      closed: 'bg-gray-100 text-gray-700'
    }
    return styles[status] || styles.pending
  }

  const getStatusIcon = (status) => {
    switch(status) {
      case 'resolved': return <CheckCircle size={14} />
      case 'in-progress': return <RefreshCw size={14} />
      case 'pending': return <Clock size={14} />
      default: return <AlertCircle size={14} />
    }
  }

  const getPriorityBadge = (priority) => {
    const styles = {
      high: 'bg-error-100 text-error-700',
      medium: 'bg-warning-100 text-warning-700',
      low: 'bg-gray-100 text-gray-700'
    }
    return styles[priority] || styles.medium
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  }

  const formatDateTime = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
  }

  const toggleExpand = (ticketId) => {
    if (expandedTickets.includes(ticketId)) {
      setExpandedTickets(expandedTickets.filter(id => id !== ticketId))
    } else {
      setExpandedTickets([...expandedTickets, ticketId])
    }
  }

  const filteredTickets = tickets.filter(ticket => {
    const matchesSearch = ticket.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          ticket.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          ticket.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === 'all' || ticket.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const stats = {
    total: tickets.length,
    resolved: tickets.filter(t => t.status === 'resolved').length,
    inProgress: tickets.filter(t => t.status === 'in-progress').length,
    pending: tickets.filter(t => t.status === 'pending').length
  }

  return (
    <div className="ticket-history bg-white rounded-xl border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="px-4 sm:px-6 py-4 border-b border-gray-200 bg-gray-50/50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-primary-100 flex items-center justify-center text-primary-600">
            <Ticket size={20} />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-semibold text-gray-900">Ticket History</h3>
            <p className="text-xs sm:text-sm text-gray-500">Track and manage your support tickets</p>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 border-b border-gray-200">
        <div className="bg-gray-50 rounded-lg p-3 text-center">
          <p className="text-xs text-gray-500">Total Tickets</p>
          <p className="text-xl font-bold text-gray-900">{stats.total}</p>
        </div>
        <div className="bg-gray-50 rounded-lg p-3 text-center">
          <p className="text-xs text-gray-500">Resolved</p>
          <p className="text-xl font-bold text-success-600">{stats.resolved}</p>
        </div>
        <div className="bg-gray-50 rounded-lg p-3 text-center">
          <p className="text-xs text-gray-500">In Progress</p>
          <p className="text-xl font-bold text-info-600">{stats.inProgress}</p>
        </div>
        <div className="bg-gray-50 rounded-lg p-3 text-center">
          <p className="text-xs text-gray-500">Pending</p>
          <p className="text-xl font-bold text-warning-600">{stats.pending}</p>
        </div>
      </div>

      {/* Search & Filter */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1 relative">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by ticket ID, subject, or description..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-primary-500"
            />
          </div>
          <div className="relative">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-primary-500 appearance-none pr-8"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="in-progress">In Progress</option>
              <option value="resolved">Resolved</option>
            </select>
            <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Tickets List */}
      <div className="divide-y divide-gray-200">
        {filteredTickets.map((ticket, index) => (
          <div
            key={ticket.id}
            className="ticket-item hover:bg-gray-50 transition-all"
            style={{ animationDelay: `${index * 0.05}s` }}
          >
            <div className="p-4 cursor-pointer" onClick={() => toggleExpand(ticket.id)}>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    ticket.status === 'resolved' ? 'bg-success-100' :
                    ticket.status === 'in-progress' ? 'bg-info-100' : 'bg-warning-100'
                  }`}>
                    {getStatusIcon(ticket.status)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <span className="text-sm font-semibold text-gray-900">{ticket.id}</span>
                      <span className={`px-2 py-0.5 text-xs rounded-full ${getStatusBadge(ticket.status)}`}>
                        {ticket.status}
                      </span>
                      <span className={`px-2 py-0.5 text-xs rounded-full ${getPriorityBadge(ticket.priority)}`}>
                        {ticket.priority}
                      </span>
                    </div>
                    <h4 className="text-sm font-medium text-gray-900 mb-1">{ticket.subject}</h4>
                    <p className="text-xs text-gray-500 line-clamp-1">{ticket.description}</p>
                    <div className="flex items-center gap-3 mt-2 text-xs text-gray-400">
                      <span className="flex items-center gap-1">
                        <Calendar size={12} />
                        {formatDate(ticket.createdAt)}
                      </span>
                      <span className="flex items-center gap-1">
                        <MessageCircle size={12} />
                        {ticket.messages.length} messages
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <ChevronRight size={18} className={`text-gray-400 transition-transform ${expandedTickets.includes(ticket.id) ? 'rotate-90' : ''}`} />
                </div>
              </div>
            </div>

            {/* Expanded Content */}
            {expandedTickets.includes(ticket.id) && (
              <div className="px-4 pb-4 border-t border-gray-100 bg-gray-50/30">
                <div className="pt-4 space-y-4">
                  {/* Messages */}
                  {ticket.messages.length > 0 && (
                    <div className="space-y-3">
                      <h5 className="text-xs font-semibold text-gray-700">Conversation</h5>
                      <div className="space-y-2">
                        {ticket.messages.map(msg => (
                          <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                            <div className={`max-w-[80%] rounded-lg p-3 ${
                              msg.sender === 'user' 
                                ? 'bg-primary-500 text-white' 
                                : 'bg-white border border-gray-200 text-gray-700'
                            }`}>
                              <p className="text-sm">{msg.message}</p>
                              <p className={`text-xs mt-1 ${msg.sender === 'user' ? 'text-white/70' : 'text-gray-400'}`}>
                                {msg.time}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Resolution */}
                  {ticket.resolution && (
                    <div className="bg-success-50 rounded-lg p-3">
                      <div className="flex items-start gap-2">
                        <CheckCircle size={16} className="text-success-600 mt-0.5" />
                        <div>
                          <p className="text-xs font-semibold text-success-700">Resolution</p>
                          <p className="text-sm text-success-600">{ticket.resolution}</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Reply Button */}
                  {ticket.status !== 'resolved' && (
                    <button className="w-full py-2 bg-primary-500 text-white text-sm rounded-lg hover:bg-primary-600 transition-all flex items-center justify-center gap-2">
                      <MessageCircle size={14} />
                      Reply to Ticket
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        ))}

        {filteredTickets.length === 0 && (
          <div className="text-center py-12">
            <Ticket size={48} className="mx-auto text-gray-300 mb-3" />
            <p className="text-sm text-gray-500">No tickets found</p>
            <p className="text-xs text-gray-400 mt-1">Try adjusting your search or filter</p>
          </div>
        )}
      </div>

      {/* Ticket Details Modal */}
      {selectedTicket && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setSelectedTicket(null)} />
          <div className="relative bg-white rounded-xl max-w-2xl w-full max-h-[80vh] overflow-y-auto p-6 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">{selectedTicket.id}</h3>
              <button onClick={() => setSelectedTicket(null)} className="p-1 text-gray-400 hover:text-gray-600">
                <X size={20} />
              </button>
            </div>
            <p className="text-sm text-gray-600 mb-4">{selectedTicket.subject}</p>
            <div className="space-y-3">
              {selectedTicket.messages?.map(msg => (
                <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] rounded-lg p-3 ${
                    msg.sender === 'user' ? 'bg-primary-500 text-white' : 'bg-gray-100 text-gray-700'
                  }`}>
                    <p className="text-sm">{msg.message}</p>
                    <p className={`text-xs mt-1 ${msg.sender === 'user' ? 'text-white/70' : 'text-gray-500'}`}>
                      {msg.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}