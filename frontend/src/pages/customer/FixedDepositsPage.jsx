import React, { useState, useEffect } from 'react';
import { PiggyBank, Plus, CheckCircle2, TrendingUp, AlertTriangle } from 'lucide-react';
import api from '../../services/api';
import { toast } from '../../components/common/Toast';
import { useAuth } from '../../context/AuthContext';

const FixedDepositsPage = () => {
  const { accounts, refreshAccounts } = useAuth();
  const [fds, setFds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  
  const [principalAmount, setPrincipalAmount] = useState(50000);
  const [tenureMonths, setTenureMonths] = useState(12);
  const [submitting, setSubmitting] = useState(false);

  // Live Compound Calculator
  const rate = 7.1;
  const tYears = tenureMonths / 12;
  const estimatedMaturity = Math.round(principalAmount * Math.pow(1 + (rate / 100) / 4, 4 * tYears));

  const fetchFDs = async () => {
    try {
      const res = await api.get('/fds');
      if (res.data.success) setFds(res.data.fds);
    } catch (err) {
      console.error('Error fetching FDs:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFDs();
  }, []);

  const handleCreateFD = async (e) => {
    e.preventDefault();
    if (accounts.length === 0) {
      toast.error('No debit account found');
      return;
    }
    setSubmitting(true);
    try {
      const res = await api.post('/fds', {
        accountId: accounts[0]._id,
        principalAmount: Number(principalAmount),
        tenureMonths: Number(tenureMonths)
      });
      if (res.data.success) {
        toast.success('Fixed Deposit created successfully!');
        setShowCreateModal(false);
        fetchFDs();
        refreshAccounts();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create Fixed Deposit');
    } finally {
      setSubmitting(false);
    }
  };

  const handleBreakFD = async (fdId, depNo) => {
    if (!window.confirm(`Liquidate FD #${depNo} prematurely? Standard 0.5% interest penalty will apply.`)) return;
    try {
      const res = await api.put(`/fds/${fdId}/break`);
      if (res.data.success) {
        toast.success(res.data.message);
        fetchFDs();
        refreshAccounts();
      }
    } catch (err) {
      toast.error('Failed to liquidate FD');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-navy-950">Term & Fixed Deposits</h1>
          <p className="text-xs text-slate-500 mt-1">Guaranteed compounding capital growth at 7.10% p.a.</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="px-4 py-2 rounded-xl text-xs font-bold bg-navy-900 hover:bg-royal-800 text-white shadow-xs flex items-center space-x-1.5 self-start sm:self-auto transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Open Fixed Deposit</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {fds.map((fd) => (
          <div key={fd._id} className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs hover:shadow-md transition-all space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2.5">
                <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
                  <PiggyBank className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-slate-900">{fd.depositNumber}</h3>
                  <p className="text-[10px] text-slate-500">7.1% Compounded Quarterly</p>
                </div>
              </div>
              <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                fd.status === 'active' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-slate-100 text-slate-600'
              }`}>
                {fd.status.replace('_', ' ')}
              </span>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1">
              <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Maturity Value</span>
              <div className="text-2xl font-black text-slate-900 font-mono">
                ₹{Number(fd.maturityAmount).toLocaleString('en-IN')}
              </div>
              <p className="text-[10px] text-slate-500">Principal Deposited: ₹{Number(fd.principalAmount).toLocaleString('en-IN')}</p>
            </div>

            <div className="space-y-2 text-xs py-1 border-t border-slate-100">
              <div className="flex justify-between py-1">
                <span className="text-slate-500">Tenure</span>
                <span className="text-slate-800 font-medium">{fd.tenureMonths} Months</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-500">Maturity Date</span>
                <span className="text-royal-700 font-medium">{new Date(fd.maturityDate).toLocaleDateString('en-IN')}</span>
              </div>
            </div>

            {fd.status === 'active' && (
              <div className="pt-2">
                <button
                  onClick={() => handleBreakFD(fd._id, fd.depositNumber)}
                  className="w-full py-2 px-3 rounded-xl text-xs font-semibold text-rose-600 hover:bg-rose-50 border border-rose-200 transition-colors"
                >
                  Premature Liquidation
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Create FD Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white border border-slate-200 rounded-2xl p-6 shadow-2xl space-y-4">
            <h3 className="font-bold text-base text-navy-950">Create New Fixed Deposit</h3>

            <form onSubmit={handleCreateFD} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-700 mb-1 font-bold">Deposit Principal Amount</label>
                <input
                  type="number"
                  min="5000"
                  step="1000"
                  required
                  value={principalAmount}
                  onChange={(e) => setPrincipalAmount(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 font-mono text-sm font-bold focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-slate-700 mb-1 font-bold">Deposit Tenure</label>
                <select
                  value={tenureMonths}
                  onChange={(e) => setTenureMonths(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:bg-white"
                >
                  <option value={6}>6 Months (6.8% p.a.)</option>
                  <option value={12}>12 Months / 1 Year (7.1% p.a.)</option>
                  <option value={24}>24 Months / 2 Years (7.3% p.a.)</option>
                  <option value={36}>36 Months / 3 Years (7.5% p.a.)</option>
                  <option value={60}>60 Months / 5 Years (7.6% p.a.)</option>
                </select>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Projected Maturity Return</span>
                <div className="text-xl font-black text-slate-900 font-mono">
                  ₹{estimatedMaturity.toLocaleString('en-IN')}
                </div>
                <p className="text-[10px] text-slate-500">Interest Earned: ₹{(estimatedMaturity - principalAmount).toLocaleString('en-IN')}</p>
              </div>

              <div className="flex space-x-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 py-2.5 rounded-xl bg-slate-100 text-slate-600 hover:bg-slate-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 py-2.5 rounded-xl font-bold bg-navy-900 hover:bg-royal-800 text-white shadow-xs"
                >
                  {submitting ? 'Creating...' : 'Open FD Now'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default FixedDepositsPage;