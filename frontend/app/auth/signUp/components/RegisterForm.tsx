'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { redirect } from 'next/navigation';
import { useForm, FormProvider, useFormContext } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { 
  Eye, EyeOff, Upload, ShieldCheck, Zap, CheckCircle, Lock, 
  MapPin, Building2, Globe, Phone, Mail, User, Store, 
  CreditCard, AlertCircle, CheckCircle2, Home
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { registerSchema, RegisterFormValues } from '../schema/registerSchema';
import { useGooglePlacesAutocomplete } from '../hooks/useGooglePlacesAutocomplete';
import useGoogleMapLoad from '@/hooks/useGoogleMapLoad';
// import { useModal } from '@/hooks/useModal';
// import RegisterSuccess from '@/components/RegisterSuccess';

// ---------- Enhanced Reusable Input Component ----------
function FormInput({
  label,
  name,
  type = 'text',
  placeholder,
  required = false,
  readOnly = false,
  icon: Icon,
  helperText,
}: {
  label?: string;
  name: keyof RegisterFormValues;
  type?: string;
  placeholder?: string;
  required?: boolean;
  readOnly?: boolean;
  icon?: React.ElementType | null;
  helperText?: string;
}) {
  const { register, formState: { errors } } = useFormContext<RegisterFormValues>();
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
          <div className="absolute left-3 inset-y-0 flex items-center pointer-events-none">
            <Icon className={`w-5 h-5 transition-colors ${error ? 'text-red-400' : 'text-gray-400 group-focus-within:text-indigo-500'}`} />
          </div>
        )}
        <input
          type={type}
          {...register(name)}
          placeholder={placeholder}
          readOnly={readOnly}
          className={`w-full ${Icon ? 'pl-10' : 'pl-4'} pr-4 py-2.5 rounded-lg border transition-all duration-200
            ${readOnly ? 'bg-gray-100 cursor-not-allowed' : 'bg-white hover:border-gray-300'}
            ${error 
              ? 'border-red-300 focus:ring-red-500 focus:border-red-500' 
              : 'border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent'
            } focus:outline-none shadow-sm hover:shadow-md transition-shadow`}
        />
      </div>
      {helperText && !error && <p className="text-gray-400 text-xs">{helperText}</p>}
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

// ---------- Address Section Component ----------
function AddressSection({ isGoogleMapsLoaded }: { isGoogleMapsLoaded: boolean }) {
  const { setValue, formState: { errors }, watch } = useFormContext<RegisterFormValues>();
  const [isAddressFocused, setIsAddressFocused] = useState(false);
  const showDetailedAddress = watch('showDetailedAddress') || false;

  useGooglePlacesAutocomplete(setValue, isGoogleMapsLoaded);

  return (
    <motion.div 
      className="space-y-4 p-4 bg-gradient-to-br from-blue-50/30 to-indigo-50/30 rounded-xl border border-blue-100"
      initial={{ opacity: 0, scale: 0.95 }}
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
            className={`w-full pl-10 pr-4 py-3 rounded-lg border transition-all
              ${errors.companyAddress 
                ? 'border-red-300 focus:ring-red-500' 
                : 'border-gray-200 focus:ring-2 focus:ring-indigo-500'
              } focus:outline-none bg-white shadow-sm`}
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
            {...setValue('showDetailedAddress', !showDetailedAddress)}
            onChange={(e) => setValue('showDetailedAddress', e.target.checked)}
            className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
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
      <AnimatePresence>
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
      </AnimatePresence>
    </motion.div>
  );
}

