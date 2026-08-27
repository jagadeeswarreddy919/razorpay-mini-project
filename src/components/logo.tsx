import React from 'react';

interface LogoProps {
  className?: string;
  showTagline?: boolean;
}

export const Logo: React.FC<LogoProps> = ({ className = '', showTagline = true }) => {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div
        className="relative flex items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 p-[1px] shadow-md shadow-blue-500/20"
        style={{ width: '40px', height: '40px', minWidth: '40px', minHeight: '40px' }}
      >
        <div className="w-full h-full bg-slate-900 rounded-[11px] flex items-center justify-center relative overflow-hidden group">
          {/* Subtle glow effect behind emblem */}
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-cyan-500/20 opacity-70 group-hover:opacity-100 transition-opacity" />
          
          {/* RX / Resolution Path Emblem */}
          <svg
            width="20"
            height="20"
            style={{ width: '20px', height: '20px', minWidth: '20px', minHeight: '20px' }}
            className="text-white relative z-10"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            {/* R Loop */}
            <path d="M4 4h7a4 4 0 0 1 4 4 4 4 0 0 1-4 4H4V4z" />
            <path d="M4 12h5" />
            {/* Resolution Path Arrow creating X */}
            <path d="M9 12l9 9" />
            <path d="M18 12l-6 6" />
            {/* Nodes */}
            <circle cx="18" cy="12" r="1.5" fill="currentColor" />
            <circle cx="18" cy="21" r="1.5" fill="currentColor" />
          </svg>
        </div>
      </div>
      <div>
        <div className="flex items-center gap-0.5">
          <span className="text-xl font-black tracking-tight text-slate-900 font-heading">
            Resolve<span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">X</span>
          </span>
        </div>
        {showTagline && (
          <p className="text-[10px] text-slate-600 font-bold tracking-widest uppercase -mt-0.5 font-mono">
            Track • Investigate • Resolve
          </p>
        )}
      </div>
    </div>
  );
};
