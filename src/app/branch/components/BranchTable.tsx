// src/components/BranchTable.tsx
"use client";

import { DataTable } from "@/components/ui/DataTable";
import { Eye, Edit, Trash2, Building } from "lucide-react";

interface Branch {
  id: string;
  branchName: string;
  managerName: string;
  phoneNumber: string;
  email?: string;
  address: string;
  isActive: boolean;
  description?: string;
  createdAt: string;
}

interface BranchTableProps {
  branches: Branch[];
  onView: (branch: Branch) => void;
  onEdit: (branch: Branch) => void;
  onDelete: (branch: Branch) => void;
}

export function BranchTable({ branches, onView, onEdit, onDelete }: BranchTableProps) {
  const columns = [
  {
    key: "branchName" as const,
    label: "نام شعبه",
    sortable: true,
    render: (value: string | boolean | undefined, row: Branch) => (
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-gradient-to-br from-teal-500 to-cyan-500 rounded-lg flex items-center justify-center">
          <Building size={20} className="text-white" />
        </div>
        <div>
          <div className="font-medium text-gray-900">{value as string}</div>
          <div className="text-xs text-gray-500">ID: {row.id}</div>
        </div>
      </div>
    )
  },
  {
    key: "managerName" as const,
    label: "مدیر شعبه",
    sortable: true
  },
  {
    key: "phoneNumber" as const,
    label: "شماره تماس",
    sortable: true
  },
  {
    key: "email" as const,
    label: "ایمل",
    sortable: true
  },
  {
    key: "isActive" as const,
    label: "وضعیت",
    sortable: true,
    render: (value: string | boolean | undefined) => {
      const statusConfig = {
        true: { color: "bg-green-100 text-green-800", label: "فعال" },
        false: { color: "bg-red-100 text-red-800", label: "غیرفعال" },
      };

      const config = statusConfig[value as unknown as keyof typeof statusConfig];
      return (
        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${config?.color || 'bg-gray-100 text-gray-800'}`}>
          {config?.label || (value?.toString() ?? "")}
        </span>
      );
    }
  },
  {
    key: "createdAt" as const,
    label: "تاریخ ایجاد",
    sortable: true,
    render: (value: string | boolean | undefined) => new Date(value as string).toLocaleDateString('fa-IR')
  }
];


  const actions = (branch: Branch) => [
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
    <DataTable<Branch>
      data={branches}
      columns={columns}
      title="لیست شعبات"
      searchable={true}
      actions={actions}
      onRowClick={onView}
    />
  );
}
