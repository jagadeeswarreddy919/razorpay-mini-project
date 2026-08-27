'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Logo } from '@/components/logo';
import { ShieldCheck, UserCheck, Lock, ArrowRight, ArrowLeft, Loader2 } from 'lucide-react';

export default function SupportLoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleDemoLogin = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/support/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ agentId: 'agent_demo_1001' }),
      });
      const json = await res.json();

      if (json.success) {
        router.push('/support');
      }
    } catch (err) {
      console.error('Support login error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col justify-between items-center p-4 sm:p-6 selection:bg-purple-600 selection:text-white font-sans">
      
      {/* Header Bar with Back to Home Button */}
      <header className="w-full max-w-5xl flex justify-between items-center py-4">
        <a href="/">
          <Logo showTagline={false} />
        </a>
        <button
          onClick={() => router.push('/')}
          className="px-4 py-2 text-xs font-bold text-slate-700 bg-white hover:bg-slate-100 border border-slate-200 rounded-full shadow-sm flex items-center gap-2 transition-all hover:scale-105"
        >
          <ArrowLeft className="w-4 h-4 text-purple-600" />
          Back to Home
        </button>
      </header>

      <div className="w-full max-w-md space-y-8 my-auto">
        
        {/* Logo & Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 bg-purple-100 border border-purple-200 rounded-full text-xs font-bold text-purple-700 uppercase tracking-wider font-mono">
            <Lock className="w-3.5 h-3.5" /> Internal Operations Portal
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight font-heading">Support Agent Access</h1>
          <p className="text-xs text-slate-500">
            Secure portal for payment dispute investigation, case assignment, and settlement tracking.
          </p>
        </div>

        {/* Demo Login Box */}
        <div className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
          
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-purple-100 text-purple-600 rounded-xl">
                <UserCheck className="w-5 h-5" />
              </div>
              <div>
                <div className="text-sm font-bold text-slate-900 font-heading">Vikram Verma</div>
                <div className="text-xs text-purple-700 font-mono font-bold">Priority Support Lead</div>
              </div>
            </div>
            <p className="text-[11px] text-slate-500 pt-1">
              Authorized demo credentials for Razorpay Buildathon 2026 judging review.
            </p>
          </div>

          <button
            onClick={handleDemoLogin}
            disabled={loading}
            className="w-full py-4 text-xs font-bold text-white bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 rounded-full shadow-lg border border-purple-400/30 flex items-center justify-center gap-2 transition-all hover:scale-105 disabled:opacity-50"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <>
                <ShieldCheck className="w-4 h-4 text-purple-200" />
                Login as Support Lead →
              </>
            )}
          </button>

          <div className="text-[11px] text-slate-500 text-center leading-relaxed">
            Support portal access is restricted strictly to authorized ResolveX operations personnel. All activities are recorded in audit logs.
          </div>
        </div>

      </div>

      <div className="py-4 text-[11px] text-slate-400 text-center">
        ResolveX &copy; 2026 • Independent Buildathon Prototype
      </div>
    </div>
  );
}
