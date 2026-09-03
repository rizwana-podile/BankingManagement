import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, Phone, Mail, MapPin } from 'lucide-react';
import BankLogo from './BankLogo';

const Footer = () => {
  return (
    <footer className="bg-navy-950 text-slate-300 border-t border-navy-900 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Brand Info */}
          <div className="space-y-4">
            <BankLogo size="md" variant="light" />
            <p className="text-xs text-slate-400 leading-relaxed">
              A premier schedule commercial digital banking institution registered under the Banking Regulation Act, 1949. Delivering modern financial security and high-speed settlement rails.
            </p>
            <div className="flex items-center space-x-2 text-xs text-gold-400 font-semibold">
              <Shield className="w-4 h-4 text-emerald-400" />
              <span>DICGC Insured up to ₹5,00,000</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-bold text-sm text-white mb-4">Retail Products</h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li><Link to="/services" className="hover:text-gold-400 transition-colors">Premier Savings Account</Link></li>
              <li><Link to="/services" className="hover:text-gold-400 transition-colors">Term & Fixed Deposits (7.6%)</Link></li>
              <li><Link to="/services" className="hover:text-gold-400 transition-colors">Home & Personal Loans</Link></li>
              <li><Link to="/services" className="hover:text-gold-400 transition-colors">RuPay Platinum & Visa Signature</Link></li>
              <li><Link to="/services" className="hover:text-gold-400 transition-colors">Corporate Salary Portfolio</Link></li>
            </ul>
          </div>

          {/* Institutional Banking */}
          <div>
            <h4 className="font-bold text-sm text-white mb-4">Institutional</h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li><Link to="/about" className="hover:text-gold-400 transition-colors">About Aura Apex Bank</Link></li>
              <li><Link to="/about" className="hover:text-gold-400 transition-colors">Leadership & Governance</Link></li>
              <li><Link to="/services" className="hover:text-gold-400 transition-colors">RBI Regulatory Disclosures</Link></li>
              <li><Link to="/contact" className="hover:text-gold-400 transition-colors">Branch & ATM Network</Link></li>
              <li><Link to="/login" className="hover:text-gold-400 transition-colors">NetBanking Portal Sign-In</Link></li>
            </ul>
          </div>

          {/* Contact Details */}
          <div>
            <h4 className="font-bold text-sm text-white mb-4">Contact & Support</h4>
            <ul className="space-y-3 text-xs text-slate-400">
              <li className="flex items-start space-x-2.5">
                <MapPin className="w-4 h-4 text-royal-400 shrink-0 mt-0.5" />
                <span>Aura Apex Towers, Nariman Point, Mumbai, Maharashtra 400021</span>
              </li>
              <li className="flex items-center space-x-2.5">
                <Phone className="w-4 h-4 text-royal-400 shrink-0" />
                <span>1800-425-AURA (2872) &bull; 24x7 Helpdesk</span>
              </li>
              <li className="flex items-center space-x-2.5">
                <Mail className="w-4 h-4 text-royal-400 shrink-0" />
                <span>care@auraapex.com</span>
              </li>
            </ul>
          </div>

        </div>

        <div className="mt-10 pt-6 border-t border-navy-900 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400">
          <p>&copy; 2026 Aura Apex Bank Limited. All rights reserved.</p>
          <div className="flex space-x-6 mt-4 sm:mt-0">
            <Link to="/about" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link to="/about" className="hover:text-white transition-colors">Terms of NetBanking</Link>
            <Link to="/about" className="hover:text-white transition-colors">Security Standards</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;