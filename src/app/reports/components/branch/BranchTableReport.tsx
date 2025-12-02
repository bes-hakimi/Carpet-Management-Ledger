// src/components/BranchTable.tsx
"use client";

import { DataTable, Column } from "@/components/ui/DataTable";
import { Eye, Building } from "lucide-react";
import { IUser } from "@/types/user/user";

interface BranchTableProps {
  branches: IUser[];
 onView: (id: number) => void;
}

export function BranchTableReport({ branches, onView }: BranchTableProps) {

  const columns: Column<IUser>[] = [
    {
      key: "branch_name",
      label: "نام شعبه",
      sortable: true,
      render: (value: unknown, row: IUser) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-cyan-500 rounded-lg flex items-center justify-center">
            <Building size={20} className="text-white" />
          </div>
          <div>
            <div className="font-medium text-gray-900">{(value as string) || row.branch_name || "—"}</div>
            <div className="text-xs text-gray-500">ID: {row.id}</div>
          </div>
        </div>
      ),
    },
    {
      key: "first_name",
      label: "مدیر شعبه",
      sortable: true,
      render: (_, row) => row.first_name || "—",
    },
    {
      key: "phone",
      label: "شماره تماس",
      sortable: true,
      render: (v) => v?.toString() || "—",
    },
    {
      key: "email",
      label: "ایمیل",
      sortable: true,
      render: (v) => (v as string) || "—",
    },
    {
      key: "status",
      label: "وضعیت",
      sortable: true,
      render: (value: unknown) => {
        const boolValue = Boolean(value);
        const config = boolValue
          ? { color: "bg-green-100 text-green-800", label: "فعال" }
          : { color: "bg-red-100 text-red-800", label: "غیرفعال" };

        return (
          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${config.color}`}>
            {config.label}
          </span>
        );
      },
    },
    {
      key: "date_joined",
      label: "تاریخ ایجاد",
      sortable: true,
      render: (value: unknown) =>
        value ? new Date(value as string).toLocaleDateString("fa-IR") : "—",
    },
  ];

  // 👇 فقط دکمه "مشاهده" باقی می‌ماند و فقط id پاس داده می‌شود
  const actions = (branch: IUser) => [
    {
      label: "مشاهده",
      icon: <Eye size={16} />,
         onClick: () => onView(branch.id!), 
    },
  ];

  return (
    <DataTable<IUser>
      data={branches}
      columns={columns}
      title="لیست شعبات"
      searchable={true}
      actions={actions}
      onRowClick={(row) => onView(row.id!)} // ← اینجا هم !

    />
  );
}
