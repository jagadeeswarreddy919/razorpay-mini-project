'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Logo } from '@/components/logo';
import { ShieldCheck, ArrowRight, ArrowLeft, Loader2, Smartphone, KeyRound, AlertCircle, RefreshCw, CheckCircle2 } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();

  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [phoneNumber, setPhoneNumber] = useState('9876543210'); // Default demo phone number
  const [otp, setOtp] = useState(['1', '2', '3', '4', '5', '6']); // Pre-filled with 123456 demo OTP for fast testing
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Resend cooldown timer
  const [cooldown, setCooldown] = useState(0);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (cooldown > 0) {
      timer = setInterval(() => setCooldown((prev) => prev - 1), 1000);
    }
    return () => clearInterval(timer);
  }, [cooldown]);

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phoneNumber }),
      });

      const json = await res.json();

      if (json.success) {
        setStep('otp');
        setCooldown(30);
        setSuccessMsg(json.message);
      } else {
        setError(json.error?.message || 'Enter a valid 10-digit mobile number.');
      }
    } catch (err) {
      setError('Network error. Failed to send verification code.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const fullOtp = otp.join('');

    try {
      const res = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phoneNumber, otp: fullOtp }),
      });

      const json = await res.json();

      if (json.success) {
        router.push('/customer');
      } else {
        setError(json.error?.message || 'Invalid OTP code. Please use demo code 123456.');
      }
    } catch (err) {
      setError('Network error. Failed to verify OTP.');
    } finally {
      setLoading(false);
    }
  };

  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);

    // Auto-advance input focus
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-input-${index + 1}`);
      if (nextInput) nextInput.focus();
    }
  };

  const handleResendOtp = async () => {
    if (cooldown > 0) return;
    setError(null);
    setLoading(true);
    try {
      const res = await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phoneNumber }),
      });
      const json = await res.json();
      if (json.success) {
        setCooldown(30);
        setSuccessMsg('New verification code sent successfully.');
      }
    } catch (err) {
      setError('Failed to resend code.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col justify-between items-center p-4 sm:p-6 relative selection:bg-purple-600 selection:text-white font-sans">
      
      {/* Top Header with Back to Home Button */}
      <header className="w-full max-w-5xl flex justify-between items-center py-4">
        <a href="/">
          <Logo showTagline={false} />
        </a>
        <button
          onClick={() => router.push('/')}
          className="px-4 py-2 text-xs font-bold text-slate-700 bg-white hover:bg-slate-100 border border-slate-200 rounded-full shadow-sm flex items-center gap-2 transition-all hover:scale-105"
        >
          <ArrowLeft className="w-4 h-4 text-purple-600" />
          Back to Home
        </button>
      </header>

      {/* Glow Background Orbs */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-full max-w-lg h-96 pastel-orb-purple rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute top-1/3 right-10 w-80 h-80 pastel-orb-blue rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="w-full max-w-md space-y-6 my-auto">
        
        {/* Logo Header Badge */}
        <div className="flex flex-col items-center text-center space-y-2">
          <span className="px-3.5 py-1 text-[10px] font-extrabold tracking-widest text-purple-700 bg-purple-100 border border-purple-200 rounded-full uppercase">
            ResolveX Prototype • Demo Auth
          </span>
        </div>

        {/* Auth Box Container */}
        <div className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
          
          {step === 'phone' ? (
            <div className="space-y-6 animate-in fade-in-50 duration-300">
              <div className="space-y-2 text-center">
                <h1 className="text-2xl font-black text-slate-900 tracking-tight font-heading">
                  Track Your Payment Securely
                </h1>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Enter the mobile number used for your payment to securely access your recent transactions.
                </p>
              </div>

              {error && (
                <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-500 flex-shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <form onSubmit={handleSendOtp} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">Mobile Number</label>
                  <div className="flex items-center rounded-xl bg-slate-50 border border-slate-200 focus-within:border-purple-500 focus-within:ring-1 focus-within:ring-purple-500 transition-all overflow-hidden">
                    <span className="px-4 text-sm font-bold text-slate-500 border-r border-slate-200 bg-slate-100 py-3">
                      +91
                    </span>
                    <input
                      type="text"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      placeholder="9876543210"
                      className="w-full bg-transparent px-4 py-3 text-sm font-mono font-bold text-slate-900 placeholder-slate-400 focus:outline-none"
                    />
                  </div>
                  {/* 1-Click Demo Customer Selector Chips */}
                  <div className="space-y-1.5 pt-1">
                    <label className="text-[11px] font-bold text-slate-500 uppercase font-mono">1-Click Quick Login Demo Profiles:</label>
                    <div className="grid grid-cols-1 gap-1.5">
                      <button
                        type="button"
                        onClick={() => setPhoneNumber('9876543210')}
                        className={`px-3 py-2 text-left rounded-xl border text-xs transition-all flex items-center justify-between ${
                          phoneNumber === '9876543210'
                            ? 'bg-purple-50 border-purple-300 text-purple-900 font-bold shadow-sm'
                            : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                        }`}
                      >
                        <div>
                          <strong className="font-heading">Rahul Sharma</strong> (9876543210)
                          <div className="text-[10px] text-rose-600 font-normal">Dispute: ₹10,000 Failed + Debited</div>
                        </div>
                        <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-rose-100 text-rose-800">FAILED</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setPhoneNumber('9876543211')}
                        className={`px-3 py-2 text-left rounded-xl border text-xs transition-all flex items-center justify-between ${
                          phoneNumber === '9876543211'
                            ? 'bg-purple-50 border-purple-300 text-purple-900 font-bold shadow-sm'
                            : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                        }`}
                      >
                        <div>
                          <strong className="font-heading">Priya Patel</strong> (9876543211)
                          <div className="text-[10px] text-amber-600 font-normal">Dispute: ₹4,500 Pending Gateway Delay</div>
                        </div>
                        <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800">PENDING</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setPhoneNumber('9876543212')}
                        className={`px-3 py-2 text-left rounded-xl border text-xs transition-all flex items-center justify-between ${
                          phoneNumber === '9876543212'
                            ? 'bg-purple-50 border-purple-300 text-purple-900 font-bold shadow-sm'
                            : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                        }`}
                      >
                        <div>
                          <strong className="font-heading">Ananya Rao</strong> (9876543212)
                          <div className="text-[10px] text-emerald-600 font-normal">Clean Transaction: ₹2,499 Success</div>
                        </div>
                        <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">SUCCESS</span>
                      </button>
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading || !phoneNumber.trim()}
                  className="w-full py-3.5 text-xs font-bold text-white bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 rounded-full shadow-lg border border-blue-400/30 flex items-center justify-center gap-2 transition-all disabled:opacity-50 hover:scale-105"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Sending verification code...
                    </>
                  ) : (
                    <>
                      Send OTP
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            </div>
          ) : (
            <div className="space-y-6 animate-in fade-in-50 duration-300">
              <div className="space-y-2 text-center">
                <h1 className="text-2xl font-black text-slate-900 tracking-tight font-heading">
                  Verify Your Mobile Number
                </h1>
                <p className="text-xs text-slate-500">
                  We've sent a one-time verification code to <strong className="text-slate-900">+{phoneNumber}</strong>
                </p>
              </div>

              {/* Demo Mode Badge */}
              <div className="p-3 bg-purple-50 border border-purple-200 rounded-xl text-center text-xs text-purple-700 font-semibold flex items-center justify-center gap-2">
                <KeyRound className="w-4 h-4 text-purple-600" />
                <span>DEMO OTP CODE: <strong className="font-mono text-purple-900 font-bold">123456</strong></span>
              </div>

              {error && (
                <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-500 flex-shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <form onSubmit={handleVerifyOtp} className="space-y-6">
                {/* 6 Digit OTP Inputs */}
                <div className="flex justify-between items-center gap-2">
                  {otp.map((digit, idx) => (
                    <input
                      key={idx}
                      id={`otp-input-${idx}`}
                      type="text"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleOtpChange(idx, e.target.value)}
                      className="w-11 h-13 text-center text-lg font-mono font-bold text-slate-900 bg-slate-50 border border-slate-200 rounded-xl focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500 transition-all"
                    />
                  ))}
                </div>

                <button
                  type="submit"
                  disabled={loading || otp.join('').length !== 6}
                  className="w-full py-3.5 text-xs font-bold text-white bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 rounded-full shadow-lg border border-blue-400/30 flex items-center justify-center gap-2 transition-all disabled:opacity-50 hover:scale-105"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Verifying...
                    </>
                  ) : (
                    <>
                      Verify OTP
                      <CheckCircle2 className="w-4 h-4 text-emerald-300" />
                    </>
                  )}
                </button>
              </form>

              <div className="text-center pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                <button
                  type="button"
                  onClick={() => setStep('phone')}
                  className="text-slate-500 hover:text-slate-900 transition-colors font-medium flex items-center gap-1"
                >
                  <ArrowLeft className="w-3.5 h-3.5" /> Change number
                </button>
                <button
                  type="button"
                  onClick={handleResendOtp}
                  disabled={cooldown > 0 || loading}
                  className="text-purple-600 hover:text-purple-700 disabled:text-slate-400 transition-colors font-bold"
                >
                  {cooldown > 0 ? `Resend OTP in ${cooldown}s` : 'Resend OTP'}
                </button>
              </div>
            </div>
          )}

          {/* Privacy Disclaimer Footer */}
          <div className="pt-4 border-t border-slate-100 text-center text-[11px] text-slate-500 leading-relaxed">
            Your information is used only to verify access to your payment information. No banking credentials, passwords, or PINs are ever requested.
          </div>

        </div>

      </div>

      {/* Footer spacing */}
      <div className="py-4 text-[11px] text-slate-400 text-center">
        ResolveX &copy; 2026 • Independent Buildathon Prototype
      </div>
    </div>
  );
}
