// روزانه
export interface NetIncomeDayItem {
  day_name: string;
  net_income: number;
}

// هفتگی
export interface NetIncomeWeekItem {
  week_name: string;
  net_income: number;
}

// ماهانه
export interface NetIncomeMonthItem {
  month_name: string;
  net_income: number;
}

// سالانه
export interface NetIncomeYearItem {
  shamsi_year: number;
  net_income: number;
}

// نوع ترکیبی برای استفاده در پاسخ API
export type NetIncomeItem =
  | NetIncomeDayItem
  | NetIncomeWeekItem
  | NetIncomeMonthItem
  | NetIncomeYearItem;

// پاسخ API
export interface NetIncomeResponse {
  data: NetIncomeItem[];
}
