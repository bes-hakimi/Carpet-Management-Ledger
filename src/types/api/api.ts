// src/types/api.ts
export interface ApiError {
  message?: string;
  response?: {
    data?: {
      message?: string;
      detail?: string;
      [key: string]: unknown;
    };
  };
}


export type Paginated<T> = {
  results: T[];
  count: number;
  next: string | null;
  previous: string | null;
};
