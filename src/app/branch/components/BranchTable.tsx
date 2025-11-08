// src/components/BranchTable.tsx
"use client";

import { DataTable } from "@/components/ui/DataTable";
import { Eye, Edit, Trash2, Building } from "lucide-react";
import { IUser } from "@/types/user/user";

interface BranchTableProps {
  branches: IUser[];
  onView: (branch: IUser) => void;
  onEdit: (branch: IUser) => void;
  onDelete: (branch: IUser) => void;
}

export function BranchTable({ branches, onView, onEdit, onDelete }: BranchTableProps) {

  const columns = [
    {
      key: "branch_name" as const,
      label: "نام شعبه",
      sortable: true,
      render: (value: string | number | boolean | { id: number; email: string; role: string } | null | undefined, row: IUser) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-teal-500 to-cyan-500 rounded-lg flex items-center justify-center">
            <Building size={20} className="text-white" />
          </div>
          <div>
            <div className="font-medium text-gray-900">{(value as string) || row.branch_name || "—"}</div>
            <div className="text-xs text-gray-500">ID: {row.id}</div>
          </div>
        </div>
      )
    },
    {
      key: "first_name" as const,
      label: "مدیر شعبه",
      sortable: true,
      render: (_: unknown, row: IUser) => `${row.first_name || ""}`.trim() || "—"
    },
    {
      key: "phone" as const,
      label: "شماره تماس",
      sortable: true,
      render: (value: string | number | boolean | { id: number; email: string; role: string } | null | undefined) => (value?.toString() || "—")
    },
    {
      key: "email" as const,
      label: "ایمیل",
      sortable: true,
      render: (value: string | number | boolean | { id: number; email: string; role: string } | null | undefined) => (value as string) || "—"
    },
    {
      key: "status" as const,
      label: "وضعیت",
      sortable: true,
      render: (value: string | number | boolean | { id: number; email: string; role: string } | null | undefined) => {
        const boolValue = Boolean(value);
        const statusConfig: Record<string, { color: string; label: string }> = {
          "true": { color: "bg-green-100 text-green-800", label: "فعال" },
          "false": { color: "bg-red-100 text-red-800", label: "غیرفعال" },
        };
        const key = boolValue.toString();
        const config = statusConfig[key];
        return (
          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${config.color}`}>
            {config.label}
          </span>
        );
      }
    },
    {
      key: "date_joined" as const,
      label: "تاریخ ایجاد",
      sortable: true,
      render: (value: string | number | boolean | { id: number; email: string; role: string } | null | undefined) => {
        const dateStr = value as string | undefined;
        return dateStr ? new Date(dateStr).toLocaleDateString('fa-IR') : "—";
      }
    }
  ];

  const actions = (branch: IUser) => [
    {
      label: "مشاهده",
      icon: <Eye size={16} />,
      onClick: () => onView(branch)
    },
    {
      label: "ویرایش",
      icon: <Edit size={16} />,
      onClick: () => onEdit(branch)
    },
    {
      label: "حذف",
      icon: <Trash2 size={16} />,
      onClick: () => onDelete(branch)
    }
  ];

  return (
    <DataTable<IUser>
      data={branches}
      columns={columns}
      title="لیست شعبات"
      searchable={true}
      actions={actions}
      onRowClick={onView}
    />
  );
}
