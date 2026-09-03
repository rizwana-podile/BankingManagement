import React, { useState } from 'react';
import { Radio, Send, CheckCircle2, AlertTriangle, ShieldCheck, Bell } from 'lucide-react';
import api from '../../services/api';
import { toast } from '../../components/common/Toast';

const AdminBroadcast = () => {
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [targetRole, setTargetRole] = useState('all'); // 'all', 'customer', 'employee'
  const [type, setType] = useState('system'); // 'system', 'security'
  const [loading, setLoading] = useState(false);

  const handleBroadcast = async (e) => {
    e.preventDefault();
    if (!title || !message) {
      toast.error('Title and message are required');
      return;
    }
    setLoading(true);
    try {
      const res = await api.post('/admin/broadcast', { title, message, targetRole, type });
      if (res.data.success) {
        toast.success('System broadcast published across bank networks!');
        setTitle('');
        setMessage('');
      }
    } catch (err) {
      toast.error('Failed to dispatch broadcast');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-navy-950">System Broadcast Dispatcher</h1>
        <p className="text-xs text-slate-500 mt-1">Publish global bank announcements, scheduled maintenance windows, and security alerts</p>
      </div>

      <div className="p-6 sm:p-8 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-5">
        <div className="flex items-center space-x-3 border-b border-slate-100 pb-4">
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center font-bold">
            <Radio className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-base text-navy-950">Create Enterprise Notification</h3>
            <p className="text-xs text-slate-500">Targeted recipients will receive instant alerts on next sync</p>
          </div>
        </div>

        <form onSubmit={handleBroadcast} className="space-y-4 text-xs">
          <div>
            <label className="block text-slate-700 mb-1 font-bold">Broadcast Target Audience</label>
            <select
              value={targetRole}
              onChange={(e) => setTargetRole(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:bg-white"
            >
              <option value="all">All Banking Users (Customers + Employees)</option>
              <option value="customer">Retail & Corporate Customers Only</option>
              <option value="employee">Bank Staff & Branch Officers Only</option>
            </select>
          </div>

          <div>
            <label className="block text-slate-700 mb-1 font-bold">Alert Severity / Category</label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:bg-white"
            >
              <option value="system">Scheduled Maintenance / System General Notice</option>
              <option value="security">Urgent Security Alert / Mandatory Policy Update</option>
            </select>
          </div>

          <div>
            <label className="block text-slate-700 mb-1 font-bold">Notification Title</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Scheduled Core Banking Maintenance Notice"
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 font-medium focus:bg-white"
            />
          </div>

          <div>
            <label className="block text-slate-700 mb-1 font-bold">Notification Message Content</label>
            <textarea
              rows={4}
              required
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Scheduled maintenance will occur on Sunday from 1:00 AM to 3:00 AM IST. Card ATM services will remain operational."
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 leading-relaxed focus:bg-white"
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 rounded-xl font-bold bg-navy-900 hover:bg-royal-800 text-white shadow-xs flex items-center justify-center space-x-2 transition-all"
            >
              {loading ? (
                <span>Dispatching Broadcast...</span>
              ) : (
                <>
                  <span>Dispatch Bank-Wide Notification</span>
                  <Send className="w-4 h-4 ml-1" />
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminBroadcast;