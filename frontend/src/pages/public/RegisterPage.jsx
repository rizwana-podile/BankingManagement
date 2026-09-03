import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, Phone, Lock, ArrowRight, ShieldCheck, CheckCircle2 } from 'lucide-react';
import api from '../../services/api';
import { toast } from '../../components/common/Toast';
import BankLogo from '../../components/common/BankLogo';

const RegisterPage = () => {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [accountType, setAccountType] = useState('savings');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    try {
      const res = await api.post('/auth/register', {
        name,
        email,
        phone,
        password,
        accountType
      });

      if (res.data.success) {
        toast.success('Registration successful! Please sign in with your credentials.');
        navigate('/login');
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Registration failed. Please try again.';
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col justify-between text-slate-800">
      <header className="border-b border-slate-200 bg-white shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link to="/">
            <BankLogo size="md" variant="dark" />
          </Link>
          <div className="flex items-center space-x-3 text-xs">
            <span className="text-slate-500 hidden sm:inline">Already registered?</span>
            <Link to="/login" className="font-bold text-royal-700 hover:text-navy-950">
              Sign In to NetBanking &rarr;
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-xl w-full mx-auto px-4 py-10">
        <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-xs space-y-6">
          <div className="text-center space-y-1">
            <h2 className="text-2xl font-black text-navy-950">Open a Bank Account</h2>
            <p className="text-xs text-slate-500">Fast digital onboarding with zero minimum balance requirement</p>
          </div>

          {error && (
            <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-medium">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block text-slate-700 font-bold mb-1">Full Legal Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:bg-white focus:ring-2 focus:ring-royal-600"
                placeholder="e.g. Ananya Roy"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-700 font-bold mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:bg-white focus:ring-2 focus:ring-royal-600"
                  placeholder="ananya@example.com"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Mobile Contact</label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:bg-white focus:ring-2 focus:ring-royal-600"
                  placeholder="+91 98765 43210"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-1">Select Account Type</label>
              <select
                value={accountType}
                onChange={(e) => setAccountType(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:bg-white focus:ring-2 focus:ring-royal-600 font-medium"
              >
                <option value="savings">Premier Savings Account (4.0% interest)</option>
                <option value="current">Commercial Current Account (High throughput)</option>
                <option value="salary">Corporate Salary Account (Zero balance privilege)</option>
              </select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-700 font-bold mb-1">Create Password</label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:bg-white focus:ring-2 focus:ring-royal-600"
                  placeholder="••••••••"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Confirm Password</label>
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:bg-white focus:ring-2 focus:ring-royal-600"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 rounded-xl font-bold text-white bg-navy-900 hover:bg-royal-800 shadow-xs flex items-center justify-center space-x-2 transition-all mt-3"
            >
              {loading ? (
                <span>Registering Account Dossier...</span>
              ) : (
                <>
                  <span>Complete Digital Onboarding</span>
                  <ArrowRight className="w-4 h-4 ml-1" />
                </>
              )}
            </button>
          </form>

          <div className="pt-2 text-center text-slate-400 text-[11px] flex items-center justify-center space-x-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Regulated by Reserve Bank of India &bull; ISO 27001 Secure</span>
          </div>
        </div>
      </main>

      <footer className="border-t border-slate-200 py-4 text-center text-xs text-slate-500 bg-white">
        &copy; 2026 Aura Apex Bank Limited. Official Schedule Commercial NetBanking Switch.
      </footer>
    </div>
  );
};

export default RegisterPage;