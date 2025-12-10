"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { DataTable, Column } from "@/components/ui/DataTable";
import { Search } from "@/components/ui/Search";
import { Select } from "@/components/ui/Select";
import { PageHeader } from "@/components/ui/PageHeader";
import { Eye } from "lucide-react";

import { useApiGet } from "@/hooks/useApi";
import { EXPENSE } from "@/endpoints/expense";
import { ExpenseList } from "@/types/expense/list";
import { categories } from "../constant/constant";
import { ContentLoader } from "@/components/loading/DataLoading";

export default function ExpenseListPage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");

  // دریافت داده‌ها از API
  const { data: expenses = [], isLoading, isError } = useApiGet<ExpenseList[]>(
    "expense",
    EXPENSE.list
  );

  // ستون‌های جدول
  const columns: Column<ExpenseList>[] = [
    {
      key: "title",
      label: "عنوان",
      sortable: true,
      render: (_, row) => {
        const firstLetter = row.title?.charAt(0).toUpperCase() || "-";
        return (
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-cyan-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold">{firstLetter}</span>
            </div>
            <span className="font-medium text-gray-900">{row.title}</span>
          </div>
        );
      },
    },
    {
      key: "price",
      label: "مبلغ (افغانی)",
      sortable: true,
      render: (_, row) => (
        <span className="font-bold text-primary-600">{Number(row.price).toLocaleString()} افغانی</span>
      ),
    },
    {
      key: "category",
      label: "کتگوری",
      sortable: true,
      render: (_, row) => (
        <span className="px-3 py-1 bg-primary-100 text-primary-800 rounded-full text-sm font-medium">
          {row.category}
        </span>
      ),
    },
    {
      key: "peyment_method",
      label: "طریقه پرداخت",
      render: (_, row) => row.peyment_method,
    },
    {
      key: "created_at",
      label: "تاریخ ایجاد",
      render: (_, row) => new Date(row.created_at).toLocaleDateString("fa-IR"),
    },
  ];

  // اکشن‌های هر ردیف
  const getRowActions = (row: ExpenseList) => [
    {
      label: "مشاهده",
      icon: <Eye className="w-4 h-4" />,
      onClick: () => router.push(`/expense/${row.id}/details`),
    },
    // {
    //   label: "ویرایش",
    //   icon: <Edit className="w-4 h-4" />,
    //   onClick: () => router.push(`/expense/${row.id}/edit`),
    // },
    // {
    //   label: "حذف",
    //   icon: <Trash2 className="w-4 h-4" />,
    //   onClick: () => {
    //     if (confirm("آیا از حذف این مصرف اطمینان دارید؟")) {
    //       console.log("Delete expense:", row.id);
    //     }
    //   },
    // },
  ];

  // فیلتر داده‌ها
  const filteredData = expenses.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !categoryFilter || item.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen w-full">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
        {/* PageHeader همیشه نشان داده می‌شود */}
        <PageHeader
          title="مدیریت مصارف"
          description="لیست تمام مصارف ثبت‌شده شما"
          showHomeIcon
        />

        {/* فیلترها */}
        <div className="bg-white rounded-md border border-gray-200 p-4 md:p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Search value={searchTerm} onChange={setSearchTerm} placeholder="جستجو در مصارف..." />
            <Select
              options={[{ value: "", label: "همه کتگوری‌ها" }, ...categories]}
              value={categoryFilter}
              onChange={setCategoryFilter}
            />
          </div>
        </div>

        {/* وضعیت لودینگ یا خطا */}
        {isLoading && <ContentLoader />}
        {isError && <p className="p-6 text-center text-red-500">خطا در دریافت داده‌ها</p>}

        {/* جدول فقط وقتی داده‌ها موجود هستند */}
        {!isLoading && !isError && (
          <DataTable
            data={filteredData}
            columns={columns}
            title="لیست مصارف"
            actions={getRowActions}
            searchable={false}
            onRowClick={(row) => router.push(`/expense/${row.id}/details`)}
          />
        )}
      </motion.div>
    </div>
  );

}
