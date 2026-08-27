'use client';

import React from 'react';
import { ArrowRight, ShieldCheck, CheckCircle2, Search, Rocket } from 'lucide-react';
import { PaymentMockup } from './payment-mockup';

interface HeroProps {
  onOpenLookup?: (initialId?: string) => void;
}

export const Hero: React.FC<HeroProps> = ({ onOpenLookup }) => {
  return (
    <section id="hero" className="relative pt-12 pb-20 md:pt-16 md:pb-28 overflow-hidden hero-light-bg">
      
      {/* Background Pastel Orbs */}
      <div className="absolute top-10 left-1/4 w-96 h-96 pastel-orb-purple rounded-full blur-3xl pointer-events-none -z-10 animate-pulse-subtle" />
      <div className="absolute top-20 right-1/4 w-96 h-96 pastel-orb-blue rounded-full blur-3xl pointer-events-none -z-10 animate-pulse-subtle" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Headlines & Call to Action */}
          <div className="lg:col-span-7 space-y-6 text-left">
            
            {/* Buildathon Track Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/90 border border-purple-200/80 shadow-sm backdrop-blur-md">
              <Rocket className="w-3.5 h-3.5 text-purple-600 animate-bounce" />
              <span className="text-xs font-bold text-slate-700">
                Razorpay Buildathon 2026 • Track 2 • AI Risk Manager
              </span>
            </div>

            {/* Main Headlines from Reference Image */}
            <div className="space-y-2">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-slate-900 leading-[1.15] font-heading">
                Your Payment Failed? <br />
                <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  We Turn Uncertainty Into Resolution.
                </span>
              </h1>
            </div>

            {/* Supporting Text */}
            <p className="text-base sm:text-lg text-slate-600 max-w-2xl leading-relaxed font-normal">
              Track failed and pending payments, raise complaints instantly, connect with payment support, and follow your refund or resolution until it's complete.
            </p>

            {/* CTA Action Buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2">
              <a
                href="/login"
                className="px-8 py-4 text-xs font-extrabold text-white bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 rounded-full shadow-lg shadow-blue-500/25 border border-blue-400/30 flex items-center justify-center gap-2 transition-all hover:scale-105 active:scale-[0.98]"
              >
                <Search className="w-4 h-4 text-blue-100" />
                Track My Payment →
              </a>
              <a
                href="/login"
                className="px-8 py-4 text-xs font-bold text-slate-800 bg-white/90 hover:bg-slate-50 rounded-full border border-purple-200/90 shadow-sm flex items-center justify-center gap-2 transition-all hover:border-purple-300"
              >
                <ShieldCheck className="w-4 h-4 text-purple-600" />
                Raise a Complaint
              </a>
            </div>

            {/* Value Highlights Checkmarks */}
            <div className="flex flex-wrap items-center gap-6 pt-4 text-xs font-semibold text-slate-500">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-blue-600" />
                <span>Secure</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-purple-600" />
                <span>Fast Resolution</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-indigo-600" />
                <span>Always With You</span>
              </div>
            </div>
          </div>

          {/* Right Column: Hero Product Mockup */}
          <div className="lg:col-span-5 flex justify-center lg:justify-end">
            <PaymentMockup />
          </div>

        </div>
      </div>
    </section>
  );
};
