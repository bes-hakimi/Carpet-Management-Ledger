// src/components/ui/Switch.tsx
"use client";

import { useState, useEffect } from "react";
import { cn } from "@/utils/utils";

interface SwitchProps {
  checked?: boolean;
  onChange?: (checked: boolean) => void;
  disabled?: boolean;
  size?: "sm" | "md" | "lg";
  label?: string;
  labelPosition?: "left" | "right";
}

export function Switch({
  checked = false,
  onChange,
  disabled = false,
  size = "md",
  label,
  labelPosition = "right"
}: SwitchProps) {
  const [isChecked, setIsChecked] = useState(checked);

  useEffect(() => {
    setIsChecked(checked);
  }, [checked]);

  const handleToggle = () => {
    if (disabled) return;
    const newValue = !isChecked;
    setIsChecked(newValue);
    onChange?.(newValue);
  };

  const sizes = {
    sm: "w-10 h-6",
    md: "w-15 h-7", 
    lg: "w-16 h-8"
  };

  const thumbSizes = {
    sm: "w-4 h-4",
    md: "w-5 h-5",
    lg: "w-6 h-6"
  };

  const thumbPositions = {
    sm: isChecked ? "translate-x-4" : "translate-x-0",
    md: isChecked ? "translate-x-7" : "-translate-x-2",
    lg: isChecked ? "translate-x-7" : "-translate-x-1"
  };

  return (
    <div className={cn(
      "flex items-center gap-3",
      labelPosition === "left" && "flex-row-reverse"
    )}>
      {label && (
        <span className={cn(
          "text-sm font-medium",
          disabled ? "text-gray-400" : "text-gray-700"
        )}>
          {label}
        </span>
      )}
      
      <button
        type="button"
        role="switch"
        aria-checked={isChecked}
        disabled={disabled}
        onClick={handleToggle}
        className={cn(
          "relative rounded-full transition-all duration-200 focus:outline-none",
          sizes[size],
          isChecked ? "bg-primary-500" : "bg-gray-300",
          disabled && "opacity-50 cursor-not-allowed",
          !disabled && "cursor-pointer"
        )}
      >
        <span
          className={cn(
            "absolute top-1/2 transform -translate-y-1/2 rounded-full bg-white shadow-lg transition-all duration-200",
            thumbSizes[size],
            thumbPositions[size]
          )}
        />
      </button>
    </div>
  );
}