export const PRODUCT = {
  create: "/create-product/",
  list: "/list-product/",
  details: (id: number) => `/product/details/${id}/`,
  update: (id: number) => `/product/update/${id}/`,
  delete: (id: number) => `/product/delete/${id}/`,
};

