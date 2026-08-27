'use client';

import React from 'react';
import { ShieldCheck, Lock, EyeOff, Server } from 'lucide-react';

export const SecuritySection: React.FC = () => {
  return (
    <section className="py-20 bg-slate-50 border-t border-slate-200 text-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-2">
          <span className="text-xs font-bold uppercase tracking-widest text-emerald-600 font-mono">
            PRIVACY & SECURITY
          </span>
          <h2 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight font-heading">
            Strict Customer Data Privacy
          </h2>
          <p className="text-slate-600 text-sm max-w-xl mx-auto">
            Built with fintech privacy principles to protect sensitive financial data.
          </p>
        </div>

        {/* 3 Principles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-8 bg-white border border-slate-200/90 rounded-3xl space-y-3 shadow-sm">
            <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl w-fit">
              <EyeOff className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900 font-heading">Zero Sensitive Data Storage</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              ResolveX never asks for or stores UPI PINs, card CVVs, netbanking passwords, or full bank account credentials.
            </p>
          </div>

          <div className="p-8 bg-white border border-slate-200/90 rounded-3xl space-y-3 shadow-sm">
            <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl w-fit">
              <Lock className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900 font-heading">Encrypted Session Tokens</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Customer authentication relies on encrypted HTTP-only session cookies and strict customer ID database isolation.
            </p>
          </div>

          <div className="p-8 bg-white border border-slate-200/90 rounded-3xl space-y-3 shadow-sm">
            <div className="p-3 bg-purple-50 text-purple-600 rounded-2xl w-fit">
              <Server className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900 font-heading">Audit-Trail Access Control</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              All payment status checks enforce strict customer ownership verification to prevent cross-customer data leakage.
            </p>
          </div>
        </div>

      </div>
    </section>
  );
};
