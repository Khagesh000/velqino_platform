"use client"

import React, { useState } from 'react'
import { useCreateTicketMutation, useGetTicketCategoriesQuery, useUploadAttachmentMutation } from '@/redux/wholesaler/slices/supportSlice'
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
  Star
} from '../../../../utils/icons'
import '../../../../styles/Wholesaler/Support/ContactSupport.scss'

export default function ContactSupport({ isActive = false }) {
  const [activeChannel, setActiveChannel] = useState('chat')
  const [createTicket, { isLoading: isCreating }] = useCreateTicketMutation()
  const { data: categoriesData } = useGetTicketCategoriesQuery(undefined, {
    skip: !isActive
  })
  const [uploadAttachment] = useUploadAttachmentMutation()
  const [ticketForm, setTicketForm] = useState({
    subject: '',
    category: '',
    message: '',
    priority: 'medium',
    attachments: []
  })
  const [chatMessages, setChatMessages] = useState([
    { id: 1, sender: 'support', message: 'Hello! How can I help you today?', time: '10:30 AM' }
  ])
  const [newMessage, setNewMessage] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [ticketSubmitted, setTicketSubmitted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Use API categories or fallback to static
  const categories = categoriesData?.data?.length ? categoriesData.data : [
    { id: 'general', name: 'General Inquiry' },
    { id: 'order', name: 'Order Issue' },
    { id: 'payment', name: 'Payment & Payout' },
    { id: 'product', name: 'Product Question' },
    { id: 'account', name: 'Account Settings' },
    { id: 'technical', name: 'Technical Issue' }
  ]

  const priorities = [
    { id: 'low', label: 'Low', color: 'bg-gray-100 text-gray-700' },
    { id: 'medium', label: 'Medium', color: 'bg-warning-100 text-warning-700' },
    { id: 'high', label: 'High', color: 'bg-error-100 text-error-700' },
    { id: 'urgent', label: 'Urgent', color: 'bg-red-100 text-red-700' }
  ]

  const handleSendMessage = () => {
    if (!newMessage.trim()) return
    setChatMessages([
      ...chatMessages,
      { id: chatMessages.length + 1, sender: 'user', message: newMessage, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }
    ])
    setNewMessage('')
    setIsTyping(true)
    setTimeout(() => {
      setIsTyping(false)
      setChatMessages(prev => [...prev, {
        id: prev.length + 1,
        sender: 'support',
        message: 'Thank you for your message. Our support team will get back to you shortly.',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }])
    }, 1500)
  }

  const handleTicketSubmit = async () => {
    if (!ticketForm.subject || !ticketForm.message) {
      toast.error('Please fill subject and message')
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
      
      if (result.status === 'success') {
        setTicketSubmitted(true)
        toast.success(`Ticket ${result.data?.ticket_id || 'created'} successfully!`)
        setTicketForm({
          subject: '',
          category: '',
          message: '',
          priority: 'medium',
          attachments: []
        })
        setTimeout(() => setTicketSubmitted(false), 3000)
      }
    } catch (error) {
      toast.error(error?.data?.message || 'Failed to submit ticket')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleFileUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return
    
    if (file.size > 5 * 1024 * 1024) {
      toast.error('File size must be less than 5MB')
      return
    }
    
    try {
      const result = await uploadAttachment(file).unwrap()
      if (result.status === 'success') {
        setTicketForm({
          ...ticketForm,
          attachments: [...ticketForm.attachments, result.data]
        })
        toast.success('File uploaded successfully')
      }
    } catch (error) {
      toast.error('Failed to upload file')
    }
  }

  const removeAttachment = (index) => {
    setTicketForm({
      ...ticketForm,
      attachments: ticketForm.attachments.filter((_, i) => i !== index)
    })
  }

  const supportHours = [
    { day: 'Monday - Friday', hours: '9:00 AM - 6:00 PM' },
    { day: 'Saturday', hours: '10:00 AM - 4:00 PM' },
    { day: 'Sunday', hours: 'Closed' }
  ]

  const channels = [
    { id: 'chat', label: 'Live Chat', icon: MessageCircle, description: 'Chat with support team', available: true },
    { id: 'email', label: 'Email Support', icon: Mail, description: 'Get response within 24h', available: true },
    { id: 'ticket', label: 'Ticket System', icon: Ticket, description: 'Track your issues', available: true }
  ]

  return (
    <div className="contact-support bg-white rounded-xl border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="px-4 sm:px-6 py-4 border-b border-gray-200 bg-gray-50/50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-primary-100 flex items-center justify-center text-primary-600">
            <MessageCircle size={20} />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-semibold text-gray-900">Contact Support</h3>
            <p className="text-xs sm:text-sm text-gray-500">Get help via live chat, email, or raise a support ticket</p>
          </div>
        </div>
      </div>

      {/* Channel Selector */}
      <div className="grid grid-cols-1 sm:grid-cols-3 border-b border-gray-200">
        {channels.map(channel => {
          const Icon = channel.icon
          return (
            <button
              key={channel.id}
              className={`p-4 text-center transition-all ${
                activeChannel === channel.id
                  ? 'bg-primary-50 border-b-2 border-primary-500'
                  : 'hover:bg-gray-50'
              }`}
              onClick={() => setActiveChannel(channel.id)}
            >
              <Icon size={24} className={`mx-auto mb-2 ${activeChannel === channel.id ? 'text-primary-600' : 'text-gray-500'}`} />
              <p className={`text-sm font-medium ${activeChannel === channel.id ? 'text-primary-700' : 'text-gray-700'}`}>
                {channel.label}
              </p>
              <p className="text-xs text-gray-500 mt-1">{channel.description}</p>
            </button>
          )
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-4 sm:p-6">
        {/* Main Content */}
        <div className="lg:col-span-2">
          {activeChannel === 'chat' && (
            <div className="border border-gray-200 rounded-xl overflow-hidden h-[500px] flex flex-col">
              {/* Chat Header */}
              <div className="px-4 py-3 bg-gray-50 border-b border-gray-200 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-success-500 animate-pulse"></div>
                  <span className="text-sm font-medium text-gray-900">Support Team</span>
                  <span className="text-xs text-gray-500">Online</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <Clock size={12} />
                  <span>Avg response: 2 mins</span>
                </div>
              </div>

              {/* Chat Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {chatMessages.map(msg => (
                  <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[80%] rounded-lg p-3 ${
                      msg.sender === 'user' 
                        ? 'bg-primary-500 text-white' 
                        : 'bg-gray-100 text-gray-700'
                    }`}>
                      <p className="text-sm">{msg.message}</p>
                      <p className={`text-xs mt-1 ${msg.sender === 'user' ? 'text-white/70' : 'text-gray-500'}`}>
                        {msg.time}
                      </p>
                    </div>
                  </div>
                ))}
                {isTyping && (
                  <div className="flex justify-start">
                    <div className="bg-gray-100 rounded-lg p-3">
                      <div className="flex gap-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100"></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200"></div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Chat Input */}
              <div className="p-4 border-t border-gray-200">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    placeholder="Type your message..."
                    className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-primary-500"
                  />
                  <button
                    onClick={handleSendMessage}
                    disabled={!newMessage.trim()}
                    className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 disabled:opacity-50 transition-all"
                  >
                    <Send size={18} />
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeChannel === 'email' && (
            <div className="border border-gray-200 rounded-xl p-6">
              <div className="text-center mb-6">
                <Mail size={48} className="mx-auto text-primary-500 mb-3" />
                <h3 className="text-lg font-semibold text-gray-900">Email Support</h3>
                <p className="text-sm text-gray-500">Send us an email and we'll get back to you within 24 hours</p>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Your Email</label>
                  <input type="email" placeholder="you@example.com" className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-primary-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                  <input type="text" placeholder="What is your query about?" className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-primary-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                  <textarea rows="5" placeholder="Describe your issue in detail..." className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-primary-500" />
                </div>
                <button className="w-full py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-all">
                  Send Email
                </button>
              </div>
            </div>
          )}

          {activeChannel === 'ticket' && (
            <div className="border border-gray-200 rounded-xl p-6">
              <div className="text-center mb-6">
                <Ticket size={48} className="mx-auto text-primary-500 mb-3" />
                <h3 className="text-lg font-semibold text-gray-900">Raise a Support Ticket</h3>
                <p className="text-sm text-gray-500">Track your issue status and get updates</p>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                  <input
                    type="text"
                    value={ticketForm.subject}
                    onChange={(e) => setTicketForm({ ...ticketForm, subject: e.target.value })}
                    placeholder="Brief description of the issue"
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-primary-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                  <select
                    value={ticketForm.category}
                    onChange={(e) => setTicketForm({ ...ticketForm, category: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-primary-500"
                  >
                    <option value="">Select Category</option>
                    {categories.map(cat => (
                      <option key={cat.id} value={cat.id}>{cat.name || cat.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                  <div className="flex gap-2">
                    {priorities.map(prio => (
                      <button
                        key={prio.id}
                        className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                          ticketForm.priority === prio.id
                            ? prio.color
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                        onClick={() => setTicketForm({ ...ticketForm, priority: prio.id })}
                      >
                        {prio.label}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                  <textarea
                    rows="4"
                    value={ticketForm.message}
                    onChange={(e) => setTicketForm({ ...ticketForm, message: e.target.value })}
                    placeholder="Please provide detailed information about your issue..."
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-primary-500"
                  />
                </div>
                <div>
                  <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
                    <Paperclip size={14} />
                    Attach files (Optional, max 5MB)
                    <input type="file" onChange={handleFileUpload} className="hidden" />
                  </label>
                  {ticketForm.attachments.length > 0 && (
                    <div className="mt-2 space-y-1">
                      {ticketForm.attachments.map((att, idx) => (
                        <div key={idx} className="flex items-center justify-between text-xs bg-gray-50 p-2 rounded">
                          <span>{att.filename}</span>
                          <button onClick={() => removeAttachment(idx)} className="text-red-500">
                            <X size={12} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <button
                  onClick={handleTicketSubmit}
                  disabled={isSubmitting || !ticketForm.subject || !ticketForm.message}
                  className="w-full py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 disabled:opacity-50 transition-all"
                >
                  {isSubmitting ? (
                    <>
                      <RefreshCw size={14} className="inline animate-spin mr-2" />
                      Submitting...
                    </>
                  ) : (
                    'Submit Ticket'
                  )}
                </button>
                {ticketSubmitted && (
                  <div className="p-3 bg-success-50 rounded-lg flex items-center gap-2">
                    <CheckCircle size={16} className="text-success-600" />
                    <p className="text-sm text-success-600">Ticket submitted successfully! We'll get back to you soon.</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Support Info Sidebar */}
        <div className="space-y-4">
          {/* Support Hours */}
          <div className="border border-gray-200 rounded-xl p-4">
            <h4 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <Clock size={16} className="text-primary-500" />
              Support Hours
            </h4>
            <div className="space-y-2">
              {supportHours.map((item, idx) => (
                <div key={idx} className="flex justify-between text-sm">
                  <span className="text-gray-600">{item.day}</span>
                  <span className="text-gray-900 font-medium">{item.hours}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Response Time */}
          <div className="border border-gray-200 rounded-xl p-4">
            <h4 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <CheckCircle size={16} className="text-primary-500" />
              Response Times
            </h4>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Live Chat</span>
                <span className="text-gray-900 font-medium">&lt; 2 minutes</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Email Support</span>
                <span className="text-gray-900 font-medium">Within 24 hours</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Support Tickets</span>
                <span className="text-gray-900 font-medium">24-48 hours</span>
              </div>
            </div>
          </div>

          {/* Contact Info */}
          <div className="border border-gray-200 rounded-xl p-4">
            <h4 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <Phone size={16} className="text-primary-500" />
              Contact Info
            </h4>
            <div className="space-y-2 text-sm">
              <p className="text-gray-600">Email: <span className="text-gray-900">support@veltrix.com</span></p>
              <p className="text-gray-600">Phone: <span className="text-gray-900">+91 80 1234 5678</span></p>
              <p className="text-gray-600">Emergency: <span className="text-gray-900">+91 98765 43210</span></p>
            </div>
          </div>

          {/* Satisfaction Rating */}
          <div className="border border-gray-200 rounded-xl p-4 text-center">
            <h4 className="text-sm font-semibold text-gray-900 mb-2">Rate your support experience</h4>
            <div className="flex justify-center gap-2">
              {[1, 2, 3, 4, 5].map(i => (
                <button key={i} className="p-2 hover:scale-110 transition-all">
                  <Star size={20} className="text-gray-300 hover:text-warning-500" />
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}