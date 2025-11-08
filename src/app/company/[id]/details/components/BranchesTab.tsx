"use client";
import { DataTable } from "@/components/ui/DataTable";
import { Eye, Edit, Trash2, Building2 } from "lucide-react";
import { IUser } from "@/types/user/user";

interface BranchesTabProps {
  data: IUser[];
  onView?: (branch: IUser) => void;
  onEdit?: (branch: IUser) => void;
  onDelete?: (branch: IUser) => void;
}

export function BranchesTab({ data, onView, onEdit, onDelete }: BranchesTabProps) {
  const columns = [
    {
      key: "branch_name" as keyof IUser,
      label: "نام شعبه",
      sortable: true,
      render: (value: IUser[keyof IUser], row: IUser) => {
        const branchName = (value as string) ?? "بدون نام";
        return (
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-teal-500 to-cyan-500 rounded-lg flex items-center justify-center">
              <Building2 size={20} className="text-white" />
            </div>
            <div>
              <div className="font-medium text-gray-900">{branchName}</div>
              <div className="text-xs text-gray-500">ID: {row.id}</div>
            </div>
          </div>
        );
      },
    },
    {
      key: "first_name" as keyof IUser,
      label: "مدیر شعبه",
      sortable: true,
      render: (value: IUser[keyof IUser]) => (value as string) ?? "",
    },
    {
      key: "phone" as keyof IUser,
      label: "شماره تماس",
      sortable: true,
      render: (value: IUser[keyof IUser]) => (value as string | number) ?? "",
    },
    {
      key: "email" as keyof IUser,
      label: "ایمیل",
      sortable: true,
      render: (value: IUser[keyof IUser]) => (value as string) ?? "",
    },
    {
      key: "date_joined" as keyof IUser,
      label: "تاریخ ایجاد",
      sortable: true,
      render: (value: IUser[keyof IUser]) => (value ? new Date(value as string).toLocaleDateString("fa-IR") : ""),
    },
    {
      key: "status" as keyof IUser,
      label: "وضعیت",
      sortable: true,
      render: (value: IUser[keyof IUser]) => {
        const status = value as boolean | undefined;
        const statusConfig = {
          true: { color: "bg-green-100 text-green-800", label: "فعال" },
          false: { color: "bg-red-100 text-red-800", label: "غیرفعال" },
        };
        const config = statusConfig[String(status) as keyof typeof statusConfig];
        return (
          <span
            className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${config?.color || "bg-gray-100 text-gray-800"
              }`}
          >
            {config?.label || ""}
          </span>
        );
      },
    },
  ];

  const actions = (branch: IUser) => [
    { label: "مشاهده", icon: <Eye size={16} />, onClick: () => onView?.(branch) },
    { label: "ویرایش", icon: <Edit size={16} />, onClick: () => onEdit?.(branch) },
    { label: "حذف", icon: <Trash2 size={16} />, onClick: () => onDelete?.(branch) },
  ];

  return (
    <DataTable<IUser>
      data={data}
      columns={columns}
      title="لیست شعبات"
      searchable={true}
      actions={actions}
      onRowClick={onView}
    />
  );
}
