import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Users,
  Wallet,
  CheckCircle2,
  Briefcase,
  TrendingUp,
  TrendingDown,
  ArrowRightLeft,
  AlertTriangle,
  ChevronRight,
  ShieldCheck
} from 'lucide-react';
import api from '../../services/api';
import StatCard from '../../components/common/StatCard';

const StaffOverview = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOverview = async () => {
      try {
        const res = await api.get('/staff/overview');
        if (res.data.success) {
          setData(res.data);
        }
      } catch (err) {
        console.error('Error fetching staff overview:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchOverview();
  }, []);

  if (loading) {
    return <div className="p-12 text-center text-slate-500">Loading branch operations...</div>;
  }

  const stats = data?.stats || {};

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-blue-50 text-royal-800 text-xs font-semibold mb-2 border border-blue-200">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Authorized Branch Staff Operations Desk</span>
          </div>
          <h1 className="text-2xl font-bold text-navy-950">Staff Operational Dashboard</h1>
          <p className="text-xs text-slate-500 mt-1">Branch customer lifecycle, compliance verifications, and credit underwriting</p>
        </div>
      </div>

      {/* KPI Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard
          title="Total Customers"
          value={stats.totalCustomers || 10}
          subtitle={`Active: ${stats.activeCustomers || 10} Accounts`}
          icon={Users}
          color="blue"
        />

        <StatCard
          title="Total Branch Deposits"
          value={`₹${((stats.totalDeposits || 0) / 100000).toFixed(1)}L`}
          subtitle="Net savings & current balances"
          icon={Wallet}
          color="emerald"
        />

        <StatCard
          title="Pending KYC Queue"
          value={stats.pendingKYC || 0}
          subtitle="Awaiting compliance review"
          icon={CheckCircle2}
          color="purple"
        />

        <StatCard
          title="Pending Loan Originations"
          value={stats.pendingLoans || 0}
          subtitle="Credit appraisal required"
          icon={Briefcase}
          color="amber"
        />
      </div>

      {/* Quick Action Navigation Buttons */}
      <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs">
        <h3 className="font-bold text-sm text-navy-950 mb-4">Operations Workflow Stations</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link
            to="/staff/kyc"
            className="p-4 rounded-xl bg-slate-50 border border-slate-200 hover:border-royal-600 hover:bg-blue-50/50 transition-all flex items-center justify-between group shadow-2xs"
          >
            <div>
              <p className="font-bold text-xs text-slate-900">KYC Verifications</p>
              <p className="text-[10px] text-royal-700 font-semibold">{stats.pendingKYC || 0} applications pending</p>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-royal-700" />
          </Link>

          <Link
            to="/staff/loans"
            className="p-4 rounded-xl bg-slate-50 border border-slate-200 hover:border-amber-600 hover:bg-amber-50/50 transition-all flex items-center justify-between group shadow-2xs"
          >
            <div>
              <p className="font-bold text-xs text-slate-900">Loan Credit Desk</p>
              <p className="text-[10px] text-amber-700 font-semibold">{stats.pendingLoans || 0} loans to assess</p>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-amber-700" />
          </Link>

          <Link
            to="/staff/customers"
            className="p-4 rounded-xl bg-slate-50 border border-slate-200 hover:border-royal-600 hover:bg-blue-50/50 transition-all flex items-center justify-between group shadow-2xs"
          >
            <div>
              <p className="font-bold text-xs text-slate-900">Customer Directory</p>
              <p className="text-[10px] text-royal-700 font-semibold">Manage profiles & locks</p>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-royal-700" />
          </Link>

          <Link
            to="/staff/transactions"
            className="p-4 rounded-xl bg-slate-50 border border-slate-200 hover:border-rose-600 hover:bg-rose-50/50 transition-all flex items-center justify-between group shadow-2xs"
          >
            <div>
              <p className="font-bold text-xs text-slate-900">Live Monitoring</p>
              <p className="text-[10px] text-rose-700 font-semibold">High-value & suspicious</p>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-rose-700" />
          </Link>
        </div>
      </div>

      {/* Today's Transactions Overview */}
      <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-bold text-base text-navy-950">Recent Branch Transaction Flow</h3>
            <p className="text-xs text-slate-500">Live transaction stream processed today</p>
          </div>
          <Link to="/staff/transactions" className="text-xs text-royal-700 font-semibold hover:underline">
            View Live Stream
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] tracking-wider border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Transaction ID</th>
                <th className="py-3 px-4">Sender</th>
                <th className="py-3 px-4">Recipient</th>
                <th className="py-3 px-4">Channel</th>
                <th className="py-3 px-4 text-right">Amount</th>
                <th className="py-3 px-4 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {(data?.recentTransactions || []).length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-400">No transactions recorded today yet</td>
                </tr>
              ) : (
                data.recentTransactions.map((tx) => (
                  <tr key={tx._id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-royal-700">{tx.transactionId}</td>
                    <td className="py-3 px-4 text-slate-800 font-medium">{tx.senderName}</td>
                    <td className="py-3 px-4 text-slate-800 font-medium">{tx.receiverName}</td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700">
                        {tx.channel}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right font-mono font-bold text-slate-900">
                      ₹{Number(tx.amount).toLocaleString('en-IN')}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        {tx.status.toUpperCase()}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default StaffOverview;