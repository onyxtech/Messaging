import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { createItem, deleteItem, getAll, updateItem } from "@/helper/apiHelper";

// ─── TYPES ─────────────────────────────────────────────────────────────────

interface UseCrudProps {
  endpoint: string;
  queryKey: string;
  page?: number;
  search?: string;
  enabled?: boolean;
  moduleName?: string;
}

// ─── HOOK ──────────────────────────────────────────────────────────────────

/**
 * useCrud — universal CRUD hook for any API endpoint.
 *
 * Usage:
 *   const { data, create, update, remove, isLoading } = useCrud<IBusinessType>({
 *     endpoint: "/business-types",
 *     queryKey: "businessTypes",
 *     moduleName: "Business Type",
 *   });
 */
export const useCrud = <T extends { _id: string }>({
  endpoint,
  queryKey,
  page = 1,
  search = "",
  enabled = true,
  moduleName = "Item",
}: UseCrudProps) => {
  const queryClient = useQueryClient();

  // ─── READ ─────────────────────────────────────────────────────────────
  const query = useQuery({
    queryKey: [queryKey, page, search],
    queryFn: () =>
      getAll<T>(endpoint, {
        page,
        limit: 12,
        ...(search.trim() && { search: search.trim() }),
      }),
    // Keeps previous page data visible while next page loads (no blank flash)
    placeholderData: (prev) => prev,
    staleTime: 1000 * 30, // 30s — don't refetch on every focus
    enabled,
  });

  // ─── CREATE ───────────────────────────────────────────────────────────
  const createMutation = useMutation({
    mutationFn: (payload: Partial<T> | FormData) =>
      createItem<T>(endpoint, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [queryKey] });
      toast.success(`${moduleName} created successfully`);
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message ?? `Failed to create ${moduleName}`);
    },
  });

  // ─── UPDATE ───────────────────────────────────────────────────────────
  const updateMutation = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: Partial<T> | FormData }) =>
      updateItem<T>(endpoint, id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [queryKey] });
      toast.success(`${moduleName} updated successfully`);
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message ?? `Failed to update ${moduleName}`);
    },
  });

  // ─── DELETE ───────────────────────────────────────────────────────────
  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteItem(endpoint, id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [queryKey] });
      toast.success(`${moduleName} deleted successfully`);
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message ?? `Failed to delete ${moduleName}`);
    },
  });

  // ─── RETURN ───────────────────────────────────────────────────────────
  return {
    // ── Data
    data: query.data?.data ?? [],
    total: query.data?.total ?? 0,

    // ── Query state
    isLoading: query.isLoading,
    isFetching: query.isFetching,   // true during background refetches
    isError: query.isError,

    // ── Actions (renamed to avoid clashing with imported helper functions)
    create: createMutation.mutate,                  // create(payload)
    update: updateMutation.mutate,                  // update({ id, payload })
    remove: deleteMutation.mutate,                  // remove(id)

    // Async versions — useful when you need to await the result
    createAsync: createMutation.mutateAsync,
    updateAsync: updateMutation.mutateAsync,
    removeAsync: deleteMutation.mutateAsync,

    // ── Mutation state
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
    isMutating:
      createMutation.isPending ||
      updateMutation.isPending ||
      deleteMutation.isPending,
  };
};