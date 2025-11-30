export interface IPublicMainReport {
  report: {
    total_stock_qty: number;
    total_sales_price: number;
    company_value: number;
    total_sold_qty: number;
  }
}

export interface IPublicTopSellingProduct {
  rank: number;
  name: string;
  sold: number;
  stock: number;
  total_amount: string;
  image: string;
}

export interface IPublicDailySale {
  date: string;
  total_bills: number;
  total_amount: string;
  performance: {
    label: string;
    color: string;
  };
}
