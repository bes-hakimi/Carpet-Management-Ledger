// src/components/ui/Input.tsx
import { cn } from "@/utils/utils";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string;
  label?: string;
  icon?: React.ReactNode;
  required?: boolean;
}

export const Input = ({
  label,
  error,
  icon,
  required = false,
  className,
  ...props
}: InputProps) => {
  return (
    <div className="w-full flex flex-col space-y-1">
      {label && (
        <label
          className={cn(
            "text-sm font-medium",
            error ? "text-red-600" : "text-gray-600"
          )}
        >
          {label}
          {required && <span className="text-red-500 mr-1">*</span>}
        </label>
      )}

      <div className="relative">
        {icon && (
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-primary-500">
            {icon}
          </span>
        )}
        <input
          {...props}
          className={cn(
            "w-full rounded-md ring-1 ring-gray-300 px-3 py-2 text-sm text-gray-900",
            "placeholder:text-gray-400",
            "focus:ring-2 focus:ring-primary-500 outline-none transition-all duration-150",
            icon && "pl-10",
            error && "ring-red-500 focus:ring-red-500",
            className
          )}
        />
      </div>

      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  );
};
