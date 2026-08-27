'use client';

import React from 'react';
import { Landmark, Network, Server, Building2, ShieldCheck, ArrowRight } from 'lucide-react';

export const PaymentStatus: React.FC = () => {
  return (
    <div className="bg-white border border-slate-200/90 rounded-3xl p-6 md:p-8 space-y-6 shadow-xl text-slate-900">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div>
          <span className="text-xs font-bold text-blue-600 uppercase tracking-widest font-mono">STATUS VISUALIZER</span>
          <h3 className="text-2xl font-black text-slate-900 tracking-tight font-heading mt-0.5">Where is my money?</h3>
        </div>
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping"></span>
          Live Resolution Trace
        </div>
      </div>

      {/* 5 Stages Flow */}
      <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 text-center text-xs">
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl space-y-1 shadow-sm">
          <Landmark className="w-5 h-5 text-emerald-600 mx-auto" />
          <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">STAGE 1</div>
          <div className="font-bold text-slate-900 font-heading">YOUR BANK</div>
          <div className="text-emerald-700 font-extrabold text-[11px] mt-1">DEBITED ✓</div>
        </div>

        <div className="p-4 bg-blue-50 border border-blue-200 rounded-2xl space-y-1 shadow-sm">
          <Network className="w-5 h-5 text-blue-600 mx-auto" />
          <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">STAGE 2</div>
          <div className="font-bold text-slate-900 font-heading">NPCI NETWORK</div>
          <div className="text-blue-700 font-extrabold text-[11px] mt-1">PROCESSING</div>
        </div>

        <div className="p-4 bg-purple-50 border border-purple-200 rounded-2xl space-y-1 shadow-sm">
          <Server className="w-5 h-5 text-purple-600 mx-auto" />
          <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">STAGE 3</div>
          <div className="font-bold text-slate-900 font-heading">GATEWAY</div>
          <div className="text-purple-700 font-extrabold text-[11px] mt-1">INVESTIGATING</div>
        </div>

        <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl space-y-1 shadow-sm">
          <Building2 className="w-5 h-5 text-rose-600 mx-auto" />
          <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">STAGE 4</div>
          <div className="font-bold text-slate-900 font-heading">MERCHANT</div>
          <div className="text-rose-700 font-extrabold text-[11px] mt-1">NOT CONFIRMED</div>
        </div>

        <div className="p-4 bg-gradient-to-r from-purple-100 to-indigo-100 border border-purple-300 rounded-2xl space-y-1 shadow-md">
          <ShieldCheck className="w-5 h-5 text-purple-700 mx-auto" />
          <div className="text-[10px] text-purple-700 font-bold uppercase tracking-wider">STAGE 5</div>
          <div className="font-bold text-slate-900 font-heading">RESOLVEX</div>
          <div className="text-purple-900 font-extrabold text-[11px] mt-1">CASE CREATED</div>
        </div>
      </div>
    </div>
  );
};
