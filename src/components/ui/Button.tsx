"use client";

import { cn } from "@/utils/utils";
import { Loader2, Check, Plus, Edit, Trash2, Eye, Download, Upload, Search, Filter, ChevronRight, ChevronLeft, X, Printer } from "lucide-react";
import { motion, HTMLMotionProps } from "framer-motion";
import React from "react";

type ButtonVariant =
    | "primary"
    | "secondary"
    | "outline"
    | "ghost"
    | "destructive"
    | "success"
    | "warning";

type ButtonSize = "xs" | "sm" | "md" | "lg" | "xl";

type ButtonIconPosition = "left" | "right" | "only";

interface ButtonProps extends Omit<HTMLMotionProps<"button">, "ref" | "children"> {
    variant?: ButtonVariant;
    size?: ButtonSize;
    loading?: boolean;
    loadingText?: string;
    icon?: React.ReactNode;
    iconPosition?: ButtonIconPosition;
    success?: boolean;
    disabled?: boolean;
    fullWidth?: boolean;
    pulse?: boolean;
    children?: React.ReactNode;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    (
        {
            children,
            className,
            variant = "primary",
            size = "md",
            loading = false,
            loadingText = "در حال پردازش...",
            icon,
            iconPosition = "left",
            success = false,
            disabled = false,
            fullWidth = false,
            pulse = false,
            ...props
        },
        ref
    ) => {
        const baseStyles =
            "inline-flex items-center justify-center font-medium rounded-md transition-all duration-300 ease-out focus:outline-none focus:ring-4 disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden group";

        const variants = {
            primary: "bg-gradient-to-r from-primary-500 to-cyan-500 text-white hover:from-primary-600 hover:to-cyan-600 focus:ring-primary-200 shadow-lg hover:shadow-xl",
            secondary: "bg-gradient-to-r from-gray-600 to-gray-700 text-white hover:from-gray-700 hover:to-gray-800 focus:ring-gray-200 shadow-md hover:shadow-lg",
            outline: "border-2 border-primary-500 text-primary-600 hover:bg-primary-500 hover:text-white focus:ring-primary-200 bg-transparent",
            ghost: "text-gray-600 hover:bg-gray-100 hover:text-gray-800 focus:ring-gray-200 bg-transparent",
            destructive: "bg-gradient-to-r from-red-500 to-pink-500 text-white hover:from-red-600 hover:to-pink-600 focus:ring-red-200 shadow-lg hover:shadow-xl",
            success: "bg-gradient-to-r from-green-500 to-emerald-500 text-white hover:from-green-600 hover:to-emerald-600 focus:ring-green-200 shadow-lg hover:shadow-xl",
            warning: "bg-gradient-to-r from-amber-500 to-orange-500 text-white hover:from-amber-600 hover:to-orange-600 focus:ring-amber-200 shadow-lg hover:shadow-xl"
        };

        const sizes = {
            xs: "px-2 py-0.5 text-xs gap-1.5",
            sm: "px-3 py-1 text-sm gap-2",
            md: "px-2 py-1  md:px-4 md:py-1.5 text-sm md:text-base gap-1.5 md:gap-2.5",
            lg: "px-5 py-2 text-lg gap-3",
            xl: "px-6 py-2.5 text-xl gap-3.5"
        };

        const iconSizes = {
            xs: "w-3 h-3",
            sm: "w-4 h-4",
            md: "w-5 h-5",
            lg: "w-6 h-6",
            xl: "w-7 h-7"
        };

        const getStatusIcon = () => {
            if (success) return <Check className={iconSizes[size]} />;
            if (loading) return <Loader2 className={`${iconSizes[size]} animate-spin`} />;
            return icon;
        };

        const getContent = () => {
            const statusIcon = getStatusIcon();
            const showIcon = statusIcon || icon;
            const isIconOnly = iconPosition === "only" || !children;

            if (loading) {
                return (
                    <>
                        <Loader2 className={`${iconSizes[size]} animate-spin ml-1`} />
                        {loadingText && <span>{loadingText}</span>}
                    </>
                );
            }

            if (success) {
                return (
                    <>
                        <Check className={iconSizes[size]} />
                        {children && <span>انجام شد</span>}
                    </>
                );
            }

            if (isIconOnly && showIcon) {
                return showIcon;
            }

            const content = (
                <>
                    {showIcon && iconPosition === "left" && (
                        <span className="shrink-0">{showIcon}</span>
                    )}
                    {children && <span className={cn(showIcon && (iconPosition === "left" ? "mr-1" : "ml-1"))}>{children}</span>}
                    {showIcon && iconPosition === "right" && (
                        <span className="shrink-0">{showIcon}</span>
                    )}
                </>
            );

            return content;
        };

        return (
            <motion.button
                ref={ref}
                whileTap={{ scale: loading || disabled ? 1 : 0.95 }}
                whileHover={{
                    scale: loading || disabled ? 1 : 1.02,
                    transition: { duration: 0.2 }
                }}
                className={cn(
                    baseStyles,
                    variants[variant],
                    sizes[size],
                    fullWidth && "w-full",
                    pulse && !loading && "animate-pulse",
                    className
                )}
                disabled={disabled || loading}
                {...props}
            >
                {/* Animated background gradient */}
                <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                {/* Ripple effect */}
                <div className="absolute inset-0 overflow-hidden rounded-xl">
                    <div className="absolute inset-0 bg-white/0 group-hover:bg-white/10 transition-colors duration-300" />
                </div>

                {/* Content */}
                <div className={cn(
                    "flex items-center justify-center relative z-10 transition-all duration-200",
                    loading && "opacity-90",
                    success && "text-white"
                )}>
                    {getContent()}
                </div>

                {/* Success animation */}
                {success && (
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute inset-0 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl"
                    />
                )}
            </motion.button>
        );
    }
);

