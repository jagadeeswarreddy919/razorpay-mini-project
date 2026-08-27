'use client';

import React from 'react';
import { Award, ShieldAlert, Cpu } from 'lucide-react';

export const BuildathonSection: React.FC = () => {
  return (
    <section id="buildathon" className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
      <div className="p-8 md:p-10 bg-white border border-slate-200/90 rounded-3xl space-y-6 shadow-xl text-slate-900">
        
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-6 border-b border-slate-100">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-purple-700 font-mono">
              <Award className="w-4 h-4 text-purple-600" />
              RAZORPAY BUILDATHON 2026 PROTOTYPE
            </div>
            <h2 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight font-heading">
              Track 2 — AI Risk Manager
            </h2>
          </div>

          <span className="px-3.5 py-1.5 text-xs font-extrabold text-indigo-700 bg-indigo-50 rounded-full border border-indigo-200 font-mono">
            INDEPENDENT SUBMISSION
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-slate-600 leading-relaxed">
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
            <div className="font-bold text-slate-900 flex items-center gap-2 font-heading">
              <Cpu className="w-4 h-4 text-purple-600" /> Buildathon Vision
            </div>
            <p>
              ResolveX demonstrates how automated risk engines and payment payload tracebacks can eliminate customer anxiety during payment failures while bank account debits are confirmed.
            </p>
          </div>

          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
            <div className="font-bold text-slate-900 flex items-center gap-2 font-heading">
              <ShieldAlert className="w-4 h-4 text-amber-600" /> Independent Prototype Disclaimer
            </div>
            <p>
              ResolveX is an independent buildathon prototype demonstrating payment dispute resolution workflows. It is not an official Razorpay product. Demo transactions and payment states are simulated using test data.
            </p>
          </div>
        </div>

      </div>
    </section>
  );
};
