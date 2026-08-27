'use client';

import React from 'react';
import { AlertTriangle, ShieldCheck, Search } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface SafetyWarningProps {
  onTrackClick?: () => void;
  onSupportClick?: () => void;
}

export const SafetyWarning: React.FC<SafetyWarningProps> = () => {
  const router = useRouter();

  return (
    <div className="p-6 md:p-8 bg-gradient-to-r from-amber-500/10 via-amber-50 to-orange-500/10 border border-amber-300 rounded-3xl space-y-4 shadow-sm text-slate-900">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-amber-500/20 text-amber-700 rounded-2xl border border-amber-300/80 flex-shrink-0">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div className="space-y-0.5">
            <span className="text-[10px] font-bold text-amber-700 uppercase tracking-widest bg-amber-200/60 px-2.5 py-0.5 rounded-full font-mono">
              SAFETY WARNING
            </span>
            <h3 className="text-lg font-black text-slate-900 font-heading">
              Don't Pay Again Yet!
            </h3>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => router.push('/login')}
            className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-full shadow transition-all flex items-center gap-1.5"
          >
            <Search className="w-3.5 h-3.5" />
            Track Existing Payment
          </button>
          <button
            onClick={() => router.push('/support')}
            className="px-4 py-2.5 bg-white hover:bg-slate-50 text-slate-800 border border-amber-300 font-bold text-xs rounded-full shadow-sm transition-all"
          >
            Contact Support
          </button>
        </div>
      </div>

      <p className="text-xs text-slate-700 leading-relaxed max-w-4xl font-medium">
        If your bank account was debited for a failed or pending transaction, making another payment attempt immediately could result in a double debit. Verify transaction status and auto-create a resolution case first.
      </p>
    </div>
  );
};
