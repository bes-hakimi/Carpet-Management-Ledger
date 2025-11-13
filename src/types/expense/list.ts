// src/types/expense/list.ts
export interface ExpenseList {
  id: number;
  user: {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
    role: string;
    branch_name: string | null;
    company_name: string | null;
  };
  title: string;
  price: string; // از API به صورت string برمی‌گردد
  category: string;
  peyment_method: string; // (توجه: در API اشتباه تایپی دارد)
  description?: string;
  created_at: string;
  updated_at: string;
}
