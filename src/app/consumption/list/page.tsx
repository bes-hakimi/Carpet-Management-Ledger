"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { DataTable, Column } from "@/components/ui/DataTable";
import { AddButton } from "@/components/ui/Button";
import { Search } from "@/components/ui/Search";
import { Select } from "@/components/ui/Select";
import { Consumption } from "@/types/consumption/consumption";
import { Eye, Edit, Trash2, DollarSign, FileText, Calculator } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";

// Mock data - در پروژه واقعی از API گرفته می‌شود
const mockConsumptions: Consumption[] = [
  {
    id: "1",
    title: "خرید از سوپرمارکت",
    amount: 1500,
    category: "food",
    date: "2024-01-15",
    description: "خرید مواد غذایی هفتگی",
    paymentMethod: "cash",
    status: "completed",
    createdAt: "2024-01-15T10:30:00Z",
    updatedAt: "2024-01-15T10:30:00Z"
  },
  {
    id: "2",
    title: "کرایه تاکسی",
    amount: 200,
    category: "transport",
    date: "2024-01-14",
    paymentMethod: "cash",
    status: "completed",
    createdAt: "2024-01-14T08:15:00Z",
    updatedAt: "2024-01-14T08:15:00Z"
  }
];

export default function ConsumptionListPage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [categoryFilter, setCategoryFilter] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("");

  const categories = [
    { value: "", label: "همه کتگوری ها" },
    { value: "food", label: "خوراکی" },
    { value: "transport", label: "حمل و نقل" },
    { value: "shopping", label: "خرید" },
    { value: "entertainment", label: "تفریح" }
  ];

  const statusOptions = [
    { value: "", label: "همه وضعیت ها" },
    { value: "pending", label: "در انتظار" },
    { value: "completed", label: "تکمیل شده" },
    { value: "cancelled", label: "لغو شده" }
  ];

  const columns: Column<Consumption>[] = [
    {
      key: "title",
      label: "عنوان",
      sortable: true,
      render: (_value: unknown, row: Consumption) => (
        <span className="font-medium text-gray-900">{row.title}</span>
      ),
    },
    {
      key: "amount",
      label: "مبلغ (افغانی)",
      sortable: true,
      render: (_value: unknown, row: Consumption) => (
        <span className="font-bold text-teal-600">
          {Number(row.amount).toLocaleString()} افغانی
        </span>
      ),
    },
    {
      key: "category",
      label: "کتگوری",
      sortable: true,
      render: (_value: unknown, row: Consumption) => {
        const categoryLabels: { [key: string]: string } = {
          food: "خوراکی",
          transport: "حمل و نقل",
          shopping: "خرید",
          entertainment: "تفریح",
          bills: "قبض ها",
          health: "صحی",
          education: "تعلیم",
          other: "دیگر"
        };
        return (
          <span className="px-3 py-1 bg-teal-100 text-teal-800 rounded-full text-sm font-medium">
            {categoryLabels[row.category] || row.category}
          </span>
        );
      },
    },
    {
      key: "date",
      label: "تاریخ",
      sortable: true,
      render: (_value: unknown, row: Consumption) => new Date(row.date).toLocaleDateString('fa-AF'),
    },
    {
      key: "paymentMethod",
      label: "طریقه پرداخت",
      render: (_value: unknown, row: Consumption) => {
        const methodLabels: { [key: string]: string } = {
          cash: "نقد",
          card: "کارت",
          digital: "دیجیتال",
          transfer: "حواله"
        };
        return methodLabels[row.paymentMethod] || row.paymentMethod;
      },
    },
    {
      key: "status",
      label: "وضعیت",
      render: (_value: unknown, row: Consumption) => {
        const statusConfig: { [key: string]: { color: string; label: string } } = {
          pending: { color: "bg-yellow-100 text-yellow-800", label: "در انتظار" },
          completed: { color: "bg-green-100 text-green-800", label: "تکمیل شده" },
          cancelled: { color: "bg-red-100 text-red-800", label: "لغو شده" }
        };
        const config = statusConfig[row.status] || { color: "bg-gray-100 text-gray-800", label: row.status };
        return (
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${config.color}`}>
            {config.label}
          </span>
        );
      },
    },
  ];


  const getRowActions = (row: Consumption) => [
    {
      label: "مشاهده",
      icon: <Eye className="w-4 h-4" />,
      onClick: () => router.push(`/consumption/${row.id}/details`)
    },
    {
      label: "ویرایش",
      icon: <Edit className="w-4 h-4" />,
      onClick: () => router.push(`/consumption/${row.id}/edit`)
    },
    {
      label: "حذف",
      icon: <Trash2 className="w-4 h-4" />,
      onClick: () => {
        if (confirm("آیا از حذف این مصرف اطمینان دارید؟")) {
          console.log("Delete consumption:", row.id);
        }
      }
    }
  ];

  const filteredData = mockConsumptions.filter(consumption => {
    const matchesSearch = consumption.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      consumption.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !categoryFilter || consumption.category === categoryFilter;
    const matchesStatus = !statusFilter || consumption.status === statusFilter;

    return matchesSearch && matchesCategory && matchesStatus;
  });

  return (
    <div className="min-h-screen w-full">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        {/* Header */}
        <PageHeader
          title="مدیریت مصارف"
          description="لیست تمام مصارف ثبت شده شما"
          showHomeIcon={true}
        />

        {/* Filters */}
        <div className="bg-white rounded-md border border-gray-200 p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Search
              value={searchTerm}
              onChange={setSearchTerm}
              placeholder="جستجو در مصارف..."
            />
            <Select
              options={categories}
              value={categoryFilter}
              onChange={setCategoryFilter}
              placeholder="فیلتر بر اساس کتگوری"
            />
            <Select
              options={statusOptions}
              value={statusFilter}
              onChange={setStatusFilter}
              placeholder="فیلتر بر اساس وضعیت"
            />
          </div>
        </div>

        {/* Data Table */}
        <DataTable
          data={filteredData}
          columns={columns}
          title="مصارف"
          searchable={false}
          actions={getRowActions}
          onRowClick={(row) => router.push(`/consumption/${row.id}`)}
        />

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-md border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600">مجموع مصارف</p>
                <p className="text-2xl font-bold text-gray-900 mt-2">
                  {filteredData.reduce((sum, item) => sum + item.amount, 0).toLocaleString()} افغانی
                </p>
              </div>
              <div className="p-3 bg-teal-100 rounded-lg">
                <DollarSign className="w-6 h-6 text-teal-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-md border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600">تعداد مصارف</p>
                <p className="text-2xl font-bold text-gray-900 mt-2">
                  {filteredData.length} مورد
                </p>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg">
                <FileText className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-md border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600">میانگین مصرف</p>
                <p className="text-2xl font-bold text-gray-900 mt-2">
                  {filteredData.length > 0
                    ? Math.round(filteredData.reduce((sum, item) => sum + item.amount, 0) / filteredData.length).toLocaleString()
                    : 0
                  } افغانی
                </p>
              </div>
              <div className="p-3 bg-purple-100 rounded-lg">
                <Calculator className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>

  );
}