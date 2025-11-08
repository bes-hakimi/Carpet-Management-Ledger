"use client";
import DeleteConfirmationModal from "@/components/ui/DeleteConfirmationModal";
import { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { useApiGet, useApiDeleteDynamic } from "@/hooks/useApi";
import { USERS } from "@/endpoints/users";
import { PageHeader } from "@/components/ui/PageHeader";
import { EditButton, DeleteButton } from "@/components/ui/Button";
import { User, Phone, Building, MapPin, Calendar, Circle, RefreshCw, Mail } from "lucide-react";
import { ContentLoader } from "@/components/loading/DataLoading";
import { IUser } from "@/types/user/user";

interface IBranchDetailsResponse {
  details: IUser;
}

export default function BranchDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const branchId = Number(params.id);

  // استفاده از تایپ IUserDetailsResponse به جای any
  const { data, isLoading, error } = useApiGet<IBranchDetailsResponse>(
    `branch-${branchId}`,
    USERS.details(branchId)
  );

  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const deleteBranchMutation = useApiDeleteDynamic();

  const handleEdit = () => router.push(`/branch/${branchId}/edit`);

  const handleDeleteConfirm = async () => {
    if (!data?.details) return;
    deleteBranchMutation.mutate(USERS.delete(branchId), {
      onSuccess: () => {
        setIsDeleteOpen(false);
        router.push("/branch/list");
      },
      onError: () => {
        alert("حذف با خطا مواجه شد!");
      }
    });
  };

  const details = data?.details;

  const InfoCard = ({ title, children, className = "" }: { title: string; children: React.ReactNode; className?: string }) => (
    <div className={`bg-gray-50 rounded-lg p-4 border border-gray-200 ${className}`}>
      <h3 className="text-sm font-medium text-gray-500 mb-2">{title}</h3>
      <div className="text-gray-900">{children}</div>
    </div>
  );

  const StatusBadge = ({ isActive }: { isActive: boolean }) => (
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
      isActive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
    }`}>
      <Circle className={`w-2 h-2 ml-2 fill-current ${isActive ? "text-green-500" : "text-red-500"}`} />
      {isActive ? "فعال" : "غیرفعال"}
    </span>
  );

  return (
    <div className="w-full">
      <PageHeader title="جزئیات شعبه" showHomeIcon description="مشاهده کامل اطلاعات شعبه" />

      {isLoading && <ContentLoader />}

      {(!isLoading && (error || !details)) && (
        <div className="mt-10 text-center text-red-500">شعبه یافت نشد یا خطا در دریافت اطلاعات</div>
      )}

      {!isLoading && details && (
        <div className="space-y-6 mt-6">
          <div className="flex justify-end gap-3 mb-6">
            <DeleteButton type="button" size="md" onClick={() => setIsDeleteOpen(true)}>حذف شعبه</DeleteButton>
            <EditButton type="button" size="md" onClick={handleEdit}>ویرایش شعبه</EditButton>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-gray-900">اطلاعات شعبه</h3>
              <StatusBadge isActive={!!details.is_active} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <InfoCard title="نام شعبه">
                <div className="flex items-center">
                  <Building className="ml-2 w-4 h-4 text-gray-500" />
                  {details.branch_name || "نامشخص"}
                </div>
              </InfoCard>
              <InfoCard title="مدیر شعبه">
                <div className="flex items-center">
                  <User className="ml-2 w-4 h-4 text-gray-500" />
                  {details.first_name} {details.last_name}
                </div>
              </InfoCard>
              <InfoCard title="شماره تماس">
                <div className="flex items-center">
                  <Phone className="ml-2 w-4 h-4 text-gray-500" />
                  {details.phone || "نامشخص"}
                </div>
              </InfoCard>
              <InfoCard title="ایمل">
                <div className="flex items-center">
                  <Mail className="ml-2 w-4 h-4 text-gray-500" />
                  {details.email || "نامشخص"}
                </div>
              </InfoCard>
              <InfoCard title="آدرس شعبه">
                <div className="flex items-center">
                  <MapPin className="ml-2 w-4 h-4 text-gray-500" />
                  {details.address || "نامشخص"}
                </div>
              </InfoCard>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">توضیحات</h3>
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <p className="text-gray-700 leading-relaxed">{details.description || "توضیحاتی ثبت نشده است."}</p>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-6">تاریخ‌ها</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InfoCard title="تاریخ ایجاد">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Calendar className="ml-2 w-4 h-4 text-gray-500" />
                    {details.date_joined ? new Date(details.date_joined).toLocaleDateString("fa-IR") : "نامشخص"}
                  </div>
                  <span className="text-xs text-gray-500">
                    {details.date_joined ? new Date(details.date_joined).toLocaleTimeString("fa-IR") : ""}
                  </span>
                </div>
              </InfoCard>

              <InfoCard title="آخرین بروزرسانی">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <RefreshCw className="ml-2 w-4 h-4 text-gray-500" />
                    {details.updated_at ? new Date(details.updated_at).toLocaleDateString("fa-IR") : "بروزرسانی صورت نگرفته"}
                  </div>
                  <span className="text-xs text-gray-500">
                    {details.updated_at ? new Date(details.updated_at).toLocaleTimeString("fa-IR") : ""}
                  </span>
                </div>
              </InfoCard>
            </div>
          </div>
        </div>
      )}

      <DeleteConfirmationModal
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleDeleteConfirm}
        itemName={`${details?.first_name} ${details?.last_name}`}
        isLoading={deleteBranchMutation.status === "pending"}
      />
    </div>
  );
}
