// app/register/page.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm, FormProvider, type Resolver } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowRight, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';

import { registerSchema, RegisterFormValues } from '../../schema/registerSchema';
import useGoogleMapLoad from '@/hooks/useGoogleMapLoad';
import { createItem } from '@/helper/apiHelper';

// Components
import  LeftSection  from './LeftSection';
import { BusinessInfoSection } from './BusinessInfoSection';
import { ContactSection } from './ContactSection';
import { AddressSection } from './AddressSection';
import { SecuritySection } from './SecuritySection';
import { BrandingSection } from './BrandingSection';
import { RegistrationSuccessCard } from './RegistrationSuccessCard';

export default function RegisterForm() {
  const router = useRouter();
  const isGoogleMapsLoaded = useGoogleMapLoad();

  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showSuccessCard, setShowSuccessCard] = useState(false);
  const [registrationData, setRegistrationData] = useState<{
    email: string;
    companyName: string;
    userId: string;
    shopId: string;
  } | null>(null);

  const methods = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema) as Resolver<RegisterFormValues>,
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
      primaryColor: '#1e293b',
      secondaryColor: '#3b82f6',
      accentColor: '#8b5cf6',
    },
  });

  const { setValue, handleSubmit, formState: { isSubmitting }, reset, watch } = methods;
  
  // Watch colors for live preview
  const primaryColor = watch('primaryColor');
  const secondaryColor = watch('secondaryColor');
  const accentColor = watch('accentColor');

  const handleLogoChange = (file: File, preview: string) => {
    setLogoPreview(preview);
    setLogoFile(file);
    setValue('logo', file as any);
  };

  const handleLogoRemove = () => {
    setLogoPreview(null);
    setLogoFile(null);
    setValue('logo', null);
  };

  const handleResendEmail = async () => {
    if (!registrationData) return;
    
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/resend-verification`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: registrationData.email }),
      });
      
      if (!res.ok) throw new Error('Failed to resend');
      return Promise.resolve();
    } catch (error) {
      console.error('Resend error:', error);
      throw error;
    }
  };

  const onSubmit = async (data: RegisterFormValues) => {
    const formData = new FormData();
    
    const skipKeys = new Set(['showDetailedAddress', 'termsSelected']);
    
    for (const [key, value] of Object.entries(data)) {
      if (skipKeys.has(key)) continue;
      if (value === undefined || value === null || value === '') continue;
      
      if (key === 'logo' && logoFile) {
        formData.append('logo', logoFile);
      } else if (key !== 'logo') {
        formData.append(key, String(value));
      }
    }

    try {
      const response = await createItem<{ userId: string; shopId: string }>('/register/company', formData);
      
      reset();
      setLogoPreview(null);
      setLogoFile(null);
      
      setRegistrationData({
        email: data.emailId,
        companyName: data.companyName,
        userId: response.data.userId,
        shopId: response.data.shopId
      });
      
      setShowSuccessCard(true);
      
    } catch (error: any) {
      const message = error?.message || error?.response?.data?.message || 'Registration failed. Please try again.';
      toast.error(message);
    }
  };

  if (!isGoogleMapsLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-slate-600 font-medium">Loading Google Maps...</p>
          <p className="text-slate-400 text-sm">Please wait while we initialize the address service</p>
        </div>
      </div>
    );
  }

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
            <LeftSection 
              primaryColor={primaryColor}
              secondaryColor={secondaryColor}
              accentColor={accentColor}
            />
            
            <main className="flex-1 overflow-y-auto max-h-[90vh]">
              <div className="max-w-2xl mx-auto px-6 py-8">
                {/* Header */}
                <div className="mb-8">
                  <p className="text-xs font-semibold text-blue-600 uppercase tracking-wider mb-1">
                    New Account
                  </p>
                  <h2 className="text-3xl font-bold text-slate-900 tracking-tight">
                    Create your workspace
                  </h2>
                  <p className="text-slate-500 text-sm mt-2">
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
                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    {/* Business Info */}
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                      className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-shadow"
                    >
                      <BusinessInfoSection
                        logoPreview={logoPreview}
                        onLogoChange={handleLogoChange}
                        onLogoRemove={handleLogoRemove}
                      />
                    </motion.div>

                    {/* Contact Info */}
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: 0.05 }}
                      className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-shadow"
                    >
                      <ContactSection />
                    </motion.div>

                    {/* Address Section - FIXED VERSION */}
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: 0.1 }}
                      className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-shadow"
                    >
                      <AddressSection isGoogleMapsLoaded={isGoogleMapsLoaded} />
                    </motion.div>

                    {/* Branding Section - NEW with Color Selection */}
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: 0.12 }}
                      className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-shadow"
                    >
                      <BrandingSection />
                    </motion.div>

                    {/* Security Section */}
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: 0.15 }}
                      className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-shadow"
                    >
                      <SecuritySection
                        showPassword={showPassword}
                        showConfirmPassword={showConfirmPassword}
                        onTogglePassword={() => setShowPassword(!showPassword)}
                        onToggleConfirmPassword={() => setShowConfirmPassword(!showConfirmPassword)}
                      />
                    </motion.div>

                    {/* Actions */}
                    <div className="flex gap-3 pt-4">
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 disabled:opacity-60 text-white font-semibold py-3 rounded-xl transition-all shadow-md hover:shadow-lg text-sm"
                      >
                        {isSubmitting ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            Creating account...
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

      {/* Success Card Modal */}
      <AnimatePresence>
        {showSuccessCard && registrationData && (
          <RegistrationSuccessCard
            email={registrationData.email}
            companyName={registrationData.companyName}
            onClose={() => {
              setShowSuccessCard(false);
              router.push('/auth/signIn');
            }}
            onResendEmail={handleResendEmail}
          />
        )}
      </AnimatePresence>
    </>
  );
}