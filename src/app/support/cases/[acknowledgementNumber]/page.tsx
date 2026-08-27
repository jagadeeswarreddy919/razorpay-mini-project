'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Logo } from '@/components/logo';
import { ChatPanel } from '@/components/chat-panel';
import { AiTriageService, AiTriageResult } from '@/lib/services/ai-triage.service';
import {
  ArrowLeft,
  UserCheck,
  Building2,
  CheckCircle2,
  XCircle,
  Clock,
  AlertTriangle,
  FileText,
  ShieldAlert,
  Loader2,
  User,
  Ticket,
  Check,
  Home,
  RefreshCw,
  Landmark,
  Network,
  Server,
  Zap,
  Cpu,
  Sparkles,
} from 'lucide-react';

interface SupportNoteItem {
  id: string;
  note: string;
  isInternal: boolean;
  createdAt: string;
  agent: {
    name: string;
    role: string;
  };
}

interface ComplaintEventItem {
  id: string;
  eventType: string;
  title: string;
  description: string;
  createdAt: string;
}

interface SupportCaseDetail {
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
    currency: string;
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
      id: string;
      name: string;
      role: string;
    };
  } | null;
  events: ComplaintEventItem[];
  notes: SupportNoteItem[];
}

export default function SupportCaseDeskPage() {
  const router = useRouter();
  const params = useParams();
  const ackNumber = params?.acknowledgementNumber as string;

  const [agent, setAgent] = useState<{ agentId: string; name: string; email: string; role: string } | null>(null);
  const [complaint, setComplaint] = useState<SupportCaseDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // AI Triage & Draft Response State
  const [aiAnalysis, setAiAnalysis] = useState<AiTriageResult | null>(null);
  const [draftResponse, setDraftResponse] = useState<string>('');

  // Simulation & action states
  const [submitting, setSubmitting] = useState(false);
  const [actionMessage, setActionMessage] = useState<string | null>(null);
  const [simulatingNpci, setSimulatingNpci] = useState(false);
  const [npciStatus, setNpciStatus] = useState<string | null>(null);

  useEffect(() => {
    async function loadCaseDetail() {
      if (!ackNumber) return;

      try {
        // 1. Verify Support Session
        const authRes = await fetch('/api/support/auth/me');
        const authJson = await authRes.json();

        if (!authJson.success || !authJson.data?.agent) {
          router.push('/support/login');
          return;
        }

        setAgent(authJson.data.agent);

        // 2. Fetch Support Case Detail
        const caseRes = await fetch(`/api/support/cases/${ackNumber}`);
        const caseJson = await caseRes.json();

        if (caseJson.success) {
          const detail: SupportCaseDetail = caseJson.data;
          setComplaint(detail);

          // Run AI Triage Analysis
          const analysis = AiTriageService.analyzeCase({
            amount: detail.payment.amount,
            paymentStatus: detail.payment.paymentStatus,
            bankDebitStatus: detail.payment.bankDebitStatus,
            merchantStatus: detail.payment.merchantStatus,
            merchantName: detail.payment.merchant.name,
            utr: detail.payment.utr,
          });
          setAiAnalysis(analysis);
        } else {
          setError(caseJson.error?.message || 'Support case not found.');
        }
      } catch (err) {
        setError('Network error while connecting to ResolveX support engine.');
      } finally {
        setLoading(false);
      }
    }

    loadCaseDetail();
  }, [ackNumber, router]);

  const handleAction = async (action: string, payload: any = {}) => {
    if (!ackNumber) return;
    setSubmitting(true);
    setActionMessage(null);

    try {
      const res = await fetch(`/api/support/cases/${ackNumber}/action`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, ...payload }),
      });
      const json = await res.json();

      if (json.success) {
        setActionMessage(json.message || 'Action executed successfully.');
        
        // Reload case details
        const updatedRes = await fetch(`/api/support/cases/${ackNumber}`);
        const updatedJson = await updatedRes.json();
        if (updatedJson.success) {
          setComplaint(updatedJson.data);
        }
      } else {
        setActionMessage(json.error?.message || 'Failed to execute action.');
      }
    } catch (err) {
      setActionMessage('Error connecting to support backend.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleNpciQuery = () => {
    setSimulatingNpci(true);
    setNpciStatus(null);
    setTimeout(() => {
      setSimulatingNpci(false);
      setNpciStatus(`NPCI Switch Confirmed: Debit of ₹${payment?.amount.toLocaleString()} verified on UTR ${payment?.utr || '123456789012'}. RRN: npci_2026_${Math.floor(100000 + Math.random() * 900000)}.`);
    }, 1200);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col justify-center items-center p-6 space-y-4 font-sans">
        <Loader2 className="w-10 h-10 text-purple-600 animate-spin" />
        <p className="text-sm font-semibold text-slate-600">Loading Support Case Desk...</p>
      </div>
    );
  }

  if (error || !complaint) {
    return (
      <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col justify-center items-center p-6 space-y-6 font-sans">
        <div className="p-6 bg-rose-50 border border-rose-200 rounded-3xl text-center max-w-md space-y-4 shadow-sm">
          <AlertTriangle className="w-10 h-10 text-rose-500 mx-auto" />
          <h2 className="text-xl font-bold text-slate-900 font-heading">Case Desk Error</h2>
          <p className="text-xs text-slate-600">{error || 'Unable to access case details.'}</p>
          <button
            onClick={() => router.push('/support')}
            className="px-6 py-2.5 bg-white border border-slate-200 text-xs font-bold rounded-full text-slate-700 hover:bg-slate-50 shadow-sm"
          >
            ← Return to Support Queue
          </button>
        </div>
      </div>
    );
  }

  const { payment, customer } = complaint;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans selection:bg-purple-600 selection:text-white">
      {/* Disclaimer Banner */}
      <div className="bg-slate-900 text-slate-300 text-[11px] font-mono px-4 py-1.5 text-center flex items-center justify-center gap-2 border-b border-slate-800">
        <span className="px-2 py-0.5 bg-purple-500/20 text-purple-300 rounded font-bold uppercase tracking-wider text-[10px]">
          DEMO ENVIRONMENT
        </span>
        <span>ResolveX Prototype • Payment & Refund States are Simulated</span>
      </div>

      {/* Header */}
      <header className="sticky top-0 z-50 backdrop-blur-md bg-white/85 border-b border-slate-200/80">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <a href="/">
              <Logo />
            </a>
            <span className="hidden sm:inline-block px-2.5 py-1 text-[10px] font-bold text-purple-800 bg-purple-100 rounded-full border border-purple-200 uppercase tracking-wider font-mono">
              SUPPORT DESK
            </span>
          </div>

          <button
            onClick={() => router.push('/support')}
            className="px-5 py-2.5 text-xs font-bold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-full flex items-center gap-2 transition-all shadow-sm hover:scale-105"
          >
            <ArrowLeft className="w-4 h-4 text-purple-600" />
            Back to Case Queue
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 flex-1 w-full">
        
        {/* Case ACK Header */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
            <a href="/" className="hover:text-slate-900 flex items-center gap-1">
              <Home className="w-3.5 h-3.5 text-slate-400" /> Home
            </a>
            <span>/</span>
            <span className="cursor-pointer hover:text-slate-900" onClick={() => router.push('/support')}>
              Support Queue
            </span>
            <span>/</span>
            <span className="text-purple-600 font-mono font-bold">Case {complaint.acknowledgementNumber}</span>
          </div>

          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pt-2">
            <div>
              <div className="flex items-center gap-2">
                <Ticket className="w-5 h-5 text-purple-600" />
                <span className="text-xs font-extrabold tracking-wider text-purple-700 uppercase font-mono">Support Resolution Desk</span>
              </div>
              <h1 className="text-3xl font-mono font-black text-slate-900 tracking-tight mt-1 font-heading">
                {complaint.acknowledgementNumber}
              </h1>
            </div>

            <div className="flex items-center gap-2">
              <span className={`px-3.5 py-1 text-xs font-bold rounded-full border flex items-center gap-1.5 font-mono ${
                complaint.status === 'RESOLVED'
                  ? 'bg-emerald-100 text-emerald-800 border-emerald-200'
                  : 'bg-blue-100 text-blue-800 border-blue-200'
              }`}>
                {complaint.status === 'RESOLVED' ? '✓ RESOLVED & REFUNDED' : complaint.status}
              </span>
              <span className="px-3 py-1 text-xs font-bold rounded-full bg-purple-100 text-purple-800 border border-purple-200 font-mono">
                PRIORITY: {complaint.priority}
              </span>
            </div>
          </div>
        </div>

        {/* Action Message Feedback */}
        {actionMessage && (
          <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-xs font-semibold text-emerald-900 flex items-center justify-between shadow-sm">
            <span>{actionMessage}</span>
            <button onClick={() => setActionMessage(null)} className="text-slate-400 hover:text-slate-700">✕</button>
          </div>
        )}

        {/* AI RISK MANAGER & ASSISTANCE PANEL (Track 2 Integration) */}
        {aiAnalysis && (
          <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl border border-slate-800">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-800 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-purple-600/30 border border-purple-400/40 flex items-center justify-center">
                  <Cpu className="w-5 h-5 text-purple-300" />
                </div>
                <div>
                  <div className="text-xs font-bold text-purple-300 uppercase tracking-wider font-mono">RESOLVEX AI ASSISTANCE & TRIAGE LAYER</div>
                  <div className="text-lg font-bold font-heading text-white">Case Analysis & Risk Prevention Signal</div>
                </div>
              </div>

              <div className="flex items-center gap-2 font-mono text-xs">
                <span className="px-3 py-1 bg-purple-500/20 text-purple-200 border border-purple-400/30 rounded-full font-bold">
                  URGENCY: {aiAnalysis.urgency}
                </span>
                <span className="px-3 py-1 bg-rose-500/20 text-rose-300 border border-rose-400/30 rounded-full font-bold">
                  SCORE: 88/100
                </span>
              </div>
            </div>

            {/* AI Analysis Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
              
              {/* Left AI Column: Risk Signal & Recommended Action */}
              <div className="space-y-4">
                <div className="p-4 bg-rose-950/40 border border-rose-500/30 rounded-2xl space-y-1.5">
                  <div className="font-bold text-rose-300 flex items-center gap-1.5 font-heading">
                    <ShieldAlert className="w-4 h-4 text-rose-400" /> DUPLICATE PAYMENT RISK WARNING
                  </div>
                  <p className="text-slate-300 leading-relaxed font-medium">
                    {aiAnalysis.riskSignal.warningMessage}
                  </p>
                </div>

                <div className="p-4 bg-purple-950/40 border border-purple-500/30 rounded-2xl space-y-1.5">
                  <div className="font-bold text-purple-300 flex items-center gap-1.5 font-heading">
                    <Sparkles className="w-4 h-4 text-purple-400" /> AI RECOMMENDED ACTION
                  </div>
                  <p className="text-slate-300 leading-relaxed font-medium">
                    {aiAnalysis.recommendedAction}
                  </p>
                </div>
              </div>

              {/* Right AI Column: AI Draft Agent Response */}
              <div className="p-5 bg-slate-800/80 border border-slate-700 rounded-2xl space-y-3 flex flex-col justify-between">
                <div>
                  <div className="font-bold text-purple-300 text-xs font-mono uppercase tracking-wider flex items-center justify-between">
                    <span>AI GENERATED DRAFT AGENT RESPONSE</span>
                    <span className="text-[10px] text-slate-400 font-normal">Requires Approval</span>
                  </div>
                  <p className="text-xs text-slate-300 mt-2 leading-relaxed italic bg-slate-900/60 p-3 rounded-xl border border-slate-800 font-sans">
                    "{aiAnalysis.draftResponse}"
                  </p>
                </div>

                <button
                  onClick={() => setDraftResponse(aiAnalysis.draftResponse)}
                  className="w-full py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs rounded-full transition-all shadow-md flex items-center justify-center gap-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5 text-purple-200" />
                  [ Use AI Draft Response in Chat ]
                </button>
              </div>

            </div>
          </div>
        )}

        {/* INTERBANK MONEY FLOW & NETWORK TRACE VISUALIZER */}
        <div className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
          <div className="flex justify-between items-center pb-4 border-b border-slate-100">
            <div>
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2 font-heading">
                <FileText className="w-5 h-5 text-purple-600" />
                Interbank Money Flow Audit Trail
              </h3>
              <p className="text-xs text-slate-500">Live network trace across banking switch, gateway logs, and merchant accounts.</p>
            </div>
            <button
              onClick={handleNpciQuery}
              disabled={simulatingNpci}
              className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-full shadow-sm flex items-center gap-1.5 transition-all hover:scale-105"
            >
              {simulatingNpci ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <RefreshCw className="w-3.5 h-3.5 text-purple-300" />}
              Re-Query NPCI Switch
            </button>
          </div>

          {/* NPCI Simulation Feedback */}
          {npciStatus && (
            <div className="p-4 bg-purple-50 border border-purple-200 rounded-2xl text-xs font-semibold text-purple-900 flex items-center gap-2 shadow-sm font-mono">
              <CheckCircle2 className="w-4 h-4 text-purple-600 flex-shrink-0" />
              <span>{npciStatus}</span>
            </div>
          )}

          {/* 4-Node Live Flow Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-xs text-center">
            <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 space-y-2">
              <Landmark className="w-6 h-6 text-emerald-600 mx-auto" />
              <div className="font-bold text-slate-900 font-heading">1. Customer Bank</div>
              <div className="text-[10px] font-mono text-emerald-800 bg-emerald-100 p-1 rounded font-bold">
                DEBITED ✓
              </div>
              <div className="text-[10px] text-slate-500 font-mono">UTR: {payment.utr || '123456789012'}</div>
            </div>

            <div className="p-4 bg-blue-50 rounded-2xl border border-blue-200 space-y-2">
              <Network className="w-6 h-6 text-blue-600 mx-auto" />
              <div className="font-bold text-slate-900 font-heading">2. NPCI UPI Switch</div>
              <div className="text-[10px] font-mono text-blue-800 bg-blue-100 p-1 rounded font-bold">
                ROUTED (RRN_9988)
              </div>
              <div className="text-[10px] text-slate-500 font-mono">Settlement Pool Matched</div>
            </div>

            <div className="p-4 bg-purple-50 rounded-2xl border border-purple-200 space-y-2">
              <Server className="w-6 h-6 text-purple-600 mx-auto" />
              <div className="font-bold text-slate-900 font-heading">3. Razorpay Gateway</div>
              <div className="text-[10px] font-mono text-purple-800 bg-purple-100 p-1 rounded font-bold">
                PAYMENT.FAILED
              </div>
              <div className="text-[10px] text-slate-500 font-mono">ID: {payment.razorpayPaymentId}</div>
            </div>

            <div className="p-4 bg-rose-50 rounded-2xl border border-rose-200 space-y-2">
              <Building2 className="w-6 h-6 text-rose-600 mx-auto" />
              <div className="font-bold text-slate-900 font-heading">4. Merchant Bank</div>
              <div className="text-[10px] font-mono text-rose-800 bg-rose-100 p-1 rounded font-bold">
                {payment.merchantStatus}
              </div>
              <div className="text-[10px] text-slate-500 font-mono">Order: {payment.orderId}</div>
            </div>
          </div>
        </div>

        {/* Grid: Support Actions Desk vs Live Customer Chat */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column (1 col): Support Actions */}
          <div className="space-y-6">
            
            <div className="bg-white border border-slate-200/90 rounded-3xl p-6 space-y-6 shadow-xl">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2 font-mono">
                <ShieldAlert className="w-4 h-4 text-purple-600" /> Support Action Desk
              </h3>

              {/* Assignment Status */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                <div className="text-xs text-slate-500 font-medium">Assigned Support Lead</div>
                {complaint.assignment?.agent?.name ? (
                  <div className="flex items-center gap-2 text-sm font-bold text-emerald-700 font-heading">
                    <UserCheck className="w-4 h-4 text-emerald-600" />
                    {complaint.assignment.agent.name}
                  </div>
                ) : (
                  <div className="text-xs text-amber-800 font-bold italic">Unassigned</div>
                )}

                <button
                  onClick={() => handleAction('assign')}
                  disabled={submitting}
                  className="w-full py-2.5 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-bold text-xs rounded-full transition-all shadow-md hover:scale-105"
                >
                  [ Assign Case to Me ]
                </button>
              </div>

              {/* Instant Auto-Refund Button */}
              <button
                onClick={() => handleAction('update_status', { status: 'RESOLVED' })}
                disabled={submitting || complaint.status === 'RESOLVED'}
                className="w-full py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-extrabold text-xs rounded-full shadow-lg border border-emerald-400/30 flex items-center justify-center gap-2 transition-all hover:scale-105 disabled:opacity-50"
              >
                <Zap className="w-4 h-4 text-yellow-300" />
                {complaint.status === 'RESOLVED' ? '✓ Refund Credited' : 'Execute Instant UPI Auto-Reversal'}
              </button>

              {/* Status Update Actions */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase font-mono">Update Status</label>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  {['INVESTIGATING', 'RESOLUTION_REQUIRED', 'RESOLVED', 'CLOSED'].map((st) => (
                    <button
                      key={st}
                      onClick={() => handleAction('update_status', { status: st })}
                      disabled={submitting}
                      className={`py-2 px-2 rounded-full text-[10px] font-bold border transition-all ${
                        complaint.status === st
                          ? 'bg-purple-600 text-white border-purple-500 shadow-sm'
                          : 'bg-white text-slate-700 border-slate-200 hover:border-purple-300'
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>

              {/* Escalation */}
              <div className="space-y-2 pt-2 border-t border-slate-100">
                <button
                  onClick={() => handleAction('escalate', { priority: 'CRITICAL' })}
                  disabled={submitting || complaint.priority === 'CRITICAL'}
                  className="w-full py-2.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 font-bold text-xs rounded-full flex items-center justify-center gap-2 transition-all shadow-sm"
                >
                  <AlertTriangle className="w-4 h-4 text-rose-600" /> [ Escalate to CRITICAL ]
                </button>
              </div>
            </div>

          </div>

          {/* Right Column (2 cols): Live Chat Panel with Draft Response */}
          <div className="lg:col-span-2">
            <ChatPanel
              acknowledgementNumber={complaint.acknowledgementNumber}
              senderType="SUPPORT_AGENT"
              senderName={agent?.name || 'Vikram Verma'}
              draftText={draftResponse}
              onClearDraft={() => setDraftResponse('')}
            />
          </div>

        </div>

      </main>
    </div>
  );
}
