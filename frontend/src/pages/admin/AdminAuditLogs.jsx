import React, { useState, useEffect } from 'react';
import { Shield, Search, Filter, RefreshCw, Calendar } from 'lucide-react';
import api from '../../services/api';

const AdminAuditLogs = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionFilter, setActionFilter] = useState('all');
  const [roleFilter, setRoleFilter] = useState('all');
  const [search, setSearch] = useState('');

  const fetchAuditLogs = async () => {
    try {
      setLoading(true);
      const params = {};
      if (actionFilter !== 'all') params.action = actionFilter;
      if (roleFilter !== 'all') params.role = roleFilter;
      if (search) params.search = search;

      const res = await api.get('/admin/audit-logs', { params });
      if (res.data.success) {
        setLogs(res.data.logs);
      }
    } catch (err) {
      console.error('Error fetching audit logs:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAuditLogs();
  }, [actionFilter, roleFilter]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-navy-950">Immutable Security Audit Trail</h1>
          <p className="text-xs text-slate-500 mt-1">Chronological ledger of user logins, fund transfers, approvals, and administrative actions</p>
        </div>
      </div>

      {/* Filter and Search */}
      <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col md:flex-row gap-4 justify-between">
        <div className="flex-1 relative">
          <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && fetchAuditLogs()}
            placeholder="Search audit details, actor name, or action keyword..."
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:bg-white"
          />
        </div>

        <div className="flex gap-2 text-xs">
          <select
            value={actionFilter}
            onChange={(e) => setActionFilter(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 text-xs font-medium focus:bg-white"
          >
            <option value="all">All Actions</option>
            <option value="LOGIN">LOGIN</option>
            <option value="TRANSFER">TRANSFER</option>
            <option value="KYC_APPROVE">KYC_APPROVE</option>
            <option value="REVIEW_KYC">REVIEW_KYC</option>
            <option value="DISBURSE_LOAN">DISBURSE_LOAN</option>
            <option value="ACCOUNT_FREEZE">ACCOUNT_FREEZE</option>
            <option value="CREATE_USER">CREATE_USER</option>
          </select>

          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 text-xs font-medium focus:bg-white"
          >
            <option value="all">All Actor Roles</option>
            <option value="customer">Customer</option>
            <option value="employee">Employee</option>
            <option value="admin">Administrator</option>
          </select>
        </div>
      </div>

      {/* Audit Log Table */}
      <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] tracking-wider border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Timestamp / IP</th>
                <th className="py-3 px-4">Action Code</th>
                <th className="py-3 px-4">Actor Details</th>
                <th className="py-3 px-4">Target Entity</th>
                <th className="py-3 px-4">Operational Audit Trail</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-slate-400">Retrieving audit trail...</td>
                </tr>
              ) : logs.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-slate-400">No audit events found matching criteria</td>
                </tr>
              ) : (
                logs.map((log) => (
                  <tr key={log._id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4 font-mono">
                      <p className="text-slate-800 font-medium">{new Date(log.timestamp).toLocaleDateString()} {new Date(log.timestamp).toLocaleTimeString()}</p>
                      <span className="text-[10px] text-slate-400 font-mono">IP: {log.ipAddress}</span>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold font-mono bg-blue-50 text-royal-700 border border-blue-200">
                        {log.action}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-slate-800">
                      <p className="font-semibold text-slate-900">{log.performedBy?.name || 'System'}</p>
                      <span className="text-[10px] text-slate-400 capitalize">{log.performedBy?.role || 'Daemon'}</span>
                    </td>

                    <td className="py-3.5 px-4 text-slate-700 font-mono font-medium">
                      {log.entity}
                    </td>

                    <td className="py-3.5 px-4 text-slate-600 leading-relaxed max-w-sm">
                      {log.details}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminAuditLogs;