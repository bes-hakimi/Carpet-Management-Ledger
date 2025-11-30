export interface IFinancialMainReport {
 report: {
    total_sales_price: number;
    product_cost: number;
    total_expense: number;
    net_income: number;
  }
}

export interface IFinancialDailyReport {
  date: string;
  total_bills: number;
  total_sales: string;
  net_profit: string;
  performance: {
    label: string;
    color: string;
  }
}

export interface IFinancialDailyExpense {
  day: string;
  total_expenses: string;

}
