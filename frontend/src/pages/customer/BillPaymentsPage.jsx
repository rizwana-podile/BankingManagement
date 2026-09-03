import React, { useState, useEffect } from 'react';
import {
  Receipt,
  Zap,
  Droplet,
  Smartphone,
  Wifi,
  Tv,
  Shield,
  CreditCard,
  CheckCircle2,
  ArrowRight
} from 'lucide-react';
import api from '../../services/api';
import { toast } from '../../components/common/Toast';
import { useAuth } from '../../context/AuthContext';
import ReceiptModal from '../../components/common/ReceiptModal';

const BillPaymentsPage = () => {
  const { accounts, refreshAccounts } = useAuth();
  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('electricity');
  const [showPayModal, setShowPayModal] = useState(false);
  
  const [billerName, setBillerName] = useState('Adani Electricity Mumbai');
  const [consumerNumber, setConsumerNumber] = useState('EL-908123');
  const [amount, setAmount] = useState('3450');
  const [submitting, setSubmitting] = useState(false);
  const [receipt, setReceipt] = useState(null);

  const categories = [
    { id: 'electricity', name: 'Electricity', icon: Zap, color: 'text-amber-700 bg-amber-50', defaultBiller: 'Adani Electricity Mumbai', defaultNo: 'EL-908123', defaultAmt: '3450' },
    { id: 'mobile', name: 'Mobile Recharge', icon: Smartphone, color: 'text-royal-700 bg-blue-50', defaultBiller: 'Jio Postpaid Mobile', defaultNo: '+91 98765 43210', defaultAmt: '899' },
    { id: 'water', name: 'Water Board', icon: Droplet, color: 'text-cyan-700 bg-cyan-50', defaultBiller: 'Municipal Corp of Greater Mumbai', defaultNo: 'WTR-440129', defaultAmt: '680' },
    { id: 'internet', name: 'Broadband', icon: Wifi, color: 'text-indigo-700 bg-indigo-50', defaultBiller: 'Airtel Xstream Fiber', defaultNo: 'BB-022981', defaultAmt: '1179' },
    { id: 'dth', name: 'DTH Satellite', icon: Tv, color: 'text-purple-700 bg-purple-50', defaultBiller: 'Tata Play Satellite', defaultNo: 'DTH-881290', defaultAmt: '499' },
    { id: 'insurance', name: 'Insurance Premium', icon: Shield, color: 'text-emerald-700 bg-emerald-50', defaultBiller: 'LIC of India', defaultNo: 'POL-9102834', defaultAmt: '8500' },
    { id: 'credit_card', name: 'Credit Card Bill', icon: CreditCard, color: 'text-rose-700 bg-rose-50', defaultBiller: 'Aura Signature Credit Card', defaultNo: '•••• 9012', defaultAmt: '12400' },
  ];

  const fetchHistory = async () => {
    try {
      const res = await api.get('/bills');
      if (res.data.success) setBills(res.data.bills);
    } catch (err) {
      console.error('Error fetching bills:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const handleSelectCat = (c) => {
    setSelectedCategory(c.id);
    setBillerName(c.defaultBiller);
    setConsumerNumber(c.defaultNo);
    setAmount(c.defaultAmt);
    setShowPayModal(true);
  };

  const handlePayBill = async (e) => {
    e.preventDefault();
    if (accounts.length === 0) {
      toast.error('No debit account found');
      return;
    }
    setSubmitting(true);
    try {
      const res = await api.post('/bills/pay', {
        accountId: accounts[0]._id,
        category: selectedCategory,
        billerName,
        consumerNumber,
        amount: Number(amount)
      });
      if (res.data.success) {
        toast.success('Bill paid successfully!');
        setShowPayModal(false);
        setReceipt(res.data.receipt);
        fetchHistory();
        refreshAccounts();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to pay bill');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-navy-950">Utility Bill Settlements (BBPS)</h1>
        <p className="text-xs text-slate-500 mt-1">Instant payments for electricity, water, mobile, broadband, and insurance</p>
      </div>

      {/* Bill Categories Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {categories.map((c) => {
          const Icon = c.icon;
          return (
            <button
              key={c.id}
              onClick={() => handleSelectCat(c)}
              className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-royal-600 hover:shadow-md transition-all text-left group shadow-xs"
            >
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-3 ${c.color} group-hover:scale-105 transition-transform`}>
                <Icon className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-sm text-slate-900">{c.name}</h3>
              <span className="text-[10px] text-royal-700 font-bold mt-1 inline-flex items-center space-x-1">
                <span>Pay Now</span>
                <ArrowRight className="w-3 h-3 ml-0.5" />
              </span>
            </button>
          );
        })}
      </div>

      {/* Past Bill Payments */}
      <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs">
        <h3 className="font-bold text-base text-navy-950 mb-4">Payment History</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] tracking-wider border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Biller Name</th>
                <th className="py-3 px-4">Consumer No</th>
                <th className="py-3 px-4 text-right">Amount</th>
                <th className="py-3 px-4 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {bills.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-400">No bill payments recorded yet</td>
                </tr>
              ) : (
                bills.map((b) => (
                  <tr key={b._id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-4 font-mono text-slate-500">{new Date(b.createdAt).toLocaleDateString('en-IN')}</td>
                    <td className="py-3 px-4 capitalize font-semibold text-slate-700">{b.category}</td>
                    <td className="py-3 px-4 text-slate-900 font-bold">{b.billerName}</td>
                    <td className="py-3 px-4 font-mono text-slate-500">{b.consumerNumber}</td>
                    <td className="py-3 px-4 text-right font-mono font-bold text-slate-900">
                      ₹{Number(b.amount).toLocaleString('en-IN')}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        {b.status.toUpperCase()}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pay Modal */}
      {showPayModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white border border-slate-200 rounded-2xl p-6 shadow-2xl space-y-4">
            <h3 className="font-bold text-base text-navy-950 capitalize">Pay {selectedCategory} Bill</h3>

            <form onSubmit={handlePayBill} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-700 mb-1 font-bold">Biller / Service Provider</label>
                <input
                  type="text"
                  required
                  value={billerName}
                  onChange={(e) => setBillerName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-slate-700 mb-1 font-bold">Consumer / Account ID</label>
                <input
                  type="text"
                  required
                  value={consumerNumber}
                  onChange={(e) => setConsumerNumber(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 font-mono focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-slate-700 mb-1 font-bold">Bill Amount (INR)</label>
                <input
                  type="number"
                  min="1"
                  required
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 font-mono text-sm font-bold focus:bg-white"
                />
              </div>

              <div className="flex space-x-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowPayModal(false)}
                  className="flex-1 py-2.5 rounded-xl bg-slate-100 text-slate-600 hover:bg-slate-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 py-2.5 rounded-xl font-bold bg-navy-900 hover:bg-royal-800 text-white shadow-xs"
                >
                  {submitting ? 'Paying...' : 'Authorize & Pay'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Receipt Modal */}
      <ReceiptModal
        isOpen={Boolean(receipt)}
        onClose={() => setReceipt(null)}
        receipt={receipt}
      />
    </div>
  );
};

export default BillPaymentsPage;