// src/components/CompanyTable.tsx
import { DataTable } from "@/components/ui/DataTable";
import { Eye, Edit, Trash2, Building } from "lucide-react";

interface Company {
    id: string;
    name: string;
    category: string;
    owner: string;
    status: 'active' | 'inactive';
    createdAt: string;
}

interface CompanyTableProps {
    companies: Company[];
    onView: (company: Company) => void;
    onEdit: (company: Company) => void;
    onDelete: (company: Company) => void;
}

export function CompanyTable({ companies, onView, onEdit, onDelete }: CompanyTableProps) {
    const columns = [
        {
            key: "name" as const,
            label: "نام شرکت",
            sortable: true,
            render: (value: string | number, row: Company) => (
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
            key: "category" as const,
            label: "دسته‌بندی",
            sortable: true,
            render: (value: string | number) => (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {value as string}
                </span>
            )
        },
        {
            key: "owner" as const,
            label: "مالک",
            sortable: true
        },
        {
            key: "status" as const,
            label: "وضعیت",
            sortable: true,
            render: (value: string | number) => {
                const statusConfig = {
                    active: { color: "bg-green-100 text-green-800", label: "فعال" },
                    inactive: { color: "bg-red-100 text-red-800", label: "غیرفعال" },
                };

                const config = statusConfig[value as keyof typeof statusConfig];
                return (
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${config?.color || 'bg-gray-100 text-gray-800'}`}>
                        {config?.label || value as string}
                    </span>
                );
            }
        },
        {
            key: "createdAt" as const,
            label: "تاریخ ایجاد",
            sortable: true,
            render: (value: string | number) => new Date(value as string).toLocaleDateString('fa-IR')
        }
    ];

    const actions = (company: Company) => [
        {
            label: "مشاهده",
            icon: <Eye size={16} />,
            onClick: () => onView(company)
        },
        {
            label: "ویرایش",
            icon: <Edit size={16} />,
            onClick: () => onEdit(company)
        },
        {
            label: "حذف",
            icon: <Trash2 size={16} />,
            onClick: () => onDelete(company)
        }
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