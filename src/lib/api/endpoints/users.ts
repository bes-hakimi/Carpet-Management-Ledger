export const USERS = {
  getAll: "/users",
  getOne: (id: number) => `/users/${id}`,
  create: "/users",
  update: (id: number) => `/users/${id}`,
  delete: (id: number) => `/users/${id}`,
};

// Optional: types
export interface User {
  id: number;
  name: string;
  email: string;
}
