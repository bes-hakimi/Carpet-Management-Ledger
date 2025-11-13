// src/types/sales/details.ts

export interface SaleDetailsType {
  id: number;
  slug:string;
  invoiceNumber: string; // اگر در API نیست، در کامپوننت تولید می‌شود
  payment_method: string;
  delivery_method: string;
  description: string;
  created_at: string;

  customer: {
    id: number;
    customer_name: string;
    customer_phone: string;
    customer_address: string;
  };

  items: {
    id: number;
    qty: number;
    main_price: string;
    product: {
      id: number;
      name: string;
      slug: string;
      type: string;
      country: string;
      size: string;
      quality: string;
      stock_qty: number;
      main_price: string;
      image: string;
      gallery_image: string | null;
      description: string;
      weight: string;
      main_color: string;
      age: number;
      created_at: string;
      updated_at: string;
      user: number;
    };
  }[];
}
