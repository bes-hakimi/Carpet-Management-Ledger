"use client";

import { PrintButton } from "@/components/ui/Button";
import { useApiPost } from "@/hooks/useApi";
import { SALES } from "@/endpoints/sales";
import { SaleInitialData, SelectedSaleProduct } from "@/types/sales/sales";
import toast from "react-hot-toast";

export interface CreateSalePayload {
    customer_id?: string;
    customer_name?: string;
    customer_phone?: string;
    customer_address?: string;
    payment_method: string;
    delivery_method: string;
    description?: string;
    products: {
        product_id: number;
        qty: number;
        main_price: string;
    }[];
}

export interface CreateSaleResponse {
    id: number;
    invoice_number: string;
}

interface PrintAndSaveButtonProps {
    saleData: SaleInitialData;
}

export function PrintAndSaveButton({ saleData }: PrintAndSaveButtonProps) {
    const { mutateAsync, isPending } = useApiPost<
        CreateSaleResponse,
        CreateSalePayload
    >(SALES.create);

    const handleSaveAndPrint = async () => {
        if (
            !saleData.products ||
            !saleData.payment_method ||
            !saleData.delivery_method ||
            !saleData.customer
        ) {
            toast.error("لطفاً تمام اطلاعات مشتری، پرداخت، تحویل و محصولات را وارد کنید");
            return;
        }

        const payload: CreateSalePayload = {
            payment_method: saleData.payment_method,
            delivery_method: saleData.delivery_method,
            description: saleData.description,
            products: saleData.products.map((p: SelectedSaleProduct) => ({
                product_id: p.product.id,
                qty: p.quantity,
                main_price: p.salePrice.toFixed(2),
            })),
        };

        if (saleData.customer.id) {
            payload.customer_id = saleData.customer.id;
        } else {
            payload.customer_name = saleData.customer.customer_name;
            payload.customer_phone = saleData.customer.customer_phone;
            payload.customer_address = saleData.customer.customer_address;
        }

        const toastId = toast.loading("در حال ذخیره بل...");

        try {
            const response = await mutateAsync(payload);

            if (response && response.id) {
                toast.success("بل با موفقیت ذخیره شد", { id: toastId });

                // ⏳ چاپ با تأخیر 1.2 ثانیه پس از نمایش toast
                setTimeout(() => {
                    window.print();
                }, 1200);
            } else {
                toast.error("ذخیره بل ناموفق بود! لطفاً دوباره تلاش کنید.", { id: toastId });
            }

        } catch (error) {
            console.error("خطا در ذخیره بل:", error);
            toast.error("خطا در ذخیره بل! دوباره تلاش کنید.", { id: toastId });
        }
    };

    return (
        <PrintButton onClick={handleSaveAndPrint} disabled={isPending}>
            {isPending ? "در حال ذخیره..." : "ذخیره و چاپ بل"}
        </PrintButton>
    );
}
