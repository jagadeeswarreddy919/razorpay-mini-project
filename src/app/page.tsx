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
import { Search, ArrowRight, ShieldAlert } from 'lucide-react';
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
      {/* Sticky Navbar */}
      <Navbar onOpenLookup={scrollToLookup} />

      {/* Hero Section */}
      <Hero onOpenLookup={scrollToLookup} />

      {/* Live Interactive Payment Verification Section */}
      <section id="live-lookup-section" className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full scroll-mt-20">
        <PaymentLookupWidget initialIdentifier={lookupInitialId} />
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
