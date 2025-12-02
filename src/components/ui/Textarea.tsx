// src/components/ui/Textarea.tsx
interface TextareaProps {
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  rows?: number;
  label?: string;
  disabled?: boolean;
  error?: string;
  required?: boolean;
}

export function Textarea({
  value,
  onChange,
  placeholder,
  rows = 3,
  label,
  disabled = false,
  error,
  required = false,
}: TextareaProps) {
  return (
    <div className="w-full flex flex-col space-y-1">
      {label && (
        <label
          className={`text-sm font-medium ${
            error ? "text-red-600" : "text-gray-600"
          }`}
        >
          {label}
          {required && <span className="text-red-500 mr-1">*</span>}
        </label>
      )}

      <textarea
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        placeholder={placeholder}
        rows={rows}
        disabled={disabled}
        className={`w-full px-3 py-2 rounded-md ring-1 ring-gray-300 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all resize-none ${
          disabled ? "bg-gray-100 cursor-not-allowed" : ""
        } ${error ? "ring-red-500 focus:ring-red-500" : ""}`}
      />

      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  );
}
