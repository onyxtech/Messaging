'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { CheckCircle2, Mail, Clock, AlertCircle, X, ArrowRight, Sparkles } from 'lucide-react';
import { useState, useEffect } from 'react';

interface RegistrationSuccessCardProps {
    email: string;
    companyName: string;
    onClose: () => void;
    onResendEmail: () => Promise<void>;
}

export function RegistrationSuccessCard({ 
    email, 
    companyName, 
    onClose, 
    onResendEmail 
}: RegistrationSuccessCardProps) {
    const [countdown, setCountdown] = useState(30);
    const [canResend, setCanResend] = useState(false);
    const [isResending, setIsResending] = useState(false);
    const [showResendSuccess, setShowResendSuccess] = useState(false);
    const [isRedirecting, setIsRedirecting] = useState(false);

    useEffect(() => {
        if (countdown > 0) {
            const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
            return () => clearTimeout(timer);
        } else {
            setCanResend(true);
        }
    }, [countdown]);

    const handleResendEmail = async () => {
        if (!canResend || isResending) return;
        
        setIsResending(true);
        try {
            await onResendEmail();
            setShowResendSuccess(true);
            setCountdown(30);
            setCanResend(false);
            setTimeout(() => setShowResendSuccess(false), 3000);
        } catch (error) {
            console.error('Resend failed:', error);
        } finally {
            setIsResending(false);
        }
    };

    const handleOpenEmail = () => {
        window.location.href = `mailto:${email}`;
    };

    const handleContinue = () => {
        setIsRedirecting(true);
        setTimeout(() => {
            onClose();
        }, 500);
    };

    return (
        <>
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: 20 }}
                    className="relative max-w-md w-full bg-white rounded-2xl shadow-2xl overflow-hidden"
                >
                    {/* Close button */}
                    <button
                        onClick={handleContinue}
                        className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-gray-100 transition-colors z-10"
                    >
                        <X className="w-4 h-4 text-gray-500" />
                    </button>

                    {/* Success Header with Gradient */}
                    <div className="relative bg-gradient-to-br from-green-500 via-emerald-500 to-teal-600 px-6 py-8 text-center">
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
                        >
                            <div className="inline-flex items-center justify-center w-20 h-20 bg-white rounded-full mb-4 shadow-lg">
                                <CheckCircle2 className="w-10 h-10 text-green-500" />
                            </div>
                        </motion.div>
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                        >
                            <h2 className="text-2xl font-bold text-white mb-2">
                                Welcome to {companyName}! 🎉
                            </h2>
                            <p className="text-green-100 text-sm">
                                Your account has been created successfully
                            </p>
                        </motion.div>
                        
                        {/* Decorative sparkles */}
                        <div className="absolute top-4 left-4 opacity-20">
                            <Sparkles className="w-8 h-8 text-white" />
                        </div>
                        <div className="absolute bottom-4 right-4 opacity-20">
                            <Sparkles className="w-6 h-6 text-white" />
                        </div>
                    </div>

                    {/* Content */}
                    <div className="p-6">
                        {/* Email Info */}
                        <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl">
                            <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">
                                Verification email sent to
                            </p>
                            <p className="text-sm font-semibold text-gray-900 break-all">
                                {email}
                            </p>
                        </div>

                        {/* Instructions */}
                        <div className="space-y-3 mb-6">
                            <div className="flex items-start gap-3 p-3 bg-blue-50/50 rounded-lg">
                                <div className="flex-shrink-0 w-7 h-7 bg-blue-100 rounded-full flex items-center justify-center">
                                    <Mail className="w-3.5 h-3.5 text-blue-600" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-sm text-gray-900">Check your inbox</h3>
                                    <p className="text-xs text-gray-600">
                                        We've sent a verification link to your email address
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start gap-3 p-3 bg-amber-50/50 rounded-lg">
                                <div className="flex-shrink-0 w-7 h-7 bg-amber-100 rounded-full flex items-center justify-center">
                                    <Clock className="w-3.5 h-3.5 text-amber-600" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-sm text-gray-900">24 hours to verify</h3>
                                    <p className="text-xs text-gray-600">
                                        The verification link expires in 24 hours for security
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="space-y-3">
                            <button
                                onClick={handleOpenEmail}
                                className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-blue-800 transition-all transform hover:scale-[1.02] flex items-center justify-center gap-2 shadow-md"
                            >
                                <Mail className="w-4 h-4" />
                                Open Email Client
                                <ArrowRight className="w-4 h-4" />
                            </button>

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
                                        <AlertCircle className="w-4 h-4" />
                                        {canResend 
                                            ? 'Resend Verification Email' 
                                            : `Resend available in ${countdown}s`
                                        }
                                    </>
                                )}
                            </button>
                        </div>

                        {/* Tips */}
                        <div className="mt-4 p-3 bg-amber-50 rounded-lg border border-amber-100">
                            <p className="text-xs text-amber-800 flex items-start gap-2">
                                <span className="text-sm">💡</span>
                                <span>Check your spam folder if you don't see the email within a few minutes</span>
                            </p>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="px-6 py-3 bg-gray-50 border-t border-gray-100">
                        <button
                            onClick={handleContinue}
                            disabled={isRedirecting}
                            className="w-full text-gray-600 hover:text-gray-800 text-sm font-medium py-2 transition-colors"
                        >
                            {isRedirecting ? 'Redirecting...' : 'Continue to Login →'}
                        </button>
                    </div>
                </motion.div>
            </div>

            {/* Resend Success Toast */}
            <AnimatePresence>
                {showResendSuccess && (
                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 50 }}
                        className="fixed bottom-4 right-4 z-50 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg flex items-center gap-2"
                    >
                        <CheckCircle2 className="w-4 h-4" />
                        Verification email resent successfully!
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}