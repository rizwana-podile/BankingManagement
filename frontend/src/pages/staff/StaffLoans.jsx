import React, { useState, useEffect } from 'react';
import { Briefcase, CheckCircle2, XCircle, DollarSign, ShieldCheck, ArrowRight, X } from 'lucide-react';
import api from '../../services/api';
import { toast } from '../../components/common/Toast';

const StaffLoans = () => {
  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedLoan, setSelectedLoan] = useState(null);
  const [remarks, setRemarks] = useState('');
  const [approvedAmount, setApprovedAmount] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fetchLoans = async () => {
    try {
      setLoading(true);
      const params = {};
      if (statusFilter !== 'all') params.status = statusFilter;

      const res = await api.get('/staff/loans', { params });
      if (res.data.success) {
        setLoans(res.data.loans);
      }
    } catch (err) {
      console.error('Error fetching loan queue:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLoans();
  }, [statusFilter]);

  const handleReview = async (status) => {
    if (!selectedLoan) return;
    setSubmitting(true);
    try {
      const res = await api.put(`/staff/loans/${selectedLoan._id}/review`, {
        status,
        remarks: remarks || (status === 'approved' ? 'Credit appraisal criteria satisfied.' : 'High debt-to-income ratio.'),
        approvedAmount: approvedAmount ? Number(approvedAmount) : selectedLoan.loanAmount
      });
      if (res.data.success) {
        toast.success(`Loan application has been ${status.toUpperCase()}!`);
        setSelectedLoan(null);
        fetchLoans();
      }
    } catch (err) {
      toast.error('Failed to update loan status');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDisburse = async (loanId, applicantName, amount) => {
    if (!window.confirm(`Disburse ₹${amount.toLocaleString('en-IN')} directly into ${applicantName}'s account?`)) return;
    try {
      const res = await api.post(`/staff/loans/${loanId}/disburse`);
      if (res.data.success) {
        toast.success(`Disbursed ₹${amount.toLocaleString('en-IN')} to customer account!`);
        fetchLoans();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Disbursement failed');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-navy-950">Loan Credit Appraisal Desk</h1>
          <p className="text-xs text-slate-500 mt-1">Underwrite retail applications, inspect debt burdens, and disburse sanctioned funds</p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2 p-1.5 bg-slate-100 rounded-xl border border-slate-200 text-xs">
        {['all', 'submitted', 'under_review', 'approved', 'disbursed', 'rejected'].map(f => (
          <button
            key={f}
            onClick={() => setStatusFilter(f)}
            className={`py-1.5 px-3 rounded-lg capitalize font-semibold transition-all ${
              statusFilter === f ? 'bg-navy-900 text-white shadow-xs' : 'text-slate-600 hover:text-navy-950'
            }`}
          >
            {f.replace('_', ' ')}
          </button>
        ))}
      </div>

      {/* Loan Applications Table */}
      <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] tracking-wider border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Applicant / Contact</th>
                <th className="py-3 px-4">Loan Type</th>
                <th className="py-3 px-4 text-right">Requested</th>
                <th className="py-3 px-4 text-center">Tenure / Rate</th>
                <th className="py-3 px-4 text-center">CIBIL Score</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-400">Loading loan applications...</td>
                </tr>
              ) : loans.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-400">No loans found in this queue</td>
                </tr>
              ) : (
                loans.map((l) => (
                  <tr key={l._id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4">
                      <p className="font-bold text-slate-900">{l.userId?.name || 'Applicant'}</p>
                      <span className="text-[10px] text-slate-500">{l.userId?.phone}</span>
                    </td>

                    <td className="py-3.5 px-4 capitalize font-semibold text-slate-700">
                      {l.loanType} Loan
                    </td>

                    <td className="py-3.5 px-4 text-right font-mono font-bold text-slate-900">
                      ₹{Number(l.loanAmount).toLocaleString('en-IN')}
                    </td>

                    <td className="py-3.5 px-4 text-center text-slate-700">
                      {l.tenureMonths} Mo @ {l.interestRate}%
                    </td>

                    <td className="py-3.5 px-4 text-center">
                      <span className="font-mono font-bold px-2 py-0.5 rounded bg-blue-50 text-royal-700 border border-blue-200">
                        {l.cibilScore || 760}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-center">
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
                    </td>

                    <td className="py-3.5 px-4 text-center">
                      {l.status === 'submitted' || l.status === 'under_review' ? (
                        <button
                          onClick={() => {
                            setSelectedLoan(l);
                            setApprovedAmount(String(l.loanAmount));
                            setRemarks(l.remarks || '');
                          }}
                          className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-blue-50 text-royal-700 hover:bg-royal-700 hover:text-white transition-colors"
                        >
                          Appraise
                        </button>
                      ) : l.status === 'approved' ? (
                        <button
                          onClick={() => handleDisburse(l._id, l.userId?.name, l.approvedAmount || l.loanAmount)}
                          className="px-3 py-1.5 rounded-lg text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs transition-colors"
                        >
                          Disburse Funds
                        </button>
                      ) : (
                        <span className="text-slate-400 text-[10px]">Processed</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Appraisal Modal */}
      {selectedLoan && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white border border-slate-200 rounded-2xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-bold text-base text-navy-950">Appraise Loan Application</h3>
                <p className="text-xs text-slate-500">{selectedLoan.userId?.name} • {selectedLoan.loanType.toUpperCase()} LOAN</p>
              </div>
              <button onClick={() => setSelectedLoan(null)} className="text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500">Monthly Income:</span>
                <span className="font-mono text-slate-900 font-bold">₹{Number(selectedLoan.monthlyIncome || 85000).toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Employment:</span>
                <span className="text-slate-800 font-medium">{selectedLoan.employmentType || 'Salaried'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">CIBIL Credit Score:</span>
                <span className="font-bold text-emerald-700 font-mono">{selectedLoan.cibilScore || 765} / 900</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Purpose:</span>
                <span className="text-slate-800 italic">{selectedLoan.purpose}</span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Approved Amount (INR)</label>
              <input
                type="number"
                value={approvedAmount}
                onChange={(e) => setApprovedAmount(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-900 font-mono focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Underwriter Remarks</label>
              <textarea
                rows={2}
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
                placeholder="Remarks..."
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:bg-white"
              />
            </div>

            <div className="flex space-x-3 pt-2">
              <button
                type="button"
                disabled={submitting}
                onClick={() => handleReview('rejected')}
                className="flex-1 py-2.5 rounded-xl font-bold text-xs bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200"
              >
                Reject Loan
              </button>
              <button
                type="button"
                disabled={submitting}
                onClick={() => handleReview('approved')}
                className="flex-1 py-2.5 rounded-xl font-bold text-xs bg-navy-900 hover:bg-royal-800 text-white shadow-xs"
              >
                Sanction Loan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StaffLoans;