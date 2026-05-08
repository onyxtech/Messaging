// app/register/components/BrandingSection.tsx
'use client';

import { useFormContext } from 'react-hook-form';
import { Palette, TrendingUp, Zap, Shield } from 'lucide-react';
import { RegisterFormValues } from '../../schema/registerSchema';

const presetColors = [
  { name: 'Ocean Breeze', primary: '#1e293b', secondary: '#3b82f6', accent: '#8b5cf6' },
  { name: 'Sunset Glow', primary: '#991b1b', secondary: '#f59e0b', accent: '#ef4444' },
  { name: 'Forest Mist', primary: '#064e3b', secondary: '#10b981', accent: '#34d399' },
  { name: 'Royal Purple', primary: '#4c1d95', secondary: '#7c3aed', accent: '#a78bfa' },
  { name: 'Coral Reef', primary: '#9f1239', secondary: '#f43f5e', accent: '#fb7185' },
  { name: 'Teal Dream', primary: '#134e4a', secondary: '#14b8a6', accent: '#2dd4bf' },
  { name: 'Golden Hour', primary: '#78350f', secondary: '#fbbf24', accent: '#fcd34d' },
  { name: 'Electric Blue', primary: '#0c4a6e', secondary: '#0ea5e9', accent: '#38bdf8' },
];

export function BrandingSection() {
  const { setValue, watch } = useFormContext<RegisterFormValues>();
  
  const primaryColor = watch('primaryColor');
  const secondaryColor = watch('secondaryColor');
  const accentColor = watch('accentColor');

  const handlePresetSelect = (preset: typeof presetColors[0]) => {
    setValue('primaryColor', preset.primary);
    setValue('secondaryColor', preset.secondary);
    setValue('accentColor', preset.accent);
  };

  return (
    <div className="space-y-5">
      {/* Section header */}
      <div className="flex items-center gap-2.5 pb-3 border-b border-gray-100">
        <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
          <Palette className="w-3.5 h-3.5 text-white" />
        </div>
        <h3 className="text-sm font-semibold text-gray-800 tracking-wide">
          Brand Identity
        </h3>
        <span className="text-xs text-gray-400 ml-auto">Customize your brand colors</span>
      </div>

      {/* Live Preview */}
      <div className="p-4 rounded-xl overflow-hidden" style={{
        background: `linear-gradient(135deg, ${primaryColor}20 0%, ${secondaryColor}20 50%, ${accentColor}20 100%)`,
        border: `1px solid ${primaryColor}30`
      }}>
        <div className="text-center space-y-3">
          <div className="flex justify-center gap-2">
            <div className="w-12 h-12 rounded-lg shadow-md" style={{ backgroundColor: primaryColor }} />
            <div className="w-12 h-12 rounded-lg shadow-md" style={{ backgroundColor: secondaryColor }} />
            <div className="w-12 h-12 rounded-lg shadow-md" style={{ backgroundColor: accentColor }} />
          </div>
          <p className="text-sm font-medium text-gray-700">Your Brand Colors Preview</p>
          <div className="flex justify-center gap-4 text-xs">
            <div><span className="font-semibold">Primary:</span> {primaryColor}</div>
            <div><span className="font-semibold">Secondary:</span> {secondaryColor}</div>
            <div><span className="font-semibold">Accent:</span> {accentColor}</div>
          </div>
        </div>
      </div>

      {/* Preset Color Schemes */}
      <div>
        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
          Preset Color Schemes
        </label>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {presetColors.map((preset) => (
            <button
              key={preset.name}
              type="button"
              onClick={() => handlePresetSelect(preset)}
              className="p-2 rounded-lg border border-gray-200 hover:border-gray-300 hover:shadow-md transition-all group"
            >
              <div className="flex gap-1 mb-2">
                <div className="w-6 h-6 rounded" style={{ backgroundColor: preset.primary }} />
                <div className="w-6 h-6 rounded" style={{ backgroundColor: preset.secondary }} />
                <div className="w-6 h-6 rounded" style={{ backgroundColor: preset.accent }} />
              </div>
              <p className="text-xs font-medium text-gray-700">{preset.name}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Custom Color Pickers */}
      <div className="space-y-3">
        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider">
          Custom Colors
        </label>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-gray-600 flex items-center gap-1">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: primaryColor }} />
              Primary Color
            </label>
            <div className="flex gap-2">
              <input
                type="color"
                value={primaryColor}
                onChange={(e) => setValue('primaryColor', e.target.value)}
                className="w-12 h-10 rounded border border-gray-200 cursor-pointer"
              />
              <input
                type="text"
                value={primaryColor}
                onChange={(e) => setValue('primaryColor', e.target.value)}
                className="flex-1 px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500"
                placeholder="#1e293b"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-gray-600 flex items-center gap-1">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: secondaryColor }} />
              Secondary Color
            </label>
            <div className="flex gap-2">
              <input
                type="color"
                value={secondaryColor}
                onChange={(e) => setValue('secondaryColor', e.target.value)}
                className="w-12 h-10 rounded border border-gray-200 cursor-pointer"
              />
              <input
                type="text"
                value={secondaryColor}
                onChange={(e) => setValue('secondaryColor', e.target.value)}
                className="flex-1 px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500"
                placeholder="#3b82f6"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-gray-600 flex items-center gap-1">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: accentColor }} />
              Accent Color
            </label>
            <div className="flex gap-2">
              <input
                type="color"
                value={accentColor}
                onChange={(e) => setValue('accentColor', e.target.value)}
                className="w-12 h-10 rounded border border-gray-200 cursor-pointer"
              />
              <input
                type="text"
                value={accentColor}
                onChange={(e) => setValue('accentColor', e.target.value)}
                className="flex-1 px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500"
                placeholder="#8b5cf6"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Info Message */}
      <div className="p-3 bg-blue-50 rounded-lg border border-blue-100">
        <p className="text-xs text-blue-800 flex items-start gap-2">
          <TrendingUp className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
          <span>These colors will be used in your email templates, dashboard, and brand communications.</span>
        </p>
      </div>
    </div>
  );
}