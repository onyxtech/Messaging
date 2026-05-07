'use client';

import { Lock, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { useFormContext } from 'react-hook-form';
import { RegisterFormValues } from '../../schema/registerSchema';
import { FormInput } from '../../components/FormInput';

interface SecuritySectionProps {
  showPassword: boolean;
  showConfirmPassword: boolean;
  onTogglePassword: () => void;
  onToggleConfirmPassword: () => void;
}

export function SecuritySection({
  showPassword,
  showConfirmPassword,
  onTogglePassword,
  onToggleConfirmPassword,
}: SecuritySectionProps) {
  const { register, formState: { errors } } = useFormContext<RegisterFormValues>();

  return (
    <div className="space-y-4">
      {/* Section header */}
      <div className="flex items-center gap-2.5 pb-3 border-b border-gray-100">
        <div className="w-7 h-7 rounded-lg bg-rose-50 flex items-center justify-center">
          <Lock className="w-3.5 h-3.5 text-rose-600" />
        </div>
        <h3 className="text-sm font-semibold text-gray-800 tracking-wide">
          Security
        </h3>
      </div>

      {/* Password fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormInput
          label="Password"
          name="password"
          type={showPassword ? 'text' : 'password'}
          placeholder="Min. 6 characters"
          required
          icon={Lock}
          rightIcon={showPassword ? EyeOff : Eye}
          onRightIconClick={onTogglePassword}
          helperText="Use letters and numbers"
        />
        <FormInput
          label="Confirm Password"
          name="confirmPassword"
          type={showConfirmPassword ? 'text' : 'password'}
          placeholder="Re-enter your password"
          required
          icon={Lock}
          rightIcon={showConfirmPassword ? EyeOff : Eye}
          onRightIconClick={onToggleConfirmPassword}
        />
      </div>

      {/* Terms */}
      <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl border border-gray-100">
        <input
          type="checkbox"
          {...register('termsSelected')}
          id="terms"
          className="mt-0.5 w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 flex-shrink-0"
        />
        <div>
          <label htmlFor="terms" className="text-sm text-gray-600 leading-relaxed cursor-pointer">
            By registering, you agree to our{' '}
            <span className="text-blue-600 font-medium hover:underline cursor-pointer">
              Terms of Service
            </span>{' '}
            and{' '}
            <span className="text-blue-600 font-medium hover:underline cursor-pointer">
              Privacy Policy
            </span>
            <span className="text-red-500 ml-1">*</span>
          </label>
          {errors.termsSelected && (
            <p className="text-red-500 text-xs mt-1.5 flex items-center gap-1">
              <AlertCircle className="w-3 h-3" />
              {errors.termsSelected.message}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}