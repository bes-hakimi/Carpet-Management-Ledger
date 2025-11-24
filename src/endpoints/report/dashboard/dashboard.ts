export const DASHBOARD = {
  main: "/dash-main-report/",
  
  sales_chart: (period: string = "day") =>
    `/dash-sales-chart-report/?period=${period}`,

  net_income_chart: (period: string = "day") =>
    `/dash-net-income-chart-report/?period=${period}`,

  expense_chart: "/dash-expense-chart-report/",
  resent_transaction: "/dash-tran-report/",
  inventory_summary: "/dash-stock-report/",
};
