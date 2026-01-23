"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Eye, X } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface GuestLoginButtonProps {
    onGuestLogin: (email: string, password: string) => void;
    isLoading?: boolean;
}

export default function GuestLoginButton({
    onGuestLogin,
    isLoading = false,
}: GuestLoginButtonProps) {
    const [open, setOpen] = useState(false);

    const GUEST_EMAIL =
        process.env.NEXT_PUBLIC_GUEST_EMAIL || "";

    const GUEST_PASSWORD =
        process.env.NEXT_PUBLIC_GUEST_PASSWORD || "";

    return (
        <>
            {/* Floating Button */}
            <Button
                icon={<Eye className="w-4 h-4" />}
                size="sm"
                className="fixed bottom-6 right-6 z-40"
                onClick={() => setOpen(true)}
            >
                بازدیدکننده | Guest
            </Button>

            {/* Modal */}
            <AnimatePresence>
                {open && (
                    <>
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 0.4 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 z-50 bg-black"
                            onClick={() => setOpen(false)}
                        />

                        {/* Modal Box */}
                        <motion.div
                            initial={{ opacity: 0, y: 20, scale: 0.96 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 20, scale: 0.96 }}
                            transition={{ duration: 0.25 }}
                            className="fixed bottom-6 right-6 z-50 w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl border border-gray-200"
                        >
                            {/* Header */}
                            <div className="flex items-center justify-between mb-3">
                                <h3 className="text-base font-semibold text-gray-900">
                                    ورود به‌عنوان بازدیدکننده
                                    <span className="block text-xs text-gray-500 font-normal">
                                        Guest Access
                                    </span>
                                </h3>

                                <Button
                                    variant="ghost"
                                    size="md"
                                    icon={<X className="w-4 h-4" />}
                                    iconPosition="only"
                                    onClick={() => setOpen(false)}
                                />
                            </div>

                            {/* Content */}
                            <p className="text-sm text-gray-600 mb-5">
                                این حساب نمایشی است و فقط برای تست امکانات سیستم استفاده می‌شود.
                                <br />
                                <span className="text-sm text-gray-500" dir="ltr">
                                    Demo guest account with isolated data for feature testing.
                                </span>
                            </p>


                            {/* Action */}
                            <Button
                                fullWidth
                                loading={isLoading}
                                className="text-nowrap"
                                // icon={<Eye className="w-4 h-4" />}
                                onClick={() => {
                                    onGuestLogin(GUEST_EMAIL, GUEST_PASSWORD);
                                    setOpen(false);
                                }}
                            >
                               ورود به عنوان بازدیدکننده | Login as Guest
                            </Button>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    );
}
