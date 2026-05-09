// src/hooks/useBrand.ts
"use client";

import { useBrandColors } from "@/store/authStore";
import { BrandColors } from "@/types/auth.types";

// ─── Return type ──────────────────────────────────────────────────────────────
export interface BrandUtils {
  colors: BrandColors;

  // ── 6 gradient strings (ready for style={{ background: ... }})
  gradients: {
    primaryToSecondary: string;   // most used — buttons, headers
    primaryToAccent:    string;   // CTAs
    secondaryToAccent:  string;   // subtle sections
    full:               string;   // hero, sidebar — all 3 colors
    reverse:            string;   // reversed full
    soft:               string;   // transparent — page bg, dividers
  };

  // ── Solid inline style helpers
  solidPrimary:   React.CSSProperties;
  solidSecondary: React.CSSProperties;
  solidAccent:    React.CSSProperties;

  // ── Soft background helpers (transparent — for cards, badges)
  softPrimary:   (opacity?: number) => React.CSSProperties;
  softSecondary: (opacity?: number) => React.CSSProperties;
  softAccent:    (opacity?: number) => React.CSSProperties;

  // ── Text color helpers
  textPrimary:   React.CSSProperties;
  textSecondary: React.CSSProperties;
  textAccent:    React.CSSProperties;

  // ── Border color helpers
  borderPrimary:   React.CSSProperties;
  borderSecondary: React.CSSProperties;

  // ── Ready-made Tailwind class strings
  // Use when you need dynamic className but not inline style
  btnPrimary:   string;  // solid primary button
  btnGradient:  string;  // gradient button
  badgePrimary: string;  // solid badge
  badgeAccent:  string;  // accent badge
}

// ─── Helper ───────────────────────────────────────────────────────────────────
const toRgba = (hex: string, opacity: number): string => {
  try {
    const c = hex.replace("#", "");
    const r = parseInt(c.slice(0, 2), 16);
    const g = parseInt(c.slice(2, 4), 16);
    const b = parseInt(c.slice(4, 6), 16);
    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
  } catch {
    return `rgba(99,102,241,${opacity})`;
  }
};

// ─── Hook ─────────────────────────────────────────────────────────────────────
export const useBrand = (): BrandUtils => {
  const colors = useBrandColors();
  const { primaryColor: p, secondaryColor: s, accentColor: a } = colors;

  return {
    colors,

    // ── 6 gradients
    gradients: {
      primaryToSecondary: `linear-gradient(135deg, ${p} 0%, ${s} 100%)`,
      primaryToAccent:    `linear-gradient(135deg, ${p} 0%, ${a} 100%)`,
      secondaryToAccent:  `linear-gradient(135deg, ${s} 0%, ${a} 100%)`,
      full:               `linear-gradient(135deg, ${p} 0%, ${s} 50%, ${a} 100%)`,
      reverse:            `linear-gradient(135deg, ${a} 0%, ${s} 50%, ${p} 100%)`,
      soft:               `linear-gradient(135deg, ${toRgba(p, 0.10)} 0%, ${toRgba(s, 0.06)} 50%, ${toRgba(a, 0.10)} 100%)`,
    },

    // ── Solid styles
    solidPrimary:   { backgroundColor: p },
    solidSecondary: { backgroundColor: s },
    solidAccent:    { backgroundColor: a },

    // ── Soft backgrounds
    softPrimary:   (opacity = 0.08) => ({ backgroundColor: toRgba(p, opacity) }),
    softSecondary: (opacity = 0.08) => ({ backgroundColor: toRgba(s, opacity) }),
    softAccent:    (opacity = 0.08) => ({ backgroundColor: toRgba(a, opacity) }),

    // ── Text colors
    textPrimary:   { color: p },
    textSecondary: { color: s },
    textAccent:    { color: a },

    // ── Border colors
    borderPrimary:   { borderColor: p },
    borderSecondary: { borderColor: s },

    // ── Tailwind utility class strings
    // These work because Tailwind config maps var(--brand-*) to color names
    btnPrimary:   "bg-brand-primary text-white hover:opacity-90 transition-opacity",
    btnGradient:  "bg-brand-gradient-ps text-white hover:opacity-90 transition-opacity",
    badgePrimary: "bg-brand-primary text-white",
    badgeAccent:  "bg-brand-accent text-white",
  };
};