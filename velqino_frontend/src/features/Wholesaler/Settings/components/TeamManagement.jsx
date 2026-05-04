"use client"

import React, { useState, useEffect } from 'react'
import {
  Users,
  UserPlus,
  Mail,
  Shield,
  Clock,
  Eye,
  Edit,
  Trash2,
  MoreVertical,
  CheckCircle,
  XCircle,
  RefreshCw,
  Search,
  Filter,
  Crown,
  Settings,
  Activity,
  Calendar,
  X
} from '../../../../utils/icons'
import { useUpdateProfileMutation } from '@/redux/wholesaler/slices/wholesalerSlice'
import { toast } from 'react-toastify'
import '../../../../styles/Wholesaler/Settings/TeamManagement.scss'

export default function TeamManagement({ wholesaler, isLoading: parentLoading }) {
  const [showInviteModal, setShowInviteModal] = useState(false)
  const [showRoleModal, setShowRoleModal] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedMember, setSelectedMember] = useState(null)
  const [isSaving, setIsSaving] = useState(false)

  const [updateProfile, { isLoading: isUpdating }] = useUpdateProfileMutation()

  const [teamMembers, setTeamMembers] = useState([])
  const [activityLog, setActivityLog] = useState([])

  const [inviteData, setInviteData] = useState({
    email: '',
    role: 'viewer',
    name: ''
  })

  const roles = [
    { id: 'owner', label: 'Owner', icon: Crown, description: 'Full access to all features', level: 5 },
    { id: 'admin', label: 'Admin', icon: Shield, description: 'All features except account deletion', level: 4 },
    { id: 'manager', label: 'Manager', icon: Settings, description: 'Manage orders, products, inventory', level: 3 },
    { id: 'support', label: 'Support', icon: Users, description: 'View and process orders', level: 2 },
    { id: 'viewer', label: 'Viewer', icon: Eye, description: 'Read-only access to reports', level: 1 }
  ]

  // Load team data from backend
  useEffect(() => {
    if (wholesaler?.team_settings) {
      const teamData = wholesaler.team_settings
      setTeamMembers(teamData.team_members || [])
      setActivityLog(teamData.activity_log || [])
    }
  }, [wholesaler])

  const saveTeamData = async (updatedMembers, updatedLog) => {
    setIsSaving(true)
    try {
      const formData = new FormData()
      formData.append('team_settings', JSON.stringify({
        team_members: updatedMembers,
        activity_log: updatedLog
      }))

      const userId = wholesaler?.user_id || wholesaler?.id
      await updateProfile({ userId: userId, data: formData }).unwrap()
      toast.success('Team settings updated successfully!')
    } catch (error) {
      toast.error(error?.data?.message || 'Failed to update team settings')
    } finally {
      setIsSaving(false)
    }
  }

  const handleInvite = () => {
    const newMember = {
      id: Date.now(),
      name: inviteData.name || inviteData.email.split('@')[0],
      email: inviteData.email,
      role: roles.find(r => r.id === inviteData.role)?.label || 'Viewer',
      roleLevel: inviteData.role,
      avatar: inviteData.name?.substring(0, 2).toUpperCase() || inviteData.email.substring(0, 2).toUpperCase(),
      status: 'Pending',
      lastActive: 'Invitation sent',
      joined: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      permissions: []
    }
    
    const newActivity = {
      id: Date.now(),
      user: wholesaler?.business_name || 'Owner',
      action: 'Invited new team member',
      target: newMember.name,
      date: new Date().toLocaleString(),
      type: 'add'
    }
    
    const updatedMembers = [...teamMembers, newMember]
    const updatedLog = [newActivity, ...activityLog]
    
    setTeamMembers(updatedMembers)
    setActivityLog(updatedLog)
    saveTeamData(updatedMembers, updatedLog)
    
    setShowInviteModal(false)
    setInviteData({ email: '', role: 'viewer', name: '' })
    toast.success(`Invitation sent to ${inviteData.email}`)
  }

  const handleRemoveMember = (memberId, memberName) => {
    if (confirm(`Are you sure you want to remove ${memberName} from the team?`)) {
      const updatedMembers = teamMembers.filter(m => m.id !== memberId)
      const newActivity = {
        id: Date.now(),
        user: wholesaler?.business_name || 'Owner',
        action: 'Removed team member',
        target: memberName,
        date: new Date().toLocaleString(),
        type: 'remove'
      }
      const updatedLog = [newActivity, ...activityLog]
      
      setTeamMembers(updatedMembers)
      setActivityLog(updatedLog)
      saveTeamData(updatedMembers, updatedLog)
      toast.success(`${memberName} removed from team`)
    }
  }

  const handleUpdateRole = (memberId, newRoleId) => {
    const member = teamMembers.find(m => m.id === memberId)
    if (!member) return
    
    const updatedMembers = teamMembers.map(m => 
      m.id === memberId 
        ? { 
            ...m, 
            role: roles.find(r => r.id === newRoleId)?.label, 
            roleLevel: newRoleId 
          } 
        : m
    )
    
    const newActivity = {
      id: Date.now(),
      user: wholesaler?.business_name || 'Owner',
      action: 'Updated role',
      target: `${member.name} → ${roles.find(r => r.id === newRoleId)?.label}`,
      date: new Date().toLocaleString(),
      type: 'role'
    }
    const updatedLog = [newActivity, ...activityLog]
    
    setTeamMembers(updatedMembers)
    setActivityLog(updatedLog)
    saveTeamData(updatedMembers, updatedLog)
    toast.success(`${member.name}'s role updated`)
  }

  const getRoleIcon = (roleLevel) => {
    const role = roles.find(r => r.id === roleLevel)
    const Icon = role?.icon || Shield
    return <Icon size={14} />
  }

  const getStatusBadge = (status) => {
    const styles = {
      Active: 'bg-success-100 text-success-700',
      Inactive: 'bg-gray-100 text-gray-700',
      Pending: 'bg-warning-100 text-warning-700'
    }
    return styles[status] || 'bg-gray-100 text-gray-700'
  }

  const filteredMembers = teamMembers.filter(member =>
    member.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    member.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    member.role?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  if (parentLoading) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/3 mx-auto mb-2"></div>
          <div className="h-3 bg-gray-200 rounded w-1/2 mx-auto"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="team-management bg-white rounded-xl border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="px-4 sm:px-6 py-4 border-b border-gray-200 bg-gray-50/50 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-primary-100 flex items-center justify-center text-primary-600">
            <Users size={20} />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-semibold text-gray-900">Team Management</h3>
            <p className="text-xs sm:text-sm text-gray-500">Manage team members, roles, and permissions</p>
          </div>
        </div>
        <button
          onClick={() => setShowInviteModal(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-primary-500 text-white text-sm rounded-lg hover:bg-primary-600 transition-all"
        >
          <UserPlus size={14} />
          Invite Member
        </button>
      </div>

      {/* Search */}
      <div className="p-4 border-b border-gray-200">
        <div className="relative">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name, email, or role..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-primary-500"
          />
        </div>
      </div>

      {/* Team Members Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Member</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Role</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Status</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Last Active</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Joined</th>
              <th className="w-20 px-4 py-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredMembers.length === 0 ? (
              <tr>
                <td colSpan="6" className="px-4 py-8 text-center text-gray-500">
                  No team members found
                </td>
              </tr>
            ) : (
              filteredMembers.map((member, index) => (
                <tr key={member.id} className="hover:bg-gray-50 transition-all" style={{ animationDelay: `${index * 0.05}s` }}>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-medium text-sm">
                        {member.avatar}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{member.name}</p>
                        <p className="text-xs text-gray-500">{member.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1.5">
                      {getRoleIcon(member.roleLevel)}
                      <select
                        value={member.roleLevel}
                        onChange={(e) => handleUpdateRole(member.id, e.target.value)}
                        className="text-sm text-gray-700 border-none bg-transparent focus:outline-none focus:ring-0"
                        disabled={member.roleLevel === 'owner'}
                      >
                        {roles.map(role => (
                          <option key={role.id} value={role.id}>{role.label}</option>
                        ))}
                      </select>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-block px-2 py-0.5 text-xs rounded-full ${getStatusBadge(member.status)}`}>
                      {member.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">{member.lastActive}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{member.joined}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      {member.roleLevel !== 'owner' && (
                        <button 
                          onClick={() => handleRemoveMember(member.id, member.name)}
                          className="p-1 text-gray-400 hover:text-error-600 rounded-lg"
                        >
                          <Trash2 size={14} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Roles & Permissions Section */}
      <div className="border-t border-gray-200">
        <div className="px-4 sm:px-6 py-3 bg-gray-50/50 border-b border-gray-200">
          <h4 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
            <Shield size={16} />
            Roles & Permissions
          </h4>
        </div>
        <div className="p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {roles.map(role => {
            const Icon = role.icon
            return (
              <div key={role.id} className="border border-gray-200 rounded-lg p-3 hover:border-primary-200 transition-all">
                <div className="flex items-center gap-2 mb-2">
                  <Icon size={16} className="text-primary-500" />
                  <span className="text-sm font-semibold text-gray-900">{role.label}</span>
                </div>
                <p className="text-xs text-gray-500 mb-2">{role.description}</p>
                <span className="text-xs text-gray-400">Level {role.level}</span>
              </div>
            )
          })}
        </div>
      </div>

      {/* Activity Log */}
      {activityLog.length > 0 && (
        <div className="border-t border-gray-200">
          <div className="px-4 sm:px-6 py-3 bg-gray-50/50 border-b border-gray-200">
            <h4 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
              <Activity size={16} />
              Activity Log
            </h4>
          </div>
          <div className="p-4 space-y-2 max-h-64 overflow-y-auto">
            {activityLog.slice(0, 10).map(activity => (
              <div key={activity.id} className="flex items-start gap-3 py-2 border-b border-gray-100 last:border-0">
                <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500">
                  <Activity size={14} />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-700">
                    <span className="font-medium">{activity.user}</span> {activity.action}{' '}
                    <span className="font-medium">{activity.target}</span>
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5">{activity.date}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Invite Member Modal */}
      {showInviteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowInviteModal(false)} />
          <div className="relative bg-white rounded-xl max-w-md w-full p-6 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Invite Team Member</h3>
              <button onClick={() => setShowInviteModal(false)} className="p-1 text-gray-400 hover:text-gray-600">
                <X size={20} />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <input
                  type="text"
                  value={inviteData.name}
                  onChange={(e) => setInviteData({ ...inviteData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-primary-500"
                  placeholder="Enter full name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                <input
                  type="email"
                  value={inviteData.email}
                  onChange={(e) => setInviteData({ ...inviteData, email: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-primary-500"
                  placeholder="Enter email address"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                <select
                  value={inviteData.role}
                  onChange={(e) => setInviteData({ ...inviteData, role: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-primary-500"
                >
                  {roles.map(role => (
                    <option key={role.id} value={role.id}>{role.label}</option>
                  ))}
                </select>
              </div>
              <button
                onClick={handleInvite}
                disabled={!inviteData.email || isSaving}
                className="w-full py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 disabled:opacity-50"
              >
                {isSaving ? 'Sending...' : 'Send Invitation'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}