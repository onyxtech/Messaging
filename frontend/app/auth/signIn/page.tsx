"use client";

import { useState } from 'react';
import { useForm, FormProvider, useFormContext } from 'react-hook-form';
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
  AlertCircle,
  ArrowRight
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

// ---------- Login Schema ----------
const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
  rememberMe: z.boolean().optional(),
});

type LoginFormValues = z.infer<typeof loginSchema>;

// ---------- Reusable Input Component ----------
function FormInput({
  label,
  name,
  type = 'text',
  placeholder,
  required = false,
  icon: Icon,
  rightIcon: RightIcon,
  onRightIconClick,
}: {
  label?: string;
  name: keyof LoginFormValues;
  type?: string;
  placeholder?: string;
  required?: boolean;
  icon?: React.ElementType | null;
  rightIcon?: React.ElementType | null;
  onRightIconClick?: () => void;
}) {
  const { register, formState: { errors } } = useFormContext<LoginFormValues>();
  const error = errors[name];

  return (
    <motion.div 
      className="space-y-1.5"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {label && (
        <label className="block text-sm font-semibold text-gray-700">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <div className="relative group">
        {Icon && (
          <div className="absolute left-3 inset-y-0 flex items-center pointer-events-none z-10">
            <Icon className={`w-5 h-5 transition-colors ${error ? 'text-red-400' : 'text-gray-400 group-focus-within:text-blue-500'}`} />
          </div>
        )}
        <input
          type={type}
          {...register(name)}
          placeholder={placeholder}
          className={`w-full ${Icon ? 'pl-10' : 'pl-4'} ${RightIcon ? 'pr-10' : 'pr-4'} py-2.5 rounded-lg border transition-all duration-200
            bg-white hover:border-gray-300
            ${error 
              ? 'border-red-300 focus:ring-red-500 focus:border-red-500' 
              : 'border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent'
            } focus:outline-none shadow-sm hover:shadow-md transition-shadow placeholder-gray-400`}
        />
        {RightIcon && (
          <button
            type="button"
            onClick={onRightIconClick}
            className="absolute right-3 inset-y-0 flex items-center text-gray-400 hover:text-gray-600"
          >
            <RightIcon className="w-5 h-5" />
          </button>
        )}
      </div>
      {error && (
        <motion.p 
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          className="text-red-500 text-xs flex items-center gap-1"
        >
          <AlertCircle className="w-3 h-3" />
          {error.message as string}
        </motion.p>
      )}
    </motion.div>
  );
}

// ---------- Reusable Button Component ----------
function Button({
  type = 'button',
  onClick,
  disabled,
  isLoading,
  children,
  variant = 'primary',
  fullWidth = true,
}: {
  type?: 'button' | 'submit' | 'reset';
  onClick?: () => void;
  disabled?: boolean;
  isLoading?: boolean;
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'danger';
  fullWidth?: boolean;
}) {
  const variants = {
    primary: 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:shadow-lg',
    secondary: 'bg-gray-100 text-gray-700 hover:bg-gray-200',
    danger: 'bg-red-500 text-white hover:bg-red-600',
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || isLoading}
      className={`${fullWidth ? 'w-full' : ''} ${variants[variant]} font-semibold py-3 rounded-lg transition-all disabled:opacity-50 hover:scale-[1.02] transform duration-200`}
    >
      {isLoading ? (
        <span className="flex items-center justify-center gap-2">
          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          {children}
        </span>
      ) : (
        <span className="flex items-center justify-center gap-2">
          {children}
        </span>
      )}
    </button>
  );
}

// ---------- Main Component ----------
export default function LoginPage() {
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const router = useRouter();

  const methods = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
      rememberMe: false,
    },
  });

  const { handleSubmit, formState: { errors } } = methods;

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://127.0.0.1:4000/api';

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
        if (result.user.role === 'Admin') {
          localStorage.setItem('roleId', JSON.stringify(1));
        }
        else if (result.user.role === 'Technician') {
          localStorage.setItem('roleId', JSON.stringify(2));
        }
        else if (result.user.role === 'Customer') {
          localStorage.setItem('roleId', JSON.stringify(3));
        }
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

  return (
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
                {/* Email Input */}
                <FormInput
                  label="Email Address"
                  name="email"
                  type="email"
                  placeholder="you@company.com"
                  required
                  icon={Mail}
                />

                {/* Password Input */}
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

                {/* Remember & Forgot */}
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

                {/* Sign In Button */}
                <Button
                  type="submit"
                  isLoading={isLoading}
                  variant="primary"
                >
                  Sign In
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </form>
            </FormProvider>

            {/* Sign Up Link */}
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
  );
}