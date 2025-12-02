// src/components/ui/Search.tsx
import { Search as SearchIcon } from "lucide-react";

interface SearchProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export function Search({ value, onChange, placeholder = "جستجو..." }: SearchProps) {
  return (
    <div className="relative">
      <SearchIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full sm:w-64 pl-4 pr-10 py-2 text-sm  ring ring-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 transition-colors"
      />
    </div>
  );
}