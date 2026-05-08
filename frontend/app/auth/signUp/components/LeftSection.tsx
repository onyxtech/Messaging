// app/register/components/LeftSection.tsx
'use client';

import React from 'react';
import { MessageCircle, ShieldCheck, Zap, TrendingUp, Award, Sparkles } from 'lucide-react';

interface LeftSectionProps {
  primaryColor?: string;
  secondaryColor?: string;
  accentColor?: string;
}

const LeftSection: React.FC<LeftSectionProps> = ({ 
  primaryColor = '#1e293b', 
  secondaryColor = '#3b82f6', 
  accentColor = '#8b5cf6' 
}) => {
  const gradientStyle = `linear-gradient(135deg, ${primaryColor} 0%, ${secondaryColor} 50%, ${accentColor} 100%)`;
  
  return (
    <aside className="hidden lg:flex flex-col w-[380px] flex-shrink-0 text-white p-8 relative overflow-hidden" style={{ background: gradientStyle }}>
      {/* Ambient glow */}
      <div className="absolute -top-20 -left-20 w-60 h-60 bg-white/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-16 -right-12 w-44 h-44 bg-white/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-white/5 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col h-full">
        {/* Logo */}
        <div className="flex items-center gap-3 mb-12">
          <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center shadow-lg border border-white/20">
            <MessageCircle className="w-5 h-5 text-white" />
          </div>
          <div>
            <span className="text-lg font-bold tracking-tight">Messaging SaaS</span>
            <p className="text-white/70 text-xs">Enterprise Communication</p>
          </div>
        </div>

        {/* Hero */}
        <div className="mb-10">
          <div className="mb-4">
            <div className="inline-flex items-center gap-1 bg-white/20 backdrop-blur-sm rounded-full px-3 py-1 text-xs font-medium">
              <Sparkles className="w-3 h-3" />
              New
            </div>
          </div>
          <h1 className="text-3xl font-bold leading-tight mb-3">
            Modern messaging for{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-white/80">
              modern business
            </span>
          </h1>
          <p className="text-white/70 text-sm leading-relaxed">
            Join thousands of businesses using our platform to streamline
            communication and deliver exceptional experiences.
          </p>
        </div>

        {/* Features */}
        <div className="space-y-3 mb-auto">
          {[
            { icon: ShieldCheck, label: 'Enterprise-grade security', color: 'text-emerald-300' },
            { icon: Zap, label: 'Lightning-fast delivery', color: 'text-amber-300' },
            { icon: TrendingUp, label: 'Advanced analytics', color: 'text-blue-300' },
            { icon: Award, label: '99.9% uptime guarantee', color: 'text-violet-300' },
          ].map(({ icon: Icon, label, color }) => (
            <div key={label} className="flex items-center gap-3 text-sm text-white/80">
              <Icon className={`w-4 h-4 flex-shrink-0 ${color}`} />
              <span>{label}</span>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="pt-6 border-t border-white/20 mt-8">
          <p className="text-xs text-white/60 text-center">
            Secure & Encrypted · GDPR Compliant · 24/7 Support
          </p>
        </div>
      </div>
    </aside>
  );
};

export default LeftSection;