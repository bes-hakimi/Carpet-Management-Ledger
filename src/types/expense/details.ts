// types/expense/expense.ts

export interface ExpenseDetailsType {
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
  price: string;             // مقدار از API به شکل string است
  category: string;
  peyment_method: string;
  description?: string;      // اختیاری
  created_at: string;        // تاریخ ISO
  updated_at: string;        // تاریخ ISO
  status?: "pending" | "completed" | "cancelled"; // اختیاری برای UI
}
