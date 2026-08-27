'use client';

import React from 'react';
import { ShieldCheck, Landmark, Network, Building2, AlertTriangle, Search } from 'lucide-react';

export const PaymentMockup: React.FC = () => {
  return (
    <div className="relative w-full max-w-lg mx-auto group">
      
      {/* Ambient Glow */}
      <div className="absolute -inset-2 bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 rounded-[44px] blur-2xl opacity-30 group-hover:opacity-50 transition duration-1000 animate-pulse-subtle" />

      {/* Main Mockup Phone Frame */}
      <div className="relative bg-slate-950 border-4 border-slate-800/90 rounded-[40px] shadow-2xl p-4 sm:p-5 backdrop-blur-xl">
        
        {/* Mobile Speaker Notch */}
        <div className="flex justify-between items-center mb-3 px-3 text-[11px] text-slate-400 font-mono">
          <span>9:41</span>
          <div className="w-16 h-3 bg-slate-900 rounded-full border border-slate-800 mx-auto"></div>
          <div className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            <span>5G</span>
          </div>
        </div>

        {/* Prototype Header */}
        <div className="flex justify-between items-center mb-3 px-2">
          <div className="flex items-center gap-1.5 text-xs font-black tracking-tight text-white font-heading">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span>
            ResolveX
          </div>
          <span className="px-2.5 py-0.5 text-[10px] font-extrabold text-rose-300 bg-rose-500/20 border border-rose-500/30 rounded-full uppercase">
            Payment Failed
          </span>
        </div>

        {/* Inner Screen White Card */}
        <div className="bg-white text-slate-900 rounded-3xl p-5 space-y-4 shadow-xl">
          
          {/* Amount & Merchant Header */}
          <div className="text-left space-y-1 pb-3 border-b border-slate-100">
            <div className="text-3xl font-black text-slate-900 tracking-tight font-heading">₹10,000</div>
            <div className="text-xs font-bold text-slate-700">Apollo Emergency Medicine</div>
            <div className="text-[11px] text-slate-400 font-medium">UPI • 12 May 2025, 11:42 AM</div>
          </div>

          {/* Verification Status Items */}
          <div className="space-y-2 text-xs">
            <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-xl border border-slate-100">
              <span className="text-slate-600 font-medium">Bank Debit</span>
              <span className="px-2 py-0.5 text-[10px] font-bold text-emerald-600 bg-emerald-100 rounded-md">
                DEBITED ✓
              </span>
            </div>

            <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-xl border border-slate-100">
              <span className="text-slate-600 font-medium">Merchant Receipt</span>
              <span className="px-2 py-0.5 text-[10px] font-bold text-rose-600 bg-rose-100 rounded-md">
                NOT CONFIRMED
              </span>
            </div>

            <div className="flex items-center justify-between p-2.5 bg-blue-50 rounded-xl border border-blue-100">
              <span className="text-blue-700 font-medium">Resolution</span>
              <span className="px-2 py-0.5 text-[10px] font-bold text-blue-700 bg-blue-100 rounded-md">
                IN PROGRESS
              </span>
            </div>
          </div>

          {/* Action Button */}
          <a
            href="/login"
            className="w-full py-3 text-xs font-bold text-white bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 rounded-2xl shadow-md flex items-center justify-center gap-2 transition-all hover:scale-[1.02]"
          >
            Track Resolution →
          </a>
        </div>

      </div>

      {/* Top Right Floating Card ("Where is my money?") */}
      <div className="hidden sm:block absolute -right-8 top-6 w-72 bg-white text-slate-900 border border-slate-200/90 rounded-2xl p-4 shadow-xl text-xs space-y-3 z-10 animate-float-slow">
        <div className="text-[11px] font-bold text-slate-900 font-heading">
          Where is my money?
        </div>

        <div className="grid grid-cols-4 gap-1 text-center text-[9px] font-medium">
          <div className="p-1.5 bg-emerald-50 text-emerald-700 rounded-lg">
            <Landmark className="w-3.5 h-3.5 mx-auto mb-0.5" />
            Bank Debited
          </div>
          <div className="p-1.5 bg-blue-50 text-blue-700 rounded-lg">
            <Network className="w-3.5 h-3.5 mx-auto mb-0.5" />
            Network Processing
          </div>
          <div className="p-1.5 bg-purple-50 text-purple-700 rounded-lg">
            <ShieldCheck className="w-3.5 h-3.5 mx-auto mb-0.5" />
            Razorpay Investigating
          </div>
          <div className="p-1.5 bg-rose-50 text-rose-700 rounded-lg">
            <Building2 className="w-3.5 h-3.5 mx-auto mb-0.5" />
            Merchant Not Confirmed
          </div>
        </div>
      </div>

      {/* Bottom Right Floating Card ("Don't pay again yet!") */}
      <div className="hidden sm:block absolute -right-6 bottom-4 w-72 bg-white text-slate-900 border border-slate-200/90 rounded-2xl p-4 shadow-2xl text-xs space-y-2.5 z-10">
        <div className="flex items-center gap-1.5 font-bold text-slate-900 font-heading">
          <AlertTriangle className="w-4 h-4 text-rose-500" />
          Don't pay again yet!
        </div>
        <p className="text-[11px] text-slate-500 leading-relaxed">
          Your previous payment is still being resolved. Making another payment now could result in another amount being debited.
        </p>
        <div className="flex items-center gap-2 pt-1">
          <a
            href="/login"
            className="flex-1 py-1.5 bg-slate-900 text-white font-bold text-[10px] rounded-lg text-center shadow hover:bg-slate-800 transition-colors"
          >
            Track Existing Payment
          </a>
          <a
            href="/login"
            className="py-1.5 px-2 bg-slate-100 text-slate-700 font-bold text-[10px] rounded-lg border border-slate-200 text-center hover:bg-slate-200 transition-colors"
          >
            Contact Support
          </a>
        </div>
      </div>

    </div>
  );
};
