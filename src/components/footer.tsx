'use client';

import React from 'react';
import { Logo } from './logo';
import { Award, Shield } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-white border-t border-slate-200 text-slate-600 py-16 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Info */}
          <div className="space-y-4 md:col-span-2">
            <Logo />
            <p className="text-slate-500 text-xs max-w-md leading-relaxed">
              ResolveX helps customers track failed and pending payments, verify bank debits, raise resolution cases, communicate with support, and follow the payment issue until final resolution.
            </p>
          </div>

          {/* Navigation */}
          <div className="space-y-3">
            <div className="font-bold text-slate-900 uppercase tracking-wider text-[11px] font-heading">Navigation</div>
            <ul className="space-y-2 text-slate-600">
              <li><a href="#hero" className="hover:text-slate-900 transition-colors">Home</a></li>
              <li><a href="#how-it-works" className="hover:text-slate-900 transition-colors">How It Works</a></li>
              <li><a href="#features" className="hover:text-slate-900 transition-colors">Features</a></li>
              <li><a href="#buildathon" className="hover:text-slate-900 transition-colors">About Us</a></li>
              <li><a href="#faq" className="hover:text-slate-900 transition-colors">FAQ</a></li>
            </ul>
          </div>

          {/* Buildathon Info */}
          <div className="space-y-3">
            <div className="font-bold text-slate-900 uppercase tracking-wider text-[11px] font-heading flex items-center gap-1.5">
              <Award className="w-4 h-4 text-purple-600" /> Buildathon Info
            </div>
            <div className="space-y-1 text-slate-700">
              <div className="font-bold text-slate-900">Razorpay Buildathon 2026</div>
              <div>Track 2 — AI Risk Manager</div>
              <div className="text-slate-400 text-[10px] pt-1">Buildathon Prototype Submission</div>
            </div>
          </div>
        </div>

        {/* Disclaimer Bar matching reference image bottom bar */}
        <div className="pt-8 border-t border-slate-100 flex flex-col md:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-purple-600 flex-shrink-0" />
            <span>ResolveX is an independent buildathon prototype and is not an official Razorpay product.</span>
          </div>

          <div className="flex items-center gap-2 font-semibold text-slate-600">
            <span>Powered by</span>
            <span className="font-bold text-slate-900 font-heading">Razorpay</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
