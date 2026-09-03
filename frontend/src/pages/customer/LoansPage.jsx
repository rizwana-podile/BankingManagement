import React, { useState, useEffect } from 'react';
import { Briefcase, Plus, CheckCircle2, Clock, XCircle, AlertCircle, ArrowRight, DollarSign } from 'lucide-react';
import api from '../../services/api';
import { toast } from '../../components/common/Toast';
import { useAuth } from '../../context/AuthContext';

const LoansPage = () => {
  const { accounts, refreshAccounts } = useAuth();
  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showApplyModal, setShowApplyModal] = useState(false);
  
  // Application Form State
  const [loanType, setLoanType] = useState('personal');
  const [loanAmount, setLoanAmount] = useState(150000);
  const [tenureMonths, setTenureMonths] = useState(24);
  const [monthlyIncome, setMonthlyIncome] = useState(85000);
  const [purpose, setPurpose] = useState('Personal Planning & Home Improvements');
  const [submitting, setSubmitting] = useState(false);

  // Dynamic EMI Calculation
  const interestRates = { personal: 11.5, home: 8.5, education: 9.0, vehicle: 9.5 };
  const currentRate = interestRates[loanType] || 10.0;
  const monthlyRate = (currentRate / 12) / 100;
  const emiFactor = Math.pow(1 + monthlyRate, tenureMonths);
  const estimatedEmi = Math.round((loanAmount * monthlyRate * emiFactor) / (emiFactor - 1));
  const totalRepayable = estimatedEmi * tenureMonths;
  const totalInterest = totalRepayable - loanAmount;

  const fetchLoans = async () => {
    try {
      const res = await api.get('/loans');
      if (res.data.success) setLoans(res.data.loans);
    } catch (err) {
      console.error('Error fetching loans:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLoans();
  }, []);

  const handleApply = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await api.post('/loans/apply', {
        loanType,
        loanAmount: Number(loanAmount),
        tenureMonths: Number(tenureMonths),
        monthlyIncome: Number(monthlyIncome),
        purpose
      });
      if (res.data.success) {
        toast.success('Loan application submitted for branch officer review!');
        setShowApplyModal(false);
        fetchLoans();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit application');
    } finally {
      setSubmitting(false);
    }
  };

  const handleRepayEmi = async (loanId) => {
    if (accounts.length === 0) {
      toast.error('No debit account found for EMI repayment');
      return;
    }
    if (!window.confirm('Confirm debit of monthly EMI from your primary account?')) return;

    try {
      const res = await api.post(`/loans/${loanId}/repay-emi`, {
        accountId: accounts[0]._id
      });
      if (res.data.success) {
        toast.success('EMI repayment processed successfully!');
        fetchLoans();
        refreshAccounts();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to repay EMI');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-navy-950">Lending & Credit Facilities</h1>
          <p className="text-xs text-slate-500 mt-1">Retail loans, tenure schedules, EMI calculations, and repayments</p>
        </div>
        <button
          onClick={() => setShowApplyModal(true)}
          className="px-4 py-2 rounded-xl text-xs font-bold bg-navy-900 hover:bg-royal-800 text-white shadow-xs flex items-center space-x-1.5 self-start sm:self-auto transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Apply for a Loan</span>
        </button>
      </div>

      {/* Loans Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loans.map((l) => (
          <div key={l._id} className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs hover:shadow-md transition-all space-y-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2.5">
                <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center font-bold">
                  <Briefcase className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-slate-900 capitalize">{l.loanType} Loan</h3>
                  <p className="text-[10px] text-slate-400 font-mono">ID: {l._id.slice(-6)}</p>
                </div>
              </div>

              <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                l.status === 'disbursed'
                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                  : l.status === 'approved'
                  ? 'bg-blue-50 text-royal-700 border border-blue-200'
                  : l.status === 'rejected'
                  ? 'bg-rose-50 text-rose-700 border border-rose-200'
                  : 'bg-amber-50 text-amber-700 border border-amber-200'
              }`}>
                {l.status}
              </span>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80">
              <div className="flex justify-between items-baseline">
                <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Outstanding Balance</span>
                <span className="text-xl font-bold font-mono text-slate-900">
                  ₹{Number(l.outstandingAmount).toLocaleString('en-IN')}
                </span>
              </div>
              <div className="flex justify-between items-baseline mt-2 pt-2 border-t border-slate-200 text-xs">
                <span className="text-slate-500">Sanctioned:</span>
                <span className="text-slate-700 font-mono font-medium">₹{Number(l.loanAmount).toLocaleString('en-IN')}</span>
              </div>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Monthly EMI</span>
                <span className="font-mono font-bold text-emerald-700">₹{Number(l.emiAmount).toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Interest Rate</span>
                <span className="font-semibold text-slate-800">{l.interestRate}% p.a.</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Tenure</span>
                <span className="text-slate-800">{l.tenureMonths} Months</span>
              </div>
              {l.nextEmiDate && (
                <div className="flex justify-between py-1">
                  <span className="text-slate-500">Next Due Date</span>
                  <span className="text-royal-700 font-medium">{new Date(l.nextEmiDate).toLocaleDateString()}</span>
                </div>
              )}
            </div>

            {l.status === 'disbursed' && (
              <div className="pt-2">
                <button
                  onClick={() => handleRepayEmi(l._id)}
                  className="w-full py-2.5 px-4 rounded-xl text-xs font-bold bg-navy-900 hover:bg-royal-800 text-white shadow-xs transition-colors"
                >
                  Pay Current EMI (₹{Number(l.emiAmount).toLocaleString('en-IN')})
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Apply Loan Modal with Live EMI Calculator */}
      {showApplyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="w-full max-w-xl bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto">
            <h3 className="font-bold text-lg text-navy-950">Apply for a New Loan</h3>

            <form onSubmit={handleApply} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-700 mb-1 font-bold">Select Loan Type</label>
                <select
                  value={loanType}
                  onChange={(e) => setLoanType(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:bg-white"
                >
                  <option value="personal">Personal Loan (11.5% p.a.)</option>
                  <option value="home">Home Loan (8.5% p.a.)</option>
                  <option value="vehicle">Vehicle Loan (9.5% p.a.)</option>
                  <option value="education">Education Loan (9.0% p.a.)</option>
                </select>
              </div>

              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-slate-700 font-bold">Requested Amount</span>
                  <span className="font-bold text-slate-900 font-mono">₹{loanAmount.toLocaleString('en-IN')}</span>
                </div>
                <input
                  type="range"
                  min="20000"
                  max="5000000"
                  step="10000"
                  value={loanAmount}
                  onChange={(e) => setLoanAmount(Number(e.target.value))}
                  className="w-full accent-royal-600 cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-slate-700 font-bold">Repayment Tenure</span>
                  <span className="font-bold text-royal-700 font-mono">{tenureMonths} Months ({Math.round(tenureMonths / 12)} Yrs)</span>
                </div>
                <input
                  type="range"
                  min="6"
                  max="240"
                  step="6"
                  value={tenureMonths}
                  onChange={(e) => setTenureMonths(Number(e.target.value))}
                  className="w-full accent-royal-600 cursor-pointer"
                />
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Live EMI Calculator Preview</span>
                <div className="flex justify-between text-xs">
                  <span className="text-slate-600">Calculated Monthly EMI:</span>
                  <span className="font-bold font-mono text-emerald-700 text-sm">₹{estimatedEmi.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-slate-600">Total Interest Payable:</span>
                  <span className="font-mono text-slate-800">₹{totalInterest.toLocaleString('en-IN')}</span>
                </div>
              </div>

              <div>
                <label className="block text-slate-700 mb-1 font-bold">Monthly Income (INR)</label>
                <input
                  type="number"
                  required
                  value={monthlyIncome}
                  onChange={(e) => setMonthlyIncome(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 font-mono focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-slate-700 mb-1 font-bold">Purpose of Loan</label>
                <input
                  type="text"
                  required
                  value={purpose}
                  onChange={(e) => setPurpose(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:bg-white"
                  placeholder="e.g. Higher studies or Renovation"
                />
              </div>

              <div className="flex space-x-3 pt-3">
                <button
                  type="button"
                  onClick={() => setShowApplyModal(false)}
                  className="flex-1 py-2.5 rounded-xl bg-slate-100 text-slate-600 hover:bg-slate-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 py-2.5 rounded-xl font-bold bg-navy-900 hover:bg-royal-800 text-white shadow-xs"
                >
                  {submitting ? 'Submitting...' : 'Submit Application'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default LoansPage;