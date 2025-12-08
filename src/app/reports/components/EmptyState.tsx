//EmptyState.tsx
"use client";

import { Card } from "@/components/ui/Card";

interface EmptyStateProps {
    title?: string;
    description?: string;
    icon?: React.ComponentType<React.SVGProps<SVGSVGElement>>;
}

export default function EmptyState({
    title = "هیچ دیتایی موجود نیست",
    description = "برای مشاهده اطلاعات، باید دیتایی ثبت شود.",
    icon: Icon,
}: EmptyStateProps) {
    return (
        <Card className="p-3 md:p-6 border-0 shadow-none text-center flex flex-col items-center justify-center">
            {Icon &&
                <div className="flex justify-center">
                    <Icon className="w-12 h-12 mb-4 text-gray-400" />
                </div>
            }
            <p className="font-semibold text-lg text-gray-900 mb-1">{title}</p>
            <p className="text-gray-500 text-sm">{description}</p>
        </Card>
    );
}
