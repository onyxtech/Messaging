import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";
import { API_BASE_URL } from "@/utils/baseUrl";

export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000, // 15s — prevents requests hanging forever
});

// ─── REQUEST INTERCEPTOR ───────────────────────────────────────────────────
// Runs before every request:
//   1. Injects Bearer token automatically
//   2. Strips Content-Type for FormData so browser sets the boundary correctly
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }

    // Let the browser set the correct multipart/form-data boundary
    if (config.data instanceof FormData) {
      delete config.headers["Content-Type"];
    }

    return config;
  },
  (error: AxiosError) => Promise.reject(error),
);

// ─── RESPONSE INTERCEPTOR ─────────────────────────────────────────────────
// Runs after every response:
//   - 401 → clears token + redirects to login (session expired)
//   - All other errors bubble up to the caller (useCrud handles them)
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401 && typeof window !== "undefined") {
      localStorage.removeItem("token");
      window.location.replace("/auth/signIn");
    }
    return Promise.reject(error);
  },
);