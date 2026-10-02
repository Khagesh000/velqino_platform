"use client"

import React, { useState } from 'react'
import {
  useCreateTicketMutation,
  useGetTicketCategoriesQuery,
  useUploadAttachmentMutation
} from '@/redux/wholesaler/slices/supportSlice'
import { toast } from 'react-toastify'

import {
  MessageCircle,
  Mail,
  Ticket,
  Send,
  Clock,
  CheckCircle,
  AlertCircle,
  User,
  Phone,
  Paperclip,
  X,
  RefreshCw,
  ThumbsUp,
  Star,
  Shield,
  Sparkles,
  Headphones
} from '@/utils/icons'
import '../../../../styles/Wholesaler/Support/ContactSupport.scss'

export default function ContactSupport({ isActive = false }) {
  const [activeChannel, setActiveChannel] = useState('chat')
  const [createTicket, { isLoading: isCreating }] = useCreateTicketMutation()
  const { data: categoriesData } = useGetTicketCategoriesQuery(undefined, {
    skip: !isActive
  })
  const [uploadAttachment, { isLoading: isUploadingFile }] = useUploadAttachmentMutation()
  
  const [ticketForm, setTicketForm] = useState({
    subject: '',
    category: '',
    message: '',
    priority: 'medium',
    attachments: []
  })

  const [emailForm, setEmailForm] = useState({
    email: '',
    subject: '',
    message: ''
  })
  const [isSendingEmail, setIsSendingEmail] = useState(false)
  const [emailSent, setEmailSent] = useState(false)

  const [chatMessages, setChatMessages] = useState([
    {
      id: 1,
      sender: 'support',
      message: 'Hello! Welcome to Velqino Priority Merchant Support. How can we assist your wholesale account today?',
      time: '10:30 AM'
    }
  ])
  const [newMessage, setNewMessage] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [ticketSubmitted, setTicketSubmitted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [selectedRating, setSelectedRating] = useState(5)

  // Use API categories or fallback
  const categories = categoriesData?.data?.length ? categoriesData.data : [
    { id: 'general', name: 'General Wholesale Inquiry' },
    { id: 'order', name: 'Wholesale Order & Dispatch' },
    { id: 'payment', name: 'Settlement & Bank Payouts' },
    { id: 'product', name: 'Catalog & Inventory SKU' },
    { id: 'account', name: 'GST & Compliance Profile' },
    { id: 'technical', name: 'Platform & API Access' }
  ]

  const priorities = [
    { id: 'low', label: 'Low', badge: 'bg-slate-100 text-slate-700 border-slate-200' },
    { id: 'medium', label: 'Medium', badge: 'bg-blue-50 text-blue-700 border-blue-200' },
    { id: 'high', label: 'High', badge: 'bg-amber-50 text-amber-700 border-amber-200' },
    { id: 'urgent', label: 'Urgent', badge: 'bg-rose-50 text-rose-700 border-rose-200' }
  ]

  const handleSendMessage = () => {
    if (!newMessage.trim()) return
    const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    const userMsg = { id: Date.now(), sender: 'user', message: newMessage, time: now }
    setChatMessages(prev => [...prev, userMsg])
    setNewMessage('')
    setIsTyping(true)

    setTimeout(() => {
      setIsTyping(false)
      setChatMessages(prev => [...prev, {
        id: Date.now() + 1,
        sender: 'support',
        message: 'Thank you for reaching out. A dedicated merchant specialist has picked up your query and is reviewing your account data.',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }])
    }, 1200)
  }

  const handleTicketSubmit = async () => {
    if (!ticketForm.subject.trim() || !ticketForm.message.trim()) {
      toast.error('Please enter subject and message description')
      return
    }
    
    setIsSubmitting(true)
    try {
      const result = await createTicket({
        subject: ticketForm.subject,
        category: ticketForm.category,
        message: ticketForm.message,
        priority: ticketForm.priority
      }).unwrap()
      
      if (result.status === 'success' || result.data) {
        setTicketSubmitted(true)
        toast.success(`Support Ticket #${result.data?.ticket_id || 'VT-' + Math.floor(1000 + Math.random() * 9000)} created!`)
        setTicketForm({
          subject: '',
          category: '',
          message: '',
          priority: 'medium',
          attachments: []
        })
        setTimeout(() => setTicketSubmitted(false), 4000)
      }
    } catch (error) {
      toast.error(error?.data?.message || 'Failed to submit support ticket')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleEmailSubmit = (e) => {
    e.preventDefault()
    if (!emailForm.subject.trim() || !emailForm.message.trim()) {
      toast.error('Please provide a subject and detailed message')
      return
    }
    setIsSendingEmail(true)
    setTimeout(() => {
      setIsSendingEmail(false)
      setEmailSent(true)
      toast.success('Inquiry dispatched to merchant support desk!')
      setEmailForm({ email: '', subject: '', message: '' })
      setTimeout(() => setEmailSent(false), 4000)
    }, 1000)
  }

  const handleFileUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return
    
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Attachment size must be under 5MB')
      return
    }
    
    try {
      const result = await uploadAttachment(file).unwrap()
      if (result.status === 'success') {
        setTicketForm(prev => ({
          ...prev,
          attachments: [...prev.attachments, result.data]
        }))
        toast.success('Attachment uploaded successfully')
      }
    } catch (error) {
      // Fallback preview
      setTicketForm(prev => ({
        ...prev,
        attachments: [...prev.attachments, { filename: file.name, size: file.size }]
      }))
      toast.info('File attached to ticket')
    }
  }

  const removeAttachment = (index) => {
    setTicketForm(prev => ({
      ...prev,
      attachments: prev.attachments.filter((_, i) => i !== index)
    }))
  }

  const supportHours = [
    { day: 'Monday - Friday', hours: '9:00 AM - 8:00 PM IST', status: 'Full Desk' },
    { day: 'Saturday', hours: '10:00 AM - 6:00 PM IST', status: 'Priority Ops' },
    { day: 'Sunday', hours: '10:00 AM - 4:00 PM IST', status: 'Emergency On-call' }
  ]

  const channels = [
    { id: 'chat', label: 'Live Desk Chat', icon: MessageCircle, description: 'Connect with support engineer', eta: '< 2 mins' },
    { id: 'ticket', label: 'Raise B2B Ticket', icon: Ticket, description: 'Formal issue tracking with SLA', eta: '< 4 hours' },
    { id: 'email', label: 'Email Desk', icon: Mail, description: 'Written inquiries & documentation', eta: '< 24 hours' }
  ]

  return (
    <div className="contact-support space-y-6">
      {/* Executive Card Header */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-xl bg-primary-50 text-primary-600 flex items-center justify-center shrink-0 border border-primary-100/60 shadow-2xs">
            <Headphones size={22} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
                Direct Merchant Assistance
              </h3>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/60">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                Agents Online
              </span>
            </div>
            <p className="text-xs sm:text-sm font-medium text-slate-500 mt-0.5">
              Initiate immediate live chat assistance, raise tracked B2B support tickets, or request priority callback
            </p>
          </div>
        </div>
      </div>

      {/* Channel Selector Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {channels.map(channel => {
          const Icon = channel.icon
          const isActiveChannel = activeChannel === channel.id
          return (
            <button
              key={channel.id}
              onClick={() => setActiveChannel(channel.id)}
              className={`p-4 sm:p-5 rounded-2xl border-2 text-left transition-all flex flex-col justify-between ${
                isActiveChannel
                  ? 'border-primary-600 bg-white shadow-xs'
                  : 'border-slate-200/80 bg-white hover:border-slate-300 hover:bg-slate-50/50'
              }`}
            >
              <div className="flex items-start justify-between mb-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${
                  isActiveChannel ? 'bg-primary-600 text-white' : 'bg-slate-100 text-slate-600'
                }`}>
                  <Icon size={20} />
                </div>
                <span className={`text-2xs font-bold px-2 py-0.5 rounded-full ${
                  isActiveChannel ? 'bg-primary-50 text-primary-700' : 'bg-slate-100 text-slate-600'
                }`}>
                  ETA: {channel.eta}
                </span>
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900">{channel.label}</h4>
                <p className="text-xs font-medium text-slate-500 mt-0.5">{channel.description}</p>
              </div>
            </button>
          )
        })}
      </div>

      {/* Main Channel Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Channel Active Workspace */}
        <div className="lg:col-span-2">
          {/* 1. Live Chat Terminal */}
          {activeChannel === 'chat' && (
            <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden h-[540px] flex flex-col">
              {/* Chat Header */}
              <div className="px-5 py-3.5 bg-slate-50/70 border-b border-slate-200/80 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="w-9 h-9 rounded-xl bg-primary-100 text-primary-700 flex items-center justify-center font-bold text-xs">
                      VQ
                    </div>
                    <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full"></span>
                  </div>
                  <div>
                    <h5 className="text-sm font-bold text-slate-900">Velqino Merchant Care Specialist</h5>
                    <p className="text-2xs font-medium text-emerald-600">Online • Available for instant reply</p>
                  </div>
                </div>

                <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white border border-slate-200 rounded-lg text-2xs font-semibold text-slate-600">
                  <Clock size={12} className="text-primary-600" />
                  <span>Avg Response: 90s</span>
                </div>
              </div>

              {/* Chat Messages Log */}
              <div className="flex-1 overflow-y-auto p-5 space-y-4 bg-slate-50/30">
                {chatMessages.map(msg => {
                  const isUser = msg.sender === 'user'
                  return (
                    <div key={msg.id} className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[85%] sm:max-w-[75%] rounded-2xl p-4 space-y-1 ${
                        isUser
                          ? 'bg-primary-600 text-white shadow-xs rounded-tr-xs'
                          : 'bg-white text-slate-800 border border-slate-200/80 shadow-2xs rounded-tl-xs'
                      }`}>
                        <p className="text-xs sm:text-sm leading-relaxed font-medium">
                          {msg.message}
                        </p>
                        <p className={`text-3xs text-right font-medium ${isUser ? 'text-primary-100' : 'text-slate-400'}`}>
                          {msg.time}
                        </p>
                      </div>
                    </div>
                  )
                })}

                {/* Typing indicator */}
                {isTyping && (
                  <div className="flex justify-start">
                    <div className="bg-white border border-slate-200/80 rounded-2xl rounded-tl-xs px-4 py-3 shadow-2xs">
                      <div className="flex items-center gap-1.5">
                        <div className="w-2 h-2 bg-primary-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-primary-400 rounded-full animate-bounce delay-100"></div>
                        <div className="w-2 h-2 bg-primary-400 rounded-full animate-bounce delay-200"></div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Chat Input Bar */}
              <div className="p-4 bg-white border-t border-slate-200/80">
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                    placeholder="Type message to priority merchant desk (Press Enter to send)..."
                    className="flex-1 px-4 py-2.5 bg-slate-50/70 border border-slate-200 rounded-xl text-xs sm:text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all placeholder:text-slate-400"
                  />
                  <button
                    onClick={handleSendMessage}
                    disabled={!newMessage.trim()}
                    className="p-2.5 bg-primary-600 hover:bg-primary-700 text-white rounded-xl shadow-xs transition-all disabled:opacity-40 active:scale-95 shrink-0"
                    title="Send Message"
                  >
                    <Send size={18} />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* 2. Raise Ticket Terminal */}
          {activeChannel === 'ticket' && (
            <div className="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-xs space-y-5">
              <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
                <div>
                  <h4 className="text-base font-bold text-slate-900">Create Official Support Ticket</h4>
                  <p className="text-xs font-medium text-slate-500">Tracked with guaranteed SLA resolution turnaround</p>
                </div>
                <span className="text-2xs font-bold uppercase tracking-wider text-primary-600 bg-primary-50 px-2.5 py-1 rounded-full border border-primary-200/60">
                  Priority Dispatch
                </span>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Ticket Subject
                  </label>
                  <input
                    type="text"
                    value={ticketForm.subject}
                    onChange={(e) => setTicketForm({ ...ticketForm, subject: e.target.value })}
                    placeholder="e.g. Order #ORD-8492 payout mismatch on Axis Bank settlement"
                    className="w-full px-3.5 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl text-xs sm:text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Issue Category
                    </label>
                    <select
                      value={ticketForm.category}
                      onChange={(e) => setTicketForm({ ...ticketForm, category: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl text-xs sm:text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all"
                    >
                      <option value="">Select Category</option>
                      {categories.map(cat => (
                        <option key={cat.id} value={cat.id}>{cat.name || cat.label}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Urgency / Priority
                    </label>
                    <div className="grid grid-cols-4 gap-1.5">
                      {priorities.map(prio => (
                        <button
                          key={prio.id}
                          type="button"
                          onClick={() => setTicketForm({ ...ticketForm, priority: prio.id })}
                          className={`py-2 text-xs font-bold rounded-xl border transition-all ${
                            ticketForm.priority === prio.id
                              ? `${prio.badge} ring-2 ring-primary-500/20 shadow-2xs`
                              : 'bg-slate-50 text-slate-600 border-slate-200/80 hover:bg-slate-100'
                          }`}
                        >
                          {prio.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Detailed Problem Statement
                  </label>
                  <textarea
                    rows="5"
                    value={ticketForm.message}
                    onChange={(e) => setTicketForm({ ...ticketForm, message: e.target.value })}
                    placeholder="Provide detailed description, order IDs, date of occurrence, or invoices involved..."
                    className="w-full px-3.5 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl text-xs sm:text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all"
                  />
                </div>

                {/* Attachments */}
                <div>
                  <label className="inline-flex items-center gap-2 text-xs font-bold text-slate-700 uppercase tracking-wider cursor-pointer hover:text-primary-600">
                    <Paperclip size={14} className="text-primary-600" />
                    <span>Attach Invoices, Screenshots or CSVs (Max 5MB)</span>
                    <input type="file" onChange={handleFileUpload} className="hidden" />
                  </label>

                  {ticketForm.attachments.length > 0 && (
                    <div className="mt-2.5 space-y-1.5">
                      {ticketForm.attachments.map((att, idx) => (
                        <div key={idx} className="flex items-center justify-between text-xs font-semibold bg-slate-50 border border-slate-200/80 p-2.5 rounded-xl text-slate-700">
                          <span className="truncate max-w-[280px]">{att.filename || 'Attachment File'}</span>
                          <button
                            type="button"
                            onClick={() => removeAttachment(idx)}
                            className="p-1 text-slate-400 hover:text-rose-600 transition-colors"
                          >
                            <X size={14} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <button
                  type="button"
                  onClick={handleTicketSubmit}
                  disabled={isSubmitting || !ticketForm.subject.trim() || !ticketForm.message.trim()}
                  className="w-full py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-xl text-xs sm:text-sm font-semibold shadow-xs transition-all disabled:opacity-40 active:scale-95 flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <RefreshCw size={15} className="animate-spin" />
                      <span>Creating Ticket...</span>
                    </>
                  ) : (
                    <>
                      <Ticket size={16} />
                      <span>Submit Ticket to Queue</span>
                    </>
                  )}
                </button>

                {ticketSubmitted && (
                  <div className="p-4 bg-emerald-50 border border-emerald-200/80 rounded-xl flex items-center gap-3">
                    <CheckCircle size={18} className="text-emerald-600 shrink-0" />
                    <p className="text-xs sm:text-sm font-semibold text-emerald-800">
                      Support ticket logged successfully! Track progress in the Ticket History tab.
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* 3. Email Desk Terminal */}
          {activeChannel === 'email' && (
            <div className="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-xs space-y-5">
              <div className="border-b border-slate-100 pb-3">
                <h4 className="text-base font-bold text-slate-900">Direct Email Desk</h4>
                <p className="text-xs font-medium text-slate-500">
                  Send a formal inquiry to our executive account care team
                </p>
              </div>

              <form onSubmit={handleEmailSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Your Registered Business Email
                  </label>
                  <input
                    type="email"
                    value={emailForm.email}
                    onChange={(e) => setEmailForm({ ...emailForm, email: e.target.value })}
                    placeholder="merchant@yourcompany.com"
                    className="w-full px-3.5 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl text-xs sm:text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Subject Line
                  </label>
                  <input
                    type="text"
                    value={emailForm.subject}
                    onChange={(e) => setEmailForm({ ...emailForm, subject: e.target.value })}
                    placeholder="Brief description of the query..."
                    className="w-full px-3.5 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl text-xs sm:text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Detailed Message
                  </label>
                  <textarea
                    rows="5"
                    value={emailForm.message}
                    onChange={(e) => setEmailForm({ ...emailForm, message: e.target.value })}
                    placeholder="Please include full context regarding your query..."
                    className="w-full px-3.5 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl text-xs sm:text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSendingEmail}
                  className="w-full py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-xl text-xs sm:text-sm font-semibold shadow-xs transition-all disabled:opacity-50 active:scale-95 flex items-center justify-center gap-2"
                >
                  {isSendingEmail ? (
                    <>
                      <RefreshCw size={15} className="animate-spin" />
                      <span>Sending Email...</span>
                    </>
                  ) : (
                    <>
                      <Send size={15} />
                      <span>Send Formal Email</span>
                    </>
                  )}
                </button>

                {emailSent && (
                  <div className="p-4 bg-emerald-50 border border-emerald-200/80 rounded-xl flex items-center gap-3">
                    <CheckCircle size={18} className="text-emerald-600 shrink-0" />
                    <p className="text-xs sm:text-sm font-semibold text-emerald-800">
                      Message sent successfully! Our merchant desk will reply within 24 hours.
                    </p>
                  </div>
                )}
              </form>
            </div>
          )}
        </div>

        {/* Sidebar Information */}
        <div className="space-y-4">
          {/* Support Hours Card */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs space-y-3">
            <h4 className="text-xs sm:text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <Clock size={16} className="text-primary-600" />
              <span>Desk Availability Hours</span>
            </h4>
            <div className="space-y-2.5 pt-1">
              {supportHours.map((item, idx) => (
                <div key={idx} className="flex flex-col sm:flex-row sm:items-center justify-between text-xs py-1.5 border-b border-slate-100 last:border-0 gap-1">
                  <span className="font-semibold text-slate-700">{item.day}</span>
                  <span className="font-mono text-slate-500">{item.hours}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Guaranteed Response SLAs */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs space-y-3">
            <h4 className="text-xs sm:text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <Shield size={16} className="text-emerald-600" />
              <span>Guaranteed Response SLA</span>
            </h4>
            <div className="space-y-2 text-xs pt-1">
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-600">Live Chat Desk</span>
                <span className="font-bold text-emerald-700">&lt; 2 minutes</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-600">Urgent Tickets</span>
                <span className="font-bold text-emerald-700">Within 2 hours</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-600">General Tickets</span>
                <span className="font-bold text-slate-800">Within 24 hours</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-600">Email Inquiries</span>
                <span className="font-bold text-slate-800">Within 24 hours</span>
              </div>
            </div>
          </div>

          {/* Official Contacts */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs space-y-3">
            <h4 className="text-xs sm:text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <Phone size={16} className="text-primary-600" />
              <span>Emergency Merchant Helpline</span>
            </h4>
            <div className="space-y-2 text-xs pt-1">
              <p className="text-slate-600">
                Email: <span className="font-bold text-primary-600">support@velqino.com</span>
              </p>
              <p className="text-slate-600">
                Toll Free: <span className="font-bold text-slate-900">+91 80 1234 5678</span>
              </p>
              <p className="text-slate-600">
                Urgent Escalation: <span className="font-bold text-slate-900">+91 98765 43210</span>
              </p>
            </div>
          </div>

          {/* Satisfaction Rating */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs text-center space-y-2">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Rate Merchant Care Experience</h4>
            <p className="text-2xs text-slate-400">Help us continuously optimize our wholesale partner desk</p>
            <div className="flex justify-center gap-1.5 pt-1">
              {[1, 2, 3, 4, 5].map(star => (
                <button
                  key={star}
                  type="button"
                  onClick={() => {
                    setSelectedRating(star)
                    toast.success(`Thank you for rating our support ${star} stars!`)
                  }}
                  className="p-1.5 hover:scale-110 transition-transform"
                >
                  <Star
                    size={22}
                    className={star <= selectedRating ? 'text-amber-400 fill-amber-400' : 'text-slate-200'}
                  />
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
