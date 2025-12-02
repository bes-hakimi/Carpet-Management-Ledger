import { DataTable, Column } from "@/components/ui/DataTable";
import { Eye, Edit, Trash2, Building } from "lucide-react";
import { IUser } from "@/types/user/user";

interface StaffTableProps {
  staff: IUser[];
  onView: (staff: IUser) => void;
  onEdit: (staff: IUser) => void;
  onDelete: (staff: IUser) => void;
}

export function StaffTable({ staff, onView, onEdit, onDelete }: StaffTableProps) {
  const columns: Column<IUser>[] = [
    {
      key: "first_name",
      label: "نام کارمند",
      sortable: true,
      render: (_value: unknown, row: IUser) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-cyan-500 rounded-lg flex items-center justify-center">
            <Building size={20} className="text-white" />
          </div>
          <div>
            <div className="font-medium text-gray-900">{row.first_name} {row.last_name}</div>
            <div className="text-xs text-gray-500">ID: {row.id}</div>
          </div>
        </div>
      ),
    },
    {
      key: "phone",
      label: "شماره تماس",
      sortable: true,
      render: (_value: unknown, row: IUser) => <span className="inline-flex items-center text-sm">{row.phone ?? "-"}</span>,
    },
    {
      key: "email",
      label: "ایمیل",
      sortable: true,
      render: (_value: unknown, row: IUser) => <span className="inline-flex items-center text-sm">{row.email ?? "-"}</span>,
    },
    {
      key: "date_joined",
      label: "تاریخ ایجاد",
      sortable: true,
      render: (_value: unknown, row: IUser) => row.date_joined ? new Date(row.date_joined).toLocaleDateString("fa-IR") : "-",
    },
    {
      key: "status",
      label: "وضعیت",
      sortable: true,
      render: (_value: unknown, row: IUser) => {
        const statusConfig = {
          true: { color: "bg-green-100 text-green-800", label: "فعال" },
          false: { color: "bg-red-100 text-red-800", label: "غیرفعال" },
        };
        const config = statusConfig[row.status ? "true" : "false"];
        return (
          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${config?.color ?? "bg-gray-100 text-gray-800"}`}>
            {config?.label ?? "-"}
          </span>
        );
      },
    },
  ];

  const actions = (row: IUser) => [
    { label: "مشاهده", icon: <Eye size={16} />, onClick: () => onView(row) },
    { label: "ویرایش", icon: <Edit size={16} />, onClick: () => onEdit(row) },
    { label: "حذف", icon: <Trash2 size={16} />, onClick: () => onDelete(row) },
  ];

  return (
    <DataTable<IUser>
      data={staff}
      columns={columns}
      title="لیست کارمندان"
      searchable={true}
      actions={actions}
      onRowClick={onView}
    />
  );
}
