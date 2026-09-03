import React from 'react';

/**
 * Aura Apex Bank — Official Bank Logo
 * Original, proprietary banking emblem combining:
 * - A high-trust geometric diamond-apex shield (security & capital foundation)
 * - Interlocking precision chevrons in deep navy and royal blue ascending upward (Apex / growth)
 * - A centered subtle gold node (wealth, reserve integrity, and stability)
 * - Clean, authoritative typography
 */
const BankLogo = ({
  variant = 'dark', // 'dark' (for light backgrounds, navy/blue text) or 'light' (for dark backgrounds, white text)
  size = 'md', // 'sm', 'md', 'lg', 'xl'
  showText = true,
  subtitle = 'ENTERPRISE BANKING',
  className = ''
}) => {
  const isLight = variant === 'light';

  // Dimension presets
  const sizeMap = {
    sm: { icon: 28, text: 'text-base', sub: 'text-[9px]', gap: 'space-x-2' },
    md: { icon: 38, text: 'text-lg', sub: 'text-[10px]', gap: 'space-x-2.5' },
    lg: { icon: 46, text: 'text-2xl', sub: 'text-xs', gap: 'space-x-3' },
    xl: { icon: 56, text: 'text-3xl', sub: 'text-xs', gap: 'space-x-3.5' },
  };

  const currentSize = sizeMap[size] || sizeMap.md;

  return (
    <div className={`flex items-center ${currentSize.gap} ${className}`}>
      {/* SVG Original Emblem */}
      <div className="shrink-0 relative flex items-center justify-center">
        <svg
          width={currentSize.icon}
          height={currentSize.icon}
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="drop-shadow-xs"
        >
          {/* Base Shield Foundation */}
          <path
            d="M50 8L88 24V48C88 71.5 71.8 91.5 50 97C28.2 91.5 12 71.5 12 48V24L50 8Z"
            fill={isLight ? '#0F2744' : '#0A2540'}
            stroke={isLight ? '#1E40AF' : '#1E3A8A'}
            strokeWidth="3"
          />

          {/* Inner Geometric Apex Chevron 1 (Royal Blue Ascending) */}
          <path
            d="M50 20L76 34V48C76 64 65 78.5 50 83.5C35 78.5 24 64 24 48V34L50 20Z"
            fill="url(#apexBlueGrad)"
          />

          {/* Inner Geometric Apex Chevron 2 (Deep Contrast) */}
          <path
            d="M50 32L66 42V52C66 61.5 59.5 70 50 73.5C40.5 70 34 61.5 34 52V42L50 32Z"
            fill={isLight ? '#0A1E34' : '#07182C'}
          />

          {/* Central Apex Peak & Growth Pillar */}
          <path
            d="M50 38L60 56H40L50 38Z"
            fill="url(#apexGoldGrad)"
          />

          {/* Gold Core Stability Node */}
          <circle
            cx="50"
            cy="52"
            r="4.5"
            fill="#FFFFFF"
          />
          <circle
            cx="50"
            cy="52"
            r="2.5"
            fill="#C59B27"
          />

          {/* Gradients */}
          <defs>
            <linearGradient id="apexBlueGrad" x1="24" y1="20" x2="76" y2="83" gradientUnits="userSpaceOnUse">
              <stop stopColor="#1E40AF" />
              <stop offset="1" stopColor="#0B1F36" />
            </linearGradient>
            <linearGradient id="apexGoldGrad" x1="40" y1="38" x2="60" y2="56" gradientUnits="userSpaceOnUse">
              <stop stopColor="#DFB864" />
              <stop offset="0.5" stopColor="#C59B27" />
              <stop offset="1" stopColor="#A67E18" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* Typography Wordmark */}
      {showText && (
        <div className="flex flex-col leading-tight select-none">
          <div className="flex items-center space-x-1.5">
            <span
              className={`font-black tracking-tight ${currentSize.text} ${
                isLight ? 'text-white' : 'text-[#0A2540]'
              }`}
            >
              AURA APEX
            </span>
            <span
              className={`font-black tracking-wider ${currentSize.text} text-[#C59B27]`}
            >
              BANK
            </span>
          </div>
          {subtitle && (
            <span
              className={`font-semibold tracking-widest uppercase ${currentSize.sub} ${
                isLight ? 'text-slate-400' : 'text-slate-500'
              }`}
            >
              {subtitle}
            </span>
          )}
        </div>
      )}
    </div>
  );
};

export default BankLogo;