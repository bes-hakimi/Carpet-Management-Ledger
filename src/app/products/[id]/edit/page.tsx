// src/app/products/edit/[id]/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { PageHeader } from "@/components/ui/PageHeader";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Select } from "@/components/ui/Select";
import { ImageUpload } from "@/components/ui/ImageUpload";
import { DollarSign, Ruler, Package, Hash, X, Weight, Layers, Palette, RulerIcon } from "lucide-react";
import { CancelButton, SaveButton } from "@/components/ui/Button";

const carpetTypes = [
    { value: "handmade", label: "قالین دست‌باف" },
    { value: "machine_made", label: "قالین ماشینی" },
    { value: "kilim", label: "کلیم" },
    { value: "gabbeh", label: "گبه" },
    { value: "namad", label: "نمد" },
    { value: "tapestry", label: "تابلوفرش" },
    { value: "silk", label: "قالین ابریشمی" },
    { value: "wool", label: "قالین پشمی" },
];

const carpetSizes = [
    { value: "0.5x1", label: "۰.۵×۱ متر" },
    { value: "1x1.5", label: "۱×۱.۵ متر" },
    { value: "1.5x2", label: "۱.۵×۲ متر" },
    { value: "2x3", label: "۲×۳ متر" },
    { value: "2.5x3.5", label: "۲.۵×۳.۵ متر" },
    { value: "3x4", label: "۳×۴ متر" },
    { value: "4x6", label: "۴×۶ متر" },
    { value: "round", label: "دایره‌ای" },
    { value: "square", label: "مربعی" },
    { value: "custom", label: "سفارشی" },
];

const qualityLevels = [
    { value: "economy", label: "اقتصادی (پایه)" },
    { value: "standard", label: "استاندارد" },
    { value: "premium", label: "پریمیوم" },
    { value: "luxury", label: "لوکس" },
];

const carpetOrigins = [
    { value: "afghan", label: "افغانی" },
    { value: "iranian", label: "ایرانی" },
    { value: "turkish", label: "ترکی" },
    { value: "pakistani", label: "پاکستانی" },
    { value: "indian", label: "هندی" },
    { value: "turkmen", label: "ترکمنی" },
    { value: "azerbaijani", label: "آذربایجانی" },
    { value: "arabic", label: "عربی" },
    { value: "other", label: "سایر" },
];

const materialTypes = [
    { value: "wool", label: "پشم طبیعی" },
    { value: "silk", label: "ابریشم" },
    { value: "cotton", label: "پنبه" },
    { value: "synthetic", label: "الیاف مصنوعی" },
    { value: "mixed", label: "مخلوط" },
    { value: "wool_cotton", label: "پشم و پنبه" },
    { value: "silk_wool", label: "ابریشم و پشم" },
];

const knotDensityOptions = [
    { value: "low", label: "کم (کمتر از ۵۰۰ گره)" },
    { value: "medium", label: "متوسط (۵۰۰-۸۰۰ گره)" },
    { value: "high", label: "بالا (۸۰۰-۱۲۰۰ گره)" },
    { value: "very_high", label: "بسیار بالا (بیشتر از ۱۲۰۰ گره)" },
];

// داده نمونه - در عمل از API می‌آید
const mockProduct = {
    id: "1",
    name: "قالین کاشان دست‌باف",
    code: "CAR001",
    type: "handmade",
    size: "3x4",
    quality: "premium",
    origin: "iranian",
    purchasePrice: 15000,
    salePrice: 22000,
    stock: 5,
    description: "قالین دست‌باف کاشان با طرح لچک ترنج و رنگ‌بندی سنتی. جنس از پنبه مرغوب و پشم طبیعی.",
    images: [],
    // مشخصات فنی جدید
    weight: 12.5,
    thickness: 15.5,
    material: "wool_cotton",
    knotDensity: "high",
    pileHeight: 8.5,
    primaryColor: "قرمز",
    secondaryColor: "آبی",
    pattern: "لچک ترنج",
    age: "2",
    condition: "new"
};

