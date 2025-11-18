export interface ExpenseMonthItem {
  month_name: string;
  total: number;
  color?: string; // می‌توانید برای هر ماه رنگ تعریف کنید، اختیاری
}

export interface ExpenseResponse {
  total_expense_6_month: number;
  average_monthly_expense: number;
  months: ExpenseMonthItem[];
}
