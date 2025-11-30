export interface ISaleMainReport {
  sales_report: {
    total_sales_price: number;
    total_orders: number;
    total_sold_qty: number;
    average_order_value: number;
  };
}

export interface ISaleTopSellingProduct {
  rank: number;
  name: string;
  sold: number;
  stock: number;
  total_amount: string;
  image: string;
}

export interface ISaleDailySale {
  date: string;
  total_bills: number;
  total_amount: string;
  performance: {
    label: string;
    color: string;
  };
}
