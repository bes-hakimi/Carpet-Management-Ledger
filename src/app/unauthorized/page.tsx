"use client";

import { Button, PrevButton } from "@/components/ui/Button";
import { motion } from "framer-motion";
import { Shield, LayoutDashboard, AlertTriangle } from "lucide-react";
import { useRouter } from "next/navigation";

export default function UnauthorizedPage() {
    const router = useRouter();

    return (
        <div className="h-full bg-gradient-to-br from-gray-50 to-primary-50/30 flex items-center justify-center p-4">
            <div className="max-w-2xl w-full">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-6"
                >
                    <div className="flex justify-center mb-6">
                        <div className="relative">
                            {/* Animated background circle */}
                            <motion.div
                                animate={{
                                    scale: [1, 1.1, 1],
                                    opacity: [0.1, 0.2, 0.1],
                                }}
                                transition={{
                                    duration: 4,
                                    repeat: Infinity,
                                    ease: "easeInOut",
                                }}
                                className="absolute inset-0 bg-primary-500 rounded-full blur-xl"
                            />

                            {/* Main icon */}
                            <motion.div
                                whileHover={{ scale: 1.05 }}
                                className="relative bg-white p-6 rounded-2xl shadow-2xl border border-primary-100"
                            >
                                <div className="relative">
                                    <Shield className="w-16 h-16 text-primary-500 mx-auto" />
                                    <motion.div
                                        initial={{ scale: 0, opacity: 0 }}
                                        animate={{ scale: 1, opacity: 1 }}
                                        transition={{ delay: 0.5, duration: 0.5 }}
                                        className="absolute -top-1 -right-1"
                                    >
                                        <AlertTriangle className="w-6 h-6 text-amber-500" />
                                    </motion.div>
                                </div>
                            </motion.div>
                        </div>
                    </div>

                    <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                        دسترسی غیر مجاز!
                    </h1>

                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3, duration: 0.6 }}
                        className="text-xl text-gray-600 leading-relaxed max-w-2xl mx-auto"
                    >
                        متأسفانه شما دسترسی لازم برای مشاهده این صفحه را ندارید.
                        این به دلیل اعمال محدودیت‌های سطح دسترسی است.
                    </motion.p>
                </motion.div>

                {/* Action Buttons */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6, duration: 0.6 }}
                    className="flex flex-col sm:flex-row gap-4 justify-center items-center"
                >

                    <PrevButton
                        onClick={() => router.back()}
                        variant="outline"
                        size="md"
                        className="hover:bg-primary-50 hover:text-primary-600"
                    >
                        بازگشت به صفحه قبلی
                    </PrevButton>

                    <Button
                        onClick={() => router.push("/")}
                        variant="primary"
                        size="md"
                        icon={<LayoutDashboard/>}
                    >
                        بازگشت به داشبورد
                    </Button>
                </motion.div>

                {/* Help Text */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8, duration: 0.6 }}
                    className="text-center mt-8"
                >
                    <p className="text-gray-500 text-sm">
                        اگر فکر می‌کنید این یک خطاست، لطفاً با پشتیبانی تماس بگیرید
                    </p>
                    <motion.div
                        animate={{ opacity: [0.5, 1, 0.5] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="mt-2"
                    >
                        <span className="text-primary-500 font-medium">کد خطا: 403_UNAUTHORIZED</span>
                    </motion.div>
                </motion.div>

                {/* Background Decorations */}
                <div className="absolute inset-0 overflow-hidden -z-10">
                    <motion.div
                        animate={{
                            x: [0, 100, 0],
                            y: [0, -50, 0],
                        }}
                        transition={{
                            duration: 20,
                            repeat: Infinity,
                            ease: "linear",
                        }}
                        className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary-200/20 rounded-full blur-3xl"
                    />
                    <motion.div
                        animate={{
                            x: [0, -100, 0],
                            y: [0, 50, 0],
                        }}
                        transition={{
                            duration: 15,
                            repeat: Infinity,
                            ease: "linear",
                        }}
                        className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-200/15 rounded-full blur-3xl"
                    />
                </div>
            </div>
        </div>
    );
}