Button.displayName = "Button";

// Pre-styled button components for common use cases
export const PrimaryButton = React.forwardRef<HTMLButtonElement, Omit<ButtonProps, 'variant'>>(
    (props, ref) => <Button ref={ref} variant="primary" {...props} />
);
PrimaryButton.displayName = "PrimaryButton";

export const SecondaryButton = React.forwardRef<HTMLButtonElement, Omit<ButtonProps, 'variant'>>(
    (props, ref) => <Button ref={ref} variant="secondary" {...props} />
);
SecondaryButton.displayName = "SecondaryButton";

export const OutlineButton = React.forwardRef<HTMLButtonElement, Omit<ButtonProps, 'variant'>>(
    (props, ref) => <Button ref={ref} variant="outline" {...props} />
);
OutlineButton.displayName = "OutlineButton";

export const DestructiveButton = React.forwardRef<HTMLButtonElement, Omit<ButtonProps, 'variant'>>(
    (props, ref) => <Button ref={ref} variant="destructive" {...props} />
);
DestructiveButton.displayName = "DestructiveButton";

export const SuccessButton = React.forwardRef<HTMLButtonElement, Omit<ButtonProps, 'variant'>>(
    (props, ref) => <Button ref={ref} variant="success" {...props} />
);
SuccessButton.displayName = "SuccessButton";

// Common action buttons
export const AddButton = React.forwardRef<HTMLButtonElement, Omit<ButtonProps, 'icon'>>(
    (props, ref) => <Button ref={ref} icon={<Plus className="w-4 h-4" />} {...props} />
);
AddButton.displayName = "AddButton";

export const SaveButton = React.forwardRef<HTMLButtonElement, Omit<ButtonProps, 'icon'>>(
    (props, ref) => <Button ref={ref} icon={<Check className="w-4 h-4" />} variant="primary" {...props} />
);
SaveButton.displayName = "SaveButton";

export const EditButton = React.forwardRef<HTMLButtonElement, Omit<ButtonProps, 'icon'>>(
    (props, ref) => <Button ref={ref} icon={<Edit className="w-4 h-4" />} variant="outline" {...props} />
);
EditButton.displayName = "EditButton";

export const DeleteButton = React.forwardRef<HTMLButtonElement, Omit<ButtonProps, 'icon'>>(
    (props, ref) => <Button ref={ref} icon={<Trash2 className="w-4 h-4" />} variant="destructive" {...props} />
);
DeleteButton.displayName = "DeleteButton";

export const ViewButton = React.forwardRef<HTMLButtonElement, Omit<ButtonProps, 'icon'>>(
    (props, ref) => <Button ref={ref} icon={<Eye className="w-4 h-4" />} variant="ghost" {...props} />
);
ViewButton.displayName = "ViewButton";

export const CancelButton = React.forwardRef<HTMLButtonElement, Omit<ButtonProps, 'icon'>>(
    (props, ref) => <Button ref={ref} icon={<X className="w-4 h-4" />} variant="outline" {...props} />
);
CancelButton.displayName = "CancelButton";

export const DownloadButton = React.forwardRef<HTMLButtonElement, Omit<ButtonProps, 'icon'>>(
    (props, ref) => <Button ref={ref} icon={<Download className="w-4 h-4" />} variant="outline" {...props} />
);
DownloadButton.displayName = "DownloadButton";

export const UploadButton = React.forwardRef<HTMLButtonElement, Omit<ButtonProps, 'icon'>>(
    (props, ref) => <Button ref={ref} icon={<Upload className="w-4 h-4" />} variant="outline" {...props} />
);
UploadButton.displayName = "UploadButton";

export const PrintButton = React.forwardRef<HTMLButtonElement, Omit<ButtonProps, 'icon'>>(
    (props, ref) => <Button ref={ref} icon={<Printer className="w-4 h-4" />} variant="outline" {...props} />
);
PrintButton.displayName = "PrintButton";

export const SearchButton = React.forwardRef<HTMLButtonElement, Omit<ButtonProps, 'icon'>>(
    (props, ref) => <Button ref={ref} icon={<Search className="w-4 h-4" />} variant="ghost" {...props} />
);
SearchButton.displayName = "SearchButton";

export const FilterButton = React.forwardRef<HTMLButtonElement, Omit<ButtonProps, 'icon'>>(
    (props, ref) => <Button ref={ref} icon={<Filter className="w-4 h-4" />} variant="ghost" {...props} />
);
FilterButton.displayName = "FilterButton";

// Navigation buttons
export const NextButton = React.forwardRef<HTMLButtonElement, Omit<ButtonProps, 'icon'>>(
    (props, ref) => <Button ref={ref} icon={<ChevronLeft className="w-4 h-4" />} iconPosition="right" {...props} />
);
NextButton.displayName = "NextButton";

export const PrevButton = React.forwardRef<HTMLButtonElement, Omit<ButtonProps, 'icon'>>(
    (props, ref) => <Button ref={ref} icon={<ChevronRight className="w-4 h-4" />} {...props} />
);
PrevButton.displayName = "PrevButton";

export { Button };