"use client";
import { DataTable } from "@/components/ui/DataTable";
import { Eye, Edit, Trash2, User2 } from "lucide-react";
import { IUser } from "@/types/user/user";

interface StaffTabProps {
  data: IUser[];
  onView?: (user: IUser) => void;
  onEdit?: (user: IUser) => void;
  onDelete?: (user: IUser) => void;
}

export function StaffTab({ data, onView, onEdit, onDelete }: StaffTabProps) {
  const columns = [
    {
      key: "first_name" as keyof IUser,
      label: "کارمند",
      sortable: true,
      render: (_value: IUser[keyof IUser], row: IUser) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-teal-500 to-cyan-500 rounded-lg flex items-center justify-center">
            <User2 size={20} className="text-white" />
          </div>
          <div>
            <div className="font-medium text-gray-900">{row.first_name} {row.last_name}</div>
            <div className="text-xs text-gray-500">ID: {row.id}</div>
          </div>
        </div>
      ),
    },
    {
      key: "phone" as keyof IUser,
      label: "شماره تماس",
      sortable: true,
      render: (value: IUser[keyof IUser]) => (value as string) ?? "",
    },
    {
      key: "email" as keyof IUser,
      label: "ایمل",
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
          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${config?.color || 'bg-gray-100 text-gray-800'}`}>
            {config?.label || ""}
          </span>
        );
      },
    },
  ];

  const actions = (user: IUser) => [
    { label: "مشاهده", icon: <Eye size={16} />, onClick: () => onView?.(user) },
    { label: "ویرایش", icon: <Edit size={16} />, onClick: () => onEdit?.(user) },
    { label: "حذف", icon: <Trash2 size={16} />, onClick: () => onDelete?.(user) },
  ];

  return (
    <DataTable<IUser>
      data={data}
      columns={columns}
      title="لیست کارمندان"
      searchable={true}
      actions={actions}
      onRowClick={onView}
    />
  );
}
