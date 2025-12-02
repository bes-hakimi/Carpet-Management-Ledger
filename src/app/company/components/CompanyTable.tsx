import { DataTable, Column } from "@/components/ui/DataTable";
import { Eye, Edit, Trash2, Building } from "lucide-react";

interface Company {
  id: string;
  name: string;
  category: string;
  owner: string;
  email: string;
  phone: string;
  status: "active" | "inactive";
  createdAt: string;
}

interface CompanyTableProps {
  companies: Company[];
  onView: (company: Company) => void;
  onEdit: (company: Company) => void;
  onDelete: (company: Company) => void;
}

export function CompanyTable({ companies, onView, onEdit, onDelete }: CompanyTableProps) {
  const columns: Column<Company>[] = [
    {
      key: "name",
      label: "نام شرکت",
      sortable: true,
      render: (_value: unknown, row: Company) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-cyan-500 rounded-lg flex items-center justify-center">
            <Building size={20} className="text-white" />
          </div>
          <div>
            <div className="font-medium text-gray-900">{row.name}</div>
            <div className="text-xs text-gray-500">ID: {row.id}</div>
          </div>
        </div>
      ),
    },
    {
      key: "category",
      label: "دسته‌بندی",
      sortable: true,
      render: (_value: unknown, row: Company) => (
        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
          {row.category}
        </span>
      ),
    },
    {
      key: "owner",
      label: "مالک",
      sortable: true,
      render: (_value: unknown, row: Company) => row.owner,
    },
    {
      key: "email",
      label: "ایمیل",
      sortable: true,
      render: (_value: unknown, row: Company) => <span className="text-gray-700 text-sm">{row.email || "-"}</span>,
    },
    {
      key: "phone",
      label: "شماره تماس",
      sortable: true,
      render: (_value: unknown, row: Company) => <span className="text-gray-700 text-sm ltr">{row.phone || "-"}</span>,
    },
    {
      key: "status",
      label: "وضعیت",
      sortable: true,
      render: (_value: unknown, row: Company) => {
        const statusConfig = {
          active: { color: "bg-green-100 text-green-800", label: "فعال" },
          inactive: { color: "bg-red-100 text-red-800", label: "غیرفعال" },
        };
        const config = statusConfig[row.status];
        return (
          <span
            className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
              config?.color ?? "bg-gray-100 text-gray-800"
            }`}
          >
            {config?.label ?? row.status}
          </span>
        );
      },
    },
    {
      key: "createdAt",
      label: "تاریخ ایجاد",
      sortable: true,
      render: (_value: unknown, row: Company) => new Date(row.createdAt).toLocaleDateString("fa-IR"),
    },
  ];

  const actions = (row: Company) => [
    { label: "مشاهده", icon: <Eye size={16} />, onClick: () => onView(row) },
    { label: "ویرایش", icon: <Edit size={16} />, onClick: () => onEdit(row) },
    { label: "حذف", icon: <Trash2 size={16} />, onClick: () => onDelete(row) },
  ];

  return (
    <DataTable<Company>
      data={companies}
      columns={columns}
      title="لیست شرکت‌ها"
      searchable={true}
      actions={actions}
      onRowClick={onView}
    />
  );
}
