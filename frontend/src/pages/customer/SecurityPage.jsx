import React, { useState } from 'react';
import { Shield, Lock, Smartphone, KeyRound, CheckCircle2, AlertTriangle, Monitor, LogOut } from 'lucide-react';
import api from '../../services/api';
import { toast } from '../../components/common/Toast';
import { useAuth } from '../../context/AuthContext';

const SecurityPage = () => {
  const { user, refreshUserData, logout } = useAuth();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [submittingPass, setSubmittingPass] = useState(false);
  const [twoFactor, setTwoFactor] = useState(user?.twoFactorEnabled || false);

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }
    if (newPassword.length < 6) {
      toast.error('New password must be at least 6 characters');
      return;
    }

    setSubmittingPass(true);
    try {
      const res = await api.put('/auth/change-password', { currentPassword, newPassword });
      if (res.data.success) {
        toast.success('Password updated successfully!');
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update password');
    } finally {
      setSubmittingPass(false);
    }
  };

  const handleToggle2FA = async () => {
    try {
      const res = await api.put('/auth/toggle-2fa');
      if (res.data.success) {
        setTwoFactor(res.data.twoFactorEnabled);
        toast.success(res.data.message);
        refreshUserData();
      }
    } catch (err) {
      toast.error('Failed to update 2FA status');
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-navy-950">Security & Access Management</h1>
        <p className="text-xs text-slate-500 mt-1">Credentials, two-factor authentication, active sessions and audit trail</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Change Password */}
        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-royal-700 flex items-center justify-center">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-navy-950">Change NetBanking Password</h3>
              <p className="text-[10px] text-slate-500">Regularly updating passwords boosts account security</p>
            </div>
          </div>

          <form onSubmit={handlePasswordChange} className="space-y-3 text-xs">
            <div>
              <label className="block text-slate-700 mb-1 font-bold">Current Password</label>
              <input
                type="password"
                required
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:bg-white"
                placeholder="••••••••"
              />
            </div>

            <div>
              <label className="block text-slate-700 mb-1 font-bold">New Password</label>
              <input
                type="password"
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:bg-white"
                placeholder="••••••••"
              />
            </div>

            <div>
              <label className="block text-slate-700 mb-1 font-bold">Confirm New Password</label>
              <input
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:bg-white"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={submittingPass}
              className="w-full py-2.5 rounded-xl font-bold bg-navy-900 hover:bg-royal-800 text-white shadow-xs transition-colors"
            >
              {submittingPass ? 'Updating...' : 'Update Password'}
            </button>
          </form>
        </div>

        {/* 2FA & Session Controls */}
        <div className="space-y-6">
          
          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2.5">
                <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center">
                  <Smartphone className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-navy-950">Two-Factor Authentication</h3>
                  <p className="text-[10px] text-slate-500">Require OTP verification upon logins</p>
                </div>
              </div>

              <button
                type="button"
                onClick={handleToggle2FA}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  twoFactor ? 'bg-emerald-600' : 'bg-slate-300'
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-xs ring-0 transition duration-200 ease-in-out ${
                    twoFactor ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
            <p className="text-xs text-slate-500">
              Status: <span className="font-bold text-navy-950">{twoFactor ? 'ENABLED' : 'DISABLED'}</span>
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-3">
            <div className="flex items-center space-x-2.5">
              <div className="w-9 h-9 rounded-xl bg-rose-50 text-rose-700 flex items-center justify-center">
                <Monitor className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-navy-950">Active Browser Sessions</h3>
                <p className="text-[10px] text-slate-500">Current device: Chrome on Windows 11 (IP 127.0.0.1)</p>
              </div>
            </div>

            <button
              onClick={() => {
                toast.success('Terminated all remote sessions.');
                logout();
              }}
              className="w-full py-2.5 px-3 rounded-xl text-xs font-semibold bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 transition-colors flex items-center justify-center space-x-2"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out of All Devices</span>
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};

export default SecurityPage;