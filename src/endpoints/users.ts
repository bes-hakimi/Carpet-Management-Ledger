export const USERS = {
  login: "/accounts/login/",
  getAll: "/accounts/company/list/",
  details: (id: number) => `/accounts/user/details/${id}`,
  create: "/accounts/signup/",
  update: (id: number) => `/accounts/user/update/${id}`,
  delete: (id: number) => `/accounts/user/delete/${id}`,
};

