"use client";

import { PrevButton } from "@/components/ui/Button";
import { useState } from "react";
import {
  FileText,
  Building2,
  MapPin,
  Phone,
  Mail,
  User,
} from "lucide-react";
import "@/styles/InvoicePrintStyles.css";
import { SaleInitialData, SelectedSaleProduct } from "@/types/sales/sales";
import { PrintAndSaveButton } from "./PrintAndSaveButton";
import { useAuth } from "@/hooks/useAuth";


interface InvoicePreviewProps {
  saleData: SaleInitialData;
  onBack: () => void;
}

export function InvoicePreview({ saleData, onBack }: InvoicePreviewProps) {
  console.log("invoice data", saleData)
  const { userData } = useAuth();
  const userRole = userData?.user.role;
  const [invoiceNumber, setInvoiceNumber] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);




  const displayedInvoiceNumber =
    saleData.slug || invoiceNumber || "بعد از ذخیره شماره بل ساخته می‌شود";

  const handleInvoiceSaved = (slug: string) => {
    setInvoiceNumber(slug);
    setIsProcessing(true); // 🔒 غیرفعال کردن دکمه‌ها

    // کمی تأخیر تا شماره فاکتور در DOM رندر شود
    setTimeout(() => {
      window.print(); // چاپ بل

      // اختیاری: بعد از چاپ، کاربر به صفحه دیگر هدایت شود
      window.onafterprint = () => {
        // مثلا هدایت به صفحه فروش‌ها
        window.location.href = "/sales/list";
      };
    }, 500);
  };




  // محاسبه جمع کل
  const subtotal =
    saleData.products?.reduce(
      (total: number, item: SelectedSaleProduct) =>
        total + item.salePrice * item.quantity,
      0
    ) ?? 0;

  // تاریخ روز جاری
  const currentDate = new Date().toLocaleDateString("fa-IR");

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:justify-between gap-4 md:gap-0 items-center no-print">
        <h2 className="text-lg md:text-xl font-semibold flex items-center">
          <FileText className="ml-2 w-6 h-6" />
          پیش‌نمایش بل
        </h2>
        <div className="flex gap-3">
          <PrevButton onClick={onBack} disabled={isProcessing}>
            بازگشت به ویرایش
          </PrevButton>

          <PrintAndSaveButton
            saleData={saleData}
            onSuccess={handleInvoiceSaved}
            disabled={isProcessing} 
          />

        </div>
      </div>

      {/* بل برای چاپ */}


      <div
        id="invoice-to-download"
        className="print:overflow-hidden bg-white border border-gray-300 p-2 md:p-6 md:max-w-2xl mx-auto font-sans print:border-0 print:shadow-none print:max-w-none print:m-0 print:p-3 min-h-screen flex flex-col print:bg-white print:text-xs"
      >
        {/* هدر بل */}
        <div className="w-full flex justify-between items-start mb-3 border-b border-gray-300 pb-2">
          <div>
            <img
              src={saleData.company_info?.company_logo || "/images/logo/carpet-logo.png"}
              alt="لگوی شرکت"
              className="w-12 h-12 object-contain print:w-10 print:h-10"
            />
            <div className="flex items-center gap-4 bg-primary-50 border border-primary-200 rounded-md px-3 py-1 w-fit shadow-sm print:shadow-none print:bg-primary-50 print:border-primary-200 mt-2">
              <div className="flex items-center gap-1 text-primary-800">
                <FileText className="w-3 h-3" />
                <span className="text-xs font-semibold">شماره بل:</span>
                <span
                  className={`
                    text-xs
                    ${!saleData.slug && !invoiceNumber ? "text-gray-400 italic" : "text-primary-800"}
                  `}
                >
                  {displayedInvoiceNumber}
                </span>
              </div>

              <div className="flex items-center gap-1 text-primary-800">
                <span className="text-xs font-semibold">تاریخ:</span>
                <span className="text-xs">{currentDate}</span>
              </div>
            </div>
          </div>

          <div className="text-primary-900 text-xs space-y-1">
            <div className="flex items-center gap-1">
              <Building2 className="w-3 h-3 text-primary-700" />
              {userRole === "branch" ?
                <p className="font-semibold">{saleData.company_info?.branch_name}</p>
                :
                <p className="font-semibold">{saleData.company_info?.company_name}</p>
              }
            </div>
            <div className="flex items-center gap-1">
              <MapPin className="w-3 h-3 text-primary-700" />
              <p>{saleData.company_info?.address}</p>
            </div>
            <div className="flex items-center gap-1">
              <Phone className="w-3 h-3 text-primary-700" />
              <p>{saleData.company_info?.phone}</p>
            </div>
          </div>
        </div>

        {/* اطلاعات مشتری */}
        <div className="w-full space-y-2 py-2 my-2">
          <h2 className="text-xs font-semibold text-primary-800">
            اطلاعات خریدار
          </h2>

          <div className="text-gray-700 w-full grid grid-cols-1 md:grid-cols-3 gap-1 md:gap-3 text-xs print:grid-cols-3">
            <div className="flex items-center">
              <User className="w-3 h-3 ml-1 text-primary-700 flex-shrink-0" />
              <span className="font-semibold ml-1 whitespace-nowrap">نام:</span>
              <span className="mr-1 whitespace-nowrap overflow-hidden text-ellipsis">
                {saleData.customer?.customer_name || "نامشخص"}
              </span>
            </div>

            <div className="flex items-center">
              <Phone className="w-3 h-3 ml-1 text-primary-700 flex-shrink-0" />
              <span className="font-semibold whitespace-nowrap ml-1">
                شماره تماس:
              </span>
              <span className="mr-1 whitespace-nowrap font-medium">
                {saleData.customer?.customer_phone || "نامشخص"}
              </span>
            </div>

            <div className="flex items-center">
              <MapPin className="w-3 h-3 ml-1 text-primary-700 flex-shrink-0" />
              <span className="font-semibold ml-1 whitespace-nowrap">
                آدرس:
              </span>
              <span className="mr-1 overflow-hidden text-ellipsis">
                {saleData.customer?.customer_address || "نامشخص"}
              </span>
            </div>
          </div>
        </div>

        {/* جدول محصولات */}
        <div className="w-full mb-6 flex-1">
          <table className="w-full border-collapse text-xs">
            <thead>
              <tr className="bg-primary-500 text-xs print:bg-primary-500">
                <th className="text-right py-2 px-2 font-bold text-white border border-primary-600">
                  شرح اجناس
                </th>
                <th className="text-center py-2 px-2 font-bold text-white border border-primary-600">
                  قیمت
                </th>
                <th className="text-center py-2 px-2 font-bold text-white border border-primary-600">
                  تعداد
                </th>
                <th className="text-center py-2 px-2 font-bold text-white border border-primary-600">
                  مجموع
                </th>
              </tr>
            </thead>
            <tbody>
              {saleData.products?.map((item: SelectedSaleProduct, index) => (
                <tr
                  key={index}
                  className={index % 2 === 0 ? "bg-gray-50 print:bg-gray-100" : ""}
                >
                  <td className="py-2 px-2 text-right border border-gray-300">
                    <div>
                      <p className="font-semibold text-gray-800 text-xs">
                        {item.product?.name || "بدون عنوان"}
                      </p>
                      <div className="flex flex-nowrap gap-1 items-center text-xs text-gray-600 mt-1 ">
                        <p>رنگ: {item.product?.main_color}</p>
                        |
                        <p>اندازه: {item.product?.size}</p>
                        |
                        <p>نوع: {item.product?.type}</p>

                      </div>
                    </div>
                  </td>
                  <td className="text-xs py-2 px-2 text-center text-gray-700 border border-gray-300">
                    {(item.salePrice ?? 0).toLocaleString()}
                  </td>
                  <td className="text-xs py-2 px-2 text-center text-gray-700 border border-gray-300">
                    {item.quantity}
                  </td>
                  <td className="text-xs py-2 px-2 text-center font-semibold text-gray-800 border border-gray-300">
                    {((item.salePrice ?? 0) * (item.quantity ?? 0)).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* محاسبات قیمت */}
        <div className="w-full flex justify-between h-fit mb-3">
          <div className="w-1/2 text-xs">
            <h4 className="font-bold text-gray-800">یادداشت:</h4>
            <p className="text-gray-600 text-xs leading-relaxed">
              بل بدون مهر و امضاء معتبر نمی‌باشد.
            </p>
            <p className="text-gray-600 text-xs leading-relaxed">
              {saleData.description ||
                `اجناس فروخته شده با کیفیت درجه یک و ضمانت ${saleData.company_info?.warranty} می‌باشد. در صورت وجود هرگونه مشکل در مدت ضمانت، اجناس تبدیل خواهد شد.`}
            </p>

          </div>

          <div className="w-1/3 flex items-end">
            <div className="bg-primary-500 py-2 px-3 w-full print:bg-primary-500">
              <div className="flex justify-between items-center text-xs font-semibold text-white">
                <span>مجموع کل:</span>
                <span className="text-sm font-bold tracking-wide">
                  {subtotal.toLocaleString()}{" "}
                  <span className="text-xs font-normal">افغانی</span>
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* فوتر */}
        <div className="w-full border-t border-gray-300 pt-4 mt-auto">
          <div className="flex justify-between items-start gap-4">
            <div className="flex-1">
              <p className="text-xs font-bold text-gray-800 mb-1">
                تشکر از همکاری شما
              </p>
              <div className="space-y-1 text-xs text-gray-600">
                <p className="flex items-center">
                  <Mail className="w-3 h-3 ml-1" />
                  {saleData.company_info?.email}
                </p>
                <p className="flex items-center">
                  <Phone className="w-3 h-3 ml-1" />
                  {saleData.company_info?.phone}
                </p>
              </div>
            </div>

            <div className="flex-1 text-right">
              <p className="text-xs font-bold text-gray-800 mb-1">
                معلومات پرداخت:
              </p>
              <div className="text-xs text-gray-600 space-y-1">
                <p>پرداخت: {saleData.payment_method}</p>
                <p>تحویل: {saleData.delivery_method}</p>
              </div>
            </div>

            <div className="flex-1 text-right">
              <p className="text-xs font-bold text-gray-800 mb-1">
                شرایط و ضوابط:
              </p>
              <p className="text-xs text-gray-600 leading-relaxed">
                تمام قالین‌ها ضمانت {saleData.company_info?.warranty} دارند.
                برگشت جنس در صورت مشکل تا یک هفته.
              </p>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
