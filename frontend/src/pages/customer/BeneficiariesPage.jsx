import React, { useState, useEffect } from 'react';
import { Users, Plus, Trash2, ShieldCheck, ArrowRight, X } from 'lucide-react';
import api from '../../services/api';
import { toast } from '../../components/common/Toast';

const BeneficiariesPage = () => {
  const [beneficiaries, setBeneficiaries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  
  const [name, setName] = useState('');
  const [nickname, setNickname] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [ifscCode, setIfscCode] = useState('AURA0001001');
  const [bankName, setBankName] = useState('Aura Apex Bank');
  const [transferLimit, setTransferLimit] = useState('100000');
  const [submitting, setSubmitting] = useState(false);

  const fetchBeneficiaries = async () => {
    try {
      const res = await api.get('/beneficiaries');
      if (res.data.success) setBeneficiaries(res.data.beneficiaries);
    } catch (err) {
      console.error('Error fetching beneficiaries:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBeneficiaries();
  }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await api.post('/beneficiaries', {
        name,
        nickname,
        accountNumber,
        ifscCode,
        bankName,
        transferLimit: Number(transferLimit)
      });
      if (res.data.success) {
        toast.success('Beneficiary registered successfully!');
        setShowAddModal(false);
        fetchBeneficiaries();
        setName('');
        setNickname('');
        setAccountNumber('');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add beneficiary');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id, benName) => {
    if (!window.confirm(`Are you sure you want to remove beneficiary ${benName}?`)) return;
    try {
      await api.delete(`/beneficiaries/${id}`);
      toast.success('Beneficiary removed');
      fetchBeneficiaries();
    } catch (err) {
      toast.error('Failed to remove beneficiary');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-navy-950">Registered Beneficiaries</h1>
          <p className="text-xs text-slate-500 mt-1">Manage saved recipients for instant one-click transfers</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2 rounded-xl text-xs font-bold bg-navy-900 hover:bg-royal-800 text-white shadow-xs flex items-center space-x-1.5 self-start sm:self-auto transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Add Beneficiary</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {beneficiaries.map((b) => (
          <div key={b._id} className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs hover:shadow-md transition-all relative group">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-royal-700 flex items-center justify-center font-bold text-sm">
                  {b.name.charAt(0)}
                </div>
                <div>
                  <h3 className="font-bold text-sm text-slate-900">{b.name}</h3>
                  <p className="text-[10px] text-royal-700 font-semibold">{b.nickname || 'Contact'}</p>
                </div>
              </div>
              <button
                onClick={() => handleDelete(b._id, b.name)}
                className="text-slate-400 hover:text-rose-600 p-1.5 rounded-lg transition-colors"
                title="Delete Beneficiary"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2 text-xs py-2 border-t border-b border-slate-100">
              <div className="flex justify-between">
                <span className="text-slate-500">Account No:</span>
                <span className="font-mono font-bold text-slate-800">{b.accountNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">IFSC:</span>
                <span className="font-mono text-slate-700">{b.ifscCode}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Bank:</span>
                <span className="text-slate-800 font-medium">{b.bankName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Limit:</span>
                <span className="font-mono text-emerald-700 font-bold">₹{Number(b.transferLimit).toLocaleString('en-IN')}</span>
              </div>
            </div>

            <div className="mt-4 text-right">
              <a
                href="/transfer"
                className="text-xs text-royal-700 hover:text-navy-950 font-semibold inline-flex items-center space-x-1"
              >
                <span>Send Money</span>
                <ArrowRight className="w-3.5 h-3.5 ml-0.5" />
              </a>
            </div>
          </div>
        ))}
      </div>

      {/* Add Beneficiary Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white border border-slate-200 rounded-2xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-base text-navy-950">Add New Beneficiary</h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAdd} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 mb-1 font-bold">Beneficiary Full Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:bg-white focus:ring-2 focus:ring-royal-600"
                  placeholder="e.g. Ramesh Chandra"
                />
              </div>

              <div>
                <label className="block text-slate-700 mb-1 font-bold">Nickname</label>
                <input
                  type="text"
                  value={nickname}
                  onChange={(e) => setNickname(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:bg-white focus:ring-2 focus:ring-royal-600"
                  placeholder="e.g. Ramesh"
                />
              </div>

              <div>
                <label className="block text-slate-700 mb-1 font-bold">Account Number</label>
                <input
                  type="text"
                  required
                  value={accountNumber}
                  onChange={(e) => setAccountNumber(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 font-mono focus:bg-white focus:ring-2 focus:ring-royal-600"
                  placeholder="10024859xxxx"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 mb-1 font-bold">IFSC Code</label>
                  <input
                    type="text"
                    required
                    maxLength={11}
                    value={ifscCode}
                    onChange={(e) => setIfscCode(e.target.value.toUpperCase())}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 font-mono uppercase focus:bg-white focus:ring-2 focus:ring-royal-600"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 mb-1 font-bold">Bank Name</label>
                  <input
                    type="text"
                    value={bankName}
                    onChange={(e) => setBankName(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:bg-white focus:ring-2 focus:ring-royal-600"
                  />
                </div>
              </div>

              <div className="pt-3">
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-2.5 rounded-xl bg-navy-900 hover:bg-royal-800 font-bold text-white shadow-xs transition-colors"
                >
                  {submitting ? 'Registering...' : 'Save Beneficiary'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default BeneficiariesPage;