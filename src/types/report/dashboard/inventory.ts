export interface InventoryItem {
  name: string;
  type: string;
  stock_qty: number;
  max_stock: number;
  percentage: number;
  status: "normal" | "warning" | "critical";
}
