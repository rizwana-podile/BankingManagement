import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin, Send, CheckCircle2 } from 'lucide-react';
import BankLogo from '../../components/common/BankLogo';
import Footer from '../../components/common/Footer';
import { toast } from '../../components/common/Toast';

const ContactPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [sent, setSent] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSent(true);
    toast.success('Your message has been received by Aura Apex Bank Customer Care.');
    setName('');
    setEmail('');
    setMessage('');
  };

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
            <Link to="/services" className="hover:text-navy-950 transition-colors">Services</Link>
            <Link to="/contact" className="text-navy-950 font-bold border-b-2 border-gold-500 pb-0.5">Contact</Link>
          </div>
          <Link
            to="/login"
            className="px-4 py-2 rounded-xl text-xs font-bold bg-navy-900 text-white hover:bg-royal-800 transition-colors shadow-xs"
          >
            NetBanking Login
          </Link>
        </div>
      </header>

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-royal-700">24X7 CUSTOMER CARE</span>
          <h1 className="text-3xl sm:text-4xl font-black text-navy-950">We Are Here to Assist You</h1>
          <p className="text-sm text-slate-600">Connect with our dedicated relationship managers or visit our branches</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Info Card */}
          <div className="p-8 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-6">
            <h3 className="font-bold text-lg text-navy-950">Corporate Headquarters</h3>
            
            <div className="space-y-4 text-xs text-slate-600">
              <div className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 text-royal-700 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-slate-900">Aura Apex Towers</p>
                  <p>Plot 44, Nariman Point, Marine Drive</p>
                  <p>Mumbai, Maharashtra 400021</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-royal-700 shrink-0" />
                <div>
                  <p className="font-bold text-slate-900">Toll-Free Customer Care</p>
                  <p>1800-425-AURA (2872) &bull; 24x7 Support</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-royal-700 shrink-0" />
                <div>
                  <p className="font-bold text-slate-900">Electronic Mail</p>
                  <p>care@auraapex.com &bull; grievance@auraapex.com</p>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-blue-50 border border-blue-200 text-royal-800 text-[11px] leading-relaxed">
              For emergency card blocking or fraudulent transaction disputes, contact our round-the-clock fraud surveillance team immediately at 1800-425-2872.
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2 p-8 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-6">
            <h3 className="font-bold text-lg text-navy-950">Send an Official Inquiry</h3>

            {sent && (
              <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center space-x-2 text-emerald-800 text-xs font-semibold">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                <span>Thank you! Your message has been received. Our relationship desk will respond within 24 hours.</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Your Full Name</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:bg-white focus:ring-2 focus:ring-royal-600"
                    placeholder="e.g. Sunil Verma"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">Email Address</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:bg-white focus:ring-2 focus:ring-royal-600"
                    placeholder="sunil@example.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Message / Inquiry Details</label>
                <textarea
                  rows={4}
                  required
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 leading-relaxed focus:bg-white focus:ring-2 focus:ring-royal-600"
                  placeholder="Describe your inquiry regarding accounts, corporate banking, or fixed deposits..."
                />
              </div>

              <button
                type="submit"
                className="py-3 px-6 rounded-xl font-bold text-white bg-navy-900 hover:bg-royal-800 shadow-xs flex items-center space-x-2 transition-all"
              >
                <span>Submit Inquiry</span>
                <Send className="w-4 h-4 ml-1" />
              </button>
            </form>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ContactPage;