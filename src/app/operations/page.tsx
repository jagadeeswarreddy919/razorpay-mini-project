'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Logo } from '@/components/logo';
import {
  Activity,
  AlertTriangle,
  ArrowLeft,
  CheckCircle2,
  Clock,
  Filter,
  Loader2,
  RefreshCw,
  ShieldAlert,
  Sliders,
  UserCheck,
  Building2,
} from 'lucide-react';

interface OperationsMetrics {
  totalCases: number;
  openCases: number;
  failedDebitedCases: number;
  pendingDebitedCases: number;
  refundProcessingCount: number;
  resolvedCount: number;
  slaBreachedCount: number;
  totalDisputedVolume: number;
  totalRefundedVolume: number;
}

interface CaseItem {
  id: string;
  acknowledgementNumber: string;
  status: string;
  priority: string;
  category: string;
  reason: string;
  createdAt: string;
  slaStatus: string;
  ageInMinutes: number;
  customer: {
    name: string;
    phoneNumber: string;
  };
  payment: {
    id: string;
    amount: number;
    paymentStatus: string;
    bankDebitStatus: string;
    merchantStatus: string;
    utr: string | null;
    merchant: {
      name: string;
    };
  };
  assignment: {
    agent: {
      name: string;
    };
  } | null;
}

