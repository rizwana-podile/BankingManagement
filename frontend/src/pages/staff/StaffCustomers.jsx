import React, { useState, useEffect } from 'react';
import { Users, Search, Lock, Unlock, Eye, X, ShieldAlert, CheckCircle2 } from 'lucide-react';
import api from '../../services/api';
import { toast } from '../../components/common/Toast';

const StaffCustomers = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [customerDetails, setCustomerDetails] = useState(null);
  const [loadingDetails, setLoadingDetails] = useState(false);

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const params = {};
      if (search) params.search = search;
      if (statusFilter !== 'all') params.status = statusFilter;

      const res = await api.get('/staff/customers', { params });
      if (res.data.success) {
        setCustomers(res.data.customers);
      }
    } catch (err) {
      console.error('Error fetching customers:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, [statusFilter]);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchCustomers();
  };

  const handleToggleStatus = async (customerId, currentStatus) => {
    const newStatus = currentStatus === 'active' ? 'locked' : 'active';
    try {
      const res = await api.put(`/staff/customers/${customerId}/status`, { status: newStatus });
      if (res.data.success) {
        toast.success(res.data.message);
        fetchCustomers();
      }
    } catch (err) {
      toast.error('Failed to change customer status');
    }
  };

  const handleViewDetails = async (c) => {
    setSelectedCustomer(c);
    setLoadingDetails(true);
    try {
      const res = await api.get(`/staff/customers/${c._id}`);
      if (res.data.success) {
        setCustomerDetails(res.data.customer);
      }
    } catch (err) {
      toast.error('Failed to load full profile');
    } finally {
      setLoadingDetails(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-navy-950">Branch Customer Directory</h1>
          <p className="text-xs text-slate-500 mt-1">Look up accounts, inspect portfolios, and manage security locks</p>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col md:flex-row gap-4 justify-between">
        <form onSubmit={handleSearch} className="flex-1 relative">
          <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by customer name, email, phone, or customer ID..."
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:bg-white focus:ring-2 focus:ring-royal-600"
          />
        </form>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 text-xs font-medium focus:bg-white"
        >
          <option value="all">All Customer Statuses</option>
          <option value="active">Active Accounts</option>
          <option value="locked">Locked Accounts</option>
        </select>
      </div>

      {/* Customer Directory Table */}
      <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] tracking-wider border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Customer Name / ID</th>
                <th className="py-3 px-4">Contact Info</th>
                <th className="py-3 px-4">KYC State</th>
                <th className="py-3 px-4 text-right">Accounts & Balances</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-400">Loading customer records...</td>
                </tr>
              ) : customers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-400">No customers found matching criteria</td>
                </tr>
              ) : (
                customers.map((c) => (
                  <tr key={c._id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4">
                      <p className="font-bold text-slate-900">{c.name}</p>
                      <span className="text-[10px] font-mono text-royal-700">{c.customerId}</span>
                    </td>

                    <td className="py-3.5 px-4 text-slate-700">
                      <p>{c.email}</p>
                      <span className="text-[10px] text-slate-400">{c.phone}</span>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                        c.kycStatus === 'approved'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : c.kycStatus === 'under_review'
                          ? 'bg-blue-50 text-royal-700 border border-blue-200'
                          : 'bg-amber-50 text-amber-700 border border-amber-200'
                      }`}>
                        {c.kycStatus}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <p className="font-bold text-slate-900 font-mono">
                        ₹{Number(c.totalBalance).toLocaleString('en-IN')}
                      </p>
                      <span className="text-[10px] text-slate-500">{c.accountsCount} linked accounts</span>
                    </td>

                    <td className="py-3.5 px-4 text-center">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        c.status === 'active' ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'
                      }`}>
                        {c.status.toUpperCase()}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-center">
                      <div className="flex items-center justify-center space-x-2">
                        <button
                          onClick={() => handleViewDetails(c)}
                          className="p-1.5 rounded-lg bg-blue-50 text-royal-700 hover:bg-royal-700 hover:text-white transition-colors"
                          title="View Complete Customer File"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleToggleStatus(c._id, c.status)}
                          className={`p-1.5 rounded-lg transition-colors ${
                            c.status === 'active'
                              ? 'bg-rose-50 text-rose-700 hover:bg-rose-100'
                              : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                          }`}
                          title={c.status === 'active' ? 'Lock Account' : 'Unlock Account'}
                        >
                          {c.status === 'active' ? <Lock className="w-4 h-4" /> : <Unlock className="w-4 h-4" />}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Customer Detail Drawer / Modal */}
      {selectedCustomer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="w-full max-w-2xl bg-white border border-slate-200 rounded-2xl p-6 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-bold text-lg text-navy-950">{selectedCustomer.name}</h3>
                <p className="text-xs text-royal-700 font-mono">{selectedCustomer.customerId}</p>
              </div>
              <button onClick={() => setSelectedCustomer(null)} className="text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            {loadingDetails ? (
              <div className="py-8 text-center text-slate-400 text-xs">Loading detailed records...</div>
            ) : customerDetails ? (
              <div className="space-y-4 text-xs">
                
                {/* Accounts Grid */}
                <div>
                  <h4 className="font-bold text-slate-500 uppercase tracking-wider text-[10px] mb-2">Linked Accounts</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {(customerDetails.accounts || []).map(a => (
                      <div key={a._id} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                        <div className="flex justify-between font-bold text-slate-900">
                          <span className="capitalize">{a.accountType}</span>
                          <span className="text-emerald-700 font-mono">₹{a.balance.toLocaleString('en-IN')}</span>
                        </div>
                        <p className="text-[10px] text-slate-500 font-mono mt-1">A/C: {a.accountNumber}</p>
                        <p className="text-[10px] text-slate-400">IFSC: {a.ifscCode}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* KYC Demographics */}
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                  <h4 className="font-bold text-slate-500 uppercase tracking-wider text-[10px]">Verified KYC Records</h4>
                  <div className="grid grid-cols-2 gap-2 text-slate-600">
                    <p>PAN: <span className="font-mono font-bold text-slate-900">{customerDetails.profile?.panNumber || 'N/A'}</span></p>
                    <p>Aadhaar: <span className="font-mono font-bold text-slate-900">{customerDetails.profile?.aadhaarNumber || 'N/A'}</span></p>
                    <p>City: <span className="text-slate-900 font-medium">{customerDetails.profile?.address?.city || 'Mumbai'}</span></p>
                    <p>State: <span className="text-slate-900 font-medium">{customerDetails.profile?.address?.state || 'Maharashtra'}</span></p>
                  </div>
                </div>

                {/* Recent Transactions */}
                <div>
                  <h4 className="font-bold text-slate-500 uppercase tracking-wider text-[10px] mb-2">Recent Customer Transactions</h4>
                  <div className="max-h-40 overflow-y-auto space-y-1.5 divide-y divide-slate-100">
                    {(customerDetails.recentTransactions || []).map(t => (
                      <div key={t._id} className="flex items-center justify-between py-1.5">
                        <div>
                          <p className="text-slate-800 font-medium">{t.remarks}</p>
                          <span className="text-[10px] text-slate-400 font-mono">{t.transactionId}</span>
                        </div>
                        <span className={`font-mono font-bold ${t.type === 'credit' ? 'text-emerald-600' : 'text-slate-900'}`}>
                          {t.type === 'credit' ? '+' : '-'}₹{t.amount.toLocaleString('en-IN')}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            ) : null}
          </div>
        </div>
      )}
    </div>
  );
};

export default StaffCustomers;