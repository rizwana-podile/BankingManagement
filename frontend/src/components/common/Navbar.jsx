import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Bell,
  User,
  LogOut,
  Shield,
  CreditCard,
  ChevronDown,
  CheckCheck,
  Trash2,
  Menu
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useNotifications } from '../../context/NotificationContext';
import BankLogo from './BankLogo';

const Navbar = ({ onToggleSidebar }) => {
  const { user, logout, accounts, activeAccount, setActiveAccount } = useAuth();
  const { notifications, unreadCount, markAsRead, markAllAsRead, deleteNotification } = useNotifications();
  const navigate = useNavigate();

  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showAccountMenu, setShowAccountMenu] = useState(false);

  const notifRef = useRef(null);
  const userMenuRef = useRef(null);
  const accMenuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) setShowNotifications(false);
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) setShowUserMenu(false);
      if (accMenuRef.current && !accMenuRef.current.contains(e.target)) setShowAccountMenu(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
      <div className="flex items-center justify-between px-4 lg:px-8 h-16">
        
        {/* Brand & Mobile Sidebar Toggle */}
        <div className="flex items-center space-x-3">
          <button
            onClick={onToggleSidebar}
            className="p-2 rounded-xl text-slate-500 hover:text-navy-900 hover:bg-slate-100 lg:hidden"
            aria-label="Toggle Navigation"
          >
            <Menu className="w-6 h-6" />
          </button>

          <Link to="/" className="flex items-center space-x-2 group">
            <BankLogo size="md" variant="dark" />
            <span className="hidden xl:inline-block text-[10px] font-bold px-2 py-0.5 rounded-full uppercase bg-blue-50 text-royal-700 border border-blue-200 ml-1">
              {user?.role || 'PORTAL'}
            </span>
          </Link>
        </div>

        {/* Center: Account Switcher (For Customer) */}
        {user?.role === 'customer' && accounts.length > 0 && (
          <div className="hidden md:flex items-center relative" ref={accMenuRef}>
            <button
              onClick={() => setShowAccountMenu(!showAccountMenu)}
              className="flex items-center space-x-3 px-3.5 py-1.5 rounded-xl bg-slate-50 border border-slate-200 hover:border-slate-300 hover:bg-slate-100/70 transition-all shadow-xs"
            >
              <div className="w-7 h-7 rounded-lg bg-navy-900 text-gold-400 flex items-center justify-center">
                <CreditCard className="w-3.5 h-3.5" />
              </div>
              <div className="text-left text-xs">
                <p className="text-slate-500 uppercase font-bold text-[9px] tracking-wider">
                  {activeAccount?.accountType || 'Savings'} A/C
                </p>
                <p className="font-mono font-bold text-slate-800">
                  •••• {activeAccount?.accountNumber?.slice(-4)}
                </p>
              </div>
              <div className="border-l border-slate-200 pl-3 text-right">
                <span className="text-[9px] text-slate-400 font-semibold uppercase">Balance</span>
                <p className="text-xs font-bold text-emerald-600 font-mono">
                  ₹{Number(activeAccount?.balance || 0).toLocaleString('en-IN')}
                </p>
              </div>
              <ChevronDown className="w-4 h-4 text-slate-400" />
            </button>

            {showAccountMenu && (
              <div className="absolute top-12 left-0 w-72 rounded-2xl bg-white border border-slate-200 shadow-xl p-2 z-50">
                <p className="px-3 py-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Switch Active Account</p>
                {accounts.map(acc => (
                  <button
                    key={acc._id}
                    onClick={() => {
                      setActiveAccount(acc);
                      setShowAccountMenu(false);
                    }}
                    className={`w-full flex items-center justify-between p-2.5 rounded-xl text-xs transition-colors ${
                      activeAccount?._id === acc._id
                        ? 'bg-blue-50 text-navy-900 font-bold border border-blue-200'
                        : 'hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <div className="text-left">
                      <p className="font-semibold capitalize text-slate-900">{acc.accountType} Account</p>
                      <p className="text-[11px] text-slate-500 font-mono">A/C: {acc.accountNumber}</p>
                    </div>
                    <span className="font-mono font-bold text-emerald-600">
                      ₹{Number(acc.balance).toLocaleString('en-IN')}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Right Section: Notifications & User Profile */}
        <div className="flex items-center space-x-2.5 sm:space-x-3">
          
          {/* Notification Bell Dropdown */}
          <div className="relative" ref={notifRef}>
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 rounded-xl text-slate-600 hover:text-navy-900 hover:bg-slate-100 transition-colors"
              aria-label="Notifications"
            >
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 flex items-center justify-center min-w-[18px] h-[18px] px-1 text-[10px] font-bold rounded-full bg-rose-600 text-white shadow-xs animate-pulse">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </button>

            {showNotifications && (
              <div className="absolute right-0 top-12 w-80 sm:w-96 rounded-2xl bg-white border border-slate-200 shadow-xl z-50 overflow-hidden">
                <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
                  <div className="flex items-center space-x-2">
                    <h4 className="font-bold text-sm text-navy-950">Notifications</h4>
                    {unreadCount > 0 && (
                      <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-blue-100 text-royal-800">
                        {unreadCount} new
                      </span>
                    )}
                  </div>
                  {unreadCount > 0 && (
                    <button
                      onClick={markAllAsRead}
                      className="text-xs text-royal-700 hover:text-navy-900 font-semibold flex items-center space-x-1"
                    >
                      <CheckCheck className="w-3.5 h-3.5" />
                      <span>Mark all read</span>
                    </button>
                  )}
                </div>

                <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
                  {notifications.length === 0 ? (
                    <div className="py-8 text-center text-slate-400 text-xs">
                      No notifications yet
                    </div>
                  ) : (
                    notifications.slice(0, 5).map((n) => (
                      <div
                        key={n._id}
                        className={`p-3.5 text-xs transition-colors flex items-start justify-between gap-3 ${
                          !n.isRead ? 'bg-blue-50/40' : 'hover:bg-slate-50'
                        }`}
                      >
                        <div className="space-y-1">
                          <p className="font-bold text-slate-900 leading-tight">{n.title}</p>
                          <p className="text-slate-600 leading-relaxed text-[11px]">{n.message}</p>
                          <span className="text-[10px] text-slate-400 font-mono block">
                            {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • {new Date(n.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="flex items-center space-x-1 shrink-0">
                          {!n.isRead && (
                            <button
                              onClick={() => markAsRead(n._id)}
                              className="text-[10px] text-royal-700 font-semibold hover:underline"
                            >
                              Read
                            </button>
                          )}
                          <button
                            onClick={() => deleteNotification(n._id)}
                            className="text-slate-400 hover:text-rose-600 p-1 rounded"
                            title="Delete"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                <div className="p-2.5 border-t border-slate-100 text-center bg-slate-50">
                  <Link
                    to={user?.role === 'customer' ? '/notifications' : '/dashboard'}
                    onClick={() => setShowNotifications(false)}
                    className="text-xs font-semibold text-royal-700 hover:text-navy-900"
                  >
                    View All Notifications &rarr;
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* User Menu Dropdown */}
          <div className="relative" ref={userMenuRef}>
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center space-x-2.5 p-1 sm:px-2.5 sm:py-1.5 rounded-xl hover:bg-slate-100 transition-colors"
            >
              <div className="w-8 h-8 rounded-xl bg-navy-900 text-white font-bold text-xs flex items-center justify-center shadow-xs">
                {user?.name?.charAt(0) || 'U'}
              </div>
              <div className="hidden md:block text-left">
                <p className="text-xs font-bold text-slate-900 leading-tight">{user?.name || 'Authorized User'}</p>
                <p className="text-[10px] text-slate-500 capitalize">{user?.role || 'Customer'}</p>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden sm:block" />
            </button>

            {showUserMenu && (
              <div className="absolute right-0 top-12 w-56 rounded-2xl bg-white border border-slate-200 shadow-xl p-2 z-50">
                <div className="px-3 py-2 border-b border-slate-100">
                  <p className="text-xs font-bold text-navy-950">{user?.name}</p>
                  <p className="text-[11px] text-slate-500 font-mono truncate">{user?.email}</p>
                  <span className="inline-block mt-1 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase bg-blue-50 text-royal-800 border border-blue-200">
                    Role: {user?.role}
                  </span>
                </div>

                <div className="py-1 text-xs">
                  {user?.role === 'customer' && (
                    <>
                      <Link
                        to="/profile"
                        onClick={() => setShowUserMenu(false)}
                        className="flex items-center space-x-2 px-3 py-2 rounded-xl text-slate-700 hover:bg-slate-100"
                      >
                        <User className="w-4 h-4 text-slate-500" />
                        <span>My Profile & KYC</span>
                      </Link>
                      <Link
                        to="/security"
                        onClick={() => setShowUserMenu(false)}
                        className="flex items-center space-x-2 px-3 py-2 rounded-xl text-slate-700 hover:bg-slate-100"
                      >
                        <Shield className="w-4 h-4 text-slate-500" />
                        <span>Security Settings</span>
                      </Link>
                    </>
                  )}

                  <button
                    onClick={() => {
                      setShowUserMenu(false);
                      logout();
                      navigate('/login');
                    }}
                    className="w-full flex items-center space-x-2 px-3 py-2 rounded-xl text-rose-600 hover:bg-rose-50 font-medium"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Secure Sign Out</span>
                  </button>
                </div>
              </div>
            )}
          </div>

        </div>

      </div>
    </header>
  );
};

export default Navbar;