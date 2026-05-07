"use client";

import { useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { Lock, Eye, EyeOff, ShieldCheck, Key, CheckCircle2, ArrowRight } from "lucide-react";
import { useModal } from "@/contexts/ModalContext";
import MessageCard from "@/components/ui/MessageCard";
import { FormInput } from "../components/FormInput";
import { Button } from "../components/Button";
// import group from '../../../assets/group.png';
import { redirect } from "next/navigation";
import toast from "react-hot-toast";
import { changePasswordSchema, ChangePasswordFormValues} from "../schema/changePasswordSchema"



// ---------- Main Component ----------
export default function ChangePassword() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { openModal, closeModal } = useModal();

  const methods = useForm<ChangePasswordFormValues>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      password: '',
      confirmPassword: '',
    },
  });

  const { handleSubmit, formState: { errors } } = methods;

  const onClickBtn = () => {
    closeModal();
    redirect('/auth/signIn');
  };

  const onSubmit = async (data: ChangePasswordFormValues) => {
    setIsLoading(true);
    
    try {
      // Here you would call your API to update the password
      console.log('Password:', data.password);
      console.log('Confirm Password:', data.confirmPassword);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      openModal(
        <MessageCard
        //   image={group}
          subject={"Password Updated"}
          message={"We have updated your password. Please click on login to access your account."}
          onClickBtn={onClickBtn}
          btnText={"Login"}
        />
      );
      
      toast.success('Password updated successfully!');
    } catch (error: any) {
      console.error("Password update error:", error);
      toast.error(error.message || "Failed to update password. Please try again.");
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
                <Key className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Create new password</h1>
              <p className="text-sm text-gray-500">
                Please enter a new password. Your new password must be different from your previous password.
              </p>
            </div>

            <FormProvider {...methods}>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                {/* New Password Field */}
                <FormInput
                  label="New Password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your new password"
                  required
                  icon={Lock}
                  rightIcon={showPassword ? EyeOff : Eye}
                  onRightIconClick={() => setShowPassword(!showPassword)}
                  helperText="Minimum 6 characters, 1 uppercase letter, 1 number"
                />

                {/* Confirm Password Field */}
                <FormInput
                  label="Confirm Password"
                  name="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="Confirm your new password"
                  required
                  icon={Lock}
                  rightIcon={showConfirmPassword ? EyeOff : Eye}
                  onRightIconClick={() => setShowConfirmPassword(!showConfirmPassword)}
                />

                {/* Password Requirements */}
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 space-y-2">
                  <p className="text-xs font-semibold text-gray-700 mb-2">Password Requirements:</p>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-xs text-gray-600">
                      <div className="w-4 h-4 rounded-full bg-green-100 flex items-center justify-center">
                        <CheckCircle2 className="w-3 h-3 text-green-600" />
                      </div>
                      <span>At least 6 characters long</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-600">
                      <div className="w-4 h-4 rounded-full bg-green-100 flex items-center justify-center">
                        <CheckCircle2 className="w-3 h-3 text-green-600" />
                      </div>
                      <span>Contains at least 1 uppercase letter</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-600">
                      <div className="w-4 h-4 rounded-full bg-green-100 flex items-center justify-center">
                        <CheckCircle2 className="w-3 h-3 text-green-600" />
                      </div>
                      <span>Contains at least 1 number</span>
                    </div>
                  </div>
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  isLoading={isLoading}
                  variant="primary"
                  icon={ArrowRight}
                  fullWidth={true}
                >
                  Reset Password
                </Button>

                {/* Back to Login Link */}
                <div className="text-center pt-4">
                  <button
                    type="button"
                    onClick={() => redirect('/auth/signIn')}
                    className="text-sm text-gray-500 hover:text-gray-700 transition"
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
            <span>Secure password storage with encryption</span>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}