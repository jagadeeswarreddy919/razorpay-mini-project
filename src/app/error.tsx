'use client';

import React, { useEffect } from 'react';
import { RefreshCw, AlertTriangle } from 'lucide-react';

export default function GlobalErrorComponent({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Unhandled app error:', error);
  }, [error]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-center items-center p-6 font-sans">
      <div className="p-8 bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full text-center space-y-6 shadow-2xl">
        <div className="p-4 bg-amber-500/10 text-amber-400 rounded-2xl border border-amber-500/20 w-fit mx-auto">
          <AlertTriangle className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-white">Something went wrong</h2>
          <p className="text-xs text-slate-400">
            {error?.message || 'An unexpected application error occurred while loading this page.'}
          </p>
        </div>
        <button
          onClick={() => reset()}
          className="w-full py-3 text-xs font-bold text-white bg-blue-600 hover:bg-blue-500 rounded-xl shadow-lg flex items-center justify-center gap-2 transition-all"
        >
          <RefreshCw className="w-4 h-4" /> Try Again
        </button>
      </div>
    </div>
  );
}
