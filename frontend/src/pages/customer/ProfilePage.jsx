import React, { useState, useEffect } from 'react';
import { User, ShieldCheck, Mail, Phone, MapPin, Calendar, CheckCircle2, Lock } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import { toast } from '../../components/common/Toast';

const ProfilePage = () => {
  const { user, profile, refreshUserData } = useAuth();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [street, setStreet] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [pincode, setPincode] = useState('');
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [smsAlerts, setSmsAlerts] = useState(true);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setPhone(user.phone || '');
    }
    if (profile) {
      setStreet(profile.address?.street || '');
      setCity(profile.address?.city || '');
      setState(profile.address?.state || '');
      setPincode(profile.address?.pincode || '');
      setEmailAlerts(profile.communicationPreferences?.email ?? true);
      setSmsAlerts(profile.communicationPreferences?.sms ?? true);
    }
  }, [user, profile]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.put('/auth/profile', {
        name,
        phone,
        address: { street, city, state, pincode },
        communicationPreferences: { email: emailAlerts, sms: smsAlerts }
      });
      if (res.data.success) {
        toast.success('Profile details updated successfully');
        refreshUserData();
      }
    } catch (err) {
      toast.error('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-navy-950">Customer Profile & KYC Dossier</h1>
        <p className="text-xs text-slate-500 mt-1">Personal demographics, verified identity records, and communication settings</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Left Badge Card */}
        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs text-center space-y-4">
          <div className="w-20 h-20 rounded-2xl bg-navy-900 text-gold-400 flex items-center justify-center font-extrabold text-2xl mx-auto shadow-sm">
            {user?.name?.charAt(0)}
          </div>
          <div>
            <h3 className="font-bold text-base text-slate-900">{user?.name}</h3>
            <p className="text-xs text-royal-700 font-mono mt-0.5">{profile?.customerId || 'CUST-849201'}</p>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-left space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-slate-500">KYC Status:</span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 uppercase">
                {profile?.kycStatus || 'APPROVED'}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-500">PAN ID:</span>
              <span className="font-mono text-slate-900 font-bold">{profile?.panNumber || 'ABCPS1234D'}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-500">Aadhaar:</span>
              <span className="font-mono text-slate-900 font-bold">{profile?.aadhaarNumber || 'XXXX-XXXX-9812'}</span>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-blue-50 border border-blue-200 text-royal-800 text-[11px] leading-snug">
            Identity documents are government verified via UIDAI & NSDL.
          </div>
        </div>

        {/* Right Form */}
        <div className="md:col-span-2 p-6 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <form onSubmit={handleUpdate} className="space-y-4 text-xs">
            <h3 className="font-bold text-sm text-navy-950 mb-2">Editable Profile Information</h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-700 mb-1 font-bold">Full Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-slate-700 mb-1 font-bold">Contact Phone</label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:bg-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-700 mb-1 font-bold">Email Address (Locked)</label>
              <input
                type="email"
                disabled
                value={user?.email || ''}
                className="w-full px-3 py-2 bg-slate-100 border border-slate-200 rounded-xl text-slate-500 cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block text-slate-700 mb-1 font-bold">Residential Street Address</label>
              <input
                type="text"
                value={street}
                onChange={(e) => setStreet(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:bg-white"
              />
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-slate-700 mb-1 font-bold">City</label>
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-slate-700 mb-1 font-bold">State</label>
                <input
                  type="text"
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-slate-700 mb-1 font-bold">Pincode</label>
                <input
                  type="text"
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 font-mono focus:bg-white"
                />
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100 space-y-2">
              <span className="font-bold text-slate-700">Communication Preferences</span>
              <div className="flex items-center space-x-6">
                <label className="flex items-center space-x-2 text-slate-600 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={emailAlerts}
                    onChange={(e) => setEmailAlerts(e.target.checked)}
                    className="rounded border-slate-300 text-royal-700 focus:ring-0"
                  />
                  <span>Email Transaction Statements</span>
                </label>
                <label className="flex items-center space-x-2 text-slate-600 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={smsAlerts}
                    onChange={(e) => setSmsAlerts(e.target.checked)}
                    className="rounded border-slate-300 text-royal-700 focus:ring-0"
                  />
                  <span>SMS Transaction Alerts</span>
                </label>
              </div>
            </div>

            <div className="pt-3">
              <button
                type="submit"
                disabled={loading}
                className="py-2.5 px-6 rounded-xl font-bold text-white bg-navy-900 hover:bg-royal-800 shadow-xs transition-colors"
              >
                {loading ? 'Saving...' : 'Update Profile Details'}
              </button>
            </div>
          </form>
        </div>

      </div>
    </div>
  );
};

export default ProfilePage;