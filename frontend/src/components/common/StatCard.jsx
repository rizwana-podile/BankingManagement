import React from 'react';

const StatCard = ({ title, value, subtitle, icon: Icon, color = 'blue', trend }) => {
  const colorSchemes = {
    blue: { bg: 'bg-blue-50', text: 'text-royal-700', border: 'border-blue-100', iconBg: 'bg-blue-100' },
    emerald: { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-100', iconBg: 'bg-emerald-100' },
    purple: { bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-100', iconBg: 'bg-purple-100' },
    amber: { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-100', iconBg: 'bg-amber-100' },
  };

  const scheme = colorSchemes[color] || colorSchemes.blue;

  return (
    <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs hover:shadow-md transition-all">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">{title}</span>
        {Icon && (
          <div className={`w-10 h-10 rounded-xl ${scheme.iconBg} ${scheme.text} flex items-center justify-center`}>
            <Icon className="w-5 h-5" />
          </div>
        )}
      </div>

      <div className="flex items-baseline space-x-2">
        <h3 className="text-2xl sm:text-3xl font-black text-slate-900 font-mono tracking-tight">{value}</h3>
      </div>

      {(subtitle || trend) && (
        <div className="mt-2 flex items-center justify-between text-xs">
          {subtitle && <p className="text-slate-500">{subtitle}</p>}
          {trend && (
            <span className="font-semibold text-emerald-600 font-mono text-[11px]">{trend}</span>
          )}
        </div>
      )}
    </div>
  );
};

export default StatCard;