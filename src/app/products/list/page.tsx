"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { PageHeader } from "@/components/ui/PageHeader";
import { DataTable } from "@/components/ui/DataTable";
import { AddButton } from "@/components/ui/Button";
import { Eye, Edit, Trash2 } from "lucide-react";
import { ProductType } from "@/types/product/product";
import { PRODUCT } from "@/endpoints/products";
import Image from "next/image";
import { useApiGet, useApiDeleteDynamic } from "@/hooks/useApi";
import DeleteConfirmationModal from "@/components/ui/DeleteConfirmationModal";
import { ContentLoader } from "@/components/loading/DataLoading";
import { EmptyData } from "@/components/empty/EmptyData";
import { ApiError } from "@/types/api/api";

export default function ProductsPage() {
  const router = useRouter();
  const [selectedProduct, setSelectedProduct] = useState<ProductType | null>(null);
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);

  const { data: apiResponse, isLoading, error, refetch } = useApiGet<
    ProductType[] | { message: string }
  >("products", PRODUCT.list);

  const deleteMutation = useApiDeleteDynamic<void>();
  const { mutateAsync, status } = deleteMutation;

  // اگر response آرایه بود، محصولات هستند، وگرنه پیام خالی است
  const products: ProductType[] = Array.isArray(apiResponse) ? apiResponse : [];
  const emptyMessage =
    !Array.isArray(apiResponse) && typeof apiResponse?.message === "string"
      ? apiResponse.message
      : null;

  const handleView = (product: ProductType) => router.push(`/products/${product.id}/details`);
  const handleEdit = (product: ProductType) => router.push(`/products/${product.id}/edit`);
  const handleAddProduct = () => router.push("/products/add");

  const handleDelete = (product: ProductType) => {
    setSelectedProduct(product);
    setDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!selectedProduct) return;
    try {
      await mutateAsync(PRODUCT.delete(selectedProduct.id));
      setDeleteModalOpen(false);
      refetch();
    } catch (err) {
      console.error(err);
    }
  };

  const columns = [
    {
      key: "name" as keyof ProductType,
      label: "نام محصول",
      sortable: true,
      render: (value: string | number | null, row: ProductType) => {
        const displayValue = value ?? "-";
        return (
          <div className="flex items-center gap-3">
            <div className="relative w-10 h-10 rounded-lg border-2 border-teal-500 overflow-hidden">
              <Image
                src={row.image || "/placeholder.png"}
                alt={row.name}
                fill
                className="object-cover"
              />
            </div>
            <div>
              <div className="font-medium text-gray-900">{displayValue}</div>
              <div className="text-xs text-gray-500">کد: {row.slug || "-"}</div>
            </div>
          </div>
        );
      },
    },
    {
      key: "type" as keyof ProductType,
      label: "نوع",
      sortable: true,
      render: (value: string | number | null) => (
        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
          {value ?? "-"}
        </span>
      ),
    },
    {
      key: "size" as keyof ProductType,
      label: "سایز",
      sortable: true,
      render: (value: string | number | null) => <span className="font-medium">{value ?? "-"}</span>,
    },
    {
      key: "main_price" as keyof ProductType,
      label: "قیمت خرید",
      sortable: true,
      render: (value: string | number | null) => {
        const price = Number(value) || 0;
        return <span className="font-medium text-gray-900">{price.toLocaleString()} افغانی</span>;
      },
    },
    {
      key: "stock_qty" as keyof ProductType,
      label: "موجودی",
      sortable: true,
      render: (value: string | number | null) => {
        const numericValue = Number(value) || 0;
        const isOutOfStock = numericValue === 0;
        const isLowStock = numericValue > 0 && numericValue < 5;
        return (
          <div className="flex flex-col">
            <span
              className={`font-medium ${
                isOutOfStock
                  ? "text-red-600"
                  : isLowStock
                  ? "text-amber-600"
                  : "text-green-600"
              }`}
            >
              {numericValue} عدد
            </span>
            {isLowStock && <span className="text-xs text-amber-500">موجودی کم</span>}
            {isOutOfStock && <span className="text-xs text-red-500">ناموجود</span>}
          </div>
        );
      },
    },
    {
      key: "country" as keyof ProductType,
      sortable: true,
      label: "مبدأ",
      render: (value: string | number | null) => (
        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
          {value ?? "-"}
        </span>
      ),
    },
  ];

  const actions = (product: ProductType) => [
    { label: "مشاهده", icon: <Eye size={16} />, onClick: () => handleView(product) },
    { label: "ویرایش", icon: <Edit size={16} />, onClick: () => handleEdit(product) },
    { label: "حذف", icon: <Trash2 size={16} />, onClick: () => handleDelete(product) },
  ];

  return (
    <div className="w-full">
      <PageHeader
        title="مدیریت محصولات"
        description="لیست تمام محصولات موجود در سیستم"
        showHomeIcon
      />

      <div className="mb-6 flex justify-end">
        <AddButton size="md" onClick={handleAddProduct}>
          افزودن محصول جدید
        </AddButton>
      </div>

      {isLoading ? (
        <div className="flex w-full h-[300px] items-center justify-center">
          <ContentLoader />
        </div>
      ) : error ? (
        <p className="text-center text-red-500 mt-4">
          {(error as ApiError).message || "خطا در دریافت اطلاعات"}
        </p>
      ) : emptyMessage ? (
        <EmptyData title={emptyMessage} />
      ) : (
        <DataTable<ProductType>
          data={products}
          columns={columns}
          title="لیست محصولات"
          searchable
          actions={actions}
          onRowClick={handleView}
        />
      )}

      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={confirmDelete}
        itemName={selectedProduct?.name}
        isLoading={status === "pending"}
      />
    </div>
  );
}
