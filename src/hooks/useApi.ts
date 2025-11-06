"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import apiClient from "@/hooks/apiClient";
import { ApiError } from "@/types/api/api";

// ✅ Generic GET hook
export function useApiGet<T>(key: string, url: string) {
  return useQuery<T, ApiError>({
    queryKey: [key],
    queryFn: async () => {
      const res = await apiClient.get<T>(url);
      return res.data;
    },
    retry: 1, // تعداد تلاش مجدد در صورت خطا
  });
}

// ✅ Generic POST hook
export function useApiPost<T, U>(url: string) {
  const queryClient = useQueryClient();
  return useMutation<T, ApiError, U>({
    mutationFn: async (body: U) => {
      const res = await apiClient.post<T>(url, body);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(); // ریفرش همه کوئری‌ها
    },
  });
}

// ✅ Generic PATCH hook
export function useApiPatch<T, U>(url: string) {
  const queryClient = useQueryClient();
  return useMutation<T, ApiError, U>({
    mutationFn: async (body: U) => {
      const res = await apiClient.patch<T>(url, body);
      return res.data;
    },
    onSuccess: () => queryClient.invalidateQueries(),
  });
}

// src/hooks/useApi.ts
export function useApiDeleteDynamic<T>() {
  const queryClient = useQueryClient();

  const mutation = useMutation<T, ApiError, string>({
    mutationFn: async (url: string) => {
      const res = await apiClient.delete<T>(url);
      return res.data;
    },
    onSuccess: () => queryClient.invalidateQueries(),
  });

  return mutation; 
}


