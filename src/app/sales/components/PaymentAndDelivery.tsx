"use client";

import { DollarSign } from "lucide-react";
import { Select } from "@/components/ui/Select";
import { FormField } from "@/types/sales/sales";

interface PaymentAndDeliveryProps {
  paymentMethod: string;
  deliveryMethod: string;
  onChange: (field: FormField, value: string) => void;
}

const paymentMethods = [
  { value: "نقدی", label: "نقدی" },
  { value: "انتقال بانکی", label: "انتقال بانکی" },
  { value: "موبایل‌مانی", label: "موبایل‌مانی (M-Paisa / Azizi Pay)" },
  { value: "حواله", label: "حواله" },
];

const deliveryMethods = [
  { value: "تحویل در شرکت", label: "تحویل در شرکت" },
  { value: "ارسال به آدرس", label: "ارسال به آدرس" },
];

export function PaymentAndDelivery({
  paymentMethod,
  deliveryMethod,
  onChange,
}: PaymentAndDeliveryProps) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4 md:p-6">
      <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
        <DollarSign className="ml-2 w-5 h-5" />
        پرداخت و تحویل
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Select
          label="نحوه پرداخت"
          options={paymentMethods}
          value={paymentMethod}
          onChange={(value) => onChange("payment_method", value)} // ✅
          placeholder="انتخاب روش پرداخت"
          required
        />

        <Select
          label="نحوه تحویل"
          options={deliveryMethods}
          value={deliveryMethod}
          onChange={(value) => onChange("delivery_method", value)} // ✅
          placeholder="انتخاب روش تحویل"
          required
        />

      </div>
    </div>
  );
}
