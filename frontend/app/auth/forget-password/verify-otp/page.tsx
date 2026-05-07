"use client";

import { useState, useEffect } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { motion } from "framer-motion";
import { ShieldCheck, ArrowLeft, KeyRound, AlertCircle, Clock } from "lucide-react";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { FormInput } from "../../components/FormInput";
import { Button } from "@/components/ui/Button";

import { verifyOTPSchema, VerifyOTPFormValues } from "../../schema/verifyOTPSchema"


export default function VerifyOTPPage() {
  const [email, setEmail] = useState<string>('');
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes in seconds
  const router = useRouter();

  const methods = useForm<VerifyOTPFormValues>({
    resolver: zodResolver(verifyOTPSchema),
    defaultValues: {
      otp: '',
    },
  });

  const { handleSubmit } = methods;

  useEffect(() => {
    const storedEmail = localStorage.getItem('resetEmail');
    if (!storedEmail) {
      router.push('/auth/forget-password');
    } else {
      setEmail(storedEmail);
    }

    // Timer countdown
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          toast.error('OTP expired. Please request a new one.');
          router.push('/auth/forget-password');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [router]);

  // Format time
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Verify OTP Mutation
//   const verifyOTPMutation = useMutation({
//     mutationFn: ({ email, otp }: { email: string; otp: string }) => 
//       verifyOTP(email, otp),
//     onSuccess: () => {
//       toast.success('OTP verified successfully!');
//       router.push('/auth/forget-password/update-password');
//     },
//     onError: (error: any) => {
//       toast.error(error.message || 'Invalid OTP. Please try again.');
//     },
//   });

  const onSubmit = async (data: VerifyOTPFormValues) => {
    // verifyOTPMutation.mutate({ email, otp: data.otp });
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
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Verify OTP</h1>
              <p className="text-sm text-gray-500">
                We've sent a 6-digit verification code to
              </p>
              <p className="text-sm font-semibold text-gray-700 mt-1">{email}</p>
            </div>

            {/* Timer Display */}
            <div className="flex items-center justify-center gap-2 mb-6">
              <Clock className="w-4 h-4 text-orange-500" />
              <span className="text-sm font-medium text-gray-700">
                OTP expires in: <span className="text-orange-600 font-bold">{formatTime(timeLeft)}</span>
              </span>
            </div>

            <FormProvider {...methods}>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* OTP Input */}
                <FormInput
                  label="6-Digit OTP"
                  name="otp"
                  type="text"
                  placeholder="000000"
                  required
                  helperText="Enter the 6-digit code sent to your email"
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
                      <p className="text-xs font-semibold text-blue-900">Didn't receive the code?</p>
                      <p className="text-xs text-blue-700 leading-relaxed">
                        Check your spam folder or{' '}
                        <button
                          type="button"
                          onClick={() => router.push('/auth/forget-password')}
                          className="text-blue-600 font-medium hover:underline"
                        >
                          request a new OTP
                        </button>
                      </p>
                    </div>
                  </div>
                </motion.div>

                {/* Submit Button */}
                <Button
                  type="submit"
                //   isLoading={verifyOTPMutation.isPending}
                  variant="primary"
                  fullWidth={true}
                >
                  Verify & Continue
                </Button>

                {/* Back Button */}
                <div className="text-center pt-4">
                  <button
                    type="button"
                    onClick={() => router.push('/auth/forget-password')}
                    className="text-sm text-gray-500 hover:text-gray-700 transition inline-flex items-center gap-1"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Back to Forgot Password
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
            <span>Secure verification process</span>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}