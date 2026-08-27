'use client';

import React from 'react';
import { Ticket, ArrowRight, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface AcknowledgementCardProps {
  onTrackClick?: () => void;
}

export const AcknowledgementCard: React.FC<AcknowledgementCardProps> = () => {
  const router = useRouter();

  return (
    <section className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
      <div className="p-8 md:p-10 bg-white border border-purple-200/90 rounded-3xl space-y-6 shadow-xl text-slate-900">
        
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-6 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <Ticket className="w-5 h-5 text-purple-600" />
              <span className="text-xs font-extrabold tracking-wider text-purple-700 uppercase font-mono">AUTOMATIC RESOLUTION ACKNOWLEDGEMENT</span>
            </div>
            <h3 className="text-2xl font-mono font-black text-slate-900 tracking-tight mt-1 font-heading">
              ACK: RX-2026-001847
            </h3>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-3 py-1 text-xs font-bold text-emerald-700 bg-emerald-100 rounded-full border border-emerald-200 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" /> CASE ACTIVE
            </span>
            <span className="px-3 py-1 text-xs font-bold text-purple-700 bg-purple-100 rounded-full border border-purple-200">
              HIGH PRIORITY
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-1">
            <div className="text-slate-500 font-medium">Disputed Amount</div>
            <div className="text-lg font-black text-slate-900 font-heading">₹10,000</div>
          </div>

          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-1">
            <div className="text-slate-500 font-medium">Merchant</div>
            <div className="text-sm font-bold text-slate-900 font-heading">Apollo Emergency Medicine</div>
          </div>

          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-1">
            <div className="text-slate-500 font-medium">Classification</div>
            <div className="text-xs font-bold text-rose-600 font-mono">FAILED + BANK DEBITED</div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
          <p className="text-xs text-slate-600 max-w-xl leading-relaxed">
            Use acknowledgement number <strong>RX-2026-001847</strong> to track updates or present to support agents during dispute resolution.
          </p>
          <button
            onClick={() => router.push('/login')}
            className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-bold text-xs rounded-full shadow-lg flex items-center justify-center gap-2 transition-all hover:scale-105"
          >
            Track Resolution Case <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </section>
  );
};
