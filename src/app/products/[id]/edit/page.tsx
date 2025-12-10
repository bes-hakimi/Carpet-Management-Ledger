"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { PageHeader } from "@/components/ui/PageHeader";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Select } from "@/components/ui/Select";
import { ImageUpload } from "@/components/ui/ImageUpload";
import { DollarSign, Package, Weight, Palette } from "lucide-react";
import { CancelButton, SaveButton, DeleteButton } from "@/components/ui/Button";
import { carpetTypes, carpetSizes, qualityLevels, carpetOrigins } from "../../constants/productOptions";
import { useApiGet, useApiPut, useApiDeleteDynamic } from "@/hooks/useApi";
import { ProductType } from "@/types/product/product";
import { PRODUCT } from "@/endpoints/products";
import { toast } from "react-hot-toast";
import DeleteConfirmationModal from "@/components/ui/DeleteConfirmationModal";
import { ApiError } from "@/types/api/api";
import { ContentLoader } from "@/components/loading/DataLoading";

export default function EditProductPage() {
    const params = useParams();
    const router = useRouter();
    const productId = Number(params.id);

    const { data: productData, isLoading, isError } = useApiGet<ProductType>(
        `product-${productId}`,
        PRODUCT.details(productId)
    );

    const [formData, setFormData] = useState<Partial<ProductType>>({});
    const [mainImageUrl, setMainImageUrl] = useState<string>("");
    const [galleryUrls, setGalleryUrls] = useState<string[]>([]);
    const [isSaving, setIsSaving] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    const putProduct = useApiPut<ProductType, Partial<ProductType>>(PRODUCT.update(productId));
    const deleteProduct = useApiDeleteDynamic<void>();

    useEffect(() => {
        if (productData) {
            setFormData(productData);
            setMainImageUrl(productData.image || "");
            setGalleryUrls(
                Array.isArray(productData.gallery_image)
                    ? productData.gallery_image
                    : productData.gallery_image
                        ? [productData.gallery_image]
                        : []
            );
        }
    }, [productData]);

    const handleInputChange = <K extends keyof ProductType>(field: K, value: ProductType[K]) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);

        try {
            await putProduct.mutateAsync({
                ...formData,
                image: mainImageUrl,
                // gallery_image: galleryUrls,
            });

            toast.success("محصول با موفقیت ویرایش شد!");
            router.push("/products/list");
        } catch (error) {
            const err = error as ApiError;
            const errorMessage =
                err?.response?.data?.message ||
                err?.response?.data?.detail ||
                err?.message ||
                "خطا در ویرایش محصول";

            toast.error(errorMessage);
        } finally {
            setIsSaving(false);
        }
    };


    const handleDeleteConfirm = async () => {
        setIsDeleting(true);

        try {
            await deleteProduct.mutateAsync(PRODUCT.delete(productId));
            toast.success("محصول با موفقیت حذف شد!");
            router.push("/products/list");
        } catch (error) {
            const err = error as ApiError;
            const errorMessage =
                err?.response?.data?.message ||
                err?.response?.data?.detail ||
                err?.message ||
                "خطا در حذف محصول";

            toast.error(errorMessage);
        } finally {
            setIsDeleting(false);
            setIsDeleteOpen(false);
        }
    };


    return (
        <div className="w-full">
            {/* ✅ PageHeader همیشه نمایش داده شود */}
            <PageHeader
                title="ویرایش محصول"
                description="اطلاعات قالین را ویرایش کنید"
                backUrl="/products"
            />

            {/* ✅ وضعیت‌ها */}
            {isLoading ? (
                <div className="flex w-full h-full items-center justify-center">
                    <ContentLoader />
                </div>
            ) : isError ? (
                <p className="text-red-500 p-6">خطا در بارگذاری محصول</p>
            ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* اطلاعات اصلی */}
                    <div className="bg-white rounded-lg p-4 md:p-6 border border-gray-200">
                        <h3 className="font-semibold mb-4 text-gray-900">اطلاعات اصلی</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Input
                                label="نام محصول"
                                value={formData.name || ""}
                                onChange={(e) => handleInputChange("name", e.target.value)}
                                required
                            />
                            <Input
                                label="قیمت فروش"
                                type="number"
                                value={formData.main_price || ""}
                                onChange={(e) => handleInputChange("main_price", e.target.value)}
                                icon={<DollarSign size={16} />}
                                required
                            />
                            <Input
                                label="تعداد موجودی"
                                type="number"
                                value={formData.stock_qty || ""}
                                onChange={(e) =>
                                    handleInputChange("stock_qty", Number(e.target.value))
                                }
                                icon={<Package size={16} />}
                                required
                            />
                            <Select
                                label="نوع"
                                options={carpetTypes}
                                value={formData.type || ""}
                                onChange={(v) => handleInputChange("type", v)}
                            />
                            <Select
                                label="مبدأ"
                                options={carpetOrigins}
                                value={formData.country || ""}
                                onChange={(v) => handleInputChange("country", v)}
                            />
                            <Select
                                label="کیفیت"
                                options={qualityLevels}
                                value={formData.quality || ""}
                                onChange={(v) => handleInputChange("quality", v)}
                            />
                            <Select
                                label="سایز"
                                options={carpetSizes}
                                value={formData.size || ""}
                                onChange={(v) => handleInputChange("size", v)}
                            />
                        </div>
                    </div>

                    {/* مشخصات فنی */}
                    <div className="bg-white rounded-lg p-4 md:p-6 border border-gray-200">
                        <h3 className="font-semibold mb-4 text-gray-900">مشخصات فنی</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            <Input
                                label="وزن (کیلوگرم)"
                                type="number"
                                step="0.1"
                                value={formData.weight || ""}
                                onChange={(e) =>
                                    handleInputChange("weight", e.target.value)
                                }
                                icon={<Weight size={16} />}
                            />
                            <Input
                                label="رنگ اصلی"
                                value={formData.main_color || ""}
                                onChange={(e) =>
                                    handleInputChange("main_color", e.target.value)
                                }
                                icon={<Palette size={16} />}
                            />
                            <Input
                                label="قدمت (سال)"
                                type="number"
                                value={formData.age || ""}
                                onChange={(e) =>
                                    handleInputChange("age", Number(e.target.value))
                                }
                            />
                        </div>
                    </div>

                    {/* تصاویر */}
                    <div className="bg-white rounded-lg p-4 md:p-6 border border-gray-200">
                        <h3 className="font-semibold mb-4 text-gray-900">تصاویر محصول</h3>
                        <ImageUpload
                            label="تصویر اصلی"
                            defaultImageUrl={mainImageUrl}
                            onImageSelect={(url) => setMainImageUrl(url || "")}
                        />
                        {/* <ImageUpload
                            label="گالری تصاویر"
                            defaultImageUrl=""
                            onImageSelect={(url) => {
                                if (url) setGalleryUrls((prev) => [...prev, url]);
                            }}
                        /> */}

                        {/* ✅ فقط وقتی گالری واقعاً مقدار دارد */}
                        {/* {Array.isArray(galleryUrls) && galleryUrls.length > 0 && (
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                                {galleryUrls.map((img, i) => (
                                    <div key={i} className="relative group">
                                        <img
                                            src={img}
                                            alt={`Gallery ${i}`}
                                            className="w-full h-24 object-cover rounded-md border border-gray-200"
                                        />
                                        <button
                                            type="button"
                                            onClick={() =>
                                                setGalleryUrls((prev) =>
                                                    prev.filter((_, idx) => idx !== i)
                                                )
                                            }
                                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                        >
                                            <X size={12} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )} */}
                    </div>

                    {/* توضیحات */}
                    <div className="bg-white rounded-lg p-4 md:p-6 border border-gray-200">
                        <h3 className="font-semibold mb-4 text-gray-900">توضیحات</h3>
                        <Textarea
                            value={formData.description || ""}
                            onChange={(v) => handleInputChange("description", v)}
                            rows={6}
                        />
                    </div>

                    {/* دکمه‌ها */}
                    <div className="flex gap-4 justify-end">
                        <DeleteButton
                            type="button"
                            size="md"
                            onClick={() => setIsDeleteOpen(true)}
                        >
                            حذف
                        </DeleteButton>
                        <CancelButton
                            type="button"
                            size="md"
                            onClick={() => router.push("/products")}
                        >
                            انصراف
                        </CancelButton>
                        <SaveButton size="md" type="submit" loading={isSaving}>
                            ذخیره تغییرات
                        </SaveButton>
                    </div>
                </form>
            )}

            {/* ✅ Modal حذف */}
            <DeleteConfirmationModal
                isOpen={isDeleteOpen}
                onClose={() => setIsDeleteOpen(false)}
                onConfirm={handleDeleteConfirm}
                isLoading={isDeleting}
                itemName={formData.name}
            />
        </div>
    );

}
