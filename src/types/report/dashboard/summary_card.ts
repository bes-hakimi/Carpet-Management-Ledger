export interface SummaryCardType {
    report: {
        total_stock_qty: number;
        total_sales_price: number;
        product_cost: number;
        total_expense: number;
        net_income: number;
    };
    last_update?: string;
}
