import React, { useState, useEffect } from 'react';
import { Wallet, Plus, Lock, Unlock, CheckCircle2, ShieldCheck, X } from 'lucide-react';
import api from '../../services/api';
import { toast } from '../../components/common/Toast';

const StaffAccounts = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showOpenModal, setShowOpenModal] = useState(false);
  
  const [selectedCustomer, setSelectedCustomer] = useState('');
  const [accountType, setAccountType] = useState('savings');
  const [initialDeposit, setInitialDeposit] = useState('10000');
  const [submitting, setSubmitting] = useState(false);

  const fetchCustomerList = async () => {
    try {
      const res = await api.get('/staff/customers');
      if (res.data.success) {
        setCustomers(res.data.customers);
        if (res.data.customers.length > 0) {
          setSelectedCustomer(res.data.customers[0]._id);
        }
      }
    } catch (err) {
      console.error('Error fetching customers:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomerList();
  }, []);

  const handleOpenAccount = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await api.post('/staff/accounts/open', {
        userId: selectedCustomer,
        accountType,
        initialDeposit: Number(initialDeposit)
      });
      if (res.data.success) {
        toast.success(res.data.message);
        setShowOpenModal(false);
        fetchCustomerList();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to open account');
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleFreeze = async (accId, currentStatus) => {
    const newStatus = currentStatus === 'frozen' ? 'active' : 'frozen';
    try {
      const res = await api.put(`/staff/accounts/${accId}/freeze`, {
        status: newStatus,
        reason: 'Compliance review / Staff operational action'
      });
      if (res.data.success) {
        toast.success(res.data.message);
        fetchCustomerList();
      }
    } catch (err) {
      toast.error('Failed to change account status');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-navy-950">Branch Account Management</h1>
          <p className="text-xs text-slate-500 mt-1">Open new customer accounts, inspect ledgers, and freeze/unfreeze accounts</p>
        </div>
        <button
          onClick={() => setShowOpenModal(true)}
          className="px-4 py-2 rounded-xl text-xs font-bold bg-navy-900 hover:bg-royal-800 text-white shadow-xs flex items-center space-x-1.5 self-start sm:self-auto transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Open New Customer Account</span>
        </button>
      </div>

      {/* Accounts by Customer Grid */}
      <div className="space-y-4">
        {customers.map((c) => (
          <div key={c._id} className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-bold text-sm text-slate-900">{c.name}</h3>
                <span className="text-[10px] text-royal-700 font-mono font-bold">{c.customerId} • {c.phone}</span>
              </div>
              <span className="text-xs font-bold text-slate-900 font-mono">
                Total Balance: ₹{c.totalBalance.toLocaleString('en-IN')}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {(c.accounts || []).map((acc) => (
                <div key={acc._id} className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-slate-900 capitalize">{acc.accountType} A/C</span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      acc.status === 'active' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-rose-50 text-rose-700 border border-rose-200'
                    }`}>
                      {acc.status.toUpperCase()}
                    </span>
                  </div>

                  <div>
                    <span className="text-lg font-black text-slate-900 font-mono">
                      ₹{acc.balance.toLocaleString('en-IN')}
                    </span>
                    <p className="text-[10px] text-slate-500 font-mono mt-0.5">Acc: {acc.accountNumber}</p>
                  </div>

                  <div className="pt-2 border-t border-slate-200 flex items-center justify-between">
                    <span className="text-[10px] text-slate-500">IFSC: {acc.ifscCode}</span>
                    <button
                      onClick={() => handleToggleFreeze(acc._id, acc.status)}
                      className={`text-[10px] font-bold px-2 py-1 rounded transition-colors ${
                        acc.status === 'active'
                          ? 'bg-rose-50 text-rose-700 hover:bg-rose-100'
                          : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                      }`}
                    >
                      {acc.status === 'active' ? 'Freeze Account' : 'Unfreeze Account'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Open Account Modal */}
      {showOpenModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white border border-slate-200 rounded-2xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-base text-navy-950">Open Account for Customer</h3>
              <button onClick={() => setShowOpenModal(false)} className="text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleOpenAccount} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-700 mb-1 font-bold">Target Customer</label>
                <select
                  value={selectedCustomer}
                  onChange={(e) => setSelectedCustomer(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:bg-white"
                >
                  {customers.map(c => (
                    <option key={c._id} value={c._id}>
                      {c.name} ({c.customerId})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-700 mb-1 font-bold">Account Variant</label>
                <select
                  value={accountType}
                  onChange={(e) => setAccountType(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:bg-white"
                >
                  <option value="savings">Premier Savings Account</option>
                  <option value="current">Commercial Current Account</option>
                  <option value="salary">Corporate Salary Account</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-700 mb-1 font-bold">Initial Opening Deposit (INR)</label>
                <input
                  type="number"
                  min="1000"
                  required
                  value={initialDeposit}
                  onChange={(e) => setInitialDeposit(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 font-mono text-sm font-bold focus:bg-white"
                />
              </div>

              <div className="flex space-x-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowOpenModal(false)}
                  className="flex-1 py-2.5 rounded-xl bg-slate-100 text-slate-600 hover:bg-slate-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 py-2.5 rounded-xl font-bold bg-navy-900 hover:bg-royal-800 text-white shadow-xs"
                >
                  {submitting ? 'Creating...' : 'Sanction & Open'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default StaffAccounts;