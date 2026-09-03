import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Wallet, Copy, Check, ArrowRight, Download, ShieldCheck, CreditCard, Building } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { toast } from '../../components/common/Toast';

const AccountsPage = () => {
  const { accounts, activeAccount, setActiveAccount } = useAuth();
  const [copiedId, setCopiedId] = useState(null);

  const copyToClipboard = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    toast.info('Copied to clipboard');
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-navy-950">Your Bank Accounts</h1>
          <p className="text-xs text-slate-500 mt-1">Manage savings, checking, and corporate salary deposit portfolios</p>
        </div>
        <Link
          to="/transfer"
          className="px-4 py-2 rounded-xl text-xs font-bold bg-navy-900 hover:bg-royal-800 text-white shadow-xs flex items-center space-x-1.5 self-start sm:self-auto transition-colors"
        >
          <span>Initiate Transfer</span>
          <ArrowRight className="w-4 h-4 ml-1" />
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {accounts.map((acc) => (
          <div
            key={acc._id}
            className={`p-6 rounded-2xl bg-white border transition-all ${
              activeAccount?._id === acc._id
                ? 'border-royal-600 shadow-md ring-1 ring-royal-600'
                : 'border-slate-200 hover:border-slate-300 shadow-xs'
            }`}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2.5">
                <div className="w-9 h-9 rounded-xl bg-blue-50 text-royal-700 flex items-center justify-center">
                  <Wallet className="w-4 h-4" />
                </div>
                <span className="font-bold text-sm text-slate-900 capitalize">{acc.accountType} Account</span>
              </div>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 uppercase">
                {acc.status}
              </span>
            </div>

            <div className="my-4 p-4 rounded-xl bg-slate-50 border border-slate-200/80">
              <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Available Liquidity</span>
              <div className="text-2xl font-black text-slate-900 font-mono mt-1">
                ₹{Number(acc.balance).toLocaleString('en-IN')}
              </div>
              <span className="text-[10px] text-slate-500">Ledger Balance: ₹{Number(acc.ledgerBalance || acc.balance).toLocaleString('en-IN')}</span>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-500">Account Number</span>
                <div className="flex items-center space-x-1.5 font-mono text-slate-800 font-bold">
                  <span>{acc.accountNumber}</span>
                  <button
                    onClick={() => copyToClipboard(acc.accountNumber, `acc-${acc._id}`)}
                    className="text-slate-400 hover:text-royal-700"
                  >
                    {copiedId === `acc-${acc._id}` ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-500">Branch IFSC</span>
                <div className="flex items-center space-x-1.5 font-mono text-slate-800 font-bold">
                  <span>{acc.ifscCode}</span>
                  <button
                    onClick={() => copyToClipboard(acc.ifscCode, `ifsc-${acc._id}`)}
                    className="text-slate-400 hover:text-royal-700"
                  >
                    {copiedId === `ifsc-${acc._id}` ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-500">Branch Name</span>
                <span className="text-slate-700 font-medium truncate max-w-[160px]">
                  {acc.branchId?.branchName || 'Mumbai Nariman Point Flagship'}
                </span>
              </div>

              <div className="flex items-center justify-between py-1.5">
                <span className="text-slate-500">Opened On</span>
                <span className="text-slate-700 font-medium">
                  {new Date(acc.openingDate || acc.createdAt).toLocaleDateString('en-IN')}
                </span>
              </div>
            </div>

            <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between">
              <button
                onClick={() => {
                  setActiveAccount(acc);
                  toast.success(`Active account set to ${acc.accountNumber}`);
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  activeAccount?._id === acc._id
                    ? 'bg-blue-50 text-royal-700 border border-blue-200'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {activeAccount?._id === acc._id ? '✓ Default Active' : 'Set as Default'}
              </button>

              <Link
                to={`/accounts/${acc._id}`}
                className="text-xs text-royal-700 hover:text-navy-950 font-semibold flex items-center space-x-1"
              >
                <span>Full Ledger</span>
                <ArrowRight className="w-3.5 h-3.5 ml-0.5" />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AccountsPage;