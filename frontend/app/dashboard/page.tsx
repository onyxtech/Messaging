"use client";
import { useBrand } from "@/hooks/useBrand";
import { useAuthStore } from "@/store/authStore";
import { useEffect } from "react"

const Page = () => {
    const brand = useBrand();
  const shop = useAuthStore((s) => s.shop);
  
  useEffect(() => {
    console.log("Shop with colors:", shop);
    console.log("Brand colors from hook:", brand.colors);
    console.log("CSS Variables:", {
      primary: getComputedStyle(document.documentElement).getPropertyValue('--brand-primary'),
      secondary: getComputedStyle(document.documentElement).getPropertyValue('--brand-secondary'),
      accent: getComputedStyle(document.documentElement).getPropertyValue('--brand-accent'),
    });
  }, [shop, brand]);
  return (
    <div className="min-h-screen">
      {/* Hero Section - Using full gradient background */}
      <section 
        style={{ background: brand.gradients.full }}
        className="relative overflow-hidden"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
          <div className="text-center">
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
              Welcome to Our
              <br />
              <span style={brand.textAccent}>Modern Platform</span>
            </h1>
            <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-2xl mx-auto">
              Experience the future of digital solutions with our cutting-edge technology
            </p>
            <div className="flex gap-4 justify-center flex-wrap">
              <button className={brand.btnGradient + " px-8 py-3 rounded-lg font-semibold shadow-lg"}>
                Get Started
              </button>
              <button 
                style={brand.solidPrimary}
                className="px-8 py-3 rounded-lg font-semibold shadow-lg hover:opacity-90 transition-opacity text-white"
              >
                Learn More
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section - Using soft gradient background */}
      <section style={{ background: brand.gradients.soft }} className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4" style={brand.textPrimary}>
              Powerful Features
            </h2>
            <p className="text-gray-600 dark:text-gray-300 text-lg max-w-2xl mx-auto">
              Everything you need to succeed in one platform
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { title: "Fast Performance", desc: "Lightning fast response times" },
              { title: "Secure Data", desc: "Enterprise-grade security" },
              { title: "24/7 Support", desc: "Always here to help you" }
            ].map((feature, idx) => (
              <div 
                key={idx}
                style={brand.softPrimary(0.05)}
                className="p-6 rounded-xl backdrop-blur-sm border"
                style={{ ...brand.borderPrimary, borderWidth: '1px' }}
              >
                <h3 className="text-xl font-semibold mb-2" style={brand.textSecondary}>
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            {[
              { number: "10K+", label: "Active Users" },
              { number: "99.9%", label: "Uptime" },
              { number: "24/7", label: "Support" },
              { number: "5★", label: "Rating" }
            ].map((stat, idx) => (
              <div key={idx}>
                <div className="text-4xl font-bold mb-2" style={brand.textPrimary}>
                  {stat.number}
                </div>
                <div className="text-gray-600 dark:text-gray-300">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section style={{ background: brand.gradients.reverse }} className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Simple Pricing
            </h2>
            <p className="text-white/90 text-lg">
              Choose the plan that works for you
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { name: "Basic", price: "$29", period: "/month", popular: false },
              { name: "Pro", price: "$79", period: "/month", popular: true },
              { name: "Enterprise", price: "Custom", period: "", popular: false }
            ].map((plan, idx) => (
              <div 
                key={idx}
                className="bg-white dark:bg-gray-900 rounded-xl p-6 shadow-xl relative"
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <span className={brand.badgeAccent + " px-4 py-1 rounded-full text-sm font-semibold"}>
                      Most Popular
                    </span>
                  </div>
                )}
                <h3 className="text-2xl font-bold mb-2" style={brand.textPrimary}>
                  {plan.name}
                </h3>
                <div className="mb-4">
                  <span className="text-4xl font-bold">{plan.price}</span>
                  <span className="text-gray-500">{plan.period}</span>
                </div>
                <ul className="space-y-2 mb-6">
                  <li className="text-gray-600 dark:text-gray-300">✓ Core Features</li>
                  <li className="text-gray-600 dark:text-gray-300">✓ Basic Support</li>
                  <li className="text-gray-600 dark:text-gray-300">✓ 5GB Storage</li>
                </ul>
                <button className={plan.popular ? brand.btnGradient : brand.btnPrimary + " w-full py-2 rounded-lg font-semibold"}>
                  Get Started
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto text-center px-4">
          <div 
            className="rounded-2xl p-12"
            style={{ background: brand.gradients.primaryToSecondary }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Ready to Get Started?
            </h2>
            <p className="text-white/90 text-lg mb-8">
              Join thousands of satisfied customers today
            </p>
            <div className="flex gap-4 justify-center">
              <button className="bg-white px-8 py-3 rounded-lg font-semibold" style={brand.textPrimary}>
                Start Free Trial
              </button>
              <button className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white/10 transition">
                Contact Sales
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-12" style={brand.borderPrimary}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-gray-600 dark:text-gray-400">
              © 2024 Your Company. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Page;