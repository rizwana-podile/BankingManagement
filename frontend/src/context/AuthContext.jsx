import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('aura_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('aura_token') || null);
  const [accounts, setAccounts] = useState([]);
  const [activeAccount, setActiveAccount] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchUserData = async () => {
    try {
      if (!localStorage.getItem('aura_token')) {
        setLoading(false);
        return;
      }
      const res = await api.get('/auth/me');
      if (res.data.success) {
        setUser(res.data.user);
        setProfile(res.data.profile);
        setAccounts(res.data.accounts || []);
        if (res.data.accounts && res.data.accounts.length > 0) {
          setActiveAccount(res.data.accounts[0]);
        }
        localStorage.setItem('aura_user', JSON.stringify(res.data.user));
      }
    } catch (err) {
      console.error('Failed to fetch user context:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, [token]);

  const login = async (email, password) => {
    const res = await api.post('/auth/login', { email, password });
    if (res.data.success) {
      setToken(res.data.token);
      setUser(res.data.user);
      localStorage.setItem('aura_token', res.data.token);
      localStorage.setItem('aura_user', JSON.stringify(res.data.user));
      await fetchUserData();
      return res.data;
    }
  };

  const register = async (userData) => {
    const res = await api.post('/auth/register', userData);
    if (res.data.success) {
      setToken(res.data.token);
      setUser(res.data.user);
      localStorage.setItem('aura_token', res.data.token);
      localStorage.setItem('aura_user', JSON.stringify(res.data.user));
      await fetchUserData();
      return res.data;
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    setAccounts([]);
    setActiveAccount(null);
    setProfile(null);
    localStorage.removeItem('aura_token');
    localStorage.removeItem('aura_user');
    window.location.href = '/login';
  };

  const refreshAccounts = async () => {
    try {
      const res = await api.get('/accounts');
      if (res.data.success) {
        setAccounts(res.data.accounts);
        if (activeAccount) {
          const updated = res.data.accounts.find(a => a._id === activeAccount._id);
          if (updated) setActiveAccount(updated);
        } else if (res.data.accounts.length > 0) {
          setActiveAccount(res.data.accounts[0]);
        }
      }
    } catch (err) {
      console.error('Error refreshing accounts:', err);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        accounts,
        activeAccount,
        setActiveAccount,
        profile,
        loading,
        login,
        register,
        logout,
        refreshUserData: fetchUserData,
        refreshAccounts
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);