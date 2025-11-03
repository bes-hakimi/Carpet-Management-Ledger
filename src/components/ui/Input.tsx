// src/components/ui/Input.tsx
import { cn } from "@/utils/utils";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string;
  label?: string;
  icon?: React.ReactNode;
}

export const Input = ({ label, error, icon, className, ...props }: InputProps) => {
  return (
    <div className="w-full flex flex-col space-y-1">
      {label && (
        <label className="text-sm font-medium text-gray-600">{label}</label>
      )}
      <div className="relative">
        {icon && (
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-teal-500">
            {icon}
          </span>
        )}
        <input
          {...props}
          className={cn(
            "w-full rounded-md ring ring-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-teal-500 outline-none transition-all",
            icon && "pl-10",
            error && "border-error focus:ring-red-500", 
            className
          )}
        />

      </div>
      {error && <p className="text-xs text-red-500 text-error mt-1">{error}</p>}
    </div>
  );
};
