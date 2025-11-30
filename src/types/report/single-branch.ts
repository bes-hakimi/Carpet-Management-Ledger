// ---------------- Single Branch (برند واحد) ----------------
export interface ISingleBranchMainReport {
  report: {
    total_stock_qty: number;
    total_sales_price: number;
    branches_value: number;
    total_sold_qty: number;
  };
}

export interface ISingleBranchDailyTransaction {
  id: number;
  amount: number;
  slug: string;
  type: "income" | "expense";
  title: string;
  color: string;
  date: string;
}

export interface ISingleBranchStockItem {
  name: string;
  type: string;
  stock_qty: number;
  max_stock: number;
  percentage: number;
  status: "normal" | "low" | "out";
}