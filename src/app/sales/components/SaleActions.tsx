// src/components/sales/SaleActions.tsx
"use client";

import { EditButton, DeleteButton, PrintButton } from "@/components/ui/Button";
import { CheckCircle, Clock, XCircle } from "lucide-react";

interface SaleActionsProps {
  onPrint: () => void;
  saleStatus: string;
}

export function SaleActions({onPrint, saleStatus }: SaleActionsProps) {
  const getStatusInfo = (status: string) => {
    const statusConfig = {
      completed: {
        icon: CheckCircle,
        color: "text-green-600",
        bgColor: "bg-green-100",
        label: "تکمیل شده"
      },
      pending: {
        icon: Clock,
        color: "text-yellow-600",
        bgColor: "bg-yellow-100",
        label: "در انتظار"
      },
      cancelled: {
        icon: XCircle,
        color: "text-red-600",
        bgColor: "bg-red-100",
        label: "لغو شده"
      }
    };

    const config = statusConfig[status as keyof typeof statusConfig];
    const IconComponent = config.icon;

    return (
      <div className={`flex items-center px-3 py-2 rounded-lg ${config.bgColor}`}>
        <IconComponent className={`w-4 h-4 ml-2 ${config.color}`} />
        <span className={`text-sm font-medium ${config.color}`}>
          {config.label}
        </span>
      </div>
    );
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-3 md:p-6">
      <div className="flex justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-2 md:gap-4">
          <span className="text-sm font-medium text-gray-700">وضعیت بل:</span>
          {getStatusInfo(saleStatus)}
        </div>

        <div className="flex flex-wrap gap-3">
          <PrintButton
            size="md"
            onClick={onPrint}
          >
            چاپ بل
          </PrintButton>
        </div>
      </div>
    </div>
  );
}