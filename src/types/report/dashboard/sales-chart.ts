// src/types/report/dashborad/sales-chart.ts
export interface SalesChartDayItem {
  weekday: string;
  total: number;
}

export interface SalesChartWeekItem {
  week_start: string;
  total: number;
}

export interface SalesChartMonthItem {
  month: string;
  total: number;
}

export interface SalesChartYearItem {
  year: number;
  total: number;
}

export type SalesChartItem = SalesChartDayItem | SalesChartWeekItem | SalesChartMonthItem | SalesChartYearItem;

export interface SalesChartResponse {
  data: SalesChartItem[];
}
