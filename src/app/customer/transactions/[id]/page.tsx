'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Logo } from '@/components/logo';
import { Payment } from '@/types/payment';
import {
  ArrowLeft,
  Building2,
  CheckCircle2,
  XCircle,
  Clock,
  AlertTriangle,
  FileText,
  ShieldCheck,
  Loader2,
  User,
  Sparkles,
  Search,
  Check,
  Home,
} from 'lucide-react';

export default function TransactionDetailPage() {
  const router = useRouter();
  const params = useParams();
  const paymentId = params?.id as string;

  const [payment, setPayment] = useState<Payment | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Investigation & Complaint modal state
  const [investigating, setInvestigating] = useState(false);
  const [investigationStep, setInvestigationStep] = useState<number>(0);
  const [caseCreated, setCaseCreated] = useState<{
    acknowledgementNumber: string;
    existingCase: boolean;
    status: string;
    priority: string;
  } | null>(null);

  useEffect(() => {
    async function loadTransaction() {
      if (!paymentId) return;

      try {
        // 1. Verify Session
        const authRes = await fetch('/api/auth/me');
        const authJson = await authRes.json();

        if (!authJson.success) {
          router.push('/login');
          return;
        }

        // 2. Fetch Transaction by ID with customer ownership check
        const payRes = await fetch(`/api/payments/${paymentId}`);
        const payJson = await payRes.json();

        if (payJson.success) {
          setPayment(payJson.data);

          // Check if complaint already exists
          if (payJson.data.paymentStatus === 'FAILED' && payJson.data.bankDebitStatus === 'DEBITED') {
            const compRes = await fetch(`/api/payments/${paymentId}/complaint`, { method: 'POST' });
            const compJson = await compRes.json();
            if (compJson.success && compJson.acknowledgementNumber) {
              setCaseCreated({
                acknowledgementNumber: compJson.acknowledgementNumber,
                existingCase: compJson.existingCase || false,
                status: compJson.complaint?.status || 'INVESTIGATING',
                priority: compJson.complaint?.priority || 'HIGH',
              });
            }
          }
        } else {
          setError(payJson.error?.message || 'No payment was found for the provided identifier.');
        }
      } catch (err) {
        setError('Network error while connecting to ResolveX server.');
      } finally {
        setLoading(false);
      }
    }

    loadTransaction();
  }, [paymentId, router]);

  const handleStartInvestigation = async () => {
    if (!payment) return;
    setInvestigating(true);
    setInvestigationStep(1);

    // Multi-step progress animation
    setTimeout(() => setInvestigationStep(2), 700);
    setTimeout(() => setInvestigationStep(3), 1400);
    setTimeout(async () => {
      setInvestigationStep(4);

      try {
        const res = await fetch(`/api/payments/${payment.id}/complaint`, { method: 'POST' });
        const json = await res.json();

        if (json.success) {
          setCaseCreated({
            acknowledgementNumber: json.acknowledgementNumber,
            existingCase: json.existingCase || false,
            status: json.complaint?.status || 'INVESTIGATING',
            priority: json.complaint?.priority || 'HIGH',
          });
        }
      } catch (err) {
        console.error('Complaint creation error:', err);
      } finally {
        setInvestigating(false);
      }
    }, 2100);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col justify-center items-center p-6 space-y-4 font-sans">
        <Loader2 className="w-10 h-10 text-purple-600 animate-spin" />
        <p className="text-sm font-semibold text-slate-600">Loading Transaction Details...</p>
      </div>
    );
  }

  if (error || !payment) {
    return (
      <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col justify-center items-center p-6 space-y-6 font-sans">
        <div className="p-6 bg-rose-50 border border-rose-200 rounded-3xl text-center max-w-md space-y-4 shadow-sm">
          <XCircle className="w-10 h-10 text-rose-500 mx-auto" />
          <h2 className="text-xl font-bold text-slate-900 font-heading">Payment Not Found</h2>
          <p className="text-xs text-slate-600">{error || 'No matching transaction found or access denied.'}</p>
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

  const isFailedDebited = payment.paymentStatus === 'FAILED' && payment.bankDebitStatus === 'DEBITED';
  const isPendingDebited = payment.paymentStatus === 'PENDING' && payment.bankDebitStatus === 'DEBITED';
  const isSuccess = payment.paymentStatus === 'SUCCESS';
  const isFailedNotDebited = payment.paymentStatus === 'FAILED' && payment.bankDebitStatus === 'NOT_DEBITED';

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans selection:bg-purple-600 selection:text-white">
      {/* Header */}
      <header className="sticky top-0 z-50 backdrop-blur-md bg-white/85 border-b border-slate-200/80">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <a href="/">
            <Logo />
          </a>
          
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.push('/customer')}
              className="px-5 py-2.5 text-xs font-bold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-full flex items-center gap-2 transition-all shadow-sm hover:scale-105"
            >
              <ArrowLeft className="w-4 h-4 text-purple-600" />
              Back to Payment Center
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 flex-1 w-full">
        
        {/* Breadcrumb Navigation */}
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
            <span className="text-purple-600 font-mono font-bold">Transaction {payment.id}</span>
          </div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight font-heading">
            Transaction Details & Status Breakdown
          </h1>
        </div>

        {/* 1. FAILED + DEBITED Case Banner */}
        {isFailedDebited && (
          <div className="p-6 bg-gradient-to-r from-amber-500/10 via-amber-50 to-rose-500/10 border border-amber-300 rounded-3xl space-y-6 shadow-md">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-amber-200/70 text-amber-800 rounded-2xl border border-amber-300 flex-shrink-0">
                <AlertTriangle className="w-7 h-7" />
              </div>
              <div className="space-y-1">
                <span className="px-2.5 py-0.5 text-[10px] font-bold text-amber-800 bg-amber-200/80 border border-amber-300 rounded-full uppercase font-mono">
                  PAYMENT ISSUE DETECTED
                </span>
                <h3 className="text-xl font-black text-slate-900 font-heading">
                  Your payment failed, but your bank account was debited.
                </h3>
                <h4 className="text-sm font-bold text-amber-800 font-heading">DON'T PAY AGAIN YET</h4>
                <p className="text-xs text-slate-700 leading-relaxed font-medium">
                  Your previous payment is being investigated. Making another payment now could result in a double debit.
                </p>
              </div>
            </div>

            {/* Case Action / Progress */}
            {caseCreated ? (
              <div className="p-5 bg-white rounded-2xl border border-slate-200 space-y-3 shadow-sm">
                <div className="flex flex-wrap justify-between items-center gap-2">
                  <div className="text-xs font-bold text-emerald-700 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    {caseCreated.existingCase ? 'Active Resolution Case Exists' : 'Resolution Case Created'}
                  </div>
                  <span className="text-xs font-mono font-bold text-purple-700">
                    ACK: {caseCreated.acknowledgementNumber}
                  </span>
                </div>
                <p className="text-xs text-slate-600">
                  Status: <strong className="text-slate-900">{caseCreated.status}</strong> • Priority: <strong className="text-slate-900">{caseCreated.priority}</strong>
                </p>
                <button
                  onClick={() => router.push(`/customer/cases/${caseCreated.acknowledgementNumber}`)}
                  className="px-6 py-3 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-bold text-xs rounded-full shadow-md flex items-center justify-center gap-2 transition-all hover:scale-105"
                >
                  Track Resolution Case →
                </button>
              </div>
            ) : (
              <button
                onClick={handleStartInvestigation}
                disabled={investigating}
                className="w-full sm:w-auto px-8 py-3.5 bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs rounded-full shadow-md flex items-center justify-center gap-2 transition-all disabled:opacity-50 hover:scale-105"
              >
                {investigating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
                Investigate Payment
              </button>
            )}
          </div>
        )}

        {/* 2. SUCCESS Case Banner */}
        {isSuccess && (
          <div className="p-5 bg-emerald-50 border border-emerald-200 rounded-2xl text-emerald-800 text-xs flex items-center justify-between gap-4 shadow-sm">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-6 h-6 text-emerald-600 flex-shrink-0" />
              <div>
                <strong className="text-sm font-bold text-slate-900 font-heading">Payment completed successfully.</strong>
                <p className="text-emerald-800">Merchant confirmed credit receipt. No dispute action required.</p>
              </div>
            </div>
            <span className="px-3 py-1 text-[10px] font-bold bg-emerald-100 text-emerald-800 rounded-full border border-emerald-200">
              CONFIRMED
            </span>
          </div>
        )}

        {/* 3. FAILED + NOT_DEBITED Case Banner */}
        {isFailedNotDebited && (
          <div className="p-5 bg-white border border-slate-200 rounded-2xl text-slate-700 text-xs flex items-center justify-between gap-4 shadow-sm">
            <div className="flex items-center gap-3">
              <XCircle className="w-6 h-6 text-slate-400 flex-shrink-0" />
              <div>
                <strong className="text-sm font-bold text-slate-900 font-heading">Payment failed and no bank debit was detected.</strong>
                <p className="text-slate-600">You can safely try the payment again if the merchant still requires payment.</p>
              </div>
            </div>
          </div>
        )}

        {/* Investigation Progress Modal Overlay */}
        {investigating && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-50 flex items-center justify-center p-4">
            <div className="bg-white border border-slate-200 rounded-3xl p-8 max-w-md w-full space-y-6 text-center shadow-2xl animate-in zoom-in-95 duration-200">
              <div className="p-4 bg-purple-50 text-purple-600 rounded-2xl border border-purple-100 w-fit mx-auto">
                <Loader2 className="w-8 h-8 animate-spin" />
              </div>

              <div className="space-y-1">
                <h3 className="text-xl font-black text-slate-900 font-heading">Investigating Payment</h3>
                <p className="text-xs text-slate-500">Running ResolveX rules engine across settlement channels...</p>
              </div>

              {/* Progress Steps List */}
              <div className="space-y-2 text-xs text-left bg-slate-50 p-4 rounded-2xl border border-slate-200">
                <div className={`flex items-center gap-3 ${investigationStep >= 1 ? 'text-emerald-700 font-bold' : 'text-slate-400'}`}>
                  {investigationStep > 1 ? <Check className="w-4 h-4 text-emerald-600" /> : <div className="w-4 h-4 rounded-full border border-current flex items-center justify-center text-[10px]">1</div>}
                  <span>STEP 1: Checking payment status...</span>
                </div>
                <div className={`flex items-center gap-3 ${investigationStep >= 2 ? 'text-emerald-700 font-bold' : 'text-slate-400'}`}>
                  {investigationStep > 2 ? <Check className="w-4 h-4 text-emerald-600" /> : <div className="w-4 h-4 rounded-full border border-current flex items-center justify-center text-[10px]">2</div>}
                  <span>STEP 2: Verifying debit status...</span>
                </div>
                <div className={`flex items-center gap-3 ${investigationStep >= 3 ? 'text-emerald-700 font-bold' : 'text-slate-400'}`}>
                  {investigationStep > 3 ? <Check className="w-4 h-4 text-emerald-600" /> : <div className="w-4 h-4 rounded-full border border-current flex items-center justify-center text-[10px]">3</div>}
                  <span>STEP 3: Checking merchant confirmation...</span>
                </div>
                <div className={`flex items-center gap-3 ${investigationStep >= 4 ? 'text-emerald-700 font-bold' : 'text-slate-400'}`}>
                  {investigationStep >= 4 ? <Check className="w-4 h-4 text-emerald-600" /> : <div className="w-4 h-4 rounded-full border border-current flex items-center justify-center text-[10px]">4</div>}
                  <span>STEP 4: Creating resolution case...</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Main Details Card */}
        <div className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
          
          <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-slate-100">
            <div>
              <div className="text-xs font-bold text-slate-500 uppercase tracking-wider font-mono">Attempted Amount</div>
              <div className="text-4xl font-black text-slate-900 mt-1 font-heading">₹{payment.amount.toLocaleString()}</div>
            </div>
            <span className={`px-3.5 py-1.5 text-xs font-bold rounded-full border ${
              payment.paymentStatus === 'FAILED'
                ? 'bg-rose-100 text-rose-700 border-rose-200'
                : payment.paymentStatus === 'SUCCESS'
                ? 'bg-emerald-100 text-emerald-700 border-emerald-200'
                : 'bg-amber-100 text-amber-700 border-amber-200'
            }`}>
              {payment.paymentStatus === 'FAILED' ? '! Payment Failed' : payment.paymentStatus === 'SUCCESS' ? '✓ Payment Successful' : '● Payment Pending'}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-xs">
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-1">
              <div className="text-slate-500 flex items-center gap-1.5 font-medium">
                <Building2 className="w-4 h-4 text-purple-600" /> Merchant
              </div>
              <div className="text-sm font-bold text-slate-900 font-heading">{payment.merchant?.name}</div>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-1">
              <div className="text-slate-500 flex items-center gap-1.5 font-medium">
                <User className="w-4 h-4 text-blue-600" /> Customer
              </div>
              <div className="text-sm font-bold text-slate-900 font-heading">{payment.customer?.name}</div>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-1">
              <div className="text-slate-500 flex items-center gap-1.5 font-medium">
                <Clock className="w-4 h-4 text-indigo-600" /> Date & Time
              </div>
              <div className="text-xs font-bold text-slate-900">
                {new Date(payment.createdAt).toLocaleString('en-IN', {
                  dateStyle: 'medium',
                  timeStyle: 'short',
                })}
              </div>
            </div>
          </div>

          <div className="space-y-3 pt-2">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider font-mono">Verification States</h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between">
                <div>
                  <div className="text-slate-500 text-[11px]">Bank Debit</div>
                  <div className="font-bold text-slate-900 mt-0.5">{payment.bankDebitStatus}</div>
                </div>
                {payment.bankDebitStatus === 'DEBITED' ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                ) : (
                  <XCircle className="w-5 h-5 text-slate-400" />
                )}
              </div>

              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between">
                <div>
                  <div className="text-slate-500 text-[11px]">Merchant Receipt</div>
                  <div className="font-bold text-slate-900 mt-0.5">{payment.merchantStatus}</div>
                </div>
                {payment.merchantStatus === 'NOT_CONFIRMED' ? (
                  <XCircle className="w-5 h-5 text-rose-600" />
                ) : (
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                )}
              </div>

              <div className="p-4 bg-purple-50 rounded-2xl border border-purple-200 flex items-center justify-between">
                <div>
                  <div className="text-purple-700 text-[11px] font-medium">Resolution Case</div>
                  <div className="font-bold text-purple-900 mt-0.5">
                    {isFailedDebited ? 'IN PROGRESS' : 'RESOLVED'}
                  </div>
                </div>
                <Sparkles className="w-5 h-5 text-purple-600" />
              </div>
            </div>
          </div>

          <div className="space-y-3 pt-2">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2 font-mono">
              <FileText className="w-4 h-4 text-blue-600" /> Payment Identifiers
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
                <span className="text-slate-500">Merchant Order ID</span>
                <span className="text-purple-900 font-bold">{payment.orderId}</span>
              </div>
            </div>
          </div>

        </div>

      </main>
    </div>
  );
}
