import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Wallet,
  Send,
  Receipt,
  PiggyBank,
  Briefcase,
  CreditCard,
  ArrowUpRight,
  ArrowDownLeft,
  Calendar,
  AlertCircle,
  FileText,
  ShieldCheck,
  TrendingUp,
  ChevronRight
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import ReceiptModal from '../../components/common/ReceiptModal';

const CustomerOverview = () => {
  const { user, accounts, activeAccount } = useAuth();
  const [transactions, setTransactions] = useState([]);
  const [loans, setLoans] = useState([]);
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedReceipt, setSelectedReceipt] = useState(null);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        const [txRes, loanRes, cardRes] = await Promise.all([
          api.get('/transfers?limit=6'),
          api.get('/loans'),
          api.get('/cards')
        ]);
        if (txRes.data.success) setTransactions(txRes.data.transactions.slice(0, 6));
        if (loanRes.data.success) setLoans(loanRes.data.loans);
        if (cardRes.data.success) setCards(cardRes.data.cards);
      } catch (err) {
        console.error('Error loading dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };
    loadDashboardData();
  }, []);

  const totalBalance = accounts.reduce((sum, a) => sum + (a.balance || 0), 0);
  const savingsAccount = accounts.find(a => a.accountType === 'savings');
  const salaryAccount = accounts.find(a => a.accountType === 'salary' || a.accountType === 'current');

  // Chart Data: Income vs Expenses (Last 5 Months)
  const cashFlowData = [
    { month: 'May', income: 145000, expense: 62000 },
    { month: 'Jun', income: 145000, expense: 78000 },
    { month: 'Jul', income: 153000, expense: 84000 },
    { month: 'Aug', income: 150000, expense: 69000 },
    { month: 'Sep', income: 165000, expense: 71000 },
  ];

  // Spending Breakdown
  const spendingData = [
    { name: 'Transfers & Remittance', value: 45, color: '#1E40AF' },
    { name: 'Utilities & Bills', value: 20, color: '#059669' },
    { name: 'Shopping & Retail', value: 15, color: '#C59B27' },
    { name: 'Food & Dining', value: 12, color: '#D97706' },
    { name: 'Investments / FDs', value: 8, color: '#7C3AED' },
  ];

  const activeLoan = loans.find(l => l.status === 'disbursed');
  const activeCard = cards[0];

  return (
    <div className="space-y-6">
      
      {/* Welcome & Financial Overview Hero Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-navy-900 via-navy-800 to-royal-800 p-6 sm:p-8 text-white shadow-md">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white/10 text-gold-300 text-xs font-semibold mb-2 backdrop-blur-xs border border-white/10">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>KYC Verified &bull; NetBanking Operational</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Welcome back, {user?.name || 'Customer'} 👋
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-1">
              Your Financial Overview &bull; Live account portfolio across Aura Apex Bank
            </p>
          </div>

          {/* Aggregated Total Balance */}
          <div className="text-left md:text-right bg-white/10 p-4 sm:p-5 rounded-2xl border border-white/15 backdrop-blur-xs">
            <span className="text-[11px] font-bold text-slate-300 uppercase tracking-wider">
              Total Account Balance
            </span>
            <div className="text-3xl sm:text-4xl font-black text-emerald-400 font-mono mt-0.5">
              ₹{totalBalance.toLocaleString('en-IN')}
            </div>
            <span className="text-[10px] text-slate-300 block mt-1">Across {accounts.length} Active Accounts</span>
          </div>
        </div>
      </div>

      {/* Account Cards Breakdown */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {/* Savings Account */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs hover:shadow-md transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Savings Account</span>
            <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
              ACTIVE
            </span>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-bold text-slate-900 font-mono">
              ₹{savingsAccount ? savingsAccount.balance.toLocaleString('en-IN') : '0'}
            </span>
            <p className="text-[11px] text-slate-500 font-mono mt-1">
              A/C: {savingsAccount?.accountNumber || '100248591000'}
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="text-slate-400 font-mono">IFSC: {savingsAccount?.ifscCode || 'AURA0001001'}</span>
            <Link to="/accounts" className="text-royal-700 hover:text-navy-950 font-semibold flex items-center">
              <span>View Details</span>
              <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
            </Link>
          </div>
        </div>

        {/* Salary / Current Account */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs hover:shadow-md transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              {salaryAccount?.accountType === 'salary' ? 'Corporate Salary' : 'Commercial Current'}
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-blue-50 text-royal-700 border border-blue-200">
              ACTIVE
            </span>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-bold text-slate-900 font-mono">
              ₹{salaryAccount ? salaryAccount.balance.toLocaleString('en-IN') : '68,500'}
            </span>
            <p className="text-[11px] text-slate-500 font-mono mt-1">
              A/C: {salaryAccount?.accountNumber || '100248599901'}
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="text-slate-400 font-mono">IFSC: {salaryAccount?.ifscCode || 'AURA0001001'}</span>
            <Link to="/accounts" className="text-royal-700 hover:text-navy-950 font-semibold flex items-center">
              <span>View Details</span>
              <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
            </Link>
          </div>
        </div>

        {/* Active Loan Facility */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs hover:shadow-md transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Active Loan Facility</span>
            <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-purple-50 text-purple-700 border border-purple-200">
              {activeLoan ? activeLoan.loanType.toUpperCase() : 'NO ACTIVE LOAN'}
            </span>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-bold text-slate-900 font-mono">
              ₹{activeLoan ? Number(activeLoan.outstandingAmount).toLocaleString('en-IN') : '0'}
            </span>
            <p className="text-[11px] text-slate-500 font-mono mt-1">
              {activeLoan ? `EMI: ₹${activeLoan.emiAmount.toLocaleString('en-IN')}/mo` : 'Sanctioned limit: ₹0'}
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="text-slate-400">Tenure: {activeLoan ? `${activeLoan.tenureMonths} Mo` : '-'}</span>
            <Link to="/loans" className="text-royal-700 hover:text-navy-950 font-semibold flex items-center">
              <span>Pay EMI</span>
              <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
            </Link>
          </div>
        </div>
      </div>

      {/* Quick Action Navigation Grid */}
      <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs">
        <h3 className="font-bold text-sm text-navy-950 mb-4">Quick Financial Services</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          <Link
            to="/transfer"
            className="p-4 rounded-xl bg-slate-50 hover:bg-blue-50 border border-slate-200 hover:border-blue-200 transition-all text-center flex flex-col items-center justify-center space-y-2 group"
          >
            <div className="w-10 h-10 rounded-xl bg-blue-100 text-royal-700 flex items-center justify-center group-hover:scale-105 transition-transform">
              <Send className="w-5 h-5" />
            </div>
            <span className="text-xs font-semibold text-slate-800">Send Money</span>
          </Link>

          <Link
            to="/transactions"
            className="p-4 rounded-xl bg-slate-50 hover:bg-blue-50 border border-slate-200 hover:border-blue-200 transition-all text-center flex flex-col items-center justify-center space-y-2 group"
          >
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center group-hover:scale-105 transition-transform">
              <Receipt className="w-5 h-5" />
            </div>
            <span className="text-xs font-semibold text-slate-800">Passbook</span>
          </Link>

          <Link
            to="/bills"
            className="p-4 rounded-xl bg-slate-50 hover:bg-blue-50 border border-slate-200 hover:border-blue-200 transition-all text-center flex flex-col items-center justify-center space-y-2 group"
          >
            <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center group-hover:scale-105 transition-transform">
              <Calendar className="w-5 h-5" />
            </div>
            <span className="text-xs font-semibold text-slate-800">Pay Bills</span>
          </Link>

          <Link
            to="/fixed-deposits"
            className="p-4 rounded-xl bg-slate-50 hover:bg-blue-50 border border-slate-200 hover:border-blue-200 transition-all text-center flex flex-col items-center justify-center space-y-2 group"
          >
            <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center group-hover:scale-105 transition-transform">
              <PiggyBank className="w-5 h-5" />
            </div>
            <span className="text-xs font-semibold text-slate-800">Open FD</span>
          </Link>

          <Link
            to="/loans"
            className="p-4 rounded-xl bg-slate-50 hover:bg-blue-50 border border-slate-200 hover:border-blue-200 transition-all text-center flex flex-col items-center justify-center space-y-2 group"
          >
            <div className="w-10 h-10 rounded-xl bg-cyan-100 text-cyan-700 flex items-center justify-center group-hover:scale-105 transition-transform">
              <Briefcase className="w-5 h-5" />
            </div>
            <span className="text-xs font-semibold text-slate-800">Apply Loan</span>
          </Link>

          <Link
            to="/cards"
            className="p-4 rounded-xl bg-slate-50 hover:bg-blue-50 border border-slate-200 hover:border-blue-200 transition-all text-center flex flex-col items-center justify-center space-y-2 group"
          >
            <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center group-hover:scale-105 transition-transform">
              <CreditCard className="w-5 h-5" />
            </div>
            <span className="text-xs font-semibold text-slate-800">Manage Cards</span>
          </Link>
        </div>
      </div>

      {/* Analytics Row: Cash Flow Bar Chart + Spending Donut Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Income vs Expenses Bar Chart */}
        <div className="lg:col-span-2 p-6 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-base text-navy-950">Cash Flow Activity</h3>
              <p className="text-xs text-slate-500">Credits vs debits comparison over the last 5 months</p>
            </div>
            <div className="flex items-center space-x-3 text-xs">
              <div className="flex items-center space-x-1.5 font-medium">
                <span className="w-3 h-3 rounded-sm bg-emerald-600" />
                <span className="text-slate-600">Credits</span>
              </div>
              <div className="flex items-center space-x-1.5 font-medium">
                <span className="w-3 h-3 rounded-sm bg-royal-700" />
                <span className="text-slate-600">Debits</span>
              </div>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={cashFlowData}>
                <XAxis dataKey="month" stroke="#94a3b8" fontSize={12} />
                <YAxis stroke="#94a3b8" fontSize={11} tickFormatter={(v) => `₹${v / 1000}k`} />
                <Tooltip
                  formatter={(val) => [`₹${val.toLocaleString('en-IN')}`, '']}
                  contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', borderRadius: '12px', fontSize: '12px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}
                />
                <Bar dataKey="income" fill="#059669" radius={[4, 4, 0, 0]} />
                <Bar dataKey="expense" fill="#1E40AF" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category-Wise Spending Donut Chart */}
        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-base text-navy-950">Spending Categories</h3>
            <p className="text-xs text-slate-500 mb-3">Monthly expenditure allocation</p>
            <div className="h-44 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={spendingData}
                    innerRadius={50}
                    outerRadius={75}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {spendingData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', borderRadius: '12px', fontSize: '12px' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="space-y-1.5 text-xs pt-2 border-t border-slate-100">
            {spendingData.slice(0, 4).map((s, idx) => (
              <div key={idx} className="flex items-center justify-between text-slate-600">
                <span className="flex items-center space-x-2">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: s.color }} />
                  <span>{s.name}</span>
                </span>
                <span className="font-bold text-slate-900">{s.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Transactions Table */}
      <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-bold text-base text-navy-950">Recent Transactions</h3>
            <p className="text-xs text-slate-500">Real-time ledger updates for your primary account</p>
          </div>
          <Link
            to="/transactions"
            className="text-xs font-semibold text-royal-700 hover:text-navy-950 flex items-center space-x-1"
          >
            <span>Full Statement</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] tracking-wider border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Transaction ID</th>
                <th className="py-3 px-4">Channel</th>
                <th className="py-3 px-4">Counterparty / Description</th>
                <th className="py-3 px-4 text-right">Amount</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4 text-center">Receipt</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {transactions.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-400">No recent transactions recorded</td>
                </tr>
              ) : (
                transactions.map((tx) => (
                  <tr key={tx._id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4 text-slate-500 font-mono">
                      {new Date(tx.createdAt).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })}
                    </td>
                    <td className="py-3.5 px-4 font-mono font-bold text-royal-700">
                      {tx.transactionId}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700">
                        {tx.channel}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-800">
                      <p className="font-semibold text-slate-900">{tx.type === 'credit' ? tx.senderName : tx.receiverName}</p>
                      <p className="text-[10px] text-slate-500 italic">{tx.remarks}</p>
                    </td>
                    <td className="py-3.5 px-4 text-right font-mono font-bold">
                      <span className={tx.type === 'credit' ? 'text-emerald-600' : 'text-slate-900'}>
                        {tx.type === 'credit' ? '+' : '-'}₹{Number(tx.amount).toLocaleString('en-IN')}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
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

export default CustomerOverview;