import React, { useState, useEffect } from 'react';
import { FileText, Download, Printer, Building, TrendingUp, Wallet } from 'lucide-react';
import api from '../../services/api';
import { toast } from '../../components/common/Toast';
import BankLogo from '../../components/common/BankLogo';

const AdminReports = () => {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const res = await api.get('/admin/reports');
        if (res.data.success) {
          setReport(res.data);
        }
      } catch (err) {
        console.error('Error fetching reports:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchReport();
  }, []);

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadReport = () => {
    if (!report) return;
    const summary = `
============================================================
      AURA APEX BANK - DAILY AUDITED FINANCIAL STATEMENT
============================================================
Report Timestamp:     ${new Date(report.reportDate).toISOString()}
Total System Balance: ₹${Number(report.summary.totalDeposits).toLocaleString('en-IN')}
Lifetime Txn Count:   ${report.summary.totalTransactions}
Today's Volume:       ₹${Number(report.summary.todayTransactionsVolume).toLocaleString('en-IN')} (${report.summary.todayTransactionsCount} transactions)

BRANCH NETWORK DEPOSIT DISTRIBUTION:
${report.branchPerformance.map(b => `- ${b.branchName} (${b.ifscCode}): ₹${Number(b.totalBalance).toLocaleString('en-IN')} (${b.accountsCount} accounts)`).join('\n')}
============================================================
`;
    const blob = new Blob([summary], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Aura_Financial_Report_${Date.now()}.txt`;
    link.click();
    URL.revokeObjectURL(url);
    toast.success('Financial statement downloaded');
  };

  if (loading) {
    return <div className="p-12 text-center text-slate-500">Generating financial reports...</div>;
  }

  const summary = report?.summary || {};
  const branches = report?.branchPerformance || [];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 no-print">
        <div>
          <h1 className="text-2xl font-bold text-navy-950">Consolidated Financial Statements</h1>
          <p className="text-xs text-slate-500 mt-1">Institutional balance sheet, branch asset allocation, and daily clearing summary</p>
        </div>
        <div className="flex space-x-3 self-start sm:self-auto">
          <button
            onClick={handleDownloadReport}
            className="px-4 py-2 rounded-xl text-xs font-semibold bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 shadow-xs flex items-center space-x-1.5 transition-colors"
          >
            <Download className="w-4 h-4 text-emerald-600" />
            <span>Download Statement</span>
          </button>
          <button
            onClick={handlePrint}
            className="px-4 py-2 rounded-xl text-xs font-bold bg-navy-900 hover:bg-royal-800 text-white shadow-xs flex items-center space-x-1.5 transition-colors"
          >
            <Printer className="w-4 h-4" />
            <span>Print Report</span>
          </button>
        </div>
      </div>

      <div className="p-6 sm:p-8 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-6">
        <div className="border-b border-slate-200 pb-4 flex items-center justify-between">
          <BankLogo size="md" variant="dark" subtitle="RBI LICENSE: SCB-2026-09" />
          <span className="text-xs text-slate-500 font-mono">Date: {new Date().toLocaleDateString('en-IN')}</span>
        </div>

        {/* Highlight Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
            <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Total Deposits in Vault</span>
            <p className="text-2xl font-black text-emerald-700 font-mono mt-1">
              ₹{Number(summary.totalDeposits || 0).toLocaleString('en-IN')}
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
            <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Today's Cleared Volume</span>
            <p className="text-2xl font-black text-royal-700 font-mono mt-1">
              ₹{Number(summary.todayTransactionsVolume || 0).toLocaleString('en-IN')}
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
            <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Today's Transactions</span>
            <p className="text-2xl font-black text-slate-900 font-mono mt-1">
              {summary.todayTransactionsCount || 0} Settled
            </p>
          </div>
        </div>

        {/* Branch Asset Allocation */}
        <div>
          <h3 className="font-bold text-sm text-navy-950 mb-3">Branch Network Asset Allocation</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] tracking-wider border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">Branch Name</th>
                  <th className="py-3 px-4">IFSC Code</th>
                  <th className="py-3 px-4">City</th>
                  <th className="py-3 px-4 text-center">Accounts Handled</th>
                  <th className="py-3 px-4 text-right">Deposits Held</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {branches.map((b, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/80">
                    <td className="py-3.5 px-4 font-bold text-slate-900">{b.branchName}</td>
                    <td className="py-3.5 px-4 font-mono font-bold text-royal-700">{b.ifscCode}</td>
                    <td className="py-3.5 px-4 text-slate-700">{b.city}</td>
                    <td className="py-3.5 px-4 text-center font-mono text-slate-800">{b.accountsCount}</td>
                    <td className="py-3.5 px-4 text-right font-mono font-bold text-emerald-700">
                      ₹{Number(b.totalBalance).toLocaleString('en-IN')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminReports;