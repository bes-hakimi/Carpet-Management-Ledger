"use client";

import { useState } from "react";
import { BranchTableReport } from "./BranchTableReport";
import { ContentLoader } from "@/components/loading/DataLoading";
import { USERS } from "@/endpoints/users";
import { BRANCH, SINGLE_BRANCH } from "@/endpoints/report/report";
import { useApiGet } from "@/hooks/useApi";
import { EmptyData } from "@/components/empty/EmptyData";
import { IUser } from "@/types/user/user";
import BranchStatsCards from "./BranchStatsCards";
import BranchDailySalesReport from "./BranchDailySalesReport";
import SingleBranchStatsCards from "./single_branch/SingleBranchStatsCards";
import SingleBranchDailyReport from "./single_branch/SingleBranchDailyReport";
import SingleBrachTopProducts from "./single_branch/SingleBrachTopProducts";
import BranchTopProducts from "./BranchTopProducts";
import { CardLoader } from "@/components/loading/DataLoading";
import { ShoppingCart, Users, DollarSign } from "lucide-react"

// تایپ‌های API
import {
  IBranchMainReport,
  IBranchDailySale,
  IBranchStockItem,
} from "@/types/report/branch";

import {
  ISingleBranchMainReport,
  ISingleBranchDailyTransaction,
  ISingleBranchStockItem,
} from "@/types/report/single-branch";

type ApiResponse = IUser[] | { results?: IUser[]; message?: string };

function isIUserArray(data: unknown): data is IUser[] {
  return Array.isArray(data) && data.every((item) => "id" in item);
}

