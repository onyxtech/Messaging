// app/register/components/AddressSection.tsx
'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useFormContext } from 'react-hook-form';
import {
  MapPin, Globe, CreditCard, Building2, Home, CheckCircle2, AlertCircle, Search, Loader2,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { RegisterFormValues } from '../../schema/registerSchema';
import { FormInput } from '../../components/FormInput';

interface AddressSectionProps {
  isGoogleMapsLoaded: boolean;
}

declare global {
  interface Window {
    google: any;
    initAutocomplete: () => void;
  }
}

export function AddressSection({ isGoogleMapsLoaded }: AddressSectionProps) {
  const { setValue, formState: { errors }, watch } = useFormContext<RegisterFormValues>();
  const [isFocused, setIsFocused] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [autocompleteReady, setAutocompleteReady] = useState(false);
  
  const showDetailed = watch('showDetailedAddress') || false;
  const lat = watch('latitude');
  const lng = watch('longitude');
  const locationVerified = (lat !== 0 && lat !== null && lat !== undefined && lat !== '0') || 
                          (lng !== 0 && lng !== null && lng !== undefined && lng !== '0');
  
  const autocompleteRef = useRef<any>(null);
  const addressInputRef = useRef<HTMLInputElement>(null);

  // Initialize Google Places Autocomplete
  const initAutocomplete = useCallback(() => {
    if (!isGoogleMapsLoaded || !window.google || !window.google.maps || !window.google.maps.places) {
      console.log('Google Maps Places not available yet');
      return;
    }

    const input = addressInputRef.current;
    if (!input) return;

    try {
      // Create autocomplete with enhanced options
      autocompleteRef.current = new window.google.maps.places.Autocomplete(input, {
        types: ['geocode', 'establishment'],
        componentRestrictions: { country: [] },
        fields: ['address_components', 'geometry', 'formatted_address', 'name', 'place_id']
      });

      // Add place_changed listener
      autocompleteRef.current.addListener('place_changed', () => {
        const place = autocompleteRef.current.getPlace();
        
        if (!place || !place.geometry || !place.geometry.location) {
          console.log('No valid place selected');
          return;
        }

        setIsVerifying(true);

        // Extract address components
        let streetNumber = '';
        let route = '';
        let locality = '';
        let administrativeAreaLevel1 = '';
        let country = '';
        let postalCode = '';

        if (place.address_components) {
          for (const component of place.address_components) {
            const types = component.types;
            
            if (types.includes('street_number')) {
              streetNumber = component.long_name;
            }
            if (types.includes('route')) {
              route = component.long_name;
            }
            if (types.includes('locality')) {
              locality = component.long_name;
            }
            if (types.includes('administrative_area_level_1')) {
              administrativeAreaLevel1 = component.long_name;
            }
            if (types.includes('country')) {
              country = component.long_name;
            }
            if (types.includes('postal_code')) {
              postalCode = component.long_name;
            }
          }
        }

        // Construct full address
        const fullAddress = place.formatted_address || 
          `${streetNumber} ${route}, ${locality}, ${administrativeAreaLevel1}, ${country}`;

        // Set form values
        setValue('companyAddress', fullAddress, { shouldValidate: true });
        setValue('country', country, { shouldValidate: true });
        setValue('zipCode', postalCode, { shouldValidate: true });
        
        if (place.geometry?.location) {
          const latVal = place.geometry.location.lat();
          const lngVal = place.geometry.location.lng();
          setValue('latitude', latVal, { shouldValidate: true });
          setValue('longitude', lngVal, { shouldValidate: true });
        }

        setIsVerifying(false);
        setAutocompleteReady(true);
      });

      setAutocompleteReady(true);
      console.log('Autocomplete initialized successfully');
    } catch (error) {
      console.error('Error initializing autocomplete:', error);
    }
  }, [isGoogleMapsLoaded, setValue]);

  useEffect(() => {
    // Wait for Google Maps to load completely
    const checkGoogleMaps = setInterval(() => {
      if (window.google && window.google.maps && window.google.maps.places) {
        clearInterval(checkGoogleMaps);
        initAutocomplete();
      }
    }, 500);

    return () => {
      clearInterval(checkGoogleMaps);
      if (autocompleteRef.current) {
        window.google.maps.event.clearInstanceListeners(autocompleteRef.current);
      }
    };
  }, [initAutocomplete]);

  return (
    <div className="space-y-4">
      {/* Section header */}
      <div className="flex items-center gap-2.5 pb-3 border-b border-gray-100">
        <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-teal-500 to-emerald-500 flex items-center justify-center">
          <MapPin className="w-3.5 h-3.5 text-white" />
        </div>
        <h3 className="text-sm font-semibold text-gray-800 tracking-wide">
          Business Address
        </h3>
        {locationVerified && (
          <span className="ml-auto text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
            Verified
          </span>
        )}
      </div>

      {/* Street address with Google Autocomplete */}
      <div className="space-y-1.5">
        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider">
          Street Address <span className="text-red-500 normal-case">*</span>
        </label>
        <div className="relative">
          <div className="absolute left-3.5 inset-y-0 flex items-center pointer-events-none z-10">
            <Search className={`w-4 h-4 transition-colors ${errors.companyAddress ? 'text-red-400' : isFocused ? 'text-blue-500' : 'text-gray-400'}`} />
          </div>
          <input
            ref={addressInputRef}
            id="address"
            type="text"
            placeholder="Start typing your business address (e.g., 1600 Amphitheatre Parkway, Mountain View, CA)"
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            className={`w-full pl-10 pr-4 py-3 text-sm rounded-xl border outline-none transition-all bg-white shadow-sm
              ${errors.companyAddress
                ? 'border-red-300 ring-2 ring-red-100'
                : `border-gray-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-500/15 ${isFocused ? 'border-blue-300' : ''}`
              }`}
          />
          {isVerifying && (
            <div className="absolute right-3.5 inset-y-0 flex items-center">
              <Loader2 className="w-4 h-4 text-blue-500 animate-spin" />
            </div>
          )}
          {!autocompleteReady && isGoogleMapsLoaded && (
            <div className="absolute right-3.5 inset-y-0 flex items-center">
              <div className="text-xs text-gray-400">Loading...</div>
            </div>
          )}
        </div>
        {errors.companyAddress && (
          <p className="text-red-500 text-xs flex items-center gap-1 mt-1">
            <AlertCircle className="w-3 h-3" /> {errors.companyAddress.message}
          </p>
        )}
        <p className="text-gray-400 text-xs flex items-center gap-1 mt-1">
          <Globe className="w-3 h-3" /> Start typing and select your address from Google suggestions
        </p>
      </div>

      {/* Auto-detected fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormInput
          label="Country"
          name="country"
          readOnly
          icon={Globe}
          placeholder="Will be auto-detected"
          helperText="Automatically filled from address"
        />
        <FormInput
          label="Postal/ZIP Code"
          name="zipCode"
          readOnly
          icon={CreditCard}
          placeholder="Will be auto-detected"
          helperText="Automatically filled from address"
        />
      </div>

      {/* Location coordinates */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormInput 
          label="Latitude" 
          name="latitude" 
          readOnly 
          icon={Globe}
          placeholder="Auto-detected"
          helperText="Google Maps coordinates"
        />
        <FormInput 
          label="Longitude" 
          name="longitude" 
          readOnly 
          icon={Globe}
          placeholder="Auto-detected"
          helperText="Google Maps coordinates"
        />
      </div>

      {/* Toggle + verified badge */}
      <div className="flex items-center justify-between pt-2">
        <label className="flex items-center gap-2 cursor-pointer group">
          <input
            type="checkbox"
            checked={showDetailed}
            onChange={(e) => setValue('showDetailedAddress', e.target.checked)}
            className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          <span className="text-sm text-gray-600 group-hover:text-gray-800 transition-colors">
            Add additional location details
          </span>
        </label>
        {locationVerified && (
          <div className="flex items-center gap-1.5 bg-emerald-50 px-2.5 py-1 rounded-full">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span className="text-xs font-medium text-emerald-700">Location Verified</span>
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
            <div className="pt-4 space-y-3 border-t border-gray-100 mt-2">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Additional Details
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <FormInput
                  label="Suite / Unit / Floor"
                  name="suiteNumber"
                  placeholder="e.g., Suite 4B, Floor 12, Tower A"
                  icon={Building2}
                  helperText="Optional - helps with mail delivery"
                />
                <FormInput
                  label="Landmark"
                  name="landmark"
                  placeholder="e.g., Near Central Park, Opposite City Mall"
                  icon={MapPin}
                  helperText="Optional - helps visitors find you"
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}