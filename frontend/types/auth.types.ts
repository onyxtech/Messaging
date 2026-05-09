// src/types/auth.types.ts

// ─── Brand Colors ─────────────────────────────────────────────────────────────
export interface BrandColors {
  primaryColor:   string;
  secondaryColor: string;
  accentColor:    string;
}

// ─── Shop Info ────────────────────────────────────────────────────────────────
export interface ShopInfo {
  id:             string;
  shopName:       string;
  logoUrl:        string | null;
  companyWebsite: string | null;
  companyEmail:   string | null;
  brandColors:    BrandColors;
}

// ─── Logged-in User ───────────────────────────────────────────────────────────
export interface AuthUser {
  id:            string;
  email:         string;
  firstName:     string;
  lastName:      string;
  role:          "Admin" | "Technician" | "Customer" | string;
  technicianId?: string;
  customerId?:   string;
}

// ─── Login API Response ───────────────────────────────────────────────────────
// Matches exactly what your backend login controller returns
export interface LoginApiResponse {
  message: string;
  token:   string;
  user:    AuthUser;
  shop: {
    id:             string;
    shopName:       string;
    logoUrl:        string | null;
    companyWebsite: string | null;
    companyEmail:   string | null;
    primaryColor:   string;
    secondaryColor: string;
    accentColor:    string;
  } | null;
}

// ─── Login Error Response ─────────────────────────────────────────────────────
export interface LoginErrorResponse {
  message:              string;
  code?:                "EMAIL_NOT_VERIFIED" | "ACCOUNT_INACTIVE" | string;
  email?:               string;
  requiresVerification?: boolean;
}

// ─── Resend Verification Response ─────────────────────────────────────────────
export interface ResendVerificationResponse {
  message: string;
  success: boolean;
}