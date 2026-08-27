'use client';

import React, { useState, useEffect } from 'react';
import { Search, Loader2, CheckCircle2, XCircle, AlertTriangle, ShieldCheck, ArrowRight, RefreshCw, FileText, Building2, User, Sparkles } from 'lucide-react';
import { Payment } from '@/types/payment';

interface PaymentLookupWidgetProps {
  initialIdentifier?: string;
  onClose?: () => void;
}

export const PaymentLookupWidget: React.FC<PaymentLookupWidgetProps> = ({
  initialIdentifier = '',
  onClose,
}) => {
  const [identifier, setIdentifier] = useState(initialIdentifier);
  const [loading, setLoading] = useState(false);
  const [payment, setPayment] = useState<Payment | null>(null);
  const [error, setError] = useState<{ code: string; message: string } | null>(null);
  const [searched, setSearched] = useState(false);

  const fetchPayment = async (queryId: string) => {
    if (!queryId.trim()) return;
    setLoading(true);
    setError(null);
    setPayment(null);
    setSearched(true);

    try {
      const res = await fetch(`/api/payments/lookup?identifier=${encodeURIComponent(queryId.trim())}`);
      const json = await res.json();

      if (json.success) {
        setPayment(json.data);
      } else {
        setError(json.error || { code: 'NOT_FOUND', message: 'No payment found' });
      }
    } catch (err) {
      setError({
        code: 'NETWORK_ERROR',
        message: 'Failed to connect to ResolveX verification server.',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (initialIdentifier) {
      setIdentifier(initialIdentifier);
      fetchPayment(initialIdentifier);
    }
  }, [initialIdentifier]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchPayment(identifier);
  };

  const handleQuickDemo = (demoId: string) => {
    setIdentifier(demoId);
    fetchPayment(demoId);
  };

  return (
    <div className="w-full bg-white border border-slate-200/90 rounded-3xl p-6 md:p-8 shadow-xl space-y-6">
      {/* Widget Title */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl border border-blue-100">
            <Search className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xl font-extrabold text-slate-900 font-heading">Live Payment Verification & Tracking</h3>
            <p className="text-xs text-slate-500">Search using UTR, Razorpay Payment ID, or Order ID</p>
          </div>
        </div>
        {onClose && (
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700 p-2 rounded-lg bg-slate-100">
            ✕
          </button>
        )}
      </div>

      {/* Search Input Form */}
      <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <input
            type="text"
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            placeholder="Enter UTR (e.g. 123456789012), Payment ID (pay_demo_1001), or Order ID"
            className="w-full px-4 py-3.5 pl-11 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 font-mono text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
          />
          <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-4" />
        </div>
        <button
          type="submit"
          disabled={loading || !identifier.trim()}
          className="px-6 py-3.5 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 disabled:opacity-50 text-white font-bold text-sm rounded-xl shadow-lg shadow-blue-500/20 border border-blue-400/30 flex items-center justify-center gap-2 transition-all hover:scale-105"
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
          Investigate
        </button>
      </form>

      {/* Quick Demo Chips */}
      <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-slate-100">
        <span className="text-xs text-slate-500 font-medium">Quick Demo Inputs:</span>
        <button
          type="button"
          onClick={() => handleQuickDemo('123456789012')}
          className="px-2.5 py-1 text-xs font-mono bg-rose-50 text-rose-600 border border-rose-200 rounded-lg hover:bg-rose-100 transition-all flex items-center gap-1.5 font-bold"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
          ₹10k Failed (UTR: 123456789012)
        </button>
        <button
          type="button"
          onClick={() => handleQuickDemo('pay_demo_1001')}
          className="px-2.5 py-1 text-xs font-mono bg-blue-50 text-blue-600 border border-blue-200 rounded-lg hover:bg-blue-100 transition-all font-semibold"
        >
          pay_demo_1001
        </button>
        <button
          type="button"
          onClick={() => handleQuickDemo('order_demo_1001')}
          className="px-2.5 py-1 text-xs font-mono bg-purple-50 text-purple-600 border border-purple-200 rounded-lg hover:bg-purple-100 transition-all font-semibold"
        >
          order_demo_1001
        </button>
      </div>

      {/* Results Section */}
      {loading && (
        <div className="py-12 flex flex-col items-center justify-center text-center space-y-3 bg-slate-50 rounded-2xl border border-slate-200">
          <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
          <p className="text-sm font-semibold text-slate-700">Investigating transaction flow across banking network...</p>
        </div>
      )}

      {error && !loading && (
        <div className="p-5 bg-rose-50 border border-rose-200 rounded-2xl text-rose-700 flex items-start gap-3">
          <XCircle className="w-5 h-5 text-rose-500 flex-shrink-0 mt-0.5" />
          <div>
            <div className="font-bold text-rose-900">{error.code}</div>
            <p className="text-xs text-rose-700 mt-0.5">{error.message}</p>
          </div>
        </div>
      )}

      {payment && !loading && (
        <div className="bg-slate-50 rounded-2xl border border-slate-200 p-6 space-y-6 animate-in fade-in-50 duration-300">
          {/* Header Badge */}
          <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-200">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Transaction Investigation Result</span>
              <div className="flex items-center gap-3 mt-1">
                <span className="text-2xl font-black text-slate-900 font-heading">₹{payment.amount.toLocaleString()}</span>
                <span className="text-xs text-slate-500 font-medium">({payment.currency})</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className={`px-3 py-1 text-xs font-bold rounded-lg border ${
                payment.paymentStatus === 'FAILED'
                  ? 'bg-rose-100 text-rose-700 border-rose-200'
                  : payment.paymentStatus === 'SUCCESS'
                  ? 'bg-emerald-100 text-emerald-700 border-emerald-200'
                  : 'bg-amber-100 text-amber-700 border-amber-200'
              }`}>
                PAYMENT STATUS: {payment.paymentStatus}
              </span>
            </div>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-xs">
            <div className="p-3.5 bg-white rounded-xl border border-slate-200 shadow-sm">
              <div className="text-slate-500 flex items-center gap-1.5 mb-1 font-semibold">
                <User className="w-3.5 h-3.5 text-blue-600" /> Customer
              </div>
              <div className="font-bold text-slate-900">{payment.customer?.name || 'Rahul Sharma'}</div>
              <div className="text-[11px] text-slate-500">{payment.customer?.phoneNumber}</div>
            </div>

            <div className="p-3.5 bg-white rounded-xl border border-slate-200 shadow-sm">
              <div className="text-slate-500 flex items-center gap-1.5 mb-1 font-semibold">
                <Building2 className="w-3.5 h-3.5 text-purple-600" /> Merchant
              </div>
              <div className="font-bold text-slate-900">{payment.merchant?.name || 'Apollo Emergency Medicine'}</div>
            </div>

            <div className="p-3.5 bg-white rounded-xl border border-slate-200 shadow-sm">
              <div className="text-slate-500 flex items-center gap-1.5 mb-1 font-semibold">
                <FileText className="w-3.5 h-3.5 text-indigo-600" /> Identifiers
              </div>
              <div className="font-mono text-slate-800 font-bold">UTR: {payment.utr || 'N/A'}</div>
              <div className="font-mono text-slate-500 text-[11px]">PayID: {payment.razorpayPaymentId}</div>
            </div>
          </div>

          {/* Verification States */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="p-3.5 bg-white rounded-xl border border-slate-200 flex items-center justify-between shadow-sm">
              <div>
                <div className="text-[11px] text-slate-500 font-medium">Bank Debit</div>
                <div className="text-xs font-bold text-slate-900 mt-0.5">{payment.bankDebitStatus}</div>
              </div>
              {payment.bankDebitStatus === 'DEBITED' ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              ) : (
                <AlertTriangle className="w-5 h-5 text-amber-600" />
              )}
            </div>

            <div className="p-3.5 bg-white rounded-xl border border-slate-200 flex items-center justify-between shadow-sm">
              <div>
                <div className="text-[11px] text-slate-500 font-medium">Merchant Receipt</div>
                <div className="text-xs font-bold text-slate-900 mt-0.5">{payment.merchantStatus}</div>
              </div>
              {payment.merchantStatus === 'NOT_CONFIRMED' ? (
                <XCircle className="w-5 h-5 text-rose-600" />
              ) : (
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              )}
            </div>

            <div className="p-3.5 bg-purple-50 rounded-xl border border-purple-200 flex items-center justify-between shadow-sm">
              <div>
                <div className="text-[11px] text-purple-700 font-medium">Resolution Case</div>
                <div className="text-xs font-bold text-purple-900 mt-0.5">
                  {payment.paymentStatus === 'FAILED' && payment.bankDebitStatus === 'DEBITED'
                    ? 'IN PROGRESS (ACK: RX-2026-001847)'
                    : 'RESOLVED'}
                </div>
              </div>
              <Sparkles className="w-5 h-5 text-purple-600" />
            </div>
          </div>

          {/* Action Footer */}
          {payment.paymentStatus === 'FAILED' && payment.bankDebitStatus === 'DEBITED' && (
            <div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border border-purple-200 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="flex items-center gap-2 text-xs text-slate-800 font-medium">
                <ShieldCheck className="w-4 h-4 text-purple-600 flex-shrink-0" />
                <span>Automatic Resolution Case <strong>ACK: RX-2026-001847</strong> generated.</span>
              </div>
              <a
                href="/login"
                className="w-full sm:w-auto px-4 py-2 text-xs font-bold bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-all shadow-sm text-center"
              >
                Track Case Progress →
              </a>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
