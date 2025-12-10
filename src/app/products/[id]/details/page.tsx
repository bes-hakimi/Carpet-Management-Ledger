"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { PageHeader } from "@/components/ui/PageHeader";
import { DeleteButton, EditButton } from "@/components/ui/Button";
import {
    Package, Ruler, Hash, Calendar, MapPin, Star, DollarSign, TrendingUp, Weight, Palette
} from "lucide-react";
import { useApiGet, useApiDeleteDynamic } from "@/hooks/useApi";
import { PRODUCT } from "@/endpoints/products";
import DeleteConfirmationModal from "@/components/ui/DeleteConfirmationModal";
import { ProductType } from "@/types/product/product";
import InfoCard from "./components/InfoCard";
import StockCard from "./components/StockCard";
import { ApiError } from "@/types/api/api";
import { ContentLoader } from "@/components/loading/DataLoading";

export default function ProductDetailPage() {
    const params = useParams();
    const router = useRouter();
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedImage, setSelectedImage] = useState(0);

    const { data: product, isLoading, isError } = useApiGet<ProductType>(
        "product-detail",
        PRODUCT.details(Number(params.id))
    );

    const deleteMutation = useApiDeleteDynamic();

    const handleEdit = () => router.push(`/products/${product?.id}/edit`);

    const handleDelete = async () => {
        try {
            await deleteMutation.mutateAsync(PRODUCT.delete(product!.id));
            toast.success("محصول با موفقیت حذف شد!");
            router.push("/products/list");
        } catch (err) {
            const error = err as ApiError;
            console.error(error);
            toast.error(error.response?.data?.message || "حذف محصول با خطا مواجه شد.");
        } finally {
            setShowDeleteModal(false);
        }
    };

    return (
        <div className="w-full">
            {/* PageHeader همیشه نمایش داده می‌شود */}
            <PageHeader title="جزئیات محصول" description="مشاهده اطلاعات کامل قالین" />

            {/* لودینگ و خطا */}
            {isLoading && (
                <div className="flex w-full h-full items-center justify-center">
                    <ContentLoader />
                </div>
            )}

            {isError && !isLoading && (
                <div className="w-full text-center py-20 text-red-500">خطا در دریافت اطلاعات محصول</div>
            )}

            {/* نمایش محتوا فقط وقتی دیتا آماده است */}
            {!isLoading && !isError && product && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {/* بخش تصاویر */}
                    <div className="space-y-4">
                        <div className="bg-white rounded-lg p-4 md:p-6 border border-gray-200">
                            <h3 className="font-semibold text-gray-900 mb-4">تصاویر محصول</h3>
                            <div className="mb-4">
                                <img
                                    src={product.image}
                                    alt={product.name}
                                    className="w-full h-80 object-cover rounded-lg border border-gray-200"
                                />
                            </div>

                            {product.gallery_image && product.gallery_image.length > 0 && (
                                <div className="flex gap-2 overflow-x-auto pb-2">
                                    {product.gallery_image.map((img: string, index: number) => (
                                        <button
                                            key={index}
                                            onClick={() => setSelectedImage(index)}
                                            className={`flex-shrink-0 w-16 h-16 rounded-lg border-2 ${selectedImage === index ? 'border-primary-500' : 'border-gray-200'
                                                }`}
                                        >
                                            <img
                                                src={img}
                                                alt={`${product.name} ${index + 1}`}
                                                className="w-full h-full object-cover rounded-lg"
                                            />
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>


                        <div className="mt-6 p-4 border border-gray-200 bg-white rounded-lg">
                            <h3 className="font-semibold mb-2 text-gray-900">توضیحات محصول</h3>
                            <p className="text-gray-700 leading-relaxed text-justify">
                                {product.description ? product.description : "بدون توضیحات"}
                            </p>
                        </div>

                    </div>

                    {/* بخش اطلاعات اصلی و فنی */}
                    <div className="space-y-4">
                        <div className="bg-white rounded-lg p-4 md:p-6 border border-gray-200">
                            <div className="flex justify-between items-start mb-6">
                                <div>
                                    <h1 className="text-2xl font-bold text-gray-900 mb-2">{product.name}</h1>
                                    <div className="flex items-center gap-2 text-gray-600">
                                        <Hash size={16} />
                                        <span>کد: {product.slug}</span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <EditButton size="md" onClick={handleEdit}>
                                        ویرایش
                                    </EditButton>
                                    <DeleteButton size="md" onClick={() => setShowDeleteModal(true)}>
                                        حذف
                                    </DeleteButton>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {product.type && (
                                    <InfoCard icon={<Package size={20} />} label="نوع قالین" value={product.type} />
                                )}
                                {product.main_price && (
                                    <InfoCard
                                        icon={<DollarSign size={20} />}
                                        label="قیمت خرید"
                                        value={`${Number(product.main_price).toLocaleString()} افغانی`}
                                    />
                                )}

                                {product.size && (
                                    <InfoCard icon={<Ruler size={20} />} label="سایز" value={product.size} />
                                )}
                                {product.quality && (
                                    <InfoCard icon={<Star size={20} />} label="کیفیت" value={product.quality} />
                                )}
                                {product.country && (
                                    <InfoCard icon={<MapPin size={20} />} label="مبدأ" value={product.country} />
                                )}
                                {product.stock_qty != null && <StockCard stock={product.stock_qty} />}
                                {product.main_color && (
                                    <InfoCard icon={<Palette size={20} />} label="رنگ اصلی" value={product.main_color} />
                                )}
                                {product.weight && (
                                    <InfoCard icon={<Weight size={20} />} label="وزن" value={`${product.weight} کیلوگرم`} />
                                )}
                                {product.age && (
                                    <InfoCard icon={<Calendar size={20} />} label="قدمت" value={`${product.age} سال`} />
                                )}
                            </div>


                        </div>
                    </div>

                    {/* بخش اطلاعات ایجادکننده محصول */}
                    {product.created_by_info && (
                        <div className="bg-white rounded-lg p-4 border border-gray-200">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">اطلاعات ایجادکننده</h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <InfoCard
                                    icon={<Star size={20} />}
                                    label="نام ایجادکننده"
                                    value={product.created_by_info.first_name}
                                />
                                {product.created_by_info.branch_name && (
                                    <InfoCard
                                        icon={<MapPin size={20} />}
                                        label="شعبه"
                                        value={product.created_by_info.branch_name}
                                    />
                                )}
                                {product.created_by_info.company_name && (
                                    <InfoCard
                                        icon={<TrendingUp size={20} />}
                                        label="شرکت"
                                        value={product.created_by_info.company_name}
                                    />
                                )}
                            </div>
                        </div>
                    )}

                </div>
            )}

            {/* Delete Modal */}
            <DeleteConfirmationModal
                isOpen={showDeleteModal}
                onClose={() => setShowDeleteModal(false)}
                onConfirm={handleDelete}
                itemName={product?.name || ""}
                isLoading={deleteMutation.status === "pending"}
            />
        </div>
    );
}
