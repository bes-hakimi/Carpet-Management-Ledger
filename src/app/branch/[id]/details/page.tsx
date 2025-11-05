"use client";

import { useState, useEffect } from "react";
import { PageHeader } from "@/components/ui/PageHeader";
import { EditButton, DeleteButton } from "@/components/ui/Button";
import { useRouter, useParams } from "next/navigation";
import { 
  User, 
  Phone, 
  Building, 
  Mail,
  Circle,
  Calendar,
  RefreshCw
} from "lucide-react";

interface UserData {
  id: string;
  branchName: string;
  managerName: string;
  phoneNumber: string;
  email: string;
  description: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export default function BranchDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const branchId = params.id as string;

  const [userData, setUserData] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // شبیه‌سازی دریافت داده از API
  useEffect(() => {
    const fetchUserData = async () => {
      setIsLoading(true);
      // در واقعیت اینجا API call خواهید داشت
      setTimeout(() => {
        setUserData({
          id: branchId,
          branchName: "شعبه مرکزی",
          managerName: "امین محمدی",
          phoneNumber: "0791929394",
          email: "amin@example.com",
          description: "شعبه مرکزی فروشگاه قالین امین با خدمات ویژه و مدیریت حرفه‌ای.",
          isActive: true,
          createdAt: "2024-01-15",
          updatedAt: "2024-03-20",
        });
        setIsLoading(false);
      }, 1000);
    };

    fetchUserData();
  }, [branchId]);

  const handleEdit = () => {
    router.push(`/branch/${branchId}/edit`);
  };

  const handleDelete = () => {
    if (confirm("آیا از حذف این شعبه مطمئن هستید؟ این عمل غیرقابل بازگشت است.")) {
      console.log("Deleting branch:", branchId);
      alert("شعبه با موفقیت حذف شد!");
      router.push("/users");
    }
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
          title="جزئیات شعبه"
          showHomeIcon={true}
          description="در حال بارگذاری اطلاعات..."
        />
        <div className="animate-pulse space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[...Array(4)].map((_, i) => (
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
          title="جزئیات شعبه"
          showHomeIcon={true}
          description="شعبه یافت نشد"
        />
        <div className="text-center py-12">
          <p className="text-gray-500">شعبه مورد نظر یافت نشد.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <PageHeader
        title="جزئیات شعبه"
        showHomeIcon={true}
        description="مشاهده کامل اطلاعات شعبه"
      />

      <div className="flex justify-end gap-3 mb-6">
        <DeleteButton
          size="md"
          onClick={handleDelete}
        >
          حذف شعبه
        </DeleteButton>
        <EditButton
          size="md"
          onClick={handleEdit}
        >
          ویرایش شعبه
        </EditButton>
      </div>

      <div className="space-y-6">
        {/* کارت اطلاعات شخصی */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-gray-900">اطلاعات شعبه</h3>
            <StatusBadge isActive={userData.isActive} />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InfoCard title="نام شعبه">
              <div className="flex items-center">
                <Building className="ml-2 w-4 h-4 text-gray-500" />
                {userData.branchName}
              </div>
            </InfoCard>

            <InfoCard title="مدیر شعبه">
              <div className="flex items-center">
                <User className="ml-2 w-4 h-4 text-gray-500" />
                {userData.managerName}
              </div>
            </InfoCard>

            <InfoCard title="شماره تماس">
              <div className="flex items-center">
                <Phone className="ml-2 w-4 h-4 text-gray-500" />
                {userData.phoneNumber}
              </div>
            </InfoCard>

            <InfoCard title="ایمیل">
              <div className="flex items-center">
                <Mail className="ml-2 w-4 h-4 text-gray-500" />
                {userData.email}
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
