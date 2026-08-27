'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Logo } from '@/components/logo';
import { Payment } from '@/types/payment';
import {
  ShieldAlert,
  Search,
  LogOut,
  Building2,
  CheckCircle2,
  XCircle,
  Clock,
  AlertTriangle,
  ArrowRight,
  ArrowLeft,
  Loader2,
  FileText,
  HelpCircle,
  Sparkles,
} from 'lucide-react';

export default function CustomerDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<{ name: string; phoneNumber: string } | null>(null);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Lookup fallback state
  const [lookupQuery, setLookupQuery] = useState('');
  const [lookupLoading, setLookupLoading] = useState(false);
  const [lookupResult, setLookupResult] = useState<Payment | null>(null);
  const [lookupError, setLookupError] = useState<string | null>(null);

  useEffect(() => {
    async function loadSessionAndPayments() {
      try {
        // 1. Fetch Auth Session
        const authRes = await fetch('/api/auth/me');
        const authJson = await authRes.json();

        if (!authJson.success || !authJson.user) {
          router.push('/login');
          return;
        }

        setUser(authJson.user);

        // 2. Fetch Recent 10 Transactions
        const payRes = await fetch('/api/payments/recent');
        const payJson = await payRes.json();

        if (payJson.success) {
          setPayments(payJson.data);
        } else {
          setError(payJson.error?.message || 'Failed to load payments.');
        }
      } catch (err) {
        setError('Network error while connecting to ResolveX server.');
      } finally {
        setLoading(false);
      }
    }

    loadSessionAndPayments();
  }, [router]);

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/login');
  };

  const handleLookup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!lookupQuery.trim()) return;

    setLookupLoading(true);
    setLookupError(null);
    setLookupResult(null);

    try {
      const res = await fetch(`/api/payments/lookup?identifier=${encodeURIComponent(lookupQuery.trim())}`);
      const json = await res.json();

      if (json.success) {
        setLookupResult(json.data);
      } else {
        setLookupError(json.error?.message || 'Payment not found');
      }
    } catch (err) {
      setLookupError('Network error during lookup');
    } finally {
      setLookupLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col justify-center items-center p-6 space-y-4 font-sans">
        <Loader2 className="w-10 h-10 text-purple-600 animate-spin" />
        <p className="text-sm font-semibold text-slate-600">Loading Payment Resolution Center...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans selection:bg-purple-600 selection:text-white">
      {/* Header Bar */}
      <header className="sticky top-0 z-50 backdrop-blur-md bg-white/85 border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-4">
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
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden sm:block text-right">
              <div className="text-xs font-bold text-slate-900 font-heading">Welcome back, {user?.name || 'Rahul Sharma'}</div>
              <div className="text-[11px] font-mono text-slate-500">{user?.phoneNumber}</div>
            </div>
            <button
              onClick={handleLogout}
              className="px-4 py-2 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-full flex items-center gap-2 transition-all shadow-sm"
            >
              <LogOut className="w-3.5 h-3.5 text-slate-400" />
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main Resolution Center Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10 flex-1 w-full">
        
        {/* Title Banner */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-200">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-100 border border-purple-200 text-purple-700 text-xs font-bold uppercase tracking-wider mb-2 font-mono">
              <ShieldAlert className="w-4 h-4 text-purple-600" />
              Authenticated Resolution Desk
            </div>
            <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight font-heading">
              Payment Resolution Center
            </h1>
            <p className="text-xs md:text-sm text-slate-600 mt-1">
              Select a transaction to inspect verification states or track resolution case progress.
            </p>
          </div>
          <span className="px-3.5 py-1.5 text-xs font-mono font-bold text-emerald-700 bg-emerald-100 border border-emerald-200 rounded-full w-fit">
            ✓ Session Verified
          </span>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl text-rose-700 text-xs flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 text-rose-500 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Recent 10 Transactions Grid */}
        <section className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-extrabold text-slate-900 font-heading">Your Recent Payments</h2>
            <span className="text-xs text-slate-500 font-medium">Showing latest 10 transactions</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {payments.map((pay) => {
              const isFailedDebited = pay.paymentStatus === 'FAILED' && pay.bankDebitStatus === 'DEBITED';

              return (
                <div
                  key={pay.id}
                  className={`bg-white border rounded-3xl p-6 transition-all space-y-4 flex flex-col justify-between shadow-sm hover:shadow-md ${
                    isFailedDebited
                      ? 'border-rose-300 bg-gradient-to-br from-white via-white to-rose-50/50'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  {/* Top Bar */}
                  <div className="space-y-3">
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-3">
                        <div className="p-2.5 bg-slate-50 rounded-2xl border border-slate-200 text-purple-600">
                          <Building2 className="w-5 h-5" />
                        </div>
                        <div>
                          <h3 className="text-base font-bold text-slate-900 font-heading">{pay.merchant?.name || 'Merchant'}</h3>
                          <p className="text-[11px] text-slate-500 font-mono">
                            {new Date(pay.createdAt).toLocaleDateString('en-IN', {
                              day: '2-digit',
                              month: 'short',
                              year: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-xl font-black text-slate-900 font-heading">₹{pay.amount.toLocaleString()}</div>
                        <div className="text-[10px] text-slate-500 uppercase font-mono">{pay.currency}</div>
                      </div>
                    </div>

                    {/* Status Pills */}
                    <div className="flex flex-wrap items-center gap-2 text-xs pt-1">
                      {/* Payment Status */}
                      <span className={`px-2.5 py-1 text-[10px] font-bold rounded-lg border ${
                        pay.paymentStatus === 'FAILED'
                          ? 'bg-rose-100 text-rose-700 border-rose-200'
                          : pay.paymentStatus === 'SUCCESS'
                          ? 'bg-emerald-100 text-emerald-700 border-emerald-200'
                          : 'bg-amber-100 text-amber-700 border-amber-200'
                      }`}>
                        PAYMENT: {pay.paymentStatus}
                      </span>

                      {/* Bank Debit Status */}
                      <span className={`px-2.5 py-1 text-[10px] font-bold rounded-lg border ${
                        pay.bankDebitStatus === 'DEBITED'
                          ? 'bg-emerald-100 text-emerald-700 border-emerald-200'
                          : 'bg-slate-100 text-slate-600 border-slate-200'
                      }`}>
                        BANK: {pay.bankDebitStatus}
                      </span>

                      {/* Resolution Badge */}
                      <span className={`px-2.5 py-1 text-[10px] font-bold rounded-lg border ${
                        isFailedDebited
                          ? 'bg-rose-100 text-rose-800 border-rose-300 animate-pulse'
                          : pay.paymentStatus === 'SUCCESS'
                          ? 'bg-emerald-100 text-emerald-800 border-emerald-200'
                          : 'bg-amber-100 text-amber-800 border-amber-200'
                      }`}>
                        RESOLUTION: {isFailedDebited ? 'ACTION REQUIRED' : pay.paymentStatus === 'SUCCESS' ? 'CONFIRMED' : 'MONITORING'}
                      </span>
                    </div>

                    {/* Critical FAILED + DEBITED Alert Box */}
                    {isFailedDebited && (
                      <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-2xl text-amber-900 text-xs space-y-1">
                        <div className="font-bold text-amber-900 flex items-center gap-1.5 font-heading">
                          <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0" />
                          Payment failed, but your bank account was debited.
                        </div>
                        <p className="text-[11px] text-amber-800">
                          <strong>Don't pay again yet.</strong> Resolution case ACK: RX-2026-001847 is investigating settlement.
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Card Action */}
                  <div className="pt-2">
                    <button
                      onClick={() => router.push(`/customer/transactions/${pay.id}`)}
                      className="w-full py-2.5 text-xs font-bold text-white bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 rounded-full flex items-center justify-center gap-2 transition-all shadow-md hover:scale-[1.02]"
                    >
                      View Payment Details
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Fallback Search Section: "Can't find your payment?" */}
        <section className="bg-white border border-slate-200/90 rounded-3xl p-6 md:p-8 space-y-6 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl border border-blue-100">
              <Search className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900 font-heading">Can't find your payment?</h3>
              <p className="text-xs text-slate-500">Search using your Bank UTR, ResolveX transaction ID, Payment ID, or Order ID.</p>
            </div>
          </div>

          <form onSubmit={handleLookup} className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              value={lookupQuery}
              onChange={(e) => setLookupQuery(e.target.value)}
              placeholder="Enter UTR (e.g. 123456789012), Payment ID (pay_demo_1001), or Order ID"
              className="flex-1 px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 font-mono text-xs focus:outline-none focus:border-purple-500 transition-all"
            />
            <button
              type="submit"
              disabled={lookupLoading || !lookupQuery.trim()}
              className="px-6 py-3 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-bold text-xs rounded-full shadow-md flex items-center justify-center gap-2 transition-all disabled:opacity-50 hover:scale-105"
            >
              {lookupLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
              Find Payment
            </button>
          </form>

          {/* Lookup Result Box */}
          {lookupResult && (
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-slate-900 font-heading">Matched Transaction Found</span>
                <span className="text-xs font-mono text-purple-700 font-bold">₹{lookupResult.amount.toLocaleString()}</span>
              </div>
              <p className="text-xs text-slate-600">Merchant: {lookupResult.merchant?.name} • Status: {lookupResult.paymentStatus}</p>
              <button
                onClick={() => router.push(`/customer/transactions/${lookupResult.id}`)}
                className="px-4 py-2 text-xs font-bold bg-purple-600 text-white rounded-full hover:bg-purple-500 transition-all"
              >
                View Matched Payment →
              </button>
            </div>
          )}

          {/* Lookup Error Box: "Payment Not Found" */}
          {lookupError && (
            <div className="p-5 bg-slate-50 border border-slate-200 rounded-2xl space-y-4">
              <div className="flex items-start gap-3 text-rose-600">
                <XCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-bold text-rose-800 font-heading">Payment Not Found</h4>
                  <p className="text-xs text-slate-600 mt-0.5">
                    We couldn't find a matching payment for the provided identifier. Check your UTR or Payment ID and try again.
                  </p>
                </div>
              </div>

              <div className="flex gap-3 pt-1">
                <button
                  onClick={() => {
                    setLookupError(null);
                    setLookupQuery('');
                  }}
                  className="px-4 py-2 text-xs font-bold bg-white border border-slate-200 text-slate-700 rounded-full hover:bg-slate-50 shadow-sm"
                >
                  Try Again
                </button>
                <button
                  onClick={() => alert('Support assistance connected for payment lookup.')}
                  className="px-4 py-2 text-xs font-bold bg-purple-100 text-purple-700 border border-purple-200 rounded-full hover:bg-purple-200"
                >
                  Contact Support
                </button>
              </div>
            </div>
          )}
        </section>

      </main>
    </div>
  );
}
