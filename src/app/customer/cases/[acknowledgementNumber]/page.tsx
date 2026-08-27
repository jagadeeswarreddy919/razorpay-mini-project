'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Logo } from '@/components/logo';
import { ChatPanel } from '@/components/chat-panel';
import {
  ArrowLeft,
  Building2,
  CheckCircle2,
  Clock,
  AlertTriangle,
  FileText,
  ShieldCheck,
  Loader2,
  User,
  Landmark,
  Network,
  Server,
  Ticket,
  Check,
  Home,
} from 'lucide-react';

interface ComplaintEvent {
  id: string;
  eventType: string;
  title: string;
  description: string;
  createdAt: string;
}

interface ComplaintDetail {
  id: string;
  acknowledgementNumber: string;
  status: string;
  priority: string;
  category: string;
  reason: string;
  createdAt: string;
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
    customer: {
      name: string;
      phoneNumber: string;
    };
  };
  events: ComplaintEvent[];
}

export default function CaseDetailPage() {
  const router = useRouter();
  const params = useParams();
  const ackNumber = params?.acknowledgementNumber as string;

  const [customerName, setCustomerName] = useState<string>('Rahul Sharma');
  const [complaint, setComplaint] = useState<ComplaintDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadCase() {
      if (!ackNumber) return;

      try {
        // 1. Check Session
        const authRes = await fetch('/api/auth/me');
        const authJson = await authRes.json();

        if (!authJson.success) {
          router.push('/login');
          return;
        }

        if (authJson.data?.name) {
          setCustomerName(authJson.data.name);
        }

        // 2. Fetch Complaint Details by ACK Number
        const compRes = await fetch(`/api/complaints/${ackNumber}`);
        const compJson = await compRes.json();

        if (compJson.success) {
          setComplaint(compJson.data);
        } else {
          setError(compJson.error?.message || 'No active resolution case found.');
        }
      } catch (err) {
        setError('Network error while connecting to ResolveX server.');
      } finally {
        setLoading(false);
      }
    }

    loadCase();
  }, [ackNumber, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col justify-center items-center p-6 space-y-4 font-sans">
        <Loader2 className="w-10 h-10 text-purple-600 animate-spin" />
        <p className="text-sm font-semibold text-slate-600">Loading Resolution Case Details...</p>
      </div>
    );
  }

  if (error || !complaint) {
    return (
      <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col justify-center items-center p-6 space-y-6 font-sans">
        <div className="p-6 bg-rose-50 border border-rose-200 rounded-3xl text-center max-w-md space-y-4 shadow-sm">
          <AlertTriangle className="w-10 h-10 text-rose-500 mx-auto" />
          <h2 className="text-xl font-bold text-slate-900 font-heading">Case Not Found</h2>
          <p className="text-xs text-slate-600">{error || 'No active resolution case found or access denied.'}</p>
          <button
            onClick={() => router.push('/customer')}
            className="px-6 py-2.5 bg-white border border-slate-200 text-xs font-bold rounded-full text-slate-700 hover:bg-slate-50 shadow-sm"
          >
            ← Return to Payment Center
          </button>
        </div>
      </div>
    );
  }

  const { payment } = complaint;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans selection:bg-purple-600 selection:text-white">
      {/* Disclaimer Banner */}
      <div className="bg-slate-900 text-slate-300 text-[11px] font-mono px-4 py-1.5 text-center flex items-center justify-center gap-2 border-b border-slate-800">
        <span className="px-2 py-0.5 bg-purple-500/20 text-purple-300 rounded font-bold uppercase tracking-wider text-[10px]">
          DEMO ENVIRONMENT
        </span>
        <span>ResolveX Prototype • Payment, Bank Debit & Refund States are Simulated</span>
      </div>

      {/* Header */}
      <header className="sticky top-0 z-50 backdrop-blur-md bg-white/85 border-b border-slate-200/80">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <a href="/">
            <Logo />
          </a>
          <button
            onClick={() => router.push(`/customer/transactions/${payment.id}`)}
            className="px-5 py-2.5 text-xs font-bold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-full flex items-center gap-2 transition-all shadow-sm hover:scale-105"
          >
            <ArrowLeft className="w-4 h-4 text-purple-600" />
            Back to Payment Details
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 flex-1 w-full">
        
        {/* Breadcrumb & Case ACK Header */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
            <a href="/" className="hover:text-slate-900 flex items-center gap-1">
              <Home className="w-3.5 h-3.5 text-slate-400" /> Home
            </a>
            <span>/</span>
            <span className="cursor-pointer hover:text-slate-900" onClick={() => router.push('/customer')}>
              Payment Center
            </span>
            <span>/</span>
            <span className="cursor-pointer hover:text-slate-900" onClick={() => router.push(`/customer/transactions/${payment.id}`)}>
              Transaction {payment.id}
            </span>
            <span>/</span>
            <span className="text-purple-600 font-mono font-bold">Case {complaint.acknowledgementNumber}</span>
          </div>

          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pt-2">
            <div>
              <div className="flex items-center gap-2">
                <Ticket className="w-5 h-5 text-purple-600" />
                <span className="text-xs font-extrabold tracking-wider text-purple-700 uppercase font-mono">ResolveX Resolution Case</span>
              </div>
              <h1 className="text-3xl font-mono font-black text-slate-900 tracking-tight mt-1 font-heading">
                {complaint.acknowledgementNumber}
              </h1>
            </div>
            <div className="flex items-center gap-2">
              <span className={`px-3.5 py-1 text-xs font-bold rounded-full border flex items-center gap-1.5 font-mono ${
                complaint.status === 'RESOLVED'
                  ? 'bg-emerald-100 text-emerald-800 border-emerald-200'
                  : 'bg-amber-100 text-amber-800 border-amber-200'
              }`}>
                {complaint.status === 'RESOLVED' ? (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    RESOLVED & REFUNDED
                  </>
                ) : (
                  <>
                    <Clock className="w-3.5 h-3.5 animate-pulse text-amber-600" />
                    {complaint.status}
                  </>
                )}
              </span>
              <span className="px-3 py-1 text-xs font-bold rounded-full bg-purple-100 text-purple-800 border border-purple-200 font-mono">
                PRIORITY: {complaint.priority}
              </span>
            </div>
          </div>
        </div>

        {/* Customer Resolution Banner */}
        {complaint.status === 'RESOLVED' ? (
          <div className="p-6 bg-gradient-to-r from-emerald-500/10 via-emerald-50 to-teal-500/10 border border-emerald-300 rounded-3xl space-y-2 shadow-md">
            <div className="font-extrabold text-emerald-900 text-lg flex items-center gap-2 font-heading">
              <CheckCircle2 className="w-6 h-6 text-emerald-600" />
              Payment Issue Resolved & Money Successfully Refunded!
            </div>
            <p className="text-xs text-slate-700 leading-relaxed font-medium">
              Great news! Your disputed payment of <strong className="text-slate-900 font-bold">₹{payment.amount.toLocaleString()}</strong> has been verified and automatically reversed back to your bank account via UPI Auto-Reversal.
            </p>
          </div>
        ) : (
          <div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 border border-purple-200 rounded-2xl text-xs text-slate-800 space-y-1 shadow-sm">
            <div className="font-bold text-slate-900 flex items-center gap-2 font-heading">
              <ShieldCheck className="w-4 h-4 text-purple-600" />
              Your payment issue has been registered.
            </div>
            <p className="text-slate-600 font-medium">
              Your acknowledgement number is <strong className="text-slate-900 font-mono">{complaint.acknowledgementNumber}</strong>. Use this number whenever you communicate with support.
            </p>
          </div>
        )}

        {/* Key Metrics Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
          <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-sm">
            <div className="text-slate-500 text-[11px] font-medium">Transaction Amount</div>
            <div className="text-xl font-black text-slate-900 mt-0.5 font-heading">₹{payment.amount.toLocaleString()}</div>
          </div>

          <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-sm">
            <div className="text-slate-500 text-[11px] font-medium">Merchant</div>
            <div className="text-sm font-bold text-slate-900 mt-0.5 font-heading">{payment.merchant?.name}</div>
          </div>

          <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-sm">
            <div className="text-slate-500 text-[11px] font-medium">Bank Debit</div>
            <div className="text-sm font-bold text-emerald-700 flex items-center gap-1 mt-0.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" /> {payment.bankDebitStatus}
            </div>
          </div>

          <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-sm">
            <div className="text-slate-500 text-[11px] font-medium">Merchant Receipt</div>
            <div className="text-sm font-bold text-rose-700 flex items-center gap-1 mt-0.5">
              <AlertTriangle className="w-4 h-4 text-rose-600" /> {payment.merchantStatus}
            </div>
          </div>
        </div>

        {/* Grid: Timeline vs Live Chat */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Left: Resolution Timeline */}
          <div className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl flex flex-col justify-between">
            <div className="space-y-6">
              <div className="flex justify-between items-center pb-4 border-b border-slate-100">
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2 font-heading">
                  <Clock className="w-5 h-5 text-purple-600" />
                  RESOLUTION TIMELINE
                </h3>
                <span className="text-xs text-slate-500 font-mono">Real-time Audit Log</span>
              </div>

              <div className="space-y-6 relative pl-6 border-l-2 border-slate-200">
                {complaint.events.map((evt) => (
                  <div key={evt.id} className="relative group">
                    <div className="absolute -left-[31px] top-0.5 w-6 h-6 rounded-full bg-emerald-100 border-2 border-emerald-500 flex items-center justify-center text-emerald-700 text-xs">
                      <Check className="w-3.5 h-3.5" />
                    </div>
                    <div className="space-y-1">
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider font-mono">
                          ✓ {evt.title}
                        </span>
                        <span className="text-[11px] font-mono text-slate-500">
                          {new Date(evt.createdAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      <p className="text-xs text-slate-700 leading-relaxed font-medium">{evt.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Simulated Refund Workflow Stage */}
            <div className="p-4 bg-purple-50 border border-purple-200 rounded-2xl text-xs space-y-2 font-mono">
              <div className="font-bold text-purple-900 flex items-center justify-between">
                <span>SIMULATED REFUND TIMELINE</span>
                <span className="text-[10px] text-purple-700 uppercase font-bold">{complaint.status}</span>
              </div>
              <div className="grid grid-cols-5 gap-1 text-[9px] text-center font-bold pt-1">
                <div className="p-1 bg-emerald-100 text-emerald-800 rounded">✓ VERIFIED</div>
                <div className="p-1 bg-emerald-100 text-emerald-800 rounded">✓ ELIGIBLE</div>
                <div className={`p-1 rounded ${complaint.status === 'RESOLVED' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-900 animate-pulse'}`}>
                  {complaint.status === 'RESOLVED' ? '✓ INITIATED' : '● INITIATED'}
                </div>
                <div className={`p-1 rounded ${complaint.status === 'RESOLVED' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-600'}`}>
                  {complaint.status === 'RESOLVED' ? '✓ PROCESSING' : '○ PROCESSING'}
                </div>
                <div className={`p-1 rounded ${complaint.status === 'RESOLVED' ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-600'}`}>
                  {complaint.status === 'RESOLVED' ? '✓ COMPLETED' : '○ COMPLETED'}
                </div>
              </div>
            </div>

          </div>

          {/* Right: Live Customer ↔ Support Chat Panel */}
          <ChatPanel
            acknowledgementNumber={complaint.acknowledgementNumber}
            senderType="CUSTOMER"
            senderName={customerName}
          />

        </div>

      </main>
    </div>
  );
}
