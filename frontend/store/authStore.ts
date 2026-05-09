// src/store/authStore.ts
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { AuthUser, BrandColors, ShopInfo } from "@/types/auth.types";

// ─── Defaults ─────────────────────────────────────────────────────────────────
export const DEFAULT_BRAND: BrandColors = {
  primaryColor:   "#6366f1",
  secondaryColor: "#8b5cf6",
  accentColor:    "#06b6d4",
};

// ─── State shape ──────────────────────────────────────────────────────────────
interface AuthState {
  token:       string | null;
  user:        AuthUser | null;
  shop:        ShopInfo | null;
  isLoggedIn:  boolean;

  // Actions
  setAuth:  (token: string, user: AuthUser, shop: ShopInfo | null) => void;
  clearAuth: () => void;
}

// ─── Store ────────────────────────────────────────────────────────────────────
export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token:      null,
      user:       null,
      shop:       null,
      isLoggedIn: false,

      setAuth: (token, user, shop) =>
        set({ token, user, shop, isLoggedIn: true }),

      clearAuth: () =>
        set({ token: null, user: null, shop: null, isLoggedIn: false }),
    }),
    {
      name:    "auth-store",                    // localStorage key
      storage: createJSONStorage(() => localStorage),
      // Only persist what we need — don't persist actions
      partialize: (state) => ({
        token:     state.token,
        user:      state.user,
        shop:      state.shop,
        isLoggedIn: state.isLoggedIn,
      }),
    },
  ),
);



// ─── Convenience selectors (use these in components) ──────────────────────────
export const useToken      = () => useAuthStore((s) => s.token);
export const useAuthUser   = () => useAuthStore((s) => s.user);
export const useShop       = () => useAuthStore((s) => s.shop);
export const useIsLoggedIn = () => useAuthStore((s) => s.isLoggedIn);
export const useBrandColors = () =>
  useAuthStore((s) => s?.shop?.brandColors ?? DEFAULT_BRAND);