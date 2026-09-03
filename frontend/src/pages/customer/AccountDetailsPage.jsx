import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Wallet, ArrowLeft, ArrowUpRight, ArrowDownLeft, Download, Printer } from 'lucide-react';
import api from '../../services/api';
import ReceiptModal from '../../components/common/ReceiptModal';

const AccountDetailsPage = () => {
  const { id } = useParams();
  const [account, setAccount] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedReceipt, setSelectedReceipt] = useState(null);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const res = await api.get(`/accounts/${id}`);
        if (res.data.success) {
          setAccount(res.data.account);
          setTransactions(res.data.transactions);
        }
      } catch (err) {
        console.error('Error fetching account details:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchDetails();
  }, [id]);

  if (loading) {
    return <div className="p-12 text-center text-slate-500">Loading account ledger...</div>;
  }

  if (!account) {
    return (
      <div className="p-8 text-center text-slate-500 space-y-4">
        <p>Account not found</p>
        <Link to="/accounts" className="text-royal-700 hover:underline">Return to Accounts</Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Link to="/accounts" className="inline-flex items-center space-x-2 text-xs font-semibold text-slate-500 hover:text-navy-950">
        <ArrowLeft className="w-4 h-4" />
        <span>Back to All Accounts</span>
      </Link>

      <div className="p-6 sm:p-8 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col md:flex-row justify-between gap-6">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-royal-700">{account.accountType} ACCOUNT LEDGER</span>
          <h1 className="text-2xl font-bold text-navy-950 mt-1">Account {account.accountNumber}</h1>
          <p className="text-xs text-slate-500 mt-1">IFSC: {account.ifscCode} &bull; Status: {account.status.toUpperCase()}</p>
        </div>
        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-left md:text-right">
          <span className="text-[11px] text-slate-500 font-bold uppercase">Current Balance</span>
          <div className="text-3xl font-black text-slate-900 font-mono">
            ₹{Number(account.balance).toLocaleString('en-IN')}
          </div>
        </div>
      </div>

      <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs">
        <h3 className="font-bold text-base text-navy-950 mb-4">Complete Transaction Ledger</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] tracking-wider border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Date / Time</th>
                <th className="py-3 px-4">Reference No</th>
                <th className="py-3 px-4">Channel</th>
                <th className="py-3 px-4">Counterparty / Remarks</th>
                <th className="py-3 px-4 text-right">Amount</th>
                <th className="py-3 px-4 text-center">Receipt</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {transactions.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-400">No transactions recorded for this account</td>
                </tr>
              ) : (
                transactions.map((tx) => (
                  <tr key={tx._id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-4 font-mono text-slate-500">
                      {new Date(tx.createdAt).toLocaleDateString('en-IN')} {new Date(tx.createdAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                    </td>
                    <td className="py-3 px-4 font-mono font-bold text-royal-700">{tx.referenceNumber}</td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700">
                        {tx.channel}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-800">
                      <p className="font-semibold text-slate-900">{tx.type === 'credit' ? tx.senderName : tx.receiverName}</p>
                      <p className="text-[10px] text-slate-500 italic">{tx.remarks}</p>
                    </td>
                    <td className="py-3 px-4 text-right font-mono font-bold">
                      <span className={tx.type === 'credit' ? 'text-emerald-600' : 'text-slate-900'}>
                        {tx.type === 'credit' ? '+' : '-'}₹{Number(tx.amount).toLocaleString('en-IN')}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <button
                        onClick={() => setSelectedReceipt({
                          bankName: 'AURA APEX BANK',
                          transactionId: tx.transactionId,
                          referenceNumber: tx.referenceNumber,
                          date: new Date(tx.createdAt).toLocaleDateString('en-IN'),
                          time: new Date(tx.createdAt).toLocaleTimeString('en-IN'),
                          senderName: tx.senderName,
                          senderAccount: tx.senderAccountNumber,
                          senderIfsc: tx.senderIfsc,
                          receiverName: tx.receiverName,
                          receiverAccount: tx.receiverAccountNumber,
                          receiverIfsc: tx.receiverIfsc,
                          amount: tx.amount,
                          transferType: tx.channel,
                          status: tx.status.toUpperCase(),
                          remainingBalance: tx.balanceAfter,
                          remarks: tx.remarks
                        })}
                        className="px-2.5 py-1 rounded text-[11px] font-bold bg-blue-50 text-royal-700 hover:bg-royal-700 hover:text-white transition-colors"
                      >
                        Receipt
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <ReceiptModal
        isOpen={Boolean(selectedReceipt)}
        onClose={() => setSelectedReceipt(null)}
        receipt={selectedReceipt}
      />
    </div>
  );
};

export default AccountDetailsPage;