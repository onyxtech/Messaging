'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
     ArrowRight, Loader2,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

import { registerSchema, RegisterFormValues } from '../../schema/registerSchema';
import useGoogleMapLoad from '@/hooks/useGoogleMapLoad';

// ── Section components
import { BusinessInfoSection } from './BusinessInfoSection';
import { ContactSection } from './ContactSection';
import { AddressSection } from './AddressSection';
import { SecuritySection } from './SecuritySection';
import LeftSection from './LeftSection';

// ── API helper — your reusable createItem
import { createItem } from '@/helper/apiHelper';

// ─────────────────────────────────────────────────────────────────────────────

export default function RegisterForm() {
  const router = useRouter();
  const isGoogleMapsLoaded = useGoogleMapLoad();

  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const methods = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      firstName: '',
      middleName: '',
      lastName: '',
      emailId: '',
      companyName: '',
      mobileNumber: '',
      phoneNumber: '',
      companyWebsite: '',
      companyAddress: '',
      country: '',
      zipCode: '',
      suiteNumber: '',
      landmark: '',
      latitude: 0,
      longitude: 0,
      password: '',
      confirmPassword: '',
      termsSelected: false,
      showDetailedAddress: false,
      logo: null,
    },
  });

  const { setValue, handleSubmit, formState: { isSubmitting } } = methods;

  // ── Logo handlers ──────────────────────────────────────────────────────────
  const handleLogoChange = (file: File, preview: string) => {
    setLogoPreview(preview);
    // setValue is already called inside BusinessInfoSection with the File object
  };

  const handleLogoRemove = () => {
    setLogoPreview(null);
    setValue('logo', null);
  };

  // ── Form submit ────────────────────────────────────────────────────────────
  const onSubmit = async (data: RegisterFormValues) => {
    console.log("data", data)
    const formData = new FormData();
console.log("formData", formData)
    // Append every field except UI-only flags
    const skipKeys = new Set(['showDetailedAddress']);

    for (const [key, value] of Object.entries(data)) {
      if (skipKeys.has(key)) continue;
      if (value === undefined || value === null || value === '') continue;

      if (key === 'logo' && value instanceof File) {
        // ✅ Append the actual File object — never String(file)
        formData.append('logo', value, value.name);
      } else {
        formData.append(key, String(value));
      }
    }

    try {
      // ✅ Uses your reusable createItem from apiHelper
      // FormData is passed directly — axiosInstance interceptor
      // automatically removes Content-Type so multipart boundary is set correctly
      console.log("formData", formData)
      await createItem('/register/company', formData);

      methods.reset();
      setLogoPreview(null);

      toast.success('Account created! Check your email to verify your account.');

      setTimeout(() => router.push('/auth/signIn'), 2000);
    } catch (error: any) {
      const message =
        error?.message ||
        error?.response?.data?.message ||
        'Registration failed. Please try again.';
      toast.error(message);
    }
  };

  // ── Loading screen while Google Maps initialises ───────────────────────────
  if (!isGoogleMapsLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-sm text-slate-500">Initialising maps…</p>
        </div>
      </div>
    );
  }

  return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-slate-50 via-slate-100 to-gray-100">
      <motion.div 
        className="max-w-6xl w-full bg-white rounded-2xl shadow-2xl overflow-hidden"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex flex-col lg:flex-row">
      {/* ── Left panel ─────────────────────────────────────────────────────── */}
        <LeftSection />
      {/* ── Right panel (form) ─────────────────────────────────────────────── */}
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-2xl mx-auto px-6 py-10">
          {/* Header */}
          <div className="mb-8">
            <p className="text-xs font-semibold text-blue-600 uppercase tracking-widest mb-1">
              New Account
            </p>
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
              Create your workspace
            </h2>
            <p className="text-slate-500 text-sm mt-1">
              Already have an account?{' '}
              <button
                type="button"
                onClick={() => router.push('/auth/signIn')}
                className="text-blue-600 font-medium hover:underline"
              >
                Sign in
              </button>
            </p>
          </div>

          <FormProvider {...methods}>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">

              {/* ── Business Info ───────────────────────────────────────── */}
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0 }}
                className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm"
              >
                <BusinessInfoSection
                  logoPreview={logoPreview}
                  onLogoChange={handleLogoChange}
                  onLogoRemove={handleLogoRemove}
                />
              </motion.div>

              {/* ── Contact ─────────────────────────────────────────────── */}
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.05 }}
                className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm"
              >
                <ContactSection />
              </motion.div>

              {/* ── Address ─────────────────────────────────────────────── */}
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.1 }}
                className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm"
              >
                <AddressSection isGoogleMapsLoaded={isGoogleMapsLoaded} />
              </motion.div>

              {/* ── Security ────────────────────────────────────────────── */}
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.15 }}
                className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm"
              >
                <SecuritySection
                  showPassword={showPassword}
                  showConfirmPassword={showConfirmPassword}
                  onTogglePassword={() => setShowPassword((p) => !p)}
                  onToggleConfirmPassword={() => setShowConfirmPassword((p) => !p)}
                />
              </motion.div>

              {/* ── Actions ─────────────────────────────────────────────── */}
              <div className="flex items-center gap-3 pb-6">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-semibold py-3 rounded-xl transition-all shadow-sm hover:shadow-md text-sm"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Creating account…
                    </>
                  ) : (
                    <>
                      Create Account
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => router.push('/auth/signIn')}
                  className="px-6 py-3 rounded-xl border border-slate-200 text-slate-600 font-semibold text-sm hover:bg-slate-50 transition-all"
                >
                  Cancel
                </button>
              </div>

            </form>
          </FormProvider>
        </div>
      </main>
    </div>
       </motion.div>
    </div>
  );
}