import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Lock, Mail, ArrowRight, ShieldCheck, UserCheck, AlertCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { toast } from '../../components/common/Toast';
import BankLogo from '../../components/common/BankLogo';

const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [activeTab, setActiveTab] = useState('customer'); // 'customer', 'staff', 'admin'
  const [email, setEmail] = useState('rahul.sharma@example.com');
  const [password, setPassword] = useState('Customer@123');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const demoAccounts = [
    {
      roleName: 'Customer (Primary)',
      name: 'Rahul Sharma',
      email: 'rahul.sharma@example.com',
      password: 'Customer@123',
      tab: 'customer',
      badgeColor: 'bg-blue-50 text-royal-700 border-blue-200',
      desc: 'Full access to accounts, ₹1,20,000+ balance, cards, loans, FDs'
    },
    {
      roleName: 'Customer (Secondary)',
      name: 'Priya Patel',
      email: 'priya.patel@example.com',
      password: 'Customer@123',
      tab: 'customer',
      badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      desc: 'Useful for testing inter-customer real-time money transfers'
    },
    {
      roleName: 'Staff / Branch Officer',
      name: 'Rajesh Kumar',
      email: 'rajesh.kumar@auraapex.com',
      password: 'Staff@123',
      tab: 'staff',
      badgeColor: 'bg-purple-50 text-purple-700 border-purple-200',
      desc: 'Review KYC documents, approve & disburse loans, manage accounts'
    },
    {
      roleName: 'System Administrator',
      name: 'Vikramaditya Singhania',
      email: 'admin@auraapex.com',
      password: 'Admin@123',
      tab: 'admin',
      badgeColor: 'bg-amber-50 text-amber-700 border-amber-200',
      desc: 'Enterprise banking charts, user CRUD, branches, audit logs'
    }
  ];

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setError('');
    if (tab === 'customer') {
      setEmail('rahul.sharma@example.com');
      setPassword('Customer@123');
    } else if (tab === 'staff') {
      setEmail('rajesh.kumar@auraapex.com');
      setPassword('Staff@123');
    } else if (tab === 'admin') {
      setEmail('admin@auraapex.com');
      setPassword('Admin@123');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await login(email, password);
      toast.success(`Welcome back, ${res.user.name}!`);

      if (res.user.role === 'admin') {
        navigate('/admin');
      } else if (res.user.role === 'employee') {
        navigate('/staff');
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Login failed. Please verify credentials.';
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleQuickLogin = async (demo) => {
    setActiveTab(demo.tab);
    setEmail(demo.email);
    setPassword(demo.password);
    setLoading(true);
    setError('');

    try {
      const res = await login(demo.email, demo.password);
      toast.success(`Welcome back, ${res.user.name}!`);
      if (res.user.role === 'admin') {
        navigate('/admin');
      } else if (res.user.role === 'employee') {
        navigate('/staff');
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Login failed';
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col justify-between text-slate-800">
      
      {/* Navbar Header */}
      <header className="border-b border-slate-200 bg-white shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link to="/">
            <BankLogo size="md" variant="dark" />
          </Link>
          <div className="flex items-center space-x-3 text-xs">
            <span className="text-slate-500 hidden sm:inline">New to Aura Apex?</span>
            <Link to="/register" className="font-bold text-royal-700 hover:text-navy-950">
              Open An Account &rarr;
            </Link>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 flex flex-col lg:flex-row items-center justify-center gap-12">
        
        {/* Left: Login Form Card */}
        <div className="w-full max-w-md bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-xs space-y-6">
          <div className="text-center space-y-1">
            <h2 className="text-2xl font-black text-navy-950">NetBanking Portal</h2>
            <p className="text-xs text-slate-500">Sign in securely to your retail or institutional account</p>
          </div>

          {/* Role Navigation Tabs */}
          <div className="flex p-1 bg-slate-100 rounded-xl border border-slate-200 text-xs">
            {[
              { id: 'customer', label: 'Customer' },
              { id: 'staff', label: 'Bank Staff' },
              { id: 'admin', label: 'Administrator' },
            ].map(tab => (
              <button
                key={tab.id}
                type="button"
                onClick={() => handleTabChange(tab.id)}
                className={`flex-1 py-2 rounded-lg font-bold transition-all ${
                  activeTab === tab.id
                    ? 'bg-navy-900 text-white shadow-xs'
                    : 'text-slate-600 hover:text-navy-950'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {error && (
            <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 flex items-start space-x-2.5 text-rose-800 text-xs">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block text-slate-700 font-bold mb-1">User ID / Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:bg-white focus:ring-2 focus:ring-royal-600"
                  placeholder="name@example.com"
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between mb-1">
                <label className="text-slate-700 font-bold">Password</label>
                <Link to="/forgot-password" className="text-royal-700 hover:text-navy-950 text-[11px] font-semibold">
                  Forgot Password?
                </Link>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:bg-white focus:ring-2 focus:ring-royal-600"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 rounded-xl font-bold text-white bg-navy-900 hover:bg-royal-800 shadow-xs flex items-center justify-center space-x-2 transition-all mt-2"
            >
              {loading ? (
                <span>Authenticating Credentials...</span>
              ) : (
                <>
                  <span>Sign In to NetBanking</span>
                  <ArrowRight className="w-4 h-4 ml-1" />
                </>
              )}
            </button>
          </form>

          <div className="pt-2 text-center text-slate-400 text-[11px] flex items-center justify-center space-x-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>256-Bit SSL Encrypted Banking Connection</span>
          </div>
        </div>

        {/* Right: 1-Click Instant Demo Access Box */}
        <div className="w-full max-w-md space-y-4">
          <div className="p-4 rounded-2xl bg-blue-50/70 border border-blue-200">
            <h3 className="font-bold text-sm text-navy-950 flex items-center space-x-2">
              <UserCheck className="w-4 h-4 text-royal-700" />
              <span>1-Click Instant Demo Login</span>
            </h3>
            <p className="text-xs text-slate-600 mt-1">
              Click any profile below to instantly sign in without typing passwords:
            </p>
          </div>

          <div className="space-y-2.5">
            {demoAccounts.map((d, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleQuickLogin(d)}
                disabled={loading}
                className="w-full p-3.5 rounded-xl bg-white border border-slate-200 hover:border-royal-600 hover:shadow-md transition-all text-left group shadow-2xs"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-slate-900 group-hover:text-royal-700 transition-colors">
                    {d.name}
                  </span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border uppercase ${d.badgeColor}`}>
                    {d.roleName}
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 font-mono mt-0.5">{d.email}</p>
                <p className="text-[10px] text-slate-500 mt-1">{d.desc}</p>
              </button>
            ))}
          </div>
        </div>

      </main>

      <footer className="border-t border-slate-200 py-4 text-center text-xs text-slate-500 bg-white">
        &copy; 2026 Aura Apex Bank Limited. Official Schedule Commercial NetBanking Switch.
      </footer>
    </div>
  );
};

export default LoginPage;