// src/app/user-details/[id]/page.tsx
"use client";

import { useState, useEffect } from "react";
import { PageHeader } from "@/components/ui/PageHeader";
import { EditButton, DeleteButton } from "@/components/ui/Button";
import { useRouter, useParams } from "next/navigation";
import { 
  User, 
  Phone, 
  Building, 
  Folder, 
  Clock, 
  Calendar,
  Image as ImageIcon,
  FileText,
  Download,
  Circle,
  RefreshCw
} from "lucide-react";

interface UserData {
  id: string;
  firstName: string;
  lastName: string;
  companyName: string;
  phoneNumber: string;
  category: string;
  categoryLabel: string;
  duration: string;
  durationLabel: string;
  description: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  companyLogo: string;
  contractFile: string;
}



export default function UserDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const userId = params.id as string;

  const [userData, setUserData] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // شبیه‌سازی دریافت داده از API
  useEffect(() => {
    const fetchUserData = async () => {
      setIsLoading(true);
      // در واقعیت اینجا API call خواهید داشت
      setTimeout(() => {
        setUserData({
          id: userId,
          firstName: "امین",
          lastName: "محمدی",
          companyName: "فروشگاه قالین امین",
          phoneNumber: "09123456789",
          category: "carpet",
          categoryLabel: "فروشگاه قالین",
          duration: "1y",
          durationLabel: "فعال برای یک سال",
          description: "فروشگاه تخصصی قالین و فرش دستباف با بیش از 10 سال سابقه در زمینه فروش و خدمات پس از فروش انواع قالین و فرش‌های دستباف و ماشینی.",
          isActive: true,
          createdAt: "2024-01-15",
          updatedAt: "2024-03-20",
          companyLogo: "/images/company-logo.png",
          contractFile: "/documents/contract.pdf"
        });
        setIsLoading(false);
      }, 1000);
    };

    fetchUserData();
  }, [userId]);

  const handleEdit = () => {
    router.push(`/users/${userId}/edit`);
  };

  const handleDelete = () => {
    if (confirm("آیا از حذف این کاربر مطمئن هستید؟ این عمل غیرقابل بازگشت است.")) {
      console.log("Deleting user:", userId);
      alert("کاربر با موفقیت حذف شد!");
      router.push("/users");
    }
  };

  const handleDownload = (fileType: 'logo' | 'contract') => {
    console.log(`Downloading ${fileType}`);
    // منطق دانلود فایل
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
      isActive 
        ? "bg-green-100 text-green-800" 
        : "bg-red-100 text-red-800"
    )}>
      <Circle 
        className={cn(
          "w-2 h-2 ml-2 fill-current",
          isActive ? "text-green-500" : "text-red-500"
        )} 
      />
      {isActive ? "فعال" : "غیرفعال"}
    </span>
  );

  if (isLoading) {
    return (
      <div className="w-full">
        <PageHeader
          title="جزئیات کاربر"
          showHomeIcon={true}
          description="در حال بارگذاری اطلاعات..."
        />
        <div className="animate-pulse space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-20 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!userData) {
    return (
      <div className="w-full">
        <PageHeader
          title="جزئیات کاربر"
          showHomeIcon={true}
          description="کاربر یافت نشد"
        />
        <div className="text-center py-12">
          <p className="text-gray-500">کاربر مورد نظر یافت نشد.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <PageHeader
        title="جزئیات کاربر"
        showHomeIcon={true}
        description="مشاهده کامل اطلاعات کاربر"
      />

      {/* دکمه‌های اقدام در محتوای صفحه */}
      <div className="flex justify-end gap-3 mb-6">
        <DeleteButton
          size="md"
          onClick={handleDelete}
        >
          حذف کاربر
        </DeleteButton>
        <EditButton
          size="md"
          onClick={handleEdit}
        >
          ویرایش کاربر
        </EditButton>
      </div>

      <div className="space-y-6">
        {/* کارت اطلاعات شخصی */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-gray-900">اطلاعات شخصی</h3>
            <StatusBadge isActive={userData.isActive} />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <InfoCard title="نام">
              <div className="flex items-center">
                <User className="ml-2 w-4 h-4 text-gray-500" />
                {userData.firstName} {userData.lastName}
              </div>
            </InfoCard>

            <InfoCard title="شماره تماس">
              <div className="flex items-center">
                <Phone className="ml-2 w-4 h-4 text-gray-500" />
                {userData.phoneNumber}
              </div>
            </InfoCard>

            <InfoCard title="نام شرکت">
              <div className="flex items-center">
                <Building className="ml-2 w-4 h-4 text-gray-500" />
                {userData.companyName}
              </div>
            </InfoCard>

            <InfoCard title="کتگوری">
              <div className="flex items-center">
                <Folder className="ml-2 w-4 h-4 text-gray-500" />
                {userData.categoryLabel}
              </div>
            </InfoCard>

            <InfoCard title="مدت فعال بودن">
              <div className="flex items-center">
                <Clock className="ml-2 w-4 h-4 text-gray-500" />
                {userData.durationLabel}
              </div>
            </InfoCard>

            <InfoCard title="تاریخ ایجاد">
              <div className="flex items-center">
                <Calendar className="ml-2 w-4 h-4 text-gray-500" />
                {new Date(userData.createdAt).toLocaleDateString('fa-IR')}
              </div>
            </InfoCard>
          </div>
        </div>

        {/* کارت فایل‌ها */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-6">فایل‌ها و مدارک</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InfoCard title="لگوی شرکت">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <ImageIcon className="ml-2 w-4 h-4 text-gray-500" />
                  <span>company-logo.png</span>
                </div>
                <button 
                  onClick={() => handleDownload('logo')}
                  className="flex items-center text-teal-600 hover:text-teal-700 text-sm font-medium"
                >
                  <Download className="w-4 h-4 ml-1" />
                  دانلود
                </button>
              </div>
            </InfoCard>

            <InfoCard title="قرارداد">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <FileText className="ml-2 w-4 h-4 text-gray-500" />
                  <span>contract.pdf</span>
                </div>
                <button 
                  onClick={() => handleDownload('contract')}
                  className="flex items-center text-teal-600 hover:text-teal-700 text-sm font-medium"
                >
                  <Download className="w-4 h-4 ml-1" />
                  دانلود
                </button>
              </div>
            </InfoCard>
          </div>
        </div>

        {/* کارت توضیحات */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">توضیحات</h3>
          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
            <p className="text-gray-700 leading-relaxed">
              {userData.description || "توضیحاتی ثبت نشده است."}
            </p>
          </div>
        </div>

        {/* کارت تاریخ‌ها */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-6">تاریخ‌ها</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InfoCard title="تاریخ ایجاد">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Calendar className="ml-2 w-4 h-4 text-gray-500" />
                  {new Date(userData.createdAt).toLocaleDateString('fa-IR')}
                </div>
                <span className="text-xs text-gray-500">
                  {new Date(userData.createdAt).toLocaleTimeString('fa-IR')}
                </span>
              </div>
            </InfoCard>

            <InfoCard title="آخرین بروزرسانی">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <RefreshCw className="ml-2 w-4 h-4 text-gray-500" />
                  {new Date(userData.updatedAt).toLocaleDateString('fa-IR')}
                </div>
                <span className="text-xs text-gray-500">
                  {new Date(userData.updatedAt).toLocaleTimeString('fa-IR')}
                </span>
              </div>
            </InfoCard>
          </div>
        </div>
      </div>
    </div>
  );
}

function cn(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}