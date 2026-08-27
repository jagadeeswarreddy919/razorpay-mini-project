'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Logo } from '@/components/logo';
import {
  ArrowLeft,
  Building2,
  CheckCircle2,
  Clock,
  IndianRupee,
  Loader2,
  RefreshCw,
  ShoppingBag,
  XCircle,
  FileText,
} from 'lucide-react';

interface MerchantMetrics {
  totalPayments: number;
  totalVolume: number;
  successfulCount: number;
  failedCount: number;
  pendingCount: number;
  refundedCount: number;
}

interface TransactionItem {
  id: string;
  amount: number;
  currency: string;
  paymentStatus: string;
  bankDebitStatus: string;
  merchantStatus: string;
  utr: string | null;
  orderId: string | null;
  createdAt: string;
  complaint: {
    acknowledgementNumber: string;
    status: string;
  } | null;
}

export default function MerchantPortalPage() {
  const router = useRouter();
  const [selectedMerchant, setSelectedMerchant] = useState<string>('Apollo Emergency Medicine');
  const [merchantName, setMerchantName] = useState<string>('');
  const [metrics, setMetrics] = useState<MerchantMetrics | null>(null);
  const [transactions, setTransactions] = useState<TransactionItem[]>([]);
  const [loading, setLoading] = useState(true);

  const loadMerchantData = async (mName: string) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/merchant/dashboard?merchant=${encodeURIComponent(mName)}`);
      const json = await res.json();
      if (json.success) {
        setMerchantName(json.data.merchant.name);
        setMetrics(json.data.metrics);
        setTransactions(json.data.transactions);
      }
    } catch (err) {
      console.error('Error loading merchant dashboard:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMerchantData(selectedMerchant);
  }, [selectedMerchant]);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans selection:bg-purple-600 selection:text-white">
      {/* Disclaimer Banner */}
      <div className="bg-slate-900 text-slate-300 text-[11px] font-mono px-4 py-1.5 text-center flex items-center justify-center gap-2 border-b border-slate-800">
        <span className="px-2 py-0.5 bg-purple-500/20 text-purple-300 rounded font-bold uppercase tracking-wider text-[10px]">
          DEMO ENVIRONMENT
        </span>
        <span>ResolveX Merchant Resolution Portal • Payment & Settlement States are Simulated</span>
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
            <span className="hidden sm:inline-block px-2.5 py-1 text-[10px] font-bold text-purple-800 bg-purple-100 rounded-full border border-purple-200 uppercase tracking-wider font-mono">
              MERCHANT PORTAL
            </span>
          </div>

          {/* Merchant Switcher Chips */}
          <div className="flex items-center gap-2">
            {['Apollo Emergency Medicine', 'Blinkit', 'Zomato'].map((m) => (
              <button
                key={m}
                onClick={() => setSelectedMerchant(m)}
                className={`px-3 py-1.5 text-xs font-bold rounded-full transition-all ${
                  selectedMerchant === m
                    ? 'bg-purple-600 text-white shadow'
                    : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200'
                }`}
              >
                {m}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 flex-1 w-full">
        
        {/* Title */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-purple-700 uppercase tracking-wider font-mono">
              <Building2 className="w-4 h-4 text-purple-600" /> Merchant Account Overview
            </div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight font-heading mt-1">
              {merchantName}
            </h1>
          </div>
        </div>

        {/* Merchant Metrics Grid */}
        {metrics && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
            <div className="p-4 bg-white rounded-3xl border border-slate-200 shadow-sm space-y-1">
              <div className="text-slate-500 text-[11px] font-mono flex items-center gap-1">
                <ShoppingBag className="w-3.5 h-3.5 text-purple-600" /> Total Orders
              </div>
              <div className="text-2xl font-black text-slate-900 font-heading">{metrics.totalPayments}</div>
              <div className="text-[10px] text-slate-500">Gross Volume: ₹{metrics.totalVolume.toLocaleString()}</div>
            </div>

            <div className="p-4 bg-emerald-50 rounded-3xl border border-emerald-200 shadow-sm space-y-1">
              <div className="text-emerald-800 text-[11px] font-mono flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Confirmed Payments
              </div>
              <div className="text-2xl font-black text-emerald-900 font-heading">{metrics.successfulCount}</div>
              <div className="text-[10px] text-emerald-700">Settled to Merchant Bank</div>
            </div>

            <div className="p-4 bg-rose-50 rounded-3xl border border-rose-200 shadow-sm space-y-1">
              <div className="text-rose-800 text-[11px] font-mono flex items-center gap-1">
                <XCircle className="w-3.5 h-3.5 text-rose-600" /> Failed / Debited Disputes
              </div>
              <div className="text-2xl font-black text-rose-900 font-heading">{metrics.failedCount}</div>
              <div className="text-[10px] text-rose-700">Under ResolveX Auto-Reconciliation</div>
            </div>

            <div className="p-4 bg-purple-50 rounded-3xl border border-purple-200 shadow-sm space-y-1">
              <div className="text-purple-800 text-[11px] font-mono flex items-center gap-1">
                <IndianRupee className="w-3.5 h-3.5 text-purple-600" /> Auto-Refunded Volume
              </div>
              <div className="text-2xl font-black text-purple-900 font-heading">{metrics.refundedCount}</div>
              <div className="text-[10px] text-purple-700">Reversed via UPI Auto-Reversal</div>
            </div>
          </div>
        )}

        {/* Merchant Transaction Table */}
        <div className="bg-white border border-slate-200/90 rounded-3xl overflow-hidden shadow-xl">
          <div className="p-6 border-b border-slate-100 flex justify-between items-center">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2 font-heading">
              <FileText className="w-5 h-5 text-purple-600" /> Merchant Transaction Ledger & Disputed Orders
            </h3>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 uppercase tracking-wider font-bold border-b border-slate-200 font-mono">
                <tr>
                  <th className="px-6 py-4">Order ID & UTR</th>
                  <th className="px-6 py-4">Amount</th>
                  <th className="px-6 py-4">Gateway Status</th>
                  <th className="px-6 py-4">Customer Bank Debit</th>
                  <th className="px-6 py-4">Merchant Confirmation</th>
                  <th className="px-6 py-4">ResolveX Case</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {loading ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-slate-500">
                      <Loader2 className="w-8 h-8 text-purple-600 animate-spin mx-auto mb-2" />
                      Loading Merchant Ledger...
                    </td>
                  </tr>
                ) : transactions.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-slate-500">
                      No transaction records found for this merchant.
                    </td>
                  </tr>
                ) : (
                  transactions.map((tx) => (
                    <tr key={tx.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-mono font-bold text-slate-900">{tx.orderId || 'N/A'}</div>
                        <div className="text-[10px] text-slate-400 font-mono">UTR: {tx.utr || 'N/A'}</div>
                      </td>
                      <td className="px-6 py-4 font-bold text-slate-900 font-heading">₹{tx.amount.toLocaleString()}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${
                          tx.paymentStatus === 'SUCCESS'
                            ? 'bg-emerald-100 text-emerald-800 border-emerald-200'
                            : tx.paymentStatus === 'FAILED'
                            ? 'bg-rose-100 text-rose-800 border-rose-200'
                            : 'bg-amber-100 text-amber-800 border-amber-200'
                        }`}>
                          {tx.paymentStatus}
                        </span>
                      </td>
                      <td className="px-6 py-4 font-mono font-semibold text-slate-700">
                        {tx.bankDebitStatus}
                      </td>
                      <td className="px-6 py-4 font-mono font-semibold text-slate-700">
                        {tx.merchantStatus}
                      </td>
                      <td className="px-6 py-4">
                        {tx.complaint ? (
                          <div className="space-y-0.5">
                            <span className="font-mono font-bold text-purple-700 block">{tx.complaint.acknowledgementNumber}</span>
                            <span className="text-[10px] text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200 inline-block font-mono">
                              STATUS: {tx.complaint.status}
                            </span>
                          </div>
                        ) : (
                          <span className="text-slate-400 italic">No Dispute Filed</span>
                        )}
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
