"use client";

import { useState, useEffect } from "react";
import { Select } from "@/components/ui/Select";
import { Input } from "@/components/ui/Input";
import { User } from "lucide-react";
import { OutlineButton } from "@/components/ui/Button";
import { CustomerType } from "@/types/sales/sales";
import { useApiGet } from "@/hooks/useApi";
import { SALES } from "@/endpoints/sales";

interface CustomerInfoProps {
  customer: CustomerType | null;
  onChange: (customer: CustomerType) => void;
}

export function CustomerInfo({ customer, onChange }: CustomerInfoProps) {
  const [isNewCustomer, setIsNewCustomer] = useState(false); // پیش‌فرض مشتری موجود
  const [selectedCustomer, setSelectedCustomer] = useState<CustomerType | null>(null);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const { data: customers = [] } = useApiGet<CustomerType[]>("customers", SALES.customer_list);


  useEffect(() => {
    if (!customers.length) return;

    if (customer?.id) {
      const existing = customers.find(c => c.id === customer.id);
      setSelectedCustomer(existing || customer);
      setIsNewCustomer(!existing);
    } else if (customer) {
      setSelectedCustomer(customer);
      setIsNewCustomer(true);
    } else {
      setSelectedCustomer(null);
      setIsNewCustomer(false);
    }
  }, [customer, customers]);

  // انتخاب مشتری موجود
  const handleCustomerSelect = (customerId: string) => {
    const cust = customers.find(c => c.id?.toString() === customerId) || null;
    setSelectedCustomer(cust);
    if (cust) {
      setIsNewCustomer(false);
      onChange(cust);
    }
  };


  const handleInputChange = (field: keyof CustomerType, value: string) => {
    const newErrors = { ...errors };

    if (field === "customer_name") {
      // فقط حروف و فاصله اجازه داده شود
      if (!/^[A-Za-z\u0600-\u06FF\s]*$/.test(value)) {
        // کاراکتر غیرمجاز را قبول نکن
        return;
      }
      if (value === "") delete newErrors.customer_name;
    }

    if (field === "customer_phone") {
      // فقط اعداد و + مجاز
      if (!/^[0-9+]*$/.test(value)) {
        return;
      }
      if (value !== "" && !/^(?:\+93|0)?7\d{0,8}$/.test(value)) {
        newErrors.customer_phone = "شماره معتبر افغانستان وارد کنید";
      } else {
        delete newErrors.customer_phone;
      }
    }

    setErrors(newErrors);

    const updated = selectedCustomer
      ? { ...selectedCustomer, [field]: value }
      : { id: "", customer_name: "", customer_phone: "", customer_address: "", [field]: value };

    setSelectedCustomer(updated);
    onChange(updated);
  };



  // تغییر بین تب‌ها
  const handleNewCustomerToggle = (isNew: boolean) => {
    setIsNewCustomer(isNew);

    if (isNew) {
      // مشتری جدید
      const newCust: CustomerType = { id: "", customer_name: "", customer_phone: "", customer_address: "" };
      setSelectedCustomer(newCust);
      onChange(newCust);
    } else {
      // مشتری موجود
      // اگر قبلاً مشتری موجود انتخاب شده بود، همان را نگه دار
      const existingCustomer =
        selectedCustomer?.id
          ? customers.find(c => c.id === selectedCustomer.id) || null
          : customers[0] || null; // اگر هیچ انتخابی نبود، اولین مشتری موجود

      setSelectedCustomer(existingCustomer);
      if (existingCustomer) onChange(existingCustomer);
    }
  };


  const getCustomerOptions = () =>
    customers.map(c => ({
      value: c.id?.toString() ?? "",
      label: `${c.customer_name} - ${c.customer_phone}`,
    }));

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4 md:p-6">
      <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
        <User className="ml-2 w-5 h-5" />
        معلومات مشتری
      </h3>

      {/* دکمه‌ها */}
      <div className="flex gap-4 mb-4">
        <OutlineButton
          type="button"
          onClick={() => handleNewCustomerToggle(false)}
          className={`${!isNewCustomer
            ? "bg-primary-500 text-white border-primary-500"
            : "bg-white border-gray-300 text-gray-600 hover:bg-gray-50"
            }`}
        >
          مشتری موجود
        </OutlineButton>
        <OutlineButton
          type="button"
          onClick={() => handleNewCustomerToggle(true)}
          className={`${isNewCustomer
            ? "bg-primary-500 text-white border-primary-500"
            : "bg-white border-gray-300 text-gray-600 hover:bg-gray-50"
            }`}
        >
          مشتری جدید
        </OutlineButton>
      </div>

      {/* مشتری موجود */}
      {!isNewCustomer ? (
        <>
          <Select
            label="انتخاب مشتری"
            options={getCustomerOptions()}
            value={selectedCustomer?.id?.toString() || ""}
            onChange={handleCustomerSelect}
            placeholder="مشتری را انتخاب کنید"
            searchable
            clearable
          />

          <div className="mt-4">
            <Input
              label="آدرس مشتری"
              value={selectedCustomer?.customer_address || ""}
              readOnly
              disabled
              placeholder="آدرس مشتری در اینجا نمایش داده می‌شود"
            />
          </div>

          {selectedCustomer && selectedCustomer.id && (
            <div className="mt-3 p-3 bg-green-50 rounded-lg border border-green-200">
              <p className="text-sm text-green-700">
                <strong>مشتری انتخاب شده:</strong>{" "}
                {selectedCustomer.customer_name} - {selectedCustomer.customer_phone}
              </p>
              <p className="text-sm text-green-600 mt-1">{selectedCustomer.customer_address}</p>
            </div>
          )}
        </>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="نام مشتری"
              value={selectedCustomer?.customer_name || ""}
              onChange={(e) => handleInputChange("customer_name", e.target.value)}
              placeholder="نام کامل مشتری"
              required
              error={errors.customer_name}
            />
            <Input
              label="شماره تماس"
              value={selectedCustomer?.customer_phone || ""}
              onChange={(e) => handleInputChange("customer_phone", e.target.value)}
              placeholder="لطفا شماره تماس را وارد کنید"
              required
              error={errors.customer_phone}
            />
          </div>

          <div className="mt-4">
            <Input
              label="آدرس"
              value={selectedCustomer?.customer_address || ""}
              onChange={(e) => handleInputChange("customer_address", e.target.value)}
              placeholder="آدرس کامل"
            />
          </div>

          <div className="mt-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
            <p className="text-sm text-blue-700">
              <strong>راهنما:</strong> شماره تماس باید با 07 شروع شود (مثال: 0793123456)
            </p>
          </div>
        </>
      )}
    </div>
  );
}
