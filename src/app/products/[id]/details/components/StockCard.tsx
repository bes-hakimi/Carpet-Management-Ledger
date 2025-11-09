// src/components/ui/StockCard.tsx
import React from "react";
import { Package } from "lucide-react";

interface StockCardProps {
  stock: number;
}

export default function StockCard({ stock }: StockCardProps) {
  const bgColor = stock === 0 ? "bg-red-50" : stock < 3 ? "bg-amber-50" : "bg-green-50";
  const textColor = stock === 0 ? "text-red-600" : stock < 3 ? "text-amber-600" : "text-green-600";

  return (
    <div className={`flex items-center gap-3 p-3 rounded-lg ${bgColor}`}>
      <Package size={20} className={textColor.replace("-600","-500")} />
      <div>
        <div className="text-sm text-gray-600">موجودی</div>
        <div className={`font-medium ${textColor}`}>{stock} عدد</div>
      </div>
    </div>
  );
}
