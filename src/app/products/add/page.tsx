"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { PageHeader } from "@/components/ui/PageHeader";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Select } from "@/components/ui/Select";
import { ImageUpload } from "@/components/ui/ImageUpload";
import { DollarSign, Package, Weight, Palette, X } from "lucide-react";
import { CancelButton, SaveButton } from "@/components/ui/Button";
import { carpetTypes, carpetSizes, qualityLevels, carpetOrigins } from "../constants/productOptions";
import { useApiPost } from "@/hooks/useApi";
import { PRODUCT } from "@/endpoints/products";
import { ApiError } from "@/types/api/api";

export default function AddProductPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    type: "",
    origin: "",
    size: "",
    customLength: "",
    customWidth: "",
    quality: "",
    stock: "",
    salePrice: "",
    description: "",
    weight: "",
    primaryColor: "",
    age: "",
    condition: "new",
  });

  const [image, setImage] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setErrors(prev => ({ ...prev, [field]: "" }));
  };

  const handleImageSelect = (url: string | null) => {
    setImage(url);
    setErrors(prev => ({ ...prev, image: "" }));
  };

  const mutation = useApiPost(PRODUCT.create);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = "نام محصول الزامی است.";
    if (!formData.type) newErrors.type = "نوع محصول الزامی است.";
    if (!formData.origin) newErrors.origin = "مبدأ محصول الزامی است.";
    if (!formData.size) newErrors.size = "سایز محصول الزامی است.";
    if (formData.size === "سفارشی") {
      if (!formData.customLength) newErrors.customLength = "طول قالین الزامی است.";
      if (!formData.customWidth) newErrors.customWidth = "عرض قالین الزامی است.";
    }
    if (!formData.quality) newErrors.quality = "کیفیت محصول الزامی است.";
    if (!formData.stock || Number(formData.stock) <= 0) newErrors.stock = "تعداد موجودی باید بزرگتر از صفر باشد.";
    if (!formData.salePrice || Number(formData.salePrice) <= 0) newErrors.salePrice = "قیمت خرید باید بزرگتر از صفر باشد.";
    if (!image) newErrors.image = "لطفاً یک تصویر انتخاب کنید.";
    // if (!formData.description.trim()) newErrors.description = "توضیحات محصول الزامی است.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("لطفاً خطاهای فرم را اصلاح کنید.");
      return;
    }

    setIsSubmitting(true); // شروع لودینگ

    const finalSize =
      formData.size === "سفارشی"
        ? `${String(formData.customLength)}x${String(formData.customWidth)} متر`
        : formData.size;



    const productData = {
      name: formData.name,
      type: formData.type,
      country: formData.origin,
      size: finalSize,
      quality: formData.quality,
      stock_qty: Number(formData.stock),
      main_price: String(formData.salePrice),
      image,
      description: formData.description,
      weight: formData.weight || undefined,
      main_color: formData.primaryColor || undefined,
      age: formData.age ? Number(formData.age) : undefined,
      condition: formData.condition || undefined,
    };

    try {
      await mutation.mutateAsync(productData);
      toast.success("محصول با موفقیت اضافه شد!");
      router.push("/products/list");
    } catch (error: unknown) {
      const apiError = error as ApiError;
      console.error("API Error:", apiError);

      const message =
        apiError.response?.data?.message ??
        apiError.response?.data?.detail ??
        apiError.message ??
        "ارسال محصول با خطا مواجه شد.";

      toast.error(message);
    } finally {
      setIsSubmitting(false); // پایان لودینگ
    }
  };



  return (
    <div className="w-full">
      <PageHeader title="اضافه کردن محصول جدید" description="اطلاعات قالین جدید را وارد کنید" backUrl="/products" />

      <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
        {/* اطلاعات اصلی */}
        <div className="bg-white rounded-lg p-4 md:p-6 border border-gray-200">
          <h3 className="font-semibold mb-4 text-gray-900">اطلاعات اصلی</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input label="نام محصول" placeholder="نام محصول را وارد کنید" value={formData.name} onChange={e => handleInputChange("name", e.target.value)} error={errors.name} required />
            <Input label="قیمت خرید (افغانی)" placeholder="قیمت خرید را وارد کنید" type="number" value={formData.salePrice} onChange={e => handleInputChange("salePrice", e.target.value)} icon={<DollarSign size={16} />} error={errors.salePrice} required />
            <Input label="تعداد موجودی" placeholder="تعداد موجودی را وارد کنید" type="number" value={formData.stock} onChange={e => handleInputChange("stock", e.target.value)} icon={<Package size={16} />} error={errors.stock} required />
            <Select label="نوع" options={carpetTypes} value={formData.type} onChange={v => handleInputChange("type", v)} error={errors.type} required />
            <Select label="مبدأ" options={carpetOrigins} value={formData.origin} onChange={v => handleInputChange("origin", v)} error={errors.origin} required />
            <Select label="کیفیت" options={qualityLevels} value={formData.quality} onChange={v => handleInputChange("quality", v)} error={errors.quality} />
            <Select label="سایز" options={carpetSizes} value={formData.size} onChange={v => handleInputChange("size", v)} error={errors.size} required />
            {formData.size === "سفارشی" && (
              <>
                <Input label="طول (متر)" placeholder="مثلا: 2" type="number" step="0.1" value={formData.customLength} onChange={e => handleInputChange("customLength", e.target.value)} error={errors.customLength} required />
                <Input label="عرض (متر)" placeholder="مثلا: 1" type="number" step="0.1" value={formData.customWidth} onChange={e => handleInputChange("customWidth", e.target.value)} error={errors.customWidth} required />
              </>
            )}
          </div>
        </div>

        {/* مشخصات فنی */}
        <div className="bg-white rounded-lg p-4 md:p-6 border border-gray-200">
          <h3 className="font-semibold mb-4 text-gray-900">مشخصات فنی (اختیاری)</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Input label="وزن (کیلوگرم)" placeholder="مثلا: 10" type="number" step="0.1" value={formData.weight} onChange={e => handleInputChange("weight", e.target.value)} icon={<Weight size={16} />} />
            <Input label="رنگ اصلی" placeholder="مثلا: سرخ" value={formData.primaryColor} onChange={e => handleInputChange("primaryColor", e.target.value)} icon={<Palette size={16} />} />
            <Input label="قدمت (سال)" placeholder="مثلا: 5" type="number" value={formData.age} onChange={e => handleInputChange("age", e.target.value)} />
          </div>
        </div>

        {/* تصویر */}
        <div className="bg-white rounded-lg p-4 md:p-6 border border-gray-200">
          <h3 className="font-semibold mb-4 text-gray-900">تصویر محصول</h3>
          <ImageUpload onImageSelect={handleImageSelect} label="عکس قالین را انتخاب کنید" maxSize={5} />
          {errors.image && <p className="text-red-500 text-sm mt-1">{errors.image}</p>}
          {image && (
            <div className="relative mt-4 w-32 h-32">
              <img src={image} alt="Preview" className="w-full h-full object-cover rounded-md border border-gray-200" />
              <button type="button" onClick={() => setImage(null)} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1">
                <X size={12} />
              </button>
            </div>
          )}
        </div>

        {/* توضیحات */}
        <div className="bg-white rounded-lg p-4 md:p-6 border border-gray-200">
          <h3 className="font-semibold mb-4 text-gray-900">توضیحات (اختیاری)</h3>
          <Textarea value={formData.description} onChange={v => handleInputChange("description", v)} placeholder="توضیحات کامل درباره محصول" rows={6} error={errors.description} />
        </div>

        <div className="flex gap-4 justify-end">
          <CancelButton size="md" onClick={() => router.back()}>انصراف</CancelButton>
          <SaveButton size="md" type="submit" loading={isSubmitting}>ذخیره محصول</SaveButton>
        </div>
      </form>
    </div>
  );
}
