"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import apiClient from "@/app/api/apiClient";
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

// ✅ Generic DELETE hook
export function useApiDelete<T>(url: string) {
  const queryClient = useQueryClient();
  return useMutation<T, ApiError, void>({
    mutationFn: async () => {
      const res = await apiClient.delete<T>(url);
      return res.data;
    },
    onSuccess: () => queryClient.invalidateQueries(),
  });
}
