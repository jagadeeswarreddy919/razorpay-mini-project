'use client';

import React from 'react';
import { Search, ShieldCheck, FileText, Headphones, RefreshCw, ArrowRight, Zap, Clock, Star, Shield } from 'lucide-react';

export const HowItWorks: React.FC = () => {
  const steps = [
    {
      num: '1',
      title: 'Find Your Payment',
      desc: 'Search using UTR or Payment ID.',
      icon: Search,
      bgColor: 'bg-rose-100 text-rose-600',
    },
    {
      num: '2',
      title: 'Verify & Investigate',
      desc: 'We check the payment and bank debit status.',
      icon: ShieldCheck,
      bgColor: 'bg-sky-100 text-sky-600',
    },
    {
      num: '3',
      title: 'Auto Complaint',
      desc: 'We create a case and generate ACK number.',
      icon: FileText,
      bgColor: 'bg-emerald-100 text-emerald-600',
    },
    {
      num: '4',
      title: 'Support & Resolution',
      desc: 'Our team works on your case with priority.',
      icon: Headphones,
      bgColor: 'bg-purple-100 text-purple-600',
    },
    {
      num: '5',
      title: 'Refund / Resolution',
      desc: 'We track and update you in real-time.',
      icon: RefreshCw,
      bgColor: 'bg-teal-100 text-teal-600',
    },
  ];

  return (
    <section id="how-it-works" className="py-20 bg-slate-50/80 border-t border-slate-200/80 text-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-2">
          <span className="text-xs font-extrabold uppercase tracking-widest text-indigo-600">
            HOW IT WORKS
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-heading">
            From Failure to Resolution — In 5 Simple Steps
          </h2>
          <p className="text-slate-600 text-sm max-w-xl mx-auto">
            We handle the complexity, so you don't have to.
          </p>
        </div>

        {/* 5 Connected Step Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5 relative">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <div
                key={idx}
                className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col space-y-4 relative group"
              >
                <div className="flex items-center justify-between">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${step.bgColor}`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  {idx < steps.length - 1 && (
                    <div className="hidden lg:block text-slate-300">
                      <ArrowRight className="w-4 h-4 text-slate-300" />
                    </div>
                  )}
                </div>

                <div className="space-y-1.5">
                  <h3 className="text-sm font-bold text-slate-900 font-heading">
                    {step.num}. {step.title}
                  </h3>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    {step.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
