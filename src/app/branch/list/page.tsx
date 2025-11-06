"use client";

import { useRouter } from "next/navigation";
import { PageHeader } from "@/components/ui/PageHeader";
import { BranchTable } from "../components/BranchTable";
import toast, { Toaster } from "react-hot-toast";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import apiClient from "@/hooks/apiClient";
import { USERS } from "@/endpoints/users";
import { ApiError } from "@/types/api/api";

// تعریف interface برای Branch
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

// interface برای داده‌ی API کاربران
interface ApiUser {
  id: number;
  company_name: string;
  first_name: string;
  last_name: string;
  phone: number;
  email?: string;
  role: string;
  status: boolean;
  date_joined: string;
}

export default function BranchListPage() {
  const router = useRouter();
  const queryClient = useQueryClient();

  // fetch شعب از API
  const { data: apiUsers = [], isLoading, error, refetch } = useQuery<ApiUser[], ApiError>({
    queryKey: ["branches"],
    queryFn: async () => {
      const res = await apiClient.get<ApiUser[]>(USERS.getAll);
      return res.data;
    },
    retry: 1,
  });

  // تبدیل داده‌های API به Branch[]
  const branches: Branch[] = (apiUsers || []).map(user => ({
    id: user.id.toString(),
    branchName: user.company_name,
    managerName: `${user.first_name} ${user.last_name}`,
    phoneNumber: user.phone.toString(),
    email: user.email,
    address: "-", // اگر فیلد آدرس وجود ندارد
    isActive: user.status,
    description: "-", // اگر فیلد توضیحات وجود ندارد
    createdAt: user.date_joined,
  }));

  // حذف شعبه به صورت داینامیک
  const deleteBranchMutation = useMutation<void, ApiError, string>({
    mutationFn: async (id: string) => {
      const res = await apiClient.delete<void>(USERS.delete(Number(id)));
      return res.data;
    },
    onSuccess: () => {
      toast.success("شعبه با موفقیت حذف شد");
      queryClient.invalidateQueries({ queryKey: ["branches"] });
    },
    onError: (err: ApiError) => {
      console.error(err);
      toast.error(err.message || "حذف شعبه با مشکل مواجه شد");
    },
  });

  const handleView = (branch: Branch) => router.push(`/branch/${branch.id}/details`);
  const handleEdit = (branch: Branch) => router.push(`/branch/${branch.id}/edit`);
  const handleDelete = (branch: Branch) => {
    if (!confirm(`آیا از حذف شعبه "${branch.branchName}" مطمئن هستید؟`)) return;
    deleteBranchMutation.mutate(branch.id);
  };

  if (isLoading) return <p>در حال بارگذاری...</p>;
  if (error) return <p>خطا در دریافت داده‌ها: {error.message}</p>;

  return (
    <div className="w-full">
      <Toaster position="top-right" reverseOrder={false} />
      <PageHeader
        title="مدیریت شعبات"
        description="لیست تمام شعب ثبت شده در سیستم"
        showHomeIcon
      />
      <BranchTable
        branches={branches}
        onView={handleView}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </div>
  );
}
