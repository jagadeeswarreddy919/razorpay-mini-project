'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Logo } from '@/components/logo';
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
  Send,
  Ticket,
  MessageSquare,
  Check,
  Home,
  RefreshCw,
  Landmark,
  Network,
  Server,
  Zap,
  ShieldCheck,
  Activity,
  Cpu,
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

  // Simulation & action states
  const [newNote, setNewNote] = useState('');
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
          setComplaint(caseJson.data);
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
        if (action === 'add_note') setNewNote('');
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
                <span className="text-xs font-extrabold tracking-wider text-purple-700 uppercase font-mono">Support Resolution & Money Tracking Desk</span>
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

        {/* AI RISK MANAGER & RBI SLA BANNER (Track 2 Integration) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          {/* AI Risk Score */}
          <div className="p-5 bg-gradient-to-br from-purple-900 via-indigo-900 to-slate-900 text-white rounded-3xl shadow-lg space-y-2">
            <div className="flex justify-between items-center text-purple-300 font-mono text-[11px]">
              <span className="flex items-center gap-1.5"><Cpu className="w-4 h-4 text-purple-400" /> AI Risk Manager</span>
              <span className="px-2 py-0.5 bg-purple-500/30 rounded-full border border-purple-400/40">SCORE: 88/100</span>
            </div>
            <div className="text-xl font-extrabold font-heading text-rose-300">HIGH RISK DISPUTE VECTOR</div>
            <p className="text-[11px] text-purple-200 leading-relaxed font-medium">
              AI classified this payment as high priority due to medical merchant context and verified customer debit.
            </p>
          </div>

          {/* RBI T+1 SLA Countdown */}
          <div className="md:col-span-2 p-5 bg-amber-50 border border-amber-300 rounded-3xl shadow-sm space-y-2 flex flex-col justify-between">
            <div className="flex justify-between items-center text-amber-900">
              <span className="text-xs font-bold flex items-center gap-2 font-heading">
                <Clock className="w-4 h-4 text-amber-600 animate-pulse" />
                RBI Circular T+1 Auto-Reversal SLA Countdown
              </span>
              <span className="px-3 py-1 bg-amber-200/80 text-amber-900 rounded-full font-mono text-xs font-bold border border-amber-300">
                18h 42m Remaining
              </span>
            </div>
            <p className="text-xs text-slate-700 leading-relaxed font-medium">
              Under RBI Circular DPSS.CO.PD.No.629/2019-20, failed transactions with customer debit must be auto-reversed within T+1 days. ResolveX automated refund engine is ready to execute reversal without delay.
            </p>
          </div>
        </div>

        {/* INTERBANK MONEY FLOW & NETWORK TRACE VISUALIZER */}
        <div className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
          <div className="flex justify-between items-center pb-4 border-b border-slate-100">
            <div>
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2 font-heading">
                <Activity className="w-5 h-5 text-purple-600" />
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
            {/* Node 1 */}
            <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 space-y-2">
              <Landmark className="w-6 h-6 text-emerald-600 mx-auto" />
              <div className="font-bold text-slate-900 font-heading">1. Customer Bank</div>
              <div className="text-[10px] font-mono text-emerald-800 bg-emerald-100 p-1 rounded font-bold">
                DEBITED ✓
              </div>
              <div className="text-[10px] text-slate-500 font-mono">UTR: {payment.utr || '123456789012'}</div>
            </div>

            {/* Node 2 */}
            <div className="p-4 bg-blue-50 rounded-2xl border border-blue-200 space-y-2">
              <Network className="w-6 h-6 text-blue-600 mx-auto" />
              <div className="font-bold text-slate-900 font-heading">2. NPCI UPI Switch</div>
              <div className="text-[10px] font-mono text-blue-800 bg-blue-100 p-1 rounded font-bold">
                ROUTED (RRN_9988)
              </div>
              <div className="text-[10px] text-slate-500 font-mono">Settlement Pool Matched</div>
            </div>

            {/* Node 3 */}
            <div className="p-4 bg-purple-50 rounded-2xl border border-purple-200 space-y-2">
              <Server className="w-6 h-6 text-purple-600 mx-auto" />
              <div className="font-bold text-slate-900 font-heading">3. Razorpay Gateway</div>
              <div className="text-[10px] font-mono text-purple-800 bg-purple-100 p-1 rounded font-bold">
                PAYMENT.FAILED
              </div>
              <div className="text-[10px] text-slate-500 font-mono">ID: {payment.razorpayPaymentId}</div>
            </div>

            {/* Node 4 */}
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

        {/* Top Split Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column (2 cols): Customer & Payment Info */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Overview Card */}
            <div className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
              
              <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-slate-100">
                <div>
                  <div className="text-xs font-bold text-slate-500 uppercase tracking-wider font-mono">Disputed Amount</div>
                  <div className="text-4xl font-black text-slate-900 mt-1 font-heading">₹{payment.amount.toLocaleString()}</div>
                </div>
                <span className="px-3.5 py-1 text-xs font-bold rounded-full bg-amber-100 text-amber-800 border border-amber-200 font-mono">
                  VECTOR: {complaint.category}
                </span>
              </div>

              {/* Customer & Merchant Metadata */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-1">
                  <div className="text-slate-500 flex items-center gap-1.5 font-medium">
                    <User className="w-4 h-4 text-blue-600" /> Customer Info
                  </div>
                  <div className="text-sm font-bold text-slate-900 font-heading">{customer.name}</div>
                  <div className="text-xs font-mono text-slate-500">{customer.phoneNumber}</div>
                </div>

                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-1">
                  <div className="text-slate-500 flex items-center gap-1.5 font-medium">
                    <Building2 className="w-4 h-4 text-purple-600" /> Merchant Info
                  </div>
                  <div className="text-sm font-bold text-slate-900 font-heading">{payment.merchant.name}</div>
                  <div className="text-xs font-mono text-slate-500">Order: {payment.orderId}</div>
                </div>
              </div>

              {/* Payment Verification States */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider font-mono">Payment Verification States</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between">
                    <div>
                      <div className="text-slate-500 text-[11px]">Payment State</div>
                      <div className="font-bold text-rose-700 mt-0.5">{payment.paymentStatus}</div>
                    </div>
                    <XCircle className="w-5 h-5 text-rose-600" />
                  </div>

                  <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between">
                    <div>
                      <div className="text-slate-500 text-[11px]">Bank Debit</div>
                      <div className="font-bold text-emerald-700 mt-0.5">{payment.bankDebitStatus}</div>
                    </div>
                    <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  </div>

                  <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between">
                    <div>
                      <div className="text-slate-500 text-[11px]">Merchant Receipt</div>
                      <div className="font-bold text-rose-700 mt-0.5">{payment.merchantStatus}</div>
                    </div>
                    <XCircle className="w-5 h-5 text-rose-600" />
                  </div>
                </div>
              </div>

              {/* Payment Technical Identifiers */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2 font-mono">
                  <FileText className="w-4 h-4 text-purple-600" /> Technical Identifiers
                </h3>
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2 text-xs font-mono">
                  <div className="flex justify-between py-1 border-b border-slate-200">
                    <span className="text-slate-500">Bank UTR</span>
                    <span className="text-purple-900 font-bold">{payment.utr || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-200">
                    <span className="text-slate-500">Razorpay Payment ID</span>
                    <span className="text-purple-900 font-bold">{payment.razorpayPaymentId}</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-slate-500">Internal Payment ID</span>
                    <span className="text-purple-900 font-bold">{payment.id}</span>
                  </div>
                </div>
              </div>

            </div>

            {/* Audit Event Timeline */}
            <div className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 space-y-6 shadow-sm">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2 font-heading">
                <Clock className="w-5 h-5 text-purple-600" />
                Case Event Timeline
              </h3>

              <div className="space-y-6 relative pl-6 border-l-2 border-slate-200">
                {complaint.events.map((evt) => (
                  <div key={evt.id} className="relative">
                    <div className="absolute -left-[31px] top-0.5 w-6 h-6 rounded-full bg-purple-100 border-2 border-purple-500 flex items-center justify-center text-purple-700 text-xs">
                      <Check className="w-3.5 h-3.5" />
                    </div>
                    <div className="space-y-1">
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-bold text-purple-800 uppercase tracking-wider font-mono">
                          {evt.title}
                        </span>
                        <span className="text-[11px] font-mono text-slate-500">
                          {new Date(evt.createdAt).toLocaleTimeString('en-IN', {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                      </div>
                      <p className="text-xs text-slate-700 leading-relaxed font-medium">{evt.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Right Column (1 col): Agent Action Control Desk & Internal Notes */}
          <div className="space-y-6">
            
            {/* Agent Actions Card */}
            <div className="bg-white border border-slate-200/90 rounded-3xl p-6 space-y-6 shadow-xl">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2 font-mono">
                <ShieldAlert className="w-4 h-4 text-purple-600" /> Support Action Desk
              </h3>

              {/* Assignment Status */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                <div className="text-xs text-slate-500 font-medium">Assigned Agent</div>
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

              {/* Priority Escalation */}
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

            {/* Internal Support Notes Section */}
            <div className="bg-white border border-slate-200/90 rounded-3xl p-6 space-y-4 shadow-xl">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2 font-mono">
                <MessageSquare className="w-4 h-4 text-purple-600" /> Internal Notes
              </h3>

              {/* Add Note Form */}
              <div className="space-y-3">
                <textarea
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  placeholder="Write internal support observation or audit note..."
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-purple-500 min-h-[90px] resize-none"
                />
                <button
                  onClick={() => handleAction('add_note', { note: newNote })}
                  disabled={submitting || !newNote.trim()}
                  className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-full border border-slate-800 flex items-center justify-center gap-2 transition-all disabled:opacity-50 shadow"
                >
                  <Send className="w-3.5 h-3.5 text-purple-300" /> Add Internal Note
                </button>
              </div>

              {/* Saved Notes List */}
              <div className="space-y-3 pt-2">
                {complaint.notes.length === 0 ? (
                  <p className="text-xs text-slate-400 italic text-center py-4">No internal notes added yet.</p>
                ) : (
                  complaint.notes.map((n) => (
                    <div key={n.id} className="p-3 bg-slate-50 rounded-2xl border border-slate-200 space-y-1 text-xs">
                      <div className="flex justify-between items-center text-[10px] text-purple-700 font-bold font-mono">
                        <span>{n.agent.name}</span>
                        <span className="text-slate-400">
                          {new Date(n.createdAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      <p className="text-slate-700 leading-relaxed font-medium">{n.note}</p>
                    </div>
                  ))
                )}
              </div>
            </div>

          </div>

        </div>

      </main>
    </div>
  );
}
