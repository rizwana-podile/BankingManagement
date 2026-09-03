import React, { useState, useEffect } from 'react';
import { CheckCircle2, AlertTriangle, XCircle, Info, X } from 'lucide-react';

let addToastHandler = null;

export const toast = {
  success: (msg) => addToastHandler && addToastHandler('success', msg),
  error: (msg) => addToastHandler && addToastHandler('error', msg),
  warning: (msg) => addToastHandler && addToastHandler('warning', msg),
  info: (msg) => addToastHandler && addToastHandler('info', msg),
};

export const ToastContainer = () => {
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    addToastHandler = (type, message) => {
      const id = Date.now() + Math.random();
      setToasts(prev => [...prev, { id, type, message }]);
      setTimeout(() => {
        setToasts(prev => prev.filter(t => t.id !== id));
      }, 4500);
    };
    return () => { addToastHandler = null; };
  }, []);

  const removeToast = (id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col space-y-3 max-w-sm w-full pointer-events-none">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={`pointer-events-auto flex items-start p-4 rounded-xl shadow-xl border bg-white transition-all duration-300 ${
            t.type === 'success'
              ? 'border-emerald-200 text-slate-800'
              : t.type === 'error'
              ? 'border-rose-200 text-slate-800'
              : t.type === 'warning'
              ? 'border-amber-200 text-slate-800'
              : 'border-blue-200 text-slate-800'
          }`}
        >
          <div className="mr-3 mt-0.5">
            {t.type === 'success' && <CheckCircle2 className="w-5 h-5 text-emerald-600" />}
            {t.type === 'error' && <XCircle className="w-5 h-5 text-rose-600" />}
            {t.type === 'warning' && <AlertTriangle className="w-5 h-5 text-amber-500" />}
            {t.type === 'info' && <Info className="w-5 h-5 text-royal-700" />}
          </div>
          <div className="flex-1 text-xs font-semibold leading-relaxed text-slate-800">{t.message}</div>
          <button
            onClick={() => removeToast(t.id)}
            className="ml-2 text-slate-400 hover:text-slate-700 p-1 rounded-lg transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
};