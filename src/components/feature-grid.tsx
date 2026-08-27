'use client';

import React from 'react';
import { Search, Zap, Bot, Clock, Lock } from 'lucide-react';

export const FeatureGrid: React.FC = () => {
  const features = [
    {
      title: 'Instant Tracking',
      desc: 'Check payment status in real-time with UTR, Payment ID or Order ID.',
      icon: Search,
      bgColor: 'bg-sky-100 text-sky-600',
    },
    {
      title: 'Automatic Complaints',
      desc: 'We detect issues and create resolution cases automatically.',
      icon: Zap,
      bgColor: 'bg-purple-100 text-purple-600',
    },
    {
      title: 'AI Support Assistant',
      desc: 'Get instant answers, summaries and recommendations.',
      icon: Bot,
      bgColor: 'bg-indigo-100 text-indigo-600',
    },
    {
      title: 'Live Resolution Updates',
      desc: 'Track every step from investigation to refund in real-time.',
      icon: Clock,
      bgColor: 'bg-rose-100 text-rose-600',
    },
    {
      title: 'Secure & Private',
      desc: 'Your data is protected with industry best practices and encryption.',
      icon: Lock,
      bgColor: 'bg-emerald-100 text-emerald-600',
    },
  ];

  return (
    <section id="features" className="py-20 bg-slate-100/70 border-t border-slate-200 text-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Section Header */}
        <div className="space-y-2">
          <span className="text-xs font-bold uppercase tracking-widest text-blue-600">
            KEY FEATURES
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-heading">
            Built for Your Peace of Mind
          </h2>
          <p className="text-slate-600 text-sm max-w-2xl">
            More than just tracking — ResolveX gives you complete visibility and support.
          </p>
        </div>

        {/* 5 Feature Cards Grid matching reference image */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
          {features.map((feat, idx) => {
            const Icon = feat.icon;
            return (
              <div
                key={idx}
                className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow duration-200 flex flex-col space-y-4"
              >
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${feat.bgColor}`}>
                  <Icon className="w-6 h-6" />
                </div>

                <div className="space-y-1.5 flex-1">
                  <h3 className="text-sm font-bold text-slate-900 font-heading">
                    {feat.title}
                  </h3>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    {feat.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Ecosystem Logos & Slogan Footer */}
        <div className="pt-10 border-t border-slate-200/80 flex flex-col sm:flex-row items-center justify-between gap-6 text-xs text-slate-500">
          <div className="flex items-center gap-6 font-bold tracking-wider uppercase text-slate-400">
            <span>Powered by Razorpay Ecosystem</span>
            <span>•</span>
            <span>UPI</span>
            <span>•</span>
            <span>RuPay</span>
            <span>•</span>
            <span>NPCI</span>
          </div>

          <div className="italic font-serif text-sm text-slate-500">
            Because every payment matters.
          </div>
        </div>

      </div>
    </section>
  );
};