export default function OperationsControlDeskPage() {
  const router = useRouter();
  const [metrics, setMetrics] = useState<OperationsMetrics | null>(null);
  const [cases, setCases] = useState<CaseItem[]>([]);
  const [filter, setFilter] = useState<string>('ALL');
  const [loading, setLoading] = useState(true);

  const loadOperationsData = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/operations/dashboard');
      const json = await res.json();
      if (json.success) {
        setMetrics(json.data.metrics);
        setCases(json.data.cases);
      }
    } catch (err) {
      console.error('Error loading operations metrics:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOperationsData();
  }, []);

  const filteredCases = cases.filter((c) => {
    if (filter === 'ALL') return true;
    if (filter === 'FAILED_DEBITED') return c.category === 'FAILED_DEBITED';
    if (filter === 'SLA_RISK') return c.slaStatus === 'AT_RISK';
    if (filter === 'RESOLVED') return c.status === 'RESOLVED';
    return true;
  });

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans selection:bg-purple-600 selection:text-white">
      {/* Disclaimer Banner */}
      <div className="bg-slate-900 text-slate-300 text-[11px] font-mono px-4 py-1.5 text-center flex items-center justify-center gap-2 border-b border-slate-800">
        <span className="px-2 py-0.5 bg-purple-500/20 text-purple-300 rounded font-bold uppercase tracking-wider text-[10px]">
          DEMO ENVIRONMENT
        </span>
        <span>ResolveX Operations Control Desk • Payment & Refund States are Simulated</span>
      </div>

      {/* Header */}
      <header className="sticky top-0 z-50 backdrop-blur-md bg-white/85 border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <a href="/">
              <Logo />
            </a>
            <button
              onClick={() => router.push('/')}
              className="px-3.5 py-1.5 text-xs font-bold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-full flex items-center gap-1.5 transition-all shadow-sm hover:scale-105"
            >
              <ArrowLeft className="w-3.5 h-3.5 text-purple-600" />
              Back to Home
            </button>
            <span className="hidden sm:inline-block px-2.5 py-1 text-[10px] font-bold text-slate-900 bg-slate-100 rounded-full border border-slate-200 uppercase tracking-wider font-mono">
              OPERATIONS DESK
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={loadOperationsData}
              className="px-4 py-2 text-xs font-bold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-full flex items-center gap-1.5 transition-all shadow-sm"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-purple-600 ${loading ? 'animate-spin' : ''}`} />
              Refresh System Metrics
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 flex-1 w-full">
        
        {/* Title */}
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight font-heading">
            Operations Resolution Desk
          </h1>
          <p className="text-xs text-slate-600 mt-1">
            System-wide payment reconciliation monitoring, SLA compliance tracking, and incident escalation controls.
          </p>
        </div>

        {/* Operational Metrics Cards */}
        {metrics && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
            <div className="p-4 bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white rounded-3xl shadow-md space-y-1">
              <div className="text-slate-400 text-[11px] font-mono flex items-center gap-1">
                <Activity className="w-3.5 h-3.5 text-purple-400" /> Active System Cases
              </div>
              <div className="text-3xl font-black font-heading text-purple-300">{metrics.openCases}</div>
              <div className="text-[10px] text-slate-400">Total Cases: {metrics.totalCases}</div>
            </div>

            <div className="p-4 bg-white rounded-3xl border border-slate-200 shadow-sm space-y-1">
              <div className="text-slate-500 text-[11px] font-mono flex items-center gap-1">
                <ShieldAlert className="w-3.5 h-3.5 text-rose-600" /> Failed + Debited Volume
              </div>
              <div className="text-3xl font-black text-slate-900 font-heading">₹{metrics.totalDisputedVolume.toLocaleString()}</div>
              <div className="text-[10px] text-rose-700 font-bold">{metrics.failedDebitedCases} Critical Debited Disputes</div>
            </div>

            <div className="p-4 bg-amber-50 rounded-3xl border border-amber-200 shadow-sm space-y-1">
              <div className="text-amber-800 text-[11px] font-mono flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-amber-600" /> SLA At-Risk Cases
              </div>
              <div className="text-3xl font-black text-amber-900 font-heading">{metrics.slaBreachedCount}</div>
              <div className="text-[10px] text-amber-700 font-semibold">RBI Circular T+1 SLA Tracked</div>
            </div>

            <div className="p-4 bg-emerald-50 rounded-3xl border border-emerald-200 shadow-sm space-y-1">
              <div className="text-emerald-800 text-[11px] font-mono flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Total Refunded Volume
              </div>
              <div className="text-3xl font-black text-emerald-900 font-heading">₹{metrics.totalRefundedVolume.toLocaleString()}</div>
              <div className="text-[10px] text-emerald-700 font-semibold">{metrics.resolvedCount} Resolved & Refunded</div>
            </div>
          </div>
        )}

        {/* Filter Controls */}
        <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 pb-4">
          <Filter className="w-4 h-4 text-slate-400 mr-2" />
          {[
            { id: 'ALL', label: 'All Active Cases' },
            { id: 'FAILED_DEBITED', label: 'Failed + Debited' },
            { id: 'SLA_RISK', label: 'SLA At-Risk' },
            { id: 'RESOLVED', label: 'Resolved' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilter(tab.id)}
              className={`px-4 py-1.5 text-xs font-bold rounded-full transition-all ${
                filter === tab.id
                  ? 'bg-slate-900 text-white shadow'
                  : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200 shadow-sm'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Operations Table */}
        <div className="bg-white border border-slate-200/90 rounded-3xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 uppercase tracking-wider font-bold border-b border-slate-200 font-mono">
                <tr>
                  <th className="px-6 py-4">ACK Number</th>
                  <th className="px-6 py-4">Amount</th>
                  <th className="px-6 py-4">Customer & Merchant</th>
                  <th className="px-6 py-4">Debit Status</th>
                  <th className="px-6 py-4">SLA Status</th>
                  <th className="px-6 py-4">Case Status</th>
                  <th className="px-6 py-4">Support Lead</th>
                  <th className="px-6 py-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {loading ? (
                  <tr>
                    <td colSpan={8} className="px-6 py-12 text-center text-slate-500">
                      <Loader2 className="w-8 h-8 text-purple-600 animate-spin mx-auto mb-2" />
                      Loading Operations Data...
                    </td>
                  </tr>
                ) : filteredCases.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-6 py-12 text-center text-slate-500">
                      No matching cases in operations desk.
                    </td>
                  </tr>
                ) : (
                  filteredCases.map((c) => (
                    <tr key={c.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="px-6 py-4 font-mono font-bold text-purple-700">{c.acknowledgementNumber}</td>
                      <td className="px-6 py-4 font-bold text-slate-900 font-heading">₹{c.payment.amount.toLocaleString()}</td>
                      <td className="px-6 py-4">
                        <div className="font-bold text-slate-900">{c.customer.name}</div>
                        <div className="text-[11px] text-slate-500 flex items-center gap-1 font-mono">
                          <Building2 className="w-3 h-3 text-purple-600" /> {c.payment.merchant.name}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${
                          c.payment.bankDebitStatus === 'DEBITED'
                            ? 'bg-emerald-100 text-emerald-800 border-emerald-200'
                            : 'bg-slate-100 text-slate-700 border-slate-200'
                        }`}>
                          {c.payment.bankDebitStatus}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                          c.slaStatus === 'AT_RISK'
                            ? 'bg-amber-100 text-amber-900 border border-amber-300'
                            : 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                        }`}>
                          {c.slaStatus === 'AT_RISK' ? '⚠️ AT RISK' : '✓ ON TRACK'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800 border border-blue-200 font-mono">
                          {c.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-slate-700">
                        {c.assignment?.agent?.name ? (
                          <span className="flex items-center gap-1 font-bold text-slate-900">
                            <UserCheck className="w-3.5 h-3.5 text-emerald-600" /> {c.assignment.agent.name}
                          </span>
                        ) : (
                          <span className="text-slate-400 italic">Unassigned</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => router.push(`/support/cases/${c.acknowledgementNumber}`)}
                          className="px-4 py-1.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-full shadow inline-flex items-center gap-1 transition-all"
                        >
                          View Desk →
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

      </main>
    </div>
  );
}
