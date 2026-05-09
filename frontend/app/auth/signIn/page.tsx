// src/app/auth/signIn/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Mail, Lock, Eye, EyeOff, ShieldCheck, Zap,
  MessageCircle, TrendingUp, Award, ArrowRight, X,
} from 'lucide-react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { FormInput } from '../components/FormInput';

// ── Brand system imports
import { loginUser } from '@/helper/authHelper';
import { useBrand } from '@/hooks/useBrand';
import { LoginErrorResponse } from '@/types/auth.types';
import { API_BASE_URL } from "@/utils/baseUrl"
import { loginSchema, LoginFormValues } from "../schema/loginSchema"


// ─── Email Not Verified Modal ─────────────────────────────────────────────────
function EmailNotVerifiedModal({
  email,
  onClose,
  onResend,
}: {
  email:    string;
  onClose:  () => void;
  onResend: (email: string) => Promise<void>;
}) {
  const brand = useBrand();
  const [countdown,   setCountdown]   = useState(30);
  const [canResend,   setCanResend]   = useState(false);
  const [isResending, setIsResending] = useState(false);

  useEffect(() => {
    if (countdown > 0) {
      const t = setTimeout(() => setCountdown((c) => c - 1), 1000);
      return () => clearTimeout(t);
    }
    setCanResend(true);
  }, [countdown]);

  const handleResend = async () => {
    if (!canResend || isResending) return;
    setIsResending(true);
    try {
      await onResend(email);
      setCountdown(30);
      setCanResend(false);
      toast.success('Verification email resent!');
    } catch {
      toast.error('Failed to resend. Please try again.');
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className="relative max-w-md w-full bg-white rounded-2xl shadow-2xl overflow-hidden"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-gray-100 transition-colors z-10"
        >
          <X className="w-4 h-4 text-gray-500" />
        </button>

        {/* Header — brand gradient */}
        <div
          className="px-6 py-8 text-center"
          style={{ background: brand.gradients.primaryToSecondary }}
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
          >
            <div className="inline-flex items-center justify-center w-20 h-20 bg-white rounded-full mb-4 shadow-lg">
              <Mail className="w-10 h-10" style={brand.textPrimary} />
            </div>
          </motion.div>
          <h2 className="text-2xl font-bold text-white mb-2">Email Not Verified</h2>
          <p className="text-white/80 text-sm">
            Please verify your email address to continue
          </p>
        </div>

        {/* Body */}
        <div className="p-6">
          <div className="mb-6 p-4 rounded-xl" style={brand.softPrimary(0.07)}>
            <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">
              Verification sent to
            </p>
            <p className="text-sm font-semibold text-gray-900 break-all">{email}</p>
          </div>

          <div className="space-y-3 mb-6">
            <div className="flex items-start gap-3 p-3 rounded-lg" style={brand.softPrimary(0.05)}>
              <Mail className="w-5 h-5 flex-shrink-0 mt-0.5" style={brand.textPrimary} />
              <div>
                <h3 className="font-semibold text-sm text-gray-900">Check your inbox</h3>
                <p className="text-xs text-gray-500">We've sent a verification link to your email</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 rounded-lg bg-amber-50">
              <ShieldCheck className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-sm text-gray-900">Link expires in 24 hours</h3>
                <p className="text-xs text-gray-500">Request a new one if it expires</p>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <button
              onClick={() => { window.open('https://mail.google.com', '_blank'); onClose(); }}
              className="w-full text-white py-3 rounded-xl font-semibold transition-opacity hover:opacity-90 flex items-center justify-center gap-2 shadow-sm"
              style={{ background: brand.gradients.primaryToSecondary }}
            >
              <Mail className="w-4 h-4" />
              Open Gmail
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={handleResend}
              disabled={!canResend || isResending}
              className={`w-full py-3 rounded-xl font-semibold transition-all flex items-center justify-center gap-2
                ${canResend && !isResending
                  ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  : 'bg-gray-50 text-gray-400 cursor-not-allowed'
                }`}
            >
              {isResending ? (
                <><div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />Sending…</>
              ) : canResend ? 'Resend Verification Email' : `Resend available in ${countdown}s`}
            </button>
          </div>

          <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-100">
            <p className="text-xs text-blue-800 text-center">
              💡 Didn't receive it? Check your spam folder
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

// ─── Login Page ───────────────────────────────────────────────────────────────
export default function LoginPage() {
  const router       = useRouter();
  const searchParams = useSearchParams();
  const brand        = useBrand(); // reads colors from Zustand → CSS vars

  const [showPassword,          setShowPassword]          = useState(false);
  const [showVerificationModal, setShowVerificationModal] = useState(false);
  const [unverifiedEmail,       setUnverifiedEmail]       = useState('');

  const methods = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '', rememberMe: false },
  });

  const { handleSubmit, formState: { isSubmitting } } = methods;

  // Handle redirect params after email verification
  useEffect(() => {
    const verified = searchParams.get('verified');
    const error    = searchParams.get('error');
    const message  = searchParams.get('message');
    if (verified === 'true') toast.success(message || 'Email verified! You can now sign in.');
    if (error)               toast.error(decodeURIComponent(error));
  }, [searchParams]);

  // ── Submit ─────────────────────────────────────────────────────────────────
  const onSubmit = async (data: LoginFormValues) => {
    try {
      // loginUser (authHelper.ts):
      //  → POST /auth/login
      //  → Maps shop colors into Zustand
      //  → BrandProvider updates CSS variables instantly
      //  → Every component using useBrand() reflects new colors
      await loginUser(data.email, data.password);
      toast.success('Login successful! Redirecting…');
      setTimeout(() => router.push('/dashboard'), 800);
    } catch (error: any) {
      const errData: LoginErrorResponse = error?.response?.data || {};

      if (errData.code === 'EMAIL_NOT_VERIFIED' || errData.requiresVerification) {
        setUnverifiedEmail(errData.email || data.email);
        setShowVerificationModal(true);
        return;
      }
      if (errData.code === 'ACCOUNT_INACTIVE') {
        toast.error('Your account has been deactivated. Contact support.');
        return;
      }
      toast.error(errData.message || 'Invalid email or password');
    }
  };

  // ── Resend verification ────────────────────────────────────────────────────
  const handleResendVerification = async (email: string): Promise<void> => {
    const res = await fetch(`${API_BASE_URL}/register/resend-verification`, {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ email }),
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.message || 'Failed to resend');
  };

  // ─── Render ─────────────────────────────────────────────────────────────────
  return (
    <>
      {/* Page background — soft brand gradient */}
      <div className="min-h-screen flex items-center justify-center p-4 bg-brand-gradient-soft">
        <motion.div
          className="max-w-6xl w-full bg-white rounded-2xl shadow-2xl overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex flex-col lg:flex-row">

            {/* ── Left panel — full 3-color brand gradient ─────────────── */}
            <aside
              className="hidden lg:flex flex-col justify-between lg:w-2/5 p-8 text-white"
              style={{ background: brand.gradients.full }}
            >
              <div>
                <div className="flex items-center gap-3 mb-12">
                  <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center shadow-lg">
                    <MessageCircle className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold tracking-tight">Messaging SaaS</h1>
                    <p className="text-white/60 text-sm">Enterprise Communication</p>
                  </div>
                </div>

                <div className="space-y-4 mb-8">
                  <h2 className="text-3xl font-bold leading-tight">
                    Welcome back to
                    <span className="block text-white/80">modern messaging</span>
                  </h2>
                  <p className="text-white/70 text-sm leading-relaxed">
                    Access your account to manage conversations, track analytics,
                    and deliver exceptional customer experiences.
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                {[
                  { icon: ShieldCheck, text: 'Enterprise-grade security' },
                  { icon: Zap,         text: 'Lightning-fast delivery'    },
                  { icon: TrendingUp,  text: 'Advanced analytics'         },
                  { icon: Award,       text: '99.9% uptime guarantee'     },
                ].map(({ icon: Icon, text }, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className="flex items-center gap-3 rounded-xl bg-white/10 backdrop-blur-sm p-3 border border-white/10"
                  >
                    <div className="p-1.5 bg-white/20 rounded-lg">
                      <Icon size={16} className="text-white" />
                    </div>
                    <p className="text-sm text-white/90">{text}</p>
                  </motion.div>
                ))}
              </div>

              <div className="mt-8 pt-6 border-t border-white/10">
                <div className="flex items-center justify-between text-xs text-white/50">
                  <span>Secure & Encrypted</span>
                  <span>•</span>
                  <span>GDPR Compliant</span>
                  <span>•</span>
                  <span>24/7 Support</span>
                </div>
              </div>
            </aside>

            {/* ── Right panel — form ──────────────────────────────────────── */}
            <div className="relative lg:w-3/5 p-6 md:p-8 bg-white">
              {/* Top accent bar */}
              <div
                className="absolute top-0 left-0 w-full h-1"
                style={{ background: brand.gradients.primaryToSecondary }}
              />

              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900">Welcome back</h2>
                <p className="text-gray-500 text-sm mt-1">Sign in to your workspace</p>
              </div>

              <FormProvider {...methods}>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">

                  <FormInput
                    label="Email Address"
                    name="email"
                    type="email"
                    placeholder="you@company.com"
                    required
                    icon={Mail}
                  />

                  <FormInput
                    label="Password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    required
                    icon={Lock}
                    rightIcon={showPassword ? EyeOff : Eye}
                    onRightIconClick={() => setShowPassword((p) => !p)}
                  />

                  {/* Remember me + Forgot password */}
                  <div className="flex items-center justify-between">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        {...methods.register('rememberMe')}
                        className="w-4 h-4 rounded border-gray-300"
                        style={{ accentColor: brand.colors.primaryColor }}
                      />
                      <span className="text-sm text-gray-600">Remember me</span>
                    </label>
                    <Link
                      href="/auth/forget-password"
                      className="text-sm font-medium hover:underline"
                      style={brand.textPrimary}
                    >
                      Forgot password?
                    </Link>
                  </div>

                  {/* Submit — brand gradient button */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-white font-semibold text-sm transition-opacity hover:opacity-90 disabled:opacity-60"
                    style={{ background: brand.gradients.primaryToSecondary }}
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Signing in…
                      </>
                    ) : (
                      <>Sign In <ArrowRight className="w-4 h-4" /></>
                    )}
                  </button>

                </form>
              </FormProvider>

              <div className="mt-6 text-center">
                <p className="text-sm text-gray-500">
                  Don't have an account?{' '}
                  <Link
                    href="/auth/signUp"
                    className="font-semibold hover:underline"
                    style={brand.textPrimary}
                  >
                    Create one
                  </Link>
                </p>
              </div>
            </div>

          </div>
        </motion.div>
      </div>

      {/* Email Not Verified Modal */}
      <AnimatePresence>
        {showVerificationModal && (
          <EmailNotVerifiedModal
            email={unverifiedEmail}
            onClose={() => setShowVerificationModal(false)}
            onResend={handleResendVerification}
          />
        )}
      </AnimatePresence>
    </>
  );
}