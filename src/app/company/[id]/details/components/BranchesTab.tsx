"use client";

import { useState } from "react";
import { DataTable, Column } from "@/components/ui/DataTable";
import { Eye, Edit, Trash2, Building2 } from "lucide-react";
import { IUser } from "@/types/user/user";
import { useApiDeleteDynamic } from "@/hooks/useApi";
import { USERS } from "@/endpoints/users";
import DeleteConfirmationModal from "@/components/ui/DeleteConfirmationModal";
import { toast } from "react-hot-toast";
import { ApiError } from "@/types/api/api";
import { useRouter } from "next/navigation";

export function BranchesTab({ data }: { data: IUser[] }) {
  // ✅ حذف API hook
  const { mutateAsync: deleteBranch, isPending } = useApiDeleteDynamic<unknown>();
  const router = useRouter();


  // ✅ کنترل مودال حذف
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedBranch, setSelectedBranch] = useState<IUser | null>(null);

  // ✅ هندل حذف
  const handleDelete = async () => {
    if (!selectedBranch) return;
    try {
      if (!selectedBranch?.id) return;
      await deleteBranch(USERS.delete(selectedBranch.id));

      toast.success(`شعبه "${selectedBranch.branch_name}" با موفقیت حذف شد`);
    } catch (error) {
      const err = error as ApiError;
      toast.error(
        err.response?.data?.message ||
        err.response?.data?.detail ||
        err.message ||
        "خطا در حذف شعبه"
      );
    } finally {
      setDeleteModalOpen(false);
      setSelectedBranch(null);
    }
  };

  // ✅ هندل مشاهده
    const handleView = (branch: IUser) => { 
    router.push(`/branch/${branch.id}/details`);
  };

  // ✅ هندل ویرایش
  const handleEdit = (branch: IUser) => {
     router.push(`/branch/${branch.id}/edit`);
  };

  // ✅ تعریف ستون‌ها
  const columns: Column<IUser>[] = [
    {
      key: "branch_name",
      label: "نام شعبه",
      sortable: true,
      render: (value, row) => {
        const branchName = (value as string) ?? "بدون نام";
        return (
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-cyan-500 rounded-lg flex items-center justify-center">
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
      key: "first_name",
      label: "مدیر شعبه",
      sortable: true,
      render: (value) => (value as string) ?? "",
    },
    {
      key: "phone",
      label: "شماره تماس",
      sortable: true,
      render: (value) => (value as string | number) ?? "",
    },
    {
      key: "email",
      label: "ایمیل",
      sortable: true,
      render: (value) => (value as string) ?? "",
    },
    {
      key: "date_joined",
      label: "تاریخ ایجاد",
      sortable: true,
      render: (value) =>
        value ? new Date(value as string).toLocaleDateString("fa-IR") : "",
    },
    {
      key: "status",
      label: "وضعیت",
      sortable: true,
      render: (value) => {
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

  // ✅ اکشن‌ها
  const actions = (branch: IUser) => [
    { label: "مشاهده", icon: <Eye size={16} />, onClick: () => handleView(branch) },
    { label: "ویرایش", icon: <Edit size={16} />, onClick: () => handleEdit(branch) },
    {
      label: "حذف",
      icon: <Trash2 size={16} />,
      onClick: () => {
        setSelectedBranch(branch);
        setDeleteModalOpen(true);
      },
    },
  ];

  return (
    <>
      <DataTable<IUser>
        data={data}
        columns={columns}
        title="لیست شعبات"
        searchable
        actions={actions}
      />

      {/* ✅ مودال حذف */}
      <DeleteConfirmationModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleDelete}
        isLoading={isPending}
        itemName={selectedBranch?.branch_name ?? undefined}
        title="حذف شعبه"
        message="آیا از حذف شعبه زیر اطمینان دارید؟"
        confirmText="حذف شعبه"
        cancelText="لغو"
      />
    </>
  );
}
