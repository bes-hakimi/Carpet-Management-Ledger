"use client";

import { PageHeader } from "@/components/ui/PageHeader";
import { SaleDetails } from "@/app/sales/components/SaleDetails";
import { SaleActions } from "@/app/sales/components/SaleActions";
import { useParams } from "next/navigation";
import { useApiGet } from "@/hooks/useApi";
import { SALES } from "@/endpoints/sales";
import { USERS } from "@/endpoints/users";
import { SaleDetailsType } from "@/types/sales/details";
import { SaleInitialData, SelectedSaleProduct, CompanyInfo } from "@/types/sales/sales";
import { useAuth } from "@/hooks/useAuth";
import { ContentLoader } from "@/components/loading/DataLoading";
import { InvoiceSummary } from "../../components/invoice/InvoiceSummary";

export default function SaleDetailsPage() {
  const params = useParams();
  const saleId = Number(params.id);
  const { userData } = useAuth();
  const userId = userData?.user.id;

  const { data: sale, isLoading, isError } = useApiGet<SaleDetailsType>(
    `sale-details-${saleId}`,
    SALES.details(saleId),
    { enabled: !!saleId }
  );

  const { data: companyData } = useApiGet<{ details: CompanyInfo }>(
    "user-company",
    userId ? USERS.details(userId) : "",
    { enabled: !!userId }
  );

  const handlePrintInvoice = () => window.print();

  if (isLoading) {
    return (
      <div className="w-full">
        <PageHeader
          title="جزئیات فروش"
          showHomeIcon={true}
          description="در حال بارگذاری اطلاعات..."
        />
        <ContentLoader />
      </div>
    );
  }

  if (isError || !sale) {
    return (
      <div className="w-full">
        <PageHeader
          title="جزئیات فروش"
          showHomeIcon={true}
          description="بل یافت نشد"
        />
        <div className="text-center py-12">
          <p className="text-gray-500">بل مورد نظر یافت نشد.</p>
        </div>
      </div>
    );
  }

  // آماده‌سازی داده برای InvoicePreview
  const saleDataForInvoice: SaleInitialData = {
    // invoiceNumber: `INV-${sale.id}`,
    slug:sale.slug,
    created_at: sale.created_at,
    payment_method: sale.payment_method,
    delivery_method: sale.delivery_method,
    description: sale.description,
    customer: {
      ...sale.customer,
      id: String(sale.customer.id),
    },
    products: sale.items.map((item): SelectedSaleProduct => ({
      quantity: item.qty,
      salePrice: parseFloat(item.main_price),
      product: item.product
    })),
    company_info: companyData?.details,
  };


  return (
    <div className="w-full">
      <PageHeader
        title="جزئیات فروش"
        showHomeIcon={true}
        description={`شماره بل: INV-${sale.slug}`}
      />

      <div className="space-y-6">
        <SaleActions
          onPrint={handlePrintInvoice}
          saleStatus="completed"
        />

        {/* نمایش جزئیات */}
        <div className="no-print">
          <SaleDetails saleData={sale} />
        </div>

        {/* برای چاپ */}
        <div className="hidden print:block">
          <InvoiceSummary
            saleData={saleDataForInvoice}
            onBack={() => { }}
          />
        </div>
      </div>
    </div>
  );
}
