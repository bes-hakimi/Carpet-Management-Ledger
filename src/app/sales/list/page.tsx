"use client";

import { useState } from "react";
import { PageHeader } from "@/components/ui/PageHeader";
import { SalesList } from "../components/SalesList";
import { useRouter } from "next/navigation";
import { useApiGet } from "@/hooks/useApi";
import { SaleList } from "@/types/sales/list";
import { SALES } from "@/endpoints/sales";
import { ContentLoader } from "@/components/loading/DataLoading";

export default function SalesPage() {
  const router = useRouter();

  const { data: sales = [], isLoading } = useApiGet<SaleList[]>("sales", SALES.list);

  // فیلترها
  const [filters] = useState({
    customerName: "",
    dateFrom: "",
    dateTo: "",
    paymentMethod: "",
  });

  const filteredSales = sales.filter(sale => {
    const customerMatch = sale.customer.customer_name
      .toLowerCase()
      .includes(filters.customerName.toLowerCase());
    const paymentMatch = filters.paymentMethod
      ? sale.payment_method === filters.paymentMethod
      : true;
    const dateFromMatch = filters.dateFrom
      ? new Date(sale.created_at) >= new Date(filters.dateFrom)
      : true;
    const dateToMatch = filters.dateTo
      ? new Date(sale.created_at) <= new Date(filters.dateTo)
      : true;

    return customerMatch && paymentMatch && dateFromMatch && dateToMatch;
  });

  const handleViewDetails = (sale: SaleList) => {
    router.push(`/sales/${sale.id}/details`);
  };

  return (
    <div className="md:w-full">
      <PageHeader
        title="لیست فروشات"
        showHomeIcon={true}
        description="مدیریت و مشاهده تمام فروشات انجام شده"
      />

      {isLoading ? (
       <ContentLoader />
      ) : (
        <SalesList
          sales={filteredSales}
          onViewDetails={handleViewDetails}
        />
      )}
    </div>
  );
}