// ---------- Main Component ----------
export default function RegisterForm() {
//   const { openModal } = useModal();
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
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

  const { setValue, handleSubmit, formState: { isSubmitting, errors }, watch } = methods;
  const formValues = watch();

  const steps = [
    { title: "Business Info", icon: Store, fields: ['companyName', 'companyWebsite', 'logo'] },
    { title: "Contact Details", icon: User, fields: ['firstName', 'middleName', 'lastName', 'emailId', 'mobileNumber', 'phoneNumber'] },
    { title: "Address", icon: MapPin, fields: ['companyAddress', 'country', 'zipCode'] },
    { title: "Security", icon: Lock, fields: ['password', 'confirmPassword', 'termsSelected'] }
  ];

  const validateStep = (step: number): boolean => {
    const stepFields = steps[step].fields;
    let isValid = true;
    stepFields.forEach(field => {
      if (errors[field as keyof RegisterFormValues]) isValid = false;
      if (!formValues[field as keyof RegisterFormValues] && 
          ['companyName', 'firstName', 'emailId', 'mobileNumber', 'companyAddress', 'password', 'confirmPassword'].includes(field)) {
        isValid = false;
      }
    });
    return isValid;
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, steps.length - 1));
    } else {
      toast.error(`Please complete all required fields in ${steps[currentStep].title}`);
    }
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 0));
  };

  const onSubmit = async (data: RegisterFormValues) => {
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

    //   openModal(<RegisterSuccess />);
      methods.reset();
      toast.success('Registration successful!');
    } catch (error: any) {
      console.error("Registration error:", error);
      toast.error(error.message || "Registration failed. Please try again.");
    }
  };

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        toast.error('Logo must be less than 2MB');
        return;
      }
      setLogoPreview(URL.createObjectURL(file));
      setValue('logo', file as any);
    }
  };

  if (!isGoogleMapsLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading maps integration...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200">
      <motion.div 
        className="max-w-6xl w-full bg-white rounded-2xl shadow-2xl overflow-hidden"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex flex-col lg:flex-row">
          {/* Left decorative panel */}
          <div className="hidden lg:flex flex-col justify-between lg:w-2/5 p-8 bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 text-white">
            <div>
              <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center shadow-lg mb-8">
                <ShieldCheck className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-3xl font-bold mb-2">Humber Mobility</h1>
              <p className="text-white/80 text-lg mb-6">Service & Repair System</p>
              <p className="text-white/70 text-sm leading-relaxed mb-12">
                Join the complete workflow management for mobility scooter services.
              </p>
            </div>
            
            <div className="space-y-4">
              {[
                { icon: ShieldCheck, text: 'Secure role-based access control', color: 'bg-purple-500/20' },
                { icon: Zap, text: 'Real-time service tracking', color: 'bg-blue-500/20' },
                { icon: CheckCircle, text: 'Comprehensive reporting', color: 'bg-green-500/20' },
              ].map((item, idx) => (
                <motion.div 
                  key={idx}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className={`flex items-center gap-3 rounded-xl ${item.color} p-3 backdrop-blur-sm`}
                >
                  <div className="p-2 bg-white/20 rounded-lg">
                    <item.icon size={18} />
                  </div>
                  <p className="text-sm text-white/90">{item.text}</p>
                </motion.div>
              ))}
            </div>

            <div className="mt-8 pt-6 border-t border-white/20">
              <p className="text-white/60 text-xs text-center">
                Secure & Encrypted • GDPR Compliant • 24/7 Support
              </p>
            </div>
          </div>

          {/* Right side – Registration Form */}
          <div className="relative lg:w-3/5 p-6 md:p-8 bg-white">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600" />

            {/* Progress Steps */}
            <div className="mb-8">
              <div className="flex justify-between mb-4">
                {steps.map((step, idx) => (
                  <div key={idx} className="flex-1 text-center">
                    <div className={`
                      w-10 h-10 mx-auto rounded-full flex items-center justify-center transition-all duration-300
                      ${idx <= currentStep 
                        ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg' 
                        : 'bg-gray-200 text-gray-500'}
                    `}>
                      {idx < currentStep ? <CheckCircle2 className="w-5 h-5" /> : <step.icon className="w-5 h-5" />}
                    </div>
                    <p className={`text-xs mt-2 font-medium ${idx <= currentStep ? 'text-indigo-600' : 'text-gray-500'}`}>
                      {step.title}
                    </p>
                  </div>
                ))}
              </div>
              <div className="relative h-1 bg-gray-200 rounded-full">
                <div 
                  className="absolute h-full bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full transition-all duration-500"
                  style={{ width: `${((currentStep) / (steps.length - 1)) * 100}%` }}
                />
              </div>
            </div>

            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Create your showroom</h2>
              <p className="text-gray-600 text-sm mt-1">Fill in the details to get started</p>
            </div>

            <FormProvider {...methods}>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <AnimatePresence mode="wait">
                  {/* Step 0: Business Info */}
                  {currentStep === 0 && (
                    <motion.div
                      key="step0"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.3 }}
                      className="space-y-4"
                    >
                      <FormInput label="Shop/Business Name" name="companyName" placeholder="Your Garage Name" required icon={Store} />
                      <FormInput label="Company Website" name="companyWebsite" placeholder="https://example.com" icon={Globe} />
                      
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1.5">Business Logo</label>
                        <div className="flex items-center gap-4">
                          <label className="cursor-pointer bg-gradient-to-r from-gray-50 to-gray-100 hover:from-gray-100 hover:to-gray-200 px-5 py-2.5 rounded-lg flex items-center gap-2 transition-all shadow-sm hover:shadow-md">
                            <Upload size={18} className="text-indigo-600" />
                            <span className="text-sm font-medium">Upload Logo</span>
                            <input type="file" className="hidden" onChange={handleLogoChange} accept="image/*" />
                          </label>
                          {logoPreview && (
                            <div className="relative group">
                              <Image src={logoPreview} alt="Logo preview" width={56} height={56} className="w-14 h-14 object-contain rounded-lg border shadow-sm" />
                              <button
                                type="button"
                                onClick={() => {
                                  setLogoPreview(null);
                                  setValue('logo', null);
                                }}
                                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                              >
                                <X className="w-3 h-3" />
                              </button>
                            </div>
                          )}
                        </div>
                        <p className="text-gray-400 text-xs mt-2">Recommended: Square image, max 2MB</p>
                      </div>
                    </motion.div>
                  )}

                  {/* Step 1: Contact Details */}
                  {currentStep === 1 && (
                    <motion.div
                      key="step1"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.3 }}
                      className="space-y-4"
                    >
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormInput label="First Name" name="firstName" placeholder="John" required icon={User} />
                        <FormInput label="Middle Name" name="middleName" placeholder="Middle" icon={User} />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormInput label="Last Name" name="lastName" placeholder="Doe" icon={User} />
                        <FormInput label="Email Address" name="emailId" type="email" placeholder="you@example.com" required icon={Mail} />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormInput label="Mobile Number" name="mobileNumber" placeholder="+1 234 567 8900" required icon={Phone} />
                        <FormInput label="Phone Number (Optional)" name="phoneNumber" placeholder="+1 234 567 8900" icon={Phone} />
                      </div>
                    </motion.div>
                  )}

                  {/* Step 2: Address */}
                  {currentStep === 2 && (
                    <motion.div
                      key="step2"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.3 }}
                    >
                      <AddressSection isGoogleMapsLoaded={isGoogleMapsLoaded} />
                    </motion.div>
                  )}

                  {/* Step 3: Security */}
                  {currentStep === 3 && (
                    <motion.div
                      key="step3"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.3 }}
                      className="space-y-4"
                    >
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                            Password <span className="text-red-500">*</span>
                          </label>
                          <div className="relative">
                            <div className="absolute left-3 inset-y-0 flex items-center pointer-events-none">
                              <Lock className="w-5 h-5 text-gray-400" />
                            </div>
                            <input
                              type={showPassword ? 'text' : 'password'}
                              {...methods.register('password')}
                              className="w-full pl-10 pr-10 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition shadow-sm"
                              placeholder="Create a strong password"
                            />
                            <button
                              type="button"
                              onClick={() => setShowPassword(!showPassword)}
                              className="absolute right-3 inset-y-0 flex items-center text-gray-400 hover:text-gray-600"
                            >
                              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                          </div>
                          {methods.formState.errors.password && (
                            <p className="text-red-500 text-xs mt-1">{methods.formState.errors.password.message}</p>
                          )}
                          <p className="text-gray-400 text-xs mt-1.5">Minimum 6 characters with letters and numbers</p>
                        </div>

                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                            Confirm Password <span className="text-red-500">*</span>
                          </label>
                          <div className="relative">
                            <div className="absolute left-3 inset-y-0 flex items-center pointer-events-none">
                              <Lock className="w-5 h-5 text-gray-400" />
                            </div>
                            <input
                              type={showConfirmPassword ? 'text' : 'password'}
                              {...methods.register('confirmPassword')}
                              className="w-full pl-10 pr-10 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition shadow-sm"
                              placeholder="Confirm your password"
                            />
                            <button
                              type="button"
                              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                              className="absolute right-3 inset-y-0 flex items-center text-gray-400 hover:text-gray-600"
                            >
                              {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                          </div>
                          {methods.formState.errors.confirmPassword && (
                            <p className="text-red-500 text-xs mt-1">{methods.formState.errors.confirmPassword.message}</p>
                          )}
                        </div>
                      </div>

                      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-xl">
                        <div className="flex items-start gap-2">
                          <input
                            type="checkbox"
                            {...methods.register('termsSelected')}
                            className="mt-1 h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                          />
                          <label className="text-sm text-gray-700 leading-relaxed">
                            By proceeding, you agree to our <span className="text-indigo-600 font-medium hover:underline cursor-pointer">Terms and Conditions</span> and <span className="text-indigo-600 font-medium hover:underline cursor-pointer">Privacy Policy</span>
                            <span className="text-red-500 ml-1">*</span>
                          </label>
                        </div>
                        {methods.formState.errors.termsSelected && (
                          <p className="text-red-500 text-xs mt-2">{methods.formState.errors.termsSelected.message}</p>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Navigation Buttons */}
                <div className="flex gap-3 pt-4">
                  {currentStep > 0 && (
                    <button
                      type="button"
                      onClick={prevStep}
                      className="flex-1 bg-gray-200 text-gray-700 font-semibold py-2.5 rounded-lg hover:bg-gray-300 transition-all"
                    >
                      Previous
                    </button>
                  )}
                  {currentStep < steps.length - 1 ? (
                    <button
                      type="button"
                      onClick={nextStep}
                      className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold py-2.5 rounded-lg hover:shadow-lg transition-all"
                    >
                      Continue
                    </button>
                  ) : (
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-semibold py-2.5 rounded-lg hover:shadow-lg transition-all disabled:opacity-50"
                    >
                      {isSubmitting ? 'Creating Account...' : 'Complete Registration'}
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => redirect('/auth/signIn')}
                    className="px-6 bg-red-500 text-white font-semibold py-2.5 rounded-lg hover:bg-red-600 transition-all"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </FormProvider>
          </div>
        </div>
      </motion.div>
    </div>
  );
}