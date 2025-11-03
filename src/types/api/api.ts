// src/types/api.ts
export type ApiError = {
  message?: string;
  status?: number;
  response?: {
    data?: unknown;
    status?: number;
    [key: string]: unknown;
  };
};

export type Paginated<T> = {
  results: T[];
  count: number;
  next: string | null;
  previous: string | null;
};
