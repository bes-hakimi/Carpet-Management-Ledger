// src/app/branch/list/page.tsx
"use client";
import { PageHeader } from "@/components/ui/PageHeader";
import { BranchTable } from "../components/BranchTable";
import { useRouter } from "next/navigation";

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

// داده‌های نمونه شعبات
const mockBranches: Branch[] = [
  {
    id: "1",
    branchName: "شعبه کابل مرکزی",
    managerName: "احمد حفیظی",
    phoneNumber: "0700123456",
    email: "kabul@company.af",
    address: "کابل، ناحیه 7، جاده مرکزی",
    isActive: true,
    description: "شعبه اصلی شرکت در کابل",
    createdAt: "2025-03-10",
  },
  {
    id: "2",
    branchName: "شعبه هرات",
    managerName: "فاطمه سلطانی",
    phoneNumber: "0787654321",
    email: "herat@company.af",
    address: "هرات، مرکز شهر، خیابان آزادی",
    isActive: true,
    description: "",
    createdAt: "2025-04-15",
  },
  {
    id: "3",
    branchName: "شعبه مزار شریف",
    managerName: "سعید احمدی",
    phoneNumber: "0798765432",
    email: "mazar@company.af",
    address: "مزار شریف، جاده دانشگاه، پلاک 5",
    isActive: false,
    description: "شعبه غیرفعال",
    createdAt: "2025-02-20",
  }
];


export default function BranchListPage() {
  const router = useRouter();

  const handleView = (branch: Branch) => {
    console.log("View branch:", branch);
    router.push(`/branch/${branch.id}/details`);
  };

  const handleEdit = (branch: Branch) => {
    console.log("Edit branch:", branch);
    router.push(`/branch/${branch.id}/edit`);
  };

  const handleDelete = (branch: Branch) => {
    if (confirm(`آیا از حذف شعبه "${branch.branchName}" مطمئن هستید؟`)) {
      console.log("Delete branch:", branch);
      // منطق حذف شعبه
    }
  };

  return (
    <div className="w-full">
      <PageHeader
        title="مدیریت شعبات"
        description="لیست تمام شعب ثبت شده در سیستم"
        showHomeIcon={true}
      />

      <BranchTable
        branches={mockBranches}
        onView={handleView}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </div>
  );
}
