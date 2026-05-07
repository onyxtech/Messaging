import { api } from "@/services/api";

export const getAll = async <T>(
  endpoint: string,
  params?: Record<string, unknown>
) => {
  const response = await api.get(endpoint, {
    params,
  });

  return response.data;
};

export const getById = async <T>(
  endpoint: string,
  id: string
) => {
  const response = await api.get(`${endpoint}/${id}`);

  return response.data;
};

export const createItem = async <T>(
  endpoint: string,
  payload: T
) => {
  const response = await api.post(endpoint, payload);

  return response.data;
};

export const updateItem = async <T>(
  endpoint: string,
  id: string,
  payload: T
) => {
  const response = await api.put(
    `${endpoint}/${id}`,
    payload
  );

  return response.data;
};

export const deleteItem = async (
  endpoint: string,
  id: string
) => {
  const response = await api.delete(
    `${endpoint}/${id}`
  );

  return response.data;
};