export default function BranchList() {
  const [selectedBranchId, setSelectedBranchId] = useState<number | null>(null);
  const [selectedBranch, setSelectedBranch] = useState<IUser | null>(null);

  // لیست شعبه‌ها
  const { data: branchData, isLoading: loadingBranches, error: branchError } = useApiGet<ApiResponse>(
    "branches",
    USERS.getBranchList
  );

  const branches: IUser[] = isIUserArray(branchData)
    ? branchData
    : Array.isArray(branchData?.results)
      ? branchData.results
      : [];

  const emptyMessage =
    branches.length === 0
      ? branchData && "message" in branchData
        ? branchData.message
        : "هیچ شعبه‌ای یافت نشد."
      : null;

  // آمار و گزارش کلی شعبه‌ها
  const branchMain = useApiGet<IBranchMainReport>("branch_main", BRANCH.main, { enabled: !selectedBranchId });
  const branchDaily = useApiGet<IBranchDailySale[]>("branch_daily", BRANCH.daly_financial, { enabled: !selectedBranchId });
  const branchStock = useApiGet<IBranchStockItem[]>("branch_stock", BRANCH.branch_stock, { enabled: !selectedBranchId });

  // جزئیات شعبه واحد
  const singleBranchMain = useApiGet<ISingleBranchMainReport>(
    "single_branch_main",
    selectedBranchId ? SINGLE_BRANCH.main(selectedBranchId) : "",
    { enabled: !!selectedBranchId }
  );
  const singleBranchDaily = useApiGet<ISingleBranchDailyTransaction[]>(
    "single_branch_daily",
    selectedBranchId ? SINGLE_BRANCH.branch_transaction(selectedBranchId) : "",
    { enabled: !!selectedBranchId }
  );
  const singleBranchStock = useApiGet<ISingleBranchStockItem[]>(
    "single_branch_stock",
    selectedBranchId ? SINGLE_BRANCH.branch_stock(selectedBranchId) : "",
    { enabled: !!selectedBranchId }
  );

  return (
    <div className="w-full space-y-6">
      {loadingBranches ? (
        <div className="flex w-full h-[300px] items-center justify-center">
          <ContentLoader />
        </div>
      ) : branchError ? (
        <p className="text-center text-red-500 mt-6">{branchError.message ?? "خطا در دریافت داده‌ها"}</p>
      ) : emptyMessage ? (
        <EmptyData title={emptyMessage} />
      ) : (
        <>
          {/* جدول شعبه‌ها */}
          <BranchTableReport
            branches={branches}
            onView={(id: number) => {
              setSelectedBranchId(id);
              const branch = branches.find((b) => b.id === id) || null;
              setSelectedBranch(branch);
            }}
          />
          {/* اطلاعات مختصر شعبه انتخاب‌شده */}
          {selectedBranch && (
            <div className="p-4 md:p-6 bg-white rounded-md border border-gray-200 hover:shadow-lg transition-shadow duration-300">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-xl font-bold text-gray-900">
                    {selectedBranch.branch_name ?? "شعبه بدون نام"}
                  </h3>
                  <p className="text-sm text-gray-500 mt-1">مدیر: {selectedBranch.first_name}</p>
                  <p className="text-sm text-gray-500 mt-1">تلفن: {selectedBranch.phone ?? "-"}</p>
                  <p className="text-sm text-gray-500 mt-1">ایمل: {selectedBranch.email ?? "-"}</p>
                </div>
                {selectedBranch.company_logo && (
                  <img
                    src={selectedBranch.company_logo}
                    alt="لوگو شرکت"
                    className="w-16 h-16 object-contain rounded-lg"
                  />
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                <div className="flex items-center gap-3 p-3 bg-blue-100 rounded-md">
                  <ShoppingCart className="w-6 h-6 text-blue-600" />
                  <div>
                    <p className="text-sm text-gray-500">محصولات</p>
                    <p className="font-bold text-gray-900">{selectedBranch.products_count ?? 0}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-green-100 rounded-md">
                  <Users className="w-6 h-6 text-green-600" />
                  <div>
                    <p className="text-sm text-gray-500">کارکنان</p>
                    <p className="font-bold text-gray-900">{selectedBranch.staff_count ?? 0}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-amber-100 rounded-md">
                  <DollarSign className="w-6 h-6 text-amber-600" />
                  <div>
                    <p className="text-sm text-gray-500">فروش‌ها</p>
                    <p className="font-bold text-gray-900">{selectedBranch.sales_count ?? 0}</p>
                  </div>
                </div>
              </div>
            </div>
          )}


          {/* آمار و گزارش کلی شعبه‌ها */}
          {!selectedBranchId && (
            <>
              {/* ---- MAIN STATS ---- */}
              {branchMain.isLoading ? (
                <CardLoader />
              ) : branchMain.data && (
                <BranchStatsCards stats={branchMain.data} />
              )}

              <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

                {/* ---- DAILY REPORT ---- */}
                <div className="xl:col-span-2">
                  {branchDaily.isLoading ? (
                    <CardLoader />
                  ) : (
                    <BranchDailySalesReport data={branchDaily.data ?? []} />
                  )}
                </div>

                {/* ---- TOP PRODUCTS ---- */}
                {branchStock.isLoading ? (
                  <CardLoader />
                ) : (
                  <BranchTopProducts data={branchStock.data ?? []} />
                )}
              </div>
            </>
          )}


          {/* جزئیات شعبه واحد */}
          {selectedBranchId && (
            <>
              {/* ---- SINGLE MAIN ---- */}
              {singleBranchMain.isLoading ? (
                <CardLoader />
              ) : singleBranchMain.data && (
                <SingleBranchStatsCards stats={singleBranchMain.data} />
              )}

              <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

                {/* ---- SINGLE DAILY ---- */}
                <div className="xl:col-span-2">
                  {singleBranchDaily.isLoading ? (
                    <CardLoader />
                  ) : (
                    <SingleBranchDailyReport data={singleBranchDaily.data ?? []} />
                  )}
                </div>

                {/* ---- SINGLE TOP PRODUCTS ---- */}
                {singleBranchStock.isLoading ? (
                  <CardLoader />
                ) : (
                  <SingleBrachTopProducts data={singleBranchStock.data ?? []} />
                )}
              </div>
            </>
          )}

        </>
      )}
    </div>
  );
}
