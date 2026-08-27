'use client';

import React, { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';

export const Faq: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      q: 'What should I do if my payment failed but my bank account was debited?',
      a: 'Do not make another payment attempt immediately. Use ResolveX to check the bank debit status against merchant receipt logs. ResolveX will automatically create a resolution case and generate an ACK tracking ID.',
    },
    {
      q: 'What is an ACK Number?',
      a: 'An ACK Number (e.g. RX-2026-001847) is a unique, human-readable acknowledgement identifier generated automatically by ResolveX to track your payment dispute across support desks.',
    },
    {
      q: 'How long does payment resolution take?',
      a: 'Most UPI and card transaction debits are reconciled automatically within 10 to 45 minutes once gateway settlement callbacks complete.',
    },
    {
      q: 'Is ResolveX an official Razorpay product?',
      a: 'No. ResolveX is an independent prototype built for the Razorpay Buildathon 2026 (Track 2: AI Risk Manager). Payment and refund states in this prototype are simulated using test data.',
    },
    {
      q: 'Does ResolveX ask for my UPI PIN or netbanking password?',
      a: 'Never. ResolveX will never ask for your UPI PIN, card CVV, or bank password. Transaction verification relies strictly on public identifiers like UTRs and Razorpay Payment IDs.',
    },
    {
      q: 'How do I log in to track my payments?',
      a: 'Click "Track My Payment", enter your 10-digit phone number (+91 9876543210 for pre-seeded Rahul Sharma demo), and enter verification OTP (demo OTP: 123456).',
    },
  ];

  return (
    <section id="faq" className="py-20 bg-slate-50 border-t border-slate-200 text-slate-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <span className="text-xs font-bold uppercase tracking-widest text-indigo-600 font-mono">
            FREQUENTLY ASKED QUESTIONS
          </span>
          <h2 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight font-heading">
            Got Questions? We Have Answers.
          </h2>
        </div>

        {/* Accordion */}
        <div className="space-y-4">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className="bg-white border border-slate-200/90 rounded-2xl overflow-hidden shadow-sm transition-all"
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : idx)}
                  className="w-full p-6 text-left flex justify-between items-center gap-4 font-bold text-slate-900 text-sm md:text-base font-heading hover:text-purple-600 transition-colors"
                >
                  <span className="flex items-center gap-2">
                    <HelpCircle className="w-4 h-4 text-purple-600 flex-shrink-0" />
                    {faq.q}
                  </span>
                  <ChevronDown className={`w-5 h-5 text-slate-400 transition-transform ${isOpen ? 'rotate-180 text-purple-600' : ''}`} />
                </button>

                {isOpen && (
                  <div className="px-6 pb-6 text-xs md:text-sm text-slate-600 leading-relaxed border-t border-slate-100 pt-4">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
