"use client";

import { useState, useEffect } from "react";
import { PageHeader } from "@/components/ui/PageHeader";
import { SaleForm } from "../components/SaleForm";
import { InvoicePreview } from "../components/invoice/InvoicePreview";
import { useRouter } from "next/navigation";
import { SaleInitialData, CompanyInfo } from "@/types/sales/sales";
import { useAuth } from "@/hooks/useAuth";
import { useApiGet } from "@/hooks/useApi";
import { USERS } from "@/endpoints/users";

export default function CreateSalePage() {
  const router = useRouter();
  const { userData } = useAuth();
  const [showInvoice, setShowInvoice] = useState(false);
  const [saleData, setSaleData] = useState<SaleInitialData | null>(null);
  const [formData, setFormData] = useState<SaleInitialData | null>(null);
  const [companyInfo, setCompanyInfo] = useState<CompanyInfo | null>(null);

  const userId = userData?.user.id;

  // استفاده از enabled برای کنترل اجرای query
  const { data: apiData, error } = useApiGet<{ details: CompanyInfo }>(
    "user-company",
    userId ? USERS.details(userId) : "",
    { enabled: !!userId } 
  );

  useEffect(() => {
    if (apiData?.details) {
      setCompanyInfo(apiData.details);
    }
  }, [apiData]);

  const handleSaleSubmit = (data: SaleInitialData) => {
    if (!companyInfo) return;
    const initialData: SaleInitialData = { ...data, company_info: companyInfo };
    setSaleData(initialData);
    setFormData(initialData);
    setShowInvoice(true);
  };

  const handleBackFromPreview = () => setShowInvoice(false);

  // if (!userId) return <ContentLoader />;

  return (
    <div className="w-full">
      <PageHeader
        title="فروش جدید"
        showHomeIcon
        description="ثبت فروش جدید محصول"
      />

      {/* {isLoading && <ContentLoader/>} */}
      {error && <p className="text-red-500">خطا در بارگذاری اطلاعات کمپانی</p>}

      {showInvoice && saleData ? (
        <InvoicePreview saleData={saleData} onBack={handleBackFromPreview} />
      ) : (
        <SaleForm
          onShowInvoice={handleSaleSubmit}
          onCancel={() => router.back()}
          initialData={formData ?? undefined}
        />
      )}
    </div>
  );
}
