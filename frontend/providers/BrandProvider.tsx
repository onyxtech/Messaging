// src/providers/BrandProvider.tsx
"use client";

import { useEffect } from "react";
import { useBrandColors, DEFAULT_BRAND } from "@/store/authStore";
import { BrandColors } from "@/types/auth.types";

// ─── Helper: hex → rgba ───────────────────────────────────────────────────────
const hexToRgba = (hex: string, opacity: number): string => {
  try {
    const clean = hex.replace("#", "");
    const r = parseInt(clean.slice(0, 2), 16);
    const g = parseInt(clean.slice(2, 4), 16);
    const b = parseInt(clean.slice(4, 6), 16);
    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
  } catch {
    return `rgba(99, 102, 241, ${opacity})`;
  }
};

// ─── Apply all CSS variables from three brand colors ─────────────────────────
const applyBrandVariables = (colors: BrandColors): void => {
  const root = document.documentElement;
  const { primaryColor: p, secondaryColor: s, accentColor: a } = colors;

  // ── Solid colors
  root.style.setProperty("--brand-primary",   p);
  root.style.setProperty("--brand-secondary", s);
  root.style.setProperty("--brand-accent",    a);

  // ── Soft backgrounds (8% opacity — for cards, badges, highlights)
  root.style.setProperty("--brand-primary-soft",   hexToRgba(p, 0.08));
  root.style.setProperty("--brand-secondary-soft", hexToRgba(s, 0.08));
  root.style.setProperty("--brand-accent-soft",    hexToRgba(a, 0.08));

  // ── 6 Gradient combinations
  // 1. Primary → Secondary  (most common — buttons, headers)
  root.style.setProperty("--brand-gradient-ps",
    `linear-gradient(135deg, ${p} 0%, ${s} 100%)`);

  // 2. Primary → Accent  (CTAs, highlights)
  root.style.setProperty("--brand-gradient-pa",
    `linear-gradient(135deg, ${p} 0%, ${a} 100%)`);

  // 3. Secondary → Accent  (subtle sections)
  root.style.setProperty("--brand-gradient-sa",
    `linear-gradient(135deg, ${s} 0%, ${a} 100%)`);

  // 4. Full three-color  (hero banners, sidebar)
  root.style.setProperty("--brand-gradient-full",
    `linear-gradient(135deg, ${p} 0%, ${s} 50%, ${a} 100%)`);

  // 5. Reverse full  (variety)
  root.style.setProperty("--brand-gradient-reverse",
    `linear-gradient(135deg, ${a} 0%, ${s} 50%, ${p} 100%)`);

  // 6. Diagonal soft  (page backgrounds, section dividers)
  root.style.setProperty("--brand-gradient-soft",
    `linear-gradient(135deg, ${hexToRgba(p, 0.12)} 0%, ${hexToRgba(s, 0.08)} 50%, ${hexToRgba(a, 0.12)} 100%)`);
};

// ─── Provider component ───────────────────────────────────────────────────────
export function BrandProvider({ children }: { children: React.ReactNode }) {
  const brandColors = useBrandColors();

  useEffect(() => {
    applyBrandVariables(brandColors);
  }, [brandColors]);

  // Apply defaults immediately on first render (before hydration)
  useEffect(() => {
    applyBrandVariables(DEFAULT_BRAND);
  }, []);

  return <>{children}</>;
}