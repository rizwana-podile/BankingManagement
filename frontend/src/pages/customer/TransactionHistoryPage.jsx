import React, { useState, useEffect } from 'react';
import {
  History,
  Search,
  Filter,
  Download,
  ArrowUpRight,
  ArrowDownLeft,
  Calendar,
  FileSpreadsheet
} from 'lucide-react';
import api from '../../services/api';
import ReceiptModal from '../../components/common/ReceiptModal';
import { toast } from '../../components/common/Toast';

const TransactionHistoryPage = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('all'); // 'all', 'credit', 'debit'
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all'); // 'all', 'today', 'week', 'month'
  const [selectedReceipt, setSelectedReceipt] = useState(null);

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const params = {};
      if (typeFilter !== 'all') params.type = typeFilter;
      if (statusFilter !== 'all') params.status = statusFilter;
      if (dateFilter !== 'all') params.dateRange = dateFilter;
      if (search) params.search = search;

      const res = await api.get('/transfers', { params });
      if (res.data.success) {
        setTransactions(res.data.transactions);
      }
    } catch (err) {
      console.error('Error fetching transactions:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, [typeFilter, statusFilter, dateFilter]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchTransactions();
  };

  const handleExportCSV = () => {
    if (transactions.length === 0) {
      toast.error('No transactions to export');
      return;
    }
    const headers = ['Transaction ID', 'Date', 'Type', 'Amount', 'Channel', 'Sender', 'Receiver', 'Ref No', 'Status', 'Remarks'];
    const rows = transactions.map(t => [
      t.transactionId,
      new Date(t.createdAt).toLocaleDateString(),
      t.type,
      t.amount,
      t.channel,
      t.senderName,
      t.receiverName,
      t.referenceNumber,
      t.status,
      `"${t.remarks || ''}"`
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Aura_Statement_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('Account statement downloaded as CSV');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-navy-950">Recent Transactions & Passbook</h1>
          <p className="text-xs text-slate-500 mt-1">Audit trail of all electronic fund settlements and charges</p>
        </div>
        <button
          onClick={handleExportCSV}
          className="px-4 py-2 rounded-xl text-xs font-semibold bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 shadow-xs flex items-center space-x-2 self-start sm:self-auto transition-colors"
        >
          <Download className="w-4 h-4 text-emerald-600" />
          <span>Export Statement (CSV)</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col md:flex-row gap-4 justify-between">
        <form onSubmit={handleSearchSubmit} className="flex-1 relative">
          <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by ID, beneficiary, ref number, or remarks..."
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-royal-600"
          />
        </form>

        <div className="flex flex-wrap gap-2 text-xs">
          {/* Type Filter */}
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 text-xs font-medium focus:bg-white"
          >
            <option value="all">All Types</option>
            <option value="credit">Credits Only (+)</option>
            <option value="debit">Debits Only (-)</option>
          </select>

          {/* Date Range */}
          <select
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 text-xs font-medium focus:bg-white"
          >
            <option value="all">All Time</option>
            <option value="today">Today</option>
            <option value="week">Past 7 Days</option>
            <option value="month">This Month</option>
          </select>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 text-xs font-medium focus:bg-white"
          >
            <option value="all">All Statuses</option>
            <option value="completed">Completed</option>
            <option value="failed">Failed</option>
          </select>
        </div>
      </div>

      {/* Transaction Table */}
      <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] tracking-wider border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Date & Time</th>
                <th className="py-3 px-4">Transaction ID</th>
                <th className="py-3 px-4">Channel</th>
                <th className="py-3 px-4">Party Details</th>
                <th className="py-3 px-4">Remarks</th>
                <th className="py-3 px-4 text-right">Amount</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4 text-center">Receipt</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-slate-400">Loading transactions...</td>
                </tr>
              ) : transactions.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-slate-400">No matching transactions found</td>
                </tr>
              ) : (
                transactions.map((tx) => (
                  <tr key={tx._id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4 font-mono text-slate-500">
                      {new Date(tx.createdAt).toLocaleDateString('en-IN')} <span className="text-[10px] text-slate-400">{new Date(tx.createdAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}</span>
                    </td>
                    <td className="py-3.5 px-4 font-mono font-bold text-royal-700">{tx.transactionId}</td>
                    <td className="py-3.5 px-4">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700">
                        {tx.channel}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-800">
                      <p className="font-semibold text-slate-900">{tx.type === 'credit' ? tx.senderName : tx.receiverName}</p>
                      <p className="text-[10px] text-slate-400 font-mono">Ref: {tx.referenceNumber}</p>
                    </td>
                    <td className="py-3.5 px-4 text-slate-600 italic max-w-xs truncate">{tx.remarks || '-'}</td>
                    <td className="py-3.5 px-4 text-right font-mono font-bold">
                      <span className={tx.type === 'credit' ? 'text-emerald-600' : 'text-slate-900'}>
                        {tx.type === 'credit' ? '+' : '-'}₹{Number(tx.amount).toLocaleString('en-IN')}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        tx.status === 'completed' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-rose-50 text-rose-700 border border-rose-200'
                      }`}>
                        {tx.status.toUpperCase()}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-center">
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
                        className="px-2.5 py-1 rounded-lg text-[11px] font-bold bg-blue-50 text-royal-700 hover:bg-royal-700 hover:text-white transition-colors"
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

export default TransactionHistoryPage;