export default function EditProductPage() {
    const params = useParams();
    const router = useRouter();
    const [formData, setFormData] = useState({
        name: "",
        code: "",
        type: "",
        size: "",
        quality: "",
        origin: "",
        customLength: "",
        customWidth: "",
        purchasePrice: "",
        salePrice: "",
        stock: "",
        description: "",
        // مشخصات فنی جدید
        weight: "",
        thickness: "",
        material: "",
        knotDensity: "",
        pileHeight: "",
        primaryColor: "",
        secondaryColor: "",
        pattern: "",
        age: "",
        condition: "new",
    });
    const [images, setImages] = useState<File[]>([]);

    useEffect(() => {
        // در اینجا داده محصول را از API بر اساس ID دریافت می‌کنیم
        console.log("Loading product for edit:", params.id);

        // داده‌های نمونه را تنظیم می‌کنیم
        setFormData({
            name: mockProduct.name,
            code: mockProduct.code,
            type: mockProduct.type,
            size: mockProduct.size,
            quality: mockProduct.quality,
            origin: mockProduct.origin,
            customLength: "",
            customWidth: "",
            purchasePrice: mockProduct.purchasePrice.toString(),
            salePrice: mockProduct.salePrice.toString(),
            stock: mockProduct.stock.toString(),
            description: mockProduct.description,
            // مشخصات فنی
            weight: mockProduct.weight.toString(),
            thickness: mockProduct.thickness.toString(),
            material: mockProduct.material,
            knotDensity: mockProduct.knotDensity,
            pileHeight: mockProduct.pileHeight.toString(),
            primaryColor: mockProduct.primaryColor,
            secondaryColor: mockProduct.secondaryColor,
            pattern: mockProduct.pattern,
            age: mockProduct.age,
            condition: mockProduct.condition,
        });
    }, [params.id]);

    const handleInputChange = (field: string, value: string) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    const handleImageSelect = (url: string | null) => {
        if (!url) return;

        console.log("Selected image URL:", url);
    };


    const removeImage = (index: number) => {
        setImages((prev) => prev.filter((_, i) => i !== index));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const finalSize =
            formData.size === "custom"
                ? `${formData.customLength}x${formData.customWidth}`
                : formData.size;

        const productData = {
            ...formData,
            size: finalSize,
            images,
            purchasePrice: Number(formData.purchasePrice),
            salePrice: Number(formData.salePrice),
            stock: Number(formData.stock),
            weight: formData.weight ? Number(formData.weight) : null,
            thickness: formData.thickness ? Number(formData.thickness) : null,
            pileHeight: formData.pileHeight ? Number(formData.pileHeight) : null,
            age: formData.age ? Number(formData.age) : null,
        };

        console.log("Updated Product Data:", productData);
        alert("محصول با موفقیت ویرایش شد!");
        router.push("/products");
    };

    const handleCancel = () => {
        if (confirm("آیا از انصراف از ویرایش مطمئن هستید؟ تغییرات ذخیره نخواهند شد.")) {
            router.push("/products");
        }
    };

    return (
        <div className="w-full">
            <PageHeader
                title="ویرایش محصول"
                description="اطلاعات قالین را ویرایش کنید"
                backUrl="/products"
            />

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* بخش اطلاعات اصلی */}
                <div className="bg-white rounded-lg p-6 border border-gray-200">
                    <h3 className="font-semibold mb-4 text-gray-900">اطلاعات اصلی</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Input
                            label="نام محصول"
                            value={formData.name}
                            onChange={(e) => handleInputChange("name", e.target.value)}
                            placeholder="نام قالین"
                            required
                        />

                        <Input
                            label="کد محصول"
                            value={formData.code}
                            onChange={(e) => handleInputChange("code", e.target.value)}
                            placeholder="کد یکتا"
                            icon={<Hash size={16} />}
                            required
                        />

                        <Select
                            label="نوع"
                            options={carpetTypes}
                            value={formData.type}
                            onChange={(value) => handleInputChange("type", value)}
                            placeholder="نوع قالین"
                        />

                        <Select
                            label="مبدأ"
                            options={carpetOrigins}
                            value={formData.origin}
                            onChange={(value) => handleInputChange("origin", value)}
                            placeholder="مبدأ قالین"
                        />

                        <Select
                            label="سایز"
                            options={carpetSizes}
                            value={formData.size}
                            onChange={(value) => handleInputChange("size", value)}
                            placeholder="سایز قالین"
                        />

                        <Select
                            label="کیفیت"
                            options={qualityLevels}
                            value={formData.quality}
                            onChange={(value) => handleInputChange("quality", value)}
                            placeholder="کیفیت"
                        />

                        {/* نمایش فیلدهای سفارشی در صورت انتخاب "سفارشی" */}
                        {formData.size === "custom" && (
                            <div className="grid grid-cols-2 gap-4 col-span-2">
                                <Input
                                    label="طول (متر)"
                                    type="number"
                                    step="0.1"
                                    value={formData.customLength}
                                    onChange={(e) => handleInputChange("customLength", e.target.value)}
                                    placeholder="مثلاً ۲.۴"
                                    icon={<Ruler size={16} />}
                                    required
                                />
                                <Input
                                    label="عرض (متر)"
                                    type="number"
                                    step="0.1"
                                    value={formData.customWidth}
                                    onChange={(e) => handleInputChange("customWidth", e.target.value)}
                                    placeholder="مثلاً ۳.۲"
                                    icon={<Ruler size={16} />}
                                    required
                                />
                            </div>
                        )}

                        <Input
                            label="تعداد موجودی"
                            type="number"
                            value={formData.stock}
                            onChange={(e) => handleInputChange("stock", e.target.value)}
                            placeholder="0"
                            icon={<Package size={16} />}
                            required
                        />
                    </div>
                </div>

                {/* بخش مشخصات فنی */}
                <div className="bg-white rounded-lg p-6 border border-gray-200">
                    <h3 className="font-semibold mb-4 text-gray-900">مشخصات فنی</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        <Select
                            label="جنس مواد اولیه"
                            options={materialTypes}
                            value={formData.material}
                            onChange={(value) => handleInputChange("material", value)}
                            placeholder="جنس قالین"
                        />

                        <Select
                            label="تراکم گره"
                            options={knotDensityOptions}
                            value={formData.knotDensity}
                            onChange={(value) => handleInputChange("knotDensity", value)}
                            placeholder="تراکم گره"
                        />

                        <Input
                            label="وزن (کیلوگرم)"
                            type="number"
                            step="0.1"
                            value={formData.weight}
                            onChange={(e) => handleInputChange("weight", e.target.value)}
                            placeholder="مثلاً ۱۲.۵"
                            icon={<Weight size={16} />}
                        />

                        <Input
                            label="ضخامت (میلی‌متر)"
                            type="number"
                            step="0.1"
                            value={formData.thickness}
                            onChange={(e) => handleInputChange("thickness", e.target.value)}
                            placeholder="مثلاً ۱۵.۵"
                            icon={<Layers size={16} />}
                        />

                        <Input
                            label="ارتفاع پرز (میلی‌متر)"
                            type="number"
                            step="0.1"
                            value={formData.pileHeight}
                            onChange={(e) => handleInputChange("pileHeight", e.target.value)}
                            placeholder="مثلاً ۸.۵"
                            icon={<RulerIcon size={16} />}
                        />

                        <Input
                            label="رنگ اصلی"
                            value={formData.primaryColor}
                            onChange={(e) => handleInputChange("primaryColor", e.target.value)}
                            placeholder="مثلاً قرمز"
                            icon={<Palette size={16} />}
                        />

                        <Input
                            label="رنگ فرعی"
                            value={formData.secondaryColor}
                            onChange={(e) => handleInputChange("secondaryColor", e.target.value)}
                            placeholder="مثلاً آبی"
                            icon={<Palette size={16} />}
                        />

                        <Input
                            label="طرح"
                            value={formData.pattern}
                            onChange={(e) => handleInputChange("pattern", e.target.value)}
                            placeholder="مثلاً لچک ترنج"
                        />

                        <Input
                            label="قدمت (سال)"
                            type="number"
                            value={formData.age}
                            onChange={(e) => handleInputChange("age", e.target.value)}
                            placeholder="برای قالین‌های دست‌باف"
                        />

                        <Select
                            label="وضعیت"
                            options={[
                                { value: "new", label: "نو" },
                                { value: "like_new", label: "در حد نو" },
                                { value: "used", label: "دست دوم" },
                                { value: "antique", label: "عتیقه" },
                            ]}
                            value={formData.condition}
                            onChange={(value) => handleInputChange("condition", value)}
                            placeholder="وضعیت قالین"
                        />
                    </div>
                </div>

                {/* بخش قیمت‌گذاری */}
                <div className="bg-white rounded-lg p-6 border border-gray-200">
                    <h3 className="font-semibold mb-4 text-gray-900">قیمت‌گذاری</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Input
                            label="قیمت خرید (افغانی)"
                            type="number"
                            value={formData.purchasePrice}
                            onChange={(e) => handleInputChange("purchasePrice", e.target.value)}
                            placeholder="قیمت خرید"
                            icon={<DollarSign size={16} />}
                            required
                        />

                        <Input
                            label="قیمت فروش (افغانی)"
                            type="number"
                            value={formData.salePrice}
                            onChange={(e) => handleInputChange("salePrice", e.target.value)}
                            placeholder="قیمت فروش"
                            icon={<DollarSign size={16} />}
                            required
                        />
                    </div>
                </div>

                {/* بخش تصاویر */}
                <div className="bg-white rounded-lg p-6 border border-gray-200">
                    <h3 className="font-semibold mb-4 text-gray-900">تصاویر محصول</h3>
                    <ImageUpload
                        onImageSelect={handleImageSelect}
                        label="عکس جدید اضافه کنید"
                        maxSize={5}
                    />

                    {images.length > 0 && (
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                            {images.map((image, index) => (
                                <div key={index} className="relative group">
                                    <img
                                        src={URL.createObjectURL(image)}
                                        alt={`Preview ${index + 1}`}
                                        className="w-full h-24 object-cover rounded-md border border-gray-200"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => removeImage(index)}
                                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                        <X size={12} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* توضیحات */}
                <div className="bg-white rounded-lg p-6 border border-gray-200">
                    <h3 className="font-semibold mb-4 text-gray-900">توضیحات</h3>
                    <Textarea
                        value={formData.description}
                        onChange={(value) => handleInputChange("description", value)}
                        placeholder="توضیحات کامل درباره قالین (جنس، رنگ، طرح، ویژگی‌های خاص و ...)"
                        rows={6}
                    />
                </div>

                {/* دکمه‌ها */}
                <div className="flex gap-4 justify-end">
                    <CancelButton
                        size="md"
                        onClick={handleCancel}
                    >
                        انصراف
                    </CancelButton>

                    <SaveButton
                        size="md"
                        type="submit"
                    >
                        ذخیره تغییرات
                    </SaveButton>
                </div>
            </form>
        </div>
    );
}