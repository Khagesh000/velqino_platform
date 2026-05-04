"use client"

import React, { useState } from 'react'
import {
  Lock,
  Shield,
  Smartphone,
  Laptop,
  History,
  Eye,
  EyeOff,
  CheckCircle,
  AlertCircle,
  RefreshCw,
  X,
  Mail,
  Globe,
  Clock
} from '../../../../utils/icons'
import { useChangePasswordMutation } from '@/redux/wholesaler/slices/wholesalerSlice'
import { toast } from 'react-toastify'
import '../../../../styles/Wholesaler/Settings/AccountSecurity.scss'

export default function AccountSecurity({ user, isLoading: parentLoading }) {
  const [showPassword, setShowPassword] = useState(false)
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })
  const [passwordError, setPasswordError] = useState('')
  const [passwordSuccess, setPasswordSuccess] = useState(false)
  const [isChangingPassword, setIsChangingPassword] = useState(false)
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false)
  const [show2FAModal, setShow2FAModal] = useState(false)
  const [otpSent, setOtpSent] = useState(false)
  const [otpCode, setOtpCode] = useState('')
  const [verifying, setVerifying] = useState(false)

  const [changePassword, { isLoading: isChanging }] = useChangePasswordMutation()

  const loginHistory = [
    { id: 1, device: 'Chrome on Windows', location: 'Bangalore, India', ip: '192.168.1.1', date: '2024-03-22 10:30 AM', status: 'Current' },
    { id: 2, device: 'Safari on iPhone', location: 'Mumbai, India', ip: '10.0.0.1', date: '2024-03-21 08:15 PM', status: 'Active' },
    { id: 3, device: 'Firefox on Mac', location: 'Delhi, India', ip: '172.16.0.1', date: '2024-03-20 02:45 PM', status: 'Expired' },
    { id: 4, device: 'Edge on Windows', location: 'Chennai, India', ip: '192.168.0.1', date: '2024-03-19 11:20 AM', status: 'Expired' }
  ]

  const devices = [
    { id: 1, name: 'Windows Laptop - Chrome', location: 'Bangalore, India', lastActive: 'Today 10:30 AM', isCurrent: true },
    { id: 2, name: 'iPhone 14 - Safari', location: 'Mumbai, India', lastActive: 'Yesterday 08:15 PM', isCurrent: false },
    { id: 3, name: 'MacBook Pro - Firefox', location: 'Delhi, India', lastActive: 'Mar 20, 2024', isCurrent: false }
  ]

  const handlePasswordChange = async () => {
    setPasswordError('')
    
    if (!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
      setPasswordError('Please fill all fields')
      return
    }
    
    if (passwordData.newPassword.length < 8) {
      setPasswordError('Password must be at least 8 characters')
      return
    }
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordError('New passwords do not match')
      return
    }
    
    setIsChangingPassword(true)
    try {
      await changePassword({
        old_password: passwordData.currentPassword,
        new_password: passwordData.newPassword
      }).unwrap()
      
      setPasswordSuccess(true)
      toast.success('Password changed successfully!')
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' })
      setTimeout(() => setPasswordSuccess(false), 3000)
    } catch (error) {
      setPasswordError(error?.data?.message || 'Failed to change password')
      toast.error(error?.data?.message || 'Failed to change password')
    } finally {
      setIsChangingPassword(false)
    }
  }

  const handleEnable2FA = () => {
    setOtpSent(true)
  }

  const handleVerifyOTP = () => {
    if (!otpCode) return
    setVerifying(true)
    setTimeout(() => {
      setVerifying(false)
      setTwoFactorEnabled(true)
      setShow2FAModal(false)
      setOtpSent(false)
      setOtpCode('')
      toast.success('2FA enabled successfully!')
    }, 1500)
  }

  const handleDisable2FA = () => {
    setTwoFactorEnabled(false)
    toast.success('2FA disabled successfully!')
  }

  const handleLogoutDevice = (deviceId) => {
    toast.info('Device logged out successfully')
  }

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
    <div className="account-security bg-white rounded-xl border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="px-4 sm:px-6 py-4 border-b border-gray-200 bg-gray-50/50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-primary-100 flex items-center justify-center text-primary-600">
            <Shield size={20} />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-semibold text-gray-900">Account Security</h3>
            <p className="text-xs sm:text-sm text-gray-500">Manage password, 2FA, and connected devices</p>
          </div>
        </div>
      </div>

      <div className="p-4 sm:p-6 space-y-6">
        {/* Change Password */}
        <div className="border border-gray-200 rounded-xl overflow-hidden">
          <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
            <h4 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
              <Lock size={16} className="text-gray-500" />
              Change Password
            </h4>
          </div>
          <div className="p-4 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={passwordData.currentPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                  className="w-full px-3 py-2 pr-10 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-primary-500"
                  placeholder="Enter current password"
                />
                <button
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
              <input
                type={showPassword ? 'text' : 'password'}
                value={passwordData.newPassword}
                onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-primary-500"
                placeholder="Enter new password (min 8 characters)"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
              <input
                type={showPassword ? 'text' : 'password'}
                value={passwordData.confirmPassword}
                onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-primary-500"
                placeholder="Confirm new password"
              />
            </div>
            {passwordError && (
              <div className="flex items-center gap-2 text-error-600 text-sm">
                <AlertCircle size={14} />
                <span>{passwordError}</span>
              </div>
            )}
            {passwordSuccess && (
              <div className="flex items-center gap-2 text-success-600 text-sm">
                <CheckCircle size={14} />
                <span>Password changed successfully!</span>
              </div>
            )}
            <button
              onClick={handlePasswordChange}
              disabled={isChangingPassword}
              className="px-4 py-2 bg-primary-500 text-white text-sm rounded-lg hover:bg-primary-600 transition-all disabled:opacity-50 flex items-center gap-2"
            >
              {isChangingPassword ? (
                <>
                  <RefreshCw size={14} className="animate-spin" />
                  Changing...
                </>
              ) : (
                'Update Password'
              )}
            </button>
          </div>
        </div>

        {/* Two-Factor Authentication */}
        <div className="border border-gray-200 rounded-xl overflow-hidden">
          <div className="px-4 py-3 bg-gray-50 border-b border-gray-200 flex items-center justify-between">
            <h4 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
              <Smartphone size={16} className="text-gray-500" />
              Two-Factor Authentication
            </h4>
            {twoFactorEnabled ? (
              <span className="px-2 py-0.5 bg-success-100 text-success-700 text-xs rounded-full">Enabled</span>
            ) : (
              <span className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded-full">Disabled</span>
            )}
          </div>
          <div className="p-4">
            <p className="text-sm text-gray-600 mb-3">
              {twoFactorEnabled 
                ? '2FA is enabled. Your account is protected with an additional layer of security.'
                : 'Add an extra layer of security to your account by enabling two-factor authentication.'}
            </p>
            {!twoFactorEnabled ? (
              <button
                onClick={() => setShow2FAModal(true)}
                className="px-4 py-2 bg-primary-500 text-white text-sm rounded-lg hover:bg-primary-600 transition-all"
              >
                Enable 2FA
              </button>
            ) : (
              <button
                onClick={handleDisable2FA}
                className="px-4 py-2 bg-white border border-gray-200 text-gray-700 text-sm rounded-lg hover:bg-gray-50 transition-all"
              >
                Disable 2FA
              </button>
            )}
          </div>
        </div>

        {/* Device Management */}
        <div className="border border-gray-200 rounded-xl overflow-hidden">
          <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
            <h4 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
              <Laptop size={16} className="text-gray-500" />
              Device Management
            </h4>
          </div>
          <div className="divide-y divide-gray-200">
            {devices.map(device => (
              <div key={device.id} className="p-4 flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <Laptop size={18} className="text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">{device.name}</p>
                    <p className="text-xs text-gray-500">{device.location}</p>
                    <p className="text-xs text-gray-400 mt-1">Last active: {device.lastActive}</p>
                  </div>
                </div>
                {device.isCurrent ? (
                  <span className="text-xs text-primary-600">Current Device</span>
                ) : (
                  <button
                    onClick={() => handleLogoutDevice(device.id)}
                    className="text-xs text-error-600 hover:text-error-700"
                  >
                    Logout
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Login History */}
        <div className="border border-gray-200 rounded-xl overflow-hidden">
          <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
            <h4 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
              <History size={16} className="text-gray-500" />
              Login History
            </h4>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr className="border-b border-gray-200">
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Device</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Location</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">IP Address</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Date & Time</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {loginHistory.map(login => (
                  <tr key={login.id} className="hover:bg-gray-50">
                    <td className="px-4 py-2 text-sm text-gray-700">{login.device}</td>
                    <td className="px-4 py-2 text-sm text-gray-600">{login.location}</td>
                    <td className="px-4 py-2 text-sm text-gray-600">{login.ip}</td>
                    <td className="px-4 py-2 text-sm text-gray-600">{login.date}</td>
                    <td className="px-4 py-2">
                      <span className={`inline-block px-2 py-0.5 text-xs rounded-full ${
                        login.status === 'Current' ? 'bg-primary-100 text-primary-700' :
                        login.status === 'Active' ? 'bg-success-100 text-success-700' :
                        'bg-gray-100 text-gray-600'
                      }`}>
                        {login.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* 2FA Setup Modal */}
      {show2FAModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShow2FAModal(false)} />
          <div className="relative bg-white rounded-xl max-w-md w-full p-6 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Set Up Two-Factor Authentication</h3>
              <button onClick={() => setShow2FAModal(false)} className="p-1 text-gray-400 hover:text-gray-600">
                <X size={20} />
              </button>
            </div>

            {!otpSent ? (
              <div className="space-y-4">
                <div className="text-center">
                  <Shield size={48} className="mx-auto text-primary-500 mb-3" />
                  <p className="text-sm text-gray-600 mb-2">
                    Scan the QR code with your authenticator app
                  </p>
                  <div className="bg-gray-100 w-32 h-32 mx-auto rounded-lg flex items-center justify-center text-2xl font-mono">
                    QR CODE
                  </div>
                  <p className="text-xs text-gray-500 mt-2">Or enter code: <span className="font-mono">1234 5678 9012 3456</span></p>
                </div>
                <button
                  onClick={handleEnable2FA}
                  className="w-full py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600"
                >
                  I've Scanned the Code
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <p className="text-sm text-gray-600">Enter the 6-digit code from your authenticator app</p>
                <input
                  type="text"
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value)}
                  placeholder="000000"
                  maxLength={6}
                  className="w-full px-3 py-2 text-center text-2xl tracking-widest border border-gray-200 rounded-lg focus:outline-none focus:border-primary-500"
                />
                <button
                  onClick={handleVerifyOTP}
                  disabled={!otpCode || verifying}
                  className="w-full py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {verifying ? (
                    <>
                      <RefreshCw size={14} className="animate-spin" />
                      Verifying...
                    </>
                  ) : (
                    'Verify & Enable'
                  )}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}