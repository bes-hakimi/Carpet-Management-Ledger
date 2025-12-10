// src/components/ui/Card.tsx
import { cn } from "@/utils/utils";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  footer?: React.ReactNode;
}

export const Card = ({ children, className }: CardProps) => (
  <div className={cn("bg-white border border-custom rounded-md p-2 md:p-4 transition-all shadow-lg shadow-custom ", className)}>
    <div>{children}</div>
  </div>
);
