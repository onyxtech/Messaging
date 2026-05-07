'use client';

import { useState } from 'react';
import Image from 'next/image';
import { redirect } from 'next/navigation';
import { useForm, FormProvider, useFormContext } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { 
  Eye, EyeOff, Upload, ShieldCheck, Lock, 
  MapPin, Building2, Globe, Phone, Mail, User, Store, 
  CreditCard, AlertCircle, CheckCircle2, Home, 
  Briefcase, Link2, Smartphone, UserCheck, MessageCircle, 
  Zap, TrendingUp, Award, ArrowRight
} from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { registerSchema, RegisterFormValues } from '../../schema/registerSchema';
import { useGooglePlacesAutocomplete } from '../hooks/useGooglePlacesAutocomplete';
import useGoogleMapLoad from '@/hooks/useGoogleMapLoad';
import { FormInput } from '../../components/FormInput';
import { Button } from '../../components/Button';

// ---------- Address Section Component ----------
function AddressSection({ isGoogleMapsLoaded }: { isGoogleMapsLoaded: boolean }) {
  const { setValue, formState: { errors }, watch } = useFormContext<RegisterFormValues>();
  const [isAddressFocused, setIsAddressFocused] = useState(false);
  const showDetailedAddress = watch('showDetailedAddress') || false;

  useGooglePlacesAutocomplete(setValue, isGoogleMapsLoaded);

  return (
    <motion.div 
      className="space-y-4 p-5 bg-gradient-to-br from-blue-50/30 to-indigo-50/30 rounded-xl border border-blue-100"
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
    >
      <div className="flex items-center gap-2 mb-3">
        <div className="p-1.5 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg">
          <MapPin className="w-4 h-4 text-white" />
        </div>
        <h3 className="font-semibold text-gray-800">Business Address</h3>
        <span className="text-xs text-red-500 ml-auto">*Required</span>
      </div>

      {/* Main Address with Google Autocomplete */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">
          Street Address <span className="text-red-500">*</span>
        </label>
        <div className={`relative transition-all duration-200 ${isAddressFocused ? 'scale-[1.01]' : 'scale-100'}`}>
          <div className="absolute left-3 inset-y-0 flex items-center pointer-events-none z-10">
            <Home className="w-5 h-5 text-gray-400" />
          </div>
          <input
            id="address"
            type="text"
            placeholder="Start typing your business address..."
            onFocus={() => setIsAddressFocused(true)}
            onBlur={() => setIsAddressFocused(false)}
            className={`w-full pl-10 pr-4 py-3 rounded-lg border transition-all bg-white
              ${errors.companyAddress 
                ? 'border-red-300 focus:ring-red-500' 
                : 'border-gray-200 focus:ring-2 focus:ring-blue-500'
              } focus:outline-none shadow-sm placeholder-gray-400`}
            onChange={(e) => setValue('companyAddress', e.target.value)}
          />
        </div>
        {errors.companyAddress && (
          <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
            <AlertCircle className="w-3 h-3" />
            {errors.companyAddress.message}
          </p>
        )}
        <p className="text-gray-400 text-xs mt-1.5">
          <Globe className="w-3 h-3 inline mr-1" />
          Powered by Google Places
        </p>
      </div>

      {/* Country and Postal Code */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormInput 
          label="Country" 
          name="country" 
          readOnly 
          icon={Globe}
          helperText="Auto-detected from address"
        />
        <FormInput 
          label="Postal/ZIP Code" 
          name="zipCode" 
          readOnly 
          icon={CreditCard}
          helperText="Auto-detected from address"
        />
      </div>

      {/* Toggle for detailed address */}
      <div className="flex items-center justify-between pt-2">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={showDetailedAddress}
            onChange={(e) => setValue('showDetailedAddress', e.target.checked)}
            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          <span className="text-sm text-gray-600">Add detailed address information</span>
        </label>
        {(watch('latitude') !== 0 || watch('longitude') !== 0) && (
          <div className="flex items-center gap-1 text-green-600 text-xs">
            <CheckCircle2 className="w-3 h-3" />
            Location verified
          </div>
        )}
      </div>

      {/* Detailed Address Fields (Conditional) */}
      {showDetailedAddress && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3 }}
          className="space-y-3 overflow-hidden"
        >
          <div className="border-t border-gray-200 pt-3">
            <h4 className="text-sm font-medium text-gray-700 mb-3">Additional Location Details</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <FormInput 
                label="Suite/Unit/Apt" 
                name="suiteNumber" 
                placeholder="Suite 123, Floor 4"
                icon={Building2}
              />
              <FormInput 
                label="Landmark" 
                name="landmark" 
                placeholder="Near City Mall"
                icon={MapPin}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
              <FormInput 
                label="Latitude" 
                name="latitude" 
                readOnly 
                icon={Globe}
              />
              <FormInput 
                label="Longitude" 
                name="longitude" 
                readOnly 
                icon={Globe}
              />
            </div>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}

// ---------- Main Component ----------
export default function RegisterForm() {
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isGoogleMapsLoaded = useGoogleMapLoad();

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
    },
  });

  const { setValue, handleSubmit, formState: { errors } } = methods;

  const onSubmit = async (data: RegisterFormValues) => {
    setIsSubmitting(true);
    
    // Build FormData
    const formData = new FormData();
    for (const [key, value] of Object.entries(data)) {
      if (value !== undefined && value !== null && value !== '' && key !== 'showDetailedAddress') {
        formData.append(key, String(value));
      }
    }

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/register/shop`, {
        method: 'POST',
        body: formData,
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.message || 'Registration failed');

      methods.reset();
      setLogoPreview(null);
      toast.success('Registration successful! Please check your email to verify your account.');
      
      // Optional: Redirect after 2 seconds
      setTimeout(() => {
        redirect('/auth/signIn');
      }, 2000);
    } catch (error: any) {
      console.error("Registration error:", error);
      toast.error(error.message || "Registration failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        toast.error('Logo must be less than 2MB');
        return;
      }
      if (!file.type.startsWith('image/')) {
        toast.error('Please upload an image file');
        return;
      }
      setLogoPreview(URL.createObjectURL(file));
      setValue('logo', file as any);
    }
  };

  if (!isGoogleMapsLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading maps integration...</p>
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
          {/* Left decorative panel - Professional & Clean */}
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
                  Modern messaging for 
                  <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">
                    modern business
                  </span>
                </h2>
                <p className="text-white/70 text-sm leading-relaxed">
                  Join thousands of businesses using our platform to streamline communication, 
                  automate workflows, and deliver exceptional customer experiences.
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

          {/* Right side – Registration Form */}
          <div className="relative lg:w-3/5 p-6 md:p-8 bg-white">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500" />

            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Create your account</h2>
              <p className="text-gray-500 text-sm mt-1">Fill in the details below to get started</p>
            </div>

            <FormProvider {...methods}>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                {/* Business Information Section */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 border-b border-gray-200 pb-2">
                    <Briefcase className="w-5 h-5 text-blue-600" />
                    <h3 className="font-semibold text-gray-800">Business Information</h3>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormInput label="Business Name" name="companyName" placeholder="e.g., Acme Corp" required icon={Store} />
                    <FormInput label="Website" name="companyWebsite" placeholder="https://yourcompany.com" icon={Link2} />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Business Logo</label>
                    <div className="flex items-center gap-4">
                      <label className="cursor-pointer bg-gradient-to-r from-gray-50 to-gray-100 hover:from-gray-100 hover:to-gray-200 px-5 py-2.5 rounded-lg flex items-center gap-2 transition-all shadow-sm hover:shadow-md">
                        <Upload size={18} className="text-blue-600" />
                        <span className="text-sm font-medium">Upload Logo</span>
                        <input type="file" className="hidden" onChange={handleLogoChange} accept="image/*" />
                      </label>
                      {logoPreview && (
                        <div className="relative group">
                          <Image src={logoPreview} alt="Logo preview" width={56} height={56} className="w-14 h-14 object-contain rounded-lg border shadow-sm bg-gray-50" />
                          <button
                            type="button"
                            onClick={() => {
                              setLogoPreview(null);
                              setValue('logo', null);
                            }}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity text-xs w-5 h-5 flex items-center justify-center"
                          >
                            ×
                          </button>
                        </div>
                      )}
                    </div>
                    <p className="text-gray-400 text-xs mt-2">Recommended: Square image, max 2MB (PNG, JPG, JPEG)</p>
                  </div>
                </div>

                {/* Contact Information Section */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 border-b border-gray-200 pb-2">
                    <User className="w-5 h-5 text-blue-600" />
                    <h3 className="font-semibold text-gray-800">Contact Information</h3>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <FormInput label="First Name" name="firstName" placeholder="John" required icon={User} />
                    <FormInput label="Middle Name" name="middleName" placeholder="Middle" icon={User} />
                    <FormInput label="Last Name" name="lastName" placeholder="Doe" icon={User} />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormInput label="Email Address" name="emailId" type="email" placeholder="you@company.com" required icon={Mail} />
                    <FormInput label="Mobile Number" name="mobileNumber" placeholder="+1 234 567 8900" required icon={Smartphone} />
                  </div>
                  
                  <FormInput label="Phone Number (Optional)" name="phoneNumber" placeholder="+1 234 567 8900" icon={Phone} />
                </div>

                {/* Address Section */}
                <AddressSection isGoogleMapsLoaded={isGoogleMapsLoaded} />

                {/* Security Section */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 border-b border-gray-200 pb-2">
                    <Lock className="w-5 h-5 text-blue-600" />
                    <h3 className="font-semibold text-gray-800">Security</h3>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormInput
                      label="Password"
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Create a strong password"
                      required
                      icon={Lock}
                      rightIcon={showPassword ? EyeOff : Eye}
                      onRightIconClick={() => setShowPassword(!showPassword)}
                      helperText="Minimum 6 characters with letters and numbers"
                    />

                    <FormInput
                      label="Confirm Password"
                      name="confirmPassword"
                      type={showConfirmPassword ? 'text' : 'password'}
                      placeholder="Confirm your password"
                      required
                      icon={Lock}
                      rightIcon={showConfirmPassword ? EyeOff : Eye}
                      onRightIconClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    />
                  </div>
                </div>

                {/* Terms and Conditions */}
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-xl">
                  <div className="flex items-start gap-2">
                    <input
                      type="checkbox"
                      {...methods.register('termsSelected')}
                      className="mt-1 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <label className="text-sm text-gray-700 leading-relaxed">
                      By proceeding, you agree to our <span className="text-blue-600 font-medium hover:underline cursor-pointer">Terms of Service</span> and <span className="text-blue-600 font-medium hover:underline cursor-pointer">Privacy Policy</span>
                      <span className="text-red-500 ml-1">*</span>
                    </label>
                  </div>
                  {errors.termsSelected && (
                    <p className="text-red-500 text-xs mt-2">{errors.termsSelected.message}</p>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-4">
                  <Button
                    type="submit"
                    isLoading={isSubmitting}
                    variant="primary"
                    icon={ArrowRight}
                  >
                    Create Account
                  </Button>
                  <Button
                    type="button"
                    onClick={() => redirect('/auth/signIn')}
                    variant="secondary"
                  >
                    Cancel
                  </Button>
                </div>

                {/* Login Link */}
                <p className="text-center text-sm text-gray-600 pt-2">
                  Already have an account?{' '}
                  <button
                    type="button"
                    onClick={() => redirect('/auth/signIn')}
                    className="text-blue-600 font-semibold hover:underline hover:text-blue-700 transition"
                  >
                    Sign in
                  </button>
                </p>
              </form>
            </FormProvider>
          </div>
        </div>
      </motion.div>
    </div>
  );
}