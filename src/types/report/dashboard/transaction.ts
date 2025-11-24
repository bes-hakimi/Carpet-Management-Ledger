export interface Transaction {
  id: number;
  amount: number;
  slug?: string;
  type: "income" | "expense";
  title: string;
  color: "green" | "red";
  date: string;
}
