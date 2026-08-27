'use client';

import React from 'react';
import { AlertCircle, HelpCircle, ShieldAlert, CheckCircle2 } from 'lucide-react';

export const ProblemSection: React.FC = () => {
  return (
    <section className="py-20 bg-slate-50 border-t border-slate-200 text-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-2">
          <span className="text-xs font-bold uppercase tracking-widest text-rose-600">
            THE CORE PROBLEM
          </span>
          <h2 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight font-heading">
            Payment Failed + Bank Debited = Customer Anxiety
          </h2>
          <p className="text-slate-600 text-sm md:text-base">
            Why millions of online shoppers face anxiety and double debits when transactions fail mid-settlement.
          </p>
        </div>

        {/* 3 Comparison Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-8 bg-white border border-slate-200/90 rounded-3xl space-y-4 shadow-sm">
            <div className="p-3 bg-rose-50 text-rose-600 rounded-2xl w-fit">
              <AlertCircle className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 font-heading">1. Double Deduction Risk</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Customers often attempt a second payment immediately when an emergency transaction fails, incurring a duplicate debit.
            </p>
          </div>

          <div className="p-8 bg-white border border-slate-200/90 rounded-3xl space-y-4 shadow-sm">
            <div className="p-3 bg-amber-50 text-amber-600 rounded-2xl w-fit">
              <HelpCircle className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 font-heading">2. Settlement Blackhole</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Neither the bank nor the merchant provides immediate clarity on where money is stuck during interbank network delays.
            </p>
          </div>

          <div className="p-8 bg-white border border-slate-200/90 rounded-3xl space-y-4 shadow-sm">
            <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl w-fit">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 font-heading">3. Support Communication Gap</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Support teams lack instant correlation between customer bank UTRs and gateway webhook status logs.
            </p>
          </div>
        </div>

      </div>
    </section>
  );
};
