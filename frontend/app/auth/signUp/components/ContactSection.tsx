'use client';

import { User, Mail, Smartphone, Phone } from 'lucide-react';
import { FormInput } from '../../components/FormInput';

export function ContactSection() {
  return (
    <div className="space-y-4">
      {/* Section header */}
      <div className="flex items-center gap-2.5 pb-3 border-b border-gray-100">
        <div className="w-7 h-7 rounded-lg bg-violet-50 flex items-center justify-center">
          <User className="w-3.5 h-3.5 text-violet-600" />
        </div>
        <h3 className="text-sm font-semibold text-gray-800 tracking-wide">
          Contact Information
        </h3>
      </div>

      {/* Name row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <FormInput
          label="First Name"
          name="firstName"
          placeholder="John"
          required
          icon={User}
        />
        <FormInput
          label="Middle Name"
          name="middleName"
          placeholder="A."
          icon={null}
        />
        <FormInput
          label="Last Name"
          name="lastName"
          placeholder="Doe"
          icon={null}
        />
      </div>

      {/* Email + Mobile row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormInput
          label="Email Address"
          name="emailId"
          type="email"
          placeholder="you@company.com"
          required
          icon={Mail}
        />
        <FormInput
          label="Mobile Number"
          name="mobileNumber"
          placeholder="+1 234 567 8900"
          required
          icon={Smartphone}
        />
      </div>

      {/* Optional phone */}
      <FormInput
        label="Phone Number"
        name="phoneNumber"
        placeholder="+1 234 567 8900 (optional)"
        icon={Phone}
      />
    </div>
  );
}