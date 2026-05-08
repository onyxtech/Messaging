"use client";

import { useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { motion } from "framer-motion";
import { Mail, ShieldCheck, ArrowLeft, KeyRound, AlertCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { createItem } from '@/helper/apiHelper';
import toast from "react-hot-toast";
import { FormInput } from "../components/FormInput";
import { Button } from "@/components/ui/Button";
import { forgetPasswordSchema, ForgetPasswordFormValues } from "../schema/forgetPasswordSchema"


export default function ForgetPasswordPage() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const methods = useForm<ForgetPasswordFormValues>({
    resolver: zodResolver(forgetPasswordSchema),
    defaultValues: {
      email: '',
    },
  });

  const { handleSubmit } = methods;

 
 const onSubmit = async (data: ForgetPasswordFormValues) => {
  try {
    const response = await createItem('/forget-password/send-otp', { emailId: data.email });

    
    if (response && response.success) { 
      localStorage.setItem('resetEmail', data.email);
      router.push('/auth/forget-password/verify-otp');
    } else {
      
      alert(response.message || "Failed to send OTP");
    }
  } catch (error: any) {
    alert(error.message);
  }
};

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-slate-50 via-slate-100 to-gray-100">
      <motion.div 
        className="max-w-md w-full"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          {/* Top Gradient Bar */}
          <div className="h-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500" />
          
          <div className="p-8">
            {/* Header Section */}
            <div className="text-center mb-8">
              <div className="mx-auto w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg mb-4">
                <KeyRound className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Forgot Password?</h1>
              <p className="text-sm text-gray-500">
                Enter your registered email address and we'll send you a 6-digit OTP to reset your password.
              </p>
            </div>

            <FormProvider {...methods}>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* Email Input */}
                <FormInput
                  label="Email Address"
                  name="email"
                  type="email"
                  placeholder="you@company.com"
                  required
                  icon={Mail}
                  helperText="We'll send a 6-digit OTP to this email"
                />

                {/* Info Box */}
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4"
                >
                  <div className="flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                    <div className="space-y-1">
                      <p className="text-xs font-semibold text-blue-900">Important Note:</p>
                      <p className="text-xs text-blue-700 leading-relaxed">
                        You will receive a 6-digit OTP via email. This OTP will expire in 10 minutes for security reasons.
                      </p>
                    </div>
                  </div>
                </motion.div>

                {/* Submit Button */}
                <Button
                  type="submit"
                //   isLoading={sendOTPMutation.isPending}
                  variant="primary"
                  fullWidth={true}
                >
                  Send Reset OTP
                </Button>

                {/* Back to Login Link */}
                <div className="text-center pt-4">
                  <button
                    type="button"
                    onClick={() => router.push('/auth/signIn')}
                    className="text-sm text-gray-500 hover:text-gray-700 transition inline-flex items-center gap-1"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Back to Sign In
                  </button>
                </div>
              </form>
            </FormProvider>
          </div>
        </div>

        {/* Security Note */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-6 text-center"
        >
          <div className="flex items-center justify-center gap-2 text-xs text-gray-400">
            <ShieldCheck className="w-3 h-3" />
            <span>Your information is protected with bank-grade encryption</span>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}