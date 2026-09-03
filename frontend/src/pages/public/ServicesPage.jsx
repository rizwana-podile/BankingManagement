import React from 'react';
import { Link } from 'react-router-dom';
import { Wallet, PiggyBank, Briefcase, CreditCard, Send, ShieldCheck, ArrowRight } from 'lucide-react';
import BankLogo from '../../components/common/BankLogo';
import Footer from '../../components/common/Footer';

const ServicesPage = () => {
  const serviceList = [
    {
      title: 'Premier Savings Account',
      desc: 'High-yield everyday liquidity offering up to 4.0% interest p.a., unlimited free IMPS/UPI transfers, and zero minimum balance charges.',
      icon: Wallet,
      color: 'bg-blue-50 text-royal-700'
    },
    {
      title: 'Term & Fixed Deposits',
      desc: 'Guaranteed capital preservation yielding up to 7.6% p.a. with quarterly compounding, flexible tenures (6-60 months), and instant loans against FD.',
      icon: PiggyBank,
      color: 'bg-emerald-50 text-emerald-700'
    },
    {
      title: 'Retail & Personal Loans',
      desc: 'Quick collateral-free personal loans, home mortgages, and vehicle finance at competitive rates starting at 8.5% with immediate online disbursement.',
      icon: Briefcase,
      color: 'bg-purple-50 text-purple-700'
    },
    {
      title: 'RuPay & Visa Cards',
      desc: 'Platinum debit cards and Signature credit cards with contactless Tap & Pay, custom daily ATM spending limits, and one-tap instant blocking.',
      icon: CreditCard,
      color: 'bg-rose-50 text-rose-700'
    },
    {
      title: 'High-Value Remittance Rails',
      desc: 'Seamless electronic settlement channels via IMPS 24x7, NEFT batch processing, RTGS for transfers over ₹2 Lakhs, and instant UPI VPAs.',
      icon: Send,
      color: 'bg-cyan-50 text-cyan-700'
    },
    {
      title: 'Bharat Bill Payment (BBPS)',
      desc: 'One-click automated settlements for electricity, mobile recharge, municipal water utilities, broadband, and insurance premiums.',
      icon: ShieldCheck,
      color: 'bg-amber-50 text-amber-700'
    },
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-800 flex flex-col justify-between">
      
      {/* Top Header */}
      <header className="border-b border-slate-200 bg-white shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <Link to="/">
            <BankLogo size="lg" variant="dark" />
          </Link>
          <div className="hidden md:flex items-center space-x-8 text-sm font-semibold text-slate-600">
            <Link to="/" className="hover:text-navy-950 transition-colors">Home</Link>
            <Link to="/about" className="hover:text-navy-950 transition-colors">About Us</Link>
            <Link to="/services" className="text-navy-950 font-bold border-b-2 border-gold-500 pb-0.5">Services</Link>
            <Link to="/contact" className="hover:text-navy-950 transition-colors">Contact</Link>
          </div>
          <Link
            to="/login"
            className="px-4 py-2 rounded-xl text-xs font-bold bg-navy-900 text-white hover:bg-royal-800 transition-colors shadow-xs"
          >
            NetBanking Login
          </Link>
        </div>
      </header>

      <main className="flex-1">
        <section className="py-16 bg-white border-b border-slate-200">
          <div className="max-w-4xl mx-auto px-4 text-center space-y-4">
            <span className="text-xs font-bold uppercase tracking-wider text-royal-700">COMPREHENSIVE BANKING SOLUTIONS</span>
            <h1 className="text-3xl sm:text-5xl font-black text-navy-950">Banking Products & Facilities</h1>
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-2xl mx-auto">
              Tailored retail and institutional financial products designed to meet every milestone of your life and business.
            </p>
          </div>
        </section>

        <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {serviceList.map((s, idx) => {
              const Icon = s.icon;
              return (
                <div key={idx} className="p-8 rounded-2xl bg-white border border-slate-200 shadow-xs hover:shadow-md transition-all space-y-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${s.color}`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold text-navy-950">{s.title}</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">{s.desc}</p>
                  <div className="pt-2">
                    <Link
                      to="/login"
                      className="text-xs font-bold text-royal-700 hover:text-navy-950 inline-flex items-center space-x-1"
                    >
                      <span>Access Product</span>
                      <ArrowRight className="w-3.5 h-3.5 ml-0.5" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default ServicesPage;