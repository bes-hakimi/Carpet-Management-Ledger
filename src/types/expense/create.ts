// types/expense/creat.ts
export interface ExpenseCreate {
  title: string;
  price: string;
  category: string;
  description: string;
  peyment_method: string;
}

export interface ExpenseCreateResponse {
  id: number;
  title: string;
  price: string;
  category: string;
  description: string;
  peyment_method: string;
  created_at: string;
  updated_at: string;
}
