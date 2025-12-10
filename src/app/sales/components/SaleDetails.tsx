"use client";

import {
  User,
  Phone,
  MapPin,
  Package,
  DollarSign,
  Calendar,
  CreditCard,
  Truck,
  FileText
} from "lucide-react";
import { SaleDetailsType } from "@/types/sales/details";

interface SaleDetailsProps {
  saleData: SaleDetailsType;
}

interface InfoCardProps {
  title: string;
  children: React.ReactNode;
  icon?: React.ComponentType<{ className?: string }>;
  className?: string;
  iconClassName?: string;
  titleClassName?: string;
}

const InfoCard = ({
  title,
  children,
  icon: Icon,
  className = "",
  iconClassName = "ml-2 w-4 h-4 text-gray-500",
  titleClassName = "text-sm font-medium text-gray-500",
}: InfoCardProps) => (
  <div className={`bg-gray-50 rounded-lg p-4 border border-gray-200 ${className}`}>
    <div className="flex items-center mb-3">
      {Icon && <Icon className={iconClassName} />}
      <h3 className={titleClassName}>{title}</h3>
    </div>
    <div className="text-gray-900">{children}</div>
  </div>
);

const formatPrice = (price: number): string => {
  return price.toLocaleString('fa-IR') + " افغانی";
};

const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('fa-IR');
};

export function SaleDetails({ saleData }: SaleDetailsProps) {
  // safe defaults
  const customer = saleData.customer || { customer_name: "", customer_phone: "", customer_address: "" };
  const items = saleData.items || [];

  const totalQuantity = items.reduce((acc, item) => acc + (item.qty || 0), 0);
  const totalPrice = items.reduce((acc, item) => acc + (parseFloat(item.main_price) * (item.qty || 0)), 0);

  return (
    <div className="space-y-4 md:space-y-6">
      {/* اطلاعات مشتری */}
      <div className="bg-white rounded-xl border border-gray-200 p-3 md:p-6">
        <h3 className="text-base md:text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <User className="ml-2 w-5 h-5" />
          اطلاعات مشتری
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <InfoCard
            title="نام مشتری"
            icon={User}
            className="bg-primary-50 border-primary-200"
            iconClassName="ml-2 w-4 h-4 text-primary-500"
            titleClassName="text-sm font-medium text-blue-700 text-primary-500"
          >
            <div className="text-lg font-medium text-primary-500">{customer.customer_name}</div>
          </InfoCard>

          <InfoCard
            title="شماره تماس"
            icon={Phone}
            className="bg-orange-50 border-orange-200"
            iconClassName="ml-2 w-4 h-4 text-orange-500"
            titleClassName="text-sm font-medium text-orange-500"
          >
            <div className="text-lg font-medium text-orange-500">{customer.customer_phone}</div>
          </InfoCard>

          <InfoCard
            title="آدرس"
            icon={MapPin}
            className="bg-yellow-50 border-yellow-200"
            iconClassName="ml-2 w-4 h-4 text-yellow-700"
            titleClassName="text-sm font-medium text-yellow-700"
          >
            <div className="text-sm leading-relaxed text-yellow-700">
              {customer.customer_address || "آدرس ثبت نشده"}
            </div>
          </InfoCard>
        </div>


      </div>

      {/* اطلاعات محصولات */}
      <div className="bg-white rounded-xl border border-gray-200 p-3 md:p-6">
        <h3 className="text-base md:text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <Package className="ml-2 w-5 h-5" />
          اطلاعات محصولات ({items.length} محصول)
        </h3>

        <div className="space-y-4">
          {items.map((item, index) => {
            const product = item.product || {} as SaleDetailsType["items"][0]["product"];
            return (
              <div key={item.id || `product-${index}`} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <h4 className="font-medium text-gray-900">{product.name}</h4>
                    <p className="text-sm text-gray-600">کد: {product.slug || "ندارد"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">اندازه: {product.size || "ندارد"}</p>
                    <p className="text-sm text-gray-600">رنگ: {product.main_color || "ندارد"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">کیفیت: {product.quality || "ندارد"}</p>
                    <p className="text-sm text-gray-600">جنس: {product.type || "ندارد"}</p>
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-medium">تعداد: {item.qty}</p>
                    <p className="text-sm font-medium text-green-600">
                      قیمت: {formatPrice(parseFloat(item.main_price))}
                    </p>
                    <p className="text-sm font-bold">
                      جمع: {formatPrice(parseFloat(item.main_price) * item.qty)}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* اطلاعات مالی */}
      <div className="bg-white rounded-xl border border-gray-200 p-3 md:p-6">
        <h3 className="text-base md:text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <DollarSign className="ml-2 w-5 h-5" />
          اطلاعات مالی
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4">
          <InfoCard title="تعداد کل محصولات">
            <div className="text-lg font-bold text-gray-900">{totalQuantity} عدد</div>
          </InfoCard>

          <InfoCard title="مبلغ نهایی">
            <div className="text-lg font-bold text-green-600">{formatPrice(totalPrice)}</div>
          </InfoCard>

          <InfoCard title="تاریخ فروش" icon={Calendar}>
            <div className="font-medium">{formatDate(saleData.created_at)}</div>
          </InfoCard>
        </div>
      </div>

      {/* اطلاعات تکمیلی */}
      <div className="bg-white rounded-xl border border-gray-200 p-3 md:p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <FileText className="ml-2 w-5 h-5" />
          اطلاعات تکمیلی
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center">
                <CreditCard className="ml-2 w-4 h-4 text-gray-500" />
                <span className="text-sm text-gray-600">نحوه پرداخت:</span>
              </div>
              <span className="font-medium">{saleData.payment_method || "ثبت نشده"}</span>
            </div>

            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center">
                <Truck className="ml-2 w-4 h-4 text-gray-500" />
                <span className="text-sm text-gray-600">نحوه تحویل:</span>
              </div>
              <span className="font-medium">{saleData.delivery_method || "ثبت نشده"}</span>
            </div>
          </div>

          {saleData.description && (
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="text-sm font-medium text-gray-500 mb-2">توضیحات:</h4>
              <p className="text-gray-700 text-sm leading-relaxed">{saleData.description}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
