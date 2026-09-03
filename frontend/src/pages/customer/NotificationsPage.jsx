import React, { useState } from 'react';
import { Bell, CheckCheck, Trash2, Shield, CreditCard, PiggyBank, Briefcase, Zap, Info } from 'lucide-react';
import { useNotifications } from '../../context/NotificationContext';

const NotificationsPage = () => {
  const { notifications, unreadCount, markAsRead, markAllAsRead, deleteNotification } = useNotifications();
  const [filter, setFilter] = useState('all'); // 'all', 'transaction', 'security', 'loan', 'system'

  const filtered = filter === 'all'
    ? notifications
    : notifications.filter(n => n.type === filter);

  const getIcon = (type) => {
    switch (type) {
      case 'transaction': return <Zap className="w-4 h-4 text-emerald-600" />;
      case 'security': return <Shield className="w-4 h-4 text-rose-600" />;
      case 'loan': return <Briefcase className="w-4 h-4 text-purple-600" />;
      case 'deposit': return <PiggyBank className="w-4 h-4 text-amber-600" />;
      case 'card': return <CreditCard className="w-4 h-4 text-royal-700" />;
      default: return <Info className="w-4 h-4 text-blue-600" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-navy-950">Notifications Center</h1>
          <p className="text-xs text-slate-500 mt-1">Real-time alerts, transfer debits/credits, security notices & broadcasts</p>
        </div>
        {notifications.length > 0 && (
          <button
            onClick={markAllAsRead}
            className="px-4 py-2 rounded-xl text-xs font-semibold bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 shadow-xs flex items-center space-x-1.5 self-start sm:self-auto transition-colors"
          >
            <CheckCheck className="w-4 h-4 text-royal-700" />
            <span>Mark All as Read</span>
          </button>
        )}
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2 p-1.5 bg-slate-100 rounded-xl border border-slate-200 text-xs">
        {['all', 'transaction', 'security', 'loan', 'system'].map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`py-1.5 px-3 rounded-lg capitalize font-semibold transition-all ${
              filter === f ? 'bg-navy-900 text-white shadow-xs' : 'text-slate-600 hover:text-navy-950'
            }`}
          >
            {f === 'all' ? 'All Alerts' : f}
          </button>
        ))}
      </div>

      {/* Notifications List */}
      <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-3">
        {filtered.length === 0 ? (
          <div className="py-12 text-center text-slate-400 text-xs">
            No notifications in this category
          </div>
        ) : (
          filtered.map((n) => (
            <div
              key={n._id}
              className={`p-4 rounded-xl border transition-all flex items-start justify-between gap-4 ${
                !n.isRead
                  ? 'bg-blue-50/50 border-blue-200'
                  : 'bg-white border-slate-100 hover:border-slate-200'
              }`}
            >
              <div className="flex items-start space-x-3.5">
                <div className="p-2 rounded-xl bg-slate-100 border border-slate-200 shrink-0 mt-0.5">
                  {getIcon(n.type)}
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <h4 className="font-bold text-xs text-navy-950">{n.title}</h4>
                    {!n.isRead && (
                      <span className="w-2 h-2 rounded-full bg-royal-600 inline-block" />
                    )}
                  </div>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">{n.message}</p>
                  <span className="text-[10px] text-slate-400 font-mono mt-2 block">
                    {new Date(n.createdAt).toLocaleDateString()} at {new Date(n.createdAt).toLocaleTimeString()}
                  </span>
                </div>
              </div>

              <div className="flex items-center space-x-2 shrink-0">
                {!n.isRead && (
                  <button
                    onClick={() => markAsRead(n._id)}
                    className="text-[11px] text-royal-700 hover:text-navy-900 font-semibold px-2 py-1 rounded bg-blue-50 border border-blue-200"
                  >
                    Mark read
                  </button>
                )}
                <button
                  onClick={() => deleteNotification(n._id)}
                  className="text-slate-400 hover:text-rose-600 p-1 rounded"
                  title="Delete"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default NotificationsPage;