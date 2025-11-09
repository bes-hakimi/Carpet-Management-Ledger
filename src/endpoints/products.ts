export const PRODUCT = {
  create: "/create-product/",
  list: "/list-product/",
  details: (id: number) => `/detail-product/${id}/`,
  update: (id: number) => `/update-product/${id}/`,
  delete: (id: number) => `/delete-product/${id}/`,
};

