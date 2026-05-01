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
  X,
  Send
} from '../../../../utils/icons'
import { 
  useGetUserTicketsQuery, 
  useGetTicketDetailQuery,
  useGetTicketRepliesQuery,
  useReplyToTicketMutation,
  useCloseTicketMutation 
} from '@/redux/wholesaler/slices/supportSlice'
import { toast } from 'react-toastify'
import '../../../../styles/Wholesaler/Support/TicketHistory.scss'

export default function TicketHistory({ isActive = false }) {
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [selectedTicket, setSelectedTicket] = useState(null)
  const [replyMessage, setReplyMessage] = useState('')
  const [isReplying, setIsReplying] = useState(false)

  // Fetch tickets from API
  const { 
    data: ticketsData, 
    isLoading: ticketsLoading, 
    refetch: refetchTickets 
  } = useGetUserTicketsQuery({
    status: statusFilter !== 'all' ? statusFilter : undefined,
    search: searchQuery || undefined,
    per_page: 20
  }, {
    skip: !isActive
  })

  const [replyToTicket, { isLoading: isReplyingLoading }] = useReplyToTicketMutation()
  const [closeTicket, { isLoading: isClosing }] = useCloseTicketMutation()

  // Get selected ticket details
  const { data: ticketDetailData, refetch: refetchDetail } = useGetTicketDetailQuery(selectedTicket, {
    skip: !selectedTicket
  })

  // Get ticket replies
  const { data: repliesData, refetch: refetchReplies } = useGetTicketRepliesQuery(selectedTicket, {
    skip: !selectedTicket
  })

  const tickets = ticketsData?.data || []
  const pagination = ticketsData?.pagination || { total: 0, page: 1, per_page: 20, total_pages: 1 }
  const ticketDetail = ticketDetailData?.data
  const replies = repliesData?.data || []

  const filteredTickets = tickets.filter(ticket => {
    const matchesSearch = !searchQuery || 
        ticket.subject?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ticket.ticket_id?.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === 'all' || ticket.status === statusFilter
    return matchesSearch && matchesStatus
})

  const getStatusBadge = (status) => {
    const styles = {
      resolved: 'bg-success-100 text-success-700',
      'in_progress': 'bg-info-100 text-info-700',
      open: 'bg-warning-100 text-warning-700',
      closed: 'bg-gray-100 text-gray-700'
    }
    return styles[status] || styles.open
  }

  const getStatusIcon = (status) => {
    switch(status) {
      case 'resolved': return <CheckCircle size={14} />
      case 'in_progress': return <RefreshCw size={14} />
      case 'open': return <Clock size={14} />
      default: return <AlertCircle size={14} />
    }
  }

  const getPriorityBadge = (priority) => {
    const styles = {
      urgent: 'bg-red-100 text-red-700',
      high: 'bg-error-100 text-error-700',
      medium: 'bg-warning-100 text-warning-700',
      low: 'bg-gray-100 text-gray-700'
    }
    return styles[priority] || styles.medium
  }

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A'
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  }

  const formatDateTime = (dateString) => {
    if (!dateString) return 'N/A'
    const date = new Date(dateString)
    return date.toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
  }

  const handleViewTicket = (ticketId) => {
    setSelectedTicket(ticketId)
  }

  const handleCloseTicket = async (ticketId) => {
    if (window.confirm('Are you sure you want to close this ticket?')) {
      try {
        await closeTicket(ticketId).unwrap()
        toast.success('Ticket closed successfully')
        refetchTickets()
        setSelectedTicket(null)
      } catch (error) {
        toast.error(error?.data?.message || 'Failed to close ticket')
      }
    }
  }

  const handleReplySubmit = async () => {
    if (!replyMessage.trim()) {
      toast.error('Please enter a reply message')
      return
    }

    setIsReplying(true)
    try {
      await replyToTicket({ ticketId: selectedTicket, message: replyMessage }).unwrap()
      toast.success('Reply sent successfully')
      setReplyMessage('')
      refetchReplies()
      refetchDetail()
      refetchTickets()
    } catch (error) {
      toast.error(error?.data?.message || 'Failed to send reply')
    } finally {
      setIsReplying(false)
    }
  }

  const stats = {
    total: pagination.total || 0,
    resolved: tickets.filter(t => t.status === 'resolved').length,
    inProgress: tickets.filter(t => t.status === 'in_progress').length,
    open: tickets.filter(t => t.status === 'open').length
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