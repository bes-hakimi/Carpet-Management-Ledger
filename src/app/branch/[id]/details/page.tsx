"use client";
import DeleteConfirmationModal from "@/components/ui/DeleteConfirmationModal";
import { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { useApiGet, useApiDeleteDynamic } from "@/hooks/useApi";
import { USERS } from "@/endpoints/users";
import { PageHeader } from "@/components/ui/PageHeader";
import { EditButton, DeleteButton } from "@/components/ui/Button";
import { User, Phone, Building, Folder, Clock, Calendar, Image as ImageIcon, FileText, Download, Circle, RefreshCw, Mail  } from "lucide-react";

export default function BranchDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const branchId = Number(params.id);

  const { data, isLoading, error } = useApiGet<any>(`user-${branchId}`, USERS.details(branchId));

  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const handleEdit = () => router.push(`/branch/${branchId}/edit`);
  const deleteCompanyMutation = useApiDeleteDynamic();


  const handleDeleteConfirm = async () => {
    if (!data) return;
    deleteCompanyMutation.mutate(USERS.delete(branchId), {
      onSuccess: () => {
        setIsDeleteOpen(false);
        router.push("/branch/list");
      },
      onError: (err) => {
        console.error(err);
        alert("حذف با خطا مواجه شد!");
      }
    });
  };


  const handleDownload = (fileType: "logo" | "contract") => {
    if (!data) return;
    const url = fileType === "logo" ? data.company_logo : data.contract;
    window.open(url, "_blank");
  };

  const InfoCard = ({ title, children, className = "" }: { title: string; children: React.ReactNode; className?: string }) => (
    <div className={cn("bg-gray-50 rounded-lg p-4 border border-gray-200", className)}>
      <h3 className="text-sm font-medium text-gray-500 mb-2">{title}</h3>
      <div className="text-gray-900">{children}</div>
    </div>
  );

  const StatusBadge = ({ isActive }: { isActive: boolean }) => (
    <span className={cn(
      "inline-flex items-center px-3 py-1 rounded-full text-sm font-medium",
      isActive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
    )}>
      <Circle className={cn("w-2 h-2 ml-2 fill-current", isActive ? "text-green-500" : "text-red-500")} />
      {isActive ? "فعال" : "غیرفعال"}
    </span>
  );

  if (isLoading) return <div>در حال بارگذاری...</div>;
  if (error || !data) return <div>شعبه یافت نشد یا خطا در دریافت اطلاعات</div>;

  return (
    <div className="w-full">
      <PageHeader title="جزئیات شعبه" showHomeIcon description="مشاهده کامل اطلاعات شعبه" />

      <div className="flex justify-end gap-3 mb-6">
        <DeleteButton size="md" onClick={() => setIsDeleteOpen(true)}>حذف شعبه</DeleteButton>
        <EditButton size="md" onClick={handleEdit}>ویرایش شعبه</EditButton>
      </div>

      <div className="space-y-6">
        {/* اطلاعات شخصی */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-gray-900">اطلاعات شخصی</h3>
            <StatusBadge isActive={data.is_active} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <InfoCard title="نام">
              <div className="flex items-center">
                <User className="ml-2 w-4 h-4 text-gray-500" />
                {data.first_name} {data.last_name}
              </div>
            </InfoCard>

            <InfoCard title="شماره تماس">
              <div className="flex items-center">
                <Phone className="ml-2 w-4 h-4 text-gray-500" />
                {data.phone}
              </div>
            </InfoCard>

            <InfoCard title="نام شعبه">
              <div className="flex items-center">
                <Building className="ml-2 w-4 h-4 text-gray-500" />
                {data.company_name}
              </div>
            </InfoCard>

            <InfoCard title="کتگوری">
              <div className="flex items-center">
                <Folder className="ml-2 w-4 h-4 text-gray-500" />
                {data.category}
              </div>
            </InfoCard>

            <InfoCard title="مدت فعال بودن">
              <div className="flex items-center">
                <Clock className="ml-2 w-4 h-4 text-gray-500" />
                {data.time_of_active ? `فعال برای ${data.time_of_active}` : "-"}
              </div>
            </InfoCard>
            <InfoCard title="ایمل">
              <div className="flex items-center">
                <Mail  className="ml-2 w-4 h-4 text-gray-500" />
                {data.email ? data.email : "نامشخص"}
              </div>
            </InfoCard>
          </div>
        </div>

        {/* فایل‌ها */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-6">فایل‌ها و مدارک</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InfoCard title="لگوی شعبه">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <ImageIcon className="ml-2 w-4 h-4 text-gray-500" />
                  <span>company-logo.png</span>
                </div>
                <button onClick={() => handleDownload("logo")} className="flex items-center text-teal-600 hover:text-teal-700 text-sm font-medium">
                  <Download className="w-4 h-4 ml-1" /> دانلود
                </button>
              </div>
            </InfoCard>

            <InfoCard title="قرارداد">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <FileText className="ml-2 w-4 h-4 text-gray-500" />
                  <span>contract.pdf</span>
                </div>
                <button onClick={() => handleDownload("contract")} className="flex items-center text-teal-600 hover:text-teal-700 text-sm font-medium">
                  <Download className="w-4 h-4 ml-1" /> دانلود
                </button>
              </div>
            </InfoCard>
          </div>
        </div>

        {/* توضیحات */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">توضیحات</h3>
          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
            <p className="text-gray-700 leading-relaxed">{data.description || "توضیحاتی ثبت نشده است."}</p>
          </div>
        </div>

        {/* تاریخ‌ها */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-6">تاریخ‌ها</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InfoCard title="تاریخ ایجاد">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Calendar className="ml-2 w-4 h-4 text-gray-500" />
                  {data.date_joined ? new Date(data.date_joined).toLocaleDateString("fa-IR") : "نامشخص"}
                </div>
                <span className="text-xs text-gray-500">
                  {data.date_joined ? new Date(data.date_joined).toLocaleTimeString("fa-IR") : ""}
                </span>
              </div>
            </InfoCard>

            <InfoCard title="آخرین بروزرسانی">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <RefreshCw className="ml-2 w-4 h-4 text-gray-500" />
                  {data.updated_at ? new Date(data.updated_at).toLocaleDateString("fa-IR") : "بروزرسانی صورت نگرفته"}
                </div>
                <span className="text-xs text-gray-500">
                  {data.updated_at ? new Date(data.updated_at).toLocaleTimeString("fa-IR") : ""}
                </span>
              </div>
            </InfoCard>
          </div>
        </div>
      </div>

      {/* مدال حذف */}
      <DeleteConfirmationModal
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleDeleteConfirm}
        itemName={`${data?.first_name} ${data?.last_name}`}
        isLoading={deleteCompanyMutation.status === "pending"}
      />

    </div>
  );
}

function cn(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}
