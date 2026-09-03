import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Award, Building2, Users, CheckCircle2, ArrowRight } from 'lucide-react';
import BankLogo from '../../components/common/BankLogo';
import Footer from '../../components/common/Footer';

const AboutPage = () => {
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
            <Link to="/about" className="text-navy-950 font-bold border-b-2 border-gold-500 pb-0.5">About Us</Link>
            <Link to="/services" className="hover:text-navy-950 transition-colors">Services</Link>
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
        {/* Hero Section */}
        <section className="py-16 bg-white border-b border-slate-200">
          <div className="max-w-4xl mx-auto px-4 text-center space-y-4">
            <span className="text-xs font-bold uppercase tracking-wider text-royal-700">INSTITUTIONAL PROFILE</span>
            <h1 className="text-3xl sm:text-5xl font-black text-navy-950">About Aura Apex Bank</h1>
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-2xl mx-auto">
              A premier schedule commercial digital banking institution registered under the Banking Regulation Act, 1949. Delivering modern financial security and high-speed settlement rails across India.
            </p>
          </div>
        </section>

        {/* Pillars */}
        <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
              <div className="w-12 h-12 rounded-xl bg-blue-50 text-royal-700 flex items-center justify-center">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-navy-950">Fiduciary Trust</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Licensed and scheduled under RBI supervision, our deposits are covered by DICGC insurance up to ₹5,00,000 per depositor.
              </p>
            </div>

            <div className="p-8 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
                <Award className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-navy-950">Apex Technology</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Sub-second fund clearances across IMPS, UPI, and RTGS backed by enterprise-grade 256-bit encryption and ISO 27001 certification.
              </p>
            </div>

            <div className="p-8 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
              <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center">
                <Building2 className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-navy-950">Nationwide Presence</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Headquartered at Nariman Point, Mumbai, with full-service branches in New Delhi, Bengaluru, and Chennai, plus unified NetBanking nationwide.
              </p>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default AboutPage;