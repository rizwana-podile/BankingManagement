import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Wallet,
  Send,
  Users,
  History,
  CreditCard,
  Briefcase,
  PiggyBank,
  Receipt,
  Bell,
  User,
  Shield,
  FileText,
  Building,
  Radio,
  CheckCircle2,
  ArrowRightLeft
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const Sidebar = ({ isOpen, onClose }) => {
  const { user } = useAuth();
  const role = user?.role || 'customer';

  const customerNav = [
    { name: 'Financial Overview', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Accounts', path: '/accounts', icon: Wallet },
    { name: 'Transfer Money', path: '/transfer', icon: Send },
    { name: 'Beneficiaries', path: '/beneficiaries', icon: Users },
    { name: 'Recent Transactions', path: '/transactions', icon: History },
    { name: 'Cards', path: '/cards', icon: CreditCard },
    { name: 'Loans & EMI', path: '/loans', icon: Briefcase },
    { name: 'Fixed Deposits', path: '/fixed-deposits', icon: PiggyBank },
    { name: 'Bill Payments', path: '/bills', icon: Receipt },
    { name: 'Notifications', path: '/notifications', icon: Bell },
    { name: 'Profile & KYC', path: '/profile', icon: User },
    { name: 'Security Center', path: '/security', icon: Shield },
  ];

  const staffNav = [
    { name: 'Staff Overview', path: '/staff', icon: LayoutDashboard },
    { name: 'Customer Directory', path: '/staff/customers', icon: Users },
    { name: 'Account Operations', path: '/staff/accounts', icon: Wallet },
    { name: 'KYC Verifications', path: '/staff/kyc', icon: CheckCircle2 },
    { name: 'Loan Credit Desk', path: '/staff/loans', icon: Briefcase },
    { name: 'Live Monitoring', path: '/staff/transactions', icon: ArrowRightLeft },
  ];

  const adminNav = [
    { name: 'Admin Overview', path: '/admin', icon: LayoutDashboard },
    { name: 'User Management', path: '/admin/users', icon: Users },
    { name: 'Branch Network', path: '/admin/branches', icon: Building },
    { name: 'System Broadcasts', path: '/admin/broadcast', icon: Radio },
    { name: 'Audit Logs', path: '/admin/audit-logs', icon: Shield },
    { name: 'Financial Reports', path: '/admin/reports', icon: FileText },
  ];

  const navItems = role === 'admin' ? adminNav : (role === 'employee' ? staffNav : customerNav);

  return (
    <>
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-xs lg:hidden"
        />
      )}

      <aside
        className={`fixed top-16 bottom-0 left-0 z-40 w-64 bg-white border-r border-slate-200 shadow-xs transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full justify-between p-4 overflow-y-auto">
          
          <div className="space-y-1">
            <div className="px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
              {role === 'admin' ? 'Administration' : (role === 'employee' ? 'Branch Operations' : 'Main Navigation')}
            </div>

            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={() => onClose && onClose()}
                  end={item.path === '/dashboard' || item.path === '/staff' || item.path === '/admin'}
                  className={({ isActive }) =>
                    `flex items-center space-x-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all duration-150 ${
                      isActive
                        ? 'bg-navy-900 text-white shadow-xs border-r-2 border-gold-500'
                        : 'text-slate-600 hover:text-navy-950 hover:bg-slate-100/80'
                    }`
                  }
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{item.name}</span>
                </NavLink>
              );
            })}
          </div>

          {/* Institutional Compliance Notice */}
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 text-[11px] text-slate-500 space-y-1 mt-4">
            <div className="flex items-center space-x-1.5 text-navy-900 font-bold">
              <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />
              <span>RBI Scheduled Bank</span>
            </div>
            <p className="text-[10px] text-slate-400 leading-tight">
              Aura Apex Core Banking 2.0 &bull; 256-Bit SSL Encrypted
            </p>
          </div>

        </div>
      </aside>
    </>
  );
};

export default Sidebar;