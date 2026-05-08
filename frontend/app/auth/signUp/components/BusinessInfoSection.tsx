'use client';

import { useRef } from 'react';
import Image from 'next/image';
import { useFormContext } from 'react-hook-form';
import { Store, Link2, Upload, X, ImageIcon } from 'lucide-react';
import { toast } from 'sonner';
import { RegisterFormValues } from '../../schema/registerSchema';
import { FormInput } from '../../components/FormInput';

interface BusinessInfoSectionProps {
  logoPreview: string | null;
  onLogoChange: (file: File, preview: string) => void;
  onLogoRemove: () => void;
}

export function BusinessInfoSection({
  logoPreview,
  onLogoChange,
  onLogoRemove,
}: BusinessInfoSectionProps) {
  const { setValue } = useFormContext<RegisterFormValues>();
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      toast.error('Logo must be less than 2MB');
      return;
    }
    if (!file.type.startsWith('image/')) {
      toast.error('Please upload a valid image file');
      return;
    }

    const preview = URL.createObjectURL(file);
    // ✅ Store the actual File object — NOT a string
    setValue('logo', file as any);
    onLogoChange(file, preview);

    // Reset input so same file can be re-selected if removed
    if (inputRef.current) inputRef.current.value = '';
  };

  return (
    <div className="space-y-4">
      {/* Section header */}
      <div className="flex items-center gap-2.5 pb-3 border-b border-gray-100">
        <div className="w-7 h-7 rounded-lg bg-blue-50 flex items-center justify-center">
          <Store className="w-3.5 h-3.5 text-blue-600" />
        </div>
        <h3 className="text-sm font-semibold text-gray-800 tracking-wide">
          Business Information
        </h3>
      </div>

      {/* Fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormInput
          label="Business Name"
          name="companyName"
          placeholder="e.g. Acme Corp"
          required
          icon={Store}
        />
        <FormInput
          label="Website"
          name="companyWebsite"
          placeholder="https://yourcompany.com"
          icon={Link2}
        />
      </div>

      {/* Logo upload */}
      <div className="space-y-2">
        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider">
          Business Logo
        </label>

        <div className="flex items-center gap-4">
          {/* Upload button */}
          <label className="cursor-pointer group flex items-center gap-2 px-4 py-2.5 rounded-xl border-2 border-dashed border-gray-200 hover:border-blue-400 hover:bg-blue-50/40 transition-all text-sm text-gray-500 hover:text-blue-600">
            <Upload className="w-4 h-4" />
            <span className="font-medium">
              {logoPreview ? 'Change Logo' : 'Upload Logo'}
            </span>
            <input
              ref={inputRef}
              type="file"
              className="hidden"
              onChange={handleFileChange}
              accept="image/png,image/jpeg,image/jpg,image/webp,image/svg+xml"
            />
          </label>

          {/* Preview or placeholder */}
          {logoPreview ? (
            <div className="relative group">
              <div className="w-14 h-14 rounded-xl border border-gray-200 shadow-sm overflow-hidden bg-gray-50">
                <Image
                  src={logoPreview}
                  alt="Logo preview"
                  width={56}
                  height={56}
                  className="w-full h-full object-contain"
                />
              </div>
              <button
                type="button"
                onClick={onLogoRemove}
                className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-sm"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ) : (
            <div className="w-14 h-14 rounded-xl border-2 border-dashed border-gray-200 flex items-center justify-center bg-gray-50">
              <ImageIcon className="w-5 h-5 text-gray-300" />
            </div>
          )}
        </div>

        <p className="text-xs text-gray-400">
          PNG, JPG, WEBP or SVG · Max 2MB · Square recommended
        </p>
      </div>
    </div>
  );
}