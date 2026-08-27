'use client';

import React, { useState } from 'react';
import { Bot, Sparkles, MessageSquare } from 'lucide-react';

export const AiSection: React.FC = () => {
  const [selectedPrompt, setSelectedPrompt] = useState(0);

  const sampleAnalyses = [
    {
      userMsg: "My ₹10,000 payment to Apollo Emergency failed but my bank account was debited.",
      issue: "FAILED + BANK DEBITED (Medical Emergency Merchant)",
      priority: "CRITICAL (HIGH)",
      summary: "Customer account debited ₹10,000 for emergency medical bill, but merchant receipt is UNCONFIRMED. Risk rules require immediate auto-acknowledgement and priority merchant reconciliation.",
      action: "1. Lock duplicate payment attempt warning\n2. Issue ACK ID: RX-2026-001847\n3. Route to Priority Merchant Desk",
    },
    {
      userMsg: "Payment for Blinkit order is showing pending for 45 minutes after UPI debit.",
      issue: "PENDING + BANK DEBITED (Quick Commerce)",
      priority: "MEDIUM",
      summary: "Intermediary NPCI clearing delay detected. Bank debit verified. Merchant settlement confirmation expected within 15 minutes.",
      action: "1. Send status update SMS\n2. Auto-check gateway status at T+15min",
    },
  ];

  const current = sampleAnalyses[selectedPrompt];

  return (
    <section className="py-20 md:py-28 bg-slate-50/90 border-t border-slate-200/80 text-slate-900 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-4 py-1 text-xs font-bold tracking-widest text-purple-700 bg-purple-100 border border-purple-200 rounded-full uppercase">
            <Bot className="w-4 h-4 text-purple-600" />
            AI Assistant — Buildathon Prototype
          </div>
          <h2 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight font-heading">
            AI That Understands the Payment Context
          </h2>
          <p className="text-slate-600 text-sm md:text-base">
            ResolveX leverages AI models specifically trained on payment dispute vectors to summarize transaction logs, evaluate urgency, and assist support workflows.
          </p>
        </div>

        {/* AI Intelligence Generated Graphic Banner */}
        <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-slate-200/80 group">
          <img
            src="/ai_risk_intelligence.jpg"
            alt="ResolveX Fintech AI Risk Manager Interface Banner"
            className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent flex items-end p-6 sm:p-10">
            <div className="text-white space-y-2">
              <span className="px-3 py-1 bg-purple-600/90 text-white rounded-full text-xs font-extrabold uppercase font-mono tracking-wider">
                TRACK 2 • AI RISK MANAGER
              </span>
              <h3 className="text-xl sm:text-3xl font-black font-heading text-white">
                Intelligent Dispute Classification & Duplicate Prevention Engine
              </h3>
            </div>
          </div>
        </div>

        {/* AI Capabilities Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 bg-white border border-slate-200/90 rounded-3xl space-y-3 shadow-sm hover:shadow-md transition-shadow">
            <div className="text-xs font-bold text-indigo-600 uppercase tracking-wider font-mono">01. Issue Classification</div>
            <h3 className="text-base font-bold text-slate-900 font-heading">Automated Dispute Categorization</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Categorizes raw customer complaints into precise payment failure states (e.g. FAILED+DEBITED, PENDING+DEBITED).
            </p>
          </div>

          <div className="p-6 bg-white border border-slate-200/90 rounded-3xl space-y-3 shadow-sm hover:shadow-md transition-shadow">
            <div className="text-xs font-bold text-purple-600 uppercase tracking-wider font-mono">02. Urgency Detection</div>
            <h3 className="text-base font-bold text-slate-900 font-heading">Merchant Risk & Urgency Scoring</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Detects high-sensitivity merchant categories (emergency healthcare, travel bookings) to elevate case priority.
            </p>
          </div>

          <div className="p-6 bg-white border border-slate-200/90 rounded-3xl space-y-3 shadow-sm hover:shadow-md transition-shadow">
            <div className="text-xs font-bold text-emerald-600 uppercase tracking-wider font-mono">03. Support Summarization</div>
            <h3 className="text-base font-bold text-slate-900 font-heading">Log & Payload Summarization</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Translates complex technical gateway JSON tracebacks into clear, human-understandable explanations for customers.
            </p>
          </div>
        </div>

        {/* Interactive AI Analysis Display */}
        <div className="bg-white border border-purple-200/90 rounded-3xl p-6 md:p-8 space-y-6 shadow-xl">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-slate-200">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-purple-600" />
              <h3 className="text-lg font-bold text-slate-900 font-heading">Interactive AI Analysis Demo</h3>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setSelectedPrompt(0)}
                className={`px-3.5 py-1.5 text-xs font-bold rounded-xl border transition-all ${
                  selectedPrompt === 0
                    ? 'bg-purple-600 text-white border-purple-500 shadow-sm'
                    : 'bg-slate-50 text-slate-600 border-slate-200 hover:text-slate-900'
                }`}
              >
                Sample 1 (Emergency ₹10k)
              </button>
              <button
                onClick={() => setSelectedPrompt(1)}
                className={`px-3.5 py-1.5 text-xs font-bold rounded-xl border transition-all ${
                  selectedPrompt === 1
                    ? 'bg-purple-600 text-white border-purple-500 shadow-sm'
                    : 'bg-slate-50 text-slate-600 border-slate-200 hover:text-slate-900'
                }`}
              >
                Sample 2 (Blinkit Order)
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* User Input Prompt */}
            <div className="lg:col-span-5 bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-3">
              <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-blue-600" />
                Customer Inquiry Input
              </div>
              <div className="p-3 bg-white rounded-xl text-xs text-slate-800 font-mono italic border border-slate-200 shadow-sm">
                "{current.userMsg}"
              </div>
            </div>

            {/* AI Output Analysis */}
            <div className="lg:col-span-7 bg-purple-50/50 p-5 rounded-2xl border border-purple-200 space-y-4">
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-purple-900 uppercase tracking-wider flex items-center gap-1.5 font-heading">
                  <Bot className="w-4 h-4 text-purple-600" /> AI Classification Output
                </span>
                <span className="px-2 py-0.5 text-[10px] font-mono font-bold text-rose-700 bg-rose-100 rounded border border-rose-200">
                  PRIORITY: {current.priority}
                </span>
              </div>

              <div className="space-y-2 text-xs">
                <div>
                  <span className="text-slate-500 font-medium">Detected Issue Vector:</span>
                  <div className="font-mono text-purple-900 font-bold">{current.issue}</div>
                </div>

                <div>
                  <span className="text-slate-500 font-medium">Context Summary:</span>
                  <p className="text-slate-700 leading-relaxed mt-0.5">{current.summary}</p>
                </div>

                <div className="pt-2 border-t border-purple-200/80">
                  <span className="text-slate-500 font-medium">Recommended Resolution Protocol:</span>
                  <pre className="text-[11px] text-emerald-800 font-mono mt-1 whitespace-pre-wrap bg-white p-3 rounded-xl border border-emerald-200 shadow-sm">
                    {current.action}
                  </pre>
                </div>
              </div>
            </div>
          </div>

          <div className="text-center text-[11px] text-slate-500 italic pt-2">
            * Note: ResolveX AI Assistant acts as a risk decision engine prototype. It does not execute real bank transfers or monetary debit operations.
          </div>
        </div>
      </div>
    </section>
  );
};
