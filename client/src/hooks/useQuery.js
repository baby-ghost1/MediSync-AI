import { useQuery, useMutation, useQueryClient, useInfiniteQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";

export function useApiQuery({ queryKey, queryFn, enabled = true, ...options }) {
  return useQuery({
    queryKey,
    queryFn,
    enabled,
    ...options,
  });
}

export function useApiMutation({
  mutationFn,
  onSuccess,
  onError,
  invalidateQueries,
  successMessage,
  optimisticUpdate,
}) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn,
    onMutate: optimisticUpdate
      ? async (variables) => {
          await queryClient.cancelQueries({ queryKey: optimisticUpdate.queryKey });

          const previousData = queryClient.getQueryData(optimisticUpdate.queryKey);

          queryClient.setQueryData(optimisticUpdate.queryKey, (old) => {
            if (typeof optimisticUpdate.updater === "function") {
              return optimisticUpdate.updater(old, variables);
            }
            return old;
          });

          return { previousData };
        }
      : undefined,
    onSuccess: (data, variables, context) => {
      if (invalidateQueries) {
        const keys = Array.isArray(invalidateQueries) ? invalidateQueries : [invalidateQueries];
        keys.forEach((key) => queryClient.invalidateQueries({ queryKey: key }));
      }
      if (successMessage) {
        toast.success(successMessage);
      }
      if (onSuccess) {
        onSuccess(data, variables, context);
      }
    },
    onError: (error, variables, context) => {
      if (optimisticUpdate && context?.previousData) {
        queryClient.setQueryData(optimisticUpdate.queryKey, context.previousData);
      }
      const message = error.response?.data?.message || error.message || "Something went wrong";
      toast.error(message);
      if (onError) {
        onError(error, variables, context);
      }
    },
    onSettled: optimisticUpdate
      ? () => {
          queryClient.invalidateQueries({ queryKey: optimisticUpdate.queryKey });
        }
      : undefined,
  });
}

export function useApiInfiniteQuery({ queryKey, queryFn, getNextPageParam, ...options }) {
  return useInfiniteQuery({
    queryKey,
    queryFn,
    getNextPageParam,
    initialPageParam: 1,
    ...options,
  });
}
