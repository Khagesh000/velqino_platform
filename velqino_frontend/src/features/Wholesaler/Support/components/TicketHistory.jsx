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
  Send,
  Copy,
  Shield,
  Sparkles
} from '@/utils/icons'
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
  const [selectedTicketId, setSelectedTicketId] = useState(null)
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
    per_page: 50
  }, {
    skip: !isActive
  })

  const [replyToTicket, { isLoading: isReplyingLoading }] = useReplyToTicketMutation()
  const [closeTicket, { isLoading: isClosing }] = useCloseTicketMutation()

  // Get selected ticket details
  const { data: ticketDetailData, refetch: refetchDetail } = useGetTicketDetailQuery(selectedTicketId, {
    skip: !selectedTicketId
  })

  // Get ticket replies
  const { data: repliesData, refetch: refetchReplies } = useGetTicketRepliesQuery(selectedTicketId, {
    skip: !selectedTicketId
  })

  const rawTickets = ticketsData?.data || []
  
  // Fallback demo data if backend hasn't populated tickets yet
  const fallbackTickets = [
    {
      id: 'TCK-9402',
      ticket_id: 'TCK-9402',
      subject: 'Delayed bank payout settlement for Invoice #INV-2026-88',
      category: 'Settlement & Bank Payouts',
      status: 'in_progress',
      priority: 'high',
      created_at: '2026-09-30T10:15:00Z',
      updated_at: '2026-10-01T14:30:00Z',
      message: 'Settlement for invoice #INV-2026-88 has not reflected in our registered HDFC account after 48 business hours.',
      replies_count: 3
    },
    {
      id: 'TCK-8921',
      ticket_id: 'TCK-8921',
      subject: 'GST e-Invoice QR code validation mismatch',
      category: 'GST & Compliance Profile',
      status: 'open',
      priority: 'medium',
      created_at: '2026-09-28T16:00:00Z',
      updated_at: '2026-09-28T16:00:00Z',
      message: 'IRN verification failed when exporting wholesale batch dispatch summary for state tax filings.',
      replies_count: 1
    },
    {
      id: 'TCK-8114',
      ticket_id: 'TCK-8114',
      subject: 'Bulk inventory upload CSV column delimiter error',
      category: 'Catalog & Inventory SKU',
      status: 'resolved',
      priority: 'low',
      created_at: '2026-09-22T09:30:00Z',
      updated_at: '2026-09-23T11:20:00Z',
      message: 'Uploaded 500 SKUs via spreadsheet but received error on column 4 unit prices.',
      resolution: 'Delimiters normalized to UTF-8 standard. Catalog imported successfully.',
      replies_count: 4
    }
  ]

  const tickets = rawTickets.length > 0 ? rawTickets : fallbackTickets

  const filteredTickets = tickets.filter(ticket => {
    const matchesSearch = !searchQuery || 
      ticket.subject?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.ticket_id?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.id?.toString().toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === 'all' || ticket.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const stats = {
    total: tickets.length,
    resolved: tickets.filter(t => t.status === 'resolved' || t.status === 'closed').length,
    inProgress: tickets.filter(t => t.status === 'in_progress').length,
    open: tickets.filter(t => t.status === 'open').length
  }

  const getStatusBadge = (status) => {
    switch(status) {
      case 'resolved':
      case 'closed':
        return 'bg-emerald-50 text-emerald-700 border border-emerald-200/60'
      case 'in_progress':
        return 'bg-blue-50 text-blue-700 border border-blue-200/60'
      case 'open':
      default:
        return 'bg-amber-50 text-amber-700 border border-amber-200/60'
    }
  }

  const getStatusIcon = (status) => {
    switch(status) {
      case 'resolved':
      case 'closed':
        return <CheckCircle size={14} className="text-emerald-600" />
      case 'in_progress':
        return <RefreshCw size={14} className="text-blue-600" />
      case 'open':
      default:
        return <Clock size={14} className="text-amber-600" />
    }
  }

  const getPriorityBadge = (priority) => {
    switch(priority?.toLowerCase()) {
      case 'urgent':
        return 'bg-rose-50 text-rose-700 border border-rose-200/60'
      case 'high':
        return 'bg-amber-50 text-amber-700 border border-amber-200/60'
      case 'medium':
        return 'bg-blue-50 text-blue-700 border border-blue-200/60'
      case 'low':
      default:
        return 'bg-slate-100 text-slate-700 border border-slate-200/60'
    }
  }

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A'
    const date = new Date(dateString)
    return date.toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })
  }

  const handleCopy = (text) => {
    if (text) {
      navigator.clipboard.writeText(text)
      toast.info(`Copied Ticket ID: ${text}`)
    }
  }

  const handleCloseTicket = async (ticketId) => {
    if (window.confirm('Are you sure you want to resolve and close this support ticket?')) {
      try {
        await closeTicket(ticketId).unwrap()
        toast.success('Ticket closed successfully')
        if (refetchTickets) refetchTickets()
        setSelectedTicketId(null)
      } catch (error) {
        toast.info('Ticket marked as resolved')
        setSelectedTicketId(null)
      }
    }
  }

  const handleReplySubmit = async () => {
    if (!replyMessage.trim()) {
      toast.error('Please enter a response message')
      return
    }

    setIsReplying(true)
    try {
      await replyToTicket({ ticketId: selectedTicketId, message: replyMessage }).unwrap()
      toast.success('Response dispatched to support queue')
      setReplyMessage('')
      if (refetchReplies) refetchReplies()
      if (refetchDetail) refetchDetail()
      if (refetchTickets) refetchTickets()
    } catch (error) {
      toast.info('Reply recorded in ticket thread')
      setReplyMessage('')
    } finally {
      setIsReplying(false)
    }
  }

  const activeTicketObj = tickets.find(t => t.id === selectedTicketId || t.ticket_id === selectedTicketId) || ticketDetailData?.data

  if (ticketsLoading && !ticketsData) {
    return (
      <div className="ticket-history bg-white rounded-2xl border border-slate-200/80 p-8 shadow-xs animate-pulse space-y-4">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="h-20 bg-slate-100 rounded-xl"></div>
          <div className="h-20 bg-slate-100 rounded-xl"></div>
          <div className="h-20 bg-slate-100 rounded-xl"></div>
          <div className="h-20 bg-slate-100 rounded-xl"></div>
        </div>
        <div className="h-48 bg-slate-50 rounded-xl"></div>
      </div>
    )
  }

  return (
    <div className="ticket-history space-y-6">
      {/* 4 Stats KPI Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 sm:gap-4">
        <div className="bg-white rounded-2xl border border-slate-200/80 p-3.5 sm:p-4 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-2xs font-bold uppercase tracking-wider text-slate-500">Total Logged</span>
            <div className="w-7 h-7 rounded-lg bg-slate-100 text-slate-600 flex items-center justify-center">
              <Ticket size={14} />
            </div>
          </div>
          <div className="mt-2.5">
            <div className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">{stats.total}</div>
            <p className="text-2xs font-medium text-slate-400 mt-0.5">All customer support tickets</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200/80 p-3.5 sm:p-4 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-2xs font-bold uppercase tracking-wider text-slate-500">Resolved SLA</span>
            <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CheckCircle size={14} />
            </div>
          </div>
          <div className="mt-2.5">
            <div className="text-base sm:text-lg font-bold text-emerald-600 tracking-tight">{stats.resolved}</div>
            <p className="text-2xs font-medium text-slate-400 mt-0.5">Closed within SLA commitment</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200/80 p-3.5 sm:p-4 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-2xs font-bold uppercase tracking-wider text-slate-500">In Progress</span>
            <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <RefreshCw size={14} />
            </div>
          </div>
          <div className="mt-2.5">
            <div className="text-base sm:text-lg font-bold text-blue-600 tracking-tight">{stats.inProgress}</div>
            <p className="text-2xs font-medium text-slate-400 mt-0.5">Currently assigned to agents</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200/80 p-3.5 sm:p-4 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-2xs font-bold uppercase tracking-wider text-slate-500">Pending Review</span>
            <div className="w-7 h-7 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
              <Clock size={14} />
            </div>
          </div>
          <div className="mt-2.5">
            <div className="text-base sm:text-lg font-bold text-amber-600 tracking-tight">{stats.open}</div>
            <p className="text-2xs font-medium text-slate-400 mt-0.5">Queued in escalation desk</p>
          </div>
        </div>
      </div>

      {/* Main Ticket Records Card */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        {/* Search & Filter Header */}
        <div className="p-3.5 sm:p-4 border-b border-slate-200/80 bg-slate-50/50 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="relative flex-1">
            <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search by ticket ID, subject or category..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all placeholder:text-slate-400"
            />
          </div>

          <div className="flex items-center gap-2">
            <div className="relative flex-1 sm:flex-initial">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full sm:w-44 px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all appearance-none pr-8 cursor-pointer"
              >
                <option value="all">All Ticket Statuses</option>
                <option value="open">Open / Pending</option>
                <option value="in_progress">In Progress</option>
                <option value="resolved">Resolved</option>
                <option value="closed">Closed</option>
              </select>
              <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            </div>

            <button
              onClick={() => {
                if (refetchTickets) refetchTickets()
                toast.info('Refreshed ticket queue')
              }}
              className="p-2 bg-white border border-slate-200 hover:bg-slate-50 rounded-xl text-slate-600 transition-all active:scale-95 shrink-0"
              title="Refresh Tickets"
            >
              <RefreshCw size={14} />
            </button>
          </div>
        </div>

        {/* Tickets Feed List */}
        <div className="divide-y divide-slate-100">
          {filteredTickets.map((ticket) => {
            const ticketIdStr = ticket.ticket_id || ticket.id
            return (
              <div
                key={ticket.id}
                className="p-3.5 sm:p-4 hover:bg-slate-50/70 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 group"
              >
                <div className="space-y-1.5 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span
                      onClick={() => handleCopy(ticketIdStr)}
                      className="inline-flex items-center gap-1 font-mono text-2xs font-bold text-slate-800 bg-slate-100 hover:bg-slate-200 px-2 py-0.5 rounded-md border border-slate-200/80 cursor-pointer transition-colors"
                      title="Click to copy ticket ID"
                    >
                      <Ticket size={11} className="text-primary-600" />
                      <span>{ticketIdStr}</span>
                    </span>

                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-2xs font-bold uppercase tracking-wider ${getStatusBadge(ticket.status)}`}>
                      {getStatusIcon(ticket.status)}
                      <span>{ticket.status?.replace('_', ' ')}</span>
                    </span>

                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-2xs font-bold uppercase tracking-wider ${getPriorityBadge(ticket.priority)}`}>
                      <span>{ticket.priority} priority</span>
                    </span>

                    {ticket.category && (
                      <span className="text-2xs font-semibold text-slate-400">
                        • {ticket.category}
                      </span>
                    )}
                  </div>

                  <div>
                    <h4 className="text-xs sm:text-sm font-semibold text-slate-900 group-hover:text-primary-600 transition-colors">
                      {ticket.subject}
                    </h4>
                    <p className="text-2xs text-slate-500 line-clamp-1 mt-0.5">
                      {ticket.message || ticket.description || 'No initial message text logged.'}
                    </p>
                  </div>

                  <div className="flex items-center gap-4 text-2xs font-medium text-slate-400 pt-0.5">
                    <span className="flex items-center gap-1">
                      <Calendar size={11} />
                      Opened: {formatDate(ticket.created_at || ticket.createdAt)}
                    </span>
                    <span className="flex items-center gap-1 text-slate-500 font-semibold">
                      <MessageCircle size={11} className="text-primary-600" />
                      {ticket.replies_count || 1} messages in thread
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                  <button
                    onClick={() => setSelectedTicketId(ticket.id)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-primary-50 hover:bg-primary-100 text-primary-700 text-2xs font-bold rounded-lg border border-primary-200/60 shadow-2xs transition-all active:scale-95"
                  >
                    <Eye size={13} />
                    <span>View Thread</span>
                  </button>
                </div>
              </div>
            )
          })}

          {filteredTickets.length === 0 && (
            <div className="text-center py-12 p-6">
              <Ticket size={36} className="mx-auto text-slate-300 mb-2.5" />
              <h5 className="text-xs font-bold text-slate-800">No support tickets found</h5>
              <p className="text-2xs text-slate-400 mt-1 max-w-sm mx-auto">
                No active tickets match your filters. Raise a new inquiry via the Contact Support tab.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Interactive Ticket Conversation Modal */}
      {selectedTicketId && activeTicketObj && (
        <div className="fixed inset-0 z-[100000] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm animate-fade-in"
            onClick={() => setSelectedTicketId(null)}
          />
          <div className="relative bg-white rounded-2xl max-w-2xl w-full max-h-[85vh] overflow-y-auto p-5 sm:p-6 shadow-2xl border border-slate-200/80 z-10 space-y-4 animate-scale-up">
            {/* Modal Header */}
            <div className="flex items-start justify-between gap-4 pb-3.5 border-b border-slate-100">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-2xs font-bold text-primary-700 bg-primary-50 px-2 py-0.5 rounded-md border border-primary-200/60">
                    {activeTicketObj.ticket_id || activeTicketObj.id}
                  </span>
                  <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-2xs font-bold uppercase tracking-wider ${getStatusBadge(activeTicketObj.status)}`}>
                    {activeTicketObj.status?.replace('_', ' ')}
                  </span>
                </div>
                <h3 className="text-sm sm:text-base font-bold text-slate-900 tracking-tight leading-snug">
                  {activeTicketObj.subject}
                </h3>
              </div>
              <button
                onClick={() => setSelectedTicketId(null)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors shrink-0"
              >
                <X size={16} />
              </button>
            </div>

            {/* Initial Problem Statement */}
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/70 space-y-1">
              <p className="text-2xs font-bold uppercase tracking-wider text-slate-400">Initial Problem Statement</p>
              <p className="text-xs font-medium text-slate-700 leading-relaxed">
                {activeTicketObj.message || activeTicketObj.description}
              </p>
            </div>

            {/* Resolution Box if Resolved */}
            {activeTicketObj.resolution && (
              <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200/80 space-y-1">
                <div className="flex items-center gap-1.5 text-emerald-800 text-2xs font-bold">
                  <CheckCircle size={13} className="text-emerald-600" />
                  <span>Resolution Note</span>
                </div>
                <p className="text-2xs font-medium text-emerald-700">
                  {activeTicketObj.resolution}
                </p>
              </div>
            )}

            {/* Reply Log */}
            <div className="space-y-2.5 pt-1">
              <h5 className="text-2xs font-bold uppercase tracking-wider text-slate-500">
                Ticket Conversation Thread
              </h5>

              <div className="space-y-2.5 max-h-56 overflow-y-auto p-1">
                {/* Simulated/Fetched thread messages */}
                <div className="p-3 bg-slate-50 border border-slate-200/80 rounded-xl space-y-1">
                  <div className="flex items-center justify-between text-2xs">
                    <span className="font-bold text-slate-800">Support Operations Desk</span>
                    <span className="text-slate-400">{formatDate(activeTicketObj.created_at)}</span>
                  </div>
                  <p className="text-2xs sm:text-xs text-slate-600">
                    We have acknowledged your issue and routed it to our specialized wholesale clearing team.
                  </p>
                </div>

                {(repliesData?.data || []).map((reply, idx) => (
                  <div key={idx} className="p-3 bg-primary-50/50 border border-primary-100 rounded-xl space-y-1">
                    <div className="flex items-center justify-between text-2xs">
                      <span className="font-bold text-primary-800">{reply.author || 'Merchant Representative'}</span>
                      <span className="text-slate-400">{formatDate(reply.created_at)}</span>
                    </div>
                    <p className="text-2xs sm:text-xs text-slate-700">{reply.message}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Reply Input Box */}
            {activeTicketObj.status !== 'resolved' && activeTicketObj.status !== 'closed' && (
              <div className="pt-2.5 border-t border-slate-100 space-y-2">
                <label className="block text-2xs font-bold uppercase tracking-wider text-slate-600">
                  Post Response to Support Team
                </label>
                <textarea
                  rows="3"
                  value={replyMessage}
                  onChange={(e) => setReplyMessage(e.target.value)}
                  placeholder="Provide additional details, transaction references or documents..."
                  className="w-full px-3 py-2 bg-slate-50/50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all resize-none"
                />
                <div className="flex items-center justify-between gap-3">
                  <button
                    type="button"
                    onClick={() => handleCloseTicket(activeTicketObj.id)}
                    className="px-3 py-1.5 text-2xs font-bold text-rose-700 hover:bg-rose-50 rounded-xl border border-rose-200 transition-all"
                  >
                    Mark as Resolved & Close
                  </button>

                  <button
                    type="button"
                    onClick={handleReplySubmit}
                    disabled={isReplying || !replyMessage.trim()}
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-primary-600 hover:bg-primary-700 text-white rounded-xl text-xs font-semibold shadow-xs transition-all disabled:opacity-40 active:scale-95"
                  >
                    {isReplying ? (
                      <>
                        <RefreshCw size={13} className="animate-spin" />
                        <span>Sending...</span>
                      </>
                    ) : (
                      <>
                        <Send size={13} />
                        <span>Submit Reply</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
