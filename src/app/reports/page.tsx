"use client";

import { useState, useEffect } from "react";
import { PageHeader } from "@/components/ui/PageHeader";
import ReportHeader from "./components/ReportHeader";

import OverviewStatsCards from "./components/overview/OverviewStatsCards";
import SalesStatsCards from "./components/sales/SalesStatsCards";
import FinancialStatsCards from "./components/financial/FinancialStatsCards";
import BranchList from "./components/branch/BranchList";

// APIs
import { PUBLIC, SALE, FINANCIAL } from "@/endpoints/report/report";
import { useApiGet } from "@/hooks/useApi";

// Types
import {
  IPublicMainReport,
  IPublicDailySale,
  IPublicTopSellingProduct,
} from "@/types/report/overview";

import {
  ISaleMainReport,
  ISaleDailySale,
  ISaleTopSellingProduct,
} from "@/types/report/sale";

import {
  IFinancialMainReport,
  IFinancialDailyExpense,
  IFinancialDailyReport,
} from "@/types/report/financial";

import DailyFinancialList from "./components/financial/DailyFinancialList";
import DailyExpenseList from "./components/financial/DailyExpenseList";
import OverviewTopProducts from "./components/overview/OverviewTopProducts";
import SalesTopProducts from "./components/sales/SalesTopProducts";
import OverviewDailySalesReport from "./components/overview/OverviewDailySalesReport";
import SalesDailySalesReport from "./components/sales/SalesDailySalesReport";
import { CardLoader } from "@/components/loading/DataLoading";

export default function ReportsPage() {
  const [activeView, setActiveView] = useState<"overview" | "sales" | "financial" | "branches">("overview");
  const [reportType, setReportType] = useState<"public" | "sales" | "financial">("public");
  const [isLoading, setIsLoading] = useState(false);

  // ======================================================
  // APIs بدون fetch خودکار
  // ======================================================
  const publicMain = useApiGet<IPublicMainReport>("public_main", PUBLIC.main, { enabled: false });
  const publicTop = useApiGet<IPublicTopSellingProduct[]>("public_top", PUBLIC.top_salling_product, { enabled: false });
  const publicDaily = useApiGet<IPublicDailySale[]>("public_daily", PUBLIC.daly_sale, { enabled: false });

  const salesMain = useApiGet<ISaleMainReport>("sales_main", SALE.main, { enabled: false });
  const salesTop = useApiGet<ISaleTopSellingProduct[]>("sales_top", SALE.top_salling_product, { enabled: false });
  const salesDaily = useApiGet<ISaleDailySale[]>("sales_daily", SALE.daly_sale, { enabled: false });

  const financialMain = useApiGet<IFinancialMainReport>("financial_main", FINANCIAL.main, { enabled: false });
  const financialTop = useApiGet<IFinancialDailyReport[]>("financial_top", FINANCIAL.top_salling_product, { enabled: false });
  const financialDaily = useApiGet<IFinancialDailyExpense[]>("financial_daily", FINANCIAL.daly_sale, { enabled: false });

  // ======================================================
  // Refetch وقتی activeView یا reportType تغییر کند
  // ======================================================
  useEffect(() => {
    const fetchData = async () => {
      if (activeView === "overview" && reportType === "public") {
        await publicMain.refetch();
        await publicTop.refetch();
        await publicDaily.refetch();
      } else if (activeView === "sales" && reportType === "sales") {
        await salesMain.refetch();
        await salesTop.refetch();
        await salesDaily.refetch();
      } else if (activeView === "financial" && reportType === "financial") {
        await financialMain.refetch();
        await financialTop.refetch();
        await financialDaily.refetch();
      }
    };
    fetchData();
  }, [activeView, reportType]);

  const handleGenerateReport = async () => {
    setIsLoading(true);
    try {
      switch (reportType) {
        case "public":
          await publicMain.refetch();
          await publicTop.refetch();
          await publicDaily.refetch();
          setActiveView("overview");
          break;
        case "sales":
          await salesMain.refetch();
          await salesTop.refetch();
          await salesDaily.refetch();
          setActiveView("sales");
          break;
        case "financial":
          await financialMain.refetch();
          await financialTop.refetch();
          await financialDaily.refetch();
          setActiveView("financial");
          break;
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full space-y-6">
      <PageHeader
        title="داشبورد مدیریتی"
        showHomeIcon={true}
        description="گزارشات جامع عملکرد سیستم"
      />

      <ReportHeader
        activeView={activeView}
        setActiveView={setActiveView}
        reportType={reportType}
        setReportType={setReportType}
        isLoading={isLoading}
        onGenerateReport={handleGenerateReport}
        onExportReport={(type) => console.log("Export report as", type)}
      />

      {activeView === "branches" && <BranchList />}
      {/* Stats Cards */}
      {activeView === "overview" && (
        publicMain.isLoading
          ? <CardLoader />
          : publicMain.data && <OverviewStatsCards stats={publicMain.data} />
      )}

      {activeView === "sales" && (
        salesMain.isLoading
          ? <CardLoader />
          : salesMain.data && <SalesStatsCards stats={salesMain.data} />
      )}

      {activeView === "financial" && (
        financialMain.isLoading
          ? <CardLoader />
          : financialMain.data && <FinancialStatsCards stats={financialMain.data} />
      )}


      {/* Daily / Top Products */}
      {activeView !== "branches" && (
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
          <div className="xl:col-span-2">
            {activeView === "overview" && (
              publicDaily.isLoading
                ? <CardLoader />
                : publicDaily.data && <OverviewDailySalesReport data={publicDaily.data} />
            )}

            {activeView === "sales" && (
              salesDaily.isLoading
                ? <CardLoader />
                : salesDaily.data && <SalesDailySalesReport data={salesDaily.data} />
            )}

            {activeView === "financial" && (
              financialDaily.isLoading
                ? <CardLoader />
                : financialDaily.data && (
                  <DailyExpenseList data={financialTop.data ?? []} />
                )
            )}
          </div>

          {activeView === "overview" && (
            publicTop.isLoading
              ? <CardLoader />
              : <OverviewTopProducts data={publicTop.data ?? []} />
          )}

          {activeView === "sales" && (
            salesTop.isLoading
              ? <CardLoader />
              : <SalesTopProducts data={salesTop.data ?? []} />
          )}

          {activeView === "financial" && (
            financialTop.isLoading
              ? <CardLoader />
              : (
                <DailyFinancialList data={financialDaily.data ?? []} />
              )
          )}
        </div>
      )}

    </div>
  );
}
