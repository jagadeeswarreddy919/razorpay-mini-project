'use client';

import React from 'react';
import { MessageSquare, PhoneCall, Mail, ArrowRight, LifeBuoy } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface SupportSectionProps {
  onContactClick?: () => void;
  onTrackClick?: () => void;
}

export const SupportSection: React.FC<SupportSectionProps> = ({ onContactClick, onTrackClick }) => {
  const router = useRouter();

  return (
    <section className="py-20 md:py-28 bg-slate-50 border-t border-slate-200 text-slate-900 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <span className="px-4 py-1 text-xs font-bold tracking-widest text-blue-700 bg-blue-100 border border-blue-200 rounded-full uppercase">
            Dedicated Resolution Assistance
          </span>
          <h2 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight font-heading">
            Need Help? Connect With Support.
          </h2>
          <p className="text-slate-600 text-sm md:text-base">
            Choose your preferred communication channel for instant payment reconciliation support.
          </p>
        </div>

        {/* 3 Channels Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white border border-slate-200/90 rounded-3xl p-8 space-y-4 shadow-sm hover:shadow-md transition-all text-center flex flex-col items-center justify-between">
            <div className="p-4 bg-blue-50 text-blue-600 rounded-2xl border border-blue-100 mb-2">
              <MessageSquare className="w-8 h-8" />
            </div>
            <div className="space-y-1">
              <h3 className="text-lg font-bold text-slate-900 font-heading">LIVE CHAT</h3>
              <p className="text-xs text-slate-500">Fast conversation with automated resolution support.</p>
            </div>
            <span className="text-[11px] font-bold text-blue-700 bg-blue-50 px-3.5 py-1 rounded-full border border-blue-200">
              Instant Response
            </span>
          </div>

          <div className="bg-white border border-slate-200/90 rounded-3xl p-8 space-y-4 shadow-sm hover:shadow-md transition-all text-center flex flex-col items-center justify-between">
            <div className="p-4 bg-purple-50 text-purple-600 rounded-2xl border border-purple-100 mb-2">
              <PhoneCall className="w-8 h-8" />
            </div>
            <div className="space-y-1">
              <h3 className="text-lg font-bold text-slate-900 font-heading">CALL SUPPORT</h3>
              <p className="text-xs text-slate-500">Direct assistance for urgent medical or travel cases.</p>
            </div>
            <span className="text-[11px] font-bold text-purple-700 bg-purple-50 px-3.5 py-1 rounded-full border border-purple-200">
              Priority Helpline
            </span>
          </div>

          <div className="bg-white border border-slate-200/90 rounded-3xl p-8 space-y-4 shadow-sm hover:shadow-md transition-all text-center flex flex-col items-center justify-between">
            <div className="p-4 bg-emerald-50 text-emerald-600 rounded-2xl border border-emerald-100 mb-2">
              <Mail className="w-8 h-8" />
            </div>
            <div className="space-y-1">
              <h3 className="text-lg font-bold text-slate-900 font-heading">EMAIL</h3>
              <p className="text-xs text-slate-500">Detailed resolution communication and audit logs.</p>
            </div>
            <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-3.5 py-1 rounded-full border border-emerald-200">
              Detailed Case File
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <button
            onClick={() => router.push('/support')}
            className="w-full sm:w-auto px-8 py-4 text-xs font-bold text-white bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 rounded-full shadow-lg flex items-center justify-center gap-2 transition-all hover:scale-105"
          >
            <LifeBuoy className="w-4 h-4" />
            Contact Support Desk
          </button>
          <button
            onClick={() => router.push('/login')}
            className="w-full sm:w-auto px-8 py-4 text-xs font-bold text-slate-800 bg-white hover:bg-slate-50 border border-purple-200 rounded-full flex items-center justify-center gap-2 transition-all shadow-sm"
          >
            Track My Case
            <ArrowRight className="w-4 h-4 text-purple-600" />
          </button>
        </div>
      </div>
    </section>
  );
};
