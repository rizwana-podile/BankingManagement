import React, { useState, useEffect } from 'react';
import { ArrowRightLeft, Search, AlertTriangle, ShieldCheck, Flag, CheckCircle2 } from 'lucide-react';
import api from '../../services/api';
import { toast } from '../../components/common/Toast';

const StaffTransactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // 'all', 'high_value', 'suspicious', 'failed'
  const [search, setSearch] = useState('');

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const params = {};
      if (filter !== 'all') params.filter = filter;
      if (search) params.search = search;

      const res = await api.get('/staff/transactions', { params });
      if (res.data.success) {
        setTransactions(res.data.transactions);
      }
    } catch (err) {
      console.error('Error fetching transactions:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, [filter]);

  const handleToggleFlag = async (txnId, currentFlag) => {
    const reason = !currentFlag ? prompt('Reason for flagging as suspicious (AML compliance):', 'Abnormal transfer volume') : '';
    if (!currentFlag && reason === null) return;

    try {
      const res = await api.put(`/staff/transactions/${txnId}/flag`, {
        isSuspicious: !currentFlag,
        flaggedReason: reason
      });
      if (res.data.success) {
        toast.success(res.data.message);
        fetchTransactions();
      }
    } catch (err) {
      toast.error('Failed to update flag status');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-navy-950">Real-Time Transaction Monitoring</h1>
          <p className="text-xs text-slate-500 mt-1">Anti-Money Laundering (AML), high-value transfers, and fraud flagging desk</p>
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
            onKeyDown={(e) => e.key === 'Enter' && fetchTransactions()}
            placeholder="Search transaction ID, sender, receiver, account..."
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:bg-white"
          />
        </div>

        <div className="flex gap-2 text-xs">
          {[
            { id: 'all', label: 'All Transactions' },
            { id: 'high_value', label: 'High Value (≥ ₹1 Lakh)' },
            { id: 'suspicious', label: 'Suspicious / Flagged' },
            { id: 'failed', label: 'Failed' },
          ].map(f => (
            <button
              key={f.id}
              onClick={() => setFilter(f.id)}
              className={`px-3 py-2 rounded-xl font-semibold transition-all ${
                filter === f.id ? 'bg-navy-900 text-white shadow-xs' : 'bg-slate-50 border border-slate-200 text-slate-600 hover:text-navy-950'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Transactions Table */}
      <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] tracking-wider border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Date / Txn ID</th>
                <th className="py-3 px-4">Sender</th>
                <th className="py-3 px-4">Receiver</th>
                <th className="py-3 px-4">Rail</th>
                <th className="py-3 px-4 text-right">Amount</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4 text-center">AML Compliance</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-400">Monitoring transaction stream...</td>
                </tr>
              ) : transactions.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-400">No transactions recorded matching filter</td>
                </tr>
              ) : (
                transactions.map((t) => (
                  <tr key={t._id} className={`hover:bg-slate-50/80 transition-colors ${t.isSuspicious ? 'bg-rose-50/60' : ''}`}>
                    <td className="py-3 px-4 font-mono">
                      <p className="text-royal-700 font-bold">{t.transactionId}</p>
                      <span className="text-[10px] text-slate-400">{new Date(t.createdAt).toLocaleDateString()}</span>
                    </td>

                    <td className="py-3 px-4 text-slate-800">
                      <p className="font-semibold text-slate-900">{t.senderName}</p>
                      <span className="text-[10px] text-slate-400 font-mono">{t.senderAccountNumber}</span>
                    </td>

                    <td className="py-3 px-4 text-slate-800">
                      <p className="font-semibold text-slate-900">{t.receiverName}</p>
                      <span className="text-[10px] text-slate-400 font-mono">{t.receiverAccountNumber}</span>
                    </td>

                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700">
                        {t.channel}
                      </span>
                    </td>

                    <td className="py-3 px-4 text-right font-mono font-bold text-slate-900">
                      ₹{Number(t.amount).toLocaleString('en-IN')}
                    </td>

                    <td className="py-3 px-4 text-center">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        t.status === 'completed' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-rose-50 text-rose-700 border border-rose-200'
                      }`}>
                        {t.status.toUpperCase()}
                      </span>
                    </td>

                    <td className="py-3 px-4 text-center">
                      <button
                        onClick={() => handleToggleFlag(t._id, t.isSuspicious)}
                        className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold flex items-center space-x-1 mx-auto transition-colors ${
                          t.isSuspicious
                            ? 'bg-rose-600 text-white'
                            : 'bg-slate-100 text-slate-600 hover:text-rose-600'
                        }`}
                      >
                        <Flag className="w-3.5 h-3.5" />
                        <span>{t.isSuspicious ? 'Flagged AML' : 'Flag'}</span>
                      </button>
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

export default StaffTransactions;