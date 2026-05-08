// app/verify-email/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { CheckCircle2, XCircle, Loader2, Mail } from 'lucide-react';
import { motion } from 'framer-motion';

export default function VerifyEmailPage() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
    const [message, setMessage] = useState('');

    useEffect(() => {
        const token = searchParams.get('token');
        const email = searchParams.get('email');

        console.log('Verification params:', { token, email });

        if (!token || !email) {
            setStatus('error');
            setMessage('Invalid verification link');
            return;
        }

        // Call backend verification API
        fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/verify-email?token=${token}&email=${email}`)
            .then(async (res) => {
                if (res.redirected) {
                    // If backend redirects, follow the redirect
                    window.location.href = res.url;
                    return;
                }
                
                const data = await res.json();
                if (res.ok) {
                    setStatus('success');
                    setMessage(data.message || 'Email verified successfully!');
                    setTimeout(() => {
                        router.push('/auth/signIn?verified=true');
                    }, 3000);
                } else {
                    throw new Error(data.message || 'Verification failed');
                }
            })
            .catch((err) => {
                console.error('Verification error:', err);
                setStatus('error');
                setMessage(err.message || 'Verification failed. Please try again.');
            });
    }, [searchParams, router]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 p-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-md w-full bg-white rounded-2xl shadow-xl overflow-hidden"
            >
                {status === 'loading' && (
                    <div className="p-8 text-center">
                        <div className="w-20 h-20 mx-auto mb-6 relative">
                            <div className="absolute inset-0 bg-blue-100 rounded-full animate-ping"></div>
                            <div className="relative bg-blue-500 rounded-full w-20 h-20 flex items-center justify-center">
                                <Loader2 className="w-10 h-10 text-white animate-spin" />
                            </div>
                        </div>
                        <h2 className="text-2xl font-bold mb-2">Verifying Your Email</h2>
                        <p className="text-gray-600">Please wait while we verify your email address...</p>
                    </div>
                )}

                {status === 'success' && (
                    <>
                        <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-8 text-center">
                            <div className="inline-flex items-center justify-center w-20 h-20 bg-white rounded-full mb-4">
                                <CheckCircle2 className="w-10 h-10 text-green-500" />
                            </div>
                            <h2 className="text-2xl font-bold text-white mb-2">Email Verified! 🎉</h2>
                        </div>
                        <div className="p-8 text-center">
                            <p className="text-gray-700 mb-6">{message}</p>
                            <p className="text-sm text-gray-500">Redirecting to login page...</p>
                        </div>
                    </>
                )}

                {status === 'error' && (
                    <>
                        <div className="bg-gradient-to-r from-red-500 to-rose-600 p-8 text-center">
                            <div className="inline-flex items-center justify-center w-20 h-20 bg-white rounded-full mb-4">
                                <XCircle className="w-10 h-10 text-red-500" />
                            </div>
                            <h2 className="text-2xl font-bold text-white mb-2">Verification Failed</h2>
                        </div>
                        <div className="p-8 text-center">
                            <p className="text-red-600 mb-6">{message}</p>
                            <button
                                onClick={() => router.push('/auth/signin')}
                                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                            >
                                Go to Login
                            </button>
                        </div>
                    </>
                )}
            </motion.div>
        </div>
    );
}