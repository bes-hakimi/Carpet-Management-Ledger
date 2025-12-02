"use client";

import { useState } from "react";
import { DataTable, Column } from "@/components/ui/DataTable";
import { Eye, Edit, Trash2, User2 } from "lucide-react";
import { IUser } from "@/types/user/user";
import { useApiDeleteDynamic } from "@/hooks/useApi";
import { USERS } from "@/endpoints/users";
import DeleteConfirmationModal from "@/components/ui/DeleteConfirmationModal";
import { toast } from "react-hot-toast";
import { ApiError } from "@/types/api/api";
import { useRouter } from "next/navigation";

export function StaffTab({ data }: { data: IUser[] }) {
  const router = useRouter();

  // ✅ حذف API hook
  const { mutateAsync: deleteUser, isPending } = useApiDeleteDynamic<unknown>();

  // ✅ کنترل مودال حذف
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<IUser | null>(null);

  // ✅ هندل حذف
  const handleDelete = async () => {
    if (!selectedUser?.id) return;
    try {
      await deleteUser(USERS.delete(selectedUser.id));
      toast.success(`کارمند "${selectedUser.first_name} ${selectedUser.last_name}" با موفقیت حذف شد`);
    } catch (error) {
      const err = error as ApiError;
      toast.error(
        err.response?.data?.message ||
        err.response?.data?.detail ||
        err.message ||
        "خطا در حذف کارمند"
      );
    } finally {
      setDeleteModalOpen(false);
      setSelectedUser(null);
    }
  };

  // ✅ هندل مشاهده
  const handleView = (user: IUser) => {
    router.push(`/staff/${user.id}/details`);
  };

  // ✅ هندل ویرایش
  const handleEdit = (user: IUser) => {
    router.push(`/staff/${user.id}/edit`);
  };

  // ✅ تعریف ستون‌ها
  const columns: Column<IUser>[] = [
    {
      key: "first_name",
      label: "کارمند",
      sortable: true,
      render: (_value, row) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-cyan-500 rounded-lg flex items-center justify-center">
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
      key: "phone",
      label: "شماره تماس",
      sortable: true,
      render: (value) => (value as string | undefined) ?? "",
    },
    {
      key: "email",
      label: "ایمیل",
      sortable: true,
      render: (value) => (value as string | undefined) ?? "",
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
            className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${config?.color || 'bg-gray-100 text-gray-800'}`}
          >
            {config?.label || ""}
          </span>
        );
      },
    },
  ];

  // ✅ اکشن‌ها
  const actions = (user: IUser) => [
    { label: "مشاهده", icon: <Eye size={16} />, onClick: () => handleView(user) },
    { label: "ویرایش", icon: <Edit size={16} />, onClick: () => handleEdit(user) },
    {
      label: "حذف",
      icon: <Trash2 size={16} />,
      onClick: () => {
        setSelectedUser(user);
        setDeleteModalOpen(true);
      },
    },
  ];

  return (
    <>
      <DataTable<IUser>
        data={data}
        columns={columns}
        title="لیست کارمندان"
        searchable
        actions={actions}
      />

      {/* ✅ مودال حذف */}
      <DeleteConfirmationModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleDelete}
        isLoading={isPending}
        itemName={selectedUser?.first_name ? `${selectedUser.first_name} ${selectedUser.last_name}` : undefined}
        title="حذف کارمند"
        message="آیا از حذف کارمند زیر اطمینان دارید؟"
        confirmText="حذف کارمند"
        cancelText="لغو"
      />
    </>
  );
}
