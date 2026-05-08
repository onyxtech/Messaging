// app/auth/signIn/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ShieldCheck,
  Zap,
  CheckCircle,
  MessageCircle,
  TrendingUp,
  Award,
  ArrowRight,
  X
} from 'lucide-react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { FormInput } from '../components/FormInput';
import { Button } from '../components/Button';

// ---------- Login Schema ----------
const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
  rememberMe: z.boolean().optional(),
});

type LoginFormValues = z.infer<typeof loginSchema>;

// ---------- Email Not Verified Modal ----------
function EmailNotVerifiedModal({ 
  email, 
  onClose, 
  onResend 
}: { 
  email: string; 
  onClose: () => void; 
  onResend: (email: string) => Promise<void>;
}) {
  const [countdown, setCountdown] = useState(30);
  const [canResend, setCanResend] = useState(false);
  const [isResending, setIsResending] = useState(false);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [countdown]);
const handleGmailClick = () => {
  handleOpenGmail();
  onClose(); // Modal ya dialog ko band karne ke liye
};
  const handleResendEmail = async () => {
    if (!canResend || isResending) return;
    
    setIsResending(true);
    try {
      await onResend(email);
      setCountdown(30);
      setCanResend(false);
      toast.success('Verification email resent successfully!');
    } catch (error) {
      toast.error('Failed to resend verification email');
    } finally {
      setIsResending(false);
    }
  };

  const handleOpenGmail = () => {
    // Open Gmail compose window
    window.open('https://mail.google.com', '_blank');
  };

  const handleOpenEmailClient = () => {
    // Open default email client
    window.location.href = `mailto:${email}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className="relative max-w-md w-full bg-white rounded-2xl shadow-2xl overflow-hidden"
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-gray-100 transition-colors z-10"
        >
          <X className="w-4 h-4 text-gray-500" />
        </button>

        {/* Warning Header */}
        <div className="bg-gradient-to-br from-amber-500 to-orange-600 px-6 py-8 text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
          >
            <div className="inline-flex items-center justify-center w-20 h-20 bg-white rounded-full mb-4 shadow-lg">
              <Mail className="w-10 h-10 text-amber-500" />
            </div>
          </motion.div>
          <h2 className="text-2xl font-bold text-white mb-2">
            Email Not Verified
          </h2>
          <p className="text-amber-100 text-sm">
            Please verify your email address to continue
          </p>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="mb-6 p-4 bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl">
            <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">
              Verification email sent to
            </p>
            <p className="text-sm font-semibold text-gray-900 break-all">
              {email}
            </p>
          </div>

          <div className="space-y-3 mb-6">
            <div className="flex items-start gap-3 p-3 bg-blue-50/50 rounded-lg">
              <Mail className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-sm text-gray-900">Check your inbox</h3>
                <p className="text-xs text-gray-600">
                  We've sent a verification link to your email address
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 bg-amber-50/50 rounded-lg">
              <ShieldCheck className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-sm text-gray-900">Secure verification</h3>
                <p className="text-xs text-gray-600">
                  The link expires in 24 hours for security
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <button
              onClick={ handleGmailClick }
              className="w-full bg-gradient-to-r from-red-600 to-red-700 text-white py-3 rounded-xl font-semibold hover:from-red-700 hover:to-red-800 transition-all flex items-center justify-center gap-2 shadow-md"
            >
              <Mail className="w-4 h-4" />
              Open Gmail
              <ArrowRight className="w-4 h-4" />
            </button>

            {/* <button
              onClick={handleOpenEmailClient}
              className="w-full bg-gradient-to-r from-gray-600 to-gray-700 text-white py-3 rounded-xl font-semibold hover:from-gray-700 hover:to-gray-800 transition-all flex items-center justify-center gap-2"
            >
              Open Email Client
            </button> */}

            <button
              onClick={handleResendEmail}
              disabled={!canResend || isResending}
              className={`w-full py-3 rounded-xl font-semibold transition-all flex items-center justify-center gap-2
                ${canResend && !isResending 
                  ? 'bg-gray-100 text-gray-700 hover:bg-gray-200' 
                  : 'bg-gray-50 text-gray-400 cursor-not-allowed'
                }`}
            >
              {isResending ? (
                <>
                  <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  {canResend 
                    ? 'Resend Verification Email' 
                    : `Resend available in ${countdown}s`
                  }
                </>
              )}
            </button>
          </div>

          <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-100">
            <p className="text-xs text-blue-800 text-center">
              💡 Didn't receive the email? Check your spam folder
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

// ---------- Main Component ----------
export default function LoginPage() {
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showVerificationModal, setShowVerificationModal] = useState(false);
  const [unverifiedEmail, setUnverifiedEmail] = useState('');
  const router = useRouter();
  const searchParams = useSearchParams();

  const methods = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
      rememberMe: false,
    },
  });

  const { handleSubmit, setValue, watch } = methods;

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://127.0.0.1:5000/api';

  // Check for verification status from URL params
  useEffect(() => {
    const verified = searchParams.get('verified');
    const error = searchParams.get('error');
    const message = searchParams.get('message');
    
    if (verified === 'true') {
      toast.success(message || 'Email verified successfully! You can now login.');
    }
    if (error) {
      toast.error(decodeURIComponent(error));
    }
  }, [searchParams]);

  const onSubmit = async (data: LoginFormValues) => {
    setIsLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: data.email,
          password: data.password,
        }),
      });
      
      const result = await res.json();
      
      if (!res.ok) {
        // Check if error is due to unverified email
        if (result.requiresVerification) {
          setUnverifiedEmail(data.email);
          setShowVerificationModal(true);
          toast.error('Please verify your email before logging in');
          return;
        }
        toast.error(result.message || 'Login failed. Please check your credentials.');
        return;
      }
      
      // Success Logic
      localStorage.setItem('user', JSON.stringify(result.user));
      localStorage.setItem('email', data.email);
      localStorage.setItem('userId', result.user.id);
      
      if (result.user.technicianId) {
        localStorage.setItem('technicianId', result.user.technicianId);
      }
      
      if (result.user.role) {
        let roleId = 1;
        if (result.user.role === 'Admin') roleId = 1;
        else if (result.user.role === 'Technician') roleId = 2;
        else if (result.user.role === 'Customer') roleId = 3;
        localStorage.setItem('roleId', JSON.stringify(roleId));
      }
      
      if (result.token) {
        localStorage.setItem('token', result.token);
      }

      toast.success('Login successful! Redirecting...');
      
      setTimeout(() => {
        router.push('/dashboard');
      }, 1000);
    } catch (error) {
      console.error('Login error:', error);
      toast.error('Failed to connect to server');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendVerification = async (email: string) => {
    try {
      const res = await fetch(`${API_BASE_URL}/register/resend-verification`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });
      
      const result = await res.json();
      
      if (!res.ok) {
        throw new Error(result.message || 'Failed to resend verification');
      }
      
      return Promise.resolve();
    } catch (error) {
      console.error('Resend error:', error);
      throw error;
    }
  };

  return (
    <>
      <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-slate-50 via-slate-100 to-gray-100">
        <motion.div 
          className="max-w-6xl w-full bg-white rounded-2xl shadow-2xl overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex flex-col lg:flex-row">
            {/* Left decorative panel */}
            <div className="hidden lg:flex flex-col justify-between lg:w-2/5 p-8 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
              <div>
                <div className="flex items-center gap-3 mb-12">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg">
                    <MessageCircle className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold tracking-tight">Messaging SaaS</h1>
                    <p className="text-white/60 text-sm">Enterprise Communication</p>
                  </div>
                </div>
                
                <div className="space-y-6 mb-8">
                  <h2 className="text-3xl font-bold leading-tight">
                    Welcome back to
                    <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">
                      modern messaging
                    </span>
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
                  { icon: Zap, text: 'Lightning-fast delivery' },
                  { icon: TrendingUp, text: 'Advanced analytics' },
                  { icon: Award, text: '99.9% uptime guarantee' },
                ].map((item, idx) => (
                  <motion.div 
                    key={idx}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className="flex items-center gap-3 rounded-xl bg-white/5 backdrop-blur-sm p-3 border border-white/10"
                  >
                    <div className="p-1.5 bg-gradient-to-br from-blue-500/20 to-indigo-500/20 rounded-lg">
                      <item.icon size={16} className="text-blue-400" />
                    </div>
                    <p className="text-sm text-white/90">{item.text}</p>
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
            </div>

            {/* Right side – Login Form */}
            <div className="relative lg:w-3/5 p-6 md:p-8 bg-white">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500" />

              <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Welcome back</h2>
                <p className="text-gray-500 text-sm mt-1">Sign in to access your account</p>
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
                    onRightIconClick={() => setShowPassword(!showPassword)}
                  />

                  <div className="flex items-center justify-between pt-1">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        {...methods.register('rememberMe')}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700">Remember me</span>
                    </label>
                    <Link
                      href="/auth/forget-password"
                      className="text-sm font-medium text-blue-600 hover:text-blue-700 transition hover:underline"
                    >
                      Forgot password?
                    </Link>
                  </div>

                  <Button
                    type="submit"
                    isLoading={isLoading}
                    variant="primary"
                    icon={ArrowRight}
                  >
                    Sign In
                  </Button>
                </form>
              </FormProvider>

              <div className="mt-6 text-center">
                <p className="text-sm text-gray-600">
                  Don't have an account?{' '}
                  <Link
                    href="/auth/signUp"
                    className="font-semibold text-blue-600 hover:text-blue-700 transition hover:underline"
                  >
                    Create an account
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