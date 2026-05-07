"use client";

import { useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "framer-motion";
import { Mail, ArrowRight, ShieldCheck, Send, KeyRound, AlertCircle } from "lucide-react";
import { useModal } from "@/contexts/ModalContext";
import MessageCard from "@/components/ui/MessageCard";
import { FormInput } from "../components/FormInput";
import { Button } from "@/components/ui/Button";
import { redirect } from "next/navigation";
import toast from "react-hot-toast";
import { resetPasswordSchema, ResetPasswordFormValues } from "../schema/resetPasswordSchema"



// ---------- Main Component ----------
export default function ResetPassword() {
  const [isLoading, setIsLoading] = useState(false);
  const { openModal, closeModal } = useModal();

  const methods = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      email: '',
    },
  });

  const { handleSubmit, formState: { errors } } = methods;

  const onCloseModal = () => {
    closeModal();
    redirect('/auth/resetpasswordrequestsent');
  };

  const onSubmit = async (data: ResetPasswordFormValues) => {
    setIsLoading(true);
    
    try {
      // Here you would call your API to send reset password email
      console.log('Reset password request for email:', data.email);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Show success modal before redirect
      openModal(
        <MessageCard
          subject="Reset Link Sent!"
          message={`We've sent a password reset link to ${data.email}. Please check your email inbox and follow the instructions to reset your password.`}
          onClickBtn={onCloseModal}
          btnText="Continue"
          variant="success"
          onClose={onCloseModal}
        />
      );
      
      toast.success('Reset link sent to your email!');
    } catch (error: any) {
      console.error("Reset password error:", error);
      
      openModal(
        <MessageCard
          subject="Request Failed"
          message={error.message || "Failed to send reset link. Please try again."}
          onClickBtn={closeModal}
          btnText="Try Again"
          variant="error"
          onClose={closeModal}
        />
      );
      
      toast.error(error.message || "Failed to send reset link. Please try again.");
    } finally {
      setIsLoading(false);
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
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Reset Password</h1>
              <p className="text-sm text-gray-500">
                Enter your registered email address and we'll send you a link to reset your password.
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
                  helperText="We'll send a reset link to this email"
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
                        You will receive a password reset link via email. This link will expire in 24 hours for security reasons.
                      </p>
                    </div>
                  </div>
                </motion.div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  isLoading={isLoading}
                  variant="primary"
                  icon={isLoading ? undefined : Send}
                  fullWidth={true}
                >
                  {isLoading ? 'Sending...' : 'Send Reset Link'}
                </Button>

                {/* Back to Login Link */}
                <div className="text-center pt-4">
                  <button
                    type="button"
                    onClick={() => redirect('/auth/signIn')}
                    className="text-sm text-gray-500 hover:text-gray-700 transition inline-flex items-center gap-1"
                  >
                    ← Back to Login
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