import React, { useState, useEffect } from 'react';
import {
  Users,
  Wallet,
  Building,
  Briefcase,
  Radio,
  Shield,
  FileText,
  Activity,
  AlertTriangle,
  TrendingUp,
  CheckCircle2
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line
} from 'recharts';
import api from '../../services/api';
import StatCard from '../../components/common/StatCard';

const AdminOverview = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get('/admin/stats');
        if (res.data.success) {
          setData(res.data);
        }
      } catch (err) {
        console.error('Failed to load admin metrics:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return <div className="p-12 text-center text-slate-500">Loading enterprise bank metrics...</div>;
  }

  const stats = data?.stats || {};
  const charts = data?.charts || {};

  const pieColors = ['#1E40AF', '#059669', '#C59B27', '#7C3AED'];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-amber-50 text-amber-800 text-xs font-semibold mb-2 border border-amber-200">
            <Shield className="w-4 h-4 text-amber-600" />
            <span>Chief System Administrator Terminal</span>
          </div>
          <h1 className="text-2xl font-bold text-navy-950">Enterprise Bank Analytics & Control</h1>
          <p className="text-xs text-slate-500 mt-1">Institutional liquidity, regulatory capital reserve, and systemic operation metrics</p>
        </div>
      </div>

      {/* Top Level Banking KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard
          title="Total Customers"
          value={stats.totalCustomers || 10}
          subtitle="Retail & Corporate accounts"
          icon={Users}
          color="blue"
        />

        <StatCard
          title="Total System Deposits"
          value={`₹${((stats.totalDeposits || 0) / 100000).toFixed(2)}L`}
          subtitle="Aggregated customer balances"
          icon={Wallet}
          color="emerald"
        />

        <StatCard
          title="Active Loan Book"
          value={`₹${((stats.activeLoansValue || 0) / 100000).toFixed(1)}L`}
          subtitle={`${stats.activeLoans || 0} active retail facilities`}
          icon={Briefcase}
          color="purple"
        />

        <StatCard
          title="Bank Staff & Officers"
          value={stats.totalEmployees || 3}
          subtitle="Branch officers & compliance"
          icon={Shield}
          color="amber"
        />
      </div>

      {/* Charts Row 1: Monthly Volume (Area) + Deposits vs Withdrawals (Bar) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Monthly Transaction Volume */}
        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-base text-navy-950">Monthly Transaction Throughput</h3>
              <p className="text-xs text-slate-500">Total volume cleared across all payment rails (INR)</p>
            </div>
            <span className="text-xs font-bold text-royal-700 font-mono">+18.4% YoY</span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={charts.monthlyTransactionsData || []}>
                <defs>
                  <linearGradient id="volGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#1E40AF" stopOpacity={0.25}/>
                    <stop offset="95%" stopColor="#1E40AF" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="month" stroke="#94a3b8" fontSize={12} />
                <YAxis stroke="#94a3b8" fontSize={11} tickFormatter={(v) => `₹${v / 100000}L`} />
                <Tooltip
                  formatter={(val) => [`₹${val.toLocaleString('en-IN')}`, 'Cleared Volume']}
                  contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', borderRadius: '12px', fontSize: '12px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}
                />
                <Area type="monotone" dataKey="volume" stroke="#1E40AF" strokeWidth={2.5} fillOpacity={1} fill="url(#volGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Deposits vs Withdrawals */}
        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-base text-navy-950">Deposits vs Withdrawals</h3>
              <p className="text-xs text-slate-500">Cash-in vs cash-out liquidity balance</p>
            </div>
            <div className="flex items-center space-x-3 text-xs">
              <span className="flex items-center space-x-1 text-emerald-700 font-medium">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-600" />
                <span>Deposits</span>
              </span>
              <span className="flex items-center space-x-1 text-royal-700 font-medium">
                <span className="w-2.5 h-2.5 rounded-full bg-royal-700" />
                <span>Withdrawals</span>
              </span>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={charts.monthlyTransactionsData || []}>
                <XAxis dataKey="month" stroke="#94a3b8" fontSize={12} />
                <YAxis stroke="#94a3b8" fontSize={11} tickFormatter={(v) => `₹${v / 100000}L`} />
                <Tooltip
                  formatter={(val) => [`₹${val.toLocaleString('en-IN')}`, '']}
                  contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', borderRadius: '12px', fontSize: '12px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}
                />
                <Bar dataKey="deposits" fill="#059669" radius={[4, 4, 0, 0]} />
                <Bar dataKey="withdrawals" fill="#1E40AF" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* Charts Row 2: Customer Growth + Channel Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Customer Growth Trend */}
        <div className="lg:col-span-2 p-6 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <h3 className="font-bold text-base text-navy-950 mb-1">Customer Base Expansion</h3>
          <p className="text-xs text-slate-500 mb-4">Total registered active banking clients</p>
          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={charts.customerGrowthData || []}>
                <XAxis dataKey="month" stroke="#94a3b8" fontSize={12} />
                <YAxis stroke="#94a3b8" fontSize={11} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', borderRadius: '12px', fontSize: '12px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}
                />
                <Line type="monotone" dataKey="customers" stroke="#059669" strokeWidth={2.5} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Channel Breakdown */}
        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-base text-navy-950">Payment Rails Share</h3>
            <p className="text-xs text-slate-500 mb-2">Volume distribution by clearing rail</p>
            <div className="h-44 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={charts.channelData || []}
                    innerRadius={45}
                    outerRadius={70}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {(charts.channelData || []).map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={pieColors[index % pieColors.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', borderRadius: '12px', fontSize: '12px' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-slate-100">
            {(charts.channelData || []).map((ch, idx) => (
              <div key={idx} className="flex items-center space-x-2 text-slate-600">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: pieColors[idx % pieColors.length] }} />
                <span>{ch.name}: <strong className="text-slate-900">{ch.value}%</strong></span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default AdminOverview;