export const USERS = {
  login: "/accounts/login/",
  create: "/accounts/signup/",
  getCompanyList: "/accounts/company/list/",
  getBranchList: "/accounts/company/branch/list/",
  getStaffList: "/accounts/company/statff/list/",
  details: (id: number) => `/accounts/user/details/${id}/`,
  update: (id: number) => `/accounts/user/update/${id}/`,
  delete: (id: number) => `/accounts/user/delete/${id}/`,
};

