'use client';

import React, { useState } from 'react';
import { Navbar } from '@/components/navbar';
import { Hero } from '@/components/hero';
import { PaymentLookupWidget } from '@/components/payment-lookup-widget';
import { SafetyWarning } from '@/components/safety-warning';
import { PaymentStatus } from '@/components/payment-status';
import { ProblemSection } from '@/components/problem-section';
import { HowItWorks } from '@/components/how-it-works';
import { FeatureGrid } from '@/components/feature-grid';
import { PaymentJourney } from '@/components/payment-journey';
import { AcknowledgementCard } from '@/components/acknowledgement-card';
import { AiSection } from '@/components/ai-section';
import { SupportSection } from '@/components/support-section';
import { SecuritySection } from '@/components/security-section';
import { BuildathonSection } from '@/components/buildathon-section';
import { Faq } from '@/components/faq';
import { Footer } from '@/components/footer';
import { Search, ArrowRight, ShieldAlert, Cpu, CheckCircle2, ArrowRightLeft, Layers, ShieldCheck } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();
  const [lookupInitialId, setLookupInitialId] = useState<string | undefined>('123456789012');

  const scrollToLookup = (initialQuery?: string) => {
    if (initialQuery !== undefined) {
      setLookupInitialId(initialQuery);
    }
    const el = document.getElementById('live-lookup-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    } else {
      router.push('/login');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans selection:bg-purple-600 selection:text-white">
      {/* Prototype Disclaimer Top Banner */}
      <div className="bg-slate-900 text-slate-300 text-[11px] font-mono px-4 py-1.5 text-center flex items-center justify-center gap-2 border-b border-slate-800">
        <span className="px-2 py-0.5 bg-purple-500/20 text-purple-300 rounded font-bold uppercase tracking-wider text-[10px]">
          BUILDATHON PROTOTYPE
        </span>
        <span>ResolveX is an independent Razorpay Buildathon 2026 prototype. Payment, bank debit & refund states are simulated.</span>
      </div>

      {/* Sticky Navbar */}
      <Navbar onOpenLookup={scrollToLookup} />

      {/* Hero Section */}
      <Hero onOpenLookup={scrollToLookup} />

      {/* Honest Prototype Metrics Bar (Replaces Fake Statistics) */}
      <section className="py-8 bg-white border-y border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div>
            <div className="text-3xl font-black text-slate-900 font-heading">5</div>
            <div className="text-xs font-bold text-slate-500 uppercase tracking-wider font-mono mt-1">Payment Scenarios</div>
          </div>
          <div>
            <div className="text-3xl font-black text-purple-600 font-heading">4</div>
            <div className="text-xs font-bold text-slate-500 uppercase tracking-wider font-mono mt-1">User Portals & Roles</div>
          </div>
          <div>
            <div className="text-3xl font-black text-indigo-600 font-heading">7+</div>
            <div className="text-xs font-bold text-slate-500 uppercase tracking-wider font-mono mt-1">Resolution Audit States</div>
          </div>
          <div>
            <div className="text-3xl font-black text-emerald-600 font-heading">100%</div>
            <div className="text-xs font-bold text-slate-500 uppercase tracking-wider font-mono mt-1">Simulated Transactions</div>
          </div>
        </div>
      </section>

      {/* WHY RESOLVEX: BEFORE VS AFTER COMPARISON */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="text-center space-y-4 mb-12">
          <span className="px-3.5 py-1 text-xs font-extrabold tracking-wider text-purple-700 bg-purple-100 rounded-full border border-purple-200 uppercase font-mono">
            WHY RESOLVEX
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 font-heading">
            Transforming Payment Failure Confusion into Instant Clarity
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Before */}
          <div className="p-8 bg-rose-50/70 border border-rose-200 rounded-3xl space-y-4">
            <div className="text-xs font-bold text-rose-700 uppercase tracking-wider font-mono">TRADITIONAL PAYMENT DISPUTE</div>
            <h3 className="text-xl font-bold text-slate-900 font-heading">The Painful Manual Loop</h3>
            <div className="space-y-3 text-xs font-medium text-slate-700">
              <div className="p-3 bg-white rounded-xl border border-rose-200">1. Payment Fails at Checkout</div>
              <div className="p-3 bg-white rounded-xl border border-rose-200">2. Customer Receives Bank Debit SMS</div>
              <div className="p-3 bg-white rounded-xl border border-rose-200">3. Customer Retries & Gets Debited Twice</div>
              <div className="p-3 bg-white rounded-xl border border-rose-200">4. Support Asks Customer for UTR & Bank Receipts</div>
              <div className="p-3 bg-white rounded-xl border border-rose-200">5. 7–14 Days Unclear Waiting Period</div>
            </div>
          </div>

          {/* ResolveX */}
          <div className="p-8 bg-gradient-to-br from-purple-900 to-indigo-900 text-white rounded-3xl space-y-4 shadow-xl">
            <div className="text-xs font-bold text-purple-300 uppercase tracking-wider font-mono">WITH RESOLVEX</div>
            <h3 className="text-xl font-bold text-white font-heading">Automated End-to-End Resolution</h3>
            <div className="space-y-3 text-xs font-medium">
              <div className="p-3 bg-white/10 rounded-xl border border-purple-400/30">1. Payment Failure Detected</div>
              <div className="p-3 bg-white/10 rounded-xl border border-purple-400/30">2. Bank Debit Confirmed via Interbank Trace</div>
              <div className="p-3 bg-white/10 rounded-xl border border-purple-400/30">3. Resolution Case RX-2026-001847 Created</div>
              <div className="p-3 bg-white/10 rounded-xl border border-purple-400/30">4. AI Triage Assists Support & Warns Duplicate Debit</div>
              <div className="p-3 bg-white/10 rounded-xl border border-purple-400/30">5. Automated Reversal Credited & Tracked Live</div>
            </div>
          </div>
        </div>
      </section>



      {/* Safety Warning Card */}
      <section className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <SafetyWarning
          onTrackClick={() => router.push('/login')}
          onSupportClick={() => {
            const el = document.getElementById('support-section');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }}
        />
      </section>

      {/* "WHERE IS MY MONEY?" Visual Flow */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <PaymentStatus />
      </section>

      {/* Core Problem Section */}
      <ProblemSection />

      {/* How It Works (5 Steps) */}
      <HowItWorks />

      {/* Feature Grid (5 Cards) */}
      <FeatureGrid />

      {/* Stage-by-Stage Payment Audit Trail */}
      <PaymentJourney />

      {/* Persistent Case Acknowledgement Section */}
      <AcknowledgementCard onTrackClick={() => router.push('/login')} />

      {/* AI Assistant Section */}
      <AiSection />

      {/* Support Options Section */}
      <div id="support-section">
        <SupportSection
          onContactClick={() => router.push('/support')}
          onTrackClick={() => router.push('/login')}
        />
      </div>

      {/* Privacy & Safety Section */}
      <SecuritySection />

      {/* Razorpay Buildathon 2026 Track 2 Context */}
      <BuildathonSection />

      {/* FAQ Accordion Section */}
      <Faq />

      {/* Final Call to Action Section */}
      <section className="py-20 md:py-28 bg-gradient-to-r from-blue-900 via-indigo-900 to-purple-950 text-white text-center relative overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight font-heading">
            Don't Let a Failed Payment Become a Mystery.
          </h2>
          <p className="text-slate-200 text-sm md:text-lg max-w-2xl mx-auto leading-relaxed">
            Track the transaction. Understand the status. Follow the resolution.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <a
              href="/login"
              className="w-full sm:w-auto px-8 py-4 text-xs font-bold text-white bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 rounded-full shadow-xl flex items-center justify-center gap-2 transition-all hover:scale-105"
            >
              <Search className="w-4 h-4 text-blue-200" />
              Track My Payment →
            </a>
            <a
              href="/login"
              className="w-full sm:w-auto px-8 py-4 text-xs font-bold text-slate-800 bg-white hover:bg-slate-100 rounded-full border border-purple-200 flex items-center justify-center gap-2 transition-all"
            >
              <ShieldAlert className="w-4 h-4 text-purple-600" />
              Raise a Complaint
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}
