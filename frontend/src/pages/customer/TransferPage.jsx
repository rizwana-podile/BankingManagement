import React, { useState, useEffect } from 'react';
import { Send, ShieldCheck, CheckCircle2, AlertCircle, ArrowRight, UserCheck, RefreshCw } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import { toast } from '../../components/common/Toast';
import ReceiptModal from '../../components/common/ReceiptModal';

const TransferPage = () => {
  const { accounts, activeAccount, refreshAccounts } = useAuth();
  const [beneficiaries, setBeneficiaries] = useState([]);
  const [selectedSourceAccount, setSelectedSourceAccount] = useState('');
  const [transferType, setTransferType] = useState('IMPS'); // 'IMPS', 'NEFT', 'RTGS', 'UPI'
  const [selectedBeneficiaryId, setSelectedBeneficiaryId] = useState('');
  
  const [destAccount, setDestAccount] = useState('');
  const [confirmDestAccount, setConfirmDestAccount] = useState('');
  const [destIfsc, setDestIfsc] = useState('');
  const [recipientName, setRecipientName] = useState('');
  const [upiId, setUpiId] = useState('');
  const [amount, setAmount] = useState('');
  const [remarks, setRemarks] = useState('');
  const [category, setCategory] = useState('Transfer');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [securityPin, setSecurityPin] = useState('1234');
  const [receipt, setReceipt] = useState(null);

  useEffect(() => {
    if (activeAccount) {
      setSelectedSourceAccount(activeAccount._id);
    } else if (accounts.length > 0) {
      setSelectedSourceAccount(accounts[0]._id);
    }
  }, [activeAccount, accounts]);

  useEffect(() => {
    const fetchBeneficiaries = async () => {
      try {
        const res = await api.get('/beneficiaries');
        if (res.data.success) setBeneficiaries(res.data.beneficiaries);
      } catch (err) {
        console.error('Failed to load beneficiaries:', err);
      }
    };
    fetchBeneficiaries();
  }, []);

  const handleBeneficiarySelect = (bId) => {
    setSelectedBeneficiaryId(bId);
    if (!bId) {
      setDestAccount('');
      setConfirmDestAccount('');
      setDestIfsc('');
      setRecipientName('');
      return;
    }
    const ben = beneficiaries.find(b => b._id === bId);
    if (ben) {
      setDestAccount(ben.accountNumber);
      setConfirmDestAccount(ben.accountNumber);
      setDestIfsc(ben.ifscCode);
      setRecipientName(ben.name);
    }
  };

  const handleModeChange = (mode) => {
    setTransferType(mode);
    setError('');
    if (mode === 'UPI') {
      setUpiId('priya@aura');
      setRecipientName('Priya Patel');
    }
  };

  const currentSource = accounts.find(a => a._id === selectedSourceAccount);

  const handleInitiate = (e) => {
    e.preventDefault();
    setError('');

    const numAmount = Number(amount);
    if (!numAmount || numAmount <= 0) {
      setError('Please enter a valid transfer amount greater than ₹0');
      return;
    }

    if (!currentSource) {
      setError('Please select a debit source account');
      return;
    }

    if (currentSource.balance < numAmount) {
      setError(`Insufficient balance. Available: ₹${currentSource.balance.toLocaleString('en-IN')}`);
      return;
    }

    if (transferType === 'RTGS' && numAmount < 200000) {
      setError('RTGS transfers require a minimum transaction value of ₹2,00,000');
      return;
    }

    if (transferType !== 'UPI') {
      if (!destAccount) {
        setError('Destination account number is required');
        return;
      }
      if (destAccount !== confirmDestAccount) {
        setError('Destination account numbers do not match');
        return;
      }
      if (!destIfsc || destIfsc.trim().length !== 11) {
        setError('Please enter a valid 11-character bank IFSC code');
        return;
      }
    } else {
      if (!upiId || !upiId.includes('@')) {
        setError('Please provide a valid Virtual Payment Address (e.g. user@aura)');
        return;
      }
    }

    setShowConfirmModal(true);
  };

  const handleExecuteTransfer = async () => {
    setLoading(true);
    setError('');

    try {
      const payload = {
        sourceAccountId: selectedSourceAccount,
        transferType,
        destinationAccountNumber: transferType === 'UPI' ? 'UPI-' + upiId : destAccount,
        destinationIfsc: transferType === 'UPI' ? 'AURA0001001' : destIfsc.toUpperCase(),
        recipientName: recipientName || 'Beneficiary',
        amount: Number(amount),
        remarks: remarks || 'Fund Transfer',
        category
      };

      const res = await api.post('/transfers', payload);
      if (res.data.success) {
        toast.success(res.data.message || 'Transfer completed successfully!');
        setShowConfirmModal(false);
        setReceipt(res.data.receipt);
        refreshAccounts();
        
        // Reset form
        setAmount('');
        setRemarks('');
        setSelectedBeneficiaryId('');
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Transfer execution failed.';
      setError(msg);
      toast.error(msg);
      setShowConfirmModal(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-navy-950">Funds Transfer & Remittance</h1>
        <p className="text-xs text-slate-500 mt-1">Instant electronic settlements across Indian banking networks</p>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-xs">
        
        {/* Payment Rail Tabs */}
        <div className="flex flex-wrap gap-2 p-1.5 bg-slate-100 rounded-xl border border-slate-200 mb-6">
          {[
            { id: 'IMPS', label: 'IMPS 24x7', sub: 'Instant Credit' },
            { id: 'NEFT', label: 'NEFT', sub: 'RBI Batches' },
            { id: 'RTGS', label: 'RTGS', sub: 'Min ₹2 Lakh' },
            { id: 'UPI', label: 'UPI Remit', sub: 'Instant VPA' },
          ].map(m => (
            <button
              key={m.id}
              type="button"
              onClick={() => handleModeChange(m.id)}
              className={`flex-1 py-2.5 px-3 rounded-lg text-center transition-all ${
                transferType === m.id
                  ? 'bg-navy-900 text-white shadow-xs font-bold border-b-2 border-gold-500'
                  : 'text-slate-600 hover:text-navy-950 hover:bg-white'
              }`}
            >
              <p className="text-xs">{m.label}</p>
              <p className="text-[10px] opacity-80">{m.sub}</p>
            </button>
          ))}
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-xl bg-rose-50 border border-rose-200 flex items-start space-x-3 text-rose-800 text-xs">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-600" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleInitiate} className="space-y-5">
          
          {/* Source Account Selector */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Select Debit Account
            </label>
            <select
              value={selectedSourceAccount}
              onChange={(e) => setSelectedSourceAccount(e.target.value)}
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:bg-white focus:ring-2 focus:ring-royal-600 font-medium"
            >
              {accounts.map(acc => (
                <option key={acc._id} value={acc._id}>
                  {acc.accountType.toUpperCase()} - {acc.accountNumber} (Available: ₹{acc.balance.toLocaleString('en-IN')})
                </option>
              ))}
            </select>
          </div>

          {/* Beneficiary Quick Dropdown */}
          {transferType !== 'UPI' && beneficiaries.length > 0 && (
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Choose Saved Beneficiary (Optional)
              </label>
              <select
                value={selectedBeneficiaryId}
                onChange={(e) => handleBeneficiarySelect(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:bg-white focus:ring-2 focus:ring-royal-600 font-medium"
              >
                <option value="">-- Or enter recipient details below --</option>
                {beneficiaries.map(b => (
                  <option key={b._id} value={b._id}>
                    {b.name} ({b.nickname}) - {b.accountNumber} [{b.bankName}]
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* UPI Flow */}
          {transferType === 'UPI' ? (
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                UPI ID / Virtual Payment Address (VPA)
              </label>
              <input
                type="text"
                required
                value={upiId}
                onChange={(e) => setUpiId(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 font-mono focus:bg-white focus:ring-2 focus:ring-royal-600"
                placeholder="recipient@aura"
              />
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Recipient Account Number</label>
                  <input
                    type="text"
                    required
                    value={destAccount}
                    onChange={(e) => setDestAccount(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 font-mono focus:bg-white focus:ring-2 focus:ring-royal-600"
                    placeholder="10024859xxxx"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Confirm Account Number</label>
                  <input
                    type="text"
                    required
                    value={confirmDestAccount}
                    onChange={(e) => setConfirmDestAccount(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 font-mono focus:bg-white focus:ring-2 focus:ring-royal-600"
                    placeholder="Re-enter account number"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Bank IFSC Code</label>
                  <input
                    type="text"
                    required
                    maxLength={11}
                    value={destIfsc}
                    onChange={(e) => setDestIfsc(e.target.value.toUpperCase())}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 font-mono uppercase focus:bg-white focus:ring-2 focus:ring-royal-600"
                    placeholder="AURA0001001"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Beneficiary Legal Name</label>
                  <input
                    type="text"
                    required
                    value={recipientName}
                    onChange={(e) => setRecipientName(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:bg-white focus:ring-2 focus:ring-royal-600"
                    placeholder="e.g. Priya Patel"
                  />
                </div>
              </div>
            </>
          )}

          {/* Amount and Remarks */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Transfer Amount (INR)</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-500 font-bold">₹</span>
                <input
                  type="number"
                  min="1"
                  required
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full pl-8 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-bold text-slate-900 font-mono focus:bg-white focus:ring-2 focus:ring-royal-600"
                  placeholder="5000"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Purpose / Remarks</label>
              <input
                type="text"
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:bg-white focus:ring-2 focus:ring-royal-600"
                placeholder="Monthly expense / Investment"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3.5 px-6 rounded-xl text-xs font-bold text-white bg-navy-900 hover:bg-royal-800 shadow-xs transition-all flex items-center justify-center space-x-2"
          >
            <span>Proceed to Security Confirmation</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

      </div>

      {/* 2-Step Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white border border-slate-200 rounded-2xl p-6 shadow-2xl space-y-5 animate-in zoom-in-95 text-slate-800">
            <div className="flex items-center space-x-3 border-b border-slate-100 pb-3">
              <ShieldCheck className="w-6 h-6 text-royal-700" />
              <div>
                <h3 className="font-bold text-base text-navy-950">Review & Confirm Transfer</h3>
                <p className="text-[10px] text-slate-500">Two-factor transaction verification</p>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 text-xs space-y-2 border border-slate-200">
              <div className="flex justify-between py-1">
                <span className="text-slate-500">Debit From:</span>
                <span className="font-mono font-bold text-slate-900">{currentSource?.accountNumber}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-500">Payee Name:</span>
                <span className="font-bold text-navy-950">{recipientName || 'Beneficiary'}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-500">Payee Destination:</span>
                <span className="font-mono text-slate-800">{transferType === 'UPI' ? upiId : destAccount}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-500">Transfer Rail:</span>
                <span className="font-bold text-royal-700">{transferType}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-500">Charges:</span>
                <span className="font-semibold text-emerald-600">₹0.00 (Waived)</span>
              </div>
              <div className="flex justify-between py-2 border-t border-slate-200 font-bold text-sm">
                <span className="text-slate-900">Total Net Debit:</span>
                <span className="text-slate-900 font-mono">₹{Number(amount).toLocaleString('en-IN')}</span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Enter Transaction PIN (Demo: 1234)</label>
              <input
                type="password"
                maxLength={4}
                value={securityPin}
                onChange={(e) => setSecurityPin(e.target.value)}
                className="w-full text-center tracking-widest text-lg font-bold py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 font-mono focus:bg-white focus:ring-2 focus:ring-royal-600"
              />
            </div>

            <div className="flex space-x-3 pt-2">
              <button
                type="button"
                onClick={() => setShowConfirmModal(false)}
                className="flex-1 py-2.5 rounded-xl text-xs font-semibold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={loading}
                onClick={handleExecuteTransfer}
                className="flex-1 py-2.5 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 shadow-xs flex items-center justify-center space-x-1.5"
              >
                {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <span>Authorize Transfer</span>}
              </button>
            </div>
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

export default TransferPage;