import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import {
  createItem,
  deleteItem,
  getAll,
  updateItem,
} from "@/helper/apiHelper";

import { toast } from "react-hot-toast";

interface UseCrudProps {
  endpoint: string;
  queryKey: string;
  page?: number;
  search?: string;
  enabled?: boolean;
  moduleName?: string;
}

export const useCrud = <T extends { _id: string }>({
  endpoint,
  queryKey,
  page = 1,
  search = "",
  enabled = true,
  moduleName = "Item",
}: UseCrudProps) => {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: [queryKey, page, search],
    queryFn: () =>
      getAll<T>(endpoint, {
        page,
        limit: 12,
        search,
      }),

    enabled,
  });

  const createMutation = useMutation({
    mutationFn: (payload: Partial<T>) =>
      createItem(endpoint, payload),

    onSuccess: () => {
      toast.success(
        `${moduleName} created successfully`
      );

      queryClient.invalidateQueries({
        queryKey: [queryKey],
      });
    },

    onError: (error: any) => {
      toast.error(
        error?.message ||
          `Failed to create ${moduleName}`
      );
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: Partial<T>;
    }) =>
      updateItem(endpoint, id, payload),

    onSuccess: () => {
      toast.success(
        `${moduleName} updated successfully`
      );

      queryClient.invalidateQueries({
        queryKey: [queryKey],
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) =>
      deleteItem(endpoint, id),

    onSuccess: () => {
      toast.success(
        `${moduleName} deleted successfully`
      );

      queryClient.invalidateQueries({
        queryKey: [queryKey],
      });
    },
  });

  return {
    data: query.data?.data || [],
    total: query.data?.total || 0,

    isLoading: query.isLoading,
    isError: query.isError,

    createItem: createMutation.mutate,
    updateItem: updateMutation.mutate,
    deleteItem: deleteMutation.mutate,

    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
  };
};