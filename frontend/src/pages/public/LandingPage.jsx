import React from 'react';
import { Link } from 'react-router-dom';
import {
  ShieldCheck,
  Zap,
  Lock,
  ArrowRight,
  TrendingUp,
  CreditCard,
  Building2,
  PhoneCall,
  CheckCircle2,
  Users,
  Smartphone
} from 'lucide-react';
import Footer from '../../components/common/Footer';
import BankLogo from '../../components/common/BankLogo';

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-800 flex flex-col justify-between">
      
      {/* Top Header */}
      <header className="border-b border-slate-200 bg-white/95 backdrop-blur-md sticky top-0 z-30 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2">
            <BankLogo size="lg" variant="dark" />
          </Link>

          <div className="hidden md:flex items-center space-x-8 text-sm font-semibold text-slate-600">
            <Link to="/" className="text-navy-950 font-bold border-b-2 border-gold-500 pb-0.5">Home</Link>
            <Link to="/about" className="hover:text-navy-950 transition-colors">About Us</Link>
            <Link to="/services" className="hover:text-navy-950 transition-colors">Services</Link>
            <Link to="/contact" className="hover:text-navy-950 transition-colors">Contact</Link>
          </div>

          <div className="flex items-center space-x-3">
            <Link
              to="/login"
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:text-navy-950 hover:bg-slate-100 transition-colors border border-slate-300"
            >
              NetBanking Login
            </Link>
            <Link
              to="/register"
              className="px-4 py-2 rounded-xl text-xs font-bold bg-navy-900 text-white hover:bg-royal-800 transition-colors shadow-xs"
            >
              Open Account
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1">
        <section className="relative overflow-hidden pt-16 pb-20 lg:pt-24 lg:pb-32 bg-gradient-to-b from-white via-slate-50 to-[#F8FAFC] border-b border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="text-center max-w-3xl mx-auto">
              <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-royal-800 text-xs font-semibold mb-6">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>RBI Scheduled Commercial Bank &bull; DICGC Insured</span>
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-navy-950 tracking-tight leading-tight">
                Empowering Financial Futures, <span className="text-royal-700">Securing Every Horizon.</span>
              </h1>
              <p className="mt-6 text-base sm:text-lg text-slate-600 leading-relaxed">
                Experience next-generation retail and institutional banking. Instant high-speed transfers via IMPS, UPI, and RTGS, automated smart Fixed Deposits, digital loan origination, and 3 comprehensive management dashboards.
              </p>
              
              <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link
                  to="/login"
                  className="w-full sm:w-auto px-8 py-3.5 rounded-xl font-bold text-sm text-white bg-navy-900 hover:bg-royal-800 shadow-sm flex items-center justify-center space-x-2 transition-all"
                >
                  <span>Access NetBanking Portal</span>
                  <ArrowRight className="w-4 h-4 ml-1" />
                </Link>
                <Link
                  to="/register"
                  className="w-full sm:w-auto px-8 py-3.5 rounded-xl font-bold text-sm text-slate-700 bg-white hover:bg-slate-50 border border-slate-300 shadow-xs transition-all"
                >
                  Open Savings Account
                </Link>
              </div>

              {/* Trust Badges */}
              <div className="mt-12 grid grid-cols-2 sm:grid-cols-4 gap-4 text-center border-t border-slate-200/80 pt-8 text-xs text-slate-500">
                <div>
                  <p className="text-2xl font-black text-navy-950 font-mono">100%</p>
                  <p className="mt-0.5">Automated Settlements</p>
                </div>
                <div>
                  <p className="text-2xl font-black text-navy-950 font-mono">7.6% p.a.</p>
                  <p className="mt-0.5">Fixed Deposit Growth</p>
                </div>
                <div>
                  <p className="text-2xl font-black text-navy-950 font-mono">24x7</p>
                  <p className="mt-0.5">Instant IMPS & UPI</p>
                </div>
                <div>
                  <p className="text-2xl font-black text-navy-950 font-mono">256-Bit</p>
                  <p className="mt-0.5">Bank-Grade Encryption</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Feature Cards Section */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <h2 className="text-3xl font-black text-navy-950">Integrated Digital Banking Architecture</h2>
              <p className="text-sm text-slate-500 mt-2">Engineered for seamless retail liquidity and institutional governance</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="p-8 rounded-2xl bg-slate-50 border border-slate-200 shadow-xs hover:shadow-md transition-all space-y-4">
                <div className="w-12 h-12 rounded-xl bg-blue-100 text-royal-700 flex items-center justify-center">
                  <Zap className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-navy-950">Multi-Rail Settlements</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Real-time electronic funds remittance supporting IMPS 24x7, NEFT batch processing, RTGS gross settlements for high-value payments, and UPI handles.
                </p>
              </div>

              <div className="p-8 rounded-2xl bg-slate-50 border border-slate-200 shadow-xs hover:shadow-md transition-all space-y-4">
                <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-navy-950">Three Role Dashboards</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Dedicated control centers for Customers, Branch Officers, and Chief Administrators, featuring automated KYC workflows, loan underwriting, and audit trails.
                </p>
              </div>

              <div className="p-8 rounded-2xl bg-slate-50 border border-slate-200 shadow-xs hover:shadow-md transition-all space-y-4">
                <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center">
                  <CreditCard className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-navy-950">Smart Virtual Cards & Deposits</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Full card lifecycle controls with live spending limits and ATM block/unblock toggles, combined with quarterly compounding term deposits.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default LandingPage;