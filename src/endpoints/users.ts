export const USERS = {
  login:"/accounts/login/",
  getAll: "/users",
  getOne: (id: number) => `/users/${id}`,
  create: "/accounts/signup/",
  update: (id: number) => `/users/${id}`,
  delete: (id: number) => `/users/${id}`,
};

// Optional: types
export interface User {
  id: number;
  name: string;
  email: string;
}
