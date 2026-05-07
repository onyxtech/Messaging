import { api } from "@/services/api";

// ─── SHARED RESPONSE TYPES ─────────────────────────────────────────────────

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  total: number;
  page: number;
  limit: number;
}

export interface SingleResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface MutationResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface DeleteResponse {
  success: boolean;
  message?: string;
}

// ─── API FUNCTIONS ─────────────────────────────────────────────────────────
// These are pure async functions — no toast, no side effects.
// All error handling lives in useCrud so every caller gets consistent UX.

export const getAll = async <T>(
  endpoint: string,
  params?: Record<string, unknown>,
): Promise<PaginatedResponse<T>> => {
  const response = await api.get<PaginatedResponse<T>>(endpoint, { params });
  return response.data;
};

export const getById = async <T>(
  endpoint: string,
  id: string,
): Promise<SingleResponse<T>> => {
  const response = await api.get<SingleResponse<T>>(`${endpoint}/${id}`);
  return response.data;
};

// Accepts both plain objects and FormData (e.g. file uploads)
export const createItem = async <T>(
  endpoint: string,
  payload: Partial<T> | FormData,
): Promise<MutationResponse<T>> => {
  const response = await api.post<MutationResponse<T>>(endpoint, payload);
  return response.data;
};

export const updateItem = async <T>(
  endpoint: string,
  id: string,
  payload: Partial<T> | FormData,
): Promise<MutationResponse<T>> => {
  const response = await api.put<MutationResponse<T>>(`${endpoint}/${id}`, payload);
  return response.data;
};

export const deleteItem = async (
  endpoint: string,
  id: string,
): Promise<DeleteResponse> => {
  const response = await api.delete<DeleteResponse>(`${endpoint}/${id}`);
  return response.data;
};