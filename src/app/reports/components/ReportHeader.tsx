import { Card } from "@/components/ui/Card";
import { Select } from "@/components/ui/Select";
import { Button, DownloadButton, PrintButton } from "@/components/ui/Button";
import { Filter, Eye, Building2 } from "lucide-react";
import React from "react";

type ActiveViewType = "overview" | "sales" | "financial" | "branches";

interface ReportHeaderProps {
  reportType: "public" | "sales" | "financial";
  setReportType: React.Dispatch<React.SetStateAction<"public" | "sales" | "financial">>;
  isLoading: boolean;
  activeView: ActiveViewType;
  setActiveView: React.Dispatch<React.SetStateAction<ActiveViewType>>;
  onGenerateReport: () => void;
  onExportReport: (type: string) => void;
}

const ViewToggle = ({
  activeView,
  setActiveView,
}: {
  activeView: ActiveViewType;
  setActiveView: React.Dispatch<React.SetStateAction<ActiveViewType>>;
}) => (
  <div className="flex bg-gray-100 rounded-lg p-1">
    {[
      { id: "overview" as ActiveViewType, label: "نمایه کلی", icon: Eye },
      { id: "branches" as ActiveViewType, label: "شعبات", icon: Building2 },
    ].map((item) => (
      <Button
        key={item.id}
        onClick={() => setActiveView(item.id)}
        variant={
          item.id === "overview"
            ? activeView !== "branches" ? "primary" : "ghost"
            : activeView === "branches" ? "primary" : "ghost"
        }

        size="sm"
        icon={<item.icon className="w-5 h-5" />}
        className="flex items-center"
      >
        {item.label}
      </Button>
    ))}
  </div>
);

export default function ReportHeader({
  reportType,
  setReportType,
  isLoading,
  activeView,
  setActiveView,
  onGenerateReport,
  onExportReport,
}: ReportHeaderProps) {
  // ✅ فقط وقتی شعبات انتخاب نشده، فلتر فعال باشد
  const isFilterEnabled = activeView !== "branches";

  return (
    <Card className="p-6 border-0 bg-gradient-to-r from-blue-50 to-cyan-50">
      <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">
        <div className="flex items-center gap-4">
          <h2 className="text-lg lg:text-xl font-bold text-gray-900 whitespace-nowrap">گزارشات تجارتي</h2>
          <ViewToggle activeView={activeView} setActiveView={setActiveView} />
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <Select
            label="نوع گزارش"
            options={[
              { value: "public", label: "گزارش عمومی" },
              { value: "sales", label: "گزارش فروش" },
              { value: "financial", label: "گزارش مالی" },
            ]}
            value={reportType}
            onChange={(value) => setReportType(value as "public" | "sales" | "financial")}
            className="min-w-[150px]"
            disabled={!isFilterEnabled} // فلتر فقط وقتی شعبات انتخاب نشده فعال
          />

          <div className="flex gap-2 items-end">
            <Button
              onClick={onGenerateReport}
              loading={isLoading}
              loadingText="در جریان بارگذاری..."
              icon={<Filter className="w-4 h-4" />}
              className="text-nowrap bg-gradient-to-r from-blue-500 to-cyan-500 border-0 h-fit"
              disabled={!isFilterEnabled} // فلتر فقط وقتی شعبات انتخاب نشده فعال
            >
              اعمال فیلتر
            </Button>

            <DownloadButton onClick={() => onExportReport("Excel")} variant="outline">
              خروجی
            </DownloadButton>

            <PrintButton onClick={() => onExportReport("PDF")} variant="outline">
              پرنت
            </PrintButton>
          </div>
        </div>
      </div>
    </Card>
  );
}
