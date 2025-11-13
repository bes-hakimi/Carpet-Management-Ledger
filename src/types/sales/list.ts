// types/sale.ts

export interface Product {
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
}

export interface SaleItem {
  id: number;
  qty: number;
  main_price: string;
  product: Product;
}

export interface Customer {
  id: number;
  customer_name: string;
  customer_phone: string;
  customer_address: string;
}

export interface SaleList {
  id: number;
  payment_method: string;
  slug: string | null;
  delivery_method: string;
  description: string;
  created_at: string;
  customer: Customer;
  items: SaleItem[];
}
