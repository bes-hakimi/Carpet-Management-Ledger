// src/app/companies/page.tsx
"use client";
import { PageHeader } from "@/components/ui/PageHeader";
import { CompanyTable } from "../components/CompanyTable";
import { useRouter } from "next/navigation";

// تعریف interface برای Company
interface Company {
  id: string;
  name: string;
  category: string;
  owner: string;
  status: "active" | "inactive";
  createdAt: string;
}

const mockCompanies: Company[] = [
  {
    id: "1",
    name: "شرکت فرش ایران",
    category: "فرش و موکت",
    owner: "علیرضا محمدی",
    status: "active",
    createdAt: "2024-01-15",
  },
  {
    id: "2", 
    name: "لوازم خانگی برقی",
    category: "وسایل برقی",
    owner: "محمد حسینی",
    status: "inactive",
    createdAt: "2024-02-20",
  },
  {
    id: "3",
    name: "پوشاک مدرن", 
    category: "لباس و پوشاک",
    owner: "فاطمه کریمی",
    status: "active",
    createdAt: "2024-01-10",
  }
];

export default function CompaniesPage() {
  const router = useRouter();

  const handleView = (company: Company) => {
    console.log("View company:", company);
    router.push(`/company/${company.id}/details`);
  };

  const handleEdit = (company: Company) => {
    console.log("Edit company:", company);
    router.push(`/company/${company.id}/edit`);
  };

  const handleDelete = (company: Company) => {
    if (confirm(`آیا از حذف شرکت "${company.name}" مطمئن هستید؟`)) {
      console.log("Delete company:", company);
      // delete logic
    }
  };

  return (
    <div className="w-full">
      <PageHeader
        title="مدیریت شرکت‌ها"
        description="لیست تمام شرکت‌های ثبت شده در سیستم"
        showHomeIcon={true}
      />

      <CompanyTable
        companies={mockCompanies}
        onView={handleView}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </div>
  );
}