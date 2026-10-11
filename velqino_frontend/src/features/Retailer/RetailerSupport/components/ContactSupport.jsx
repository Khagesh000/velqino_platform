"use client"

import React, { useState, useEffect } from 'react'
import { 
  MessageCircle, 
  ChevronRight, 
  Phone, 
  Mail, 
  Ticket, 
  Send, 
  User, 
  AlertCircle, 
  CheckCircle, 
  Clock, 
  Paperclip, 
  X, 
  Headphones,
  ShieldCheck,
  Sparkles,
  ExternalLink
} from '../../../../utils/icons'

export default function ContactSupport() {
  const [mounted, setMounted] = useState(false)
  const [activeChannel, setActiveChannel] = useState('chat')
  const [showTicketForm, setShowTicketForm] = useState(false)
  const [ticketSubmitted, setTicketSubmitted] = useState(false)
  const [generatedTicketId, setGeneratedTicketId] = useState('')
  const [chatMessages, setChatMessages] = useState([
    { id: 1, type: 'bot', message: 'Hello! Welcome to Velqino Merchant Support. How can we assist your retail operations today?', time: '10:30 AM' }
  ])
  const [newMessage, setNewMessage] = useState('')
  const [formData, setFormData] = useState({
    name: 'Rajesh Kumar',
    email: 'store@veltrix.com',
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
    const userMsg = { 
      id: Date.now(), 
      type: 'user', 
      message: newMessage, 
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) 
    }
    setChatMessages(prev => [...prev, userMsg])
    setNewMessage('')
    setTimeout(() => {
      setChatMessages(prev => [
        ...prev, 
        { 
          id: Date.now() + 1, 
          type: 'bot', 
          message: 'An engineer has received your message and will respond right here. Feel free to attach any POS receipt error screenshots if needed.', 
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) 
        }
      ])
    }, 1000)
  }

  const handleSubmitTicket = () => {
    if (!formData.name || !formData.email || !formData.message) return
    const tId = `TKT-${Math.floor(1000 + Math.random() * 9000)}`
    setGeneratedTicketId(tId)
    setTicketSubmitted(true)
    setTimeout(() => {
      setShowTicketForm(false)
      setTicketSubmitted(false)
      setFormData({ name: 'Rajesh Kumar', email: 'store@veltrix.com', subject: '', message: '', priority: 'medium' })
    }, 2800)
  }

  const supportChannels = [
    { 
      id: 'chat', 
      label: 'Live Chat', 
      desc: 'Instant messaging',
      icon: <MessageCircle size={20} />, 
      activeClass: 'border-primary-500 bg-primary-50/60 text-primary-700',
      waitTime: '&lt; 1 min' 
    },
    { 
      id: 'call', 
      label: 'Phone Support', 
      desc: 'Toll-free hotline',
      icon: <Phone size={20} />, 
      activeClass: 'border-emerald-500 bg-emerald-50/60 text-emerald-700',
      waitTime: '2-3 mins', 
      number: '+91 1800 123 4567' 
    },
    { 
      id: 'email', 
      label: 'Email Support', 
      desc: 'Written queries',
      icon: <Mail size={20} />, 
      activeClass: 'border-blue-500 bg-blue-50/60 text-blue-700',
      waitTime: '2-4 hours', 
      email: 'support@velqino.com' 
    },
    { 
      id: 'ticket', 
      label: 'Raise Ticket', 
      desc: 'Complex issues',
      icon: <Ticket size={20} />, 
      activeClass: 'border-purple-500 bg-purple-50/60 text-purple-700',
      waitTime: '24 hours' 
    },
  ]

  const recentTickets = [
    { id: 'TKT-7821', subject: 'Thermal printer cut command timeout on 80mm', status: 'resolved', date: '2026-04-10' },
    { id: 'TKT-7845', subject: 'B2B GST invoice CGST mismatch on discount split', status: 'in-progress', date: '2026-04-12' },
    { id: 'TKT-7890', subject: 'Staff counter PIN reset assistance', status: 'pending', date: '2026-04-14' },
  ]

  return (
    <div className="bg-white rounded-3xl border border-gray-200/80 shadow-2xs overflow-hidden transition-all duration-300">
      {/* Header */}
      <div className="p-5 sm:p-6 border-b border-gray-100 bg-gradient-to-r from-gray-50/60 via-white to-gray-50/30">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-primary-50 border border-primary-100 flex items-center justify-center text-primary-600 shadow-2xs shrink-0">
              <Headphones size={20} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-extrabold text-gray-900 tracking-tight">Contact Merchant Support</h3>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  Engineers On-Call
                </span>
              </div>
              <p className="text-xs text-gray-500 mt-0.5">Connect with our dedicated retail operations desk via chat, phone, email, or formal ticket</p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              setActiveChannel('ticket')
              setShowTicketForm(true)
            }}
            className="px-4 py-2 text-xs font-bold text-white bg-primary-600 hover:bg-primary-700 rounded-xl transition-all shadow-xs flex items-center gap-1.5 self-start sm:self-auto"
          >
            <Ticket size={14} />
            <span>Raise Formal Ticket</span>
          </button>
        </div>
      </div>

      <div className="p-5 sm:p-6 space-y-6">
        {/* Support Channel Selector Grid */}
        <div>
          <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2.5">Select Communication Channel</p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {supportChannels.map((channel) => {
              const isActive = activeChannel === channel.id
              return (
                <button
                  key={channel.id}
                  type="button"
                  onClick={() => {
                    setActiveChannel(channel.id)
                    if (channel.id === 'ticket') setShowTicketForm(true)
                  }}
                  className={`p-4 rounded-2xl border-2 transition-all text-left relative ${
                    isActive
                      ? channel.activeClass
                      : 'border-gray-200/80 bg-white hover:border-gray-300 hover:bg-gray-50/50'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className={isActive ? 'text-current' : 'text-gray-500'}>
                      {channel.icon}
                    </div>
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-white/80 border border-gray-200 text-gray-600">
                      {channel.waitTime}
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm font-bold text-gray-900">{channel.label}</p>
                  <p className="text-[10px] text-gray-500 mt-0.5">{channel.desc}</p>
                </button>
              )
            })}
          </div>
        </div>

        {/* Live Chat Section */}
        {activeChannel === 'chat' && (
          <div className="border border-gray-200/80 rounded-2xl overflow-hidden bg-gray-50/50">
            <div className="p-3.5 bg-white border-b border-gray-200/80 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-xs font-bold text-gray-900">Live Support Concierge</span>
                <span className="text-[10px] text-gray-400">• Dedicated to Velqino Retailers</span>
              </div>
              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                Avg reply: &lt; 1 min
              </span>
            </div>

            {/* Chat Messages Log */}
            <div className="p-4 h-72 overflow-y-auto space-y-3">
              {chatMessages.map((msg) => (
                <div key={msg.id} className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] sm:max-w-[75%] p-3.5 rounded-2xl text-xs leading-relaxed ${
                    msg.type === 'user'
                      ? 'bg-primary-600 text-white rounded-br-none shadow-2xs'
                      : 'bg-white border border-gray-200/80 text-gray-800 rounded-bl-none shadow-2xs'
                  }`}>
                    <p>{msg.message}</p>
                    <p className={`text-[10px] mt-1.5 text-right font-medium ${msg.type === 'user' ? 'text-primary-100' : 'text-gray-400'}`}>
                      {msg.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Chat Input Bar */}
            <div className="p-3 bg-white border-t border-gray-200/80">
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Describe your question or issue (e.g. scanner barcode not reading)..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                  className="flex-1 px-4 py-2.5 bg-gray-50/80 border border-gray-200 rounded-xl text-xs focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100 transition-all"
                />
                <button
                  type="button"
                  onClick={handleSendMessage}
                  className="px-4 py-2.5 bg-primary-600 text-white rounded-xl hover:bg-primary-700 active:scale-95 transition-all flex items-center justify-center shrink-0 shadow-xs"
                >
                  <Send size={15} />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Phone Hotline Section */}
        {activeChannel === 'call' && (
          <div className="bg-gradient-to-br from-emerald-50/60 to-white border border-emerald-200/80 rounded-2xl p-6 text-center space-y-4">
            <div className="w-16 h-16 rounded-3xl bg-emerald-500 text-white flex items-center justify-center mx-auto shadow-md">
              <Phone size={28} />
            </div>
            <div>
              <h4 className="text-base sm:text-lg font-extrabold text-gray-900">Direct Merchant Voice Hotline</h4>
              <p className="text-xs text-gray-500 mt-1 max-w-md mx-auto">
                Speak directly with an L2 hardware technician or POS account manager for urgent business interruptions.
              </p>
            </div>
            <div className="inline-block p-4 bg-white border border-emerald-200 rounded-2xl shadow-2xs">
              <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">India Toll-Free Number</p>
              <p className="text-2xl font-black text-emerald-700 mt-0.5 tracking-wider">+91 1800 123 4567</p>
              <p className="text-[10px] text-emerald-600 font-semibold mt-1 flex items-center justify-center gap-1">
                <CheckCircle size={11} /> 24x7 Priority Retail Line Available
              </p>
            </div>
            <div>
              <a
                href="tel:18001234567"
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs transition-all"
              >
                <Phone size={14} />
                <span>Call Hotline Now</span>
              </a>
            </div>
          </div>
        )}

        {/* Email Support Section */}
        {activeChannel === 'email' && (
          <div className="bg-gradient-to-br from-blue-50/60 to-white border border-blue-200/80 rounded-2xl p-6 text-center space-y-4">
            <div className="w-16 h-16 rounded-3xl bg-blue-500 text-white flex items-center justify-center mx-auto shadow-md">
              <Mail size={28} />
            </div>
            <div>
              <h4 className="text-base sm:text-lg font-extrabold text-gray-900">Email Engineering Desk</h4>
              <p className="text-xs text-gray-500 mt-1 max-w-md mx-auto">
                Send diagnostic logs, GST reconciliation statements, or peripheral driver inquiries to our support inbox.
              </p>
            </div>
            <div className="inline-block p-4 bg-white border border-blue-200 rounded-2xl shadow-2xs">
              <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Official Merchant Support Mail</p>
              <p className="text-xl font-black text-blue-700 mt-0.5">support@velqino.com</p>
              <p className="text-[10px] text-blue-600 font-semibold mt-1 flex items-center justify-center gap-1">
                <Clock size={11} /> Expected response within 2-4 hours
              </p>
            </div>
            <div>
              <a
                href="mailto:support@velqino.com?subject=Merchant%20Support%20Request"
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-xs transition-all"
              >
                <Mail size={14} />
                <span>Compose Email</span>
              </a>
            </div>
          </div>
        )}

        {/* Recent Tickets Section */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Ticket size={16} className="text-primary-600" />
              <h4 className="text-xs sm:text-sm font-extrabold text-gray-900">Recent Support Tickets</h4>
            </div>
            <button 
              type="button"
              onClick={() => setShowTicketForm(true)}
              className="text-xs font-bold text-primary-600 hover:text-primary-700 flex items-center gap-1"
            >
              <span>+ Raise New Ticket</span>
            </button>
          </div>

          <div className="space-y-2.5">
            {recentTickets.map((ticket) => (
              <div 
                key={ticket.id} 
                className="flex items-center justify-between p-3.5 bg-gray-50/70 rounded-2xl border border-gray-200/70 hover:border-gray-300 transition-all"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-extrabold text-gray-900">{ticket.id}</span>
                    <span className="text-[10px] text-gray-400">• {ticket.date}</span>
                  </div>
                  <p className="text-xs text-gray-600 mt-0.5 font-medium">{ticket.subject}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full capitalize ${
                    ticket.status === 'resolved' 
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                      : ticket.status === 'in-progress' 
                      ? 'bg-blue-50 text-blue-700 border border-blue-200' 
                      : 'bg-amber-50 text-amber-700 border border-amber-200'
                  }`}>
                    {ticket.status}
                  </span>
                  <ChevronRight size={14} className="text-gray-400" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Ticket Form Modal */}
      {showTicketForm && !ticketSubmitted && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-gray-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-2xl bg-primary-50 text-primary-600 flex items-center justify-center">
                  <Ticket size={18} />
                </div>
                <div>
                  <h4 className="text-base font-extrabold text-gray-900">Raise Support Ticket</h4>
                  <p className="text-[11px] text-gray-400">Tracked in our merchant resolution system</p>
                </div>
              </div>
              <button 
                type="button" 
                onClick={() => setShowTicketForm(false)} 
                className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-3.5 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Merchant Name *</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:outline-none focus:border-primary-500"
                  />
                </div>
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Email Address *</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:outline-none focus:border-primary-500"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Subject / Summary *</label>
                <input
                  type="text"
                  placeholder="e.g. ESC/POS thermal printer driver paper jam alert"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:outline-none focus:border-primary-500"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Priority Level</label>
                <select
                  value={formData.priority}
                  onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:outline-none focus:border-primary-500"
                >
                  <option value="low">Low - General feature inquiry</option>
                  <option value="medium">Medium - Configuration assistance</option>
                  <option value="high">High - Checkout or POS counter blocked</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Detailed Description *</label>
                <textarea
                  rows={4}
                  placeholder="Provide complete steps, error messages, or affected billing terminal ID..."
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:outline-none focus:border-primary-500 resize-none"
                />
              </div>

              <div className="flex items-center gap-2 p-2.5 bg-gray-50 rounded-xl border border-gray-200/60 text-gray-500">
                <Paperclip size={14} className="text-gray-400" />
                <span className="text-[11px]">Attachment support active (Max 10MB per ticket)</span>
              </div>
            </div>

            <div className="flex gap-2.5 pt-2">
              <button 
                type="button" 
                onClick={() => setShowTicketForm(false)} 
                className="flex-1 px-4 py-2.5 text-xs font-bold text-gray-700 bg-white border border-gray-200 rounded-xl hover:bg-gray-50"
              >
                Cancel
              </button>
              <button 
                type="button" 
                onClick={handleSubmitTicket} 
                className="flex-1 px-4 py-2.5 text-xs font-bold bg-primary-600 text-white rounded-xl hover:bg-primary-700 shadow-xs flex items-center justify-center gap-2"
              >
                <Send size={13} />
                <span>Submit Ticket</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Ticket Submitted Success Modal */}
      {ticketSubmitted && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 text-center shadow-2xl border border-gray-200 space-y-3">
            <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto shadow-2xs">
              <CheckCircle size={30} />
            </div>
            <h4 className="text-base font-extrabold text-gray-900">Ticket Dispatched!</h4>
            <p className="text-xs text-gray-500 leading-relaxed">
              Your support ticket has been registered in the queue. A technical engineer will investigate and respond.
            </p>
            <div className="p-2.5 bg-gray-50 rounded-xl border border-gray-200/80 font-mono text-xs font-bold text-gray-800">
              Tracking ID: {generatedTicketId}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
