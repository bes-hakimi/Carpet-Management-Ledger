// src/components/sales/ProductSelection.tsx
"use client";

import { Select } from "@/components/ui/Select";
import { Input } from "@/components/ui/Input";
import { Package, DollarSign, Ruler, Palette, Layers, Hash, Trash2 } from "lucide-react";
import { useState } from "react";
import { AddButton } from "@/components/ui/Button";
import { toast } from "react-hot-toast";

import { useApiGet } from "@/hooks/useApi";
import { PRODUCT } from "@/endpoints/products";
import { ProductType } from "@/types/sales/sales";
import { ContentLoader } from "@/components/loading/DataLoading";

interface SelectedSaleProduct {
  product: ProductType;
  quantity: number;
  salePrice: number;
}

interface ProductSelectionProps {
  saleProducts: SelectedSaleProduct[];
  onSaleProductsChange: (products: SelectedSaleProduct[]) => void;
}

export function ProductSelection({
  saleProducts,
  onSaleProductsChange
}: ProductSelectionProps) {
  const { data: products, isLoading, error } = useApiGet<ProductType[]>("products", PRODUCT.list);

  const [selectedProduct, setSelectedProduct] = useState<ProductType | null>(null);
  const [quantity, setQuantity] = useState<string>("");
  const [salePrice, setSalePrice] = useState<string>("");

  const handleProductSelect = (productId: string) => {
    const product = products?.find(p => p.id.toString() === productId) || null;
    setSelectedProduct(product);
    setQuantity("");
    setSalePrice("");
  };

  const handleQuantityChange = (value: string) => setQuantity(value);
  const handleSalePriceChange = (value: string) => setSalePrice(value);

  const handleAddProduct = () => {
    if (!selectedProduct || !quantity || !salePrice) {
      toast.error("لطفاً تمام فیلدها را پر کنید");
      return;
    }

    const quantityNum = parseInt(quantity);
    const salePriceNum = parseInt(salePrice);

    if (isNaN(quantityNum) || isNaN(salePriceNum) || quantityNum <= 0 || salePriceNum <= 0) {
      toast.error("مقادیر نامعتبر هستند");
      return;
    }

    if (quantityNum > selectedProduct.stock_qty) {
      toast.error(`موجودی کافی نیست! فقط ${selectedProduct.stock_qty} عدد موجود است.`);
      return;
    }

    const existingIndex = saleProducts.findIndex(p => p.product.id === selectedProduct.id);
    const updatedProducts = [...saleProducts];

    if (existingIndex >= 0) {
      updatedProducts[existingIndex].quantity = quantityNum; // جایگزینی تعداد جدید
      updatedProducts[existingIndex].salePrice = salePriceNum; // جایگزینی قیمت جدید
      toast.success("محصول به‌روزرسانی شد");
    } else {
      updatedProducts.push({ product: selectedProduct, quantity: quantityNum, salePrice: salePriceNum });
      toast.success(`${selectedProduct.name} به لیست اضافه شد`);
    }


    onSaleProductsChange(updatedProducts);
    setSelectedProduct(null);
    setQuantity("");
    setSalePrice("");
  };

  const handleRemoveProduct = (productId: number) => {
    onSaleProductsChange(saleProducts.filter(p => p.product.id !== productId));
    toast.success("محصول از لیست حذف شد");
  };

  const InfoCard = ({ title, children, icon }: { title: string; children: React.ReactNode; icon?: React.ReactNode }) => (
    <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
      <h3 className="text-sm font-medium text-gray-500 mb-2 flex items-center">
        {icon}
        {title}
      </h3>
      <div className="text-gray-900">{children}</div>
    </div>
  );

  const calculateTotal = () => saleProducts.reduce((sum, p) => sum + p.salePrice * p.quantity, 0);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center">
       <ContentLoader text="در حال بارگیری محصول"/>
      </div>
    );
  }

  if (error) {
    toast.error("خطا در دریافت محصولات از سرور");
    return (
      <div className="text-center py-8 text-red-500">
        خطا در بارگذاری محصولات
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4 md:p-6">
      <h3 className="text-base font-semibold text-gray-900 mb-4 flex items-center">
        <Package className="ml-2 w-5 h-5" />
        انتخاب جنس‌ها برای فروش
      </h3>

      {/* سه فیلد اصلی برای اضافه کردن محصول */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Select
          label="جنس"
          options={products?.map(p => ({ value: p.id.toString(), label: `${p.name} (موجودی: ${p.stock_qty})` })) || []}
          value={selectedProduct?.id.toString() || ""}
          onChange={handleProductSelect}
          placeholder="محصول را انتخاب کنید"
          searchable
          clearable
          required
        />

        <Input
          label="تعداد"
          type="number"
          value={quantity}
          onChange={(e) => handleQuantityChange(e.target.value)}
          min="1"
          placeholder="لطفا تعداد را وارد کنید"
          max={selectedProduct?.stock_qty?.toString()}
          required
          disabled={!selectedProduct}
        />

        <Input
          label="قیمت فروش"
          type="number"
          value={salePrice}
          onChange={(e) => handleSalePriceChange(e.target.value)}
          min="1"
          required
          placeholder="قیمت فروش را وارد کنید"
          icon={<DollarSign className="w-4 h-4" />}
          disabled={!selectedProduct}
        />

        <div className="flex items-end">
          <AddButton
            type="button"
            onClick={handleAddProduct}
            disabled={!selectedProduct || !quantity.trim() || !salePrice.trim()}
          >
            اضافه کردن
          </AddButton>
        </div>
      </div>

      {/* لیست محصولات انتخاب شده */}
      {saleProducts.length > 0 && (
        <div className="border-t pt-6 mb-6">
          <h4 className="text-base font-semibold text-gray-900 mb-4">جنس‌های انتخاب شده برای فروش:</h4>
          <div className="space-y-3">
            {saleProducts.map(({ product, quantity, salePrice }) => (
              <div key={product.id} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h5 className="font-medium text-gray-900">{product.name}</h5>
                      <button
                        type="button"
                        onClick={() => handleRemoveProduct(product.id)}
                        className="text-red-500 hover:text-red-700 p-1"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <span className="text-gray-500">تعداد:</span>{" "}
                        <span className="font-medium">{quantity} عدد</span>
                      </div>
                      <div>
                        <span className="text-gray-500">قیمت فروش:</span>{" "}
                        <span className="font-medium">{salePrice.toLocaleString()} افغانی</span>
                      </div>
                      <div>
                        <span className="text-gray-500">مجموع:</span>{" "}
                        <span className="font-medium text-green-600">{(salePrice * quantity).toLocaleString()} افغانی</span>
                      </div>
                      <div>
                        <span className="text-gray-500">کد:</span>{" "}
                        <span className="font-medium">{product.slug}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* جمع کل بل */}
          <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <div className="flex justify-between items-center">
              <span className="text-base font-semibold text-blue-900">مجموع کل اجناس:</span>
              <span className="text-base font-bold text-blue-900">{calculateTotal().toLocaleString()} افغانی</span>
            </div>
          </div>
        </div>
      )}

      {/* مشخصات محصول انتخاب شده */}
      {selectedProduct && (
        <div className="border-t pt-6">
          <h4 className="text-md font-semibold text-gray-900 mb-4">مشخصات محصول انتخاب شده:</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <InfoCard title="قیمت خرید" icon={<DollarSign className="ml-2 w-4 h-4 text-blue-600" />}>
              <div className="flex items-center text-blue-600 font-medium">{parseFloat(selectedProduct.main_price).toLocaleString()} افغانی</div>
            </InfoCard>

            <InfoCard title="موجودی" icon={<Package className="ml-2 w-4 h-4 text-green-600" />}>
              {selectedProduct.stock_qty} عدد
            </InfoCard>

            <InfoCard title="کد محصول" icon={<Hash className="ml-2 w-4 h-4 text-gray-600" />}>
              {selectedProduct.slug}
            </InfoCard>

            <InfoCard title="اندازه" icon={<Ruler className="ml-2 w-4 h-4 text-orange-600" />}>
              {selectedProduct.size}
            </InfoCard>

            <InfoCard title="رنگ" icon={<Palette className="ml-2 w-4 h-4 text-purple-600" />}>
              {selectedProduct.main_color}
            </InfoCard>

            <InfoCard title="کیفیت" icon={<Layers className="ml-2 w-4 h-4 text-red-600" />}>
              {selectedProduct.quality}
            </InfoCard>

            <InfoCard title="جنس" icon={<Package className="ml-2 w-4 h-4 text-gray-600" />}>
              {selectedProduct.type}
            </InfoCard>
          </div>
        </div>
      )}

      {!selectedProduct && saleProducts.length === 0 && (
        <div className="text-center py-8 text-gray-500 rounded-lg border border-gray-300">
          <Package className="w-12 h-12 mx-auto mb-4 text-gray-300" />
          <p>لطفاً یک محصول از لیست انتخاب کنید</p>
        </div>
      )}
    </div>
  );
}
