"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

import { PageHeader } from "@/components/ui/PageHeader";
import { StaffTable } from "../components/StaffTable";
import DeleteConfirmationModal from "@/components/ui/DeleteConfirmationModal";

import { useApiGet, useApiDeleteDynamic } from "@/hooks/useApi";
import { USERS } from "@/endpoints/users";
import { ApiError } from "@/types/api/api";
import { ContentLoader } from "@/components/loading/DataLoading";
import { EmptyData } from "@/components/empty/EmptyData";

import { IUser } from "@/types/user/user";

interface StaffListResponse {
  data?: IUser[];
  message?: string;
}

export default function StaffListPage() {
  const router = useRouter();

  const [selectedStaff, setSelectedStaff] = useState<IUser | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data: apiStaffData, isLoading, error, refetch } = useApiGet<StaffListResponse>(
    "staff-list",
    USERS.getStaffList
  );

  console.log("staff list", apiStaffData)

  // مستقیم استفاده از IUser
  const staffList: IUser[] = Array.isArray(apiStaffData) ? apiStaffData : [];

  const emptyMessage: string | null =
    (!Array.isArray(apiStaffData?.data) || apiStaffData.data.length === 0) &&
    typeof apiStaffData?.message === "string"
      ? apiStaffData.message
      : null;

  const handleView = (staff: IUser) => router.push(`/staff/${staff.id}/details`);
  const handleEdit = (staff: IUser) => router.push(`/staff/${staff.id}/edit`);

  const handleDeleteClick = (staff: IUser) => {
    setSelectedStaff(staff);
    setIsModalOpen(true);
  };

  const deleteStaffMutation = useApiDeleteDynamic<void>();

  const handleConfirmDelete = () => {
    if (!selectedStaff?.id) return;

    deleteStaffMutation.mutate(USERS.delete(selectedStaff.id), {
      onSuccess: () => {
        toast.success("کارمند با موفقیت حذف شد");
        setIsModalOpen(false);
        setSelectedStaff(null);
        refetch();
      },
      onError: (error: ApiError) => {
        console.error(error);
        toast.error(error.message || "حذف کارمند با مشکل مواجه شد");
      },
    });
  };

  const handleCloseModal = () => {
    if (deleteStaffMutation.status !== "pending") {
      setIsModalOpen(false);
      setSelectedStaff(null);
    }
  };

  return (
    <div className="w-full">
      <PageHeader
        title="مدیریت کارمندان"
        description="لیست تمام کارمندان ثبت‌شده در سیستم"
        showHomeIcon
      />

      {isLoading ? (
        <div className="flex w-full h-[300px] items-center justify-center">
          <ContentLoader />
        </div>
      ) : error ? (
        <p className="text-center text-red-500 mt-6">
          خطا در دریافت داده‌ها: {error.message}
        </p>
      ) : emptyMessage ? (
        <EmptyData title={emptyMessage} />
      ) : (
        <StaffTable
          staff={staffList} 
          onView={handleView}
          onEdit={handleEdit}
          onDelete={handleDeleteClick}
        />
      )}

      <DeleteConfirmationModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onConfirm={handleConfirmDelete}
        itemName={selectedStaff?.company_name || `${selectedStaff?.first_name} ${selectedStaff?.last_name}`}
        confirmText="حذف"
        cancelText="لغو"
        isLoading={deleteStaffMutation.status === "pending"}
        type="danger"
      />
    </div>
  );
}
