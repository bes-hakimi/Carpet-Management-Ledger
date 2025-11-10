// src/types/product.ts
export interface ProductType {
  id: number;
  name: string;
  slug: string;
  type: string;             // مثلا "قالین دست‌باف"
  country: string;          // واحد پول یا کشور
  size: string;             // مثلا "0.5x1 متر"
  quality: string;          // مثلا "اقتصادی(پایه)"
  stock_qty: number;
  main_price: string;       // قیمت اصلی به صورت رشته
  image: string;
  gallery_image: string[] | null;
  description: string;
  weight: string;           // مثلا "2.00"
  main_color: string;
  age: number;
  created_at: string;       // تاریخ ایجاد
  updated_at: string;       // تاریخ بروزرسانی
  message: string
  user: {
    id: number;
    first_name: string | null;
    last_name: string | null;
    email: string;
    role: string | null;
    branch_name: string | null;
    staff_name: string | null;
    company_name: string | null;
  },
  created_by_info?: {
    id: number;
    first_name: string;     
    branch_name: string | null;
    company_name: string | null;
  };
 
}
