// src/app/sales/components/SalesList.tsx
"use client";

import { Eye, FileText } from "lucide-react";
import { DataTable, Column } from "@/components/ui/DataTable";
import { SaleList } from "@/types/sales/list";
import { useRouter } from "next/navigation";

interface SalesListProps {
  sales: SaleList[];
  onViewDetails: (sale: SaleList) => void;
}

export function SalesList({ sales, onViewDetails }: SalesListProps) {
  const router = useRouter();
  const columns: Column<SaleList>[] = [
    {
      key: "customer.customer_name",
      label: "مشتری",
      sortable: true,
      render: (_value, row) => {
        const firstLetter = row.customer.customer_name?.[0]?.toUpperCase() || "?";
        return (
          <div className="flex items-center gap-3">
            {/* مربع با حرف اول */}
            <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-cyan-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold">{firstLetter}</span>
            </div>
            {/* نام کامل مشتری */}
            <span className="text-gray-800 font-medium">
              {row.customer.customer_name}
            </span>
          </div>
        );
      }
    },

    {
      key: "slug",
      label: "شماره بل",
      sortable: true,
      render: (_value, row) => <span>{row.slug || row.id}</span>
    },
    {
      key: "delivery_method",
      label: "رویش تحویل",
      sortable: true,
      render: (_value, row) => <span>{row.delivery_method}</span>
    },
    {
      key: "payment_method",
      label: "رویش پرداخت",
      sortable: true,
      render: (_value, row) => <span>{row.payment_method}</span>
    },
    {
      key: "created_at",
      label: "تاریخ",
      sortable: true,
      render: (_value, row) => new Date(row.created_at).toLocaleDateString('fa-IR')
    },
  ];

  const getActions = (sale: SaleList) => [
    { label: "مشاهده", icon: <Eye className="w-4 h-4" />, onClick: () => onViewDetails(sale) },
  ];

  if (sales.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
        <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">فروشی یافت نشد</h3>
        <p className="text-gray-500">هیچ فروشی موجود نمی‌باشد.</p>
      </div>
    );
  }

  return (
    <DataTable<SaleList>
      data={sales}
      columns={columns}
      title="لیست فروش‌ها"
      searchable={true}
      onRowClick={(row) => router.push(`/sales/${row.id}/details`)}
      actions={getActions}
    />
  );
}
