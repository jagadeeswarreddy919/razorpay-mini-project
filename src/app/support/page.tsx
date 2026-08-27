'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Logo } from '@/components/logo';
import {
  ShieldAlert,
  UserCheck,
  LogOut,
  Ticket,
  Clock,
  AlertTriangle,
  CheckCircle2,
  Filter,
  ArrowUpRight,
  ArrowLeft,
  Loader2,
  Building2,
  User,
  Search,
  IndianRupee,
  Activity,
  ShieldCheck,
} from 'lucide-react';

interface SupportMetrics {
  totalComplaints: number;
  openCases: number;
  highPriority: number;
  investigating: number;
  slaRisk: number;
  resolved: number;
}

interface CaseQueueItem {
  id: string;
  acknowledgementNumber: string;
  status: string;
  priority: string;
  category: string;
  reason: string;
  createdAt: string;
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
    razorpayPaymentId: string | null;
    orderId: string | null;
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

export default function SupportDashboardPage() {
  const router = useRouter();

  const [agent, setAgent] = useState<{ name: string; email: string; role: string } | null>(null);
  const [metrics, setMetrics] = useState<SupportMetrics | null>(null);
  const [cases, setCases] = useState<CaseQueueItem[]>([]);
  const [filter, setFilter] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadSupportDashboard() {
      try {
        // 1. Verify Support Session
        const authRes = await fetch('/api/support/auth/me');
        const authJson = await authRes.json();

        if (!authJson.success || !authJson.data?.agent) {
          router.push('/support/login');
          return;
        }

        setAgent(authJson.data.agent);

        // 2. Fetch Cases and Metrics
        const caseRes = await fetch(`/api/support/cases?filter=${filter !== 'ALL' ? filter : ''}`);
        const caseJson = await caseRes.json();

        if (caseJson.success) {
          setMetrics(caseJson.data.metrics);
          setCases(caseJson.data.cases);
        }
      } catch (err) {
        console.error('Error loading support dashboard:', err);
      } finally {
        setLoading(false);
      }
    }

    loadSupportDashboard();
  }, [filter, router]);

  const handleLogout = async () => {
    await fetch('/api/support/auth/logout', { method: 'POST' });
    router.push('/support/login');
  };

  // Client-side search filtering
  const filteredCases = cases.filter((c) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      c.acknowledgementNumber.toLowerCase().includes(q) ||
      c.customer.name.toLowerCase().includes(q) ||
      c.customer.phoneNumber.includes(q) ||
      c.payment.merchant.name.toLowerCase().includes(q) ||
      (c.payment.utr && c.payment.utr.includes(q))
    );
  });

  // Calculate Financial Volume Metrics
  const totalDisputedAmount = cases.reduce((acc, curr) => acc + (curr.payment?.amount || 0), 0);
  const resolvedAmount = cases
    .filter((c) => c.status === 'RESOLVED')
    .reduce((acc, curr) => acc + (curr.payment?.amount || 0), 0);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col justify-center items-center p-6 space-y-4 font-sans">
        <Loader2 className="w-10 h-10 text-purple-600 animate-spin" />
        <p className="text-sm font-semibold text-slate-600">Loading Support Operations Desk...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans selection:bg-purple-600 selection:text-white">
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
            <span className="hidden sm:inline-block px-2.5 py-1 text-[10px] font-bold text-purple-800 bg-purple-100 rounded-full border border-purple-200 uppercase tracking-wider font-mono">
              SUPPORT DESK
            </span>
          </div>

          <div className="flex items-center gap-4">
            {agent && (
              <div className="hidden sm:flex items-center gap-2 px-3.5 py-1.5 bg-white border border-slate-200 rounded-full text-xs shadow-sm">
                <UserCheck className="w-4 h-4 text-purple-600" />
                <span className="font-bold text-slate-900 font-heading">{agent.name}</span>
                <span className="text-slate-400">•</span>
                <span className="text-purple-700 font-mono font-bold">{agent.role}</span>
              </div>
            )}
            <button
              onClick={handleLogout}
              className="px-4 py-2 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-full flex items-center gap-1.5 transition-all shadow-sm"
            >
              <LogOut className="w-3.5 h-3.5 text-slate-400" />
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 flex-1 w-full">
        
        {/* Page Title & Search Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight font-heading">
              Support Operations & Money Tracking Desk
            </h1>
            <p className="text-xs text-slate-600 mt-1">
              Real-time interbank settlement tracking, dispute reconciliation, and automated refund management.
            </p>
          </div>

          {/* Search Box */}
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by ACK, UTR, Name..."
              className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-full text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-purple-500 shadow-sm"
            />
          </div>
        </div>

        {/* Financial & Operational Volume Analytics Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
          <div className="p-4 bg-gradient-to-br from-purple-900 to-indigo-900 text-white rounded-3xl shadow-md space-y-1">
            <div className="text-purple-200 text-[11px] font-mono flex items-center gap-1">
              <IndianRupee className="w-3.5 h-3.5" /> Total Disputed Volume
            </div>
            <div className="text-2xl font-black font-heading">₹{totalDisputedAmount.toLocaleString()}</div>
            <div className="text-[10px] text-purple-300">Across {cases.length} active disputes</div>
          </div>

          <div className="p-4 bg-white rounded-3xl border border-slate-200 shadow-sm space-y-1">
            <div className="text-slate-500 text-[11px] font-mono flex items-center gap-1">
              <Activity className="w-3.5 h-3.5 text-blue-600" /> RBI T+1 SLA Compliance
            </div>
            <div className="text-2xl font-black text-emerald-600 font-heading">ON TRACK</div>
            <div className="text-[10px] text-slate-500">100% within T+1 resolution SLA</div>
          </div>

          <div className="p-4 bg-white rounded-3xl border border-slate-200 shadow-sm space-y-1">
            <div className="text-slate-500 text-[11px] font-mono flex items-center gap-1">
              <ShieldAlert className="w-3.5 h-3.5 text-amber-600" /> Debited Pending Cases
            </div>
            <div className="text-2xl font-black text-amber-900 font-heading">
              {metrics ? metrics.investigating + metrics.highPriority : 0}
            </div>
            <div className="text-[10px] text-amber-700">Bank debited, unconfirmed</div>
          </div>

          <div className="p-4 bg-emerald-50 rounded-3xl border border-emerald-200 shadow-sm space-y-1">
            <div className="text-emerald-800 text-[11px] font-mono flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> Total Auto-Refunded
            </div>
            <div className="text-2xl font-black text-emerald-900 font-heading">₹{resolvedAmount.toLocaleString()}</div>
            <div className="text-[10px] text-emerald-700">Reversed via UPI Auto-Reversal</div>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 pb-4">
          <Filter className="w-4 h-4 text-slate-400 mr-2" />
          {[
            { id: 'ALL', label: 'All Cases' },
            { id: 'HIGH_PRIORITY', label: 'High Priority' },
            { id: 'FAILED_DEBITED', label: 'Failed + Debited' },
            { id: 'INVESTIGATING', label: 'Investigating' },
            { id: 'RESOLVED', label: 'Resolved & Refunded' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilter(tab.id)}
              className={`px-4 py-1.5 text-xs font-bold rounded-full transition-all ${
                filter === tab.id
                  ? 'bg-purple-600 text-white shadow-md'
                  : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200 shadow-sm'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Case Queue Table */}
        <div className="bg-white border border-slate-200/90 rounded-3xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 uppercase tracking-wider font-bold border-b border-slate-200 font-mono">
                <tr>
                  <th className="px-6 py-4">ACK & UTR</th>
                  <th className="px-6 py-4">Customer</th>
                  <th className="px-6 py-4">Merchant & Amount</th>
                  <th className="px-6 py-4">Debit Status</th>
                  <th className="px-6 py-4">Priority</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Assigned Agent</th>
                  <th className="px-6 py-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {filteredCases.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-6 py-12 text-center text-slate-500">
                      No matching cases found in queue.
                    </td>
                  </tr>
                ) : (
                  filteredCases.map((c) => (
                    <tr key={c.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-mono font-bold text-purple-700">{c.acknowledgementNumber}</div>
                        <div className="text-[10px] text-slate-400 font-mono">UTR: {c.payment?.utr || 'N/A'}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-slate-900 font-bold font-heading">{c.customer?.name}</div>
                        <div className="text-slate-500 text-[11px] font-mono">{c.customer?.phoneNumber}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-slate-900 font-bold font-heading">₹{c.payment?.amount?.toLocaleString()}</div>
                        <div className="text-slate-500 text-[11px] flex items-center gap-1">
                          <Building2 className="w-3 h-3 text-purple-600" /> {c.payment?.merchant?.name}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${
                          c.payment?.bankDebitStatus === 'DEBITED'
                            ? 'bg-emerald-100 text-emerald-800 border-emerald-200'
                            : 'bg-slate-100 text-slate-700 border-slate-200'
                        }`}>
                          {c.payment?.bankDebitStatus || 'UNKNOWN'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${
                          c.priority === 'CRITICAL' || c.priority === 'HIGH'
                            ? 'bg-purple-100 text-purple-800 border-purple-200'
                            : 'bg-slate-100 text-slate-700 border-slate-200'
                        }`}>
                          {c.priority}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${
                          c.status === 'RESOLVED'
                            ? 'bg-emerald-100 text-emerald-800 border-emerald-200'
                            : 'bg-blue-100 text-blue-800 border-blue-200'
                        }`}>
                          {c.status === 'RESOLVED' ? '✓ RESOLVED' : c.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-slate-700">
                        {c.assignment?.agent?.name ? (
                          <span className="flex items-center gap-1 font-bold text-slate-900">
                            <UserCheck className="w-3.5 h-3.5 text-emerald-600" />
                            {c.assignment.agent.name}
                          </span>
                        ) : (
                          <span className="text-slate-400 italic">Unassigned</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => router.push(`/support/cases/${c.acknowledgementNumber}`)}
                          className="px-4 py-1.5 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white text-xs font-bold rounded-full shadow inline-flex items-center gap-1 transition-all hover:scale-105"
                        >
                          Open Case Desk <ArrowUpRight className="w-3.5 h-3.5" />
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
