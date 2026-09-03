import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowLeft, ArrowRight, ShieldCheck, CheckCircle2 } from 'lucide-react';
import api from '../../services/api';
import { toast } from '../../components/common/Toast';
import BankLogo from '../../components/common/BankLogo';

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.post('/auth/forgot-password', { email });
      if (res.data.success) {
        setSubmitted(true);
        toast.success(res.data.message);
      }
    } catch (err) {
      toast.error('Failed to submit recovery request');
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
          <Link to="/login" className="text-xs font-bold text-royal-700 hover:text-navy-950 flex items-center space-x-1">
            <ArrowLeft className="w-4 h-4 mr-1" />
            <span>Back to Login</span>
          </Link>
        </div>
      </header>

      <main className="flex-1 max-w-md w-full mx-auto px-4 py-12">
        <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-xs space-y-6">
          <div className="text-center space-y-1">
            <h2 className="text-2xl font-black text-navy-950">Password Recovery</h2>
            <p className="text-xs text-slate-500">Provide your registered NetBanking email address to reset access</p>
          </div>

          {submitted ? (
            <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-center space-y-3">
              <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
              <p className="text-xs font-semibold text-emerald-900">
                A password reset token link has been dispatched to your email address.
              </p>
              <Link to="/login" className="inline-block text-xs font-bold text-royal-700 hover:underline">
                Return to Login &rarr;
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-700 font-bold mb-1">Registered Email ID</label>
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

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-4 rounded-xl font-bold text-white bg-navy-900 hover:bg-royal-800 shadow-xs flex items-center justify-center space-x-2 transition-all mt-2"
              >
                {loading ? <span>Verifying Account...</span> : <span>Send Recovery Link</span>}
              </button>
            </form>
          )}

          <div className="pt-2 text-center text-slate-400 text-[11px] flex items-center justify-center space-x-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>256-Bit SSL Encrypted Verification Channel</span>
          </div>
        </div>
      </main>

      <footer className="border-t border-slate-200 py-4 text-center text-xs text-slate-500 bg-white">
        &copy; 2026 Aura Apex Bank Limited. Official Schedule Commercial NetBanking Switch.
      </footer>
    </div>
  );
};

export default ForgotPasswordPage;