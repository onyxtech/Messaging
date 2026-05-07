import React from 'react'
import {
  MessageCircle, ShieldCheck, Zap, TrendingUp,
  Award 
} from 'lucide-react';
const LeftSection = () => {
  return (
     <aside className="hidden lg:flex flex-col w-[360px] flex-shrink-0 bg-gradient-to-b from-slate-900 to-slate-800 text-white p-10 relative overflow-hidden">
        {/* Ambient glow */}
        <div className="absolute -top-20 -left-20 w-60 h-60 bg-blue-600/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-16 -right-12 w-44 h-44 bg-indigo-600/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center gap-3 mb-12">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg">
              <MessageCircle className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="text-lg font-bold tracking-tight">Messaging SaaS</span>
              <p className="text-white/50 text-xs">Enterprise Communication</p>
            </div>
          </div>

          {/* Hero */}
          <div className="mb-10">
            <h1 className="text-3xl font-bold leading-tight mb-3">
              Modern messaging for{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">
                modern business
              </span>
            </h1>
            <p className="text-slate-400 text-sm leading-relaxed">
              Join thousands of businesses using our platform to streamline
              communication and deliver exceptional experiences.
            </p>
          </div>

          {/* Features */}
          <div className="space-y-3 mb-auto">
            {[
              { icon: ShieldCheck, label: 'Enterprise-grade security', color: 'text-emerald-400' },
              { icon: Zap, label: 'Lightning-fast delivery', color: 'text-amber-400' },
              { icon: TrendingUp, label: 'Advanced analytics', color: 'text-blue-400' },
              { icon: Award, label: '99.9% uptime guarantee', color: 'text-violet-400' },
            ].map(({ icon: Icon, label, color }) => (
              <div key={label} className="flex items-center gap-3 text-sm text-slate-300">
                <Icon className={`w-4 h-4 flex-shrink-0 ${color}`} />
                <span>{label}</span>
              </div>
            ))}
          </div>

          {/* Footer */}
          <div className="pt-6 border-t border-white/10">
            <p className="text-xs text-slate-500 text-center">
              Secure & Encrypted · GDPR Compliant · 24/7 Support
            </p>
          </div>
        </div>
      </aside>

  )
}

export default LeftSection