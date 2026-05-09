// src/lib/authHelper.ts
import { api } from "@/services/api";
import { useAuthStore } from "@/store/authStore";
import { LoginApiResponse, ShopInfo } from "@/types/auth.types";

export const loginUser = async (email: string, password: string): Promise<void> => {
  const response = await api.post<LoginApiResponse>("/auth/login", { email, password });
  const { token, user } = response.data;  // ← Remove 'shop' from here
  
  console.log("🔵 User from API:", user);

  // ✅ CREATE shopInfo FROM user object since colors are on user
  const shopInfo: ShopInfo | null = user ? {
    id: user.shopId,
    shopName: user.shopName,
    logoUrl: user.companyLogo || null,  // Use companyLogo from user if exists
    companyWebsite: null,  // Or get from user if available
    companyEmail: user.email,  // Or get from user if available
    brandColors: {
      primaryColor: user.primaryColor || "#6366f1",
      secondaryColor: user.secondaryColor || "#8b5cf6",
      accentColor: user.accentColor || "#06b6d4",
    },
  } : null;

  console.log("🔵 Created shopInfo from user:", shopInfo);

  // Save token to localStorage
  localStorage.setItem("token", token);

  // Save everything to Zustand
  useAuthStore.getState().setAuth(token, user, shopInfo);
  
  // ✅ Update CSS variables immediately
  if (shopInfo?.brandColors) {
    document.documentElement.style.setProperty('--brand-primary', shopInfo.brandColors.primaryColor);
    document.documentElement.style.setProperty('--brand-secondary', shopInfo.brandColors.secondaryColor);
    document.documentElement.style.setProperty('--brand-accent', shopInfo.brandColors.accentColor);
    console.log("🔵 CSS variables updated with colors:", shopInfo.brandColors);
  }
  
  console.log("🔵 Store after update:", useAuthStore.getState());
};

export const logoutUser = (): void => {
  localStorage.removeItem("token");
  useAuthStore.getState().clearAuth();
  window.location.replace("/auth/signIn");
};