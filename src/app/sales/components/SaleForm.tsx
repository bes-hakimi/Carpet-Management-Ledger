"use client";

import { useState, useEffect } from "react";
import { SaveButton, CancelButton } from "@/components/ui/Button";
import { ProductSelection } from "./ProductSelection";
import { CustomerInfo } from "./CustomerInfo";
import { PaymentAndDelivery } from "./PaymentAndDelivery";
import { SaleNotes } from "./SaleNotes";
import { CustomerType } from "@/types/sales/sales";
import {
  SaleFormProps,
  SelectedSaleProduct,
  SaleInitialData,
} from "@/types/sales/sales";

export function SaleForm({ onCancel, initialData, onShowInvoice }: SaleFormProps) {
  const [saleProducts, setSaleProducts] = useState<SelectedSaleProduct[]>([]);
  const [customer, setCustomer] = useState<CustomerType | null>(initialData?.customer || null);
  const [paymentMethod, setPaymentMethod] = useState(initialData?.payment_method || "");
  const [deliveryMethod, setDeliveryMethod] = useState(initialData?.delivery_method || "");
  const [description, setDescription] = useState(initialData?.description || "");

  useEffect(() => {
    if (initialData?.products) setSaleProducts(initialData.products);
  }, [initialData]);


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!customer?.customer_name || saleProducts.length === 0) {
      alert("لطفاً اطلاعات مشتری و حداقل یک محصول را وارد کنید");
      return;
    }

    const submitData: SaleInitialData = {
      customer,
      payment_method: paymentMethod,
      delivery_method: deliveryMethod,
      description,
      products: saleProducts,
    };

    onShowInvoice(submitData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
      <ProductSelection
        saleProducts={saleProducts}
        onSaleProductsChange={setSaleProducts}
      />

      <CustomerInfo
        customer={customer}
        onChange={setCustomer}
      />

      <PaymentAndDelivery
        paymentMethod={paymentMethod}
        deliveryMethod={deliveryMethod}
        onChange={(field, value) => {
          if (field === "payment_method") setPaymentMethod(value);
          if (field === "delivery_method") setDeliveryMethod(value);
        }}
      />

      <SaleNotes
        notes={description}
        onChange={(field, value) => setDescription(value)}
      />

      <div className="flex gap-4 justify-end pt-6 border-t border-gray-200">
        <CancelButton size="md" onClick={onCancel}>
          انصراف
        </CancelButton>
        <SaveButton
          size="md"
          type="submit"
          disabled={
            !customer?.customer_name ||
            !customer?.customer_phone ||
            !customer?.customer_address ||
            !paymentMethod ||
            !deliveryMethod ||
            !saleProducts.length
          }
        >
          {initialData ? "به‌روزرسانی و نمایش بل" : "نمایش بل"}
        </SaveButton>
      </div>
    </form>
  );
}
