import React, { useState, useEffect } from 'react';
import { CreditCard, Shield, Lock, Unlock, KeyRound, Sliders, Plus, Eye, EyeOff, CheckCircle2 } from 'lucide-react';
import api from '../../services/api';
import { toast } from '../../components/common/Toast';
import { useAuth } from '../../context/AuthContext';
import BankLogo from '../../components/common/BankLogo';

const CardsPage = () => {
  const { accounts } = useAuth();
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showMasked, setShowMasked] = useState(true);
  const [selectedCardForPin, setSelectedCardForPin] = useState(null);
  const [newPin, setNewPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [cardTypeReq, setCardTypeReq] = useState('debit');
  const [cardNetReq, setCardNetReq] = useState('Visa');

  const fetchCards = async () => {
    try {
      const res = await api.get('/cards');
      if (res.data.success) setCards(res.data.cards);
    } catch (err) {
      console.error('Error loading cards:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCards();
  }, []);

  const handleToggleBlock = async (cardId, currentStatus) => {
    try {
      const res = await api.put(`/cards/${cardId}/toggle-block`);
      if (res.data.success) {
        toast.success(res.data.message);
        fetchCards();
      }
    } catch (err) {
      toast.error('Failed to change card status');
    }
  };

  const handleSetPin = async (e) => {
    e.preventDefault();
    if (newPin !== confirmPin) {
      toast.error('PINs do not match');
      return;
    }
    if (newPin.length !== 4) {
      toast.error('PIN must be 4 digits');
      return;
    }
    try {
      const res = await api.put(`/cards/${selectedCardForPin._id}/set-pin`, { pin: newPin });
      if (res.data.success) {
        toast.success('Card ATM PIN updated successfully');
        setSelectedCardForPin(null);
        setNewPin('');
        setConfirmPin('');
      }
    } catch (err) {
      toast.error('Failed to set PIN');
    }
  };

  const handleRequestCard = async (e) => {
    e.preventDefault();
    if (accounts.length === 0) {
      toast.error('No linked account found');
      return;
    }
    try {
      const res = await api.post('/cards/request', {
        accountId: accounts[0]._id,
        cardType: cardTypeReq,
        cardNetwork: cardNetReq
      });
      if (res.data.success) {
        toast.success('New card issued and added to your portfolio!');
        setShowRequestModal(false);
        fetchCards();
      }
    } catch (err) {
      toast.error('Failed to request new card');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-navy-950">Card Management Center</h1>
          <p className="text-xs text-slate-500 mt-1">Virtual debit and credit card controls, limits, and PIN security</p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setShowMasked(!showMasked)}
            className="px-3 py-2 rounded-xl text-xs font-semibold bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 flex items-center space-x-1.5 shadow-xs transition-colors"
          >
            {showMasked ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
            <span>{showMasked ? 'Reveal Card Details' : 'Mask Cards'}</span>
          </button>
          <button
            onClick={() => setShowRequestModal(true)}
            className="px-4 py-2 rounded-xl text-xs font-bold bg-navy-900 hover:bg-royal-800 text-white shadow-xs flex items-center space-x-1.5 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Request New Card</span>
          </button>
        </div>
      </div>

      {/* Cards Display Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {cards.map((c) => (
          <div key={c._id} className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-6">
            
            {/* Visual Card Representation */}
            <div className={`relative h-56 rounded-2xl p-6 text-white shadow-lg overflow-hidden flex flex-col justify-between ${
              c.cardType === 'credit'
                ? 'bg-gradient-to-tr from-navy-950 via-navy-900 to-royal-900 border border-slate-700'
                : 'bg-gradient-to-tr from-navy-900 via-royal-800 to-royal-600 border border-royal-700'
            }`}>
              {/* Subtle geometric watermark */}
              <div className="absolute -right-8 -top-8 w-40 h-40 bg-white/5 rounded-full blur-xl pointer-events-none" />
              
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center space-x-1.5">
                    <span className="font-extrabold text-sm tracking-wider text-white">AURA APEX</span>
                    <span className="font-bold text-xs text-gold-400">BANK</span>
                  </div>
                  <p className="text-[9px] text-slate-300 uppercase tracking-widest">{c.cardType} Card</p>
                </div>
                <div className="flex items-center space-x-2">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    c.status === 'active' ? 'bg-emerald-500/30 text-emerald-300 border border-emerald-400/40' : 'bg-rose-500/30 text-rose-300 border border-rose-400/40'
                  }`}>
                    {c.status.toUpperCase()}
                  </span>
                  <span className="font-black italic text-lg tracking-wider">{c.cardNetwork}</span>
                </div>
              </div>

              {/* Gold Chip Simulation */}
              <div className="w-11 h-8 rounded-md bg-gradient-to-r from-amber-400 to-yellow-200 border border-amber-500 flex items-center justify-center my-2 shadow-xs">
                <div className="w-full h-full border border-amber-600/40 rounded flex flex-col justify-around py-1">
                  <div className="w-full h-[1px] bg-amber-600/50" />
                  <div className="w-full h-[1px] bg-amber-600/50" />
                </div>
              </div>

              <div>
                <p className="font-mono text-xl tracking-widest font-bold">
                  {showMasked
                    ? `•••• •••• •••• ${c.cardNumber.slice(-4)}`
                    : c.cardNumber}
                </p>
                <div className="flex items-center justify-between mt-3 text-xs">
                  <div>
                    <span className="text-[9px] text-slate-300 uppercase">Cardholder</span>
                    <p className="font-bold tracking-wide uppercase text-white">{c.cardHolderName}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-[9px] text-slate-300 uppercase">Expires</span>
                    <p className="font-mono font-bold text-white">{c.expiryMonth}/{c.expiryYear}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Card Controls */}
            <div className="space-y-4 pt-2">
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs">
                <div>
                  <p className="font-bold text-slate-900">Daily Spending Limit</p>
                  <p className="text-[10px] text-slate-500">Used ₹{c.usedLimit || 0} of ₹{Number(c.dailyLimit).toLocaleString('en-IN')}</p>
                </div>
                <span className="font-mono font-bold text-royal-700">
                  ₹{Number(c.dailyLimit).toLocaleString('en-IN')}
                </span>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => handleToggleBlock(c._id, c.status)}
                  className={`py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center space-x-1.5 ${
                    c.status === 'active'
                      ? 'bg-rose-50 border border-rose-200 text-rose-700 hover:bg-rose-100'
                      : 'bg-emerald-50 border border-emerald-200 text-emerald-700 hover:bg-emerald-100'
                  }`}
                >
                  {c.status === 'active' ? <Lock className="w-3.5 h-3.5" /> : <Unlock className="w-3.5 h-3.5" />}
                  <span>{c.status === 'active' ? 'Block Card' : 'Unblock Card'}</span>
                </button>

                <button
                  onClick={() => setSelectedCardForPin(c)}
                  className="py-2.5 px-3 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200 flex items-center justify-center space-x-1.5 transition-colors"
                >
                  <KeyRound className="w-3.5 h-3.5 text-amber-600" />
                  <span>Set ATM PIN</span>
                </button>
              </div>
            </div>

          </div>
        ))}
      </div>

      {/* Set PIN Modal */}
      {selectedCardForPin && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="w-full max-w-sm bg-white border border-slate-200 rounded-2xl p-6 shadow-2xl space-y-4">
            <h3 className="font-bold text-base text-navy-950">Set New ATM PIN</h3>
            <p className="text-xs text-slate-500">For card ending in {selectedCardForPin.cardNumber.slice(-4)}</p>

            <form onSubmit={handleSetPin} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">New 4-Digit PIN</label>
                <input
                  type="password"
                  maxLength={4}
                  required
                  value={newPin}
                  onChange={(e) => setNewPin(e.target.value)}
                  className="w-full text-center tracking-widest text-lg font-bold py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 font-mono focus:bg-white focus:ring-2 focus:ring-royal-600"
                  placeholder="••••"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Confirm PIN</label>
                <input
                  type="password"
                  maxLength={4}
                  required
                  value={confirmPin}
                  onChange={(e) => setConfirmPin(e.target.value)}
                  className="w-full text-center tracking-widest text-lg font-bold py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 font-mono focus:bg-white focus:ring-2 focus:ring-royal-600"
                  placeholder="••••"
                />
              </div>

              <div className="flex space-x-3 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedCardForPin(null)}
                  className="flex-1 py-2 rounded-xl text-xs bg-slate-100 text-slate-600 hover:bg-slate-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 rounded-xl text-xs font-bold bg-navy-900 hover:bg-royal-800 text-white shadow-xs"
                >
                  Confirm PIN
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Request New Card Modal */}
      {showRequestModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white border border-slate-200 rounded-2xl p-6 shadow-2xl space-y-4">
            <h3 className="font-bold text-base text-navy-950">Apply for a New Card</h3>
            <form onSubmit={handleRequestCard} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-700 font-bold mb-1">Card Type</label>
                <select
                  value={cardTypeReq}
                  onChange={(e) => setCardTypeReq(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:bg-white"
                >
                  <option value="debit">Aura Platinum Debit Card</option>
                  <option value="credit">Aura Signature Credit Card</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Network Partner</label>
                <select
                  value={cardNetReq}
                  onChange={(e) => setCardNetReq(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:bg-white"
                >
                  <option value="Visa">Visa Global PayWave</option>
                  <option value="RuPay">RuPay National Platinum</option>
                  <option value="Mastercard">Mastercard World Elite</option>
                </select>
              </div>

              <div className="flex space-x-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowRequestModal(false)}
                  className="flex-1 py-2 rounded-xl text-xs bg-slate-100 text-slate-600 hover:bg-slate-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 rounded-xl text-xs font-bold bg-navy-900 hover:bg-royal-800 text-white shadow-xs"
                >
                  Confirm & Issue Card
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CardsPage;