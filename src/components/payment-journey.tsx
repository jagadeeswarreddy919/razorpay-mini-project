'use client';

import React from 'react';
import { Landmark, Network, Server, Building2, ShieldCheck, Check } from 'lucide-react';

export const PaymentJourney: React.FC = () => {
  return (
    <section className="py-20 bg-slate-50 border-t border-slate-200 text-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-2">
          <span className="text-xs font-bold uppercase tracking-widest text-indigo-600 font-mono">
            AUDIT TRAIL
          </span>
          <h2 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight font-heading">
            Stage-by-Stage Interbank Audit Flow
          </h2>
          <p className="text-slate-600 text-sm max-w-xl mx-auto">
            Clear visibility into every layer of the payment resolution pipeline.
          </p>
        </div>

        {/* 5 Stages Grid */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div className="p-6 bg-white border border-slate-200/90 rounded-3xl space-y-3 shadow-sm">
            <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl w-fit">
              <Landmark className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-bold text-slate-400 font-mono">STAGE 01</span>
            <h3 className="text-sm font-bold text-slate-900 font-heading">Customer Bank</h3>
            <p className="text-xs text-slate-500">Debit status verified via bank UTR response.</p>
          </div>

          <div className="p-6 bg-white border border-slate-200/90 rounded-3xl space-y-3 shadow-sm">
            <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl w-fit">
              <Network className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-bold text-slate-400 font-mono">STAGE 02</span>
            <h3 className="text-sm font-bold text-slate-900 font-heading">NPCI / UPI Network</h3>
            <p className="text-xs text-slate-500">Clearing network payload transmission audit.</p>
          </div>

          <div className="p-6 bg-white border border-slate-200/90 rounded-3xl space-y-3 shadow-sm">
            <div className="p-3 bg-purple-50 text-purple-600 rounded-2xl w-fit">
              <Server className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-bold text-slate-400 font-mono">STAGE 03</span>
            <h3 className="text-sm font-bold text-slate-900 font-heading">Payment Gateway</h3>
            <p className="text-xs text-slate-500">Razorpay transaction status log reconciliation.</p>
          </div>

          <div className="p-6 bg-white border border-slate-200/90 rounded-3xl space-y-3 shadow-sm">
            <div className="p-3 bg-rose-50 text-rose-600 rounded-2xl w-fit">
              <Building2 className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-bold text-slate-400 font-mono">STAGE 04</span>
            <h3 className="text-sm font-bold text-slate-900 font-heading">Merchant System</h3>
            <p className="text-xs text-slate-500">Merchant receipt callback state verification.</p>
          </div>

          <div className="p-6 bg-gradient-to-br from-blue-50 to-purple-50 border border-purple-200 rounded-3xl space-y-3 shadow-md">
            <div className="p-3 bg-purple-600 text-white rounded-2xl w-fit">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-bold text-purple-700 font-mono">STAGE 05</span>
            <h3 className="text-sm font-bold text-slate-900 font-heading">ResolveX Engine</h3>
            <p className="text-xs text-slate-600 font-medium">Automatic case creation & ACK generated.</p>
          </div>
        </div>

      </div>
    </section>
  );
};
