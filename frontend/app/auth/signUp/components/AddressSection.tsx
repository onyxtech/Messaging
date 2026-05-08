'use client';

import { useState } from 'react';
import { useFormContext } from 'react-hook-form';
import {
  MapPin, Globe, CreditCard, Building2, Home, CheckCircle2, AlertCircle,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { RegisterFormValues } from '../../schema/registerSchema';
import { FormInput } from '../../components/FormInput';
import { useGooglePlacesAutocomplete } from '../hooks/useGooglePlacesAutocomplete';

interface AddressSectionProps {
  isGoogleMapsLoaded: boolean;
}

export function AddressSection({ isGoogleMapsLoaded }: AddressSectionProps) {
  const { setValue, formState: { errors }, watch } = useFormContext<RegisterFormValues>();
  const [isFocused, setIsFocused] = useState(false);
  const showDetailed = watch('showDetailedAddress') || false;
  const lat = watch('latitude');
  const lng = watch('longitude');
  const locationVerified = lat !== 0 || lng !== 0;

  useGooglePlacesAutocomplete(setValue, isGoogleMapsLoaded);

  return (
    <div className="space-y-4">
      {/* Section header */}
      <div className="flex items-center gap-2.5 pb-3 border-b border-gray-100">
        <div className="w-7 h-7 rounded-lg bg-teal-50 flex items-center justify-center">
          <MapPin className="w-3.5 h-3.5 text-teal-600" />
        </div>
        <h3 className="text-sm font-semibold text-gray-800 tracking-wide">
          Business Address
        </h3>
      </div>

      {/* Street address — Google Places attaches to id="address" */}
      <div className="space-y-1.5">
        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider">
          Street Address <span className="text-red-500 normal-case">*</span>
        </label>
        <div className={`relative transition-all duration-200 ${isFocused ? 'scale-[1.005]' : 'scale-100'}`}>
          <div className="absolute left-3.5 inset-y-0 flex items-center pointer-events-none z-10">
            <Home className={`w-4 h-4 transition-colors ${errors.companyAddress ? 'text-red-400' : isFocused ? 'text-blue-500' : 'text-gray-400'}`} />
          </div>
          <input
            id="address"
            type="text"
            placeholder="Start typing your business address…"
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            onChange={(e) => setValue('companyAddress', e.target.value)}
            className={`w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border outline-none transition-all bg-white shadow-sm
              ${errors.companyAddress
                ? 'border-red-300 ring-2 ring-red-100'
                : 'border-gray-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-500/15'
              }`}
          />
        </div>
        {errors.companyAddress && (
          <p className="text-red-500 text-xs flex items-center gap-1">
            <AlertCircle className="w-3 h-3" /> {errors.companyAddress.message}
          </p>
        )}
        <p className="text-gray-400 text-xs flex items-center gap-1">
          <Globe className="w-3 h-3" /> Powered by Google Places
        </p>
      </div>

      {/* Auto-filled fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormInput
          label="Country"
          name="country"
          readOnly
          icon={Globe}
          helperText="Auto-detected from address"
        />
        <FormInput
          label="ZIP / Postal Code"
          name="zipCode"
          readOnly
          icon={CreditCard}
          helperText="Auto-detected from address"
        />
      </div>

      {/* Toggle + verified badge */}
      <div className="flex items-center justify-between">
        <label className="flex items-center gap-2 cursor-pointer group">
          <input
            type="checkbox"
            checked={showDetailed}
            onChange={(e) => setValue('showDetailedAddress', e.target.checked)}
            className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          <span className="text-xs text-gray-500 group-hover:text-gray-700 transition-colors">
            Add suite, floor or landmark
          </span>
        </label>
        {locationVerified && (
          <div className="flex items-center gap-1 text-emerald-600 text-xs">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Location pinned
          </div>
        )}
      </div>

      {/* Collapsible detailed fields */}
      <AnimatePresence>
        {showDetailed && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div className="pt-1 space-y-3 border-t border-gray-100">
              <p className="text-xs font-medium text-gray-500 pt-2">Additional details</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <FormInput
                  label="Suite / Unit / Floor"
                  name="suiteNumber"
                  placeholder="Suite 4B, Floor 3"
                  icon={Building2}
                />
                <FormInput
                  label="Landmark"
                  name="landmark"
                  placeholder="Near City Center Mall"
                  icon={MapPin}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <FormInput label="Latitude" name="latitude" readOnly icon={Globe} />
                <FormInput label="Longitude" name="longitude" readOnly icon={Globe} />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}