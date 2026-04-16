"use client"

import React, { useState, useEffect } from 'react'
import { MessageCircle, ChevronRight, Phone, Mail, Ticket, Send, User, Mail as MailIcon, AlertCircle, CheckCircle, Clock, Paperclip, X, Send as SendIcon } from '../../../../utils/icons'
import '../../../../styles/Retailer/RetailerSupport/ContactSupport.scss'

export default function ContactSupport() {
  const [mounted, setMounted] = useState(false)
  const [activeChannel, setActiveChannel] = useState('chat')
  const [showTicketForm, setShowTicketForm] = useState(false)
  const [ticketSubmitted, setTicketSubmitted] = useState(false)
  const [chatMessages, setChatMessages] = useState([
    { id: 1, type: 'bot', message: 'Hello! Welcome to Veltrix Support. How can I help you today?', time: '10:30 AM' }
  ])
  const [newMessage, setNewMessage] = useState('')
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
    priority: 'medium'
  })

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  const handleSendMessage = () => {
    if (!newMessage.trim()) return
    setChatMessages([...chatMessages, { id: Date.now(), type: 'user', message: newMessage, time: new Date().toLocaleTimeString() }])
    setNewMessage('')
    setTimeout(() => {
      setChatMessages(prev => [...prev, { id: Date.now(), type: 'bot', message: 'Thank you for your message. Our support team will get back to you shortly.', time: new Date().toLocaleTimeString() }])
    }, 1000)
  }

  const handleSubmitTicket = () => {
    if (!formData.name || !formData.email || !formData.message) return
    setTicketSubmitted(true)
    setTimeout(() => {
      setShowTicketForm(false)
      setTicketSubmitted(false)
      setFormData({ name: '', email: '', subject: '', message: '', priority: 'medium' })
    }, 2000)
  }

  const supportChannels = [
    { id: 'chat', label: 'Live Chat', icon: <MessageCircle size={20} />, color: 'primary', available: true, waitTime: '< 1 min' },
    { id: 'call', label: 'Phone Support', icon: <Phone size={20} />, color: 'green', available: true, waitTime: '2-3 min', number: '+91 1800 123 4567' },
    { id: 'email', label: 'Email Support', icon: <Mail size={20} />, color: 'blue', available: true, waitTime: '2-4 hours', email: 'support@veltrix.com' },
    { id: 'ticket', label: 'Raise Ticket', icon: <Ticket size={20} />, color: 'purple', available: true, waitTime: '24 hours' },
  ]

  const recentTickets = [
    { id: 'TKT-001', subject: 'POS printer not working', status: 'resolved', date: '2026-04-10' },
    { id: 'TKT-002', subject: 'GST invoice format issue', status: 'in-progress', date: '2026-04-12' },
    { id: 'TKT-003', subject: 'Staff login problem', status: 'pending', date: '2026-04-14' },
  ]

  return (
    <div className="contact-support bg-white rounded-xl shadow-sm border border-gray-100">
      {/* Header */}
      <div className="p-5 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <MessageCircle size={22} className="text-primary-500" />
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Contact Support</h3>
            <p className="text-sm text-gray-500">Get assistance via chat, call, email or ticket</p>
          </div>
        </div>
      </div>

      {/* Support Channels */}
      <div className="p-5 border-b border-gray-100">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {supportChannels.map((channel) => (
            <button
              key={channel.id}
              onClick={() => {
                setActiveChannel(channel.id)
                if (channel.id === 'ticket') setShowTicketForm(true)
              }}
              className={`p-4 rounded-xl border-2 transition-all text-center ${
                activeChannel === channel.id
                  ? `border-${channel.color}-500 bg-${channel.color}-50`
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className={`flex justify-center mb-2 ${
                activeChannel === channel.id ? `text-${channel.color}-600` : 'text-gray-500'
              }`}>
                {channel.icon}
              </div>
              <p className={`text-sm font-semibold ${
                activeChannel === channel.id ? `text-${channel.color}-700` : 'text-gray-700'
              }`}>
                {channel.label}
              </p>
              <p className="text-[10px] text-gray-400 mt-1">Wait: {channel.waitTime}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Live Chat Section */}
      {activeChannel === 'chat' && (
        <div className="p-5">
          <div className="bg-gray-50 rounded-xl h-80 flex flex-col">
            {/* Chat Messages */}
            <div className="flex-1 p-4 overflow-y-auto space-y-3">
              {chatMessages.map((msg) => (
                <div key={msg.id} className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] p-3 rounded-lg ${
                    msg.type === 'user' 
                      ? 'bg-primary-500 text-white rounded-br-none'
                      : 'bg-white border border-gray-200 text-gray-700 rounded-bl-none'
                  }`}>
                    <p className="text-sm">{msg.message}</p>
                    <p className={`text-[10px] mt-1 ${msg.type === 'user' ? 'text-primary-100' : 'text-gray-400'}`}>
                      {msg.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Chat Input */}
            <div className="p-3 border-t border-gray-200 bg-white rounded-b-xl">
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Type your message..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-primary-500"
                />
                <button
                  onClick={handleSendMessage}
                  className="p-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-all"
                >
                  <Send size={18} />
                </button>
              </div>
              <p className="text-[10px] text-gray-400 mt-2">Average response time: 1-2 minutes</p>
            </div>
          </div>
        </div>
      )}

      {/* Phone Support Section */}
      {activeChannel === 'call' && (
        <div className="p-5 text-center">
          <div className="bg-green-50 rounded-xl p-6">
            <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <Phone size={28} className="text-white" />
            </div>
            <h4 className="text-lg font-semibold text-gray-900">Call Support</h4>
            <p className="text-2xl font-bold text-green-600 mt-2">+91 1800 123 4567</p>
            <p className="text-sm text-gray-500 mt-2">Available 24/7 for urgent issues</p>
            <div className="mt-4 flex items-center justify-center gap-2 text-sm text-green-600">
              <CheckCircle size={16} />
              <span>Estimated wait time: 2-3 minutes</span>
            </div>
            <button className="mt-4 px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-all">
              Call Now
            </button>
          </div>
        </div>
      )}

      {/* Email Support Section */}
      {activeChannel === 'email' && (
        <div className="p-5 text-center">
          <div className="bg-blue-50 rounded-xl p-6">
            <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <Mail size={28} className="text-white" />
            </div>
            <h4 className="text-lg font-semibold text-gray-900">Email Support</h4>
            <p className="text-xl font-semibold text-blue-600 mt-2">support@veltrix.com</p>
            <p className="text-sm text-gray-500 mt-2">Send us an email and we'll respond within 2-4 hours</p>
            <button className="mt-4 px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all">
              Compose Email
            </button>
          </div>
        </div>
      )}

      {/* Ticket Section */}
      {activeChannel === 'ticket' && !showTicketForm && !ticketSubmitted && (
        <div className="p-5">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-sm font-semibold text-gray-900">Recent Tickets</h4>
            <button 
              onClick={() => setShowTicketForm(true)}
              className="text-xs text-primary-600 hover:text-primary-700"
            >
              + New Ticket
            </button>
          </div>
          <div className="space-y-2">
            {recentTickets.map((ticket) => (
              <div key={ticket.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="text-sm font-medium text-gray-900">{ticket.id}</p>
                  <p className="text-xs text-gray-500">{ticket.subject}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-xs px-2 py-0.5 rounded-full ${
                    ticket.status === 'resolved' ? 'bg-green-100 text-green-700' :
                    ticket.status === 'in-progress' ? 'bg-blue-100 text-blue-700' : 'bg-yellow-100 text-yellow-700'
                  }`}>
                    {ticket.status}
                  </span>
                  <ChevronRight size={14} className="text-gray-400" />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Ticket Form Modal */}
      {showTicketForm && !ticketSubmitted && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 animate-fadeIn">
          <div className="bg-white rounded-xl max-w-md w-full p-5">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Ticket size={18} className="text-primary-500" />
                <h3 className="text-lg font-semibold text-gray-900">Raise Support Ticket</h3>
              </div>
              <button onClick={() => setShowTicketForm(false)} className="p-1 text-gray-400 hover:text-gray-600">
                <X size={20} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Your Name *</label>
                <input
                  type="text"
                  placeholder="Enter your name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-primary-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email Address *</label>
                <input
                  type="email"
                  placeholder="your@email.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-primary-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                <input
                  type="text"
                  placeholder="Brief description of issue"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-primary-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                <select
                  value={formData.priority}
                  onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-primary-500"
                >
                  <option value="low">Low - General inquiry</option>
                  <option value="medium">Medium - Non-urgent issue</option>
                  <option value="high">High - Urgent issue</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Message *</label>
                <textarea
                  rows={4}
                  placeholder="Describe your issue in detail..."
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-primary-500 resize-none"
                />
              </div>
              <div className="flex items-center gap-2">
                <Paperclip size={14} className="text-gray-400" />
                <span className="text-xs text-gray-500">Attach files (Max 5MB)</span>
              </div>
            </div>

            <div className="flex gap-2 mt-5">
              <button onClick={() => setShowTicketForm(false)} className="flex-1 px-4 py-2 text-sm text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50">
                Cancel
              </button>
              <button onClick={handleSubmitTicket} className="flex-1 px-4 py-2 text-sm bg-primary-500 text-white rounded-lg hover:bg-primary-600 flex items-center justify-center gap-2">
                <SendIcon size={14} />
                Submit Ticket
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Ticket Submitted Success */}
      {ticketSubmitted && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 animate-fadeIn">
          <div className="bg-white rounded-xl max-w-md w-full p-6 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle size={32} className="text-green-500" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Ticket Submitted!</h3>
            <p className="text-sm text-gray-500">Your support ticket has been created. Our team will contact you within 24 hours.</p>
            <p className="text-xs text-gray-400 mt-2">Ticket ID: TKT-{Math.floor(Math.random() * 10000)}</p>
          </div>
        </div>
      )}
    </div>
  )
}